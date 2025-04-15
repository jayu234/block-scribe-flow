
/**
 * Utility functions for working with BlockNote editor
 */

// Simple function to convert editor JSON to Markdown
// This is a simplified version - in a production app, 
// you would use a more comprehensive markdown converter
export function editorContentToMarkdown(content: any): string {
  try {
    if (typeof content === "string") {
      try {
        content = JSON.parse(content);
      } catch {
        return content;
      }
    }

    if (!content || !Array.isArray(content)) {
      return "";
    }

    return content
      .map((block: any) => {
        switch (block.type) {
          case "paragraph":
            return blockContentToText(block.content) + "\n\n";
          
          case "heading":
            const level = block.props?.level || 1;
            const prefix = "#".repeat(level);
            return `${prefix} ${blockContentToText(block.content)}\n\n`;
          
          case "bulletListItem":
            return `- ${blockContentToText(block.content)}\n`;
          
          case "numberedListItem":
            return `1. ${blockContentToText(block.content)}\n`;
          
          case "checkListItem":
            const checked = block.props?.checked ? "[x]" : "[ ]";
            return `- ${checked} ${blockContentToText(block.content)}\n`;
          
          case "quote":
            if (Array.isArray(block.content)) {
              return block.content
                .map((b: any) => `> ${blockContentToText(b.content)}`)
                .join("\n") + "\n\n";
            }
            return `> ${blockContentToText(block.content)}\n\n`;
          
          case "codeBlock":
            const language = block.props?.language || "";
            return "```" + language + "\n" + 
                   blockContentToText(block.content) + 
                   "\n```\n\n";
          
          default:
            return blockContentToText(block.content) + "\n\n";
        }
      })
      .join("")
      .trim();
  } catch (error) {
    console.error("Error converting to markdown:", error);
    return "";
  }
}

// Helper function to extract text from block content
function blockContentToText(content: any): string {
  if (!content) return "";
  
  if (typeof content === "string") return content;
  
  if (Array.isArray(content)) {
    return content
      .map((item: any) => {
        if (typeof item === "string") return item;
        if (item.type === "text") return item.text || "";
        if (item.type === "link") return item.url || "";
        if (item.content) return blockContentToText(item.content);
        return "";
      })
      .join("");
  }
  
  return "";
}

// Simple function to convert Markdown to editor blocks
// This is a simplified version - in a production app,
// you would use a more comprehensive markdown parser
export function markdownToEditorContent(markdown: string): any[] {
  if (!markdown) return [];
  
  const lines = markdown.split("\n");
  const blocks: any[] = [];
  let currentBlock: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Heading
    if (line.startsWith("#")) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const text = line.replace(/^#+\s+/, "");
      blocks.push({
        type: "heading",
        props: { level },
        content: [{ type: "text", text, styles: {} }]
      });
      continue;
    }
    
    // Bullet list
    if (line.match(/^\s*-\s+(?!\[\s?\])/)) {
      const text = line.replace(/^\s*-\s+/, "");
      blocks.push({
        type: "bulletListItem",
        content: [{ type: "text", text, styles: {} }]
      });
      continue;
    }
    
    // Numbered list
    if (line.match(/^\s*\d+\.\s+/)) {
      const text = line.replace(/^\s*\d+\.\s+/, "");
      blocks.push({
        type: "numberedListItem",
        content: [{ type: "text", text, styles: {} }]
      });
      continue;
    }
    
    // Checkbox
    if (line.match(/^\s*-\s+\[\s?\]\s+/)) {
      const checked = line.includes("[x]");
      const text = line.replace(/^\s*-\s+\[\s*x?\s*\]\s+/, "");
      blocks.push({
        type: "checkListItem",
        props: { checked },
        content: [{ type: "text", text, styles: {} }]
      });
      continue;
    }
    
    // Quote
    if (line.startsWith(">")) {
      const text = line.replace(/^\s*>\s*/, "");
      blocks.push({
        type: "quote",
        content: [{
          type: "paragraph",
          content: [{ type: "text", text, styles: {} }]
        }]
      });
      continue;
    }
    
    // Empty line
    if (line.trim() === "") {
      continue;
    }
    
    // Default: paragraph
    blocks.push({
      type: "paragraph",
      content: [{ type: "text", text: line, styles: {} }]
    });
  }
  
  return blocks;
}

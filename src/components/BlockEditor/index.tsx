import { useState, useCallback, useEffect } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { 
  BlockNoteViewRaw as BlockNoteView, 
  useBlockNote,
  getDefaultReactSlashMenuItems
} from "@blocknote/react";
import "@blocknote/core/style.css";
import "./editor.css";
import { cn } from "@/lib/utils";
import { SlashMenu } from "./SlashMenu";
import { EditorToolbar } from "./EditorToolbar";
import { editorContentToMarkdown, markdownToEditorContent } from "./utils";

export interface BlockEditorProps {
  initialContent?: string;
  onChange?: (markdown: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

// Create a custom theme that doesn't use the SideMenu component
const theme = {
  // Using a simple theme string as the library doesn't export lightDefaultTheme
  // We'll use a simple theme configuration that's compatible with BlockNoteViewRaw
  colors: {
    editor: {
      text: "inherit",
      background: "transparent",
    },
  },
  // This ensures the SideMenu component is properly overridden
  sideMenu: false
};

export function BlockEditor({
  initialContent = "",
  onChange,
  placeholder = "Type '/' for commands...",
  className,
  readOnly = false,
}: BlockEditorProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create the editor with the proper options for BlockNote
  const editor = useBlockNote({
    domAttributes: {
      editor: {
        class: cn(
          "min-h-[200px] rounded-md border border-input p-4 focus-visible:outline-none",
          readOnly ? "bg-muted cursor-default" : "bg-editor"
        ),
        "data-placeholder": placeholder,
      },
    },
  });

  // Load initial markdown content
  useEffect(() => {
    if (initialContent && editor && !isInitialized) {
      try {
        // Convert markdown to editor blocks
        const blocks = markdownToEditorContent(initialContent);
        
        if (blocks.length > 0) {
          // Replace any existing blocks with our converted markdown blocks
          editor.replaceBlocks(editor.document, blocks);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error converting markdown to blocks:", error);
        
        // Fallback: Just add a paragraph with the raw content
        try {
          editor.replaceBlocks(
            editor.document,
            [{ type: "paragraph", content: [{ type: "text", text: initialContent, styles: {} }] }]
          );
          setIsInitialized(true);
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
        }
      }
    }
  }, [editor, initialContent, isInitialized]);

  // Handle content changes
  useEffect(() => {
    if (editor && onChange) {
      // This is a workaround for onEditorContentChange not being available
      const handleContentChange = () => {
        // Convert editor content to markdown
        const markdown = editorContentToMarkdown(editor.document);
        onChange(markdown);
      };
      
      // Using a MutationObserver to detect changes
      const editorElement = document.querySelector('.bn-container');
      if (editorElement) {
        const observer = new MutationObserver(handleContentChange);
        observer.observe(editorElement, { 
          subtree: true, 
          childList: true, 
          characterData: true 
        });
        
        return () => observer.disconnect();
      }
    }
  }, [editor, onChange]);

  // Handle key events for slash menu
  useEffect(() => {
    if (editor && !readOnly) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "/") {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSlashMenuPosition({
              x: rect.left,
              y: rect.bottom + window.scrollY
            });
            setShowSlashMenu(true);
          }
        } else if (e.key === "Escape" && showSlashMenu) {
          setShowSlashMenu(false);
        }
        
        setLastKey(e.key);
      };
      
      // Attach to editor element
      const editorElement = document.querySelector('.bn-container');
      if (editorElement) {
        editorElement.addEventListener('keydown', handleKeyDown);
        return () => editorElement.removeEventListener('keydown', handleKeyDown);
      }
    }
  }, [editor, readOnly, showSlashMenu]);

  // Handle insertion of blocks from the slash menu
  const handleInsertBlock = useCallback(
    (blockType: string) => {
      if (!editor || readOnly) return;
      
      try {
        const currentPosition = editor.getTextCursorPosition().block;
        
        switch (blockType) {
          case "heading1":
            editor.updateBlock(currentPosition, { type: "heading", props: { level: 1 } });
            break;
          case "heading2":
            editor.updateBlock(currentPosition, { type: "heading", props: { level: 2 } });
            break;
          case "heading3":
            editor.updateBlock(currentPosition, { type: "heading", props: { level: 3 } });
            break;
          case "bulletList":
            editor.updateBlock(currentPosition, { type: "bulletListItem" });
            break;
          case "numberedList":
            editor.updateBlock(currentPosition, { type: "numberedListItem" });
            break;
          case "checklist":
            editor.updateBlock(currentPosition, { type: "checkListItem" });
            break;
          case "table":
            // Simple table implementation - in a real app, use proper table API
            editor.updateBlock(currentPosition, { type: "paragraph" });
            break;
          case "divider":
            // Simple divider - in a real app use proper divider API
            editor.updateBlock(currentPosition, { type: "paragraph" });
            break;
          case "quote":
            editor.updateBlock(currentPosition, { type: "quote" });
            break;
          case "code":
            editor.updateBlock(currentPosition, { type: "codeBlock" });
            break;
          default:
            editor.updateBlock(currentPosition, { type: "paragraph" });
        }
        
        setShowSlashMenu(false);
        
        // Focus the editor after inserting a block
        setTimeout(() => {
          editor.focus();
        }, 0);
      } catch (error) {
        console.error("Error inserting block:", error);
      }
    },
    [editor, readOnly]
  );
  
  // Close slash menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showSlashMenu) {
        setShowSlashMenu(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSlashMenu]);
  
  // Reset slash menu when editor changes
  useEffect(() => {
    if (lastKey && lastKey !== "/" && showSlashMenu) {
      setShowSlashMenu(false);
    }
  }, [lastKey, showSlashMenu]);

  return (
    <div className={cn("block-editor-container relative", className)}>
      {!readOnly && <EditorToolbar editor={editor} />}
      
      <div className="relative">
        <BlockNoteView
          editor={editor}
          theme="light"
          editable={!readOnly}
        />
        
        {showSlashMenu && !readOnly && (
          <div
            className="absolute z-50"
            style={{
              left: `${slashMenuPosition.x}px`,
              top: `${slashMenuPosition.y}px`,
            }}
          >
            <SlashMenu onSelect={handleInsertBlock} />
          </div>
        )}
      </div>
    </div>
  );
}

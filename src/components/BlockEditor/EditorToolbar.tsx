
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Link,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { BlockNoteEditor } from "@blocknote/core";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  editor: BlockNoteEditor | null;
  className?: string;
}

interface ToolbarButtonProps {
  active?: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function ToolbarButton({ active, label, icon, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-2 rounded-md hover:bg-editor-hover focus:outline-none focus:ring-1 focus:ring-ring",
        active && "bg-editor-selected text-primary"
      )}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
}

export function EditorToolbar({ editor, className }: EditorToolbarProps) {
  if (!editor) return null;

  const formatBlock = (type: string, props?: Record<string, any>) => {
    if (type === "paragraph") {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "paragraph",
        ...(props && { props }),
      });
    } else if (type === "heading") {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: "heading",
        props: { level: props?.level || 1 },
      });
    } else {
      try {
        editor.updateBlock(editor.getTextCursorPosition().block, {
          type: type as any,
          ...(props && { props }),
        });
      } catch (error) {
        console.error("Error formatting block:", error);
      }
    }
  };

  const isBlockActive = (type: string, props?: Record<string, any>) => {
    const currentBlock = editor.getTextCursorPosition().block;
    if (!currentBlock) return false;
    
    if (props && type === "heading") {
      return currentBlock.type === type && 
             currentBlock.props?.level === props.level;
    }
    
    return currentBlock.type === type;
  };

  const toggleMark = (type: string) => {
    editor.focus();
    // Note: In a real implementation, you would use the actual API
    // provided by BlockNote to toggle marks
    console.log("Toggle mark:", type);
  };

  const isMarkActive = (type: string) => {
    // Note: In a real implementation, you would check if the mark is active
    return false;
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      // Note: In a real implementation, you would use the actual API
      // provided by BlockNote to insert links
      console.log("Insert link:", url);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 mb-2 rounded-md bg-editor-toolbar border border-border overflow-x-auto",
        className
      )}
    >
      <ToolbarButton
        icon={<Bold className="h-4 w-4" />}
        label="Bold"
        active={isMarkActive("bold")}
        onClick={() => toggleMark("bold")}
      />
      <ToolbarButton
        icon={<Italic className="h-4 w-4" />}
        label="Italic"
        active={isMarkActive("italic")}
        onClick={() => toggleMark("italic")}
      />
      <ToolbarButton
        icon={<Link className="h-4 w-4" />}
        label="Link"
        active={isMarkActive("link")}
        onClick={insertLink}
      />
      
      <div className="h-4 w-[1px] bg-border mx-1" />
      
      <ToolbarButton
        icon={<Heading1 className="h-4 w-4" />}
        label="Heading 1"
        active={isBlockActive("heading", { level: 1 })}
        onClick={() => formatBlock("heading", { level: 1 })}
      />
      <ToolbarButton
        icon={<Heading2 className="h-4 w-4" />}
        label="Heading 2"
        active={isBlockActive("heading", { level: 2 })}
        onClick={() => formatBlock("heading", { level: 2 })}
      />
      <ToolbarButton
        icon={<Heading3 className="h-4 w-4" />}
        label="Heading 3"
        active={isBlockActive("heading", { level: 3 })}
        onClick={() => formatBlock("heading", { level: 3 })}
      />
      
      <div className="h-4 w-[1px] bg-border mx-1" />
      
      <ToolbarButton
        icon={<List className="h-4 w-4" />}
        label="Bullet List"
        active={isBlockActive("bulletListItem")}
        onClick={() => formatBlock("bulletListItem")}
      />
      <ToolbarButton
        icon={<ListOrdered className="h-4 w-4" />}
        label="Numbered List"
        active={isBlockActive("numberedListItem")}
        onClick={() => formatBlock("numberedListItem")}
      />
      <ToolbarButton
        icon={<CheckSquare className="h-4 w-4" />}
        label="To-do List"
        active={isBlockActive("checkListItem")}
        onClick={() => formatBlock("checkListItem")}
      />
      
      <div className="h-4 w-[1px] bg-border mx-1" />
      
      <ToolbarButton
        icon={<Quote className="h-4 w-4" />}
        label="Quote"
        active={isBlockActive("quote")}
        onClick={() => formatBlock("quote")}
      />
      <ToolbarButton
        icon={<Code className="h-4 w-4" />}
        label="Code Block"
        active={isBlockActive("codeBlock")}
        onClick={() => formatBlock("codeBlock")}
      />
      
      <div className="h-4 w-[1px] bg-border mx-1" />
      
      <ToolbarButton
        icon={<AlignLeft className="h-4 w-4" />}
        label="Align Left"
        onClick={() => console.log("Align left")}
      />
      <ToolbarButton
        icon={<AlignCenter className="h-4 w-4" />}
        label="Align Center"
        onClick={() => console.log("Align center")}
      />
      <ToolbarButton
        icon={<AlignRight className="h-4 w-4" />}
        label="Align Right"
        onClick={() => console.log("Align right")}
      />
    </div>
  );
}

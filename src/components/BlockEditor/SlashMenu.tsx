
import { useState, useEffect } from "react";
import { 
  Heading1, Heading2, Heading3, List, ListOrdered, 
  Table, CheckSquare, Minus, Quote, Code, Text 
} from "lucide-react";

interface SlashMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const MENU_ITEMS: SlashMenuItem[] = [
  {
    id: "heading1",
    label: "Heading 1",
    icon: <Heading1 className="w-4 h-4" />,
    description: "Large section heading",
  },
  {
    id: "heading2",
    label: "Heading 2",
    icon: <Heading2 className="w-4 h-4" />,
    description: "Medium section heading",
  },
  {
    id: "heading3",
    label: "Heading 3",
    icon: <Heading3 className="w-4 h-4" />,
    description: "Small section heading",
  },
  {
    id: "bulletList",
    label: "Bullet List",
    icon: <List className="w-4 h-4" />,
    description: "Create a bulleted list",
  },
  {
    id: "numberedList",
    label: "Numbered List",
    icon: <ListOrdered className="w-4 h-4" />,
    description: "Create a numbered list",
  },
  {
    id: "checklist",
    label: "Checklist",
    icon: <CheckSquare className="w-4 h-4" />,
    description: "Create a checklist",
  },
  {
    id: "table",
    label: "Table",
    icon: <Table className="w-4 h-4" />,
    description: "Add a table",
  },
  {
    id: "divider",
    label: "Divider",
    icon: <Minus className="w-4 h-4" />,
    description: "Add a divider line",
  },
  {
    id: "quote",
    label: "Quote",
    icon: <Quote className="w-4 h-4" />,
    description: "Add a quote or blockquote",
  },
  {
    id: "code",
    label: "Code Block",
    icon: <Code className="w-4 h-4" />,
    description: "Insert code with syntax highlighting",
  },
  {
    id: "paragraph",
    label: "Text",
    icon: <Text className="w-4 h-4" />,
    description: "Just start typing",
  },
];

export interface SlashMenuProps {
  onSelect: (blockType: string) => void;
}

export function SlashMenu({ onSelect }: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredItems, setFilteredItems] = useState(MENU_ITEMS);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < filteredItems.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            onSelect(filteredItems[selectedIndex].id);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, filteredItems, onSelect]);

  // Filter items as user types after the slash
  useEffect(() => {
    if (searchTerm) {
      const filtered = MENU_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
      setSelectedIndex(0);
    } else {
      setFilteredItems(MENU_ITEMS);
    }
  }, [searchTerm]);

  return (
    <div 
      className="bg-popover shadow-md rounded-md overflow-hidden border border-border w-64"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Search input */}
      <div className="p-2 border-b border-border">
        <input
          type="text"
          className="w-full bg-transparent p-1 text-sm outline-none text-foreground"
          placeholder="Search commands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      </div>
      
      {/* Menu items */}
      <div className="max-h-[300px] overflow-y-auto py-1">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`px-3 py-2 flex items-center gap-3 cursor-pointer text-sm ${
                index === selectedIndex
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}
              onClick={() => onSelect(item.id)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-center justify-center w-5 h-5 text-muted-foreground">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 py-2 text-sm text-muted-foreground text-center">
            No commands found
          </div>
        )}
      </div>
    </div>
  );
}

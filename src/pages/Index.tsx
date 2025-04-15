
import { useState } from "react";
import { BlockEditor } from "@/components/BlockEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultContent = `# Task Title
## Description
This is a description of the task. You can edit it to add more details.

- [ ] First task to complete
- [ ] Second task with more details
- [ ] Third task with even more information

## Additional Notes
Add any additional notes or context here.
`;

export default function Index() {
  const [content, setContent] = useState(defaultContent);
  const [readonlyContent, setReadonlyContent] = useState(
    "# Example Task (Read-only)\n\nThis is a read-only example of the task description editor. You can't edit this content."
  );

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">ClickUp-like Text Editor</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A powerful rich text editor for task descriptions with Markdown support and slash commands
        </p>
      </div>

      <Tabs defaultValue="editor" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editable Example</TabsTrigger>
          <TabsTrigger value="readonly">Read-only Example</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Description Editor</CardTitle>
              <CardDescription>
                Type '/' to access the command menu. Try adding headings, lists, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlockEditor
                initialContent={content}
                onChange={handleContentChange}
                placeholder="Type '/' for commands or start writing..."
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="readonly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Read-only View</CardTitle>
              <CardDescription>
                This example shows how the editor looks in read-only mode.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlockEditor
                initialContent={readonlyContent}
                readOnly={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Key features of this ClickUp-like text editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
            <li>Rich text editing with modern UI similar to ClickUp</li>
            <li>Slash commands menu for inserting blocks (type / to activate)</li>
            <li>Support for headings, lists, checklists, code blocks, and quotes</li>
            <li>Clean interface with minimal toolbar</li>
            <li>Read-only mode support</li>
            <li>Custom styling to match your application's design</li>
            <li>Markdown input and output support</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>
            Quick guide to using the text editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg text-primary mb-1">Formatting Text</h3>
              <p className="text-muted-foreground">Use the toolbar at the top to format selected text or change block types.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg text-primary mb-1">Slash Commands</h3>
              <p className="text-muted-foreground">Type '/' anywhere to open the command menu, then select the block type you want to insert.</p>
              <div className="mt-2 p-3 bg-muted rounded-md">
                <code className="text-sm">
                  / → Opens command menu with options for: Headings, Lists, Checklists, Table, Quote, Code, etc.
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg text-primary mb-1">Markdown Support</h3>
              <p className="text-muted-foreground">The editor accepts and outputs markdown. Here are some examples:</p>
              <div className="mt-2 p-3 bg-muted rounded-md grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <p className="text-xs font-medium mb-1">Input</p>
                  <code className="text-xs">
                    # Heading 1<br />
                    ## Heading 2<br />
                    - Bullet item<br />
                    - [ ] Todo item<br />
                    - [x] Completed item
                  </code>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Formatting</p>
                  <div className="text-xs">
                    <p className="font-bold text-primary text-base">Heading 1</p>
                    <p className="font-semibold text-base">Heading 2</p>
                    <p>• Bullet item</p>
                    <p>☐ Todo item</p>
                    <p>☑ Completed item</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Built with React, TypeScript, BlockNote, and Shadcn UI
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUp, Link } from "lucide-react";
import { http } from "@/lib/http";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export default function SelectSource() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (type: "url" | "file") => {
    try {
      setLoading(true);
      if (type === "url") {
        await http
          .post("upload/url", {
            url,
          })
          .then(() => {
            navigate({ to: `/` });
          });
      } else {
        await http
          .post("upload/file", {
            file,
          })
          .then(() => {
            navigate({ to: `/` });
          });
      }
    } catch (error: Error | any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Select Source</CardTitle>
          <CardDescription>
            Choose a PDF file or enter a URL to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file" disabled={loading}>
                Upload PDF
              </TabsTrigger>
              <TabsTrigger value="url" disabled={loading}>
                Enter URL
              </TabsTrigger>
            </TabsList>
            <TabsContent value="file">
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="pdf">PDF File</Label>
                  <div className="grid gap-2">
                    <Input
                      id="pdf"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                      disabled={loading}
                    />
                    {file && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleSubmit("file")}
                  disabled={!file || loading}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload and Continue
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="url">
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleSubmit("url")}
                  disabled={!url || loading}
                >
                  <Link className="mr-2 h-4 w-4" />
                  Continue with URL
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

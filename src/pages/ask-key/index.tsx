import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { http } from "@/lib/http";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export default function AskKey() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate=useNavigate()

  async function onSubmit() {
    setLoading(true);
    try {
      await http.post("initialize", { api_key: value }).then((res) => {
        if(res.status===200){
          localStorage.setItem("api_key", value);
          navigate({to:'/chat'})
        }
      });
    } catch (error:Error|any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full h-screen grid place-items-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-lg">Enter your api key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Key</Label>
            <Input
              id="name"
              placeholder="API Key"
              className="col-span-3"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="pt-0 -mt-2">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

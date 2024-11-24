import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { http } from "@/lib/http";
import { useState } from "react";

export function AskKey({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit() {
    setLoading(true);
    try {
      await http.post("initialize", { api_key: value }).then(() => {
        localStorage.setItem("api_key", value);
        setOpen(false);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Api key</DialogTitle>
          <DialogDescription className="hidden">Api key</DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

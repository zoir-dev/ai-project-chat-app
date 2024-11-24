import { Chat } from "@/components/ui/chat";
import {  useState } from "react";
import { http } from "@/lib/http";
import { toast } from "sonner";
import { useGet } from "@/hooks/useGet";

export default function Home() {
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const {data,refetch,setData}=useGet<any>('answers/history')

  async function onSend() {
    setLoading(true);
    try {
      if(localStorage.getItem('asked')){
          await http.post('ask',{
            question:value,
          }).then((res)=>{
            if(res.status===200){
              setData([...data,{
                role:'user',
                id:res.data?.timestamp,
                question:value
              },{
                role:'assistant',
                id:res.data?.timestamp,
                answer:res.data?.answer
              }])
              setValue('')
            }
          })
      }else{
        await http
        .post("upload/url", {
          url: value,
        })
        .then((res) => {
          localStorage.setItem("url",value)
          localStorage.setItem('asked',"true")
          toast.success(res.data.message);
          setValue('')
        });
      }
    } catch (error:any) {
      console.log(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  }

  console.log(data)

  return (
    <>
      <div className="container mx-auto flex flex-col justify-end h-screen py-2 pt-8">
        <Chat
          messages={data?.map((m:any)=>({
            id:m.id,
            role:m.question?'user':'assistant',
            content:m.question?m.question:m.answer,
            createdAt:m.id
          }))||[]}
          input={value}
          handleInputChange={(e) => setValue(e.target.value)}
          handleSubmit={(e) => {
            e?.preventDefault?.();
            onSend();
          }}
          isGenerating={loading}
        />
        <span className="text-muted-foreground mx-auto text-sm pt-2">
          AI reader can make mistakes. Check important info.
        </span>
      </div>
    </>
  );
}

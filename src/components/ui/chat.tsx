"use client";

import { forwardRef, useState, type ReactElement } from "react";
import { ArrowDown, ThumbsDown, ThumbsUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Message } from "./chat-message";
import { PromptSuggestions } from "./prompt-suggestions";
import { MessageList } from "./message-list";
import { CopyButton } from "./copy-button";
import { Button } from "./button";
import { MessageInput } from "./message-input";
import { useAutoScroll } from "@/hooks/use-auto-scroll";

interface ChatPropsBase {
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => void;
  messages: Array<Message>;
  input: string;
  className?: string;
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  isGenerating: boolean;
  stop?: () => void;
  onRateResponse?: (
    messageId: string,
    rating: "thumbs-up" | "thumbs-down"
  ) => void;
}

interface ChatPropsWithoutSuggestions extends ChatPropsBase {
  append?: never;
  suggestions?: never;
}

interface ChatPropsWithSuggestions extends ChatPropsBase {
  append: (message: { role: "user"; content: string }) => void;
  suggestions: string[];
}

type ChatProps = ChatPropsWithoutSuggestions | ChatPropsWithSuggestions;

export function Chat({
  messages,
  handleSubmit,
  input,
  handleInputChange,
  stop,
  isGenerating,
  append,
  suggestions,
  className,
  onRateResponse
}: ChatProps) {
  const lastMessage = messages.at(-1);
  const isEmpty = messages.length === 0;
  const isTyping = lastMessage?.role === "user";

  return (
    <ChatContainer className={className}>
      {isEmpty && append && suggestions ? (
        <PromptSuggestions
          label="Try these prompts ✨"
          append={append}
          suggestions={suggestions}
        />
      ) : null}

      {messages.length > 0 ? (
        <ChatMessages messages={messages}>
          <MessageList
            messages={messages}
            isTyping={isTyping}
            messageOptions={(message) => ({
              actions: onRateResponse ? (
                <>
                  <div className="border-r pr-1">
                    <CopyButton
                      content={message.content}
                      copyMessage="Copied response to clipboard!"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => onRateResponse(message.id, "thumbs-up")}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => onRateResponse(message.id, "thumbs-down")}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <CopyButton
                  content={message.content}
                  copyMessage="Copied response to clipboard!"
                />
              ),
            })}
          />
        </ChatMessages>
      ) : null}

      <ChatForm
        className="mt-auto"
        isPending={isGenerating || isTyping}
        handleSubmit={handleSubmit}
      >
        {({ file, setFile }) => (
          <MessageInput
            value={input}
            onChange={handleInputChange}
            allowAttachments
            file={file}
            setFile={setFile}
            stop={stop}
            isGenerating={isGenerating}
          />
        )}
      </ChatForm>
    </ChatContainer>
  );
}
Chat.displayName = "Chat";

export function ChatMessages({
  messages,
  children,
}: React.PropsWithChildren<{
  messages: Message[];
}>) {
  const { containerRef, scrollToBottom, handleScroll, shouldAutoScroll } =
    useAutoScroll([messages]);

  return (
    <div
      className="relative overflow-y-auto pb-4"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {children}

      {!shouldAutoScroll && (
        <div className="sticky bottom-0 left-0 flex w-full justify-end">
          <Button
            onClick={scrollToBottom}
            className="h-8 w-8 rounded-full ease-in-out animate-in fade-in-0 slide-in-from-bottom-1"
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export const ChatContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid max-h-full w-full grid-rows-[1fr_auto]", className)}
      {...props}
    />
  );
});
ChatContainer.displayName = "ChatContainer";

interface ChatFormProps {
  className?: string;
  isPending: boolean;
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => void;
  children: (props: {
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
  }) => ReactElement;
}

export const ChatForm = forwardRef<HTMLFormElement, ChatFormProps>(
  ({ children, handleSubmit, isPending, className }, ref) => {
    const [file, setFile] = useState<File | null>(null);

    const onSubmit = (event: React.FormEvent) => {
      if (isPending) {
        event.preventDefault();
        return;
      }

      if (!file) {
        handleSubmit(event);
        return;
      }
      handleSubmit(event);
      setFile(null);
    };

    return (
      <form ref={ref} onSubmit={onSubmit} className={className}>
        {children({ file, setFile })}
      </form>
    );
  }
);
ChatForm.displayName = "ChatForm";

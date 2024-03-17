import React, { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { Bot, Trash, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Message } from "ai";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface AIChatboxProps {
  open: boolean;
  onClose: () => void;
}

const AIChatbox = ({ onClose, open }: AIChatboxProps) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      //scrollin automatikusan le ez fasza nagyon
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);
  const lastMessageIsuser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36 border rounded bg-slate-50",
        open ? "fixed" : "hidden"
      )}
    >
      <button className="block mb-1 ms-auto" onClick={onClose}>
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] flex-col rounded bg-background">
        <div className="h-full px-3 mt-3 overflow-auto" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
        {isLoading && lastMessageIsuser && (
          <ChatMessage message={{ role: "assistant", content: "thinking" }} />
        )}
        <form onSubmit={handleSubmit} className="flex gap-1 m-3">
          <Button
            title="Clear chat"
            variant="outline"
            size="icon"
            type="button"
            className="shrink-0"
            onClick={() => {
              setMessages([]);
            }}
          >
            <Trash />
          </Button>
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="say something"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
};

export default AIChatbox;

function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  const { user } = useUser();

  const isAiMessage = role === "assistant";
  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "justify-start me-5" : "justify-end ms-5"
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-primary text-primary-foreground"
        )}
      >
        {content}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          alt="user"
          src={user.imageUrl}
          width={40}
          height={40}
          className="object-cover w-10 h-10 ml-2 rounded-full"
        />
      )}
    </div>
  );
}

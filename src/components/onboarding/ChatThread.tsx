import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";

export function ChatThread({
  messages,
}: {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-[min(60vh,520px)] rounded-lg border border-hairline bg-paper p-4">
      <div className="flex flex-col gap-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

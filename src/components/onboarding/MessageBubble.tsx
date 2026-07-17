import { cn } from "@/lib/utils";

export function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-3 text-[15px] leading-relaxed",
          isUser
            ? "bg-ink text-paper"
            : "border border-hairline bg-paper-raised text-ink",
        )}
      >
        {content}
      </div>
    </div>
  );
}

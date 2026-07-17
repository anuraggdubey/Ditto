import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TweetEditor({
  value,
  onChange,
  editable = false,
  className,
}: {
  value: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  className?: string;
}) {
  if (editable && onChange) {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "min-h-[120px] resize-none font-sans text-[16px] leading-relaxed",
          className,
        )}
        maxLength={280}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-hairline bg-paper-raised p-4 text-[16px] leading-relaxed text-ink",
        className,
      )}
    >
      {value || "Your generated tweet will appear here…"}
    </div>
  );
}

export function TweetCharCount({ text }: { text: string }) {
  const len = text.length;
  const over = len > 280;
  return (
    <span
      className={cn(
        "font-mono-ui text-[12px]",
        over ? "text-signal" : "text-graphite",
      )}
    >
      {len}/280
    </span>
  );
}

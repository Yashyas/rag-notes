"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  PaperPlaneTiltIcon,
  HardDriveIcon,
  SpinnerIcon,
  LightbulbIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function StreamChatInterface() {
  const { messages, sendMessage, status, stop, error } = useChat();

  const [input, setInput] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBusy) return;

    // SDK uses sendMessage
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <ScrollArea className="flex-1 p-4 ">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="font-medium">Ask a question about your notes</p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent border"
                }`}
              >
                {/* AI SDK 5 uses 'parts' for rich content */}
                {m.parts.map((part, index) => {
                  if (part.type.startsWith("tool-")) {
                    const toolPart = part as {
                      type: string;
                      state: string;
                      input?: unknown;
                      output?: unknown;
                    };
                    const isExecuting =
                      toolPart.state === "input-streaming" ||
                      toolPart.state === "input-available";
                    const isCompleted = toolPart.state === "output-available";
                    const toolName = part.type.replace("tool-", ""); // e.g. "semanticSearch"

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs font-mono p-2 bg-muted/50 rounded-md"
                      >
                        {isExecuting && (
                          <SpinnerIcon className="animate-spin" size={14} />
                        )}
                        {isCompleted && (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                        <span
                          className={
                            isCompleted
                              ? "text-muted-foreground"
                              : "text-primary font-bold"
                          }
                        >
                          {toolName}
                          {isExecuting ? "..." : ""}
                        </span>
                      </div>
                    );
                  }

                  switch (part.type) {
                    case "text":
                      return (
                        <ReactMarkdown key={index}>{part.text}</ReactMarkdown>
                      );

                    case "reasoning":
                      return (
                        <div
                          key={index}
                          className="text-sm italic text-accent-foreground border-l-2 border-ring pl-2 my-2"
                        >
                          {part.text}
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}

          {/* Skeleton/Loading State when AI is preparing to stream */}
          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="bg-accent p-4 rounded-2xl border animate-pulse">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-background/80 backdrop-blur-md sticky bottom-0">
        <form
          onSubmit={handleFormSubmit}
          className="flex gap-2 max-w-3xl mx-auto"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isBusy ? "AI is typing..." : "Ask about your notes..."}
            className="flex-1"
          />
          {isBusy ? (
            <Button type="button" variant="destructive" onClick={() => stop()}>
              Stop
            </Button>
          ) : (
            <Button type="submit" disabled={!input.trim()}>
              <PaperPlaneTiltIcon size={20} />
            </Button>
          )}
        </form>
        {error && (
          <p className="text-xs text-destructive text-center mt-2">
            Failed to send message. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}

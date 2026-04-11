'use client';

import { useState } from 'react';
import { useNotesStore, ChatMessage } from '@/lib/store/notesStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaperPlaneTiltIcon } from '@phosphor-icons/react';
import { askQuestions } from '@/app/actions/chat';

export function ChatInterface() {
  const chatMessages = useNotesStore((state) => state.chatMessages);
  const addChatMessage = useNotesStore((state) => state.addChatMessage);
  const notes = useNotesStore((state) => state.notes);

  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageInput,
      timestamp: new Date(),
    };
    addChatMessage(userMessage);
    setMessageInput('');

    // Simulate loading
    setIsLoading(true);

    // Simulate RAG response (stub for now)
    const response = await askQuestions(messageInput)

    const sourceslist = response.sources && response.sources.length > 0 ? `\n\n---\n**Sources:**\n${response.sources.map(s => `• ${s}`).join('\n')}`
  : '';
   
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `${response.answer}${sourceslist}`,
        timestamp: new Date(),
      };
      addChatMessage(assistantMessage);
      setIsLoading(false);
  
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {chatMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground py-8">
              <div>
                <p className="font-medium mb-2">Ask a question</p>
                <p className="text-sm">
                  Query your notes using natural language
                </p>
              </div>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-foreground'
                  }`}
                >
                  <div className="text-base whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  <span className="text-xs opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-accent text-foreground px-4 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t safe-area-bottom shrink-0">
        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your notes..."
            disabled={isLoading}
            className="!text-base"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isLoading}
            size="default"
            className="gap-2"
          >
            <PaperPlaneTiltIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}



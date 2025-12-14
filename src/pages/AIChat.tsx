import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Loader2,
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
  Trash2,
  Sparkles,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

export default function AIChat() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession);
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const loadSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    setSessions(data || []);

    if (data && data.length > 0 && !currentSession) {
      setCurrentSession(data[0].id);
    }
  };

  const loadMessages = async (sessionId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    setMessages(data?.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })) || []);
  };

  const createNewSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user.id, title: "New Chat" })
      .select()
      .single();

    if (error) {
      toast({ title: "Error creating chat", variant: "destructive" });
      return;
    }

    setSessions([data, ...sessions]);
    setCurrentSession(data.id);
    setMessages([]);
  };

  const deleteSession = async (sessionId: string) => {
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId);

    if (error) {
      toast({ title: "Error deleting chat", variant: "destructive" });
      return;
    }

    setSessions(sessions.filter((s) => s.id !== sessionId));
    if (currentSession === sessionId) {
      setCurrentSession(sessions[0]?.id || null);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    setIsStreaming(true);

    // Add user message to UI
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);

    // Ensure we have a session
    let sessionId = currentSession;
    if (!sessionId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("chat_sessions")
        .insert({ user_id: user.id, title: userMessage.slice(0, 50) })
        .select()
        .single();

      if (data) {
        sessionId = data.id;
        setCurrentSession(data.id);
        setSessions([data, ...sessions]);
      }
    }

    // Save user message to DB
    if (sessionId) {
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: userMessage,
      });
    }

    // Stream response from AI
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: newMessages }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      // Add empty assistant message to UI
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      let buffer = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
                return updated;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Save assistant message to DB
      if (sessionId && assistantMessage) {
        await supabase.from("chat_messages").insert({
          session_id: sessionId,
          role: "assistant",
          content: assistantMessage,
        });

        // Update session title if it's the first message
        if (newMessages.length === 1) {
          await supabase
            .from("chat_sessions")
            .update({ title: userMessage.slice(0, 50), updated_at: new Date().toISOString() })
            .eq("id", sessionId);
          loadSessions();
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive",
      });
      setMessages(newMessages); // Remove the empty assistant message
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar language="english" setLanguage={() => {}} />

      <div className="flex-1 pt-16 flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 bg-card border-r border-border flex-col">
          <div className="p-4">
            <Button
              className="w-full bg-gradient-primary hover:shadow-glow"
              onClick={createNewSession}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    currentSession === session.id
                      ? "bg-primary/20"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setCurrentSession(session.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{session.title}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    AI Assistant
                  </span>
                </h2>
                <p className="text-muted-foreground mb-6">
                  Ask me anything about AI tools, workflows, automation, or get help with your projects.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "How do I build an AI agent?",
                    "Explain N8N workflows",
                    "Best AI tools for coding",
                    "How to automate tasks",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      className="text-sm text-left h-auto py-3 px-4"
                      onClick={() => {
                        setInput(suggestion);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 animate-fade-in ${
                      message.role === "assistant" ? "" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === "assistant"
                          ? "bg-primary/20"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <Card
                      className={`p-4 max-w-[80%] ${
                        message.role === "assistant"
                          ? "bg-card"
                          : "bg-primary/10"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </Card>
                  </div>
                ))}
                {isStreaming && messages[messages.length - 1]?.content === "" && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary animate-pulse" />
                    </div>
                    <Card className="p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </Card>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          )}

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="max-w-3xl mx-auto flex gap-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isStreaming}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                className="bg-gradient-primary hover:shadow-glow"
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

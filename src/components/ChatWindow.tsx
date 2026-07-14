import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, AlertCircle, Bot, User, BrainCircuit, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message, SavedIdea } from "../types";

interface ChatWindowProps {
  idea: SavedIdea;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onEvaluate: () => void;
  isEvaluating: boolean;
}

const PRESET_SUGGESTIONS = [
  {
    title: "Eco-Friendly Cargo Delivery",
    pitch: "SaaS & hardware for electric cargo micro-hub sharing in high-density European cities, reducing final mile logistics carbon output by 80%.",
  },
  {
    title: "Freelancer Tax Automation AI",
    pitch: "An autonomous B2B mobile portal that calculates, declares, and optimizes quarterly tax payments for independent consultants directly from bank APIs.",
  },
  {
    title: "Lawn Care Marketplace",
    pitch: "An uber-like on-demand marketplace connecting homeowners with local verified lawn care providers, managing payments and route optimizations.",
  },
  {
    title: "AI-Powered Patient Charting",
    pitch: "Speech-to-text HIPAA compliant software that listens to doctor-patient consultations and automatically builds structured electronic health logs.",
  },
];

export default function ChatWindow({
  idea,
  messages,
  isLoading,
  onSendMessage,
  onEvaluate,
  isEvaluating,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans text-slate-100 border-r border-slate-800">
      {/* Active Brainstorm Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-medium text-[15px] text-slate-100 flex items-center gap-2">
              {idea.name || "Evaluating New Idea"}
            </h1>
            <p className="text-xs text-slate-400 font-light truncate max-w-sm">
              {idea.description || "Discussing with AI mentor. Add details to diagnose."}
            </p>
          </div>
        </div>

        {/* Sidebar diagnostic trigger */}
        <button
          onClick={onEvaluate}
          disabled={isLoading || isEvaluating || messages.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 text-xs font-semibold rounded-md transition duration-200 cursor-pointer text-[11px] shadow-sm shadow-emerald-500/10"
          title="Analyze discussion against 9 valuation pillars"
        >
          {isEvaluating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          Run 9-Pillar Diagnosis
        </button>
      </div>

      {/* Main Chat Logs scrolling pane */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center max-w-lg mx-auto py-8">
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-400 mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="font-display text-xl font-medium text-slate-100">
                Pioneer Venture Dialogue
              </h2>
              <p className="text-sm font-light text-slate-400 leading-relaxed">
                Describe your startup idea or paste a product elevator pitch. 
                I will help you refine and evaluate it against the 9 startup core dimensions. 
                <span className="text-slate-500"> Remember, I am strict and only answer startup questions!</span>
              </p>
            </div>

            {/* Suggestions list */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono text-emerald-500 tracking-wider">
                CHOOSE A STARTER BLUEPRINT OR PITCH DIRECTLY:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PRESET_SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(`Pitching a concept:\nTitle: ${s.title}\nDescription: ${s.pitch}`)}
                    className="p-3 bg-slate-900 border border-slate-800/85 hover:border-emerald-500/40 hover:bg-slate-800/30 rounded-lg text-left transition duration-200 group cursor-pointer"
                  >
                    <span className="block text-xs font-semibold font-display text-emerald-400 group-hover:text-emerald-300">
                      {s.title}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {s.pitch}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.map((m) => {
                const isAI = m.role === "assistant";
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3.5 ${isAI ? "" : "flex-row-reverse"}`}
                  >
                    {/* Character avatar */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isAI
                          ? "bg-slate-900 border-slate-700/50 text-emerald-400"
                          : "bg-emerald-950 border-emerald-700/55 text-emerald-300"
                      }`}
                    >
                      {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Speech card Content */}
                    <div
                      className={`flex flex-col max-w-[82%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                        isAI
                          ? "bg-slate-900/60 border border-slate-800 text-slate-100"
                          : "bg-emerald-950/20 border border-emerald-900/30 text-emerald-50/95"
                      }`}
                    >
                      <div className="whitespace-pre-line break-words text-slate-300">
                        {m.content}
                      </div>
                      
                      {/* Message Footer metadata */}
                      <span className="text-[9px] text-slate-500 text-right mt-1.5 font-mono select-none block">
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* AI Advisor standard thinking box */}
            {isLoading && (
              <div className="flex gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/50 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-xs text-slate-500 ml-2 font-mono">Analyzing commercial viability...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        )}
      </div>

      {/* Primary chat user dispatch panel */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your startup concept, revenue ideas, target segment, competitors..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3.5 bg-slate-900 hover:bg-slate-850 focus:bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all text-slate-100"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2.5 top-2.5 p-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 rounded-lg transition duration-150 cursor-pointer shadow shadow-emerald-500/5"
            title="Send Input"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Action Suggestion & Notice */}
        <div className="max-w-3xl mx-auto flex items-center justify-between mt-3 text-[11px] text-slate-500 font-mono px-1">
          <span className="flex items-center gap-1 text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            Evaluation chatbot restricting topics strictly to venture creation
          </span>
          {messages.length > 0 && (
            <button
              onClick={onEvaluate}
              className="text-emerald-500 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition"
            >
              <Sparkles className="w-3 h-3 text-emerald-500" /> Use 9-Pillar Engine
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

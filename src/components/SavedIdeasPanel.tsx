import React from "react";
import { Plus, Trash2, Calendar, TrendingUp, Lightbulb, CheckCircle2 } from "lucide-react";
import { SavedIdea } from "../types";

interface SavedIdeasPanelProps {
  savedIdeas: SavedIdea[];
  activeIdeaId: string | null;
  onSelectIdea: (id: string) => void;
  onDeleteIdea: (id: string) => void;
  onNewIdea: () => void;
}

export default function SavedIdeasPanel({
  savedIdeas,
  activeIdeaId,
  onSelectIdea,
  onDeleteIdea,
  onNewIdea,
}: SavedIdeasPanelProps) {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-100 font-sans select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
        <div>
          <h2 className="font-display font-medium text-lg text-emerald-400 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0" />
            Venture Vault
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Your startup concepts</p>
        </div>
      </div>

      {/* New Brainstorm Button */}
      <div className="p-3">
        <button
          onClick={onNewIdea}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition duration-200 cursor-pointer shadow-indigo-500/10 shadow"
        >
          <Plus className="w-4 h-4" />
          New Evaluation Model
        </button>
      </div>

      {/* Saved Ideas List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1.5 scrollbar">
        {savedIdeas.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-xs font-medium text-slate-400">No startup ideas yet</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Start chatting or type an idea to run your first 9-pillar evaluation!
            </p>
          </div>
        ) : (
          savedIdeas.map((idea) => {
            const isActive = idea.id === activeIdeaId;
            const dateStr = new Date(idea.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={idea.id}
                onClick={() => onSelectIdea(idea.id)}
                className={`group relative flex flex-col p-3 rounded-lg border text-left transition duration-200 cursor-pointer ${
                  isActive
                    ? "bg-slate-800/80 border-emerald-500/50 shadow-md shadow-emerald-500/5"
                    : "bg-slate-850 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700"
                }`}
              >
                {/* Title and Delete Action */}
                <div className="flex items-start justify-between gap-2">
                  <span className="font-display font-medium text-sm text-slate-200 group-hover:text-emerald-400 line-clamp-1 truncate pr-5">
                    {idea.name || "Brainstorm Phase"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteIdea(idea.id);
                    }}
                    className="absolute right-2 top-2 p-1 rounded hover:bg-slate-700 hover:text-red-400 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                    title="Delete Idea"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtitle / Description */}
                <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-light pr-2">
                  {idea.description || "Refining basic concept..."}
                </p>

                {/* Footer details: Date and Score */}
                <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 shrink-0" />
                    {dateStr}
                  </span>

                  {idea.evaluation ? (
                    <span className="text-[10px] flex items-center gap-1 bg-emerald-950 border border-emerald-800/50 text-emerald-400 py-0.5 px-1.5 rounded-full font-mono font-bold">
                      <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                      {idea.evaluation.overallScore.toFixed(1)}/10
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-800 py-0.5 px-1.5 rounded-full font-light border border-slate-700/50">
                      Drafting
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Professional subtle watermarks in vault */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 text-center select-none shrink-0">
        <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Venture Diagnostic Matrix
        </p>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Users,
  Swords,
  Crown,
  DollarSign,
  Wrench,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
  TrendingDown,
  HelpCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EvaluationResult, EvaluationPillar } from "../types";

interface ScorecardViewProps {
  evaluation: EvaluationResult | null;
  isLoading: boolean;
  ideaName: string;
}

// Map pillar names to gorgeous customized icons and Tailwind background accents
const getPillarIcon = (name: string) => {
  const norm = name.toLowerCase();
  if (norm.includes("problem")) return <HelpCircle className="w-4 h-4 text-rose-400 shrink-0" />;
  if (norm.includes("audience") || norm.includes("target")) return <Users className="w-4 h-4 text-sky-400 shrink-0" />;
  if (norm.includes("demand") || norm.includes("market")) return <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />;
  if (norm.includes("competitor")) return <Swords className="w-4 h-4 text-amber-400 shrink-0" />;
  if (norm.includes("uniqueness") || norm.includes("usp")) return <Crown className="w-4 h-4 text-indigo-400 shrink-0" />;
  if (norm.includes("revenue") || norm.includes("model")) return <DollarSign className="w-4 h-4 text-teal-400 shrink-0" />;
  if (norm.includes("feasibility")) return <Wrench className="w-4 h-4 text-orange-400 shrink-0" />;
  if (norm.includes("scalability")) return <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />;
  if (norm.includes("risk")) return <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />;
  return <Award className="w-4 h-4 text-slate-400 shrink-0" />;
};

// Map scores to color themes
const getScoreRating = (score: number) => {
  if (score >= 8.0) return { label: "Exceptional Moat", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", progress: "bg-emerald-500" };
  if (score >= 6.0) return { label: "Good Potential", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", progress: "bg-amber-500" };
  return { label: "Needs Pivot", text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", progress: "bg-rose-500" };
};

export default function ScorecardView({ evaluation, isLoading, ideaName }: ScorecardViewProps) {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const togglePillar = (name: string) => {
    setExpandedPillar(expandedPillar === name ? null : name);
  };

  const currentTheme = evaluation ? getScoreRating(evaluation.overallScore) : { label: "", text: "", bg: "", border: "", progress: "" };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans select-none overflow-y-auto scrollbar">
      {/* Visual Diagnostic Banner */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 sticky top-0 z-10 shadow-sm shadow-slate-950/25">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400 shrink-0" />
          <h2 className="font-display font-medium text-base text-slate-200">
            Enterprise Scorecard
          </h2>
        </div>
        {evaluation && (
          <span className="font-mono text-xs text-slate-400 font-light flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            9-Pillar Diagnostic Engine v1.0
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col justify-center items-center py-20 px-8">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin" />
          </div>
          <h3 className="font-display font-medium text-slate-200">Compiling Scorecard Metrics</h3>
          <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed font-light max-w-xs">
            Synthesizing risk profiles, USP defensibility, economic viability, and auditing 9 dimensions...
          </p>
        </div>
      ) : !evaluation ? (
        <div className="flex-1 flex flex-col justify-center items-center p-8 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-750">
            <CheckCircle2 className="w-7 h-7 text-slate-500" />
          </div>
          <h3 className="font-display font-semibold text-sm text-slate-300">Scorecard Pending</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-light mt-2">
            Once you pitch your idea or discuss it with Evaluator AI in the chat, click the <span className="text-emerald-400 font-medium">"Run 9-Pillar Diagnosis"</span> button to generate a structured interactive metric analysis.
          </p>
          <div className="mt-6 p-3 bg-slate-950 border border-slate-800 rounded-lg text-left text-[11px] text-slate-400 font-mono space-y-1">
            <div className="flex items-center gap-2 text-emerald-500 font-bold mb-1">
              <Sparkles className="w-3 h-3" /> WHAT WE MEASURE:
            </div>
            <div>• Addressable Market Demand & Target</div>
            <div>• Moats, Defensibility, & USP strength</div>
            <div>• Team Feasibility, Margin & Scale Dynamics</div>
            <div>• Revenue Realism & Strategic Risk profile</div>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-5">
          {/* Header overall Score Gauge */}
          <div className="p-5 bg-slate-950 border border-slate-800/80 rounded-xl relative overflow-hidden flex flex-col md:flex-row gap-5 items-center">
            {/* Soft backdrop blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />

            {/* Score Ring */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              {/* Radial background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  className="stroke-slate-800 fill-none"
                  strokeWidth="6"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  className={`fill-none transition-all duration-1000 ease-out`}
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - evaluation.overallScore / 10)}`}
                  strokeLinecap="round"
                  strokeWidth="7"
                  style={{
                    stroke: evaluation.overallScore >= 8.0 ? "#10b981" : evaluation.overallScore >= 6.0 ? "#f59e0b" : "#f43f5e",
                  }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-mono font-black text-slate-100">
                  {evaluation.overallScore.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-medium -mt-1">/10</span>
              </div>
            </div>

            {/* Overall description */}
            <div className="flex-1 text-center md:text-left space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold bg-emerald-950 border border-emerald-900/40 px-2 py-0.5 rounded">
                Viability Rating
              </span>
              <h3 className="font-display font-bold text-lg text-slate-100 mt-1">
                {ideaName || "Evaluating Concept"}
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Evaluator Grade: <span className={`font-semibold ${currentTheme.text}`}>{currentTheme.label}</span>. 
                {evaluation.overallScore >= 7.5 
                  ? " Shows strong product-market fit signals. Defensiveness is solid." 
                  : evaluation.overallScore >= 5.5 
                  ? " Viable roadmap but requires tactical validation on critical assumptions." 
                  : " Heavy assumptions currently unvalidated. Refine core pillars before fundraising."}
              </p>
            </div>
          </div>

          {/* Quick Pillars Grid view containing scores */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono text-emerald-500 tracking-wider">
              9-PILLAR DIAGNOSTIC SCORECARD:
            </h3>
            <div className="space-y-2">
              {evaluation.pillars.map((pillar) => {
                const isOpen = expandedPillar === pillar.name;
                const grading = getScoreRating(pillar.score);
                const pillarIcon = getPillarIcon(pillar.name);

                return (
                  <div
                    key={pillar.name}
                    className="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden transition-all duration-200"
                  >
                    {/* Header bar and toggle trigger */}
                    <button
                      onClick={() => togglePillar(pillar.name)}
                      className="w-full flex items-center justify-between p-3.5 hover:bg-slate-900/50 text-left cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
                          {pillarIcon}
                        </div>
                        <div className="min-w-0 pr-4">
                          <span className="text-xs font-semibold text-slate-200 block truncate">
                            {pillar.name}
                          </span>
                        </div>
                      </div>

                      {/* Right-side Score and arrow trigger */}
                      <div className="flex items-center gap-3 select-none">
                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded bg-slate-900 border border-slate-800 ${grading.text}`}>
                          {pillar.score.toFixed(1)}/10
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </div>
                    </button>

                    {/* Detailed Analysis panel */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-slate-900 px-4 py-3.5 bg-slate-900/35 space-y-3.5"
                        >
                          {/* Micro Progress bar indicator */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                              <span>Pillar Diagnostic Score</span>
                              <span>{pillar.score}/10 — {grading.label}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${grading.progress}`}
                                style={{ width: `${pillar.score * 10}%` }}
                              />
                            </div>
                          </div>

                          {/* VC analysis */}
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block mb-1">
                              Clinical Analysis:
                            </span>
                            <p className="text-xs text-slate-300 antialiased leading-relaxed font-light">
                              {pillar.analysis}
                            </p>
                          </div>

                          {/* Quick Pros and Cons checklist */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1.5">
                            {/* Pros */}
                            <div className="p-2.5 bg-emerald-950/15 border border-emerald-900/20 rounded-lg space-y-1.5">
                              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5" /> Highlights (Pros)
                              </span>
                              <ul className="space-y-1">
                                {pillar.pros.map((pro, index) => (
                                  <li key={index} className="text-slate-300 text-[11px] leading-relaxed flex items-start gap-1">
                                    <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                                    <span>{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Cons */}
                            <div className="p-2.5 bg-rose-950/10 border border-rose-900/25 rounded-lg space-y-1.5">
                              <span className="text-[10px] uppercase font-mono text-rose-400 font-bold flex items-center gap-1.5">
                                <TrendingDown className="w-3.5 h-3.5" /> Hurdles (Cons)
                              </span>
                              <ul className="space-y-1">
                                {pillar.cons.map((con, index) => (
                                  <li key={index} className="text-slate-300 text-[11px] leading-relaxed flex items-start gap-1">
                                    <span className="text-rose-400 font-bold mt-0.5 shrink-0">⚠</span>
                                    <span>{con}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Action Prescription */}
                          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start gap-2.5 mt-2">
                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block mb-0.5">
                                Action Prescription to De-Risk:
                              </span>
                              <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                                {pillar.recommendation}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Executive Summary Card */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-xs font-mono text-emerald-500 tracking-wider uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Executive VC Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light antialiased">
              {evaluation.executiveSummary}
            </p>
          </div>

          {/* Constructive Feedback Block */}
          <div className="p-4 bg-emerald-950/10 border border-emerald-900/25 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Strategic Advisory note
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-light font-sans antialiased">
              {evaluation.constructiveFeedback}
            </p>
          </div>

          {/* Key Checklist Action Plan */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-mono text-emerald-500 tracking-wider uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Actionable Founder Next Steps
            </h3>
            <div className="space-y-2">
              {evaluation.nextSteps.map((step, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-1 bg-slate-900/30 border border-slate-850 rounded">
                  <div className="w-5 h-5 bg-slate-900 text-[10px] text-emerald-400 border border-emerald-900/50 flex items-center justify-center font-bold font-mono shrink-0 rounded mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

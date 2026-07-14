import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  Lightbulb,
  Trash2,
  Calendar,
  Layers,
  Edit2,
  Check,
  X,
  AlertOctagon,
  Bot,
  BrainCircuit,
  Settings,
  Menu,
  FileEdit,
  Sliders,
  XCircle
} from "lucide-react";
import SavedIdeasPanel from "./components/SavedIdeasPanel";
import ChatWindow from "./components/ChatWindow";
import ScorecardView from "./components/ScorecardView";
import { SavedIdea, Message, EvaluationResult } from "./types";

// Seed data to give the user a beautifully initialized application immediately.
const SEED_IDEA_ID = "farmdash-demo-seed-id";
const SEED_IDEA: SavedIdea = {
  id: SEED_IDEA_ID,
  name: "FarmDash Logistics",
  description: "SaaS connecting local smallholder farms to suburban grocery stores, optimizing micro-haul routing to cut fresh produce spoilage in half.",
  createdAt: new Date().toISOString(),
  messages: [
    {
      id: "m1",
      role: "assistant",
      content: "Hello! I am Evaluator AI. Welcome to your startup war room. I have populated this demo ideation portal to show you what a fully evaluated startup looks like.\n\nTake a look at the Enterprise Scorecard on the right. You can expand each of the 9 pillars to review details, VC analyses, pros, cons, and tactical action prescriptions to de-risk the venture.",
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: "m2",
      role: "user",
      content: "Which elements of FarmDash are currently the riskiest? How can I fix the Competitors score?",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: "m3",
      role: "assistant",
      content: "For FarmDash, the primary bottlenecks are **Competitors** (5.5/10) and **Feasibility/Execution** (6.0/10).\n\nTo increase your Competitors score, you must identify a clear structural cost moat. Small-scale farmers are hard to consolidate, but a custom route-cooperating software that operates like a neighborhood coop reduces courier fees. Review the 'Action Prescription' inside the Competitors card to see our concrete tactical steps!",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  evaluation: {
    overallScore: 7.1,
    executiveSummary: "FarmDash Logistics targets a highly painful sector: final-mile perishable supply chains. Spoilage eats up 30-45% of smallholder farmers' margins. By utilizing automated micro-haul fleet sharing, FarmDash can optimize load density. However, because rural cellular coverage is spotty and farmer adoption remains structurally slow, execution complexity is high, and competitor alternatives like regional distributors present standard scaling barriers.",
    constructiveFeedback: "The strongest element of FarmDash is the absolute clarity of the Pain Point (8.5/10). The heaviest friction lies in Competitors (5.5) and Feasibility (6.0). We highly recommend validating driver compliance and launching a 30-day pilot before investing capital into custom hardware routing.",
    pillars: [
      {
        name: "Problem Being Solved",
        score: 8.5,
        pros: [
          "Spoilage directly eats cash, making farmers highly receptive to software solutions.",
          "Farms currently have zero unified digital route coordination."
        ],
        cons: [
          "Farms are geographically fragmented, increasing driver pickup range constraints."
        ],
        analysis: "Agriculture wastage is a multi-billion dollar friction. Farmers' margins are razor thin. This solves a tangible, high-frequency, highly severe pain point rather than a discretionary 'nice-to-have' feature.",
        recommendation: "Calculate the exact dollars-lost-per-mile currently to present an undeniable ROI during initial sales pitches."
      },
      {
        name: "Target Audience",
        score: 7.0,
        pros: [
          "Suburban grocery store buyers represent high-volume, predictable, repeating demand.",
          "Farmers are tightly knit communities, enabling high word-of-mouth growth."
        ],
        cons: [
          "Farmers are notoriously tech-averse and exhibit long sales cycles."
        ],
        analysis: "Grocers represent an excellent enterprise B2B node. Independent growers are enthusiastic but hard to onboard. The dual-sided nature of agriculture transport requires maintaining high liquidity of both truck drivers and producers simultaneously.",
        recommendation: "Form direct co-op partnerships instead of signing up farmers individually to secure hundreds of growers in single handshakes."
      },
      {
        name: "Market Demand",
        score: 8.0,
        pros: [
          "Local and organic fresh food consumption macro-trends are growing at 12% CAGR.",
          "Stricter corporate supply-chain tracking policies force grocers to audit sourcing."
        ],
        cons: [
          "Seasonal harvest variability introduces massive transaction volume fluctuations."
        ],
        analysis: "The micro-logistics sector is expanding alongside localized sustainable supply mandates. Buyers are happy to pay a flat premium to lock in consistent local supply lines with traceable chains.",
        recommendation: "Transition grocers to fixed recurring monthly delivery allowances to smoothen winter seasonal transaction dips."
      },
      {
        name: "Competitors",
        score: 5.5,
        pros: [
          "B2B regional distributors are massive, slower moving, and rigid.",
          "Existing general-utility couriers ignore farming sector constraints."
        ],
        cons: [
          "Major incumbent logistics networks are starting to offer cold-storage modules.",
          "Local farmers are highly habituated to using Craigslist and Facebook groups manually."
        ],
        analysis: "Traditional ag-logistics players have established long-term regional contracts. While they lack FarmDash's predictive micro-routing software, their sheer size, fleet resources, and established relationships represent a deep protective moat.",
        recommendation: "Do not compete on fleet capacity. Focus entirely on speed-of-transit software APIs, representing a highly specialized 'tech layer' rather than a heavy freight business."
      },
      {
        name: "Uniqueness (USP)",
        score: 6.5,
        pros: [
          "Proprietary dynamic cargo-density matching algorithm.",
          "Traceable ESG metrics on carbon output integrated."
        ],
        cons: [
          "Software code can be copied; network effects require rapid initial scale to achieve defensive moats."
        ],
        analysis: "The Dynamic density-matching routing represents a strong utility USP. However, software itself is vulnerable to clone attempts unless you lock in the geographic hubs.",
        recommendation: "Structure proprietary cargo boxes that fit standard truck beds, creating hardware/software tie-ins that increase switching friction."
      },
      {
        name: "Revenue Model",
        score: 7.5,
        pros: [
          "Standard 15% transactional marketplace rake is highly predictable.",
          "B2B SaaS tier for grocery managers tracks freshness transparently."
        ],
        cons: [
          "Initial liquidity acquisition in regional hubs will require capital subsidization."
        ],
        analysis: "SaaS & Marketplace hybrid is an excellent structure for maximizing capture. Predictable marketplace rakes scale naturally alongside shipping volume, while standard grocer software subscriptions secure baseline organic revenue.",
        recommendation: "Provide initial farmers with free transponders to ensure perfect real-time transport logs, which feed value into the high-margin grocer dashboard."
      },
      {
        name: "Feasibility",
        score: 6.0,
        pros: [
          "Can leverage existing third-party logistics independent contractor couriers.",
          "Web portal requires simple location API setups."
        ],
        cons: [
          "Agricultural route conditions, loading times, and weather factors degrade predictive precision.",
          "Farmers have high churn if software exhibits latency or UI bugs."
        ],
        analysis: "The technical foundation is standard and highly executable. The core friction lies in operations—convincing drivers to run regional agriculture routes over predictable urban food deliveries when gas prices fluctuate.",
        recommendation: "Keep the driver app extremely visual, with minimal text, allowing busy drivers to scan picklist barcodes in less than 3 seconds."
      },
      {
        name: "Scalability",
        score: 8.0,
        pros: [
          "High software product leverage; software scales infinitely across counties.",
          "Farms in similar geographic regions share identical operational bottlenecks."
        ],
        cons: [
          "Expansion to new regions requires setting up local driver hubs individually."
        ],
        analysis: "Once a single agricultural corridor is optimized, the operational playbook translates perfectly to neighboring regions. The tech asset gets stronger as you aggregate anonymized transport times.",
        recommendation: "Target the Pacific Northwest corridor next. Optimize the templates as a 'Turnkey Agri-Logistics Package' for regional councils."
      },
      {
        name: "Risks",
        score: 6.0,
        pros: [
          "Insured logistics policies cover crop spoilage during transits.",
          "Decentralized micro-haul models mitigate single-point-of-failure vulnerabilities."
        ],
        cons: [
          "Fuel inflation directly dampens driver recruitment and shipping frequency.",
          "Stringent food safety certifications (such as FSMA) can impose strict legal fines."
        ],
        analysis: "Cargo risk and perishability are historically risky sectors. Food pathogen regulations are tight. If food spoils during transit and triggers restaurant issues, the liability flows straight to FarmDash unless contract definitions protect the platform.",
        recommendation: "Ensure legal liability waivers specifically locate responsibility on independent couriers during food transits, guarding corporate assets."
      }
    ],
    nextSteps: [
      "Conduct a 30-day manual trial with 5 local farmers and 3 local grocery stores to map baseline transit times.",
      "Integrate standard USDA perishable transport safety contracts into driver terms of service.",
      "Deploy custom RFID temperature log stickers to guarantee freshness at delivery points."
    ]
  }
};

export default function App() {
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Modal state for editing idea name and pitch description
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [errorText, setErrorText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load Saved Ideas on mount
  useEffect(() => {
    const saved = localStorage.getItem("startup_evaluator_ideas");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setSavedIdeas(parsed);
          setActiveIdeaId(parsed[0].id);
        } else {
          loadSeedData();
        }
      } catch (e) {
        loadSeedData();
      }
    } else {
      loadSeedData();
    }
  }, []);

  const loadSeedData = () => {
    const initialList = [SEED_IDEA];
    setSavedIdeas(initialList);
    setActiveIdeaId(SEED_IDEA_ID);
    localStorage.setItem("startup_evaluator_ideas", JSON.stringify(initialList));
  };

  const activeIdea = savedIdeas.find((i: SavedIdea) => i.id === activeIdeaId) || savedIdeas[0];

  // Sync state modifications to localStorage
  const saveAndSync = (updated: SavedIdea[]) => {
    setSavedIdeas(updated);
    localStorage.setItem("startup_evaluator_ideas", JSON.stringify(updated));
  };

  // 1. Create a brand new Session
  const handleNewIdea = () => {
    const newSession: SavedIdea = {
      id: "idea-" + Date.now(),
      name: "New Brainstorm Venture",
      description: "Pitch, explain, or brainstorm your concept in the chat...",
      createdAt: new Date().toISOString(),
      messages: [],
      evaluation: null,
    };
    const updated = [newSession, ...savedIdeas];
    saveAndSync(updated);
    setActiveIdeaId(newSession.id);
  };

  // 2. Select active session
  const handleSelectIdea = (id: string) => {
    setActiveIdeaId(id);
  };

  // 3. Delete a session
  const handleDeleteIdea = (id: string) => {
    const updated = savedIdeas.filter((i: SavedIdea) => i.id !== id);
    if (updated.length === 0) {
      const demo = [SEED_IDEA];
      saveAndSync(demo);
      setActiveIdeaId(SEED_IDEA_ID);
    } else {
      saveAndSync(updated);
      if (activeIdeaId === id) {
        setActiveIdeaId(updated[0].id);
      }
    }
  };

  // 4. Open edit title / description editor
  const handleOpenEditModal = () => {
    if (!activeIdea) return;
    setEditName(activeIdea.name);
    setEditDesc(activeIdea.description);
    setIsEditModalOpen(true);
  };

  // 5. Submit title / description updates
  const handleSaveVentureInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIdea) return;
    
    const updated = savedIdeas.map((i: SavedIdea) => {
      if (i.id === activeIdea.id) {
        return {
          ...i,
          name: editName.trim() || "Brainstorm Venture",
          description: editDesc.trim() || "Pitch, explain, or brainstorm your concept in the chat...",
        };
      }
      return i;
    });

    saveAndSync(updated);
    setIsEditModalOpen(false);
  };

  // 6. Send Chat message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !activeIdea) return;

    // Acknowledge user's input in frontend logs immediately
    const userMsg: Message = {
      id: "u-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    const currentMessages = [...activeIdea.messages, userMsg];
    
    // Auto Update startup pitch if this is the first message or if it looks like a pitch
    let updatedDesc = activeIdea.description;
    if (activeIdea.description.includes("Pitch, explain, or brainstorm") && text.length < 150) {
      updatedDesc = text;
    }

    const updatedIdea: SavedIdea = {
      ...activeIdea,
      description: updatedDesc,
      messages: currentMessages,
    };

    const updatedList = savedIdeas.map((i: SavedIdea) => (i.id === activeIdea.id ? updatedIdea : i));
    saveAndSync(updatedList);
    setErrorText("");
    setIsLoadingChat(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "The network returned an error while processing with Evaluator AI.");
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: "a-" + Date.now(),
        role: "assistant",
        content: data.text || "I was unable to structure an assessment. Let's redirect our dialogue to your product idea.",
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...currentMessages, assistantMsg];
      const finalIdea = { ...updatedIdea, messages: finalMessages };
      
      saveAndSync(savedIdeas.map((i: SavedIdea) => (i.id === activeIdea.id ? finalIdea : i)));
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Unable to reach the server. Let's retry.");
      
      // Fallback message indicating error
      const errorMsg: Message = {
        id: "err-" + Date.now(),
        role: "assistant",
        content: "🚨 Apologies, I'm experiencing a temporary network block. Please ensure your Express Dev Server is running properly and try your inquiry again.",
        timestamp: new Date().toISOString(),
      };
      
      saveAndSync(
        savedIdeas.map((i: SavedIdea) =>
          i.id === activeIdea.id ? { ...updatedIdea, messages: [...currentMessages, errorMsg] } : i
        )
      );
    } finally {
      setIsLoadingChat(false);
    }
  };

  // 7. Core 9-Pillar Diagnostic Generator
  const handleEvaluateIdea = async () => {
    if (!activeIdea) return;
    
    setIsEvaluating(true);
    setErrorText("");

    const chatHistoryText = activeIdea.messages
      .map((m: Message) => `${m.role === "user" ? "Founder" : "VC Advisor"}: ${m.content}`)
      .join("\n\n");

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaName: activeIdea.name,
          pitchText: activeIdea.description,
          chatHistory: chatHistoryText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Unable to complete startup diagnostics. Please retry your evaluation.");
      }

      const evalData: EvaluationResult = await response.json();

      // Deep save updated scorecard to local persistent storage
      const updatedIdea: SavedIdea = {
        ...activeIdea,
        evaluation: evalData,
      };

      // Also append a VC diagnostic alert checkmark inside the advisor chat
      const systemAlertMsg: Message = {
        id: "eval-alert-" + Date.now(),
        role: "assistant",
        content: `📈 **9-Pillar Diagnosis Completed!**\n\nI have generated your structured VC Scorecard with an overall Rating of **${evalData.overallScore.toFixed(1)} / 10**.\n\nReview the Enterprise Scorecard on your right dashboard for detailed progress levels, strategic analyses, target highlights, risk gaps, and customized de-risking prescriptions! Let me know if you want to drill down on any specific dimension.`,
        timestamp: new Date().toISOString()
      };

      updatedIdea.messages = [...updatedIdea.messages, systemAlertMsg];

      saveAndSync(savedIdeas.map((i: SavedIdea) => (i.id === activeIdea.id ? updatedIdea : i)));
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Failed to process structured evaluation API.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden divide-x divide-slate-850">
      
      {/* 1. Left Sidebar: Venture Vault (Visible/Dismissable Sidebar) */}
      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-0 overflow-hidden border-none"
        } shrink-0 h-full transition-all duration-300 ease-in-out z-20 md:block hidden md:w-80`}
      >
        <SavedIdeasPanel
          savedIdeas={savedIdeas}
          activeIdeaId={activeIdeaId}
          onSelectIdea={handleSelectIdea}
          onDeleteIdea={handleDeleteIdea}
          onNewIdea={handleNewIdea}
        />
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Control Bar */}
        <div className="h-14 px-4 border-b border-slate-800 bg-slate-950/70 backdrop-blur flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle for desktop layout */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer md:block hidden"
              title="Toggle Venture Vault Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
            
            {/* Soft text brand label */}
            <h1 className="font-display font-semibold text-sm tracking-wide text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              Startup Idea Evaluator
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Info and Customize action button */}
            <button
              onClick={handleOpenEditModal}
              className="flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-755 text-slate-300 rounded text-xs transition cursor-pointer"
              title="Configure Startup Label & Elevator Pitch"
            >
              <FileEdit className="w-3.5 h-3.5" />
              Edit Pitch Info
            </button>
          </div>
        </div>

        {/* Global Error Notice Bar */}
        {errorText && (
          <div className="bg-rose-950/30 border-b border-rose-900/30 text-rose-400 text-xs px-4 py-2 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorText}</span>
          </div>
        )}

        {/* Two-Pane Workspace Layout (Chat / Scorecard) */}
        {activeIdea ? (
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Left pane: Interactive Dialogue Window */}
            <div className="flex-1 h-full min-w-0">
              <ChatWindow
                idea={activeIdea}
                messages={activeIdea.messages}
                isLoading={isLoadingChat}
                onSendMessage={handleSendMessage}
                onEvaluate={handleEvaluateIdea}
                isEvaluating={isEvaluating}
              />
            </div>

            {/* Right pane: Interactive Scorecard Panel */}
            <div className="w-full lg:w-[480px] xl:w-[500px] h-full shrink-0 border-t lg:border-t-0 border-slate-800 lg:divide-y-0">
              <ScorecardView
                evaluation={activeIdea.evaluation}
                isLoading={isEvaluating}
                ideaName={activeIdea.name}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center py-24 text-center">
            <h3 className="font-display text-base text-slate-400">Loading evaluation models...</h3>
          </div>
        )}
      </div>

      {/* EDIT MODAL DIALOG */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="font-display font-medium text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Venture Parameters
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveVentureInfo} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                  Startup / Concept Title:
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Acme Solar, Agritech Co-op"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                  Core Elevator Pitch:
                </label>
                <textarea
                  required
                  rows={4}              
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Paste your 1-2 sentence core startup concept description. What problem are you solving? Who is the user?"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20 text-slate-100 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-100 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Apply Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

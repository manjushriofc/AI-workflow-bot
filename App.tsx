import React, { useState, useEffect } from 'react';
import { Workflow, WorkflowStep, WorkflowStatus } from './types';
import { generateWorkflowSummary } from './services/geminiService';
import StepVisualizer from './components/StepVisualizer';
import { 
  Plus, 
  Trash2, 
  Bot, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckSquare, 
  User, 
  FileText,
  ChevronRight,
  Layout
} from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  
  // Create Modal State
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  // AI State
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // --- Logic Helpers ---

  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId);

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const isOverdue = (deadline: string, status: WorkflowStatus) => {
    if (status === WorkflowStatus.COMPLETED) return false;
    return new Date() > new Date(deadline);
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflowName || !newStartDate || !newDeadline) return;

    const newWorkflow: Workflow = {
      id: crypto.randomUUID(),
      name: newWorkflowName,
      startDate: newStartDate,
      deadline: newDeadline,
      status: WorkflowStatus.PENDING,
      steps: [],
    };

    setWorkflows([...workflows, newWorkflow]);
    setActiveWorkflowId(newWorkflow.id);
    setIsCreating(false);
    // Reset form
    setNewWorkflowName('');
    setNewStartDate('');
    setNewDeadline('');
  };

  const handleAddStep = () => {
    if (!activeWorkflow) return;
    const newStep: WorkflowStep = {
      id: crypto.randomUUID(),
      name: 'New Step',
      owner: 'Unassigned',
      status: WorkflowStatus.PENDING,
      notes: ''
    };
    
    updateWorkflow(activeWorkflow.id, {
      steps: [...activeWorkflow.steps, newStep]
    });
  };

  const updateWorkflow = (id: string, updates: Partial<Workflow>) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const updateStep = (workflowId: string, stepId: string, updates: Partial<WorkflowStep>) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id !== workflowId) return w;
      const updatedSteps = w.steps.map(s => s.id === stepId ? { ...s, ...updates } : s);
      
      // Auto-update workflow status based on steps? 
      // Simplified logic: If all complete -> Complete. If some started -> In Progress.
      let newStatus = w.status;
      const allComplete = updatedSteps.every(s => s.status === WorkflowStatus.COMPLETED);
      const anyInProgress = updatedSteps.some(s => s.status !== WorkflowStatus.PENDING);

      if (allComplete && updatedSteps.length > 0) newStatus = WorkflowStatus.COMPLETED;
      else if (anyInProgress) newStatus = WorkflowStatus.IN_PROGRESS;

      return { ...w, steps: updatedSteps, status: newStatus };
    }));
  };

  const handleDeleteStep = (workflowId: string, stepId: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id !== workflowId) return w;
      return { ...w, steps: w.steps.filter(s => s.id !== stepId) };
    }));
  };

  const handleGenerateSummary = async () => {
    if (!activeWorkflow) return;
    setIsGeneratingSummary(true);
    const summary = await generateWorkflowSummary(activeWorkflow);
    updateWorkflow(activeWorkflow.id, { aiSummary: summary });
    setIsGeneratingSummary(false);
  };

  // --- Render ---

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-sm md:text-base">
      
      {/* Sidebar - Workflow List */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800">
             <Layout className="w-5 h-5 text-blue-600" />
             <span>Workflow Bot</span>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-blue-600"
            title="Create New Workflow"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {workflows.length === 0 && (
            <div className="text-center mt-10 text-slate-400 text-sm px-4">
              No workflows yet.<br/>Click + to start.
            </div>
          )}
          {workflows.map(wf => (
            <div 
              key={wf.id}
              onClick={() => setActiveWorkflowId(wf.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                activeWorkflowId === wf.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-transparent hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-semibold ${activeWorkflowId === wf.id ? 'text-blue-800' : 'text-slate-700'}`}>
                  {wf.name}
                </h3>
                {isOverdue(wf.deadline, wf.status) && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>{wf.steps.length} Steps</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  wf.status === WorkflowStatus.COMPLETED ? 'bg-green-100 text-green-700' :
                  wf.status === WorkflowStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' : 'bg-slate-100'
                }`}>
                  {wf.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activeWorkflow ? (
          <>
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-start shrink-0">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  {activeWorkflow.name}
                  {isOverdue(activeWorkflow.deadline, activeWorkflow.status) && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md font-medium border border-red-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Overdue
                    </span>
                  )}
                </h1>
                <div className="flex items-center gap-6 mt-2 text-slate-500 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Start: {activeWorkflow.startDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Deadline: {activeWorkflow.deadline}
                  </span>
                  <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    Duration: {calculateDuration(activeWorkflow.startDate, activeWorkflow.deadline)} days
                  </span>
                </div>
              </div>

              <button 
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-sm"
              >
                {isGeneratingSummary ? (
                   <span className="animate-pulse">Analyzing...</span>
                ) : (
                  <>
                    <Bot className="w-5 h-5" /> AI Summary
                  </>
                )}
              </button>
            </header>

            {/* AI Summary Box */}
            {activeWorkflow.aiSummary && (
              <div className="bg-indigo-50 border-b border-indigo-100 p-6 shrink-0">
                <div className="max-w-4xl mx-auto flex gap-4">
                  <div className="bg-white p-2 rounded-full h-fit shadow-sm text-indigo-600">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-indigo-900 font-semibold mb-1">Bot Workflow Analysis</h3>
                    <p className="text-indigo-800 leading-relaxed text-sm">
                      {activeWorkflow.aiSummary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              
              {/* Diagram */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-slate-400" /> 
                  Visual Diagram
                </h2>
                <StepVisualizer steps={activeWorkflow.steps} />
              </section>

              {/* Step Editor */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                 <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-slate-400" /> 
                      Workflow Steps
                    </h2>
                    <button 
                      onClick={handleAddStep}
                      className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Step
                    </button>
                 </div>
                 
                 <div className="divide-y divide-slate-100">
                   {activeWorkflow.steps.length === 0 && (
                     <div className="p-10 text-center text-slate-400">
                        No steps added. Click "Add Step" to build your workflow.
                     </div>
                   )}
                   {activeWorkflow.steps.map((step, index) => (
                     <div key={step.id} className="p-4 hover:bg-slate-50 transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-start group">
                        
                        {/* Step Number */}
                        <div className="hidden md:flex col-span-1 items-center justify-center pt-2">
                           <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                             {index + 1}
                           </span>
                        </div>

                        {/* Step Details Inputs */}
                        <div className="col-span-11 grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-500 flex items-center gap-1">Step Name</label>
                              <input 
                                type="text" 
                                value={step.name} 
                                onChange={(e) => updateStep(activeWorkflow.id, step.id, { name: e.target.value })}
                                className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                           </div>

                           <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-500 flex items-center gap-1"><User className="w-3 h-3" /> Owner</label>
                              <input 
                                type="text" 
                                value={step.owner} 
                                onChange={(e) => updateStep(activeWorkflow.id, step.id, { owner: e.target.value })}
                                className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                           </div>

                           <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-500 flex items-center gap-1">Status</label>
                              <select 
                                value={step.status}
                                onChange={(e) => updateStep(activeWorkflow.id, step.id, { status: e.target.value as WorkflowStatus })}
                                className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                              >
                                {Object.values(WorkflowStatus).map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                           </div>

                           <div className="col-span-full md:col-span-3 space-y-1">
                              <label className="text-xs font-medium text-slate-500 flex items-center gap-1"><FileText className="w-3 h-3" /> Notes</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={step.notes} 
                                  placeholder="Add notes or requirements..."
                                  onChange={(e) => updateStep(activeWorkflow.id, step.id, { notes: e.target.value })}
                                  className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button 
                                  onClick={() => handleDeleteStep(activeWorkflow.id, step.id)}
                                  className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded transition-colors"
                                  title="Delete Step"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
              </section>

            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
             <Layout className="w-16 h-16 mb-4 text-slate-200" />
             <p>Select a workflow or create a new one.</p>
          </div>
        )}

        {/* Create Modal */}
        {isCreating && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
               <h2 className="text-xl font-bold text-slate-800 mb-4">New Workflow</h2>
               <form onSubmit={handleCreateWorkflow} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Workflow Name</label>
                    <input 
                      type="text" 
                      required
                      value={newWorkflowName}
                      onChange={e => setNewWorkflowName(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Employee Onboarding"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                      <input 
                        type="date" 
                        required
                        value={newStartDate}
                        onChange={e => setNewStartDate(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                      <input 
                        type="date" 
                        required
                        value={newDeadline}
                        onChange={e => setNewDeadline(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsCreating(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                      Create Workflow
                    </button>
                  </div>
               </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
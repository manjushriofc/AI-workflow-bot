import React from 'react';
import { WorkflowStep, WorkflowStatus } from '../types';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface StepVisualizerProps {
  steps: WorkflowStep[];
}

const StepVisualizer: React.FC<StepVisualizerProps> = ({ steps }) => {
  if (steps.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 bg-slate-50">
        No steps defined yet. Add steps to visualize the workflow.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="flex items-start min-w-max px-4">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          let icon;
          let colorClass;
          let barColor;

          switch (step.status) {
            case WorkflowStatus.COMPLETED:
              icon = <CheckCircle className="w-6 h-6 text-white" />;
              colorClass = "bg-green-500 border-green-600";
              barColor = "bg-green-500";
              break;
            case WorkflowStatus.IN_PROGRESS:
              icon = <Clock className="w-6 h-6 text-white" />;
              colorClass = "bg-blue-500 border-blue-600";
              barColor = "bg-slate-200"; // Next bar is grey until complete
              break;
            default:
              icon = <Circle className="w-6 h-6 text-slate-400" />;
              colorClass = "bg-white border-slate-300";
              barColor = "bg-slate-200";
          }

          return (
            <div key={step.id} className="relative flex flex-col items-center group w-48">
              {/* Connector Line */}
              {!isLast && (
                <div className={`absolute top-5 left-1/2 w-full h-1 ${barColor} -z-10`} />
              )}
              
              {/* Node Circle */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 z-10 transition-colors duration-300 shadow-sm ${colorClass}`}>
                 {step.status === WorkflowStatus.PENDING ? <span className="text-slate-500 font-bold text-sm">{index + 1}</span> : icon}
              </div>

              {/* Step Info */}
              <div className="mt-3 text-center px-2">
                <p className="font-semibold text-slate-800 text-sm truncate w-full" title={step.name}>
                  {step.name}
                </p>
                <p className="text-xs text-slate-500 truncate" title={step.owner}>
                  {step.owner || "Unassigned"}
                </p>
                <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full border ${
                  step.status === WorkflowStatus.COMPLETED ? 'bg-green-50 text-green-700 border-green-200' :
                  step.status === WorkflowStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {step.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepVisualizer;
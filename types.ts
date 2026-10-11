export enum WorkflowStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface WorkflowStep {
  id: string;
  name: string;
  owner: string;
  status: WorkflowStatus;
  notes: string;
}

export interface Workflow {
  id: string;
  name: string;
  startDate: string; // ISO Date string
  deadline: string; // ISO Date string
  status: WorkflowStatus;
  steps: WorkflowStep[];
  aiSummary?: string;
}

export interface CreateWorkflowDTO {
  name: string;
  startDate: string;
  deadline: string;
}
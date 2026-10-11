import { GoogleGenAI } from "@google/genai";
import { Workflow } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWorkflowSummary = async (workflow: Workflow): Promise<string> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const isDelayed = new Date(today) > new Date(workflow.deadline) && workflow.status !== 'Completed';

    const prompt = `
      You are an AI Workflow Bot Manager. Analyze the following workflow data and provide a concise professional summary.
      
      Current Date: ${today}
      Workflow Data: ${JSON.stringify(workflow)}
      
      Requirements:
      1. Summarize the overall progress (completion percentage).
      2. Identify the current bottleneck (the first step that is not completed).
      3. Explicitly state if the workflow is DELAYED based on the deadline vs current date.
      4. Provide a recommendation for the workflow owner.
      5. Keep it under 150 words. Do not use markdown formatting like bold or headers, just plain text paragraphs.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate summary.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error: Could not connect to AI service. Please check your API key.";
  }
};
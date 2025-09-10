
import React, { useState } from 'react';
import type { LogEntry } from '../types';
import { getProductionAnalysis } from '../services/geminiService';

interface AIAnalysisProps {
  data: LogEntry[];
}

const suggestions = [
  {
    label: "Identify Top 3 Downtime Causes",
    prompt: `Based on the provided production log data, identify the top 3 events that cause the most downtime (excluding 'Produktion'). For each, list the total time lost and the number of occurrences. Provide a brief one-sentence summary of the main issue. Format the response as a simple markdown list.`,
  },
  {
    label: "Summarize Production Efficiency",
    prompt: `Analyze the provided production data. Calculate the overall production efficiency percentage (Production Time / Total Time). Provide a concise summary of the key factors impacting this efficiency, both positive and negative.`,
  },
  {
    label: "Compare Operator Performance",
    prompt: `Using the provided production log data, analyze and compare the performance of different operators on similar tasks (e.g., 'Reinigung', 'Rollen wechsel'). Identify which operators are most efficient on average for these tasks. Present the result in a simple ranked list. Do not include system users like 'GUARDUS' or 'SYSTEM'.`,
  },
];


const AIAnalysis: React.FC<AIAnalysisProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState('');
  const [error, setError] = useState('');

  const createSummaryForAI = () => {
     // Create a concise summary string from the data for the AI prompt
    return data.slice(0, 100).map(entry => {
        return `${entry.startTime.toISOString()};${entry.eventName};${entry.durationMinutes.toFixed(2)};${entry.employeeName}`;
    }).join('\n');
  }

  const handleAnalyze = async (promptTemplate?: string) => {
    setIsLoading(true);
    setInsights('');
    setError('');

    try {
      const dataSummary = createSummaryForAI();
      
      let finalPrompt = promptTemplate;
      
      if (!finalPrompt) {
        finalPrompt = `
        You are an industrial production efficiency expert. 
        Analyze the following summary of production line log events.
        Each line contains: Start Time; Event Name; Duration in Minutes; Employee Name.

        Log Data Summary:
        ${dataSummary}

        Based on this data, provide:
        1.  **Key Insights:** A brief, high-level summary of the production bottlenecks.
        2.  **Potential Root Causes:** For the top 2-3 events, suggest potential root causes.
        3.  **Actionable Recommendations:** Suggest 3 concrete, actionable steps the production manager could take to improve efficiency.

        Format your response clearly with markdown headings for each section.
      `;
      } else {
         finalPrompt += `\n\nHere is a summary of the log data to use for your analysis:\n${dataSummary}`;
      }
      
      const result = await getProductionAnalysis(finalPrompt);
      setInsights(result);
    } catch (err) {
      console.error(err);
      setError('Failed to get insights from AI. Please check the API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-xl border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <h3 className="text-xl font-semibold text-white mb-4 sm:mb-0">AI-Powered Insights</h3>
        <button
          onClick={() => handleAnalyze()}
          disabled={isLoading || data.length === 0}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing with Gemini...
            </>
          ) : (
            "Generate General Analysis"
          )}
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="text-md font-semibold text-white mb-3">Or try a specific suggestion:</h4>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleAnalyze(s.prompt)}
              disabled={isLoading || data.length === 0}
              className="px-3 py-1.5 border border-gray-600 text-xs font-medium rounded-md shadow-sm text-gray-300 bg-gray-700/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-red-400">{error}</p>}
      
      {insights && (
        <div className="mt-6 p-4 bg-gray-900/50 rounded-md border border-gray-600">
          <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm leading-relaxed">
            {insights}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;

import React, { useState, useEffect } from 'react';
import type { LogEntry } from '../types';
import { getProductionAnalysisStream } from '../services/geminiService';
import { useProductionDataAnalysis } from '../hooks/useProductionDataAnalysis';

interface AIAnalysisProps {
  data: LogEntry[];
  initialInsights: string;
  isInitiallyLoading: boolean;
}

const suggestions = [
  {
    label: "Identify Top 3 Downtime Causes",
    prompt: `Based on the provided production log data summary, identify the top 3 events that cause the most downtime (excluding 'Produktion'). For each, list the total time lost and the number of occurrences. Provide a brief one-sentence summary of the main issue. Format the response as a simple markdown list.`,
  },
  {
    label: "Summarize Production Efficiency",
    prompt: `Analyze the provided production data summary. Calculate the overall production efficiency percentage (Production Time / Total Time). Provide a concise summary of the key factors impacting this efficiency, both positive and negative.`,
  },
  {
    label: "Compare Operator Performance",
    prompt: `Using the provided production log data, analyze and compare the performance of different operators on similar tasks (e.g., 'Reinigung', 'Rollen wechsel'). Identify which operators are most efficient on average for these tasks. Present the result in a simple ranked list. Do not include system users like 'GUARDUS' or 'SYSTEM'.`,
  },
];

const BlinkingCursor = () => <span className="inline-block w-2 h-5 bg-indigo-500 animate-pulse ml-1"></span>;

const AIAnalysis: React.FC<AIAnalysisProps> = ({ data, initialInsights, isInitiallyLoading }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState('');
  const [error, setError] = useState('');
  
  const analysis = useProductionDataAnalysis(data);

  useEffect(() => {
    setInsights(initialInsights);
  }, [initialInsights])


  const createSummaryForAI = () => {
    const { summary, eventBreakdown } = analysis;
    const topEvents = eventBreakdown.slice(0, 10).map(e => `  - ${e.name}: ${e.duration.toFixed(2)} mins total, ${e.count} occurrences`).join('\n');

    return `
      - Total Duration: ${summary.totalDuration.toFixed(2)} minutes
      - Production Duration: ${summary.productionDuration.toFixed(2)} minutes
      - Downtime Duration: ${summary.downtimeDuration.toFixed(2)} minutes
      - Overall Efficiency: ${((summary.productionDuration / summary.totalDuration) * 100).toFixed(1)}%
      - Top 10 Events by Duration:
      ${topEvents}
    `;
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

        Production Data Summary:
        ${dataSummary}

        Based on this data, provide:
        1.  **Key Insights:** A brief, high-level summary of the production bottlenecks.
        2.  **Potential Root Causes:** For the top 2-3 events, suggest potential root causes.
        3.  **Actionable Recommendations:** Suggest 3 concrete, actionable steps the production manager could take to improve efficiency.

        Format your response clearly with markdown headings, lists, and bold text.
      `;
      } else {
         finalPrompt += `\n\nHere is a summary of the log data to use for your analysis:\n${dataSummary}`;
      }
      
      const stream = getProductionAnalysisStream(finalPrompt);
      for await (const chunk of stream) {
        setInsights(prev => prev + chunk);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to get insights from AI. Please check the API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showSkeleton = isInitiallyLoading;

  return (
    <div className="themed-bg-secondary p-6 rounded-lg shadow-lg border themed-border-primary">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <h3 className="text-2xl font-semibold themed-text-primary mb-4 sm:mb-0 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.9333 22.8021C12.9333 22.8021 13.5625 20.4438 14.8208 19.1854C16.0792 17.9271 18.4375 17.2979 18.4375 17.2979C18.4375 17.2979 17.8083 19.6563 16.55 20.9146C15.2917 22.1729 12.9333 22.8021 12.9333 22.8021Z" fill="#818CF8" />
          <path d="M12.9333 1.19792C12.9333 1.19792 13.5625 3.55625 14.8208 4.81458C16.0792 6.07292 18.4375 6.70208 18.4375 6.70208C18.4375 6.70208 17.8083 4.34375 16.55 3.08542C15.2917 1.82708 12.9333 1.19792 12.9333 1.19792Z" fill="#C4B5FD" />
          <path d="M1.19792 11.0667C1.19792 11.0667 3.55625 10.4375 4.81458 9.17917C6.07292 7.92083 6.70208 5.5625 6.70208 5.5625C6.70208 5.5625 4.34375 6.19167 3.08542 7.45C1.82708 8.70833 1.19792 11.0667 1.19792 11.0667Z" fill="#A78BFA" />
          <path d="M22.8021 11.0667C22.8021 11.0667 20.4438 10.4375 19.1854 9.17917C17.9271 7.92083 17.2979 5.5625 17.2979 5.5625C17.2979 5.5625 19.6563 6.19167 20.9146 7.45C22.1729 8.70833 22.8021 11.0667 22.8021 11.0667Z" fill="#8B5CF6" />
        </svg>
        AI-Powered Insights</h3>
        <button
          onClick={() => handleAnalyze()}
          disabled={isLoading || data.length === 0 || isInitiallyLoading}
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            "Generate General Analysis"
          )}
        </button>
      </div>

      <div className="mt-4 pt-4 border-t themed-border-primary">
        <h4 className="text-lg font-semibold themed-text-primary mb-3">Or try a specific suggestion:</h4>
        <div className="flex flex-wrap gap-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleAnalyze(s.prompt)}
              disabled={isLoading || data.length === 0 || isInitiallyLoading}
              className="px-4 py-2 border themed-border-primary text-sm font-medium rounded-md shadow-sm themed-text-secondary bg-gray-100/50 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-red-500 dark:text-red-400">{error}</p>}
      
      <div className="mt-6">
        {showSkeleton && (
           <div className="space-y-4">
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
            </div>
        )}
        {(!showSkeleton && insights) && (
            <div className="p-5 bg-gray-100/50 dark:bg-gray-900/50 rounded-md border themed-border-primary min-h-[120px]">
              <div
                className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-semibold"
                dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }}
              />
               {isLoading && <BlinkingCursor />}
            </div>
        )}
      </div>

    </div>
  );
};

export default AIAnalysis;

import React, { useState, useMemo, useEffect } from 'react';
import type { LogEntry } from './types';
import { parseData } from './services/dataParser';
import Dashboard from './components/Dashboard';
import FullDataTable from './components/FullDataTable';
import AIAnalysis from './components/AIAnalysis';
import Header from './components/Header';
import { useProductionDataAnalysis } from './hooks/useProductionDataAnalysis';
import { getProductionAnalysisStream } from './services/geminiService';
import SkeletonLoader from './components/SkeletonLoader';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  const [data, setData] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [initialInsights, setInitialInsights] = useState<string>('');

  const analysis = useProductionDataAnalysis(data);

  useEffect(() => {
    if (data.length > 0) {
      const fetchInitialInsights = async () => {
        setIsAiLoading(true);
        setInitialInsights('');
        try {
          const prompt = `
            Analyze the following production data summary and provide a brief, high-level overview of the key findings. 
            Focus on the most significant downtime cause and the overall efficiency.
            
            - Total Events: ${analysis.summary.totalEvents}
            - Total Duration: ${analysis.summary.totalDuration.toFixed(2)} minutes
            - Production Duration: ${analysis.summary.productionDuration.toFixed(2)} minutes
            - Downtime Duration: ${analysis.summary.downtimeDuration.toFixed(2)} minutes
            - Top Event by Duration: ${analysis.eventBreakdown[0]?.name} (${analysis.eventBreakdown[0]?.duration.toFixed(2)} min)

            Provide a 2-3 sentence summary in markdown format.`;

            const stream = getProductionAnalysisStream(prompt);
            for await (const chunk of stream) {
              setInitialInsights(prev => prev + chunk);
            }
        } catch (err) {
          console.error("Initial AI analysis failed", err);
        } finally {
          setIsAiLoading(false);
        }
      };
      fetchInitialInsights();
    }
  }, [data, analysis.summary.totalEvents]);


  const handleFileUpload = (file: File) => {
    setIsLoading(true);
    setError(null);
    setData([]);
    setInitialInsights('');
    setFileName(file.name);
    setStartDate('');
    setEndDate('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsedData = parseData(text);
        setData(parsedData);
      } catch (err) {
        setError('Failed to parse the data file. Please ensure it is a valid semicolon-separated text file.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  const filteredData = useMemo(() => {
    if (!startDate && !endDate) {
      return data;
    }
    const start = startDate ? new Date(startDate).getTime() : -Infinity;
    const end = endDate ? new Date(endDate).getTime() : Infinity;

    return data.filter(entry => {
      const entryTime = entry.startTime.getTime();
      return entryTime >= start && entryTime <= end;
    });
  }, [data, startDate, endDate]);

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans">
      <Header
        data={data}
        fileName={fileName}
        isLoading={isLoading}
        onFileUpload={handleFileUpload}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onResetFilters={handleResetFilters}
      />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {data.length === 0 && !isLoading && !error && (
           <div className="text-center py-16 px-6 themed-bg-secondary rounded-lg border-2 border-dashed themed-border-primary">
             <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
             <h3 className="mt-2 text-2xl font-medium themed-text-primary">No Data Uploaded</h3>
             <p className="mt-1 text-lg themed-text-secondary">Upload a production log file to begin analysis.</p>
             <div className="mt-6">
               <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
             </div>
           </div>
        )}

        {isLoading && <SkeletonLoader />}
        
        {data.length > 0 && !isLoading && (
          <div className="space-y-8">
            <Dashboard data={filteredData} />
            <AIAnalysis data={filteredData} initialInsights={initialInsights} isInitiallyLoading={isAiLoading} />
            <FullDataTable data={filteredData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

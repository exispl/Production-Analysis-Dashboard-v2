import React, { useState, useMemo } from 'react';
import type { LogEntry } from './types';
import { parseData } from './services/dataParser';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import FullDataTable from './components/FullDataTable';
import AIAnalysis from './components/AIAnalysis';

const App: React.FC = () => {
  const [data, setData] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleFileUpload = (file: File) => {
    setIsLoading(true);
    setError(null);
    setData([]);
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
  
  const uniqueOrder = data.length > 0 ? data[0].orderId : 'N/A';
  const productionUnit = data.length > 0 ? data[0].productionUnit : 'N/A';
  const partNumber = data.length > 0 ? data[0].partNumber : 'N/A';
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-20 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">Production Analysis Dashboard</h1>
            <div className="flex items-center gap-4">
              <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
            </div>
          </div>
          {data.length > 0 && (
             <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                    <p><span className="font-semibold text-gray-200">File:</span> {fileName}</p>
                    <p><span className="font-semibold text-gray-200">Prod. Auftrag:</span> {uniqueOrder}</p>
                    <p><span className="font-semibold text-gray-200">Prod. Einheit:</span> {productionUnit}</p>
                    <p><span className="font-semibold text-gray-200">Prod. Art-Nr:</span> {partNumber}</p>
                </div>
                 <div className="flex flex-wrap items-end gap-4 pt-4 border-t border-gray-700">
                    <div className="flex-grow">
                        <label htmlFor="startDate" className="block text-xs font-medium text-gray-400 mb-1">Start Date & Time</label>
                        <input 
                            type="datetime-local" 
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-md shadow-sm w-full py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        />
                    </div>
                     <div className="flex-grow">
                        <label htmlFor="endDate" className="block text-xs font-medium text-gray-400 mb-1">End Date & Time</label>
                        <input 
                            type="datetime-local" 
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                             min={startDate}
                            className="bg-gray-700 border border-gray-600 rounded-md shadow-sm w-full py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        />
                    </div>
                    <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors"
                    >
                        Reset Filters
                    </button>
                 </div>
             </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {data.length === 0 && !isLoading && !error && (
           <div className="text-center py-16 px-6 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
             <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
             <h3 className="mt-2 text-lg font-medium text-white">No Data Uploaded</h3>
             <p className="mt-1 text-sm text-gray-400">Upload a production log file to begin analysis.</p>
             <div className="mt-6">
               <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
             </div>
           </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
             <p className="ml-4 text-lg">Analyzing Data...</p>
          </div>
        )}
        
        {data.length > 0 && !isLoading && (
          <div className="space-y-8">
            <Dashboard data={filteredData} />
            <AIAnalysis data={filteredData} />
            <FullDataTable data={filteredData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

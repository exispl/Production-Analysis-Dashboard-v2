import React from 'react';
import FileUpload from './FileUpload';
import { useTheme, Theme } from '../contexts/ThemeContext';
import type { LogEntry } from '../types';

interface HeaderProps {
    data: LogEntry[];
    fileName: string;
    isLoading: boolean;
    onFileUpload: (file: File) => void;
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onResetFilters: () => void;
}

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const themes: { name: Theme; icon: JSX.Element }[] = [
        { name: 'light', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
        { name: 'dark', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> },
        { name: 'classic', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
    ];

    return (
        <div className="flex items-center p-1 rounded-full bg-gray-200 dark:bg-gray-700 classic:bg-gray-400">
            {themes.map(t => (
                <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    className={`p-2 rounded-full transition-colors duration-200 ${theme === t.name ? 'bg-white text-cyan-600 shadow-md dark:bg-gray-900 classic:bg-white' : 'text-gray-600 dark:text-gray-300 classic:text-black hover:bg-white/50 dark:hover:bg-gray-600/50 classic:hover:bg-gray-500/50'}`}
                    aria-label={`Switch to ${t.name} theme`}
                >
                    {t.icon}
                </button>
            ))}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({
    data,
    fileName,
    isLoading,
    onFileUpload,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onResetFilters,
}) => {
    const uniqueOrder = data.length > 0 ? data[0].orderId : 'N/A';
    const productionUnit = data.length > 0 ? data[0].productionUnit : 'N/A';
    const partNumber = data.length > 0 ? data[0].partNumber : 'N/A';

    return (
        <header className="themed-bg-secondary backdrop-blur-sm sticky top-0 z-20 shadow-md border-b themed-border-primary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <h1 className="text-4xl font-extrabold themed-text-primary tracking-tight">
                        Production Analyzer
                    </h1>
                    <div className="flex items-center gap-4">
                        <FileUpload onFileUpload={onFileUpload} isLoading={isLoading} />
                        <ThemeSwitcher />
                    </div>
                </div>
                {data.length > 0 && (
                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base themed-text-secondary">
                            <p><span className="font-semibold themed-text-primary">File:</span> {fileName}</p>
                            <p><span className="font-semibold themed-text-primary">Prod. Auftrag:</span> {uniqueOrder}</p>
                            <p><span className="font-semibold themed-text-primary">Prod. Einheit:</span> {productionUnit}</p>
                            <p><span className="font-semibold themed-text-primary">Prod. Art-Nr:</span> {partNumber}</p>
                        </div>
                        <div className="flex flex-wrap items-end gap-4 pt-4 border-t themed-border-primary">
                            <div className="flex-grow">
                                <label htmlFor="startDate" className="block text-sm font-medium themed-text-secondary mb-1">Start Date & Time</label>
                                <input
                                    type="datetime-local"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => onStartDateChange(e.target.value)}
                                    className="themed-bg-primary border themed-border-primary rounded-md shadow-sm w-full py-2 px-3 themed-text-primary focus:outline-none focus:ring-2 ring-offset-2 ring-offset-current focus:ring-[var(--ring-color)] text-base"
                                />
                            </div>
                            <div className="flex-grow">
                                <label htmlFor="endDate" className="block text-sm font-medium themed-text-secondary mb-1">End Date & Time</label>
                                <input
                                    type="datetime-local"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => onEndDateChange(e.target.value)}
                                    min={startDate}
                                    className="themed-bg-primary border themed-border-primary rounded-md shadow-sm w-full py-2 px-3 themed-text-primary focus:outline-none focus:ring-2 ring-offset-2 ring-offset-current focus:ring-[var(--ring-color)] text-base"
                                />
                            </div>
                            <button
                                onClick={onResetFilters}
                                className="px-4 py-2 border themed-border-primary text-base font-medium rounded-md shadow-sm themed-text-secondary themed-bg-secondary hover:bg-gray-100 dark:hover:bg-gray-700 classic:hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-current focus:ring-[var(--ring-color)] transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

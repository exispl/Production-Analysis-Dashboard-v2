import React from 'react';

const SkeletonCard = () => (
    <div className="themed-bg-secondary rounded-lg p-6 shadow-md border-l-4 themed-border-primary">
        <div className="h-5 bg-gray-300 dark:bg-gray-700 classic:bg-gray-400 rounded w-1/3 animate-pulse"></div>
        <div className="h-10 bg-gray-300/70 dark:bg-gray-600/70 classic:bg-gray-400/70 rounded w-1/2 mt-4 animate-pulse"></div>
    </div>
);

const SkeletonChart = ({ className }: { className: string }) => (
    <div className={`${className} themed-bg-secondary p-6 rounded-lg shadow-lg border themed-border-primary flex flex-col`}>
        <div className="h-7 bg-gray-300 dark:bg-gray-600 classic:bg-gray-400 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="flex-grow bg-gray-200 dark:bg-gray-700 classic:bg-gray-300 rounded animate-pulse"></div>
    </div>
);

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-8">
        {/* Skeleton for Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
        
        {/* Skeleton for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <SkeletonChart className="lg:col-span-3" />
            <SkeletonChart className="lg:col-span-2" />
        </div>

        {/* Skeleton for AI Analysis */}
        <div className="themed-bg-secondary p-6 rounded-lg shadow-lg border themed-border-primary">
            <div className="h-7 bg-gray-300 dark:bg-gray-600 classic:bg-gray-400 rounded w-1/3 animate-pulse"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 classic:bg-gray-300 rounded w-full mt-4 animate-pulse"></div>
            <div className="h-5 bg-gray-200/50 dark:bg-gray-700/50 classic:bg-gray-300/50 rounded w-5/6 mt-2 animate-pulse"></div>
        </div>

        {/* Skeleton for Full Data Table */}
        <div className="themed-bg-secondary p-6 rounded-lg shadow-lg border themed-border-primary">
             <div className="h-7 bg-gray-300 dark:bg-gray-600 classic:bg-gray-400 rounded w-1/4 mb-4 animate-pulse"></div>
             <div className="space-y-3">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 classic:bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200/50 dark:bg-gray-700/50 classic:bg-gray-300/50 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 classic:bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200/50 dark:bg-gray-700/50 classic:bg-gray-300/50 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 classic:bg-gray-300 rounded animate-pulse"></div>
             </div>
        </div>
    </div>
  );
};

export default SkeletonLoader;

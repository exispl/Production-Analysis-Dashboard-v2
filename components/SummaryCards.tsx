import React from 'react';

interface Summary {
  totalDuration: number;
  productionDuration: number;
  downtimeDuration: number;
  totalEvents: number;
}

interface SummaryCardsProps {
  summary: Summary;
}

const formatDuration = (minutes: number): string => {
    if (minutes < 1) return '< 1m';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

const CardIcon = ({ icon }: { icon: JSX.Element }) => (
    <div className="absolute top-4 right-4 text-gray-400/10 dark:text-white/5">
        {React.cloneElement(icon, { className: "h-20 w-20" })}
    </div>
);

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const { totalDuration, productionDuration, downtimeDuration } = summary;
  
  const productionPercentage = totalDuration > 0 ? (productionDuration / totalDuration) * 100 : 0;

  const cards = [
    { 
        title: 'Total Logged Time', 
        value: formatDuration(totalDuration), 
        color: 'border-slate-500', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
        tooltip: "Total duration of all logged events."
    },
    { 
        title: 'Total Production Time', 
        value: formatDuration(productionDuration), 
        color: 'border-green-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>,
        tooltip: "Total time where the event was 'Produktion'."
    },
    { 
        title: 'Total Downtime', 
        value: formatDuration(downtimeDuration), 
        color: 'border-red-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>,
        tooltip: "Total time for all non-production events."
    },
    { 
        title: 'Overall Efficiency', 
        value: `${productionPercentage.toFixed(1)}%`, 
        color: 'border-cyan-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>,
        tooltip: "Percentage of total time spent in production."
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className={`relative themed-bg-secondary rounded-lg p-6 shadow-md border-l-8 ${card.color} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
          <CardIcon icon={card.icon} />
          <div className="relative" title={card.tooltip}>
            <h4 className="text-lg font-medium themed-text-secondary">{card.title}</h4>
            <p className="mt-2 text-5xl font-bold themed-text-primary">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;

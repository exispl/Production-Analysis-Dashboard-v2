
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
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const { totalDuration, productionDuration, downtimeDuration, totalEvents } = summary;
  
  const productionPercentage = totalDuration > 0 ? (productionDuration / totalDuration) * 100 : 0;

  const cards = [
    { title: 'Total Logged Time', value: formatDuration(totalDuration), color: 'border-gray-600' },
    { title: 'Total Production Time', value: formatDuration(productionDuration), color: 'border-green-500' },
    { title: 'Total Downtime', value: formatDuration(downtimeDuration), color: 'border-red-500' },
    { title: 'Overall Efficiency', value: `${productionPercentage.toFixed(1)}%`, color: 'border-cyan-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className={`bg-gray-800/50 rounded-lg p-6 shadow-lg border-l-4 ${card.color}`}>
          <h4 className="text-sm font-medium text-gray-400">{card.title}</h4>
          <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { getEventColor } from '../utils/colorUtils';

interface EventData {
  name: string;
  duration: number;
  count: number;
}

interface EventBreakdownChartProps {
  data: EventData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border themed-border-primary rounded-lg shadow-lg text-base">
        <p className="label font-bold themed-text-primary">{`${label}`}</p>
        <p className="themed-text-secondary">{`Total Duration: ${data.duration.toFixed(2)} mins`}</p>
        <p className="themed-text-muted">{`Occurrences: ${data.count}`}</p>
      </div>
    );
  }
  return null;
};

const EventBreakdownChart: React.FC<EventBreakdownChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#9CA3AF' : theme === 'light' ? '#4B5563' : '#000000';
  const gridColor = theme === 'dark' ? '#4A5568' : theme === 'light' ? '#E5E7EB' : '#808080';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis type="number" stroke={tickColor} unit="m" />
        <YAxis dataKey="name" type="category" stroke={tickColor} width={150} tick={{fontSize: 14}}/>
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
        <Legend wrapperStyle={{fontSize: "14px", paddingTop: "20px"}}/>
        <Bar dataKey="duration" name="Total Duration (mins)">
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getEventColor(entry.name).chart} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EventBreakdownChart;

export const getEventColor = (eventName: string): { bg: string; text: string; chart: string } => {
    const lowerEventName = eventName.toLowerCase();

    if (lowerEventName.includes('produktion')) {
        return { bg: 'bg-green-500', text: 'text-green-800', chart: '#22C55E' };
    }
    if (lowerEventName.includes('rüsten') || lowerEventName.includes('rollen wechsel') || lowerEventName.includes('wartet')) {
        return { bg: 'bg-cyan-500', text: 'text-cyan-800', chart: '#06B6D4' };
    }
    if (lowerEventName.includes('störung') || lowerEventName.includes('problem') || lowerEventName.includes('defekt') || lowerEventName.includes('unterbrechung')) {
        return { bg: 'bg-red-500', text: 'text-red-800', chart: '#EF4444' };
    }
    if (lowerEventName.includes('technische') || lowerEventName.includes('kein einrichter') || lowerEventName.includes('kein material')) {
        return { bg: 'bg-yellow-500', text: 'text-yellow-800', chart: '#EAB308' };
    }
    if (lowerEventName.includes('reinigung')) {
        return { bg: 'bg-blue-500', text: 'text-blue-800', chart: '#3B82F6' };
    }
    
    return { bg: 'bg-gray-500', text: 'text-gray-800', chart: '#6B7280' };
};

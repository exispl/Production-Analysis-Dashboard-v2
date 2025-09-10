
import type { LogEntry } from '../types';

function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null;
  const parts = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
  if (!parts) return null;
  // parts[2] is month, which is 0-indexed in JS Date
  return new Date(+parts[3], +parts[2] - 1, +parts[1], +parts[4], +parts[5], +parts[6]);
}

export const parseData = (text: string): LogEntry[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  return lines.map((line, index) => {
    const columns = line.split(';');

    const startTime = parseDate(columns[2]);
    const endTime = parseDate(columns[3]);

    let durationMinutes = 0;
    if (startTime && endTime) {
      durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    } else if (columns[9]) {
        // Fallback to provided duration if dates are invalid
        const durationStr = columns[9].replace(',', '.').trim();
        durationMinutes = parseFloat(durationStr) || 0;
    }


    const entry: LogEntry = {
      id: `${index}-${columns[1]}`,
      orderId: columns[0] || 'N/A',
      partNumber: columns[1] || 'N/A',
      startTime: startTime || new Date(),
      endTime: endTime,
      durationMinutes: durationMinutes,
      eventCode: columns[4] || 'N/A',
      eventName: columns[5] || 'Unknown Event',
      eventText: columns[6] || '',
      employeeId: columns[7] || 'N/A',
      employeeName: columns[8] || 'SYSTEM',
      productionUnit: columns[12] || 'N/A',
      operation: columns[13] || 'N/A',
    };
    return entry;
  }).filter(entry => entry.startTime);
};

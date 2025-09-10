
export interface LogEntry {
  id: string;
  orderId: string;
  partNumber: string;
  startTime: Date;
  endTime: Date | null;
  durationMinutes: number;
  eventCode: string;
  eventName: string;
  eventText: string;
  employeeId: string;
  employeeName: string;
  productionUnit: string;
  operation: string;
}

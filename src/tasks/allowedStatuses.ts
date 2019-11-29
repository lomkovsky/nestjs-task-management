import { TaskStatus } from './task.model';
export const allowedStatuses = [
  TaskStatus.OPEN,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
];

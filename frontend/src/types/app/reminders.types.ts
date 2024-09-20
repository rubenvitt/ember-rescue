export interface ReminderDto {
  id: string;
  noteId: string;
  reminderTimestamp: Date;
  notified?: Date;
  read?: Date;
}

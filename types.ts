export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export enum TopicStatus {
  New = 'New',
  Revision = 'Revision',
  Practice = 'Practice',
  Completed = 'Completed'
}

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export interface Topic {
  id: string;
  name: string;
  estimatedHours: number;
  status: TopicStatus;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  difficulty: Difficulty;
  color: string;
  topics: Topic[];
}

export interface BusyBlock {
  id: string;
  title: string;
  day: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  type: 'Class' | 'Tuition' | 'Personal' | 'Sleep';
}

export interface Exam {
  id: string;
  subjectId: string;
  date: string; // ISO Date string
  title: string;
  importance: 'Low' | 'Medium' | 'High';
}

export interface StudySession {
  id: string;
  date: string; // ISO Date
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  topicIds: string[]; // Topics to cover
  type: TopicStatus;
  isDone: boolean;
  notes?: string;
}

export interface UserPreferences {
  maxHoursPerDay: number;
  preferredStartHour: number; // 0-23
  preferredEndHour: number;   // 0-23
}

export interface AppData {
  subjects: Subject[];
  busyBlocks: BusyBlock[];
  exams: Exam[];
  schedule: StudySession[];
  preferences: UserPreferences;
}

import { AppData, DayOfWeek, Difficulty, TopicStatus } from "../types";

const STORAGE_KEY = "studyflow_data_v1";

const DEFAULT_DATA: AppData = {
  subjects: [
    {
      id: "sub_1",
      name: "Computer Science 101",
      difficulty: Difficulty.Medium,
      color: "#6366f1",
      topics: [
        { id: "t1", name: "Data Structures", estimatedHours: 2, status: TopicStatus.New, completed: false },
        { id: "t2", name: "Algorithms", estimatedHours: 3, status: TopicStatus.New, completed: false },
      ]
    },
  ],
  busyBlocks: [
    {
      id: "b_1",
      title: "Morning Classes",
      day: DayOfWeek.Monday,
      startTime: "09:00",
      endTime: "13:00",
      type: "Class"
    }
  ],
  exams: [],
  schedule: [],
  preferences: {
    maxHoursPerDay: 6,
    preferredStartHour: 9,
    preferredEndHour: 22
  }
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse storage", e);
      return DEFAULT_DATA;
    }
  }
  return DEFAULT_DATA;
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

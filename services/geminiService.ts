import { GoogleGenAI, Type } from "@google/genai";
import { AppData, Subject, BusyBlock, Exam, StudySession } from "../types";

const MODEL_NAME = "gemini-2.5-flash";

export const generateStudyPlan = async (
  data: AppData,
  startDate: Date,
  daysToPlan: number = 7
): Promise<any[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prepare context for the AI
  const subjectsContext = data.subjects.map(s => ({
    id: s.id,
    name: s.name,
    difficulty: s.difficulty,
    // Send all topics with their completion status so AI can plan Revisions vs New learning
    topics: s.topics.map(t => ({
      id: t.id,
      name: t.name,
      estimatedHours: t.estimatedHours,
      completed: t.completed
    }))
  }));

  const examsContext = data.exams.map(e => ({
    subjectId: e.subjectId,
    title: e.title,
    date: e.date,
    importance: e.importance
  }));

  const busyContext = data.busyBlocks.map(b => ({
    day: b.day,
    start: b.startTime,
    end: b.endTime,
    reason: b.title
  }));

  const prompt = `
    You are an expert university study planner. Create a ${daysToPlan}-day study schedule starting from ${startDate.toDateString()}.
    
    My Constraints:
    1. I can study max ${data.preferences.maxHoursPerDay} hours per day.
    2. I prefer studying between ${data.preferences.preferredStartHour}:00 and ${data.preferences.preferredEndHour}:00.
    3. I strictly cannot study during these busy blocks: ${JSON.stringify(busyContext)}.
    4. Prioritize subjects with upcoming exams: ${JSON.stringify(examsContext)}.
    5. Subjects and Topics Data: ${JSON.stringify(subjectsContext)}.
    
    Planning Strategy:
    1. **Topic Completion Status**: 
       - Explicitly check the 'completed' field for each topic.
       - Schedule 'New' sessions for topics where 'completed' is false.
       - Schedule 'Revision' sessions for topics where 'completed' is true (especially for subjects with near exams).
    2. **Subject Balancing**: 
       - Do not bias the schedule towards subjects simply because they have more topics.
       - Ensure subjects with FEWER topics but high difficulty or imminent exams receive adequate attention and revision slots.
       - Distribute time fairly based on priority, not just list length.
    3. **Session Rules**:
       - Max block duration: 90 mins.
       - No breaks in output, only study slots.
       - Respect busy blocks strictly.

    Return a JSON array of study sessions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dayOffset: { type: Type.INTEGER, description: "0 for start date, 1 for next day, etc." },
              startTime: { type: Type.STRING, description: "HH:mm 24-hour format" },
              endTime: { type: Type.STRING, description: "HH:mm 24-hour format" },
              subjectId: { type: Type.STRING, description: "ID of the subject from provided list" },
              topicIds: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of topic IDs covered in this session"
              },
              type: { type: Type.STRING, enum: ["New", "Revision", "Practice"] },
              reasoning: { type: Type.STRING, description: "Short reason for this slot (e.g. 'Revision for upcoming Midterm')" }
            },
            required: ["dayOffset", "startTime", "endTime", "subjectId", "topicIds", "type"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Gemini Planning Error:", error);
    throw error;
  }
};

export const  getMotivationalQuote = async (): Promise<string> => {
   const apiKey = process.env.API_KEY;
    if (!apiKey) return "Keep pushing forward!";
    
    const ai = new GoogleGenAI({ apiKey });
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: "Give me a very short, punchy, unique motivational quote for a university student studying hard. Max 15 words."
        });
        return response.text || "You got this!";
    } catch (e) {
        return "Focus on the process, not the outcome.";
    }
}
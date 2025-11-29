import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { AppData, StudySession } from '../types';
import { generateStudyPlan } from '../services/geminiService';
import { Button } from './ui/Button';
import { generateId, getDayName } from '../utils';

interface Props {
  data: AppData;
  onPlanGenerated: (sessions: StudySession[]) => void;
}

export const Planner: React.FC<Props> = ({ data, onPlanGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const rawPlan = await generateStudyPlan(data, today, 7);
      
      const newSessions: StudySession[] = rawPlan.map((item: any) => {
        const sessionDate = new Date(today);
        sessionDate.setDate(today.getDate() + item.dayOffset);
        
        return {
          id: generateId(),
          date: sessionDate.toISOString(),
          dayOfWeek: getDayName(sessionDate),
          startTime: item.startTime,
          endTime: item.endTime,
          subjectId: item.subjectId,
          topicIds: item.topicIds,
          type: item.type as any,
          isDone: false,
          notes: item.reasoning
        };
      });

      onPlanGenerated(newSessions);
    } catch (err) {
      setError("Failed to generate plan. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-indigo-100 mb-3 border border-white/20">
               <Sparkles className="w-3 h-3 text-yellow-300" /> AI Powered
            </div>
            <h2 className="text-3xl font-bold mb-3 font-display">
              Generate Your Study Plan
            </h2>
            <p className="text-indigo-100 max-w-lg text-lg leading-relaxed opacity-90">
              Let our AI analyze your schedule, exams, and topic difficulty to create the perfect weekly routine for you.
            </p>
            {error && (
              <div className="mt-4 bg-red-500/20 text-red-50 p-3 rounded-xl border border-red-500/30 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold shadow-xl shadow-indigo-900/10 h-14 px-8 text-lg rounded-2xl"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <RefreshCw className="w-5 h-5 mr-2" />}
            {loading ? 'Creating Magic...' : 'Generate New Plan'}
          </Button>
          
          {data.schedule.length > 0 && (
             <div className="text-xs font-medium text-indigo-200">
                {data.schedule.length} sessions currently planned
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
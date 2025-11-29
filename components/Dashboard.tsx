import React, { useEffect, useState } from 'react';
import { AppData, StudySession } from '../types';
import { CheckCircle2, Circle, Clock, ArrowRight, Calendar, BookOpen, Trophy } from 'lucide-react';
import { formatDate, cn } from '../utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getMotivationalQuote } from '../services/geminiService';

interface Props {
  data: AppData;
  onToggleSession: (id: string) => void;
}

export const Dashboard: React.FC<Props> = ({ data, onToggleSession }) => {
  const [todaySessions, setTodaySessions] = useState<StudySession[]>([]);
  const [quote, setQuote] = useState("Loading inspiration...");

  useEffect(() => {
    const todayStr = new Date().toDateString();
    const sessions = data.schedule.filter(s => new Date(s.date).toDateString() === todayStr);
    sessions.sort((a,b) => a.startTime.localeCompare(b.startTime));
    setTodaySessions(sessions);
    
    getMotivationalQuote().then(setQuote);
  }, [data.schedule]);

  // Chart Data
  const completedCount = data.schedule.filter(s => s.isDone).length;
  const totalSessions = data.schedule.length || 1; // avoid division by zero
  const pendingCount = data.schedule.length - completedCount;
  const percentage = Math.round((completedCount / totalSessions) * 100);
  
  const chartData = [
    { name: 'Done', value: completedCount, color: '#4f46e5' }, // indigo-600
    { name: 'Pending', value: pendingCount, color: '#e2e8f0' }, // slate-200
  ];

  // Next Exam Logic
  const nextExam = data.exams
    .filter(e => new Date(e.date) >= new Date())
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
  const getDaysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
       {/* Hero Section */}
       <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                <h1 className="text-3xl font-bold text-gray-800 font-display">
                  Hello there! 👋
                </h1>
                <p className="text-gray-500 mt-2 text-lg font-light max-w-2xl">
                  "{quote}"
                </p>
             </div>
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                <p className="text-2xl font-bold text-gray-800 font-display">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Today's Plan */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="text-indigo-600 w-5 h-5" />
                  Today's Study Plan
                </h3>
                <span className="text-sm font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                  {todaySessions.filter(s => s.isDone).length}/{todaySessions.length} Completed
                </span>
             </div>

             {todaySessions.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Calendar size={32} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700">No sessions scheduled</h4>
                  <p className="text-gray-500 mt-1">Enjoy your day or generate a new plan from the Planner tab!</p>
                </div>
             ) : (
                <div className="space-y-4">
                  {todaySessions.map(session => {
                      const subject = data.subjects.find(s => s.id === session.subjectId);
                      return (
                        <div 
                          key={session.id}
                          onClick={() => onToggleSession(session.id)}
                          className={cn(
                            "group relative bg-white p-5 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md",
                            session.isDone ? "border-green-200 bg-green-50/30" : "border-gray-100 hover:border-indigo-300"
                          )}
                        >
                           <div className="flex items-start gap-4">
                              <div className={cn(
                                "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                session.isDone ? "border-green-500 bg-green-500 text-white" : "border-gray-300 group-hover:border-indigo-500 text-transparent"
                              )}>
                                 <CheckCircle2 size={16} />
                              </div>
                              
                              <div className="flex-1">
                                 <div className="flex justify-between items-start">
                                    <h4 className={cn(
                                      "font-bold text-lg font-display transition-colors",
                                      session.isDone ? "text-gray-400 line-through" : "text-gray-800"
                                    )}>
                                      {subject?.name || "Unknown Subject"}
                                    </h4>
                                    <span className={cn(
                                      "text-xs px-2 py-1 rounded-lg font-semibold tracking-wide uppercase",
                                      session.type === 'New' ? 'bg-blue-100 text-blue-700' :
                                      session.type === 'Revision' ? 'bg-amber-100 text-amber-700' : 
                                      'bg-purple-100 text-purple-700'
                                    )}>
                                      {session.type}
                                    </span>
                                 </div>
                                 
                                 <div className="mt-2 flex flex-wrap gap-2">
                                   {session.topicIds.slice(0, 3).map(tid => {
                                      const topicName = subject?.topics.find(t => t.id === tid)?.name || "Topic";
                                      return (
                                        <span key={tid} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                          {topicName}
                                        </span>
                                      );
                                   })}
                                   {session.topicIds.length > 3 && <span className="text-xs text-gray-400 self-center">+{session.topicIds.length - 3} more</span>}
                                 </div>

                                 <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 font-medium">
                                    <Clock size={16} className="text-indigo-400" />
                                    {session.startTime} - {session.endTime}
                                    {session.notes && <span className="text-gray-300 mx-2">|</span>}
                                    {session.notes && <span className="text-indigo-500 italic truncate max-w-[200px]">{session.notes}</span>}
                                 </div>
                              </div>
                           </div>
                        </div>
                      );
                  })}
                </div>
             )}
          </div>

          {/* Side Column: Stats & Exams */}
          <div className="space-y-6">
             {/* Progress Card */}
             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2 font-display">Weekly Progress</h3>
                <div className="w-48 h-48 relative">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                         >
                            {chartData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />
                            ))}
                         </Pie>
                      </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-indigo-600 font-display">{percentage}%</span>
                      <span className="text-xs text-gray-400 uppercase font-semibold">Complete</span>
                   </div>
                </div>
                <div className="flex gap-4 mt-2 text-sm">
                   <div className="flex items-center gap-1 text-gray-600">
                      <div className="w-3 h-3 rounded-full bg-indigo-600"></div> Done
                   </div>
                   <div className="flex items-center gap-1 text-gray-600">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div> To Do
                   </div>
                </div>
             </div>

             {/* Next Exam Card */}
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                   <Trophy className="w-5 h-5 text-yellow-300" />
                   Upcoming Exam
                </h3>
                
                {nextExam ? (
                  <div>
                     <div className="mb-4">
                        <p className="text-indigo-100 text-sm mb-1">Subject</p>
                        <p className="text-xl font-bold font-display leading-tight">{data.subjects.find(s => s.id === nextExam.subjectId)?.name}</p>
                     </div>
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-indigo-100 text-sm mb-1">Date</p>
                           <p className="font-medium">{formatDate(nextExam.date)}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">
                           <span className="text-2xl font-bold">{getDaysLeft(nextExam.date)}</span>
                           <span className="text-xs ml-1 opacity-80">days left</span>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                     <p className="text-indigo-100 opacity-80">No upcoming exams.</p>
                     <p className="text-sm mt-2">Add one in the Schedule tab!</p>
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Plus, Trash2, BookOpen, Layers, MoreHorizontal } from 'lucide-react';
import { Subject, TopicStatus, Difficulty } from '../types';
import { Button } from './ui/Button';
import { generateId, cn } from '../utils';

interface Props {
  subjects: Subject[];
  onUpdate: (subjects: Subject[]) => void;
}

export const Subjects: React.FC<Props> = ({ subjects, onUpdate }) => {
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicHours, setNewTopicHours] = useState('1');

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    const newSubject: Subject = {
      id: generateId(),
      name: newSubjectName,
      difficulty: Difficulty.Medium,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      topics: []
    };
    onUpdate([...subjects, newSubject]);
    setNewSubjectName('');
  };

  const deleteSubject = (id: string) => {
    if (confirm("Are you sure? This will delete all topics for this subject.")) {
      onUpdate(subjects.filter(s => s.id !== id));
    }
  };

  const addTopic = (subjectId: string) => {
    if (!newTopicName.trim()) return;
    const updatedSubjects = subjects.map(sub => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          topics: [...sub.topics, {
            id: generateId(),
            name: newTopicName,
            estimatedHours: parseFloat(newTopicHours) || 1,
            status: TopicStatus.New,
            completed: false
          }]
        };
      }
      return sub;
    });
    onUpdate(updatedSubjects);
    setNewTopicName('');
  };

  const toggleTopicCompletion = (subjectId: string, topicId: string) => {
    const updatedSubjects = subjects.map(sub => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          topics: sub.topics.map(t => t.id === topicId ? { ...t, completed: !t.completed } : t)
        };
      }
      return sub;
    });
    onUpdate(updatedSubjects);
  };
  
  const deleteTopic = (subjectId: string, topicId: string) => {
    const updatedSubjects = subjects.map(sub => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          topics: sub.topics.filter(t => t.id !== topicId)
        };
      }
      return sub;
    });
    onUpdate(updatedSubjects);
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Subject */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 font-display flex items-center">
             <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
             Subjects & Syllabus
           </h2>
           <p className="text-gray-500 text-sm mt-1">Manage your courses and track topic completion.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="New Subject Name..." 
            className="flex-1 md:w-64 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
          />
          <Button onClick={addSubject}>Add</Button>
        </div>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => {
           const totalTopics = subject.topics.length;
           const completedTopics = subject.topics.filter(t => t.completed).length;
           const progress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
           const isExpanded = activeSubjectId === subject.id;

           return (
             <div key={subject.id} className={cn(
               "bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col",
               isExpanded ? "ring-2 ring-indigo-500 md:col-span-2 lg:col-span-2" : ""
             )}>
                {/* Card Header */}
                <div className="p-5 border-b border-gray-50 relative">
                   <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: subject.color }}></div>
                   <div className="flex justify-between items-start">
                      <div className="flex-1">
                         <h3 className="text-lg font-bold text-gray-800 font-display truncate">{subject.name}</h3>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{totalTopics} topics</span>
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full border",
                              subject.difficulty === 'Hard' ? "bg-red-50 text-red-600 border-red-100" :
                              subject.difficulty === 'Medium' ? "bg-yellow-50 text-yellow-600 border-yellow-100" :
                              "bg-green-50 text-green-600 border-green-100"
                            )}>{subject.difficulty}</span>
                         </div>
                      </div>
                      <button 
                        onClick={() => deleteSubject(subject.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>

                   {/* Progress Bar */}
                   <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-600">{progress}% Complete</span>
                        <span className="text-gray-400">{completedTopics}/{totalTopics}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                         <div 
                           className="h-full rounded-full transition-all duration-500 ease-out"
                           style={{ width: `${progress}%`, backgroundColor: subject.color }}
                         ></div>
                      </div>
                   </div>
                </div>

                {/* Topics List (Collapsible/Scrollable) */}
                <div className={cn(
                  "flex-1 bg-gray-50/50 p-5 overflow-y-auto transition-all custom-scrollbar",
                  isExpanded ? "max-h-96" : "max-h-48"
                )}>
                   {subject.topics.length === 0 ? (
                      <div className="text-center py-6">
                        <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">No syllabus added yet.</p>
                      </div>
                   ) : (
                      <div className="space-y-2">
                         {subject.topics.map(topic => (
                            <div key={topic.id} className="group flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-100 hover:border-indigo-100 shadow-sm transition-all">
                               <div className="flex items-center gap-3 overflow-hidden">
                                  <button 
                                    onClick={() => toggleTopicCompletion(subject.id, topic.id)}
                                    className={cn(
                                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
                                      topic.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-indigo-400"
                                    )}
                                  >
                                    {topic.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                                  </button>
                                  <span className={cn(
                                    "text-sm font-medium truncate", 
                                    topic.completed ? "text-gray-400 line-through" : "text-gray-700"
                                  )}>
                                    {topic.name}
                                  </span>
                               </div>
                               <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded">{topic.estimatedHours}h</span>
                                  <button 
                                    onClick={() => deleteTopic(subject.id, topic.id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity"
                                  >
                                     <Trash2 size={12} />
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </div>

                {/* Footer / Actions */}
                <div className="p-4 border-t border-gray-100 bg-white mt-auto">
                   {isExpanded ? (
                      <div className="flex gap-2 items-center animate-in slide-in-from-bottom-2">
                        <input 
                          autoFocus
                          type="text" 
                          placeholder="Chapter/Topic..." 
                          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                          value={newTopicName}
                          onChange={(e) => setNewTopicName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addTopic(subject.id)}
                        />
                        <input 
                          type="number" 
                          className="w-14 text-sm border border-gray-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 text-center"
                          value={newTopicHours}
                          onChange={(e) => setNewTopicHours(e.target.value)}
                        />
                        <Button size="sm" onClick={() => addTopic(subject.id)} className="rounded-lg h-9">Add</Button>
                        <button onClick={() => setActiveSubjectId(null)} className="text-xs text-gray-400 hover:text-gray-600 underline px-1">Done</button>
                      </div>
                   ) : (
                      <Button 
                        variant="secondary" 
                        className="w-full text-xs h-8 border-dashed border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-300"
                        onClick={() => setActiveSubjectId(subject.id)}
                      >
                         <Plus size={14} className="mr-1" /> Add Topics / Details
                      </Button>
                   )}
                </div>
             </div>
           );
        })}
        
        {/* Empty State Card */}
        {subjects.length === 0 && (
           <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                 <BookOpen size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-700">No Subjects Yet</h3>
              <p className="text-gray-400">Add your first subject above to get started!</p>
           </div>
        )}
      </div>
    </div>
  );
};
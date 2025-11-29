import React, { useState } from 'react';
import { Calendar, Trash2, AlertCircle } from 'lucide-react';
import { Exam, Subject } from '../types';
import { Button } from './ui/Button';
import { generateId, formatDate, cn } from '../utils';

interface Props {
  exams: Exam[];
  subjects: Subject[];
  onUpdate: (exams: Exam[]) => void;
}

export const ExamManager: React.FC<Props> = ({ exams, subjects, onUpdate }) => {
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    importance: 'Medium'
  });

  const handleAdd = () => {
    if (!newExam.title || !newExam.date || !newExam.subjectId) return;
    
    onUpdate([...exams, {
      id: generateId(),
      title: newExam.title,
      date: newExam.date,
      subjectId: newExam.subjectId,
      importance: (newExam.importance as Exam['importance']) || 'Medium'
    }]);
    
    setNewExam({ importance: 'Medium' });
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'High': return "bg-red-100 text-red-700 border-red-200";
      case 'Medium': return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case 'Low': return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
        Exams & Deadlines
      </h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <input 
              type="text" 
              placeholder="Exam Name (e.g. Midterm)" 
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newExam.title || ''}
              onChange={(e) => setNewExam({...newExam, title: e.target.value})}
            />
          </div>
          <div className="md:col-span-3">
             <select 
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={newExam.subjectId || ''}
              onChange={(e) => setNewExam({...newExam, subjectId: e.target.value})}
            >
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-3">
            <input 
              type="date" 
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newExam.date || ''}
              onChange={(e) => setNewExam({...newExam, date: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <select 
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={newExam.importance}
              onChange={(e) => setNewExam({...newExam, importance: e.target.value as any})}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
           <Button onClick={handleAdd} disabled={!newExam.title || !newExam.date || !newExam.subjectId}>
             Add Exam
           </Button>
        </div>
      </div>

      <div className="space-y-3">
        {exams.map(exam => {
          const sub = subjects.find(s => s.id === exam.subjectId);
          return (
            <div key={exam.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-white">
              <div className="flex items-center gap-4">
                 <div className={cn("w-2 h-10 rounded-full", 
                    exam.importance === 'High' ? "bg-red-500" : 
                    exam.importance === 'Medium' ? "bg-yellow-400" : "bg-green-400"
                 )} />
                 <div>
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                        {exam.title}
                        {exam.importance === 'High' && <AlertCircle size={14} className="text-red-500" />}
                    </div>
                    <div className="text-sm text-gray-500">
                      {sub?.name} • {formatDate(exam.date)}
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("px-2 py-1 text-xs rounded-full border", getImportanceColor(exam.importance))}>
                  {exam.importance} Priority
                </span>
                <button 
                  onClick={() => onUpdate(exams.filter(e => e.id !== exam.id))} 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
        {exams.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
             <p className="text-gray-500 font-medium">No exams scheduled</p>
             <p className="text-sm text-gray-400">Add your upcoming exams to help AI prioritize your study plan.</p>
          </div>
        )}
      </div>
    </div>
  );
};
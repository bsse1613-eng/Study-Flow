import React, { useState } from 'react';
import { Clock, Plus, X, Edit2 } from 'lucide-react';
import { BusyBlock, DayOfWeek } from '../types';
import { Button } from './ui/Button';
import { generateId, cn } from '../utils';

interface Props {
  blocks: BusyBlock[];
  onUpdate: (blocks: BusyBlock[]) => void;
}

const DAYS = Object.values(DayOfWeek);

export const ScheduleManager: React.FC<Props> = ({ blocks, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newBlock, setNewBlock] = useState<Partial<BusyBlock>>({
    day: DayOfWeek.Monday,
    startTime: "09:00",
    endTime: "10:00",
    type: "Class"
  });
  const [title, setTitle] = useState("");

  const resetForm = () => {
    setIsOpen(false);
    setEditingId(null);
    setTitle("");
    setNewBlock({
      day: DayOfWeek.Monday,
      startTime: "09:00",
      endTime: "10:00",
      type: "Class"
    });
  };

  const handleSave = () => {
    if (!title) return;

    if (editingId) {
      // Update existing block
      const updatedBlocks = blocks.map(b => {
        if (b.id === editingId) {
          return {
            ...b,
            title,
            day: newBlock.day as DayOfWeek,
            startTime: newBlock.startTime!,
            endTime: newBlock.endTime!,
            type: newBlock.type as any
          };
        }
        return b;
      });
      onUpdate(updatedBlocks);
    } else {
      // Create new block
      const block: BusyBlock = {
        id: generateId(),
        title,
        day: newBlock.day as DayOfWeek,
        startTime: newBlock.startTime!,
        endTime: newBlock.endTime!,
        type: newBlock.type as any
      };
      onUpdate([...blocks, block]);
    }
    
    resetForm();
  };

  const handleEdit = (block: BusyBlock) => {
    setEditingId(block.id);
    setTitle(block.title);
    setNewBlock({
      day: block.day,
      startTime: block.startTime,
      endTime: block.endTime,
      type: block.type
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (editingId === id) resetForm();
    onUpdate(blocks.filter(b => b.id !== id));
  };

  const getBlockStyles = (type: string) => {
    switch (type) {
      case 'Class': return "bg-blue-50 border-blue-100 hover:border-blue-200";
      case 'Tuition': return "bg-purple-50 border-purple-100 hover:border-purple-200";
      case 'Personal': return "bg-amber-50 border-amber-100 hover:border-amber-200";
      case 'Sleep': return "bg-slate-50 border-slate-100 hover:border-slate-200";
      default: return "bg-gray-50 border-gray-100";
    }
  };

  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case 'Class': return "bg-blue-100 text-blue-700";
      case 'Tuition': return "bg-purple-100 text-purple-700";
      case 'Personal': return "bg-amber-100 text-amber-700";
      case 'Sleep': return "bg-slate-200 text-slate-700";
      default: return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-indigo-600" />
          Fixed Schedule
        </h2>
        <Button 
          size="sm" 
          onClick={() => isOpen ? resetForm() : setIsOpen(true)} 
          variant={isOpen ? "secondary" : "primary"}
        >
          {isOpen ? "Cancel" : "Add Block"}
        </Button>
      </div>

      {isOpen && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 space-y-3 animate-in slide-in-from-top-2">
           <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Activity Name</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Physics Lecture"
            />
           </div>
           <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Day</label>
                <select 
                  className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={newBlock.day}
                  onChange={(e) => setNewBlock({...newBlock, day: e.target.value as DayOfWeek})}
                >
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                <select 
                  className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={newBlock.type}
                  onChange={(e) => setNewBlock({...newBlock, type: e.target.value as any})}
                >
                  <option value="Class">Class</option>
                  <option value="Tuition">Tuition</option>
                  <option value="Personal">Personal</option>
                  <option value="Sleep">Sleep</option>
                </select>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Start</label>
                <input 
                  type="time" 
                  className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newBlock.startTime}
                  onChange={(e) => setNewBlock({...newBlock, startTime: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">End</label>
                <input 
                  type="time" 
                  className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newBlock.endTime}
                  onChange={(e) => setNewBlock({...newBlock, endTime: e.target.value})}
                />
              </div>
           </div>
           <Button className="w-full mt-2" onClick={handleSave}>
             {editingId ? "Update Block" : "Save Block"}
           </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
         {blocks.map(block => (
           <div 
             key={block.id} 
             className={cn(
               "flex items-center justify-between p-3 border rounded-lg transition-all", 
               getBlockStyles(block.type)
             )}
           >
              <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-gray-700 text-sm">{block.title}</div>
                    <span className={cn(
                      "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide",
                      getTypeBadgeStyles(block.type)
                    )}>
                      {block.type}
                    </span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                   <span className="font-medium bg-white/50 px-1.5 rounded">{block.day.slice(0,3)}</span>
                   <span>•</span>
                   <span>{block.startTime} - {block.endTime}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleEdit(block)} 
                  className="text-gray-400 hover:text-indigo-600 bg-white/50 p-1.5 rounded-full hover:bg-white transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(block.id)} 
                  className="text-gray-400 hover:text-red-500 bg-white/50 p-1.5 rounded-full hover:bg-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>
           </div>
         ))}
         {blocks.length === 0 && <p className="text-gray-400 text-sm col-span-2 text-center py-4">No fixed blocks added yet.</p>}
      </div>
    </div>
  );
}

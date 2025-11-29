import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Subjects } from './components/Subjects';
import { ScheduleManager } from './components/ScheduleManager';
import { ExamManager } from './components/ExamManager';
import { Planner } from './components/Planner';
import { loadData, saveData } from './services/storageService';
import { AppData, Subject, BusyBlock, Exam, StudySession } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<AppData>(loadData());
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Initial load simulation
    setData(loadData());
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      saveData(data);
    }
  }, [data, isDataLoaded]);

  const updateSubjects = (subjects: Subject[]) => {
    setData(prev => ({ ...prev, subjects }));
  };

  const updateBlocks = (busyBlocks: BusyBlock[]) => {
    setData(prev => ({ ...prev, busyBlocks }));
  };

  const updateExams = (exams: Exam[]) => {
    setData(prev => ({ ...prev, exams }));
  };

  const updateSchedule = (schedule: StudySession[]) => {
    setData(prev => ({ ...prev, schedule }));
  };

  const toggleSession = (id: string) => {
    const updatedSchedule = data.schedule.map(s => 
      s.id === id ? { ...s, isDone: !s.isDone } : s
    );
    updateSchedule(updatedSchedule);
  };

  if (!isDataLoaded) return null;

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <Planner data={data} onPlanGenerated={updateSchedule} />
           <Dashboard data={data} onToggleSession={toggleSession} />
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="animate-in fade-in duration-500">
          <Subjects subjects={data.subjects} onUpdate={updateSubjects} />
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <ScheduleManager blocks={data.busyBlocks} onUpdate={updateBlocks} />
          <ExamManager exams={data.exams} subjects={data.subjects} onUpdate={updateExams} />
        </div>
      )}

    </Layout>
  );
}

export default App;

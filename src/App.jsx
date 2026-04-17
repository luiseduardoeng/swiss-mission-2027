import React, { useState } from 'react';
import { LayoutDashboard, Plane, Factory, BookOpen, Brain, Clock, Calendar, CheckCircle2, Circle, Edit3, Save, ChevronDown, ChevronUp } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedPhase, setExpandedPhase] = useState(1);
  const [expandedMonth, setExpandedMonth] = useState('April');
  const [editingId, setEditingId] = useState(null);
  const [manualTasks, setManualTasks] = useState([]);

  // --- PROGRESS CALCULATION LOGIC ---
  const calculateProgress = () => {
    const getWeight = (title) => {
      if (title.includes('English Class')) return 3;
      if (title.includes('Grammar Focus')) return 2;
      return 1;
    };

    const completedPoints = manualTasks
      .filter(t => t.completed)
      .reduce((acc, t) => acc + getWeight(t.title), 0);

    const totalEstimatedPoints = 480; 
    return Math.min(100, Math.round((completedPoints / totalEstimatedPoints) * 100));
  };

  const currentPercent = calculateProgress();

  const calculateDaysUntil = () => {
    const diff = new Date('2027-02-22') - new Date();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const getDaysInMonth = (monthName, year) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = months.indexOf(monthName);
    const date = new Date(year, monthIndex, 1);
    const days = [];
    while (date.getMonth() === monthIndex) {
      days.push(new Date(date).toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handlePhaseChange = (phaseId) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
    if (phaseId === 1) setExpandedMonth('April');
    if (phaseId === 2) setExpandedMonth('August');
    if (phaseId === 3) setExpandedMonth('December');
  };

  const getAutoContent = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = date.getDay(); 
    const isBreak = date >= new Date('2026-12-21') && date <= new Date('2027-01-10');
    if (isBreak) return null;

    if (dayOfWeek === 5) return { title: 'English Class (Private)', focus: '7:30 AM - B1 Acceleration' };
    
    const contentMap = {
      1: { title: 'Grammar Focus', focus: 'Verb Tenses & Sentence Structure' },
      2: { title: 'Technical Vocabulary', focus: 'Poultry Industry & Engineering Terms' },
      3: { title: 'Listening Practice', focus: 'Swiss/International English Accents' },
      4: { title: 'Professional Writing', focus: 'Emails and Technical Reports (B1)' }
    };
    return contentMap[dayOfWeek] || null;
  };

  const RenderDashboard = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const startDate = new Date('2026-04-17T00:00:00');

    const upcoming = [];
    for(let d = new Date(today); d <= nextWeek; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const currentDateObj = new Date(dateStr + 'T00:00:00');

      if (currentDateObj >= startDate) {
        const manual = manualTasks.find(t => t.date === dateStr);
        const auto = getAutoContent(dateStr);
        if (manual || auto) upcoming.push(manual || { ...auto, date: dateStr, completed: false });
      }
    }

    return (
      <div className="max-w-5xl mx-auto"> {/* CENTRALIZADO AQUI */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight italic uppercase">English Dashboard</h1>
            <p className="text-slate-500">Swiss business trip goals tracking.</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-3">
            <Clock className="text-blue-600" />
            <span className="font-mono font-bold text-lg text-slate-700 uppercase">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Target: B1 Level</h3>
            <p className="text-3xl font-black text-slate-800 mt-2">{currentPercent}%</p>
            <div className="w-full bg-slate-100 rounded-full h-3 mt-4">
              <div className="bg-blue-600 h-3 rounded-full transition-all duration-700" style={{ width: `${currentPercent}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-600">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Days to Switzerland</h3>
            <p className="text-3xl font-black text-slate-800 mt-2">{calculateDaysUntil()} Days</p>
            <p className="text-xs text-slate-400 mt-2 italic">Target: Feb 22, 2027</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-600">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Next Lesson</h3>
            <p className="text-3xl font-black text-slate-800 mt-2">Friday, 17th</p>
            <p className="text-xs text-slate-400 mt-2 italic">7:30 AM Session</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-blue-600" size={24} /> Current Focus (Next 7 Days)
          </h2>
          <div className="space-y-4">
            {upcoming.length > 0 ? upcoming.map((task, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${task.completed ? 'bg-green-50 border-green-200 opacity-60' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-lg flex flex-col items-center justify-center font-bold shrink-0">
                    <span className="text-[10px] uppercase">{new Date(task.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-xl">{new Date(task.date + 'T12:00:00').getDate()}</span>
                  </div>
                  <div className="ml-6">
                    <p className={`font-black text-lg ${task.completed ? 'line-through text-slate-800' : 'text-slate-800'}`}>{task.title}</p>
                    <p className="text-slate-600 italic">"{task.focus}"</p>
                  </div>
                </div>
                <button 
                  onClick={() => setManualTasks([...manualTasks.filter(t => t.date !== task.date), { ...task, completed: !task.completed }])}
                  className="text-blue-600 hover:scale-110 transition-transform"
                >
                  {task.completed ? <CheckCircle2 className="text-green-600" size={32} /> : <Circle size={32} className="text-blue-200" />}
                </button>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-slate-400 italic font-medium">Your study plan kicks off on April 17th!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const RenderRoadmap = () => {
    const phases = [
      { id: 1, title: 'Foundation', color: 'border-blue-600', text: 'text-blue-600', bg: 'bg-blue-600', months: ['April', 'May', 'June', 'July'] },
      { id: 2, title: 'Fluency', color: 'border-orange-500', text: 'text-orange-500', bg: 'bg-orange-500', months: ['August', 'September', 'October', 'November'] },
      { id: 3, title: 'Mission Ready', color: 'border-red-600', text: 'text-red-600', bg: 'bg-red-600', months: ['December', 'January', 'February'] }
    ];

    return (
      <div className="max-w-4xl mx-auto pb-10"> {/* CENTRALIZADO AQUI TAMBÉM */}
        <header className="mb-10 text-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight uppercase italic">Master Roadmap</h1>
          <p className="text-slate-500">Curriculum strategy until Feb 2027</p>
        </header>

        {phases.map(phase => (
          <div key={phase.id} className={`relative pl-10 border-l-4 ${phase.color} mb-12`}>
            <div className={`absolute -left-3.5 top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm ${phase.bg}`}></div>
            <div className="flex justify-between items-center cursor-pointer mb-6" onClick={() => handlePhaseChange(phase.id)}>
              <h3 className={`text-xl font-black uppercase tracking-tight ${phase.text}`}>Phase {phase.id}: {phase.title}</h3>
              {expandedPhase === phase.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </div>

            {expandedPhase === phase.id && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {phase.months.map(m => (
                    <button key={m} onClick={() => setExpandedMonth(m)} className={`p-3 rounded-xl font-bold border-2 transition-all ${expandedMonth === m ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>{m}</button>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                  <div className="bg-slate-900 text-white p-2 text-center font-bold uppercase tracking-widest text-[10px]">{expandedMonth}</div>
                  <div className="divide-y divide-slate-100">
                    {getDaysInMonth(expandedMonth, (expandedMonth === 'January' || expandedMonth === 'February' ? 2027 : 2026)).map(dayStr => {
                      const dateObj = new Date(dayStr + 'T12:00:00');
                      const manual = manualTasks.find(t => t.date === dayStr);
                      const auto = getAutoContent(dayStr);
                      if (expandedMonth === 'April' && dateObj < new Date('2026-04-17T00:00:00')) return null;
                      if (expandedMonth === 'February' && dateObj > new Date('2027-02-21T00:00:00')) return null;
                      const task = manual || auto;

                      return (
                        <div key={dayStr} className="p-4 flex items-center group hover:bg-slate-50 transition-all">
                          <div className="w-12 text-center border-r border-slate-100 pr-4 mr-6 shrink-0 font-bold">
                            <span className="block text-[10px] text-slate-300 uppercase">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="text-lg text-slate-700">{dateObj.getDate()}</span>
                          </div>
                          <div className="flex-1">
                            {editingId === dayStr ? (
                              <EditTaskForm 
                                task={task} 
                                dayStr={dayStr} 
                                onSave={(newT, newF) => {
                                  setManualTasks([...manualTasks.filter(t => t.date !== dayStr), { date: dayStr, title: newT, focus: newF, completed: false }]);
                                  setEditingId(null);
                                }}
                                onCancel={() => setEditingId(null)}
                              />
                            ) : (
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className={`font-bold ${task?.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                    {task ? task.title : <span className="text-slate-200 italic font-normal text-sm">Review Day</span>}
                                  </p>
                                  {task?.focus && <p className="text-xs text-blue-500 font-bold italic mt-0.5">{task.focus}</p>}
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setEditingId(dayStr)} className="p-2 text-slate-300 hover:text-blue-600"><Edit3 size={18}/></button>
                                  {task && (
                                    <button 
                                      onClick={() => setManualTasks([...manualTasks.filter(t => t.date !== dayStr), { ...task, date: dayStr, completed: !task.completed }])}
                                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${task.completed ? 'bg-green-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'}`}
                                    >
                                      {task.completed ? 'Done' : 'Confirm'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-slate-900 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-6 text-xl font-black border-b border-slate-700 text-white tracking-tighter uppercase italic flex items-center gap-3">
          <img src="https://flagcdn.com/w40/ch.png" alt="Switzerland Flag" className="w-6 h-6 rounded-sm shadow-sm" />
          Swiss Mission 27
        </div>
        <nav className="flex-1 p-4 space-y-2 font-bold">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}><LayoutDashboard size={20}/><span>Dashboard</span></button>
          <button onClick={() => setActiveTab('roadmap')} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${activeTab === 'roadmap' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}><Calendar size={20}/><span>Roadmap</span></button>
          <div className="h-px bg-slate-800 my-6"></div>
          <button className="flex items-center space-x-3 w-full p-3 text-slate-500 opacity-50 italic cursor-not-allowed"><Plane size={20} /> <span>Travel Log</span></button>
          <button className="flex items-center space-x-3 w-full p-3 text-slate-500 opacity-50 italic cursor-not-allowed"><Factory size={20} /> <span>Poultry Tech</span></button>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-12 bg-gray-50">
          {activeTab === 'dashboard' ? <RenderDashboard /> : <RenderRoadmap />}
      </main>
    </div>
  );
};

const EditTaskForm = ({ task, onSave, onCancel }) => {
  const [selectedType, setSelectedType] = useState(
    task?.title === 'English Class (Private)' ? 'class' : 
    task?.title === 'Grammar Focus' ? 'grammar' : 'other'
  );
  const [customTitle, setCustomTitle] = useState(selectedType === 'other' ? task?.title || '' : '');
  const [focus, setFocus] = useState(task?.focus || '');

  return (
    <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-blue-100">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase text-slate-400">Task Type</label>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="p-2 border rounded bg-white text-sm font-bold w-full">
          <option value="class">English Class (Private) - Weight 3</option>
          <option value="grammar">Grammar Focus - Weight 2</option>
          <option value="other">Custom Task - Weight 1</option>
        </select>
      </div>
      {selectedType === 'other' && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase text-slate-400">Custom Title</label>
          <input className="p-2 border rounded font-bold text-sm w-full" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black uppercase text-slate-400">Study Focus</label>
        <input className="p-2 border rounded text-sm w-full" value={focus} onChange={(e) => setFocus(e.target.value)} />
      </div>
      <div className="flex space-x-2 pt-1">
        <button onClick={() => {
            const finalTitle = selectedType === 'class' ? 'English Class (Private)' : selectedType === 'grammar' ? 'Grammar Focus' : customTitle;
            onSave(finalTitle, focus);
          }} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-black">SAVE</button>
        <button onClick={onCancel} className="text-slate-400 text-xs font-bold">CANCEL</button>
      </div>
    </div>
  );
};

export default Dashboard;
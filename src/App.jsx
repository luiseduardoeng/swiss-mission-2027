import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, collection } from "firebase/firestore";
import { LayoutDashboard, Clock, Calendar, CheckCircle2, Circle, Edit3, ChevronDown, ChevronUp, Save, ListRestart } from 'lucide-react';

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDkm-n2fhsc5Y049vJUbkhaJkVtBKXmCtw",
  authDomain: "swiss-mission-27.firebaseapp.com",
  projectId: "swiss-mission-27",
  storageBucket: "swiss-mission-27.firebasestorage.app",
  messagingSenderId: "911227832043",
  appId: "1:911227832043:web:2f6e66405e1151447520ae"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedPhase, setExpandedPhase] = useState(1);
  const [expandedMonth, setExpandedMonth] = useState('April');
  const [editingId, setEditingId] = useState(null);
  const [manualTasks, setManualTasks] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState({}); 
  const [isBulkEditing, setIsBulkEditing] = useState(false);

  // --- SINCRONIZAÇÃO EM TEMPO REAL ---
  useEffect(() => {
    const unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setManualTasks(tasksData);
    });
    const unsubSettings = onSnapshot(doc(db, "settings", "weeklyPlan"), (docSnap) => {
      if (docSnap.exists()) setWeeklyPlan(docSnap.data());
    });
    return () => { unsubTasks(); unsubSettings(); };
  }, []);

  const handleBulkUpdate = async (dayIndex, newTitle, newFocus) => {
    const planRef = doc(db, "settings", "weeklyPlan");
    await setDoc(planRef, {
      [dayIndex]: { title: newTitle, focus: newFocus }
    }, { merge: true });
    setIsBulkEditing(false);
  };

  const handleToggleTask = async (task) => {
    const dateKey = task.date || task.id;
    const taskRef = doc(db, "tasks", dateKey);
    await setDoc(taskRef, { ...task, date: dateKey, completed: !task.completed }, { merge: true });
  };

  const handleSaveEdit = async (date, title, focus) => {
    const taskRef = doc(db, "tasks", date);
    await setDoc(taskRef, { date, title, focus, completed: false }, { merge: true });
    setEditingId(null);
  };

  const grammarSchedule = {
    "2026-04-20": "The Verb To Be (Present) and Personal Pronouns",
    "2026-04-27": "Articles (A, An, The) and Plural Nouns",
    "2026-05-04": "Demonstrative Pronouns and Possessive Adjectives",
    "2026-05-11": "Present Simple (Affirmative) - Talking about routines",
    "2026-05-18": "Present Simple (Neg/Int) - Using Do/Does",
    "2026-05-25": "Adverbs of Frequency (Always, usually, never)",
    "2026-06-01": "There is and There are (Existence)",
    "2026-06-08": "Prepositions of Place (In, On, At)",
    "2026-06-15": "Prepositions of Time (In, On, At)",
    "2026-06-22": "Countable and Uncountable Nouns",
    "2026-06-29": "Quantifiers (Some, Any, Much, Many)",
    "2026-07-06": "Modal Verb Can and Can't (Abilities and Permission)",
    "2026-07-13": "Present Continuous (Affirmative) - Actions now",
    "2026-07-20": "Present Continuous (Negative and Interrogative)",
    "2026-07-27": "Verb To Be in the Past (Was / Were)",
    "2026-08-03": "Past Simple - Regular Verbs and -ed pronunciation",
    "2026-08-10": "Past Simple - Most common Irregular Verbs",
    "2026-08-17": "Past Simple - Negative and Interrogative with Did",
    "2026-08-24": "Past Continuous (Actions in progress in the past)",
    "2026-08-31": "Past Simple vs. Past Continuous (When and While)",
    "2026-09-07": "Future with Going to (Plans and intentions)",
    "2026-09-14": "Future with Will (Quick decisions and promises)",
    "2026-09-21": "Comparative Adjectives (Bigger, better, etc.)",
    "2026-09-28": "Superlative Adjectives (The biggest, the best)",
    "2026-10-05": "Object Pronouns (Me, you, him, her, us, them)",
    "2026-10-12": "Possessive Pronouns (Mine, yours, his, hers)",
    "2026-10-19": "Adverbs of Manner (Quickly, well, badly)",
    "2026-10-26": "Have to and Don't have to (Obligation)",
    "2026-11-02": "Should and Shouldn't (Giving advice)",
    "2026-11-09": "Basic Relative Clauses (Who, Which, That)",
    "2026-11-16": "Present Perfect - Introduction (Life experiences)",
    "2026-11-23": "Present Perfect - Just, Already and Yet",
    "2026-11-30": "Present Perfect - Ever and Never",
    "2026-12-07": "Present Perfect - For and Since",
    "2026-12-14": "Present Perfect vs. Past Simple",
    "2026-12-21": "Zero Conditional and First Conditional",
    "2026-12-28": "Second Conditional (Hypothetical situations)",
    "2027-01-04": "Modal Verbs of Deduction (Must, Might, Can't)",
    "2027-01-11": "Passive Voice - Focus on the action",
    "2027-01-18": "Used to (Past habits)",
    "2027-01-25": "Reported Speech (Reporting what was said)",
    "2027-02-01": "Gerund (-ing) vs. Infinitive (to + verb)",
    "2027-02-08": "Essential Phrasal Verbs (B1 introduction)",
    "2027-02-15": "B1 General Review and Consolidation"
  };

  const getAutoContent = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = date.getDay(); 
    const isAfterCutoff = date >= new Date('2026-04-24T00:00:00');
    const customRule = weeklyPlan[dayOfWeek];

    if (isAfterCutoff && customRule) {
      return { title: customRule.title, focus: customRule.focus };
    }

    if (dayOfWeek === 1) return { title: 'Grammar Focus', focus: grammarSchedule[dateStr] || "Review & Practice" };
    if (dayOfWeek === 2) return { title: 'Vocabulary', focus: 'Feed production or travel' };
    if (dayOfWeek === 3) return { title: 'Lesson Exercises', focus: 'Reviewing class activities' };
    if (dayOfWeek === 4) return { title: 'Listening Practice', focus: 'Review Video Immersion content' };
    if (dayOfWeek === 5) return { title: 'English Class (Private)', focus: '7:30 AM - B1 Acceleration' };
    if (dayOfWeek === 6) return { title: 'Video Immersion', focus: 'YouTube Video (Technical or Travel)' };
    
    return null;
  };

  const calculateProgress = () => {
    const totalPoints = 480; 
    const completedPoints = manualTasks.filter(t => t.completed).length; 
    return Math.min(100, Math.round((completedPoints / totalPoints) * 100));
  };

  const RenderBulkEditModal = () => {
    const [day, setDay] = useState("1");
    const [t, setT] = useState("");
    const [f, setF] = useState("");

    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
          <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic">Update Weekly Plan</h2>
          <p className="text-slate-500 text-sm mb-6">Change ALL future occurrences of this day from April 24th onwards.</p>
          <div className="space-y-4">
            <select className="w-full p-3 border rounded-xl font-bold bg-slate-50" value={day} onChange={e => setDay(e.target.value)}>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
            <input className="w-full p-3 border rounded-xl font-bold" value={t} onChange={e => setT(e.target.value)} placeholder="New Task Title" />
            <textarea className="w-full p-3 border rounded-xl" value={f} onChange={e => setF(e.target.value)} placeholder="Task Focus" rows={3} />
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => handleBulkUpdate(day, t, f)} className="flex-1 bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2">
              <Save size={18} /> APPLY
            </button>
            <button onClick={() => setIsBulkEditing(false)} className="px-6 py-3 text-slate-400 font-bold">CANCEL</button>
          </div>
        </div>
      </div>
    );
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
      if (new Date(dateStr + 'T00:00:00') >= startDate) {
        const cloudTask = manualTasks.find(t => t.id === dateStr);
        const auto = getAutoContent(dateStr);
        if (cloudTask || auto) upcoming.push(cloudTask || { ...auto, date: dateStr, completed: false });
      }
    }

    return (
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 italic uppercase tracking-tighter">Swiss Mission Dashboard</h1>
            <p className="text-slate-500 font-medium italic underline decoration-blue-500">Cloud Synchronized • Professional Roadmap</p>
          </div>
          <button onClick={() => setIsBulkEditing(true)} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-blue-600 transition-all">
            <ListRestart size={16} /> EDIT WEEKLY PLAN
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Overall Progress</h3>
            <p className="text-3xl font-black text-slate-800 mt-2">{calculateProgress()}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-600">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Days to Switzerland</h3>
            <p className="text-3xl font-black text-slate-800 mt-2">{Math.ceil((new Date('2027-02-22') - new Date()) / (1000 * 3600 * 24))} Days</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-600">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Status</h3>
            <p className="text-3xl font-black text-slate-800 mt-2">Online</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><CheckCircle2 className="text-blue-600" size={24} /> Weekly Schedule</h2>
          <div className="space-y-4">
            {upcoming.map((task, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${task.completed ? 'bg-green-50 border-green-200 opacity-60' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-lg flex flex-col items-center justify-center font-bold">
                    <span className="text-[10px] uppercase">{new Date(task.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-xl">{new Date(task.date + 'T12:00:00').getDate()}</span>
                  </div>
                  <div className="ml-6">
                    <p className={`font-black text-lg ${task.completed ? 'line-through text-slate-800' : 'text-slate-800'}`}>{task.title}</p>
                    <p className="text-slate-600 italic">"{task.focus}"</p>
                  </div>
                </div>
                <button onClick={() => handleToggleTask(task)} className="text-blue-600 hover:scale-110 transition-transform">
                  {task.completed ? <CheckCircle2 className="text-green-600" size={32} /> : <Circle size={32} className="text-blue-200" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handlePhaseChange = (phaseId) => {
    if (expandedPhase === phaseId) setExpandedPhase(null);
    else {
      setExpandedPhase(phaseId);
      if (phaseId === 1) setExpandedMonth('April');
      if (phaseId === 2) setExpandedMonth('August');
      if (phaseId === 3) setExpandedMonth('December');
    }
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

  const RenderRoadmap = () => {
    const phases = [
      { id: 1, title: 'Phase 1: Foundation (A1)', color: 'border-blue-600', text: 'text-blue-600', bg: 'bg-blue-600', months: ['April', 'May', 'June', 'July'] },
      { id: 2, title: 'Phase 2: Construction (A2)', color: 'border-orange-500', text: 'text-orange-500', bg: 'bg-orange-500', months: ['August', 'September', 'October', 'November'] },
      { id: 3, title: 'Phase 3: Independence (B1)', color: 'border-red-600', text: 'text-red-600', bg: 'bg-red-600', months: ['December', 'January', 'February'] }
    ];
    return (
      <div className="max-w-4xl mx-auto pb-10">
        <header className="mb-10 text-slate-800 tracking-tighter">
          <h1 className="text-3xl font-extrabold tracking-tight uppercase italic">Swiss Mission Roadmap</h1>
          <p className="text-slate-500 font-medium">English Proficiency Strategy</p>
        </header>
        {phases.map(phase => (
          <div key={phase.id} className={`relative pl-10 border-l-4 ${phase.color} mb-12`}>
            <div className={`absolute -left-3.5 top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm ${phase.bg}`}></div>
            <div className="flex justify-between items-center cursor-pointer mb-6" onClick={() => handlePhaseChange(phase.id)}>
              <h3 className={`text-xl font-black uppercase tracking-tight ${phase.text}`}>{phase.title}</h3>
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
                      const manual = manualTasks.find(t => t.id === dayStr);
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
                          <div className="flex-1 flex justify-between items-center">
                            <div>
                              <p className={`font-bold ${task?.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task ? task.title : <span className="text-slate-200 italic font-normal text-sm">Review Day</span>}</p>
                              {task?.focus && <p className="text-xs text-blue-500 font-bold italic mt-0.5">{task.focus}</p>}
                            </div>
                            <div className="flex items-center space-x-3">
                              <button onClick={() => setEditingId(dayStr)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-600 transition-opacity"><Edit3 size={18}/></button>
                              {task && (
                                <button onClick={() => handleToggleTask({...task, date: dayStr})} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${task.completed ? 'bg-green-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'}`}>
                                  {task.completed ? 'Done' : 'Confirm'}
                                </button>
                              )}
                            </div>
                          </div>
                          {editingId === dayStr && <EditTaskForm task={task} onSave={(newT, newF) => handleSaveEdit(dayStr, newT, newF)} onCancel={() => setEditingId(null)} />}
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

  const EditTaskForm = ({ task, onSave, onCancel }) => {
    const [t, setT] = useState(task?.title || '');
    const [f, setF] = useState(task?.focus || '');
    return (
      <div className="absolute right-0 bg-white p-4 border shadow-2xl rounded-xl z-50 w-72">
        <input className="w-full p-2 border rounded mb-2 text-sm font-bold" value={t} onChange={e => setT(e.target.value)} placeholder="Title" />
        <textarea className="w-full p-2 border rounded mb-2 text-sm" value={f} onChange={e => setF(e.target.value)} placeholder="Focus" rows={2} />
        <div className="flex gap-2">
          <button onClick={() => onSave(t, f)} className="bg-blue-600 text-white px-4 py-1 rounded text-xs font-black">SAVE</button>
          <button onClick={onCancel} className="text-slate-400 text-xs font-bold">CANCEL</button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-slate-900 overflow-hidden">
      {isBulkEditing && <RenderBulkEditModal />}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-6 text-xl font-black border-b border-slate-700 text-white tracking-tighter uppercase italic flex items-center gap-3">
          <img src="https://flagcdn.com/w40/ch.png" alt="Switzerland" className="w-6 h-4" />
          Swiss Mission 27
        </div>
        <nav className="flex-1 p-4 space-y-2 font-bold">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}><LayoutDashboard size={20}/><span>Dashboard</span></button>
          <button onClick={() => setActiveTab('roadmap')} className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${activeTab === 'roadmap' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}><Calendar size={20}/><span>Roadmap</span></button>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-12 bg-gray-50">
          {activeTab === 'dashboard' ? <RenderDashboard /> : <RenderRoadmap />}
      </main>
    </div>
  );
};

export default Dashboard;
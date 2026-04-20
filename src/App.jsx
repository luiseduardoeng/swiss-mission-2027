import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { LayoutDashboard, Plane, Factory, BookOpen, Brain, Clock, Calendar, CheckCircle2, Circle, Edit3, Save, ChevronDown, ChevronUp } from 'lucide-react';
=======
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, collection } from "firebase/firestore";
import { LayoutDashboard, Plane, Factory, Clock, Calendar, CheckCircle2, Circle, Edit3, ChevronDown, ChevronUp } from 'lucide-react';

// --- COLE SUAS CREDENCIAIS DO FIREBASE AQUI ---
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
>>>>>>> 22a5ad5 (add: firebase credentials and logic)

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedPhase, setExpandedPhase] = useState(1);
  const [expandedMonth, setExpandedMonth] = useState('April');
  const [editingId, setEditingId] = useState(null);
  
  // --- PERSISTÊNCIA COM LOCALSTORAGE ---
  const [manualTasks, setManualTasks] = useState(() => {
    const saved = localStorage.getItem('swissMissionTasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('swissMissionTasks', JSON.stringify(manualTasks));
  }, [manualTasks]);

  // --- ENGLISH GRAMMAR SCHEDULE ---
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

<<<<<<< HEAD
=======
  // --- SINCRONIZAÇÃO EM TEMPO REAL COM FIRESTORE ---
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setManualTasks(tasksData);
    });
    return () => unsub();
  }, []);

  const handleToggleTask = async (task) => {
    const taskRef = doc(db, "tasks", task.date);
    await setDoc(taskRef, {
      ...task,
      completed: !task.completed
    }, { merge: true });
  };

  const handleSaveEdit = async (date, title, focus) => {
    const taskRef = doc(db, "tasks", date);
    await setDoc(taskRef, {
      date,
      title,
      focus,
      completed: false
    }, { merge: true });
    setEditingId(null);
  };

  // --- ENGLISH GRAMMAR SCHEDULE ---
  const grammarSchedule = {
    "2026-04-20": "The Verb To Be (Present) and Personal Pronouns",
    "2026-04-27": "Articles (A, An, The) and Plural Nouns",
    // ... (Mantenha todos os itens da lista anterior aqui)
    "2027-02-15": "B1 General Review and Consolidation"
  };

>>>>>>> 22a5ad5 (add: firebase credentials and logic)
  const calculateProgress = () => {
    const totalEstimatedPoints = 480; 
    const getWeight = (title) => {
      if (title.includes('English Class')) return 3;
      if (title.includes('Grammar Focus')) return 2;
      return 1;
    };
    const completedPoints = manualTasks
      .filter(t => t.completed)
      .reduce((acc, t) => acc + getWeight(t.title), 0);
    return Math.min(100, Math.round((completedPoints / totalEstimatedPoints) * 100));
  };

  const currentPercent = calculateProgress();

  const getAutoContent = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = date.getDay(); 
<<<<<<< HEAD
    const isBreak = date >= new Date('2026-12-21') && date <= new Date('2027-01-10');
    if (isBreak && dayOfWeek !== 1) return null;

=======
>>>>>>> 22a5ad5 (add: firebase credentials and logic)
    if (dayOfWeek === 5) return { title: 'English Class (Private)', focus: '7:30 AM - B1 Acceleration' };
    if (dayOfWeek === 1) return { title: 'Grammar Focus', focus: grammarSchedule[dateStr] || "Review & Practice" };

    const contentMap = {
      2: { title: 'Technical Vocabulary', focus: 'Poultry Industry & Engineering Terms' },
      3: { title: 'Lesson Exercises', focus: 'Reviewing and solving class activities' },
      4: { title: 'Listening Practice', focus: 'Swiss/International English Accents' }
    };
    return contentMap[dayOfWeek] || null;
  };

  const RenderDashboard = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const startDate = new Date('2026-04-17T00:00:00');

<<<<<<< HEAD
    const getNextClassDate = () => {
      const now = new Date();
      const limitToday = new Date();
      limitToday.setHours(9, 0, 0);
      let nextFriday = new Date();
      nextFriday.setDate(now.getDate() + (5 + 7 - now.getDay()) % 7);
      if (now.getDay() === 5 && now > limitToday) nextFriday.setDate(nextFriday.getDate() + 7);
      return nextFriday.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' });
    };

=======
>>>>>>> 22a5ad5 (add: firebase credentials and logic)
    const upcoming = [];
    for(let d = new Date(today); d <= nextWeek; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const currentDateObj = new Date(dateStr + 'T00:00:00');
      if (currentDateObj >= startDate) {
        const cloudTask = manualTasks.find(t => t.id === dateStr);
        const auto = getAutoContent(dateStr);
        if (cloudTask || auto) upcoming.push(cloudTask || { ...auto, date: dateStr, completed: false });
      }
    }

    return (
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight italic uppercase">Swiss Mission Dashboard</h1>
<<<<<<< HEAD
            <p className="text-slate-500">Targeting B1 Proficiency for February 2027.</p>
=======
            <p className="text-slate-500">Cloud Synchronized • B1 Proficiency 2027</p>
>>>>>>> 22a5ad5 (add: firebase credentials and logic)
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
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Overall Progress</h3>
            <p className="text-3xl font-black text-slate-800 mt-2">{currentPercent}%</p>
            <div className="w-full bg-slate-100 rounded-full h-3 mt-4">
              <div className="bg-blue-600 h-3 rounded-full transition-all duration-700" style={{ width: `${currentPercent}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-600">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Days to Switzerland</h3>
            <p className="text-3xl font-black text-slate-800 mt-2">{Math.ceil((new Date('2027-02-22') - new Date()) / (1000 * 3600 * 24))} Days</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-600">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Status</h3>
            <p className="text-3xl font-black text-slate-800 mt-2">Online</p>
            <p className="text-xs text-green-500 mt-2 italic font-bold">Synced with Firebase</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-blue-600" size={24} /> Weekly Schedule
          </h2>
          <div className="space-y-4">
            {upcoming.map((task, idx) => (
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
<<<<<<< HEAD
                <button 
                  onClick={() => {
                    const newTasks = manualTasks.filter(t => t.date !== task.date);
                    setManualTasks([...newTasks, { ...task, completed: !task.completed }]);
                  }}
                  className="text-blue-600 hover:scale-110 transition-transform"
                >
=======
                <button onClick={() => handleToggleTask(task)} className="text-blue-600 hover:scale-110 transition-transform">
>>>>>>> 22a5ad5 (add: firebase credentials and logic)
                  {task.completed ? <CheckCircle2 className="text-green-600" size={32} /> : <Circle size={32} className="text-blue-200" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

<<<<<<< HEAD
  // ... (RenderRoadmap e EditTaskForm seguem a mesma lógica, mantendo consistência) ...

  const RenderRoadmap = () => {
    const phases = [
      { id: 1, title: 'Phase 1: Foundation (A1)', color: 'border-blue-600', text: 'text-blue-600', bg: 'bg-blue-600', months: ['April', 'May', 'June', 'July'] },
      { id: 2, title: 'Phase 2: Construction (A2)', color: 'border-orange-500', text: 'text-orange-500', bg: 'bg-orange-500', months: ['August', 'September', 'October', 'November'] },
      { id: 3, title: 'Phase 3: Independence (B1)', color: 'border-red-600', text: 'text-red-600', bg: 'bg-red-600', months: ['December', 'January', 'February'] }
    ];
    return (
      <div className="max-w-4xl mx-auto pb-10">
        <header className="mb-10 text-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight uppercase italic">Swiss Mission Roadmap</h1>
          <p className="text-slate-500">English Proficiency Strategy</p>
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
                              <EditTaskForm task={task} onSave={(newT, newF) => {
                                  setManualTasks([...manualTasks.filter(t => t.date !== dayStr), { date: dayStr, title: newT, focus: newF, completed: false }]);
                                  setEditingId(null);
                                }} onCancel={() => setEditingId(null)} />
                            ) : (
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className={`font-bold ${task?.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task ? task.title : <span className="text-slate-200 italic font-normal text-sm">Review Day</span>}</p>
                                  {task?.focus && <p className="text-xs text-blue-500 font-bold italic mt-0.5">{task.focus}</p>}
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setEditingId(dayStr)} className="p-2 text-slate-300 hover:text-blue-600"><Edit3 size={18}/></button>
                                  {task && (
                                    <button onClick={() => {
                                        const newTasks = manualTasks.filter(t => t.date !== dayStr);
                                        setManualTasks([...newTasks, { ...task, date: dayStr, completed: !task.completed }]);
                                    }} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${task.completed ? 'bg-green-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'}`}>
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
=======
  // ... (Restante do código RenderRoadmap similar ao anterior usando handleSaveEdit e manualTasks) ...
>>>>>>> 22a5ad5 (add: firebase credentials and logic)

  const EditTaskForm = ({ task, onSave, onCancel }) => {
    const [selectedType, setSelectedType] = useState(task?.title === 'English Class (Private)' ? 'class' : task?.title === 'Grammar Focus' ? 'grammar' : 'other');
    const [customTitle, setCustomTitle] = useState(selectedType === 'other' ? task?.title || '' : '');
    const [focus, setFocus] = useState(task?.focus || '');
    return (
      <div className="space-y-2 p-2 bg-slate-50 rounded-lg border border-blue-100">
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="p-2 border rounded bg-white text-sm font-bold w-full">
          <option value="class">English Class (Private)</option>
          <option value="grammar">Grammar Focus</option>
          <option value="other">Custom Task</option>
        </select>
        {selectedType === 'other' && <input className="p-2 border rounded font-bold text-sm w-full" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} />}
        <input className="p-2 border rounded text-sm w-full" value={focus} onChange={(e) => setFocus(e.target.value)} />
        <div className="flex space-x-2 pt-1">
          <button onClick={() => onSave(selectedType === 'class' ? 'English Class (Private)' : selectedType === 'grammar' ? 'Grammar Focus' : customTitle, focus)} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-black">SAVE</button>
          <button onClick={onCancel} className="text-slate-400 text-xs font-bold">CANCEL</button>
        </div>
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
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-12 bg-gray-50">
          {activeTab === 'dashboard' ? <RenderDashboard /> : <p className="text-center">Roadmap view is active. Syncing data...</p>}
      </main>
    </div>
  );
};

<<<<<<< HEAD
export default Dashboard;
=======
export default Dashboard;
>>>>>>> 22a5ad5 (add: firebase credentials and logic)

import React, { useState } from 'react';
import { Settings, Plus, Trash2, Search, Database } from 'lucide-react';

interface AdminViewProps {
  exerciseList: string[];
  onAdd: (name: string) => void;
  onDelete: (name: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ exerciseList, onAdd, onDelete }) => {
  const [newEx, setNewEx] = useState('');
  const [search, setSearch] = useState('');

  const filtered = exerciseList.filter(ex => 
    ex.toLowerCase().includes(search.toLowerCase())
  ).sort();

  const handleAdd = () => {
    if (!newEx.trim()) return;
    onAdd(newEx.trim());
    setNewEx('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="glass-card p-6 rounded-3xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-slate-400" />
          Settings & Database
        </h2>
        <p className="text-sm text-slate-400">Manage your global exercise list here. These appear in the dropdown when adding workouts.</p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-white/5 bg-white/5">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                <Database className="w-4 h-4 text-blue-400" />
                Exercise Database ({exerciseList.length})
            </h3>
            
            <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="New Exercise Name..."
                    value={newEx}
                    onChange={(e) => setNewEx(e.target.value)}
                />
                <button 
                    onClick={handleAdd}
                    disabled={!newEx.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-700 text-white px-4 rounded-xl font-bold transition-all"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:bg-slate-800 transition-colors"
                    placeholder="Search database..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
            {filtered.map(ex => (
                <div key={ex} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl group transition-colors">
                    <span className="text-sm text-slate-300 font-medium">{ex}</span>
                    <button 
                        onClick={() => {
                            if(window.confirm(`Delete "${ex}" from database?`)) onDelete(ex);
                        }}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
            {filtered.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm italic">
                    {search ? "No matches found." : "Database is empty."}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
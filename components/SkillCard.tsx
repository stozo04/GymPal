import React from 'react';
import { Lock, CheckCircle2, Trophy, Unlock } from 'lucide-react';
import { SkillTreeDef } from '../types';

interface SkillCardProps {
  tree: SkillTreeDef;
  currentLevel: number;
  onUnlock: (treeId: string, level: number) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({ tree, currentLevel, onUnlock }) => {
  const progress = ((currentLevel) / tree.nodes.length) * 100;
  
  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden relative group">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-white/5">
        <div className="flex justify-between items-start mb-3">
            <div>
                <h3 className="font-bold text-white text-lg">{tree.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{tree.description}</p>
            </div>
            <div className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold font-mono border border-amber-500/20">
                LVL {currentLevel}
            </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>

      {/* Nodes */}
      <div className="p-4 space-y-2">
        {tree.nodes.map((node) => {
          const isUnlocked = node.level <= currentLevel;
          const isNext = node.level === currentLevel + 1;

          return (
            <div 
                key={node.level} 
                className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isUnlocked ? 'bg-emerald-500/5' : isNext ? 'bg-indigo-500/10 border border-indigo-500/20' : 'opacity-40 grayscale'
                }`}
            >
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    isUnlocked 
                        ? 'bg-emerald-500 border-emerald-400 text-white' 
                        : isNext 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}>
                    {isUnlocked ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : node.level === tree.nodes.length ? (
                        <Trophy className="w-4 h-4" />
                    ) : (
                        <span className="text-xs font-bold">{node.level}</span>
                    )}
                </div>
                
                <div className="flex-1">
                    <div className={`text-sm font-bold ${isUnlocked ? 'text-white' : isNext ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {node.title}
                    </div>
                    <div className="text-[10px] text-slate-500">{node.criteria}</div>
                </div>
                
                {isNext ? (
                  <button 
                    onClick={() => onUnlock(tree.id, node.level)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-all shadow-lg shadow-indigo-900/40 active:scale-95"
                  >
                    <Unlock className="w-3 h-3" />
                    Unlock
                  </button>
                ) : !isUnlocked && (
                  <Lock className="w-3 h-3 text-slate-600" />
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
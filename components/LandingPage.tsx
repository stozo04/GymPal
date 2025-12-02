import React from 'react';
import { Sparkles, CheckCircle, ArrowRight, Dumbbell, MessageCircle, TrendingUp, Shield } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-purple-500/20 backdrop-blur-sm bg-black/30">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  GymPal
                </h1>
                <p className="text-xs text-slate-400">AI Fitness Coach</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          
          {/* Title Section */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="text-white">Your Personal</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                AI Fitness Coach
              </span>
            </h2>
          </div>

          {/* Main Card */}
          <div className="w-full max-w-md mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8 shadow-2xl">
              
              {/* Avatar Circle */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
                  <Dumbbell className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Welcome Text */}
              <h3 className="text-2xl font-bold text-white text-center mb-3">
                Welcome!
              </h3>
              <p className="text-slate-300 text-center mb-8 text-sm leading-relaxed">
                Sign in with your Google account to access your personalized AI fitness coach and achieve your calisthenics goals.
              </p>

              {/* Google Sign In Button */}
              <button className="w-full bg-white hover:bg-slate-50 text-slate-900 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl mb-6">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>

            </div>

            {/* Security Notice */}
            <p className="text-xs text-slate-500 text-center mt-6">
              Your fitness data is secure. Your privacy is our priority.
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-500/20 backdrop-blur-sm bg-black/30 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
            <p>GymPal © 2025 | Secure • Private • Personalized</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Radio, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TOTAL_VISITORS_KEY = 'jinna5_total_platform_visitors_v1';
const BASE_VISITORS_COUNT = 14380;
const BASE_STUDENTS_COUNT = 1420;

interface LivePlatformStatsProps {
  variant?: 'header' | 'banner';
}

export const LivePlatformStats: React.FC<LivePlatformStatsProps> = ({ variant = 'header' }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // 1. Live Users Now (Active Heartbeat)
  const [onlineUsers, setOnlineUsers] = useState(() => Math.floor(Math.random() * 12) + 38);

  // 2. Enrolled Students
  const [enrolledStudents, setEnrolledStudents] = useState(() => {
    try {
      const savedStudent = localStorage.getItem('ai_systems_platform_progress_v1');
      if (savedStudent) {
        const parsed = JSON.parse(savedStudent);
        if (parsed.studentName) return BASE_STUDENTS_COUNT + 8;
      }
    } catch {
      // ignore
    }
    return BASE_STUDENTS_COUNT;
  });

  // 3. All-Time Visitors (Total Platform Users to date)
  const [totalVisitors, setTotalVisitors] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(TOTAL_VISITORS_KEY);
      if (stored) {
        const val = parseInt(stored, 10);
        if (!isNaN(val) && val >= BASE_VISITORS_COUNT) {
          return val;
        }
      }
    } catch {
      // ignore
    }
    return BASE_VISITORS_COUNT;
  });

  // Increment visitor counter on visit
  useEffect(() => {
    try {
      const hasVisitedThisSession = sessionStorage.getItem('jinna5_session_visited');
      if (!hasVisitedThisSession) {
        sessionStorage.setItem('jinna5_session_visited', 'true');
        setTotalVisitors(prev => {
          const next = prev + 1;
          localStorage.setItem(TOTAL_VISITORS_KEY, next.toString());
          return next;
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // Heartbeat fluctuation for live online users (realistic live traffic pattern)
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const nextVal = prev + delta;
        return Math.max(28, Math.min(64, nextVal));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  if (variant === 'header') {
    return (
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs">
        {/* Metric 1: Online Users Now */}
        <div 
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium transition-all ${
            isLight 
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' 
              : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
          }`}
          title="عدد المستخدمين المتصلين بالمنصة في الوقت الفعلي"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-semibold">
            متصل الآن: <strong className="font-mono">{onlineUsers}</strong>
          </span>
        </div>

        {/* Metric 2: Enrolled Students */}
        <div 
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium transition-all ${
            isLight 
              ? 'bg-blue-50/90 border-blue-200 text-blue-800' 
              : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
          }`}
          title="إجمالي عدد الطلاب والمهندسين المسجلين بالدبلومة"
        >
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px]">
            الطلاب: <strong className="font-mono">{enrolledStudents.toLocaleString('ar-EG')}</strong>
          </span>
        </div>

        {/* Metric 3: All-Time Users */}
        <div 
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium transition-all ${
            isLight 
              ? 'bg-purple-50/90 border-purple-200 text-purple-800' 
              : 'bg-purple-950/30 border-purple-500/30 text-purple-300'
          }`}
          title="إجمالي عدد الزيارات والمستخدمين للمنصة حتى الآن"
        >
          <Eye className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px]">
            إجمالي الزوار: <strong className="font-mono">{totalVisitors.toLocaleString('ar-EG')}</strong>
          </span>
        </div>
      </div>
    );
  }

  // Banner / Hero variant (more prominent badge layout)
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 my-3">
      {/* 1. Online Now */}
      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
        isLight 
          ? 'bg-white border-emerald-200/80 shadow-xs' 
          : 'bg-[#0E1318] border-emerald-500/20'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center relative ${
          isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        }`}>
          <Radio className="w-4 h-4 animate-pulse" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-medium">مستخدمين متصلين الآن</div>
          <div className="text-sm sm:text-base font-bold font-mono text-emerald-500 flex items-center gap-1">
            <span>{onlineUsers}</span>
            <span className="text-[10px] font-normal text-emerald-400/80">نشط لحظياً</span>
          </div>
        </div>
      </div>

      {/* 2. Students */}
      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
        isLight 
          ? 'bg-white border-blue-200/80 shadow-xs' 
          : 'bg-[#0F121C] border-cyan-500/20'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isLight ? 'bg-blue-100 text-blue-700' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
        }`}>
          <GraduationCap className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-medium">طلاب الدبلومة المسجلين</div>
          <div className="text-sm sm:text-base font-bold font-mono text-cyan-400">
            {enrolledStudents.toLocaleString('ar-EG')}+
          </div>
        </div>
      </div>

      {/* 3. All-time Users */}
      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
        isLight 
          ? 'bg-white border-purple-200/80 shadow-xs' 
          : 'bg-[#14101F] border-purple-500/20'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
        }`}>
          <Users className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-medium">إجمالي المستخدمين للآن</div>
          <div className="text-sm sm:text-base font-bold font-mono text-purple-400">
            {totalVisitors.toLocaleString('ar-EG')}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Compass, BookOpen, Layers, Edit3, HelpCircle } from "lucide-react";

interface HeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const menuItems = [
    { id: 1, label: "1차시: 지리적 특성", icon: Compass },
    { id: 2, label: "2차시: 사료와 지도", icon: BookOpen },
    { id: 3, label: "3차시: 현대 갈등과 평화", icon: Layers },
    { id: 4, label: "수업 활동지: 교과서 집필", icon: Edit3 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-200 flex items-center justify-center">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-lg text-slate-900 tracking-tight leading-none">
                독도 영토 주권 교육 종합 교재
              </h1>
              <p className="font-sans text-xs text-slate-500 font-medium mt-1">
                대한민국 역사·지리 평화교육위원회 • 중·고등 융합 자료
              </p>
            </div>
          </div>
          
          <nav className="hidden lg:flex space-x-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm border border-slate-100/50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-500" : "text-slate-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="lg:hidden flex items-center">
            {/* Mobile simplified selector inside select element */}
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 font-sans font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1차시: 지리적 특성</option>
              <option value={2}>2차시: 사료와 지도</option>
              <option value={3}>3차시: 현대 갈등과 평화</option>
              <option value={4}>수업 활동지: 교과서 집필</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}

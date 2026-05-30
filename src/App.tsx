import React, { useState } from "react";
import Header from "./components/Header";
import LessonOne from "./components/LessonOne";
import LessonTwo from "./components/LessonTwo";
import LessonThree from "./components/LessonThree";
import LessonFour from "./components/LessonFour";

export default function App() {
  const [activeTab, setActiveTab] = useState<number>(1);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-800">
      <div className="space-y-0">
        {/* Navigation Header */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Viewer Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-all duration-300">
          {activeTab === 1 && <LessonOne />}
          {activeTab === 2 && <LessonTwo />}
          {activeTab === 3 && <LessonThree />}
          {activeTab === 4 && <LessonFour />}
        </main>
      </div>

      {/* Aesthetic Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-sans text-xs font-bold text-slate-350 tracking-wide">
              대한민국 역사·지리 평화교육위원회 • 중·고등용 역사 및 지리 융합 수업 보조 자료
            </p>
            <p className="font-sans text-[11px] text-slate-500 font-medium mt-1">
              본 교재의 사료 가설 및 대조 문헌들은 공무 기록 및 사사 자료에 터 잡고 있습니다. 
              국립수산과학원, 해양수산부 및 외교부 공식 의견을 준수합니다.
            </p>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <span className="font-sans text-[10px] text-slate-400 block font-bold">2026년 5월 정기개정총안</span>
            <span className="font-sans text-[10px] text-slate-500 mt-1.5 block">© 2026 대한민국 역사·지리 평화교육위원회. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

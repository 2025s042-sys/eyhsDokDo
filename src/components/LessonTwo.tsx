import React, { useState } from "react";
import { HISTORICAL_SOURCES, HISTORICAL_MAPS, AN_TIMELINE } from "../data";
import { BookOpen, CheckCircle, HelpCircle, ArrowRight, ShieldCheck, FileText, Compass, Calendar, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

export default function LessonTwo() {
  const [originFilter, setOriginFilter] = useState<"ALL" | "KOREA" | "JAPAN">("ALL");
  const [selectedSourceId, setSelectedSourceId] = useState<number | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<number>(1);

  const filteredSources = HISTORICAL_SOURCES.filter(
    (src) => originFilter === "ALL" || src.origin === originFilter
  );

  return (
    <div className="space-y-12">
      {/* Intro Hero */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-xl border border-indigo-900/40">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
            2차시 • 고문헌 및 사료 분석
          </span>
          <h2 className="font-sans text-3xl lg:text-4xl font-extrabold tracking-tight mt-4 text-white">
            사료와 지도로 규명하는 역사적 권원
          </h2>
          <p className="font-sans text-md text-slate-300 font-medium mt-4 leading-relaxed">
            역사는 추상적인 감정이 아닌 교차 검증된 **1차 사료(Primary Sources)**의 명증한 사실관계 위에 세워집니다. 
            조선 왕조의 철저한 행정 기록과 역설적으로 자국의 영유 주권을 전면 부인하는 에도 막부·메이지 정부의 결정적 고백형 국가 문헌들을 함께 대조해 봅니다.
          </p>
        </div>
      </div>

      {/* Segment 1: Documents & Proofs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="font-sans text-lg font-bold text-slate-900 tracking-tight">
              한·일 양국 고문서 교차 분석
            </h3>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            {(["ALL", "KOREA", "JAPAN"] as const).map((filter) => (
              <button
                key={filter}
                id={`filter-btn-${filter}`}
                onClick={() => setOriginFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  originFilter === filter
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {filter === "ALL" && "전체 사료"}
                {filter === "KOREA" && "대한민국 고문서"}
                {filter === "JAPAN" && "일본 관찬 고문서"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leftside Scroll/List of Sources */}
          <div className="lg:col-span-1 space-y-3 max-h-[550px] overflow-y-auto pr-2">
            {filteredSources.map((src) => {
              const isSelected = selectedSourceId === src.id || (selectedSourceId === null && src.id === filteredSources[0]?.id);
              const isKorea = src.origin === "KOREA";
              return (
                <div
                  key={src.id}
                  id={`source-card-${src.id}`}
                  onClick={() => setSelectedSourceId(src.id)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/40 border-indigo-200 shadow-sm"
                      : "bg-white border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                        isKorea
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isKorea ? "KOR 대한민국" : "JPN 일본 관찬"}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{src.year}</span>
                  </div>
                  <h4 className="font-sans text-sm font-bold text-slate-800 mt-2.5 leading-tight">{src.title}</h4>
                  <p className="font-sans text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                    {src.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Rightside detailed focus pane */}
          <div className="lg:col-span-2">
            {(() => {
              const currentId = selectedSourceId ?? filteredSources[0]?.id;
              const src = HISTORICAL_SOURCES.find((s) => s.id === currentId);
              if (!src) return <div className="text-slate-400 font-sans text-xs py-10">사료를 선택해 주세요.</div>;
              const isKorea = src.origin === "KOREA";
              return (
                <motion.div
                  key={src.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-mono text-indigo-600 font-bold tracking-wider">{src.year} 편찬</span>
                      <h3 className="font-sans text-xl font-extrabold text-slate-900 mt-1 leading-none">
                        {src.title}
                      </h3>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${isKorea ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                      {isKorea ? "대한민국 관보/실록" : "일본 최고자치 보고서"}
                    </span>
                  </div>

                  <div className="bg-slate-50 border-l-4 border-indigo-500 rounded-r-2xl p-5 font-serif text-sm text-slate-700 leading-relaxed italic">
                    {src.keyContent}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider">문헌 배경 설명</h4>
                      <p className="font-sans text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                        {src.description}
                      </p>
                    </div>

                    <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50">
                      <h4 className="font-sans text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        역사적·법적 효력 해설
                      </h4>
                      <p className="font-sans text-xs text-emerald-700 mt-2 leading-relaxed font-medium">
                        {src.meaning}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Segment 2: Ancient Maps Comparison */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/40 space-y-6">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-600" />
          <h3 className="font-sans text-lg font-bold text-slate-900 tracking-tight">
            한·일 고지도(Ancient Maps) 정밀 대조 분석
          </h3>
        </div>
        <p className="font-sans text-xs text-slate-500 leading-relaxed font-normal">
          고지도는 당대 국가 행정 주권과 학문적 지리학 한계를 극적으로 시사하는 시각적 척도입니다. 일본의 유명 지리학자 및 관선 지도 역시 독도를 조선 국경의 범주에 배치했음을 고백합니다.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Map selectors */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {HISTORICAL_MAPS.map((m) => {
              const isSelected = selectedMapId === m.id;
              return (
                <button
                  key={m.id}
                  id={`map-btn-${m.id}`}
                  onClick={() => setSelectedMapId(m.id)}
                  className={`flex-none lg:flex-1 text-left p-4 rounded-2xl border transition-all text-xs font-bold leading-normal ${
                    isSelected
                      ? "bg-white border-indigo-200 text-indigo-600 shadow-sm"
                      : "bg-slate-100/50 border-slate-200/40 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-mono text-[9px] text-slate-400 block mb-1">{m.year} • {m.creator}</span>
                  {m.title}
                </button>
              );
            })}
          </div>

          {/* Map details */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            {(() => {
              const m = HISTORICAL_MAPS.find((map) => map.id === selectedMapId);
              if (!m) return null;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-start gap-2 border-b border-slate-50 pb-3">
                    <div>
                      <h4 className="font-sans text-sm font-bold text-slate-900 leading-tight">{m.title}</h4>
                      <p className="font-sans text-[11px] text-slate-400 font-semibold mt-1">제작시기/주체: {m.creator} ({m.year})</p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100">
                      고지도 증언
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="font-sans text-xs text-slate-600 leading-relaxed">
                      <strong>지도의 구성 및 의도:</strong><br />
                      {m.description}
                    </p>
                    <div className="bg-indigo-50/20 border border-indigo-100/50 p-3.5 rounded-xl text-indigo-800 text-xs font-medium leading-relaxed flex gap-2">
                       <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                       <div>
                         <strong>핵심 사실 확인 (Fact Check):</strong><br />
                         {m.factCheck}
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Segment 3: Historical Diplomacy Journey (An Yong-Bok Timeline) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h3 className="font-sans text-lg font-bold text-slate-900 tracking-tight">
            어부 안용복의 자주적 외교 투쟁
          </h3>
        </div>
        <p className="font-sans text-xs text-slate-500 leading-relaxed font-normal">
          17세기 후반 평범한 조선 어민이었던 안용복의 목숨을 건 두 차례의 도일(渡日)과 강력한 성토는 당시 최고 권력층인 에도 막부로부터 &quot;죽도(울릉도)와 송도(독도)는 일본 국경 밖&quot;이라는 정식 공인 합의를 이끌어냈습니다.
        </p>

        <div className="relative border-l border-slate-200 ml-3.5 pl-6 space-y-8 py-3">
          {AN_TIMELINE.map((event, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[30.5px] top-1.5 bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shadow-sm shadow-blue-200">
                {idx + 1}
              </span>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2 hover:shadow-md transition-all">
                <span className="font-mono text-xs font-extrabold text-blue-600">{event.year}</span>
                <h4 className="font-sans text-sm font-bold text-slate-800">{event.title}</h4>
                <p className="font-sans text-xs text-slate-500 leading-relaxed font-normal">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

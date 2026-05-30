import React, { useState } from "react";
import { CONTEMPORARY_ISSUES } from "../data";
import { Layers, Shield, Calendar, Award, Zap, AlertCircle, FileText, Anchor } from "lucide-react";
import { motion } from "motion/react";

export default function LessonThree() {
  const [selectedIssueIdx, setSelectedIssueIdx] = useState<number>(0);

  return (
    <div className="space-y-12">
      {/* Intro Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-xl border border-blue-900/40">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-widest">
            3차시 • 현대 국제정치와 평화론
          </span>
          <h2 className="font-sans text-3xl lg:text-4xl font-extrabold tracking-tight mt-4 text-white">
            현대 독도 갈등의 전개와 평화적 상생 방안
          </h2>
          <p className="font-sans text-md text-slate-300 font-medium mt-4 leading-relaxed">
            전후 냉전기의 영토 조약상 공백과 유엔 해양법 협약(EEZ) 체정 과정론이 얽혀 현대 독도는 복합적인 한일 외교 대안으로 부각되었습니다. 
            단호하게 주권을 사수했던 민간 청년들의 목숨 건 헌신부터 미래 세대 간 갈등을 매듭짓는 평화적 상생 아이디어를 짚어봅니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Dynamic Modern Timeline Slider links */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest">
              현대사 연표 네비게이터
            </h4>
          </div>
          <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
            {CONTEMPORARY_ISSUES.map((issue, idx) => {
              const isActive = selectedIssueIdx === idx;
              return (
                <button
                  key={idx}
                  id={`modern-issue-btn-${idx}`}
                  onClick={() => setSelectedIssueIdx(idx)}
                  className={`text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 relative ${
                    isActive
                      ? "bg-blue-50/40 border-blue-200 shadow-sm"
                      : "bg-white border-slate-100/80 hover:border-slate-200"
                  }`}
                >
                  <span className={`font-mono text-xs font-black p-2 rounded-xl shrink-0 ${
                    isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {issue.year.split("년")[0]}
                  </span>
                  <div className="min-w-0">
                    <h5 className="font-sans text-xs font-semibold text-slate-400">{issue.year}</h5>
                    <h4 className="font-sans text-sm font-bold text-slate-800 leading-tight mt-1 truncate">{issue.title}</h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Focus Section */}
        <div className="lg:col-span-7">
          {(() => {
            const issue = CONTEMPORARY_ISSUES[selectedIssueIdx];
            if (!issue) return null;
            return (
              <motion.div
                key={selectedIssueIdx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <div>
                      <span className="font-mono text-xs text-blue-600 font-extrabold tracking-wider">{issue.year}</span>
                      <h3 className="font-sans text-xl font-extrabold text-slate-900 mt-1 leading-tight">
                        {issue.title}
                      </h3>
                    </div>
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                      현대 분쟁 규명
                    </span>
                  </div>

                  <p className="font-sans text-xs text-slate-600 leading-relaxed font-normal">
                    {issue.description}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-50">
                  {/* Specialized contextual dynamic alert labels */}
                  {selectedIssueIdx === 1 && (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-800">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <h6 className="font-sans text-xs font-bold">역사적 조약의 공백 분석</h6>
                        <p className="font-sans text-[11px] font-normal leading-relaxed text-rose-700 mt-1">
                          샌프란시스코 강화조약 제2조에서 명시적으로 독도가 기재 누락된 틈은, 오늘날 일본 국회의 우경 단체들이 독도를 국제 사법 재판소(ICJ) 등의 쟁송 카드로 내모는 주도적 구실이 되었습니다.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedIssueIdx === 3 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-amber-800">
                      <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h6 className="font-sans text-xs font-bold">독도의용수비대의 명예와 가치</h6>
                        <p className="font-sans text-[11px] font-normal leading-relaxed text-amber-700 mt-1">
                          국가가 전쟁으로 경황이 없던 때, 순수 울릉 민간 어부 출신 독도의용수비대는 수적으로나 장비로 훨씬 우세한 일본 함대를 실효적 기지로 좌절시켜 영토적 전복 시도를 원천 차단했습니다.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedIssueIdx === 4 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
                      <Anchor className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h6 className="font-sans text-xs font-bold">중간수역 기설과 어족 이권</h6>
                        <p className="font-sans text-[11px] font-normal leading-relaxed text-blue-700 mt-1">
                          중간수역 제도 도입은 영유권과 어업권을 물리적으로 분리한 한시적 해결로서, 독도 섬 자체의 주권을 교환한 타협은 결코 아니며 한민족의 해원 어선 이권을 우선 수호하려는 외교적 방지선이었습니다.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <p className="font-sans text-xs text-slate-500 font-semibold leading-relaxed">
                      💡 독도에 관한 대한민국 정부의 공식 대외 입장:<br />
                      <span className="text-slate-700 font-medium font-sans text-[11px]">
                        &quot;독도는 역사적, 지리적, 국제법적으로 명백한 대한민국의 고유 영토이며, 독도에 대한 영토 분쟁은 존재하지 않으므로 외교적 수사 대립 거래의 대상이 될 수 없습니다.&quot;
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

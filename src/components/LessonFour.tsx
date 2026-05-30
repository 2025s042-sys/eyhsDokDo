import React, { useState } from "react";
import { DISCUSSIONS } from "../data";
import { EvaluationResult } from "../types";
import { Edit3, CheckCircle, AlertTriangle, Send, RefreshCw, BarChart2, Star, UserCheck, Award, MessageSquare, BookOpen, Info } from "lucide-react";
import { motion } from "motion/react";

export default function LessonFour() {
  const [kName, setKName] = useState("");
  const [jName, setJName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Active state for discussion hints
  const [activeHintIdx, setActiveHintIdx] = useState<number | null>(null);

  const handleSubmitDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMsg("정해진 분량의 공동 집필 본문을 가득 작성해 주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setEvaluation(null);

    try {
      const response = await fetch("/api/evaluate-textbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kName, jName, title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "평가 요청에 실패했습니다.");
      }

      const evalResult: EvaluationResult = await response.json();
      setEvaluation(evalResult);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "서버와 통신하는 과정 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadExampleDraft = () => {
    setKName("김민준 (대한민국)");
    setJName("사토 하루카 (일본)");
    setTitle("동해의 평화로운 등대, 독도의 역사적 사료와 미래지향적 만남");
    setContent(
      "동해의 평화로운 섬 독도는 다양한 역사적 사료를 통해 한민족의 영토임이 증명됩니다. 한국의 『세종실록지리지(1454년)』에는 '울릉도와 우산도(독도)가 서로 거리가 멀지 않아 날씨가 맑으면 바라볼 수 있다'며 울릉 도민들의 예로부터의 생활 자각을 입증하고 있습니다. 또한 일본 메이지 정부의 최고 행정 기관이 내린 영구적 성명인 『태정관 지령(1877년)』에서도 '울릉도와 독도는 일본과 전혀 관계가 없음'을 천명하여 자국 국경 밖 영역임을 실증했습니다. 2차 대전 후 연합국의 조치를 통해 독도는 대한민국 주권에 온전히 수환되었습니다. 오늘날 양국 미래 세대는 편향된 왜곡에서 비약하여, 평화적인 해양 공역 번영을 목표로 상호 성심으로 협조해가야 할 것입니다."
    );
  };

  return (
    <div className="space-y-12">
      {/* Intro Hero banner */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-xl border border-blue-900/40">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-widest">
            수업 활동지 • 워크숍
          </span>
          <h2 className="font-sans text-3xl lg:text-4xl font-extrabold tracking-tight mt-4 text-white">
            한·일 평화 공동 교과서 집필하기
          </h2>
          <p className="font-sans text-md text-slate-300 font-medium mt-4 leading-relaxed">
            한라에서 오키나와까지, 왜곡된 대립에서 한 단계 성숙히 도약해 봅니다. 
            양국의 두 청소년들이 공동 역사 수업 파트너가 되어, <strong>공무서 사료에 기반해 사실 중심적이고 비판적이며 미래지향적인 독도 단원 구술</strong>을 직접 창작하는 협동 라이팅 워크숍입니다.
          </p>
        </div>
      </div>

      {/* Grid Layout: Main work form & Discussion list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Panel: Writing Board */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-indigo-50">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-sans text-base font-bold text-slate-900 tracking-tight">
                  공동 교과서 서술 제안서 작성 보드
                </h3>
              </div>
              <button
                type="button"
                id="load-example-draft-btn"
                onClick={loadExampleDraft}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-sans text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              >
                📝 예시 템플릿 채우기
              </button>
            </div>

            {/* Instruction specs */}
            <div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-100/50 space-y-2">
              <h4 className="font-sans text-xs font-bold text-indigo-900 leading-tight flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                작성 시 필수 정략 전제 (조건)
              </h4>
              <ul className="list-disc pl-5 font-sans text-[11px] text-indigo-800 space-y-1 leading-relaxed">
                <li>앞서 습득한 한·일 고문서 사료(세종실록지리지, 태정관 지령 등) 중 **최소 2개 이상**을 역사적 근거로 인용할 기획</li>
                <li>한쪽에 편향된 선동적 조롱이나 극단적 영치 감정을 배제하고, **사실(Fact)** 및 미래지향에 터 잡은 평화 우애로 기술할 것</li>
                <li>교과 서술 단원식으로 고결하고 정밀하게 약 **10줄 내외**로 요약할 것</li>
              </ul>
            </div>

            <form onSubmit={handleSubmitDraft} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">한국 학생 소속명</label>
                  <input
                    type="text"
                    value={kName}
                    onChange={(e) => setKName(e.target.value)}
                    placeholder="예: 김민준 (서울중학교)"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">일본 학생 소속명</label>
                  <input
                    type="text"
                    value={jName}
                    onChange={(e) => setJName(e.target.value)}
                    placeholder="예: 사토 하루카 (도쿄중학교)"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">제안하는 공동 교과서 단원 제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 역사적 사료의 증언과 동해의 미래 평화"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 flex justify-between">
                  <span>공동 집필 교과 본문 (10줄 내외)</span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{content.length} 자 수록</span>
                </label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="역사 고문서 2개 이상을 직접적으로 명시하며, 평화롭고 격조 높은 조서 단원으로 기술해 보아 제출하십시오..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-3 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-800 text-xs flex gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                id="submit-evaluate-btn"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 disabled:bg-blue-300"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    수석 평가위원 심의 및 사료 검증 중...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    대한민국 역사·지리 평화교육위원회에 심사 전송
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Discussion Prompts Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-indigo-50">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="font-sans text-sm font-bold text-slate-900 tracking-tight">
                수업 토론 및 성찰 코너 질문리스트
              </h3>
            </div>
            <p className="font-sans text-[11px] text-slate-500 leading-relaxed font-normal">
              교과서를 집필하기에 앞서, 조원들과 함께 토론 가이드라인을 클릭해 논리와 성찰을 정립해 보세요.
            </p>

            <div className="space-y-4">
              {DISCUSSIONS.map((disc, idx) => {
                const showHint = activeHintIdx === idx;
                return (
                  <div
                    key={disc.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 hover:border-slate-200 transition-all"
                  >
                    <div className="flex gap-2 items-start">
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                        질문 {disc.id}
                      </span>
                      <h4 className="font-sans text-xs font-bold text-slate-800 leading-normal">
                        {disc.question}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-slate-200/50">
                      <button
                        type="button"
                        id={`toggle-disc-hint-${idx}`}
                        onClick={() => setActiveHintIdx(showHint ? null : idx)}
                        className="font-sans text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                         💡 토론 방향 및 모범 힌트 {showHint ? "접기" : "보기"}
                      </button>
                      {showHint && (
                        <motion.p
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="font-sans text-[11px] text-slate-600 mt-2 leading-relaxed"
                        >
                          {disc.hint}
                        </motion.p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Deep detailed Evaluation Report Panel in case of evaluated result present */}
      {evaluation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 text-slate-100 rounded-3xl p-6 lg:p-10 border border-slate-800 shadow-xl space-y-8"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 text-slate-900 p-2.5 rounded-xl hover:scale-105 transition-all">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-amber-500 uppercase tracking-widest font-black">
                  OFFICIAL EVALUATION & COMPLIANCE REPORT
                </span>
                <h3 className="font-sans text-lg lg:text-xl font-black text-white mt-1 leading-none">
                  대한민국 역사·지리 평화교육위원회 공식 심의 결과서
                </h3>
              </div>
            </div>
            <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700/50 text-right">
              <span className="font-sans text-[10px] text-slate-400 block font-bold">심의 관인</span>
              <span className="font-sans text-xs font-bold text-amber-400">{evaluation.approverTitle || "공동 심사위원장"}</span>
            </div>
          </div>

          {/* Source metrics block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
              <span className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                1. 사료 수록 적합성 검증
              </span>
              <div className="flex items-center gap-2 mt-2">
                {evaluation.isSourceSufficient ? (
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 사료 2개 이상 충족됨
                  </span>
                ) : (
                  <span className="bg-rose-500/20 text-rose-400 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> 사료 인용 수량 미달 (기입 요망)
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-slate-300 mt-2 leading-relaxed">
                검출된 핵심 고문헌:{" "}
                <span className="text-amber-300 font-extrabold">
                  {evaluation.detectedSources && evaluation.detectedSources.length > 0
                    ? evaluation.detectedSources.join(", ")
                    : "인용된 한일 고문헌 사료가 뚜렷이 감지되지 않았습니다."}
                </span>
              </p>
            </div>

            {/* Scores block */}
            <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3.5 justify-between flex flex-col">
              <span className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                2. 전문 심의 위원회 집계 평가
              </span>
              <div className="space-y-2.5">
                {[
                  { label: "역사적 고문헌의 정밀성", score: evaluation.evaluationScore?.historicalAccuracy || 80, color: "bg-amber-400" },
                  { label: "일방적 비난 배제 및 평화공동체 기여", score: evaluation.evaluationScore?.peacePerspective || 85, color: "bg-blue-400" },
                  { label: "전체 글의 구성 및 논리", score: evaluation.evaluationScore?.logicalComposition || 75, color: "bg-emerald-400" }
                ].map((crit, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-sans text-slate-300 font-semibold">{crit.label}</span>
                      <span className="font-mono text-white font-extrabold">{crit.score}점</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${crit.color}`} style={{ width: `${crit.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback & Suggestions */}
          <div className="space-y-6 pt-2">
            <div className="bg-slate-850/40 p-5 rounded-2xl border border-slate-800">
              <h4 className="font-sans text-xs font-bold text-amber-500 uppercase tracking-wider">위원회 수석 정례 심의평</h4>
              <p className="font-sans text-xs text-slate-200 mt-3.5 leading-relaxed font-normal whitespace-pre-line">
                {evaluation.feedback}
              </p>
            </div>

            <div className="bg-slate-850/40 p-5 rounded-2xl border border-slate-800">
              <h4 className="font-sans text-xs font-bold text-blue-400 uppercase tracking-wider">주요 집필 개선 제안사항 (Suggestions)</h4>
              <ul className="list-disc pl-5 font-sans text-xs text-slate-300 mt-3.5 space-y-2.5 leading-relaxed">
                {evaluation.suggestions && evaluation.suggestions.map((sug, sIdx) => (
                  <li key={sIdx} className="font-normal font-sans text-xs">{sug}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

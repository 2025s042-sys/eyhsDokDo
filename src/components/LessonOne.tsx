import React, { useState } from "react";
import { GEOGRAPHY_DATA, TERRITORY_STATUS_DATA } from "../data";
import { MoveRight, Compass, Shield, Grid, MapPin, Search, Maximize2, Zap } from "lucide-react";
import { motion } from "motion/react";

export default function LessonOne() {
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [showObservationDetail, setShowObservationDetail] = useState(false);

  return (
    <div className="space-y-10">
      {/* Intro Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-widest">
            1차시 • 지리 및 영역론
          </span>
          <h2 className="font-sans text-3xl lg:text-4xl font-extrabold tracking-tight mt-4 text-white">
            독도의 지리적 특성과 영역의 이해
          </h2>
          <p className="font-sans text-md text-slate-300 font-medium mt-4 leading-relaxed">
            독도가 대한민국의 영토임을 영구히 증명하는 출발점은 흔들릴 수 없는 **물리학적·지리적 사실**과 
            국제 공해법 규정에 기반한 영토/영해/영공의 영역 개념을 명철히 체득하는 것입니다. 
            동해 해원상의 외딴 바위섬이 아닌, 울릉도의 유기적인 모체 영토의 일부로서 지닌 독특한 특성을 함께 살펴봅니다.
          </p>
        </div>
      </div>

      {/* Grid Layout: Location & Size Card & Interactive Distance Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Geography Overview */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <h3 className="font-sans text-lg font-bold text-slate-900 tracking-tight">지리적 위치와 부속 구조</h3>
          </div>
          <p className="font-sans text-sm text-slate-600 leading-relaxed font-normal">
            독도는 화산 활동에 의해 생성된 전형적인 해산 독립체로 동도와 서도의 두 주요 섬 및 다채로운 주위 부속 구조로 이루어집니다.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="font-sans text-[11px] font-semibold tracking-wider text-slate-400 block uppercase">
                좌표 범위 ({GEOGRAPHY_DATA.coordinate.locationNote})
              </span>
              <span className="font-sans text-sm font-bold text-slate-800 mt-2 block leading-snug">
                {GEOGRAPHY_DATA.coordinate.eastLat} <br />
                {GEOGRAPHY_DATA.coordinate.eastLng}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="font-sans text-[11px] font-semibold tracking-wider text-slate-400 block uppercase">
                구성과 총면적
              </span>
              <span className="font-sans text-sm font-bold text-slate-800 mt-2 block leading-snug">
                {GEOGRAPHY_DATA.area.total} <br />
                <span className="text-xs text-slate-500 font-medium">({GEOGRAPHY_DATA.area.subislandsCount})</span>
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-4">
            <p className="font-sans text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              면적 비교: {GEOGRAPHY_DATA.area.comparison}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                <span className="font-sans text-xs font-semibold text-blue-800 block">동도 (東島)</span>
                <span className="font-mono text-xl font-bold text-blue-600 mt-1 block">
                  {GEOGRAPHY_DATA.area.eastIsland}
                </span>
                <p className="font-sans text-[11px] text-blue-500 font-medium mt-1">이사부길 소재</p>
              </div>
              <div className="relative overflow-hidden bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                <span className="font-sans text-xs font-semibold text-emerald-800 block">서도 (西島)</span>
                <span className="font-mono text-xl font-bold text-emerald-600 mt-1 block">
                  {GEOGRAPHY_DATA.area.westIsland}
                </span>
                <p className="font-sans text-[11px] text-emerald-500 font-medium mt-1">안용복길 소재</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Distance Calculator */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Grid className="w-5 h-5 text-blue-600" />
              <h3 className="font-sans text-lg font-bold text-slate-900 tracking-tight">인접 영토 거주지 대조 분석</h3>
            </div>
            <p className="font-sans text-sm text-slate-600 mt-2 leading-relaxed font-normal">
              이웃 국가와의 물리적 거리 대조는 역사적 자각뿐 아니라 실효적 지배 안정성을 입증하는 불변인 기초 데이터입니다. 아래 지점을 클릭해 거리를 한눈에 대조하세요.
            </p>
          </div>

          {/* Interactive Visual Bar Chart */}
          <div className="space-y-4 my-6">
            {GEOGRAPHY_DATA.distances.map((item, idx) => {
              const isSelected = selectedDistance === idx;
              // Calculate percent representations
              const currentNum = parseFloat(item.distance.split(" ")[0]);
              const percent = (currentNum / 216.8) * 100;
              return (
                <div
                  key={idx}
                  id={`distance-metric-${idx}`}
                  onClick={() => setSelectedDistance(idx)}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/50 border-blue-200 shadow-sm"
                      : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-sans text-xs font-bold text-slate-700">{item.destination}</span>
                    <span className="font-mono text-xs font-extrabold text-blue-600">{item.distance}</span>
                  </div>
                  <div className="w-full bg-slate-200/60 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full ${isSelected ? "bg-blue-600" : "bg-slate-400"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="font-sans text-xs text-slate-500 leading-relaxed font-medium">
              💡 **가장 가까운 거리 대조**: 울릉도와 독도 사이 거리는 단 **87.4 km**에 불과하여, 일본 오키섬과의 거리(157.5 km)보다 무려 약 **70 km** 가까이 인접해 있습니다. 이는 국제법적으로 영토 연접성의 대단히 강력한 지표가 됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Observation Historical Section */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 gap-8 grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-1 flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-400">
              핵심 인포팩트
            </span>
            <h3 className="font-sans text-xl font-bold text-slate-900 tracking-tight mt-2">
              지리적 &quot;육안 관측성&quot;의 역사적 파급력
            </h3>
            <p className="font-sans text-xs text-slate-500 mt-3 leading-relaxed font-normal">
              고대인들은 눈에 보이는 섬을 생활권의 영토적 자각 범주에 자연스럽게 내입시켰습니다. 
              울릉도에서의 관측성과 오키섬에서의 관측 불완전성은 영유 자각의 근원적 주소를 바꿉니다.
            </p>
          </div>
          <button
            id="toggle-observation-modal"
            onClick={() => setShowObservationDetail(!showObservationDetail)}
            className="mt-6 md:mt-0 font-sans text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-all w-fit"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            자세한 이론 분석 {showObservationDetail ? "닫기" : "열기"}
          </button>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <span className="bg-blue-100 text-blue-700 text-xs font-extrabold px-2.5 py-1 rounded-lg">동해</span>
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-800">
                  울릉도 고지대에서의 관측: 실재적 인지 편입
                </h4>
                <p className="font-sans text-xs text-slate-600 mt-2 leading-relaxed">
                  울릉도의 사동, 석포마을 등 높은 구릉지대에서는 날씨가 맑은 날 언제나 육안으로 독도가 또렷이 관측됩니다. 
                  동쪽 끝에 상존하는 이 섬의 존재를 신라 우산국 시대부터 자연스럽게 인색 및 접경 활동 범주에 두고 영구 영유해 왔음을 역설합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <span className="bg-rose-100 text-rose-700 text-xs font-extrabold px-2.5 py-1 rounded-lg">한계</span>
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-800">
                  일본 오키섬에서의 불가능성: 자연 관측 한계 외
                </h4>
                <p className="font-sans text-xs text-slate-600 mt-2 leading-relaxed">
                  오키섬과 독도의 거리는 무려 **157.5 km**에 이릅니다. 이는 지구의 완만한 곡률 반경과 빛의 굴절 물리 조건으로 인해, 날씨가 제아무리 화창해도 결코 수평선 너머의 독도를 관측할 수 없음을 규명합니다. 따라서 일본 어민들에게 있어 독도로 가기 위한 행동은 지수적 인식 한계 밖의 인위적 해외 개척 항해였습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showObservationDetail && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 lg:p-8 space-y-4"
        >
          <h4 className="font-sans text-md font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            천기 수평과 지구 곡률 기반 육안 관측 타당성 대조
          </h4>
          <p className="font-sans text-xs text-slate-600 leading-relaxed font-normal">
            수평선 뒤의 어떤 목표물이 관측가능한지 계산하는 지리학적 수학 공식에 의하면:
            <br />
            <strong>d = 3.57 × (√h1 + √h2)</strong> [d: 가시거리(km), h1/h2: 관찰자 고도 및 목표물 고도(m)]
            <br />
            울릉도 우산봉(고도 984m) 및 독도 우산봉(고도 98.6m)의 높이를 공식에 대입하면 가시 범위는 이론상 약 **140km ~ 150km 이상**을 충분히 돌파합니다. 
            그에 반해 오키섬에서는 어떤 고지대에 올라서더라도 이 공식을 대입했을 때 독도의 정수리가 수평선 속에 가리어 결코 육안 돌출이 불가능합니다. 
            따라서 『세종실록지리지』가 밝혀낸 &quot;날씨가 맑으면 바라볼 수 있다&quot;는 지적 묘사는 매우 과학적이고도 고귀한 우리 영토 주권 증명의 자산입니다.
          </p>
        </motion.div>
      )}

      {/* Territory Status Section: Territory, Territorial Sea, Airspace, EEZ */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="font-sans text-lg font-bold text-slate-900 tracking-tight">
            국가 영역(Territory)의 삼요소와 독도 지위
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TERRITORY_STATUS_DATA.map((status, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <h4 className="font-sans text-sm font-bold text-slate-900">{status.category}</h4>
                </div>
                <p className="font-sans text-[11px] text-slate-400 font-semibold mt-1">정의: {status.definition}</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-sans text-xs font-bold text-slate-700 mt-2 leading-none">
                  현재 지위: {status.status}
                </div>
              </div>
              <p className="font-sans text-xs text-slate-500 leading-relaxed font-normal pt-2 border-t border-slate-50">
                {status.meaning}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Street Address & Road Names Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="font-sans text-lg font-bold text-slate-900 tracking-tight">
            독도의 정식 국가 도로명 주소와 상주민
          </h3>
        </div>
        <p className="font-sans text-sm text-slate-600 leading-relaxed font-normal">
          독도는 버려진 황무지가 아니라 매일 밤 독도 등대가 어족 평화를 비추고, 대한민국 독도 경비대원과 관람 주민이 숨 쉬는 엄연한 유인도(有人島)이며, 도로명주소법에 규정된 고유 의전용 도로명을 부여받았습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-blue-50/20 rounded-2xl p-6 border border-blue-100/50 space-y-3">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold tracking-wider px-2 py-1 rounded-md uppercase">
              동도 주소명
            </span>
            <h4 className="font-sans text-sm font-bold text-slate-800 mt-2">
              {GEOGRAPHY_DATA.addresses.east.road}
            </h4>
            <p className="font-sans text-xs text-slate-500 font-medium">
              💡 주요 상주지: {GEOGRAPHY_DATA.addresses.east.majorPlace}
            </p>
          </div>

          <div className="bg-emerald-50/20 rounded-2xl p-6 border border-emerald-100/50 space-y-3">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wider px-2 py-1 rounded-md uppercase">
              서도 주소명
            </span>
            <h4 className="font-sans text-sm font-bold text-slate-800 mt-2">
              {GEOGRAPHY_DATA.addresses.west.road}
            </h4>
            <p className="font-sans text-xs text-slate-500 font-medium">
              💡 주요 상주지: {GEOGRAPHY_DATA.addresses.west.majorPlace}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

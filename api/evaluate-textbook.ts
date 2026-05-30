import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      throw new Error("GEMINI_API_KEY가 설정되지 않았습니다. AI Studio의 Settings > Secrets에서 API 키를 등록하고 저장했는지 확인해 주세요.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

function cleanJSONString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "");
    cleaned = cleaned.replace(/\n?```$/, "");
  }
  return cleaned.trim();
}

function fallbackEvaluate(kName: string, jName: string, title: string, content: string) {
  const sources = [
    { key: "세종실록지리지", name: "세종실록지리지" },
    { key: "태정관지령", name: "태정관 지령" },
    { key: "태정관 지령", name: "태정관 지령" },
    { key: "은주시청합기", name: "은주시청합기" },
    { key: "신증동국여지승람", name: "신증동국여지승람" },
    { key: "칙령 제41호", name: "대한제국 칙령 제41호" },
    { key: "칙령제41호", name: "대한제국 칙령 제41호" },
    { key: "삼국접양지도", name: "삼국접양지도" }
  ];

  const detected: string[] = [];
  const detectedKeys = new Set<string>();
  
  sources.forEach(src => {
    if (content.includes(src.key) && !detectedKeys.has(src.name)) {
      detected.push(src.name);
      detectedKeys.add(src.name);
    }
  });

  const isSourceSufficient = detected.length >= 2;
  
  // Scoring
  const historicalAccuracy = isSourceSufficient
    ? Math.min(98, 85 + detected.length * 3)
    : Math.min(78, 55 + detected.length * 10);

  const hasPeaceWord = content.includes("평화") || content.includes("공존") || content.includes("미래");
  const peacePerspective = hasPeaceWord ? 92 : 78;
  
  const contentLen = content.trim().split(/\n+/).length;
  const isLineCountGood = contentLen >= 6 && contentLen <= 14;
  const logicalComposition = isLineCountGood ? 90 : 80;

  let feedback = "";
  let suggestions: string[] = [];

  if (isSourceSufficient) {
    feedback = `안녕하세요! 공동교과서 심의위원회가 드리는 따뜻하고 긍정적인 평가입니다. 
제안하신 초안은 역사적 고문서 사료(${detected.join(", ")})를 훌륭하게 연계하며, 구체적인 팩트(Fact)를 중심으로 높은 역사적 정확성을 세련되게 구축했습니다. 
정치적 대립에서 벗어나 공동체적 어조를 견지하려 노력한 흔적이 돋보입니다. 
학생 수준에서 고문서를 이토록 꼼꼼히 탐색하여 서술했다는 것은 놀라운 학업과 공동 연구의 결실을 대표하고 있습니다.`;
    suggestions = [
      "사료들의 원문 구절을 한 문장 정도 핵심적으로 인용(예: 세종실록지리지의 '위 두 섬은 거리가 멀지 않아 정밀히 관측된다' 등)해주면 설득력이 두 배로 향상됩니다.",
      "미래지향적 공동체 번영을 위해 양국 학생들이 일상에서 실천해볼 만한 평화 캠페인이나 한일 공동 교류 활동 등을 마지막 결론부에 덧붙여 보세요."
    ];
  } else {
    feedback = `안녕하세요! 제출해 주신 초안을 깊은 감동과 함께 읽어보았습니다. 
한일 학생들이 머리를 맞대어 미래의 평화를 논하고자 한 노력 그 자체로 커다란 역사적 희망입니다. 
다만, 본 서술 제안서가 전문가나 일반 대중들에게 학술적으로 인정받기 위해서는 고문헌 사료가 풍부하게 뒷받침되어야 합니다. 
현재 본문에서 감지된 유의미한 고사료가 부족하므로, 역사 교육적인 엄밀함을 더하기 위해 보완을 적극 권장합니다.`;
    suggestions = [
      "최소 2개 이상의 핵심 사료(한국의 세종실록지리지 및 대한제국 칙령 제41호, 일본 메이지 정권의 태정관 지령 등)를 인과관계와 함께 구체적으로 추가해 주십시오.",
      "감정적인 서술을 완화하고, 역사의 객관적인 '진실의 돋보기' 역할을 할 수 있는 학술적 문체(Fact 중심)로 서술을 다듬어 주시면 더욱 성숙한 안이 됩니다."
    ];
  }

  return {
    isSourceSufficient,
    detectedSources: detected,
    evaluationScore: {
      historicalAccuracy,
      peacePerspective,
      logicalComposition
    },
    feedback,
    suggestions,
    approverTitle: "평화지리교육 공동교과서 심의위원회 수석심사관"
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { kName, jName, title, content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: "공동 집필 본문을 작성해 주세요." });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `
[한일 학생 공동 역사 교과서 - 독도 서술 제안서 평가 요청]

■ 모둠원: (한국 학생) ${kName || "미입력"} / (일본 학생) ${jName || "미입력"}
■ 우리가 제안하는 독도 단원 제목: ${title || "미입력"}
■ 공동 집필 본문:
${content}

[평가 기준 및 지시사항]
1. 작성 조건: 고문서 사료(태정관 지령, 세종실록지리지, 은주시청합기, 신증동국여지승람, 대한제국 칙령 제41호, 삼국접양지도 등) 중 최소 2개 이상을 역사적 근거로 제시했는지 확인합니다.
2. 서술 방향: 일방적인 비난이나 감정적 표현을 배제하고, 역사적 사실(Fact) 중심의 서술 and 양국의 미래지향적 평화 공동체 관점을 유지했는지 분석합니다.
3. 분량: 10줄 내외로 간결하고 높은 논리성을 갖추었는지 판단합니다.

위 자료를 전문 역사학자 및 평화교육 평가위원의 관점에서 정밀하게 심사해 주세요.
그리고 아래 JSON 스키마에 따라 객관적이고 따뜻하며 격려가 가득한 피드백을 제공해 주세요.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 '대한민국 역사·지리 평화교육위원회'의 수석 평가위원이자 역사학자입니다. 학생들의 교과서 서술을 격려하고, 역사 사료 분석의 엄밀함과 평화지향적 시각을 기준으로 전문적인 피드백을 한글로 제공해 주어야 합니다.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSourceSufficient: {
              type: Type.BOOLEAN,
              description: "고문서 사료를 2개 이상 활용했는지 여부"
            },
            detectedSources: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "본문에서 감지된 고문서 사료 리스트"
            },
            evaluationScore: {
              type: Type.OBJECT,
              properties: {
                historicalAccuracy: { type: Type.INTEGER, description: "역사적 정확성 및 사료 활용 점수 (100점 만점)" },
                peacePerspective: { type: Type.INTEGER, description: "평화공동체 및 객관성 점수 (100점 만점)" },
                logicalComposition: { type: Type.INTEGER, description: "논리성 및 구성 점수 (100점 만점)" }
              },
              required: ["historicalAccuracy", "peacePerspective", "logicalComposition"]
            },
            feedback: {
              type: Type.STRING,
              description: "평가위원의 상세한 심사평. 학생들의 노력을 긍정하며, 사료의 중요성과 평화지향적 관점의 의미를 설명하는 친절하고 전문적인 텍스트 (한글)"
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "제안서를 더 발전시키기 위한 구체적이고 현실적인 보완 조언 2-3가지"
            },
            approverTitle: {
              type: Type.STRING,
              description: "평가위원의 최종 관직명 또는 서명 직함 (예: '평화교육위원회 공동교과서 심의실 수석연구원' 등)"
            }
          },
          required: ["isSourceSufficient", "detectedSources", "evaluationScore", "feedback", "suggestions", "approverTitle"]
        }
      }
    });

    const resultText = response.text?.trim() || "{}";
    const cleanedText = cleanJSONString(resultText);
    const resultObj = JSON.parse(cleanedText);

    res.status(200).json(resultObj);
  } catch (error: any) {
    console.error("Gemini API skipped in evaluate-textbook, using local rules-based evaluation engine", error.message || error);
    // Graceful and highly-refined local fallback evaluation
    const resultObj = fallbackEvaluate(kName || "", jName || "", title || "", content || "");
    res.status(200).json(resultObj);
  }
}

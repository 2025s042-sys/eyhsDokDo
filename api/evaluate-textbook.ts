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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { kName, jName, title, content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "공동 집필 본문을 작성해 주세요." });
    }

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
    console.error("Gemini API Error in evaluate-textbook:", error);
    const errMsg = error.message || "";
    if (errMsg.includes("denied access") || errMsg.includes("403") || errMsg.includes("PERMISSION_DENIED")) {
      return res.status(403).json({
        error: "소속 학교/기관의 구글 워크스페이스 정책으로 인해 현재 API 키 사용이 차단되었습니다. 개인 Gmail 계정으로 구글 AI Studio(ai.google.dev)에 접속하여 새 API 키를 무료로 발급받으신 후, Settings > Secrets에 등록해 사용해 주세요."
      });
    }
    res.status(500).json({ error: "평가 도중 문제가 발생했습니다. 다시 시도해 주세요.", details: error.message });
  }
}

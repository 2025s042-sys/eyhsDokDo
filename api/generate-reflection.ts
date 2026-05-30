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
    const { keywords, name } = req.body;

    if (!keywords || keywords.trim().length === 0) {
      return res.status(400).json({ error: "소감문 작성을 위한 키워드를 입력해 주세요." });
    }

    const ai = getGeminiClient();
    const prompt = `
[독도 영토 주권 교육 수업 소감문 자동 생성 요청]

■ 작성자 이름: ${name || "미해당 학생"}
■ 입력한 핵심 키워드: ${keywords}

독도 영토 주권 교육(지리적 연접성, 울릉도에서의 육안 관측성, 1차 문헌 사료(태정관 지령, 세종실록지리지, 삼국접양지도 등), 현대 배타적 경제수역(EEZ) 및 평화적 해결책)을 모두 수강한 학생의 관점과 소회를 솔직하고 깊이 있게 담아 소감문(수필 형식)을 자동 저술해 주세요.

[제작 기준 및 지시사항]
1. 단순한 사실 나열을 넘어 역사를 바라보는 편협하지 않은 균형 잡힌 비판성, 그리고 양국 미래 세대를 향한 성숙한 평화 어조를 사용하게 합니다.
2. 입력한 키워드들을 자연스럽게 녹여내고 비유적이고 읽기 쉬운 고급스러운 한국어 문장을 수필 스타일로 작성합니다.
3. 아래 JSON 스키마에 부합하는 형식으로 산출해 주세요.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 학생들의 역사 소감문을 대필하거나 완벽하게 가이드해 주는 역사/평화교육 전문 AI 조력자입니다. 사실에 근거하되 마음을 울리고 깊은 깨달음이 묻어나는 수준 높은 소감문을 한글로 생성해 주어야 합니다.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "소감문 전체를 관통하는 서정적이고 품격 있는 제목 (한글)"
            },
            content: {
              type: Type.STRING,
              description: "3~4개 문단으로 구분되어 잘 쓰여진 풍부한 분량 of 소감문/생각 본문 (한글, 마크다운 줄바꿈 기입)"
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "소감문을 대변하는 관련 해시태그 3-4가지 (예: '#태정관지령', '#행정주권', '#미래평화' 등)"
            }
          },
          required: ["title", "content", "hashtags"]
        }
      }
    });

    const resultText = response.text?.trim() || "{}";
    const cleanedText = cleanJSONString(resultText);
    const resultObj = JSON.parse(cleanedText);

    res.status(200).json(resultObj);
  } catch (error: any) {
    console.error("Gemini API Error in generate-reflection:", error);
    const errMsg = error.message || "";
    if (errMsg.includes("denied access") || errMsg.includes("403") || errMsg.includes("PERMISSION_DENIED")) {
      return res.status(403).json({
        error: "소속 학교/기관의 구글 워크스페이스 정책으로 인해 현재 API 키 사용이 차단되었습니다. 개인 Gmail 계정으로 구글 AI Studio(ai.google.dev)에 접속하여 새 API 키를 무료로 발급받으신 후, Settings > Secrets에 등록해 사용해 주세요."
      });
    }
    res.status(500).json({ error: "소감문 생성 도중 문제가 발생했습니다.", details: error.message });
  }
}

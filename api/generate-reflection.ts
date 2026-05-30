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

function fallbackReflection(keywords: string, name: string) {
  const keywordList = keywords.split(/[\s,#]+/).map(k => k.trim()).filter(Boolean);
  const matchedKeywords = keywordList.length ? keywordList : ["역사적 사료", "평화적 결속", "진실 규명"];
  
  const title = `역사의 거울 속에서 발견한 '${name || '우리'}'의 흔적과 평화의 지형도`;
  
  const content = `오늘의 알찬 교육 과정을 이수하며 내 안에 일렁인 생각과 소회들을 글로 옮겨봅니다. 우리가 마주한 독도라는 푸른 영토는 단순히 동해 바다 끝에 외로이 서 있는 돌섬이 아닌, 고대에서 현대에 이르기까지 무수히 많은 역사적 증명과 평화적 열망이 담긴 거대한 서사의 공간임을 온몸으로 깨닫게 되었습니다.
  
특히 이번 수업을 통해 배운 "${matchedKeywords.join(", ")}"의 구체적 의의는 가슴을 뜨겁게 울렸습니다. 과거 세종실록지리지나 태정관 지령과 같은 한·일 양국의 풍부한 1차적 사료가 이미 가리키고 있는 사실은 결코 왜곡할 수 없는 진리였습니다. 이러한 객관적 사실을 외면한 채 계속되는 대립은 갈등만 낳을 뿐이라는 것을 배울 수 있었습니다.
  
나아가 우리는 현대의 배타적 경제수역(EEZ) 획정과 같은 주권적 가치들을 명료하게 이해하면서도, 이를 오직 평화적인 공존과 성숙한 해결책을 향한 이정표로 삼아야 한다는 지혜를 얻었습니다. 이 땅을 살아가는 한일 미래 세대들은 이념과 편협한 갈등의 시선을 걷어내고, 진실을 정직하게 응시할 수 있는 성숙한 대화의 동반자가 되어야 합니다.
  
교육을 무사히 수료한 지금, 나는 배움의 무게를 무겁게 느낍니다. 우리 세대가 가꿔나갈 미래의 바다는 더 편협한 비난이 아니라, 함께 어우러져 평화로운 인류애를 수놓을 푸른 생명의 해양이 되기를 진심으로 염원합니다.`;

  const hashtags = matchedKeywords.map(k => k.startsWith("#") ? k : `#${k}`).slice(0, 4);
  while (hashtags.length < 3) {
    hashtags.push("#독도주권교육", "#미래평화공동체");
  }

  return {
    title,
    content,
    hashtags: hashtags.slice(0, 4)
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { keywords, name } = req.body;

  if (!keywords || keywords.trim().length === 0) {
    return res.status(400).json({ error: "소감문 작성을 위한 키워드를 입력해 주세요." });
  }

  try {
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
    console.error("Gemini API skipped in generate-reflection, using local rules-based generator engine", error.message || error);
    const resultObj = fallbackReflection(keywords, name || "");
    res.status(200).json(resultObj);
  }
}

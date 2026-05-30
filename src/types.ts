export interface LessonInfo {
  id: number;
  time: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface TerritoryStatus {
  category: string;
  definition: string;
  status: string;
  meaning: string;
}

export interface HistoricalSource {
  id: number;
  title: string;
  year: string;
  origin: "KOREA" | "JAPAN";
  keyContent: string;
  description: string;
  meaning: string;
}

export interface HistoricalMap {
  id: number;
  title: string;
  year: string;
  creator: string;
  description: string;
  factCheck: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface EvaluationResult {
  isSourceSufficient: boolean;
  detectedSources: string[];
  evaluationScore: {
    historicalAccuracy: number;
    peacePerspective: number;
    logicalComposition: number;
  };
  feedback: string;
  suggestions: string[];
  approverTitle: string;
}

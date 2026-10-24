/**
 * Fixed classification fallback curated by the research team.
 * The ingestion script auto-detects "ad-hoc" by scanning instrument fields,
 * then cross-checks the result against this list and warns on any mismatch
 * (source of truth may drift as new instruments are added).
 */
export const KNOWN_ADAPTED_SHEET_NAMES = [
  "CEQ-28",
  "CSQ-3",
  "CUQ",
  "SUS",
  "MREQ",
  "CUS",
  "UEQ",
  "UEQ-S",
  "OSLQ",
  "CHISM",
  "PFQCS",
  "CSAT",
  "HLS",
  "LMS",
  "MEEGA+",
  "METI",
  "NES",
  "NPS",
  "ECM-KM",
  "ECM",
  "BigTwo",
  "SPS",
  "TRR",
  "TAM_Davis",
  "UES",
  "LRSS_WorkValues",
  "WFC-SES",
] as const;

export const KNOWN_AD_HOC_SHEET_NAMES = [
  "Attitude_Survey",
  "Conversation_Based_Survey",
  "Evaluation_Questionnaire",
  "Exit_Perception_Questionnaire",
  "GCTM_Questionnaire",
  "Heuristic_Set_Chatbots",
  "Perception_Engagement_Quest",
  "Feedback_Questionnaire_SAM",
  "Perceptions_Quest_ChatGPT_Med",
  "Eval_Quest_Fuzzy_Chatbot",
  "Tech_Acceptance_Questionnaire",
  "SemiStructInterview_SDT",
  "UXQ_AdHoc",
  "User_Perception_Quest",
] as const;

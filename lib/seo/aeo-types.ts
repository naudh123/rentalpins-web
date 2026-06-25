/** AEO FAQ — direct answer block (40–60 words) plus optional depth. */

export interface AeoFaqItem {
  question: string;
  /** Featured-snippet / voice-search answer — visible first on page. */
  directAnswer: string;
  /** Optional supporting detail after the direct answer. */
  explanation?: string;
}

export interface AeoAnswerBoxProps {
  /** Short page summary for AI overviews and above-the-fold clarity. */
  summary: string;
  heading?: string;
}

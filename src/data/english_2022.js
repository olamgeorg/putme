export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `English 2022 Question ${i + 1}: Choose the correct option to complete the sentence. The student _____ to school every day.`,
  options: ["Go", "Goes", "Going", "Gone"],
  correctAnswer: i % 4,
  explanation: `This tests subject-verb agreement in present tense.`
}))
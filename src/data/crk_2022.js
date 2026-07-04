export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `CRK 2022 Question ${i + 1}: Who was the first king of Israel?`,
  options: ["David", "Saul", "Solomon", "Samuel"],
  correctAnswer: i % 4,
  explanation: `Saul was the first king of Israel.`
}))
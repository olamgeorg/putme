export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `Government 2025 Question ${i + 1}: Nigeria operates a _____ system of government.`,
  options: ["Federal", "Unitary", "Confederal", "Monarchical"],
  correctAnswer: i % 4,
  explanation: `Nigeria operates a federal system.`
}))
export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `Economics 2022 Question ${i + 1}: What is the basic economic problem?`,
  options: [
    "Unlimited wants, limited resources",
    "Limited wants, unlimited resources",
    "Unlimited wants, unlimited resources",
    "Limited wants, limited resources"
  ],
  correctAnswer: i % 4,
  explanation: `The basic economic problem is scarcity.`
}))
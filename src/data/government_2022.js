export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `Government 2022 Question ${i + 1}: What is the supreme law of Nigeria?`,
  options: [
    "The Constitution",
    "The Criminal Code",
    "The Sharia Law",
    "The Customary Law"
  ],
  correctAnswer: i % 4,
  explanation: `The Constitution is the supreme law.`
}))
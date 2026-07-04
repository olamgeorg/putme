export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `CRK 2023 Question ${i + 1}: The book of Psalms is found in which testament?`,
  options: [
    "Old Testament",
    "New Testament",
    "Apocrypha",
    "Gospels"
  ],
  correctAnswer: i % 4,
  explanation: `Psalms is in the Old Testament.`
}))
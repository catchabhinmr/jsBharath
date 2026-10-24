// JavaScript
const students = [
  { name: "Ana", scores: [91, 88, 95] },
  { name: "Ben", scores: [72, 85, 79] },
  { name: "Cara", scores: [60, 59, 70] },
  { name: "Dev", scores: [88, 90, 89] },
];
grade = []
averages = []
for (const student of students) {
  let total = 0;
  let tests = 0;
  for (const score of student.scores) {
    total += score;
    tests += 1;

  }

  let average = Math.trunc(total / tests);
  if (average >= 90) {
    grade.push('A');
  }
  else if (average >= 80) {
    grade.push('B');
  }
  else if (average >= 70) {
    grade.push('C');
  }
  else if (average >= 60) {
    grade.push('D');
  }
  else {
    grade.push('F');
  }
  averages.push(average);
}
console.log("Name".padEnd(10) + "Avg".padStart(6) + "Grade".padStart(10));
total = 0;
let numberOfStudes = students.length
for (let i = 0; i < students.length; i++) {
  console.log(`${students[i].name}`.padEnd(10) + `${averages[i]}`.padStart(6) + `${grade[i]}`.padStart(10));
  total += averages[i];
}

console.log(`Calass average: ${Math.trunc(total / students.length)}`);


import * as schemas from '../../gen/schemas.js';
import * as stakeholders from '../../gen/stakeholders.js';

export class MoodleLogic implements stakeholders.Moodle {
    calculateGrades(input: schemas.StudentData[]): Promise<schemas.StudentGrade[]> {
        console.log('MoodleLogic | Logging received student data:', JSON.stringify(input, null, 2));
        const grades = input.flatMap(student => [{
            name: student.name,
            studentId: student.studentId,
            year: 2023,
            term: 'Fall',
            courseName: 'Mathematics',
            credits: 4,
            signature: true,
            finalGrade: 5
        }, {
            name: student.name,
            studentId: student.studentId,
            year: 2023,
            term: 'Fall',
            courseName: 'Physics',
            credits: 3,
            signature: true,
            finalGrade: 4
        }, {
            name: student.name,
            studentId: student.studentId,
            year: 2023,
            term: 'Spring',
            courseName: 'Chemistry',
            credits: 5,
            signature: true,
            finalGrade: 2
        }, {
            name: student.name,
            studentId: student.studentId,
            year: 2024,
            term: 'Fall',
            courseName: 'Biology',
            credits: 4,
            signature: false,
            finalGrade: 0
        }]);
        return Promise.resolve(grades);
    }
}
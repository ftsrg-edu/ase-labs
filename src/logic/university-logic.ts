import * as schemas from '../../gen/schemas.js';
import * as stakeholders from '../../gen/stakeholders.js';

export class UniversityLogic implements stakeholders.University {
    students(): Promise<schemas.StudentData[]> {
        console.log('UniversityLogic | Logging sending Student data.');
        return Promise.resolve([
            { name: 'Alice Smith', studentId: '1', age: 20 },
            { name: 'Bob Johnson', studentId: '2', age: 22 },
            { name: 'Charlie Brown', studentId: '3', age: 21 }
        ]);
    }
}
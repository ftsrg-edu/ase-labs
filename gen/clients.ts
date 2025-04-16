/* eslint-disable */
import { BaseClient } from './base-client.js';

import * as schemas from './schemas.js';
import * as stakeholders from './stakeholders.js';

export class UniversityClient extends BaseClient implements stakeholders.University {
    students(): Promise<schemas.StudentData[]> {
        return this.getMethod('students');
    }
}
export class StudentClient extends BaseClient implements stakeholders.Student {
}
export class MoodleClient extends BaseClient implements stakeholders.Moodle {
    calculateGrades(input: schemas.StudentData[]): Promise<schemas.StudentGrade[]> {
        return this.postMethod('calculateGrades', input);
    }
}
export class AnalyticsCompanyClient extends BaseClient implements stakeholders.AnalyticsCompany {
    calculateAggregate(input: schemas.PseudonymizedStudentGrade[]): Promise<schemas.StudentAggregate[]> {
        return this.postMethod('calculateAggregate', input);
    }
}
export class QSWorldUniversityClient extends BaseClient implements stakeholders.QSWorldUniversity {
    recordAggregate(input: schemas.StudentAggregate[]): Promise<void> {
        return this.postMethod('recordAggregate', input);
    }    
}

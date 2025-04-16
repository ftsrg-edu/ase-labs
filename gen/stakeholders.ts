/* eslint-disable */
import * as schemas from './schemas.js';

export interface University {
    students(): Promise<schemas.StudentData[]>;
}
export interface Student {
}
export interface Moodle {
    calculateGrades(input: schemas.StudentData[]): Promise<schemas.StudentGrade[]>;
}
export interface AnalyticsCompany {
    calculateAggregate(input: schemas.PseudonymizedStudentGrade[]): Promise<schemas.StudentAggregate[]>;
}
export interface QSWorldUniversity {
    recordAggregate(input: schemas.StudentAggregate[]): Promise<void>;
}

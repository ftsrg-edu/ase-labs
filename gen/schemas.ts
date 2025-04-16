/* eslint-disable */
export interface StudentData {
    name: string
    studentId: string
    age: number
}
export interface StudentGrade {
    name: string
    studentId: string
    year: number
    term: string
    courseName: string
    credits: number
    signature: boolean
    finalGrade: number
}
export interface PseudonymizedStudentGrade {
    id: string
    year: number
    term: string
    courseName: string
    credits: number
    signature: boolean
    finalGrade: number
}
export interface StudentAggregate {
    id: string
    year: number
    term: string
    credits: number
    average: number
    correctedAverage: number
}

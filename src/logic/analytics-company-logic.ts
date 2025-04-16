import * as schemas from '../../gen/schemas.js';
import * as stakeholders from '../../gen/stakeholders.js';

export class AnalyticsCompanyLogic implements stakeholders.AnalyticsCompany {
    calculateAggregate(input: schemas.PseudonymizedStudentGrade[]): Promise<schemas.StudentAggregate[]> {
        console.log('AnalyticsCompanyLogic | Logging received student grades:', JSON.stringify(input, null, 2));

        const groups = new Map<string, {
            id: string;
            year: number;
            term: string;
            sumCredits: number;
            sumWeightedGrades: number;
        }>();

        for (const grade of input) {
            const key = `${grade.id}-${grade.year}-${grade.term}`;
            let group = groups.get(key);
            if (!group) {
                group = {
                    id: grade.id,
                    year: grade.year,
                    term: grade.term,
                    sumCredits: 0,
                    sumWeightedGrades: 0,
                };
                groups.set(key, group);
            }

            group.sumCredits += grade.credits;

            if (grade.signature && grade.finalGrade >= 2) {
                group.sumWeightedGrades += grade.credits * grade.finalGrade;
            }
        }

        const aggregates: schemas.StudentAggregate[] = Array.from(groups.values()).map(group => ({
            id: group.id,
            year: group.year,
            term: group.term,
            credits: group.sumCredits,
            average: group.sumCredits > 0 ? group.sumWeightedGrades / group.sumCredits : 0,
            correctedAverage: group.sumWeightedGrades / 30,
        }));

        return Promise.resolve(aggregates);
    }
}
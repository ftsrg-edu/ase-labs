import { describe, expect, test, beforeEach } from 'vitest'
import { AnalyticsCompanyLogic } from '../../src/logic/analytics-company-logic.js'
import { PseudonymizedStudentGrade, StudentAggregate } from '../../gen/schemas.js';

describe('AnalyticsCompanyLogic calculateAggregate', () => {

    let logic: AnalyticsCompanyLogic;

    const student1 : PseudonymizedStudentGrade = {id: 'id1', year: 2023, term: 'Fall', courseName: 'Mathematics', credits: 4, signature: true, finalGrade: 3};
    const student1Aggregate : StudentAggregate = {id: 'id1', year: 2023, term: 'Fall', credits: 4, average: 3, correctedAverage: 0.4};

    beforeEach(() => {
        logic = new AnalyticsCompanyLogic();
    });

    test('empty input produces empty output', async () => {        
        await expect(logic.calculateAggregate([])).resolves.toEqual([]);
    });

    test('aggregate 1 student with 1 passing grade', async () => {        
        await expect(logic.calculateAggregate([student1])).resolves.toEqual([student1Aggregate]);
    });

    // TODO add more tests

});
/* eslint-disable */
import { BaseServiceChain } from './base-service-chain.js';

import * as schemas from './schemas.js';
import * as stakeholders from './stakeholders.js';

export class CollectUniversityRankingData extends BaseServiceChain {
    constructor(
        private readonly university: stakeholders.University,
        private readonly moodle: stakeholders.Moodle,
        private readonly analyticsCompany: stakeholders.AnalyticsCompany,
        private readonly qSWorldUniversity: stakeholders.QSWorldUniversity
    ) {
        super();
    }

    async execute() {
        const data0 = await this.university.students();
        const data1 = await this.moodle.calculateGrades(data0);
        const data2 = await this.analyticsCompany.calculateAggregate(data1.map(record => ({
            id: this.pseudonymize(record.studentId),
            year: record.year,
            term: record.term,
            courseName: record.courseName,
            credits: record.credits,
            signature: record.signature,
            finalGrade: record.finalGrade
        })));
        await this.qSWorldUniversity.recordAggregate(data2);
    }
    
}

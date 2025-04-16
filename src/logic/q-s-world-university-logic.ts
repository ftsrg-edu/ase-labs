import * as schemas from '../../gen/schemas.js';
import * as stakeholders from '../../gen/stakeholders.js';

export class QSWorldUniversityLogic implements stakeholders.QSWorldUniversity {
    recordAggregate(input: schemas.StudentAggregate[]): Promise<void> {
        console.log('QSWorldUniversityLogic | Logging received aggregated data:', JSON.stringify(input, null, 2));
        return Promise.resolve();
    }
}
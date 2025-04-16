/* eslint-disable */
import { Express } from 'express';
import { BaseServer } from './base-server.js';

import * as stakeholders from './stakeholders.js';

export class UniversityServer extends BaseServer {
    constructor(port: number | string, private readonly logic: stakeholders.University) {
        super(port, 'University');
    }

    registerEndpoints(app: Express): void {
        app.get('/students', async (req, res) => {
            const data = await this.logic.students();
             res.json(data);
         });
    }
}
export class StudentServer extends BaseServer {
    constructor(port: number | string, private readonly logic: stakeholders.Student) {
        super(port, 'Student');
    }

    registerEndpoints(app: Express): void {
    }
}
export class MoodleServer extends BaseServer {
    constructor(port: number | string, private readonly logic: stakeholders.Moodle) {
        super(port, 'Moodle');
    }

    registerEndpoints(app: Express): void {
        app.post('/calculateGrades', async (req, res) => {
            const input = req.body;
            const data = await this.logic.calculateGrades(input);
            res.json(data);
        });
    }
}
export class AnalyticsCompanyServer extends BaseServer {
    constructor(port: number | string, private readonly logic: stakeholders.AnalyticsCompany) {
        super(port, 'AnalyticsCompany');
    }

    registerEndpoints(app: Express): void {
        app.post('/calculateAggregate', async (req, res) => {
            const input = req.body;
            const data = await this.logic.calculateAggregate(input);
            res.json(data);
        });
    }
}
export class QSWorldUniversityServer extends BaseServer {
    constructor(port: number | string, private readonly logic: stakeholders.QSWorldUniversity) {
        super(port, 'QSWorldUniversity');
    }

    registerEndpoints(app: Express): void {
        app.post('/recordAggregate', async (req, res) => {
            const input = req.body;
            await this.logic.recordAggregate(input);
            res.json({ ok: true });
        });
    }
}

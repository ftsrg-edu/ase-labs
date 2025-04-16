/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, describe, expect, vi } from 'vitest'
import { AnalyticsCompanyServer } from '../../gen/servers.js';
import { AnalyticsCompanyLogic } from '../../src/logic/analytics-company-logic.js'
import { AnalyticsCompanyClient } from '../../gen/clients.js';
import { PseudonymizedStudentGrade } from '../../gen/schemas.js';

describe('AnalyticsCompany integration test', () => {

    const PORT = 3003;
    const BASE_URL = `http://localhost:${PORT}`;

    test('In client-server-logic call chain the logic method gets called only once', async () => {    
        
        // TODO spy on the logic and check if it gets called once when the client calls the server
        
        // TODO instantiate the server and a client, 
    
        // TODO make a call to calculateAggregate using some test data

        // TODO verify that the spy was called once
    
    });

})
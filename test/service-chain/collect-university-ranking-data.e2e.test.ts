/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, describe, vi, expect, MockInstance } from 'vitest'
import * as clients from "../../gen/clients.js";
import * as servers from "../../gen/servers.js";
import * as servicechains from "../../gen/service-chains.js";
import { UniversityLogic } from '../../src/logic/university-logic.js';
import { MoodleLogic } from '../../src/logic/moodle-logic.js';
import { AnalyticsCompanyLogic } from '../../src/logic/analytics-company-logic.js';
import { QSWorldUniversityLogic } from '../../src/logic/q-s-world-university-logic.js';
import { StudentAggregate } from '../../gen/schemas.js';

describe('CollectUniversityRankingData service chain E2E tests', () => {

    const BASE_URL = `http://localhost`;
    const PORT_UNIVERSITY = 3002;
    const PORT_MOODLE = 3001;
    const PORT_ANALYTICS_COMPANY = 3003;
    const PORT_QS_WORLD_UNIVERSITY = 3004;

    let qsWorldLogicSpy: MockInstance<(input: StudentAggregate[]) => Promise<void>>;

    // TODO make it async as service chain is async
    test('QSWorldUniversityLogic is called when executing the default service chain', () => {    
        // Arrange
        createAndStartDefaultServers();

        const collectUniversityRankingData = createChainWithDefaultClients();
        
        // Act
        
        //TODO execute the service chain

        // Assert
        
        // TODO add expect

    });
    
    // TODO add : servicechains.CollectUniversityRankingData as return type
    function createChainWithDefaultClients() {                               
        // TODO implement                
    }

    function createAndStartDefaultServers(){
        // TODO implement
    }

});
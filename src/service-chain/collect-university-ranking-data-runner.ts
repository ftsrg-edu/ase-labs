import * as clients from "../../gen/clients.js";
import * as servicechains from "../../gen/service-chains.js";

const university = new clients.UniversityClient('http://localhost:3002');
const moodle = new clients.MoodleClient('http://localhost:3001');
const analyticsCompany = new clients.AnalyticsCompanyClient('http://localhost:3003');
const qSWorldUniversity = new clients.QSWorldUniversityClient('http://localhost:3004');

const collectUniversityRankingData = new servicechains.CollectUniversityRankingData(
    university,
    moodle,
    analyticsCompany,
    qSWorldUniversity
);

await collectUniversityRankingData.execute();
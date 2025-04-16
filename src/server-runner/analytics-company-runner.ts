import { AnalyticsCompanyServer } from "../../gen/servers.js";
import { AnalyticsCompanyLogic } from "../logic/analytics-company-logic.js";

const port = process.env.PORT || 3003;

const logic = new AnalyticsCompanyLogic()
const server = new AnalyticsCompanyServer(port, logic)

server.start();
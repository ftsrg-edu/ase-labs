import { QSWorldUniversityServer } from "../../gen/servers.js";
import { QSWorldUniversityLogic } from "../logic/q-s-world-university-logic.js";

const port = process.env.PORT || 3004;

const logic = new QSWorldUniversityLogic()
const server = new QSWorldUniversityServer(port, logic)

server.start();
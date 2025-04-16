import { UniversityServer } from "../../gen/servers.js";
import { UniversityLogic } from "../logic/university-logic.js";

const port = process.env.PORT || 3002;

const logic = new UniversityLogic()
const server = new UniversityServer(port, logic)

server.start();
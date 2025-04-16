import { MoodleServer } from "../../gen/servers.js";
import { MoodleLogic } from "../logic/moodle-logic.js";

const port = process.env.PORT || 3001;

const logic = new MoodleLogic()
const server = new MoodleServer(port, logic)

server.start();
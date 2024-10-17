import type { Workflow } from '../language/generated/ast.js';
import * as fs from "node:fs";
import {extractDestinationAndName} from "./cli-util.js";
import path from "node:path";

export function generateWorkflowJson(workflow: Workflow, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.json`;

    const result = {
        name: workflow.name,
        parameters: workflow.parameters.map(param => ({
            name: param.name,
            type: param.type
        })),
        workers: workflow.workers.map(worker => ({
            name: worker.name,
            type: worker.type,
            arguments: worker.arguments.map(arg => arg.ref!!.name)
        })),
        channels: workflow.channels.map(channel => ({
            fromWorker: channel.fromWorker.ref!!.name,
            toWorker: channel.toWorker.ref!!.name,
            toPin: channel.toPort
        })),
        inPins: workflow.inPorts.map(inPort => ({
            worker: inPort.worker.ref!!.name,
            pin: inPort.port
        })),
        outPin: {
            worker: workflow.outPort.worker.ref!!.name
        }
    };

    fs.writeFileSync(generatedFilePath, JSON.stringify(result, undefined, 4));
    return generatedFilePath;
}

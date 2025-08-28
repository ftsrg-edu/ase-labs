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
            toPin: channel.toPort,
            name: `${channel.fromWorker.ref!!.name}_${channel.toWorker.ref!!.name}_${channel.toPort}`
        })),
        inPins: workflow.inPorts.map(inPort => ({
            worker: inPort.worker.ref!!.name,
            pin: inPort.port,
            name: `${inPort.worker.ref!!.name}${capitalize(inPort.port)}`,
            type: getInputType(inPort.worker.ref!!.type)
        })),
        outPin: {
            worker: workflow.outPort.worker.ref!!.name,
            type: getOutputType(workflow.outPort.worker.ref!.type)
        }
    };

    fs.writeFileSync(generatedFilePath, JSON.stringify(result, undefined, 4));
    return generatedFilePath;
}

function getOutputType(worker: string): string {
    const types: {
        [index: string]: string;
    } = {
        "Tokenizer": "TokenizedDocument",
        "Shingler": "OccurrenceVector",
        "VectorMultiplier": "Double",
        "CosineSimilarity": "Double",
    }

    return types[worker]
}

function getInputType(worker: string): string {
    const types: {
        [index: string]: string;
    } = {
        "Tokenizer": "String",
        "Shingler": "TokenizedDocument",
        "VectorMultiplier": "OccurrenceVector",
        "CosineSimilarity": "Double",
    }

    return types[worker]
}

function capitalize(value: string): string {
    return value.at(0)?.toUpperCase() + value.substring(1)
}

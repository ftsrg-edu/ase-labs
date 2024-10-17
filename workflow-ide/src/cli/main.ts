import chalk from 'chalk';
import { Command } from 'commander';
import { WorkflowLanguageMetaData } from '../language/generated/module.js';
import { createWorkflowServices } from '../language/workflow-module.js';
import { extractAstNode } from './cli-util.js';
import { NodeFileSystem } from 'langium/node';
import {Workflow} from "../language/generated/ast.js";
import {generateWorkflowJson} from "./generator.js";

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createWorkflowServices(NodeFileSystem).Workflow;
    const model = await extractAstNode<Workflow>(fileName, services);
    const generatedFilePath = generateWorkflowJson(model, fileName, opts.destination);
    console.log(chalk.green(`JSON domain model generated: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
}

const program = new Command();

const fileExtensions = WorkflowLanguageMetaData.fileExtensions.join(', ');
program
    .command('generate')
    .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
    .option('-d, --destination <dir>', 'destination directory of generating')
    .description('The domain model from the specified Workflow text!')
    .action(generateAction);

program.parse(process.argv);

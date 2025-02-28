import chalk from 'chalk';
import { Command } from 'commander';
import { DataSpaceLanguageMetaData } from '../../gen/language/generated/module.js';
import { createDataSpaceServices } from '../language/data-space-module.js';
import { NodeFileSystem } from 'langium/node';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { TextDocument, URI } from 'langium';
import { Diagnostic } from 'vscode-languageserver';

const colors = {
    error: chalk.red,
    warning: chalk.rgb(251, 255, 0),
    info: chalk.blue,
    pass: chalk.green,
};

async function validateAction(fileName: string): Promise<void> {
    const services = createDataSpaceServices(NodeFileSystem).DataSpace;
    
    const extensions = services.LanguageMetaData.fileExtensions;
    if (!extensions.includes(path.extname(fileName))) {
        console.info(colors.error(`Please choose a file with one of these extensions: ${extensions.toString()}.`));
        process.exit(1);
    }

    if (!fs.existsSync(fileName)) {
        console.info(colors.error(`File ${fileName} does not exist.`));
        process.exit(1);
    }

    const document = await services.shared.workspace.LangiumDocuments.getOrCreateDocument(URI.file(path.resolve(fileName)));
    await services.shared.workspace.DocumentBuilder.build([document], { validation: true });

    const error = checkValidationResults(document.diagnostics, document.textDocument);

    if (!error) {
        console.info(colors.pass('Complience check successful!'));
    }
};

function checkValidationResults(diagnostics: Diagnostic[] | undefined, textDocument: TextDocument) {
    if (diagnostics === undefined || diagnostics.length === 0) {
        return false;
    }

    let error = false;

    const validationErrors = diagnostics.filter(e => e.severity === 1);
    if (validationErrors.length > 0) {
        error = true;
        console.info(colors.error('There are errors:'));
        for (const validation of validationErrors) {
            console.info(colors.error(
                `line ${validation.range.start.line + 1}: ${validation.message} [${textDocument.getText(validation.range)}]`
            ));
        }
        console.info();
    }

    const validationWarnings = diagnostics.filter(e => e.severity === 2);
    if (validationWarnings.length > 0) {
        error = true;
        console.info(colors.warning('There are warnings:'));
        for (const validation of validationWarnings) {
            console.info(colors.warning(
                `line ${validation.range.start.line + 1}: ${validation.message} [${textDocument.getText(validation.range)}]`
            ));
        }
        console.info();
    }
    
    const validationInfos = diagnostics.filter(e => e.severity === 3);
    if (validationInfos.length > 0) {
        console.info(colors.info('There are infos:'));
        for (const validation of validationInfos) {
            console.info(colors.info(
                `line ${validation.range.start.line + 1}: ${validation.message} [${textDocument.getText(validation.range)}]`
            ));
        }
    }

    return error;
}

const fileExtensions = DataSpaceLanguageMetaData.fileExtensions.join(', ');

const program = new Command();
program.command('validate')
    .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
    .description('Validates the input file.')
    .action(validateAction);

program.parse(process.argv);

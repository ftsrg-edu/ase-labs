import { createDataSpaceServices } from '../language/data-space-module.js';
import { NodeFileSystem } from 'langium/node';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { AstNode, LangiumDocument, URI } from 'langium';
import chalk from "chalk";

export const colors = {
    error: chalk.red,
    warning: chalk.rgb(251, 255, 0),
    info: chalk.blue,
    pass: chalk.green,
};

export async function loadAndValidateDocument<T extends AstNode>(fileName: string): Promise<T | undefined> {
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

    const document = await services.shared.workspace.LangiumDocuments.getOrCreateDocument(
        URI.file(path.resolve(fileName))
    ) as LangiumDocument<T>;

    await services.shared.workspace.DocumentBuilder.build([document], { validation: true });

    const error = validateDocument(document);

    if (error) {
        return undefined;
    }

    return document.parseResult.value;
}

function validateDocument<T extends AstNode>(document: LangiumDocument<T>) {
    const diagnostics = document.diagnostics;
    const textDocument = document.textDocument;

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

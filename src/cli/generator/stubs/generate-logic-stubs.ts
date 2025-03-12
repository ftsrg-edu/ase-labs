import { expandToNode, GeneratorNode, joinToNode, toString } from 'langium/generate';
import { Consume, DataSet, Model, Service, Stakeholder } from '../../../../gen/language/generated/ast.js';
import { DataSpaceConfig, RelativePath } from '../configuration.js';
import { camelToKebabCase, relativePath, saveContent } from '../generator-utils.js';
import { existsSync } from 'fs'

export async function generateLogicStubs(model: Model, configuration: DataSpaceConfig) {
    for (const stakeholder of model.stakeholders) {
        await generateLogicStub(stakeholder, configuration);
    }
}

async function generateLogicStub(stakeholder: Stakeholder, configuration: DataSpaceConfig) {
    const outDir = `${configuration.stubs!.srcPath}/logic`
    const fileName = `${configuration[RelativePath]}/${outDir}/${camelToKebabCase(`${stakeholder.name}Logic`)}.ts`;

    if (existsSync(fileName)) {
        return;
    }

    const path = relativePath(configuration, outDir, configuration.genPath);

    const node = expandToNode`
        /* eslint-disable @typescript-eslint/no-unused-vars */
        import * as schemas from '${path}/schemas.js';
        import * as stakeholders from '${path}/stakeholders.js';

        ${mapStakeholderToClass(stakeholder)}
    `;

    await saveContent(fileName, toString(node));
}

function mapStakeholderToClass(stakeholder: Stakeholder): GeneratorNode {
    return expandToNode`
        export class ${stakeholder.name}Logic implements stakeholders.${stakeholder.name} {
            ${joinToNode(stakeholder.dataSets, mapDataSetToMethod, { appendNewLineIfNotEmpty: true })}
            ${joinToNode(stakeholder.services, mapServiceToMethod, { appendNewLineIfNotEmpty: true })}
            ${joinToNode(stakeholder.consumes, mapConsumeToMethod, { appendNewLineIfNotEmpty: true })}
        }
    `
}

function mapDataSetToMethod(dataSet: DataSet): GeneratorNode {
    return expandToNode`
        ${dataSet.name}(): Promise<schemas.${dataSet.output.ref?.name}[]> {
            return Promise.resolve([]);
        }
    `
}

function mapServiceToMethod(service: Service): GeneratorNode {
    return expandToNode`
        ${service.name}(input: schemas.${service.input.ref?.name}[]): Promise<schemas.${service.output.ref?.name}[]> {
            return Promise.resolve([]);
        }
    `
}

function mapConsumeToMethod(consume: Consume): GeneratorNode {
    return expandToNode`
        ${consume.name}(input: schemas.${consume.input.ref?.name}[]): Promise<void> {
            return Promise.resolve();
        }
    `
}

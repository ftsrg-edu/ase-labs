import { expandToNode, GeneratorNode, joinToNode, toString } from 'langium/generate';
import { Consume, DataSet, Model, Service, Stakeholder } from '../../../../gen/language/generated/ast.js';
import { DataSpaceConfig, RelativePath } from '../configuration.js';
import { saveContent } from '../generator-utils.js';

export async function generateStakeholderDefinitions(model: Model, configuration: DataSpaceConfig) {
    const node = expandToNode`
        /* eslint-disable */
        import * as schemas from './schemas.js';
        
        ${joinToNode(model.stakeholders, mapStakeholderDefinitions, { appendNewLineIfNotEmpty: true })}
    `;

    await saveContent(`${configuration[RelativePath]}/${configuration.genPath}/stakeholders.ts`, toString(node));
}

function mapStakeholderDefinitions(stakeholder: Stakeholder): GeneratorNode | undefined {
    return expandToNode`
        export interface ${stakeholder.name} {
            ${joinToNode(stakeholder.dataSets, mapDataSetToMethod, { appendNewLineIfNotEmpty: true })}
            ${joinToNode(stakeholder.services, mapServiceToMethod, { appendNewLineIfNotEmpty: true })}
            ${joinToNode(stakeholder.consumes, mapConsumeToMethod, { appendNewLineIfNotEmpty: true })}
        }
    `
}

function mapDataSetToMethod(dataSet: DataSet): GeneratorNode | undefined {
    return expandToNode`
        ${dataSet.name}(): Promise<schemas.${dataSet.output.ref?.name}[]>;
    `
}

function mapServiceToMethod(service: Service): GeneratorNode | undefined {
    return expandToNode`
        ${service.name}(input: schemas.${service.input.ref?.name}[]): Promise<schemas.${service.output.ref?.name}[]>;
    `
}

function mapConsumeToMethod(consume: Consume): GeneratorNode | undefined {
    return expandToNode`
        ${consume.name}(input: schemas.${consume.input.ref?.name}[]): Promise<void>;
    `
}

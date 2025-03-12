import { expandToNode, GeneratorNode, joinToNode, toString } from 'langium/generate';
import { Consume, DataSet, Model, Service, Stakeholder } from '../../../../gen/language/generated/ast.js';
import { DataSpaceConfig, RelativePath } from '../configuration.js';
import { saveContent } from '../generator-utils.js';

export async function generateClientDefinitions(model: Model, configuration: DataSpaceConfig) {
    const node = expandToNode`
        /* eslint-disable */
        import { BaseClient } from './base-client.js';

        import * as schemas from './schemas.js';
        import * as stakeholders from './stakeholders.js';

        ${joinToNode(model.stakeholders, mapStakeholderToClass, { appendNewLineIfNotEmpty: true })}
    `;

    await saveContent(`${configuration[RelativePath]}/${configuration.genPath}/clients.ts`, toString(node));
}

function mapStakeholderToClass(stakeholder: Stakeholder): GeneratorNode {
    return expandToNode`
        export class ${stakeholder.name}Client extends BaseClient implements stakeholders.${stakeholder.name} {
            ${joinToNode(stakeholder.dataSets, mapDataSetToMethod, { appendNewLineIfNotEmpty: true })}
            ${joinToNode(stakeholder.services, mapServiceToMethod, { appendNewLineIfNotEmpty: true })}
            ${joinToNode(stakeholder.consumes, mapConsumeToMethod, { appendNewLineIfNotEmpty: true })}
        }
    `;
}

function mapDataSetToMethod(dataSet: DataSet): GeneratorNode {
    void dataSet;
    return expandToNode`
        // TODO: implement mapDataSetToMethod!
    `;
}

function mapServiceToMethod(service: Service): GeneratorNode {
    void service;
    return expandToNode`
        // TODO: implement mapServiceToMethod!
    `;
}

function mapConsumeToMethod(consume: Consume): GeneratorNode {
    void consume;
    return expandToNode`
        // TODO: implement mapConsumeToMethod!
    `;
}

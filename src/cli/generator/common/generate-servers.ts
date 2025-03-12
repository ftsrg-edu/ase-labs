import { expandToNode, GeneratorNode, joinToNode, toString } from 'langium/generate';
import { Model, Stakeholder } from '../../../../gen/language/generated/ast.js';
import { DataSpaceConfig, RelativePath } from '../configuration.js';
import { saveContent } from '../generator-utils.js';

export async function generateServerDefinitions(model: Model, configuration: DataSpaceConfig) {
    const node = expandToNode`
        /* eslint-disable */
        import { Express } from 'express';
        import { BaseServer } from './base-server.js';

        import * as stakeholders from './stakeholders.js';

        ${joinToNode(model.stakeholders, mapStakeholderToClass, { appendNewLineIfNotEmpty: true })}
    `;

    await saveContent(`${configuration[RelativePath]}/${configuration.genPath}/servers.ts`, toString(node));
}

function mapStakeholderToClass(stakeholder: Stakeholder): GeneratorNode {
    return expandToNode`
        export class ${stakeholder.name}Server extends BaseServer {
            constructor(port: number | string, private readonly logic: stakeholders.${stakeholder.name}) {
                super(port, '${stakeholder.name}');
            }

            // TODO: implement mapStakeholderToClass!
        }
    `;
}

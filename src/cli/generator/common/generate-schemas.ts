import { expandToNode, GeneratorNode, joinToNode, toString } from 'langium/generate';
import { Field, Model, Schema } from '../../../../gen/language/generated/ast.js';
import { DataSpaceConfig, RelativePath } from '../configuration.js';
import { saveContent } from '../generator-utils.js';

export async function generateSchemaDefinitions(model: Model, configuration: DataSpaceConfig) {
    const node = expandToNode`
        /* eslint-disable */
        ${joinToNode(model.schemas, mapSchemaToInterface, { appendNewLineIfNotEmpty: true })}
    `

    await saveContent(`${configuration[RelativePath]}/${configuration.genPath}/schemas.ts`, toString(node));
}

function mapSchemaToInterface(schema: Schema): GeneratorNode {
    return expandToNode`
        export interface ${schema.name} {
            ${joinToNode(schema.fields, mapFieldToDefinition, { appendNewLineIfNotEmpty: true })}
        }
    `
}

function mapFieldToDefinition(field: Field): GeneratorNode {
    return expandToNode`
        ${field.name}: ${field.type}
    `
}

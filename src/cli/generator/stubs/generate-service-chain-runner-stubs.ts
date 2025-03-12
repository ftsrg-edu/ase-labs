import { expandToNode, GeneratorNode, joinToNode, toString } from 'langium/generate';
import { Model, ServiceChain, Stakeholder } from '../../../../gen/language/generated/ast.js';
import { DataSpaceConfig, RelativePath, ServiceChainOptions } from '../configuration.js';
import { camelToKebabCase, pascalToCamelCase, relativePath, saveContent } from '../generator-utils.js';
import { existsSync } from 'fs'

export async function generateServiceChainStubs(model: Model, configuration: DataSpaceConfig) {
    const serviceChainStubs = configuration.stubs!.serviceChainStubs;

    if (!serviceChainStubs) {
        return;
    }

    for (const serviceChainName in serviceChainStubs) {
        const serviceChain = model.serviceChains.filter(s => s.name === serviceChainName).at(0);
        if (!serviceChain) {
            throw new Error(`Service chain ${serviceChainName} does not exist in the model!`);
        }

        await generateServerRunnerStub(serviceChain, configuration, serviceChainStubs[serviceChainName]);
    }
}

async function generateServerRunnerStub(serviceChain: ServiceChain, configuration: DataSpaceConfig, options: ServiceChainOptions) {
    const outDir = `${configuration.stubs!.srcPath}/service-chain`
    const fileName = `${configuration[RelativePath]}/${outDir}/${camelToKebabCase(`${serviceChain.name}Runner`)}.ts`;

    if (existsSync(fileName)) {
        return;
    }

    const genPath = relativePath(configuration, outDir, configuration.genPath);
    const clients = [...new Set(serviceChain.steps.map(s => s.stakeholder.ref).filter(s => s !== undefined))];

    const node = expandToNode`
        import * as clients from "${genPath}/clients.js";
        import * as servicechains from "${genPath}/service-chains.js";

        ${joinToNode(clients, c => mapStakeholderToClientDefinition(c, options), { appendNewLineIfNotEmpty: true, skipNewLineAfterLastItem: true })}

        const ${pascalToCamelCase(serviceChain.name)} = new servicechains.${serviceChain.name}(
            ${joinToNode(clients, mapStakeholderToClient, { separator: ',', appendNewLineIfNotEmpty: true, skipNewLineAfterLastItem: true })}
        );

        await ${pascalToCamelCase(serviceChain.name)}.execute();
    `;

    await saveContent(fileName, toString(node));
}

function mapStakeholderToClient(stakeholder: Stakeholder): GeneratorNode {
    return expandToNode`
        ${pascalToCamelCase(stakeholder.name)}
    `
}

function mapStakeholderToClientDefinition(stakeholder: Stakeholder, options: ServiceChainOptions): GeneratorNode {
    const clientOptions = options.clients[stakeholder.name];

    if (!clientOptions) {
        throw new Error(`Client ${stakeholder.name} must be defined in the service chain client options!`);
    }

    return expandToNode`
        const ${pascalToCamelCase(stakeholder.name)} = new clients.${stakeholder.name}Client('${clientOptions.defaultUrl}');
    `
}

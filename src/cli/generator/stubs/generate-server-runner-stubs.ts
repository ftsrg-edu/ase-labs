import { expandToNode, toString } from 'langium/generate';
import { Model, Stakeholder } from '../../../../gen/language/generated/ast.js';
import { DataSpaceConfig, RelativePath, ServerRunnerOptions } from '../configuration.js';
import { camelToKebabCase, relativePath, saveContent } from '../generator-utils.js';
import { existsSync } from 'fs'

export async function generateServerRunnerStubs(model: Model, configuration: DataSpaceConfig) {
    const serverRunnerStubs = configuration.stubs!.serverRunnerStubs;

    if (!serverRunnerStubs) {
        return;
    }

    for (const stakeholderName in serverRunnerStubs) {
        const stakeholder = model.stakeholders.filter(s => s.name === stakeholderName).at(0);
        if (!stakeholder) {
            throw new Error(`Stakeholder ${stakeholderName} does not exist in the model!`);
        }

        await generateServerRunnerStub(stakeholder, configuration, serverRunnerStubs[stakeholderName]);
    }
}

async function generateServerRunnerStub(stakeholder: Stakeholder, configuration: DataSpaceConfig, options: ServerRunnerOptions) {
    const outDir = `${configuration.stubs!.srcPath}/server-runner`
    const fileName = `${configuration[RelativePath]}/${outDir}/${camelToKebabCase(`${stakeholder.name}Runner`)}.ts`;

    if (existsSync(fileName)) {
        return;
    }

    const genPath = relativePath(configuration, outDir, configuration.genPath);

    const node = expandToNode`
        import { ${stakeholder.name}Server } from "${genPath}/servers.js";
        import { ${stakeholder.name}Logic } from "../logic/${camelToKebabCase(`${stakeholder.name}Logic`)}.js";

        const port = process.env.PORT || ${options.defaultPort};

        const logic = new ${stakeholder.name}Logic()
        const server = new ${stakeholder.name}Server(port, logic)

        server.start();
    `;

    await saveContent(fileName, toString(node));
}

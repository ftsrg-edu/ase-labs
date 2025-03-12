import { Model } from '../../../gen/language/generated/ast.js';
import { loadAndValidateDocument } from '../common.js'
import { DataSpaceConfig, GenerateOptions, loadConfig, RelativePath } from './configuration.js'
import { generateSchemaDefinitions } from './common/generate-schemas.js';
import { generateStakeholderDefinitions } from "./common/generate-stakeholders.js";
import { generateServerDefinitions } from "./common/generate-servers.js";
import { generateServiceChainDefinitions } from './common/generate-service-chains.js';
import { generateClientDefinitions } from "./common/generate-clients.js";
import { saveContent } from './generator-utils.js';
import { generateLogicStubs } from './stubs/generate-logic-stubs.js';
import { generateServerRunnerStubs } from './stubs/generate-server-runner-stubs.js';
import { generateServiceChainStubs } from './stubs/generate-service-chain-runner-stubs.js';

import baseClientContent from './library/base-client.txt';
import baseServerContent from './library/base-server.txt';
import baseServiceChainContent from './library/base-service-chain.txt';

export async function generateAction(options: GenerateOptions) {
    const configuration = await loadConfig(options);

    const model = await loadAndValidateDocument<Model>(`${configuration[RelativePath]}/${configuration.modelPath}`);

    if (!model) {
        process.exit(1);
    }

    await generateLibraries(configuration);
    await generateCommonFiles(model, configuration);
    await generateStubFiles(model, configuration);
}

async function generateLibraries(configuration: DataSpaceConfig) {
    const genPath = `${configuration[RelativePath]}/${configuration.genPath}`;

    await saveContent(`${genPath}/base-client.ts`, baseClientContent);
    await saveContent(`${genPath}/base-server.ts`, baseServerContent);
    await saveContent(`${genPath}/base-service-chain.ts`, baseServiceChainContent);
}

async function generateCommonFiles(model: Model, configuration: DataSpaceConfig) {
    await generateSchemaDefinitions(model, configuration);
    await generateClientDefinitions(model, configuration);
    await generateServerDefinitions(model, configuration);
    await generateStakeholderDefinitions(model, configuration);
    await generateServiceChainDefinitions(model, configuration);
}

async function generateStubFiles(model: Model, configuration: DataSpaceConfig) {
    if (configuration.stubs === undefined) {
        return;
    }

    await generateLogicStubs(model, configuration);
    await generateServerRunnerStubs(model, configuration);
    await generateServiceChainStubs(model, configuration);
}

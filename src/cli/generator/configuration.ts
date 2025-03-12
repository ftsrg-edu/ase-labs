import * as path from 'node:path';
import * as fs from 'node:fs';
import { readFile } from 'fs/promises';

export type GenerateOptions = {
    configuration?: string;
}

export const RelativePath = Symbol('RelativePath');

export type Stub = ServiceChainStub | ServerStub;

export type ServiceChainStub = {
    generateServiceChains: true,
    serviceChains: string[]

}

export type ServerStub = {
    $type: 'MainStub',

}

export type DataSpaceConfig = {
    [RelativePath]: string,
    modelPath: string,
    genPath: string,
    stubs?: {
        srcPath: string,
        serverRunnerStubs?: ServerRunnerStubs,
        serviceChainStubs?: ServiceChainStubs,
    }
}

export type ServerRunnerOptions = {
    defaultPort: number
}

export type ServerRunnerStubs = {
    [key: string]: ServerRunnerOptions
}

export type ServiceChainOptions = {
    clients: {
        [key: string]: ServiceChainClientOptions
    }
}

export type ServiceChainClientOptions = {
    defaultUrl: number
}

export type ServiceChainStubs = {
    [key: string]: ServiceChainOptions
}

type PackageJson = {
    dataspace?: DataSpaceConfig
}

export async function loadConfig(options: GenerateOptions): Promise<DataSpaceConfig> {
    if (options.configuration) {
        return loadConfigFromFile(options.configuration);
    } else {
        return loadConfigFromPackage();
    }
}

async function loadConfigFromPackage(filePath = 'package.json'): Promise<DataSpaceConfig> {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
    }

    const content = await readFile(filePath, 'utf-8');

    const obj = JSON.parse(content) as PackageJson;
    const config = obj.dataspace;

    if (!config) {
        throw new Error(`${filePath} does not have a 'dataspace' property defined!`);
    }

    config[RelativePath] = path.dirname(filePath);

    return config;
}

async function loadConfigFromFile(filePath: string): Promise<DataSpaceConfig> {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
    }

    const content = await readFile(filePath, 'utf-8');

    const config = JSON.parse(content) as DataSpaceConfig;

    config[RelativePath] = path.dirname(filePath);

    return config;
}

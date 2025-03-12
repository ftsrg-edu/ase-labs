import * as path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { DataSpaceConfig, RelativePath } from './configuration.js';

export async function saveContent(filePath: string, content: string): Promise<void> {
    const parentDir = path.dirname(filePath);
    await mkdir(parentDir, { recursive: true });
    await writeFile(filePath, content);
}

export function relativePath(configuration: DataSpaceConfig, from: string, to: string): string {
    return path.relative(`${configuration[RelativePath]}/${from}/`, `${configuration[RelativePath]}/${to}/`).replace(/\\/g, '/');
}

export function camelToKebabCase(str: string): string {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

export function pascalToCamelCase(str: string): string {
    return `${str.charAt(0).toLowerCase()}${str.substring(1)}`;
}

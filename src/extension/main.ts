import type { LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node.js';
import type * as vscode from 'vscode';
import * as path from 'node:path';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node.js';

let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    client = createDataSpaceClient(context);

    await client.start();
}

export async function deactivate(): Promise<void> {
    if (client) {
        await client.stop();
    }
}

function createDataSpaceClient(context: vscode.ExtensionContext): LanguageClient {
    const serverModule = context.asAbsolutePath(path.join('dist', 'language', 'runner', 'lsp-server.cjs'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
    // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
    const debugOptions = { execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`] };

    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: '*', language: 'data-space' }]
    };

    const client = new LanguageClient(
        'data-space',
        'Data Space',
        serverOptions,
        clientOptions
    );

    return client;
}

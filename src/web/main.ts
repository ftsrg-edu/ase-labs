import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import { EditorApp, EditorAppConfig } from 'monaco-languageclient/editorApp';
import { LanguageClientConfig, LanguageClientWrapper } from 'monaco-languageclient/lcwrapper';
import { MonacoVscodeApiConfig, MonacoVscodeApiWrapper } from 'monaco-languageclient/vscodeApiWrapper';
import { configureDefaultWorkerFactory } from 'monaco-languageclient/workerFactory';
import { LogLevel } from 'vscode';
import exampleDataModel from './example.dataspace'

export type DataSpaceAppConfig = {
    vscodeApiConfig: MonacoVscodeApiConfig;
    languageClientConfig: LanguageClientConfig;
    editorAppConfig: EditorAppConfig;
}

export const setupConfigExtended = (): DataSpaceAppConfig => {
    const extensionFilesOrContents = new Map<string, string | URL>();
    extensionFilesOrContents.set('/language-configuration.json', new URL('../../language-configuration.json', import.meta.url));
    extensionFilesOrContents.set('/data-space-grammar.json', new URL('../../syntaxes/data-space.tmLanguage.json', import.meta.url));

    const loadDataSpaceWorker = () => {
        return new Worker(new URL('../language/runner/lsp-browser', import.meta.url), {
            type: 'module',
            name: 'DataSpace Language Server'
        })
    };

    const worker = loadDataSpaceWorker();

    const editorAppConfig: EditorAppConfig = {
        logLevel: LogLevel.Debug,
        codeResources: {
            modified: {
                text: exampleDataModel,
                uri: '/workspace/example.dataspace',
            }
        }
    };

    const vscodeApiConfig: MonacoVscodeApiConfig = {
        $type: 'extended',
        viewsConfig: {
            $type: 'EditorService',
        },
        logLevel: LogLevel.Debug,
        advanced: {
            enableExtHostWorker: true
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        serviceOverrides: {
            ...getKeybindingsServiceOverride()
        },
        userConfiguration: {
            json: JSON.stringify({
                // 'workbench.colorTheme': 'Default Dark Modern',
                // 'editor.guides.bracketPairsHorizontal': 'active',
                // 'editor.wordBasedSuggestions': 'off',
                'editor.experimental.asyncTokenization': true,
                'vitest.disableWorkspaceWarning': true
            })
        },
        monacoWorkerFactory: configureDefaultWorkerFactory,
        extensions: [{
            config: {
                name: 'data-space-web',
                publisher: 'generator-langium',
                version: '1.0.0',
                engines: {
                    vscode: '*'
                },
                contributes: {
                    languages: [{
                        id: 'data-space',
                        extensions: [
                            '.dataspace'
                        ],
                        configuration: './language-configuration.json'
                    }],
                    grammars: [{
                        language: 'data-space',
                        scopeName: 'source.data-space',
                        path: './data-space-grammar.json'
                    }]
                }
            },
            filesOrContents: extensionFilesOrContents,
        }]
    };

    const languageClientConfig: LanguageClientConfig = {
        languageId: "data-space",
        logLevel: LogLevel.Debug,
        clientOptions: {
            documentSelector: [ 'data-space' ]
        },
        connection: {
            options: {
                $type: 'WorkerDirect',
                worker: worker
            },
        }
    }

    return {
        editorAppConfig,
        vscodeApiConfig,
        languageClientConfig,
    }
};

try {
    const appConfig = setupConfigExtended();

    // perform global init
    const apiWrapper = new MonacoVscodeApiWrapper(appConfig.vscodeApiConfig);
    await apiWrapper.start();

    // init language client
    const lcWrapper = new LanguageClientWrapper(appConfig.languageClientConfig);
    await lcWrapper.start();

    // Create and start the editor app
    const editorApp = new EditorApp(appConfig.editorAppConfig);
    const htmlContainer = document.getElementById('monaco-editor-root')!;
    await editorApp.start(htmlContainer);
} catch (e) {
    console.error(e);
}

import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import { MonacoEditorLanguageClientWrapper, WrapperConfig } from 'monaco-editor-wrapper';
import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory';
import { LogLevel } from 'vscode/services';

// import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override'
import { Logger } from 'monaco-languageclient/tools';

const exampleModelText = `schema StudentData {
    
}`

export const setupConfigExtended = (): WrapperConfig => {
    const extensionFilesOrContents = new Map();
    extensionFilesOrContents.set('/language-configuration.json', new URL('../../language-configuration.json', import.meta.url));
    extensionFilesOrContents.set('/data-space-grammar.json', new URL('../../syntaxes/data-space.tmLanguage.json', import.meta.url));

    return {
        $type: 'extended',
        htmlContainer: document.getElementById('monaco-editor-root')!,         
        logLevel: LogLevel.Debug,
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
        }],
        vscodeApiConfig: {
            serviceOverrides: {
                ...getKeybindingsServiceOverride()
            },
            userConfiguration: {
                json: JSON.stringify({
                    'workbench.colorTheme': 'Default Dark Modern',
                    'editor.guides.bracketPairsHorizontal': 'active',
                    'editor.wordBasedSuggestions': 'off',
                    'editor.experimental.asyncTokenization': true
                })
            }
        },
        editorAppConfig: {
            codeResources: {
                modified: {
                    text: exampleModelText,
                    fileExt: ".dataspace"
                }
            }, 
            monacoWorkerFactory: configureDefaultWorkerFactory
        },
        languageClientConfigs: {
            "data-space": {
                clientOptions: {
                    documentSelector: [ 'data-space' ]
                },
                connection: {
                    options: {
                        $type: 'WorkerDirect',
                        worker: new Worker(new URL('../language/runner/lsp-browser', import.meta.url), {
                            type: 'module',
                            name: 'DataSpace Language Server'
                        })
                    }
                }                
            }
        }
    };
};

const configureDefaultWorkerFactory = (logger?: Logger) => {
    const defaultTextEditorWorker = () => new Worker(
        new URL('@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.worker.js', import.meta.url),
        { type: 'module' }
    );
    const defaultTextMateWorker = () => new Worker(
        new URL('@codingame/monaco-vscode-textmate-service-override/worker', import.meta.url),
        { type: 'module' }
    );

    useWorkerFactory({
        workerOverrides: {
            workerLoaders: {
                TextEditorWorker: defaultTextEditorWorker,
                TextMateWorker: defaultTextMateWorker,
            }
        },
        logger
    });
};

const userConfig = setupConfigExtended();
const wrapper = new MonacoEditorLanguageClientWrapper();
await wrapper.initAndStart(userConfig);

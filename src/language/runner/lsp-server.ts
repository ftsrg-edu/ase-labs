import { startLanguageServer } from 'langium/lsp';
import { NodeFileSystem } from 'langium/node';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node.js';
import { createDataSpaceServices } from '../data-space-module.js';

const connection = createConnection(ProposedFeatures.all);
const { shared } = createDataSpaceServices({ connection, ...NodeFileSystem });

startLanguageServer(shared);

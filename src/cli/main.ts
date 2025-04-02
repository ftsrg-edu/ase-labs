import { Command } from 'commander';
import { DataSpaceLanguageMetaData } from '../../gen/language/generated/module.js';
import { chatAction } from './ai/chat.js';
import { extractAction } from './ai/extract.js';
import { generateAction } from './ai/generate.js';
import { validateAction } from './validator/validate.js';

const fileExtensions = DataSpaceLanguageMetaData.fileExtensions.join(', ');

const program = new Command();
program.command('validate')
    .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
    .description('Validates the input model.')
    .action(validateAction);

program.command('chat')
    .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
    .description('Initiates AI chat.')
    .action(chatAction);

program.command('extract')
    .argument('<dir>', 'specification directory')
    .argument('<outPath>', 'output file path')
    .description('Generate specification from a folder of PDF files.')
    .action(extractAction);

program.command('generate')
    .argument('<file>', 'specification document (possible file extensions: .md, .txt)')
    .description('Generate dataspace model from a document.')
    .action(generateAction);

program.parse(process.argv);

import { Command } from 'commander';
import { DataSpaceLanguageMetaData } from '../../gen/language/generated/module.js';
import { validateAction } from './validator/validate.js';
import { generateAction } from './generator/generate.js';

const fileExtensions = DataSpaceLanguageMetaData.fileExtensions.join(', ');

const program = new Command();
program.command('validate')
    .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
    .description('Validates the input model.')
    .action(validateAction);

program.command('generate')
    .option('-c, --configuration [file]', `configuration file`, 'data-space-config.json')
    .description('Generates TS implementation code.')
    .action(generateAction);

program.parse(process.argv);

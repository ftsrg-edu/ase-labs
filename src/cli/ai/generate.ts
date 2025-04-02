import { readFile } from 'node:fs/promises';

import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

import sytemPrompt from './system-prompt.txt';

const model = 'openai/gpt-4o-mini';

function sanitizeName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_$]/g, '_');
}

const Name = z.string().transform(sanitizeName);

const SchemaDefinitionArray = z.object({
    schemas: z.object({
        name: Name,
        attributes: z.object({
            name: Name,
            PII: z.boolean(),
            type: z.union([
                z.literal('string'),
                z.literal('number'),
                z.literal('boolean'),
            ]),
        }).array(),
    }).array(),
});

const StakeholderDefinitionArray = z.object({
    stakeholders: z.object({
        name: Name,
        owns: z.object({
            name: Name,
            schema: Name,
        }).array(),
        subjectOf: z.object({
            owner: Name,
            datasetName: Name,
            consents: Name.array(),
        }).array(),
        provides: z.object({
            name: Name,
            inputSchema: Name,
            outputSchema: Name,
        }).array(),
        consumes: z.object({
            name: Name,
            schema: Name,
        }).array(),
    }).array(),
});

// TODO Implement the zod schemas for service chains and mappings.

export async function generateAction(fileName: string): Promise<void> {
    const openai = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'],
        baseURL: 'https://openrouter.ai/api/v1',
    });

    const text = await readFile(fileName, 'utf8');

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content: sytemPrompt,
        },
        {
            role: 'user',
            content: `You are given the following specification of a data space:

${text}

Please identify all schemas in the data space.
Return your answer as a JSON object, where the "schemas" key is an array of objects with the following properties:
* "name": the name of the schema,
* "attributes": an array of objects representing the attributes of the schema, with the following properties:
    * "name": the name of the attribute,
    * "PII": a boolean indicating whether the attribute contains PII,
    * "type": a string indicating the type of the attribute ("string", "number", or "boolean").

All names should be valid TypeScript identifiers. Do not include any spaces or non-ASCII characters.
`,
        }
    ];

    let result = await openai.chat.completions.create({
        model,
        messages,
        response_format: zodResponseFormat(SchemaDefinitionArray, 'SchemaDefinitionArray'),
    });

    const { schemas } = SchemaDefinitionArray.parse(JSON.parse(result.choices[0].message.content ?? '{}'));

    let code = schemas.map(({ name, attributes }) => {
        const attributesCode = attributes.map((a) => `    ${a.PII ? '@PII ' : ''}${a.name}: ${a.type}\n`).join('');
        return `schema ${name} {\n${attributesCode}}`;
    }).join('\n\n');

    messages.push(result.choices[0].message);
    messages.push({
        role: 'user',
        content: `You have created the following schemas:

${code}

Please describe the stakeholders in the model.
Return your answer as a JSON object, where the "stakeholders" key is an array of objects with the following properties:
* "name": the name of the stakeholder,
* "owns": the datasets owned by the the stakeholder, which is an array of objects with the following properties:
    * "name": the name of the dataset,
    * "schema": the name of the schema of the dataset (refer to an existing schema),
* "subjectOf": the datasets this stakeholder is a subject of, which is an array of objects with the following properties:
    * "owner": the owner of the dataset (refer to an existing stakeholder),
    * "dataset": the name of the dataset (refer to an existing dataset owned by "owner"),
    * "consent": the names of the stakeholders the data subject gives consent to for processing this data, which is an array of stakeholder names (refer to existing stakeholders only),
* "provides": the services provided by this stakeholder, which is an array of objects with the following properties:
    * "name": the name of the service,
    * "inputSchema": the input schema of the service (refer to an existing schema),
    * "outputSchema": the input schema of the service (refer to an existing schema)
* "consumes": the datasets consumed by the the stakeholder, which is an array of objects with the following properties:
    * "name": the name of the dataset consumer,
    * "schema": the name of the schema of the consumed dataset (refer to an existing schema),

All names should be valid TypeScript identifiers. Do not include any spaces or non-ASCII characters.
`
    });

    result = await openai.chat.completions.create({
        model,
        messages,
        response_format: zodResponseFormat(StakeholderDefinitionArray, 'StakeholderDefinitionArray'),
    });

    const { stakeholders } = StakeholderDefinitionArray.parse(JSON.parse(result.choices[0].message.content ?? '{}'));

    code = code + '\n\n' + stakeholders.map((s) => {
        const owns = s.owns.map((o) => `    owns dataset ${o.name}: ${o.schema}\n`).join('');
        const subjectOf = s.subjectOf.map((o) => {
            const consents = o.consents.map((c) => `        gives consent to ${c}\n`).join('');
            return `    subject of ${o.owner}.${o.datasetName} {\n${consents}    }\n`;
        }).join('');
        const provides = s.provides.map((o) => `    provides service ${o.name}: ${o.inputSchema} -> ${o.outputSchema}\n`).join('');
        const consumes = s.consumes.map((o) => `    consumes dataset ${o.name}: ${o.schema}\n`).join('');
        return `stakeholder ${s.name} {\n${owns}${subjectOf}${provides}${consumes}}`
    }).join('\n\n');

    messages.push(result.choices[0].message);

    // TODO Implement the generation for service chains and mappings.

    console.log(code);
}

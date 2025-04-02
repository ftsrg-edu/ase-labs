import { writeFile } from 'node:fs/promises';

import OpenAI from 'openai';

const model = 'deepseek/deepseek-r1';

export async function extractAction(dirName: string, outPath: string): Promise<void> {
    const openai = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'],
        baseURL: 'https://openrouter.ai/api/v1',
    });

    const specification = 'TODO concatenate all PDF files into a single string here';

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content: `You are a helpful dataspace modeling expert. Your task is to generate a comprehensive dataspace specification from a set of specification files.

Data spaces are collaborations of stakeholders.

// TODO Describe what a dataspace is and what are stakeholders, datasets, data subjects, services, dataset consumers, and service chains.

Your task is to generate a well-structured and semantically correct dataspace specification from the given specification files.
`
        },
        {
            role: 'user',
            content: `Please create a data space specification from the following specification files.
Make sure to describe the stakeholders, datasets, data subjects, consents, services, dataset consumers, and service chains in appropriate detail.

${specification}`
        }
    ];

    const result = await openai.chat.completions.create({
        model,
        messages,
    });

    const spec = result.choices[0].message.content ?? '';
    console.log(spec);
    await writeFile(outPath, spec);
}

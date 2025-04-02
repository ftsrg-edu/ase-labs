import { createInterface } from 'node:readline/promises';

import OpenAI from 'openai';

import { Model } from '../../../gen/language/generated/ast.js';
import { loadAndValidateDocument } from '../common.js';

import sytemPrompt from './system-prompt.txt';

const model = 'openai/gpt-4o-mini';

export async function chatAction(fileName: string): Promise<void> {
    const ast = await loadAndValidateDocument<Model>(fileName);

    if (!ast) {
        // Failed to load or validate the document.
        return;
    }

    const text = ast.$document?.textDocument.getText() ?? '';

    const openai = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'],
        baseURL: 'https://openrouter.ai/api/v1',
    });

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content: sytemPrompt,
        },
        {
            role: 'user',
            content: `
You are given the following data space model:

<code>
${text}
</code>

Please explain the model to a non-technical manager. Do not refer to specific language constructs, but list the most important stakeholders, service chains, and interactions.`,
        }
    ];

    const result = await openai.chat.completions.create({
        model,
        messages,
    });

    console.log(result.choices[0].message.content);
    messages.push(result.choices[0].message);
    messages.push({
        role: 'user',
        content: `In the following, the user will ask a series of questions. Your task as a data space modeling expert is to provide a detailed answer for each question.

Reply "Understood." if you understand these instructions and will follow them carefully.`,
    });
    messages.push({
        role: 'assistant',
        content: 'Understood.',
    });

    const readline = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    while (true) {
        const query = (await readline.question('? ')).trim();
        if (query === '/exit') {
            break;
        }

        // TODO Implement the chat application.
    }

    readline.close();
}

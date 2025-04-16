import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
    {
        test: {
            name: 'unit',
            include: ['**/*.unit.test.ts'],
        },
    },
    {
        test: {
            name: 'integration',
            include: ['**/*.integration.test.ts'],
            // More integration test related setup here...
        },
    },
    {
        test: {
            name: 'e2e',
            include: ['**/*.e2e.test.ts'],
        },
    },
]);
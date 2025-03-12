import { colors, loadAndValidateDocument } from '../common.js'

export async function validateAction(fileName: string): Promise<void> {
    const model = await loadAndValidateDocument(fileName)
    
    if (model) {
        console.info(colors.pass('Complience check successful!'));
    }
};

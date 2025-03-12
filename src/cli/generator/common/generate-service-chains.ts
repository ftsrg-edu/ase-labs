import { expandToNode, GeneratorNode, joinToNode, toString } from 'langium/generate';
import { BaseStep, FinalStep, FirstStep, isFirstStep, isStep, Model, ServiceChain, Stakeholder, Step } from '../../../../gen/language/generated/ast.js';
import { DataSpaceConfig, RelativePath } from '../configuration.js';
import { pascalToCamelCase, saveContent } from '../generator-utils.js';

export async function generateServiceChainDefinitions(model: Model, configuration: DataSpaceConfig) {
    const node = expandToNode`
        /* eslint-disable */
        import { BaseServiceChain } from './base-service-chain.js';

        import * as schemas from './schemas.js';
        import * as stakeholders from './stakeholders.js';
        
        ${joinToNode(model.serviceChains, mapServiceChainToClass, { appendNewLineIfNotEmpty: true })}
    `;

    await saveContent(`${configuration[RelativePath]}/${configuration.genPath}/service-chains.ts`, toString(node));
}

function mapServiceChainToClass(serviceChain: ServiceChain): GeneratorNode {
    const stakeholders = [...new Set(serviceChain.steps.map(s => s.stakeholder.ref).filter(s => s !== undefined))];

    return expandToNode`
        export class ${serviceChain.name} extends BaseServiceChain {
            constructor(
                ${joinToNode(stakeholders, mapStakeholderToParameter, { separator: ',', appendNewLineIfNotEmpty: true })}
            ) {
                super();
            }

            async execute() {
                ${joinToNode(serviceChain.steps, mapBaseStepToCall, { appendNewLineIfNotEmpty: true })}
            }

            // TODO: implement step method generator!
        }
    `;
}

function mapStakeholderToParameter(stakeholder: Stakeholder): GeneratorNode {
    return expandToNode`
        private readonly ${pascalToCamelCase(stakeholder.name)}: stakeholders.${stakeholder.name}
    `;
}

function mapBaseStepToCall(step: BaseStep): GeneratorNode {
    if (isFirstStep(step)) {
        return mapFirstStepToCall(step);
    }
    if (isStep(step)) {
        return mapStepToCall(step);
    }
    return mapFinalStepToCall(step);
}

function mapFirstStepToCall(step: FirstStep): GeneratorNode {
    return expandToNode`
        const data${step.$containerIndex} = await this.step${step.$containerIndex}();
    `;
}

function mapStepToCall(step: Step): GeneratorNode {
    return expandToNode`
        const data${step.$containerIndex} = await this.step${step.$containerIndex}(data${step.$containerIndex! - 1});
    `;
}

function mapFinalStepToCall(step: FinalStep): GeneratorNode {
    return expandToNode`
        await this.step${step.$containerIndex}(data${step.$containerIndex! - 1});
    `;
}

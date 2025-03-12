import type { ValidationAcceptor, ValidationChecks } from 'langium';
import { FinalStep, FirstStep, isFinalStep, isFirstStep, MappableStep, Mapping, NamedElement, ServiceChain, Step, type Consume, type DataSet, type DataSpaceAstType, type Field, type Model, type Schema, type Service, type Stakeholder } from '../../gen/language/generated/ast.js';
import type { DataSpaceServices } from './data-space-module.js';
import { stepInputSchema, stepOutputSchema } from './data-space-utils.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: DataSpaceServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.DataSpaceValidator;
    const checks: ValidationChecks<DataSpaceAstType> = {
        Model: [
            validator.validateUniqueElementsInModel,
        ],
        Schema: [
            validator.validateCapitalizedSchemas,
            validator.validateUniqueElementsInSchema,
        ],
        Field: [
            validator.validateUncapitalizedFields,
        ],
        Stakeholder: [
            validator.validateCapitalizedStakeholders,
            validator.validateUniqueElementsInStakeholder,
        ],
        DataSet: [
            validator.validateUncapitalizedDataSets,
        ],
        Service: [
            validator.validateUncapitalizedServices,
        ],
        Consume: [
            validator.validateUncapitalizedConsumes,
        ],
        MappableStep: [
            validator.validateImplicitStepConversions,
        ],
        Mapping: [
            validator.validateNoMissingMapping,
            validator.validateNoDuplicateMappings,
            validator.validateCompatibleMappings,
        ],
        ServiceChain: [
            validator.validateCapitalizedServiceChain,
            validator.validateNoPiiViolation,
        ]
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class DataSpaceValidator {

    validateUncapitalizedFields(this: void, field: Field, accept: ValidationAcceptor) {
        validateNameCapitalization(field, false, accept);
    }

    validateCapitalizedSchemas(this: void, schema: Schema, accept: ValidationAcceptor) {
        validateNameCapitalization(schema, true, accept);
    }

    validateUncapitalizedDataSets(this: void, dataSet: DataSet, accept: ValidationAcceptor) {
        validateNameCapitalization(dataSet, false, accept);
    }

    validateUncapitalizedServices(this: void, service: Service, accept: ValidationAcceptor) {
        validateNameCapitalization(service, false, accept);
    }

    validateUncapitalizedConsumes(this: void, consume: Consume, accept: ValidationAcceptor) {
        validateNameCapitalization(consume, false, accept);
    }

    validateCapitalizedStakeholders(this: void, stakeholder: Stakeholder, accept: ValidationAcceptor) {
        validateNameCapitalization(stakeholder, true, accept);
    }

    validateCapitalizedServiceChain(this: void, serviceChain: ServiceChain, accept: ValidationAcceptor) {
        validateNameCapitalization(serviceChain, true, accept);
    }

    validateUniqueElementsInModel(this: void, model: Model, accept: ValidationAcceptor) {
        const uniqueElementValidator = new UniqueElementValidator(accept);

        model.schemas.forEach(s => {
            uniqueElementValidator.addElement(s);
        });
        model.serviceChains.forEach(s => {
            uniqueElementValidator.addElement(s);
        });
        model.stakeholders.forEach(s => {
            uniqueElementValidator.addElement(s);
        });
    }

    validateUniqueElementsInSchema(this: void, schema: Schema, accept: ValidationAcceptor) {
        const uniqueElementValidator = new UniqueElementValidator(accept);
        schema.fields.forEach(s => {
            uniqueElementValidator.addElement(s);
        });
    }

    validateUniqueElementsInStakeholder(this: void, stakeholder: Stakeholder, accept: ValidationAcceptor) {
        const uniqueElementValidator = new UniqueElementValidator(accept);
        stakeholder.services.forEach(s => {
            uniqueElementValidator.addElement(s);
        });
        stakeholder.dataSets.forEach(s => {
            uniqueElementValidator.addElement(s);
        });
        stakeholder.consumes.forEach(s => {
            uniqueElementValidator.addElement(s);
        });
    }

    validateImplicitStepConversions(this: void, step: MappableStep, accept: ValidationAcceptor) {
        const serviceChain = step.$container;
        const previousStep = serviceChain.steps.at(step.$containerIndex! - 1)!;

        const stakeholder = step.stakeholder?.ref;
        const previousStakeholder = previousStep.stakeholder?.ref;

        if (!stakeholder || !previousStakeholder) {
            return;
        }

        const target = step.target?.ref;
        const previousTarget = previousStep.target?.ref;

        if (!target || !previousTarget) {
            return;
        }

        const previousOutput = stepOutputSchema(previousStep);
        const currentInput = stepInputSchema(step);

        if (!currentInput || !previousOutput) {
            return;
        }

        if (!step.mapping && previousOutput !== currentInput) {
            accept(
                'error',
                `Incompatible data types: '${previousStakeholder.name}.${previousTarget.name}' returns '${previousOutput.name}' while '${stakeholder.name}.${target.name}' requires '${currentInput.name}'!`,
                { node: step }
            );
        }
    }

    validateNoMissingMapping(this: void, mapping: Mapping, accept: ValidationAcceptor) {
        const step = mapping.$container;
        const currentInput = stepInputSchema(step);
        const currentInputNames = currentInput?.fields.map(f => f.name).filter(s => s !== undefined) || [];
        const missingFieldNamesSet = new Set(currentInputNames);

        const serviceChain = step.$container;
        const previousStep = serviceChain.steps.at(step.$containerIndex! - 1)!
        const previousOutput = stepOutputSchema(previousStep);
        const previousOutputNames = previousOutput?.fields.map(f => f.name).filter(s => s !== undefined) || [];
        previousOutputNames.forEach(name => missingFieldNamesSet.delete(name));

        const mappingLeftNames = mapping.valueMappings.map(m => m.left?.ref?.name).filter(name => name !== undefined);
        mappingLeftNames.forEach(name => missingFieldNamesSet.delete(name));

        const missingFieldNames = Array.from(missingFieldNamesSet.values());

        if (missingFieldNames.length > 0) {
            accept(
                'error',
                `Incomplete value mapping: ${missingFieldNames.join(", ")}`,
                { node: mapping }
            );
        }
    }

    validateNoDuplicateMappings(this: void, mapping: Mapping, accept: ValidationAcceptor) {
        const elements = new Set();

        mapping.valueMappings.forEach(m => {
            if (m.left?.ref) {
                if (elements.has(m.left.ref)) {
                    accept('error', `Duplicate mapping for ${m.left.ref.name}.`, { node: m, property: 'left' });
                }
                elements.add(m.left.ref);
            }
        });
    }

    validateCompatibleMappings(this: void, mapping: Mapping, accept: ValidationAcceptor) {
        mapping.valueMappings.forEach(m => {
            const left = m.left?.ref;
            const right = m.right?.ref;

            if (left && right) {
                const leftType = left.type;
                const rightType = right.type;
                if (leftType !== rightType) {
                    accept(
                        'error',
                        `Incompatible value mapping: ${left.name} is ${leftType}, while ${right.name} is ${rightType}!.`,
                        { node: m }
                    );
                }
            }
        });
    }

    validateNoPiiViolation(this: void, serviceChain: ServiceChain, accept: ValidationAcceptor) {
        const firstStep = serviceChain.steps.at(0);
        if (!isFirstStep(firstStep)) {
            return; // incomplete model, no use to check PII
        }

        const sourceDataSet = firstStep.target?.ref
        if (!sourceDataSet) {
            return; // incomplete model, no use to check PII
        }

        const model = serviceChain.$container;
        const interestedStakeholders = model.stakeholders.filter(s =>
            s.subjectOfRelations.some(r => r.dataSet?.ref === sourceDataSet)
        );
        const consentedStakeholders = interestedStakeholders.flatMap(s =>
            s.subjectOfRelations.filter(s => s.dataSet?.ref === sourceDataSet).flatMap(s => s.consents)
        ).map(c => c.ref).filter(c => c !== undefined);

        let piiFields = calculateOutputPiiFields(firstStep);

        for (let i = 1; i < serviceChain.steps.length; i++) {
            const currentStep = serviceChain.steps.at(i)!;

            if (isFirstStep(currentStep)) {
                return; // incomplete model, no use to check PII
            }

            piiFields = propagatePiiFields(piiFields, currentStep);

            if (piiFields.length == 0) { // no more PII fields to check
                return;
            }

            const stakeholder = currentStep.stakeholder?.ref;
            if (!stakeholder) {
                return; // incomplete model, no use to check PII
            }

            if (!consentedStakeholders.includes(stakeholder)) {
                const piiFieldNames = piiFields.map(f => f.name);
                accept(
                    'error',
                    `PII consent error: ${piiFieldNames.join(", ")}!`,
                    { node: currentStep }
                );
                return;
            }

            if (!isFinalStep(currentStep)) {
                piiFields = calculateOutputPiiFields(currentStep);
            }
        }
    }

}

class UniqueElementValidator {

    readonly names = new Set();

    readonly accept: ValidationAcceptor;

    constructor(accept: ValidationAcceptor) {
        this.accept = accept;
    }

    addElement(namedElement: NamedElement | undefined) {
        if (!namedElement?.name) {
            return;
        }

        if (this.names.has(namedElement.name)) {
            this.accept(
                'error',
                `${namedElement.$type} has non-unique name '${namedElement.name}'.`,
                { node: namedElement, property: 'name' }
            );
        }
        this.names.add(namedElement.name);
    }

}

function validateNameCapitalization(namedElement: NamedElement, isCapital: boolean, accept: ValidationAcceptor) {
    const firstChar = namedElement.name?.charAt(0);
    if (isCapital) {
        if (firstChar?.toUpperCase() !== firstChar) {
            accept(
                'warning',
                `${namedElement.$type}'s name should start with a capital.`,
                { node: namedElement, property: 'name' }
            );
        }
    } else {
        if (firstChar?.toLowerCase() !== firstChar) {
            accept(
                'warning',
                `${namedElement.$type}'s name should not start with a capital.`,
                { node: namedElement, property: 'name' }
            );
        }
    }
}

function propagatePiiFields(piiFields: Field[], currentStep: Step | FinalStep): Field[] {
    const mapping = currentStep.mapping;

    if (!mapping) {
        return piiFields;
    }

    const valueMappings = mapping.valueMappings;

    const newPii = valueMappings.filter(m => {
        const right = m.right?.ref
        if (right) {
            if (m.isPseudonymize) {
                return false;
            }

            return piiFields.includes(right);
        }

        return false;
    }).map(m => m.left?.ref).filter(p => p !== undefined);

    return newPii;
}

function calculateOutputPiiFields(step: Step | FirstStep): Field[] {
    const schema = stepOutputSchema(step);
    return schema?.fields.filter(f => f.isPii) || [];
}

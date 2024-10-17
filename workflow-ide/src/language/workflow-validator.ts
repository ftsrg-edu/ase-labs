import type { ValidationChecks } from 'langium';
import type { WorkflowAstType } from './generated/ast.js';
import type { WorkflowServices } from './workflow-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: WorkflowServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.WorkflowValidator;
    const checks: ValidationChecks<WorkflowAstType> = {

    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class WorkflowValidator {

}

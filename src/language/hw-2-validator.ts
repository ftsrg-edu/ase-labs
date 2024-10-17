import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { Hw2AstType, Person } from './generated/ast.js';
import type { Hw2Services } from './hw-2-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: Hw2Services) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.Hw2Validator;
    const checks: ValidationChecks<Hw2AstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class Hw2Validator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}

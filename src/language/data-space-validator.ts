import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { DataSpaceAstType, Field, Model, Schema } from '../../gen/language/generated/ast.js';
import type { DataSpaceServices } from './data-space-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: DataSpaceServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.DataSpaceValidator;
    const checks: ValidationChecks<DataSpaceAstType> = {
        Model: [
            validator.validateUniqueSchemasInModel,
        ],
        Schema: [
            validator.validateCapitalizedSchemas,
            validator.validateUniqueFieldsInSchema,
        ],
        Field: [
            validator.validateUncapitalizedFields,
        ]
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class DataSpaceValidator {

    validateCapitalizedSchemas(this: void, schema: Schema, accept: ValidationAcceptor): void {
        const firstChar = schema.name?.charAt(0);
        if (firstChar?.toUpperCase() !== firstChar) {
            accept('warning', 'Schema name should start with a capital.', { node: schema, property: 'name' });
        }
    }

    validateUncapitalizedFields(this: void, field: Field, accept: ValidationAcceptor): void {
        const firstChar = field.name?.charAt(0);
        if (firstChar?.toLowerCase() !== firstChar) {
            accept('warning', 'Field name should not start with a capital.', { node: field, property: 'name' });
        }
    }

    validateUniqueElementsInModel(this: void, model: Model, accept: ValidationAcceptor): void {
        const names = new Set();
        model.schemas.forEach(s => {
            if (s.name) {
                if (names.has(s.name)) {
                    accept('error',  `Schema has non-unique name '${s.name}'.`,  {node: s, property: 'name'});
                }
                names.add(s.name);
            }
        });
    }

    validateUniqueFieldsInSchema(this: void, schema: Schema, accept: ValidationAcceptor): void {
        const fields = new Set();
        schema.fields.forEach(s => {
            if (s.name) {
                if (fields.has(s.name)) {
                    accept('error',  `Field has non-unique name '${s.name}'.`,  {node: s, property: 'name'});
                }
                fields.add(s.name);
            }
        });
    }

}

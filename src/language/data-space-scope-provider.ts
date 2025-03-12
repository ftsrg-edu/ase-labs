import { DefaultScopeProvider, EMPTY_SCOPE, ReferenceInfo, Scope } from "langium";
import { isBaseStep, isFirstStep, isStep, isSubjectOfRelation, isValueMapping } from "../../gen/language/generated/ast.js";
import { stepInputSchema, stepOutputSchema } from "./data-space-utils.js";

export class DataSpaceScopeProvider extends DefaultScopeProvider {

    override getScope(context: ReferenceInfo): Scope {
        if (context.property === 'dataSet' && isSubjectOfRelation(context.container)) {
            const stakeholder = context.container.stakeholder.ref;
            if (stakeholder) {
                return this.createScopeForNodes(stakeholder.dataSets);
            } else {
                return EMPTY_SCOPE;
            }
        }

        if (context.property === 'target' && isBaseStep(context.container)) {
            const stakeholder = context.container.stakeholder.ref;

            if (!stakeholder) {
                return EMPTY_SCOPE;
            }

            if (isFirstStep(context.container)) {
                return this.createScopeForNodes(stakeholder.dataSets);
            }
            if (isStep(context.container)) {
                return this.createScopeForNodes(stakeholder.services);
            }

            return this.createScopeForNodes(stakeholder.consumes);
        }

        if (context.property === 'left' && isValueMapping(context.container)) {
            const step = context.container.$container.$container;
            const inputSchema = stepInputSchema(step);

            if (inputSchema) {
                return this.createScopeForNodes(inputSchema.fields);
            } else {
                return EMPTY_SCOPE;
            }
        }

        if (context.property === 'right' && isValueMapping(context.container)) {
            const step = context.container.$container.$container;
            const serviceChain = step.$container;
            const previousStep = serviceChain.steps.at(step.$containerIndex! - 1)!;
            const outputSchema = stepOutputSchema(previousStep);

            if (outputSchema) {
                return this.createScopeForNodes(outputSchema.fields);
            } else {
                return EMPTY_SCOPE;
            }
        }

        return super.getScope(context);
    }
}

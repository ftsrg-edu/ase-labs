import { BaseStep, isFinalStep, isFirstStep, Schema } from "../../gen/language/generated/ast.js";

export function stepInputSchema(step: BaseStep): Schema | undefined {
    if (isFirstStep(step)) {
        return undefined;
    }

    return step.target.ref?.input.ref;
}

export function stepOutputSchema(step: BaseStep): Schema | undefined {
    if (isFinalStep(step)) {
        return undefined;
    }

    return step.target.ref?.output.ref;
}

import { DefaultScopeProvider, ReferenceInfo, Scope } from "langium";

export class DataSpaceScopeProvider extends DefaultScopeProvider {

    override getScope(context: ReferenceInfo): Scope {
        // TODO: implement custom scope logic here

        return super.getScope(context);
    }
}

import { nanoid } from 'nanoid';

export abstract class BaseServiceChain {

    abstract execute(): Promise<void>;

    readonly pseudonymizeMap = new Map<string, string>()

    pseudonymize(str: string): string {
        if (this.pseudonymizeMap.has(str)) {
            return this.pseudonymizeMap.get(str)!;
        }

        const pseudo = nanoid();
        this.pseudonymizeMap.set(str, pseudo);
        return pseudo;
    }

}

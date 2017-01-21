import { Eval } from './interface';
import { FALSE } from './atom';
import Environment from './environment';


export class Func implements Eval {

    fn: (env: Environment, args: Eval[]) => Eval;
    data: Eval; // TODO
    hint: string;


    constructor(fn: (env: Environment, args: Eval[]) => Eval, hint?: string) {
        this.fn = fn;
        this.hint = hint;
    }

    eval(env: Environment, args: Eval[]): Eval {
        return this.fn(env, args);
    }

    // TODO check!
    equals(rhs) {
        return false;
    }

    // TODO interface
    toString(): string {
        return `<built-in function ${this.fn}`;
    }

}

import { Eval } from './interface';
import { FALSE } from './atom';
import Environment from './environment';


export class Func implements Eval {

    fn: (env: Environment, args: Eval[]) => Eval;
    data: Eval; // TODO
    hint: string;


    constructor(fn: (env: Environment, args: Eval[]) => Eval, hint: string) {
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
        return `<built-in function ${this.hint}`;
    }

}

export class Lambda implements Eval {

    data: Eval; // TODO
    names;
    body;

    constructor(names, body) {
        this.names = names;
        this.body = body;
    }

    pushBindings(containingEnv: Environment, values): void {
        containingEnv.push();

        this.setBindings(containingEnv, values);
    }

    setBindings(containingEnv: Environment, values): void {
        for (let i=0; i<values.length; i++) {
            // containingEnv. TODO
        }
    }

    eval(env: Environment, args: Eval[]): Eval {
        // TODO implement
        return null;
    }

    equals(rhs) {
        return false; // TODO
    }

    toString(): string {
        return "<lambda ?>"; // TODO unique
    }
}

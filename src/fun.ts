import { Eval } from './interface';
import { FALSE } from './atom';
import { List } from './seq';
import Environment from './environment';
import { Litsp } from './litsp';


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
    names: List;
    body: List[];

    constructor(names: List, body: List[]) {
        this.names = names;
        this.body = body;
    }

    pushBindings(containingEnv: Litsp, values): void {
        containingEnv.push();

        this.setBindings(containingEnv, values);
    }

    setBindings(containingEnv: Litsp, values): void {
        for (let i=0; i<values.length; i++) {
            containingEnv.environment.binds[this.names.data[i].data] = 
                values[i].eval(containingEnv.environment);
        }
    }

    eval(env: Environment, args: Eval[]): Eval {
        if (args.length != this.names.length()) {
            throw new Error(`Wrong number of arguments, expected ${this.names.length()}, got ${args.length}`);
        }

        const LITSP: Litsp = env.get("__litsp__");

        this.pushBindings(LITSP, args);

        let ret: Eval = FALSE;

        for (let form of this.body) {
            ret = form.eval(LITSP.environment);
        }

        LITSP.pop();
        return ret;
    }

    equals(rhs) {
        return false; // TODO
    }

    toString(): string {
        return "<lambda ?>"; // TODO unique
    }
}

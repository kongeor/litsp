import {Eval, Egal} from './interface';
import Environment from './environment';

abstract class Atom implements Eval, Egal {

    data;

    constructor(data) {
        this.data = data;
    }

    abstract eval(env: Environment, args): Eval;

    equals(rhs) : boolean {
        if (rhs instanceof Atom) {
            return this.data === rhs.data;
        }
        return false;
    }

    toString(): string {
        return this.data;
    }

}

export class Symb extends Atom {

    constructor(sym : string) {
        super(sym);
    }

    eval(env: Environment, args): Eval {
        return env.get(this.data);
    }

}

export const TRUE = new Symb("t");
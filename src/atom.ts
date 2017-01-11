import { Eval, Egal } from './interface';
import Environment from './environment';
import { List, ISeq } from './seq';

export abstract class Atom<T> implements Eval, Egal {

    data: T;

    constructor(data: T) {
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
        return this.data.toString();
    }

}

export class Symb extends Atom<string> {

    constructor(sym : string) {
        super(sym);
    }

    eval(env: Environment, args): Eval {
        return env.get(this.data);
    }

}

export const TRUE = new Symb("t");

export const FALSE = new List();

export class String extends Atom<string> implements ISeq<String> {

    constructor(data = "") {
        super(data);
    }

    eval(env: Environment, args = []): Eval {
        return this;
    }

    car(): Symb {
        return new Symb(this.data.slice(0, 1));
    }

    cdr(): String {
        return new String(this.data.slice(1));
    }

    cons(e: String): String {
        return new String(e.data + this.data);
    }
}
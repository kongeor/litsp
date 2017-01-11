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

export class Str extends Atom<string> implements ISeq<Str> {

    constructor(data = "") {
        super(data);
    }

    eval(env: Environment, args = []): Eval {
        return this;
    }

    car(): Symb {
        return new Symb(this.data.slice(0, 1));
    }

    cdr(): Str {
        return new Str(this.data.slice(1));
    }

    cons(e: Str): Str {
        return new Str(e.data + this.data);
    }
}
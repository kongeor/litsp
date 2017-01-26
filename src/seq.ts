import { Atom, TRUE, FALSE } from './atom';
import { Eval, Egal } from './interface';
import Environment from './environment';

export interface ISeq<T> extends Eval { //yey!
    car:() => Eval; 
    cdr:() => ISeq<T>;
    cons: (e: T) => ISeq<T>;
    length: () => Number;
}

export abstract class Seq implements Eval, Egal, ISeq<Eval> {
    data: Eval[];

    constructor(data:Eval[] = []) {
        this.data = data;
    }

    car(): Eval {
        return this.data[0];
    }

    abstract cdr(): Seq;

    abstract cons(e): Seq;

    abstract eval(env: Environment, args: Eval[]): Eval;

    abstract length(): Number;

    equals(rhs) : boolean {
        if (rhs instanceof Seq) {
            if (this.data.length == rhs.data.length) {
                for (let i=0; i<this.data.length; i++) {
                    if (!this.data[i].equals(rhs.data[i])) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }
}

export class List extends Seq {

    constructor(data = []) {
        super(data);
    }

    cdr() {
        return new List(this.data.slice(1));
    }

    cons(e) {
        return new List([e, ...this.data]);
    }

    eval(env: Environment, args: Eval[] = []): Eval {
        let form = this.car().eval(env);

        return form.eval(env, this.cdr().data);
    }

    length(): Number {
        return this.data.length;
    }

    toString(): string {
        if (this.data.length === 0) {
            return "()";
        } else {
            let ret = "(" + this.data[0];
            for (let i=1; i<this.data.length; i++) {
                ret += " " + this.data[i];
            }
            return ret + ")";
        }
    }

}
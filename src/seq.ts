import {Eval, Egal} from './interface';
import Environment from './environment';

export abstract class Seq implements Eval, Egal {
    data: any[];

    constructor(data = []) {
        this.data = data;
    }

    car () {
        return this.data[0];
    }

    abstract cdr();

    abstract cons(e);

    abstract eval(env: Environment, args): Eval;

    equals(rhs) : boolean {
        if (rhs instanceof Seq) {
            if (this.data.length == rhs.data.length) {
                for (let i=0; i<this.data.length; i++) {
                    if (this.data[i] !== rhs.data[i]) {
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

    constructor(data) {
        super(data);
    }

    cdr() {
        return new List(this.data.slice(1));
    }

    cons(e) {
        let [...xs] = this.data;
        xs.push(e);
        return new List(xs);
    }

    eval(env: Environment, args): Eval {
        let form = this.car();

        return form.eval(env, this.cdr());
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
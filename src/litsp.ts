import { Lisp } from './lisp';
import { Eval } from './interface';
import { Func } from './fun';
import { Symb, FALSE } from './atom';
import { Reader } from './reader';
import Environment from './environment';

export class Litsp extends Lisp {

    environment: Environment;
    reader: Reader;

    constructor() {
        super();

        this.environment = new Environment();
        this.reader = new Reader();

        this.init();
    }

    init(): void {
        this.environment.set(new Symb("eq"), new Func(this.eq, "eq"));
        this.environment.set(new Symb("quote"), new Func(this.quote));
        this.environment.set(new Symb("car"), new Func(this.car));
        this.environment.set(new Symb("cdr"), new Func(this.cdr));
        this.environment.set(new Symb("cons"), new Func(this.cons));
        this.environment.set(new Symb("atom"), new Func(this.atom));
        this.environment.set(new Symb("cond"), new Func(this.cond));
    }

    process(source: string): Eval {
        let sexpr = this.reader.getSexp(source);
        let result: Eval = null;

        while (sexpr != null && sexpr.data) {

            try {
                result = this.eval(sexpr);
            } catch(e) {
                console.error(e);
            }

            sexpr = this.reader.getSexp();
        }

        return result;
    }

    eval(sexpr: Eval): Eval {
        try {
            return sexpr.eval(this.environment);
        } catch(e) {
            console.error(e);
            return FALSE;
        }
    }
}
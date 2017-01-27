import { TRUE, FALSE, Symb } from './atom';
import { List, ISeq, Seq } from './seq';
import Environment from './environment';
import { Eval } from './interface';

export class Lisp {
    static readonly SPECIAL = "()";

    // TODO move to Seq
    static isISeq(e): e is ISeq<any> {
        return e && (<ISeq<any>>e).cdr !== undefined;
    }

    cond(env: Environment, args: List[]): Eval {
        for (let test of args) {
            if (test.car().eval(env).equals(TRUE)) {
                return test.cdr().car().eval(env);
            }
        }
        return FALSE;
    }

    eq(env: Environment, args: Eval[]): Eval {
        if (args.length != 2) {
            throw new Error(`Wrong number of arguments, expected 2, got ${args.length}`);
        }
        if (args[0].eval(env).equals(args[1].eval(env))) {
            return TRUE;
        }
        return FALSE;
    }

    quote(env: Environment, args: Eval[]): Eval {
        if (args.length != 1) {
            throw new Error(`Wrong number of arguments, expected 1, got ${args.length}`);
        }
        return args[0];
    }

    car(env: Environment, args: Eval[]): Eval {
        if (args.length != 1) {
            throw new Error(`Wrong number of arguments, expected 1, got ${args.length}`);
        }

        let cell = args[0].eval(env);

        if (Lisp.isISeq(cell)) {
            return cell.car();
        } else {
            throw new Error(`Function car not valid on non-sequence type: ${cell}`); // TODO data not present on interface
        }
    }

    cdr(env: Environment, args: Eval[]): Eval {
        if (args.length != 1) {
            throw new Error(`Wrong number of arguments, expected 1, got ${args.length}`);
        }

        let cell = args[0].eval(env);

        if (Lisp.isISeq(cell)) {
            return cell.cdr();
        } else {
            throw new Error(`Function car not valid on non-sequence type: ${cell}`); // TODO data not present on interface
        }
    }

    cons(env: Environment, args: Eval[]): Eval {
        if (args.length != 2) {
            throw new Error(`Wrong number of arguments, expected 2, got ${args.length}`);
        }

        const first = args[0].eval(env);
        const second = args[1].eval(env);

        if (Lisp.isISeq(second)) {
            return second.cons(first);
        } else {
            throw new Error(`Function cons not valid on non-sequence type: ${second}`); // TODO data not present on interface
        }
    }

    atom(env: Environment, args: Eval[]): Eval {
        if (args.length != 1) {
            throw new Error(`Wrong number of arguments, expected 1, got ${args.length}`);
        }

        const first = args[0].eval(env);

        if (first.equals(FALSE)) {
            return TRUE;
        } else if (first instanceof Symb) {
            return TRUE;
        }
        return FALSE;
    }

    label(env: Environment, args: Eval[]): Eval {
        if (args.length != 2) {
            throw new Error(`Wrong number of arguments, expected 2, got ${args.length}`);
        }

        env.set(args[0], args[1].eval(env));
        return env.get(args[0]);
    }
}
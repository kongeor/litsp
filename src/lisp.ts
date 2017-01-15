import { TRUE, FALSE } from './atom';
import { List } from './seq';
import Environment from './environment';
import { Eval } from './interface';

export class Lisp {
    static readonly SPECIAL = "()";

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
}
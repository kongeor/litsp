import * as test from "tape";
import { Test } from "tape";
import { Symb } from "../src/atom";

declare module "tape" {
    abstract class Test {
        valEqual(a: any, b: any, msg?: string): void;
    } 
}

Test.prototype.valEqual = function(a, b, msg?) {
    this._assert(a.equals(b), {
        message: msg || a.toString() + " should be the same as " + b.toString(),
        operator: 'valEqual',
        actual: a,
        expected: b 
    })
}
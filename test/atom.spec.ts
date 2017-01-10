import * as test from "tape";
import {Symb} from '../src/atom';

test('symbols are equal based on their string values', function (t) {
    let s1 = new Symb("a");
    let s2 = new Symb("a");
    t.true(s1.equals(s2));
    t.end();
});
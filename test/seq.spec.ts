import * as test from "tape";
import * as util from "./util.spec";

import { List } from '../src/seq';
import { Symb } from '../src/atom';

const a = new Symb("a");
const b = new Symb("b");
const c = new Symb("c");
const d = new Symb("d");

const list = new List([a, b, c]);

test('list representation', function (t) {
    t.equal(list.toString(), "(a b c)");
    t.end();
});

test('list car', function (t) {
    t.true(list.car().equals(new Symb("a")));
    t.end();
});

test('list cdr', function (t) {
    t.true(list.cdr().equals(new List([b, c])));
    t.end();
});

test('list cons', function (t) {
    t.valEqual(list.cons(d), new List([d, a, b, c]));
    t.end();
});

test('car of empty', function (t) {
    t.equal(new List([]).car(), undefined);
    t.end();
});

// test('cdr of empty', function (t) {
//     t.equal(new List([]).cdr(), 1);
//     t.end();
// });
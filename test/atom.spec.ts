import * as test from "tape";
import { Symb, TRUE, FALSE, Str } from '../src/atom';
import { List } from '../src/seq';
import Environment from '../src/environment';

const env = new Environment();
const str = new Str("foo");

test('symbols are equal based on their string values', t => {
    let s1 = new Symb("a");
    let s2 = new Symb("a");
    t.true(s1.equals(s2));
    t.end();
});

test('truthy', t => {
    t.true(TRUE.equals(new Symb("t")));
    t.end();
});

test('falsy', t => {
    t.true(FALSE.equals(new List()));
    t.end();
});

test('string evalulates to itself', t => {
    t.true(str.equals(str.eval(env)));
    t.end();
});

test('string car', t => {
    t.true(new Symb("f").equals(str.car()));
    t.end();
});

test('string cdr', t => {
    t.true(new Str("oo").equals(str.cdr()));
    t.end();
});

test('string cons', t => {
    t.true(new Str("afoo").equals(str.cons(new Str("a"))));
    t.end();
});
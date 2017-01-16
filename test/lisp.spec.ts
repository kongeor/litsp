import * as test from "tape";
import * as util from "./util.spec";

import { Symb, TRUE, FALSE, Str } from '../src/atom';
import { Lisp } from '../src/lisp';
import { List } from '../src/seq';
import Environment from '../src/environment';

let env;
const str1 = new Str("foo");
const str2 = new Str("bar");

const s1 = new Symb("s1");
const s2 = new Symb("s2");
const s3 = new Symb("s3");

const lisp = new Lisp();

test('cond test', t => {
    env = new Environment();
    env.set(s1, FALSE);
    env.set(s2, TRUE);
    env.set(s3, str1);
    let list1 = new List([s1, s2]);
    let list2 = new List([s2, s3]);
    t.valEqual(lisp.cond(env, [list1, list2]), str1);
    t.end();
});

test('quote test', t => {
    t.valEqual(s1, s1);
    t.end();
});

test('car test', t => {
    env = new Environment();
    let list1 = new List([str1]);
    env.set(s1, list1);
    t.valEqual(lisp.car(env, [s1]), str1);
    t.end();
});

test('car test', t => {
    env = new Environment();
    let list = new List([str2]);
    env.set(s1, str1);
    env.set(s2, list);
    t.valEqual(lisp.cons(env, [s1, s2]), new List([str1, str2]));
    t.end();
});

test('atom test for FALSE Symb', t => {
    env = new Environment();
    env.set(s1, FALSE);
    t.valEqual(lisp.atom(env, [s1]), TRUE);
    t.end();
});

test('atom test for empty list', t => {
    env = new Environment();
    let list = new List();
    env.set(s1, list);
    t.valEqual(lisp.atom(env, [s1]), TRUE);
    t.end();
});

test('atom test for list with one element', t => {
    const env2 = new Environment();
    let list = new List([str1, str2]);
    env2.set(s1, list);
    t.valEqual(lisp.atom(env2, [s1]), FALSE);
    t.end();
});
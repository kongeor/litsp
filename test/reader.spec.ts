import * as test from "tape";
import { Reader } from '../src/reader';
import { List } from '../src/seq';
import { Num } from '../src/number';
import { Str, Symb } from '../src/atom';

const reader = new Reader();

test('reading expr', function (t) {
    let s = "(a b c)";
    t.equals(reader.getSexp(s).toString(), "(a b c)");
    t.end();
});

test('reading nested expr', function (t) {
    let s = "(a b (c d e))";
    t.equals(reader.getSexp(s).toString(), "(a b (c d e))");
    t.end();
});

test('reading expr - types', function (t) {
    let s = "(a \"b\" 3)";
    t.true(new List([new Symb("a"),
                     new Str("b"),
                     new Num(3)]).equals(reader.getSexp(s)));
    t.end();
});
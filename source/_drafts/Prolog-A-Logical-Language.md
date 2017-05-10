---
title: Prolog A Logical Language
tags:
---

## Prolog

Prolog is a logic based language. It is widely used in AI field. This language is based on **Knowledge** or **rule** user defined. And for its total different context and usage, it would be a little bit difficult at first if ones came from other programming languages like *C++/Java, Python*. Prolog is well-suited for specific tasks that benefit from rule-based *logical queries* such as searching databases, *voice control systems*, and *filling templates*.

## A super hot language
Prolog is a relatively new stuff for me. I was first introduced by my professor from CS6373 NYU. Prolog is more used in Europe than United States. Many researchers use it than in industry. I use [SWI-Prolog](http://www.swi-prolog.org/), a comprehensive free Prolog environment for writing Prolog. After you install **SWI-Prolog**, remember run it from install path or set it as bash environment. And in the following, there are a few examples to demostrate how Prolog works. 

<pre>
<code class="prolog">
% Knowledge Base 1 - save a seprerated file
woman(mia).
woman(jody).
woman(yolanda).
playsAirGuitar(jody).
rainy.

</code></pre>

And you can see in each line, ending with a period **.** , it means a rule is defined here. Here is what amazing in Prolog, in the REPL Prolog, **Prolog only will tell you a rule is `true` or `false`**. Once you load *Knowledge Base 1* in Prolog, please view following example, you will get a brief idea what Prolog does.

<pre>
<code class="prolog">
?- woman(mia).
true
?- woman(ma).
false
?- rainy.
true

</code></pre>

### Defined rule with multiple rules

You can defined Prolog like this:
<pre><code class="prolog">
rainy.
weather(today) :- rainy.

</code></pre>

When I asked `?- weather(today)`, it will refer to the rule `rainy.` and find the rule existed. So return `true`. Want so more complex example? You can also do this:

<pre><code class="prolog">
female(rose).
male(jack).
love(rose, jack) :-
	female(rose),
	male(jack).

</code></pre>

I defined `female(rose)` and `male(jack)`, and a `love` rule to check it they are Rose and Jack, and also one is male, the other is female (with no offense here :) ). And the comma `,` here means logical **and**. Also, the semicolon `;` is the Prolog symbol for **or**.

All definitions in Prolog is **lower-case letter**. If you use **upper-case letter**, you are defining variable, it will refer to the rule you already defined:
<pre><code class="prolog">
?- love(X, Y).
X= rose.
Y= jack.
</code></pre>




*Reference*

* [SWI-Prolog](http://www.swi-prolog.org/)
* [Learn Prolog Now](http://lpn.swi-prolog.org/lpnpage.php?pageid=top)
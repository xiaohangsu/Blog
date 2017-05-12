---
title: Prolog A Logical Language
date: 2017-05-12 15:50:55
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

### Arithmetic in Prolog

Arithmetic examples	Prolog Notation

* 6 + 2 = 8	   `8  is  6+2.`
* 6 ∗ 2 = 12	  `12  is  6*2.`
* 6 − 2 = 4  	   `4  is  6-2.`
* 6 − 8 = − 2	  `-2  is  6-8.`
* 6 ÷ 2 = 3	   `3  is  6/2.`
* 7 ÷ 2 = 3	   `3  is  7/2.`
* mod operation -> `1 is mod(7, 2).`

Comparing with Integers

* x < y	`X  <  Y.`
* x ≤ y	`X  =<  Y.`
* x = y	`X  =:=  Y.`
* x ⁄= y	`X  =\=  Y.`
* x ≥ y	`X  >=  Y.`
* x > y	`X  >  Y.`

### Recursion
Still recursion is based on Prolog rules. A useful and good example is Fibonacci.
 
<pre><code class="prolog">
fibonacci(0,0).
fibonacci(1,1).
fibonacci(N, F) :-
    N > 0,
    N1 is N - 1,
    N2 is N - 2,
    fibonacci(N1, F1),
    fibonacci(N2, F2),
    F is F1 + F2.
</code></pre>

For every `,` in third rule,those are multiple commas meaning multiple logic **AND**. This you can whether a number is fibonacci sequence or calculate a fibonacci sequence.

<pre><code class="prolog">
?- fibonacci(1,1).
true.
?- fibonacci(2,1).
true.
?- fibonacci(3,X).
X=2.
</code></pre>


*Reference*

* [SWI-Prolog](http://www.swi-prolog.org/)
* [Learn Prolog Now](http://lpn.swi-prolog.org/lpnpage.php?pageid=top)
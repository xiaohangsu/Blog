---
title: Programming Language I
tags: ProgrammingLanguage
date: 2017-04-03 16:46:39
---

Mostly from **&lt;Concept of Programming Language>** and CS6373 in NYU

```
First, think of question: how Programming Languages get compiled or interpreted?
```
Well, codes and lines they all are strings. Once you get there, you would notice the first thing it needs to do parse those strings. But before we discussed more about programming languages, can you remind some words of a functional languages? If you bumped into some words like: syntax, grammar, senmantics, word etc, you got there.

> Syntax: the form or structure of the expressions, statements, and program units.
> 
> Semantics: the meaning of the expressions,statements and program units.

Syntax and semantics provide a language' s definition.

> Sentence: is a string of characters over some alphabet
> 
> language: is a set of sentences
> 
> Lexeme: lowest level syntactic unit of a language
> 
> Token: a category of lexemes

Once we have those definations, let's get into programming languages.

## BNF
[BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form), also noted as Backus-Naur form or Backus normal form is a notation technique for [context-free grammars](https://en.wikipedia.org/wiki/Context-free_grammar). If you do not know what is context-free grammars is, take five minutes and click the hyperlink above. Then we look at what BNF notation like:
<pre><code>
&lt;program> = &lt;stmts>  &lt;stmts> = &lt;stmt> | &lt;stmt> ; &lt;stmts>   &lt;stmt> = &lt;var> = &lt;expr>    &lt;var> = a | b | c | d   &lt;expr> = &lt;term> + &lt;term> | &lt;term> - &lt;term>   &lt;term> = &lt;var> | const
</code></pre>

It is notation of derivation. It start with a start symbol(**&lt;program>** in here) to derive till it cannot derive anymore, and all those possible combinations form a language. Each combination is a sentence. And those lexeme with angle bracket called **nonterminal**. Other without bracket are called **terminal**. It is pretty easy to understand because lexeme with angle bracket can still derive but others can not.

There is an important concept: A **leftmost derivation** is one in which the leftmost nonterminal in each sentential form is the one that is expanded. So a **rightmost derivation** means nonterminal is on right hand side. A derivation can be neither leftmost or rightmost derivation, that is **terminal** or other **nonterminal**.

> For **leftmost derivation** and **rightmost derivation**, either do we prefer because it depends on how lexical analysis do and the implementation in compiler.

## Parse Tree

When we have BNF, we can use parse tree to demostrate a hierarchical structure.

<pre><code>
			&lt;program>
				| 
			 &lt;stmts>
			 	|
			 &lt;stmt>
			/   |   \
		&lt;var>   =   &lt;expr>
		  |         /     \
		  a      &lt;term> + &lt;term>
		  		 |		 |
		  	   &lt;var>     const
		  		   |
		  		   b
			 
</code></pre>

A grammar is ambiguous if and only if it generates a sentential form that has two or more distinct parse trees. If we use the parse tree to indicate precedence levels of the operators, we cannot have ambiguity.

*Reference*

*	**&lt;Concept of Programming Language>** CS6373
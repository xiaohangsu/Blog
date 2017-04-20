---
title: Programming Language II
tags: ProgrammingLanguage
date: 2017-04-19 21:21:34
---

Last time we talk about **BNF** and **Parse Tree**. This time let's talk about Chapter 4 Lexical and Syntax Analysis.

A lexical analyzer is essential a pattern matcher. The lexcial analyzer is trying to find all lexeme in a given string, and lexical analyzer serves as a front end of a syntax analyzer. So lexical analysis is a part of syntax analysis. Here is an example from text book:

<pre><code>
	result = oldsum - value / 100;
</code></pre>

```
Tokens			Lexemes
IDENT			result
ASSIGN_OP		=
IDENT			oldsum
SUB_OP			-
IDENT			value
DIV_OP			/
INT_LIT			100
SEMICOLON		;
```
**Lexemes** are these logical groupings, and **tokens** are these internal codes for categories name groupings.

What lexical analyzer do is extracting those lexemes and mapping them into tokens. And lexical analyzer can examine the syntax error report to users.

There are three approachs to building a lexical lexical analyzer:

1.	Write a formal description of the tokens and use a software tool that constructs a table-driven lexical analyzer from such a description.
2. Design a state diagram that describes the tokens and write a program that implements the state diagram.
3. Design a state diagram that describes the tokens and hand-construct a table-driven implementation of the state diagram.

A state transition diagram, or just **state diagram**, is a directed graph. State diagrams of the form used for lexical analyzers are representaions of a class mathematical machines called **finite automata**. If one decides to have a transition from every state on every character from the source language, it would end up with a very large diagram.

No matter which ways lexical analyzer is implemented, it always do two things: find all syntax errors, and create parse trees. And there are two categories of parsers using different strategies: `Top Down` (associated with `leftmost derivation`), and `Bottom Up`(asscoicated with `rightmost derivation`).

Text book give an example using state diagram and with four utility functions: ```getChar```, ```addChar```, ```nextChar```, ```lookup``` to create lexical analyzer in C. Using Flex can also create a lexcial analyzer with regular expression in a much easier way.

### [FLEX](https://github.com/westes/flex)

> Flex is the fast lexical analyzer generator. Flex is a tool for generating scanners: programs which recognize lexical patterns in text.

Althogh using Flex is not a useful skill, but it do help you to understand how lexical analyzer work. The basic usage is compile .lex file into lex.yy.c, and comile lex.yy.c to a.out. Start a.out it would create a REPL to read and give you lexeme it captured.
<p align="center">
  <img src='http://alumni.cs.ucr.edu/~lgao/teaching/Img/flex.jpg'/>
</p>

> It is possible for Flex using C++

<pre><code>
/*Sample Scanner:
 * Description: Count the number of characters and the number of lines
 *              from standard input
 * Usage: (1) $ flex sample2.lex
 *        (2) $ gcc lex.yy.c -lfl
 *        (3) $ ./a.out
 *            stdin> whatever you like
 *        stdin> Ctrl-D
 */

    int num_lines = 0, num_chars = 0;

%%
\n  ++num_lines; ++num_chars;
.   ++num_chars;
%%

main()
{
  yylex();
  printf("# of lines = %d, # of chars = %d\n", num_lines, num_chars);
}
</code></pre>

The code is separated into three part. The first part can pre-define variables and functions before `%%`. The second part between two `%%` is capturing lexeme part. In this part each regular expression start from beginning and try to match in string. Once it got matched, it would start from next position and start over matching process. On the right side you can define expression when it get matched. Using `{}` code block can do multiple expressions in every match. The third part is main function part. `yylex()` can start the scaner process, `num_lines` and `num_chars` would be changed in this example code.

An another more sophisticated example, a front end calculator:

<pre><code class='cpp'>
#include &lt;iostream>
#include &lt;stdio.h>
#include &lt;string>
#include &lt;vector>
using namespace std;

%}

		vector&lt;string> opCons;
		bool isValid;

ID				[A-Za-z_][A-Za-z_0-9]*
INT				-?[1-9][0-9]*
OP				[-+*/^=]
LP				[(]
RP				[)]
SEMI			;
FUNCTION		{ID}[ ]*{LP}[ ]*{ID}[ ]*{RP}
FUNCTION_INVOKED	{ID}[ ]*{LP}[ ]*{INT}[ ]*{RP}
%%
{ID} {cout &lt;&lt; "&lt;ID>";}
{LP} {cout &lt;&lt; "&lt;LP>";}
{RP} {cout &lt;&lt; "&lt;RP>";}
{SEMI} {cout &lt;&lt; "&lt;SEMI>";}
{INT} {cout &lt;&lt; "&lt;INT>";}
{OP} {cout &lt;&lt; "&lt;OP>";}

\n {cout &lt;&lt; "&lt;LP>";}

%%

int main()
{
	yylex();
	return 0;
}
</code></pre>

Sample Output:

<p align="center">
  <img src='https://lh3.googleusercontent.com/0KdcuiY3guPiALHFNYLIGH_87xYgtKWcNdCR3SdVkyYeqhAk3VdcLbPjhTwk05_7ngXNRbGSbuR8FDE=w2902-h1610-rw'/>
</p>


*Reference*

* [Flex Github](https://github.com/westes/flex)
* [Flex Docs](http://dinosaur.compilertools.net/flex/manpage.html)
* [Flex Tutorial](http://alumni.cs.ucr.edu/~lgao/teaching/flex.html)
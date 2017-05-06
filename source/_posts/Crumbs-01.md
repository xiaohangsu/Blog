---
title: Crumbs 01
date: 2017-05-06 15:06:23
tags:
---
### JSON hijacking

From [Hacker News](https://news.ycombinator.com/)

[Why does Google prepend while(1);to their JSON responses?](http://stackoverflow.com/questions/2669690/why-does-google-prepend-while1-to-their-json-responses)

The accepted answer mentions a very interesting topic [JSON hijacking](http://haacked.com/archive/2009/06/25/json-hijacking.aspx/).

### Programming Language

#### Referential Transpancy

Functional side effects: when a function changes a two-way parameter or a non-local variable.

And **Referential Transparency** is parameter or non-local variable does not change via function invoked, which means it has not functional side effects.

#### Short Circuit Evaluation

<pre><code class="cpp">
	// if a > b and b++ would not excute
	if (a > b || (b++))

	// it would be useful like:
	// ptr is a pointer
	// evaluate ptr is not NULL first and get ptr value later
	if (ptr != NULL && ptr->value == 0)

	// And other like 
	// can optimize by complier to do short circuit evaluation
	int b = (a * 0) / (21 - 1 * 53 + 12);

</code></pre>

### RAII

From C++, it is a programming idiom : Resource Acquisition Is Initialization.

*reference*

* [CPP Reference](http://en.cppreference.com/w/cpp/language/raii)
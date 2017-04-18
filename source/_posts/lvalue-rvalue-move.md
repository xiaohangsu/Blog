---
title: lvalue rvalue & move
date: 2017-04-08 23:55:55
tags: C++
---
std::move is a new function from C++ 11.
### lvalue & rvalue
For any C++ expression, either it is an lvalue or an rvalue. From MSDN:
>  An lvalue refers to an object that persists beyond a single expression. You can think of an lvalue as an object that has a name. All variables, including nonmodifiable (const) variables, are lvalues.
> 
> An rvalue is a temporary value that does not persist beyond the expression that uses it.

I think this is a great explanation in many versions from different websites.

<pre>
  <code class='cpp'>
  int a = 42; // a lvalue | 42 rvalue
  int b = 43; // b lvalue | 43 rvalue

  // a and b are both l-values:
  a = b; // ok
  b = a; // ok
  a = a * b; // ok | a, b lvalue, a * b rvalue

  // a * b is an rvalue:
  int c = a * b; // ok, rvalue on right hand side of assignment
  a * b = 42; // error, rvalue on left hand side of assignment
  </code>
</pre>

#### rvalue reference
If **X** is a type, then **X&&** is called an rvalue reference. What rvalue reference is different is that:

* Compiler compile time would be different because pre-know(you can also think of pre-define) variable as an rvalue, instead guessing it whether it is an lvalue or an rvalue.

### std::move
*Defined in header* **#&lt;utility>**

**std::move** as it indicated, it tries to move an object to an other object in rvalue reference way. **std::move** is a function moving a object reference to an other, like shifting object ownership.

Let's look at an example from [cpp reference](http://en.cppreference.com/w/cpp/utility/move).

<pre>
  <code class='cpp'>
#include &lt;iostream>
#include &lt;utility>
#include &lt;vector>
#include &lt;string>
 
int main()
{
    std::string str = "Hello";
    std::vector&lt;std::string> v;
 
    // uses the push_back(const T&) overload, which means 
    // we'll incur the cost of copying str
    v.push_back(str);
    std::cout << "After copy, str is \"" << str << "\"\n";
 
    // uses the rvalue reference push_back(T&&) overload, 
    // which means no strings will be copied; instead, the contents
    // of str will be moved into the vector.  This is less
    // expensive, but also means str might now be empty.
    v.push_back(std::move(str));
    std::cout << "After move, str is \"" << str << "\"\n";
 
    std::cout << "The contents of the vector are \"" << v[0]
                                         << "\", \"" << v[1] << "\"\n";
}
  </code>
</pre>

 **push_back()** invoked twice. First **push_back** created a new string to push into vector, while the second one shift ownership and no string will be copied. When we try to 'move' a complex object with lots of members functions and datas, simply using std::move could make assignment efficient.
 
 Using **std::move()** can solve Perfect Forwarding.
 
#### Perfect Forwarding

There is a good [section](http://thbecker.net/articles/rvalue_references/section_07.html) discussing perfect forwarding.

In this section, it mentions the benefits over reference and cont reference.

* multiple arguments - need to provide all combinations of reference and const reference, while rvalue reference only need one implementation.
* block move semantics - if parameters passing is an lvalue

What make rvalue reference working in both rvalue and lvalue is collapsing rule. For example,  function ```void assign(T&&)```, when argument is lvalue, it would be ```assign(T&)```, and ```assign(T&&)``` when argument is rvalue.
 
 XS

*Reference*

* [c++ Reference](http://en.cppreference.com/w/cpp/language/value_category)
* [MSDN](https://msdn.microsoft.com/en-us/library/f90831hc.aspx)
* [C++ Rvalue References Explained](http://en.cppreference.com/w/cpp/utility/move)
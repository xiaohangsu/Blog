---
title: C++ Smart Pointer
date: 2018-01-10 17:37:54
tags:
---

In modern C++ programming, smart pointers are used to help ensure that programs are free of memory and resource leaks and are exception-safe.

Smart pointers are defined in the *std* namespace in [&lt;memory&gt;](http://www.cplusplus.com/reference/memory/) header file. Thet are crucial to the RAII - *Resource Acquisition Is Initialization* programming idiom. The goal of RAII is ensure that resource acquisition occurs at the same time that the object is initialized.

Let's take a look of an example of C++ raw pointer and smart pointer.

<pre><code class="c++">
Something* rawpointer = new Something("RAII");
// rawpointer do somethings
delete rawpointer;

unique_ptr<Something> smartpointer(new Something("RAII"));
// Smart pointer do somethings

return; // after return or out of scope smartpointer would be delete automatically
</code></pre>

The smart pointer is a class template that you declare on the stack, and initialize by using a raw pointer to a heap-allocated object. Smart pointer destructor is invoked when the smart pointer goes out of scope, **Even if an exception is thrown somewhere further up the stack.**

So mircle cure is smart pointer allocates on stack instead of heap. This makes sure that it would call destructor when return.

> Important: Always create smart pointers on a separate line of code, never in a parameter list, so that a subtle resource leak won't occur due to certain parameter list allocation rules.

This is actually <Effective C++> Rule 17 - Store newed objects in smart pointers in standalone statements. An example like:

<pre><code class="c++">
int priority();
void processWidget(std::shared_ptr<Widget> pw, int priority);

processWidget(std::shared_ptr<Widget>(new Widget()), priority());
</code></pre>
 
 Before processWidget there are three things it need to execute:
 
* priority() function
* new Widget()
* execute std::shared_ptr
 
C++ complier has different execution with Java and C#, the execution is not defined. **priority()** can be the first, second or third to execute. If proirty() executes in second place:
 
* new Widget()
* priority() function
* execute std::shared_ptr
 
If priority() execution failed, new Widget would return the pointer but it did not set in smart pointer, so it would be a potential  resource leak.

### Smart Pointer Type - MSDN Doc

* **unique_ptr** - allows exactly one owner of the underlying pointer. Can be moved to a new owner, it cannot be copied or shared. Replaces *auto_ptr*, which is deprecated.Compare to boost::scoped_ptr. unique_ptr is small and efficient; the size is one pointer and it supports rvalue references for fast insertion and retrieval from STL collections.
* **shared_ptr** - Reference-counted smart pointer. Use when you want to assign one raw pointer to multiple owners, for example, when you return a copy of a pointer from a container but want to keep the original. The raw pointer is not deleted until all shared_ptr owners have gone out of scope or have otherwise given up ownership. The size is two pointers; one for the object and one for the shared control block that contains the reference count. 
* **weak_ptr** - Special-case smart pointer for use in conjunction with shared_ptr. A weak_ptr provides access to an object that is owned by one or more shared_ptr instances, but does not participate in reference counting. Use when you want to observe an object, but do not require it to remain alive. Required in some cases to break circular references between shared_ptr instances.


### Primitive Implementation

For a generic smart pointer using template:

<pre><code class="c++">
template &lt;typename T> class SmartPointer {
private:
	T* dataPointer; // pointer stored data
public:
	SmartPointer(T* value) : dataPointer(value) {}
	~SmartPointer() {
		delete dataPointer;
	}
	T& operator* () {
		return *dataPointer;
	}
	
	T* operator->() {
		return dataPointer;
	}
}
</code></pre>

It is primitive implemention of smart pointer. The trick in here is *delete inner pointer* in destructor. If we try to implement others like unique_ptr or shared_ptr, implementations are different. *unique_ptr* is singleton pattern and *shared_ptr* used reference counting ([**shared_ptr** implementation]()).

unique_ptr:

* Disable copy constructor and assignment operator, or make sure pointer do not copy a new one.
* singleton pattern and make use of *static*.

shared_ptr:

* using pointer for an allocated "Reference" object.


#### Reference

* [MSDN Smart Pointers (Modern C++)](https://msdn.microsoft.com/en-us/library/hh279674.aspx)
* &lt;Effective C++>
* https://www.codeproject.com/Articles/15351/Implementing-a-simple-smart-pointer-in-c
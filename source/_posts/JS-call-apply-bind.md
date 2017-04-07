---
title: JS call apply & bind
date: 2017-04-07 16:10:21
tags: Javascript
---
In Javascript, Function is an object. In JS function, there some way to create and return an object like:

```
let Animal = (type)=> {
	this.type = type;
	this.method = ()=>{
		console.log(this.type)
	};
	return this;
}

let animal = new Animal();
```

**this** in here is context. It is pretty similar to C++ or Java Context in Class.

And using bind(), apply() and call() can affect context in JS object, writing more Object Oriented syntax to support OOP in an old way (before ES6).

### call & apply
From MDN:
> The call() method calls a function with a given this value and arguments provided individually.
> 
> The apply() method calls a function with a given this value and arguments provided as an array (or an array-like object).

First, let's look at call(). We can use call() to chain constructor for an object.

```
let Dog = ()=>{
	Animal.call(this, 'dog');
	return this;
}

let Cat = ()=>{
	Animal.call(this, 'cat');
	return this;
}

let dog = Dog();
let cat = Cat();
dog.method(); // 'dog'
cat.method(); // 'cat'
```

Using Animal.call give Dog context as context in Animal constructor. This usage is really similar to Java or C++ obeject inheritance. By using this you can support class inheritance and polymorphism by passing context to this.

Another example from MDN using anonymous function can give a better view:

```
var animals = [
  { species: 'Lion', name: 'King' },
  { species: 'Whale', name: 'Fail' }
];

for (var i = 0; i < animals.length; i++) {
  (function(i) {
    this.print = function() {
      console.log('#' + i + ' ' + this.species
                  + ': ' + this.name);
    }
    this.print();
  }).call(animals[i], i);
}
```
Here example shows an anonymous function is passing its context to the animals array, so each animals array elements can have the print method.

But sometimes we might invoke a function without setting context but passing a context outside to it. Below example is a great demo:

```
let sayType = ()=> {
	console.log(this.type);
}

sayType.call(dog); // 'dog'
```

apply is very similar to call(), There are only different from supporting arguments. For call is **call(thisArg, arg1, arg2...)**. For apply is **apply(thisArg, [arg1...argn])**.

*Reference*

* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

### bind
The bind() function is to create a new bound function(BF), to warp the original function object and return it for assignment(*from ECMAScript2015*). Bound function BF is actually an **exotic function object** (a term from ESMAScript2015).

First example is showing the context changing by using bind():

```
this.x = 9;    // this refers to global "window" object here in the browser
var module = {
  x: 81,
  getX: function() { return this.x; }
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX();   
// returns 9 - The function gets invoked at the global scope

// Create a new function with 'this' bound to module
// New programmers might confuse the
// global var x with module's property x
var boundGetX = retrieveX.bind(module);
boundGetX(); // 81
```
**retrieveX** context is in global but **boundGetX** context is changed to module context.

The next example is more practical as I often encounter during my coding experience:

```
function LateBloomer() {
  this.petalCount = Math.ceil(Math.random() * 12) + 1;
}

// Declare bloom after a delay of 1 second
LateBloomer.prototype.bloom = function() {
  window.setTimeout(this.declare.bind(this), 1000);
};

LateBloomer.prototype.declare = function() {
  console.log('I am a beautiful flower with ' +
    this.petalCount + ' petals!');
};

var flower = new LateBloomer();
flower.bloom();  
// after 1 second, triggers the 'declare' method
```
By default within window.setTimeout(), the this keyword will be set to the window (or global) object. But this later *this* **LateBloomer.prototype.bloom = function() {
  window.setTimeout(this.declare.bind(this), 1000);
};** is actually passing as lateBloomer context and keeping this context and trigger it after 1 second.

*Reference*

* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
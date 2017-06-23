---
title: React Native
date: 2017-06-23 18:05:53
tags:
---

## React Native

It is kind of tricky to talk about [React Native](https://facebook.github.io/react-native/), because I even did not use React before. But still Web Frameworks have commons. It would not take anyone, with experiences in MVVM, too much time to learn. React is a great Javascript Library focus on view and separate data flow. But React Native make it further because with Javascript and React you could build native App in Android and IOS.

> Learn once, write anywhere: Build mobile apps with React
> 
> A framework for building native apps using React

There is a saying that "Any application that can be written in JavaScript, will eventually be written in JavaScript."[Twitter](https://twitter.com/codinghorror/status/274654233855401984) [Blog Link](https://blog.codinghorror.com/the-principle-of-least-power/). It is serious. I mean at least many people and I believe that. Because there are so many people using Javascript, so Javascript Community is developing faster and faster every year. React Native is a great extention for JS. I mean it reachs out native App.

<pre>
<code class="JS">import React, { Component } from 'react';
import { AppRegistry, Text } from 'react-native';

export default class HelloWorldApp extends Component {
  render() {
    return (
      	&lt;Text>Hello world!&lt;/Text>
    );
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('HelloWorldApp', () => HelloWorldApp);
</code></pre>

From the Hello World Code at React-Native Tutorial, there are webpack and JSX involved. If you are not familiar with Webpack and JSX, probably look at those docs first. React is a library using states to manage all views.

## React Native Packages
> Thanks webpack and NPM

React Native is very easy to create a component for React Native. There are tons of React Native Components on Github and NPM. Some of them are pretty good. React and React Native are having a sub-community from web and more and more people are going to embrace it. Some useful packages like UI packages and Navigator, Routing or components with complex logic, developer can just grape it and bundle them together.

At the first two weeks internship in IDT, Josh and I implement a **custom DatePicker** for Month and Year only for credit card expiration date. We even get a way to hack into Android to beautify Picker Layout.

## State Management

> Mobx or Redux?

State is an important concept in React( Native). For state management packages, there are two popular options Mobx and Redux. [This article](https://www.robinwieruch.de/redux-mobx-confusion/) discussed a lot about Mobx and Redux.

## Props

> State for view, Props for data.

Before this internship in IDT, I do not figure how to use **Props** properly. Even back in the time I used **Vue**, I always get a lot of chances to see Props things in documentation. **Props** you can view as *Properties*. Props get polulate from parent to children.

## Style and FlexBox
> Flexbox from CSS3

It is not surprise that React Native borrow Flex Box concept from CSS3. It is a more advanced and recent definition in CSS3.

## Native Modules
> Native Modules can handle things React Native can not do.

Native Modules for both IOS and Android are actually extending the abilities of React Native. Native Modules give interfaces that can hook into Android and IOS native system. I do use native modules creating Android Widget for IDT Boss Money App. Maybe next time I would write another article to talk about how do somethings beyond React Native.

*Reference*

* [JSX](http://buildwithreact.com/tutorial/jsx)
* [Webpack 3.0 released](https://webpack.js.org/)
* [React-Native](https://facebook.github.io/react-native/docs/getting-started.html)
* [CSS Trick FlexBox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
---
title: Android Widget on React Native
date: 2017-07-13 21:44:33
tags:
---


> Before what we do, we only got our own.

If you go for Internet, there is not a perfect solution for Android Widget on React Native project. When I said Android Widget, I mean [App Widget](https://developer.android.com/guide/topics/appwidgets/index.html). It is really nothings useful on Internet so far at that time I do (roughly mid June in 2017). You can check out here for Android Widget in React Native [update](https://react-native.canny.io/feature-requests/p/android-home-screen-widget). But there is still a way to do so, that is writing Native Code in Android. It might be a problem for a development team to have limited time and resource to explore on this, because it also requires developers have a well knowledge in Android Developement and Java. For that time I was a Software Engineer Intern in Boss Revolution Money, and I had experience in Android Development and Java. Besides, what else can I lose? :)

#### Prerequisites

Create Widget is easy once you find the way. Use [Android Studio](https://developer.android.com/studio/index.html) to open `Android` folder, and then right click `app` folder to **New** -> **Widget** -> **App Widget**.

You should get a good sense in Java JDK and Java Doc, and then you would probably very comfortable with Android Documentation.

> Four keys in Android Development:
> **Activity**
> **Intent**
> **Service**
> **Broadcast** (reciever provider)

For Android Widget, you should know at least **Intent** and **Broadcast**. They compound the whole widget. App Widget extends from class [*AppWidgetProvider*](https://developer.android.com/reference/android/appwidget/AppWidgetProvider.html). *onReceive* and *onUpdate* are two life-cycle methods.

*onRecieve* will recieve every intents and process it, logic in there should check for Intent and go for different process.
*onUpdate* will call when widget init, get invoked or reach **android:updatePeriodMillis** in widget info xml(Default 86400000).

### Interface

> It is important for RN support creating a Bridge between Native Code and React-Native Code.

That is [Native Modules](https://facebook.github.io/react-native/docs/native-modules-android.html). It is very important when App want to do somethings beyond React Native side, you need to do in Native side. There is a good example on [React Native site](https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module). From this example, the bridge class should extend *ReactContextBaseJavaModule* and for those methods we need to export, we need to annotate with `@ReactMethod`, and remember to register it in `MainApplication.java`. So you have a bridge class that can actually invoked exported method in React-Native(JS)!
<pre><code class="java"> // Java - Android Side
public class WidgetBridge extends ReactContextBaseJavaModule {
    @ReactMethod
    public void announceChange() {
        ...
    }
}
</code></pre>

<pre><code class="js"> // Javascript - React Native Side
'use strict';
import { NativeModules } from 'react-native';
NativeModules.RateWidget.announceChange();
</code></pre>

Below there are types matching from Java to JS.
<pre><code class="java">Boolean -> Bool
Integer -> Number
Double -> Number
Float -> Number
String -> String
Callback -> function
ReadableMap -> Object
ReadableArray -> Array</code></pre>

### Communication
The question left behind is how React Native communicate with Android Widget. We use [**SharedPreference**](https://developer.android.com/reference/android/content/SharedPreferences.html) to save data and serve as data storage, since App and Widget are in different runtime and WidgetBridge Object would not exist when App closed. **SharedPreference** is saving in Key-Value, used in IO-densed operation but small size data transfer, if Widget need other, there are still other [options](https://developer.android.com/training/basics/data-storage/index.html).

So using SharedPreference in WidgetBridge, data got persisted and can be reused in App Widget, which is communication between App and Widget in some senses.

> Caveat: Using callback to pass data from Android to Javascript.

### Finally

Boss Money Widget
![alt widget](http://xiaohangsu.xyz/android-widget-on-react-native-1.png)

We use *SharedPreference* as data channel and WidgetBridge to serve as interface between App and Widget.
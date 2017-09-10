---
title: Appium - UI Testing
date: 2017-09-10 17:18:00
tags:
---

UI testing is a thing teams want to have but hate to write. People would be thinking like: "How great I have all those UI Automation Testing before released", but meanwhile, they do not like writing UI Testing. At first, I have the same feelings about UI Automation Testing: "Those are wasting my time", "UI testing is tedious", "My times are more valuable than creating test cases". I admin there are some tedious, boring work when you created UI testing cases. But when you tried to make test cases lively using automation and engineering experiences to make the workflow better, you would find out the value hidden deeply in UI Testing.

Starting from [AWS device farms](https://docs.aws.amazon.com/devicefarm/latest/developerguide/welcome.html), we can see there are many UI testing framework we can use. **Calabash** is written in Ruby, but unfortunately [Calabash is no longer under active development](https://developer.xamarin.com/guides/testcloud/calabash/introduction-to-calabash/#Overview). Somethings like **UI Automator** in Android and **UI Automation** in iOS are native offical-supported testing frameworks. But things is you need to learn two frameworks in a same time. In here I used [**Appium**](http://appium.io/) for UI Testing to test Boss Money App during my IDT Internship.

Appium is an open source, cross-platform test automation tool for native, hybrid and mobile web and desktop apps, tested on simulators (iOS), emulators (Android), and real devices (iOS, Android, Windows, Mac). But since our app is written in React-Native, which should be able to use Appium test on iOS and Android.

### [Appium (Appium-server)](https://github.com/appium/appium)

Appium here means Appium-server. Start Appium simply:

<pre><code>$: appium </code></pre>

It would run appium-server and listen for specific port, waiting http/https requests in coming. Behind server there are many Appium-Drivers (Appium-Android-Driver, Appium-iOS-Driver, Appium-xcuitest-Driver, etc,.) wait for invoked. And also Appium are capable more than in mobile app sides. It has webDriver, appium-mac-driver and appium-window-driver can support web app and deskop app testing.

Appium uses WebDriver protocol so that it can be much flexable in creating languages. Ideally you can create test cases with any WebDriver-compatible language. But in most cases, developers need those [Client Library](http://appium.io/downloads.html) to boost efficiency.


### [Appium-Doctor](https://github.com/appium/appium-doctor)

This is not UI testing thing, but Appium-Doctor actually can diagnose and fix common Node, iOS and Android configuration issues before starting Appium. In most cases developers really need it because there are many dependencies.

### [Appium-Desktop](https://github.com/appium/appium-desktop)
Appium-Desktop is came from Appium-GUI, which already deprecated. You can view Appium-Desktop as Appium-Server + Appium-GUI. It allows you create test cases in a very dummy but handy way: by actually click elements in a monitor screen! All you need to do is to record each actions and it would take records and then generate a script based on selection(in which kind of client language).

![image](https://github.com/appium/appium-desktop/raw/master/docs/images/screen-inspector.png)

### [Appium-Python-Client](https://github.com/appium/python-client)
Appium-Python-Client is also under appium github account. Although this repo is inactive, but all interfaces we needs is already there. I would like to show some examples in next blog and show my **Test Parser** and [**Component Testing**](https://www.google.com/search?newwindow=1&q=Component+Testing&spell=1&sa=X&ved=0ahUKEwjd7JrE3pvWAhWj14MKHYRWCJ8QvwUIJCgA&biw=1680&bih=926) concept.
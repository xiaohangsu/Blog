---
title: IOS Today Extension on React Native
date: 2017-07-31 21:35:12
tags:
---


There is a way to build IOS Today Extension using React Native Layout. [This blog](https://medium.com/@davidskaarup/add-ios-today-widget-to-your-react-native-app-ed9c9b601cc) demostrates how to create and set IOS Today Extension in React Native side. The benefits are building on React Native, teams can still use the same skills and developers to do so, leaving the code base in IOS would quite "intact". It has good side on maintenance.

However, we team failed on this. It might be *RN version*, *misconfiguration* or other reasons remained unknown. For our team rescpective, we did want to keep IOS Today Extension as much as possible. Because that would be the easiest way to maintain (All members got exp. in RN). But since we cannot follow this blog, we would do it in Native way.

Swift and Objective-C are both optional in IOS Development, although we go for Objective-C, but I think one day we would change those Extension codes in Swift. Swift is a much high-level language close to Javascript (Most Popular Language Now :) ). And it would boost the speed you developed. For Objective C it is most closed to *C++ / C#* And it might be one day that Apple decided not to supported The following part of this acticle I would follow the same organization on [&lt;Android Widget on React Native>](http://xiaohangsu.xyz/2017/07/13/Android-Widget-on-React-Native/).

#### Prerequisites

Create a IOS Today Extension follows **File -> New -> Target -> Today Extension**.

We still need [Native Modules](https://facebook.github.io/react-native/docs/native-modules-ios.html) on IOS to build the "bridge".
<pre><code class="objectivec">// CalendarManager.h

#import &lt;React/RCTBridgeModule.h>

@interface CalendarManager : NSObject &lt;RCTBridgeModule>
@end</code></pre>

<pre><code class="objectivec">#import "CalendarManager.h"
#import &lt;React/RCTLog.h>

@implementation CalendarManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}</code></pre>
These codes are from React-Native Native Modules.

So it made IOS Extension communicates with App possible. You did need to care of Objective C syntax. The App to Widget data "channel", just use **userDefaults**, but you do need set App Group to do so.

> Caveat: **userDefault** need [*App Group*](https://developer.apple.com/library/content/documentation/General/Conceptual/ExtensibilityPG/ExtensionScenarios.html) setup.

For UI design, you need to gain a knowledge in storybroad. Keyword is [**contraint**](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/AnatomyofaConstraint.html#//apple_ref/doc/uid/TP40010853-CH9-SW1). With Contraints you can do responsible views, which is pretty important in UI.



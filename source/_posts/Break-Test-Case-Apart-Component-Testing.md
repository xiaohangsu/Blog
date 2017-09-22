---
title: Break Test Case Apart - Component Testing
date: 2017-09-22 00:24:29
tags:
---
Last blog I talked about the test parser I wrote in IDT Internship. This time I would like to finish what I left: **Break Test Case Apart**, it is a concept very similar to component testing.

### Break Test Case Apart
Imagine you already created a lot of test cases now. But I would 100% percent sure that you got some repeated code (If using test parser concept I mentions at last blog, then your test case might be some kind of data format etc,.) in each test case.

<img src="http://xiaohangsu.xyz/res/Blog/ui_testing5.png"></img>
Taking a UI testing as example, above I show two test cases I created for UI testing. One is preform sendMoney in GuestMode page, the other one is to test register and get into Home page. At first glance they are different. But
that is not true.

<img src="http://xiaohangsu.xyz/res/Blog/ui_testing6.png"></img>
Here I divide those test cases into smaller test cases: `SendMoney in GuestMode` can be divided into `GotoGuestHome` and then `SendMoney`. And `Register and get into HomePage` can be divided into `GotoRigisterOrLogin` and then `GotoHomePage`. Sequence matters here because you cannot perform `sendMoney` before get into `GuestHome` or `Login`. Since those two test cases were JSON format, so I easily divided two test cases into four test components.

#### Benefit of doing it
<img src="http://xiaohangsu.xyz/res/Blog/ui_testing7.png"></img>
You probably would ask what is the benefits of it? Image above shows three test cases, one extra test case than previous. But the tricky thing is I **do not create an extra test case** but **permuting those four test components** to create a new test case!

So now you see tricks going on here. Separate and divide test cases and then you can build up a 'test case' using those test components! I think 'test flow' is much closer to what we created. Actually **Component Testing** is pretty much of it, but  is a method where testing of each component in an application is done separately. After then we are more flexable and powerful than ever. Since we have all those test components, we can permute more 'test flows'.

Taking those four components as example: at first we only have two test cases. But now we ideally can have up to (4, 1) + (4,2) + (4, 3) + (4, 4) = 4 + 4 * 3 + 4 * 3 * 2 + 4 * 3 * 2 = 64 'test flows'! Of cause that would not happen because some test component depend on some pre-conditions. But I am showing a brilliant idea I found when I was working on UI testing.

### Last Word
Some people say they hate UI testing, DB maintaining or other tedious work. A good engineer should always think things in auto-way: that is using tools or resources not only to get things done but also do it elegantly.
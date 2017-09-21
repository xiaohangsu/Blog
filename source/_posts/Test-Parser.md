---
title: Test Parser
date: 2017-09-16 18:27:19
tags:
---
At my last blog, I talked about Appium. This time, let's talk about how to create a test case and make writing test cases much more easily. And I would like to cover those codes I wrote related to UI testing during IDT Internship.

### Start from a simple test case
Let's start with creating a simple test case.

But first we need to set desired Capabilities for Appium 

##### Android
<pre><code class="python"># Android environment
import unittest
from appium import webdriver

desired_caps = {}
desired_caps['platformName'] = 'Android'
desired_caps['platformVersion'] = '4.2'
desired_caps['deviceName'] = 'Android Emulator'
desired_caps['app'] = PATH('../../../apps/selendroid-test-app.apk')

self.driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)
</code></pre>

##### iOS

<pre><code class="python"># iOS environment
import unittest
from appium import webdriver

desired_caps = {}
desired_caps['platformName'] = 'iOS'
desired_caps['platformVersion'] = '7.1'
desired_caps['deviceName'] = 'iPhone Simulator'
desired_caps['app'] = PATH('../../apps/UICatalog.app.zip')

self.driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)
</code></pre>

Appium supports [UIAutomator2](https://developer.android.com/training/testing/ui-automator.html) for Android and [XCUITest](https://developer.apple.com/library/content/documentation/DeveloperTools/Conceptual/testing_with_xcode/chapters/09-ui_testing.html) for iOS. Both are the best testing libraries for native testing at this moment. More desired capabilities and settings you can view on [Appium](http://appium.io/slate/en/master/?ruby#the-default-capabilities-flag) and [Appium-Python-Client](https://github.com/appium/python-client).

After that, let's start create a test case in Android.
If we try to find an element by text_contains "click", can do:

<pre><code class="python">el = self.driver.find_element_by_android_uiautomator('new UiSelector().textContains("click")')
</code></pre>

This would find the element contains text: "click". And then we can preform like `el.click()` or `el.tap()` actions etc,.

<img src="http://xiaohangsu.xyz/res/Blog/ui_testing_code1.png" height="200px"></img>

So screenshot above is showing a test case doing Money Transfer and select country "Costa Rica CRC", and then set send money amount to 200.

Since we got those test cases, all we need to do is create as many as test cases, doing a lot of copy and paste.
But, is there anyway we can do better?
![Previous](http://xiaohangsu.xyz/res/Blog/ui_testing3.png)

### We can do better
Instead of writing a "hard-code" test case, I create a test parser to parse all those JSON files, not .py Python code files anymore. The whole workflow would be:
![Current Arch](http://xiaohangsu.xyz/res/Blog/ui_testing4.png)

> TestCase\*.py should be testcase\*.json in above image

So then, instead of writing codes like:

<img src="http://xiaohangsu.xyz/res/Blog/ui_testing_code1.png" height="200px"></img>

Now, creating a test case is as easy as:

<img src="http://xiaohangsu.xyz/res/Blog/ui_test_code2.png" height="400px"></img>

Adding a test parser in between there are at least those benefits:

1. It is more flexable to change. If Appium or Appium-Python-Client change interface, in previous architecture we need to update all Python files, in here we just need to update our test_parser.
2.	JSON Format is better for web application, JSON is way more readable and maintainable than real Python codes.
3. Teams do not need a strong tech background guy to write test case, person with limit knowledge can create a test case as well.
4. ... etc,.

Before internship ended, I already finished my test_parser and it got those features:

* 4 actions: click, swipe, send_keys set_value* 4 methods to locate elements in Android, 3 in iOS* Screen shot when json_field is set or error occurs* Short response time

With test_parser, we now can create test cases in JSON format now!

### Break test case apart
I want to cover component testing in one blog, but I was tried of writing right now, I would introduce how I break test case apart (a very simple concept but very useful) accidentally matched the concept of component testing.

## Appendix

#### Test_parser.py

<pre><code class="python">
import json
import time

from appium import webdriver
from json_field import *
from slack_module import send_file as slack_send_file

# default value for global
TIME_SLICE = 0.5


class test_parser:

    def __init__(self, json_file_name):
        # define
        with open(json_file_name) as data_file:
            self.appium_config = json.load(data_file)

        print 'Appium Config remote_url: %s' % self.appium_config[appiumConfig.REMOTE_URL]
        print 'Appium Config Desired Capabilities: %s' % self.appium_config[appiumConfig.CAPABILITIES]

        self.driver = webdriver.Remote(
            command_executor=self.appium_config[appiumConfig.REMOTE_URL],
            desired_capabilities=self.appium_config[appiumConfig.CAPABILITIES])

        self.platform = self.appium_config[appiumConfig.CAPABILITIES][desiredCapabilities.PLATFORM_NAME]
        print '\n'

    def ios_get_element(self, unit_ui_test):
        if unit_ui_test[LOCATOR] == locator.PREDICATE:
            el = self.driver.find_element_by_ios_predicate(unit_ui_test[CONDITION])
            print 'IOS Predicate: %s - Found Element using condition in current screen'\
                  % unit_ui_test[CONDITION]

        elif unit_ui_test[LOCATOR] == locator.TEXTCONTAINS:
            el = self.driver.find_element_by_ios_predicate(
                'wdName contains "%s"' % unit_ui_test[TEXT])

        elif unit_ui_test[LOCATOR] == locator.ACCESSIBILITY_ID:
            el = self.driver.find_element_by_accessibility_id(unit_ui_test[ACCESSIBILITY_ID])
            print 'Acessibility_ID: %s - Found Element using condition in current screen'\
                  % unit_ui_test[ACCESSIBILITY_ID]

        elif unit_ui_test[LOCATOR] == locator.XPATH:
            el = self.driver.find_element_by_xpath(unit_ui_test[XPATH])
            print
        else:
            raise 'Condition: %s - No Matched Located Element Methods' % unit_ui_test[LOCATOR]
        return el

    def android_get_element(self, unit_ui_test):
        if unit_ui_test[LOCATOR] == locator.TEXTCONTAINS:
            el = self.driver.find_element_by_android_uiautomator(
                'new UiSelector().textContains("%s").instance(0)' % unit_ui_test[TEXT])
            print 'Android UiSelector Text Contains: %s - Found Element using textContains() in current screen'\
                  % unit_ui_test[TEXT]

        elif unit_ui_test[LOCATOR] == 'text_equal':
            el = self.driver.find_element_by_android_uiautomator(
                'new UiSelector().text("%s").instance(0)' % unit_ui_test[TEXT]
            )
            print 'Android UiSelector Text Equal: %s - Found Element using text() in current screen' \
                  % unit_ui_test[TEXT]

        elif unit_ui_test[LOCATOR] == locator.ACCESSIBILITY_ID:
            el = self.driver.find_element_by_accessibility_id(unit_ui_test[ACCESSIBILITY_ID])
            print 'Acessibility_ID: %s - Found Element using condition in current screen'\
                  % unit_ui_test[ACCESSIBILITY_ID]

        elif unit_ui_test[LOCATOR] == locator.XPATH:
            el = self.driver.find_element_by_xpath(unit_ui_test[XPATH])
            print 'Android XPath: %s - Found Element using xpath in current screen'\
                  % unit_ui_test[XPATH]

        elif unit_ui_test[LOCATOR] == locator.CLASSNAME:
            el = self.driver.find_element_by_class_name(unit_ui_test[CLASSNAME])
            print 'Android Classname: %s - Found Element using classname in current screen' \
                  % unit_ui_test[CLASSNAME]

        else:
            raise 'Locator: %s - No Matched Located Element Methods' % unit_ui_test[LOCATOR]
        return el

    def get_element(self, unit_ui_test):
        if self.platform == desiredCapabilities.IOS:
            return self.ios_get_element(unit_ui_test)

        elif self.platform == desiredCapabilities.ANDROID:
            return self.android_get_element(unit_ui_test)

        else:
            raise 'Desired Capabilities <PlatformName> invalided or not supported: %s' \
                % self.platform

    def run_action(self, unit_ui_test):
        if unit_ui_test[ACTION] == action.CLICK:
            self.get_element(unit_ui_test).click()

        elif unit_ui_test[ACTION] == action.SEND_KEYS:
            self.get_element(unit_ui_test).send_keys(unit_ui_test[VALUE])

        elif unit_ui_test[ACTION] == action.SET_VALUE:
            self.get_element(unit_ui_test).set_value(unit_ui_test[VALUE])

        elif unit_ui_test[ACTION] == action.SWIPE:
            self.driver.swipe(unit_ui_test[FROM][0], unit_ui_test[FROM][1],
                              unit_ui_test[TO][0], unit_ui_test[TO][1])

        else:
            raise Exception('Error: No Matched Action')

    @staticmethod
    def sleep(sleep_time=TIME_SLICE):
        # sleep
        if sleep_time <= 0:
            print 'Skip Sleep'
            pass
        else:
            print 'Sleep: %f sec%s(Default)' % (sleep_time,
                                         's' if sleep_time > 1 else '')
            time.sleep(sleep_time)

    @staticmethod
    def log(unit_ui_test):
        print 'UITest Name: %s' % (unit_ui_test[NAME] if NAME in unit_ui_test else '[not set]')
        print 'Action: %s' % unit_ui_test[ACTION]
        if VALUE in unit_ui_test:
            print 'Value: %s' % unit_ui_test[VALUE]
        if unit_ui_test[ACTION] == action.SWIPE:
            print 'Swipe from %s to %s' % (unit_ui_test[FROM], unit_ui_test[TO])

    def retry(self, unit_ui_test):
        i = 0
        retry_time = 0
        time_out = unit_ui_test[TIME_OUT] if TIME_OUT in unit_ui_test else 10
        max_retry_time = int(time_out / TIME_SLICE)

        exception = {}  # save exception from retry

        while i != max_retry_time:
            try:
                if i == 0:
                    self.log(unit_ui_test)

                if self.platform == desiredCapabilities.IOS or self.platform == desiredCapabilities.ANDROID:
                    self.run_action(unit_ui_test)
                else:
                    print 'Desired Capabilities <PlatformName> invalided or not supported: %s' \
                      % self.platform

                # hide keyboard option
                if HIDE_KEYBOARD in unit_ui_test and unit_ui_test[HIDE_KEYBOARD]:
                    self.driver.hide_keyboard()

                # screen_shot option
                if SCREEN_SHOT in unit_ui_test and unit_ui_test[SCREEN_SHOT]:
                    print 'Taking screen shot in current page'
                    self.driver.save_screenshot(unit_ui_test[SCREEN_SHOT])
                    slack_send_file(unit_ui_test[SCREEN_SHOT],
                                    unit_ui_test[NAME])
                # According JSON setting, Reset App
                if RESET in unit_ui_test:
                    print 'Reset'
                    if unit_ui_test[RESET]:
                        self.driver.reset()

                if SLEEP in unit_ui_test:
                    self.sleep(unit_ui_test[SLEEP])
                else:
                    self.sleep()

                print '----------------------------\n'
                break
            except Exception as e:
                if retry_time <= max_retry_time:
                    print 'Error: %s - Retrying: %d time' % (e, retry_time + 1)
                    retry_time = retry_time + 1
                    i = i + 1
                    self.sleep(TIME_SLICE)
                if retry_time == max_retry_time:
                    exception = e

        if retry_time >= max_retry_time:
            if OPTIONAL in unit_ui_test and unit_ui_test[OPTIONAL]:
                return
            else:
                raise Exception('TIME_OUT:%s retry %d in %f sec' %
                                (exception, retry_time, retry_time * TIME_SLICE))

    def run(self, json_file):
        # read the test case
        with open(json_file) as data_file:
            test_case = json.load(data_file)

        # wait for app to load
        sleep_time = test_case[SLEEP] if SLEEP in test_case else 2
        print 'sleep %ds wait for app to load\n' % sleep_time
        time.sleep(sleep_time)
        step = 0

        print 'Test case name: %s\n' % test_case[NAME] if NAME in test_case else '[no set]'

        ui_test_len = len(test_case[TEST_WORK_FLOW])
        print 'Total Step: %d' % ui_test_len
        print '\n'

        for unit_ui_test in test_case[TEST_WORK_FLOW]:
            step = step + 1
            try:
                self.retry(unit_ui_test)
            except Exception as e:
                print "Exception: %s" % e
                file_name = 'err_stop_at_%d.png'\
                            % step
                print "File Name: %s" % file_name

                self.driver.save_screenshot(file_name)
                slack_send_file(file_name,
                                "%s in step %d" % (json_file, step), e)
                break

        if SCREEN_SHOT in test_case:
            self.driver.save_screenshot(test_case[SCREEN_SHOT])
            slack_send_file(test_case[SCREEN_SHOT], 'Test Case Finished')

        if EXIT_APP in test_case and test_case[EXIT_APP]:
            self.driver.quit()
</code></pre>
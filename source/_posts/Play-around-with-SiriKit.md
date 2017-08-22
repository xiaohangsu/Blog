---
title: Play around with SiriKit
tags: Internship
date: 2017-08-22 15:12:00
---


## Background
During my internship in IDT working on Boss Money App, I also do an experiment: create an [SiriKit](https://developer.apple.com/documentation/sirikit) Extension. I spent four days and ended up with small demo doing P2P money transfer. It is not in the app right now because we dropped it due to some business reasons. But it is definitely worth it to talk about SiriKit Development.

## Start
> SiriKit supported SDKs
> 
> iOS 10.0+
> 
> macOS 10.12+
> 
> watchOS 3.2+

You can start with reading [Requesting Authorization to Use SiriKit](https://developer.apple.com/documentation/sirikit/requesting_authorization_to_use_sirikit) and [Creating an Intents App Extension](https://developer.apple.com/documentation/sirikit/creating_an_intents_app_extension) using Xcode.

Once you create an **Intents Extension**, there would be an example in it. The example implemented a domain [Messaging](https://developer.apple.com/documentation/sirikit/messaging). There are three supported intents: *INSendMessageIntent, INSearchForMessagesIntent, INSetMessageAttributeIntent*. Each intents have their example phrases, handling,

#### Example Phrases
[Here](https://developer.apple.com/documentation/sirikit/insendpaymentintent) is a example phrase of  INSendPaymentIntent. Every time when we call out Siri and using app Intent Extension, user need to match example phrases.

For example, said 'Pay with &lt;AppName>', Siri would know user would what to create an *INSendPaymentIntent* with Boss Money to send Money. It would check if there is an implementation of INSendPaymentIntent (also need to register in info.plist). And then Siri will ask for two DETAILS: [**payee**](https://developer.apple.com/documentation/sirikit/insendpaymentintent/1639374-payee) and [**currenyAmount**](https://developer.apple.com/documentation/sirikit/insendpaymentintent/1638381-currencyAmount). Another data type [note](https://developer.apple.com/documentation/sirikit/insendpaymentintent/1639091-note) would not be asked because it is not required in INSendPaymentIntent.

But if someone said 'Pay &lt;payee> &lt;currencyAmount> with &lt;AppName> for &lt;note>', then probably would not to ask user more details because all are included in a single sentence.

[This](https://developer.apple.com/documentation/sirikit/registering_custom_vocabulary_with_sirikit) allows developers to create their own Vocabulary in SiriKit, but for now you can not create a new intent, so all parse workflow would be the same as Built-In Intent. You can hook into one of intent and modify phrase, just keep in mind there is still the limitation.

#### Handling

`(id)handlerForIntent:(INIntent *)intent` is base method to catch all incoming intent. No need for changing this or implement unless developers want to do somethings globally for all kinds of intents.

Still taking [* INSendPaymentIntentHandling*](https://developer.apple.com/documentation/sirikit/insendpaymentintenthandling) as an example.

Methods like `resolvePayee(intent: INSendPaymentIntent, with completion: @escaping(INSendPaymentPayeeResolutionResult) -> Void)`, `resolveCurrencyAmount(intent: INSendPaymentIntent, with completion: @escaping (INSendPaymentCurrencyAmountResolutionResult) -> Void)` and `resolveNote(intent: INSendPaymentIntent, with completion: @escaping (INStringResolutionResult) -> Void)` would resolve all the incoming details and they always invoke in sequence. In *INSendPaymentIntent*, the sequence is resolvePayee -> resolveCurrencyAmount -> resolveNote(*implicit invoked*).

And for resolved result, there is a `INResolutionResult *resolutionResult`, result should be added into resolutionResult for following process. Ususally there are three kinds of result: **Success**, **Fail(Unsupported)** and **Confirm**. When we using confirm, SiriKit would ask user to confirm details.

So, what I do in resolve method is: verify recipients in resolve `resolvePayee`, make sure user did not try to transfer too large and too small amount of dollars using `resolveCurrencyAmount`, and all results should be confirm one more time.

After all resolve methods went through, the final 'BOSS' is `confirm(intent: INSendPaymentIntent, completion: @escaping (INSendPaymentIntentResponse) -> Void)`. INSendPayment would be the final version of INSendPayment, and some http/https request should be sent in here to backend and display success or not.

That is a general SiriKit Intent Workflow.
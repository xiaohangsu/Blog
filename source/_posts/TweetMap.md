---
title: TweetMap
date: 2017-03-30 19:25:31
tags: Web
---

Finally, Tweet Map. (Google Map Api + Tweet Public Streaming Api + Elasticsearch)
<p align="center">
  <img src='https://xiaohangsu.files.wordpress.com/2017/03/screen-shot-2017-03-12-at-6-52-01-pm.png?w=1476'/>
</p>

Click [here to Play](http://104.194.82.160:8081/) | [Github-](https://github.com/xiaohangsu/TweetMap)

## Tech Stack:

* Vue | ES6

* Nodejs | Koa | webpack

* AWS | EC2 | Elasticsearch Service | Elastic Beanstalk |  S3
* Twitter Data Streaming

This part contains Twitter Streaming API, Oauth-1.0-a, Nodejs Stream, and Http Streaming.

## Public Streaming API
<pre><code class='http'>
https://stream.twitter.com/1.1/statuses/filter.json?locations=-180.0,-90.0,180.0,90.0
</code></pre>

Using filter post request can get response with specific requirements. For Tweet Map, each JSON coordinates field should contain geo location. USing location get params will filter for us.

### Oauth-1.0a
[Oauth-1.0a](https://oauth.net/core/1.0a/) was used for authentication, I previously met this at WeChat Pay. Oauth all infos set in header Authorization. And signature used for checking data integrity and unchanged.

There some times streaming data getting cut by Twitter Server, basically it means response body is getting too large, and some Tweet data might cut right into two response: the one already received and next response. So backend server need to deal with it. What Tweet map does, it judge whether this response body is a valid JSON, if yes, saves it in Elasticsearch, otherwise, wait for next response and construct two response body into a whole valid JSON list.

## Nodejs Stream

[Nodejs Stream](https://nodejs.org/api/stream.html) - [Request](https://github.com/request/request) need stream object to deal with HTTP Live Streaming. Inside Tweet map, I implement an [TweetStream](https://github.com/xiaohangsu/TweetMap/blob/master/data/tweetsStream.js) object, TweetStream.tweetStream is a stream.Writable object, and any Nodejs Stream object much implement _write method.

### Reconnection

It is also important design how to reconnect. Once twitter Streaming got disconnected under different circumstances, Tweet Map need to know how to reconnect and provide the most comfortable User Experience.

What Tweet Map does, is for each polling ajax request for data, backend check if there still is connected and TweetQueue has new Tweets, if not, create a new Connection for streaming.

### Rate Limit
This is an problem haunting me for a while. I finally came up with a way to solve this.

Unlike reconnection or Rate Limit in common sense, Rate Limit here actually is limitation for Users to get unlimited tweets data (If so, there twitter will not get any benefits form it :)). So basically what TweetMap do is when request reached the limitation, the whole system would restart to start getting tweets with a new request.

## Back End

For backend, I used [**promise**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for each API to avoid callback hell.

### Koa

Koa was so impressive for its lightweight and free-customized feature. And there it totally support new **ES6** feature and the most advanced designs in Nodejs and Javascript.

The generator function and async function with await is new to me, I am glad to learn this all.

## Front End

Vue, those new Progressive Javascript Framework, em...

### Google Map

Google Map is some powerful, and with my optimization with [GoogleMapCluster](https://github.com/googlemaps/js-marker-clusterer), it is possible having ten thousands of marker on it, and still with good performance!

<p align="center">
  <img src='https://xiaohangsu.files.wordpress.com/2017/03/screen-shot-2017-03-12-at-6-52-01-pm.png?w=1476'/>
</p>

Optimization is a topic for all digging deep. I used to create each infoWindows for each tweets, but it will drop performance for having so many infoWindows at a map, even you already had those markers : ). Some lazy load might be a good choice. When user click the marker, an ajax send and generate the infoWindows.

<p align="center">
  <img src='https://xiaohangsu.files.wordpress.com/2017/03/screen-shot-2017-03-12-at-6-55-01-pm.png'/>
</p>

Compress JSON can reduce pressure for browser and server.

For more optimization, I try to use event delegation, I try to delegate event for markers, but still it seems there are not event delegation in Google Map. I think Google should consider implement it in the future.

Beautiful layouts for Google Map too:

<p align="center">
  <img src='https://xiaohangsu.files.wordpress.com/2017/03/screen-shot-2017-03-12-at-7-02-14-pm.png'/>
</p>


### ES6

Both Front End and Back End are using ES6 standard and OO Programing.

### Vue

Comparing to another **AngularJS**, these Framework share a lot of commons. **Data binding, component, method injection** and etc,. Vue is much smaller in size with AngularJS and React. And Vue says they are faster than React. I never use React, but at this project I learned Vue, I believe those three should have lots in common.

### Webpack

As these time, no anyone using webpack know those **AMD/CMD/CommonJS** standard anymore. Developers or programmer can still write code well with Webpack and would not mess up JS code any where. By the way, webpack-dev-server is a good tool for front-end **live-reload**.

## Elasticsearch

Searching engine? No....
I had been a long time believed Elasticsearch is some things like searching engine. Well, no. It is actually more like MongoDB stuff (there is a post with [MongoDB vs Elasticsearch](http://blog.quarkslab.com/mongodb-vs-elasticsearch-the-quest-of-the-holy-performances.html)), for saving data and querying. But Elasticsearch has its pros, distributed, more powerful on query.

### GeoSearch

For [GeoSearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-queries.html), Elasticsearch need a mapping for map those coordinates into geoJSON, and it can calculate geo feature for us.

## Finally

I feel so sweet and satisfied that I can learn so much by doing Tweet Map, when I was still working as web Dev at Mar, 2016, I used gulp, Angular 1.0 and backend only used express and Flaskr. From this time, I finally understand front-end modularize, ES6 OOP, promise and all up-to-date industry stuffs. I refresh my web-dev skill set.

XS
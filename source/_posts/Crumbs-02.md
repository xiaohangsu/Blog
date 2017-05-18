---
title: Crumbs 02
date: 2017-05-18 20:32:36
tags:
---


### Extern Links:

* [AI playbook](http://aiplaybook.a16z.com/docs/intro/getting-started)
* [Web Developer Security Checklist](https://gist.github.com/pedro-c/b70744b2f369480511555970f7b670e8)


### &lt;HTTP: the Definitive Guide> Note
#### Chapter 2
URL Format:
&lt;scheme>://&lt;user>:	&lt;password>@&lt;host>:&lt;port>/&lt;path>;&lt;params>?&lt;query>#&lt;frag>

Example: http://www.joes-hardware.com:80/index.html

Scheme: http; host: www.joes-hardware.com; port: 80; path: /index.html.

Example: ftp://anonymous:my_passwd@ftp.prep.ai.mit.edu/pub/gnu;type=d

##### fragment
For example, **http://www.joes-hardware.com/tool.html#drills**.

**&#35;drills** is a fragment (or archor) in html page.

URL is not perfect. It means resource location, not the resource itself. If the location changed, URL also would change. So Internet Engineering Task Force (or IETF) introduced uniform resource name (or URN). URN refer to resource 's stable name.

#### Chapter 3
##### Method
* **GET**: ask server for resource.
* **HEAD**: return only header, not content.
* **PUT**: Opposite to GET, put document into server.
* **POST**: send form data to server.
* **TRACE**: Client send a TRACE request, the request pass through firewalls, proxies, and gateways or other applications. It keeps informations of all entities it on the way to server and back to client.
* **OPTIONS**: return accepted methods.
* **DELETE**: delete documents or resources on server.
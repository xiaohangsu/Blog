---
title: JSON Validate Elegantly
date: 2017-04-08 22:10:46
tags: Javascript
---

There was problem when I was writing Back End in [MovieHub](https://github.com/xiaohangsu/movieHub). For missing JSON field, Sequelize.query() will throw error outside Promise. It caused me cannot catch the error in router.

```
router.post('/db/addMovie', async (ctx, next)=> {
    console.log('/db/addMovie Request ', JSON.stringify(ctx.request.body));
    ctx.body = await movie.addMovie(ctx.request.body).then((instance, meta)=> {
        console.log('/db/addMovie POST | Success: ', JSON.stringify(instance[0]));
        return {
            status: 200,
            message: 'Success'
        };
    }).catch(function (err) {
        console.log('/db/addMovie POST | Error: ', err.message);
        return {
            status: 400,
            error: err.message
        }
    });
});
```
movie.addMovie receives post data. And Movie is ORM.

```
addMovie(json) {
    return this.conn.query('INSERT INTO Movies '
        + '(movid, movname, movyear, genre, director, description, movTrailerUrl, movScreenshotUrl) '
        + 'VALUES (:movid, :movname, :movyear, :genre, :director, :description, :movTrailerUrl, :movScreenshotUrl)',
        {replacements: json});
}
```
Cannot catch missing JSON error because Error throws outsides Promise.


For each request sended from Front End, there is a rule making Front End getting response as detailed as possible for request error. For example, it a request was sent, trying to register a new user in system, you should return detailed message for Front End. Some of situation might be:

* Success
* Internal Error
* Failed
	* same username in system
	* same email in system
	* lack of some fields

Here I would discuss how to validate JSON elegantly if some fields are missing.

### Catch Validation Error

Catch validation error in stead of validate fields one by one. Of cause you can write a Tool Class to validate your JSON fields one by one. But it would make your code inefficient and unnecessary.

```
function validate(json, array) {
	for (field in array) {
		if (json[field] === undefined) return field;
	}
	return false;
}

// Then you need to have each ORM method change like this:
addMovie(json) {
	let noMissField = validate(json, ['movid', 'movname',
		'movyear', 'genre', 'director', 'description',
		'movTrailerUrl', 'movScreenshotUrl']);
	if (missField === true)
    return this.conn.query('INSERT INTO Movies '
        + '(movid, movname, movyear, genre, director, description, movTrailerUrl, movScreenshotUrl) '
        + 'VALUES (:movid, :movname, :movyear, :genre, :director, :description, :movTrailerUrl, :movScreenshotUrl)',
        {replacements: json});
    else {
    	return noMissField;
}
```

But there is a more elegant way to do so. I create a function query in [query.js](https://github.com/xiaohangsu/movieHub/blob/movie-restful/data/query.js).

```
let Promise = require('bluebird');

module.exports = (func)=>{
    return new Promise((resolve, reject)=> {
        try {
            resolve(func());
        } catch(err) {
            reject(err);
        }
    });
};
```

And all those ORM methods change into:

```
addMovie(json) {
    return query(()=>{
        return this.conn.query('INSERT INTO Movies '
            + '(movid, movname, movyear, genre, director, description, movTrailerUrl, movScreenshotUrl) '
            + 'VALUES (:movid, :movname, :movyear, :genre, :director, :description, :movTrailerUrl, :movScreenshotUrl)',
            {replacements: json});
    });
}
```

Remind ORM methods all return a promise for router layer. So using a promise as wrapper to try catch those Validation Error. It would make less code and more efficient, as once missing field error would be threw immediately.
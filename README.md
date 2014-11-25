# Ware [![Build Status](https://travis-ci.org/freaking-awesome/ware.svg)](https://travis-ci.org/freaking-awesome/ware.svg)

Your own middleware layer.

 
## Install
```
npm install freaking-awesome/ware
npm test
```


## Use
```javascript

var Ware= require('ware')

Ware



    .use(function (a, b, c, next) {
        next()
    })

    .use(function (a, b, c, next) {
        next()
    })

    .use(Ware()

        .use(function (a, b, c, next) {
            next()
        })

        .use(Ware()

            .use(function (a, b, c, next) {
                next()
            })

        )

        .use(function (a, b, c, next) {
            next()
        })

    )



    .run('a', 'b', 'c', function (err, a, b, c) {

    })



;

```

var Ware= require('..')

var noop= function () {}

describe('ware', function () {



    describe('#use', function () {

        it('should be chainable', function () {
            var ware= Ware()
            console.assert(ware.use(noop) == ware);
        })

        it('should add a middleware to #middlewares', function () {
            var ware= Ware().use(noop)
            console.assert(1 == ware.middlewares.length)
        })

        it('should accept a Ware instance', function () {
            var ware= Ware().use(Ware())
            console.assert(1 == ware.middlewares.length)
        })

    })



    describe('#run', function () {

        it('should receive an error', function (done) {
            var error= new Error()
            Ware()
                .use(function (next) {
                    next(error)
                })
                .run(function (err) {
                    console.assert(err == error)
                    done()
                })
            ;
        })

        it('should take any number of arguments', function (done) {
            Ware()
                .use(function (a, b, c, next) {
                    console.assert('a' == a)
                    console.assert('b' == b)
                    console.assert('c' == c)
                    next()
                })
                .run('a', 'b', 'c', function (err, a, b, c) {
                    console.assert(!err)
                    done()
                })
            ;
        })

        it('should jump to done on error', function (done) {
            var errors = 0;
            Ware()
                .use(function (next) {
                    next(new Error())
                })
                .use(function (next) {
                    errors++
                    next(err)
                })
                .use(function (next) {
                    errors++
                    next(err)
                })
                .run(function (err) {
                    console.assert(err)
                    console.assert(0 == errors)
                    done()
                })
            ;
        })

    })



})

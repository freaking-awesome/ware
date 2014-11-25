var tests= require('./tests/Ware')



describe('ware example', function () { it('readme', function (done) {



    //
    // Подключение...
    //

    var Ware= require('./index') // require('ware')

    // приготовления

    function WTF(name) {
        return new Error(name)
    }



    //
    // Использование...
    //

    var ware= new Ware // инстанцирование экземпляра системы



    //
    // Регистрация подпрограмм.
    //

    ware.use(function (a,b,c, next) { // регистрация подпрограммы
        console.log('Выполнение подпрограммы №1...', this.arguments)
        setTimeout(function () { // некая асинхронная операция:

            if (Math.random() < .73) { // если повезет
                next() // переход к следующей функции
            } else { // иначе
                var err= WTF('Поделил на ноль?')
                next(err) // прерывание выполнения с ошибкой
            }
            console.log('Выполнение подпрограммы №1 завершено.\n')

        }, 11) // 0.011 сек
    })

    ware.use(function (a,b,c, next) {
        console.assert(this && this.arguments && this.arguments[0] === a && this.arguments[1] === b && this.arguments[2] === c)
        this.next()
    })

    ware.use(function (a,b,c, next) {
        console.log('Выполнение подпрограммы №3...', this.arguments)
        setTimeout(function () {

            if (Math.random() < .73) {
                next()
            } else {
                var err= WTF('Поделил на ноль?')
                next(err)
            }

            console.log('Выполнение подпрограммы №3 завершено.\n')
        }, 11)
    })

    ware.use(function (a,b,c, next) {
        next()
    })

    ware.use(function (a,b,c, next) {
        console.log('Выполнение подпрограммы №5...', this.arguments)
        setTimeout(function () {

            if (Math.random() < .73) {
                next()
            } else {
                var err= WTF('Поделил на ноль?')
                next(err)
            }

            console.log('Выполнение подпрограммы №5 завершено.\n')
        }, 11)
    })



    //
    // Композиция подпрограмм.
    //

    var ware1= new Ware // инстанцирование еще одного экземпляра системы

    ware.use(ware1) // композиция систем

    ware1.use(function (a,b,c, next) {
        console.log('Выполнение подпрограммы №7...', this.arguments)
        setTimeout(function () {

            if (Math.random() < .73) {
                next()
            } else {
                var err= WTF('Поделил на ноль?')
                next(err)
            }

            console.log('Выполнение подпрограммы №7 завершено.\n')
        }, 11)
    })

    ware1.use(function (a,b,c, next) {
        next()
    })

    ware1.use(function (a,b,c, next) {
        next()
    })

    ware1.use(function (a,b,c, next) {
        next()
    })

    ware1.use(function (a,b,c, next) {
        console.log('Выполнение подпрограммы №11...', this.arguments)
        setTimeout(function () {

            if (Math.random() < .73) {
                next()
            } else {
                var err= WTF('Поделил на ноль?')
                next(err)
            }

            console.log('Выполнение подпрограммы №11 завершено.\n')
        }, 11)
    })

    var ware2= new Ware // инстанцирование еще одного экземпляра системы

    ware.use(ware2) // композиция систем

    ware2.use(function (a,b,c, next) {
        console.log('Выполнение подпрограммы №13...', this.arguments)
        setTimeout(function () {

            if (Math.random() < .73) {
                next()
            } else {
                var err= WTF('Поделил на ноль?')
                next(err)
            }

            console.log('Выполнение подпрограммы №13 завершено.\n')
        }, 11)
    })



    //
    // Выполнение подпрограмм.
    //

    ware.run(1, 2, 3, function (err, a, b, c) { // выполнение подпрограмм с указанными аргументами и последующий вызов указанной функции с ошибкой или без
        console.log('Выполнение подпрограмм завершено.', err, a, b, c)
        done()
    })


})})

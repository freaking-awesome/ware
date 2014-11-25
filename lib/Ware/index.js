/**
 * @module Ware
 * @author awsmtek.com
 *
 * Система выполнения подпрограммного обеспечения.
 *
 * @description
 *
 *     Слой для обеспечения взаимодействия между различными системами,
 *     приложениями и компонентами.
 *
 * @license Public Domain
 */
module.exports= Ware



//
// Конструктор экземпляра
//

/**
 * @name Ware
 *
 * @class Продукт (англ. Ware)
 * @description Конструктор объектов — экземпляров класса Ware.
 *
 * @constructor
 */
function Ware() {

    if (!(this instanceof Ware)) {
        return new Ware
    }

    this.middlewares= []
}



//
// Методы экземпляра (прототип)
//

/**
 * Регистрирует подпрограмму (middleware)
 *
 * @memberOf Ware
 * @method use
 *
 * @public
 * @chainable
 *
 * @this {Ware}
 * @param {Ware or Function} middleware — подпрограмма
 * @return {Ware} — возвращает себя (chainable)
 */
Ware.prototype.use= function (middleware) {
    var ware= this

    if (middleware instanceof Ware) {

        ware.middlewares.push(function () {
            middleware.run.apply(middleware, []
                .concat(this.arguments)
                .concat([
                    arguments[arguments.length-1]
                ])
            )
        })

    } else {

        ware.middlewares.push(middleware)

    }
    return ware
}

/**
 * Запускает выполнение подпрограм
 *
 * @memberOf Ware
 * @method run
 *
 * @public
 * @chainable
 *
 * @this {Ware}
 *
 * @param {Function} callback
 * @return {Ware} — возвращает себя (chainable)
 */
Ware.prototype.run= function () {
    var ware= this

    var callback= arguments[arguments.length-1]
    var context= {
        middleware: ware,
        arguments: Array.prototype.slice.call(arguments, 0, arguments.length - 1),
        next: next.bind(ware),
    }

    function done(err) {
        callback.apply(ware,
            [err].concat(context.arguments).concat([context.next])
        )
    }

    var i= 0
    function next(err) {
        if (err) {
            setImmediate(
                done.bind(context, err)
            )
        } else {
            var middleware= ware.middlewares[i++]
            if (middleware) {
                if (context.arguments.length) {
                    setImmediate(function () {
                        try {
                            middleware.apply(context, []
                                .concat(context.arguments)
                                .concat([
                                    context.next
                                ])
                            )
                        } catch (err) {
                            done.call(context, err)
                        }
                    })
                } else {
                    setImmediate(
                        middleware.bind(context, context.next)
                    )
                }
            } else {
                setImmediate(
                    done.bind(context)
                )
            }
        }
    }

    context.next()

    return ware
}

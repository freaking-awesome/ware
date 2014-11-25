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
 * @constructor
 *
 * @class Продукт (англ. Ware)
 * @description Конструктор объектов — экземпляров класса Ware.
 *
 * @param {Object|null} config — конфиг экземпляра, не используется
 */
function Ware(config) {
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
    if (middleware instanceof Ware) {

        this.middlewares.push(function () {
            middleware.run.apply(middleware, []
                .concat(this.arguments)
                .concat([
                    arguments[arguments.length-1]
                ])
            )
        })

    } else {

        this.middlewares.push(middleware)

    }
    return this
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

    var callback= arguments[arguments.length-1]
    var context= {
        middleware: this,
        arguments: Array.prototype.slice.call(arguments, 0, arguments.length - 1),
        next: next.bind(this),
    }

    function done(err) {
        callback.call(this, err)
    }

    var i= 0
    function next(err) {
        if (err) {
            setImmediate(
                done.bind(context, err)
            )
        } else {
            var middleware= this.middlewares[i++]
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
                    }.bind(this))
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

    return this
}

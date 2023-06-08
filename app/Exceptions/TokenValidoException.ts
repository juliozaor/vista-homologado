import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new TokenValidoException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class TokenValidoException extends Exception {
   public async handle(ctx: HttpContextContract) {
        ctx.response.status(401).send({
            mensaje: `Token inválido`,
            estado: 401,
            origen: ctx.request.url()
        })
    }
}

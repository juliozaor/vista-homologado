import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TokenValidoException from 'App/Exceptions/TokenValidoException'
import Env from '@ioc:Adonis/Core/Env';

export default class Autorization {
  public async handle({request, response}: HttpContextContract, next: () => Promise<void>) {
    const header = request.header('Authorization')
    if(!header){
      throw new TokenValidoException('Falta el token de autenticación')
    }
    let token = header.split(' ')[1]
    if (token !== Env.get('TOKEN')){
      response.status(401).send({
        mensaje: `No tiene acceso a este api`,
        error: 1
      })
    }
    await next()
  }
}

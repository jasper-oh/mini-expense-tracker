import { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'supersecret'

export default class AuthJwt {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const authHeader = ctx.request.header('authorization')
    if (!authHeader) {
      return ctx.response.unauthorized({ error: 'Missing token' })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('token', token)

    try {
      const payload = jwt.verify(token, JWT_SECRET)
      const existingBody = ctx.request.body() || {}
      ctx.request.updateBody({ ...existingBody, jwtPayload: payload })
    } catch {
      return ctx.response.unauthorized({ error: 'Invalid token' })
    }

    await next()
  }
}

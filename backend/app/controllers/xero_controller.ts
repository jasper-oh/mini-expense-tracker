import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { XeroService } from '#services/xero_service'

@inject()
export default class XeroController {
  constructor(private xeroService: XeroService) {}

  public async getInvoices({ request, response }: HttpContext) {
    const accessToken: string = request.input('accessToken')
    const tenantId: string = request.input('tenantId')
    try {
      return await this.xeroService.getInvoices(accessToken, tenantId)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }

  public async getConnection({ request, response }: HttpContext) {
    const accessToken: string = request.input('accessToken')
    try {
      return await this.xeroService.connectToTenant(accessToken)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }

  public async store({ request, response }: HttpContext) {
    const code = request.input('code')
    if (!code) {
      return response.badRequest({ error: 'Missing authorization code' })
    }

    try {
      return await this.xeroService.exchangeCodeForToken(code)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }
}

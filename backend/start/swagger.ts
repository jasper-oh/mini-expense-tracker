import swaggerJsDoc from 'swagger-jsdoc'
import router from '@adonisjs/core/services/router'

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Mini Expense Tracker API', version: '1.0.0' },
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
  },
  apis: ['start/routes.ts'],
}

const swaggerSpec = swaggerJsDoc(options)

router.get('/swagger.json', async ({ response }) => response.send(swaggerSpec))

router.get('/swagger', async ({ response }) => {
  return response.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Swagger UI</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css">
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({ url: '/swagger.json', dom_id: '#swagger-ui' })
      </script>
    </body>
  </html>
  `)
})

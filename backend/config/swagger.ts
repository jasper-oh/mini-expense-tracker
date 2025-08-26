export default {
  ui: true,
  specEnabled: true,
  specUrl: '/swagger.json',
  middleware: [],

  definitions: {
    openapi: '3.0.0',
    info: {
      title: 'Mini Expense Tracker',
      version: '1.0.0',
    },
    tags: [
      { name: 'Auth', description: 'Authentication related APIs' },
      { name: 'Secret', description: 'Protected APIs requiring JWT' },
      { name: 'Category', description: 'Category management APIs' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: {},
  },

  paths: ['start/routes.ts'],
}

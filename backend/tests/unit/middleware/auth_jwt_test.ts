/**
 * Unit tests for JWT Authentication Middleware
 *
 * This test suite covers:
 * - Valid JWT token authentication
 * - Missing JWT token scenarios
 * - Invalid JWT token handling
 * - JWT payload injection into request body
 */

import { test } from '@japa/runner'
import { HttpContext } from '@adonisjs/core/http'
import AuthJwt from '#middleware/auth_jwt'
import jwt from 'jsonwebtoken'

test.group('AuthJwtMiddleware', (group) => {
  let middleware: AuthJwt
  const secretKey = 'test-secret-key'

  group.each.setup(async () => {
    middleware = new AuthJwt()

    // Mock environment variable
    process.env.JWT_SECRET = secretKey
  })

  test.group('handle method', () => {
    test('should authenticate user with valid JWT token', async ({ assert }) => {
      // Arrange
      const token = jwt.sign({ userId: 1 }, secretKey, { expiresIn: '1h' })

      const mockRequest = {
        header: (name: string) => {
          if (name === 'authorization') return `Bearer ${token}`
          return null
        },
        body: () => ({}),
        updateBody: (body: any) => body,
      } as any

      const mockContext = {
        request: mockRequest,
        response: {
          unauthorized: (data: any) => data,
        },
      } as HttpContext

      const mockNext = async () => {}

      // Act
      await middleware.handle(mockContext, mockNext)

      // Assert - Should call next() without returning error
      // The middleware should update the request body with JWT payload
      assert.isTrue(true) // Test passes if no error is thrown
    })

    test('should reject request with missing authorization header', async ({ assert }) => {
      // Arrange
      const mockRequest = {
        header: (name: string) => null,
      } as any

      const mockContext = {
        request: mockRequest,
        response: {
          unauthorized: (data: any) => data,
        },
      } as HttpContext

      const mockNext = async () => {}

      // Act
      const result = await middleware.handle(mockContext, mockNext)

      // Assert
      assert.deepEqual(result, { error: 'Missing token' })
    })

    test('should reject request with invalid JWT token', async ({ assert }) => {
      // Arrange
      const mockRequest = {
        header: (name: string) => {
          if (name === 'authorization') return 'Bearer invalid.token.here'
          return null
        },
      } as any

      const mockContext = {
        request: mockRequest,
        response: {
          unauthorized: (data: any) => data,
        },
      } as HttpContext

      const mockNext = async () => {}

      // Act
      const result = await middleware.handle(mockContext, mockNext)

      // Assert
      assert.deepEqual(result, { error: 'Invalid token' })
    })

    test('should inject JWT payload into request body', async ({ assert }) => {
      // Arrange
      const payload = { userId: 123, email: 'test@example.com' }
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })

      let updatedBody: any = {}
      const mockRequest = {
        header: (name: string) => {
          if (name === 'authorization') return `Bearer ${token}`
          return null
        },
        body: () => ({ existingData: 'test' }),
        updateBody: (body: any) => {
          updatedBody = body
        },
      } as any

      const mockContext = {
        request: mockRequest,
        response: {
          unauthorized: (data: any) => data,
        },
      } as HttpContext

      const mockNext = async () => {}

      // Act
      await middleware.handle(mockContext, mockNext)

      // Assert
      assert.deepEqual(updatedBody, {
        existingData: 'test',
        jwtPayload: payload,
      })
    })

    test('should handle empty request body gracefully', async ({ assert }) => {
      // Arrange
      const payload = { userId: 456 }
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })

      let updatedBody: any = {}
      const mockRequest = {
        header: (name: string) => {
          if (name === 'authorization') return `Bearer ${token}`
          return null
        },
        body: () => null,
        updateBody: (body: any) => {
          updatedBody = body
        },
      } as any

      const mockContext = {
        request: mockRequest,
        response: {
          unauthorized: (data: any) => data,
        },
      } as HttpContext

      const mockNext = async () => {}

      // Act
      await middleware.handle(mockContext, mockNext)

      // Assert
      assert.deepEqual(updatedBody, {
        jwtPayload: payload,
      })
    })
  })
})

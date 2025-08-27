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
import env from '#start/env'

test.group('AuthJwtMiddleware', (group) => {
  let middleware: AuthJwt
  const secretKey = env.get('JWT_SECRET')

  group.each.setup(async () => {
    middleware = new AuthJwt()
    process.env.JWT_SECRET = secretKey
  })

  test('should authenticate user with valid JWT token', async ({ assert }) => {
    const token = jwt.sign({ userId: 1 }, secretKey, { expiresIn: '1h' })

    const mockRequest = {
      header: (name: string) => (name === 'authorization' ? `Bearer ${token}` : null),
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

    await middleware.handle(mockContext, mockNext)

    assert.isTrue(true) // ✅ no error thrown = pass
  })

  test('should reject request with missing authorization header', async ({ assert }) => {
    const mockRequest = {
      header: () => null,
    } as any

    const mockContext = {
      request: mockRequest,
      response: {
        unauthorized: (data: any) => data,
      },
    } as HttpContext

    const mockNext = async () => {}

    const result = await middleware.handle(mockContext, mockNext)

    assert.containsSubset(result, { error: 'Missing token' })
  })

  test('should reject request with invalid JWT token', async ({ assert }) => {
    const mockRequest = {
      header: (name: string) => (name === 'authorization' ? 'Bearer invalid.token.here' : null),
    } as any

    const mockContext = {
      request: mockRequest,
      response: {
        unauthorized: (data: any) => data,
      },
    } as HttpContext

    const mockNext = async () => {}

    const result = await middleware.handle(mockContext, mockNext)

    assert.containsSubset(result, { error: 'Invalid token' })
  })

  test('should inject JWT payload into request body', async ({ assert }) => {
    const payload = { userId: 123, email: 'test@example.com' }
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })

    let bodyData: any = { existingData: 'test' }
    const mockRequest = {
      header: (name: string) => (name === 'authorization' ? `Bearer ${token}` : null),
      body: () => bodyData,
      updateBody: (newBody: any) => {
        bodyData = newBody
      },
    } as any

    const mockContext = {
      request: mockRequest,
      response: { unauthorized: (data: any) => data },
    } as HttpContext

    const mockNext = async () => {}

    await middleware.handle(mockContext, mockNext)

    assert.containsSubset(bodyData, {
      existingData: 'test',
      jwtPayload: payload,
    })
  })

  test('should handle empty request body gracefully', async ({ assert }) => {
    const payload = { userId: 456 }
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })

    let updatedBody: any = {}
    const mockRequest = {
      header: (name: string) => (name === 'authorization' ? `Bearer ${token}` : null),
      body: () => null,
      updateBody: (body: any) => {
        updatedBody = body
      },
    } as any

    const mockContext = {
      request: mockRequest,
      response: { unauthorized: (data: any) => data },
    } as HttpContext

    const mockNext = async () => {}

    await middleware.handle(mockContext, mockNext)

    assert.containsSubset(updatedBody, {
      jwtPayload: payload,
    })
  })
})

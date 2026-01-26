import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.OPENAI_API_KEY = 'sk-test-key'
process.env.OPENAI_MODEL = 'gpt-4o'
process.env.NODE_ENV = 'test'

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

// Create the connection with timeout configuration
const sql = neon(process.env.DATABASE_URL, {
  fetchConnectionCache: true,
  // Increase timeout for database operations
  timeout: 30000, // 30 seconds
});

// Wrapper function to add retry logic
const createRetryWrapper = (fn) => {
  return async (...args) => {
    let lastError;
    const maxRetries = 3;
    const retryDelayMs = 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        console.warn(`Database operation failed (attempt ${attempt + 1}/${maxRetries}):`, error.message);
        
        // Only retry on connection errors, not on query/validation errors
        if (error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message?.includes('fetch failed')) {
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, retryDelayMs * (attempt + 1)));
            continue;
          }
        } else {
          // Don't retry non-connection errors
          throw error;
        }
      }
    }
    throw lastError;
  };
};

// Create the database instance
export const db = drizzle(sql, { 
  schema,
  casing: 'snake_case',
});

// Export schema for use in other files
export { schema };
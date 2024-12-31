
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:OpmIv6QKEfF8@ep-green-credit-a1mjavsa.ap-southeast-1.aws.neon.tech/ai-interview-mocker?sslmode=require'
  },
});
import { RedisService } from "./redis.service"

/**
 * Duplicate connection from RedisService
 *
 * @param redisService
 * @returns Redis
 */
export function createBullMQConnection(redisService: RedisService) {
  const connection = redisService.duplicate({
    maxRetriesPerRequest: null
  })

  connection.on("connect", () => {
    console.info("✅ Redis connected (bullmq)")
  })

  connection.on("error", (err) => {
    console.error("❌ Redis connection error (bullmq)", err)
  })

  return connection
}

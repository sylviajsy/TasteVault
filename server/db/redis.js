import { createClient } from "redis";

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("error", (err) => {
    console.error("Redis error:", err.message);
  });

  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.error("Redis unavailable, running without cache");
    redisClient = null;
  }
} else {
  console.log("REDIS_URL not provided, running without cache");
}

export default redisClient;
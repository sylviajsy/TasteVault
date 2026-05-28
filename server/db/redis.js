import { createClient } from "redis";

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      connectTimeout: 5000, // set timeout
    }
  });

  redisClient.on("error", (err) => {
    console.error("Redis error:", err.message);
    if (err.code === 'ECONNREFUSED') {
      redisClient = null;
    }
  });

  redisClient.connect()
    .then(() => {
      console.log("Redis connected successfully.");
    })
    .catch((error) => {
      console.error("Redis initial connection failed, running without cache.");
      redisClient = null;
    });
} else {
  console.log("REDIS_URL not provided, running without cache");
}

export default redisClient;
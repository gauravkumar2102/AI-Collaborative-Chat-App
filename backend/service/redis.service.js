// import redis from 'ioredis';

// const redisClient = new redis({
//     host: process.env.REDIS_HOST ,  
//     port: process.env.REDIS_PORT,
//     password: process.env.REDIS_PASSWORD
// })

// redisClient.on('connect', () => {
//     console.log('Redis connected successfully');
// });
// redisClient.on('error', (error) => {
//     console.error('Redis connection error:', error.message);
// }); 

import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 19588
    }
});




export default redisClient;
import * as redis from 'redis';

let redisClient;

export const connectToRedis = async () => {
    redisClient = redis.createClient({
        url: 'redis://redis:6379'
    });
    redisClient.on('error', (err) => console.log(`Error ${err}`));
    await redisClient.connect();
}

connectToRedis();
// middleware for caching user info
export const cacheData = async (req, res, next) => {
    let results;
    try{
        const cacheResults = await redisClient.get('AllUsers');
        if(cacheResults){
            results = JSON.parse(cacheResults);
            res.send({
                fromCache: true,
                data: results
            });
        }else{
            next();
        }
    }catch(err){
        res.status(404);
    }
}
export default redisClient;
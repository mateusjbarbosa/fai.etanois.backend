import * as redis from 'redis'
import Configuration from '../../config/config'

class Redis {
  private configRedis: redis.ClientOpts
  private client: redis.RedisClient

  constructor() {
    this.configRedis = {
      host: Configuration.redis.host,
      port: Configuration.redis.port
    }

    this.client = redis.createClient(this.configRedis)
    this.client.on('connect', () => {})
    this.client.on('error', (e) => {
      console.log('Error connecting Redis!!!')
    })
  }

  public createRecoverPassword(token: string, userId: string): void {
    this.client.set(token, userId, () => {})
    this.client.expire(token, (60), () => {})
  }

  public async verifyExistenceToken(token: string): Promise<string> {
    return new Promise(resolve => {
      this.client.mget(token, (err, result) => {
        this.client.del(token)
        
        resolve(result[0])
      });
    })
  }
}

export default Redis
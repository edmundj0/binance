import os
import redis

# class RedisConnectionError(Exception):
#     pass


#Connect to Redis
redis_client = redis.Redis(host=os.getenv('REDIS_HOST'), port=6379, db=0)

try:
    response = redis_client.ping()
except redis.exceptions.ConnectionError as e:
    print(f'Unable to connect to Redis: {e}')
    # raise RedisConnectionError(f'Unable to connect to Redis: {e}')

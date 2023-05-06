import redis, os

# Connect to Redis
redis_client = redis.Redis(host=os.getenv('REDIS_HOST'), port=6379)

try:
    response = redis_client.ping()
except redis.exceptions.ConnectionError as e:
    print(f'Unable to connect to Redis: {e}')
    exit(1)

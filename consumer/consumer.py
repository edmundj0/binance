from influxdb_client.client.write_api import SYNCHRONOUS
from influxdb_client import InfluxDBClient, Point

from kafka import KafkaConsumer
import redis, os, json, time

print('starting')


#Connect to Redis
# redis_client = redis.Redis(host=os.getenv('REDIS_HOST'), port=6379)
redis_client = redis.Redis(host="redis", port=6379)
print('1')
try:
    response = redis_client.ping()
    print('connected to redis')
except redis.exceptions.ConnectionError as e:
    print(f'Unable to connect to Redis: {e}')
    exit(1)

print('2')


#Kafka consumer
# consumer = KafkaConsumer(
#     os.getenv('KAFKA_TOPIC'),
#     bootstrap_servers=['localhost:9092'],
#     auto_offset_reset='earliest',
#     enable_auto_commit=True
# )

consumer = KafkaConsumer(
    "test",
    bootstrap_servers=['kafka:9092'],
    auto_offset_reset='earliest',
    enable_auto_commit=True
)


#InfluxDB
client = InfluxDBClient(url="http://influxdb:8086",
                        org="kyle", username="myuser", password="mypassword")


write_api = client.write_api(write_options=SYNCHRONOUS)


print('3')

def run_loop():

    while True:
        print('4')
        time.sleep(1)
        print('5')

        oldest_msg = next(consumer)
        data = json.loads(oldest_msg.value)
        print(data)
        symbol = data['s']
        price = data['c']
        timestamp = data['E']

        key = f"{symbol}_{timestamp}"
        redis_client.set(key, price)
        redis_client.expire(key, 30)

        message = data


        print('6')

        bucket = "test-bucket"

        p = Point("my_measurement").tag(
            "location", symbol).field("avg", float(message['w']))

        print('7')
        write_api.write(bucket=bucket, record=p)

        print('writing')

        print('done')



if __name__ == '__main__':
    run_loop()

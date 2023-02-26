import os
import redis
import websocket
import json
import threading
# from kafka.consumer import KafkaConsumer
# from kafka.producer import KafkaProducer
from kafka import KafkaProducer, KafkaConsumer
from collections import deque


#Connect to Redis
redis_client = redis.Redis(host=os.getenv('REDIS_HOST'), port=6379)

try:
    response = redis_client.ping()
except redis.exceptions.ConnectionError as e:
    print(f'Unable to connect to Redis: {e}')
    exit(1)


#Kafka producer
producer = KafkaProducer(bootstrap_servers=['kafka:9092'])

#Kafka consumer
consumer = KafkaConsumer(
    os.getenv('KAFKA_TOPIC'),
    bootstrap_servers=['kafka:9092'],
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    # group_id="my-group"
)

#push ws messages into kafka
def on_message(ws, message):
    message = json.loads(message)
    # print(message)

    producer.send(os.getenv('KAFKA_TOPIC'), json.dumps(message).encode())
    producer.flush()

    #kafka queue check
    # if len(producer) > 10:

    oldest_msg = next(consumer)
    data = json.loads(oldest_msg.value)
    symbol = data['s']
    price = data['c']
    timestamp = data['E']

    key = f"{symbol}_{timestamp}"
    redis_client.set(key,price)

    redis_client.expire(key, 30)



def on_close(ws):
    print('Websocket closed')

def on_open(ws):
    print('Websocket opened')




def start():

    websocket_url = "wss://stream.binance.us:9443/ws/"
    coin_symbol = "BTC"

    ws = websocket.WebSocketApp(
        websocket_url + f"{coin_symbol.lower()}usd@ticker",
        on_open = on_open,
        on_message = on_message,
        on_close = on_close
    )

    ws.run_forever()


if __name__ == '__main__':
    start()

















# def on_message(ws, message):
#     message = json.loads(message)
#     print(message)
#     symbol = message['s']
#     price = message['c']
#     timestamp = message['E']

#     key = f"{symbol}_{timestamp}"
#     redis_client.set(key, price)

#     redis_client.expire(key, 5)

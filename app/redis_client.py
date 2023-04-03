from influxdb_client.client.write_api import SYNCHRONOUS
from influxdb_client import InfluxDBClient, Point
import os
import redis
import websocket
import json
# import threading
# from kafka.consumer import KafkaConsumer
# from kafka.producer import KafkaProducer
from kafka import KafkaProducer, KafkaConsumer
# from collections import deque

# from influxdb import InfluxDBClient
# import influxdb_client


# Connect to Redis
redis_client = redis.Redis(host=os.getenv('REDIS_HOST'), port=6379)

try:
    response = redis_client.ping()
except redis.exceptions.ConnectionError as e:
    print(f'Unable to connect to Redis: {e}')
    exit(1)


# Kafka producer
producer = KafkaProducer(bootstrap_servers=['kafka:9092'])

# Kafka consumer
consumer = KafkaConsumer(
    os.getenv('KAFKA_TOPIC'),
    bootstrap_servers=['kafka:9092'],
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    # group_id="my-group"
)

# influx db client

# influx_client = InfluxDBClient(
#     host=os.getenv('INFLUXDB_HOST'),
#     port=8086,
#     username=os.getenv('INFLUXDB_ADMIN_USER'),
#     password=os.getenv('INFLUXDB_ADMIN_PASSWORD'),
#     database=os.getenv('INFLUXDB_DB')
# )


client = InfluxDBClient(url="http://influxdb:8086",
                        org="kyle", username="myuser", password="mypassword")


write_api = client.write_api(write_options=SYNCHRONOUS)


# push ws messages into kafka
def on_message(ws, message):
    message = json.loads(message)
    print(message)

    producer.send(os.getenv('KAFKA_TOPIC'), json.dumps(message).encode())
    producer.flush()


def run_loop():
    import time

    while True:

        time.sleep(1)
        # kafka queue check
        # if len(producer) > 10:

        oldest_msg = next(consumer)
        data = json.loads(oldest_msg.value)
        symbol = data['s']
        price = data['c']
        timestamp = data['E']

        key = f"{symbol}_{timestamp}"
        redis_client.set(key, price)

        redis_client.expire(key, 30)

        message = data

        # influxdb write data point
        json_body = [
            {
                "measurement": "btc_data",
                "tags": {"symbol": symbol},
                "time": timestamp,
                "fields": {
                    "price_change": message['p'],
                    "price_change_percent": message['P'],
                    "open_price": message['o'],
                    "high_price": message['h'],
                    "low_price": message['l'],
                    "last_price": message['c'],
                    "weighted_average_price": message['w'],
                    "total_traded_base_asset_volume": message['v'],
                    "total_traded_quote_asset_volume": message['q'],
                    "statistics_open_time": message['O'],
                    "statistics_close_time": message['C'],
                    "first_trade_id": message['F'],
                    "last_trade_id": message['L'],
                    "total_number_of_trades": message['n']
                }
            }
        ]

        print("hello")
        bucket = "test-bucket"

        # query_api = client.query_api()

        # p = Point("crypto_tickers").tag("ticker", symbol).field("weighted_average_price", json_body['fields']['weighted_average_price'])
        p = Point("my_measurement").tag(
            "location", symbol).field("avg", float(message['w']))

        write_api.write(bucket=bucket, record=p)

        print('writing')
        # write_api.write(bucket=bucket, record=p)

        #         print (row.values)

        # using csv library
        # csv_result = query_api.query_csv('from(bucket:"bucket") |> range(start: -10m)')
        # val_count = 0
        # for row in csv_result:
        #     for cell in row:
        #         val_count += 1

        print('done')

        # influx_client.write_points(json_body)
        #     for row in table.records:
        #         print (row.values)

        # using csv library
        # csv_result = query_api.query_csv('from(bucket:"bucket") |> range(start: -10m)')
        # val_count = 0
        # for row in csv_result:
        #     for cell in row:
        #         val_count += 1

        print('done')

        # influx_client.write_points(json_body)


def on_close(ws):
    print('Websocket closed')


def on_open(ws):
    print('Websocket opened')


def start():

    websocket_url = "wss://stream.binance.us:9443/ws/"
    coin_symbol = "BTC"

    # create new ws var
    ws = websocket.WebSocketApp(
        websocket_url + f"{coin_symbol.lower()}usd@ticker",
        on_open=on_open,
        on_message=on_message,
        on_close=on_close
    )

    # define function that will run a bg loop
    # which will infinitely consume from the queue
    def run():
        ws.run_forever()

    # mutlithread the websocket on_message hander
    # this will produce to the queue in the background
    from threading import Thread

    ws_run = Thread(target=run)

    # start the background producer thread
    ws_run.start()

    print("starting loop")
    # start the infinitely running consumer function
    # this is blocking operation so it prevents main() from finishing execution
    run_loop()

    # this line WILL NEVER BE RUN
    print("we can't see this!")


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

import os
import redis
import websocket
import json
import threading

# class RedisConnectionError(Exception):
#     pass


#Connect to Redis
redis_client = redis.Redis(host=os.getenv('REDIS_HOST'), port=6379, db=0)

try:
    response = redis_client.ping()
except redis.exceptions.ConnectionError as e:
    print(f'Unable to connect to Redis: {e}')
    # raise RedisConnectionError(f'Unable to connect to Redis: {e}')


def on_message(ws, message):
    message = json.loads(message)
    symbol = message['s']
    price = message['c']
    timestamp = message['E']

    key = f"{symbol}_{timestamp}"
    redis_client.set(key, price)

    redis_client.expire(key, 5)

def on_close(ws):
    print('Websocket closed')

def on_open(ws):
    print('Websocket opened')

websocket_url = "wss://stream.binance.us:9443/ws/"
coin_symbol = "BTC"


def start_websocket():
    ws = websocket.WebSocketApp(
        websocket_url + f"{coin_symbol.lower()}usd@ticker",
        on_open = on_open,
        on_message = on_message,
        on_close = on_close
    )

    ws.run_forever()

ws_thread = threading.Thread(target=start_websocket)
ws_thread.start()

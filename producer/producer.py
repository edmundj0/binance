from kafka import KafkaProducer
import os, json, websocket

# Kafka producer
producer = KafkaProducer(bootstrap_servers=['kafka:9092'])



def on_message(ws, message):

    message = json.loads(message)
    print(message)

    # producer.send(os.getenv('KAFKA_TOPIC'), json.dumps(message).encode())
    producer.send("test", json.dumps(message).encode())
    producer.poll(1)
    # producer.flush()
    # print('DONE')




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

    ws.run_forever()


if __name__ == '__main__':
    start()

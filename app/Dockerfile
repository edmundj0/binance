FROM python:3.10

RUN pip install influxdb redis kafka-python websocket-client influxdb-client[async] influxdb-client[ciso]

ADD redis_client.py /

CMD ["python3", "redis_client.py"]

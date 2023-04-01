FROM python:3.10

RUN pip install redis kafka-python websocket-client

ADD redis_client.py /

CMD ["python3", "redis_client.py"]

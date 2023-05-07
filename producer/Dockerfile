FROM python:3.9

RUN pip install kafka-python websocket-client

COPY producer.py .

CMD ["python3", "producer.py"]

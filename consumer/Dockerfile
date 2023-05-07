FROM python:3.9

RUN pip install influxdb-client[async] influxdb-client[ciso] kafka-python redis

COPY consumer.py .

CMD ["python3", "consumer.py"]

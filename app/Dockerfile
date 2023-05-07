# Use the official Python image as a parent image
FROM python:3.9

# Set the working directory to root
WORKDIR /app

# Copy the requirements file into the container at root
COPY . /app

RUN rm dev.db

RUN pip install -r requirements.txt


# Create and set environment variables
RUN touch .env && \
    echo "SECRET_KEY=placeholder" >> .env && \
    echo "DATABASE_URL=sqlite:///dev.db" >> .env && \
    echo "SCHEMA=flask_schema" >> .env

# Run the database migrations and seed the database
# RUN flask seed undo && \
#     flask db upgrade && \
#     flask seed all

RUN flask db upgrade && \
    flask seed all


# Expose port 5000 for the Flask app
EXPOSE 5000

# Start the Flask app
CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5000"]



# Install the dependencies
# RUN pip install --upgrade pip && \
#     pip install --no-cache-dir -r /requirements.txt && \
#     pip install influxdb redis kafka-python websocket-client && \
#     apt-get update && apt-get install -y curl && \
#     curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
#     apt-get install -y nodejs && \
#     rm -rf /var/lib/apt/lists/*

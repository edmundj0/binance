# Use the official Python image as a parent image
FROM python:3.9

# Set the working directory to root
WORKDIR /

# Copy the requirements file into the container at root
COPY requirements.txt /

# Install the dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /requirements.txt && \
    pip install influxdb redis kafka-python websocket-client && \
    apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code into the container at root
COPY . /

# Create and set environment variables
RUN touch .env && \
    echo "SECRET_KEY=placeholder" >> .env && \
    echo "DATABASE_URL=sqlite:///dev.db" >> .env && \
    echo "SCHEMA=flask_schema" >> .env

# Run the database migrations and seed the database
RUN flask seed undo && flask db upgrade && \
    flask seed all

# Change the working directory to /react-app
WORKDIR /react-app

# Install the frontend dependencies
RUN npm install && \
    npm run build

# Expose port 5000 for the Flask app
EXPOSE 5000
# EXPOSE 3000

WORKDIR /

# Start the Flask app
CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5000"]

# Use the official Python image as a parent image
FROM python:3.9

# Set the working directory to root
WORKDIR /app

# Copy the requirements file into the container at root
COPY . /app

# RUN rm dev.db

RUN pip install -r requirements.txt


# Create and set environment variables
RUN touch .env && \
    echo "SECRET_KEY=placeholder" >> .env && \
    echo "DATABASE_URL=sqlite:///dev.db" >> .env && \
    echo "SCHEMA=flask_schema" >> .env


# RUN flask db upgrade && \
#     flask seed all


# Expose port 5000 for the Flask app
EXPOSE 5000

# Start the Flask app
CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5000"]

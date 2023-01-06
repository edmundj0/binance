# ₿inance.me

## About This Project

PROJECT LIVE SITE: https://binance-me.onrender.com/

Binance.me is a simulated cryptocurrency trading, full stack web application that empowers users to buy and sell crypto with real time price data. This platform helps investors make trades without risking any real money. The project has a theme based off of popular crytocurrency exchange, https://www.binance.us/. 

## Getting started
1. Clone this repository (only this branch)

2. Install dependencies

      ```bash
      pipenv install -r requirements.txt
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment

4. Make sure the SQLite3 database connection URL is in the **.env** file

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention**.

6. Get into your pipenv, migrate your database, seed your database, and run your Flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. To run the React App in development, checkout the [README](./react-app/README.md) inside the `react-app` directory.

## Technologies Used
Frontend:
- React.js
- Redux
- JavaScript

Backend:
- Flask 
- SQLALchemy
- Python

Database: 
- SQLite (development)
- PostgreSQL (live site)

Other Technologies: 
- [Bitstamp API](https://www.bitstamp.net/api/)
- [Binance.us API and Websocket Streams](https://docs.binance.us/#introduction)
- [Lightweight Financial Charting Library](https://www.tradingview.com/lightweight-charts/)

## Project Sections

### Splash Page (Homepage)
![image](https://user-images.githubusercontent.com/102005831/211088361-b671d504-6c24-4f08-85c9-bd2eb5c8491c.png)

### Login and SignUp
![image](https://user-images.githubusercontent.com/102005831/211088572-35a0bc69-5ce1-40d4-bbd8-f9ef68c8ed2f.png)

### Dashboard
updating...
### Live Market Data
![image](https://user-images.githubusercontent.com/102005831/211088696-b06764c5-74df-4613-979b-56db0f74c947.png)

### Coin Trading Page
updating...

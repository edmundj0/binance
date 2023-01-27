# ₿inance.me

## About This Project

PROJECT LIVE SITE: https://binance-me.onrender.com/

Binance.me is a simulated cryptocurrency trading, full stack web application that empowers users to buy and sell crypto with real time price data. This platform helps investors make trades without risking any real money. The project has a theme based off of popular crytocurrency exchange, https://www.binance.us/. 


## Technologies Used

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)![postgresql](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white)

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
- [React Toastify](https://www.npmjs.com/package/react-toastify)


## Test Results

Loader.io
![binance_test](https://user-images.githubusercontent.com/102005831/215225831-bc7f1eac-e1bf-41d3-8de1-1b2302a6b1a4.jpg)



## Getting started
1. Clone this repository (only this branch)

2. Install dependencies

      ```bash
      pipenv install -r requirements.txt
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment

4. Make sure the SQLite3 database connection URL is in the **.env** file

5. Get into your pipenv, migrate your database, seed your database, and run your Flask app

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

6. To run the React App in development, checkout the [README](./react-app/README.md) inside the `react-app` directory.


## Project Sections

### Splash Page (Homepage)
![splashpage_gif(1)](https://user-images.githubusercontent.com/102005831/215222256-2af137ff-11d1-42e1-9a58-80432e184de3.gif)

### Coin Trading Page
![trade_coin_gif](https://user-images.githubusercontent.com/102005831/215224185-2c3d94d4-afd6-44ec-b786-451bd35fac38.gif)

### Login and SignUp
![image](https://user-images.githubusercontent.com/102005831/211088572-35a0bc69-5ce1-40d4-bbd8-f9ef68c8ed2f.png)

### Dashboard
![dashboard_binance](https://user-images.githubusercontent.com/102005831/215224290-651c6302-b512-4ec0-ba2b-b7ddd1390629.jpg)

### Live Market Data
![image](https://user-images.githubusercontent.com/102005831/211088696-b06764c5-74df-4613-979b-56db0f74c947.png)


## Let's Get Connected!
<a href="https://www.linkedin.com/in/edmund-ju/" target="_blank">



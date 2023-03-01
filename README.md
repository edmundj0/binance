# ₿inance.me

## About This Project

PROJECT LIVE SITE: https://binance-me.onrender.com/

Binance.me is a simulated cryptocurrency trading, full stack web application that empowers users to buy and sell crypto with real time price data. This platform allows investors to make trades (buy and sell orders) without risking any real money. The project has a theme based off of popular cryptocurrency exchange, https://www.binance.us/. 

![image](https://user-images.githubusercontent.com/102005831/222015038-9b47944a-5e98-4cbc-8c53-e3bc7e56d649.png)


## Technologies Used

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)![Flask](https://img.shields.io/badge/Flask-%23404d59.svg?style=for-the-badge&logo=flask&logoColor=%2361DAFB)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

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


## How To Use

1. **Create an Account**  

      a. Click **Get Started** in the upper right and enter first name, last name, username, email, and password.  
      WARNING: This is a site created for educational purposes and real information should not be used!  
      b. Login to your new account, which will redirect to your dashboard  
      
2. **Create a Portfolio**  

      a. From your dashboard, click **Open New Portfolio**, which opens a modal where you can input a portfolio name and select a portfolio type (Investing, Margin, IRA).  
      
3. **Enter a Payment Method**  

      a. From your dashboard, click **Add New Payment Method**, where you can enter your Payment Type, Account Number, Routing Number, and Note.   
      WARNING: DO NOT ENTER REAL BANK INFORMATION.  
      
4. **Deposit Currency Into Portfolio**  

      a. From your dashboard, click **Deposit Now**. Select from the dropdown menu a payment method, and select a destination portfolio for the deposited funds. Input a transfer amount in USD. The Buying Power for the portfolio will be updated instantly.  
      
5. **Select Cryptocurrency To Trade**  

      a. From the Market Information section on your dashboard, you can learn about and view information about every coin offered on the exchange.  
      b. Select **View** to be taken to the Coin Details page.  
      c. Login if you are not logged in already.  
      
6. **Making a Trade**  

      a. Select **Buy** or **Sell**  
      b. Choose a portfolio to make the trade. Validations are set so your account will not incur negative balances.  
      c. Select a quantity (dollars or amount).  
      d. Click **Submit**. You will be redirected to your portfolio page.  
      
      Please refer to the GIF below for more instructions  
      
7. **Viewing Portfolio Performance**  

      a. Account Holdings is updated in real-time and shows the assets held by the portfolio.  
      b. Portfolio Performance is a graphical representation of historical performance based on current account holdings.  
      c. A list of Transactions (both buy and sell orders) are timestamped at the bottom of the page.  

### Making a Trade


![making a trade (1)-min](https://user-images.githubusercontent.com/102005831/222011956-ee04de3e-97a9-4628-93e1-921d559fb86b.gif)




## Database Schema

![Database Schema](https://raw.githubusercontent.com/edmundj0/binance/dev/react-app/src/assets/database-schema.png)

## Test Results

Loader.io - stress test performance of system under load
![binance_test](https://user-images.githubusercontent.com/102005831/215225831-bc7f1eac-e1bf-41d3-8de1-1b2302a6b1a4.jpg)


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




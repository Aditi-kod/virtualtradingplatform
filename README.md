# Virtual Trading Platform

A full-stack virtual trading platform inspired by Exness, designed for safe practice with virtual money. Users can simulate trading in Forex, Stocks, Commodities, and Cryptocurrencies while monitoring real-time market data, portfolio performance, and trade history.

## Table of Contents

Features

Tech Stack

Installation

Environment Variables

Running the App

Screenshots

Deployment

## Future Improvements

### Features
#### User Features

Signup/Login with JWT authentication

Virtual wallet with default balance

Real-time market prices

Buy/Sell trades with Market/Limit/Stop orders

Trade history with timestamps and quantities

Portfolio analytics: Balance, Win/Loss ratio, Avg. profit per trade

#### Admin Features

View all users and their profiles

Reset user balances

Monitor user trades and activity

#### Dashboard

Wallet balance overview

Real-time market snapshot

Candlestick and line charts for selected assets

## Tech Stack

Frontend: React.js, Tailwind CSS, Chart.js

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT

Market Data: Alpha Vantage API / Yahoo Finance / Binance API

Deployment: Vercel (frontend) + Render/Heroku (backend)

## Installation

Clone the repository:

git clone  https://github.com/Aditi-kod/virtualtradingplatform.git


Install dependencies for frontend:

cd frontend
npm install


Install dependencies for backend:

cd ../backend
npm install

## Environment Variables

Create a .env file in your backend folder with:

MONGO_URI=<Your MongoDB connection string>
JWT_SECRET=<Your JWT secret>
DEFAULT_BALANCE=10000


For the frontend (Vite), create .env:

VITE_API_URL=http://localhost:4000/api

## Running the App Locally

### Backend:

cd backend
npm run dev


### Frontend:

cd frontend
npm run dev


Visit http://localhost:5173 (or your Vite dev URL) in your browser.


## Deployment

Backend: Deploy on Render, Heroku, or Railway.

Frontend: Deploy on Vercel.

Update VITE_API_URL in frontend .env with your backend URL.

## Future Improvements

Add more trading instruments (Options, Futures)

Add real-time WebSocket price updates

Enhance charting with TradingView library

Add notifications for trade executions

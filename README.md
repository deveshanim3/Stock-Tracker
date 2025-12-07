# 📈 Real-Time Stock Tracker

A full-stack MERN application designed for real-time market analysis and portfolio management. This project utilizes WebSockets for live price updates and secure JSON Web Token (JWT) authentication to protect user data.

## 🚀 Features

* **Real-Time Dashboard**: Live stock prices updated instantly via **Finnhub WebSocket API**.
* **Dynamic Charts**: Interactive area charts visualizing intraday price movements.
* **Watchlist System**: Users can search for and save stocks to a personalized database watchlist.
* **Portfolio Holdings**: A dedicated section to input buy prices and track real-time Profit/Loss percentages.
* **Price Alerts**: Set custom target prices for specific stocks and receive visual alerts when targets are hit.
* **Secure Authentication**: Custom login/signup system using **JWT** (HTTP-Only cookies) for session security.

## 🛠️ Tech Stack

### Frontend
* **React.js** (Vite build tool)
* **React Router DOM** (Client-side routing)
* **Axios** (HTTP requests & interceptors)
* **Lucide React** (Modern, lightweight iconography)
* **Recharts** (Data visualization library)
* **Tailwind CSS** (Responsive styling)

### Backend
* **Node.js** (Runtime environment)
* **Express.js** (API framework)
* **MongoDB & Mongoose** (Data persistence)
* **JSON Web Token (JWT)** (Stateless authentication)
* **Cookie-Parser** (Secure cookie handling)
* **CORS** (Cross-Origin Resource Sharing configuration)

### APIs
* **Finnhub.io** (Real-time WebSockets & REST API for candles/search)

## ⚙️ Environment Variables

To run this project locally, create `.env` files in your root/server/client directories as needed.

**Server (`server/.env`):**
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/stockapp
JWT_SECRET=your_complex_secret_key
FRONTEND_URL=http://localhost:5173
FINNHUB_API_KEY=your_finnhub_key
Client (client/.env)
VITE_BASE_URL=http://localhost:3000
VITE_FINNHUB_API=your_finnhub_key

📦 Installation
1️⃣ Clone the Repository
git clone https://github.com/yourusername/stock-tracker.git
cd stock-tracker

2️⃣ Install Backend Dependencies
cd server
npm install

3️⃣ Install Frontend Dependencies
cd ../client
npm install

4️⃣ Run the Application

Start Backend

npm start


Start Frontend

npm run dev

📸 Screenshots

Add your application screenshots here.

🛡️ Security Note

This application uses HTTP-Only Cookies to store JWTs. This prevents Cross-Site Scripting (XSS) attacks from accessing the user's session token.

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📄 License

MIT License


✅ This is now **100% GitHub-ready and properly formatted**.  
If you want, I can also:
- Insert your **real GitHub repo link**
- Add **demo link & deployment section**
- Add **API route documentation** for your backend.

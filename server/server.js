const express = require("express");
require("dotenv").config();
const cors = require("cors");
const initRoutes = require("./routes");
const { dbConnected } = require("./config/dbConnected");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const hpp = require("hpp");
const { sanitize } = require("./middlewares/sanitize");
const {
  errorInternalServer,
  errorBadRequest,
} = require("./middlewares/errorHandler");
const { startServer } = require("./utils/startServer");

const app = express();
const port = process.env.PORT || 8888;
const isProduction = process.env.NODE_ENV === "production";

// =====================
// MIDDLEWARE CƠ BẢN
// =====================

// Giới hạn kích thước request body
app.use(express.json({ limit: "400kb" }));
app.use(express.urlencoded({ extended: true, limit: "400kb" }));

// ======================
// MIDDLEWARE BẢO MẬT
// ======================

// Thiết lập Helmet với CSP
app.use(
  helmet({
    contentSecurityPolicy: false,
    hsts: isProduction,
    frameguard: { action: "deny" },
    crossOriginEmbedderPolicy: isProduction,
    crossOriginOpenerPolicy: isProduction,
    crossOriginResourcePolicy: { policy: "same-site" },
  })
);

// Middleware lọc dữ liệu nguy hiểm
app.use(sanitize);

// Chống parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// CORS configuration
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "https://therealielts.vn"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Cookie parser với secret key
app.use(cookieParser(process.env.SECRET_KEY));

// ======================
// ROUTES & DATABASE
// ======================

// Khởi tạo routes
initRoutes(app);

// Kết nối database
dbConnected();

// ====================
// ERROR HANDLING
// ====================

// error handling
app.use(errorBadRequest);
app.use(errorInternalServer);

// ======================
// START SERVER
// ======================

startServer(app, port);

module.exports = app;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/stories", require("./routes/storyRoutes"));
app.use("/images", require("./routes/imageRoutes"));
app.use("/uploads", express.static("uploads"));

app.listen(process.env.PORT || 8000, () => console.log(`Server running on port ${process.env.PORT || 8000}`));

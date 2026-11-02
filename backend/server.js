
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Booking = require("./models/Booking");

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "LuxeSalon API is running!" });
});

// Create a new booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { customerName, service, appointmentDate } = req.body;

    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      !["Hair Styling", "Skin Care", "Bridal Beauty"].includes(service) ||
      !appointmentDate ||
      Number.isNaN(Date.parse(appointmentDate))
    ) {
      return res.status(400).json({
        message: "Please provide a valid name, service, and appointment date.",
      });
    }

    const prices = {
      "Hair Styling": 499,
      "Skin Care": 799,
      "Bridal Beauty": 4999,
    };

    const booking = await Booking.create({
      customerName: customerName.trim(),
      service,
      price: prices[service],
      appointmentDate: new Date(appointmentDate),
    });

    res.status(201).json({
      message: "Booking saved successfully!",
      booking,
    });
  } catch (error) {
    console.error("Booking creation failed:", error.message);
    res.status(500).json({
      message: "Unable to save booking. Please try again.",
    });
  }
});

// Connect to MongoDB before starting the server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas connected successfully!");

    app.listen(PORT, () => {
      console.log(`LuxeSalon API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();

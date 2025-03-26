const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// 🔐 Domenii permise pentru frontend (toate subdomeniile tale Vercel)
const allowedOrigins = [
  "http://localhost:3000",
  "https://salon-appointments.vercel.app",
  "https://salon-appointments-new.vercel.app",
  "https://salon-appointments-new-git-main-ciprians-projects-14325706.vercel.app",
  "https://salon-appointments-kzba3tenm-ciprians-projects-14325706.vercel.app",
  "https://salon-appointments-avnb6p43k-ciprians-projects-14325706.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectat la MongoDB"))
  .catch((err) => console.error("❌ Eroare MongoDB:", err));

const appointmentSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  service: String,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

app.get("/appointments", async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});

app.post("/appointments", async (req, res) => {
  const newAppointment = new Appointment(req.body);
  const savedAppointment = await newAppointment.save();
  res.status(201).json(savedAppointment);
});

app.delete("/appointments/:id", async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.get("/keep-alive", (req, res) => {
  res.status(200).send("🔁 Backend activ");
});

app.listen(PORT, () => {
  console.log(`🚀 Server pornit pe portul ${PORT}`);
});

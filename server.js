const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// 🔐 Domenii permise (inclusiv frontendul de pe Vercel)
const allowedOrigins = [
  "http://localhost:3000",
  "https://salon-appointments.vercel.app",
  "https://salon-appointments-kzba3tenm-ciprians-projects-14325706.vercel.app"
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

// 🧠 Middleware
app.use(express.json());

// 🛠 Conectare MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectat la MongoDB"))
  .catch((err) => console.error("❌ Eroare MongoDB:", err));

// 📘 Schema și model pentru programări
const appointmentSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  service: String,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// 🟢 Endpoint GET - toate programările
app.get("/appointments", async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});

// 🟣 Endpoint POST - adăugare programare
app.post("/appointments", async (req, res) => {
  const newAppointment = new Appointment(req.body);
  const savedAppointment = await newAppointment.save();
  res.status(201).json(savedAppointment);
});

// 🔴 Endpoint DELETE - ștergere programare
app.delete("/appointments/:id", async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// 🔄 Ping pentru keep-alive
app.get("/keep-alive", (req, res) => {
  res.status(200).send("🔁 Backend activ");
});

// ▶️ Pornire server
app.listen(PORT, () => {
  console.log(`🚀 Server pornit pe portul ${PORT}`);
});

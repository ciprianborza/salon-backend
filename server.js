require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conectare la MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ Eroare: MONGO_URI nu este definit în .env!");
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Conectat la MongoDB"))
  .catch((err) => {
    console.error("❌ Eroare MongoDB:", err);
    process.exit(1);
  });

const db = mongoose.connection;
db.once("open", () => console.log("✅ Conectat la MongoDB"));
db.on("error", (err) => console.error("❌ Eroare MongoDB:", err));

// Definire model pentru programări
const AppointmentSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  service: String,
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

// Endpoint pentru salvarea programărilor
app.post("/appointments", async (req, res) => {
  const newAppointment = new Appointment(req.body);
  await newAppointment.save();
  res.status(201).json(newAppointment);
});

// Endpoint pentru afișarea programărilor
app.get("/appointments", async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});

// Endpoint pentru ștergerea unei programări
app.delete("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ error: "Programarea nu a fost găsită!" });
    }
    res.json({ message: "Programarea a fost ștearsă cu succes!" });
  } catch (error) {
    console.error("❌ Eroare la ștergerea programării:", error);
    res.status(500).json({ error: "A apărut o eroare la ștergerea programării." });
  }
});

// 🔹 Endpoint nou pentru a menține backend-ul activ
app.get("/ping", (req, res) => {
  res.send("🏓 Ping OK - Server activ");
});

// Pornirea serverului
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pornit pe portul ${PORT}`));
 

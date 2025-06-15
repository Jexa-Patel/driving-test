const Appointment = require("../models/appointment");

exports.getAppointmentPage = async (req, res) => {
  const appointments = await Appointment.find({ isTimeSlotAvailable: true });
  res.render("appointment", { appointments });
};

exports.addAppointmentSlot = async (req, res) => {
  const { date, times } = req.body;
  const appointments = await Appointment.find();

  try {
    const timeSlots = JSON.parse(times);

    for (let time of timeSlots) {
      const existingSlot = await Appointment.findOne({ date, time });
      if (existingSlot) {
        return res
          .status(400)
          .send(
            `<script>alert('Slot ${time} already exists for this date.'); window.location='/appointment';</script>`
          );
      }
    }

    for (let time of timeSlots) {
      const newSlot = new Appointment({
        date,
        time,
        isTimeSlotAvailable: true,
      });
      await newSlot.save();
    }

    res
      .status(200)
      .send(
        `<script>alert('Appointment slots added successfully!'); window.location='/appointment';</script>`
      );
  } catch (error) {
    console.error("Error adding appointment slot:", error);
    res.status(500).send(`
      <script>
        alert('Error adding appointment slots. Please try again later.');
        window.location.href = '/appointment';
      </script>
    `);
  }
};
exports.getAvailableSlots = async (req, res) => {
  const { date } = req.query;
  const appointments = await Appointment.find();

  try {
    const existingAppointments = await Appointment.find({ date });

    const allTimes = [
      "9:00",
      "9:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "1:00",
      "1:30",
      "2:00",
    ];

    const availableTimes = allTimes.map((time) => {
      const isBooked = existingAppointments.some((slot) => slot.time === time);
      return {
        time,
        isTimeSlotAvailable: isBooked,
      };
    });

    res.json({
      success: true,
      availableTimes,
      appointments,
      existingAppointments: existingAppointments.map((slot) => ({
        time: slot.time,
        isTimeSlotAvailable: slot.isTimeSlotAvailable,
        id: slot._id,
      })),
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching available slots",
    });
  }
};

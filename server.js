const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shortid = require('shortid');
const port = 3000;
const mockData = require('./mockData').data;
const { isValidTime, isWithinLimit } = require('./utils');

app.use(bodyParser.json());

app.get('/doctors', (req, res) => {
  const doctors = Object.keys(mockData).map(id => {
    const { firstName, lastName } = mockData[id];
    return {
      firstName,
      lastName,
      id
    };
  });
  res.json({ doctors });
});

// example: /appointments/2?date=2/8/20
app.get('/appointments/:id', (req, res) => {
  const doctorData = mockData[req.params.id];
  const date = req.query.date;
  if (doctorData) {
    const { appointments } = doctorData;
    const filteredAppointments = appointments.filter(
      appointment => appointment.date === date
    );
    res.json({ appointments: filteredAppointments });
  } else {
    res.status(400).send('No doctor found');
  }
});

//name date time type
//time will follow format of 2:00 PM
app.post('/appointments/:id', (req, res) => {
  const { name, date, time, type } = req.body;
  if (!isValidTime(time)) {
    return res.status(400).send('Invalid time');
  }

  const appointment = { name, date, time, type, id: shortid.generate() };
  const doctorData = mockData[req.params.id];
  if (doctorData) {
    const { appointments } = doctorData;
    if (!isWithinLimit(appointments, date, time)) {
      res.status(400).send('Maxed out on this time slot');
    }
    appointments.push(appointment);
    res.json({ appointments });
  } else {
    res.status(400).send('No doctor found');
  }
});

app.delete('/appointments/:id/:appointmentId', (req, res) => {
  const doctorData = mockData[req.params.id];
  const appointmentToDelete = req.params.appointmentId;
  if (doctorData) {
    const { appointments } = doctorData;
    const updateAppointments = appointments.filter(
      appointment => appointment.id !== appointmentToDelete
    );
    res.json({ appointments: updateAppointments });
  } else {
    res.status(400).send('No doctor found');
  }
});

app.listen(port, () => console.log(`Calendar app listening on port ${port}!`));

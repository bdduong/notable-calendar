const isValidTime = timeStr => {
  const mins = timeStr.slice(
    timeStr.indexOf(':') + 1,
    timeStr.indexOf(':') + 3
  );
  return Number(mins) % 15 === 0;
};

const isWithinLimit = (appointments, date, time) => {
  const sameTimeAppts = appointments
    .filter(appointment => appointment.date === date)
    .filter(appointment => appointment.time === time);
  return sameTimeAppts.length < 3;
};

module.exports = { isValidTime, isWithinLimit };

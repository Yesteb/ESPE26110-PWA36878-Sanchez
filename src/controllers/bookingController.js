const {
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../services/bookingService");

const create = async (req, res) => {
  try {
    const { date, scheduleId } = req.body;
    const booking = await createBooking(req.user.id, date, scheduleId);
    return res.status(201).json(booking);
  } catch (error) {
    return res.status(error.statusCode || 400).json({ error: error.message });
  }
};

const getById = (req, res) => {
  return res.json(req.booking);
};

const update = async (req, res) => {
  try {
    const { date, scheduleId } = req.body;
    const booking = await updateBooking(req.booking.id, date, scheduleId);
    return res.json(booking);
  } catch (error) {
    return res.status(error.statusCode || 400).json({ error: error.message });
  }
};

const remove = async (req, res, next) => {
  try {
    await deleteBooking(req.booking.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getById, update, remove };

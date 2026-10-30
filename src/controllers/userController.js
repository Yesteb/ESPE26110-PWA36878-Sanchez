const { getUserBookings } = require("../services/userService");

const listUserBookings = async (req, res, next) => {
  try {
    const bookings = await getUserBookings(Number(req.params.id));
    return res.json(bookings);
  } catch (error) {
    next(error);
  }
};

module.exports = { listUserBookings };

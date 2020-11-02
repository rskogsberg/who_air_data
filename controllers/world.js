const helper = require('../config/db');
// Get world
// GET /api/v1/world
// @access Public

exports.getWorld = async (req, res, next) => {
  try {
    await helper.getClient().connect()
    const world = await helper.getClient().db("who_air_data").collection("who_air_data").findOne();

    return res.status(200).json({
      sucess: true,
      count: world.length,
      data: world
    });
  } catch (err) {
    return res.status(500).json({
      sucess: false,
      error: 'Server Error'
    });
  }
};
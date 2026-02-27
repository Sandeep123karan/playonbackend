const Schedule = require("../models/scheduleModel");

/* ================= ADD SCHEDULE ================= */
exports.addSchedule = async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    await schedule.save();

    res.status(201).json({
      success: true,
      message: "Schedule added successfully",
      data: schedule
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL ================= */
exports.getSchedule = async (req, res) => {
  try {
    const data = await Schedule.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      total: data.length,
      data
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET SINGLE ================= */
exports.getSingleSchedule = async (req, res) => {
  try {
    const data = await Schedule.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateSchedule = async (req, res) => {
  try {
    const updated = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({
      success: true,
      message: "Schedule updated successfully",
      data: updated
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteSchedule = async (req, res) => {
  try {
    const deleted = await Schedule.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({
      success: true,
      message: "Schedule deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

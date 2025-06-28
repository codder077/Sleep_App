const SleepData = require('../models/SleepData');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Create sleep data
// @route   POST /api/sleep
// @access  Private
const createSleepData = asyncHandler(async (req, res) => {
  const {
    username,
    change,
    sleepStruggle,
    bedTime,
    wakeTime,
    sleepDuration,
    sleepQuality,
    sleepEfficiency,
    notes,
    tags,
    isPublic
  } = req.body;

  const sleepData = await SleepData.create({
    user: req.user._id,
    username,
    change,
    sleepStruggle,
    bedTime,
    wakeTime,
    sleepDuration,
    sleepQuality,
    sleepEfficiency,
    notes,
    tags,
    isPublic
  });

  res.status(201).json({
    success: true,
    message: 'Sleep data added successfully!',
    data: {
      sleepData: sleepData.getFormattedData()
    }
  });
});

// @desc    Get all sleep data for current user
// @route   GET /api/sleep
// @access  Private
const getMySleepData = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const query = { user: req.user._id };

  // Filter by date range
  if (req.query.startDate && req.query.endDate) {
    query.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  // Filter by sleep quality
  if (req.query.minQuality) {
    query.sleepQuality = { $gte: parseInt(req.query.minQuality) };
  }

  // Filter by sleep duration
  if (req.query.minDuration) {
    query.sleepDuration = { $gte: parseFloat(req.query.minDuration) };
  }

  const total = await SleepData.countDocuments(query);
  const sleepData = await SleepData.find(query)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate('user', 'displayName email');

  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: startIndex + limit < total,
    hasPrev: page > 1
  };

  res.json({
    success: true,
    data: {
      sleepData: sleepData.map(data => data.getFormattedData()),
      pagination
    }
  });
});

// @desc    Get single sleep data entry
// @route   GET /api/sleep/:id
// @access  Private
const getSleepData = asyncHandler(async (req, res) => {
  const sleepData = await SleepData.findById(req.params.id)
    .populate('user', 'displayName email');

  if (!sleepData) {
    return res.status(404).json({
      success: false,
      message: 'Sleep data not found'
    });
  }

  // Check if user owns this data or if it's public
  if (sleepData.user._id.toString() !== req.user._id.toString() && !sleepData.isPublic) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this sleep data'
    });
  }

  res.json({
    success: true,
    data: {
      sleepData: sleepData.getFormattedData()
    }
  });
});

// @desc    Update sleep data
// @route   PUT /api/sleep/:id
// @access  Private
const updateSleepData = asyncHandler(async (req, res) => {
  let sleepData = await SleepData.findById(req.params.id);

  if (!sleepData) {
    return res.status(404).json({
      success: false,
      message: 'Sleep data not found'
    });
  }

  // Check if user owns this data
  if (sleepData.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this sleep data'
    });
  }

  const {
    username,
    change,
    sleepStruggle,
    bedTime,
    wakeTime,
    sleepDuration,
    sleepQuality,
    sleepEfficiency,
    notes,
    tags,
    isPublic
  } = req.body;

  const updateFields = {};
  if (username !== undefined) updateFields.username = username;
  if (change !== undefined) updateFields.change = change;
  if (sleepStruggle !== undefined) updateFields.sleepStruggle = sleepStruggle;
  if (bedTime !== undefined) updateFields.bedTime = bedTime;
  if (wakeTime !== undefined) updateFields.wakeTime = wakeTime;
  if (sleepDuration !== undefined) updateFields.sleepDuration = sleepDuration;
  if (sleepQuality !== undefined) updateFields.sleepQuality = sleepQuality;
  if (sleepEfficiency !== undefined) updateFields.sleepEfficiency = sleepEfficiency;
  if (notes !== undefined) updateFields.notes = notes;
  if (tags !== undefined) updateFields.tags = tags;
  if (isPublic !== undefined) updateFields.isPublic = isPublic;

  sleepData = await SleepData.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true }
  ).populate('user', 'displayName email');

  res.json({
    success: true,
    message: 'Sleep data updated successfully!',
    data: {
      sleepData: sleepData.getFormattedData()
    }
  });
});

// @desc    Delete sleep data
// @route   DELETE /api/sleep/:id
// @access  Private
const deleteSleepData = asyncHandler(async (req, res) => {
  const sleepData = await SleepData.findById(req.params.id);

  if (!sleepData) {
    return res.status(404).json({
      success: false,
      message: 'Sleep data not found'
    });
  }

  // Check if user owns this data
  if (sleepData.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this sleep data'
    });
  }

  await sleepData.remove();

  res.json({
    success: true,
    message: 'Sleep data deleted successfully'
  });
});

// @desc    Get sleep statistics for current user
// @route   GET /api/sleep/stats
// @access  Private
const getSleepStats = asyncHandler(async (req, res) => {
  const stats = await SleepData.getUserStats(req.user._id);

  if (!stats) {
    return res.json({
      success: true,
      data: {
        stats: {
          totalEntries: 0,
          avgSleepDuration: 0,
          avgSleepQuality: 0,
          avgSleepEfficiency: 0,
          minSleepDuration: 0,
          maxSleepDuration: 0,
          bestSleepQuality: 0,
          worstSleepQuality: 0
        }
      }
    });
  }

  // Get recent data for trends
  const recentData = await SleepData.getRecentData(req.user._id, 7);

  // Calculate trends
  const trends = {
    sleepDuration: recentData.length > 1 ? 
      recentData[0].sleepDuration - recentData[recentData.length - 1].sleepDuration : 0,
    sleepQuality: recentData.length > 1 ? 
      recentData[0].sleepQuality - recentData[recentData.length - 1].sleepQuality : 0
  };

  res.json({
    success: true,
    data: {
      stats: {
        ...stats,
        trends
      },
      recentData: recentData.map(data => data.getFormattedData())
    }
  });
});

// @desc    Get public sleep data (for community features)
// @route   GET /api/sleep/public
// @access  Public
const getPublicSleepData = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const query = { isPublic: true };

  // Filter by sleep quality
  if (req.query.minQuality) {
    query.sleepQuality = { $gte: parseInt(req.query.minQuality) };
  }

  const total = await SleepData.countDocuments(query);
  const sleepData = await SleepData.find(query)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate('user', 'displayName');

  const pagination = {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: startIndex + limit < total,
    hasPrev: page > 1
  };

  res.json({
    success: true,
    data: {
      sleepData: sleepData.map(data => ({
        ...data.getFormattedData(),
        user: { displayName: data.user.displayName } // Only show display name
      })),
      pagination
    }
  });
});

module.exports = {
  createSleepData,
  getMySleepData,
  getSleepData,
  updateSleepData,
  deleteSleepData,
  getSleepStats,
  getPublicSleepData
}; 
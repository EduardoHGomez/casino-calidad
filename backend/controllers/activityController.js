const activityService = require('../services/activityService');
const { HTTP_STATUS } = require('../config/constants');

class ActivityController {
  
  // GET /profile/activity
  async getActivityHistory(req, res, next) {
    try {
      const userId = req.userId;
      const { limit = 20, skip = 0 } = req.query;

      const activities = await activityService.getActivityHistory(userId, {
        limit: parseInt(limit),
        skip: parseInt(skip)
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /profile/activity/recent
  async getRecentActivity(req, res, next) {
    try {
      const userId = req.userId;
      const { limit = 10 } = req.query;

      const activities = await activityService.getRecentActivity(
        userId, 
        parseInt(limit)
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ActivityController();
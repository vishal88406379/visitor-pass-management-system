/**
 * Analytics Controller
 * Handles analytics and reporting operations
 */

const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const Visitor = require('../models/Visitor');
const User = require('../models/User');

/**
 * Get dashboard statistics
 * @route GET /api/analytics/dashboard
 * @access Private (Admin/Security)
 */
const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalVisitors = await Visitor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const activeVisitors = await CheckLog.countDocuments({ checkOutTime: null });
    
    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaysAppointments = await Appointment.countDocuments({
      scheduledDate: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    // Get appointment stats by status
    const appointmentStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format appointment stats
    const appointmentStatusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      completed: 0
    };
    
    appointmentStats.forEach(stat => {
      appointmentStatusCounts[stat._id] = stat.count;
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalVisitors,
        totalAppointments,
        activeVisitors,
        todaysAppointments,
        appointmentStatusCounts
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching dashboard statistics'
      }
    });
  }
};

/**
 * Get visitor trends
 * @route GET /api/analytics/trends
 * @access Private (Admin/Security)
 */
const getVisitorTrends = async (req, res) => {
  try {
    // Get visitor registrations by month
    const visitorTrends = await Visitor.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);
    
    // Get appointment trends by month
    const appointmentTrends = await Appointment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        visitorTrends,
        appointmentTrends
      }
    });
  } catch (error) {
    console.error('Get visitor trends error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching visitor trends'
      }
    });
  }
};

/**
 * Get popular visit times
 * @route GET /api/analytics/times
 * @access Private (Admin/Security)
 */
const getPopularVisitTimes = async (req, res) => {
  try {
    // Get appointments grouped by scheduled time
    const timeStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$scheduledTime',
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: 10
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: timeStats
    });
  } catch (error) {
    console.error('Get popular visit times error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching popular visit times'
      }
    });
  }
};

/**
 * Get host activity
 * @route GET /api/analytics/hosts
 * @access Private (Admin/Security)
 */
const getHostActivity = async (req, res) => {
  try {
    // Get hosts with most appointments
    const hostStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$host',
          appointmentCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'host'
        }
      },
      {
        $unwind: '$host'
      },
      {
        $match: {
          'host.role': 'employee'
        }
      },
      {
        $project: {
          _id: 0,
          host: {
            _id: '$host._id',
            firstName: '$host.firstName',
            lastName: '$host.lastName',
            email: '$host.email',
            department: '$host.department'
          },
          appointmentCount: 1
        }
      },
      {
        $sort: {
          appointmentCount: -1
        }
      },
      {
        $limit: 10
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: hostStats
    });
  } catch (error) {
    console.error('Get host activity error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching host activity'
      }
    });
  }
};

module.exports = {
  getDashboardStats,
  getVisitorTrends,
  getPopularVisitTimes,
  getHostActivity
};
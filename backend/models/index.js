/**
 * Models Index
 * Central export point for all database models
 */

const User = require('./User');
const Visitor = require('./Visitor');
const Appointment = require('./Appointment');
const Pass = require('./Pass');
const CheckLog = require('./CheckLog');

module.exports = {
  User,
  Visitor,
  Appointment,
  Pass,
  CheckLog,
};

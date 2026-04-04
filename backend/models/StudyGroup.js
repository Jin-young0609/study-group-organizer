// StudyGroup.js - MongoDB Model for Study Group Organizer
// IFN636 Assessment 1.2 - Jin Young An (N12574422)
 
const mongoose = require('mongoose');
 
const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [2, 'Capacity must be at least 2'],
    },
    description: { type: String, default: '' },
    meetingDistance: {
      type: String,
      enum: ['Online', 'On-Campus', 'Hybrid'],
      default: 'Online',
    },
    privacy: {
      type: String,
      enum: ['Public', 'Private'],
      default: 'Public',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model('StudyGroup', studyGroupSchema);

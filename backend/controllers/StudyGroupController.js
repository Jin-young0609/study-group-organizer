// studyGroupController.js
// IFN636 Assessment 1.2 - Jin Young An (N12574422)
 
const StudyGroup = require('../models/StudyGroup');
 
// CREATE
const createGroup = async (req, res) => {
  const { name, subject, capacity, description, meetingDistance, privacy } = req.body;
  if (!name || !subject || !capacity)
    return res.status(400).json({ message: 'Name, subject, capacity required' });
  try {
    const group = await StudyGroup.create({
      name, subject, capacity, description, meetingDistance, privacy,
      creator: req.user.id, members: [req.user.id],
    });
    res.status(201).json(group);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
 
// READ ALL
const getGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.find({ isDeleted: false })
      .populate('creator', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
 
// READ MY GROUPS
const getMyGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.find({ creator: req.user.id, isDeleted: false })
      .populate('creator', 'name email').populate('members', 'name email')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
 
// READ SINGLE
const getGroupById = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate('creator', 'name email').populate('members', 'name email');
    if (!group || group.isDeleted)
      return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
 
// UPDATE (creator only)
const updateGroup = async (req, res) => {
  const { name, subject, capacity, description, meetingDistance, privacy } = req.body;
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group || group.isDeleted)
      return res.status(404).json({ message: 'Group not found' });
    if (group.creator.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });
    group.name = name || group.name;
    group.subject = subject || group.subject;
    group.capacity = capacity || group.capacity;
    group.description = description || group.description;
    group.meetingDistance = meetingDistance || group.meetingDistance;
    group.privacy = privacy || group.privacy;
    const updated = await group.save();
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
 
// DELETE (creator or admin)
const deleteGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group || group.isDeleted)
      return res.status(404).json({ message: 'Group not found' });
    if (group.creator.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    group.isDeleted = true;
    await group.save();
    res.json({ message: 'Group deleted successfully' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
 
// JOIN
const joinGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group || group.isDeleted)
      return res.status(404).json({ message: 'Group not found' });
    if (group.members.includes(req.user.id))
      return res.status(400).json({ message: 'Already a member' });
    if (group.members.length >= group.capacity)
      return res.status(400).json({ message: 'Group is full' });
    group.members.push(req.user.id);
    await group.save();
    res.json({ message: 'Joined successfully' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
 
// LEAVE
const leaveGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group || group.isDeleted)
      return res.status(404).json({ message: 'Group not found' });
    group.members = group.members.filter(m => m.toString() !== req.user.id);
    await group.save();
    res.json({ message: 'Left successfully' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
 
// ADMIN — all groups
const getAllGroupsAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Admin access required' });
    const groups = await StudyGroup.find()
      .populate('creator', 'name email').populate('members', 'name email')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
 
module.exports = {
  createGroup, getGroups, getMyGroups, getGroupById,
  updateGroup, deleteGroup, joinGroup, leaveGroup, getAllGroupsAdmin,
};

// studyGroupRoutes.js
// IFN636 Assessment 1.2 - Jin Young An (N12574422)
 
const express = require('express');
const router = express.Router();
const {
  createGroup, getGroups, getMyGroups, getGroupById,
  updateGroup, deleteGroup, joinGroup, leaveGroup, getAllGroupsAdmin,
} = require('../controllers/studyGroupController');
 

const { protect } = require('../middleware/authMiddleware');
 
router.get('/',             protect, getGroups);
router.get('/my',           protect, getMyGroups);
router.get('/admin/all',    protect, getAllGroupsAdmin);
router.get('/:id',          protect, getGroupById);
router.post('/',            protect, createGroup);
router.put('/:id',          protect, updateGroup);
router.delete('/:id',       protect, deleteGroup);
router.post('/:id/join',    protect, joinGroup);
router.post('/:id/leave',   protect, leaveGroup);
 
module.exports = router;

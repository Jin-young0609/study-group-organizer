// studyGroup_test.js
// IFN636 Assessment 1.2 - Jin Young An (N12574422)
// Reference: Tutorial Week 4 - Phase 1 Test Automation

const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const StudyGroup = require('../models/StudyGroup');
const { createGroup } = require('../controllers/studyGroupController');
const { expect } = chai;

// describe() - groups all related test cases
describe('CreateGroup Function Test', () => {

  // Test Case 1: Successfully Create a Study Group
  it('should create a new study group successfully', async () => {

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        name: 'IFN636 Study Group',
        subject: 'Software Life Cycle Management',
        capacity: 5,
        description: 'A group for IFN636 students',
        meetingDistance: 'Online',
        privacy: 'Public',
      }
    };

    // Mock created group (what DB would return)
    const createdGroup = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
      creator: req.user.id,
      members: [req.user.id],
    };

    // Stub StudyGroup.create to avoid hitting real DB
    const createStub = sinon.stub(StudyGroup, 'create').resolves(createdGroup);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    // Call the function
    await createGroup(req, res);

    // Assertions
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdGroup)).to.be.true;

    // Restore stub
    createStub.restore();
  });

  // Test Case 2: Missing required fields → 400 error
  it('should return 400 if required fields are missing', async () => {

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        // name, subject, capacity 모두 누락
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createGroup(req, res);

    expect(res.status.calledWith(400)).to.be.true;

    // Restore (create가 호출 안됐으므로 stub 불필요)
  });

  // Test Case 3: DB error → 500 error
  it('should return 500 if a database error occurs', async () => {

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        name: 'Test Group',
        subject: 'Test Subject',
        capacity: 3,
      }
    };

    // Stub을 에러 던지도록 설정
    const createStub = sinon.stub(StudyGroup, 'create').throws(new Error('DB Error'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createGroup(req, res);

    expect(res.status.calledWith(500)).to.be.true;

    createStub.restore();
  });

});
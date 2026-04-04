// CreateGroup.jsx - IFN636 Assessment 1.2 - Jin Young An (N12574422)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const CreateGroup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', subject: '', capacity: '', description: '',
    meetingDistance: 'Online', privacy: 'Public',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/studygroups', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage('Group created successfully!');
      setTimeout(() => navigate('/my-groups'), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create group.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Study Group</h1>
        {message && <p className="text-blue-500 mb-4">{message}</p>}
        <input
          type="text" name="name" placeholder="Group Name"
          value={formData.name} onChange={handleChange} required
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text" name="subject" placeholder="Subject"
          value={formData.subject} onChange={handleChange} required
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="number" name="capacity" placeholder="Capacity (min 2)"
          value={formData.capacity} onChange={handleChange} required min="2"
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          name="description" placeholder="Description"
          value={formData.description} onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          rows={3}
        />
        <select
          name="meetingDistance" value={formData.meetingDistance}
          onChange={handleChange} className="w-full mb-4 p-2 border rounded"
        >
          <option value="Online">Online</option>
          <option value="On-Campus">On-Campus</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <select
          name="privacy" value={formData.privacy}
          onChange={handleChange} className="w-full mb-4 p-2 border rounded"
        >
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
        <div className="flex gap-2">
          <button
            type="button" onClick={() => navigate('/my-groups')}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
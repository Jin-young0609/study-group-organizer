// EditGroup.jsx - IFN636 Assessment 1.2 - Jin Young An (N12574422)
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const EditGroup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '', subject: '', capacity: '', description: '',
    meetingDistance: 'Online', privacy: 'Public',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    try {
      const response = await axiosInstance.get(`/api/studygroups/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const g = response.data;
      setFormData({
        name: g.name, subject: g.subject, capacity: g.capacity,
        description: g.description, meetingDistance: g.meetingDistance,
        privacy: g.privacy,
      });
    } catch (error) {
      setMessage('Failed to load group.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/studygroups/${id}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage('Group updated successfully!');
      setTimeout(() => navigate('/my-groups'), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this group?')) return;
    try {
      await axiosInstance.delete(`/api/studygroups/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/my-groups');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleUpdate} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Edit Study Group</h1>
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
          type="number" name="capacity" placeholder="Capacity"
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
        <div className="flex gap-2 mb-4">
          <button
            type="button" onClick={() => navigate('/my-groups')}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
        <hr className="mb-4" />
        <button
          type="button" onClick={handleDelete}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Delete This Group
        </button>
      </form>
    </div>
  );
};

export default EditGroup;
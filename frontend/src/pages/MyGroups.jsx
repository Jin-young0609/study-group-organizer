// MyGroups.jsx - IFN636 Assessment 1.2 - Jin Young An (N12574422)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const MyGroups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMyGroups();
  }, [user]);

  const fetchMyGroups = async () => {
    try {
      const response = await axiosInstance.get('/api/studygroups/my', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setGroups(response.data);
    } catch (error) {
      setMessage('Failed to load your groups.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this group?')) return;
    try {
      await axiosInstance.delete(`/api/studygroups/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage('Group deleted.');
      fetchMyGroups();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Study Groups</h1>
        <button
          onClick={() => navigate('/create-group')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Create New Group
        </button>
      </div>
      {message && <p className="text-blue-500 mb-4">{message}</p>}
      {groups.length === 0 ? (
        <p className="text-gray-500">You haven't created any groups yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <div key={g._id} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-1">{g.name}</h2>
              <p className="text-sm text-gray-600 mb-1">📚 {g.subject}</p>
              <p className="text-sm text-gray-500 mb-2">{g.description}</p>
              <p className="text-sm text-gray-500 mb-3">
                👥 {g.members.length}/{g.capacity} · {g.meetingDistance} · {g.privacy}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit-group/${g._id}`)}
                  className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(g._id)}
                  className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGroups;
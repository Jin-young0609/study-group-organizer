// AdminPanel.jsx - IFN636 Assessment 1.2 - Jin Young An (N12574422)
import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAllGroups();
  }, [user]);

  const fetchAllGroups = async () => {
    try {
      const response = await axiosInstance.get('/api/studygroups/admin/all', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setGroups(response.data);
    } catch (error) {
      setMessage('Access denied or failed to load groups.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this group?')) return;
    try {
      await axiosInstance.delete(`/api/studygroups/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage('Group deleted by admin.');
      fetchAllGroups();
    } catch (error) {
      setMessage('Failed to delete.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">🛡️ Admin Panel</h1>
      <p className="text-gray-500 mb-4">Monitor all groups on the platform</p>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-white rounded shadow p-4 text-center">
          <p className="text-3xl font-bold text-blue-500">{groups.length}</p>
          <p className="text-gray-500">Total Groups</p>
        </div>
        <div className="flex-1 bg-white rounded shadow p-4 text-center">
          <p className="text-3xl font-bold text-green-500">
            {groups.filter(g => !g.isDeleted).length}
          </p>
          <p className="text-gray-500">Active Groups</p>
        </div>
        <div className="flex-1 bg-white rounded shadow p-4 text-center">
          <p className="text-3xl font-bold text-red-500">
            {groups.filter(g => g.isDeleted).length}
          </p>
          <p className="text-gray-500">Deleted Groups</p>
        </div>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Subject', 'Members', 'Status', 'Creator', 'Action'].map(h => (
                <th key={h} className="p-3 text-left text-sm font-semibold text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g._id} className={g.isDeleted ? 'bg-red-50' : 'bg-white'}>
                <td className="p-3 text-sm">{g.name}</td>
                <td className="p-3 text-sm">{g.subject}</td>
                <td className="p-3 text-sm">{g.members.length}/{g.capacity}</td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${
                    g.isDeleted
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {g.isDeleted ? 'Deleted' : 'Active'}
                  </span>
                </td>
                <td className="p-3 text-sm">{g.creator?.name}</td>
                <td className="p-3 text-sm">
                  {!g.isDeleted && (
                    <button
                      onClick={() => handleDelete(g._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
// Groups.jsx - Browse all study groups
// IFN636 Assessment 1.2 - Jin Young An (N12574422)
import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Groups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchGroups(); }, [user]);

  const fetchGroups = async () => {
    try {
      const response = await axiosInstance.get('/api/studygroups', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setGroups(response.data);
    } catch (error) {
      setMessage('Failed to load groups.');
    }
  };

  const handleJoin = async (id) => {
    try {
      await axiosInstance.post(`/api/studygroups/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage('Successfully joined!');
      fetchGroups();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to join.');
    }
  };

  const handleLeave = async (id) => {
    try {
      await axiosInstance.post(`/api/studygroups/${id}/leave`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage('Successfully left.');
      fetchGroups();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to leave.');
    }
  };

  const userId = user._id || user.id;

  const isMember = (g) =>
    g.members.some(m => {
      const memberId = m._id ? m._id.toString() : m.toString();
      return memberId === userId?.toString();
    });

  const myGroups = groups.filter(g => isMember(g));
  const discoverGroups = groups.filter(g => !isMember(g));

  const GroupCard = ({ g, member }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-1">{g.name}</h2>
      <p className="text-sm text-gray-600 mb-1">📚 {g.subject}</p>
      <p className="text-sm text-gray-500 mb-2">{g.description}</p>
      <p className="text-sm text-gray-500 mb-2">
        👥 {g.members.length}/{g.capacity} · {g.meetingDistance} · {g.privacy}
      </p>
      <p className="text-xs text-gray-400 mb-3">Created by: {g.creator?.name}</p>
      <div className="flex gap-2">
        {member ? (
          <button
            onClick={() => handleLeave(g._id)}
            className="flex-1 border border-red-400 text-red-400 py-1 rounded hover:bg-red-50"
          >
            Leave
          </button>
        ) : (
          <button
            onClick={() => handleJoin(g._id)}
            className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
          >
            Join
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Browse Study Groups</h1>
      {message && <p className="text-blue-500 mb-4">{message}</p>}

      {/* My Groups 섹션 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-blue-600">
          My Groups ({myGroups.length})
        </h2>
        {myGroups.length === 0 ? (
          <p className="text-gray-400 text-sm">You haven't joined any groups yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map(g => <GroupCard key={g._id} g={g} member={true} />)}
          </div>
        )}
      </div>

      <hr className="mb-8" />

      {/* Discover Groups 섹션 */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-green-600">
          Discover Groups ({discoverGroups.length})
        </h2>
        {discoverGroups.length === 0 ? (
          <p className="text-gray-400 text-sm">No new groups to discover.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoverGroups.map(g => <GroupCard key={g._id} g={g} member={false} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
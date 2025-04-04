import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Clock, CheckCircle, XCircle, Package, Search, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [profile, setProfile] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = Cookies.get('authToken')
      const response = await axios.get('http://localhost:3000/api/user/profile', {
        headers: { Authorization: token },
      });
      setProfile(response.data);

      const lostItems = await Promise.all(
        response.data.lostItems.map((id: string) =>
          axios.get(`http://localhost:3000/api/lost-item/item/${id}`, {
            headers: { Authorization: token },
          }).then(res => ({ ...res.data, type: 'lost' }))
        )
      );

      const foundItems = await Promise.all(
        response.data.foundItems.map((id: string) =>
          axios.get(`http://localhost:3000/api/found-item/item/${id}`, {
            headers: { Authorization: token },
          }).then(res => ({ ...res.data, type: 'found' }))
        )
      );

      const sortedItems = [...lostItems, ...foundItems]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);

      setItems(sortedItems);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  fetchProfile();
}, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'returned':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const handleMarkAsReturned = (itemId: string) => {
    toast.success('Item marked as returned');
    // This will be implemented with actual API calls later
  };

  const getItemIcon = (type: string) => {
    return type === 'lost' ? (
      <Search className="h-5 w-5 text-red-500" />
    ) : (
      <Package className="h-5 w-5 text-green-500" />
    );
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">
            Edit Profile
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-gray-600">
              <strong>Name:</strong> {profile.name}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {profile.email}
            </p>
            <p className="text-gray-600">
              <strong>Phone:</strong> {profile.phone}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Pending Items: {items.filter(item => item.status === 'Pending').length}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Inactive: {items.filter(item => item.status === 'Inactive').length}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Returned Items: {items.filter(item => item.status === 'returned').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'active'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active Items
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'history'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getItemIcon(item.type)}
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      <span className="capitalize text-sm font-medium">
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <p className="text-sm text-gray-500">
                        Location: {item.location}
                      </p>
                      <p className="text-sm text-gray-500">
                        Reported on: {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {item.image && (
                      <div className="relative h-24 w-full rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                        <button
                          onClick={() => navigate(`/matched-items/${item._id}?type=${item.type}`)}
                          className="absolute bottom-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          See Matched Images
                        </button>
                      </div>
                    )}
                  </div>

                  {item.status === 'matched' && item.matchedWith && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Matched with:
                          </p>
                          <p className="text-sm text-green-600">
                            {item.matchedWith.user}
                          </p>
                          <p className="text-sm text-green-600">
                            {item.matchedWith.phone}
                          </p>
                        </div>
                        <button
                          onClick={() => handleMarkAsReturned(item._id)}
                          className="flex items-center space-x-1 text-sm text-green-700 hover:text-green-900"
                        >
                          <span>Mark as Returned</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {item.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        We'll notify you when we find a match. Please wait 48 hours.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
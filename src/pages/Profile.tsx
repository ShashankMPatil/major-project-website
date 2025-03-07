import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Package, Search, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  
  const mockItems = [
    {
      id: '1',
      type: 'lost',
      title: 'Blue Backpack',
      description: 'Nike backpack with laptop compartment',
      location: 'Library',
      status: 'pending',
      date: '2024-03-10',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: '2',
      type: 'found',
      title: 'iPhone Charger',
      description: 'White Apple charging cable',
      location: 'Student Center',
      status: 'matched',
      date: '2024-03-08',
      matchedWith: {
        id: '5',
        user: 'john.doe@college.edu',
        phone: '+1 234-567-8900'
      }
    },
    {
      id: '3',
      type: 'lost',
      title: 'Water Bottle',
      description: 'Metal water bottle, black color',
      location: 'Gymnasium',
      status: 'returned',
      date: '2024-03-05',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400',
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'matched':
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
              <strong>Email:</strong> user@example.com
            </p>
            <p className="text-gray-600">
              <strong>Phone:</strong> +1 234 567 8900
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Pending Items: 1</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Matched Items: 1</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Returned Items: 1</p>
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
            {mockItems.map((item) => (
              <div
                key={item.id}
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
                        Reported on: {item.date}
                      </p>
                    </div>
                    {item.image && (
                      <div className="relative h-24 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
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
                          onClick={() => handleMarkAsReturned(item.id)}
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
}

export default Profile;
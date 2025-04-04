import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle, MapPin } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
const Home = () => {
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState([]);

 useEffect(() => {
  const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjBiMDJlYjQyMTAyZWNmZTY5ZDJmMyIsImlhdCI6MTc0MzgyNjk5MCwiZXhwIjoxNzQ2NDE4OTkwfQ.0nQ_pl1kPvxqnbrsehhLCCmRtFQVYqv73a4u5lFok5A';
  Cookies.set('authToken', token);

  const fetchRecentItems = async () => {
    try {
      const authToken = Cookies.get('authToken');

      const profileResponse = await axios.get('http://localhost:3000/api/user/profile', {
        headers: { Authorization: authToken },
      });

      const lostItemIds = profileResponse.data.lostItems || [];
      const foundItemIds = profileResponse.data.foundItems || [];

      const lostItems = await Promise.all(
        lostItemIds.map((id: string) =>
          axios.get(`http://localhost:3000/api/lost-item/item/${id}`, {
            headers: { Authorization: authToken },
          }).then(res => ({ ...res.data, type: 'lost' }))
        )
      );

      const foundItems = await Promise.all(
        foundItemIds.map((id: string) =>
          axios.get(`http://localhost:3000/api/found-item/item/${id}`, {
            headers: { Authorization: authToken },
          }).then(res => ({ ...res.data, type: 'found' }))
        )
      );

      setRecentItems([...lostItems, ...foundItems]);
    } catch (error) {
      console.error('Error fetching recent items:', error);
    }
  };

  fetchRecentItems();
}, []);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center space-x-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-sm">
            <Clock className="h-4 w-4" />
            <span>Waiting (48h)</span>
          </span>
        );
      case 'matched':
        return (
          <span className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Match Found</span>
          </span>
        );
      case 'returned':
        return (
          <span className="flex items-center space-x-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Returned</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        Lost something? Found something?
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div 
          onClick={() => navigate('/report/lost')}
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-red-100 hover:border-red-200"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 mx-auto">
            <Search className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4">Lost an item?</h2>
          <p className="text-gray-600 text-center">
            Report your lost item and we'll help you find it.
          </p>
        </div>

        <div 
          onClick={() => navigate('/report/found')}
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-green-100 hover:border-green-200"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
            <Package className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4">Found an item?</h2>
          <p className="text-gray-600 text-center">
            Help someone recover their lost item by reporting it here.
          </p>
        </div>
      </div>

      <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Recent Items</h2>
        <div className="space-y-6">
          {recentItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {item.type === 'lost' ? (
                    <Search className="h-5 w-5 text-red-500" />
                  ) : (
                    <Package className="h-5 w-5 text-green-500" />
                  )}
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                {getStatusBadge(item.status)}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.location || 'College'}
                  </p>
                </div>
                {item.image && (
                  <div className="relative h-24 w-full rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                )}
                {item.image && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => navigate(`/matched-items/${item._id}?type=${item.type}`)}
                      className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      See Matched Images
                    </button>
                  </div>
                )}
              </div>

              {item.status === 'matched' && item.matchedWith && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Matched with: {item.matchedWith.name} ({item.matchedWith.email})
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
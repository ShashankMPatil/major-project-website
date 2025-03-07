import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle, MapPin } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const recentItems = [
    {
      id: '1',
      type: 'lost',
      title: 'Blue Backpack',
      location: 'Library',
      date: '2024-03-10',
      status: 'pending',
      description: 'Nike backpack with laptop compartment',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: '2',
      type: 'found',
      title: 'iPhone Charger',
      location: 'Student Center',
      date: '2024-03-08',
      status: 'matched',
      description: 'White Apple charging cable',
      matchedWith: {
        name: 'John Doe',
        email: 'john.doe@college.edu'
      }
    },
    {
      id: '3',
      type: 'lost',
      title: 'Water Bottle',
      location: 'Gymnasium',
      date: '2024-03-05',
      status: 'returned',
      description: 'Metal water bottle, black color',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400'
    }
  ];

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
                    {item.location}
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
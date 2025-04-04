import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface MatchedItem {
  _id: string;
  name: string;
  image: string;
  location?: string;
  uploadedBy: string;
  createdAt: string;
  description: string;
  otherInfo?: string[];
  uploaderEmail?: string;
}

const MatchedItems = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');

  const [matchedItems, setMatchedItems] = useState<MatchedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchedItems = async () => {
      try {
        if (!itemId || !type) {
          toast.error('Missing item ID or type');
          return;
        }

        const token = Cookies.get('authToken');
        if (!token) {
          toast.error('You are not authorized. Please log in.');
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/matched/${itemId}?type=${type}`,
          {
            headers: { Authorization: token },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch matched items');
        }

        const data: MatchedItem[] = await response.json();

        // Fetch uploader emails in parallel
        const formattedData = await Promise.all(
          data.map(async (item) => {
            const userRes = await fetch(`http://localhost:3000/api/user/user/${item.uploadedBy}`);
            const user = await userRes.json();
            return {
              ...item,
              location: item.location || 'College Campus',
              createdAt: new Date(item.createdAt).toLocaleDateString(),
              uploaderEmail: user.email || 'N/A',
            };
          })
        );

        setMatchedItems(formattedData);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load matched items');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedItems();
  }, [itemId, type]);

  if (loading) return <div>Loading...</div>;

  if (!matchedItems.length) return <div className="text-center text-gray-500 mt-8">No matched items found</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8">Matched Items</h2>
      <div className="space-y-8">
        {matchedItems.map((item) => (
          <div key={item._id} className="border-b pb-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-64 object-contain rounded-lg"
            />
            <p className="text-lg font-semibold">{item.name}</p>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-sm text-gray-500 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {item.location}
            </p>
            <p className="text-sm text-gray-500">Uploaded By: {item.uploaderEmail}</p>
            <p className="text-sm text-gray-500">Created At: {item.createdAt}</p>
            {item.otherInfo && (
              <ul className="text-sm text-gray-500 list-disc pl-5">
                {item.otherInfo.map((info, index) => (
                  <li key={index}>{info}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchedItems;

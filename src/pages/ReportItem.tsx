import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, MapPin, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
);

const LOCATIONS = [
  'Library', 'Café', 'Student Center', 'Gymnasium', 'Lecture Hall',
  'Laboratory', 'Parking Lot', 'Dormitory', 'Other'
];

const ReportItem = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    brand: '',
    imageUrl: '',
    otherInfo: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const fetchDescription = async (imageUrl) => {
    try {
      const authToken = Cookies.get('authToken');
      const response = await fetch('http://localhost:3000/api/lost-item/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({ imageUrl }),
      });
      const { description } = await response.json();
      setFormData((prev) => ({ ...prev, description }));
      toast.success('Description generated!');
    } catch {
      toast.error('Failed to generate description.');
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setIsUploading(true);
      const fileName = `image-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('images').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      const publicUrl = data.publicUrl;
      setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
      await fetchDescription(publicUrl);
    } catch {
      toast.error('Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'found' && !formData.imageUrl) {
      toast.error('Image required for found items');
      return;
    }
    if (formData.description.length <= 50) {
      toast.error('Description must be more than 50 characters');
      return;
    }
    try {
      const authToken = Cookies.get('authToken');
      const payload = {
        name: formData.title,
        image: formData.imageUrl || null,
        tags: formData.brand ? [formData.brand] : [],
        status: 'Active',
        description: formData.description,
        location: formData.location || 'college',
        otherInfo: formData.otherInfo ? [formData.otherInfo] : [],
      };
      const url =
        type === 'lost'
          ? 'http://localhost:3000/api/lost-item/file-complaint'
          : 'http://localhost:3000/api/found-item/upload-item';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success('Report submitted!');
      navigate('/');
    } catch {
      toast.error('Error submitting report');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8">
        Report {type === 'lost' ? 'Lost' : 'Found'} Item
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">
            <Upload className="inline h-4 w-4 mr-1" />
            Image {type === 'found' && <span className="text-red-500">*</span>}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="w-full border p-2 rounded"
          />
          {isUploading && <p className="text-sm mt-2">Uploading image...</p>}
          {formData.imageUrl && (
            <div className="mt-4">
              <img src={formData.imageUrl} alt="Uploaded" className="h-48 object-contain" />
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            placeholder="e.g., Blue Bag"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            placeholder="Describe the item..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            <MapPin className="inline h-4 w-4 mr-1" />
            Location
          </label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Location</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            <Tag className="inline h-4 w-4 mr-1" />
            Brand (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Nike"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Other Info (optional)</label>
          <input
            type="text"
            value={formData.otherInfo}
            onChange={(e) => setFormData({ ...formData, otherInfo: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportItem;

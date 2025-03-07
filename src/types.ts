export interface User {
  id: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface Item {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string;
  brand?: string;
  image_url?: string;
  status: 'pending' | 'matched' | 'returned';
  user_id: string;
  created_at: string;
  matched_item_id?: string;
}

export interface Match {
  id: string;
  lost_item_id: string;
  found_item_id: string;
  created_at: string;
  status: 'pending' | 'confirmed' | 'rejected';
}
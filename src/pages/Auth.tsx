import React, { useState } from 'react';
import { Mail, Lock, Phone } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication logic will be implemented later
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {!isLogin && (
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              placeholder="Phone (optional)"
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="text-center mt-6">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-indigo-600 hover:text-indigo-800"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
}

export default Auth;
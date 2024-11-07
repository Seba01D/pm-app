import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function JoinProject() {
  const [accessCode, setAccessCode] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [authToken, setAuthToken] = useState('');

  // Fetch authentication token when component loads
  useEffect(() => {
    const fetchAuthToken = async () => {
      const supabase = createSupabaseBrowser();
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setAuthToken(data.session.access_token);
      }
    };
    fetchAuthToken();
  }, []);

  // Automatically clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleJoinProject = async () => {
    try {
      const response = await fetch('/api/joinProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ access_code: accessCode }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Successfully joined the project!' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while joining the project.' });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Input for access code */}
      <input
        type="text"
        value={accessCode}
        onChange={(e) => setAccessCode(e.target.value)}
        placeholder="Enter Access Code"
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
      />

      {/* Join Project Button */}
      <button
        onClick={handleJoinProject}
        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Join Project
      </button>

      {/* Notification Message */}
      {message.text && (
        <div
          className={`fixed top-5 right-5 flex items-center max-w-xs px-4 py-3 rounded-md shadow-md space-x-2 transition-transform duration-300 ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <FaCheckCircle className="text-green-600" />
          ) : (
            <FaExclamationCircle className="text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}

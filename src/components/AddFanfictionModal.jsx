import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { X, Loader } from 'lucide-react';

export default function AddFanfictionModal({ onClose }) {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data) => api.saveFanfiction(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['fanfictions']);
      onClose();
    },
    onError: (error) => {
      setError(error.response?.data?.error || 'Failed to save fanfiction. Please try again.');
      setLoading(false);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate URL
    if (!url) {
      setError('Please enter an AO3 URL');
      return;
    }

    if (!url.includes('archiveofourown.org')) {
      setError('Please enter a valid AO3 URL (https://archiveofourown.org/works/...)');
      return;
    }

    setLoading(true);

    const tagArray = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];

    const data = {
      url,
      tags: tagArray
    };

    saveMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add Fanfiction</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
              AO3 URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://archiveofourown.org/works/12345678"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500"
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500">
              Just paste the AO3 link and we'll fetch all the details
            </p>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
              Custom Tags (Optional)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="to-read, favorite, comfort fic"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Add your own tags, separated by commas
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !url}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </span>
              ) : (
                'Save Fanfiction'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
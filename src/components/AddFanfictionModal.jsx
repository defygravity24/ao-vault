import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { X, Loader } from 'lucide-react';

export default function AddFanfictionModal({ onClose }) {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [manualData, setManualData] = useState({
    title: '',
    author: '',
    summary: '',
    relationships: '',
    fandoms: '',
    rating: ''
  });
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
      setError(error.response?.data?.error || 'Failed to save fanfiction');
      setLoading(false);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);

    const data = {
      url,
      tags: tagArray
    };

    // Add manual data if in manual mode
    if (manualMode) {
      data.title = manualData.title;
      data.author = manualData.author;
      data.summary = manualData.summary;
      data.relationships = manualData.relationships;
      data.fandoms = manualData.fandoms;
      data.rating = manualData.rating;
    }

    saveMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add Fanfiction</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              AO3 URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://archiveofourown.org/works/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Currently only Archive of Our Own links are supported
            </p>
          </div>

          {/* Manual entry toggle */}
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              Having trouble? Enter details manually
            </p>
            <button
              type="button"
              onClick={() => setManualMode(!manualMode)}
              className="text-sm font-medium text-amber-900 hover:text-amber-700"
            >
              {manualMode ? 'Hide' : 'Show'} Manual Entry
            </button>
          </div>

          {/* Manual entry fields */}
          {manualMode && (
            <>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={manualData.title}
                  onChange={(e) => setManualData({...manualData, title: e.target.value})}
                  placeholder="Enter the fanfiction title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  value={manualData.author}
                  onChange={(e) => setManualData({...manualData, author: e.target.value})}
                  placeholder="Enter the author's name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="relationships" className="block text-sm font-medium text-gray-700 mb-2">
                  Ship/Relationships
                </label>
                <input
                  type="text"
                  id="relationships"
                  value={manualData.relationships}
                  onChange={(e) => setManualData({...manualData, relationships: e.target.value})}
                  placeholder="e.g., Harry Potter/Draco Malfoy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                  Summary
                </label>
                <textarea
                  id="summary"
                  value={manualData.summary}
                  onChange={(e) => setManualData({...manualData, summary: e.target.value})}
                  placeholder="Enter a brief summary"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="to-read, favorite, angst"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple tags with commas
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
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
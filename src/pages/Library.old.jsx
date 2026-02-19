import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import AddFanfictionModal from '../components/AddFanfictionModal';
import {
  Search,
  Filter,
  Grid,
  List,
  Plus,
  X,
  ExternalLink,
  Star,
  BookOpen,
  Clock,
  Tag,
  Folder,
  MoreVertical,
  CheckCircle,
  Loader
} from 'lucide-react';

export default function Library() {
  const { showAddModal, setShowAddModal } = useOutletContext();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const queryClient = useQueryClient();

  // Fetch fanfictions
  const { data, isLoading, error } = useQuery({
    queryKey: ['fanfictions', searchQuery, filterStatus],
    queryFn: () => api.getFanfictions({
      search: searchQuery,
      status: filterStatus === 'all' ? undefined : filterStatus,
      page: 1,
      limit: 50
    }).then(res => res.data)
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Library</h1>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or summary..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="deleted">Deleted</option>
              <option value="lost">Lost</option>
            </select>

            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading library: {error.message}</p>
        </div>
      ) : data?.fanfictions?.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No fanfictions yet</h3>
          <p className="text-gray-500 mb-6">Start building your library by adding your favorite stories</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Fanfic
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ?
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
          'space-y-4'
        }>
          {data?.fanfictions?.map((fic) => (
            viewMode === 'grid' ?
              <FanficCard key={fic.id} fanfic={fic} /> :
              <FanficListItem key={fic.id} fanfic={fic} />
          ))}
        </div>
      )}

      {/* Add Fanfiction Modal */}
      {showAddModal && (
        <AddFanfictionModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function FanficCard({ fanfic }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gaveThanks, setGaveThanks] = useState(false);
  const [isHorny, setIsHorny] = useState(false);
  const queryClient = useQueryClient();

  const handleGiveThanks = () => {
    setGaveThanks(true);
    // In a real app, this would save to the database
    api.updateBookmark(fanfic.id, { gaveThanks: true });
  };

  const handleMarkHorny = () => {
    setIsHorny(!isHorny);
    // In a real app, this would save to the database
    api.updateBookmark(fanfic.id, { outrageouslyHorny: !isHorny });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
            {fanfic.title}
          </h3>
          <p className="text-sm text-gray-500">by {fanfic.author}</p>
          {fanfic.relationships && (
            <p className="text-sm text-pink-600 font-medium mt-1">
              💕 {fanfic.relationships}
            </p>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                Edit Bookmark
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                View Chapters
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                Check for Updates
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
        {fanfic.summary || 'No summary available'}
      </p>

      {/* Special Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {isHorny && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-red-500 text-white animate-pulse">
            🔥 OUTRAGEOUSLY HORNY 🔥
          </span>
        )}
        {gaveThanks && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
            ✓ You gave thanks
          </span>
        )}
      </div>

      {/* Tags */}
      {fanfic.tags && fanfic.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {fanfic.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
            >
              {tag.name}
            </span>
          ))}
          {fanfic.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{fanfic.tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleGiveThanks}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            gaveThanks
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {gaveThanks ? '✓ Thanks Given!' : '🙏 Give Thanks'}
        </button>
        <button
          onClick={handleMarkHorny}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isHorny
              ? 'bg-pink-100 text-pink-700 border border-pink-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isHorny ? '🔥 Outrageously Horny!' : '🔥 Mark as Horny'}
        </button>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {fanfic.chapter_count} ch
          </span>
          <span className="flex items-center">
            {fanfic.word_count?.toLocaleString()} words
          </span>
        </div>
        {fanfic.complete && (
          <CheckCircle className="w-4 h-4 text-green-500" />
        )}
      </div>

      {/* Bookmark Info */}
      {fanfic.bookmark && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              fanfic.bookmark.reading_status === 'reading' ? 'bg-blue-100 text-blue-700' :
              fanfic.bookmark.reading_status === 'completed' ? 'bg-green-100 text-green-700' :
              fanfic.bookmark.reading_status === 'to-read' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {fanfic.bookmark.reading_status.replace('-', ' ')}
            </span>
            {fanfic.bookmark.rating && (
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < fanfic.bookmark.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FanficListItem({ fanfic }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{fanfic.title}</h3>
          <p className="text-sm text-gray-500">by {fanfic.author} • {fanfic.chapter_count} chapters • {fanfic.word_count?.toLocaleString()} words</p>
        </div>
        <div className="flex items-center space-x-2">
          {fanfic.complete && <CheckCircle className="w-5 h-5 text-green-500" />}
          <a
            href={fanfic.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </a>
        </div>
      </div>
    </div>
  );
}


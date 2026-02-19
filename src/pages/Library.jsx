import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import AddFanfictionModal from '../components/AddFanfictionModal';
import {
  Search,
  Filter,
  Plus,
  ExternalLink,
  Star,
  Heart,
  Flame,
  BookOpen,
  Hash,
  MoreVertical,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function Library() {
  const { showAddModal, setShowAddModal } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch fanfictions
  const { data, isLoading, error } = useQuery({
    queryKey: ['fanfictions', searchQuery],
    queryFn: () => api.getFanfictions({
      search: searchQuery,
      page: 1,
      limit: 50
    }).then(res => res.data)
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-white">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              The Library
            </h1>
            <p className="text-gray-400 mt-1">
              {data?.fanfictions?.length || 0} Stories • 100k Words Total
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25"
          >
            <Plus className="w-5 h-5 inline-block mr-2" />
            New Archive
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a story, author, or tag..."
            className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Stories Grid */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.fanfictions?.map((fic) => (
            <FanficCard key={fic.id} fanfic={fic} />
          ))}

          {/* Add placeholder cards for demo */}
          {(!data || data.fanfictions?.length < 3) && (
            <>
              <DemoCard
                title="The Mirror and the Veil"
                author="StarlightReader"
                tags={["Harry Potter", "Romance", "Angst"]}
                progress={100}
                isCompleted
              />
              <DemoCard
                title="Neon Hearts"
                author="CyberSoul"
                tags={["Cyberpunk", "Action", "Romance"]}
                progress={65}
              />
            </>
          )}
        </div>
      </div>

      {/* Add Fanfiction Modal */}
      {showAddModal && (
        <AddFanfictionModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function FanficCard({ fanfic }) {
  const [gaveThanks, setGaveThanks] = useState(false);
  const [isHorny, setIsHorny] = useState(false);

  const handleGiveThanks = () => {
    setGaveThanks(!gaveThanks);
    api.updateBookmark(fanfic.id, { gaveThanks: !gaveThanks });
  };

  const handleMarkHorny = () => {
    setIsHorny(!isHorny);
    api.updateBookmark(fanfic.id, { outrageouslyHorny: !isHorny });
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 bg-purple-500/20 text-purple-400 rounded uppercase">
              {fanfic.rating || 'Not Rated'}
            </span>
            <span className="text-xs text-gray-500">ALL</span>
            {fanfic.complete && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-1 group-hover:text-purple-400 transition-colors">
            {fanfic.title}
          </h3>
          <p className="text-sm text-gray-400">
            by <span className="text-purple-400">{fanfic.author}</span>
          </p>
          {fanfic.relationships && (
            <p className="text-sm text-pink-400 mt-1">
              💕 {fanfic.relationships}
            </p>
          )}
        </div>
        <a
          href={fanfic.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title="Read on AO3"
        >
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </a>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-300 line-clamp-2 mb-4 italic">
        "{fanfic.summary || 'No summary available'}"
      </p>

      {/* Special Badges */}
      {(isHorny || gaveThanks) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {isHorny && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-pink-600 to-red-600 text-white animate-pulse">
              🔥 OUTRAGEOUSLY HORNY
            </span>
          )}
          {gaveThanks && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              ✓ Thanks given
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{fanfic.chapter_count || 1} chapters</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            style={{ width: fanfic.complete ? '100%' : '50%' }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {fanfic.tags?.slice(0, 3).map((tag, i) => (
          <span key={i} className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">
            #{tag.name}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleGiveThanks}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            gaveThanks
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {gaveThanks ? '✓ Thanks!' : '🙏 Thanks'}
        </button>
        <button
          onClick={handleMarkHorny}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            isHorny
              ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {isHorny ? '🔥 Horny!' : '🔥 Horny'}
        </button>
        <button className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-xs font-medium">
          Read →
        </button>
      </div>
    </div>
  );
}

function DemoCard({ title, author, tags, progress = 0, isCompleted = false }) {
  const [gaveThanks, setGaveThanks] = useState(false);
  const [isHorny, setIsHorny] = useState(false);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 bg-purple-500/20 text-purple-400 rounded uppercase">
              Mature
            </span>
            <span className="text-xs text-gray-500">ALL</span>
            {isCompleted && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-1 group-hover:text-purple-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-400">
            by <span className="text-purple-400">{author}</span>
          </p>
        </div>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <p className="text-sm text-gray-300 line-clamp-2 mb-4 italic">
        "A story that will take you on an emotional journey through love, loss, and redemption..."
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, i) => (
          <span key={i} className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setGaveThanks(!gaveThanks)}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            gaveThanks
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {gaveThanks ? '✓ Thanks!' : '🙏 Thanks'}
        </button>
        <button
          onClick={() => setIsHorny(!isHorny)}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            isHorny
              ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {isHorny ? '🔥 Horny!' : '🔥 Horny'}
        </button>
        <button className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-xs font-medium">
          Read →
        </button>
      </div>
    </div>
  );
}
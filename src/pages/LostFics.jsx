import React, { useState } from 'react';
import {
  Search,
  Plus,
  HelpCircle,
  Users,
  TrendingUp,
  Award,
  MessageCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

export default function LostFics() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, searching, found

  // Mock data - in production, this would come from the API
  const lostFics = [
    {
      id: 1,
      title: "Can't remember the title",
      fandom: "Harry Potter",
      description: "Looking for a fic where Harry is raised by Sirius and they live in France. Harry goes to Beauxbatons instead of Hogwarts.",
      rememberedDetails: "There was a scene with a dragon, Harry could speak French fluently",
      status: "searching",
      responses: 3,
      bountyPoints: 50,
      postedBy: "bookworm92",
      postedAt: "2 hours ago",
      viewCount: 45
    },
    {
      id: 2,
      title: "Time travel fix-it fic",
      fandom: "Marvel",
      description: "Tony Stark goes back in time after Endgame to fix everything. He prevents the Chitauri invasion.",
      rememberedDetails: "Published around 2019-2020, was on AO3, over 100k words",
      status: "found",
      foundUrl: "https://archiveofourown.org/works/example",
      responses: 7,
      bountyPoints: 100,
      postedBy: "ironmanfan",
      postedAt: "1 day ago",
      viewCount: 128,
      foundBy: "ficfinder"
    }
  ];

  const filteredFics = lostFics.filter(fic => {
    if (filter !== 'all' && fic.status !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return fic.description.toLowerCase().includes(query) ||
             fic.fandom.toLowerCase().includes(query) ||
             fic.rememberedDetails.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lost Fic Finder</h1>
          <p className="text-gray-600 mt-1">Help others find their lost stories and get help finding yours</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post Lost Fic
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Search}
          title="Currently Searching"
          value="247"
          change="+12 this week"
        />
        <StatCard
          icon={CheckCircle}
          title="Found This Month"
          value="89"
          change="+23% vs last month"
        />
        <StatCard
          icon={Users}
          title="Active Helpers"
          value="1,342"
          change="Online now: 43"
        />
        <StatCard
          icon={Award}
          title="Success Rate"
          value="36%"
          change="Above average"
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by fandom, description, or details..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="searching">Still Searching</option>
              <option value="found">Found</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lost Fics List */}
      <div className="space-y-4">
        {filteredFics.map((fic) => (
          <LostFicCard key={fic.id} fic={fic} />
        ))}

        {filteredFics.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lost fics found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Create Lost Fic Modal */}
      {showCreateModal && (
        <CreateLostFicModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, title, value, change }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-xs text-gray-500">{change}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

function LostFicCard({ fic }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              fic.status === 'found'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {fic.status === 'found' ? 'FOUND' : 'SEARCHING'}
            </span>
            <span className="text-sm text-gray-500">{fic.fandom}</span>
            {fic.bountyPoints > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Award className="w-3 h-3 mr-1" />
                {fic.bountyPoints} points
              </span>
            )}
          </div>

          <h3 className="font-medium text-gray-900 mb-2">{fic.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{fic.description}</p>

          {fic.rememberedDetails && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-500 font-medium mb-1">Remembered details:</p>
              <p className="text-sm text-gray-700">{fic.rememberedDetails}</p>
            </div>
          )}

          {fic.status === 'found' && fic.foundUrl && (
            <div className="bg-green-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-green-700 font-medium mb-1">Found by @{fic.foundBy}:</p>
              <a
                href={fic.foundUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:text-green-700 underline"
              >
                {fic.foundUrl}
              </a>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              @{fic.postedBy}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {fic.postedAt}
            </span>
            <span className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {fic.responses} responses
            </span>
            <span>{fic.viewCount} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateLostFicModal({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    fandom: '',
    description: '',
    rememberedDetails: '',
    lastSeenDate: '',
    bountyPoints: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission
    console.log('Submitting:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Post a Lost Fic Request</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title or Description
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="What do you remember about the title?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fandom
            </label>
            <input
              type="text"
              value={formData.fandom}
              onChange={(e) => setFormData({...formData, fandom: e.target.value})}
              placeholder="e.g., Harry Potter, Marvel, Star Wars"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the plot, main characters, and any key scenes you remember..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Other Details (optional)
            </label>
            <textarea
              value={formData.rememberedDetails}
              onChange={(e) => setFormData({...formData, rememberedDetails: e.target.value})}
              placeholder="Any other details like when/where you read it, author name, specific tags, word count..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Seen (optional)
              </label>
              <input
                type="text"
                value={formData.lastSeenDate}
                onChange={(e) => setFormData({...formData, lastSeenDate: e.target.value})}
                placeholder="e.g., 2020, last summer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bounty Points (optional)
              </label>
              <input
                type="number"
                value={formData.bountyPoints}
                onChange={(e) => setFormData({...formData, bountyPoints: parseInt(e.target.value) || 0})}
                min="0"
                max="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
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
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Post Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
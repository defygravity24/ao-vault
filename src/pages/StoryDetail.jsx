import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Book, Heart, ExternalLink, Download, Trash2, Star, Coffee } from 'lucide-react';

export default function StoryDetail() {
  const navigate = useNavigate();

  // Demo data matching the screenshot
  const story = {
    title: "First of Her Name",
    author: "TheWinterRoses",
    isExplicit: true,
    wordCount: 107666,
    chapters: { current: 20, total: null }, // WIP
    status: "WIP",
    language: "English",
    summary: '"I thought you could go to her and offer her comfort.""In her chambers...? I... I wouldn\'t know what to say..."(After having my work plagiarized, I\'m finally reposting to come out of anonymity to make it easier to link my work to my story.)',
    fandoms: ["Game of Thrones", "A Song of Ice and Fire"],
    rating: "Explicit",
    warnings: ["Creator Chose Not To Use Archive Warnings"],
    categories: ["F/M"],
    characters: ["Sansa Stark", "Tyrion Lannister"],
    relationships: ["Sansa Stark/Tyrion Lannister"],
    additionalTags: [
      "Alternate Universe - Canon Divergence",
      "Romance",
      "Slow Burn",
      "Political Intrigue",
      "Hurt/Comfort"
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Status Bar (simulated) */}
      <div className="flex justify-between items-center px-4 py-2 text-xs text-white/80">
        <div>11:33</div>
        <div className="flex gap-1">
          <span>📶</span>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-black/90 backdrop-blur sticky top-0 z-10 border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/library')}
              className="text-yellow-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">🔒</span>
              <h1 className="text-lg font-medium">AOVault</h1>
              <span className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded font-bold">
                D
              </span>
            </div>
          </div>
          <button className="text-yellow-500">
            🏆
          </button>
        </div>

        {/* Back to Library link */}
        <div className="px-4 pb-2">
          <button
            onClick={() => navigate('/library')}
            className="text-blue-400 text-sm flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Library
          </button>
        </div>
      </div>

      {/* Story Content */}
      <div className="px-4 py-4">
        {/* Title and Metadata */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-semibold flex-1 pr-2">
              {story.title}
            </h2>
            {story.isExplicit && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold">
                Explicit
              </span>
            )}
          </div>

          <p className="text-gray-400 text-sm mb-4">
            by {story.author}
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button className="flex items-center justify-center gap-2 bg-gray-800 py-2.5 px-4 rounded-lg text-sm">
              <Book className="w-4 h-4" />
              Read
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-800 py-2.5 px-4 rounded-lg text-sm">
              <Heart className="w-4 h-4" />
              Favorite
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-800 py-2.5 px-4 rounded-lg text-sm">
              <ExternalLink className="w-4 h-4" />
              View on AO3
            </button>
            <button className="flex items-center justify-center gap-2 bg-yellow-600 py-2.5 px-4 rounded-lg text-sm font-medium">
              <Star className="w-4 h-4" />
              Elite Vault
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-800 py-2.5 px-4 rounded-lg text-sm">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="flex items-center justify-center gap-2 bg-red-600/20 text-red-500 py-2.5 px-4 rounded-lg text-sm">
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{story.wordCount.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Words</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">
                {story.chapters.current}/{story.chapters.total || '?'}
              </div>
              <div className="text-xs text-gray-400">Chapters</div>
            </div>
          </div>

          {/* Status and Language */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-yellow-500">{story.status}</div>
              <div className="text-xs text-gray-400">Status</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold">{story.language}</div>
              <div className="text-xs text-gray-400">Language</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            SUMMARY
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {story.summary}
          </p>
        </div>

        {/* Fandoms */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            FANDOMS
          </h3>
          <div className="flex flex-wrap gap-2">
            {story.fandoms.map((fandom, i) => (
              <span key={i} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {fandom}
              </span>
            ))}
          </div>
        </div>

        {/* Rating & Warnings */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 mb-4">
          <div className="mb-3">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Rating:
            </span>
            <span className="ml-2 text-red-500 font-semibold">{story.rating}</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Warnings:
            </span>
            <span className="ml-2 text-gray-300 text-sm">{story.warnings[0]}</span>
          </div>
        </div>

        {/* Characters & Relationships */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            CHARACTERS
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {story.characters.map((char, i) => (
              <span key={i} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {char}
              </span>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            RELATIONSHIPS
          </h3>
          <div className="flex flex-wrap gap-2">
            {story.relationships.map((rel, i) => (
              <span key={i} className="bg-purple-900/50 border border-purple-700 px-3 py-1 rounded-full text-sm">
                {rel}
              </span>
            ))}
          </div>
        </div>

        {/* Additional Tags */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            ADDITIONAL TAGS
          </h3>
          <div className="flex flex-wrap gap-2">
            {story.additionalTags.map((tag, i) => (
              <span key={i} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with Ko-fi Support */}
      <div className="mt-12 px-4 py-8 border-t border-gray-800">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">
            Enjoying AO Vault? Keep it free for everyone!
          </p>
          <Link
            to="/support"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Coffee className="w-4 h-4 mr-2" />
            <span className="text-sm">Support on Ko-fi</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
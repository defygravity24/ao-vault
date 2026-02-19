import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpen,
  TrendingUp,
  Clock,
  Star,
  Folder,
  Tag,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userResponse = await api.getCurrentUser();
      setStats(userResponse.data.stats);

      // In a real app, we'd have an activity endpoint
      setRecentActivity([]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.displayName || user?.username}!
        </h1>
        <p className="text-white/90">
          Your personal fanfiction vault awaits
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          title="Saved Fanfics"
          value={stats?.fanfictionCount || 0}
          color="blue"
          link="/library"
        />
        <StatCard
          icon={Folder}
          title="Folders"
          value={stats?.folderCount || 0}
          color="green"
          link="/library"
        />
        <StatCard
          icon={Tag}
          title="Tags"
          value={stats?.tagCount || 0}
          color="purple"
          link="/library"
        />
        <StatCard
          icon={AlertCircle}
          title="Lost Fics Found"
          value={stats?.lostFicCount || 0}
          color="orange"
          link="/lost-fics"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            title="Add from AO3"
            description="Save a new fanfiction from Archive of Our Own"
            icon="📚"
            onClick={() => {/* Handle add */}}
          />
          <QuickAction
            title="Search Lost Fic"
            description="Find that story you can't remember"
            icon="🔍"
            onClick={() => {/* Handle search */}}
          />
          <QuickAction
            title="Create Reading List"
            description="Organize your stories into collections"
            icon="📝"
            onClick={() => {/* Handle create */}}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link to="/library" className="text-primary-500 text-sm hover:text-primary-600">
              View all
            </Link>
          </div>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent activity. Start by adding some fanfics!</p>
          )}
        </div>

        {/* Reading Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Currently Reading</h2>
            <Link to="/library?filter=reading" className="text-primary-500 text-sm hover:text-primary-600">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">No stories currently being read</p>
          </div>
        </div>
      </div>

      {/* Storage Usage (for free users) */}
      {!user?.isPremium && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Storage Usage</h3>
              <p className="text-sm text-gray-600">
                {formatBytes(user?.storageUsed || 0)} of {formatBytes(user?.storageLimit || 1073741824)} used
              </p>
              <div className="w-64 bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${((user?.storageUsed || 0) / (user?.storageLimit || 1073741824)) * 100}%` }}
                ></div>
              </div>
            </div>
            <Link
              to="/upgrade"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color, link }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Link to={link} className="block">
      <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function QuickAction({ title, description, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
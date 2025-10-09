import React from 'react';
import { Users, BookOpen, FileQuestion, TrendingUp, Calendar, Award } from 'lucide-react';

const DashboardOverview = () => {
  const stats = [
    { title: 'Total Students', value: '248', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { title: 'Total Courses', value: '12', change: '+2', icon: BookOpen, color: 'bg-green-500' },
    { title: 'Total Questions', value: '456', change: '+45', icon: FileQuestion, color: 'bg-purple-500' },
    { title: 'Active Enrollments', value: '1,847', change: '+18%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const recentActivities = [
    { id: 1, action: 'New student enrolled', name: 'John Doe', time: '5 minutes ago' },
    { id: 2, action: 'Course completed', name: 'Jane Smith', time: '1 hour ago' },
    { id: 3, action: 'New question added', name: 'Admin', time: '2 hours ago' },
    { id: 4, action: 'Student updated', name: 'Mike Johnson', time: '3 hours ago' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Korean Culture Workshop', date: 'Oct 10, 2024', time: '2:00 PM' },
    { id: 2, title: 'Grammar Quiz Session', date: 'Oct 12, 2024', time: '10:00 AM' },
    { id: 3, title: 'Speaking Practice Group', date: 'Oct 15, 2024', time: '3:00 PM' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.name}</span> - {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {event.date} at {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Award className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">85%</p>
            <p className="text-sm text-gray-600">Average Completion Rate</p>
          </div>
          <div className="text-center">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">92%</p>
            <p className="text-sm text-gray-600">Student Satisfaction</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">+23%</p>
            <p className="text-sm text-gray-600">Growth This Month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
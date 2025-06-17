import Link from 'next/link';

export default function Dashboard() {
  const stats = [
    { label: 'Cards', value: '3', color: 'bg-blue-500' },
    { label: 'Stars', value: '3', color: 'bg-yellow-500' },
    { label: 'Mentors', value: '1', color: 'bg-green-500' },
    { label: 'Systems', value: '4', color: 'bg-purple-500' },
  ];

  const quickActions = [
    { href: '/cards', label: 'View Cards', description: 'Browse all application cards', icon: '🃏' },
    { href: '/stars', label: 'View Stars', description: 'Explore the star system', icon: '⭐' },
    { href: '/exports', label: 'Generate Export', description: 'Create documentation exports', icon: '📄' },
    { href: '/editor', label: 'Edit Data', description: 'Modify YAML data files', icon: '✏️' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Rogue Resident Documentation System
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Custom structured documentation for the Rogue Resident educational game.
          Manage cards, stars, mentors, and export targeted documentation for development.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-md p-3`}>
                <div className="text-white text-xl font-bold">{stat.value}</div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 block"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{action.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {action.label}
                  </h3>
                  <p className="text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Created Treatment Planning cards system</span>
                <span className="text-gray-400">Just now</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Added core star system data</span>
                <span className="text-gray-400">Just now</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Initialized documentation system</span>
                <span className="text-gray-400">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
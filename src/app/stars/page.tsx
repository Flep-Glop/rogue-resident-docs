'use client';

import { useEffect, useState } from 'react';
import { SystemData } from '@/lib/dataUtils';

interface Star {
  name: string;
  domain: string;
  description: string;
  requirements: string[];
  rewards: string[];
  visual_theme: string;
  implementation_notes?: string;
}

export default function StarsPage() {
  const [starsData, setStarsData] = useState<Record<string, SystemData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStars() {
      try {
        const response = await fetch('/api/stars');
        if (!response.ok) {
          throw new Error('Failed to fetch stars');
        }
        const data = await response.json();
        setStarsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchStars();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading stars...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">Error: {error}</div>
      </div>
    );
  }

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'TP': return 'bg-blue-100 text-blue-800';
      case 'IM': return 'bg-green-100 text-green-800';
      case 'PH': return 'bg-purple-100 text-purple-800';
      case 'QA': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Star System</h1>
        <div className="text-sm text-gray-500">
          {Object.keys(starsData).length} star system(s)
        </div>
      </div>

      {Object.entries(starsData).map(([systemKey, systemData]) => (
        <div key={systemKey} className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {systemData.system_info.name}
            </h2>
            <p className="text-gray-600 mt-1">{systemData.system_info.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              Total Stars: {systemData.system_info.total_stars} | 
              Stars Defined: {Object.keys(systemData.stars || {}).length}
            </div>
            {systemData.system_info.domains && (
              <div className="mt-2 flex flex-wrap gap-1">
                {systemData.system_info.domains.map((domain: string) => (
                  <span
                    key={domain}
                    className={`px-2 py-1 rounded text-xs font-medium ${getDomainColor(domain)}`}
                  >
                    {domain}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="grid gap-6">
              {Object.entries(systemData.stars || {}).map(([starId, star]) => {
                const starData = star as Star;
                return (
                  <div key={starId} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          ⭐ {starData.name}
                        </h3>
                        <p className="text-gray-600 mt-1">{starData.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDomainColor(starData.domain)}`}>
                        {starData.domain}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {starData.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Rewards</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {starData.rewards.map((reward, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {reward}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Visual Theme</h4>
                      <p className="text-sm text-gray-600 italic">{starData.visual_theme}</p>
                    </div>

                    {starData.implementation_notes && (
                      <div className="bg-blue-50 p-3 rounded">
                        <h4 className="font-medium text-gray-900 mb-1">Implementation Notes</h4>
                        <p className="text-sm text-gray-600">{starData.implementation_notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 
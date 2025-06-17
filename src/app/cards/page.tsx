'use client';

import { useEffect, useState } from 'react';
import { SystemData } from '@/lib/dataUtils';

interface Card {
  name: string;
  domain: string;
  associated_star: string;
  passive_effect: string;
  active_effect: string;
  insight_cost: number;
  unlock_season: string;
  visual_design: string;
  tags: string[];
  implementation_priority: string;
  cursor_notes?: string;
}

export default function CardsPage() {
  const [cardsData, setCardsData] = useState<Record<string, SystemData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await fetch('/api/cards');
        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }
        const data = await response.json();
        setCardsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading cards...</div>
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Application Cards</h1>
        <div className="text-sm text-gray-500">
          {Object.keys(cardsData).length} card system(s)
        </div>
      </div>

      {Object.entries(cardsData).map(([systemKey, systemData]) => (
        <div key={systemKey} className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {systemData.system_info.name}
            </h2>
            <p className="text-gray-600 mt-1">{systemData.system_info.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              Domain: {systemData.system_info.domain} | 
              Cards: {Object.keys(systemData.cards || {}).length}
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-6">
              {Object.entries(systemData.cards || {}).map(([cardId, card]) => {
                const cardData = card as Card;
                return (
                  <div key={cardId} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cardData.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">
                            {cardData.domain}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            {cardData.insight_cost} Insight
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            {cardData.unlock_season}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(cardData.implementation_priority)}`}>
                        {cardData.implementation_priority} priority
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Passive Effect</h4>
                        <p className="text-sm text-gray-600">{cardData.passive_effect}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Active Effect</h4>
                        <p className="text-sm text-gray-600">{cardData.active_effect}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Visual Design</h4>
                      <p className="text-sm text-gray-600 italic">{cardData.visual_design}</p>
                    </div>

                    {cardData.cursor_notes && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-1">Development Notes</h4>
                        <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                          {cardData.cursor_notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {cardData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        Associated Star: {cardData.associated_star}
                      </div>
                    </div>
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
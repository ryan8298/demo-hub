'use client';

import { useEffect, useState } from 'react';
import { Demo } from '@/lib/types';

export default function MicrosoftHub() {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/demos?audience=microsoft')
      .then(res => res.json())
      .then(data => {
        setDemos(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20 text-white">Loading demos...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Solution Demos</h1>
        <p className="text-slate-400 mb-12">Discover how our solutions can transform your business</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <div key={demo.id} className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
              {demo.preview_image_url && (
                <img
                  src={demo.preview_image_url}
                  alt={demo.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{demo.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{demo.description}</p>

                <button
                  onClick={() => setExpandedId(expandedId === demo.id ? null : demo.id)}
                  className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                >
                  {expandedId === demo.id ? '↑ Hide Details' : '↓ View Details'}
                </button>

                {expandedId === demo.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                    {demo.roi_summary && (
                      <div className="bg-slate-700/50 rounded p-3">
                        <h4 className="text-sm font-semibold text-white mb-2">💰 ROI Summary</h4>
                        <p className="text-slate-300 text-sm">{demo.roi_summary}</p>
                      </div>
                    )}

                    {demo.deployment_timeline && demo.deployment_timeline.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">📅 Deployment Timeline</h4>
                        {demo.deployment_timeline.map((phase, idx) => (
                          <div key={idx} className="text-sm text-slate-400 mb-2">
                            <span className="font-semibold text-white">{phase.phase}:</span> {phase.duration}
                          </div>
                        ))}
                      </div>
                    )}

                    
                      href={demo.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
                    >
                      Open Demo →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f0d' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#7fac3d' }}></div>
          <p className="mt-4" style={{ color: '#7fac3d' }}>Loading solutions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0f0d' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#e0dfd5' }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
            Solution Demos for Microsoft Teams
          </h1>
          <p className="text-lg" style={{ color: '#666666' }}>
            Discover how our solutions can transform your business
          </p>
        </div>
      </div>

      {/* Demo Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {demos.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: '#666666' }} className="text-lg">No demos available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="rounded-lg overflow-hidden transition hover:shadow-xl cursor-pointer group"
                style={{
                  background: '#f3f3e9',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
                onClick={() => setExpandedId(expandedId === demo.id ? null : demo.id)}
              >
                {/* Demo Preview Image */}
                <div
                  className="w-full h-56 bg-gradient-to-br flex items-center justify-center overflow-hidden relative"
                  style={{
                    background: 'linear-gradient(135deg, #b2eeda 0%, #7fac3d 100%)',
                  }}
                >
                  {demo.preview_image_url ? (
                    <img
                      src={demo.preview_image_url}
                      alt={demo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🚀</div>
                      <p style={{ color: '#f3f3e9' }} className="text-sm font-semibold">
                        Demo Preview
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold" style={{ color: '#1a1a1a' }}>
                      {demo.title}
                    </h3>
                  </div>

                  <p className="mb-4 text-sm" style={{ color: '#666666' }}>
                    {demo.description}
                  </p>

                  {/* Industry/Vertical Badge - placeholder for future metadata */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: '#e8f5e0',
                        color: '#7fac3d',
                      }}
                    >
                      Microsoft
                    </span>
                  </div>

                  {/* Expand Button */}
                  <button
                    className="font-semibold text-sm transition flex items-center gap-2"
                    style={{ color: '#7fac3d' }}
                    onMouseEnter={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(expandedId === demo.id ? null : demo.id);
                    }}
                  >
                    {expandedId === demo.id ? '↑ Hide Details' : '↓ View Details'}
                  </button>

                  {/* Expanded Details */}
                  {expandedId === demo.id && (
                    <div className="mt-6 pt-6 border-t" style={{ borderColor: '#e0dfd5' }}>
                      {demo.roi_summary && (
                        <div className="mb-4 p-4 rounded" style={{ background: '#f0f8ed' }}>
                          <h4 className="text-sm font-semibold mb-2" style={{ color: '#7fac3d' }}>
                            💰 ROI Summary
                          </h4>
                          <p className="text-sm" style={{ color: '#666666' }}>
                            {demo.roi_summary}
                          </p>
                        </div>
                      )}

                      {demo.deployment_timeline && demo.deployment_timeline.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
                            📅 Implementation Timeline
                          </h4>
                          <div className="space-y-2">
                            {demo.deployment_timeline.map((phase, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-semibold" style={{ color: '#7fac3d' }}>
                                  {phase.phase}:
                                </span>{' '}
                                <span style={{ color: '#666666' }}>{phase.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <a
                        href={demo.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded font-semibold text-sm transition"
                        style={{
                          background: '#7fac3d',
                          color: '#f3f3e9',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#6a9530';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#7fac3d';
                        }}
                      >
                        Open Demo →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

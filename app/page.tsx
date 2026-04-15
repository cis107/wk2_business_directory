'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cards')
        .select(`
          id, name, title, company, phone, email, website,
          categories (name, color_classes)
        `)
        .order('name', { ascending: true });

      if (error) throw error;
      setCards((data as any) || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  // Helper function to generate DiceBear URL
  const getAvatarUrl = (name: string) => {
    // encodeURIComponent handles spaces and special characters in names
    const seed = encodeURIComponent(name);
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 font-serif">
          Professional Directory
        </h1>
        <p className="text-lg text-gray-600">
          Connecting {cards.length} local experts.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              {/* DiceBear Avatar */}
              <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden ring-4 ring-gray-50">
                <img
                  src={getAvatarUrl(card.name)}
                  alt={card.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {card.name}
                </h2>
                <p className="text-blue-600 font-medium text-sm">
                  {card.title}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-gray-600 text-sm mb-6 flex-grow">
              <p className="font-semibold text-gray-800 uppercase tracking-tight italic">
                {card.company}
              </p>
              <div className="flex flex-col gap-1">
                <span>📞 {card.phone}</span>
                <span className="truncate">📧 {card.email}</span>
              </div>
              {card.website && (
                <a
                  href={card.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-500 hover:underline font-medium"
                >
                  Visit Website →
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-gray-50">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  card.categories?.color_classes || 'bg-gray-100 text-gray-800'
                }`}
              >
                {card.categories?.name || 'General'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
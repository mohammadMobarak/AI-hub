import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Plus, ExternalLink, Trash2, Edit } from 'lucide-react';

interface AICard {
  id: string;
  title: string;
  description: string;
  link: string;
  user_id: string;
}

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [cards, setCards] = useState<AICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({ title: '', description: '', link: '' });
  const [editingCard, setEditingCard] = useState<AICard | null>(null);

  useEffect(() => {
    fetchCards();
  }, [user.id]);

  async function fetchCards() {
    const { data, error } = await supabase
      .from('ai_cards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cards:', error);
    } else {
      setCards(data || []);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (editingCard) {
      const { error } = await supabase
        .from('ai_cards')
        .update({
          title: newCard.title,
          description: newCard.description,
          link: newCard.link,
        })
        .eq('id', editingCard.id);

      if (!error) {
        await fetchCards();
        setEditingCard(null);
      }
    } else {
      const { error } = await supabase
        .from('ai_cards')
        .insert([
          {
            title: newCard.title,
            description: newCard.description,
            link: newCard.link,
            user_id: user.id,
          },
        ]);

      if (!error) {
        await fetchCards();
      }
    }

    setShowAddModal(false);
    setNewCard({ title: '', description: '', link: '' });
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('ai_cards')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchCards();
    }
  }

  function handleEdit(card: AICard) {
    setEditingCard(card);
    setNewCard({
      title: card.title,
      description: card.description,
      link: card.link,
    });
    setShowAddModal(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My AI Tools Collection</h1>
          <p className="mt-2 text-gray-600">Manage your personal AI tools collection</p>
        </div>
        <button
          onClick={() => {
            setEditingCard(null);
            setNewCard({ title: '', description: '', link: '' });
            setShowAddModal(true);
          }}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Tool
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">You haven't added any AI tools yet.</p>
          <p className="text-gray-500 mt-2">Click the "Add New Tool" button to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(card)}
                    className="text-gray-600 hover:text-blue-500"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="text-gray-600 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit Tool
              </a>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingCard ? 'Edit AI Tool' : 'Add New AI Tool'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newCard.title}
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Link
                </label>
                <input
                  type="url"
                  value={newCard.link}
                  onChange={(e) => setNewCard({ ...newCard, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {editingCard ? 'Save Changes' : 'Add Tool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
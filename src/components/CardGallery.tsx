import { useState } from 'react';
import { SnorlaxCard } from '../types/card';
import { Check, Plus, X } from 'lucide-react';

interface CardGalleryProps {
  cards: SnorlaxCard[];
  onTogglePossessed: (id: string, possessed: boolean) => void;
  onUpdateImage: (id: string, imageUrl: string) => void;
}

export function CardGallery({ cards, onTogglePossessed, onUpdateImage }: CardGalleryProps) {
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [imageInput, setImageInput] = useState('');

  const handleImageSubmit = (cardId: string) => {
    if (imageInput.trim()) {
      onUpdateImage(cardId, imageInput.trim());
      setEditingCard(null);
      setImageInput('');
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#F4D35E]/50"
        >
          <button
            onClick={() => onTogglePossessed(card.id, !card.possessed)}
            className="relative w-full aspect-[2/3] bg-gradient-to-br from-slate-700 to-slate-900 group cursor-pointer hover:brightness-110 transition-all"
          >
            {card.image_url ? (
              <img
                src={card.image_url}
                alt={card.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <span className="text-xs">No image</span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {editingCard === card.id ? (
                <div className="w-full px-2 space-y-2">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Image URL"
                    className="w-full px-2 py-1 rounded-lg bg-white text-slate-900 text-xs"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageSubmit(card.id);
                      }}
                      className="flex-1 bg-[#F4D35E] hover:bg-[#F4D35E]/80 text-slate-900 px-2 py-1 rounded-lg font-semibold text-xs transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCard(null);
                        setImageInput('');
                      }}
                      className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCard(card.id);
                    setImageInput(card.image_url);
                  }}
                  className="w-12 h-12 rounded-full bg-[#F95738] hover:bg-[#F95738]/80 flex items-center justify-center transition-colors shadow-lg"
                >
                  <Plus className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            <div
              className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-lg ${
                card.possessed
                  ? 'bg-[#119DA4] text-white'
                  : 'bg-white/80 text-slate-600'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {card.possessed && <Check className="w-3.5 h-3.5" />}
            </div>
          </button>

          <div className="p-2 space-y-1">
            <h3 className="font-bold text-white text-xs">{card.name}</h3>
            <div className="space-y-0.5 text-xs">
              <p className="text-[#F4D35E] line-clamp-1">{card.set}</p>
              <div className="flex justify-between text-slate-400">
                <span>#{card.number}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

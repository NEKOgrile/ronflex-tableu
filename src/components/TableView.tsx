import { useState } from 'react';
import { SnorlaxCard } from '../types/card';
import { Check, Plus, X } from 'lucide-react';

interface TableViewProps {
  cards: SnorlaxCard[];
  onTogglePossessed: (id: string, possessed: boolean) => void;
  onUpdateImage: (id: string, imageUrl: string) => void;
  isEditMode: boolean;
  onOpenImage: (imageUrl: string | null) => void;
}

export function TableView({ cards, onTogglePossessed, onUpdateImage, isEditMode, onOpenImage }: TableViewProps) {
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [imageInput, setImageInput] = useState('');

  const handleImageSubmit = (cardId: string) => {
    onUpdateImage(cardId, imageInput.trim());
    setEditingCard(null);
    setImageInput('');
  };


  return (
    <div className="overflow-x-auto rounded-xl border border-white/20">
      <table className="w-full bg-white/5 backdrop-blur-sm">
        <thead>
          <tr className="border-b border-white/20 bg-white/10">
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#F4D35E] w-16">POSSÉDÉE</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#F4D35E] w-20">IMAGE</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#F4D35E]">NOM DE LA CARTE</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#F4D35E]">SET / EXTENSION</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#F4D35E] w-20">N°</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#F4D35E] w-24">DATE</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#F4D35E]">RARETÉ</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#F4D35E]">TYPE</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#F4D35E] w-20">LANGUE</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#F4D35E] w-24">PRINCIPAL?</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card, index) => (
            <tr
              key={card.id}
              className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                index % 2 === 0 ? 'bg-white/[0.02]' : ''
              }`}
            >
              <td className="px-4 py-3">
                <button
                  onClick={() => {
                    if (isEditMode) {
                      onTogglePossessed(card.id, !card.possessed);
                    } else {
                      onOpenImage(card.image_url ?? null);
                    }
                  }}
                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                    card.possessed
                      ? 'bg-[#119DA4] text-white'
                      : 'border-2 border-white/30 text-transparent hover:border-white/50'
                  }`}
                >
                  {card.possessed && <Check className="w-4 h-4" />}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="relative group">
                  {card.image_url ? (
                    <img
                      src={card.image_url}
                      alt={card.name}
                      className="w-16 h-20 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-white/10 rounded-lg flex items-center justify-center text-xs text-slate-400">
                      —
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (isEditMode) {
                        setEditingCard(card.id);
                        setImageInput(card.image_url ?? '');
                      } else {
                        onOpenImage(card.image_url ?? null);
                      }
                    }}
                    className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>

                {editingCard === card.id && isEditMode && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#2D4059] rounded-xl p-6 w-full max-w-md space-y-4 border border-white/20">
                      <h3 className="text-white font-bold">Update Image URL</h3>
                      <input
                        type="text"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        placeholder="Enter image URL"
                        className="w-full px-4 py-2 rounded-lg bg-white/90 text-slate-900"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleImageSubmit(card.id);
                          }
                        }}
                        onBlur={() => handleImageSubmit(card.id)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCard(null);
                            setImageInput('');
                          }}
                          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-white font-semibold">{card.name}</td>
              <td className="px-4 py-3 text-[#F4D35E]">{card.set}</td>
              <td className="px-4 py-3 text-slate-300 text-center text-sm">{card.number}</td>
              <td className="px-4 py-3 text-slate-300 text-center text-sm">~{card.release_date}</td>
              <td className="px-4 py-3">
                <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm">
                  {card.rarity}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-300 text-sm">{card.type}</td>
              <td className="px-4 py-3 text-slate-300 text-center text-sm font-mono">{card.language}</td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`font-semibold ${
                    card.principal === 'Oui' ? 'text-green-400' : 'text-slate-400'
                  }`}
                >
                  {card.principal}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

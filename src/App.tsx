import { useState, useEffect, useMemo } from 'react';
import { supabase } from './lib/supabase';
import { SnorlaxCard } from './types/card';
import { CardGallery } from './components/CardGallery';
import { TableView } from './components/TableView';
import { FilterBar } from './components/FilterBar';
import { Grid3X3, Table as TableIcon } from 'lucide-react';

function App() {
  const [cards, setCards] = useState<SnorlaxCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedPrincipal, setSelectedPrincipal] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('snorlax_cards')
        .select('*')
        .order('release_date', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePossessed = async (id: string, possessed: boolean) => {
    try {
      const { error } = await supabase
        .from('snorlax_cards')
        .update({ possessed })
        .eq('id', id);

      if (error) throw error;

      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, possessed } : card))
      );
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleUpdateImage = async (id: string, imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('snorlax_cards')
        .update({ image_url: imageUrl })
        .eq('id', id);

      if (error) throw error;

      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, image_url: imageUrl } : card))
      );
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSet = !selectedSet || card.set === selectedSet;
      const matchesRarity = !selectedRarity || card.rarity === selectedRarity;
      const matchesLanguage = !selectedLanguage || card.language === selectedLanguage;
      const matchesPrincipal = !selectedPrincipal || card.principal === selectedPrincipal;

      return matchesSearch && matchesSet && matchesRarity && matchesLanguage && matchesPrincipal;
    });
  }, [cards, searchTerm, selectedSet, selectedRarity, selectedLanguage, selectedPrincipal]);

  const sets = useMemo(() => [...new Set(cards.map((card) => card.set))], [cards]);
  const rarities = useMemo(() => [...new Set(cards.map((card) => card.rarity))], [cards]);
  const languages = useMemo(() => [...new Set(cards.map((card) => card.language))], [cards]);

  const possessedCount = cards.filter((card) => card.possessed).length;
  const missingCount = cards.length - possessedCount;
  const completionPercent = cards.length > 0 ? Math.round((possessedCount / cards.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2D4059] via-[#1e2b3d] to-[#2D4059] flex items-center justify-center">
        <div className="text-[#F4D35E] text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D4059] via-[#1e2b3d] to-[#2D4059] text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=1920')] opacity-5 bg-cover bg-center" />

        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <header className="text-center mb-12 space-y-6">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F95738] to-[#F4D35E] mb-2">
              Collection Ronflex
            </h1>
            <p className="text-xl text-slate-300">
              Your complete Snorlax card collection
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl px-6 py-4 backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold text-white">{possessedCount}</div>
                <div className="text-sm text-blue-200">Possédées</div>
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl px-6 py-4 backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold text-white">{missingCount}</div>
                <div className="text-sm text-orange-200">Manquantes</div>
              </div>
              <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl px-6 py-4 backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold text-white">{completionPercent}%</div>
                <div className="text-sm text-teal-200">Complétude</div>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 w-full sm:w-auto">
                <FilterBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedSet={selectedSet}
                  onSetChange={setSelectedSet}
                  selectedRarity={selectedRarity}
                  onRarityChange={setSelectedRarity}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                  selectedPrincipal={selectedPrincipal}
                  onPrincipalChange={setSelectedPrincipal}
                  sets={sets}
                  rarities={rarities}
                  languages={languages}
                />
              </div>

              <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
                <button
                  onClick={() => setViewMode('gallery')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    viewMode === 'gallery'
                      ? 'bg-[#F4D35E] text-slate-900'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                  <span className="hidden sm:inline">Gallery</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    viewMode === 'table'
                      ? 'bg-[#F4D35E] text-slate-900'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
            </div>

            {filteredCards.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-xl">No cards found matching your filters</p>
              </div>
            ) : viewMode === 'gallery' ? (
              <CardGallery
                cards={filteredCards}
                onTogglePossessed={handleTogglePossessed}
                onUpdateImage={handleUpdateImage}
              />
            ) : (
              <TableView
                cards={filteredCards}
                onTogglePossessed={handleTogglePossessed}
                onUpdateImage={handleUpdateImage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

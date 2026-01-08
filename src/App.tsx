import { useState, useEffect, useMemo } from 'react';
import { SnorlaxCard } from './types/card';
import { CardGallery } from './components/CardGallery';
import { TableView } from './components/TableView';
import { FilterBar } from './components/FilterBar';
import { Grid3X3, Table as TableIcon, Plus } from 'lucide-react';
import cardsData from './data/cards.json';

function App() {
  const [cards, setCards] = useState<SnorlaxCard[]>([]);
  const [customCards, setCustomCards] = useState<SnorlaxCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedPrincipal, setSelectedPrincipal] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchCards();
    loadCustomCards();
  }, []);

  const loadCustomCards = () => {
    const stored = localStorage.getItem('customCards');
    if (stored) {
      setCustomCards(JSON.parse(stored));
    }
  };

  const fetchCards = () => {
    // Load possessed status from localStorage
    const possessedData = JSON.parse(localStorage.getItem('possessedCards') || '{}');
    const imageData = JSON.parse(localStorage.getItem('cardImages') || '{}');

    const updatedCards = cardsData.map(card => ({
      ...card,
      possessed: possessedData[card.id] ?? card.possessed,
      image_url: imageData[card.id] ?? card.image_url
    }));

    setCards(updatedCards);
    setLoading(false);
  };

  const handleTogglePossessed = async (id: string, possessed: boolean) => {
    try {
      // Update localStorage
      const possessedData = JSON.parse(localStorage.getItem('possessedCards') || '{}');
      possessedData[id] = possessed;
      localStorage.setItem('possessedCards', JSON.stringify(possessedData));

      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, possessed } : card))
      );
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleUpdateImage = async (id: string, imageUrl: string) => {
    try {
      // Update localStorage
      const imageData = JSON.parse(localStorage.getItem('cardImages') || '{}');
      imageData[id] = imageUrl;
      localStorage.setItem('cardImages', JSON.stringify(imageData));

      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, image_url: imageUrl } : card))
      );
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const handleAddCard = (newCard: Omit<SnorlaxCard, 'id'>) => {
    const card: SnorlaxCard = {
      ...newCard,
      id: Date.now().toString(),
    };
    const updatedCustom = [...customCards, card];
    setCustomCards(updatedCustom);
    localStorage.setItem('customCards', JSON.stringify(updatedCustom));
    setShowAddForm(false);
  };

  const allCards = useMemo(() => {
    const possessedData = JSON.parse(localStorage.getItem('possessedCards') || '{}');
    const imageData = JSON.parse(localStorage.getItem('cardImages') || '{}');

    return [...cards, ...customCards].map(card => ({
      ...card,
      possessed: possessedData[card.id] ?? card.possessed,
      image_url: imageData[card.id] ?? card.image_url
    }));
  }, [cards, customCards]);

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSet = !selectedSet || card.set === selectedSet;
      const matchesRarity = !selectedRarity || card.rarity === selectedRarity;
      const matchesLanguage = !selectedLanguage || card.language === selectedLanguage;
      const matchesPrincipal = !selectedPrincipal || card.principal === selectedPrincipal;

      return matchesSearch && matchesSet && matchesRarity && matchesLanguage && matchesPrincipal;
    });
  }, [allCards, searchTerm, selectedSet, selectedRarity, selectedLanguage, selectedPrincipal]);

  const sets = useMemo(() => [...new Set(allCards.map((card) => card.set))], [allCards]);
  const rarities = useMemo(() => [...new Set(allCards.map((card) => card.rarity))], [allCards]);
  const languages = useMemo(() => [...new Set(allCards.map((card) => card.language))], [allCards]);

  const possessedCount = allCards.filter((card) => card.possessed).length;
  const missingCount = allCards.length - possessedCount;
  const completionPercent = allCards.length > 0 ? Math.round((possessedCount / allCards.length) * 100) : 0;

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

            <div className="flex justify-center mb-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-[#F4D35E] text-slate-900 font-semibold rounded-xl hover:bg-[#F95738] hover:text-white transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Card
              </button>
            </div>

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

      {showAddForm && (
        <AddCardModal onAdd={handleAddCard} onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
}

const AddCardModal = ({ onAdd, onClose }: { onAdd: (card: Omit<SnorlaxCard, 'id'>) => void; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    possessed: false,
    image_url: '',
    name: '',
    set: '',
    number: '',
    release_date: '',
    rarity: '',
    type: '',
    language: '',
    principal: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Add New Card</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={(e) => handleChange('image_url', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
          />
          <input
            type="text"
            placeholder="Set"
            value={formData.set}
            onChange={(e) => handleChange('set', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Number"
            value={formData.number}
            onChange={(e) => handleChange('number', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
            required
          />
          <input
            type="date"
            placeholder="Release Date"
            value={formData.release_date}
            onChange={(e) => handleChange('release_date', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
          />
          <select
            value={formData.rarity}
            onChange={(e) => handleChange('rarity', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
          >
            <option value="">Select Rarity</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Holographic">Holographic</option>
          </select>
          <input
            type="text"
            placeholder="Type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
          />
          <select
            value={formData.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
          >
            <option value="">Select Language</option>
            <option value="EN">EN</option>
            <option value="JP">JP</option>
            <option value="FR">FR</option>
          </select>
          <select
            value={formData.principal}
            onChange={(e) => handleChange('principal', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
          >
            <option value="">Principal?</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={formData.possessed}
              onChange={(e) => handleChange('possessed', e.target.checked)}
            />
            Possessed
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#F4D35E] text-slate-900 font-semibold rounded-lg hover:bg-[#F95738] hover:text-white"
            >
              Add Card
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;

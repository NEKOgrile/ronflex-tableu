import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SnorlaxCard } from './types/card';
import { CardGallery } from './components/CardGallery';
import { TableView } from './components/TableView';
import { FilterBar } from './components/FilterBar';
import { Grid3X3, Table as TableIcon, Plus } from 'lucide-react';
import { supabase } from './lib/supabase';
import { sortCardsByHierarchy } from './lib/sortingUtils';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/Login';

function CardCollectionApp() {
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Vérifier l'authentification pour le mode édition
  const handleEditModeToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsEditMode((v) => !v);
  };

  const handleAddCardClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowAddForm(true);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    
    try {
      // Fetch all cards from Supabase
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('release_date', { ascending: true });

      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log("Cards data:", data);
      console.log("Supabase error:", error);

      if (error) {
        console.error('Error fetching from Supabase:', error);
        // Fallback to localStorage only
        const storedData = localStorage.getItem('cardDatabase');
        if (storedData) {
          const parsed: SnorlaxCard[] = JSON.parse(storedData);
          setCards(parsed as SnorlaxCard[]);
          setCustomCards([]);
        } else {
          setCards([]);
          setCustomCards([]);
        }
      } else if (data) {
        // Normalize IDs and boolean-like fields
        const mapped = data.map((row: any) => ({
          ...row,
          id: String(row.id),
          possessed: !!row.possessed,
          principal: row.principal === true || row.principal === 'true' ? 'true' : 'false',
        })) as SnorlaxCard[];

        // Use DB as source of truth: all fetched rows become `cards`
        setCards(mapped);
        setCustomCards([]);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePossessed = async (id: string, possessed: boolean) => {
    try {
      // Update UI immediately
      setCards((prev) => prev.map((card) => (card.id === id ? { ...card, possessed } : card)));
      setCustomCards((prev) => prev.map((card) => (card.id === id ? { ...card, possessed } : card)));

      // Update Supabase
      const dbId = isNaN(Number(id)) ? id : Number(id);
      const { error } = await supabase
        .from('cards')
        .update({ possessed })
        .eq('id', dbId);

      if (error) {
        console.error('Error updating card:', error);
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

const handleUpdateImage = async (id: string, imageUrl: string) => {
  try {
    const value: string | null = imageUrl.trim() === '' ? null : imageUrl.trim();

    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, image_url: value } : card
      )
    );

    setCustomCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, image_url: value } : card
      )
    );

    const { error } = await supabase
      .from('cards')
      .update({ image_url: value })
      .eq('id', Number(id));

    if (error) {
      console.error('Error updating image:', error);
    }
  } catch (error) {
    console.error('Unexpected error updating image:', error);
  }
};



  const handleExportData = () => {
    const dataStr = JSON.stringify(allCards, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'snorlax-cards-updated.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleAddCard = async (newCardData: Omit<SnorlaxCard, 'id'>) => {
    try {
      // Do not send `id` (let DB generate a numeric id)
      const payload = { ...newCardData } as any;
      const { data: inserted, error } = await supabase
        .from('cards')
        .insert([payload])
        .select('*')
        .single();

      if (error) {
        console.error('Error adding card:', error);
      } else if (inserted) {
        const mapped: SnorlaxCard = {
          ...inserted,
          id: String(inserted.id),
          possessed: !!inserted.possessed,
          principal: inserted.principal === true || inserted.principal === 'true' ? 'true' : 'false',
        } as SnorlaxCard;
        setCustomCards(prev => [...prev, mapped]);
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const allCards = useMemo(() => {
    return [...cards, ...customCards];
  }, [cards, customCards]);

  const filteredCards = useMemo(() => {
    const filtered = allCards.filter((card) => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSet = !selectedSet || card.set === selectedSet;
      const matchesRarity = !selectedRarity || card.rarity === selectedRarity;
      const matchesLanguage = !selectedLanguage || card.language === selectedLanguage;
      const matchesPrincipal = !selectedPrincipal || card.principal === selectedPrincipal;

      return matchesSearch && matchesSet && matchesRarity && matchesLanguage && matchesPrincipal;
    });
    
    // Sort by release date, set, and card condition
    return sortCardsByHierarchy(filtered);
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
              <div className="flex gap-4">
                <button
                  onClick={handleAddCardClick}
                  className="px-6 py-3 bg-[#F4D35E] text-slate-900 font-semibold rounded-xl hover:bg-[#F95738] hover:text-white transition-colors flex items-center gap-2"
                  title={!isAuthenticated ? 'Se connecter pour ajouter une carte' : ''}
                >
                  <Plus className="w-5 h-5" />
                  Add Card
                </button>
                
                <button
                  onClick={handleExportData}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Export Data
                </button>
              </div>
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
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl px-6 py-4 backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold text-white">{allCards.length}</div>
                <div className="text-sm text-purple-200">Total</div>
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
                <button
                  onClick={handleEditModeToggle}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    isEditMode ? 'bg-[#F95738] text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                  title={!isAuthenticated ? 'Se connecter pour éditer' : ''}
                >
                  <span className="hidden sm:inline">{isEditMode ? 'Edit: ON' : 'Edit'}</span>
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
                isEditMode={isEditMode}
                onOpenImage={(url) => setImageModalUrl(url)}
              />
            ) : (
              <TableView
                cards={filteredCards}
                onTogglePossessed={handleTogglePossessed}
                onUpdateImage={handleUpdateImage}
                isEditMode={isEditMode}
                onOpenImage={(url) => setImageModalUrl(url)}
              />
            )}
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddCardModal onAdd={handleAddCard} onClose={() => setShowAddForm(false)} />
      )}
      {imageModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setImageModalUrl(null)}
        >
          <div className="max-w-4xl max-h-[90vh] p-4">
            <img
              src={imageModalUrl}
              alt="Card preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg mx-auto"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<CardCollectionApp />} />
    </Routes>
  );
}

export default App;

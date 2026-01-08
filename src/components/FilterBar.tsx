import { Search } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSet: string;
  onSetChange: (value: string) => void;
  selectedRarity: string;
  onRarityChange: (value: string) => void;
  selectedLanguage: string;
  onLanguageChange: (value: string) => void;
  selectedPrincipal: string;
  onPrincipalChange: (value: string) => void;
  sets: string[];
  rarities: string[];
  languages: string[];
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedSet,
  onSetChange,
  selectedRarity,
  onRarityChange,
  selectedLanguage,
  onLanguageChange,
  selectedPrincipal,
  onPrincipalChange,
  sets,
  rarities,
  languages,
}: FilterBarProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or card number..."
            className="w-full pl-12 pr-4 py-3 bg-white/90 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4D35E] placeholder-slate-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={selectedSet}
            onChange={(e) => onSetChange(e.target.value)}
            className="px-4 py-3 bg-white/90 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4D35E] cursor-pointer"
          >
            <option value="">All Sets</option>
            {sets.map((set) => (
              <option key={set} value={set}>
                {set}
              </option>
            ))}
          </select>

          <select
            value={selectedRarity}
            onChange={(e) => onRarityChange(e.target.value)}
            className="px-4 py-3 bg-white/90 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4D35E] cursor-pointer"
          >
            <option value="">All Rarities</option>
            {rarities.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-4 py-3 bg-white/90 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4D35E] cursor-pointer"
          >
            <option value="">All Languages</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>

          <select
            value={selectedPrincipal}
            onChange={(e) => onPrincipalChange(e.target.value)}
            className="px-4 py-3 bg-white/90 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4D35E] cursor-pointer"
          >
            <option value="">All Cards</option>
            <option value="Oui">Principal Snorlax</option>
            <option value="Non">Other Cards</option>
          </select>
        </div>
      </div>
    </div>
  );
}

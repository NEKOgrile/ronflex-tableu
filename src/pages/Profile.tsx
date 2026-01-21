import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, LogOut } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  created_at: string;
  total_cards: number;
}

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setBio(data.bio || '');
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: '',
          bio: '',
          created_at: new Date().toISOString(),
          total_cards: 0,
        };
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: fullName || null,
          bio: bio || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erreur lors de la sauvegarde du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors border border-red-500/50"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Mon Profil</h1>

          {/* Email (read-only) */}
          <div className="mb-6">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white opacity-60 cursor-not-allowed"
            />
          </div>

          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Nom Complet
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!editing}
              placeholder="Entrez votre nom"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F4D35E]/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Bio */}
          <div className="mb-8">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!editing}
              placeholder="Parlez-nous de vous..."
              rows={4}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F4D35E]/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
            <div>
              <p className="text-white/60 text-sm">Compte créé</p>
              <p className="text-white font-semibold">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Cartes totales</p>
              <p className="text-white font-semibold">{profile?.total_cards || 0}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex-1 py-2 bg-gradient-to-r from-[#F95738] to-[#F4D35E] text-slate-900 font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Modifier
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 py-2 bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFullName(profile?.full_name || '');
                    setBio(profile?.bio || '');
                  }}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-colors"
                >
                  Annuler
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

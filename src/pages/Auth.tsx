import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-black p-8 rounded-lg shadow-2xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-primary">
        {isSignUp ? 'Registrer deg' : 'Logg inn'}
      </h2>
      
      <form onSubmit={handleAuth} className="space-y-6">
        <div>
          <label className="block mb-2 text-lg">E-post</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 text-lg">Passord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
            required
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg bg-primary text-black font-bold transition-colors
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
        >
          {loading ? 'Laster...' : isSignUp ? 'Registrer' : 'Logg inn'}
        </button>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full p-3 text-primary hover:text-primary/80 transition-colors"
        >
          {isSignUp ? 'Har du allerede en konto? Logg inn' : 'Ny bruker? Registrer deg'}
        </button>
      </form>
    </motion.div>
  );
}

export default Auth;
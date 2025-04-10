import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Navigate } from 'react-router-dom';
import { Dumbbell, Calculator, Weight, BarChart, History } from 'lucide-react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import anime from 'animejs';
import CalculatorPage from './pages/Calculator';
import Workouts from './pages/Workouts';
import Auth from './pages/Auth';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = React.useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-secondary text-white">
        <nav className="fixed w-full bg-black/90 backdrop-blur-sm p-4 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <RouterLink to="/" className="text-primary text-2xl font-bold flex items-center gap-2">
              <Dumbbell className="text-primary logo" />
              Treningskalkulator
            </RouterLink>
            <div className="flex gap-4">
              <RouterLink
                to="/"
                className="cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" /> Kalkulatorer
              </RouterLink>
              <RouterLink
                to="/workouts"
                className="cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
              >
                <History className="w-4 h-4" /> Treningsøkter
              </RouterLink>
              {!session ? (
                <RouterLink
                  to="/auth"
                  className="cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                >
                  Logg inn
                </RouterLink>
              ) : (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="cursor-pointer hover:text-primary transition-colors"
                >
                  Logg ut
                </button>
              )}
            </div>
          </div>
        </nav>

        <div className="container mx-auto p-4 pt-24">
          <Routes>
            <Route path="/" element={<CalculatorPage />} />
            <Route
              path="/workouts"
              element={
                session ? <Workouts session={session} /> : <Navigate to="/auth" />
              }
            />
            <Route
              path="/auth"
              element={
                !session ? <Auth /> : <Navigate to="/workouts" />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
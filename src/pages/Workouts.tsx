import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

interface Workout {
  id: string;
  exercise: string;
  weight: number;
  sets: number;
  reps: number;
  created_at: string;
}

function Workouts({ session }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWorkout, setNewWorkout] = useState({
    exercise: '',
    weight: 0,
    sets: 0,
    reps: 0,
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, [session]);

  async function fetchWorkouts() {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addWorkout(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('workouts')
        .insert([
          {
            ...newWorkout,
            user_id: session.user.id,
          },
        ])
        .select();

      if (error) throw error;
      
      setWorkouts([data[0], ...workouts]);
      setNewWorkout({ exercise: '', weight: 0, sets: 0, reps: 0 });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  }

  async function deleteWorkout(id: string) {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWorkouts(workouts.filter(workout => workout.id !== id));
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Mine Treningsøkter</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Legg til økt
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={addWorkout}
            className="bg-black p-6 rounded-lg shadow-xl space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Øvelse</label>
                <input
                  type="text"
                  value={newWorkout.exercise}
                  onChange={(e) => setNewWorkout({ ...newWorkout, exercise: e.target.value })}
                  className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Vekt (kg)</label>
                <input
                  type="number"
                  value={newWorkout.weight}
                  onChange={(e) => setNewWorkout({ ...newWorkout, weight: Number(e.target.value) })}
                  className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Sett</label>
                <input
                  type="number"
                  value={newWorkout.sets}
                  onChange={(e) => setNewWorkout({ ...newWorkout, sets: Number(e.target.value) })}
                  className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Repetisjoner</label>
                <input
                  type="number"
                  value={newWorkout.reps}
                  onChange={(e) => setNewWorkout({ ...newWorkout, reps: Number(e.target.value) })}
                  className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
              >
                Lagre økt
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-8">Laster...</div>
      ) : workouts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          Ingen treningsøkter registrert enda
        </div>
      ) : (
        <div className="grid gap-4">
          {workouts.map((workout) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-black p-6 rounded-lg shadow-xl flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">{workout.exercise}</h3>
                <div className="flex gap-6 text-gray-300">
                  <span>{workout.weight} kg</span>
                  <span>{workout.sets} sett</span>
                  <span>{workout.reps} reps</span>
                  <span className="text-gray-500">
                    {new Date(workout.created_at).toLocaleDateString('no-NO')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteWorkout(workout.id)}
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;
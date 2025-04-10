import React, { useEffect } from 'react';
import { Calculator as CalculatorIcon, BarChart, Weight } from 'lucide-react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import anime from 'animejs';

interface OneRepMaxInputs {
  weight: number;
  reps: number;
}

interface VolumeInputs {
  weight: number;
  sets: number;
  reps: number;
}

interface PlateCalculatorInputs {
  targetWeight: number;
  barWeight: number;
}

interface Plate {
  weight: number;
  color: string;
}

function Calculator() {
  const [oneRepMaxInputs, setOneRepMaxInputs] = React.useState<OneRepMaxInputs>({ weight: 0, reps: 0 });
  const [volumeInputs, setVolumeInputs] = React.useState<VolumeInputs>({ weight: 0, sets: 0, reps: 0 });
  const [plateInputs, setPlateInputs] = React.useState<PlateCalculatorInputs>({ targetWeight: 0, barWeight: 20 });

  const [refOneRepMax, inViewOneRepMax] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [refVolume, inViewVolume] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [refPlate, inViewPlate] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const calculateOneRepMax = () => {
    return (oneRepMaxInputs.weight * (36 / (37 - oneRepMaxInputs.reps))).toFixed(1);
  };

  const calculateVolume = () => {
    return (volumeInputs.weight * volumeInputs.sets * volumeInputs.reps).toFixed(1);
  };

  const getVolumeScale = () => {
    const volume = Number(calculateVolume());
    return Math.min(1 + (volume / 10000), 2);
  };

  const plateColors: Record<number, string> = {
    25: 'bg-red-500',
    20: 'bg-blue-500',
    15: 'bg-yellow-500',
    10: 'bg-green-500',
    5: 'bg-white',
    2.5: 'bg-gray-400',
    1.25: 'bg-gray-300',
  };

  const calculatePlates = (): Plate[] => {
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const remainingWeight = (plateInputs.targetWeight - plateInputs.barWeight) / 2;
    const plates: Plate[] = [];
    
    let currentWeight = remainingWeight;
    availablePlates.forEach(plate => {
      while (currentWeight >= plate) {
        plates.push({
          weight: plate,
          color: plateColors[plate]
        });
        currentWeight -= plate;
      }
    });

    return plates;
  };

  return (
    <div className="space-y-32">
      <motion.div
        ref={refOneRepMax}
        initial={{ opacity: 0, y: 50 }}
        animate={inViewOneRepMax ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-black p-8 rounded-lg shadow-2xl"
        id="oneRepMax"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary">Maks Løft Kalkulator</h2>
        <div className="grid gap-6">
          <div>
            <label className="block mb-2 text-lg">Vekt (kg)</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
              value={oneRepMaxInputs.weight}
              onChange={(e) => setOneRepMaxInputs({ ...oneRepMaxInputs, weight: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Repetisjoner</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
              value={oneRepMaxInputs.reps}
              onChange={(e) => setOneRepMaxInputs({ ...oneRepMaxInputs, reps: Number(e.target.value) })}
            />
          </div>
          {oneRepMaxInputs.weight > 0 && oneRepMaxInputs.reps > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 p-6 bg-primary text-black rounded-lg shadow-lg"
            >
              <p className="text-xl font-bold">Estimert maksløft: {calculateOneRepMax()} kg</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        ref={refVolume}
        initial={{ opacity: 0, y: 50 }}
        animate={inViewVolume ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-black p-8 rounded-lg shadow-2xl"
        id="volume"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary">Volum Kalkulator</h2>
        <div className="grid gap-6">
          <div>
            <label className="block mb-2 text-lg">Vekt (kg)</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
              value={volumeInputs.weight}
              onChange={(e) => setVolumeInputs({ ...volumeInputs, weight: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Sett</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
              value={volumeInputs.sets}
              onChange={(e) => setVolumeInputs({ ...volumeInputs, sets: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Repetisjoner</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
              value={volumeInputs.reps}
              onChange={(e) => setVolumeInputs({ ...volumeInputs, reps: Number(e.target.value) })}
            />
          </div>
          {volumeInputs.weight > 0 && volumeInputs.sets > 0 && volumeInputs.reps > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6"
            >
              <div className="flex justify-center mb-8">
                <motion.div
                  className="relative"
                  animate={{
                    scale: getVolumeScale(),
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                >
                  {/* Weightlifter figure */}
                  <div className="w-40 h-40 relative">
                    {/* Head */}
                    <motion.div
                      className="absolute w-12 h-12 bg-gray-300 rounded-full top-0 left-1/2 -translate-x-1/2"
                      animate={{
                        y: [0, -2, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    {/* Body */}
                    <motion.div
                      className="absolute w-20 h-24 bg-gray-300 rounded-lg top-10 left-1/2 -translate-x-1/2"
                      animate={{
                        scaleY: [1, 0.95, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    {/* Arms */}
                    <motion.div
                      className="absolute w-48 h-4 bg-gray-300 top-16 left-1/2 -translate-x-1/2 rounded-full"
                      animate={{
                        rotate: [-5, 5, -5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {/* Barbell */}
                      <div className="absolute left-0 right-0 -top-2 h-8 flex items-center">
                        <div className="h-2 w-full bg-primary rounded-full" />
                        <div className="absolute left-4 w-8 h-8 bg-primary rounded-full" />
                        <div className="absolute right-4 w-8 h-8 bg-primary rounded-full" />
                      </div>
                    </motion.div>
                    {/* Legs */}
                    <motion.div
                      className="absolute w-8 h-20 bg-gray-300 bottom-0 left-1/3 -translate-x-1/2 rounded-lg"
                      animate={{
                        scaleY: [1, 0.9, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute w-8 h-20 bg-gray-300 bottom-0 right-1/3 translate-x-1/2 rounded-lg"
                      animate={{
                        scaleY: [1, 0.9, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                  </div>
                </motion.div>
              </div>
              <motion.div
                className="p-6 bg-primary text-black rounded-lg shadow-lg"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <p className="text-xl font-bold">Totalt volum: {calculateVolume()} kg</p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        ref={refPlate}
        initial={{ opacity: 0, y: 50 }}
        animate={inViewPlate ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-black p-8 rounded-lg shadow-2xl"
        id="plateCalculator"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary">Vektskive Kalkulator</h2>
        <div className="grid gap-6">
          <div>
            <label className="block mb-2 text-lg">Ønsket vekt (kg)</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
              value={plateInputs.targetWeight}
              onChange={(e) => setPlateInputs({ ...plateInputs, targetWeight: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Stangvekt (kg)</label>
            <input
              type="number"
              className="w-full p-3 rounded-lg bg-secondary text-white border border-primary/20 focus:border-primary transition-colors"
              value={plateInputs.barWeight}
              onChange={(e) => setPlateInputs({ ...plateInputs, barWeight: Number(e.target.value) })}
            />
          </div>
          {plateInputs.targetWeight > plateInputs.barWeight && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 space-y-6"
            >
              <div className="relative flex items-center justify-center py-12">
                {/* Barbell */}
                <div className="absolute w-[80%] h-3 bg-gray-400 rounded-full" />
                
                {/* Left plates */}
                <div className="absolute left-[10%] flex items-center">
                  {calculatePlates().map((plate, index) => (
                    <motion.div
                      key={`left-${index}`}
                      initial={{ scale: 0, x: -50 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${plate.color} h-${Math.max(16, plate.weight * 2)}
                        w-4 border border-gray-600 shadow-lg transform -translate-x-${index * 4}`}
                      style={{
                        height: `${Math.max(64, plate.weight * 4)}px`,
                        marginLeft: `-${index * 8}px`,
                        zIndex: 100 - index
                      }}
                    >
                      <span className="absolute top-1/2 -translate-y-1/2 left-full ml-2 text-xs font-bold whitespace-nowrap">
                        {index === 0 && `${plate.weight}kg`}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Right plates */}
                <div className="absolute right-[10%] flex items-center">
                  {calculatePlates().map((plate, index) => (
                    <motion.div
                      key={`right-${index}`}
                      initial={{ scale: 0, x: 50 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${plate.color} h-${Math.max(16, plate.weight * 2)}
                        w-4 border border-gray-600 shadow-lg transform translate-x-${index * 4}`}
                      style={{
                        height: `${Math.max(64, plate.weight * 4)}px`,
                        marginRight: `-${index * 8}px`,
                        zIndex: 100 - index
                      }}
                    >
                      <span className="absolute top-1/2 -translate-y-1/2 right-full mr-2 text-xs font-bold whitespace-nowrap">
                        {index === 0 && `${plate.weight}kg`}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-primary text-black rounded-lg shadow-lg">
                <p className="text-xl font-bold mb-4">Vektskiver per side:</p>
                <div className="flex flex-wrap gap-3">
                  {calculatePlates().map((plate, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`inline-block px-6 py-3 ${plate.color} text-black rounded-full font-bold
                        ${plate.color === 'bg-white' ? 'text-black' : 'text-white'}`}
                    >
                      {plate.weight} kg
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Calculator;
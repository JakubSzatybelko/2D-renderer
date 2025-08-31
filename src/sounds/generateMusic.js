import * as Tone from "tone";

// Configuration constants
const circleMaxRadius = 100;
let tempo = 120; // BPM
let isPlaying = false;
let currentScale = "major";
let currentKey = "C";

// Utility functions
const getRandomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Create audio context and instruments with volume controls
const createInstruments = () => {
  // Create volume controls
  const bassVolume = new Tone.Volume(-10).toDestination();
  const melodyVolume = new Tone.Volume(-8).toDestination();
  const harmonyVolume = new Tone.Volume(-12).toDestination();
  const drumsVolume = new Tone.Volume(-15).toDestination();

  // Create instruments
  const bassSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.2,
      decay: 0.1,
      sustain: 0.8,
      release: 0.8
    }
  }).connect(bassVolume);

  const lowerBassSynth = new Tone.Synth({
    oscillator: { type: "triangle8" },
    envelope: {
      attack: 0.3,
      decay: 0.2,
      sustain: 0.9,
      release: 1
    }
  }).connect(bassVolume);

  // Choose random oscillator type for melody
  const oscillatorTypes = ["sine", "triangle", "sawtooth", "square"];
  const randomOscillator = oscillatorTypes[Math.floor(Math.random() * oscillatorTypes.length)];

  const melodySynth = new Tone.Synth({
    oscillator: { type: randomOscillator },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.5,
      release: 0.5
    }
  }).connect(melodyVolume);

  const harmonySynth1 = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.7,
      release: 0.3
    }
  }).connect(harmonyVolume);

  const harmonySynth2 = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.7,
      release: 0.3
    }
  }).connect(harmonyVolume);

  const drumKit = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0.01,
      release: 0.8,
    }
  }).connect(drumsVolume);

  return {
    bassSynth,
    lowerBassSynth,
    melodySynth,
    harmonySynth1,
    harmonySynth2,
    drumKit,
    volumes: {
      bass: bassVolume,
      melody: melodyVolume,
      harmony: harmonyVolume,
      drums: drumsVolume
    }
  };
};

export const generateMusic = async (options = {}) => {
  // Apply options
  if (options.tempo) tempo = options.tempo;
  if (options.scale) currentScale = options.scale;
  if (options.key) currentKey = options.key;

  if (isPlaying) {
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();
    isPlaying = false;
    return;
  }

  isPlaying = true;
  await Tone.start();
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let w = ctx.canvas.width = window.innerWidth;
  let h = ctx.canvas.height = window.innerHeight;

  const circles = [];

  const drawCircle = (x, y, radius, hue) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    //opacity based on radius
    ctx.globalAlpha = Math.max(0, 1 - radius / circleMaxRadius);
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  };
  const expandCircles = () => {
    circles.forEach((circle, index) => {
      if (circle.radius < circle.maxRadius) {
        // Expansion rate is based on how long the circle should last
        const expansionRate = circle.expansionRate || 1.01;
        circle.radius = (circle.radius + 1) * expansionRate;
      } else {
        circles.splice(index, 1);
      }
    });
  };

  const render = () => {
    ctx.clearRect(0, 0, w, h);
    expandCircles();
    circles.forEach(circle => {
      drawCircle(circle.x, circle.y, circle.radius, circle.hue);
    });
    requestAnimationFrame(render);
  };

  // Convert note durations to milliseconds for visual effects
  const getDurationInMs = (noteDuration) => {
    const bpm = tempo;
    const durationMap = {
      "1n": (60 / bpm) * 4 * 1000,  // Whole note
      "2n": (60 / bpm) * 2 * 1000,  // Half note
      "4n": (60 / bpm) * 1000,      // Quarter note
      "8n": (60 / bpm) * 0.5 * 1000, // Eighth note
      "16n": (60 / bpm) * 0.25 * 1000, // Sixteenth note
    };
    return durationMap[noteDuration] || 1000; // Default to 1 second
  };

  const createCircle = (x, y, hue, duration = "4n") => {
    // Calculate how long the circle should last based on the note duration
    const durationMs = getDurationInMs(duration);

    // Set maxRadius based on duration - longer notes get bigger circles
    const maxRadius = circleMaxRadius * (1 + (durationMs / 1000) * 0.5);

    // Calculate expansion rate to make the circle last roughly proportional to the note duration
    // Slower expansion for longer notes
    const expansionRate = 1 + (0.05 / (durationMs / 1000));

    const circle = {
      x,
      y,
      radius: 1,
      hue,
      maxRadius,
      expansionRate
    };
    circles.push(circle);
  };



  // Create instruments with volume controls
  const instruments = createInstruments();

  // Chord and scale definitions
  const chords = {
    // Major chords
    "C": ["C", "E", "G"],
    "D": ["D", "F#", "A"],
    "E": ["E", "G#", "B"],
    "F": ["F", "A", "C"],
    "G": ["G", "B", "D"],
    "A": ["A", "C#", "E"],
    "B": ["B", "D#", "F#"],

    // Minor chords
    "Cm": ["C", "Eb", "G"],
    "Dm": ["D", "F", "A"],
    "Em": ["E", "G", "B"],
    "Fm": ["F", "Ab", "C"],
    "Gm": ["G", "Bb", "D"],
    "Am": ["A", "C", "E"],
    "Bm": ["B", "D", "F#"],

    // 7th chords
    "C7": ["C", "E", "G", "Bb"],
    "D7": ["D", "F#", "A", "C"],
    "G7": ["G", "B", "D", "F"],

    // Major 7th chords
    "Cmaj7": ["C", "E", "G", "B"],
    "Dmaj7": ["D", "F#", "A", "C#"],
    "Gmaj7": ["G", "B", "D", "F#"],

    // Minor 7th chords
    "Cm7": ["C", "Eb", "G", "Bb"],
    "Dm7": ["D", "F", "A", "C"],
    "Em7": ["E", "G", "B", "D"],
  };

  // Define common scales
  const scales = {
    major: {
      "C": ["C", "D", "E", "F", "G", "A", "B"],
      "G": ["G", "A", "B", "C", "D", "E", "F#"],
      "D": ["D", "E", "F#", "G", "A", "B", "C#"],
      "A": ["A", "B", "C#", "D", "E", "F#", "G#"],
      "F": ["F", "G", "A", "Bb", "C", "D", "E"]
    },
    minor: {
      "A": ["A", "B", "C", "D", "E", "F", "G"],
      "E": ["E", "F#", "G", "A", "B", "C", "D"],
      "D": ["D", "E", "F", "G", "A", "Bb", "C"],
      "G": ["G", "A", "Bb", "C", "D", "Eb", "F"],
      "C": ["C", "D", "Eb", "F", "G", "Ab", "Bb"]
    },
    pentatonic: {
      "C": ["C", "D", "E", "G", "A"],
      "G": ["G", "A", "B", "D", "E"],
      "F": ["F", "G", "A", "C", "D"]
    },
    blues: {
      "C": ["C", "Eb", "F", "F#", "G", "Bb"],
      "G": ["G", "Bb", "C", "C#", "D", "F"],
      "D": ["D", "F", "G", "G#", "A", "C"]
    }
  };

  // Functions to work with notes and chords
  const generateNote = (note, octave) => {
    return `${note}${octave}`;
  };

  // Helper function to simplify chord handling
  const getChordNotes = (chordName) => {
    if (chords[chordName]) {
      return chords[chordName];
    }

    // If chord not found, extract root note and use a simple triad
    const rootNote = chordName.replace(/m|7|maj7/g, '');
    if (rootNote === chordName) {
      // Major triad
      return [rootNote, transposeNote(rootNote, 4), transposeNote(rootNote, 7)];
    } else if (chordName.includes('m')) {
      // Minor triad
      return [rootNote, transposeNote(rootNote, 3), transposeNote(rootNote, 7)];
    } else if (chordName.includes('7')) {
      // Dominant 7th
      return [rootNote, transposeNote(rootNote, 4), transposeNote(rootNote, 7), transposeNote(rootNote, 10)];
    }

    // Fallback to major triad
    console.log(`Chord not found: ${chordName}, using major triad`);
    return [rootNote, transposeNote(rootNote, 4), transposeNote(rootNote, 7)];
  };

  // Simple helper for note transposition
  const transposeNote = (note, semitones) => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const index = notes.indexOf(note);
    if (index === -1) return note; // Not found
    return notes[(index + semitones) % 12];
  };

  // Function to play a chord
  const playChord = (chordName, octave, duration, time, instrument) => {
    const chordNotes = getChordNotes(chordName);
    const notes = chordNotes.map(note => generateNote(note, octave));
    instrument.triggerAttackRelease(notes, duration, time);

    // Create visual effect for chord - duration affects circle lifetime
    setTimeout(() => {
      const x = getRandomBetween(0, w);
      const y = getRandomBetween(0, h);
      for (let i = 0; i < notes.length; i++) {
        createCircle(
          x + getRandomBetween(-200, 200),
          y + getRandomBetween(-200, 200),
          100 + getRandomBetween(0, 50),
          duration
        );
      }
    }, (time - Tone.now()) * 1000);
  };

  // Select notes from current scale
  const getNotesFromCurrentScale = () => {
    return scales[currentScale][currentKey] || scales.major.C;
  };
  // Set up Tone.js Transport
  const transport = Tone.getTransport();
  transport.bpm.value = tempo;

  // Get available notes for the current scale
  const availableNotes = getNotesFromCurrentScale();

  // Set up common chord progressions
  const chordProgressions = {
    pop: ["C", "G", "Am", "F"],
    pop2: ["G", "D", "Em", "C"],
    pop3: ["F", "C", "Dm", "Bb"],
    blues: ["C7", "F7", "C7", "G7", "F7", "C7"],
    blues2: ["G7", "C7", "G7", "D7", "C7", "G7"],
    jazz: ["Cmaj7", "Dm7", "G7", "Cmaj7"],
    jazz2: ["Dm7", "G7", "Cmaj7", "Am7", "D7"],
    jazz3: ["Fmaj7", "Em7", "Dm7", "Cmaj7"],
    rock: ["C", "G", "F", "G"],
    rock2: ["Am", "F", "C", "G"],
    rock3: ["D", "A", "G", "A"]
  };

  // Get all available progression types
  const progressionTypes = Object.keys(chordProgressions);

  // Choose a random progression
  const selectedType = progressionTypes[Math.floor(Math.random() * progressionTypes.length)];
  const progression = chordProgressions[selectedType];

  // Randomly transpose chord progression to the selected key
  const transposedProgression = progression.map(chord => {
    if (currentKey === 'C') return chord; // No transposition needed for C

    // Simple transposition for demonstration
    // In a real implementation, you'd need more sophisticated transposition logic
    const rootNote = chord.replace(/m|7|maj7/g, '');
    const suffix = chord.replace(rootNote, '');

    // For simplicity, just append the current key to any suffix
    return currentKey + suffix;
  });

  console.log(`Selected progression type: ${selectedType} in key ${currentKey}`);

  const bassOctave = getRandomBetween(1, 2); // Randomize bass octave
  const melodyOctave = getRandomBetween(3, 4); // Randomize melody octave
  const harmonyOctave = getRandomBetween(2, 4); // Randomize harmony octave

  // Create patterns for different instruments

  // Bass pattern
  const bassPattern = new Tone.Pattern((time, idx) => {
    const chord = transposedProgression[idx % transposedProgression.length];
    const rootNote = chord.replace(/m|7|maj7/g, ''); // Get root note without modifiers

    // Play bass note (root of chord)
    instruments.bassSynth.triggerAttackRelease(
      generateNote(rootNote, bassOctave),
      "2n",
      time
    );

    // Visual for the main bass note
    setTimeout(() => {
      createCircle(getRandomBetween(0, w), getRandomBetween(0, h), 50, "2n");
    }, (time - Tone.now()) * 1000);

    // Add lower bass for richness with a longer duration
    instruments.lowerBassSynth.triggerAttackRelease(
      generateNote(rootNote, bassOctave - 1),
      "1n",
      time
    );

    // Visual for bass notes - longer duration
    setTimeout(() => {
      createCircle(getRandomBetween(0, w), getRandomBetween(0, h), 10, "1n");
    }, (time - Tone.now()) * 1000);

  }, [0, 1, 2, 3], "up");

  // Chord pattern - plays full chords
  const chordPattern = new Tone.Pattern((time, idx) => {
    const chordName = transposedProgression[idx % transposedProgression.length];
    playChord(chordName, harmonyOctave, "2n", time, instruments.harmonySynth1);
  }, [0, 1, 2, 3], "up");

  // Melody pattern - plays notes from scale
  const melodyPattern = new Tone.Pattern((time, idx) => {
    // Skip some beats for rest
    if (Math.random() > 0.7) return;

    // Choose note from scale
    const noteIndex = getRandomBetween(0, availableNotes.length - 1);
    const note = availableNotes[noteIndex];

    // Duration varies
    const duration = Math.random() < 0.5 ? "8n" : "4n";

    instruments.melodySynth.triggerAttackRelease(
      generateNote(note, melodyOctave),
      duration,
      time
    );

    // Visual for melody - with duration matching the note
    setTimeout(() => {
      createCircle(getRandomBetween(0, w), getRandomBetween(0, h), 200 + getRandomBetween(0, 50), duration);
    }, (time - Tone.now()) * 1000);

  }, [0, 1, 2, 3, 4, 5, 6, 7], "randomWalk");

  // Arpeggio pattern - plays notes of current chord
  const arpeggioPattern = new Tone.Pattern((time, idx) => {
    // Get current chord in progression based on measure
    const measureIdx = Math.floor(idx / 4) % transposedProgression.length;
    const chordName = transposedProgression[measureIdx];

    // Get notes of chord using our helper function
    const chordNotes = getChordNotes(chordName);
    if (!chordNotes || chordNotes.length === 0) return;

    const noteIdx = idx % chordNotes.length;
    const note = chordNotes[noteIdx];

    instruments.harmonySynth2.triggerAttackRelease(
      generateNote(note, harmonyOctave + 1),
      "8n",
      time
    );

    // Visual for arpeggio with duration
    setTimeout(() => {
      createCircle(getRandomBetween(0, w), getRandomBetween(0, h), 100 + getRandomBetween(0, 50), "8n");
    }, (time - Tone.now()) * 1000);

  }, [0, 1, 2, 3, 0, 1, 2, 3], "up");

  // Drum pattern
  const drumPattern = new Tone.Pattern((time, idx) => {
    // Simple drum pattern - kick on 1 and 3, snare-like on 2 and 4
    if (idx % 4 === 0 || idx % 4 === 2) {
      instruments.drumKit.triggerAttackRelease("C2", "16n", time);
      // Kick drum visual - smaller, quick circles
      setTimeout(() => {
        createCircle(getRandomBetween(w / 2 - 100, w / 2 + 100), getRandomBetween(h / 2 - 100, h / 2 + 100), 300, "16n");
      }, (time - Tone.now()) * 1000);
    } else if (idx % 4 === 1 || idx % 4 === 3) {
      instruments.drumKit.triggerAttackRelease("G2", "16n", time);
      // Snare visual - scattered small circles
      setTimeout(() => {
        for (let i = 0; i < 3; i++) {
          createCircle(getRandomBetween(0, w), getRandomBetween(0, h), 150 + getRandomBetween(0, 100), "16n");
        }
      }, (time - Tone.now()) * 1000);
    }
  }, [0, 1, 2, 3, 4, 5, 6, 7], "up");

  // Randomize some pattern intervals
  const bassIntervals = ["4n", "4n.", "2n"];
  const melodyIntervals = ["8n", "8n.", "16n"];

  // Start all patterns with some randomness
  bassPattern.interval = bassIntervals[Math.floor(Math.random() * bassIntervals.length)];
  chordPattern.interval = "1n"; // Keep this stable for harmony
  melodyPattern.interval = melodyIntervals[Math.floor(Math.random() * melodyIntervals.length)];
  arpeggioPattern.interval = "8n";
  drumPattern.interval = "8n";

  // Start the transport
  transport.start();

  // Start patterns
  bassPattern.start(0);
  chordPattern.start(0);
  melodyPattern.start("2m");  // Start melody after 2 measures
  arpeggioPattern.start("1m");  // Start arpeggios after 1 measure
  drumPattern.start(0);

  // Stop everything after a certain time (optional)
  // transport.scheduleOnce(() => {
  //   bassPattern.stop();
  //   chordPattern.stop();
  //   melodyPattern.stop();
  //   arpeggioPattern.stop();
  //   drumPattern.stop();
  //   isPlaying = false;
  // }, "16m");  // Stop after 16 measures

  // Start visual rendering
  render();
};

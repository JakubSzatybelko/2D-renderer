// const synth = new Tone.Synth().toDestination();
// // Create synths with improved settings
// const sync2 = new Tone.Synth({
//   oscillator: {
//     type: "triangle"
//   },
//   envelope: {
//     attack: 0.02,
//     decay: 0.1,
//     sustain: 0.3,
//     release: 1
//   }
// }).toDestination();

// // Create a reverb effect
// const reverb = new Tone.Reverb({
//   decay: 2.5,
//   wet: 0.5
// }).toDestination();

// // Create a delay effect
// const delay = new Tone.FeedbackDelay({
//   delayTime: 0.25,
//   feedback: 0.3,
//   wet: 0.4
// }).toDestination();

// const harmonicSynth = new Tone.PolySynth(Tone.Synth, {
//   oscillator: {
//     type: "sine"
//   },
//   envelope: {
//     attack: 0.1,
//     decay: 0.3,
//     sustain: 0.4,
//     release: 2
//   }
// }).connect(reverb);

// const harmonicSynth2 = new Tone.PolySynth(Tone.Synth, {
//   oscillator: {
//     type: "sawtooth"
//   },
//   envelope: {
//     attack: 0.05,
//     decay: 0.2,
//     sustain: 0.5,
//     release: 1.5
//   }
// }).connect(delay);

// // Adjust volumes
// sync2.volume.value = -6;
// harmonicSynth.volume.value = -10;
// harmonicSynth2.volume.value = -12;
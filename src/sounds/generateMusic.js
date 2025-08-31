import * as Tone from "tone";

const circleMaxRadius = 100;

const getRandomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateMusic = async () => {
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
      if (circle.radius < circleMaxRadius) {
        circle.radius = (circle.radius + 1) * 1.02;
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

  const createCircle = (x, y, hue) => {
    const circle = { x, y, radius: 1, hue };
    circles.push(circle);
  };



  const synth = new Tone.Synth().toDestination();
  const sync2 = new Tone.Synth().toDestination();
  const harmonicSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  const harmonicSynth2 = new Tone.PolySynth(Tone.Synth).toDestination();
  const lowerBassSynth = new Tone.PolySynth(Tone.Synth).toDestination();

  const notes = ["A", "Bb", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab",];
  const generateNote = (note, scale) => {
    return `${note}${scale}`;
  };
  const getHarmonicNote = (note, octave) => {
    const harmonicNotes = {
      "A": ["A", "C#", "E"],
      "Bb": ["Bb", "D", "F"],
      "C": ["C", "E", "G"],
      "C#": ["C#", "E#", "G#"],
      "D": ["D", "F#", "A"],
      "Eb": ["Eb", "G", "Bb"],
      "E": ["E", "G#", "B"],
      "F": ["F", "A", "C"],
      "F#": ["F#", "A#", "C#"],
      "G": ["G", "B", "D"],
      "Ab": ["Ab", "C", "Eb"]
    };
    return harmonicNotes[note][octave % 3];
  };
  const scale = 3;
  ///baseline
  for (let i = 0; i < 20; i++) {
    const startTime = i * getRandomBetween(0.5, 0.5);
    // get random note form the array
    const randomNote = notes[Math.floor(getRandomBetween(0, notes.length - 1))];
    synth.triggerAttackRelease(
      generateNote(randomNote, scale),
      "1n",
      Tone.now() + startTime
    );
    lowerBassSynth.triggerAttackRelease(
      generateNote(randomNote, 2),
      "1n",
      Tone.now() + startTime
    );
    setTimeout(() => {
      createCircle(getRandomBetween(0, w), getRandomBetween(0, h), 10);
    }, Tone.now() + startTime * 1000);
  }
  /// harmonic
  const scale2 = 4;
  for (let i = 0; i < 20; i++) {
    const startTime = i * getRandomBetween(0.5, 0.5);
    // get random note form the array
    const randomNote = notes[Math.floor(getRandomBetween(0, notes.length - 1))];
    sync2.triggerAttackRelease(
      generateNote(randomNote, scale2),
      Math.random() < 0.5 ? "2n" : "4n",
      Tone.now() + startTime
    );
    ///// i in 3 chance to not create

    harmonicSynth.triggerAttackRelease(
      generateNote(randomNote, scale2 + 1),
      "4n",
      Tone.now() + startTime
    );


    harmonicSynth2.triggerAttackRelease(
      generateNote(randomNote, scale2 - 1),
      "4n",
      Tone.now() + startTime
    );
    setTimeout(() => {
      createCircle(getRandomBetween(0, w), getRandomBetween(0, h), 200 + getRandomBetween(0, 50));
    }, Tone.now() + startTime * 1000);
    setTimeout(() => {
      createCircle(getRandomBetween(0, w), getRandomBetween(0, h), 100 + getRandomBetween(0, 50));
    }, Tone.now() + startTime * 1000);
  }
  render();
};

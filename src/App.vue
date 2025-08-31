<script setup>
import { ref, onMounted } from 'vue'
import { 
  playMusic, 
  stopMusic,
  updateMusicSettings, 
  getAvailableScales, 
  getAvailableKeys,
  getAvailableProgressions,
  getCurrentSettings,
  resetSettings 
} from './sounds/musicControls';

// UI state
const isPlaying = ref(false);
const showControls = ref(false);
const settings = ref(getCurrentSettings());
const scales = getAvailableScales();
const keys = getAvailableKeys();
const progressions = getAvailableProgressions();

// Toggle play/stop
const togglePlayback = async () => {
  if (isPlaying.value) {
    await stopMusic();
    isPlaying.value = false;
  } else {
    await playMusic();
    isPlaying.value = true;
  }
};

// Toggle controls visibility
const toggleControls = () => {
  showControls.value = !showControls.value;
};

// Update settings
const updateSettings = (key, value) => {
  const newSettings = {};
  newSettings[key] = value;
  settings.value = updateMusicSettings(newSettings);
  
  // If already playing, restart with new settings
  if (isPlaying.value) {
    stopMusic();
    playMusic();
  }
};

// Update volume
const updateVolume = (instrument, value) => {
  const newSettings = {
    volumes: {}
  };
  newSettings.volumes[instrument] = parseInt(value);
  settings.value = updateMusicSettings(newSettings);
  
  // Update current playback without restart
  if (isPlaying.value) {
    // We don't need to restart for volume changes
  }
};

// Reset to default settings
const reset = () => {
  settings.value = resetSettings();
  if (isPlaying.value) {
    stopMusic();
    playMusic();
  }
};
</script>

<template>
<div>
  <div id="fps"></div>
  
  <div id="info">
    <button @click="togglePlayback">
      {{ isPlaying ? 'Stop Music' : 'Play Music' }}
    </button>
    <button @click="toggleControls">
      {{ showControls ? 'Hide Controls' : 'Show Controls' }}
    </button>
    
    <div v-if="showControls" class="music-controls">
      <h3>Music Controls</h3>
      
      <div class="control-group">
        <label>Tempo:
          <input type="range" min="60" max="180" v-model.number="settings.tempo" 
                 @change="updateSettings('tempo', settings.tempo)">
          {{ settings.tempo }} BPM
        </label>
      </div>
      
      <div class="control-group">
        <label>Scale:
          <select v-model="settings.scale" @change="updateSettings('scale', settings.scale)">
            <option v-for="scale in scales" :value="scale">{{ scale }}</option>
          </select>
        </label>
      </div>
      
      <div class="control-group">
        <label>Key:
          <select v-model="settings.key" @change="updateSettings('key', settings.key)">
            <option v-for="key in keys" :value="key">{{ key }}</option>
          </select>
        </label>
      </div>
      
      <h4>Volume Controls</h4>
      
      <div class="volume-controls">
        <label>Bass:
          <input type="range" min="-40" max="0" v-model.number="settings.volumes.bass"
                 @input="updateVolume('bass', settings.volumes.bass)">
          {{ settings.volumes.bass }} dB
        </label>
        
        <label>Melody:
          <input type="range" min="-40" max="0" v-model.number="settings.volumes.melody"
                 @input="updateVolume('melody', settings.volumes.melody)">
          {{ settings.volumes.melody }} dB
        </label>
        
        <label>Harmony:
          <input type="range" min="-40" max="0" v-model.number="settings.volumes.harmony"
                 @input="updateVolume('harmony', settings.volumes.harmony)">
          {{ settings.volumes.harmony }} dB
        </label>
        
        <label>Drums:
          <input type="range" min="-40" max="0" v-model.number="settings.volumes.drums"
                 @input="updateVolume('drums', settings.volumes.drums)">
          {{ settings.volumes.drums }} dB
        </label>
      </div>
      
      <button @click="reset" class="reset-btn">Reset to Defaults</button>
    </div>
  </div>
  
  <div id="bg_glow"></div>
  <div id="overlay"></div>
  <canvas id="canvas"></canvas>
</div>
</template>

<style>
html, body{
  overflow: hidden;
  background: #000;
  padding: 0px;
  margin: 0px;
  font-family: Arial, sans-serif;
}

#canvas{
  cursor: crosshair;
  z-index: 2;
  position: absolute;
  top: 0; left: 0;
}

#overlay{
  background: radial-gradient(ellipse at center, rgba(0,0,0,.0) 10%, rgba(0,0,0,.8) 80%, rgba(0,0,0,1) 90%, rgba(0,0,0,1) 100%);
  z-index: 3;
  position: absolute;
  top:0;left:0;
  height: 100%;
  width: 100%;
}

#bg_glow{
  z-index: 1;
  position: absolute;
  top:0;left:0;
  height: 100%;
  width: 100%;
}

#info{
  z-index: 4;
  position: absolute;
  color: #fff;
  top: 0px;
  left: 0px;
  background: rgba(40,40,40,.85);
  padding: 10px;
  border-radius: 5px;
  margin: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

#overlay:hover{
  cursor: pointer;
}

#fps{
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 5;
}

button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 12px;
  margin: 5px;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

button:hover {
  background: #3e8e41;
}

.music-controls {
  margin-top: 15px;
  padding: 10px;
  background: rgba(30,30,30,0.8);
  border-radius: 5px;
  max-width: 300px;
}

.control-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="range"] {
  width: 100%;
  margin: 8px 0;
}

select {
  width: 100%;
  padding: 5px;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 3px;
}

.volume-controls label {
  margin-top: 8px;
}

.reset-btn {
  background: #f44336;
  margin-top: 10px;
}

.reset-btn:hover {
  background: #d32f2f;
}

h3, h4 {
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  padding-bottom: 5px;
}
</style>
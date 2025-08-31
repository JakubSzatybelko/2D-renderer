import { generateMusic } from './generateMusic';

// Default settings
const defaultSettings = {
  tempo: 120,
  scale: 'major',
  key: 'C',
  volumes: {
    bass: -10,
    melody: -8,
    harmony: -12,
    drums: -15
  }
};

// Current settings
let currentSettings = { ...defaultSettings };

/**
 * Updates music settings
 * @param {Object} newSettings - Object containing settings to update
 */
export const updateMusicSettings = (newSettings) => {
  currentSettings = {
    ...currentSettings,
    ...newSettings,
    volumes: {
      ...currentSettings.volumes,
      ...(newSettings.volumes || {})
    }
  };

  return currentSettings;
};

/**
 * Play music with current settings
 */
export const playMusic = () => {
  return generateMusic(currentSettings);
};

/**
 * Stop music playback
 */
export const stopMusic = () => {
  return generateMusic(); // Calling without options will stop if playing
};

/**
 * Reset settings to defaults
 */
export const resetSettings = () => {
  currentSettings = { ...defaultSettings };
  return currentSettings;
};

/**
 * Get available scales
 */
export const getAvailableScales = () => {
  return ['major', 'minor', 'pentatonic', 'blues'];
};

/**
 * Get available keys
 */
export const getAvailableKeys = () => {
  return ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
};

/**
 * Get available chord progressions
 */
export const getAvailableProgressions = () => {
  return [
    { name: 'Pop (I-V-vi-IV)', id: 'pop' },
    { name: 'Blues (I7-IV7-I7-V7-IV7-I7)', id: 'blues' },
    { name: 'Jazz (Imaj7-ii7-V7-Imaj7)', id: 'jazz' },
    { name: 'Rock (I-V-IV-V)', id: 'rock' }
  ];
};

/**
 * Get current settings
 */
export const getCurrentSettings = () => {
  return { ...currentSettings };
};

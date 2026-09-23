/* ==========================================================
   NATURE MOMENTS — AMBIENT NATURE SOUND ENGINE
   Generates rich, high-fidelity ambient nature audio using Web Audio API
   Simulates flowing river, rain, forest birds, waves & mountain wind
   ========================================================== */

class NatureSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentMode = 'forest'; // 'forest', 'rain', 'waterfall', 'river', 'ocean', 'wind'
    this.gainNode = null;
    this.activeNodes = [];
    this.isMuted = true; // Default muted until user interacts
  }

  _initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Toggle sound on/off
  toggleSound(category = 'forest') {
    this._initContext();
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
      return false;
    } else {
      this.play(category);
      return true;
    }
  }

  setMuted(muted, category = 'forest') {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    } else {
      this._initContext();
      this.play(category);
    }
  }

  play(category = 'forest') {
    this._initContext();
    this.stopNodes();
    this.isPlaying = true;
    this.currentMode = category;

    const cat = (category || '').toLowerCase();

    if (cat.includes('rain')) {
      this._generateRainSound();
    } else if (cat.includes('waterfall') || cat.includes('river')) {
      this._generateWaterRushSound();
    } else if (cat.includes('ocean') || cat.includes('beach')) {
      this._generateOceanWavesSound();
    } else if (cat.includes('mountain') || cat.includes('snow') || cat.includes('clouds')) {
      this._generateWindSound();
    } else {
      // Default: Forest with birds & breeze
      this._generateForestSound();
    }
  }

  stop() {
    this.isPlaying = false;
    this.stopNodes();
  }

  stopNodes() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  // Pink noise generator for soothing water/rain textures
  _createNoiseBuffer() {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }
    return noiseBuffer;
  }

  // 1. Forest ambient breeze + birds
  _generateForestSound() {
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = this._createNoiseBuffer();
    noiseSource.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);
    noiseSource.start();

    this.activeNodes.push(noiseSource, filter, gain);

    // Bird chirp generator interval
    const chirpInterval = setInterval(() => {
      if (!this.isPlaying || this.isMuted) {
        clearInterval(chirpInterval);
        return;
      }
      this._playSingleBirdChirp();
    }, 2800);
  }

  _playSingleBirdChirp() {
    try {
      const osc = this.audioCtx.createOscillator();
      const chirpGain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'sine';
      const baseFreq = 2200 + Math.random() * 800;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, now + 0.18);

      chirpGain.gain.setValueAtTime(0.01, now);
      chirpGain.gain.linearRampToValueAtTime(0.08, now + 0.04);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(chirpGain);
      chirpGain.connect(this.gainNode);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  // 2. Soothing Raindrops
  _generateRainSound() {
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = this._createNoiseBuffer();
    noiseSource.loop = true;

    const bandpass = this.audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
    bandpass.Q.setValueAtTime(0.8, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);

    noiseSource.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.gainNode);
    noiseSource.start();

    this.activeNodes.push(noiseSource, bandpass, gain);
  }

  // 3. Rushing Waterfall & River
  _generateWaterRushSound() {
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = this._createNoiseBuffer();
    noiseSource.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);
    noiseSource.start();

    this.activeNodes.push(noiseSource, filter, gain);
  }

  // 4. Ocean Waves
  _generateOceanWavesSound() {
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = this._createNoiseBuffer();
    noiseSource.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);

    // LFO for surging wave rhythm
    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.audioCtx.currentTime); // 1 wave every ~5.5s
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);
    noiseSource.start();

    this.activeNodes.push(noiseSource, filter, gain, lfo, lfoGain);
  }

  // 5. Mountain Wind
  _generateWindSound() {
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = this._createNoiseBuffer();
    noiseSource.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(2.0, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.22, this.audioCtx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);
    noiseSource.start();

    this.activeNodes.push(noiseSource, filter, gain);
  }
}

export const soundEngine = new NatureSoundEngine();

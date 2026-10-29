/**
 * audio.js
 * Procedural Web Audio API sound designer.
 * Zero external audio assets, zero network requests.
 * Completely OFF by default as required by professional design standards.
 */

export class SoundFX {
  constructor() {
    this.audioCtx = null;
    this.enabled = localStorage.getItem('haroon_audio_fx') === 'true'; // OFF by default
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('haroon_audio_fx', this.enabled ? 'true' : 'false');
    if (this.enabled) {
      this.init();
      this.play('click');
    }
    return this.enabled;
  }

  play(type = 'click') {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    switch (type) {
      case 'click':
        // Extremely subtle 12ms high-tech tactile click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.015);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
        osc.start(t);
        osc.stop(t + 0.015);
        break;

      case 'tick':
        // Soft pipeline step pulse
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, t);
        osc.frequency.exponentialRampToValueAtTime(740, t + 0.03);
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.start(t);
        osc.stop(t + 0.03);
        break;

      case 'execute':
        // Energetic electronic trigger chirp
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.08);
        break;

      case 'success':
        // Smooth harmonic chord
        this.playChord([523.25, 659.25, 783.99], 0.12);
        break;

      case 'switch':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(450, t + 0.02);
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        osc.start(t);
        osc.stop(t + 0.02);
        break;

      default:
        break;
    }
  }

  playChord(freqs, duration) {
    if (!this.audioCtx || !this.enabled) return;
    const t = this.audioCtx.currentTime;
    freqs.forEach(freq => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.025, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + duration);
    });
  }
}


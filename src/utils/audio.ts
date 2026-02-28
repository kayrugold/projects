class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  
  // Active nodes for cleanup
  private activeNodes: AudioNode[] = [];
  private timeouts: number[] = [];
  private isMusicPlaying: boolean = false;

  // Music State
  private windNode: AudioNode | null = null;

  constructor() {
    // Lazy init
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Master Chain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      
      // Compressor for "Cinema" glue
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.value = -20;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      this.masterGain.connect(compressor);
      compressor.connect(this.ctx.destination);

      // Channels
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.4; 
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.3;
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMusic(enable: boolean) {
    this.init();
    if (enable && !this.isMusicPlaying) {
      this.startCinematicSequence();
    } else if (!enable && this.isMusicPlaying) {
      this.stopMusic();
    }
  }

  private startCinematicSequence() {
    if (!this.ctx || !this.musicGain) return;
    this.isMusicPlaying = true;
    const now = this.ctx.currentTime;

    // 1. START: Industrial Drone + Heavy Wind (The Atmosphere)
    this.playDrone(now);
    this.playWind(now);

    // 2. T+2s: Large Brass Swell (The Reveal) - Faster start
    this.schedule(() => this.playBrassSwell(), 2000);

    // 3. T+6s: Enter the Loop (Harp & Piano & Wind continues) - Faster start
    this.schedule(() => this.startMelodicLoop(), 6000);
  }

  private schedule(fn: () => void, delayMs: number) {
    const id = window.setTimeout(fn, delayMs);
    this.timeouts.push(id);
  }

  // --- INSTRUMENTS ---

  private playDrone(startTime: number) {
    if (!this.ctx || !this.musicGain) return;
    // Dark, gritty low end (Hacker/Industrial base)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.value = 55; // A1
    osc2.frequency.value = 55.5; // Detuned
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;
    
    const gain = this.ctx.createGain();
    gain.gain.value = 0.15;
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);
    
    osc1.start(startTime);
    osc2.start(startTime);
    
    this.activeNodes.push(osc1, osc2, filter, gain);
  }

  private playWind(startTime: number) {
    if (!this.ctx || !this.musicGain) return;
    // Heavy Wind: Pink Noise through modulated Bandpass
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02; // Pink noise approx
      lastOut = data[i];
      data[i] *= 3.5; 
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 1;

    // LFO for wind sweeping
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 300; // Sweep range

    const gain = this.ctx.createGain();
    gain.gain.value = 0.0; // Start silent
    gain.gain.linearRampToValueAtTime(0.4, startTime + 2); // Swell in faster and louder

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(startTime);
    lfo.start(startTime);

    this.activeNodes.push(noise, filter, lfo, lfoGain, gain);
  }

  private playBrassSwell() {
    if (!this.ctx || !this.musicGain || !this.isMusicPlaying) return;
    const now = this.ctx.currentTime;
    
    // Epic Brass Chord: A Minor (A, C, E) + F Major (F, A, C) transition
    // Shifted up an octave for better audibility
    const notes = [110, 220, 329.63, 440, 659.25]; // A2, A3, E4, A4, E5
    
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.exponentialRampToValueAtTime(3000, now + 2); // Swell open brighter
      filter.frequency.exponentialRampToValueAtTime(200, now + 6); // Fade close

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 1.5); // Faster attack, louder
      gain.gain.linearRampToValueAtTime(0, now + 6); // Release

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain!);

      osc.start(now);
      osc.stop(now + 7);
      
      this.activeNodes.push(osc, filter, gain);
    });
  }

  private startMelodicLoop() {
    if (!this.isMusicPlaying) return;
    
    // Loop interval: 8 seconds
    const loopDuration = 8000;
    
    const playLoop = () => {
      if (!this.isMusicPlaying) return;
      this.playHarpArpeggio();
      this.playPianoChords();
      this.schedule(playLoop, loopDuration);
    };

    playLoop();
  }

  private playHarpArpeggio() {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    
    // Secret of Mana style: Fast, magical arpeggios
    // Scale: A Dorian (A B C D E F# G)
    const scale = [440, 493.88, 523.25, 587.33, 659.25, 739.99, 783.99, 880];
    
    // Play 8 random notes from scale
    for (let i = 0; i < 8; i++) {
      const noteTime = now + (i * 0.25); // 16th notes approx
      const freq = scale[Math.floor(Math.random() * scale.length)];
      
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle'; // Softer than saw, brighter than sine
      osc.frequency.value = freq;
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.05); // Pluck louder
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.5); // Ring out
      
      osc.connect(gain);
      gain.connect(this.musicGain);
      
      osc.start(noteTime);
      osc.stop(noteTime + 2);
      
      this.activeNodes.push(osc, gain);
    }
  }

  private playPianoChords() {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    
    // Sparse, emotional chords
    // Chord: F Major 7 (F A C E) -> G Major (G B D) -> A Minor (A C E)
    const chords = [
      [174.61, 220, 261.63, 329.63], // Fmaj7
      [196, 246.94, 293.66], // G
      [220, 261.63, 329.63] // Am
    ];
    
    const chord = chords[Math.floor(Math.random() * chords.length)];
    
    chord.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine'; // "Electric Piano" feel
      osc.frequency.value = freq;
      
      // Add some FM synthesis for "bell" tone (Mana style)
      const mod = this.ctx!.createOscillator();
      mod.frequency.value = freq * 2;
      const modGain = this.ctx!.createGain();
      modGain.gain.value = 200; // Stronger bell tone
      
      mod.connect(modGain);
      modGain.connect(osc.frequency);
      
      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.1); // Louder
      gain.gain.exponentialRampToValueAtTime(0.001, now + 4);
      
      osc.connect(gain);
      gain.connect(this.musicGain!);
      
      osc.start(now);
      mod.start(now);
      osc.stop(now + 5);
      mod.stop(now + 5);
      
      this.activeNodes.push(osc, mod, modGain, gain);
    });
  }

  private stopMusic() {
    this.isMusicPlaying = false;
    
    // Clear schedules
    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts = [];

    // Stop all nodes
    this.activeNodes.forEach(node => {
      try {
        if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
          node.stop();
        }
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  playClick() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Crisp UI Click (High Tech) - Boosted Volume
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
    
    // Increased gain from 0.05 to 0.4 to cut through music
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

export const audio = new AudioEngine();

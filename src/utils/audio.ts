class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  
  private bgmElement: HTMLAudioElement | null = null;
  private currentMode: 'file' | 'procedural' = 'file';
  
  // Playlist management
  private playlist: string[] = [];
  private currentTrackIndex: number = 0;

  private activeNodes: AudioNode[] = [];
  private timeouts: number[] = [];
  private isMusicPlaying: boolean = false;

  constructor() {
    // Dynamically load all mp3, ogg, and wav files from the public/assets/music directory
    const files = import.meta.glob('/public/assets/music/*.{mp3,ogg,wav}', { eager: true, as: 'url' });
    this.playlist = Object.keys(files).map(path => path.replace('/public', ''));
    if (this.playlist.length === 0) {
      // Fallback if glob fails or no files found
      this.playlist = ['/assets/music/hackerloop.ogg'];
    }
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.4;
      
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.ratio.value = 12;
      this.masterGain.connect(compressor);
      compressor.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  setMode(mode: 'file' | 'procedural') {
    this.currentMode = mode;
    if (this.isMusicPlaying) {
      this.stopMusic();
      this.toggleMusic(true);
    }
  }

  getCurrentTrack(): string {
    if (this.playlist.length === 0) return 'No tracks found';
    const path = this.playlist[this.currentTrackIndex];
    return path.split('/').pop() || path;
  }

  nextTrack() {
    if (this.playlist.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    if (this.currentMode === 'file' && this.isMusicPlaying) {
      this.playCurrentFile();
    }
  }

  prevTrack() {
    if (this.playlist.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    if (this.currentMode === 'file' && this.isMusicPlaying) {
      this.playCurrentFile();
    }
  }

  private playCurrentFile() {
    if (this.bgmElement) {
      this.bgmElement.pause();
    }
    if (this.playlist.length === 0) return;
    
    this.bgmElement = new Audio(this.playlist[this.currentTrackIndex]);
    this.bgmElement.loop = true;
    this.bgmElement.volume = 0.4;
    this.bgmElement.play().catch(e => console.error("Audio play failed:", e));
  }

  toggleMusic(enable: boolean) {
    this.init();
    if (enable && !this.isMusicPlaying) {
      this.isMusicPlaying = true;
      if (this.currentMode === 'file') {
        this.playCurrentFile();
      } else {
        this.startLoFiCyberChill();
      }
    } else if (!enable && this.isMusicPlaying) {
      this.stopMusic();
    }
  }

  private startLoFiCyberChill() {
    if (!this.ctx) return;
    this.isMusicPlaying = true;
    
    // Start the layers
    this.startPadLoop();
    this.startBeatLoop();
    this.startMelodicTextureLoop();
  }

  // --- LAYERS ---

  private startPadLoop() {
    const chords = [
      [220, 261.63, 329.63, 392], // Am7
      [146.83, 174.61, 220, 261.63], // Dm7
      [196, 246.94, 293.66, 349.23], // G7
      [130.81, 164.81, 196, 246.94]  // Cmaj7
    ];
    let currentChord = 0;

    const playChord = () => {
      if (!this.isMusicPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 8.0; // Longer duration for more continuity
      const chord = chords[currentChord];

      chord.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        // Add subtle detune for warmth
        const detune = this.ctx!.createOscillator();
        detune.frequency.value = 0.3 + (i * 0.1);
        const detuneGain = this.ctx!.createGain();
        detuneGain.gain.value = 3;
        detune.connect(detuneGain);
        detuneGain.connect(osc.frequency);
        detune.start(now);

        const g = this.ctx!.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.04, now + 3.0); // Very slow attack
        g.gain.setValueAtTime(0.04, now + duration - 3.0);
        g.gain.linearRampToValueAtTime(0, now + duration); // Very slow release

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        
        // Filter modulation for "breathing" effect
        const filterLfo = this.ctx!.createOscillator();
        filterLfo.type = 'sine';
        filterLfo.frequency.value = 0.1;
        const filterLfoGain = this.ctx!.createGain();
        filterLfoGain.gain.value = 200;
        filterLfo.connect(filterLfoGain);
        filterLfoGain.connect(filter.frequency);
        filter.frequency.setValueAtTime(600, now);
        filterLfo.start(now);

        osc.connect(filter);
        filter.connect(g);
        g.connect(this.musicGain!);
        
        osc.start(now);
        osc.stop(now + duration);
        
        this.activeNodes.push(osc, detune, g, filter, filterLfo);
      });

      currentChord = (currentChord + 1) % chords.length;
      this.schedule(playChord, (duration - 2) * 1000); // Overlap for seamless transition
    };

    playChord();
  }

  private startBeatLoop() {
    const bpm = 80;
    const stepTime = 60 / bpm;
    let step = 0;

    const loop = () => {
      if (!this.isMusicPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Kick on 1 and 3
      if (step % 4 === 0 || step % 4 === 2) {
        this.playSoftKick(now);
      }
      
      // Snare on 2 and 4
      if (step % 4 === 1 || step % 4 === 3) {
        this.playSoftSnare(now);
      }

      step++;
      this.schedule(loop, stepTime * 500); // 8th notes
    };
    loop();
  }

  private playSoftKick(time: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    osc.frequency.setValueAtTime(80, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.15);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.12, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(g);
    g.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + 0.25);
  }

  private playSoftSnare(time: number) {
    if (!this.ctx || !this.musicGain) return;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.04, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    noise.connect(filter);
    filter.connect(g);
    g.connect(this.musicGain);
    noise.start(time);
  }

  private startMelodicTextureLoop() {
    const scale = [440, 493.88, 523.25, 587.33, 659.25, 783.99]; // A Minor Pentatonic
    
    const playNote = () => {
      if (!this.isMusicPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const freq = scale[Math.floor(Math.random() * scale.length)];
      const duration = 6.0 + Math.random() * 4.0;

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.02, now + 2.0);
      g.gain.setValueAtTime(0.02, now + duration - 2.0);
      g.gain.linearRampToValueAtTime(0, now + duration);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;

      osc.connect(filter);
      filter.connect(g);
      g.connect(this.musicGain!);
      
      osc.start(now);
      osc.stop(now + duration);
      
      this.activeNodes.push(osc, g, filter);
      
      this.schedule(playNote, 4000 + Math.random() * 6000);
    };

    playNote();
  }

  // --- INTERACTION ---

  triggerInteraction() {
    if (!this.ctx || !this.isMusicPlaying) return;
    const now = this.ctx.currentTime;
    
    // Subtle harmonic swell on interaction
    this.musicGain?.gain.setTargetAtTime(0.5, now, 0.2);
    this.musicGain?.gain.setTargetAtTime(0.4, now + 1.0, 1.5);
  }

  playClick() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    
    // Star Trek / LCARS style high-tech beep
    const duration = 0.08;

    // Tone 1: Base high frequency
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2048, now);

    // Tone 2: A perfect fifth above for that classic sci-fi harmony
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3072, now);

    const g = this.ctx.createGain();
    // Clean envelope: sharp attack, flat sustain, quick release
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.15, now + 0.01);
    g.gain.setValueAtTime(0.15, now + duration - 0.02);
    g.gain.linearRampToValueAtTime(0, now + duration);

    osc1.connect(g);
    osc2.connect(g);
    g.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // --- UTILS ---

  private stopMusic() {
    this.isMusicPlaying = false;
    if (this.bgmElement) {
      this.bgmElement.pause();
    }
    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts = [];
    this.activeNodes.forEach(node => {
      try {
        if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  private schedule(fn: () => void, delay: number) {
    const id = window.setTimeout(fn, delay);
    this.timeouts.push(id);
  }
}

export const audio = new AudioEngine();

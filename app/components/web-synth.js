import Ember from 'ember';

const {get, set} = Ember;

export default Ember.Component.extend({
  classNames: ['web-synth'],
  playing: false,
  volume: 0.1,
  frequency: 400,

  audioContext: null,
  oscillator: null,
  amp: null,

  didInsertElement() {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    const dest = ctx.destination;

    set(this, 'audioContext', new AudioContext());
    set(this, 'oscillator', osc);
    set(this, 'amp', amp);
    set(this, 'dest', dest);

    osc.type = 'sine';
    osc.frequency.value = get(this, 'frequency');
    osc.start();
    osc.connect(amp);

    amp.gain.value = get(this, 'volume');
  },

  play() {
    const amp = get(this, 'amp');
    amp.connect(get(this, 'dest'));
  },
  stop() {
    const amp = get(this, 'amp');
    amp.disconnect(get(this, 'dest'));
  },

  actions: {
    togglePlay() {
      const isPlaying = get(this, 'playing');

      isPlaying ? this.stop() : this.play();

      set(this, 'playing', !isPlaying);
    },
    changeVolume(value) {
      const amp = this.get('amp');

      set(this, 'volume', value);
      amp.gain.value = this.get('volume');
    },

    changeFrequency(value) {
      const osc = this.get('oscillator');
      set(this, 'frequency', value);
      osc.frequency.value = get(this, 'frequency');
    }
  }
});

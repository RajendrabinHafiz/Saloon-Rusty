import axios from "axios";

class AudioHandler {
  constructor() {
    this.sounds = {};
    this.sounds_url = {
      win: "/audio/win.wav",
      lose: "/audio/lose.wav",
      flip: "/audio/video_poker/flip.wav",
      deal: "/audio/video_poker/deal.wav",
      dice_win: "/audio/dice_win.mp3",
      dice_loose: "/audio/dice_loose.mp3",
      towers_loss: "/audio/towers/fail.mp3",
      towers_win: "/audio/towers/win.mp3",
      mines_win: "/audio/mines/achievement.mp3",
      mines_loss: "/audio/mines/explosion.mp3",
    };

    this.clicked = false;

    window.addEventListener("click", () => {
      if (!this.clicked) {
        this.clicked = true;
      }
    });
  }
  loadSounds(sounds) {
    return new Promise(async (resolve) => {
      let soundsLoaded = 0x0;

      for (let sound of sounds) {
        let soundLoad =
          sound in this.sounds
            ? true
            : await this.loadSound(sound, this.sounds_url[sound]);

        if (soundLoad) {
          soundsLoaded++;
        }
      }

      return resolve(soundsLoaded === sounds.length);
    });
  }
  loadSound(soundName, url) {
    return new Promise(async (resolve) => {
      try {
        if (soundName in this.sounds) {
          return resolve(false);
        }

        const fetchAudio = await axios.request({
          url,
          method: "GET",
          responseType: "arraybuffer",
        });

        if (fetchAudio.data) {
          this.sounds[soundName] = new AudioContext();
          this.sounds[soundName].decodeAudioData(
            fetchAudio.data,
            (buffer) => {
              this.sounds[soundName].buffer = buffer;
              return resolve(true);
            },
            console.error,
          );
        }
      } catch (error) {
        console.error(error);
        return resolve(false);
      }
    });
  }
  async playSound(sound) {
    try {
      if (!this.clicked) {
        throw new Error("[AUDIO]: The client didn't interact yet");
      }

      if (!(sound in this.sounds)) {
        throw new Error("[AUDIO]: Could not find that sound");
      }

      let soundContext = this.sounds[sound];
      let buffer = soundContext.buffer;

      if (buffer) {
        let source = soundContext.createBufferSource();

        source.buffer = buffer;

        source.connect(soundContext.destination);

        if (source.start) {
          source.start();
        } else {
          source.noteOn();
        }
      }
    } catch (error) {
      console.warn(String(error));
    }
  }
}

export const audio_handler = new AudioHandler();

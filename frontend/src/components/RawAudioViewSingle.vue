<template>
<div>
    <div v-if="playable" style="text-align: left">
        <button id="backward" class="btn btn-primary btn-sm" @click="wavesurfer.skipBackward()">
            <i class="glyphicon glyphicon-backward"></i>            
        </button>
        <button id="" class="btn btn-primary btn-sm" @click="wavesurfer.playPause()">
            <i class="glyphicon glyphicon-play"></i>/  
            <i class="glyphicon glyphicon-pause"></i>            
        </button>
        <button class="btn btn-primary btn-sm" @click="wavesurfer.skipForward()">
            <i class="glyphicon glyphicon-forward"></i>            
        </button> Filename: {{ name }}
    </div>
    <div v-if="playable">
        <div :id="id"></div>
    </div>
    <div v-else id="infoUnplayable">
        <p>Filename: {{ name }}</p>
        <strong>This Audio Is Not Playable.</strong>
    </div>
</div>
</template>

<script>
// const ffprobe = require("ffprobe");
// const ffprobeStatic = require("ffprobe-static");
import { eventBus } from "../main";
export default {
  props: ["audio"], // audio is an object with id and url of audio file
  data: function() {
    return {
      playable: true,
      // pass the audio info
      id: "audio" + this.audio.id,
      link: this.audio.link,
      name: "", // assigned in mounted()
      // duration: -1, // in secondes

      wavesurfer: null // wavefurfer will be created by WaveSurfer.create()
    };
  },
  methods: {
    // handleError called when audio is not playable
    setPlayableFalse(message) {
      this.playable = false;
    }
    // getDuration(link) {
    //   ffprobe(link, null, function(err, info) {
    //     if (err) console.log(err);
    //     console.log(info.streams[0].duration);
    //   });
    // }
  },
  // after the template is crated, mount it
  // WaveSurfer is from wavesurfer.min.js, it can be accessed from window
  // that's why to use window.WaveSurfer
  mounted() {
    this.wavesurfer = window.WaveSurfer.create({
      container: "#" + this.id,
      waveColor: "red",
      progressColor: "purple"
    });
    this.wavesurfer.load(this.link);
    this.wavesurfer.on("error", this.setPlayableFalse);

    // assign the name of audio file, that is the last part of link
    var temp = this.link.split("/");
    this.name = temp[temp.length - 1];

    // if (this.playable) {
    //   this.getDuration(this.link);
    // }
  },
  created() {
    eventBus.$on("stop", () => {
      if (this.wavesurfer.isPlaying()) {
        this.wavesurfer.pause();
      }
    });
  }
};
</script>

<style scoped>
#infoUnplayable {
  text-align: left;
}
</style>

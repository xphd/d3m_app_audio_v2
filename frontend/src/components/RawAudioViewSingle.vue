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
        </button> 
         <span>Filename: <strong>{{ name }}</strong></span>
         <span id="duration" >Duration: <strong>{{ duration }}</strong> seconds</span>
         
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
import { eventBus } from "../main";
export default {
  props: ["audio"], // audio is an object with id and url of audio file
  data: function() {
    return {
      wavesurfer: null, // wavefurfer will be created by WaveSurfer.create()

      // pass the audio info
      id: "audio" + this.audio.id,
      link: this.audio.link,
      name: "", // assigned in mounted()
      playable: true,
      duration: 0 // in secondes
    };
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
    const ws = this.wavesurfer;
    ws.load(this.link);

    // assign the name of audio file, that is the last part of link
    var temp = this.link.split("/");
    this.name = temp[temp.length - 1];

    ws.on("error", () => {
      this.playable = false;
    });

    ws.on("ready", () => {
      this.duration = Math.round(ws.getDuration() * 100) / 100;
    });

    eventBus.$on("stop", () => {
      if (ws.isPlaying()) {
        ws.stop();
      }
    });
  }
};
</script>

<style scoped>
#infoUnplayable {
  text-align: left;
}
#duration {
  float: right;
}
</style>

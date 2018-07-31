<template>
<div>
    <v-data-table :headers="headers" :items="audios" :pagination.sync="pagination" hide-actions class="elevation-1">
        <template slot="items" slot-scope="props">
            <td><strong>{{ props.item.id }}</strong></td>
            <td>
                <RawAudioViewSingle :audio='props.item' :key="props.item.id"></RawAudioViewSingle>
            </td>
        </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-xs-2"></div>
            <div class="col-xs-4">
                Jump to Page
                <input type="number" min="1" :max="pages" v-model.number="page">
                <button @click="setPage()" class="btn btn-primary btn-sm">Jump!</button>
            </div>
            <div class="col-xs-4">
                Audios Per Page
                <input type="number" min="1" :max="numOfAudioLinks" v-model.number="itemsPerPage">
                <button @click="setItemsPerPage()" class="btn btn-success btn-sm">Go!</button>
            </div>
            <div class="col-xs-2"></div>
        </div>
    </div>
</div>
</template>

<script>
import RawAudioViewSingle from "./RawAudioViewSingle.vue";
export default {
  data: function() {
    return {
      page: 1,
      itemsPerPage: 5,
      pagination: {
        rowsPerPage: 2,
        totalItems: 0
      },
      headers: [
        {
          text: "ID/d3mIndex",
          value: "id",
          align: "center"
        },
        {
          text: "Audio Wavesurfer",
          value: "link",
          align: "center"
        }
      ],

      audioLinks: [], // list of audios from backend response
      audios: [], // audio objects, {id, audioLink} where auidoLink is from audioLinks
      numOfAudioLinks: 0 // number of audioLinks totally, initialize as 0
    };
  },
  computed: {
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0;

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    }
  },
  sockets: {
    connect: function() {
      // console.log("Client: connect to Server");
    },
    // listen for "returnAudioLinks" emmited from backend with data "audioLinks"
    responseAudioLinks: function(audioLinks) {
      // this.$store.dispatch("updateAudioLinks", audioLinks); // update data in store
      // this.audioLinks = this.$store.getters.getAudioLinks; // update data in this vue object
      this.$store.audioLinks = audioLinks;
      this.audioLinks = this.$store.audioLinks;
      this.numOfAudioLinks = this.audioLinks.length; // update numOfAudioLinks
      this.pagination.totalItems = this.numOfAudioLinks;
      // this.loadAudios(this.numOfFirstLoaded); // when get audioLinks from backend, load some of them
      this.toAudiosObj(this.audioLinks);
      // console.log(this.audios.length);
    }
  },
  methods: {
    // temporary method, transfer the audioLinks to audios object, later the audioLinks will be removed,
    // while audios object will be obtained from backend server
    toAudiosObj(audioLinks) {
      var index = 0;
      audioLinks.forEach(audioLink => {
        var audio = {
          id: index,
          link: audioLink
        };
        this.audios.push(audio);
        index++;
      });
    },
    setPage() {
      this.pagination.page = this.page;
    },
    setItemsPerPage() {
      this.pagination.rowsPerPage = this.itemsPerPage;
    },
    requestAudioLinks() {
      this.$socket.emit("requestAudioLinks");
    }
  },
  created() {
    this.requestAudioLinks();
    this.numOfLoaded = this.numOfFirstLoaded;
  },
  components: {
    RawAudioViewSingle
  }
};
</script>

<style scoped>
input {
  text-align: right;
  border: 1px solid gray;
  width: 50px;
}
</style>

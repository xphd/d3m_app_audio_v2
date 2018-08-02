<template>
<div>
    <v-data-table :headers="headers" :items="audios" :pagination.sync="pagination" hide-actions class="elevation-1">
        <template slot="items" slot-scope="props">
            <td><strong>{{ props.item.id }}</strong></td>
            <td>
                <RawAudioViewSingle :audio='props.item' :key="props.item.id"></RawAudioViewSingle>
                <hr>
            </td>
        </template>
    </v-data-table>

    <div class="text-xs-center pt-2" v-on:click="stop"> 
        <v-pagination v-model="pagination.page" :length="pages" ></v-pagination>
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
                <select v-model.number="itemsPerPage">
                  <option value="5">5</option>
                  <option value="10">10</option>                  
                </select>
                <button @click="setItemsPerPage()" class="btn btn-success btn-sm">Go!</button>
            </div>
            <div class="col-xs-2"></div>
        </div>
    </div>
</div>
</template>

<script>
import RawAudioViewSingle from "./RawAudioViewSingle.vue";
import { eventBus } from "../main";
export default {
  data: function() {
    return {
      page: 1,
      itemsPerPage: 5,
      pagination: {
        rowsPerPage: 1,
        totalItems: 0
      },
      headers: [
        {
          text: "ID/d3mIndex",
          value: "id",
          align: "left"
        },
        {
          text: "Audio Wavesurfer",
          value: "link",
          align: "left",
          width: "95%"
        }
      ],
      audios: [], // audio objects, {id, audioLink} where auidoLink is from audioLinks
      numOfAudios: 0 // number of audioLinks totally, initialize as 0
    };
  },

  computed: {
    pages() {
      var isRowsPerPageNull = this.pagination.rowsPerPage == null;
      var isTotalItemsNull = this.pagination.totalItems == null;
      if (isRowsPerPageNull || isTotalItemsNull) {
        return 0;
      }
      var totalPages = this.pagination.totalItems / this.pagination.rowsPerPage;
      return Math.ceil(totalPages);
    }
  },
  sockets: {
    connect: function() {
      // console.log("Client: connect to Server");
    },
    // listen for "returnAudioLinks" emmited from backend with data "audioLinks"
    responseAudios: function(audios) {
      this.$store.audios = audios;
      this.audios = this.$store.audios;
      this.numOfAudios = this.audios.length; // update numOfAudios
      this.pagination.totalItems = this.numOfAudios;
    }
  },
  methods: {
    stop() {
      eventBus.$emit("stop");
    },
    setPage() {
      this.pagination.page = this.page;
      this.stop();
    },
    setItemsPerPage() {
      this.pagination.rowsPerPage = this.itemsPerPage;
      stop();
    },
    requestAudios() {
      this.$socket.emit("requestAudios");
    }
  },
  created() {
    this.requestAudios();
  },
  components: {
    RawAudioViewSingle
  }
};
</script>

<style scoped>
input {
  text-align: center;
  border: 1px solid gray;
  height: 25px;
  width: 50px;
}

select {
  border: 1px solid gray;
  height: 25px;
  width: 50px;
  appearance: menulist;
}
</style>

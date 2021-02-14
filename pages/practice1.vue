<template>
<div>
<v-container fluid>

<v-row class="text-center" justify="center" align="center" id="embedded_video" no-gutters resize>
<v-col cols="12" >

    <div style="position: relative">
      <v-row class="text-center" justify="center" align="center" id="show_data" no-gutters>
        <v-col cols="12" md="3"></v-col>
        <v-col cols="12" md="6">
            <youtube v-if="videoId!=''" ref="youtube" :video-id="videoId" :player-vars="playerVars" 
              @ready="onReady" @buffering="onBuffer" @paused="paused" @ended="ended" :resize="$vuetify.breakpoint.name=='xs'"
              @playing="playing" @cued="onCued" :fitParent="$vuetify.breakpoint.xsOnly" >
            </youtube> 
            <div class="video_control" style="position:absolute; top: 0px; width: 100%; height: 80px" @click="getPos($event)"></div>
          <div align="center" justify="center">
            <v-slider :label="$vuetify.breakpoint.smAndUp ? 'Playback rate' : ''"
              style="max-width: 400px"  @end="setPlayerSpeed" v-model="slider" thumb-label max="1" min="0.1" step="0.05"></v-slider>
          </div>
        </v-col>
        <v-col cols="12" md="3"></v-col>
      </v-row>
    </div>
         

<div :style="{ height: divheight + 'px',  overflow: 'auto'}">
      <v-row class="text-center" justify="center" align="center" id="show_data" no-gutters>
        <v-col cols="12" sm="4">
          <v-text-field class="mx-1"  label="email"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
        <v-select class="mx-1"  :items="popUnits" label="Point of Practice" return-object
                  item-text="level" item-value="value" @change="popChange($event)" ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
        <v-select class="mx-1" :items="chars" @change="charChange($event)" label="Character Form" :value="char"></v-select>
        </v-col>
      </v-row>

      <v-row no-gutters>
      <v-col cols="12">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left"> # </th>
              <th class="text-left"> Questions </th>
              <th class="text-right"> Rewd </th>
              <th class="text-right"> Play </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in fiveQues" :key="i" >
              <td class="text-left">  {{i+1}} </td>
              <td class="text-left" style="font-size:18px">
                <span v-if="char=='Traditional'">
                <span style="font-size: 18px" v-for="(phrase, index) in item.que.split(' ')" :key="index">  
                  <span v-if="phrase!='___'"> {{phrase}} </span>
                  <input @change="checkAns(item.ans, $event.target.value)"
                    v-if="phrase=='___'" :style="{width: (item.ans.length*18+6) + 'px'}">
                </span>
                </span>
                <span v-if="char=='Simplified'">
                <span style="font-size: 18px" v-for="(phrase, index) in item.queS.split(' ')" :key="index">  
                  <span v-if="phrase!='___'"> {{phrase}} </span>
                  <input @change="checkAns(item.ansS, $event.target.value)"
                    v-if="phrase=='___'" :style="{width: (item.ansS.length*18+6) + 'px'}">
                </span>
                </span>
              </td>
              <td class="text-right"> <v-icon color="blue" @click="rewind5()"> mdi-rewind-5 </v-icon> </td>
              <td class="text-right"> <v-icon color="orange darken-2" @click="playSegment(item)"> mdi-play-circle </v-icon> </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      </v-col>
      </v-row>
</div>


</v-col>
</v-row>
</v-container>

  <v-snackbar v-model="snackbar" :color="snackbar_color">
    {{ snackbar_text }}

      <v-btn text @click="snackbar = false">
        Close
      </v-btn>
  </v-snackbar>

</div>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import { randomIntFromInterval, compareValues, randomProperty, shuffle } from '../util/functions'
Vue.use(VueYoutube)
import OpenCC from 'opencc-js' // ver 0.3.0 NOT working, revert back to 0.2.1

export default {
  data() {
    return {
      popUnits: [],
      divdisplay: 'block',
      char: 'Traditional',
      chars: ['Simplified', 'Traditional'],
      dictItem: {},
      dialog: false,
      seekTo: null,
      fiveQues: [],
      queArr: [],
      videoCollection: [],
      videoDuration: null,
      videoId: 'qKTAf5hSyzY',
      slider: '1',
      playerVars: {
        autoplay: 0,
        controls: 0,
        start: 0,
        //end: 36,
        fs: 1,
        iv_load_policy: 3, // not working
        loop: 1, // not working
        modestbranding: 1, // no effect
        rel: 0,
        showinfo: 0,
        wmode: 'transparent',
        playsinline: 1
      },
      taValue: '',
      taVocab: '',
      ytURL: '',
      user_ans: '',
      snackbar: false,
      snackbar_text: '',
      snackbar_color: '',
      winHeight: 0,
      winWidth: 0,
    }
  },
  beforeDestroy () {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', this.onResize, { passive: true })
  },
  computed: {
    divheight () {
      if (this.$vuetify.breakpoint.name=='xs') {
        // appbar 64 padding 12 speed 54 buffer 10 iframe (window.innerWidth-39)/1.777
        return this.winHeight-142-(this.winWidth-39)/1.777
      } else {
        // appbar 64 padding 12 speed 54 buffer 10 iframe 360 = 560
        return this.winHeight-500
      }
    }
  },
  methods: {
    onResize () {
      this.winWidth = window.innerWidth
      this.winHeight = window.innerHeight
      //console.log( window.innerWidth, window.innerHeight )
      //console.log( (window.innerWidth-39)/1.777 ) // minus padding 12*2 and scrollbar 15
    },
    getPos(event) {
      console.log(event)
    },
    showDiv(event) {
      console.log(event)
    },
    charChange(event) {
      //console.log(event)
      this.char = event
    },
    /*  player.getPlayerState():Number // -1 – unstarted, 0 – ended, 1 – playing
              2 – paused, 3 – buffering, 5 – video cued                      */
    setPlayerSpeed(){
        this.$refs.youtube.player.setPlaybackRate(this.slider);
    },
    checkAns(ans, user_ans) {
      //console.log('check ans: ', ans, user_ans);
      if (user_ans === ans) {
          this.snackbar = true; this.snackbar_text = 'Great! ' + user_ans + ' is correct.'; this.snackbar_color = 'success';
      } else {
          this.snackbar = true; this.snackbar_text = 'Try again'; this.snackbar_color = 'warning';
      }
    },
    playSegment(obj) {
      // console.log(obj)
      // console.log( this.$refs.youtube )
      if (obj.vid == this.videoId) { // same video
          this.$refs.youtube.player.seekTo(obj.start, true)
      } else {
        this.videoId = obj.vid
        this.$refs.youtube.player.getPlayerState().then( state => {
          this.$refs.youtube.player.loadVideoById(this.videoId, obj.start)
          console.log('player state :', state )
        })
      }
    },
    rewind5() {
      this.$refs.youtube.player.getCurrentTime().then(time => {
        if (time>5) {
          this.$refs.youtube.player.seekTo(time-5, true);
          this.$refs.youtube.player.playVideo();
        } else {
          this.$refs.youtube.player.seekTo(0, true);
          this.$refs.youtube.player.playVideo();
        }
      })
    },
    onCued(obj) {
      console.log('video cued')
      //this.$refs.youtube.player.seekTo(this.seekTo, true);
      // this.$refs.youtube.player.playVideo();
    },
    ended(obj) {
      console.log('video ended')
    },
    paused(obj) {
      console.log('video is paused')
    },
    onBuffer(obj) {
      console.log('Buffering')
    },
    playing(obj) {
      console.log(obj.getDuration(), 'watching!!!')
    },
    onReady(obj) {
      console.log('video player is ready')
      this.videoDuration = obj.getDuration();
      //console.log( obj.hideVideoInfo() )
      //console.log( obj.isVideoInfoVisible() )
      //console.log( 'video player state:', obj.getPlayerState() )
    }
  },
  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
    //console.log(hsk_6)
    //this.level_Question()
    this.$fireAuth.signInAnonymously().catch( error => {
        console.log(error)
    })
    this.$fireAuth.onAuthStateChanged(user =>{
        if (user) {
            // User is signed in.
            this.$fireStore.collection('-video_practice').doc('Sekge8P2sRG7S5GyIzTf').get().then(doc =>{
            //console.log(doc.id, doc.data())
            this.fiveQues = doc.data().que
            }).catch(error => { console.log(error.message)})
                // ...
            } else {
            // User is signed out.
            // ...
        }
    })
  }
}
</script>

<style scoped>
/* iframe {
  width: 100%;
  max-width: 640px; /* Also helpful. Optional. 
} */
input {
  border-style: solid;
  border-color: cornflowerblue;
  padding-left: 2px;
}
/* .video_div {
  position: relative;
  clip-path: inset(0 0 20px 0);
  -webkit-clip-path: inset(0 0 20px 0);
}
iframe {
  clip-path: inset(0 0 20px 0);
  -webkit-clip-path: inset(0 0 20px 0);
}
.video_control {
  position: absolute;
  background-color: aqua;
  height: 50px;
  bottom: 0px;
  width: 100%;
} */
</style>
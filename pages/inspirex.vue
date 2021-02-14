<template>
<div class="shell">

<v-container>
    <v-row class="text-center mt-5" justify="center" align="center" id="embedded_video">
          <v-col cols="12" >
            <div class="cover_layer">
              <img v-if="videoId==''" width="640" height="360" class="splash" alt="Logo" src="../static/listening.png">
            </div>
            <div class="video_div" :style="{display: divdisplay}">
              <div class="video_control" :style="{display: divdisplay}"></div>
              <youtube v-if="videoId!=''" ref="youtube" :video-id="videoId" :player-vars="playerVars" 
                @ready="onReady" @buffering="onBuffer" @paused="paused" @ended="ended"
                @playing="playing" @cued="onCued"></youtube> 
              </div>
              <div align="center" justify="center">
                <v-slider style="width: 480px" label="Playback rate" @end="setPlayerSpeed" v-model="slider" thumb-label max="1" min="0.1" step="0.05"></v-slider>
              </div>
           
          </v-col>
    </v-row>



    <v-row class="text-center" justify="center" align="center" id="show_data">
      <v-col cols="12">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left"> # </th>
              <th class="text-left"> Questions </th>
              <th class="text-left"> Play </th>
              <th class="text-left"> Help </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in fiveQues" :key="i" >
              <td class="text-left">  {{i+1}} </td>
              <td class="text-left" style="font-size:18px">
                <span v-if="char=='Traditional'">
                <span style="font-size: 18px" v-for="(phrase, index) in item.que.split(' ')" :key="index">  
                  <span v-if="phrase!='___'"> {{phrase}} </span>
                  <input @change="checkAns(item.key, $event.target.value)"
                    v-if="phrase=='___'" :style="{width: item.sub.split(' ')[index].length*24 + 'px'}">
                </span>
                </span>
                <span v-if="char=='Simplified'">
                <span style="font-size: 18px" v-for="(phrase, index) in item.ques.split(' ')" :key="index">  
                  <span v-if="phrase!='___'"> {{phrase}} </span>
                  <input @change="checkAns(item.keys, $event.target.value)"
                    v-if="phrase=='___'" :style="{width: item.subs.split(' ')[index].length*24 + 'px'}">
                </span>
                </span>
              </td>
              <td class="text-left"> <v-icon @click="playSegment(item)"> mdi-play-circle </v-icon> </td>
              <td class="text-left"> <v-icon @click="showHelp(item)"> mdi-help-circle </v-icon> </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      </v-col>
    </v-row>

    <v-row class="text-center" justify="center" align="center" id="show_data">
      <v-col cols="4">
      <v-select class="mx-2" :items="hsk_levels" label="HSK Level" :value="hsk_level"
                item-text="level" item-value="value" @change="hskChange($event)" ></v-select>
      </v-col>
      <v-col cols="4">
      <v-btn class="primary" @click="randomFive"> randomFive </v-btn>
      <v-btn class="primary" @click="randomFive"> randomFive </v-btn>
      </v-col>
      <v-col cols="4">
      <v-select class="mx-2" :items="chars" @change="charChange($event)" label="Character Form" :value="char"></v-select>
      </v-col>
    </v-row>
</v-container>

  <v-snackbar v-model="snackbar" :color="snackbar_color">
    {{ snackbar_text }}

      <v-btn text @click="snackbar = false">
        Close
      </v-btn>
  </v-snackbar>

  <v-dialog v-model="dialog" max-width="600">
    <CharCard :dict="dictItem" />
  </v-dialog>

</div>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import hsk_1 from '../hsk/hsk-level-1'
import hsk_2 from '../hsk/hsk-level-2'
import hsk_3 from '../hsk/hsk-level-3'
import hsk_4 from '../hsk/hsk-level-4'
import hsk_5 from '../hsk/hsk-level-5'
import hsk_6 from '../hsk/hsk-level-6'
import { randomIntFromInterval, compareValues, randomProperty, shuffle } from '../util/functions'
Vue.use(VueYoutube)
import CharCard from '~/Components/CharacterCard'
import OpenCC from 'opencc-js' // ver 0.3.0 NOT working, revert back to 0.2.1

export default {
  data() {
    return {
      divdisplay: 'block',
      char: 'Traditional',
      chars: ['Simplified', 'Traditional'],
      dictItem: {},
      dialog: false,
      hsk_level: {level: 'HSK Level 1', value:'hsk_1'},
      hsk_levels: [{level: 'HSK Level 1', value:'hsk_1'}, {level: 'HSK Level 2', value:'hsk_2'}, {level: 'HSK Level 3', value:'hsk_3'}, {level: 'HSK Level 4', value:'hsk_4'}, {level: 'HSK Level 5', value:'hsk_5'}, {level: 'HSK Level 6', value:'hsk_6'}],
      seekTo: null,
      fiveQues: [],
      queArr: [],
      videoCollection: [],
      videoDuration: null,
      videoId: '',
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
    }
  },
  components: {
    CharCard
  },
  methods: {
    showDiv(event) {
      console.log(event)
    },
    hskChange(event) {
      console.log(event)
      this.hsk_level.value = event
      this.level_Question()
    },
    charChange(event) {
      console.log(event)
      this.char = event
    },
    showHelp(item){
      console.log(item)
      this.dialog = true
      let obj = {}
      if (this.char=='Traditional') {
        if (this.hsk_level.value=='hsk_1')
          obj = hsk_1.hsk_1.find(o => o.hanzit === item.key)

        this.dictItem = obj
      } else {
        if (this.hsk_level.value=='hsk_1')
          obj = hsk_1.hsk_1.find(o => o.hanzi === item.key)

        this.dictItem = obj
        console.log(obj)
      }
    },
    randomFive() {
      console.log(this.queArr)
      this.queArr.sort( compareValues('hanzit') )
      var temp = {}
      // group objects with same phrase & convert to array => temp_arr
      console.log('debug -----------')
      this.queArr.forEach(item => {
        //console.log(item.hanzi)
        if (!temp[item.hanzit]) 
          temp[item.hanzit] = []
        for (const prop in item.vocab) {
          //console.log(prop)
          temp[item.hanzit].push({vid: item.id, ...item.vocab[prop]})
        }        
      })
      console.log( this.queArr )
      var temp_arr = []
      temp_arr = Object.entries(temp)
      console.log( temp_arr )
      //return
      temp_arr.forEach(arr => {
        arr[1].forEach(item => {
          //console.log( item )
          item.key = arr[0]
          let subsplit = item.sub.split(' ')
          for (var i=0; i<subsplit.length; i++) {
            if (subsplit[i]==arr[0]) {
              subsplit[i] = '___'
            }
          }
          item.que = subsplit.join(' ')
        })
      })
      temp_arr = shuffle(temp_arr.slice())
      console.log(temp_arr)
      return

      this.fiveQues = []
      for (var i=0; i<5; i++) {
        const que_arr = temp_arr[i][1]
        if (que_arr.length==1) {
          this.fiveQues.push(que_arr[0])
        } else {
          // get a random que from the array que_arr
          this.fiveQues.push( que_arr[Math.floor(Math.random() * que_arr.length)] )
        }
      }         
      console.log(this.fiveQues);
      //return
      //if (this.char=='Traditional') {
          OpenCC.Converter('tw', 'cn').then(convert =>{
            //console.log( convert('中国') )
            for (var i=0; i<this.fiveQues.length; i++) {
              this.fiveQues[i]['keys'] = convert(this.fiveQues[i]['key'] )
              this.fiveQues[i]['ques'] = convert(this.fiveQues[i]['que'])
              this.fiveQues[i]['subs'] = convert(this.fiveQues[i]['sub'])
            }
          })
      //}
      this.videoId = this.fiveQues[0].vid
    },
    level_Question() {
      var temp = []
      this.queArr = []
      if (this.hsk_level.value == 'hsk_1')
        for (var i=0; i<20; i++) { temp.push( hsk_1.hsk_1[randomIntFromInterval(0, 149)] ) }// from HSK 1, 150 vocab items
      if (this.hsk_level.value == 'hsk_2')
        for (var i=0; i<20; i++) { temp.push( hsk_2.hsk_2[randomIntFromInterval(0, 149)] ) }
      if (this.hsk_level.value == 'hsk_3')
        for (var i=0; i<20; i++) { temp.push( hsk_3.hsk_3[randomIntFromInterval(0, 298)] ) }
      if (this.hsk_level.value == 'hsk_4')
        for (var i=0; i<20; i++) { temp.push( hsk_4.hsk_4[randomIntFromInterval(0, 600)] ) }
      if (this.hsk_level.value == 'hsk_5')
        for (var i=0; i<20; i++) { temp.push( hsk_5.hsk_5[randomIntFromInterval(0, 1299)] ) }
      if (this.hsk_level.value == 'hsk_6')
        for (var i=0; i<20; i++) { temp.push( hsk_6.hsk_6[randomIntFromInterval(0, 2499)] ) }
      //console.log( temp )
      
      temp.forEach(item => {
        //console.log(item.hanzi)
          this.$fireStore.collection(item.hanzit).get().then(snapshot => {
            if (snapshot.empty) {
              console.log( item.hanzit, ' no data')
            } else {
              snapshot.forEach(doc => {
                this.$fireStore.collection('-video_meta').doc(doc.id).get().then(vid => {
                  //if (vid.data().level=='novice')
                    this.queArr.push({id: doc.id, vid: vid.data(), hanzit: item.hanzit, vocab: doc.data()})
                    //console.log(doc.data())
                }).catch(error => { console.log(error.message)})
              })
            }
          }).catch(error => { console.log(error.message)})
      })
    },
    /*  player.getPlayerState():Number // -1 – unstarted, 0 – ended, 1 – playing
              2 – paused, 3 – buffering, 5 – video cued                      */
    setPlayerSpeed(){
        this.$refs.youtube.player.setPlaybackRate(this.slider);
    },
    checkAns(ans, user_ans) {
      //    console.log('check ans: ', ans, user_ans);
      if (user_ans === ans) {
          this.snackbar = true; this.snackbar_text = 'Correct'; this.snackbar_color = 'success';
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
    onCued(obj) {
      console.log(obj, 'video cued')
      //this.$refs.youtube.player.seekTo(this.seekTo, true);
      // this.$refs.youtube.player.playVideo();
    },
    ended(obj) {
      console.log(obj, 'video ended')
    },
    paused(obj) {
      console.log(obj, 'video is paused')
    },
    onBuffer(obj) {
      console.log(obj, 'Buffering')
    },
    playing(obj) {
      console.log(obj.getDuration(), 'we are watching!!!')
    },
    onReady(obj) {
      console.log(obj, 'video player is ready')
      this.videoDuration = obj.getDuration();
      //console.log( obj.hideVideoInfo() )
      console.log( obj.isVideoInfoVisible() )
      console.log( 'video player state:', obj.getPlayerState() )
    }
  },
  mounted() {
    //console.log(hsk_6)
    this.level_Question()
  }
}
</script>

<style scoped>
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
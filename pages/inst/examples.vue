<template>
<div class="shell">

<v-container>
<v-row id="embedded_video">
  <div style="padding-left: 10px" >
    <div class="cover_layer">
      <img v-if="videoId==''" width="640" height="360" class="splash" alt="Logo" src="@/static/listening.png">
    </div>
    <div class="video_div" :style="{display: divdisplay}">
        <div class="video_control" :style="{display: divdisplay}"></div>
        <youtube v-if="videoId!=''" ref="youtube" :video-id="videoId" :player-vars="playerVars" 
        @ready="onReady" width="960" height="540" ></youtube> 
    </div>
    <div style="font-size:24px; font-family: SimSun" align="center" justify="center">
      <p> [T] {{ playSubTrad }} </p>
        <p> [S] {{ playSubSimp }} </p>
    </div>
  </div>
  <v-col>
    <v-simple-table>
    <template v-slot:default>
        <thead>
        <tr>
            <th class="text-left"> # </th>
            <th class="text-left"> <v-slider style="width: 480px" label="Playback rate" @end="setPlayerSpeed" v-model="slider" thumb-label max="1" min="0.1" step="0.05"></v-slider></th>
            <th class="text-right"> Rewd / Play </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in demoQues" :key="i" >
            <td class="text-left"> {{i+1}} </td>
            <td class="text-left" style="font-size:18px">
              <div> {{item.sub}} </div>
            </td>
            <td class="text-right"> 
              <v-icon color="primary" @click="rewind5">mdi-rewind-5</v-icon>
              <v-icon color="green" @click="playSegment(item)"> mdi-play-circle </v-icon> </td>
        </tr>
        </tbody>
    </template>
    </v-simple-table>    
  </v-col>
</v-row>
<v-row>
    <v-col cols="4">
        <v-select class="mx-2" :items="myClasses" v-model="selClass" label="Class" item-text="class" @change="classChange" ></v-select>
    </v-col>
    <v-col cols="4">
        <v-select :return-object="true" class="mx-2" :items="duotingDemo" v-model="selUnit" item-text="name" @change="unitChange" label="Examples"></v-select>
    </v-col>
    <v-col cols="4">
      <v-text-field outlined v-model="demoURL"></v-text-field>
    </v-col>
</v-row>
</v-container>

</div>    
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

export default {
  data() {
    return {
      demoURL: '',
      playSubTrad: '',
      playSubSimp: '',
      selClass: '',
      selUnit: {},
      demoQues: [],
      duotingDemo: [],
      duotingDemo_all: [],
      divdisplay: 'block',
      seekTo: null,
      videoId: 'qKTAf5hSyzY',
      slider: '1',
      playerVars: {
        autoplay: 0,
        controls: 0,
        start: 0,
        fs: 1,
        iv_load_policy: 3, // not working
        loop: 1, // not working
        modestbranding: 1, // no effect
        rel: 0,
        showinfo: 0,
        wmode: 'transparent',
        playsinline: 1
      },
    }
  },
  methods: {
    unitChange(){
      this.demoQues = this.selUnit.que 
      console.log(this.selUnit, this.demoQues, this.duotingDemo)
      this.demoURL = 'https://firechrome-817a7.web.app/demo/?id=' + this.selUnit.id
    },
    classChange(){
      this.duotingDemo = []
      this.duotingDemo = this.duotingDemo_all.filter(item => {
        return item.class===this.selClass
      })
      if (this.duotingDemo.length==0) {
        this.sbcolor = 'warning'
        this.sbtext = 'No materials found. Go to "Authoring" to create content'
        this.snackbar = true
      }
      console.log(this.selClass, this.duotingDemo)
    },
    setPlayerSpeed(){
        this.$refs.youtube.player.setPlaybackRate(this.slider);
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
    playSegment(obj) {
      console.log(obj)
      this.playSubTrad = obj.sub
      this.playSubSimp = obj.simp
      //console.log( this.$refs )
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
    getAllDemoUnits(){
      this.$fireStore.collection('-demo').where('inst', '==', this.$store.state.user.email).get().then(query =>{
        console.log(query)
        if (query.empty) {
          this.sbcolor = 'warning'
          this.sbtext = 'No data found'
          this.snackbar = true
        } else {
          query.forEach(doc =>{
            if (doc.data().vis) {
              //this.duotingDemo.push(unit)
              this.duotingDemo_all.push({id: doc.id, ...doc.data()})
            }
          })
        }
      }).catch(error => { console.log(error.message) })
    },
    init() {
      if (this.$store.state.courses.length==0) {
        let myClass = []
        this.$fireStore.collection('-courses').where('inst', '==', this.$store.state.user.email)
          .get().then(query => {
              //console.log(query)
              if (!query.size) { 
                this.sbcolor = 'info'
                this.sbtext = 'Info: Create a new class to begin'
                this.snackbar = true
              } 
              if (query.size>0) {
                //console.log('process query results')
                query.forEach(doc => {
                    //console.log(doc.data())
                    if (doc.data().active)
                      myClass.push({ ...doc.data() })
                })
                this.$store.commit('setCourses', myClass)
                //console.log(myClass)
              }
          }).catch(error => {
            console.log(error.message)
          })
      }
    },
    onReady(obj) {
      console.log(obj, 'video player is ready')
      this.videoDuration = obj.getDuration();
      //console.log( obj.hideVideoInfo() )
      console.log( obj.isVideoInfoVisible() )
      console.log( 'video player state:', obj.getPlayerState() )
    }
  },
  computed: {
    myClasses() {
      return this.$store.state.courses
    },
  },
  mounted(){
      if (this.$store.state.items.length==1) {
        this.$router.push('/')
        //this.getAllDemoUnits()
      } else {
        this.getAllDemoUnits()
        if (this.$store.state.courses.length==0) {
          this.init()
        }
      }    
  }
}
</script>
<template>
  <div>
    <v-container fluid>
      <!-- <v-btn @click="getStats('629WAbrO4QX9cRMcXq40User')"> L06 D1-1 </v-btn>
      <v-btn @click="getStats('Sekge8P2sRG7S5GyIzTfUser')"> L13 practice </v-btn>
      <v-btn @click="getStats('2ZNb1CbQRRQWYUVYCZoaUser')"> L18 1 </v-btn>
      <v-btn @click="getStats('DwmcJnG90Sn3jSVzZDzLUser')"> L18 2-1 </v-btn>
      <v-btn @click="getStats('jVdiuGgSr6iSnWR8ScfbUser')"> L18 2-2 </v-btn>
      <v-btn @click="getStats('MYAdoAZY3H053tL0gZyiUser')"> L18 3 </v-btn>
      <v-btn @click="getStats('Gjnn95tX2z94XKTsqUsaUser')"> L18 4 </v-btn>
      <v-btn @click="getStats('OGXUS7pv2w0YrgUaZ655User')"> L18 5 </v-btn>
      <v-btn @click="getStats('9EOPEIm1da320F7BkIGuUser')"> L18 6 </v-btn> -->

<v-btn v-for="(quiz, i) in quizzes" :key="i" @click="getStats(quiz.id+'User')"> {{ quiz.queName }}</v-btn>

<v-row no-gutters resize>
<v-col v-for="item in tracking" :key="item.email">
    <v-icon class="pink--text"> mdi-account </v-icon> <span class="pink--text" v-if="1==1"> {{item.email}}  </span>
  <v-simple-table dense>
    <template v-slot:default>
      <tbody>
        <tr v-for="(act, i) in item.activity" :key="i" >
          <td class="text-left">  {{act.t.split(' ')[4]}} </td>
          <td class="text-left">
            <span v-if="act.evt.split(' ')[0]==='created'">
                <span class="blue--text"><v-icon class="blue--text"> mdi-star-three-points </v-icon> {{act.evt}} </span>
                <div class="font-weight-bold pink--text"> {{act.t}} </div>
            </span>
            <span v-else-if="act.evt.split(' ')[0]==='resumed'">
                <span class="blue--text"> <v-icon class="pink--text"> mdi-circle </v-icon> {{act.evt}} </span>
                <div class="font-weight-bold pink--text"> {{act.t.split(' ')[0]}}, {{act.t.split(' ')[1]}} {{act.t.split(' ')[2]}} </div>
            </span>
            <span v-else-if="act.evt.split(' ')[0]==='ip'">
                {{act.evt.split(' ')[1]}}
            </span>
            <span v-else-if="act.evt.split(' ')[0]==='rate'">
                <v-icon class="orange--text"> mdi-circle </v-icon> {{act.evt}}
            </span>
            <span v-else-if="act.evt.split(' ')[0]==='ans'">
                <v-icon v-if="act.evt.split(' ')[act.evt.split(' ').length-1]!='x'"
                    class="green--text" > mdi-circle </v-icon> 
                {{ act.evt }}
            </span>
            <span v-else>
                {{act.evt}}
            </span>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-col>

</v-row>
</v-container>
</div>
</template>

<script>
// import * as firebase from 'firebase/app';
// import 'firebase/firestore';
// import Vue from 'vue'
// import VueYoutube from 'vue-youtube'
// import { randomIntFromInterval, compareValues, randomProperty, shuffle } from '../util/functions'
// Vue.use(VueYoutube)
// import OpenCC from 'opencc-js' // ver 0.3.0 NOT working, revert back to 0.2.1

export default {
  data() {
    return {
      quizzes: [],
      tracking: [],
    }
  },
methods: {
  getStats(id) {
    console.log(id)
    this.tracking = []
    this.$fireStore.collection('-video_practice').doc(id).get().then(doc =>{
    const obj = doc.data()
    for (const prop in obj) {
        console.log(prop)
        this.tracking.push({email: prop, activity: obj[prop]})
    }
    }).catch(error => { console.error(error.message)})
  }
},
  mounted(){
    console.log('performance.vue')
    this.$fireStore.collection('-video_practice').where('class', '==', 'EALC 206')
      .orderBy('queName').get().then(docs =>{
      docs.forEach(doc =>{
        this.quizzes.push({id: doc.id, ...doc.data()})
      })
    })
  }
}
</script>
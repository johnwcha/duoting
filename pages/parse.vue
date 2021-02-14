<template>
<div>
  <v-layout>
    <v-row class="text-center mt-5" justify="center" align="center" id="embedded_video">
      <v-col cols="12">
        <v-textarea v-model="ta"></v-textarea>
        <v-btn color="primary" @click="showJson"> show </v-btn>
        <v-btn color="primary" @click="getMetadata"> get -video_meta </v-btn>
        <v-textarea v-model="ta_1"></v-textarea>
        <v-btn color="primary" @click="removeEng"> remove Eng </v-btn>
      </v-col>
    </v-row>
  </v-layout>
</div>
</template>

<script>
import { randomIntFromInterval, compareValues, randomProperty, shuffle } from '../util/functions'
import OpenCC from 'opencc-js' // ver 0.3.0 NOT working, revert back to 0.2.1

export default {
  data() {
    return {
      ta: '',
      taArr: [],
      ta_1: '',
      ta_1Arr: [],
    }
  },
  methods: {
    removeEng(){
      const input_lines = this.ta_1.split('\n')
      let output = []
      input_lines.forEach((item, index) => {
        if ((index % 4) === 0) {
          //console.log(item) // line number
          output.push(item)
        } else if ((index % 4) === 1) {
          output.push(item)
        } else if ((index % 4) === 2) {  
          //console.log(item.split('", "').join(' ').trim()) // subtitle to parse
          output.push(item.split(' ')[0])
        } else if ((index % 4) === 3) {
          output.push(item)
        } 
      })
      this.ta_1 = output.join('\n')
    },
    getMetadata() {
      this.$fireStore.collection('-video_meta').get().then(snapshots => {
        snapshots.forEach(doc => {
          console.log(doc.id, doc.data())
          this.taArr.push({vid: doc.id, ...doc.data()})
        })
      })
    },
    showJson(){
      console.log(this.taArr)
      this.ta = JSON.stringify(this.taArr)
    },
    uniqueChar(){
      let charCount = 0
      this.$fireStore.collection('-char_index').get().then(docs =>{
        console.log(docs, docs.size)
        docs.forEach(doc =>{
          console.log(doc.data().vocab)
          doc.data().vocab.forEach(line =>{
            //console.log(line)
            charCount += line.length
          })
        })
        console.log(charCount) // 772,948 as of 2/12/2021
      }).catch(err => {console.log(err.message)})
    },
    uniqueMinusPunc(){
      let count = 0

      this.$fireStore.collection('-video_meta').get().then(docs =>{
        docs.forEach(doc =>{
          this.$fireStore.collection(doc.id).get().then(docs =>{
            docs.forEach(doc =>{
              //console.log(doc.data().sub)
              const arr = doc.data().sub.split('')
              arr.forEach(char =>{
                if (char!=' ' && char!='，' && char!= '。' && char!= '？') {
                  //console.log(char)
                  count += 1
                }
              })
            })
            console.log(count)
          }).catch(err => {console.log(err.message)})

        })

      })


    }
  },
  mounted() {
    // firestoer delete database
    // sudo firebase firestore:delete --all-collections --project firechrome-817a7
    //this.uniqueChar()
    this.uniqueMinusPunc()
    // OpenCC.Converter('cn', 'tw').then(convert =>{
    //   console.log(convert('繫繩子，家具，很困想睡觉，系上绳子，这只恐龙，干嘛，沖泡面,喂，心脏病，不准出门'))
    // })
    // OpenCC.Converter('tw', 'cn').then(convert =>{
    //   console.log(convert('皇后的後面還有個後門'))
    //   console.log(convert('家裡鄰里之間'))
    // })
  }
}
</script>
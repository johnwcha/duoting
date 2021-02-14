<template>
<div>
  <v-layout>
    <v-row class="text-center mt-5" justify="center" align="center" id="embedded_video">
      <v-col cols="12">
        <v-textarea v-model="ta"> </v-textarea>
      </v-col>
    </v-row>
  </v-layout>
</div>
</template>

<script>
import OpenCC from 'opencc-js' // ver 0.3.0 NOT working, revert back to 0.2.1

export default {
  data() {
    return {
      ta: 'student profile',
      taArr: [],
    }
  },
}
</script>
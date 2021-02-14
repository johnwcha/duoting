<template>
  <v-card
    class="mx-auto"
    max-width="600"
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline"> Help </v-list-item-title>
        <!-- v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle -->
      </v-list-item-content>
    </v-list-item>
                        <v-divider></v-divider>
    <v-card-text>
      <v-row align="center">
        <v-col class="display-3" cols="12">
          <v-list-item-subtitle>[Traditional]</v-list-item-subtitle>
          <div style="font-family: SimSun"> {{dict.hanzit}} </div>
          <v-list-item-subtitle>[Simplified]</v-list-item-subtitle>
          <div style="font-family: SimSun"> {{dict.hanzi}} </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
      <v-row align="center">
        <v-col class="display-3" cols="12">
          <span style="font-family: SimSun"> {{dict.pinyin}} </span>
        </v-col>
      </v-row>
    </v-card-text>


    <v-list class="transparent">
      <v-list-item
        two-line
        v-for="(item, i) in dict.translations"
        :key="i"
      >
        <v-list-item-title> 
            <span style="padding-left: 20px; padding-right: 20px"> {{i+1}} </span>
            {{ item }}
        </v-list-item-title>

      </v-list-item>
    </v-list>

    <v-divider></v-divider>
  </v-card>
</template>

<script>
  export default {
    props: {
      dict: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
      }
    },
  }
</script>
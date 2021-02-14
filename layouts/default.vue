<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" fixed app
      :mini-variant="miniVariant" :clipped="clipped">
      <!-- <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img aspect-ratio="1" :src="require(`../static/assets/`+_animals[0])"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">
              Sandra Adams
            </v-list-item-title>
            <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->

     <v-divider></v-divider>
      <v-list>
        <v-list-item v-for="(item, i) in items" router exact
          :key="i" :to="item.to">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <!--
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      -->
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <!--
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      -->
    </v-app-bar>
      <v-main>
        <nuxt />
      </v-main>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Listening Is Vital'
    }
  },
  computed: {
    items () {
      return this.$store.state.items
    },
    _animals() {
      return this.$store.state._animals
    }
  },
  mounted() {
    // const temp = ['alligator.png', 'ant.png', 'bat.png', 'bear.png', 'bee.png', 'bird.png', 'bull.png', 'bulldog.png', 'butterfly.png', 'cat.png', 'chicken.png', 'cow.png', 'crab.png', 'crocodile.png', 'deer.png', 'dog.png', 'donkey.png', 'duck.png', 'eagle.png', 'elephant.png', 'fish.png', 'fox.png', 'frog.png', 'giraffe.png', 'gorilla.png', 'hippo.png', 'horse.png', 'insect.png', 'lion.png', 'monkey.png', 'moose.png', 'mouse.png', 'owl.png', 'penguin.png', 'pig.png', 'rabbit.png', 'rhino.png', 'rooster.png', 'shark.png', 'sheep.png', 'snake.png', 'tiger.png', 'turkey.png', 'turtle.png', 'wolf.png']
    // var _animals = []
    // temp.forEach(item => {
    //     var temp = {icon: item, player: ''}
    //     _animals.push(temp)
    // })
    // console.log(_animals.length, _animals)
    console.log('default vue loaded')
  }
}
</script>

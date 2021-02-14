<template>
  <v-card min-width="400" class="mx-auto">

    <v-app-bar dark color="orange lighten-1">
      <v-toolbar-title> Classes & Roster </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

      <v-row class="mx-3">
        <v-col cols="1" ></v-col>
        <v-col cols="10" >
          <v-text-field append-outer-icon="mdi-send" @click:append-outer="createClass"
            v-model="newClass" label="New class (ex: Chinese 101)" />
        </v-col>
        <v-col cols="1" ></v-col>
      </v-row>


      <v-simple-table>
        <thead>
          <tr>
            <th class="warning--text"> # </th>
            <th class="warning--text"> Class </th>
            <th class="warning--text text-right"> delete </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, i) in myClass" :key="item.id" name >
            <td> {{ i + 1 }} </td>
            <td> {{ item.class }} </td>
            <td class="text-right">
                <v-icon @click="deleteClass(item, i)" class="green--text mr-3" > mdi-delete </v-icon>
            </td>
          </tr>
        </tbody>
      </v-simple-table>


<v-snackbar v-model="snackbar" :color="sbcolor" bottom :timeout="sbtimeout">
    {{ sbtext }}
    <template>
        <v-btn dark text @click="snackbar = false">
          Close
        </v-btn>
    </template>
</v-snackbar>

  </v-card>
</template>

<script>
export default {
    data: () => ({
        sbtimeout: -1,
        sbcolor: 'info',
        sbtext: '',
        snackbar: false,
        myClass: [],
        newClass: '',
    }),
    methods: {
      deleteClass(item, index) {
        this.$fireStore.collection('-courses').doc(item.id).update({active: false})
          .then(() => {
            this.sbcolor = 'success'
            this.sbtext = 'Success: Class deleted'
            this.snackbar = true
            this.init()
          }).catch(error => {
            console.log(error)
          })
      },
      createClass() {
        const code = new Date().getTime().toString()
        const classid = this.$store.state.user.email + '_' + code.substring( code.length-5 )
        console.log('create class, id: ', classid)
        const obj = {class: this.newClass, inst: this.$store.state.user.email, active: true, id: classid}
        this.$fireStore.collection('-courses').doc(classid).set(obj)
          .then(() => {
            this.sbcolor = 'success'
            this.sbtext = 'Success: New class created'
            this.snackbar = true
            this.myClass.push(obj)
          }).catch(error => {
            console.log(error)
          })
      },
      init() {
        this.myClass = []
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
                    console.log(doc.data())
                    if (doc.data().active)
                      this.myClass.push({ ...doc.data() })
                })
                this.$store.commit('setCourses', this.myClass)
                console.log(this.myClass)
              }
          }).catch(error => {
            console.log(error.message)
          })
      }
    },
    computed: {
        user () {
            return this.$store.state.user
        }
    },
    mounted() {
      if (this.$store.state.items.length==1) {
        this.$router.push('/')
      } else {
        this.init()
      }
    }
}
</script>
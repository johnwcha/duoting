<template>
  <v-card min-width="400" class="mx-auto">

    <v-app-bar dark color="primary lighten-1">
      <v-toolbar-title> Profile </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-form>
        <v-container class="py-0">
            <v-row>
            <v-col cols="12" md="12">
                <v-text-field v-model="user.email" label="Email" readonly/>
            </v-col>

            <v-col cols="12">
                <v-text-field v-model="user.role" label="Role"/>
            </v-col>

            <!--            v-col cols="12" class="text-right">
                <v-btn color="light-blue" class="mr-0" dark @click="updateProfile" >
                Update Profile
                </v-btn>
            </v-col           -->

            </v-row>
        </v-container>
    </v-form>

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
    }),
    methods: {
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    mounted() {
      if (this.$store.state.items.length==1) {
        this.$router.push('/')
      }
      //this.checkUser()
    },

}
</script>
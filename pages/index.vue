<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center my-5">
      </div>

      <v-row>
        <v-col cols="6">
          <v-card class="ml-2">
            <v-card-title class="headline">
              Listening Is Vital for Language Learners
            </v-card-title>
            <v-card-text>
              <p> Many language learners focus a lot on speaking. They don’t spend as much effort on quietly listening.
              </p>
              <p>But, listening is a vital skill for language learning. Your listening comprehension pretty much determines your proficiency level.
              </p>
              <p>Research shows that when we communicate, we spend around 40-50% of our time listening, 25-30% speaking, 11-16% reading and only 9% writing (although that last one might have changed in recent years due to the rise in social media).
              </p>
              <p>That means we spend about half the time listening!
              </p>
              <p>The question is: Do you spend half your language learning time on listening exercises?
              </p>
              <div class="text-xs-right">
                <em><small>&mdash; Anonymous </small></em>
              </div>
              
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" v-if="1==1">
          <v-card class="mr-2" v-if="!registered">
            <v-card-title class="headline">
              Sign Up
            </v-card-title>
            <v-card-text>
              <v-text-field outlined v-model="userEmail" color="primary" label="Email"></v-text-field>
              <v-select :items="allRoles" v-model="userRole" label="User Role" outlined ></v-select>
              <v-text-field outlined v-if="userRole==='Student'" v-model="instEmail" color="primary" label="Instructor Email"></v-text-field>
              <v-text-field disabled outlined v-if="passcode!=''" v-model="passcode" label="Passcode"></v-text-field>
              <v-checkbox v-if="passcode!=''" v-model="remember" label="Save account info on this computer"></v-checkbox>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn :disabled="userEmail=='' || userRole==''" @click="register" color="primary">
                Continue
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-card class="mr-2" v-if="registered">
            <v-card-title class="headline">
              Sign In
            </v-card-title>
            <v-card-text>
              <v-text-field outlined v-model="userEmail" color="primary" label="Email"></v-text-field>
              <v-text-field outlined type="password" v-model="passcode" color="primary" label="Passcode"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn :disabled="passcode==''" @click="signIn" color="success">
                Continue
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  // components: {
  //   Logo,
  //   VuetifyLogo
  // },
  data() {
    return {
      userEmail: '',
      instEmail: '',
      allRoles: ['', 'Student', 'Instructor'],
      userRole: '',
      passcode: '',
      registered: false,
      remember: true,
    }
  },
  methods: {
    signIn() {
      console.log(this.userEmail, this.passcode)
      this.$fireStore.collection('-userAccount').doc(this.userEmail).get().then(doc => {
        if (doc.exists) {
          //console.log(doc.data())
          if (doc.data().code == this.passcode) {
            if (doc.data().role=='Instructor') {
              this.$store.commit('setUserRole', {email: this.userEmail, ...doc.data()})
              this.$router.push('inst/profile')
            } else {
              this.$store.commit('setUserRole', {email: this.userEmail, ...doc.data()})
              this.$router.push('user/profile')
            }
            //console.log('login success')
          } else {
            alert('The passcode is incorrect')
          }
        } else {
          alert('The account does not exist')
        }
      })
    },
    register() {
      if (this.passcode=='') {
        const code = new Date().getTime().toString()
        //console.log( code )
        if (this.userRole=='Student') {
          if (this.instEmail==''){
            alert('All fields are required')
          } else {
            this.passcode = code.substring( code.length-5 )
          }
        } else { // userRole = instructor
          this.passcode = code.substring( code.length-5 )
        }
      } else {
        localStorage.duoting_userEmail = this.userEmail
        if (this.remember) {
          localStorage.duoting_passcode = this.passcode
          localStorage.duoting_userRole  = this.userRole
          if (this.userRole=='Student') {
            localStorage.duoting_instEmail = this.instEmail
          }
        }
        this.$fireStore.collection('_userAccount').doc(this.userEmail).get().then(doc =>{
          //console.log(doc.exists)
          if (doc.exists) {
            alert('This email account already exists')
          } else {
            let obj = {}
            const now = new Date().toString()
            //console.log(now)
            //return
            if (this.userRole=='Instructor') {
              obj = {code: this.passcode, created: now, role: 'Instructor'}
            } else {
              obj = {code: this.passcode, created: now, role: 'Student', inst: this.instEmail}
            }
            this.$fireStore.collection('-userAccount').doc(this.userEmail).set(obj).then(() => {
              console.log('account created')
              this.registered = true
              if (this.userRole=='Instructor') {
                this.$store.commit('setUserRole', {email: this.userEmail, ...obj})
                this.$router.push('inst/profile')
              } else {
                this.$store.commit('setUserRole', {email: this.userEmail, ...obj})
                this.$router.push('user/profile')
              }
            }).catch(error => { console.log(error.message) })
          }
        }).catch(error => {
          console.log(error.message)
        })
      }
    },
    login() {
      console.log(this.$fireAuth.currentUser)
      this.$fireAuth.signInAnonymously().catch( (e) => {
        //console.log(e)
      })
      //this.signIn()
    }
  },
  mounted() {
    this.$fireAuth.onAuthStateChanged(user => {
      //console.log(user)
    })
    this.login()
    //console.log( new Date().getTime() )
    /* ------------------------------
    localStorage.duoting_instEmail
    localStorage.duoting_passcode
    localStorage.duoting_userEmail
    localStorage.duoting_userRole 
    ------------------------------ */
    if (!localStorage.duoting_userEmail) {
      this.registered = false
    } else {
      this.registered = true
      this.userEmail = localStorage.duoting_userEmail
      if (localStorage.duoting_passcode) {
        this.passcode = localStorage.duoting_passcode
      }
    }
  }
}
</script>
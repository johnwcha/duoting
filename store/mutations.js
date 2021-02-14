// export mutations as an object
export default {
    ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
        if (!authUser) {
          // claims = null
          // perform logout operations
        } else {
            state.uid = authUser.uid
            console.log( authUser )
            //console.log( claims )
        }
    },
    setUID: (state, uid) => {
        state.uid = uid
    },
    setCourses: (state, courses) => {
        state.courses = courses
    },
    setUserRole: (state, user) => {
        console.log(state,  user)
        state.user = user
        if (user.role === 'Instructor') {
            state.items = [ { icon: 'mdi-apps', title: 'Welcome', to: '/' },
                            { icon: 'mdi-account-circle', title: 'Account', to: '/inst/profile' },
                            { icon: 'mdi-file-presentation-box', title: 'Classes', to: '/inst/courses' },
                            { icon: 'mdi-pencil', title: 'Authoring', to: '/inst/authoring' },
                            { icon: 'mdi-teach', title: 'Demo', to: '/inst/examples' },
                            { icon: 'mdi-headphones', title: 'Practice', to: '/inst/practice' }]
        } else {
            state.items = [ { icon: 'mdi-apps', title: 'Welcome', to: '/' },
                            { icon: 'mdi-account', title: 'Account', to: '/user/account' },
//                            { icon: 'mdi-file-presentation-box', title: 'Class', to: '/user/class' },
                            { icon: 'mdi-headphones', title: 'Listening', to: '/user/listening' }]
        }
    },
    resetItems: (state) => {
        state.items = [
            {
              icon: 'mdi-apps',
              title: 'Welcome',
              to: '/'
            }
          ]
    },
}
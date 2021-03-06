const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => {
  return {
    auth: null
  }
}
export const mutations = {
  setAuth (state, auth) {
    state.auth = auth
  },
  setProject (state, project){
    state.auth.Proyecto = project
  }
}
export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = JSON.parse(parsed.auth)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setAuth', auth)
  }
}



// export const state = () => ({
//     token: null,
//     user: null
// });

// export const mutations = {
//     saveUser(state, user){
//         state.user = user;
//     },
//     saveToken(state, token){
//         state.token = token;
//     }
// };


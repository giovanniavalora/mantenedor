export default function ({ $axios, store, redirect }) {
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)

    if ([401, 403].includes(code)) {
      // app.$auth.logout();
      
      store.commit('setAuth', null)
      // Cookie.remove('auth')
      redirect('/login')
    }

    return Promise.reject(error);
  })
}
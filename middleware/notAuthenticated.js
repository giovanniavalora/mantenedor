export default function ({ store, redirect }) {
    // Si el usuario está autenticado, redireccionar al home page
    if (store.state.auth) {
        return redirect('/')
    }
  }
  
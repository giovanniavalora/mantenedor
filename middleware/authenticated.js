export default function ({ store, redirect }) {
    // Si el usuario no está autenticado, redirigir al login
    if (!store.state.auth) {
        return redirect('/login')
    }
  }
  
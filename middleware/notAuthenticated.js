export default function ({ store, redirect }) {
    // Si el usuario está autenticado, redireccionar al home page
    if (store.state.auth) {
        if (!store.state.auth.Proyecto) { //Pero no ha seleccionado proyecto
            return redirect('/seleccion_proyecto')
        }
        return redirect('/')
    }
  }
  
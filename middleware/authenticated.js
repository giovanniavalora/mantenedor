export default function ({ store, redirect }) {
    // Si el usuario no está autenticado, redirigir al login
    if (!store.state.auth) {
        return redirect('/login')
    }else{
        if (Object.entries(store.state.auth['Proyecto']).length===0) { //Pero no ha seleccionado proyecto
            return redirect('/seleccion_proyecto')
        }
    }
    
  }
  
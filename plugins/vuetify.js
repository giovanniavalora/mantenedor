import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'

const vuetify = new Vuetify({
    customVariables: ['~/assets/variables.scss'],
    theme: {
        themes: {
        light: {
            primary: '#3f51b5',
            secondary: '#b0bec5',
            accent: '#8c9eff',
            error: '#b71c1c',
        },
        },
    },
})

export default vuetify

// NADA DE ESTO FUNCIONA
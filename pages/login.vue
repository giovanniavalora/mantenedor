<template>
  <v-app>
    <v-card width="400" class="mx-auto mt-5">

      <v-card-title class="pb-0 justify-center" >
        Inicio de sesión
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field 
            label="RUT" 
            prepend-icon="mdi-account-circle"
          />
          <v-text-field 
            :type="showPassword? 'text' : 'password'" 
            label="Contraseña"
            prepend-icon="mdi-lock"
            :append-icon="showPassword? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-center">
        <v-btn color="info">Login</v-btn>
      </v-card-actions>
      
    </v-card>
  </v-app>
</template>

<script>
export default {
  layout: 'login',
  head:{
      title: 'Login',
      meta: [
          {
              hid: 'description',
              name: 'description',
              content: 'Login para acceder la Plataforma Control de Camiones'
          }
      ]
  },
  data () {
    return {
      showPassword: false
    }
  }
  
}
</script>

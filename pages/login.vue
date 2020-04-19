<template>
  <v-app>
    <!-- <a class="button is-primary" @click="logout">
      Bienvenido {{user}} 😄
    </a> -->
    <v-card width="400" class="mx-auto mt-12">

      <v-card-title class="pb-0 justify-center" >
        Inicio de sesión
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field 
            v-model="loginRut" 
            label="RUT" 
            prepend-icon="mdi-account-circle"
          />
          <v-text-field 
            v-model="loginPassword"
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
        <v-btn color="primary" @click="login">Ingresar</v-btn>
      </v-card-actions>
      
    </v-card>
  </v-app>
</template>






<script>
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  layout: 'login',
  middleware: 'notAuthenticated',
  data () {
    return {
      showPassword: false,

      loginRut: '',
      loginPassword: ''
    }
  },
  methods: {
    login() {
      console.log("login")
      return this.$axios.post("/login/",{
          rut: this.loginRut,
          password: this.loginPassword
        })
        .then(res => {
          if(res.data.data.token){
            console.log("token: ",res.data.data.token)
            // this.$store.commit("saveToken", res.data.data.token)
            // this.$store.commit('saveUser', this.loginRut)
            const auth = {
              User: this.loginRut,
              Token: res.data.data.token
            }
            // Reiniciamos los campos
            this.loginRut = ''
            this.loginPassword = ''
            this.$store.commit('setAuth', auth) // mutating to store for client rendering
            Cookie.set('auth', auth) // saving token in cookie for server rendering
            this.$router.push('/')
          }
        })
        .catch(error => {
          alert(Object.values(error.response.data))
        });
    }

  }
}
</script>





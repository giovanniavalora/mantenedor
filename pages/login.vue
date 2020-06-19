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
            v-model="loginEmail" 
            label="Email" 
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
import axios from 'axios';
export default {
  layout: 'login',
  middleware: 'notAuthenticated',
  data () {
    return {
      showPassword: false,

      loginEmail: '',
      loginPassword: ''
    }
  },
  methods: {
    login() {
        return this.$axios.post("/backend/login/",{
          email: this.loginEmail,
          password: this.loginPassword
        })
        .then(res => {
          console.log("res: ",res)
          if(res.data.data.token){

            this.$axios.get(`/backend/Proyecto/${res.data.data.info.proyecto}/`)
            .then(proyecto => {
              // console.log("dataproyecto: ",proyecto.data)
              const auth = {
                Email: this.loginEmail,
                Info: res.data.data.info,
                Proyecto: proyecto.data,
                Token: res.data.data.token
              }
              /* se agrega el token para las request a las apis */
              this.$axios.setToken(auth['Token'], 'Bearer')

              this.loginEmail = ''
              this.loginPassword = ''
              this.$store.commit('setAuth', auth) // mutating to store for client rendering

              /* Establecemos tiempo de caducidad de la cookie */
              var date = new Date();
              date.setTime(date.getTime() + (60 * 1000) ); //1 minuto

              /* saving token in cookie for server rendering */
              // Cookie.set('auth', auth, {expires: date}) //tiempo espacificado en date
              Cookie.set('auth', auth, {expires: 1}) //1 día
              this.$router.push('/')
              console.log("credenciales validadas correctamente")
              })
          }
        })
        .catch(error => {
          console.log("error: ", error.response.data)
        });
    }

  },
  // asyncData(context){
  //   if(process.server){
  //     console.log("hi! iam in the server side");
  //   }
  //   if(process.client){
  //     console.log("hi! iam in the client side");
  //   }
  // },


  // async asyncData({params}){
  //   if(process.server){
  //     console.log("SERVER SIDE")
  //     // const {data} = await axios.get(`http://apiman:5000/api/v1/Proyecto/1/`)
  //     // console.log(data)
  //   }
  //   console.log("CLIENT SIDE")
  //   // let {dato} = await axios.post(`api/v1`,{holi:'holi'})
  //   let dato = {}; 
  //   dato = await this.$axios.get(`/backend/api/v1/Proyecto/1/`);
  //   console.log("dato", dato);
  //   // return { algo: data}
  // }



  // async asyncData({params}){
  //   if(process.server){
  //     console.log("SERVER SIDE")
  //     // const {data} = await axios.get(`http://apiman:5000/api/v1/Proyecto/1/`)
  //     // console.log(data)
  //   }
  //   console.log("CLIENT SIDE")
  //   // let {dato} = await axios.post(`api/v1`,{holi:'holi'})
  //   let dato = {}; 
  //   dato = await this.$axios.get(`/backend/api/v1/Proyecto/1/`);
  //   console.log("dato", dato);
  //   // return { algo: data}
  // }

}
</script>





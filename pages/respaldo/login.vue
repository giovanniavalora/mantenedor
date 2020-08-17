<template>
  <v-app>
    <!-- <a class="button is-primary" @click="logout">
      Bienvenido {{user}} 😄
    </a> -->
    <v-flex class="text-center">
      
      <v-card width="400" class="mx-auto mt-12" elevation="24">

        <!-- <v-card-title class="pb-0 mb-2 justify-center" >
          <h1>Faena</h1>
        </v-card-title> -->
        
        <v-card-title class="pb-0 justify-center" >
          <img
            src="/Faena-texto-centrado.png"
            alt="Faena logo"
            class="mb-4"
            width="30%"
            height="30%"
          >
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

        <!-- <v-divider></v-divider> -->

        <v-card-actions >
          <v-btn class="mb-5" color="#3c35a1" tile outlined block @click="login">Ingresar</v-btn>
          <!-- <v-btn class="mb-2" color="#52dbeb" tile outlined block @click="login">Ingresar</v-btn> -->
          
        </v-card-actions>
        
      </v-card>

      <div id="images">
          <img
                src="/avalora.png"
                class="logo"
                alt="Avalora logo"
          >
          <img
                src="/OHL-svg.svg"
                class="logo"
                alt="OHL logo"
          >
      </div>

      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor" :top="snackTop">
        {{ snackText }}
        <v-btn text @click="snack = false">cerrar</v-btn>
      </v-snackbar>

    </v-flex>
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
      loginPassword: '',

      /* SnackBar */
      snack: false,
      snackColor: '',
      snackText: '',
      snackTop: true,
    }
  },
  methods: {
    login() {
        return this.$axios.post("/backend/login/",{
          email: this.loginEmail,
          password: this.loginPassword
        })
        .then(res => {
          // console.log("res: ",res)
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
          this.snack = true
          this.snackColor = 'error'
          this.snackText = 'El email o contraseña no son correctos'
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


<style>

    .theme--light.v-application{
      background-color: #f4faff;
      /* background-color: #c5cffa; */
    }
    /* h1{
      color:#3c35a1
    } */

    #images{
      text-align: center;
    }
    .logo{
      display: inline-block;
      margin-top: 50px;
      margin-left: auto;
      margin-right: auto;
      height: 100px;
    }


</style>


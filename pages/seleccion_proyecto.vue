<template>
  <v-app>
    <!-- <a class="button is-primary" @click="logout">
      Bienvenido {{user}} 😄
    </a> -->
    <v-flex d-flex>
      <v-layout wrap>
          <v-flex md4 v-for="item in proyectos" :key="item.id" class="mx-auto px-6 py-6">
              <v-card class="mx-auto px-12 py-12 " elevation="12">
                <v-card-title class="pb-0 justify-center" >
                    {{ item.nombre_proyecto }}
                </v-card-title>
                <!-- <v-btn @click="deleteItem(item.id)">Delete</v-btn> -->
                <v-card-actions >
                    <v-btn class="mb-5" color="#3c35a1" tile outlined block @click="SeleccionarProyecto(item)">Ingresar</v-btn>
                    <!-- <v-btn class="mb-2" color="#52dbeb" tile outlined block @click="login">Ingresar</v-btn> -->
                </v-card-actions>
              </v-card>
          </v-flex>
      </v-layout>
          



      <!--       
      <v-card width="400" class="mx-auto mt-12" elevation="24">
        
      </v-card> 
      -->
      



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
  computed: {
    idProyectos () {
      return this.$store.state.auth['Info'].proyecto;
    },
  },
  middleware({ store, redirect }){
    if (!store.state.auth) {
        return redirect('/login')
    }
  },
  data () {
    return {
      proyectos:[],

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
    SeleccionarProyecto(item){
      console.log("item seleccionado:", item)
      this.$store.commit('setProject', item) //Se almacena en el estado de vuex, pero se puede perder con refresh
      Cookie.set('auth', this.$store.state.auth) //Se guarda en las cookie para no perder el estado en un refresh
      this.$router.push('/')
    }
  },
  
  async created(){
    try {
      // console.log("token: ", this.$store.state.auth['Token'])
      this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')

      console.info("this.proyectos:",this.proyectos)
      
      let listaProyectos = this.$store.state.auth['Info'].proyecto
      console.info("seleccion proyecto:",listaProyectos)
      for(var indice in listaProyectos){
        console.info("idproyecto: ",listaProyectos[indice])
        const res = await this.$axios.get(`/backend/Proyecto/${listaProyectos[indice]}/`)
        this.proyectos.push(res.data);
        console.info("res.data:",res.data)
        console.info("this.proyectos:",this.proyectos)

      }
      
      /** Para mostrar los nombres de los Subcontratista en el dropdown del modal **/
      // const resp_origenes = await this.$axios.get('/backend/Origen/') //Se obtienen todos, pero debieran ser solo los del proyecto?
      // this.origenes = resp_origenes.data;
      // this.origenes = this.origenes.filter(x => x.proyecto === this.idProyecto)//Aquí se filtran los origenes pertenecientes al proyecto
    } catch (error) {
      console.log(error)
      // this.snack = true
      // this.snackColor = 'error'
      // this.snackText = error
    }
  }
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


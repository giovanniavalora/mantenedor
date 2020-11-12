<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <!-- <div class="text-center">
        <logo />
        <vuetify-logo />
      </div> -->
      <div class="text-center">
      </div>
      
      <v-card class="ma-3">
        <v-card-title class="headline">
            Reporte Diario Proyecto {{nombreProyecto}}
        </v-card-title>
        <v-card-text>
          <v-row justify="center">
              
              <v-col cols="12">
                <v-row justify="center">
                  <v-btn color="success" class="mb-2" @click="reporte_diario">Generar</v-btn>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row justify="center">
                  Este documento contiene los despachos realizados desde {{reporte_diario_inicio()}} 8:00 am hasta {{reporte_diario_fin()}} a las 8:00 am.
                </v-row>
              </v-col>

            </v-row>
        </v-card-text>
      </v-card>

      <v-card class="ma-3">
        <v-card-title class="headline">
            Reporte al Detalle
        </v-card-title>
        <v-card-text>
          <v-row justify="center">
              <v-col cols="12">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date1"
                      label="Desde"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date1" locale="es" first-day-of-week="1" @input="menu1=false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date2"
                      label="Hasta"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date2" locale="es" first-day-of-week="1" @input="menu2=false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-row justify="center">
                  <v-btn color="primary" class="mb-2" @click="reporte">Generar</v-btn>
                </v-row>
              </v-col>

            </v-row>
        </v-card-text>
      </v-card>
      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor" :top="snackTop">
        {{ snackText }}
        <v-btn text @click="snack = false">cerrar</v-btn>
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  middleware: 'authenticated',
  data(){
    return {
      date1: this.fecha_actual(),
      menu1: false,
      date2: this.fecha_actual(),
      menu2: false,

      time1: '8:00:00',
      time2: '8:00:00',

      /* SnackBar */
      snack: false,
      snackColor: '',
      snackText: '',
      snackTop: true,
    }
  },
  components: {
    Logo,
    VuetifyLogo
  },
  computed: {
    nombreProyecto () {
      return this.$store.state.auth['Proyecto'].nombre_proyecto;
    }
  },
  methods:{
    fecha_actual: function () { // Otra forma de escribir una función, es equivalente a: hora_actual (){ }
        // var prueba1 = (new Date).toLocaleString();
        // console.log("fecha y hora local: ",prueba1)

        var horaLocal = (new Date).toLocaleTimeString();
        console.log("hora local: ",horaLocal)
        var fechalocal = new Date().toLocaleDateString();

        var hoy = new Date();
        var dd = String(hoy.getDate()).padStart(2,'0');
        var mm = String(hoy.getMonth()+1).padStart(2,'0');
        var yyyy = hoy.getFullYear();

        hoy = yyyy+'-'+mm+'-'+dd
        console.log('hoy:',hoy)

        return hoy;
    },
    reporte_diario_inicio: function () { 
        let ocho = new Date()
        ocho.setHours(8,0,0)
        let diasatras
        
        if((new Date) < ocho){
          diasatras = 2
        }else{
          diasatras = 1
        }
        let ayer = new Date();
        ayer.setDate(ayer.getDate() - diasatras);
        ayer.toDateString()

        var dd = String(ayer.getDate()).padStart(2,'0'); //ayer
        var mm = String(ayer.getMonth()+1).padStart(2,'0');
        var yyyy = ayer.getFullYear();

        ayer = yyyy+'-'+mm+'-'+dd

        return ayer;
    },
    reporte_diario_fin: function () { 
        let ocho = new Date()
        ocho.setHours(8,0,0)
        let diasatras = 0
        
        if((new Date) < ocho){
          diasatras = 1
        }
        let ayer = new Date();
        ayer.setDate(ayer.getDate() - diasatras);
        ayer.toDateString()

        var dd = String(ayer.getDate()).padStart(2,'0'); //ayer
        var mm = String(ayer.getMonth()+1).padStart(2,'0');
        var yyyy = ayer.getFullYear();

        ayer = yyyy+'-'+mm+'-'+dd

        return ayer;
    },
    async reporte () {
      this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')
      try {
        this.$axios({
          method: 'GET',
          url: `/backend/Reporte/${this.date1}/${this.date2}/`,
          responseType: 'blob'
        }).then((response) => {
          // console.log("response.data.type",response.data.type)
          // console.log("response.headers",response.headers)
          if(response.status == 204){
              this.snack = true
              this.snackColor = 'error'
              this.snackText = 'No se encontraron registros. Indique otro rango de fechas.'
          }
          if(response.status == 200){
              const blob = new Blob([response.data], {type: response.data.type});
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              const contentDisposition = response.headers['content-disposition'];
              let fileName = this.fecha_actual()+'_Reporte.xlsx';
              /** Para descargar archivo con el nombre que viene desde la API */
              // if (contentDisposition) {
              //     console.log(contentDisposition)
              //     const fileNameMatch = contentDisposition.match(/filename="(.*)"/);
              //     console.log("fileNameMatch: ", fileNameMatch)
              //     if (fileNameMatch.length === 2)
              //         fileName = fileNameMatch[1];
              // }
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
          }
          
          
        }).catch((error) => {
          console.log("error1",error)
        });

      } catch (error) {
          console.log("error2",error)
      }
    },
    async reporte_diario () {
      this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')
      try {
        this.$axios({
          method: 'GET',
          url: `/backend/Reporte/${this.reporte_diario_inicio()}/08/00/00/${this.reporte_diario_fin()}/08/00/00/`,
          responseType: 'blob'
        }).then((response) => {
          // console.log("response.data.type",response.data.type)
          // console.log("response.headers",response.headers)
          if(response.status == 204){
              this.snack = true
              this.snackColor = 'error'
              this.snackText = 'No se encontraron registros. Indique otro rango de fechas.'
          }
          if(response.status == 200){
              const blob = new Blob([response.data], {type: response.data.type});
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              const contentDisposition = response.headers['content-disposition'];
              let fileName = this.fecha_actual()+'_Reporte.xlsx';
              /** Para descargar archivo con el nombre que viene desde la API */
              // if (contentDisposition) {
              //     console.log(contentDisposition)
              //     const fileNameMatch = contentDisposition.match(/filename="(.*)"/);
              //     console.log("fileNameMatch: ", fileNameMatch)
              //     if (fileNameMatch.length === 2)
              //         fileName = fileNameMatch[1];
              // }
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
          }
          
          
        }).catch((error) => {
          console.log("error1",error)
        });

      } catch (error) {
          console.log("error2",error)
      }
    }
  },
  mounted (){
      this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')
      this.fecha_actual()
  },
  async created(){
    this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')
    // try {
    //   this.$axios({
    //     method: 'GET',
    //     url: '/Reporte/',
    //     responseType: 'blob'
    //   }).then(res=>{
    //     let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
    //     let url = window.URL.createObjectURL(blob);
    //     window.location.href = url;
    //   }).catch(err=>{
    //     console.log(err)
    //   })

    // } catch (error) {
    //   console.log(error)
    // }
  }
}
</script>

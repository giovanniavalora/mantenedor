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
      <v-card>
        <v-card-title class="headline">
            Generar Reporte Proyecto {{nombreProyecto}}
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
      date1: new Date().toISOString().substr(0, 10),
      menu1: false,
      date2: new Date().toISOString().substr(0, 10),
      menu2: false,

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
        var currentDate = new Date();
        var currentDateWithFormat = new Date().toJSON().slice(0,10);
        console.log("currentDateWithFormat",currentDateWithFormat);
        return currentDateWithFormat;
        // var currentDateWithFormat = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        
    },
    async reporte () {
      this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')
      console.log("date1:",this.date1)
      console.log("date2:",this.date2)
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
              if (contentDisposition) {
                  console.log(contentDisposition)
                  const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                  
                  if (fileNameMatch.length === 2)
                      fileName = fileNameMatch[1];
              }
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

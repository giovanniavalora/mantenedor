<template>
  <v-layout>
    <v-flex>
      <div id="app">
        <v-app id="inspire">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >

                <v-text-field
                  v-model="editedItem.centro_de_coste"
                  :counter="20"
                  :rules="centro_de_coste_Rules"
                  label="Centro de coste"
                  filled
                  readonly
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.nombre_proyecto"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Nombre proyecto"
                  filled
                  readonly
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.ubicacion"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Ubicación"
                  filled
                  readonly
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.cliente"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Cliente"
                  filled
                  readonly
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.rut_cliente"
                  :counter="100"
                  :rules="rutRules"
                  label="Rut cliente"
                  filled
                  readonly
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.mandante"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Mandante"
                  filled
                  readonly
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.rut_mandante"
                  :counter="100"
                  :rules="rutRules"
                  label="Rut mandante"
                  filled
                  readonly
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.mandante_final"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Mandante Final"
                  filled
                  readonly
                  required
                ></v-text-field>

                <v-text-field
                  v-model.number="editedItem.cantidad_voucher_imprimir"
                  :counter="1"
                  :rules="nro_impresiones_Rules"
                  label="Cantidad de voucher a imprimir"
                  type="number"
                  required
                ></v-text-field>

                <v-row justify="center">
                    <v-btn
                      :disabled="!valid"
                      color="primary"
                      class="mr-4"
                      @click="validaryactualizar"
                    >
                      Actualizar
                    </v-btn>
                </v-row>

          </v-form>

          <div class="container mt-5">
              <v-data-table
                :headers="headers"
                :items="administradores"
                :items-per-page="10"
                :footer-props="{
                  itemsPerPageAllText: 'Todo',
                  itemsPerPageText: 'Filas por página'
                }"
                sort-by="rut"
                class="elevation-1"
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>Administradores</v-toolbar-title>
                    <v-divider
                      class="mx-4"
                      inset
                      vertical
                    ></v-divider>
                  </v-toolbar>
                </template>
              </v-data-table>
          </div>

        </v-app>
      </div>
    </v-flex>
  </v-layout>
</template>


<script>
export default {
  middleware: 'authenticated',

  data: () => ({
      valid: true,
      editedIndex: -1,
      editedItem: {
        id: '',
        centro_de_coste: '',
        nombre_proyecto: '',
        ubicacion: '',
        cliente: '',
        rut_cliente: '',
        mandante: '',
        rut_mandante: '',
        mandante_final: '',
        cantidad_voucher_imprimir: '',
      },
      centro_de_coste_Rules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 20) || 'Este campo debe tener menos de 20 caracteres',
      ],
      nombre_proyecto_Rules: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length <= 100) || 'Este campo debe tener menos de 100 caracteres',
      ],
      emailRules: [
        v => !!v || 'E-mail es requerido',
        v => /.+@.+\..+/.test(v) || 'E-mail debe ser valido',
      ],
      nro_impresiones_Rules: [
        // v => !!v || 'Es requerido',
        // v => v <= 5 || 'No puede ser superior a 5 impresiones',
        v => String(v).length > 0 || 'Este campo es requerido',
        v => Number.isInteger(Number(v)) || 'Este campo debe ser un número entero',
        v => v >= 0 || 'Este campo debe ser mayor o igual que 0',
        v => v <= 5 || 'No puede ser superior a 5 impresiones',
      ],
      rutRules:[
          v => !!v || 'Este campo es requerido',
          v => /^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(v) || 'Ingrese Rut sin puntos y con guión',
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      checkbox: false,



      headers: [
        {
          text: 'Rut',
          align: 'start',
          sortable: false,
          value: 'rut',
        },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Apellido', value: 'apellido' },
        { text: 'Último Ingreso', value: 'last_login' },
        { text: 'Cargo', value: 'cargo' },
        { text: 'Correo', value: 'email' },
        // { text: 'Actions', value: 'actions', sortable: false }
      ],
      administradores: [],
  }),

  methods: {
    validaryactualizar () {
      //validación
      this.$refs.form.validate()
      //actualización
      this.$axios.put(`/backend/Proyecto/${this.editedItem.id}/`,this.editedItem)
      .then(res => {
        alert("Actualizado correctamente")
      })
      .catch(error => {
        alert("No se pudo actualizar")
      });
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
  },
  computed: {
    idProyecto () {
      return this.$store.state.auth['Proyecto'].id;
    }
  },
  async created(){
    try {
      // const res = await axios.get('http://157.245.237.33:5000/api/v1/Camion/')
      // console.log("token: ", this.$store.state.auth['Token'])
      this.$axios.setToken(this.$store.state.auth['Token'], 'Bearer')
      const id = this.idProyecto
      const res = await this.$axios.get(`/backend/Proyecto/${id}/`)
      this.editedItem = res.data;
      // this.editedItem.cantidad_voucher_imprimir = String(this.editedItem.cantidad_voucher_imprimir);

      const res_admin = await this.$axios.get('/backend/Administrador/')
      this.administradores = res_admin.data;
      // this.administradores = this.administradores.filter(x => x.proyecto === this.idProyecto)
      this.administradores = this.administradores.filter(x => x.proyecto_admin.find(element => element === this.idProyecto))

    } catch (error) {
      console.log(error)
    }
  }
  
}
</script>
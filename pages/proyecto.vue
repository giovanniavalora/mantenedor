<template>
  <v-layout>
    <v-flex class="text-center">
      <div id="app">
        <v-app id="inspire">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              
              <v-col cols="12" sm="12" md="4">
                <v-text-field
                  v-model="centro_de_coste"
                  :counter="20"
                  :rules="centro_de_coste_Rules"
                  label="Centro de coste"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="nombre_proyecto"
                  :counter="100"
                  :rules="nombre_proyecto_Rules"
                  label="Nombre proyecto"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="select"
                  :items="items"
                  :rules="[v => !!v || 'Item is required']"
                  label="Item"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="4">
              </v-col>

              <v-col cols="12" sm="6" md="4">
              </v-col>

              <v-col cols="12" sm="6" md="4">
              </v-col>

              <v-col cols="12" sm="6" md="4">
              </v-col>

              <v-col cols="12" sm="6" md="4">
              </v-col>

              <v-col cols="12" sm="6" md="4">
              </v-col>

              <v-col cols="12" sm="6" md="4">
              </v-col>

              <v-col cols="12" sm="6" md="4">
              </v-col>

              <v-col cols="12" sm="6" md="4">
              </v-col>

              <v-col cols="12" sm="6" md="4">
              </v-col>


            </v-row>
           
        
                
            
                
            
                <v-checkbox
                  v-model="checkbox"
                  :rules="[v => !!v || 'You must agree to continue!']"
                  label="Do you agree?"
                  required
                ></v-checkbox>
            
                <v-btn
                  :disabled="!valid"
                  color="success"
                  class="mr-4"
                  @click="validate"
                >
                  Validate
                </v-btn>
            
                <v-btn
                  color="error"
                  class="mr-4"
                  @click="reset"
                >
                  Reset Form
                </v-btn>
            
                <v-btn
                  color="warning"
                  @click="resetValidation"
                >
                  Reset Validation
                </v-btn>
          </v-form>
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
    centro_de_coste: '',
    centro_de_coste_Rules: [
      v => !!v || 'Centro de coste es requerido',
      v => (v && v.length <= 20) || 'Este campo tener menos de 10 caracteres',
    ],
    nombre_proyecto: '',
    nombre_proyecto_Rules: [
      v => !!v || 'Nombre del proyecto es requerido',
      v => (v && v.length <= 100) || 'Este campo tener menos de 10 caracteres',
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail debe ser valido',
    ],
    select: null,
    items: [
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
    ],
    checkbox: false,
  }),

  methods: {
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
  },
  
}
</script>
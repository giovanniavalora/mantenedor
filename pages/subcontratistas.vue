<template>
  <v-layout>
    <v-flex class="text-center">
        <h1>Subcontratista</h1>
    
      <div class="container mt-5">
        <div class="v-card my-3" v-for="(item, index) in subcontratistas" :key="index">
          <div class="v-card-tittle">
            {{item.rut}}
          </div>
          <div class="v-card-tittle">
            {{item.razon_social}}
          </div>
        </div>
      </div>
      
    </v-flex>
  </v-layout>
</template>



<script>
import axios from 'axios';
export default {
  data(){
    return {
      subcontratistas: []
    }
  },
  async created(){
    try {
      const res = await axios.get('http://localhost:5000/api/v1/Subcontratista/')
      this.subcontratistas = res.data;
      console.log(res.data);
    } catch (error) {
      console.log(error)
    }
    
  }
}
</script>




<style>

</style>

<template>
    <div>
        <!-- <h1>{{lat}} {{lng}}</h1> -->

        <v-dialog v-model="dialog" max-width="900px">
            <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Agregar Nuevo</v-btn>
            </template>
            <v-card>
                <Map class="map" :lat="lat" :lng="lng" @latitudeChange="lat = $event" @longitudeChange="lng = $event"></Map>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import Map from '~/components/Map.vue';
export default {
    // layout: 'login',
    data(){
        return{
            dialog: false,
            lat: '-33.404889471',
            lng: '-70.567663758'
        }
    },
    components: {
        Map
    }
}
</script>

<style>
</style>
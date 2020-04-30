<template>
    <!-- <portal to="mapita"> -->
        <div id="map-wrap" if="browser">
            <div>
                <client-only>
                <l-map :zoom=16 
                    :center="[marcador.lat, marcador.lng]"
                    style="height: 30vh; width: 60vh; z-index: 0; transform: translate3d(-50px,-50px);"
                >
                <!-- style="height: 30vh; width: 50vh; z-index: 0" -->
                <!-- style="position:absolute; height:100%; width:100%; "  -->
                    <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                    <l-marker :lat-lng="[marcador.lat, marcador.lng]" :draggable='drag' @dragend="changeInput"></l-marker>
                    <!-- <l-marker v-for="marker in markers" :key="marker.id" :lat-lng="[marker.lat, marker.lng]" draggable="True"></l-marker> -->
                </l-map>
                </client-only>
            </div>
            <div>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field
                                v-model="marcador.lat"
                                label="Latitud"
                                :input="changeLatitude"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field
                                v-model="marcador.lng"
                                label="Longitud"
                                :input="changeLongitude"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
                <!-- <input type="text" :value="marcador.lat" @input="changeLatitude"> -->
                <!-- <input type="text" :value="marcador.lng" @input="changeLongitude"> -->
            </div>
        </div>
    <!-- </portal> -->
</template>

<script>
export default {
    ssr: false,
    props:['lat','lng'],
    data() {
        return {
            browser: process.browser,
            drag: true,
            marcador: {
                lat: this.lat, 
                lng: this.lng
            },
        }
    },
    methods: {
        changeLatitude(event){
            this.marcador.lat = event.target.value;
            this.$emit('latitudeChange',this.marcador.lat);
        },
        changeLongitude(event){
            this.marcador.lng = event.target.value;
            this.$emit('longitudeChange',this.marcador.lng);
        },
        changeInput(event){
            var marker = event.target;
            this.marcador.lat = String(marker.getLatLng().lat);
            this.marcador.lng = String(marker.getLatLng().lng);
            this.$emit('latitudeChange',this.marcador.lat);
            this.$emit('longitudeChange',this.marcador.lng);
        }
    },
}
</script>
<style>
  /* #map-wrap { 
    position: fixed !important;
    position: absolute;
    height: inherit;
    width: inherit;
  } */
  #map-wrap {
    text-align: center;
    /* position: absolute; */
    height: 100%;
    width: 100%;
    z-index: 1;
  } 
</style>
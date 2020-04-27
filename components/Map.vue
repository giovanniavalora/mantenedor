<template>

<div id="map-wrap" style="height: 80vh">
 <no-ssr>
   <l-map :zoom=16 :center="[markers[0].lat, markers[0].lng]">
     <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
     <l-marker v-for="marker in markers" :key="marker.id" :lat-lng="[marker.lat, marker.lng]" draggable="True"></l-marker>
   </l-map>
 </no-ssr>
</div>

</template>

<script>
  export default {
    ssr: false,
    data() {
      return {
        browser: process.browser,
        markers: [ 
          {id: 1, lat: -33.4350812, lng: -70.6826942 },
          {id: 2, lat: -33.4353220, lng: -70.6838581 }
        ]
      }
    }
  }
</script>
<style>
  #map-wrap {
    height: 100%;
    width: 100%;
  }
  
</style>
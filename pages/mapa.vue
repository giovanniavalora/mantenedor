<template>
<div>
  <Map class="map"></Map>
  <div class="overlay ">
    <section class="hero is-primary is-absolute">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">nuxt-leaflet</h1>
          <h2 class="subtitle">
            yarn add nuxt-leaflet
      </h2>
        </div>
      </div>
    </section>
  </div>
</div>

</template>

<script>
import Map from '~/components/Map.vue';
export default {
  components: {
    Map
  }
}
</script>

<style>
.overlay {
  position: absolute;
  
  z-index: 2;
  width: 100%;
  bottom: 0px;
}
.is-vcentered {
  justify-content: center;
  align-items: center;
}
.hero {
  bottom: 0px;
  position: absolute;
  width: 100%;
}
.map {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
}
</style>
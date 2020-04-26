<template>
    <div id="map-wrap" style="height: 100vh">
    <no-ssr>
    <l-map :zoom=13 :center="[55.9464418,8.1277591]">
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
        <l-marker :lat-lng="[55.9464418,8.1277591]"></l-marker>
    </l-map>
    </no-ssr>
    </div>
</template>

<template>
  <v-app light>

    <v-app-bar
      fixed
      app
      color = "#00428D"
    >

      <v-spacer />
      <v-toolbar-title id="layout-text" v-text="title" />
      <v-spacer />

      <div v-if="$store.state.auth" >
          <v-btn color="Primary" dark text disabled @click="logout">{{user}}</v-btn>
          <v-btn icon color="Primary" dark @click="logout">
            <v-icon>mdi-exit-to-app</v-icon>
          </v-btn>
      </div>

      
        <!-- <v-col class="d-flex justify-space-around">
          <v-toolbar-title id="layout-text" v-text="title" />
        </v-col>
        <v-col cols="2">
          <div v-if="$store.state.auth" >
              <v-btn color="Primary" dark text disabled @click="logout">{{user}}</v-btn>
              <v-btn icon color="Primary" dark @click="logout">
                <v-icon>mdi-exit-to-app</v-icon>
              </v-btn>
          </div>
        </v-col> -->
      <p v-else>
        <NuxtLink to="/login">
          login
        </NuxtLink>.
      </p>


    </v-app-bar>


    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

  </v-app>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware({ store, redirect }){
    if (!store.state.auth) {
        return redirect('/login')
    }
  },
  data () {
    return {
      fixed: true,
      title: 'Bienvenido a Faena'
    }
  },
  methods: {
    logout () {
      Cookie.remove('auth')
      this.$store.commit('setAuth', null)
      this.$router.replace({ path: '/login' })
    }
  },
  computed: {
    user: function(){
      return this.$store.state.auth['Info'].nombre;
    }
  },
}
</script>

<style>


    h1 {
      color: #00428D;
    }
    #layout-text{
      color: azure;
    }


</style>
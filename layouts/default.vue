<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      color = "#00428D"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon id="layout-text">{{ item.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content id="layout-text">
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
          
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color = "#00428D"
    >
      <v-app-bar-nav-icon id="layout-text" @click.stop="drawer = !drawer" />

      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
        id="layout-text"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>

      <!-- 
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>


      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->


      <v-toolbar-title id="layout-text" v-text="title" />
      <v-spacer /><!-- <v-spacer></v-spacer> -->
      <!-- <v-btn color="Primary" dark text >Cerrar Sesión</v-btn>
      <a class="button is-primary" @click="logout">
        Bienvenido {{user}} 😄
      </a> -->

      <div v-if="$store.state.auth">
        
        <v-btn color="Primary" dark text @click="logout">{{user}}<br>Cerrar Sesión</v-btn>
      </div>
      <p v-else>
        Please
        <NuxtLink to="/login">
          login
        </NuxtLink>.
      </p>

      <!--       
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->

    </v-app-bar>


    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <!-- 
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->


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
  data () {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        // {
        //   icon: 'mdi-apps',
        //   title: 'Proyecto',
        //   to: '/proyecto'
        // },
        {
          icon: 'mdi-cube-send',
          title: 'Despachadores',
          to: '/despachadores'
        },
        {
          icon: 'mdi-source-commit-start-next-local',
          title: 'Origenes',
          to: '/origenes'
        },
        {
          icon: 'mdi-source-commit-end-local',
          title: 'Destinos',
          to: '/destinos'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Subcontratistas',
          to: '/subcontratistas'
        },
        {
          icon: 'mdi-dump-truck',
          title: 'Flota',
          to: '/flota'
        },
        {
          icon: 'mdi-calendar',
          title: 'Reporte',
          to: '/'
        },
        // {
        //   icon: 'mdi-qrcode',
        //   title: 'CódigosQR',
        //   to: '/codigosqr'
        // }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Plataforma Control Camiones'
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
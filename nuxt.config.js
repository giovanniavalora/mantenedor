import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/Favicon.ico' },
    ]
  },

  // serverMiddleware: [
  //   {
  //     path: '/api/v1',
  //     handler: '~/api/index.js'
  //   }
  // ],

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // '@plugins/vuetify.js'
    // {src: '~/plugins/vue-leaflet', ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'nuxt-leaflet',
    'portal-vue/nuxt'
    // ['nuxt-leaflet', {ssr:false}],
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {

    proxy: true,
    // baseURL: "http://127.0.0.1:5000/api/v1"
    // baseURL: "http://192.168.0.8:5000/api/v1" 
    // baseURL: "http://157.245.237.33:5000/api/v1"
    // baseURL:
    //   process.env.NODE_ENV !== "production"
    //     ? "http://localhost:5000/api/v1"
    //     : "http://157.245.237.33:5000/api/v1"
    // baseURL: "http://apiman:5000/api/v1",
    // browserBaseURL: "http://192.168.0.8:5000/api/v1" 
  },


  proxy:{
    '/backend/': {
      target: 'http://apiman:5000',
      pathRewrite:{
        '^/backend/' : '/api/v1/',
      },
      changeOrigin: false,
    },
  },

  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.lighten2,
          accent: colors.grey.lighten3,
          secondary: colors.amber.lighten3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.lighten3
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.blue.darken3,
          secondary: colors.blue.darken3,
          info: colors.blue.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.deepOrange.accent3
        }
      }
    },
    options: {
      customProperties: true,
    },
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}

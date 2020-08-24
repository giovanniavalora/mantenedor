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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon-faena.ico' },
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
    '~/plugins/axios'
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
    // '@nuxtjs/auth',
    'nuxt-leaflet',
    'portal-vue/nuxt'
    // ['nuxt-leaflet', {ssr:false}],
  ],
  // auth:{
  //   plugins:[ '~/plugins/auth.js']
  // },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true,
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

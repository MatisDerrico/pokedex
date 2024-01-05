// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ["tslib"],
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/apollo", "@nuxtjs/tailwindcss", "@nuxt/image", "@nuxtjs/google-fonts"],
  apollo: {
    clients: {
      default: {
        httpEndpoint: "https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/clq0xx7vc06jr01uh5cfqbgvu/master",
      },
    },
  },
  tailwindcss: {
    config:  { 
      theme: {
      extend: {
        fontFamily: {
          'luckiestguy': ['"Luckiest Guy"', 'cursive'],
        },
      },
    },
    },
  },
  googleFonts: {
    display: 'swap',
    families: {
      'Luckiest+Guy': true,
    },
  },
});

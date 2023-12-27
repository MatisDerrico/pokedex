<script setup>
const query = gql`
  query Pokemon($slug: String!) {
    pokemon(where: { slug: $slug }) {
      id
      nom
      slug
      description
      height
      mass
      color {
        hex
      }
      pointDeVie
      createdAt
      publishedAt
      updatedAt 
      typeDePokemon {
      nom
      image {
        url
      }
      couleur {
        hex
      }
    }

      stage
      image {
        url(
          transformation: {
            image: { resize: { fit: crop, height: 1024, width: 1024 } }
            document: { output: { format: webp } }
          }
        )
      }
    }
  }
`;

const pokemon = ref();
const route = useRoute();
const { data } = await useAsyncQuery(query, {
  slug: route.params.slug,
});
console.log(data.value);
pokemon.value = data.value.pokemon;
</script>

<template>
  <Head v-if="pokemon">
    <Title>{{ pokemon.nom }} - Détails du Pokémon</Title>
    <Meta
      name="description"
      :content="`Découvrez des détails sur ${pokemon.nom}: ${pokemon.description}`"
    />
    <Meta
      property="og:title"
      :content="`${pokemon.nom} - Détails du Pokémon`"
    />
    <Meta
      property="og:description"
      :content="`Découvrez des détails sur ${pokemon.nom}: ${pokemon.description}`"
    />
    <Meta property="og:image" :content="pokemon.image.url" />
    <Meta property="og:type" content="website" />
    <Meta property="og:locale" content="fr_FR" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta
      name="twitter:title"
      :content="`${pokemon.nom} - Détails du Pokémon`"
    />
    <Meta
      name="twitter:description"
      :content="`Découvrez des détails sur ${pokemon.nom}: ${pokemon.description}`"
    />
    <Meta name="twitter:image" :content="pokemon.image.url" />
  </Head>

  <div v-if="pokemon" class="max-w-lg space-y-8 mx-auto">
    <NuxtImg class="" :src="pokemon.image.url" :alt="pokemon.nom" />
    <h2 class="text-3xl text-center">{{ pokemon.nom }}</h2>
    <p class="text-justify text-red-950">{{ pokemon.description }}</p>
    <p class="text-justify text-red-950">{{ pokemon.height }}</p>
    <div class="w-16" :style="`background-color:${pokemon.color.hex}`"><p class="text-justify text-red-950">{{ pokemon.color.hex }}</p></div>
    <p class="text-justify text-red-950">{{ pokemon.mass }}</p>
    <p class="text-justify text-red-950">{{ pokemon.pointDeVie }}</p>
    <template v-if="pokemon.typeDePokemon">
    <p class="text-justify text-red-950">Type de pokemon: {{ pokemon?.typeDePokemon?.nom }}</p>
    <NuxtImg class="" :src="pokemon.typeDePokemon.image.url" :alt="pokemon.typeDePokemon.nom" />
    <div class="w-16 h-16 rounded-full" :style="`background-color:${pokemon.typeDePokemon.couleur.hex}`"><p class="text-justify text-red-950"></p></div>
  </template>


  </div>
  <div v-else>
    <li>Loading...</li>
  </div>
</template>


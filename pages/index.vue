<script setup>
const query = gql`
  query Pokemons {
    pokemons(orderBy: id_ASC, first: 25) {
      createdAt
      description
      id
      nom
      publishedAt
      slug
      updatedAt
      image {
        url(
          transformation: {
            document: { output: { format: webp } }
            image: { resize: { fit: crop, height: 500, width: 500 } }
          }
        )
      }
      typeDePokemon {
        nom
        couleur {
        hex
      }
      }
    }
    typesDePokemon {
      nom
      image {
        url
      }
    }
  }

`;

const pokemons = ref();
const typesDePokemon = ref();
const { data } = await useAsyncQuery(query);
console.log(data.value);
pokemons.value = data.value.pokemons;
typesDePokemon.value = data.value.typesDePokemon
const detailPokemon = ref();
const selectedAttaque = ref();

const calculerPourcentage = (valeurActuelle, valeurMaximale) => {
    console.log( (valeurActuelle / valeurMaximale) * 100);
    return ((valeurActuelle / valeurMaximale) * 100);
  }

const appelPokemon = async (slug) => {
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

    attaques {
      degats
      nom
      description
        image {
          url
        }
        typeDePokemon {
        nom
        image {
          url
        }
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

  const { data } = await useAsyncQuery(query, {
    slug: slug,
  });
  console.log(data.value);
  selectedAttaque.value = {}
  detailPokemon.value = data.value.pokemon;
}


const { data: pokemonData } = await useAsyncQuery(query);
pokemons.value = pokemonData.value.pokemons;

const search = ref('');

const selectedType = ref("all");

const pokemonList = ref(pokemons.value);



const filterPokemons = () => {
  console.log(pokemonList.value);
  pokemonList.value = pokemons.value.filter((pokemon) => {
    console.log(pokemon);
    return pokemon.nom.toLocaleLowerCase().includes(search.value.toLocaleLowerCase());
  }).filter((pokemon) => {
    if (selectedType.value === "all") {
      return true
    }

    return pokemon.typeDePokemon?.nom === selectedType.value
  });
}

const selectType = (type) => {
  selectedType.value = type;
  filterPokemons()
}

</script>

<template>
<form class="flex items-center">
    <label for="simple-search" class="sr-only">Search</label>
    <div class="relative w-2/5 mx-auto">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
            </svg>
      </div>
      <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" v-model="search" @input="filterPokemons" placeholder="Cherchez un pokémon"/>
    </div>
  </form>


  <div class="w-5/6 flex justify-center space-x-8 py-12 mx-auto">
    <button class="bg-red-400 rounded-lg overflow-hidden" :class="{ 'ring-4 ring-yellow-400': selectedType === 'all' }" @click="selectType('all')">
    <NuxtImg src="/all.jpg" alt="all" class="h-16 w-16" />
            <h4 class="text-md text-center">Tous</h4>
    </button>

    <button class="bg-red-400 rounded-lg overflow-hidden" v-for="type in typesDePokemon" :class="{ 'ring-4 ring-yellow-400': selectedType === type.nom }" @click="selectType(type.nom)">
    <NuxtImg :src="type.image.url" :alt="type.nom" class="h-16 w-16" />
            <h4 class="text-md text-center">{{ type.nom }}</h4>
    </button>

  </div>


  <div :class="{ 'grid w-5/6 mx-auto gap-8': true, 'grid-cols-2': detailPokemon, 'grid-cols-1': !detailPokemon }">

    <div>
      <ul v-if="pokemonList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <li v-for="pokemon in pokemonList" :key="pokemon.id">
          <button class="px-2 pt-2 rounded-lg" :style="`background-color:${pokemon.typeDePokemon.couleur.hex}`" @click="appelPokemon(pokemon.slug)">
            <NuxtImg :src="pokemon.image.url" :alt="pokemon.nom" />
            <h2 class="text-xl text-left pl-1">{{ pokemon.nom }}</h2>
            <div class="flex justify-start p-1"><p class=" text-base border border-red-500 rounded-lg p-1 " >{{ pokemon.typeDePokemon.nom }}</p></div>
          </button>
        </li>
      </ul>

      <ul class="mt-5" v-else-if="search && !pokemonList.length">
        <!-- Si on a fait une recherche et que le résultat de la recherche est vide (ne correspond à aucun pokémon) alors tu affiches "no results found" -->
    <li>No results found!</li>
      </ul>

      <ul v-else>
        <li>Loading...</li>
      </ul>

    </div>



    <div v-if="detailPokemon" class="bg-white w-full">
      <div class="max-w-lg mx-auto">

        <div class="flex flex-col w-1/2 items-end mt-3">
            <div>
              <span>{{ detailPokemon.pointDeVie }} PV</span>
              <div class="h-1 bg-gray-200 mt-1" style="width: 100px;">
                <div class="h-1 bg-purple-500" :style="`width:${calculerPourcentage(detailPokemon.pointDeVie, 300)}%`"></div>
              </div>
            </div>
          </div>


        <div class="flex mt-2">
          <div class="flex flex-col w-1/2">
            <NuxtImg class="w-full " :src="detailPokemon.image.url" :alt="detailPokemon.nom" />
          </div>
          <div class="flex flex-col items-start space-x-2 ml-2 mr-2">

            <div v-if="detailPokemon.typeDePokemon" class="flex space-x-2">
              <NuxtImg class="h-12 w-12 rounded-full" :src="detailPokemon.typeDePokemon.image.url" :alt="detailPokemon.typeDePokemon.nom" />
              <p class=" text-white text-lg border border rounded-lg p-2" :style="`background-color:${detailPokemon.typeDePokemon.couleur.hex}`">{{ detailPokemon.typeDePokemon.nom }}</p>
            </div>


              <div class="flex items-center">
                <p class="text-sm pb-1">Hauteur</p>
                <p class="flex justify-center text-justify text-red-950 text-xl border w-36 rounded-full p-1">{{ detailPokemon.height }} m</p>
              </div>

              <div class="flex items-center">
                <p class="text-sm pb-1">Poids</p>
                <p class="flex justify-center text-justify text-red-950 text-xl border w-36 rounded-full p-1">{{ detailPokemon.mass }} kg</p>
              </div>

              <div class="flex items-center">
                <p class="text-sm pb-1">Couleur</p>
                <div class="flex justify-center text-justify text-red-950 text-xl border w-36 rounded-full p-1" :style="`background-color:${detailPokemon.color.hex}`">
                <p class="text-justify text-red-950">{{ detailPokemon.color.hex }}</p>
                </div>
              </div>



          </div>
        </div>





        <h2 class="text-5xl text-left">{{ detailPokemon.nom }}</h2>



        <p class="text-justify text-red-950">{{ detailPokemon.description }}</p>




        <h3 class="flex justify-center text-2xl">Attaques</h3>

        <div class="flex flex-wrap gap-4">

          <template v-for="attaque in detailPokemon.attaques" :key="attaque.nom">
            <NuxtImg class="h-20 w-20 rounded-full cursor-pointer" @click="selectedAttaque && selectedAttaque.nom == attaque.nom ? selectedAttaque.nom = false : selectedAttaque = { ...attaque }" :src="attaque.image.url" :alt="attaque.nom" />
          </template>

          <div v-if="selectedAttaque && selectedAttaque.nom">
              <p class="text-justify text-red-950">Attaques: {{ selectedAttaque.nom }}</p>
              <p class="text-justify text-red-950">description: {{ selectedAttaque.description }}</p>
              <p class="text-justify text-red-950">Degâts: {{ selectedAttaque.degats }}</p>
              <div class="mb-5 h-1 bg-gray-200">
                <div class="h-1 bg-purple-500" :style="`width:${calculerPourcentage(selectedAttaque.degats, 300)}%`"></div>
              </div>
              <p class="text-justify text-red-950">Type de l'attaque: {{ selectedAttaque.typeDePokemon.nom }}</p>
              <NuxtImg class="" :src="selectedAttaque.typeDePokemon.image.url" :alt="selectedAttaque.typeDePokemon.nom" />
          </div>

        </div>



        <h3 class="flex justify-center text-2xl">statistiques de base</h3>

        <div class="mb-5 h-1 bg-gray-200">
          <p class="h-1 bg-purple-500" :style="`width:${calculerPourcentage(detailPokemon.pointDeVie, 300)}%`" >PV: {{ detailPokemon.pointDeVie }}</p>
        </div>


        <div class="w-16" :style="`background-color:${detailPokemon.color.hex}`">
          <p class="text-justify text-red-950">{{ detailPokemon.color.hex }}</p>
        </div>


        <template v-if="detailPokemon.typeDePokemon">
          <p class="text-justify text-red-950">Type de Pokemon: {{ detailPokemon?.typeDePokemon?.nom }}</p>
          <NuxtImg class="" :src="detailPokemon.typeDePokemon.image.url" :alt="detailPokemon.typeDePokemon.nom" />
          <div class="w-16 h-16 rounded-full" :style="`background-color:${detailPokemon.typeDePokemon.couleur.hex}`">
            <p class="text-justify text-red-950"></p>
          </div>
        </template>

      </div>
    </div>
  </div>

  <!-- <div class="flex justify-center">
    <div class="bg-black w-2/5">
      <p class="text-white">p</p>
    </div>
    <div class="bg-white w-2/5">
      <p>p</p>
    </div>
  </div> -->
</template>

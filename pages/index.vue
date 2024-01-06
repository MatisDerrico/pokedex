<script setup>
// Requête GraphQL qui récupère les informations demandées sur mes pokémons (liste de pokémons).

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


const pokemons = ref(); // la variable pokemons est utilisée pour stocker la liste des Pokémon récupérée à partir de la requête GraphQL.

const typesDePokemon = ref(); // Elle est destinée à stocker les différents types de Pokémon récupérés à partir de la requête GraphQL.

const { data } = await useAsyncQuery(query); // Elle exécute une requête GraphQL de manière asynchrone en utilisant useAsyncQuery, elle attend sa réponse et extrait les données de cette réponse dans la variable data. 

console.log(data.value);

pokemons.value = data.value.pokemons; // met à jour la valeur stockée dans la référence réactive ref() pokemons avec les données des Pokémons obtenues à partir de la requête GraphQL => Data.value.pokemons. Value permet d'accéder à la valeur réelle stockée à l'intérieur de la référence réactive ref()


typesDePokemon.value = data.value.typesDePokemon // Effectue la même chose que la ligne précédente mais pour la variable TypesDePokemon
const detailPokemon = ref(); // cette référence detailPokemon est utilisée pour afficher les détails du Pokémon sélectionné
const selectedAttaque = ref(); // Cette référence selectedAttaque est mise à jour lorsqu'on clique sur une attaque spécifique d'un Pokémon. Elle est utilisée pour afficher les détails de l'attaque 


// Cette fonction prend deux paramètres : valeurActuelle et valeurMaximale. Elle calcule le pourcentage représenté par la valeurActuelle par rapport à la valeurMaximale. elle est utilisée pour calculer et afficher visuellement le pourcentage des points de vie actuels d'un Pokémon par rapport à leur valeur maximale qui fixé à 300. Elle est aussi utilisé pour afficher la barre de progression des dégâts d'une attaque par rapport à une valeur maximale de 300 (défini plus bas)

const calculerPourcentage = (valeurActuelle, valeurMaximale) => {
    console.log( (valeurActuelle / valeurMaximale) * 100);
    return ((valeurActuelle / valeurMaximale) * 100);
  }



// Création de la requête => Execution de la requête => récupérations des données => Affichage des données récupérees. Ces données mises à jour permettent d'afficher les détails d'un pokémon lorsqu'il est sélectionné.

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



//  exécute une requête GraphQL pour récupérer les données des Pokémons, et ensuite, à mettre à jour la liste des Pokémons avec ces données obtenues.

const { data: pokemonData } = await useAsyncQuery(query);
pokemons.value = pokemonData.value.pokemons;

const search = ref(''); // création d'une variable search qui initialise cette variable à une chaine vide. Elle permet de gérer la recherche de Pokémons.

const selectedType = ref("all"); // crée une variable nommée selectedType et l'initialise avec la valeur "all" en utilisant ref() Ce qui permet d'afficher tous les types de pokémon sans filtre par type spécifique.



const pokemonList = ref(pokemons.value);

// cette fonction filterPokemons met à jour la liste des Pokémon (pokemonList.value) en fonction des critères de recherche (search) et du type sélectionné (selectedType)

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

// selectType est une fonction qui met à jour le type sélectionné et déclenche ensuite le processus de filtrage des Pokémon pour afficher ceux qui correspondent au type choisi par l'utilisateur.

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
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-pokeball" width="24" height="24" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4C7.92,4 4.55,7.05 4.06,11H8.13C8.57,9.27 10.14,8 12,8C13.86,8 15.43,9.27 15.87,11H19.94C19.45,7.05 16.08,4 12,4M12,20C16.08,20 19.45,16.95 19.94,13H15.87C15.43,14.73 13.86,16 12,16C10.14,16 8.57,14.73 8.13,13H4.06C4.55,16.95 7.92,20 12,20M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z" /></svg>
      </div>
      <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" v-model="search" @input="filterPokemons" placeholder="Cherchez un pokémon"/>
    </div>
  </form>

  <div class="w-full flex justify-center items-center flex-col">
    <div class="w-5/6 space-x-2 md:w-auto flex flex-wrap justify-center space-y-4 md:space-y-0 md:space-x-8 py-12">
      <button class="bg-red-400 rounded-lg overflow-hidden" :class="{ 'ring-4 ring-yellow-400': selectedType === 'all' }" @click="selectType('all')">
      <NuxtImg src="/allTypes.jpg" alt="all" class="h-16 w-16 object-cover" />
              <h4 class="text-md text-center">Tous</h4>
      </button>

      <button class="bg-red-400 rounded-lg overflow-hidden" v-for="type in typesDePokemon" :class="{ 'ring-4 ring-yellow-400': selectedType === type.nom }" @click="selectType(type.nom)">
      <NuxtImg :src="type.image.url" :alt="type.nom" class="h-16 w-16 object-cover" />
              <h4 class="text-md text-center">{{ type.nom }}</h4>
      </button>

    </div>
  </div>


  <div :class="{ 'grid w-5/6 mx-auto gap-8': true, 'grid-cols-2': detailPokemon, 'grid-cols-1': !detailPokemon }">

    <div>
      <ul v-if="pokemonList.length > 0" class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

        <div class="flex flex-col w-full items-end pt-3 pr-4 md:w-full lg:w-full xl:w-1/2 md:pr-4 xl:pr-0 2xl:pr-0">
            <div>
              <span>{{ detailPokemon.pointDeVie }} PV</span>
              <div class="h-1 bg-gray-200 mt-1" style="width: 50px;">
                <div class="h-1 bg-purple-500" :style="`width:${calculerPourcentage(detailPokemon.pointDeVie, 300)}%`"></div>
              </div>
            </div>
          </div>


        <div class="flex flex-col md:flex-col lg:flex-col xl:flex-row mt-2">
          <div class="flex flex-col w-full px-4 pb-4 md:w-full lg:w-full xl:w-1/2 md:px-4 pb-4 lg:pl-4 lg:pr-4 xl:p-0 ">
            <NuxtImg class="w-full " :src="detailPokemon.image.url" :alt="detailPokemon.nom" />
          </div>
          <div class="flex flex-col items-start space-x-2 pl-4 pr-6 lg:pl-4 xl:pl-4 pr-2 xl:w-1/2">

            <div v-if="detailPokemon.typeDePokemon" class="flex space-x-2 w-full mb-8">
              <NuxtImg class="h-12 w-12 rounded-full" :src="detailPokemon.typeDePokemon.image.url" :alt="detailPokemon.typeDePokemon.nom" />
              <p class=" text-white text-lg border border rounded-lg p-2" :style="`background-color:${detailPokemon.typeDePokemon.couleur.hex}`">{{ detailPokemon.typeDePokemon.nom }}</p>
            </div>


              <div class="flex items-center justify-between w-full mb-2">
                <p class="text-sm pb-1">Hauteur</p>
                <p class="flex justify-center text-justify text-red-950 border w-24 rounded-full p-1 lg:text-xl lg:w-36 xl:w-36">{{ detailPokemon.height }} m</p>
              </div>

              <div class="flex items-center justify-between w-full mb-2">
                <p class="text-sm pb-1">Poids</p>
                <p class="flex justify-center text-justify text-red-950 border w-24 rounded-full p-1 lg:text-xl lg:w-36 xl:w-36">{{ detailPokemon.mass }} kg</p>
              </div>

              <div class="flex items-center justify-between w-full mb-2">
                <p class="text-sm pb-1">Couleur</p>
                <div class="flex justify-center text-justify text-red-950 border w-24 rounded-full p-1 lg:text-xl lg:w-36 xl:w-36" :style="`background-color:${detailPokemon.color.hex}`">
                <p class="text-justify text-red-950">{{ detailPokemon.color.hex }}</p>
                </div>
              </div>



          </div>
        </div>





        <h2 class="pl-3 text-2xl space-y-4 md:text-5xl lg:text-5xl xl:text-5xl py-4 p-1 md:pl-3 lg:pl-3 xl:pl-3 2xl:pl-0">{{ detailPokemon.nom }}</h2>




        <p class="text-sm text-justify text-red-950 p-3 md:text-base  md:p-3 lg:p-3 xl:p-3 2xl:p-0">{{ detailPokemon.description }}</p>





        <h3 class="flex justify-center text-2xl py-4">Attaques</h3>

        <div class="flex flex-wrap gap-4 mb-8">

          <div class="flex flex-col items-center justify-center gap-2 lg:flex-row justify-center w-full">
            <template v-for="attaque in detailPokemon.attaques" :key="attaque.nom">
              <NuxtImg class="h-20 w-20 rounded-full cursor-pointer" @click="selectedAttaque && selectedAttaque.nom == attaque.nom ? selectedAttaque.nom = false : selectedAttaque = { ...attaque }" :src="attaque.image.url" :alt="attaque.nom" />
            </template>
          </div>

          <div class="flex flex-col space-y-2 p-3 md:p-3 lg:p-3 xl:p-3 2xl:p-0" v-if="selectedAttaque && selectedAttaque.nom">
              <p class="text-justify text-red-950">Attaques: {{ selectedAttaque.nom }}</p>
              <p class="text-justify text-red-950">Type de l'attaque: {{ selectedAttaque.typeDePokemon.nom }}</p>
              <p class="text-justify text-red-950">description: {{ selectedAttaque.description }}</p>
              <p class="text-justify text-red-950">Degâts: {{ selectedAttaque.degats }}</p>
              <div class="mb-5 h-1 bg-gray-200">
                <div class="h-1 bg-purple-500" :style="`width:${calculerPourcentage(selectedAttaque.degats, 300)}%`"></div>
              </div>
              
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

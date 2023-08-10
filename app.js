const root = document.getElementById("root");
const mujer = document.getElementById("mujer");
const hombre = document.getElementById("hombre");
const todos = document.getElementById("todos");

//paginador
const paginaActual = document.querySelector("#pagina-actual");
const totalPaginas = document.querySelector("#total-paginas");
const firstPage = document.querySelector("#first-page");
const previusPage = document.querySelector("#previus-page");
const nextPage = document.querySelector("#next-page");
const lastPage = document.querySelector("#last-page");

//LOADER
const loader = document.getElementById('contenedor')

//   //NUEVA FUNCION PARA HACER LO DEL PAGINADOR

let pagina = 1;
let total = 0;

const getData = async () => {
  loader.classList.remove('esconder')

  const url = `https://rickandmortyapi.com/api/character/?page=${pagina}`;

  //NUEVA FORMA DE HACER PROMESAS ASYNC AWAIT
  paginaActual.innerHTML = pagina;
  const resp = await fetch(url);
  const json = await resp.json();
  //ejecutamos la fx print data
  printData(json.results);
  total = json.info.pages;
  paginaActual.innerHTML = pagina;
  totalPaginas.innerHTML = total;
  data = json;//PARA QUE FUNCIONEN LOS FILTROS
  updatePagination();
  setTimeout(() => {
    loader.classList.add('esconder')
    root.classList.remove('esconder')
  },1000)
  return json;
};

let data = [];

const printData = (json) => {
  // console.log(json); //  []
  const arr = json;
  let card = "";
  arr.forEach((personaje) => {
    //destructurecion
    const { name, gender, species, status, origin, location, image } =
      personaje;
    card += `  
      <div class="col s12 m6 l3">
        <div class="card">
          <div class="card-image">
            <img src=${image} alt=${name}>
          </div>
          <div class="card-content">
            <p>Nombre: ${name}</p>
            <p>Genero: ${gender}</p>
            <p>Species: ${species}</p>
            <p>Status: ${status}</p>
            <p>Origin: ${origin.name}</p>
            <p>Location: ${location.name}</p>
          </div>
          <div class="card-action">
            <a href="#">ver mas...</a>
          </div>
        </div>
      </div>
    `;
  });
  root.innerHTML = card;
};

//Fx CON LA QUE FUNCIONAN LOS FILTROS ES LO MISMO QUE LA DE ARRIBA PERO SIN PAGINADOR, 24-8

// const getData = async () => {
//   const url = 'https://rickandmortyapi.com/api/character/'; //parametros que le pasamos a la api
//   //promesa que tiene estado dependiente
//   fetch(url)
//     .then((resp) => resp.json())
//     .then((json) => {
//       printData(json.results); // []
//       data = json;
//     }) //respuesta primera
//     .catch((err) => console.error(err)); //error
//   }

// //////////FILTROS///////////////

mujer.addEventListener("click", (e) => {
  const female = data.results.filter(
    (personaje) => personaje.gender === "Female"
  );
  printData(female); // []
  // console.log(data);
  console.log(female);
});

hombre.addEventListener("click", (e) => {
  const male = data.results.filter((personaje) => personaje.gender === "Male");
  printData(male); // []
  // console.log(data);
  console.log(male);
});

todos.addEventListener("click", (e) => {
  const mostrarTodos = data.results;
  printData(mostrarTodos); // []
});

/////////////PAGINATION FUNCION

const pagination = async (promesa) => {
  const result = await promesa;
  console.log(result);
  //pag sgte
  nextPage.addEventListener("click", () => {
    pagina += 1;
    getData();
  });
  //pagina previa
  previusPage.addEventListener("click", () => {
    pagina -= 1;
    getData();
  });
  //ultima pagina que entre a la data
  console.log(promesa);
  lastPage.addEventListener("click", () => {
    if (pagina <= result.info.pages) {
      pagina = result.info.pages;
      getData();
    }
  });
  firstPage.addEventListener("click", () => {
    if (pagina >= 2) {
      pagina = 1;
      getData();
    }
  });
};

const updatePagination = () => {
  //actualiza
  if (pagina <= 1) {
    previusPage.disabled = true;
    firstPage.disabled = true;
  } else {
    previusPage.disabled = false;
    firstPage.disabled = false;
  }
  if (pagina == total) {
    nextPage.disabled = true;
    lastPage.disabled = true;
  } else {
    nextPage.disabled = false;
    lastPage.disabled = false;
  }
};

$(document).ready(function () {
  $(".dropdown-trigger").dropdown();
  pagination(getData());
});

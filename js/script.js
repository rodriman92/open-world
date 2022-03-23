
//-----------declaracion de variables----------------------------------
let divColecciones = document.getElementById("divColecciones");
let cardRecursos = document.getElementById("cardContenedor");
let formContainer = document.getElementById("formContainer");
let botonColecciones = document.getElementById("botonColecciones");
let mensajeExiste = document.getElementById("mensajeExiste");
let tablaTopColecciones = document.getElementById("tablaTopColecciones")
let tableBody = document.getElementById("tbody");
let botonOrdenaPrecioAsc = document.getElementById("botonOrdenaPrecioAsc");
let botonOrdenaPrecioDesc = document.querySelector("#botonOrdenaPrecioDesc");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let botonAgregarCarrito = document.getElementById("botonAgregarCarrito");
let modalCarrito = document.querySelector(".modalCarrito");
let tfoot = document.querySelector(".cant--carrito");
let colecciones = [];
let valorEnDolares;
let moneda;
let imagen;



//------creo una funcion para obtener el json con las colecciones
async function obtenerColecciones(){
    const response = await fetch('./json/colecciones.json');
    return await response.json();
}


//-------funcion asincrona para obtener el json con los recursos

async function obtenerRecursos(){
    const response = await fetch('./json/recursos.json');
    return await response.json();
}


//-------funcion asincrona para obtener los valores de las criptomonedas desde la API
async function obtenerValorEnDolares(){
    const response = await fetch("https://criptoya.com/api/bitex/"+ moneda +"/usd/1")
    return await response.json();
}

//---------consulto si localstorage existe. Si existe traigo el array de colecciones. Si no existe, lo creo
if(localStorage.getItem('colecciones')){
    colecciones = JSON.parse(localStorage.getItem('colecciones'))
}
else{
    localStorage.setItem('colecciones', JSON.stringify(colecciones))
}

//--------funcion para seleccionar una imagen y asignarla 


let imgArr = ["alien.jpeg","burro-dientes-dorados.jpg", "gallo.jpg", "mono-3d.jpg", "mono-4d.jpg","mono-capitan.jpg", "mono-psico.jpg", "mono-casco.jpeg","mono-dientes-de-oro.png", "mono-armadura.jpeg", "cool-bird.png", "mono-karate.jpg"];
function imgRandom(imgArr) {
    return imgArr[Math.floor(Math.random() * imgArr.length)];
}

//-----------obtenego las colecciones desde el json colecciones

obtenerColecciones().then(colecciones => {
    divColecciones.innerHTML = "";
    colecciones.forEach((coleccion) =>{

        //-----------consulto el tipo de blockchain de la colecciones y le asigno un valor a la variable moneda para buscar el precio desde la API y un icono
        if(colecciones.tipoBlockchain === "ethereum"){
            imagen="https://img.icons8.com/cotton/30/000000/ethereum--v1.png";
            moneda = "eth";
            
            
        }
        else if(colecciones.tipoBlockchain === "bitcoin"){
            imagen="https://img.icons8.com/fluency/30/000000/bitcoin--v1.png";
            moneda = "btc";
            
        }
        else if(colecciones.tipoBlockchain === "usdt"){
            imagen="https://img.icons8.com/color/30/000000/tether--v2.png";
            moneda = "usdt"
            
        }

            divColecciones.innerHTML += `
            <div class="col-md-8 col-lg-2 cardContenedor" style="width: 20rem;">
                <div class="card-box" id="coleccion${coleccion.id}">
                    <div class="card-thumbnail">
                        <img src="./media/nfts/${coleccion.img}" class="img-fluid imgCard" alt="${colecciones.descripcionImagen}">
                    </div>
                    <h3><a href="#" class="mt-2 h3">Autor: ${coleccion.autorImagen}</a></h3>
                    <p class="card-text descripcion">Descripcion: ${coleccion.descripcionImagen}</p>
                    <p class="card-text categoria">Categoría: ${coleccion.categoriaImagen}</p>
                    <p class="card-text fecha">Fecha publicacion: ${coleccion.fechaPublicacion}</p>
                    <p class="card-text precio">Valor: <span>${coleccion.precio}</span> <span>${coleccion.tipoBlockchain}</span></img> </p>
                    <p class="card-text precioDolares">US$: ${coleccion.precio}</p>
                    <p class="card-text disponibilidad">Disponibilidad: ${coleccion.cantidadDisponible}</p>
                    <button class="btn-agregar btn btn-light" id="botonAgregarCarrito" data-id="${coleccion.id}">Agregar </button>
                </div>
            </div>
            `
    });
    const btnAgregar = document.querySelectorAll(".btn-agregar");
    btnAgregar.forEach((e) =>
    e.addEventListener("click", (e) => {
      let cardPadre = e.target.parentElement;

      agregarAlCarrito(cardPadre);
      mostrarMensajeSwalToast();
    })
  );

})


//---------------funcion para agregar al carrito

const agregarAlCarrito = (cardPadre) => {
    let coleccion = {
        imagenColeccion: cardPadre.querySelector('.imgCard').src,
        descripcionImagen: cardPadre.querySelector('.descripcion').textContent,
        cantidad: 1,
        precio: Number(cardPadre.querySelector(".precio span").textContent),
        indice: Number(cardPadre.querySelector("button").getAttribute("data-id"))
    };
    let coleccionEncontrada = carrito.find(
        (element) => element.indice === coleccion.indice
      );
    
      if (coleccionEncontrada) {
        coleccionEncontrada.cantidad++;
      } else {
        carrito.push(coleccion);
      }
      console.log(carrito);
      mostrarCarrito();
}



//-------------mostrar el carrito en el modal

const mostrarCarrito = () =>{
    tableBody.innerHTML = "";
    carrito.forEach((element) => {

            let {imagenColeccion, descripcionImagen, cantidad, precio, indice} = element;
            let tbody = document.createElement("tr");
                tbody.className = "tbody";
                tableBody.appendChild(tbody);

                tbody.innerHTML += `


                <ul class="list-group mb-2 sticky-top">
                

                <li class="list-group-item d-flex justify-content-center">
                    <div>
                    <img src="${imagenColeccion}" class="card-img-top img-fluid img-thumbnail" style="vertical-align: middle; width: 15rem;">
                        <h6 class="my-0">${descripcionImagen}</h6>
                        <small class="text-muted">Cantidad: ${cantidad}</small>
                        <small class="text-muted">Precio: US$ ${precio}</small>
                    </div>
                </li>
                
                <li class="list-group-item d-flex">
                    <span>Total US$ ${precio * cantidad} </span>
                </li>
                <li class="list-group-item d-flex">
                    <div>Acciones
                        <button class="btn-restar btn btn-light" data-id="${indice}">-</button>
                        <button class="btn-borrar btn btn-light" data-id="${indice}">X</button>
                    </div>
                </li>

            </ul>
                `   

            
                 

    });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    aumentarNumeroCantidadCarrito();
    calcularTotal();

};



//-----------funcion para calcular el total de la compra

//--------funcion para escuchar el los eventos en los botones del modal

const escucharBotonesModalCarrito = () => {
    modalCarrito.addEventListener('click', (e) => {
        if (e.target.classList.contains("btn-restar")) {
            restarColeccion(e.target.getAttribute("data-id"));
        }
        if (e.target.classList.contains("btn-borrar")) {    
            borrarColeccion(e.target.getAttribute("data-id"));
        }
    })
}

//-----------funcion para restar la coleccion del carrito

const restarColeccion = (coleccionRestar) => {
    let coleccionEncontrada = carrito.find(
      (element) => element.indice === Number(coleccionRestar)
    );
    if (coleccionEncontrada) {
        coleccionEncontrada.cantidad--;
      if (coleccionEncontrada.cantidad === 0) {
        borrarColeccion(coleccionRestar);
      }
    }
    mostrarCarrito();
  };


 //------------funcion para borrar la coleccion del carrito
 
 const borrarColeccion = (coleccionBorrar) => {
    carrito = carrito.filter((element) => element.indice !== Number(coleccionBorrar));
    mostrarCarrito();
  };

//-----------funcion para aumentar el numero del carrito a medida que agrega productos

const aumentarNumeroCantidadCarrito = () => {
    let total = carrito.reduce((acc, ite) => acc + ite.cantidad, 0);
    document.querySelector(".spanCantidad").textContent = total || 0;
  };

//--------obtener colecciones en la tabla a partir del localstorage

const llenarTabla = () =>{
    //------------consulto al localstorage por los datos guardados en las colecciones y las muestro
    obtenerColecciones().then(colecciones => {
    colecciones.forEach((coleccion) =>{

        //---------seteo una imagen dependiendo el tipo de opcion seleccionada
        let imagen = ""
        
        //---------consulto por los tipos de blockchain para cada moneda y retorna un icono y una variable moneda que sera parametro de fetch
        if(coleccion.tipoBlockchain === "Ethereum"){
            imagen="https://img.icons8.com/cotton/30/000000/ethereum--v1.png";
            moneda = "eth";
            
        }
        else if(coleccion.tipoBlockchain === "Bitcoin"){
            imagen="https://img.icons8.com/color/30/000000/bitcoin--v1.png";
            moneda = "btc";
            
        }
        else{
            imagen="https://img.icons8.com/color/30/000000/tether--v2.png";
            moneda = "usdt";
            
        }

        //obtengo  los valores de las criptomonedas actualizados desde la API criptoya 
        //y paso el la variable "moneda" para buscar el precio por tipo de moneda en la API

        fetch("https://criptoya.com/api/bitex/"+ moneda +"/usd/1")
        .then(response => response.json())
        .then(data => {
            //desestructuro el array que obtengo de la API y tomo el valor ASK
            let {ask} = data;
            valorEnDolares = ask; //-------almaceno el valor obtenido en la variable ValorEnDolares

            
            //--------lleno la tabla con los datos obtenidos y los muesro en el DOM
            let tbody = document.createElement("tr");
            tbody.className = "tbody";
            tablaTopColecciones.appendChild(tbody);

            tbody.innerHTML += `
            <tr class="tr">
                <td class="td col-xs-2" style="width: 20%">${coleccion.descripcionImagen}</td>
                <td class="td col-xs-2" style="width: 25%">${coleccion.autorImagen}</td>
                <td class="td col-xs-2" style="width: 20%">${Math.round(valorEnDolares * coleccion.precio).toFixed(2)}</td>
                <td class="td col-xs-2" style="width: 15%">${coleccion.precio} </td>
                <td class="td col-xs-2" style="width: 10%"><img src="${imagen}" class="img-top imagenBlockchain"></img></td>
            </tr>
                
            `
        })
    })
})
}

//--------llamo al evento click del boton OrdenaPrecioAsc y realizo la operacion de orden

botonOrdenaPrecioAsc.addEventListener('click', (e) => {

        //----------------calcular el indice de la columna para ordenar y el numero de fila a aplicar el orden

        let table, rows, ordenando, i, a, b, cambiaOrden;
        //-------obtengo el id de la tabla creada en el html y la almaceno en la variable table
        table = document.getElementById("tablaTopColecciones");
        //-------creo un boolean y lo inicio como true
        ordenando = true;
        
        while (ordenando) {
            ordenando = false;
            rows = table.rows;
            
            for (i = 1; i < (rows.length - 1); i++) {

            cambiaOrden = false;
            a = rows[i].getElementsByTagName("TD")[2];
            b = rows[i + 1].getElementsByTagName("TD")[2];
           
            //-------comparo la info de las filas de la tabla y si es menor la fila a a la fila b, realizo el cambio de orden
            if (Number(a.innerHTML) < Number(b.innerHTML)) {
                cambiaOrden = true;
                break;
            }
            }
            if (cambiaOrden) {
            //-----------si el valor de a es mayor al de b, inserto el resultado de a antes de b y reordeno
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            ordenando = true;
            }
        }

})

//--------llamo al evento click del boton OrdenaPrecioDesc y realizo la operacion de orden

botonOrdenaPrecioDesc.addEventListener('click', (e) => {
    //----------------calcular el indice de la columna para ordenar y el numero de fila a aplicar el orden

    let table, rows, ordenando, i, a, b, cambiaOrden;
    table = document.getElementById("tablaTopColecciones");
    ordenando = true;
    
    while (ordenando) {
        ordenando = false;
        rows = table.rows;
        
        for (i = 1; i < (rows.length - 1); i++) {

        cambiaOrden = false;
        a = rows[i].getElementsByTagName("TD")[2];
        b = rows[i + 1].getElementsByTagName("TD")[2];
       
        if (Number(a.innerHTML) > Number(b.innerHTML)) {
            cambiaOrden = true;
            break;
        }
        }
        if (cambiaOrden) {
        
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        ordenando = true;
        }
    }
})


 llenarTabla();


 //-------muestra mensaje cuando se hace click en el boton agregar de la card de colecciones

const mostrarMensajeSwalToast = () =>{
    Swal.fire({
        toast: true,
        text: "Coleccion agregada",
        color: "#66f2ca",
        background: "#260259",
        showConfirmButton: false,
        position: "bottom-end",
        timer: 1400,
        timerProgressBar: true,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
    })
}

//-----------muestra mensaje de simulacion para indicar que se envio el mensaje

const mostrarMensajeEnviado = () =>{
    Swal.fire({
        icon: 'success',
        title: 'Mensaje Enviado'
    })
}

//-----------muestra mensaje cuando se hace click en el carrito y este esta vacio
botonAgregarCarrito.addEventListener('click', ()=>{
    if (carrito.length === 0) {
        swal.fire("Carrito vacío", "🛒", "warning")
    }
    
})


//-------calcular el total del carrito mediante reduce

const calcularTotal = () => {
    let total = carrito.reduce((acc, ite) => acc + (ite.precio) * ite.cantidad,0);

    //-------creo un div y le asigno una clase. Le paso el valor del total y lo agrego al modal de carrito
    let divTotal = document.createElement("tr");
    divTotal.className = "tr";
    divTotal.id = "total--compra";

    divTotal.innerHTML = `
        <th colspan="8" class="text-right thTotal">TOTAL DE LA COMPRA</th>
        <td colspan="2" class="td tdTotal"><span class="spanTotal">US$${Math.round(total).toFixed(2)}</span></td>
    `;
    tableBody.appendChild(divTotal);

}


//--------implementacion de libreria scroll reveal para que aparezcan los titulos de las secciones a medida que hago scroll en la pagina

ScrollReveal().reveal('.h1Custom');
ScrollReveal().reveal('#tituloTop', {delay: 300});
ScrollReveal().reveal('#tituloColecciones', {delay: 500});
ScrollReveal().reveal('#tituloRecursos', {delay: 500});
ScrollReveal().reveal('#tituloContacto', {delay: 500});


//-----------scroll hasta el top de la pagina

mybutton = document.getElementById("myBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0; 
}

//------funcion para obtener las cards de recursos 

const obtenerCards = () =>{
    obtenerRecursos().then(recursos => {
        recursos.forEach(recurso => {
            cardRecursos.innerHTML += `

                    <div class="col-md-4 cardRecurso">
                    <img src=${recurso.imagen} class="img-fluid imgCardRecursos"></img>
                        <h2 class="h2CardRecurso">${recurso.titulo.toUpperCase()}</h2>
                        <p class="pCardRecurso">${recurso.subtitulo}</p>
                        <button class="btn btn-light btnCardRecurso align-self-end">Ver más</button>

                    </div>

            `
        })
    })
}


//-----funcion para crear el formulario de contacto

const creaFormulario = () =>{

    formContainer.innerHTML = "";

    formContainer.innerHTML = `

    <div class="container min-vh-200 d-flex flex-column">
    <div class="card shadow rounded-3 my-auto">
        <div class="card-body p-6">
            <form role="form" class="row">
                <div class="form-group col-lg-4">
                    <label class="form-control-label" for="form-group-input">Nombre</label>
                    <input type="text" class="form-control" id="form-group-input" name="nombre">
                </div>
                <div class="form-group col-lg-4">
                    <label class="form-control-label" for="form-group-input">Email</label>
                    <input type="email" class="form-control" id="form-group-input" name="email">
                </div>
                <div class="form-group col-lg-4">
                    <label class="form-control-label" for="form-group-input">Motivo de la consulta</label>
                    <select size="0" class="form-control" name="motivo">
                        <option>Compra</option>
                        <option>Venta</option>
                        <option>Inversion</option>
                        <option>Otro</option>
                    </select>
                </div>
                <div class="form-group col-lg-12">
                    <label class="form-control-label" for="form-group-input">Mensaje</label>
                    <textarea class="form-control" id="form-group-input" name="mensaje" rows="6"></textarea>
                </div>
                <div class="form-group col-lg-12">
                    <button class="btnEnviar btn float-end mt-2">Enviar</button>
                </div>
            </form>
        </div>
    </div>
</div>

    `
    const btnEnviar = document.querySelectorAll(".btnEnviar");
    btnEnviar.forEach((e) =>
    e.addEventListener("click", (e) => {
      mostrarMensajeEnviado();
    })
  );
}





//-------inicio las funciones de mostrarCarrito y escucharBotones para realizar operaciones en el DOM
mostrarCarrito();
escucharBotonesModalCarrito();
obtenerCards();
obtenerColecciones();
creaFormulario();



class Coleccion{
    constructor(autorImagen, descripcionImagen, categoriaImagen, fechaPublicacion, tipoBlockchain, precio, cantidadDisponible){
        this.autorImagen = autorImagen,
        this.descripcionImagen = descripcionImagen,
        this.categoriaImagen = categoriaImagen,
        this.fechaPublicacion = fechaPublicacion,
        this.tipoBlockchain = tipoBlockchain,
        this.precio = precio,
        this.cantidadDisponible = cantidadDisponible
    }
}

let formColecciones = document.getElementById("formColecciones");
let botonColeccion = document.getElementById("botonColeccion");
let divColecciones = document.getElementById("divColecciones");
let botonColecciones = document.getElementById("botonColecciones");

let colecciones = [];

localStorage.setItem('colecciones', JSON.stringify(colecciones));

//evento para agregar coleccion al array

formColecciones.addEventListener('submit', (e) => {
    e.preventDefault();

    let imagenColeccion = document.getElementById('imagenColeccion').value;
    let autorImagen = document.getElementById('autor').value;
    let descripcionImagen = document.getElementById('descripcion').value;
    let categoriaImagen = document.getElementById('categoria').value;
    let fechaPublicacion = document.getElementById('fecha').value;
    let tipoBlockchain = document.getElementById('tipoBlockchain').value;
    let precio = document.getElementById('precio').value;
    let cantidadDisponible = document.getElementById('disponibilidad').value;
    const coleccion = new Coleccion(autorImagen, descripcionImagen, categoriaImagen, fechaPublicacion, tipoBlockchain, precio, cantidadDisponible);

    colecciones.push(coleccion);

    localStorage.setItem('colecciones', JSON.stringify(colecciones));

    formColecciones.reset();
});

//evento para mostrar las colecciones agregadas en la card de colecciones

botonColecciones.addEventListener('click', () =>{
    divColecciones.innerHTML = "";
        let coleccionesStorage = JSON.parse(localStorage.getItem('colecciones'));
        coleccionesStorage.forEach((coleccion, indice) =>{
            divColecciones.innerHTML += `
            <div class="card" id="coleccion${indice}" style="width: 18rem;">
            <img src="./media/fondo_card_index.png" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">Autor: ${coleccion.autorImagen}</h5>
                <p class="card-text">Descripcion: ${coleccion.descripcionImagen}</p>
                <p class="card-text">Categoría: ${coleccion.categoriaImagen}</p>
                <p class="card-text">Fecha publicacion: ${coleccion.fechaPublicacion}</p>
                <p class="card-text">Blockchain: ${coleccion.tipoBlockchain}</p>
                <p class="card-text">Precio: ${coleccion.precio}</p>
                <p class="card-text">Disponibilidad: ${coleccion.cantidadDisponible}</p>

            </div>
            </div>
            `
        })
});
const valor = {
    Dólar: 95.88,
    Euro: 113.72,
    Yen: 0.86,
    Libra: 132.85,
    Franco: 103.98,
    Corona: 11.20,
    Real: 17,


}

const impuestos = {
    "0%": 0,
    "8%": 0.8,
    "30%": 0.30,
    "35%": 0.35,
    "43%": 0.43,
    "65%": 0.65,
}


let cantidad = $("#cantidadDinero");
let Divisa2 = $("#selector2");
let comision = $("#comision");
let boton = $("#boton")

// Se cargan los elementos del localStorage si es que hay (caso contrario se asigna un array vacío)
let lista = JSON.parse(localStorage.getItem("intercambio")) || [];

boton.click(convertir);

// Animación del botón historial
$(".historial").click(() => $(".lista").slideToggle("fast"));

// Cargamos la lista apenas cargue el <script>
renderLista();
rellenarSelec(Divisa2, valor);
rellenarSelec(comision, impuestos);

const URLJSON = "divisas.json";

// AJAX
$("#btn").click(() => {
    $.getJSON(URLJSON, function (respuesta, estado) {
        if (estado === "success") {
            let misDatos = respuesta;
            for (const dato of misDatos) {
                $("#money").append(`
            <div>
            <p class="nombre">${dato.nombre}</p>
            <p class="precio">${"$" + dato.precio}</p>
                </div>`)
            }
        }
    })
})

// Función para mostrar las operaciones almacenadas en la lista
function renderLista() {
    $(".lista").html(lista.map(item => `<div> 
                                            <p>Dinero: $ ${item.dinero} </p>
                                            <p>Divisa: ${item.divisa}</p>
                                            <p>Total: $ ${item.operacion}</p>
                                            <p>Impuesto aplicado: ${item.impuesto}</p>
                                        </div>`).join(''));
    
}

// Función para rellenar el dropdown del formulario
function rellenarSelec(selec, obj) {
    for (const key in obj) {
        const opcion = `<option value="${obj[key]}">${key}</option>`
        selec.append(opcion)
    }
}


// Función para agregar cada operación nueva a la lista
function agregarALista(obj) {
    lista.push(obj);
    localStorage.intercambio = JSON.stringify(lista);
    renderLista();
}


// Función para realizar la conversión
function convertir() {

    let valorDinero;

    if (cantidad.val() >= cantidad.attr("min")) {
        valorDinero = cantidad.val();
    } else {
        cantidad.val(1);
        valorDinero = cantidad.val();
    }

    // Elementos HTML 
    const divisa = Divisa2.children(":selected");
    const impuesto = comision.children(":selected");

    const dinero = valorDinero * divisa.val();
    const operacion = (dinero + (dinero * impuesto.val())).toFixed(2);

    // Se crea un objeto con el dinero ingresado, el impuesto aplicado, la divisa seleccionada y el resultado.
    agregarALista({ dinero: valorDinero, impuesto: impuesto.text(), divisa: divisa.text(), operacion })

    $("#resultado").html(operacion + "$");
}



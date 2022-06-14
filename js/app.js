let cliente = {
    mesa:'',
    hora:'',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value
    const hora = document.querySelector('#hora').value

    //Revisar si hay campos vacios
    const camposVacios = [mesa,hora].some(campos => campos === '');
    if(camposVacios){
        // Verificar si ya hay una alerta
        const yaHayAlerta = document.querySelector('.invalid-feedback')
        if(!yaHayAlerta){
            const alerta = document.createElement('div');
        alerta.classList.add('invalid-feedback' , 'd-block' , 'text-center');
        alerta.textContent='Todos los campos son obligatorios';
        document.querySelector('.modal-body form').appendChild(alerta);
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
            return;
    }   
        
    //Asignando datos del formulario al Cliente
    cliente = {...cliente, mesa, hora} ;
    
    //Ocultar Modal de Bootstrap
    const modalFormulario = document.querySelector('#formulario')
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    //Obtener platos de la API de JSON SERVER
    obtenerPlatos();

    //Mostrar las secciones 
    mostrarSecciones();
};

//Mostrar las secciones 
function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(section => section.classList.remove('d-none'))
};

//Obtener platos de la API de JSON SERVER
function obtenerPlatos(){
    const url = 'http://localhost:4000/platillos';
    fetch(url)
        .then(resp => resp.json())
        .then(resultado => mostrarPlatillos(resultado))
}

function mostrarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido')
    platillos.forEach(platillo => {
        const row = document.createElement('div');
        row.classList.add('row','py-4','border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias [ platillo.categoria ] ;

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'Number';
        inputCantidad.min = 0;
        inputCantidad.id = `Producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');
        inputCantidad.value = 0;

        //Function que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function(){
            const cantidad = parseInt( inputCantidad.value );
            agregarPlato({...platillo,cantidad})
        }

        const agregar = document.createElement('div')
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad)

        row.appendChild(nombre)
        row.appendChild(precio)
        row.appendChild(agregar)
        row.appendChild(categoria)
        contenido.appendChild(row)
    })
}

function agregarPlato(Producto){
    //Extraer pedido actual
    let {pedido} = cliente;

    //Revisar que la cantidad sea Mayor a 0
    if(Producto.cantidad > 0){

        //Comprueba si el elemento ya existe en el array
        if(pedido.some(articulo => articulo.id === Producto.id)){
            //El articulo ya existe, actualizamos la cantidad
            const pedidoActualiazdo = pedido.map(e =>{
                if(e.id === Producto.id){
                    e.cantidad = Producto.cantidad;
                }
                return e;
            });
            //Se asigna el nuevo array de Map al nuevo pedido
            cliente.pedido = [...pedidoActualiazdo];
        }else{
            //No existe,lo agregamos al array de pedidos
            cliente.pedido = [...pedido,Producto];
        }
        
    }else{
        //Eliminar elementos cuando la cantidad sea 0
        const resultado = pedido.filter(e => e.id !== Producto.id);
        cliente.pedido = [...resultado];
    }

    limpiarHTMLprevio();

    if(cliente.pedido.length){
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }
}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6','card','py-5','px-3','shadow');

    //Info de la mesa
    const mesa = document.createElement('p')
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //Info de la hora
    const hora = document.createElement('p')
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    mesa.appendChild(mesaSpan);
    resumen.appendChild(mesa);
    hora.appendChild(horaSpan);
    resumen.appendChild(hora);
    contenido.appendChild(resumen)
    

    //Titulo de la section
    const heading = document.createElement('h3');
    heading.textContent = 'Platos consumidos';
    heading.classList.add('my-4','text-center')

    //Iterar sobre el array de pedidos para el html
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const {pedido} = cliente;
    pedido.forEach(e => {
        const {nombre,cantidad,precio,id} = e;
        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreElement = document.createElement('h4');
        nombreElement.classList.add('my-4');
        nombreElement.textContent = nombre;

        //Cantidad del Articulo
        const cantidadElement = document.createElement('p');
        cantidadElement.classList.add('fw-bold');
        cantidadElement.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        //Precio del articulo
        const precioElement = document.createElement('p');
        precioElement.classList.add('fw-bold');
        precioElement.textContent = 'Precio: $ ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = precio;

        //Subtotal del articulo
        const subtotalElement = document.createElement('p');
        subtotalElement.classList.add('fw-bold');
        subtotalElement.textContent = 'Subtotal: $ ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = precio*cantidad;

        //Botton para eliminar pedido
        btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn' ,'btn-danger')
        btnEliminar.textContent = 'Eliminar del pedido'

        //Funcion para eliminar pedido
        btnEliminar.onclick = function(){
            eliminarProducto(id)
        }

        //Agregar valores a sus contenedores
        cantidadElement.appendChild(cantidadValor);
        precioElement.appendChild(precioValor);
        subtotalElement.appendChild(subtotalValor);

        //Agregar elementos al LI
        lista.appendChild(nombreElement);
        lista.appendChild(cantidadElement)
        lista.appendChild(precioElement)
        lista.appendChild(subtotalElement)
        lista.appendChild(btnEliminar)

        //Agregar lista al grupo principal
        grupo.appendChild(lista);
    })
    resumen.appendChild(heading);
    resumen.appendChild(grupo);
    
}

function limpiarHTMLprevio(){
    const contenido = document.querySelector('#resumen .contenido');
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild)
    }
}

function eliminarProducto(id){
    const {pedido} = cliente;
    const resultado = pedido.filter(e => e.id !== id);
    cliente.pedido = [...resultado];
     
    limpiarHTMLprevio();

    if(cliente.pedido.length){
        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }

    //El producto se elimina entonces vuelvo el form a 0
    const productoEliminado = `#Producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio (){
    const contenido = document.querySelector('#resumen .contenido')
    const texto = document.createElement('p')
    texto.classList.add('text-center')
    texto.textContent = 'Añade los elementos del pedido'
    contenido.appendChild(texto);
}

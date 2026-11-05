
// ======================================================
// CONFIGURACIÓN GENERAL
// ======================================================

const API_URL = "http://localhost:3000/products";

let todosLosProductos = [];

const contenedorProductos = document.getElementById("productos");

const modal = document.getElementById("miModal");
const contenedorDetalles = document.getElementById("detallesProducto");
const btnCerrar = document.getElementById("cerrarModal");

const inputBuscador = document.getElementById("tungtung");

// Elementos del formulario
const modalFormulario = document.getElementById("modalFormulario");
const formProducto = document.getElementById("formProducto");

const btnAgregar = document.getElementById("btnAgregar");
const btnCerrarFormulario = document.getElementById("cerrarFormulario");

const imagenRespaldo =
    "https://placehold.co/400x300/1e293b/ffffff?text=Producto";


// ======================================================
// 1. CONECTAR CON JSON SERVER
// ======================================================

async function cargarProductos() {

    try {

        const resultado = await fetch(API_URL);

        if (!resultado.ok) {
            throw new Error("Error al consultar JSON Server");
        }

        const datos = await resultado.json();

        console.log("Productos recibidos:", datos);

        if (Array.isArray(datos.products)) {
            return datos.products;
        }

        if (Array.isArray(datos)) {
            return datos;
        }

        return [];

    } catch (error) {

        console.error("Error de conexión:", error);

        return null;
    }
}


// ======================================================
// 2. FORMATEAR PRECIOS
// ======================================================

function formatearPrecio(precio) {

    const numero = Number(precio);

    if (!Number.isFinite(numero)) {
        return "Precio no disponible";
    }

    return numero.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}


// ======================================================
// 3. CREAR TARJETAS DE PRODUCTOS
// ======================================================

function renderizarLista(productosParaMostrar) {

    if (!contenedorProductos) return;

    contenedorProductos.replaceChildren();

    if (productosParaMostrar.length === 0) {

        const mensaje = document.createElement("p");

        mensaje.className = "mensaje";
        mensaje.textContent = "No se encontraron productos.";

        contenedorProductos.appendChild(mensaje);

        return;
    }

    productosParaMostrar.forEach(producto => {

        const tarjeta = document.createElement("div");

        tarjeta.className = "producto-card";

        // Imagen
        const imagen = document.createElement("img");

        imagen.src = producto.imagen || imagenRespaldo;
        imagen.alt = producto.nombre || "Producto";

        imagen.onerror = () => {
            imagen.src = imagenRespaldo;
        };

        // Nombre
        const nombre = document.createElement("h3");

        nombre.textContent = producto.nombre || "Producto sin nombre";

        // Stock
        const stock = document.createElement("div");

        stock.className = "stock";

        const cantidadStock = Number(producto.stock);

        stock.textContent = Number.isFinite(cantidadStock)
            ? `${cantidadStock} Disponibles`
            : "Stock no disponible";

        // Precio
        const precio = document.createElement("div");

        precio.className = "precio";
        precio.textContent = formatearPrecio(producto.precio);

        // Botón ver detalles
        const botonDetalles = document.createElement("button");

        botonDetalles.className = "btn-agregar";
        botonDetalles.type = "button";
        botonDetalles.textContent = "Ver detalles";

        botonDetalles.addEventListener("click", () => {

            abrirDetalles(producto.id);

        });

        // Botón modificar
        const botonModificar = document.createElement("button");

        botonModificar.className = "btn-modificar";
        botonModificar.type = "button";
        botonModificar.textContent = "Modificar";

        botonModificar.addEventListener("click", () => {

            abrirFormularioEditar(producto.id);

        });

        // Construir tarjeta
        tarjeta.append(
            imagen,
            nombre,
            stock,
            precio,
            botonDetalles,
            botonModificar
        );

        contenedorProductos.appendChild(tarjeta);

    });

}


// ======================================================
// 4. ABRIR MODAL CON LOS DETALLES DEL PRODUCTO
// ======================================================

function abrirDetalles(idProducto) {

    const producto = todosLosProductos.find(
        p => String(p.id) === String(idProducto)
    );

    if (!producto || !modal || !contenedorDetalles) return;

    contenedorDetalles.replaceChildren();

    // Imagen
    const imagen = document.createElement("img");

    imagen.src = producto.imagen || imagenRespaldo;
    imagen.alt = producto.nombre || "Producto";

    imagen.onerror = () => {
        imagen.src = imagenRespaldo;
    };

    // Nombre
    const nombre = document.createElement("h2");

    nombre.id = "tituloModal";
    nombre.textContent = producto.nombre || "Producto sin nombre";

    // Precio
    const precio = document.createElement("div");

    precio.className = "precio";
    precio.textContent = formatearPrecio(producto.precio);

    // Descripción
    const descripcion = document.createElement("p");

    descripcion.textContent =
        producto.descripcion || "No hay descripción disponible.";

    // Stock
    const stock = document.createElement("div");

    stock.className = "stock";

    const cantidadStock = Number(producto.stock);

    stock.textContent = Number.isFinite(cantidadStock)
        ? `${cantidadStock} unidades disponibles`
        : "Stock no disponible";

    contenedorDetalles.append(
        imagen,
        nombre,
        precio,
        descripcion,
        stock
    );

    // Mostrar modal
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    btnCerrar?.focus();
}


// ======================================================
// 5. CERRAR MODAL DE DETALLES
// ======================================================

function cerrarModal() {

    if (!modal) return;

    modal.style.display = "none";

    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


// ======================================================
// 6. CERRAR MODAL DEL FORMULARIO
// ======================================================

function cerrarFormulario() {

    if (!modalFormulario) return;

    modalFormulario.style.display = "none";

    modalFormulario.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


// ======================================================
// 7. ABRIR FORMULARIO PARA AGREGAR PRODUCTOS
// ======================================================

if (btnAgregar) {

    btnAgregar.addEventListener("click", () => {

        formProducto.reset();

        document.getElementById("productoId").value = "";

        document.getElementById("tituloFormulario").textContent =
            "Agregar producto";

        document.getElementById("btnGuardar").textContent =
            "Guardar producto";

        modalFormulario.style.display = "flex";

        modalFormulario.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        document.getElementById("nombre").focus();

    });

}


// ======================================================
// 8. ABRIR FORMULARIO PARA MODIFICAR PRODUCTOS
// ======================================================

function abrirFormularioEditar(idProducto) {

    const producto = todosLosProductos.find(
        p => String(p.id) === String(idProducto)
    );

    if (!producto) {

        alert("No se encontró el producto.");

        return;
    }

    // Cargar datos en el formulario
    document.getElementById("productoId").value = producto.id;

    document.getElementById("nombre").value =
        producto.nombre || "";

    document.getElementById("precio").value =
        producto.precio ?? "";

    document.getElementById("descripcion").value =
        producto.descripcion || "";

    document.getElementById("imagen").value =
        producto.imagen || "";

    // Cambiar título y botón
    document.getElementById("tituloFormulario").textContent =
        "Modificar producto";

    document.getElementById("btnGuardar").textContent =
        "Guardar cambios";

    // Mostrar formulario
    modalFormulario.style.display = "flex";

    modalFormulario.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    document.getElementById("nombre").focus();

}


// ======================================================
// 9. GUARDAR Y MODIFICAR PRODUCTOS
// ======================================================

if (formProducto) {

    formProducto.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const id = document.getElementById("productoId").value;

        const nombre = document.getElementById("nombre").value.trim();

        const precio = Number(document.getElementById("precio").value);

        const descripcion =
            document.getElementById("descripcion").value.trim();

        const imagen =
            document.getElementById("imagen").value.trim();

        // Validaciones
        if (!nombre || !descripcion || !Number.isFinite(precio) || precio < 0) {

            alert("Por favor, completa correctamente los campos.");

            return;
        }

        // Buscar producto existente para conservar sus demás datos
        const productoExistente = id
            ? todosLosProductos.find(p => String(p.id) === String(id))
            : null;

        if (id && !productoExistente) {

            alert("No se encontró el producto que deseas modificar.");

            return;
        }

        // Datos del producto
        const producto = {
            ...(productoExistente || {}),
            nombre,
            precio,
            descripcion,
            imagen
        };

        try {

            let respuesta;

            if (id) {

                // MODIFICAR PRODUCTO
                respuesta = await fetch(`${API_URL}/${id}`, {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(producto)

                });

            } else {

                // AGREGAR PRODUCTO
                respuesta = await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        ...producto,
                        stock: 0
                    })

                });

            }

            if (!respuesta.ok) {

                throw new Error("No se pudo guardar el producto.");

            }

            alert(
                id
                    ? "¡Producto modificado correctamente!"
                    : "¡Producto agregado correctamente!"
            );

            cerrarFormulario();

            formProducto.reset();

            // Recargar productos
            await actualizarProductos();

        } catch (error) {

            console.error("Error al guardar:", error);

            alert("Ocurrió un error al guardar el producto.");

        }

    });

}


// ======================================================
// 10. ACTUALIZAR LISTADO DE PRODUCTOS
// ======================================================

async function actualizarProductos() {

    const productos = await cargarProductos();

    if (productos === null) {

        alert("No se pudieron actualizar los productos.");

        return;
    }

    todosLosProductos = productos;

    // Mantener la búsqueda activa
    const textoUsuario = inputBuscador
        ? inputBuscador.value.toLowerCase().trim()
        : "";

    const productosFiltrados = todosLosProductos.filter(producto => {

        return (producto.nombre || "")
            .toLowerCase()
            .includes(textoUsuario);

    });

    renderizarLista(productosFiltrados);

}


// ======================================================
// 11. CONFIGURAR EVENTOS DE LOS MODALES
// ======================================================

// Cerrar modal de detalles
if (btnCerrar) {

    btnCerrar.addEventListener("click", cerrarModal);

}

// Cerrar modal del formulario
if (btnCerrarFormulario) {

    btnCerrarFormulario.addEventListener("click", cerrarFormulario);

}

// Cerrar haciendo clic fuera del modal de detalles
if (modal) {

    modal.addEventListener("click", (evento) => {

        if (evento.target === modal) {

            cerrarModal();

        }

    });

}

// Cerrar haciendo clic fuera del formulario
if (modalFormulario) {

    modalFormulario.addEventListener("click", (evento) => {

        if (evento.target === modalFormulario) {

            cerrarFormulario();

        }

    });

}

// Cerrar con Escape
document.addEventListener("keydown", (evento) => {

    if (evento.key === "Escape") {

        cerrarModal();

        cerrarFormulario();

    }

});


// ======================================================
// 12. BUSCADOR DINÁMICO
// ======================================================

if (inputBuscador) {

    inputBuscador.addEventListener("input", (evento) => {

        const textoUsuario = evento.target.value
            .toLowerCase()
            .trim();

        const productosFiltrados = todosLosProductos.filter(producto => {

            const nombreProducto = (producto.nombre || "")
                .toLowerCase();

            return nombreProducto.includes(textoUsuario);

        });

        renderizarLista(productosFiltrados);

    });

}


// ======================================================
// 13. INICIALIZAR APLICACIÓN
// ======================================================

async function iniciarApp() {

    if (contenedorProductos) {

        contenedorProductos.textContent = "Cargando productos...";

    }

    const productos = await cargarProductos();

    if (productos === null) {

        if (contenedorProductos) {

            contenedorProductos.textContent =
                "Error de conexión. Verifica que JSON Server esté funcionando.";

        }

        return;
    }

    todosLosProductos = productos;

    renderizarLista(todosLosProductos);

    console.log("Aplicación iniciada correctamente.");

}


// ======================================================
// 14. EJECUTAR APLICACIÓN
// ======================================================

iniciarApp();

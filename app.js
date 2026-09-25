/* =====================================================
   COLONIA ROSA BOCHAS CLUB
   COMERCIAL DE BOCHAS
   ===================================================== */


/* -----------------------------
   DATOS DEL CAMPEONATO
----------------------------- */

let campeonato = {
    zonas: []
};


/* -----------------------------
   CARGAR DATOS GUARDADOS
----------------------------- */

function cargarDatos() {

    const datos = localStorage.getItem("coloniaRosaBochas");

    if (datos) {

        campeonato = JSON.parse(datos);

    }

    actualizarTodo();
}


/* -----------------------------
   GUARDAR DATOS
----------------------------- */

function guardarDatos() {

    localStorage.setItem(
        "coloniaRosaBochas",
        JSON.stringify(campeonato)
    );

}


/* -----------------------------
   NAVEGACIÓN
----------------------------- */

function mostrarSeccion(nombre) {

    document.querySelectorAll(".seccion")
        .forEach(seccion => {
            seccion.classList.remove("activa");
        });

    const seccion = document.getElementById(nombre);

    if (seccion) {
        seccion.classList.add("activa");
    }

    actualizarTodo();
}


/* -----------------------------
   CREAR ZONA
----------------------------- */

function crearZona() {

    const numero = campeonato.zonas.length + 1;

    const zona = {

        id: Date.now(),

        nombre: `Zona ${numero}`,

        equipos: [],

        partidos: []

    };


    campeonato.zonas.push(zona);

    guardarDatos();

    actualizarTodo();

}


/* -----------------------------
   CAMBIAR CANTIDAD DE EQUIPOS
----------------------------- */

function cambiarCantidadEquipos(zonaId, cantidad) {

    const zona = campeonato.zonas.find(z => z.id === zonaId);

    if (!zona) return;

    cantidad = parseInt(cantidad);

    if (cantidad < 1) {
        cantidad = 1;
    }


    while (zona.equipos.length < cantidad) {

        const numero = zona.equipos.length + 1;

        zona.equipos.push({

            id: Date.now() + Math.random(),

            nombre: `Equipo ${numero}`,

            jugadores: [
                "",
                "",
                "",
                ""
            ]

        });

    }


    while (zona.equipos.length > cantidad) {

        zona.equipos.pop();

    }


    zona.partidos = [];

    guardarDatos();

    actualizarTodo();

}


/* -----------------------------
   CAMBIAR NOMBRE DE ZONA
----------------------------- */

function cambiarNombreZona(zonaId, nombre) {

    const zona = campeonato.zonas.find(z => z.id === zonaId);

    if (!zona) return;

    zona.nombre = nombre;

    guardarDatos();

}


/* -----------------------------
   ELIMINAR ZONA
----------------------------- */

function eliminarZona(zonaId) {

    if (!confirm("¿Querés eliminar esta zona?")) {
        return;
    }

    campeonato.zonas =
        campeonato.zonas.filter(z => z.id !== zonaId);

    guardarDatos();

    actualizarTodo();

}


/* -----------------------------
   ACTUALIZAR EQUIPO
----------------------------- */

function actualizarEquipo(
    zonaId,
    equipoId,
    campo,
    valor
) {

    const zona =
        campeonato.zonas.find(z => z.id === zonaId);

    if (!zona) return;


    const equipo =
        zona.equipos.find(e => e.id === equipoId);

    if (!equipo) return;


    if (campo === "nombre") {

        equipo.nombre = valor;

    }


    if (campo.startsWith("jugador")) {

        const numero =
            parseInt(campo.replace("jugador", ""));

        equipo.jugadores[numero - 1] = valor;

    }


    guardarDatos();

}


/* -----------------------------
   CREAR PARTIDOS
----------------------------- */

function generarPartidos(zona) {

    const equipos = zona.equipos;

    zona.partidos = [];


    for (let i = 0; i < equipos.length; i++) {

        for (let j = i + 1; j < equipos.length; j++) {

            zona.partidos.push({

                id: Date.now() + Math.random(),

                equipo1: equipos[i].id,

                equipo2: equipos[j].id,

                puntos1: null,

                puntos2: null

            });

        }

    }

}


/* -----------------------------
   CARGAR RESULTADO
----------------------------- */

function cargarResultado(
    zonaId,
    partidoId,
    equipo,
    valor
) {

    const zona =
        campeonato.zonas.find(z => z.id === zonaId);

    if (!zona) return;


    const partido =
        zona.partidos.find(p => p.id === partidoId);

    if (!partido) return;


    valor = parseInt(valor);


    if (isNaN(valor)) {
        valor = null;
    }


    if (valor !== null && valor < 0) {
        valor = 0;
    }


    if (valor !== null && valor > 15) {
        valor = 15;
    }


    if (equipo === 1) {
        partido.puntos1 = valor;
    }

    if (equipo === 2) {
        partido.puntos2 = valor;
    }


    guardarDatos();

    actualizarTodo();

}


/* -----------------------------
   OBTENER ESTADÍSTICAS
----------------------------- */

function obtenerEstadisticas(zona) {

    const estadisticas = {};


    zona.equipos.forEach(equipo => {

        estadisticas[equipo.id] = {

            equipo: equipo,

            pj: 0,

            pg: 0,

            pp: 0,

            puntos: 0,

            pf: 0,

            pc: 0,

            diferencia: 0

        };

    });


    zona.partidos.forEach(partido => {

        if (
            partido.puntos1 === null ||
            partido.puntos2 === null
        ) {
            return;
        }


        const e1 = estadisticas[partido.equipo1];
        const e2 = estadisticas[partido.equipo2];


        if (!e1 || !e2) return;


        e1.pj++;
        e2.pj++;


        e1.pf += partido.puntos1;
        e1.pc += partido.puntos2;


        e2.pf += partido.puntos2;
        e2.pc += partido.puntos1;


        if (partido.puntos1 > partido.puntos2) {

            e1.pg++;
            e1.puntos++;

            e2.pp++;

        }

        else if (partido.puntos2 > partido.puntos1) {

            e2.pg++;
            e2.puntos++;

            e1.pp++;

        }

    });


    Object.values(estadisticas).forEach(e => {

        e.diferencia = e.pf - e.pc;

    });


    return Object.values(estadisticas);

}


/* -----------------------------
   ACTUALIZAR TODA LA APP
----------------------------- */

function actualizarTodo() {

    mostrarZonas();

    mostrarEquipos();

    mostrarPartidos();

    mostrarTablas();

    actualizarResumen();

}


/* -----------------------------
   MOSTRAR ZONAS
----------------------------- */

function mostrarZonas() {

    const contenedor =
        document.getElementById("listaZonas");

    if (!contenedor) return;


    if (campeonato.zonas.length === 0) {

        contenedor.innerHTML = `
            <div class="tarjeta">
                <h3>🏟️ No hay zonas creadas</h3>
                <p>Presioná "Crear zona" para comenzar.</p>
            </div>
        `;

        return;

    }


    contenedor.innerHTML =
        campeonato.zonas.map(zona => `

            <div class="zona-card">

                <div class="zona-header">

                    <h3>${zona.nombre}</h3>

                    <button
                        class="boton boton-peligro"
                        onclick="eliminarZona(${zona.id})">

                        🗑️

                    </button>

                </div>


                <label>Nombre de la zona</label>

                <input
                    value="${zona.nombre}"
                    onchange="cambiarNombreZona(
                        ${zona.id},
                        this.value
                    )"
                >


                <br><br>


                <label>
                    Cantidad de equipos
                </label>

                <input
                    type="number"
                    min="1"
                    value="${zona.equipos.length}"
                    onchange="cambiarCantidadEquipos(
                        ${zona.id},
                        this.value
                    )"
                >

            </div>

        `).join("");

}


/* -----------------------------
   MOSTRAR EQUIPOS
----------------------------- */

function mostrarEquipos() {

    const contenedor =
        document.getElementById("listaEquipos");

    if (!contenedor) return;


    if (campeonato.zonas.length === 0) {

        contenedor.innerHTML = `
            <div class="tarjeta">
                Primero tenés que crear una zona.
            </div>
        `;

        return;

    }


    let html = "";


    campeonato.zonas.forEach(zona => {

        html += `

            <div class="tarjeta">

                <h2>🏟️ ${zona.nombre}</h2>

        `;


        zona.equipos.forEach((equipo, indice) => {

            html += `

                <div class="equipo-card">

                    <div class="equipo-titulo">

                        <h3>
                            Equipo ${indice + 1}
                        </h3>

                    </div>


                    <label>
                        Nombre del equipo
                    </label>

                    <input
                        value="${equipo.nombre}"
                        onchange="actualizarEquipo(
                            ${zona.id},
                            ${equipo.id},
                            'nombre',
                            this.value
                        )"
                    >


                    <br><br>


                    <div class="jugadores">

            `;


            for (let i = 0; i < 4; i++) {

                html += `

                    <div>

                        <label>
                            Jugador ${i + 1}
                        </label>

                        <input
                            value="${equipo.jugadores[i]}"
                            onchange="actualizarEquipo(
                                ${zona.id},
                                ${equipo.id},
                                'jugador${i + 1}',
                                this.value
                            )"
                        >

                    </div>

                `;

            }


            html += `

                    </div>

                </div>

            `;

        });


        html += `

            </div>

        `;

    });


    contenedor.innerHTML = html;

}


/* -----------------------------
   MOSTRAR PARTIDOS
----------------------------- */

function mostrarPartidos() {

    const contenedor =
        document.getElementById("listaPartidos");

    if (!contenedor) return;


    let html = "";


    campeonato.zonas.forEach(zona => {

        if (zona.equipos.length < 2) {
            return;
        }


        if (
            !zona.partidos ||
            zona.partidos.length === 0
        ) {

            generarPartidos(zona);

        }


        html += `

            <div class="tarjeta">

                <h2>🏟️ ${zona.nombre}</h2>

        `;


        zona.partidos.forEach((partido, indice) => {

            const e1 =
                zona.equipos.find(
                    e => e.id === partido.equipo1
                );

            const e2 =
                zona.equipos.find(
                    e => e.id === partido.equipo2
                );


            if (!e1 || !e2) return;


            html += `

                <div class="partido-card">

                    <h3>
                        Partido ${indice + 1}
                    </h3>

                    <br>


                    <div class="partido-equipos">

                        <div class="partido-equipo">

                            <strong>
                                ${e1.nombre}
                            </strong>

                            <input
                                class="resultado-input"
                                type="number"
                                min="0"
                                max="15"
                                value="${
                                    partido.puntos1 ?? ""
                                }"
                                onchange="cargarResultado(
                                    ${zona.id},
                                    ${partido.id},
                                    1,
                                    this.value
                                )"
                            >

                        </div>


                        <div class="vs">
                            VS
                        </div>


                        <div class="partido-equipo">

                            <strong>
                                ${e2.nombre}
                            </strong>

                            <input
                                class="resultado-input"
                                type="number"
                                min="0"
                                max="15"
                                value="${
                                    partido.puntos2 ?? ""
                                }"
                                onchange="cargarResultado(
                                    ${zona.id},
                                    ${partido.id},
                                    2,
                                    this.value
                                )"
                            >

                        </div>

                    </div>

                </div>

            `;

        });


        html += `</div>`;

    });


    if (html === "") {

        html = `
            <div class="tarjeta">
                Necesitás tener al menos dos equipos
                en una zona para cargar partidos.
            </div>
        `;

    }


    contenedor.innerHTML = html;

}


/* -----------------------------
   MOSTRAR TABLAS
----------------------------- */

function mostrarTablas() {

    const contenedor =
        document.getElementById("listaTablas");

    if (!contenedor) return;


    let html = "";


    campeonato.zonas.forEach(zona => {

        const datos =
            obtenerEstadisticas(zona);


        datos.sort((a, b) => {

            if (b.puntos !== a.puntos) {
                return b.puntos - a.puntos;
            }

            if (b.diferencia !== a.diferencia) {
                return b.diferencia - a.diferencia;
            }

            return b.pf - a.pf;

        });


        html += `

            <div class="tabla-container">

                <h3>🏟️ ${zona.nombre}</h3>

                <table>

                    <thead>

                        <tr>

                            <th>Pos.</th>
                            <th>Equipo</th>
                            <th>PJ</th>
                            <th>PG</th>
                            <th>PP</th>
                            <th>Puntos</th>
                            <th>PF</th>
                            <th>PC</th>
                            <th>Dif.</th>

                        </tr>

                    </thead>

                    <tbody>

        `;


        datos.forEach((dato, indice) => {

            const clase =
                dato.diferencia >= 0
                    ? "diferencia-positiva"
                    : "diferencia-negativa";


            html += `

                <tr>

                    <td>
                        <strong>
                            ${indice + 1}
                        </strong>
                    </td>

                    <td>
                        ${dato.equipo.nombre}
                    </td>

                    <td>${dato.pj}</td>

                    <td>${dato.pg}</td>

                    <td>${dato.pp}</td>

                    <td>
                        <strong>
                            ${dato.puntos}
                        </strong>
                    </td>

                    <td>${dato.pf}</td>

                    <td>${dato.pc}</td>

                    <td class="${clase}">
                        ${dato.diferencia > 0 ? "+" : ""}
                        ${dato.diferencia}
                    </td>

                </tr>

            `;

        });


        html += `

                    </tbody>

                </table>

            </div>

        `;

    });


    if (html === "") {

        html = `
            <div class="tarjeta">
                Todavía no hay zonas creadas.
            </div>
        `;

    }


    contenedor.innerHTML = html;

}


/* -----------------------------
   RESUMEN
----------------------------- */

function actualizarResumen() {

    const cantidadZonas =
        campeonato.zonas.length;


    const cantidadEquipos =
        campeonato.zonas.reduce(
            (total, zona) =>
                total + zona.equipos.length,
            0
        );


    const cantidadPartidos =
        campeonato.zonas.reduce(
            (total, zona) =>
                total + (zona.partidos?.length || 0),
            0
        );


    document.getElementById(
        "cantidadZonas"
    ).textContent = cantidadZonas;


    document.getElementById(
        "cantidadEquipos"
    ).textContent = cantidadEquipos;


    document.getElementById(
        "cantidadPartidos"
    ).textContent = cantidadPartidos;

}


/* -----------------------------
   REINICIAR CAMPEONATO
----------------------------- */

function reiniciarCampeonato() {

    const confirmar = confirm(
        "⚠️ ATENCIÓN\n\n" +
        "Esto eliminará todas las zonas, equipos, " +
        "jugadores y resultados.\n\n" +
        "¿Querés reiniciar el campeonato?"
    );


    if (!confirmar) {
        return;
    }


    campeonato = {
        zonas: []
    };


    localStorage.removeItem(
        "coloniaRosaBochas"
    );


    actualizarTodo();

    mostrarSeccion("inicio");

}


/* -----------------------------
   INICIAR APLICACIÓN
----------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    cargarDatos
);
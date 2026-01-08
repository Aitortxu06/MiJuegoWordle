import { obtenerPalabraDelDia, validarPalabraRAE } from "./Api-Wordle.js";

const maxIntentos = 6;
let intentoActual = 0;
let posicionLetra = 0;
let palabraSecreta = "";


const filas = document.querySelectorAll(".row");
const mensaje = document.getElementById("mensaje");
const keyboard = document.getElementById("keyboard");

let palabraActual = "";

/* TECLAS */
const teclas = {};

/* INICIAR JUEGO */
async function iniciarJuego() {
    palabraSecreta = await obtenerPalabraDelDia();
    console.log("Palabra del día:", palabraSecreta);
    crearTeclado();
}
iniciarJuego();

/* CREAR TECLADO */
const filasTeclado = [
    "QWERTYUIOP", 
    "ASDFGHJKLÑ", 
    "⌫ZXCVBNM⏎"
];

function crearTeclado() {
    filasTeclado.forEach(fila => {
        const divFila = document.createElement("div");
        divFila.classList.add("keyboard-row");

        fila.split("").forEach(letra => {
            const btn = document.createElement("button");
            btn.classList.add("key");
            btn.textContent = letra;
            btn.onclick = () => escribirLetra(letra);

            // BORRAR
            if (letra === "⌫") {
                btn.textContent = "⌫";
                btn.classList.add("key-wide");
                btn.onclick = borrarLetra;
            }
            // ENTER
            else if (letra === "⏎") {
                btn.textContent = "ENTER";
                btn.classList.add("key-wide");
                btn.onclick = comprobarIntento;
            }
            // LETRAS
            else {
                btn.textContent = letra;
                btn.onclick = () => escribirLetra(letra);
                teclas[letra] = btn;
            }

            divFila.appendChild(btn);
        });

        keyboard.appendChild(divFila);
    });
}

/* ESCRIBIR LETRA */
function escribirLetra(letra) {
    if (teclas[letra]?.classList.contains("gris")) return;

    if (posicionLetra < 5) {
        const tile = filas[intentoActual].children[posicionLetra];
        tile.textContent = letra;
        palabraActual += letra;
        posicionLetra++;
    }
}

/* BORRAR */
function borrarLetra() {
    if (posicionLetra > 0) {
        posicionLetra--;
        const tile = filas[intentoActual].children[posicionLetra];
        tile.textContent = "";
        palabraActual = palabraActual.slice(0, -1);
    }
}

/* ENTER */
document.addEventListener("keydown", async e => {
    if (/^[a-zñ]$/i.test(e.key)) escribirLetra(e.key.toUpperCase());
    if (e.key === "Backspace") borrarLetra();
    if (e.key === "Enter") comprobarIntento();
});

/* COMPROBAR PALABRA */
async function comprobarIntento() {
    if (palabraActual.length !== 5) {
        mensaje.textContent = "La palabra debe tener 5 letras";
        return;
    }

    if (!(await validarPalabraRAE(palabraActual))) {
        mensaje.textContent = "No existe en la RAE";
        return;
    }

    comprobarColores();

    if (palabraActual === palabraSecreta) {
        mensaje.textContent = "¡Has ganado!";
        return;
    }

    intentoActual++;
    posicionLetra = 0;
    palabraActual = "";

    if (intentoActual === maxIntentos) {
        mensaje.textContent = `La palabra era ${palabraSecreta}`;
    }
}

/* COLORES WORDLE */
function comprobarColores() {
    const fila = filas[intentoActual];
    const secreta = palabraSecreta.split("");
    const intento = palabraActual.split("");

    // VERDES
    intento.forEach((l, i) => {
        if (l === secreta[i]) {
            fila.children[i].classList.add("verde");
            secreta[i] = null;
            intento[i] = null;
        }
    });

    // AMARILLOS Y GRISES
    intento.forEach((l, i) => {
        if (!l) return;

        if (secreta.includes(l)) {
            fila.children[i].classList.add("amarillo");
            colorearTecla(l, "amarillo");
            secreta[secreta.indexOf(l)] = null;
        } else {
            fila.children[i].classList.add("gris");
            colorearTecla(l, "gris");
        }
    });
}

/* COLOREAR TECLAS */
function colorearTecla(letra, color) {
    const tecla = teclas[letra];
    if (!tecla) return;

    if (color === "verde") {
        tecla.className = "Key verde"
        tecla.disabled = false;

    } else if (color === "amarillo" && !tecla.classList.contains("verde")) {
        tecla.className = "key amarillo";
        tecla.disabled = false;
    } else if (
        color === "gris" &&
        !tecla.classList.contains("verde") &&
        !tecla.classList.contains("amarillo")
    ) {
        tecla.className = "key gris";
        tecla.disabled = true;
    }
}

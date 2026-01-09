import { obtenerPalabraDelDia, validarPalabraRAE } from "./Api-Wordle.js";

document.addEventListener("DOMContentLoaded", () => {

    const maxIntentos = 6;
    let intentoActual = 0;
    let posicionLetra = 0;
    let palabraSecreta = "";

    const filas = document.querySelectorAll(".row");
    const mensaje = document.getElementById("mensaje");
    const keyboard = document.getElementById("keyboard");

    let palabraActual = "";
    const teclas = {};

    const filasTeclado = ["QWERTYUIOP","ASDFGHJKLÑ","⏎ZXCVBNM⌫"];

    async function iniciarJuego() {
        palabraSecreta = await obtenerPalabraDelDia();
        console.log("Palabra del día:", palabraSecreta);
        crearTeclado();
    }

    function crearTeclado() {
        filasTeclado.forEach(fila => {
            const divFila = document.createElement("div");
            divFila.classList.add("keyboard-row");

            fila.split("").forEach(letra => {
                const btn = document.createElement("button");
                btn.classList.add("key");

                if (letra === "⌫") { btn.textContent = "⌫"; btn.classList.add("key-wide"); btn.onclick = borrarLetra; }
                else if (letra === "⏎") { btn.textContent = "ENTER"; btn.classList.add("key-wide"); btn.onclick = comprobarIntento; }
                else { btn.textContent = letra; btn.onclick = () => escribirLetra(letra); teclas[letra] = btn; }

                divFila.appendChild(btn);
            });

            keyboard.appendChild(divFila);
        });
    }

    function escribirLetra(letra) {
        if (teclas[letra]?.classList.contains("gris")) return;
        if (posicionLetra < 5) {
            const tile = filas[intentoActual].children[posicionLetra];
            tile.textContent = letra;
            palabraActual += letra;
            posicionLetra++;
        }
    }

    function borrarLetra() {
        if (posicionLetra > 0) {
            posicionLetra--;
            const tile = filas[intentoActual].children[posicionLetra];
            tile.textContent = "";
            palabraActual = palabraActual.slice(0, -1);
        }
    }

    document.addEventListener("keydown", e => {
        if (/^[a-zñ]$/i.test(e.key)) escribirLetra(e.key.toUpperCase());
        if (e.key === "Backspace") borrarLetra();
        if (e.key === "Enter") comprobarIntento();
    });

    async function comprobarIntento() {
        if (palabraActual.length !== 5) { mensaje.textContent = "La palabra debe tener 5 letras"; return; }
        if (!(await validarPalabraRAE(palabraActual))) { mensaje.textContent = "No existe en la RAE"; return; }

        comprobarColores();

        if (palabraActual === palabraSecreta) { mensaje.textContent = "¡Has ganado!"; return; }

        intentoActual++; posicionLetra = 0; palabraActual = "";

        if (intentoActual === maxIntentos) { mensaje.textContent = `La palabra era ${palabraSecreta}`; }
    }

    function comprobarColores() {
        const fila = filas[intentoActual];
        const secreta = palabraSecreta.split("");
        const intento = palabraActual.split("");

        intento.forEach((l,i)=>{
            if(l===secreta[i]){ fila.children[i].classList.add("verde"); colorearTecla(l,"verde"); secreta[i]=null; intento[i]=null; }
        });

        intento.forEach((l,i)=>{
            if(!l) return;
            if(secreta.includes(l)){ fila.children[i].classList.add("amarillo"); colorearTecla(l,"amarillo"); secreta[secreta.indexOf(l)]=null; }
            else { fila.children[i].classList.add("gris"); colorearTecla(l,"gris"); }
        });
    }

    function colorearTecla(letra,color){
        const tecla=teclas[letra]; if(!tecla) return;
        if(color==="verde"){ tecla.className="key verde"; tecla.disabled=false; }
        else if(color==="amarillo"&&!tecla.classList.contains("verde")){ tecla.className="key amarillo"; tecla.disabled=false; }
        else if(color==="gris"&&!tecla.classList.contains("verde")&&!tecla.classList.contains("amarillo")){ tecla.className="key gris"; tecla.disabled=true; }
    }

    iniciarJuego();
});

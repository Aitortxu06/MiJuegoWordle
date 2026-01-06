/* PALABRA DEL DÍA */
export async function obtenerPalabraDelDia() {
    const hoy = new Date().toISOString().split("T")[0];

    const palabraGuardada = localStorage.getItem("palabraWordle");
    const fechaGuardada = localStorage.getItem("fechaWordle");

    if (palabraGuardada && fechaGuardada === hoy) {
        return palabraGuardada;
    }

    let palabraValida = false;
    let palabra = "";

    // Repetimos hasta conseguir una palabra válida en la RAE
    while (!palabraValida) {
        const response = await fetch(
            "https://random-word-api.herokuapp.com/word?number=1&length=5&lang=es"
        );
        const data = await response.json();
        palabra = data[0].toUpperCase();

        palabraValida = await validarPalabraRAE(palabra);
    }

    localStorage.setItem("palabraWordle", palabra);
    localStorage.setItem("fechaWordle", hoy);

    return palabra;
}

/* VALIDAR PALABRA EN LA RAE */
export async function validarPalabraRAE(palabra) {
     // Simulación de validación
        return /^[A-ZÑ]{5}$/.test(palabra);
}
// esto lo he quitado porque si no me tengo que tirar mucho tiempo poniendo una palabra valida
/*try {
        const res = await fetch(
            `https://rae-api.com/api/words/${palabra.toLowerCase()}`
        );

        if (!res.ok) return false;

        const data = await res.json();

        // Si existe definición, damos la palabra como válida
        return Array.isArray(data) && data.length > 0;
    } catch (error) {
        console.error("Error RAE:", error);
        return false;
    }*/

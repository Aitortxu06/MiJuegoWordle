async function fetchRandomWord() {
    const url = 'https://random-word-api.herokuapp.com/word?number=1&length=5&lang=es';
    const response = await fetch(url);
    const data = await response.json(); 
    const word = data[0]
    console.log(word)

}

fetchRandomWord();
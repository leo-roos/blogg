document.addEventListener("DOMContentLoaded", async () => {
    const characterImageEl = document.querySelector("img#random-character-image");
    const answersEl = document.querySelector("div#answer-alternatives");

    characterImageEl.src = "";
    answersEl.innerHTML = ``;

    const defaultCharacters = await getDefaultCharacters();
    const characters = [...defaultCharacters];
    const images = await getAllImages();
    for (let index = 0; index < images.length; index++) {
        const item = images[index];
        const imgURL = URL.createObjectURL(item.blob);
        
        characters.push({
            from: item.from,
            img: imgURL,
            label: item.label,
            gender: item.gender,
            custom: true,
        });
    }

    const randomCharacterIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomCharacterIndex];
    let randomAlternatives = [randomCharacter];

    const charactersTaken = {
        [randomCharacterIndex]: true
    };
    for (let index = 0; index < 3; index++) {
        let random = Math.floor(Math.random() * characters.length);
        while (charactersTaken[random]) {
            random = Math.floor(Math.random() * characters.length);
        }
        charactersTaken[random] = true

        randomAlternatives.push(characters[random]);
    }
    
    randomAlternatives = shuffle(randomAlternatives);

    if (!randomCharacter.custom) {
        const response = await fetch(randomCharacter.img);
        const data = await response.blob();
        const imgURL = URL.createObjectURL(data);
        characterImageEl.src = imgURL;
    } else {
        characterImageEl.src = randomCharacter.img;
    }

    randomAlternatives.forEach((character, i) => {
        const div = document.createElement("div");
        div.classList.add("answer");
        div.setAttribute("data-index", i);

        div.textContent = character.label;
        div.addEventListener("click", () => {
            if (randomAlternatives[i].label === randomCharacter.label && randomAlternatives[i].from === randomCharacter.from) {
                alert("Korrekt!");
            } else {
                alert("Fel! Det rätta svaret är: " + randomCharacter.label);
            }
            location.reload();
        });
        answersEl.appendChild(div);
    });
});
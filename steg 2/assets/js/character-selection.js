var filterEls = document.querySelectorAll("#character-selection .page-layout .filters .filter");
var charactersEls = document.querySelectorAll("#character-selection .page-layout .items .item");

let currentFilter = "";

function selectFilter(value) {
    currentFilter = value;

    for (let index = 0; index < filterEls.length; index++) {
        const filterEl = filterEls[index];
        const filterValue = filterEl.getAttribute("data-type");
        if (filterValue == value) {
            filterEl.classList.add("active")
        } else {
            filterEl.classList.remove("active")
        }
    }
    
    for (let index = 0; index < charactersEls.length; index++) {
        const characterEl = charactersEls[index];
        const character = JSON.parse(characterEl.getAttribute("data-character"));
        if (value == "custom" && character.custom == true) {
            characterEl.classList.remove("hidden")
        }
        else if (value == "all" || character.gender == value) {
            characterEl.classList.remove("hidden")
        } else {
            characterEl.classList.add("hidden")
        }
    }
}

function selectCharacter(character) {
    for (let index = 0; index < charactersEls.length; index++) {
        const characterEl = charactersEls[index];
        const character2 = JSON.parse(characterEl.getAttribute("data-character"));
        if (character.from == character2.from && character.label == character2.label) {
            characterEl.classList.add("active")
        } else {
            characterEl.classList.remove("active")
        }
    }

    updateCharacter(character);
}

document.addEventListener("DOMContentLoaded", function(event) {
    selectFilter("all");

    for (let index = 0; index < filterEls.length; index++) {
        const filterEl = filterEls[index];
        const value = filterEl.getAttribute("data-type")
        filterEl.addEventListener('click', function() {
            selectFilter(value);
        })
    }

    for (let index = 0; index < charactersEls.length; index++) {
        const characterEl = charactersEls[index];
        const character = JSON.parse(characterEl.getAttribute("data-character"));
        
        characterEl.addEventListener('click', function() {
            selectCharacter(character);
        })
    }
})
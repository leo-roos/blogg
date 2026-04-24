var filterEls = document.querySelectorAll(".filters .filter");
var charactersEls = document.querySelectorAll(".items .item");
var currentFilter = "";

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
        const characterGender = characterEl.getAttribute("data-gender")
        const characterCustom = characterEl.getAttribute("data-custom")
        if (value == "custom" && characterCustom == true) {
            characterEl.classList.remove("hidden")
        }
        else if (value == "all" || characterGender == value) {
            characterEl.classList.remove("hidden")
        } else {
            characterEl.classList.add("hidden")
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    selectFilter("all");
})
var filterEls = document.querySelectorAll("#character-selection .page-layout .filters .filter");
var charactersElsContainer = document.querySelector("#character-selection .page-layout .items");
var charactersEls = charactersElsContainer.querySelectorAll(".item");

let currentFilter = "";
let loading = true;

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
        else if (value == "all" || character.gender == value || (value == "other" && character.gender == "unknown")) {
            characterEl.classList.remove("hidden")
        } else {
            characterEl.classList.add("hidden")
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function selectCharacter(character) {
    // while (loading === true) {
        // setTimeout(() => {
            // console.log("Waiting for characters to load");
        // }, 100);
    // }
    if (loading === true) {
        for (let index = 0; index < 25; index++) {
            console.log("Waiting for characters to load");
            await sleep(100);
            
            if (loading === false) {
                break;
            }
        }
    }

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

document.addEventListener("DOMContentLoaded", async (event) => {
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

    const defaultCharacters = await getDefaultCharacters();
    const data = [...defaultCharacters];
    const images = await getAllImages();
    for (let index = 0; index < images.length; index++) {
        const item = images[index];
        const imgURL = URL.createObjectURL(item.blob);
        
        data.push({
            from: item.from,
            img: imgURL,
            label: item.label,
            gender: item.gender,
            custom: true,
        });
    }
    for (let index = 0; index < data.length; index++) {
        const character = data[index];
        
        const div = document.createElement("div");
        div.classList.add("item");
        div.classList.add(character.gender);
        div.setAttribute("data-character", JSON.stringify(character));
        
        if (character.custom === true) {
            div.innerHTML = `
                <img class="delete-icon" src="/assets/Images/trash.png" alt="delete-icon">
                <img class="edit-icon" src="/assets/Images/edit.png" alt="edit-icon">
            `;
        }
        div.innerHTML += `
            <img class="image" src="${character.img}" alt="${character.label}">
            <div class="label">
                ${character.label} (${character.from})
            </div>
        `;

        const deleteIcon = div.querySelector(".delete-icon");
        const editIcon = div.querySelector(".edit-icon");
        if (character.custom === true) {
            deleteIcon.addEventListener("click", function(event) {
                console.log(event)
            })
            editIcon.addEventListener("click", function(event) {
                window.location.href = `/edit-character?index=${index}`;
            })
        }

        div.addEventListener("click", function(event) {
            if (event.target != editIcon && event.target != deleteIcon) {
                selectCharacter(character);
            }
        })

        charactersElsContainer.appendChild(div);
    }
    charactersEls = charactersElsContainer.querySelectorAll(".item");

    const charactersEls2 = Array.from(
        charactersElsContainer.querySelectorAll(".item")
    );

    charactersEls2.sort((a, b) => {
        const characterA = JSON.parse(a.getAttribute("data-character"));
        const characterB = JSON.parse(b.getAttribute("data-character"));

        return (
            characterA.from.localeCompare(characterB.from) ||
            characterA.label.localeCompare(characterB.label)
        );
    });

    charactersEls2.forEach(el => charactersElsContainer.appendChild(el));

    loading = false;
})
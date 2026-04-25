var filterEls = document.querySelectorAll("#character-selection .page-layout .filters .filter");
var charactersElsContainer = document.querySelector("#character-selection .page-layout .items");
var charactersEls = charactersElsContainer.querySelectorAll(".item");

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

document.addEventListener("DOMContentLoaded", async function(event) {
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

    const data = [];
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
        div.innerHTML = `
            <img class="delete-icon" src="/assets/Images/trash.png" alt="delete-icon">
            <img class="edit-icon" src="/assets/Images/edit.png" alt="edit-icon">

            <img class="image" src="${character.img}" alt="${character.label}">
            <div class="label">
                ${character.label} (${character.from})
            </div>
        `;

        const deleteIcon = div.querySelector(".delete-icon");
        const editIcon = div.querySelector(".edit-icon");
        deleteIcon.addEventListener("click", function(event) {
            console.log(event)
        })
        editIcon.addEventListener("click", function(event) {
            const url = new URL("/edit-character", window.location.origin);
            url.searchParams.set("index", index);

            window.location.href = url;
        })

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
})
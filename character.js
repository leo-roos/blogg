let filters, items;
let selectedFilter = "all";
let selectedCharacter = -1;

function updateFilter() {
    for (let index = 0; index < filters.length; index++) {
        const filter = filters[index];
        filter.classList.remove("active");
        if (selectedFilter == filter.getAttribute("data-type")) {
            filter.classList.add("active");
        }
    }
    updateCharacterList();
}

function updateSelectedCharacter() {
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const itemIndex = item.getAttribute("data-index");
        item.classList.remove("active");
        if (selectedCharacter == itemIndex) {
            item.classList.add("active");
        }
    }
}

async function updateCharacterList() {
    const req = await fetch("./characters.json")
    const data = await req.json();
    console.log(data);
    
    const list = document.querySelector("main.character-selection .items")
    list.innerHTML = "";

    for (let index = 0; index < data.length; index++) {
        const item = data[index];

        console.log(item.gender, selectedFilter)
        if (selectedFilter != "all" && item.gender != selectedFilter) {
            continue;
        }

        const div = document.createElement("div");
        div.classList.add("item");
        div.classList.add(item.gender);
        div.setAttribute("data-index", index);

        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.label;

        const label = document.createElement("div");
        label.classList.add("label");
        label.textContent = `${item.label} (${item.from})`;

        div.append(img, label);
        list.append(div);
    }

    items = document.querySelectorAll("main.character-selection .items .item");
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        item.addEventListener("click", function(event) {
            const itemIndex = item.getAttribute("data-index");
            console.log(itemIndex)
            selectedCharacter = itemIndex;
            updateSelectedCharacter();
        })
    }
    updateSelectedCharacter();
}

document.addEventListener("DOMContentLoaded", async function() {
    filters = document.querySelectorAll("main.character-selection .filters .filter");

    await updateCharacterList();

    for (let index = 0; index < filters.length; index++) {
        const filter = filters[index];
        filter.addEventListener("click", function(event) {
            selectedFilter = filter.getAttribute("data-type");
            updateFilter();
        })
    }
})
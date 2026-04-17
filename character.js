let filters, items, fileUpload;
let selectedFilter = "all";
let selectedCharacter = -1;
let charactersData;
let characterImage;

async function fetchData() {
    const req = await fetch("./characters.json")
    const data = await req.json();

    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        item.custom = false;
    }

    // Add images from IndexedDB
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

    // Sort
    data.sort(function(a, b)
        {
            return a.from.localeCompare(b.from) || a.label.localeCompare(b.label)
        }
    );
    
    charactersData = data;
}

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
    if (characterImage != null && selectedCharacter != -1) {
        characterImage.src = charactersData[selectedCharacter].img;
    }
    if (items) {
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const itemIndex = item.getAttribute("data-index");
            item.classList.remove("active");
            if (selectedCharacter == itemIndex) {
                item.classList.add("active");
                localStorage.setItem("selectedCharacter", JSON.stringify(charactersData[selectedCharacter]));
            }
        }
    }
}

function updateCharacterList() {
    const list = document.querySelector("main#character-selection .items")
    list.innerHTML = "";

    for (let index = 0; index < charactersData.length; index++) {
        const item = charactersData[index];

        if (selectedFilter === "custom") {
            if (!item.custom) continue;
        } else if (selectedFilter !== "all") {
            if (item.gender !== selectedFilter) continue;
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
        label.innerHTML = `${item.label} <div class="from">${item.from}</div>`;

        const deleteIcon = document.createElement("img");
        deleteIcon.classList.add("delete-icon");
        deleteIcon.src = "/Assets/Images/trash.png";

        const editIcon = document.createElement("img");
        editIcon.classList.add("edit-icon");
        editIcon.src = "/Assets/Images/edit.png";

        deleteIcon.addEventListener("click", function(event) {
            console.log(event)
        })
        editIcon.addEventListener("click", function(event) {
            console.log(event)
        })

        div.addEventListener("click", function(event) {
            if (event.target != editIcon && event.target != deleteIcon) {
                if (selectedCharacter != index) {
                    selectedCharacter = index;
                    updateSelectedCharacter();
                }
            }
        })

        div.append(img, label);

        if (item.custom == true) {
            div.append(deleteIcon, editIcon);
        }
        list.append(div);
    }

    items = document.querySelectorAll("main#character-selection .items .item");
    updateSelectedCharacter();
}

document.addEventListener("DOMContentLoaded", async function() {
    filters = document.querySelectorAll("main#character-selection .filters .filter");
    characterImage = document.querySelector("img#character-image");
    fileUpload = document.querySelector("#file-upload");

    await fetchData();

    const selectedCharacterStorage = localStorage.getItem("selectedCharacter");
    if (selectedCharacterStorage) {
        const selectedCharacterData = JSON.parse(selectedCharacterStorage);
        selectedCharacter = charactersData.findIndex((char) => char.label === selectedCharacterData.label && char.from === selectedCharacterData.from);
    }

    if (this.location.pathname == "/character-selection.html") {
        updateCharacterList();
    } else {
        updateSelectedCharacter();
    }

    for (let index = 0; index < filters.length; index++) {
        const filter = filters[index];
        filter.addEventListener("click", function(event) {
            const type = filter.getAttribute("data-type");
            if (selectedFilter == type) {
                selectedFilter = "all";
            } else {
                selectedFilter = type;
            }
            updateFilter();
        })
    }
})

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ImageDB", 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            db.createObjectStore("images", { keyPath: "id" });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
async function saveImage(file, label, from, gender) {
    const db = await openDB();
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");

    const imageData = {
        id: `${label} (${from})`,
        label: label,
        from: from,
        gender: gender,
        blob: file
    };

    store.put(imageData);

    return transaction.complete;
}
async function loadImage(id) {
    const db = await openDB();
    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");

    return new Promise((resolve, reject) => {
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = reject;
    });
}
async function getAllImages() {
    const db = await openDB();
    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");

    return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = reject;
    });
}
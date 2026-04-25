var selectedCharacter = null;

var characterImageEl = document.getElementById("character-image");

function updateCharacter(character) {
    selectedCharacter = character;
    localStorage.setItem("selectedCharacter", JSON.stringify(character));
    if (characterImageEl) {
        characterImageEl.setAttribute("src", character.img);
    }
}

document.addEventListener("DOMContentLoaded", async function(event) {
    const selectedCharacterData = JSON.parse(localStorage.getItem("selectedCharacter"));

    if (selectedCharacterData != null) {
        console.log(selectedCharacterData);
        if (selectedCharacterData.custom == true) {
            const data = await getImage(`${selectedCharacterData.label} (${selectedCharacterData.from})`);
            if (!data) {
                console.error("Image not found in IndexedDB for character:", selectedCharacterData);
                localStorage.removeItem("selectedCharacter");
                return;
            }
            const imgURL = URL.createObjectURL(data.blob);
            selectedCharacterData.img = imgURL;
        }

        if (typeof selectCharacter !== "undefined") {
            selectCharacter(selectedCharacterData);
        } else {
            updateCharacter(selectedCharacterData);
        }
    }
});

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
async function editImage(file, oldId, label, from, gender) {
    const existing = await getImage(oldId);

    if (!existing) {
        throw new Error("Image not found: " + oldId);
    }

    const db = await openDB();
    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");

    const updatedData = {
        id: `${label} (${from})`,
        label: label ?? existing.label,
        from: from ?? existing.from,
        gender: gender ?? existing.gender,
        blob: file ?? existing.blob
    };

    await store.delete(existing.id);
    await store.put(updatedData);

    await tx.done;
}
async function getImage(id) {
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
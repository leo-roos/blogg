var selectedCharacter = null;

var characterImageEl = document.getElementById("character-image");

function updateCharacter(character) {
    selectedCharacter = character;
    localStorage.setItem("selectedCharacter", JSON.stringify(character));
    characterImageEl.setAttribute("src", character.img);
}

document.addEventListener("DOMContentLoaded", function(event) {
    const selectedCharacterData = localStorage.getItem("selectedCharacter");

    if (selectedCharacterData != null) {
        if (typeof selectCharacter !== "undefined") {
            selectCharacter(JSON.parse(selectedCharacterData));
        } else {
            updateCharacter(JSON.parse(selectedCharacterData));
        }
    }
});
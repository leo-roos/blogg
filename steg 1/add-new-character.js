let form;

document.addEventListener("DOMContentLoaded", function() {
    form = document.querySelector("form#new-character-form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        
        const file = formData.get("file-upload");
        const label = formData.get("label");
        const from = formData.get("from");
        const gender = formData.get("gender");
        await saveImage(file, label, from, gender);

        window.location.pathname = "/character-selection.html";
    })
})
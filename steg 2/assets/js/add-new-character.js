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

        window.location.pathname = "/character-selection";
    })

    form.querySelector("input[name='file-upload']").addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector("img#current-image").src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    })
});
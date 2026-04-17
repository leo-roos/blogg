let form;
let characterIndex = -1;

document.addEventListener("DOMContentLoaded", async function() {
    form = document.querySelector("form#edit-character-form");
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get("index");

    if (index != null) {
        await fetchData();
        characterIndex = index;

        document.querySelector("img#current-image").src = charactersData[index].img;
        form.querySelector("input[name='label']").value = charactersData[index].label;
        form.querySelector("input[name='from']").value = charactersData[index].from;
        form.querySelector("select[name='gender']").value = charactersData[index].gender;
    }

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        
        let file = formData.get("file-upload");
        if (file.size == 0) { // om fil är borta använd befintlig
            file = null;
        }
        const label = formData.get("label");
        const from = formData.get("from");
        const gender = formData.get("gender");
        await editImage(file, `${charactersData[characterIndex].label} (${charactersData[characterIndex].from})`, label, from, gender);

        window.location.pathname = "/character-selection.html";
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
})
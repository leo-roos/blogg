let form;

document.addEventListener("DOMContentLoaded", function() {
    form = document.querySelector("form#new-character-form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        
        console.log(event);
        console.log(formData);
        console.log(formData.get("label"));
    })
})
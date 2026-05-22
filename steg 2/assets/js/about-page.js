async function getRepos() {
    const response = await fetch("https://api.github.com/users/leo-roos/repos?sort=updated");
    const data = await response.json();
    const repos = [];
    for (const repo of data) {
        if (repo.archived) continue;
        repos.push({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            updatedAt: repo.updated_at
        });
    }
    return repos;
}


document.addEventListener("DOMContentLoaded", async () => {
    const repos = await getRepos();
    const items = document.querySelector("main#about-content .page-layout .other-projects .items");
    items.innerHTML = ``;
    repos.forEach(repo => {
       const div = document.createElement("div");
        div.classList.add("repo");
        div.addEventListener("click", () => {
            const a = div.querySelector("div a");
            a.click();
        })
        
        div.innerHTML = `
            <h2>${repo.name}</h2>
            <p>${repo.description || ""}</p>

            <div>
                <a href="${repo.url}" target="_blank">
                    Visa Repo
                </a>

                <span class="updated-at">${githubRelativeDate(repo.updatedAt)}</span>
            </div>
        `;

        items.appendChild(div);
    });
    console.log(items);
})
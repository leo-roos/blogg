let filters, items;
let selectedFilter = "all";
let selectedCharacter = -1;
let charactersData;
let characterImage;

async function fetchData() {
    const req = await fetch("./characters.json")
    const data = await req.json();
    
    // Sort
    const sort1 = [];
    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        sort1.push(`${item.from} - ${item.label}`);
    }
    data.sort(function(a, b)
        {
            return a.from.localeCompare(b.from) + a.label.localeCompare(b.label)
        }
    );
    console.log(data)
    
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
    if (selectedCharacter != -1) {
        characterImage.src = charactersData[selectedCharacter].img;
    }
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const itemIndex = item.getAttribute("data-index");
        item.classList.remove("active");
        if (selectedCharacter == itemIndex) {
            item.classList.add("active");
        }
    }
}

function updateCharacterList() {
    const list = document.querySelector("main.character-selection .items")
    list.innerHTML = "";

    for (let index = 0; index < charactersData.length; index++) {
        const item = charactersData[index];

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
            selectedCharacter = itemIndex;
            updateSelectedCharacter();
        })
    }
    updateSelectedCharacter();
}

document.addEventListener("DOMContentLoaded", async function() {
    filters = document.querySelectorAll("main.character-selection .filters .filter");
    characterImage = document.querySelector("img#character-image");

    await fetchData();
    updateCharacterList();

    for (let index = 0; index < filters.length; index++) {
        const filter = filters[index];
        filter.addEventListener("click", function(event) {
            selectedFilter = filter.getAttribute("data-type");
            updateFilter();
        })
    }
})

function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}
const string = "Haruno sakura, kugisaki nobara, chisato nishikigi, takina inoue, mikasa ackerman, maomao, yashiro nene, uraraka ochaco, toga himiko, tsukumo yuki, ymir aot, historia reiss, kirigiri kyoko, fukawa toko, ougami sakura, nohara rin, nanami chiaki, enoshima junko, khoshi kirara"
const a = string.split(","); 
console.log(a);
a.forEach(element => {
    // window.open(`https://www.google.com/search?client=firefox-b-d&q=${element.replace(" ", "+")}`, "_blank")
});
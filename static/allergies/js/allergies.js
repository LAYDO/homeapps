getAllergies();

async function getAllergies() {
    let url = `${window.location.href}get`;
    document.getElementById('allergiesCheck').style.visibility = 'visible';
    await fetch(url).then(response => {
        document.getElementById('allergiesCheck').style.visibility = 'hidden';
        return response.json();
    }).then(data => {
        window.sessionStorage.setItem('allergies', JSON.stringify(data));
        // let retrieve = JSON.parse(window.sessionStorage.getItem('allergies'));
        // console.log(retrieve);
        buildTable(JSON.parse(window.sessionStorage.getItem('allergies')).sort(compare), 'allergyTable');
    }).catch(error => {
        console.error('There has been a problem with your fetch operation: ', error);
    })
}

function getLevelColor(int) {
    switch (int) {
        case 1:
            return '#649632'; // 70A23E
        case 2:
            return '#FAC832';
        case 3:
            return '#a23e0c';
        default:
            return '#41730f';
    }
}

function showAllergies() {
    let table = document.getElementById('allergyTable');
    let icon = document.getElementById('allergiesToggle');
    if (table.style.visibility === 'hidden') {
        table.style.visibility = 'visible';
        icon.classList.replace('fa-plus', 'fa-minus');
    } else {
        table.style.visibility = 'hidden';
        icon.classList.replace('fa-minus', 'fa-plus');
    }
}

function checkAllergies() {
    let ingredients = document.getElementById('ingredientInput').value;
    let ingredientArray = ingredients.split(', ');
    ingredientArray.sort();
    console.log(ingredientArray);
    let recipeArray = [];
    let allergiesArray = JSON.parse(window.sessionStorage.allergies);
    console.log(allergiesArray);
    ingredientArray.forEach(ingred => {
        allergiesArray.forEach(allergy => {
            if (allergy.food.toLowerCase().includes(ingred.toLowerCase())) {
                recipeArray.push(allergy);
            }
        });
    });
    console.log(recipeArray);
    buildTable(recipeArray, 'recipeTable');
    percentGoodBoy(recipeArray, ingredientArray.length);
}

function buildTable(array, tableId) {
    document.getElementById(tableId).innerHTML = "";
    array.forEach(allergy => {
        let button = document.createElement('div');
        button.className = 'allergies-button';
        button.id = `allergy${allergy.id}`;
        let level = document.createElement('div');
        level.className = 'allergies-level';
        level.value = allergy.level;
        level.style.backgroundColor = getLevelColor(allergy.level);
        let food = document.createElement('div');
        food.className = 'allergies-food';
        food.innerText = allergy.food;
        button.append(level);
        button.append(food);
        document.getElementById(tableId).append(button);
    });
}

// Props - https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
function compare(a, b) {
    if (a.food < b.food) {
        return -1;
    }
    if (a.food > b.food) {
        return 1;
    }
    return 0;
}

function percentGoodBoy(array, ingredCount) {
    let percent = 0;
    let count = 0;
    array.forEach(a => {
        count++;
        switch (a.level) {
            case 1:
                percent += 0.8;
                break;
            case 2:
                percent += 0.5;
                break;
            case 3:
                break;
            default:
                percent += 1;
                break;
        }
    });
    document.getElementById('recipeTable').prepend(`${count > 0 ? ((percent / count) * 100).toFixed(1) : 0}% on ${((array.length / ingredCount) * 100).toFixed(1)}% ingredients found.`);
}

async function getLevelAllergies() {
    let url = `${window.location.href}get?level=0`;
    document.getElementById('allergiesCheck').style.visibility = 'visible';
    await fetch(url).then(response => {
        document.getElementById('allergiesCheck').style.visibility = 'hidden';
        return response.json();
    }).then(data => {
        window.sessionStorage.setItem('allergies0', JSON.stringify(data));
        // let retrieve = JSON.parse(window.sessionStorage.getItem('allergies'));
        // console.log(retrieve);
        buildTable(JSON.parse(window.sessionStorage.getItem('allergies0')).sort(compare), 'allergyTable');
    }).catch(error => {
        console.error('There has been a problem with your fetch operation: ', error);
    })
}
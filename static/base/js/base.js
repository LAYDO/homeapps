// var appStorage = window.sessionStorage;

// var y = document.getElementsByClassName("nav-link");
// for (var i = 0; i < y.length; i++) {
//     let temp = y[i].id.toLowerCase();
//     appStorage.setItem(y[i].id, false);
//     let path = window.location.pathname.replace('/', '');
//     path = path.replace('/', '');
//     if (path == temp) {
//         appStorage.setItem(y[i].id, true);
//     }
// }

// for (var i = 0; i < appStorage.length; i++) {
//     var active = appStorage.getItem(appStorage.key(i));
//     if (active === "true") {
//         // document.getElementById(appStorage.key(i)).className += " active";
//         console.log(appStorage);
//     }
// }

// window.onscroll = () => {
//     changeNav();
// }

// function changeNav() {
//     let navBar = document.getElementById('issNavbar');
//     let navTrigger = document.getElementById('issHeader').getBoundingClientRect();

//     if (navTrigger.bottom <= 0) {
//         navBar.classList.add("nav-fixed");
//     } else {
//         navBar.classList.remove("nav-fixed");
//     }
// }

function back() {
    window.history.back();
}
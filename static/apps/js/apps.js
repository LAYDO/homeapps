window.onload = () => {
    var y = document.getElementsByClassName("app-open");
    for (var i = 0; i < y.length; i++) {
        document.getElementById(y[i].id).className = "app-button";
    }
}

window.onunload = () => {}

function redirect(evt) {
    document.getElementById(evt.currentTarget.id).className = "app-open";
    window.location.pathname = evt.currentTarget.id.toLowerCase();
}
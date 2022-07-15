let issLat = document.getElementById('issLat');
let issLon = document.getElementById('issLon');
let issAlt = document.getElementById('issAlt');
let issVel = document.getElementById('issVel');
var issMap;
var metric = false;

initMap();
fetchISS();
setInterval(fetchISS, 2000);

function fetchISS() {
    let url = `${window.location.href}iss?units=${metric ? 'kilometers' : 'miles'}`;
    fetch(url).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        issLat.innerText = `${data.latitude.toFixed(4)}`;
        issLon.innerText = `${data.longitude.toFixed(4)}`;
        issAlt.innerText = `${data.altitude.toFixed(2)} ${metric ? 'km' : 'miles'}`;
        issVel.innerText = `${data.velocity.toFixed(2)} ${metric ? 'km/h' : 'mph'}`;
        // for loop and replace iss-icon class with new class to track where ISS has been (since on-screen)
        let icons = document.getElementsByClassName('iss-icon');
        for (var i = 0; i < icons.length; i++) {
            icons[i].className = '';
        }
        let issIcon = L.divIcon({ className: 'iss-icon' });
        L.marker([data.latitude, data.longitude], { icon: issIcon }).addTo(issMap);
    }).catch(error => {
        console.error('There has been a problem with your fetch operation: ', error);
    })
}

function initMap() {
    document.getElementById('issMap').innerHTML = '<div id="mapId"></div>';
    issMap = new L.map('mapId').setView([0, 0], 1.5);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        zoomSnap: 0.25,
        zoomDelta: 0.25,
        accessToken: 'pk.eyJ1IjoibGF5ZG8iLCJhIjoiY2t0bmcwZW5oMDJqNTJwbzJ1cm9uZHZjMiJ9.aP2xQEplUndXkrSgmkB9Sw'
    }).addTo(issMap);
}

function checkMetric() {
    metric = !metric;
    let m = document.getElementById('metricCheck');
    m.className = metric ? 'metric-checked' : 'metric';
}

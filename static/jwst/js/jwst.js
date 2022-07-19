window.onload = () => {
    init();
}

let jwstInfo = document.getElementById('jwstInfo');
let jwstDisplay = document.getElementById('jwstDisplay');
let jwstLoad = document.getElementById('jwstLoad');
let targetTitle = document.getElementById('targetTitle');
let targetName = document.getElementById('targetName');
let startTimeTimes = document.getElementById('startTimeTimes');
let categoryKeywords = document.getElementById('categoryKeywords');
let a = 25;
let longD = 2 * a;
let shortD = Math.sqrt(3) * a;
let halfA = a / 2;

function init() {
    let url = `${window.location.href}fetch`;
    console.log(url);
    fetch(url).then(response => {
        toggleLoad(1);
        return response.json();
    }).then(data => {
        // console.log(data);
        setInterval(determineTarget.bind(null, data), 1000);
        buildJWST();
        buildTable(data);
        toggleLoad(0);
    }).catch(error => {
        console.error('There has been a problem with your fetch operation: ', error);
        buildJWST();
        toggleLoad(0);
    })
}

function toggleLoad(load) {
    if (load) {
        jwstDisplay.style.visibility = 'hidden';
        jwstInfo.style.visibility = 'hidden';
    } else {
        jwstDisplay.style.visibility = 'visible';
        jwstInfo.style.visibility = 'visible';
    }
}

function buildTable(data) {
    let jwstTable = document.createElement('table');
    let headers = document.createElement('tr');
    let colArr = Object.keys(data[0]);
    colArr.forEach((key) => {
        let column = document.createElement('th');
        column.innerText = key;
        headers.append(column);
    });
    jwstTable.append(headers);
    data.forEach(d => {
        let dataRow = document.createElement('tr');
        let elements = Object.keys(d);
        elements.forEach(e => {
            let cell = document.createElement('td');
            cell.innerText = d[e];
            dataRow.append(cell);
        });
        jwstTable.append(dataRow);
    });
    jwstInfo.append(jwstTable);
}

function buildJWST() {
    let svg = document.getElementById('jwstSVG');
    let startX = 100;
    let startY = 1;
    let ppa = [[startX, startY], [startX - halfA, startY + (shortD / 2)], [startX, startY + shortD], [startX + a, startY + shortD], [startX + (1.5 * a), startY + a], [startX + a, startY]];
    // Center column
    for (i = 0; i < 5; i++) {
        let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        for (value of ppa) {
            let point = svg.createSVGPoint();
            let diffY = i * shortD;
            let diffX = 0;
            point.x = value[0] - diffX;
            point.y = value[1] + diffY;
            poly.points.appendItem(point);
        }
        if (i == 2) {
            poly.style.fill = 'transparent';
        } else {
            poly.style.fill = 'gold';
        }
        poly.style.stroke = 'black';
        poly.style.strokeWidth = 3;
        svg.append(poly);
    }
    // Center-left column
    for (i = 0; i < 4; i++) {
        let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        for (value of ppa) {
            let point = svg.createSVGPoint();
            let diffY = i * shortD;
            let diffX = a + halfA; // 39
            point.x = value[0] - diffX;
            point.y = value[1] + 21 + diffY;
            poly.points.appendItem(point);
        }
        poly.style.fill = 'gold';
        poly.style.stroke = 'black';
        poly.style.strokeWidth = 3;
        svg.append(poly);
    }
    // Center-right column
    for (i = 0; i < 4; i++) {
        let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        for (value of ppa) {
            let point = svg.createSVGPoint();
            let diffY = i * shortD;
            let diffX = -(a + halfA); // -39;
            point.x = value[0] - diffX;
            point.y = value[1] + 21 + diffY;
            poly.points.appendItem(point);
        }
        poly.style.fill = 'gold';
        poly.style.stroke = 'black';
        poly.style.strokeWidth = 3;
        svg.append(poly);
    }

    // Left column
    for (i = 0; i < 3; i++) {
        let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        for (value of ppa) {
            let point = svg.createSVGPoint();
            let diffY = i * shortD;
            let diffX = 2 * (a + halfA); // 78;
            point.x = value[0] - diffX;
            point.y = value[1] + 42 + diffY;
            poly.points.appendItem(point);
        }
        poly.style.fill = 'gold';
        poly.style.stroke = 'black';
        poly.style.strokeWidth = 3;
        svg.append(poly);
    }
    // Right column
    for (i = 0; i < 3; i++) {
        let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        for (value of ppa) {
            let point = svg.createSVGPoint();
            let diffY = i * shortD;
            let diffX = -2 * (a + halfA); // -78;
            point.x = value[0] - diffX;
            point.y = value[1] + 42 + diffY;
            poly.points.appendItem(point);
        }
        poly.style.fill = 'gold';
        poly.style.stroke = 'black';
        poly.style.strokeWidth = 3;
        svg.append(poly);
    }
}

function determineTarget(data) {
    let now = Date.now();
    let loop = true;
    let i = 0;
    let target;

    while (loop && i < data.length) {
        let dur;
        let t = data[i];
        if (t['SCHEDULED START TIME']) {
            let dayDiff = t['DURATION'].split("/");
            if (dayDiff[1]) {
                let dayInDiff = dayDiff[1].split(":");
                dur = ((dayDiff[0] * 24 * 3600) + (dayInDiff[0] * 3600) + (dayInDiff[1] * 60) + (dayInDiff[2])) * 10;
            }
            let startTime = new Date(t['SCHEDULED START TIME']);
            let newTime = (startTime.getTime() + dur);
            let endTime = new Date(newTime);
            if ((now > startTime && now < endTime) || (now < startTime && now < endTime)) {
                if (now > startTime && now < endTime) {
                    targetTitle.innerText = "CURRENT TARGET NAME";
                } else {
                    targetTitle.innerText = "NEXT TARGET NAME";
                }
                target = t
                loop = false;
            } else {
                i++;
            }
        }
    }
    buildTargetDisplay(target, now);
}

function buildTargetDisplay(data, now) {

    let target = data;
    if (target) {
        let dayDiff = target['DURATION'].split("/");
        if (dayDiff[1]) {
            let dayInDiff = dayDiff[1].split(":");
            dur = ((dayDiff[0] * 24 * 3600) + (dayInDiff[0] * 3600) + (dayInDiff[1] * 60) + (dayInDiff[2])) * 10;
        }
        d = new Date(target["SCHEDULED START TIME"]);
        let newTime = (d.getTime() + dur);
        let endTime = new Date(newTime);
        
        let elapsed = generateDiffString(now, d);
        let remaining = generateDiffString(endTime, now);
    
        targetName.innerText = target['TARGET NAME'];
        startTimeTimes.innerText = `${d.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} / ${elapsed} / ${remaining}`;
        categoryKeywords.innerText = `${target["CATEGORY"]} / ${target["KEYWORDS"]}`;
    }
}

function generateDiffString(x, y) {
        diff = Math.abs(x - y);
        diff = Math.round(diff / 1000);
        let secs = diff % 60;
        // console.log(`${diff} ${secs}`)
        secs = ('0' + secs).slice(-2);
        diff = Math.floor(diff / 60);
        let mins = diff % 60;
        mins = ('0' + mins).slice(-2);
        diff = Math.floor(diff / 60);
        let hours = diff % 24;
        hours = ('0' + hours).slice(-2);
        return `${hours}h ${mins}m ${secs}s`;
}

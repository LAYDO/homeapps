window.onload = () => {
    let jwst = new JWSTTelescope();
    jwst.init();
}

class JWSTTelescope {
    constructor() {

        this.jwstInfo = document.getElementById('jwstInfo');
        this.jwstDisplay = document.getElementById('jwstDisplay');
        this.jwstLoad = document.getElementById('jwstLoad');
        this.targetTitle = document.getElementById('targetTitle');
        this.timeTitles = document.getElementById('timeTitles');
        this.targetName = document.getElementById('targetName');
        this.iterateTarget = document.getElementById('iterateTarget');
        this.startTimeTimes = document.getElementById('startTimeTimes');
        this.categoryKeywords = document.getElementById('categoryKeywords');
        this.instruments = document.getElementById('instruments');
        this.a = 25;
        this.longD = 2 * this.a;
        this.shortD = Math.sqrt(3) * this.a;
        this.halfA = this.a / 2;
        this.scrollTarget;
    }


    init() {
        let url = `${window.location.href}fetch`;
        console.log(url);
        this.fetchData(url);
    }

    async fetchData(url) {
        fetch(url).then(response => {
            this.toggleLoad(1);
            return response.json();
        }).then(data => {
            setInterval(this.determineTarget.bind(this, data), 1000);
            this.buildJWST();
            this.toggleLoad(0);
            return true;
        }).catch(error => {
            console.error('There has been a problem with your fetch operation: ', error);
            this.buildJWST();
            this.toggleLoad(0);
        });
    }

    toggleLoad(load) {
        if (load) {
            this.jwstDisplay.style.visibility = 'hidden';
        } else {
            this.jwstDisplay.style.visibility = 'visible';
        }
    }


    buildJWST() {
        let svg = document.getElementById('jwstSVG');
        let startX = 100;
        let startY = 1;
        let ppa = [[startX, startY], [startX - this.halfA, startY + (this.shortD / 2)], [startX, startY + this.shortD], [startX + this.a, startY + this.shortD], [startX + (1.5 * this.a), startY + this.a], [startX + this.a, startY]];
        // Center column
        for (let i = 0; i < 5; i++) {
            let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            for (let value of ppa) {
                let point = svg.createSVGPoint();
                let diffY = i * this.shortD;
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
        for (let i = 0; i < 4; i++) {
            let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            for (let value of ppa) {
                let point = svg.createSVGPoint();
                let diffY = i * this.shortD;
                let diffX = this.a + this.halfA; // 39
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
        for (let i = 0; i < 4; i++) {
            let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            for (let value of ppa) {
                let point = svg.createSVGPoint();
                let diffY = i * this.shortD;
                let diffX = -(this.a + this.halfA); // -39;
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
        for (let i = 0; i < 3; i++) {
            let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            for (let value of ppa) {
                let point = svg.createSVGPoint();
                let diffY = i * this.shortD;
                let diffX = 2 * (this.a + this.halfA); // 78;
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
        for (let i = 0; i < 3; i++) {
            let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            for (let value of ppa) {
                let point = svg.createSVGPoint();
                let diffY = i * this.shortD;
                let diffX = -2 * (this.a + this.halfA); // -78;
                point.x = value[0] - diffX;
                point.y = value[1] + 42 + diffY;
                poly.points.appendItem(point);
            }
            poly.style.fill = 'gold';
            poly.style.stroke = 'black';
            poly.style.strokeWidth = 3;
            svg.append(poly);
        }
        document.getElementById('jwstIcon').addEventListener('click', this.scrolls);
    }

    scrolls() {
        let s = document.getElementById('scrollToItem');
        console.log(s);
        if (s) {
            s.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }
    }

    determineTarget(data) {
        let now = Date.now();
        let loop = true;
        let i = 0;
        let target;
        // https://stackoverflow.com/questions/34846814/correct-way-to-break-out-of-if-statement-within-for-loop
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
                    target = t
                    loop = false;
                } else {
                    i++;
                }
            }
        }
        this.buildTable(data, target, now);
        this.buildTargetDisplay(target, now);
    }

    buildTable(data, target, now) {
        let targetHit = false;
        data.forEach(d => {
            let item = document.createElement('div');
            item.classList = 'item';
            let times = document.createElement('div');
            times.classList = 'times';
            let timesDuration = document.createElement('div');
            timesDuration.innerText = d['DURATION'];
            let timesStart = document.createElement('div');
            let tStart = new Date(d['SCHEDULED START TIME']);
            timesStart.innerText = tStart.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
            times.append(timesStart);
            times.append(timesDuration);
            item.append(times);
            let targetDiv = document.createElement('div');
            targetDiv.classList = 'target';
            let targetName = document.createElement('div');
            targetName.innerText = d['TARGET NAME'];
            let targetInstuments = document.createElement('div');
            targetInstuments.innerText = d['SCIENCE INSTRUMENT AND MODE'];
            targetDiv.append(targetName);
            targetDiv.append(targetInstuments);
            item.append(targetDiv);
            if (d == target) {
                item.style.fontWeight = 'bold';
                if (now > tStart && now < this.calculateEndTime(d)) {
                    item.style.background = 'gold';
                }
                item.id = 'scrollToItem';
                targetHit = true;
                this.scrollTarget = item;
            }
            item.style.color = targetHit ? 'black' : '#999999';
            this.iterateTarget.append(item);
        });
    }

    buildTargetDisplay(data, now) {
        let current = false;
        let target = data;
        let dur;
        if (target) {
            let dayDiff = target['DURATION'].split("/");
            if (dayDiff[1]) {
                let dayInDiff = dayDiff[1].split(":");
                dur = ((dayDiff[0] * 24 * 3600) + (dayInDiff[0] * 3600) + (dayInDiff[1] * 60) + (dayInDiff[2])) * 10;
            }
            let d = new Date(target["SCHEDULED START TIME"]);
            let newTime = (d.getTime() + dur);
            let endTime = new Date(newTime);
            let elapsed = this.generateDiffString(now, d);
            let remaining = this.generateDiffString(endTime, now);
            let countdown = this.generateDiffString(d, now);

            if (now > d && now < endTime) {
                this.targetTitle.innerText = "CURRENT TARGET";
                document.getElementById('jwstSVG').classList = 'current';
                current = true;
            } else {
                this.targetTitle.innerText = "NEXT TARGET";
                document.getElementById('jwstSVG').classList = '';
                current = false;
            }

            let noCategories = (target['CATEGORY'] == 'null' && target['KEYWORDS'] == 'null');
            this.startTimeTimes.innerText = `${current ? "STARTED:" : "START:"} ${d.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} \n - ${current ? elapsed : countdown} \n + ${current ? remaining : target['DURATION']}`;
            this.targetName.innerText = target['TARGET NAME'];
            this.categoryKeywords.innerText = noCategories ? `${target["CATEGORY"]} \n ${target["KEYWORDS"]}` : "None provided";
            this.instruments.innerText = `${target["SCIENCE INSTRUMENT AND MODE"]}`;
        }
    }

    generateDiffString(x, y) {
        let diff = Math.abs(x - y);
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

    calculateEndTime(t) {
        let dur;
        let dayDiff = t['DURATION'].split("/");
        if (dayDiff[1]) {
            let dayInDiff = dayDiff[1].split(":");
            dur = ((dayDiff[0] * 24 * 3600) + (dayInDiff[0] * 3600) + (dayInDiff[1] * 60) + (dayInDiff[2])) * 10;
        }
        let startTime = new Date(t['SCHEDULED START TIME']);
        let newTime = (startTime.getTime() + dur);
        return new Date(newTime);

    }
}
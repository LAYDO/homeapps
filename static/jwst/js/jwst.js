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
        this.targetNode;
    }


    init() {
        let url = `${window.location.href}fetch`;
        this.buildJWST();
        this.fetchData(url);
    }

    fetchData(url) {
        fetch(url).then(response => {
            this.toggleLoad(1);
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        }).then(data => {
            // console.log(data);
            this.buildTable(data);
            setInterval(this.determineTarget.bind(this, data), 1000);
            this.toggleLoad(0);
        }).catch(error => {
            console.error('There has been a problem with your fetch operation: ', error);
            this.toggleLoad(0);
        });
    }

    buildJWST() {
        let svg = document.getElementById('jwstSVG');
        let startX = 100;
        let startY = 1;
        let ppa = [[startX, startY], [startX - this.halfA, startY + (this.shortD / 2)], [startX, startY + this.shortD], [startX + this.a, startY + this.shortD], [startX + (1.5 * this.a), startY + this.a], [startX + this.a, startY]];
        for (let i = 0; i < 19; i++) {
            let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            let diffX;
            let diffY;
            for (let value of ppa) {
                let point = svg.createSVGPoint();
                switch (i) {
                    case 0:
                    case 1:
                    case 2:
                        diffY = i * this.shortD;
                        diffX = 2 * (this.a + this.halfA); // 78;
                        point.y = value[1] + 42 + diffY;
                        break;
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        diffY = (i - 3) * this.shortD;
                        diffX = this.a + this.halfA; // 39
                        point.y = value[1] + 21 + diffY;
                        break;
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        diffY = (i - 7) * this.shortD;
                        diffX = 0;
                        point.y = value[1] + diffY;
                        break;
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                        diffY = (i - 12) * this.shortD;
                        diffX = -(this.a + this.halfA); // -39;
                        point.y = value[1] + 21 + diffY;
                        break;
                    case 16:
                    case 17:
                    case 18:
                        diffY = (i - 16) * this.shortD;
                        diffX = -2 * (this.a + this.halfA); // -78;
                        point.y = value[1] + 42 + diffY;
                        break;
                }
                point.x = value[0] - diffX;
                poly.points.appendItem(point);
            }
            poly.id = `tile${i}`;
            if (i == 9) {
                poly.style.fill = 'transparent';
            } else {
                poly.style.fill = 'gold';
            }
            poly.style.stroke = 'black';
            poly.style.strokeWidth = 3;
            svg.append(poly);

        }
        document.getElementById('jwstIcon').addEventListener('click', this.scrolls);
    }

    toggleLoad(load) {
        // while (load) {
        //     let i = Math.floor(Math.random() * 20);
        //     let tile = document.getElementById(`tile${i}`);
        //     if (tile) {
        //         tile.classList = 'current';
        //     }
        // }
        if (load) {
            this.jwstDisplay.style.visibility = 'hidden';
        } else {
            this.jwstDisplay.style.visibility = 'visible';
        }
    }

    scrolls() {
        let s = document.getElementsByClassName('scrollToItem');
        // console.log(s);
        if (s && s.length == 1) {
            s[0].scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }
    }

    async determineTarget(data) {
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
                    this.targetNode = i;
                    this.scrollTarget = t;
                    loop = false;
                } else {
                    i++;
                }
            }
        }
        this.buildTargetDisplay(target, now);
        this.formatTable(data, target, now);
    }

    buildTable(data) {
        data.forEach((d, idx) => {
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
            item.id = `target${("00" + idx).slice(-3)}`;
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
            this.categoryKeywords.innerText = !noCategories ? `${target["CATEGORY"]} \n ${target["KEYWORDS"]}` : "None provided";
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

    formatTable(data, target, now) {
        now = new Date(now);
        let targetHit = false;
        for (let i = 0; i < data.length; i++) {
            let tth = document.getElementById(`target${("00" + i).slice(-3)}`);
            let tStart = new Date(data[i]['SCHEDULED START TIME']);
            tth.classList.remove('scrollToItem');
            tth.style.background = 'white';
            tth.style.fontWeight = 'normal';
            if (data[i] == target) {
                if (!tth.classList.contains('scrollToItem')) {
                    tth.classList.add('scrollToItem');
                }
                if (now > tStart && now < this.calculateEndTime(data[i])) {
                    tth.style.background = 'gold';
                }
                tth.style.fontWeight = 'bold';
                targetHit = true;
            }
            tth.style.color = targetHit ? 'black' : '#999999';
        }
    }
}
// ============================================================
// VEDIC ASTROLOGY ENGINE
// ============================================================

// Ayanamsa (Lahiri) - Indian Astronomical Ephemeris official formula
function getAyanamsa(jd) {
    const T = (jd - 2451545.0) / 36525.0;
    const prec = 5029.0966 * T + 1.11113 * T * T - 0.000006 * T * T * T;
    return 23.86325 + prec / 3600.0;
}

// Zodiac signs
const SIGNS = ['牡羊座','牡牛座','双子座','蟹座','獅子座','乙女座',
               '天秤座','蠍座','射手座','山羊座','水瓶座','魚座'];
const SIGNS_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

// Planets
const PLANETS = [
    { id: 'Sun', name: '太陽', symbol: '☉', natural: 'malefic' },
    { id: 'Moon', name: '月', symbol: '☽', natural: 'benefic' },
    { id: 'Mars', name: '火星', symbol: '♂', natural: 'malefic' },
    { id: 'Mercury', name: '水星', symbol: '☿', natural: 'neutral' },
    { id: 'Jupiter', name: '木星', symbol: '♃', natural: 'benefic' },
    { id: 'Venus', name: '金星', symbol: '♀', natural: 'benefic' },
    { id: 'Saturn', name: '土星', symbol: '♄', natural: 'malefic' },
];

// Nakshatras (27 lunar mansions)
const NAKSHATRAS = [
    { name: 'Ashwini', ko: 'アシュヴィニー', ruler: 'Ketu', meaning: '馬の双子', deity: 'Ashwini Kumaras', desc: '癒しと新しい始まりのエネルギー。素早い行動力と治癒能力を持つ人。' },
    { name: 'Bharani', ko: 'バラニー', ruler: 'Venus', meaning: '耐える者', deity: 'Yama', desc: '生と死の循環。強い忍耐力と変化を導く力。' },
    { name: 'Krittika', ko: 'クリッティカー', ruler: 'Sun', meaning: '切断する者', deity: 'Agni', desc: '火の力と浄化。鋭い知性と決断力。' },
    { name: 'Rohini', ko: 'ローヒニー', ruler: 'Moon', meaning: '赤い星', deity: 'Brahma', desc: '豊穣と美の星。創造的で魅力的な性格。' },
    { name: 'Mrigashira', ko: 'ムリガシラー', ruler: 'Mars', meaning: '鹿の頭', deity: 'Soma', desc: '探求と好奇心の星。絶えず真理を追求する旅人。' },
    { name: 'Ardra', ko: 'アールドラー', ruler: 'Rahu', meaning: '涙のしずく', deity: 'Rudra', desc: '嵐と破壊の中の再生。激しい感情と変革の力。' },
    { name: 'Punarvasu', ko: 'プナルヴァス', ruler: 'Jupiter', meaning: '光の帰還', deity: 'Aditi', desc: '回復と帰還の星。楽観的で知恵深い性格。' },
    { name: 'Pushya', ko: 'プシュヤ', ruler: 'Saturn', meaning: '養育する者', deity: 'Brihaspati', desc: '最も吉兆なナクシャトラ。養育、保護、繁栄のエネルギー。' },
    { name: 'Ashlesha', ko: 'アーシュレーシャー', ruler: 'Mercury', meaning: '巻きつく者', deity: 'Nagas', desc: '蛇の知恵と神秘。洞察力と深い直観。' },
    { name: 'Magha', ko: 'マガー', ruler: 'Ketu', meaning: '偉大な', deity: 'Pitris', desc: '王族の星。権威、尊敬、祖先の祝福。' },
    { name: 'Purva Phalguni', ko: 'プールヴァ・パルグニー', ruler: 'Venus', meaning: '前の果実', deity: 'Bhaga', desc: '喜びと愛の星。芸術的感覚とロマンス。' },
    { name: 'Uttara Phalguni', ko: 'ウッタラ・パルグニー', ruler: 'Sun', meaning: '後の果実', deity: 'Aryaman', desc: '友情と契約の星。信頼と献身。' },
    { name: 'Hasta', ko: 'ハスタ', ruler: 'Moon', meaning: '手', deity: 'Savitar', desc: '手先の器用さと技術の星。癒す手、芸術家。' },
    { name: 'Chitra', ko: 'チトラー', ruler: 'Mars', meaning: '輝く宝石', deity: 'Vishwakarma', desc: '美と創造の星。優れた美的感覚。' },
    { name: 'Swati', ko: 'スヴァーティー', ruler: 'Rahu', meaning: '独立した', deity: 'Vayu', desc: '風の自由さ。独立的で柔軟な性格。' },
    { name: 'Vishakha', ko: 'ヴィシャーカー', ruler: 'Jupiter', meaning: '二又の', deity: 'Indra-Agni', desc: '目標と決断の星。強い集中力と意志。' },
    { name: 'Anuradha', ko: 'アヌラーダー', ruler: 'Saturn', meaning: 'ラーダに従う', deity: 'Mitra', desc: '友情と献身の星。組織力とリーダーシップ。' },
    { name: 'Jyeshtha', ko: 'ジェーシュター', ruler: 'Mercury', meaning: '最年長', deity: 'Indra', desc: '保護と権威の星。強い責任感。' },
    { name: 'Mula', ko: 'ムーラ', ruler: 'Ketu', meaning: '根', deity: 'Nirriti', desc: '破壊と再建の星。真実の根源を探す者。' },
    { name: 'Purva Ashadha', ko: 'プールヴァ・アーシャーダー', ruler: 'Venus', meaning: '前の無敵', deity: 'Apas', desc: '水の力と浄化。潜在する勝利のエネルギー。' },
    { name: 'Uttara Ashadha', ko: 'ウッタラ・アーシャーダー', ruler: 'Sun', meaning: '後の無敵', deity: 'Vishvedevas', desc: '最終的な勝利の星。忍耐とリーダーシップ。' },
    { name: 'Shravana', ko: 'シュラヴァナ', ruler: 'Moon', meaning: '聞く者', deity: 'Vishnu', desc: '知識と傾聴の星。学習とコミュニケーションの達人。' },
    { name: 'Dhanishta', ko: 'ダニシュター', ruler: 'Mars', meaning: '最も裕福な', deity: 'Vasus', desc: '豊穣と音楽の星。才能と繁栄。' },
    { name: 'Shatabhisha', ko: 'シャタビシャー', ruler: 'Rahu', meaning: '百人の治療師', deity: 'Varuna', desc: '秘密と癒しの星。神秘的な治癒能力。' },
    { name: 'Purva Bhadrapada', ko: 'プールヴァ・バードラパダー', ruler: 'Jupiter', meaning: '前の幸運の足', deity: 'Aja Ekapada', desc: '火と変革の星。霊的覚醒。' },
    { name: 'Uttara Bhadrapada', ko: 'ウッタラ・バードラパダー', ruler: 'Saturn', meaning: '後の幸運の足', deity: 'Ahir Budhnya', desc: '深い海の知恵。瞑想と霊的深み。' },
    { name: 'Revati', ko: 'レーヴァティー', ruler: 'Mercury', meaning: '裕福な', deity: 'Pushan', desc: '旅と保護の星。すべての完成。' },
];

// Dasha periods (years)
const DASHA_YEARS = {
    'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
    'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
};
const DASHA_ORDER = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
const DASHA_KO = {
    'Ketu': 'ケートゥ', 'Venus': '金星', 'Sun': '太陽', 'Moon': '月', 'Mars': '火星',
    'Rahu': 'ラーフ', 'Jupiter': '木星', 'Saturn': '土星', 'Mercury': '水星'
};

// South Indian chart house layout (fixed signs)
// Grid positions: [row][col] → sign index
const SI_LAYOUT = [
    [11, 0, 1, 2],
    [10, -1, -1, 3],
    [9, -1, -1, 4],
    [8, 7, 6, 5]
];

// ── Form Initialization ──
function initForm() {
    const yearSel = document.getElementById('birthYear');
    const monthSel = document.getElementById('birthMonth');
    const daySel = document.getElementById('birthDay');
    const hourSel = document.getElementById('birthHour');
    const minSel = document.getElementById('birthMinute');

    // Year: 1940~2025
    for (let y = 2025; y >= 1940; y--) {
        const opt = document.createElement('option');
        opt.value = y; opt.textContent = y;
        if (y === 1995) opt.selected = true;
        yearSel.appendChild(opt);
    }
    // Month: 1~12
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    for (let m = 1; m <= 12; m++) {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = monthNames[m-1];
        if (m === 3) opt.selected = true;
        monthSel.appendChild(opt);
    }
    // Day: 1~31
    for (let d = 1; d <= 31; d++) {
        const opt = document.createElement('option');
        opt.value = d; opt.textContent = d;
        if (d === 15) opt.selected = true;
        daySel.appendChild(opt);
    }
    // Hour: 12, 1~11
    [12,1,2,3,4,5,6,7,8,9,10,11].forEach(h => {
        const opt = document.createElement('option');
        opt.value = h; opt.textContent = h + ':00';
        if (h === 10) opt.selected = true;
        hourSel.appendChild(opt);
    });
    // Minute: 00, 01, 02, ... 59 (1min)
    for (let m = 0; m < 60; m += 1) {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = String(m).padStart(2,'0');
        if (m === 30) opt.selected = true;
        minSel.appendChild(opt);
    }
}

function toggleTimeUnknown() {
    const sel = document.getElementById('birthTimeUnknown');
    const disabled = sel.value === 'unknown';
    document.getElementById('birthAmpm').disabled = disabled;
    document.getElementById('birthHour').disabled = disabled;
    document.getElementById('birthMinute').disabled = disabled;
    if (disabled) {
        document.getElementById('birthAmpm').style.opacity = '0.4';
        document.getElementById('birthHour').style.opacity = '0.4';
        document.getElementById('birthMinute').style.opacity = '0.4';
    } else {
        document.getElementById('birthAmpm').style.opacity = '1';
        document.getElementById('birthHour').style.opacity = '1';
        document.getElementById('birthMinute').style.opacity = '1';
    }
}

function getBirthDateTime() {
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);

    let hour, minute;
    if (document.getElementById('birthTimeUnknown').value === 'unknown') {
        hour = 12; minute = 0; // Noon default
    } else {
        hour = parseInt(document.getElementById('birthHour').value);
        const ampm = document.getElementById('birthAmpm').value;
        if (ampm === 'pm' && hour !== 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;
        minute = parseInt(document.getElementById('birthMinute').value);
    }
    return { year, month, day, hour, minute };
}

function onCityChange() {
    const sel = document.getElementById('birthCity');
    const customDiv = document.getElementById('customLatLng');
    if (sel.value === 'custom') {
        customDiv.style.display = 'block';
    } else {
        customDiv.style.display = 'none';
    }
}

function getLatLng() {
    const sel = document.getElementById('birthCity');
    if (sel.value === 'custom') {
        return {
            lat: parseFloat(document.getElementById('birthLat').value) || 37.57,
            lng: parseFloat(document.getElementById('birthLng').value) || 126.98,
            tz: parseFloat(document.getElementById('birthTz') ? document.getElementById('birthTz').value : 9) || 9
        };
    }
    const parts = sel.value.split(',').map(Number);
    return { lat: parts[0], lng: parts[1], tz: parts[2] || 0 };
}

// Initialize form on page load
initForm();

function toJulianDate(date) {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes()/60) / 24;

    let Y = y, M = m;
    if (M <= 2) { Y -= 1; M += 12; }
    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}

function getPlanetPosition(planetId, date) {
    try {
        if (planetId === 'Moon') {
            return Astronomy.EclipticGeoMoon(date).lon;
        } else if (planetId === 'Sun') {
            const vec = Astronomy.GeoVector('Sun', date, true);
            return Astronomy.Ecliptic(vec).elon;
        } else {
            const vec = Astronomy.GeoVector(planetId, date, true); return Astronomy.Ecliptic(vec).elon;
        }
    } catch (e) {
        console.error('Planet calc error:', planetId, e);
        return 0;
    }
}

function calculateChart() {
    const { lat, lng, tz } = getLatLng();
    const birth = getBirthDateTime();
    const { year, month, day, hour, minute } = birth;

    // Convert local birth time to UTC using city timezone offset
    // Korean DST correction: 1987 (May 10~Oct 11), 1988 (May 8~Oct 9) used UTC+10
    let effectiveTz = tz;
    if (tz === 9) {
        const md = month * 100 + day;
        if (year === 1987 && md >= 510 && md <= 1011) effectiveTz = 10;
        if (year === 1988 && md >= 508 && md <= 1009) effectiveTz = 10;
    }
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour - effectiveTz, minute, 0));
    const astroDate = Astronomy.MakeTime(utcDate);
    const jd = toJulianDate(utcDate);
    const ayanamsa = getAyanamsa(jd);

    // Calculate planet positions (sidereal)
    const positions = [];
    PLANETS.forEach(planet => {
        let tropicalLon = getPlanetPosition(planet.id, astroDate);
        let siderealLon = (tropicalLon - ayanamsa + 360) % 360;
        let signIdx = Math.floor(siderealLon / 30);
        let degree = siderealLon % 30;
        let nakshatraIdx = Math.floor(siderealLon / (360/27));

        positions.push({
            ...planet,
            tropical: tropicalLon,
            sidereal: siderealLon,
            sign: signIdx,
            degree: degree,
            nakshatra: nakshatraIdx,
            nakshatraPada: Math.floor((siderealLon % (360/27)) / (360/108)) + 1
        });
    });

    // Calculate Rahu/Ketu (Mean Lunar Nodes)
    // Mean ascending node formula from Meeus "Astronomical Algorithms"
    {
        const T = (jd - 2451545.0) / 36525;
        let rahuTropical = 125.0446 - 1934.1363 * T + 0.0021 * T * T + T * T * T / 467441;
        rahuTropical = ((rahuTropical % 360) + 360) % 360;
        const rahuSidereal = ((rahuTropical - ayanamsa) % 360 + 360) % 360;
        const ketuSidereal = (rahuSidereal + 180) % 360;
        positions.push({
            id: 'Rahu', name: 'Rahu', symbol: '☊', natural: 'malefic',
            sidereal: rahuSidereal, sign: Math.floor(rahuSidereal / 30),
            degree: rahuSidereal % 30, nakshatra: Math.floor(rahuSidereal / (360/27)),
            nakshatraPada: Math.floor((rahuSidereal % (360/27)) / (360/108)) + 1
        });
        positions.push({
            id: 'Ketu', name: 'Ketu', symbol: '☋', natural: 'malefic',
            sidereal: ketuSidereal, sign: Math.floor(ketuSidereal / 30),
            degree: ketuSidereal % 30, nakshatra: Math.floor(ketuSidereal / (360/27)),
            nakshatraPada: Math.floor((ketuSidereal % (360/27)) / (360/108)) + 1
        });
    }

    // Ascendant (Lagna) - proper calculation with latitude
    const T = (jd - 2451545.0) / 36525;
    const obliquity = (23.4392911 - 0.0130042 * T - 0.00000164 * T*T) * Math.PI / 180;
    const gmst = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T*T) % 360;
    const lst = (gmst + lng + 360) % 360;
    const ramcRad = lst * Math.PI / 180;
    const latRad = lat * Math.PI / 180;
    const ascRad = Math.atan2(Math.cos(ramcRad), -(Math.sin(ramcRad) * Math.cos(obliquity) + Math.tan(latRad) * Math.sin(obliquity)));
    let lagnaTopical = (ascRad * 180 / Math.PI + 360) % 360;
    const lagnaSidereal = (lagnaTopical - ayanamsa + 360) % 360;
    const lagnaSign = Math.floor(lagnaSidereal / 30);

    // Moon's nakshatra for dasha
    const moonPos = positions.find(p => p.id === 'Moon');
    const moonNakshatra = moonPos ? moonPos.nakshatra : 0;

    // Render everything
    renderPlanetTable(positions, lagnaSign, lagnaSidereal);
    renderD1Chart(positions, lagnaSign);
    renderD9Chart(positions, lagnaSign, lagnaSidereal);
    renderDivisionalChart(positions, lagnaSidereal, 10, 'd10Chart', 'd10InterpWrap', 'D10', 'ダシャムシャ');
    renderDivisionalChart(positions, lagnaSidereal, 7, 'd7Chart', 'd7InterpWrap', 'D7', 'サプタムシャ');
    renderDivisionalChart(positions, lagnaSidereal, 12, 'd12Chart', 'd12InterpWrap', 'D12', 'ドワダシャムシャ');
    renderDivisionalChart(positions, lagnaSidereal, 60, 'd60Chart', 'd60InterpWrap', 'D60', 'シャシュティアムシャ');
    renderDivisionalChart(positions, lagnaSidereal, 2, 'd2Chart', 'd2InterpWrap', 'D2', 'ホーラ');
    renderDivisionalChart(positions, lagnaSidereal, 3, 'd3Chart', 'd3InterpWrap', 'D3', 'ドレッカナ');
    renderDivisionalChart(positions, lagnaSidereal, 4, 'd4Chart', 'd4InterpWrap', 'D4', 'チャトゥルタムシャ');
    renderDivisionalChart(positions, lagnaSidereal, 16, 'd16Chart', 'd16InterpWrap', 'D16', 'ショーダシャムシャ');
    renderDivisionalChart(positions, lagnaSidereal, 20, 'd20Chart', 'd20InterpWrap', 'D20', 'ヴィムシャムシャ');
    renderDivisionalChart(positions, lagnaSidereal, 24, 'd24Chart', 'd24InterpWrap', 'D24', 'チャトゥルヴィムシャムシャ');
    renderDivisionalChart(positions, lagnaSidereal, 27, 'd27Chart', 'd27InterpWrap', 'D27', 'サプタヴィムシャムシャ');
    renderDivisionalChart(positions, lagnaSidereal, 30, 'd30Chart', 'd30InterpWrap', 'D30', 'トリムシャムシャ');
    renderDivisionalChart(positions, lagnaSidereal, 40, 'd40Chart', 'd40InterpWrap', 'D40', 'カヴェダムシャ');
    renderDivisionalChart(positions, lagnaSidereal, 45, 'd45Chart', 'd45InterpWrap', 'D45', 'アクシャヴェダムシャ');
    renderNakshatra(moonPos);
    renderDasha(moonNakshatra, utcDate, moonPos ? moonPos.sidereal : 0);
    renderInterpretation(positions, lagnaSign, moonPos);
    renderPlanetHouse(positions, lagnaSign);
    renderEducation(positions, lagnaSign);
    renderChildren(positions, lagnaSign);
    renderForeign(positions, lagnaSign);
    renderDignity(positions, lagnaSign);
    renderLucky(lagnaSign, moonPos);
    renderRemedy(positions, lagnaSign);

    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

function renderPlanetTable(positions, lagnaSign, lagnaSidereal) {
    let html = '<table class="planet-table"><thead><tr>';
    html += '<th>Planet</th><th>Sign</th><th>Degree</th><th>Nakshatra</th><th>House</th>';
    html += '</tr></thead><tbody>';

    // Add Lagna first with exact degree
    const lagnaDeg = lagnaSidereal % 30;
    const lagnaNakIdx = Math.floor(lagnaSidereal / (360/27));
    const lagnaNak = NAKSHATRAS[lagnaNakIdx] || {name:"-"};
    html += `<tr><td>⬆ ASC</td><td>${SIGN_SYMBOLS[lagnaSign]} ${SIGNS[lagnaSign]}</td><td>${lagnaDeg.toFixed(1)}°</td><td>${lagnaNak.name}</td><td>1</td></tr>`;

    positions.forEach(p => {
        const house = ((p.sign - lagnaSign + 12) % 12) + 1;
        const nak = NAKSHATRAS[p.nakshatra] || { ko: '-', name: '-' };
        const roleMap = { Sun:'自我・権威', Moon:'感情・心', Mars:'エネルギー・勇気', Mercury:'知性・コミュニケーション', Jupiter:'Luck/Wisdom', Venus:'愛・魅力', Saturn:'忍耐・責任', Rahu:'欲望・革新', Ketu:'霊性・解脱' };
        const houseArea = ['','Self','Money/Family','Communication','Home','Children/Romance','Health','Spouse','Transformation','Luck/Foreign','Career','Income','Foreign/Spirituality'];
        html += `<tr>
            <td>${p.symbol} ${p.name}<br><span style="color:#666;font-size:10px;">${roleMap[p.id]||''}</span></td>
            <td>${SIGN_SYMBOLS[p.sign]} ${SIGNS[p.sign]}</td>
            <td>${p.degree.toFixed(1)}°</td>
            <td>${nak.name}</td>
            <td>${house}${house===1?'st':house===2?'nd':house===3?'rd':'th'}<br><span style="color:#666;font-size:10px;">${houseArea[house]||''}</span></td>
        </tr>`;
    });

    html += '</tbody></table>';
    document.getElementById('planetTableWrap').innerHTML = html;
}

function renderD1Chart(positions, lagnaSign) {
    const grid = document.getElementById('d1Chart');
    grid.innerHTML = '';

    // Place planets in signs
    const signPlanets = {};
    for (let i = 0; i < 12; i++) signPlanets[i] = [];
    positions.forEach(p => {
        signPlanets[p.sign].push(p);
    });

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement('div');
            const signIdx = SI_LAYOUT[row][col];

            if (signIdx === -1) {
                cell.className = 'chart-cell empty';
                cell.innerHTML = row === 1 && col === 1 ? '<div style="color:#c9a84c;font-size:10px;">D1<br>Rasi</div>' : '';
            } else {
                cell.className = 'chart-cell';
                const house = ((signIdx - lagnaSign + 12) % 12) + 1;
                cell.innerHTML = `<span class="house-num">${house}/${SIGN_SYMBOLS[signIdx]}</span>`;

                if (signIdx === lagnaSign) {
                    cell.innerHTML += '<span style="color:#c9a84c;font-size:10px;">Asc</span>';
                }

                signPlanets[signIdx].forEach(p => {
                    const cls = p.natural === 'benefic' ? 'benefic' : (p.natural === 'malefic' ? 'malefic' : '');
                    cell.innerHTML += `<span class="planet ${cls}">${p.symbol}</span>`;
                });
            }

            grid.appendChild(cell);
        }
    }
}

function getNavamsaSign(siderealLon) {
    const sign = Math.floor(siderealLon / 30);
    const degInSign = siderealLon % 30;
    const pada = Math.floor(degInSign / (30/9));
    const element = sign % 4;
    const startSign = [0, 9, 6, 3][element];
    return (startSign + pada) % 12;
}

function renderD9Chart(positions, lagnaSign, lagnaSidereal) {
    const d9LagnaSign = getNavamsaSign(lagnaSidereal);
    const d9Positions = positions.map(p => ({...p, d9Sign: getNavamsaSign(p.sidereal)}));

    const grid = document.getElementById('d9Chart');
    grid.innerHTML = '';
    const signPlanets = {};
    for (let i = 0; i < 12; i++) signPlanets[i] = [];
    d9Positions.forEach(p => { signPlanets[p.d9Sign].push(p); });

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement('div');
            const signIdx = SI_LAYOUT[row][col];
            if (signIdx === -1) {
                cell.className = 'chart-cell empty';
                cell.innerHTML = '<div style="font-size:11px;color:#444;text-align:center;">D9<br>Navamsa</div>';
            } else {
                cell.className = 'chart-cell';
                let content = `<div class="sign-label">${SIGN_SYMBOLS[signIdx]} ${SIGNS[signIdx]}</div>`;
                if (signIdx === d9LagnaSign) content += '<div class="lagna-marker">ASC</div>';
                signPlanets[signIdx].forEach(p => {
                    const cls = (p.natural === 'malefic') ? 'planet malefic' : 'planet benefic';
                    content += `<div class="${cls}">${p.symbol}</div>`;
                });
                cell.innerHTML = content;
            }
            grid.appendChild(cell);
        }
    }
    renderD9Interpretation(d9Positions, d9LagnaSign, lagnaSign);
}

function renderD9Interpretation(d9Positions, d9LagnaSign, d1LagnaSign) {
    const SIGN_RULERS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
    const RULER_NAMES = {Sun:'Sun',Moon:'Moon',Mars:'Mars',Mercury:'Mercury',Jupiter:'Jupiter',Venus:'Venus',Saturn:'Saturn',Rahu:'Rahu',Ketu:'Ketu'};

    function d9HouseOf(signIdx) { return ((signIdx - d9LagnaSign + 12) % 12) + 1; }
    function d9PlanetsInHouse(h) { return d9Positions.filter(p => d9HouseOf(p.d9Sign) === h); }

    const d9H7Sign = (d9LagnaSign + 6) % 12;
    const d9H7Ruler = SIGN_RULERS[d9H7Sign];
    const d9H7Planets = d9PlanetsInHouse(7);
    const d9H10Sign = (d9LagnaSign + 9) % 12;
    const d9H10Ruler = SIGN_RULERS[d9H10Sign];
    const d9H10Planets = d9PlanetsInHouse(10);
    const d9H4Sign = (d9LagnaSign + 3) % 12;
    const d9H4Ruler = SIGN_RULERS[d9H4Sign];
    const d9H4Planets = d9PlanetsInHouse(4);
    const d9H1Planets = d9PlanetsInHouse(1);

    const careerBySgn = [
        'Leadership, military, sports, entrepreneurship (fire pioneer)',
        'Finance, agriculture, arts, real estate, food (stability & material)',
        'Communication, media, writing, teaching, marketing (intellectual)',
        'Nursing, caregiving, cooking, hospitality, counseling (emotional care)',
        'Politics, entertainment, leadership, creativity (shining stage)',
        'Medicine, accounting, analysis, editing, health/wellness (precise service)',
        'Law, diplomacy, design, fashion, mediation (balance & beauty)',
        'Research, investigation, medicine, occult, psychology (depth & transformation)',
        'Education, travel, philosophy, religion, publishing (expansion & exploration)',
        'Government, construction, management, CEO, organizational leader (system & authority)',
        'Technology, IT, invention, social activism, science (innovation)',
        'Arts, spirituality, healing, music, charity (transcendence & service)'
    ];

    const planetCareer = {
        Sun: 'Government official, politician, doctor, CEO — authoritative positions',
        Moon: 'Nurse, counselor, chef, hospitality — caregiving/emotional roles',
        Mars: 'Military, police, surgeon, engineer, athlete',
        Mercury: 'Writer, teacher, programmer, accountant, merchant',
        Jupiter: 'Professor, judge, religious leader, consultant, senior professional',
        Venus: 'Designer, actor, musician, fashion, beauty industry',
        Saturn: 'Construction, mining, agriculture, management, craftsman',
        Rahu: 'IT, foreign-related, unconventional careers, research',
        Ketu: 'Spirituality, alternative medicine, research, ascetic'
    };

    let html = '';

    html += `<div class="interp-card">
        <div class="interp-title">🕉️ D9 Lagna — You After Marriage: ${SIGNS[d9LagnaSign]} ${SIGN_SYMBOLS[d9LagnaSign]}</div>
        <div class="interp-text">
            Navamsa Lagna is in <strong>${SIGNS[d9LagnaSign]}</strong>. This reveals your true self after marriage and in the second half of life (after 30s).
            ${d9LagnaSign === d1LagnaSign ? '<br><br><strong>D1 and D9 Lagna are in the same sign!</strong> This is called <strong>Vargottama</strong> — extremely powerful. Your essence remains unchanged after marriage, inner and outer self are aligned.' : ''}
            ${d9H1Planets.length > 0 ? '<br><br><strong>Planets in D9 1st house:</strong> ' + d9H1Planets.map(p => p.symbol + ' ' + p.name).join(', ') + ' — These planets strongly influence your personality after marriage.' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">💍 D9 7th House — Spouse Character: ${SIGNS[d9H7Sign]} ${SIGN_SYMBOLS[d9H7Sign]}</div>
        <div class="interp-text">
            Navamsa 7th house is in <strong>${SIGNS[d9H7Sign]}</strong>, ruled by <strong>${RULER_NAMES[d9H7Ruler]}</strong>.<br><br>
            This reveals your spouse's core personality — someone with the energy of ${SIGNS[d9H7Sign]}.
            ${d9H7Planets.length > 0 ? '<br><br><strong>Planets in D9 7th house:</strong><br>' + d9H7Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${p.natural === 'benefic' ? 'Benefic! You receive positive energy from your spouse.' : 'Malefic — challenges in marriage, but also opportunities for growth.'}`).join('<br>') : '<br><br>No planets in 7th house — the position of the 7th lord matters more.'}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">💼 D9 10th House — Life Purpose (Dharma): ${SIGNS[d9H10Sign]} ${SIGN_SYMBOLS[d9H10Sign]}</div>
        <div class="interp-text">
            Navamsa 10th house is in <strong>${SIGNS[d9H10Sign]}</strong>, ruled by <strong>${RULER_NAMES[d9H10Ruler]}</strong>.<br><br>
            While D1's 10th shows your career, D9's 10th reveals your <strong>greater life purpose (Dharma)</strong> — the true calling you pursue after maturity.<br><br>
            <strong>Direction of purpose:</strong> ${careerBySgn[d9H10Sign]}
            ${d9H10Planets.length > 0 ? '<br><br><strong>Planets in D9 10th house:</strong><br>' + d9H10Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${planetCareer[p.id] || 'Unique career energy'}`).join('<br>') : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">👔 Spouse Career — Derived 10th (D9 4th House): ${SIGNS[d9H4Sign]} ${SIGN_SYMBOLS[d9H4Sign]}</div>
        <div class="interp-text">
            <strong>Derived house principle:</strong> The 10th from 7th (spouse) = D9's 4th house shows your spouse's career/social activity.<br><br>
            D9 4th house is in <strong>${SIGNS[d9H4Sign]}</strong>, ruled by <strong>${RULER_NAMES[d9H4Ruler]}</strong>.<br><br>
            <strong>Spouse career tendency:</strong> ${careerBySgn[d9H4Sign]}
            ${d9H4Planets.length > 0 ? '<br><br><strong>Planets in D9 4th (spouse 10th):</strong><br>' + d9H4Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: Spouse likely works in ${planetCareer[p.id] || 'specialized field'}`).join('<br>') : ''}
        </div>
    </div>`;

    const vargottamaPlanets = d9Positions.filter(p => p.sign === p.d9Sign);
    if (vargottamaPlanets.length > 0) {
        html += `<div class="interp-card">
            <div class="interp-title">⭐ Vargottama Planets — Exceptionally Strong</div>
            <div class="interp-text">
                Planets in the same sign in both D1 and D9 are called <strong>Vargottama</strong>. These are very powerful, their energy acts consistently throughout life.<br><br>
                ${vargottamaPlanets.map(p => `<strong>${p.symbol} ${p.name}</strong>: In ${SIGNS[p.sign]} in both D1 and D9 — exceptionally strong energy!`).join('<br>')}
            </div>
        </div>`;
    }

    // 6. Spouse Direction — 6 Indicator Combined Analysis
    const DIRECTIONS = {
        0:'East', 1:'South', 2:'West', 3:'North',
        4:'East', 5:'South', 6:'West', 7:'North',
        8:'East', 9:'South', 10:'West', 11:'North'
    };
    const DIR_DETAIL = {
        0:'East (Aries — fire)',1:'South (Taurus — earth)',2:'West (Gemini — air)',3:'North (Cancer — water)',
        4:'East (Leo — fire)',5:'South (Virgo — earth)',6:'West (Libra — air)',7:'North (Scorpio — water)',
        8:'East (Sagittarius — fire)',9:'South (Capricorn — earth)',10:'West (Aquarius — air)',11:'North (Pisces — water)'
    };

    function calcArudha(houseNum, lagnaS, pos) {
        const houseSign = (lagnaS + houseNum - 1) % 12;
        const ruler = SIGN_RULERS[houseSign];
        const rulerPlanet = pos.find(p => p.id === ruler);
        if (!rulerPlanet) return houseSign;
        const rulerSign = rulerPlanet.sign;
        const dist = ((rulerSign - houseSign) + 12) % 12;
        let arudhaSign = (rulerSign + dist) % 12;
        if (arudhaSign === houseSign || arudhaSign === (houseSign + 6) % 12) {
            arudhaSign = (houseSign + 9) % 12;
        }
        return arudhaSign;
    }

    const d1Positions = d9Positions;
    const ulSign = calcArudha(12, d1LagnaSign, d1Positions);
    const a7Sign = calcArudha(7, d1LagnaSign, d1Positions);
    const d1H7Sign = (d1LagnaSign + 6) % 12;

    const d9H7RulerPlanet = d9Positions.find(p => p.id === d9H7Ruler);
    const d9H7RulerSign = d9H7RulerPlanet ? d9H7RulerPlanet.d9Sign : d9H7Sign;
    const venusD9 = d9Positions.find(p => p.id === 'Venus');
    const venusD9Sign = venusD9 ? venusD9.d9Sign : 0;

    const dirSources = [
        {name:'D1 7th House', sign: d1H7Sign, desc:'Spouse house in birth chart'},
        {name:'D9 7th House', sign: d9H7Sign, desc:'Spouse house in Navamsa'},
        {name:'D9 7th Lord', sign: d9H7RulerSign, desc:'Where the D9 7th lord goes'},
        {name:'D9 Venus', sign: venusD9Sign, desc:'Spouse karaka in Navamsa'},
        {name:'Upapada (UL)', sign: ulSign, desc:'12th Arudha — spouse background'},
        {name:'Darapada (A7)', sign: a7Sign, desc:'7th Arudha — spouse social image'}
    ];

    const dirCount = {};
    dirSources.forEach(s => {
        const dir = DIRECTIONS[s.sign];
        dirCount[dir] = (dirCount[dir] || 0) + 1;
    });
    const sortedDirs = Object.entries(dirCount).sort((a,b) => b[1] - a[1]);
    const primaryDir = sortedDirs[0][0];
    const agreement = sortedDirs[0][1];

    html += `<div class="interp-card">
        <div class="interp-title">🧭 Spouse Direction — 6-Indicator Analysis</div>
        <div class="interp-text">
            Vedic astrology determines spouse direction by combining multiple indicators.<br><br>
            <strong>6 Indicators:</strong><br>
            ${dirSources.map(s => `• <strong>${s.name}</strong>: ${SIGNS[s.sign]} ${SIGN_SYMBOLS[s.sign]} → <strong>${DIRECTIONS[s.sign]}</strong> <span style="color:#666;font-size:12px;">(${s.desc})</span>`).join('<br>')}
            <br><br>
            <strong>🧿 Upapada Lagna (UL):</strong> Arudha of 12th — spouse family/background → <strong>${SIGNS[ulSign]} ${SIGN_SYMBOLS[ulSign]}</strong><br>
            <strong>🎯 Darapada (A7):</strong> Arudha of 7th — spouse social image → <strong>${SIGNS[a7Sign]} ${SIGN_SYMBOLS[a7Sign]}</strong><br>
            <strong>💍 D9 7th Lord (${RULER_NAMES[d9H7Ruler]}):</strong> Where the Navamsa 7th lord sits → <strong>${SIGNS[d9H7RulerSign]} ${SIGN_SYMBOLS[d9H7RulerSign]}</strong><br>
            <strong>♀ D9 Venus:</strong> Spouse karaka in Navamsa → <strong>${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}</strong><br><br>
            <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:14px;margin-top:10px;">
                <strong style="font-size:16px;">🧭 Conclusion: ${agreement >= 4 ? 'Overwhelmingly strong' : agreement >= 3 ? 'Very strong' : agreement >= 2 ? 'Strong' : ''} ${primaryDir} direction</strong><br><br>
                <strong>${agreement}</strong> out of 6 indicators point to <strong>${primaryDir}</strong>.
                ${agreement >= 4 ? '<br>4+ indicators agree! <strong>Very high probability</strong> of meeting spouse from the ' + primaryDir + '. Pay attention to cities, workplaces, or travels in this direction.' : ''}
                ${agreement === 3 ? '<br>3 indicators agree — <strong>high probability</strong> of ' + primaryDir + ' direction.' : ''}
                ${agreement === 2 ? '<br>2 indicators agree — ' + primaryDir + ' is favored but other possibilities exist.' : ''}
                ${agreement <= 1 ? '<br>Indicators are spread — spouse may come from various directions. Keep an open mind.' : ''}
                ${sortedDirs.length > 1 && sortedDirs[1][1] === sortedDirs[0][1] ? '<br><br>💡 Two directions equally indicated: <strong>' + sortedDirs[0][0] + '</strong> and <strong>' + sortedDirs[1][0] + '</strong>.' : ''}
            </div>
        </div>
    </div>`;

    const meetingBySgn = [
        "Active places, sports, competitive environments, leadership gatherings. Intense and sudden first meeting.",
        "Workplace, financial institutions, restaurants, nature. Slowly building trust.",
        "SNS, school, seminars, while traveling, blind dates. Relationship starts with conversation.",
        "Family introductions, neighborhood gatherings, childhood friends. Starts in comfortable settings.",
        "Parties, concerts, creative gatherings, glamorous venues. Dramatic first encounter.",
        "Workplace, hospital, health-related, volunteer activities. Meeting starts from practical needs.",
        "Blind dates, matchmaking, legal/diplomatic events, art exhibitions. Elegant and refined meeting.",
        "Crisis situations, deep conversations, secret places, research labs. Fated and intense attraction.",
        "Abroad, university, religious/philosophical gatherings, while traveling. Connection from far away. May be different culture.",
        "Workplace, business events, official functions. Meeting related to social status.",
        "Online, hobby clubs, social movements, friend of a friend. Unique and unconventional meeting.",
        "Spiritual gatherings, abroad, arts/music, hospital, hints in dreams. Mystical and fated meeting."
    ];

    const backgroundBySgn = [
        "Independent, self-made family. Strong leadership heritage.",
        "Financially stable family. Traditional values. Possibly wealthy background.",
        "Intellectual, communicative family. Emphasis on education.",
        "Warm, family-oriented household. Strong mother figure.",
        "Prestigious, proud family. Social status and reputation.",
        "Practical, hardworking family. Health/medical/education background.",
        "Balanced, dignified family. Arts/law/diplomacy background.",
        "Family with secrets or transformations. Deep family history.",
        "Scholarly, religious/philosophical family. Possible foreign background.",
        "Strict, traditional family. Socially respected. Emphasis on responsibility.",
        "Free-spirited, unique family structure. Progressive thinking.",
        "Spiritual or artistic family. Possible foreign background. Rich sensitivity."
    ];

    const imageBySgn = [
        "Energetic, confident first impression. Sporty or strong image.",
        "Calm, reliable first impression. Refined and dignified image.",
        "Bright, talkative first impression. Intellectual and witty image.",
        "Warm, nurturing first impression. Soft and caring image.",
        "Glamorous, charismatic first impression. Confident image.",
        "Neat, tidy first impression. Meticulous and professional image.",
        "Elegant, charming first impression. Balanced and sophisticated image.",
        "Mysterious, intense first impression. Deep and charismatic image.",
        "Free-spirited, vibrant first impression. Positive and adventurous image.",
        "Serious, mature first impression. Responsible and reliable image.",
        "Unique, individualistic first impression. Trendy and original image.",
        "Dreamy, mystical first impression. Artistic and emotional image."
    ];

    const attractBySgn = [
        "Strong energy and confidence. Proactive and protective nature is attractive.",
        "Stability and sensual charm. Enjoying good food, scents, and textures.",
        "Wit and conversation skills. Intellectual stimulation is the attraction.",
        "Devoted care and emotion. Feeling at home together is the charm.",
        "Shining presence and generosity. Feeling special together is attractive.",
        "Delicate consideration and perfectionism. Attention to detail is charming.",
        "Elegance and harmonious personality. The world becomes beautiful together.",
        "Intense gaze and depth. Soul-piercing focus is the attraction.",
        "Free spirit and humor. Adventures begin when you are together.",
        "Solid trustworthiness and maturity. Rock-solid stability is attractive.",
        "Unique individuality and progressive thinking. Freshness never seen before.",
        "Mystical sensitivity and spiritual depth. Dream-like romance is the charm."
    ];

    const d1H7ForMeeting = (d1LagnaSign + 6) % 12;

    html += `<div class="interp-card">
        <div class="interp-title">🤝 Where You Meet Your Spouse — D1 7th: ${SIGNS[d1H7ForMeeting]} ${SIGN_SYMBOLS[d1H7ForMeeting]}</div>
        <div class="interp-text">
            The 7th house sign reveals the environment and circumstances of meeting your spouse.<br><br>
            <strong>${meetingBySgn[d1H7ForMeeting]}</strong>
            ${d1H7ForMeeting === 8 || d1H7ForMeeting === 11 ? '<br><br>💡 <strong>Foreign spouse possibility!</strong> Signs related to 9th (abroad) or 12th house (foreign residence) are in the 7th, suggesting spouse may be a foreigner or you may meet abroad.' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">🏛️ Spouse Family Background — UL: ${SIGNS[ulSign]} ${SIGN_SYMBOLS[ulSign]}</div>
        <div class="interp-text">
            Upapada Lagna (UL) reveals your spouse's family environment and upbringing.<br><br>
            <strong>${backgroundBySgn[ulSign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">👤 Spouse First Impression — A7: ${SIGNS[a7Sign]} ${SIGN_SYMBOLS[a7Sign]}</div>
        <div class="interp-text">
            Darapada (A7) shows how your spouse appears to the world — their external image and first impression.<br><br>
            <strong>${imageBySgn[a7Sign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">💎 Spouse Attraction Point — D9 Venus: ${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}</div>
        <div class="interp-text">
            Venus in Navamsa reveals your spouse's core charm and love style.<br><br>
            <strong>${attractBySgn[venusD9Sign]}</strong>
        </div>
    </div>`;

    document.getElementById('d9InterpWrap').innerHTML = html;
}


function renderNakshatra(moonPos) {
    if (!moonPos) return;
    const nak = NAKSHATRAS[moonPos.nakshatra];
    if (!nak) return;

    const html = `
        <div class="nakshatra-card">
            <div class="nakshatra-name">${nak.name}</div>
            <div class="nakshatra-meaning">"${nak.meaning}" — Ruling Planet: ${DASHA_KO[nak.ruler] || nak.ruler}</div>
            <div class="nakshatra-detail">
                守護神： ${nak.deity}<br><br>
                ${nak.desc}
            </div>
        </div>
    `;
    document.getElementById('nakshatraWrap').innerHTML = html;
}

function renderDasha(moonNakshatra, birthDate, moonSidereal) {
    const nak = NAKSHATRAS[moonNakshatra];
    if (!nak) return;

    const startRuler = nak.ruler;
    let startIdx = DASHA_ORDER.indexOf(startRuler);
    if (startIdx === -1) startIdx = 0;

    const nakSpan = 360 / 27;
    const moonInNak = moonSidereal - (moonNakshatra * nakSpan);
    const elapsedFraction = moonInNak / nakSpan;
    const firstDashaYears = DASHA_YEARS[startRuler];
    const remainingYears = firstDashaYears * (1 - elapsedFraction);
    const remainingDays = remainingYears * 365.25;

    function addDays(date, days) {
        const d = new Date(date);
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        return d;
    }
    function fmtDate(d) {
        return d.getFullYear() + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + String(d.getDate()).padStart(2,'0');
    }
    function getAge(d) {
        const diff = d.getTime() - birthDate.getTime();
        return (diff / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1);
    }

    const now = new Date();
    let currentDate = new Date(birthDate);

    let html = '<div class="interp-card" style="margin-bottom:12px;border-left:3px solid #c9a84c;"><div class="interp-text" style="font-size:12px;color:#888;">\xf0\x9f\x92\xa1 <strong>ヴィムショータリ・ダシャー</strong> \xe2\x80\x94 人生は9つの惑星が順番に支配する時期に分かれます。 <strong>大運（マハーダシャー）</strong>は大きな時期、<strong>小運（アンタルダシャー/ブクティ）</strong>はその中の細かい時期です。 月のナクシャトラ位置から計算されます。<br><br>';
    html += '\xf0\x9f\x8c\x99 出生時の月： <strong>' + nak.ko + ' (' + nak.name + ')</strong> \xe2\x80\x94 最初のダシャー： <strong>' + DASHA_KO[startRuler] + '</strong> （残り： ' + remainingYears.toFixed(2) + '年）</div></div>';

    const periods = [];
    for (let i = 0; i < 9; i++) {
        const idx = (startIdx + i) % 9;
        const planet = DASHA_ORDER[idx];
        const fullYears = DASHA_YEARS[planet];
        const actualDays = (i === 0) ? remainingDays : fullYears * 365.25;
        const startD = new Date(currentDate);
        const endD = addDays(currentDate, actualDays);
        periods.push({ planet, fullYears, startD, endD, actualDays });
        currentDate = endD;
    }

    html += '<div class="dasha-timeline">';

    periods.forEach((p, pi) => {
        const isCurrent = now >= p.startD && now < p.endD;
        const age = getAge(p.startD);

        html += '<div class="dasha-item ' + (isCurrent ? 'current' : '') + '" style="cursor:pointer;" onclick="this.querySelector(\'.bhukti-list\') && (this.querySelector(\'.bhukti-list\').style.display = this.querySelector(\'.bhukti-list\').style.display===\'none\'?\'\':\'none\')">';
        html += '<span class="dasha-planet">' + DASHA_KO[p.planet] + '</span>';
        html += '<span class="dasha-period">' + fmtDate(p.startD) + ' ~ ' + fmtDate(p.endD) + '</span>';
        html += '<span class="dasha-years">' + (p.actualDays / 365.25).toFixed(1) + '年</span>';
        if (isCurrent) html += '<span class="dasha-badge">現在</span>';
        html += '<span style="font-size:10px;color:#666;margin-left:4px;">(' + age + ') \xe2\x96\xbc</span>';

        html += '<div class="bhukti-list" style="display:' + (isCurrent ? '' : 'none') + ';margin-top:8px;padding-top:8px;border-top:1px solid #2a2a5a;">';

        const mahaDays = p.actualDays;
        const mahaYears = p.fullYears;
        let bhuktiDate = new Date(p.startD);
        const bhuktiStartIdx = DASHA_ORDER.indexOf(p.planet);

        for (let j = 0; j < 9; j++) {
            const bIdx = (bhuktiStartIdx + j) % 9;
            const bPlanet = DASHA_ORDER[bIdx];
            const bFullDays = (DASHA_YEARS[p.planet] * DASHA_YEARS[bPlanet] / 120) * 365.25;
            const bDays = bFullDays * (mahaDays / (mahaYears * 365.25));
            const bStart = new Date(bhuktiDate);
            const bEnd = addDays(bhuktiDate, bDays);
            const bCurrent = now >= bStart && now < bEnd;
            const bAge = getAge(bStart);

            html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;font-size:12px;' + (bCurrent ? 'color:#c9a84c;font-weight:700;' : 'color:#888;') + '">';
            html += '<span>' + (bCurrent ? '\xe2\x96\xb6 ' : '  ') + DASHA_KO[p.planet] + '-' + DASHA_KO[bPlanet] + '</span>';
            html += '<span>' + fmtDate(bStart) + '</span>';
            html += '<span>(' + bAge + ')</span>';
            html += '</div>';

            bhuktiDate = bEnd;
        }

        html += '</div></div>';
    });

    html += '</div>';
    document.getElementById('dashaWrap').innerHTML = html;
}
function renderInterpretation(positions, lagnaSign, moonPos) {
    // Helper: get house number from sign
    function houseOf(signIdx) { return ((signIdx - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    let html = '';

    // ═══════════════════════════════════
    // 1. Personality & Appearance (1st House Lagna)
    // ═══════════════════════════════════
    const lagnaInterp = [
        'Aries Lagna ruled by Mars. Strong willpower and leadership, independent personality. Quick to act with a pioneering spirit. Sharp features with an active impression. Impulsive but courageous, excelling in competition.',
        'Taurus Lagna ruled by Venus. Seeks stability and abundance, loves sensory beauty. Soft appearance with an attractive voice. Values material security with exceptional artistic sense. Stubborn but reliable.',
        'Gemini Lagna ruled by Mercury. Intellectually curious with outstanding communication skills. Youthful appearance with an agile build. Versatile but can be scattered, talented in writing and languages.',
        'Cancer Lagna ruled by the Moon. Rich in sensitivity and highly intuitive. Round face with a soft impression. Devoted to home and family with strong protective instincts. Emotional ups and downs but deeply empathetic.',
        'Leo Lagna ruled by the Sun. Overflowing with charisma and creative energy. Dignified build with a commanding presence. Natural-born leader who enjoys the spotlight. High self-esteem but generous heart.',
        'Virgo Lagna ruled by Mercury. Analytical and perfectionist. Neat appearance with an intellectual impression. Excellent attention to detail and practical abilities, with interest in health and hygiene.',
        'Libra Lagna ruled by Venus. Seeks balance and harmony, diplomatically skilled. Well-proportioned appearance with a refined impression. Excels in relationships and partnerships with superb aesthetic sense.',
        'Scorpio Lagna ruled by Mars. Intense intuition and transformative power. Sharp eyes with a mysterious impression. Penetrates to the essence with deep insight, keeps secrets well. Experiences dramatic life changes multiple times.',
        'Sagittarius Lagna ruled by Jupiter. A philosopher seeking freedom and truth. Large build with a bright impression. Optimistic and values moral principles. Deep connections with travel and higher education.',
        'Capricorn Lagna ruled by Saturn. Strong ambition and patience. Lean build with a serious impression. Systematically works toward goals, the type who grows younger with age. Values social status and achievement.',
        'Aquarius Lagna ruled by Saturn. Innovative and original. Unique appearance with an intellectual impression. Values humanitarian ideals with unconventional thinking. Talented in technology and science.',
        'Pisces Lagna ruled by Jupiter. Spiritual and intuitive. Soft appearance with a dreamy impression. Extremely gifted artistic sensitivity with interest in transcendent worlds. Self-sacrificing tendency.'
    ];

    html += `<div class="interp-card">
        <div class="interp-title">👤 Personality & Appearance — Lagna: ${SIGNS[lagnaSign]} ${SIGN_SYMBOLS[lagnaSign]}</div>
        <div class="interp-text">${lagnaInterp[lagnaSign]}</div>
    </div>`;

    // ═══════════════════════════════════
    // 2. Inner Self & Emotions (Moon Sign)
    // ═══════════════════════════════════
    if (moonPos) {
        const moonInterp = [
            'A fiery passion burns within. Emotions are spontaneous and change quickly. Anger flares fast but fades just as quickly; you desire emotional independence. Relieving stress through exercise works best.',
            'Emotionally very stable, seeking comfort. Dislikes change and finds security in the familiar. Healed by good food, music, and nature. Once you give your heart, it rarely changes.',
            'Processes emotions rationally and organizes feelings through conversation. Curious with many simultaneous interests. Seeks variety over emotional depth and cannot tolerate boredom.',
            'Moon in its own sign (domicile). Extremely rich in sensitivity, absorbing others\' emotions like a sponge. Strong maternal instincts, finding stability at home. Emotions may fluctuate with the Moon\'s cycle.',
            'Dramatic and passionate emotional expression. Strong need to be recognized and loved; deeply hurt when ignored. Creative activities serve as emotional healing. Romantic and generous heart.',
            'Tendency to analyze and organize emotions. Worries a lot and is perfectionist but resolves things practically. May have health concerns, finding stability in daily routines.',
            'Finds emotional balance within relationships. Feels anxious alone and stabilizes when with a partner. Extremely averse to conflict and discord, finding inner peace in art and beauty.',
            'Emotions are as deep and intense as the ocean. Loves deeply and hates deeply; never forgives betrayal. Very strong intuition, instinctively reading others\' true intentions. Emotional energy of transformation and rebirth.',
            'Emotionally optimistic and freedom-loving. Dislikes being constrained and seeks new experiences. Sublimating emotions through philosophical thought, with travel as the best remedy.',
            'Controls emotions well and doesn\'t show them outwardly. Strong sense of responsibility, prioritizing duty over feelings. May have had emotional difficulties in childhood, but grows emotionally mature with age.',
            'Unique and unpredictable emotional patterns. Independent, loving in unconventional ways. Pursues universal love for humanity and social causes, seeing the bigger picture over personal emotions.',
            'Extremely intuitive and spiritual. Dreams are vivid and may be prophetic. Deeply empathizes with others\' suffering, with blurred boundaries between self and others. Finds stability in art, meditation, and spiritual practice.'
        ];
        html += `<div class="interp-card">
            <div class="interp-title">🌙 Inner Self & Emotions — Moon: ${SIGNS[moonPos.sign]} ${SIGN_SYMBOLS[moonPos.sign]}</div>
            <div class="interp-text">${moonInterp[moonPos.sign]}</div>
        </div>`;
    }

    // ═══════════════════════════════════
    // 3. 💰 Wealth Fortune (2nd & 11th House Analysis)
    // ═══════════════════════════════════
    const h2planets = planetsInHouse(2);
    const h11planets = planetsInHouse(11);
    const h2sign = (lagnaSign + 1) % 12;
    const h11sign = (lagnaSign + 10) % 12;

    let wealthText = `<strong>2nd House (Accumulated Wealth):</strong> Located in ${SIGNS[h2sign]}. `;
    if (h2planets.length === 0) {
        wealthText += 'No planets in the 2nd house — wealth accumulation is steady but stable without major fluctuations. ';
    } else {
        h2planets.forEach(p => {
            const pWealth = {
                'Sun': 'Income through authority and status. Potential earnings from government or public sectors.',
                'Moon': 'Fluctuating financial situation. Income possible in public-facing businesses or food & beverage industries.',
                'Mars': 'Aggressive investment tendencies. Income from real estate, technology, or military-related fields.',
                'Mercury': 'Earning money through intellectual abilities. Wealth from writing, education, communications, and IT.',
                'Jupiter': 'Most auspicious placement! Abundant wealth fortune. Great income from education, law, or religious fields.',
                'Venus': 'Accumulates wealth through luxury goods, art, entertainment, and fashion. Abundant dining life.',
                'Saturn': 'Slowly and steadily accumulates wealth. Difficulties early on but stabilizes after middle age.',
                'Rahu': 'Earns money through unconventional methods. Sudden wealth from foreign, technology, or innovation sectors.',
                'Ketu': 'Indifference to wealth. Values spiritual matters over material ones; watch for sudden losses.'
            };
            wealthText += `${p.symbol} ${p.name}: ${pWealth[p.id] || ''} `;
        });
    }

    wealthText += `<br><br><strong>11th House (Income & Gains):</strong> Located in ${SIGNS[h11sign]}. `;
    if (h11planets.length === 0) {
        wealthText += 'No planets in the 11th house — income is stable but without major fluctuations.';
    } else {
        h11planets.forEach(p => {
            const pIncome = {
                'Jupiter': 'Large income and abundant profits! Social networks bring wealth.',
                'Venus': 'Income through art, socializing, and fashion. Female friends are helpful.',
                'Saturn': 'Steady and stable income but slow growth. Good retirement security.',
                'Mars': 'Income through competition. Profits from technology, real estate, and sports.',
                'Mercury': 'Income through intellectual networks. Entrepreneurial aptitude.',
                'Sun': 'Income through authority. Political connections bring wealth.',
                'Moon': 'Income through public popularity. Fluctuating but steady flow.'
            };
            wealthText += `${p.symbol} ${p.name}: ${pIncome[p.id] || ''} `;
        });
    }

    html += `<div class="interp-card">
        <div class="interp-title">💰 Wealth Fortune</div>
        <div class="interp-text">${wealthText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 4. 💕 Spouse & Marriage Fortune (7th House Analysis)
    // ═══════════════════════════════════
    const h7sign = (lagnaSign + 6) % 12;
    const h7planets = planetsInHouse(7);
    const venus = positions.find(p => p.id === 'Venus');

    const spouseSign = [
        'An independent and energetic spouse. Destined for someone with strong willpower and leadership. An active and direct partner.',
        'A beautiful and artistic spouse. Destined for someone materially stable. A sensual and loyal partner.',
        'An intelligent spouse with good communication skills. Destined for someone you can converse with well. A humorous and versatile partner.',
        'An emotional and domestic spouse. Destined for someone nurturing. A partner with motherly warmth.',
        'A charismatic and dignified spouse. Destined for someone socially prominent. A partner with high self-esteem but generous nature.',
        'A meticulous and practical spouse. Destined for someone interested in health and wellness. An analytical and service-oriented partner.',
        'An attractive and refined spouse. Destined for someone diplomatic with good sense of balance. A partner with excellent artistic taste.',
        'An intense and mysterious spouse. Destined for someone with deep emotions. A transformative and passionate partner. May have many secrets.',
        'A free-spirited and optimistic spouse. Possible connection with a foreigner or someone from another culture. A philosophical and adventurous partner.',
        'A serious and ambitious spouse. May have an age difference. A responsible and socially successful partner. Marriage may come late.',
        'A unique and independent spouse. Unconventional meeting or relationship. An intellectual and innovative partner. A free-form marriage.',
        'A spiritual and intuitive spouse. Connection with an artist or spiritual practitioner. A dreamy and romantic partner. Watch for idealization.'
    ];

    let spouseText = spouseSign[h7sign];

    if (h7planets.length > 0) {
        spouseText += '<br><br><strong>Planets in the 7th House:</strong> ';
        h7planets.forEach(p => {
            const pH7 = {
                'Sun': 'Spouse is socially recognized. May be somewhat dominant but a respectable partner.',
                'Moon': 'An emotional and caring spouse. Marriage life with deep emotional connection.',
                'Mars': 'Passionate but may have frequent arguments. A strong-willed spouse. Energetic relationship. (Watch for Kuja Dosha)',
                'Mercury': 'An intellectual spouse with great conversation. A good relationship as business partners too.',
                'Jupiter': 'Most blessed placement! A wise and moral spouse. Happy married life. Luck through spouse.',
                'Venus': 'A very attractive and loving spouse. Romantic married life. May enjoy luxury.',
                'Saturn': 'Late marriage or spouse with significant age difference. Difficult early on but stable, long-lasting marriage.',
                'Rahu': 'Unconventional marriage. Spouse from foreign country or different background. Sudden meeting. Beware of illusions.',
                'Ketu': 'Detachment toward spouse. Past-life connection. Strong spiritual bond but distance in worldly relationships.'
            };
            spouseText += `<br>${p.symbol} ${p.name}: ${pH7[p.id] || ''}`;
        });
    }

    if (venus) {
        const venusHouse = houseOf(venus.sign);
        spouseText += `<br><br><strong>Venus Position (${venusHouse}${venusHouse===1?'st':venusHouse===2?'nd':venusHouse===3?'rd':'th'} House):</strong> `;
        const venusHouseInterp = {
            1: 'Attractive appearance. Enjoys romance and falls in love easily.',
            2: 'Wealth comes through spouse. Beautiful voice and gourmet tastes.',
            3: 'Artistic communication skills. Pleasant relationships with siblings.',
            4: 'Happiness at home with a beautiful residence. Strong influence from mother.',
            5: 'A life rich in romance. Good relationship with children. Joy in creative work.',
            6: 'Service-oriented attitude in romance. Possibility of workplace romance.',
            7: 'Very attractive spouse. A strong indicator of happy married life.',
            8: 'Deep and transformative love. Secret romance. Spouse\'s wealth.',
            9: 'Romance abroad. Connection with a teacher or mentor. Philosophical love.',
            10: 'Socially recognized marriage. Meeting through career.',
            11: 'From friends to lovers. Finding connections through social activities.',
            12: 'Secret romance. Foreign connections. Spiritual love.'
        };
        spouseText += venusHouseInterp[venusHouse] || '';
    }

    html += `<div class="interp-card">
        <div class="interp-title">💕 Spouse & Marriage Fortune — 7th House: ${SIGNS[h7sign]} ${SIGN_SYMBOLS[h7sign]}</div>
        <div class="interp-text">${spouseText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 5. 💼 Career & Social Achievement (10th House Analysis)
    // ═══════════════════════════════════
    const h10sign = (lagnaSign + 9) % 12;
    const h10planets = planetsInHouse(10);

    const careerSign = [
        'Suited for military, police, sports, surgery, corporate management, leadership roles.',
        'Finance, food industry, agriculture, fashion, real estate, art, banking fields.',
        'Media, writing, education, communications, IT, marketing, translation fields.',
        'Medical, nursing, hospitality, maritime, real estate, food & beverage fields.',
        'Politics, entertainment, management, government agencies, leadership positions, gold-related fields.',
        'Medical, accounting, analysis, consulting, healthcare, quality control fields.',
        'Law, diplomacy, fashion, interior design, counseling, event planning fields.',
        'Research, investigation, insurance, medicine, psychology, taxation, mining fields.',
        'Education, law, religion, publishing, travel, international trade fields.',
        'Management, civil service, architecture, civil engineering, politics, large corporations.',
        'Technology, science, IT, aviation, aerospace, social work, innovation fields.',
        'Art, film, music, medical, overseas, spiritual fields, NGO-related fields.'
    ];

    let careerText = `The 10th house is in ${SIGNS[h10sign]}. ${careerSign[h10sign]}`;

    if (h10planets.length > 0) {
        careerText += '<br><br><strong>Planets in the 10th House:</strong>';
        h10planets.forEach(p => {
            const pCareer = {
                'Sun': ' Government, leadership, authoritative positions. A career that garners social attention.',
                'Moon': ' Public-facing career. Caring, hospitality, food & beverage, emotion-related fields.',
                'Mars': ' Technology, engineering, military, surgery, sports. Success in competitive fields.',
                'Mercury': ' Business, communication, IT, education. Success through intellectual abilities.',
                'Jupiter': ' Education, law, religion, consulting. A respected career. One of the best placements.',
                'Venus': ' Art, entertainment, fashion, beauty, diplomacy. Success in creative fields.',
                'Saturn': ' Slow but certain success. Systematic organizations, architecture, civil service. Shines after middle age.'
            };
            careerText += `<br>${p.symbol} ${p.name}: ${pCareer[p.id] || ''}`;
        });
    }

    html += `<div class="interp-card">
        <div class="interp-title">💼 Career & Social Achievement — 10th House: ${SIGNS[h10sign]} ${SIGN_SYMBOLS[h10sign]}</div>
        <div class="interp-text">${careerText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 6. 🏥 Health (6th House + Lagna Analysis)
    // ═══════════════════════════════════
    const h6sign = (lagnaSign + 5) % 12;
    const h6planets = planetsInHouse(6);

    const healthByLagna = [
        'Watch for head, brain, and face-related conditions. Prone to headaches, fevers, and inflammation. Regular exercise is essential.',
        'Watch for neck, thyroid, and jaw issues. Prone to overeating and diabetes. Take care of vocal cords and throat health.',
        'Watch for lungs, arms, shoulders, and nervous system. Anxiety and sleep issues possible. Breathing meditation helps.',
        'Watch for stomach, chest, and breast-related issues. Digestive disorders and water retention. Emotional stress directly affects health.',
        'Watch for heart, back, and spine issues. Cardiovascular health management is essential. Beware of overwork.',
        'Watch for digestive system, intestines, and skin. Indigestion and allergies. Diet is important.',
        'Watch for kidneys, lower back, and skin. Adequate hydration and balanced lifestyle essential.',
        'Watch for reproductive and excretory systems. Possibility of chronic conditions. Regular checkups are important.',
        'Watch for liver, thighs, and hips. Tendency toward being overweight. Outdoor activities are good for health.',
        'Watch for bones, joints, knees, and skin. Rheumatism and arthritis. Calcium intake is important.',
        'Watch for ankles, calves, and circulatory system. Blood pressure management. Unusual health issues possible.',
        'Watch for feet, lymphatic system, and immunity. Unexplained conditions possible. Adequate sleep is key.'
    ];

    html += `<div class="interp-card">
        <div class="interp-title">🏥 Health — Vulnerable Areas</div>
        <div class="interp-text">${healthByLagna[lagnaSign]}${h6planets.length > 0 ? '<br><br>' + h6planets.map(p => p.name).join(', ') + ' in the 6th house requires special attention to health management.' : ''}</div>
    </div>`;

    // ═══════════════════════════════════
    // 7. ⏳ Current Dasha Interpretation
    // ═══════════════════════════════════
    if (moonPos) {
        const nak = NAKSHATRAS[moonPos.nakshatra];
        if (nak) {
            const startRuler = nak.ruler;
            let startIdx = DASHA_ORDER.indexOf(startRuler);
            if (startIdx === -1) startIdx = 0;
            const now = new Date();
            const birthDate = new Date(Date.UTC(
                parseInt(document.getElementById('birthYear').value),
                parseInt(document.getElementById('birthMonth').value) - 1,
                parseInt(document.getElementById('birthDay').value)
            ));
            let currentDate = new Date(birthDate);
            let currentDasha = null;

            for (let i = 0; i < 9; i++) {
                const idx = (startIdx + i) % 9;
                const planet = DASHA_ORDER[idx];
                const years = DASHA_YEARS[planet];
                const endD = new Date(currentDate);
                endD.setFullYear(endD.getFullYear() + years);
                if (now >= currentDate && now < endD) {
                    currentDasha = planet;
                    break;
                }
                currentDate = endD;
            }

            if (currentDasha) {
                const dashaInterp = {
                    'Sun': 'A period of self-discovery and authority. A time to exercise leadership and receive social recognition. Relationships with government or authority figures become important. Changes may occur in your relationship with your father. Watch your heart and eye health. This period strengthens your self-esteem and identity.',
                    'Moon': 'A period of emotions and inner life. Home and relationship with mother become important. Real estate matters may arise, and public relations become active. Emotional fluctuations are large but intuition strengthens. Possibility of travel and relocation.',
                    'Mars': 'A period of action and energy. A great time to courageously start new ventures. Real estate transactions, surgeries, and technology-related activities become active. Changes in sibling relationships. Watch for disputes, accidents, and burns. Good results in exercise and competition.',
                    'Rahu': 'A period of rapid change and innovation. Unexpected opportunities and challenges come. Foreign-related activities become active, with potential advancement in technology and innovation fields. Material desires intensify — be careful not to get lost in illusions. You will have unique experiences. An 18-year long cycle.',
                    'Jupiter': 'A period of luck and growth! A time when good things in life — education, marriage, childbirth, promotions — are more likely to happen. Spiritual growth and wisdom deepen. You will meet a teacher or mentor. Activities related to law, education, and religion are favorable.',
                    'Saturn': 'A period of patience and trials. Growth is slow but certain. Responsibilities grow heavier with experiences of limitation and structure. Watch your health, especially bones and joints. A 19-year long cycle where true abilities are tested. When it ends, you discover a stronger self.',
                    'Mercury': 'A period of intellectual activity and business. Favorable for learning, communication, writing, and business ventures. A great time to learn new skills. Relationships with siblings and friends become active. Watch nervous system health. You will find yourself juggling multiple things simultaneously.',
                    'Ketu': 'A period of spiritual awakening and detachment. You become more detached from the material world with deepening spiritual interests. You may experience sudden changes and losses, but these lead to spiritual growth. Intuition becomes very strong — an excellent time for meditation and spiritual practice.',
                    'Venus': 'A period of love and abundance! Romance, marriage, and artistic activities become active. You enjoy material prosperity and indulge in luxury. You may acquire a new car, new home, or jewelry. Aesthetic sense develops and social activities flourish. The longest cycle at 20 years.'
                };
                html += `<div class="interp-card">
                    <div class="interp-title">⏳ Current Dasha: ${DASHA_KO[currentDasha]} Dasha</div>
                    <div class="interp-text">${dashaInterp[currentDasha]}</div>
                </div>`;
            }
        }
    }

    // ═══════════════════════════════════
    // 8. 🔮 Special Yogas (Planetary Combinations)
    // ═══════════════════════════════════
    let yogaText = '';
    const jupiter = positions.find(p => p.id === 'Jupiter');
    const mars = positions.find(p => p.id === 'Mars');
    const saturn = positions.find(p => p.id === 'Saturn');

    // Gajakesari Yoga
    if (moonPos && jupiter) {
        const moonH = houseOf(moonPos.sign);
        const jupH = houseOf(jupiter.sign);
        const diff = Math.abs(moonH - jupH);
        if (diff === 0 || diff === 3 || diff === 6 || diff === 9) {
            yogaText += '<strong>🐘 Gajakesari Yoga</strong> — Moon and Jupiter in Kendra relationship! A combination of wisdom, fame, and abundance. Socially respected with exceptional intellectual abilities. Good education and children fortune.<br><br>';
        }
    }

    // Budha-Aditya Yoga
    const sun = positions.find(p => p.id === 'Sun');
    const mercury = positions.find(p => p.id === 'Mercury');
    if (sun && mercury && sun.sign === mercury.sign) {
        yogaText += '<strong>📚 Budha-Aditya Yoga</strong> — Sun and Mercury in the same sign! Outstanding intellect and communication skills. Success in education, writing, and business. An authoritative intellectual leader.<br><br>';
    }

    // Chandra-Mangala Yoga
    if (moonPos && mars && moonPos.sign === mars.sign) {
        yogaText += '<strong>🔥 Chandra-Mangala Yoga</strong> — Moon and Mars in the same sign! Strong willpower and wealth accumulation ability. Succeeds in business and makes bold decisions.<br><br>';
    }

    // Kuja Dosha (Manglik)
    if (mars) {
        const marsH = houseOf(mars.sign);
        if ([1,2,4,7,8,12].includes(marsH)) {
            yogaText += `<strong>⚠️ Kuja Dosha (Manglik)</strong> — Mars is positioned in the ${marsH}${marsH===1?'st':marsH===2?'nd':marsH===3?'rd':'th'} house, which may bring challenges in married life. It is advisable to check your partner's chart as well when choosing a spouse. Marriage after age 28 may be more favorable.<br><br>`;
        }
    }

    if (yogaText) {
        html += `<div class="interp-card">
            <div class="interp-title">🔮 Special Yogas (Planetary Combinations)</div>
            <div class="interp-text">${yogaText}</div>
        </div>`;
    }

    document.getElementById('interpWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// Planet in House Detailed Interpretations
// ═══════════════════════════════════════════════════
const PLANET_IN_HOUSE = {
    Sun: [
        '1st House: Strong self and leadership. Healthy and vital. High self-esteem and independent. Connection with government/authority.',
        '2nd House: Values family honor. Income through authority. Inheritance from father. Watch eye health.',
        '3rd House: Courageous and decisive. Leader among siblings. Authority in writing/communication. Many short trips.',
        '4th House: Tension in parental relationships. Ownership of real estate/vehicles. Inner restlessness. May leave hometown.',
        '5th House: Outstanding creative talent. Good relationship with children. Investment/speculation abilities. Romantic love.',
        '6th House: Power to defeat enemies. Health management abilities. Victory in legal disputes. Suited for service/medical fields.',
        '7th House: Spouse with high social status. Leading role in partnerships. Social growth after marriage.',
        '8th House: Watch longevity. Benefits from inheritance/insurance. Secret power. Experience of spiritual transformation.',
        '9th House: Father is a respected figure. Success in law/religion/higher education. Many overseas trips. Good fortune.',
        '10th House: The best placement! Social success and fame. Leader in government/public sector. Success like father.',
        '11th House: Large income and social network. High-status friends. Excellent goal achievement abilities.',
        '12th House: Success overseas. Spiritual pursuits. Distance from father. Tendency to enjoy solitude. Watch eye health.'
    ],
    Moon: [
        '1st House: Attractive appearance. Emotional and changeable personality. Popular with the public. Health influenced by Moon cycles.',
        '2nd House: Comfortable family environment. Good diet. Sweet-spoken. Strong family bonds.',
        '3rd House: Creative communication skills. Loves to travel. Emotional bond with siblings. Artistic hobbies.',
        '4th House: The best placement! Happy home. Strong bond with mother. Good real estate fortune. Emotional stability.',
        '5th House: Deep love for children. Romantic personality. Intuitive investment ability. Joy in creative activities.',
        '6th House: Health issues from emotional stress. Victory over enemies. Service spirit. Watch for digestive disorders.',
        '7th House: Attractive spouse. Emotionally deep marriage. Tendency to depend on partner. Public relations.',
        '8th House: Emotional turmoil and transformation. Very strong intuition. Possible inheritance. Long life but emotional crises.',
        '9th House: Spiritual and philosophical. Mother is religious. Travel/residence abroad. Lucky journeys.',
        '10th House: Public popularity and social success. Hospitality/food & beverage/caring fields. Success through mother\'s influence.',
        '11th House: Many friends and sociable. Steady income. Ability to fulfill wishes. Help from female friends.',
        '12th House: Possible residence abroad. Sleep problems. Spiritual inclinations. Distance from mother. Enjoys solitude.'
    ],
    Mars: [
        '1st House: Strong physique and willpower. Possible scars/wounds. Impulsive but brave. Leadership and competitiveness.',
        '2nd House: Harsh speech. Dietary issues. Family disputes. But ability to accumulate wealth.',
        '3rd House: The best placement! Courage and adventurous spirit. Strong bond with siblings. Athletic/sports talent.',
        '4th House: Domestic conflicts. Real estate disputes. Tension with mother. But profits from real estate investments.',
        '5th House: Passionate romance. Active children. Speculative investments. Talent in sports/competition.',
        '6th House: Power to crush enemies! Physical strength to overcome illness. Suited for military/police/medical. Strong immunity.',
        '7th House: Kuja Dosha — Passion and conflict coexist in marriage. Strong spouse. Marriage after 28 recommended.',
        '8th House: Watch for accidents/surgery. But the power to survive crises. Insurance/inheritance benefits. Interest in tantra.',
        '9th House: Conflict with father. Strong opinions about religion. Legal disputes. Foreign activities.',
        '10th House: Outstanding career performance! Military/engineering/surgery/police. A brave leader in society.',
        '11th House: Large income! Strong goal achievement. Help from siblings. Real estate profits.',
        '12th House: High spending overseas. Sleep issues. Strong sexual energy. Secret activities.'
    ],
    Jupiter: [
        '1st House: Blessed placement! Wise and generous personality. Large build and healthy. A respected figure.',
        '2nd House: Abundant wealth! Large family. Income through education. Eloquent speaker. Good diet.',
        '3rd House: Successful siblings. Writing related to religion/education. Short pilgrimages.',
        '4th House: One of the best placements! Spacious home. Academic achievement. Wise mother. Inner peace.',
        '5th House: Outstanding intellect and creativity! Good children fortune. Wise investments. Spiritual practice. Merit from past lives.',
        '6th House: Easily defeats enemies. Legal victories. Service spirit. Healthy but watch weight management.',
        '7th House: A wise and moral spouse! Happy marriage. Successful business partnerships.',
        '8th House: Longevity! Inheritance. Depth of spiritual knowledge. Interest in astrology/mysticism. Spouse\'s wealth.',
        '9th House: The most powerful placement! Great fortune. Teacher\'s blessings. Overseas travel. Success in law/religion/philosophy.',
        '10th House: Social fame and respect! Leader in education/law/religious fields. Moral authority. Best career fortune.',
        '11th House: Great income and profits! Wish fulfillment. Influential connections. Social success.',
        '12th House: Fortune overseas. Spiritual liberation. Heavenly pleasures. Donations and charity. Meditation practice.'
    ],
    Venus: [
        '1st House: Very attractive appearance! Artistic talent. Enjoys luxury. Sociable and popular.',
        '2nd House: Abundant wealth! Fine food and luxury goods. Sweet voice. Family harmony.',
        '3rd House: Artistic communication. Beautiful writing. Good relationship with sisters/female siblings.',
        '4th House: Beautiful home and vehicles! Luxurious lifestyle. Mother is beautiful and artistic.',
        '5th House: Romantic love! Art/entertainment talent. Beautiful children. Joy in creation.',
        '6th House: Difficulties in romance. Health-related beauty. Victory over enemies through charm.',
        '7th House: The best placement! Very attractive spouse. Happy marriage. Successful business partnerships.',
        '8th House: Deep and transformative love. Spouse\'s wealth. Secret romance. Longevity.',
        '9th House: Romance abroad. Artistic travels. Beautiful relationship with teachers.',
        '10th House: Success in art/fashion/entertainment! Socially attractive. Help from women.',
        '11th House: Income through social networks! Help from female friends. Wish fulfillment.',
        '12th House: Love abroad. Secret romance. Bedroom pleasures. Artistic inspiration.'
    ],
    Saturn: [
        '1st House: Lean build. Serious and responsible. Childhood difficulties. Shines with age. Longevity.',
        '2nd House: Slow wealth accumulation. Frugal lifestyle. Heavy speech. Distance from family. Stability after middle age.',
        '3rd House: Excellent placement! Strong will and patience. Responsibility for siblings. Systematic communication.',
        '4th House: Difficulties with mother. Strict home environment. Old houses/buildings. Inner solitude.',
        '5th House: Children come late or few. Cautious investments. Academic struggles and overcoming. Spiritual practice.',
        '6th House: Defeats enemies through patience! Chronic but manageable conditions. Success in service fields. Good placement.',
        '7th House: Late marriage. Older spouse. Difficult early on but stable marriage. Caution with business partners.',
        '8th House: Longevity! Watch for chronic conditions. Delays in inheritance matters. Secret research. Interest in tantra/yoga.',
        '9th House: Difficult relationship with father. Serious approach to religion. Late overseas travel.',
        '10th House: Great placement! Slow but certain social success. Leader in large corporations/government. Best career fortune.',
        '11th House: Steady income growth! Older friends. Achieving goals through patience. Organizational profits.',
        '12th House: Difficulties and growth overseas. Sleep issues. Spiritual practice. Preference for solitary work.'
    ]
};

function renderPlanetHouse(positions, lagnaSign) {
    function houseOf(signIdx) { return ((signIdx - lagnaSign + 12) % 12) + 1; }
    let html = '';

    positions.forEach(p => {
        if (!PLANET_IN_HOUSE[p.id]) return;
        const house = houseOf(p.sign);
        const desc = PLANET_IN_HOUSE[p.id][house - 1];
        if (!desc) return;

        const hSuffix = house===1?'st':house===2?'nd':house===3?'rd':'th';
        html += `<div class="interp-card">
            <div class="interp-title">${p.symbol} ${p.name} → ${house}${hSuffix} House (${SIGNS[p.sign]})</div>
            <div class="interp-text">${desc}</div>
        </div>`;
    });

    document.getElementById('planetHouseWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// Education & Knowledge
// ═══════════════════════════════════════════════════
function renderEducation(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    const h4 = planetsInHouse(4);
    const h5 = planetsInHouse(5);
    const h4sign = (lagnaSign + 3) % 12;
    const h5sign = (lagnaSign + 4) % 12;

    let text = `<strong>4th House (Basic Education & Degrees):</strong> ${SIGNS[h4sign]}. `;
    const eduSign4 = ['Active learning, physical/military education', 'Fine arts/music/culinary education', 'Languages/literature/communication', 'Home education emphasis, history', 'Drama/leadership/political science', 'Science/medicine/analytics', 'Law/diplomacy/design', 'Psychology/research/investigation', 'Philosophy/theology/international studies', 'Business/administration/architecture', 'IT/science technology/aviation', 'Art/film/music/spirituality'];
    text += 'Suited for ' + eduSign4[h4sign] + '. ';
    if (h4.length > 0) text += h4.map(p => p.name).join(', ') + ' in the 4th house influences education. ';

    const jupiter = positions.find(p => p.id === 'Jupiter');
    if (jupiter) {
        const jH = houseOf(jupiter.sign);
        const jSuffix = jH===1?'st':jH===2?'nd':jH===3?'rd':'th';
        if ([1,4,5,9].includes(jH)) text += `<br><br>🎓 <strong>Jupiter in the ${jH}${jSuffix} house indicates high academic achievement!</strong> Potential for graduate school/PhD/study abroad.`;
    }

    text += `<br><br><strong>5th House (Higher Education & Intellect & Creativity):</strong> ${SIGNS[h5sign]}. `;
    if (h5.length > 0) {
        h5.forEach(p => {
            const h5p = { Sun: 'Excels in leadership/political science', Moon: 'Talent in art/psychology', Mars: 'Talent in engineering/technology/physical education', Mercury: 'Genius in math/languages/business', Jupiter: 'The best placement! Scholar/professor/researcher', Venus: 'Talent in art/design/music', Saturn: 'Late academic start but deep research' };
            text += `${p.name}: ${h5p[p.id] || 'Influences academics'}. `;
        });
    }

    document.getElementById('educationWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// Children Fortune
// ═══════════════════════════════════════════════════
function renderChildren(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    const h5 = planetsInHouse(5);
    const h5sign = (lagnaSign + 4) % 12;
    const jupiter = positions.find(p => p.id === 'Jupiter');

    let text = `<strong>5th House (Children & Creativity):</strong> Located in ${SIGNS[h5sign]}.<br><br>`;

    const childSign = [
        'Active and independent children. Talented in sports/leadership. Gains independence early.',
        'Calm and artistic children. Talented in music/art. Materially well-off children.',
        'Smart and quick-speaking children. Excellent academics. Possibility of twins.',
        'Sensitive and gentle children. Special bond with mother. Domestic children.',
        'Charismatic and creative children. Leader qualities. Talent in entertainment/art.',
        'Meticulous and analytical children. Talent in medicine/science. Health care is important.',
        'Charming and sociable children. Talent in art/diplomacy. Excellent sense of balance.',
        'Intense and intuitive children. Research/exploration spirit. May have many secrets.',
        'Free-spirited and adventurous children. Possible study/travel abroad. Philosophical tendencies.',
        'Serious and ambitious children. Matures early. Achievement-oriented.',
        'Unique and innovative children. Talented in technology/science. Independent personality.',
        'Artistic and spiritual children. Rich imagination. Talented in music/painting.'
    ];
    text += childSign[h5sign];

    if (h5.length > 0) {
        text += '<br><br><strong>Planets in the 5th House:</strong><br>';
        h5.forEach(p => {
            const ch = { Sun: 'Connection with sons. Children have leader qualities.', Moon: 'Connection with daughters. Strong emotional bond with children.', Mars: 'Active children. May be somewhat difficult to manage.', Mercury: 'Very smart children! Excellent academics.', Jupiter: 'Blessed children! Dutiful and devoted. Fortune through children.', Venus: 'Beautiful and artistic children. Connection with daughters.', Saturn: 'Children may come late or be few. But responsible children.' };
            text += `${p.symbol} ${p.name}: ${ch[p.id] || ''}<br>`;
        });
    }

    if (jupiter) {
        const jH = houseOf(jupiter.sign);
        if (jH === 5) text += '<br>🌟 <strong>Jupiter in the 5th house! Best children fortune. Children bring great luck.</strong>';
    }

    document.getElementById('childrenWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// Foreign Fortune & Migration
// ═══════════════════════════════════════════════════
function renderForeign(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    const h9 = planetsInHouse(9);
    const h12 = planetsInHouse(12);
    const rahu = positions.find(p => p.id === 'Rahu');

    let text = '<strong>9th House (Foreign Travel · Fortune · Higher Education):</strong><br>';
    if (h9.length === 0) {
        text += 'No planets in the 9th house — foreign travel exists but there is no particularly strong connection.';
    } else {
        h9.forEach(p => {
            const f9 = { Sun: 'Father has foreign connections. Government/official overseas trips.', Moon: 'Emotionally enjoys foreign travel. Popularity abroad.', Mars: 'Adventure/challenges abroad. Military/technology-related foreign activities.', Mercury: 'Study abroad/business success! Multilingual abilities.', Jupiter: 'Great fortune abroad! Successful study/immigration. Meeting a foreign teacher.', Venus: 'Romance abroad. Art/fashion-related foreign activities.', Saturn: 'Hardship then success abroad. Long-term foreign residence.', Rahu: 'Strong indicator of foreign migration! Deeply immersed in foreign culture.', Ketu: 'Past-life foreign connections. Spiritual pilgrimage.' };
            text += `${p.symbol} ${p.name}: ${f9[p.id] || ''}<br>`;
        });
    }

    text += '<br><strong>12th House (Foreign Settlement · Immigration · Expenses):</strong><br>';
    if (h12.length === 0) {
        text += 'No planets in the 12th house — domestic residence is more natural than foreign settlement.';
    } else {
        h12.forEach(p => {
            const f12 = { Sun: 'Finding identity abroad. Government-related foreign postings.', Moon: 'High possibility of living abroad! Emotional stability overseas.', Mars: 'Energy expenditure abroad. Foreign investment/real estate.', Mercury: 'Foreign business/IT activities. Overseas education.', Jupiter: 'Spiritual growth abroad. Charitable activities. Foreign universities.', Venus: 'Luxury and pleasure abroad. Overseas artistic activities.', Saturn: 'Hard labor abroad. But long-term settlement.', Rahu: 'Definitive indicator of foreign immigration! Adapting to Western culture.', Ketu: 'Spiritual practice abroad. Solitary overseas life.' };
            text += `${p.symbol} ${p.name}: ${f12[p.id] || ''}<br>`;
        });
    }

    if (rahu) {
        const rH = houseOf(rahu.sign);
        const rSuffix = rH===1?'st':rH===2?'nd':rH===3?'rd':'th';
        if ([9, 12, 7].includes(rH)) text += `<br>✈️ <strong>Rahu in the ${rH}${rSuffix} house indicates a very high possibility of foreign migration/long-term residence!</strong>`;
    }

    document.getElementById('foreignWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// Planetary Dignity
// ═══════════════════════════════════════════════════
function renderDignity(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    const houseArea = {1:'Self',2:'Money/Family',3:'Communication/Siblings',4:'Home/Mother',5:'Children/Romance',6:'Health/Enemies',7:'Spouse',8:'Transformation/Inheritance',9:'Luck/Foreign',10:'Career/Fame',11:'Income/Wishes',12:'Foreign/Spirituality'};
    const EXALT = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
    const DEBI = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };
    const OWN = { Sun: [4], Moon: [3], Mars: [0,7], Mercury: [2,5], Jupiter: [8,11], Venus: [1,6], Saturn: [9,10] };

    // Easy explanation
    const planetRole = {
        Sun: 'Self/Confidence/Father/Authority',
        Moon: 'Emotions/Mind/Mother/Daily life',
        Mars: 'Energy/Courage/Action/Competition',
        Mercury: 'Intelligence/Communication/Learning/Business',
        Jupiter: 'Luck/Wisdom/Wealth/Marriage',
        Venus: 'Love/Charm/Art/Pleasure',
        Saturn: 'Patience/Trials/Responsibility/Effort'
    };

    let html = `<div class="interp-card" style="margin-bottom:16px;">
        <div class="interp-text">
            <strong>💡 Easy to understand:</strong> A planet's "dignity" refers to how well it can exert its power.<br><br>
            🟢 <strong>Exalted</strong> = Peak condition! Great fortune and results in the life area this planet governs.<br>
            🟡 <strong>Own Sign</strong> = Comfortable as if at home. Stable and good results.<br>
            ⚪ <strong>Neutral</strong> = Average. Neither particularly strong nor weak.<br>
            🔴 <strong>Debilitated</strong> = Weakened state. Difficulties in this area, but can be overcome with effort.
        </div>
    </div>`;

    positions.forEach(p => {
        if (!EXALT.hasOwnProperty(p.id)) return;
        let dignity, emoji, meaning, color, simpleDesc;
        const role = planetRole[p.id];

        const house = houseOf(p.sign);
        const hSuffix = house===1?'st':house===2?'nd':house===3?'rd':'th';
        const area = houseArea[house] || '';

        if (p.sign === EXALT[p.id]) {
            dignity = 'Exalted';
            emoji = '🟢';
            color = '#5cb85c';
            simpleDesc = `<strong>${p.name} is at maximum power!</strong> The "${role}" energy is maximized in the <strong>${house}${hSuffix} house (${area})</strong> area, bringing great blessings. Innate talents shine and good results come naturally.`;
        } else if (p.sign === DEBI[p.id]) {
            dignity = 'Debilitated';
            emoji = '🔴';
            color = '#d9534f';
            simpleDesc = `<strong>${p.name} is in a weakened state.</strong> The "${role}" energy is weakened in the <strong>${house}${hSuffix} house (${area})</strong> area. You may experience difficulties in this field, but conscious effort to overcome them can become a great opportunity for growth. See the remedies below.`;
        } else if (OWN[p.id] && OWN[p.id].includes(p.sign)) {
            dignity = 'Own Sign';
            emoji = '🟡';
            color = '#c9a84c';
            simpleDesc = `<strong>${p.name} is at home!</strong> The "${role}" energy stably exerts its power in the <strong>${house}${hSuffix} house (${area})</strong> area. Good results come naturally.`;
        } else {
            dignity = 'Neutral';
            emoji = '⚪';
            color = '#999';
            simpleDesc = `${p.name}'s "${role}" energy exerts average influence in the <strong>${house}${hSuffix} house (${area})</strong> area. Results vary depending on relationships with other planets.`;
        }

        html += `<div class="interp-card">
            <div class="interp-title">${emoji} ${p.symbol} ${p.name} — ${SIGNS[p.sign]} ${SIGN_SYMBOLS[p.sign]} → ${house}${hSuffix} House (${area}) — <span style="color:${color}">${dignity}</span></div>
            <div class="interp-text">
                <span style="color:#666;font-size:12px;">Governs: ${role} │ Position: ${house}${hSuffix} House = ${area}</span><br><br>
                ${simpleDesc}
            </div>
        </div>`;
    });

    document.getElementById('dignityWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// Lucky Information
// ═══════════════════════════════════════════════════
function renderLucky(lagnaSign, moonPos) {
    const luckyData = [
        { color: 'Red, Orange', number: '1, 9', day: 'Tuesday', gem: 'Red Coral', dir: 'East' },
        { color: 'White, Pink', number: '2, 6', day: 'Friday', gem: 'Diamond', dir: 'Southeast' },
        { color: 'Green', number: '3, 5', day: 'Wednesday', gem: 'Emerald', dir: 'North' },
        { color: 'White, Silver', number: '2, 7', day: 'Monday', gem: 'Pearl', dir: 'Northwest' },
        { color: 'Gold, Orange', number: '1, 4', day: 'Sunday', gem: 'Ruby', dir: 'East' },
        { color: 'Green, Light Green', number: '5, 3', day: 'Wednesday', gem: 'Emerald', dir: 'South' },
        { color: 'White, Pastel', number: '6, 2', day: 'Friday', gem: 'Diamond', dir: 'West' },
        { color: 'Red, Crimson', number: '9, 1', day: 'Tuesday', gem: 'Red Coral', dir: 'South' },
        { color: 'Yellow, Gold', number: '3, 9', day: 'Thursday', gem: 'Yellow Sapphire', dir: 'Northeast' },
        { color: 'Navy, Black', number: '8, 4', day: 'Saturday', gem: 'Blue Sapphire', dir: 'West' },
        { color: 'Navy, Purple', number: '4, 8', day: 'Saturday', gem: 'Blue Sapphire', dir: 'West' },
        { color: 'Yellow, Gold', number: '3, 7', day: 'Thursday', gem: 'Yellow Sapphire', dir: 'Northeast' }
    ];

    const d = luckyData[lagnaSign];
    const lagnaRulers = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
    const html = `<div class="interp-card">
        <div class="interp-text">
            <strong>🎨 Lucky Color:</strong> ${d.color}<br>
            <strong>🔢 Lucky Number:</strong> ${d.number}<br>
            <strong>📅 Lucky Day:</strong> ${d.day}<br>
            <strong>💎 Lucky Gemstone:</strong> ${d.gem}<br>
            <strong>🧭 Lucky Direction:</strong> ${d.dir}<br>
            <strong>🪐 Lagna Ruling Planet:</strong> ${lagnaRulers[lagnaSign]}
        </div>
    </div>`;
    document.getElementById('luckyWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// Remedies & Strengthening Methods
// ═══════════════════════════════════════════════════
function renderRemedy(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    const DEBI = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };

    const remedies = {
        Sun: { gem: 'Ruby', mantra: 'Om Suryaya Namaha', color: 'Wear orange/red on Sundays', food: 'Wheat, saffron, sunflower seeds', charity: 'Donate wheat/copper on Sundays' },
        Moon: { gem: 'Pearl', mantra: 'Om Chandraya Namaha', color: 'Wear white/silver on Mondays', food: 'Milk, rice, coconut', charity: 'Donate rice/milk on Mondays' },
        Mars: { gem: 'Red Coral', mantra: 'Om Mangalaya Namaha', color: 'Wear red on Tuesdays', food: 'Lentils, red fruits', charity: 'Donate red lentils on Tuesdays' },
        Mercury: { gem: 'Emerald', mantra: 'Om Budhaya Namaha', color: 'Wear green on Wednesdays', food: 'Mung beans, green vegetables', charity: 'Donate green vegetables on Wednesdays' },
        Jupiter: { gem: 'Yellow Sapphire', mantra: 'Om Gurave Namaha', color: 'Wear yellow on Thursdays', food: 'Chickpeas, bananas, turmeric', charity: 'Donate yellow food/books on Thursdays' },
        Venus: { gem: 'Diamond', mantra: 'Om Shukraya Namaha', color: 'Wear white/pastel on Fridays', food: 'Milk, cream, fruits', charity: 'Donate white clothes/rice on Fridays' },
        Saturn: { gem: 'Blue Sapphire', mantra: 'Om Shanaishcharaya Namaha', color: 'Wear navy/black on Saturdays', food: 'Black beans, sesame seeds', charity: 'Donate black beans/oil on Saturdays' }
    };

    let html = '';
    positions.forEach(p => {
        if (!remedies[p.id]) return;
        const r = remedies[p.id];
        const isDebi = DEBI[p.id] === p.sign;
        const house = houseOf(p.sign);
        const isWeak = isDebi || [6, 8, 12].includes(house);

        if (isWeak) {
            html += `<div class="interp-card">
                <div class="interp-title">${p.symbol} ${p.name} Strengthening Methods ${isDebi ? '(Debilitated — Especially Important!)' : '(Weak Position)'}</div>
                <div class="interp-text">
                    <strong>💎 Gemstone:</strong> ${r.gem} (Recommended to wear on ring finger)<br>
                    <strong>🙏 Mantra:</strong> "${r.mantra}" (Chant 108 times daily)<br>
                    <strong>🎨 Color:</strong> ${r.color}<br>
                    <strong>🍽️ Food:</strong> ${r.food}<br>
                    <strong>🤝 Charity:</strong> ${r.charity}
                </div>
            </div>`;
        }
    });

    if (!html) {
        html = '<div class="interp-card"><div class="interp-text">All planets are in favorable positions! No special remedies are needed. For your lucky gemstone, wearing the gemstone of your Lagna ruling planet is recommended.</div></div>';
    }

    document.getElementById('remedyWrap').innerHTML = html;
}

// Enter key support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') _loadAstro(calculateChart);
});
// 분할 차트 (Divisional Charts) 계산
// ═══════════════════════════════════════

function getDivisionalSign(siderealLon, division) {
    const sign = Math.floor(siderealLon / 30);
    const degInSign = siderealLon % 30;
    const partSize = 30 / division;
    const part = Math.floor(degInSign / partSize);

    if (division === 7) {
        // D7 (Saptamsa): 홀수 사인은 같은 사인부터, 짝수 사인은 7번째 사인부터
        const startSign = (sign % 2 === 0) ? sign : (sign + 6) % 12;
        return (startSign + part) % 12;
    } else if (division === 10) {
        // D10 (Dasamsa): 홀수 사인은 같은 사인부터, 짝수 사인은 9번째 사인부터
        const startSign = (sign % 2 === 0) ? sign : (sign + 8) % 12;
        return (startSign + part) % 12;
    } else if (division === 12) {
        // D12 (드와Dasamsa): 같은 사인부터 시작
        return (sign + part) % 12;
    } else if (division === 60) {
        return (sign + part) % 12;
    }
    if (division === 2) {
        return (part === 0) ? ((sign % 2 === 0) ? 3 : 4) : ((sign % 2 === 0) ? 4 : 3);
    } else if (division === 3) {
        const d3starts = [0, 4, 8];
        return (sign + d3starts[part]) % 12;
    } else if (division === 4) {
        return (sign + part * 3) % 12;
    } else if (division === 16) {
        return (sign + part) % 12;
    } else if (division === 20) {
        const d20start = [0, 8, 4, 3][sign % 4];
        return (d20start + part) % 12;
    } else if (division === 24) {
        const d24start = (sign % 2 === 0) ? 4 : 3;
        return (d24start + part) % 12;
    } else if (division === 27) {
        const d27start = [0, 3, 6, 9][sign % 4];
        return (d27start + part) % 12;
    } else if (division === 30) {
        const d30odd = [0, 10, 8, 2, 6];
        const d30even = [1, 5, 11, 3, 7];
        const d30parts = [5, 5, 8, 7, 5];
        let cumDeg = 0;
        let d30part = 0;
        for (let i = 0; i < 5; i++) {
            cumDeg += d30parts[i];
            if (degInSign < cumDeg) { d30part = i; break; }
        }
        return (sign % 2 === 0) ? d30odd[d30part] : d30even[d30part];
    } else if (division === 40) {
        const d40start = (sign % 2 === 0) ? 0 : 6;
        return (d40start + part) % 12;
    } else if (division === 45) {
        const d45start = [0, 4, 8, 0][sign % 4];
        return (d45start + part) % 12;
    }
    return (sign + part) % 12; // fallback
}

function renderDivisionalChart(positions, lagnaSidereal, division, chartId, interpId, label, koName) {
    const chartEl = document.getElementById(chartId);
    const interpEl = document.getElementById(interpId);
    if (!chartEl) return;

    // 분할 라그나
    const dLagnaSign = getDivisionalSign(lagnaSidereal, division);

    // 분할 행성 위치
    const dPositions = positions.map(p => ({
        ...p,
        dSign: getDivisionalSign(p.sidereal, division)
    }));

    // 차트 렌더링
    chartEl.innerHTML = '';
    const signPlanets = {};
    for (let i = 0; i < 12; i++) signPlanets[i] = [];
    dPositions.forEach(p => { signPlanets[p.dSign].push(p); });

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement('div');
            const signIdx = SI_LAYOUT[row][col];
            if (signIdx === -1) {
                cell.className = 'chart-cell empty';
                cell.innerHTML = '<div style="font-size:11px;color:#444;text-align:center;">' + label + '<br>' + koName + '</div>';
            } else {
                cell.className = 'chart-cell';
                let content = '<div class="sign-label">' + SIGN_SYMBOLS[signIdx] + ' ' + SIGNS[signIdx] + '</div>';
                if (signIdx === dLagnaSign) content += '<div class="lagna-marker">ASC</div>';
                signPlanets[signIdx].forEach(p => {
                    const cls = (p.natural === 'malefic') ? 'planet malefic' : 'planet benefic';
                    content += '<div class="' + cls + '">' + p.symbol + '</div>';
                });
                cell.innerHTML = content;
            }
            chartEl.appendChild(cell);
        }
    }

    // 해석
    if (!interpEl) return;
    const SIGN_RULERS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
    const RULER_NAMES = {Sun:'Sun',Moon:'Moon',Mars:'Mars',Mercury:'Mercury',Jupiter:'Jupiter',Venus:'Venus',Saturn:'Saturn',Rahu:'Rahu',Ketu:'Ketu'};

    let html = '';

    if (division === 10) {
        // D10 해석: 직업/커리어
        const d10_1lord = SIGN_RULERS[dLagnaSign];
        const d10_10sign = (dLagnaSign + 9) % 12;
        const d10_10lord = SIGN_RULERS[d10_10sign];
        const d10_10planets = dPositions.filter(p => p.dSign === d10_10sign);

        html += '<div class="interp-card"><div class="interp-title">💼 D10 職業分析</div><div class="interp-text">';
        html += '<strong>D10 ラグナ：</strong> ' + SIGNS[dLagnaSign] + ' (支配星： ' + (RULER_NAMES[d10_1lord]||d10_1lord) + ')<br>';
        html += '<strong>D10 10室（職業）：</strong> ' + SIGNS[d10_10sign] + ' (支配星： ' + (RULER_NAMES[d10_10lord]||d10_10lord) + ')<br>';
        if (d10_10planets.length > 0) {
            html += '<strong>10室の惑星：</strong> ' + d10_10planets.map(p => p.name).join(', ') + '<br>';
        }

        // 직업 성향 by D10 라그나
        const careerBySign = [
            'リーダーシップ、軍事、スポーツ、起業家',  // 양자리
            '金融、芸術、不動産、飲食業',     // 황소
            'コミュニケーション、メディア、教育、IT',  // 쌍둥이
            '看護、不動産、ホテル、カウンセリング',    // 게
            '政治、エンターテインメント、管理、行政',        // 사자
            '医療、会計、分析、研究',          // 처녀
            '法律、外交、デザイン、コンサルティング',      // 천칭
            '調査、研究、医学、保険',          // 전갈
            '教育、宗教、貿易、出版',      // 사수
            '行政、建設、鉱業、公務員',        // 염소
            'IT、革新、NGO、航空',           // 물병
            '芸術、病院、海外、霊性'           // 물고기
        ];
        html += '<strong>適性分野：</strong> ' + careerBySign[dLagnaSign];
        html += '</div></div>';

    } else if (division === 7) {
        // D7 해석: 자녀
        const d7_5sign = (dLagnaSign + 4) % 12;
        const d7_5lord = SIGN_RULERS[d7_5sign];
        const d7_5planets = dPositions.filter(p => p.dSign === d7_5sign);
        const benefics = d7_5planets.filter(p => p.natural === 'benefic');
        const malefics = d7_5planets.filter(p => p.natural === 'malefic');

        html += '<div class="interp-card"><div class="interp-title">👶 D7 子供分析</div><div class="interp-text">';
        html += '<strong>D7 ラグナ：</strong> ' + SIGNS[dLagnaSign] + '<br>';
        html += '<strong>D7 5室（子供）：</strong> ' + SIGNS[d7_5sign] + ' (支配星： ' + (RULER_NAMES[d7_5lord]||d7_5lord) + ')<br>';
        if (d7_5planets.length > 0) {
            html += '<strong>5室の惑星：</strong> ' + d7_5planets.map(p => p.name).join(', ') + '<br>';
        }
        if (benefics.length > 0) html += '吉星が5室 — 子供に恵まれます。<br>';
        if (malefics.length > 0) html += '凶星が5室 — 子供に関する困難があり得ます。<br>';
        if (d7_5planets.length === 0) html += '5室に惑星なし — 5室主の位置を確認してください。';
        html += '</div></div>';

    } else if (division === 12) {
        // D12 해석: 부모
        const d12_4sign = (dLagnaSign + 3) % 12; // 4궁 = 어머니
        const d12_9sign = (dLagnaSign + 8) % 12; // 9궁 = 아버지
        const d12_4planets = dPositions.filter(p => p.dSign === d12_4sign);
        const d12_9planets = dPositions.filter(p => p.dSign === d12_9sign);

        html += '<div class="interp-card"><div class="interp-title">👨‍👩‍👧 D12 両親分析</div><div class="interp-text">';
        html += '<strong>D12 ラグナ：</strong> ' + SIGNS[dLagnaSign] + '<br>';
        html += '<strong>D12 4室（母）：</strong> ' + SIGNS[d12_4sign];
        if (d12_4planets.length > 0) html += ' — ' + d12_4planets.map(p => p.name).join(', ');
        html += '<br>';
        html += '<strong>D12 9室（父）：</strong> ' + SIGNS[d12_9sign];
        if (d12_9planets.length > 0) html += ' — ' + d12_9planets.map(p => p.name).join(', ');
        html += '<br>';

        const moon4 = d12_4planets.find(p => p.id === 'Moon');
        const sun9 = d12_9planets.find(p => p.id === 'Sun');
        if (moon4) html += '月が4室 — 母との深い絆。<br>';
        if (sun9) html += '太陽が9室 — 父との深い絆。<br>';
        html += '</div></div>';

    } else if (division === 60) {
        // D60 interpretation: Past life karma (sub-chapter structure)
        const d60_1lord = SIGN_RULERS[dLagnaSign];
        const d60_planets_1 = dPositions.filter(p => p.dSign === dLagnaSign);

        // Sub-chapter accordion helper
        function subChapter(icon, title, content) {
            return '<div style="margin:8px 0;border:1px solid #2a2a5a;border-radius:8px;overflow:hidden;">' +
                '<div onclick="var c=this.nextElementSibling;c.style.display=c.style.display===\'none\'?\'\':\'none\';this.querySelector(\'.sc-arrow\').textContent=c.style.display===\'none\'?\'▶\':\'▼\'" style="cursor:pointer;padding:12px 14px;background:linear-gradient(135deg,#12122a,#1a1a3e);">' +
                '<span style="font-size:15px;font-weight:700;color:#c9a84c;">' + icon + ' ' + title + '</span>' +
                '<span class="sc-arrow" style="float:right;color:#666;">▶</span></div>' +
                '<div style="display:none;padding:14px;">' + content + '</div></div>';
        }


        const D60_DEITIES = [
            {name:'Ghora',nature:'malefic',desc:'Destruction and fear. Dark karma from past life'},
            {name:'Rakshasa',nature:'malefic',desc:'Demonic energy. Strong desire and attachment'},
            {name:'Deva',nature:'benefic',desc:'Divine being. Past life merit and blessings'},
            {name:'Kubera',nature:'benefic',desc:'God of wealth. Wealth-building karma'},
            {name:'Yaksha',nature:'benefic',desc:'Nature guardian. Harmony with nature'},
            {name:'Kinnara',nature:'benefic',desc:'Celestial musician. Artistic talent'},
            {name:'Bhrashta',nature:'malefic',desc:'The fallen. Karma of falling from high'},
            {name:'Kulaghna',nature:'malefic',desc:'Family destroyer. Family-related karma'},
            {name:'Garala',nature:'malefic',desc:'Poison. Toxic actions karma'},
            {name:'Vahni',nature:'malefic',desc:'Fire god. Anger and destruction karma'},
            {name:'Maya',nature:'malefic',desc:'Illusion. Deception karma'},
            {name:'Purishaka',nature:'malefic',desc:'Bondage. Restraining others karma'},
            {name:'Apampathi',nature:'benefic',desc:'Lord of waters. Purification and healing'},
            {name:'Marut',nature:'benefic',desc:'Wind god. Freedom and change'},
            {name:'Kala',nature:'malefic',desc:'God of time. Time and death karma'},
            {name:'Sarpa',nature:'malefic',desc:'Serpent. Bondage and attachment — unable to let go'},
            {name:'Amrita',nature:'benefic',desc:'Nectar of immortality. Pursuit of eternal life'},
            {name:'Indu',nature:'benefic',desc:'Moon. Sensitivity and intuition'},
            {name:'Mridu',nature:'benefic',desc:'The gentle. Gentleness and compassion'},
            {name:'Komala',nature:'benefic',desc:'The delicate. Art and beauty'},
            {name:'Heramba',nature:'benefic',desc:'Ganesha avatar. Overcoming obstacles'},
            {name:'Brahma',nature:'benefic',desc:'Creator god. Creation and knowledge'},
            {name:'Vishnu',nature:'benefic',desc:'Preserver god. Protection and order'},
            {name:'Maheshwara',nature:'benefic',desc:'Great Lord Shiva. Transformation and liberation'},
            {name:'Deva2',nature:'benefic',desc:'Saint. Spiritual practice'},
            {name:'Bala',nature:'benefic',desc:'Strength. Fortitude and courage'},
            {name:'Vishwakarma',nature:'benefic',desc:'Cosmic architect. Building and creation'},
            {name:'Tamasa',nature:'malefic',desc:'Darkness. Ignorance karma'},
            {name:'Kanchana',nature:'benefic',desc:'Gold. Purity and value'},
            {name:'Varaha',nature:'benefic',desc:'Vishnu boar avatar. Salvation'},
            {name:'Ramasala',nature:'benefic',desc:'Abode of Rama. Morality and duty'},
            {name:'Ghrisha',nature:'benefic',desc:'The radiant. Wisdom and enlightenment'},
            {name:'Indra',nature:'benefic',desc:'King of gods. Leadership'},
            {name:'Jala',nature:'benefic',desc:'Water. Flow and adaptation'},
            {name:'Vishwa',nature:'benefic',desc:'Universe. Universal love'},
            {name:'Amara',nature:'benefic',desc:'Immortal. Pursuit of eternity'},
            {name:'Bala2',nature:'malefic',desc:'Young strength. Immature power use'},
            {name:'Pitri',nature:'malefic',desc:'Ancestors. Ancestral karma'},
            {name:'Rudra',nature:'malefic',desc:'Storm god. Destructive transformation'},
            {name:'Varuna',nature:'benefic',desc:'Ocean god. Cosmic order'},
            {name:'Aryama',nature:'benefic',desc:'太陽の守護神. Friendship and contracts'},
            {name:'Mitra',nature:'benefic',desc:'God of friendship. Trust and companionship'},
            {name:'Agni',nature:'malefic',desc:'Fire god. Purifying fire'},
            {name:'Varuna2',nature:'benefic',desc:'Ocean god. Deep wisdom'},
            {name:'Gauri',nature:'benefic',desc:'Parvati. Devotion and love'},
            {name:'Mahakala',nature:'malefic',desc:'Great Time. Trying to master time'},
            {name:'Pitamaha',nature:'benefic',desc:'Great Father Brahma. Creator'},
            {name:'Kartikeya',nature:'benefic',desc:'War god. Righteous battle'},
            {name:'Yama',nature:'malefic',desc:'God of death. Judgment and justice'},
            {name:'Kala2',nature:'malefic',desc:'Time. Chased by time'},
            {name:'Varuna3',nature:'benefic',desc:'Ocean god. Law and truth'},
            {name:'Kubera2',nature:'benefic',desc:'God of wealth. Generosity'},
            {name:'Aditya',nature:'benefic',desc:'Sun god. Light and truth'},
            {name:'Rishi',nature:'benefic',desc:'Sage. Wisdom and practice'},
            {name:'Vasu',nature:'benefic',desc:'Celestial being. Governing nature'},
            {name:'Ashwini',nature:'benefic',desc:'Twin healers. Healing'},
            {name:'Naga',nature:'malefic',desc:'Serpent deity. Mystery and secrets'},
            {name:'Gandharva',nature:'benefic',desc:'Celestial musician. Art and music'},
            {name:'Prajapati',nature:'benefic',desc:'Creator. Creating life'},
            {name:'Charachara',nature:'benefic',desc:'All things. Oneness with everything'}
        ];

        // Deity calculation helper
        function getDeity(siderealLon) {
            const deg = siderealLon % 30;
            const part = Math.floor(deg / 0.5);
            const sn = Math.floor(siderealLon / 30);
            const idx = (sn % 2 === 0) ? part : (59 - part);
            return {idx: idx, deity: D60_DEITIES[idx] || null};
        }
        function deityTag(d) {
            if (!d.deity) return '';
            const c = d.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f';
            return ' — 守護神： <strong>' + d.deity.name + '</strong> <span style="color:' + c + ';font-weight:700;">' + (d.deity.nature === 'benefic' ? '吉' : '凶') + '</span>';
        }

        const houseThemes = ['','自己','財/価値','コミュニケーション','家庭/安らぎ','創造/愛','奉仕/試練','関係','変革','知恵/宗教','職業/社会','願望/利益','解放'];

        const pastLifeThemes = [
            '戦士、指導者 — 権力を行使した前世。リーダーシップと決断力が魂に刻まれています。',
            '芸術家、農夫 — 自然と共に生きた前世。安定と物質的美への深い本能。',
            '学者、商人 — 知識で生きた前世。多才さと好奇心が残る。言語の才能。',
            '保護者、養育者 — 他者を世話した前世。深い感受性と母性本能。家庭のカルマ。',
            '王族、聖職者 — 高い地位にいた前世。自然な権威と尊厳。舞台に立つのが魂の本能。',
            '治癒者、奉仕者 — 医術や奉仕に従事した前世。優れた分析力。他者を助けるのが魂の本分。',
            '外交官、芸術家 — 調和と美を追求した前世。関係に長ける。パートナーシップが核心テーマ。',
            '修行者、錬金術師 — 深い変革を経た前世。秘密と神秘への強い引力。',
            '賢者、探検家 — 真理を追求した前世。霊的知恵と冒険心が残る。高等教育のカルマ。',
            '官僚、建築家 — 秩序を築いた前世。強い忍耐と責任感。規律が魂に刻まれる。',
            '官僚、秩序の守護者 — 社会秩序を築いた前世。組織力と奉仕精神。土星の支配。',
            '霊媒、芸術家 — 霊的世界と交流した前世。極めて強い直感。解脱に最も近い魂。'
        ];

        const d60SunInterp = [
            '戦士か王として生きた前世。強い自我とリーダーシップが残る。権威を確立する魂の目的。',
            '芸術家か富裕者として生きた前世。物質的豊かさを追求する魂。感覚的な美に惹かれる。',
            '学者か商人として生きた前世。知識とコミュニケーションが魂の核心テーマ。',
            '保護者か養育者として生きた前世。他者を世話するのが深い魂の本能。',
            '王族か聖職者として高い地位にいた前世。自然な権威が今生にも残る。',
            '治癒者か奉仕者として生きた前世。分析と奉仕が魂の目的。',
            '外交官か芸術家として調和を追求。関係と均衡が魂の課題。',
            '修行者として深い変革を経験。秘密が魂に刻まれている。',
            '賢者か探検家として真理を追求。知恵と冒険が魂の方向。',
            '官僚として秩序を築いた。体系と責任が魂に刻まれている。',
            '革新者として時代を先取り。独創的思考が魂の特性。',
            '霊的世界と交流。深い直感が魂に残る。'
        ];
        const d60MoonInterp = [
            '激しく燃える感情的記憶。怒りと情熱が刻まれ、感情を制御することが課題。',
            '温かく安定した感情的記憶。豊かさの記憶が残り、美しいものを求める。',
            '知的で多彩な感情的記憶。多くの経験、強い好奇心。',
            '非常に深い感情的記憶。家庭と世話の強い記憶、豊かな感受性。',
            '誇りと尊厳で満ちた感情的記憶。認められ尊敬された記憶が残る。',
            '奉仕と分析の感情的記憶。助けた記憶が残り、思いやりの心。',
            '調和と関係の感情的記憶。美しい関係の記憶、パートナーを求める。',
            '深く強烈な感情的記憶。劇的な変化の記憶、海のような感情の深さ。',
            '自由と探求の感情的記憶。旅と学びの記憶、拡大を追求。',
            '責任と忍耐の感情的記憶。重い荷の記憶、成熟した感情。',
            'ユニークで非凡な感情的記憶。異なっていた記憶、独立した感性。',
            '霊的で超越的な感情的記憶。鮮明な夢、深い霊的つながり。'
        ];

        // Parashara quote
        html += '<div class="interp-card" style="border-left:3px solid #8b7ec8;"><div class="interp-text" style="font-size:13px;color:#888;">';
        html += '📜 <strong>パラシャラ曰く：</strong> "シャシュティアムシャ（D60）は全分割チャートの中で最も重要である。吉神の分割にある惑星は良い結果を、凶神の分割にある惑星は悪い結果をもたらす。"<br>';
        html += '<span style="color:#666;">— ブリハット・パラシャラ・ホーラ・シャーストラ（BPHS）</span></div></div>';

        // Ch1: Soul Identity
        const lagnaD = getDeity(lagnaSidereal);
        let ch1 = '<strong>D60 ラグナ： ' + SIGNS[dLagnaSign] + ' ' + SIGN_SYMBOLS[dLagnaSign] + '</strong> (支配星： ' + (RULER_NAMES[d60_1lord]||d60_1lord) + ')' + deityTag(lagnaD) + '<br><br>';
        ch1 += pastLifeThemes[dLagnaSign] + '<br>';
        if (lagnaD.deity) {
            ch1 += '<br>' + (lagnaD.deity.nature === 'benefic' ?
                '<strong>' + lagnaD.deity.name + '</strong> がラグナを守護。 ' + lagnaD.deity.desc + ' — 前世の功徳が今生を守護。自然に良い機会が訪れます。' :
                '<strong>' + lagnaD.deity.name + '</strong> がラグナに影響。 ' + lagnaD.deity.desc + ' — カルマ的試練が性格に刻まれていますが、克服すれば大きな成長があります。');
        }
        if (d60_planets_1.length > 0) ch1 += '<br><br>' + d60_planets_1.map(p => p.name).join(', ') + ' がD60ラグナに位置 — 核心カルマがこれらの惑星に集中。';
        html += subChapter('🪐', '魂の正体 — 前世での姿', ch1);

        // Ch2: Soul Purpose (Sun)
        const sunD60 = dPositions.find(p => p.id === 'Sun');
        if (sunD60) {
            const sunD = getDeity(sunD60.sidereal);
            let ch2 = '<strong>D60 太陽： ' + SIGNS[sunD60.dSign] + ' ' + SIGN_SYMBOLS[sunD60.dSign] + '</strong>' + deityTag(sunD) + '<br><br>';
            ch2 += (d60SunInterp[sunD60.dSign] || '') + '<br>';
            if (sunD.deity) {
                ch2 += '<br>太陽の守護神 <strong>' + sunD.deity.name + '</strong>: ' + sunD.deity.desc + '. ' + (sunD.deity.nature === 'benefic' ? '魂の目的を正しく追求、自己実現が自然に訪れます。' : '前世で自我と権威への試練、真の自己を見つけることが課題。');
            }
            html += subChapter('☉', '魂の目的 — なぜ生まれたのか', ch2);
        }

        // Ch3: Emotional Memory (Moon)
        const moonD60 = dPositions.find(p => p.id === 'Moon');
        if (moonD60) {
            const moonD = getDeity(moonD60.sidereal);
            let ch3 = '<strong>D60 月： ' + SIGNS[moonD60.dSign] + ' ' + SIGN_SYMBOLS[moonD60.dSign] + '</strong>' + deityTag(moonD) + '<br><br>';
            ch3 += (d60MoonInterp[moonD60.dSign] || '') + '<br>';
            if (moonD.deity) {
                ch3 += '<br>月の守護神 <strong>' + moonD.deity.name + '</strong>: ' + moonD.deity.desc + '. ' + (moonD.deity.nature === 'benefic' ? '前世で心が平和、感情的安定と直感が生まれつき。' : '感情的な傷が無意識に残存。瞑想と水辺の休息が助けになります。');
            }
            html += subChapter('☽', '感情の記憶 — 無意識のパターン', ch3);
        }

        // Ch4: Spouse Karma
        const d60H7sign = (dLagnaSign + 6) % 12;
        const d60H7lord = SIGN_RULERS[d60H7sign];
        const d60H7planets = dPositions.filter(p => p.dSign === d60H7sign);
        const venusD60 = dPositions.find(p => p.id === 'Venus');
        const rahuD60 = dPositions.find(p => p.id === 'Rahu');
        const ketuD60 = dPositions.find(p => p.id === 'Ketu');

        const spouseKarma = ['戦士/指導者との縁。強烈で独立的な配偶者カルマ。','芸術家/富裕者との縁。物質的に豊かな結婚カルマ。','学者/商人との縁。コミュニケーションと知的交感。','家族/保護者との縁。深い感情的絆のカルマ。','王族/貴族との縁。華麗で尊敬される結婚。','治癒者/奉仕者との縁。奉仕と献身のカルマ。','外交官/芸術家との縁。調和のとれた美しい結婚。','修行者/神秘主義者との縁。強烈で変革的なカルマ。','賢者/探検家との縁。自由で拡大的なカルマ。外国人配偶者の可能性。','官僚/建築家との縁。責任感のある安定した結婚。晩婚の可能性。','官僚/軍人との縁。土星支配、規律ある配偶者。年齢差の可能性。','霊媒/芸術家との縁。神秘的で霊的なカルマ。夢で先に出会う可能性。'];

        let ch4 = '<strong>D60 7室： ' + SIGNS[d60H7sign] + ' ' + SIGN_SYMBOLS[d60H7sign] + '</strong> (7室主： ' + (RULER_NAMES[d60H7lord]||d60H7lord) + ')<br><br>';
        ch4 += spouseKarma[d60H7sign] + '<br>';
        if (d60H7planets.length > 0) {
            ch4 += '<br><strong>D60 7室の惑星：</strong><br>';
            d60H7planets.forEach(p => {
                const pD = getDeity(p.sidereal);
                ch4 += p.symbol + ' <strong>' + p.name + '</strong>' + deityTag(pD) + '<br>';
                ch4 += (p.natural === 'benefic' ? '吉星が7室 — 配偶者と良いカルマ、今生で祝福。' : '凶星が7室 — 配偶者との未解決カルマ、今生で清算。') + '<br>';
            });
        }
        if (venusD60) {
            const venD = getDeity(venusD60.sidereal);
            const venH = ((venusD60.dSign - dLagnaSign + 12) % 12) + 1;
            ch4 += '<br><strong>♀ 金星（愛のカラカ）</strong> → D60 ' + venH + 'H (' + houseThemes[venH] + ')' + deityTag(venD) + '<br>';
            ch4 += venD.deity && venD.deity.nature === 'benefic' ? '金星が吉神の保護下。美しい愛が待っています。' : '金星が凶神の影響下。真の愛の意味を学ぶことが課題。';
        }
        if (rahuD60 && ketuD60) {
            const rahuH = ((rahuD60.dSign - dLagnaSign + 12) % 12) + 1;
            const ketuH = ((ketuD60.dSign - dLagnaSign + 12) % 12) + 1;
            if (rahuH === 7 || ketuH === 7 || rahuH === 1 || ketuH === 1) {
                ch4 += '<br><br>🔥 <strong>ラフ・ケートゥ軸が1-7室！</strong> 配偶者との非常に強い前世の縁。運命的に出会います。';
            }
        }
        const h7lordPlanet = dPositions.find(p => p.id === d60H7lord);
        if (h7lordPlanet) {
            const h7lH = ((h7lordPlanet.dSign - dLagnaSign + 12) % 12) + 1;
            ch4 += '<br><br><strong>7th Lord ' + (RULER_NAMES[d60H7lord]||d60H7lord) + '</strong> → D60 ' + h7lH + 'H (' + houseThemes[h7lH] + ')' + deityTag(getDeity(h7lordPlanet.sidereal)) + '<br>';
            ch4 += '配偶者カルマの発現領域： <strong>' + houseThemes[h7lH] + '</strong> area.';
        }
        html += subChapter('💍', '配偶者カルマ — 前世の縁', ch4);

        // Ch5: Career Karma
        const d60H10sign = (dLagnaSign + 9) % 12;
        const d60H10lord = SIGN_RULERS[d60H10sign];
        const d60H10planets = dPositions.filter(p => p.dSign === d60H10sign);
        const satD60 = dPositions.find(p => p.id === 'Saturn');
        const careerKarma = ['軍事/リーダーシップ/スポーツ','金融/芸術/農業','教育/メディア/商業','看護/不動産/ホテル','政治/エンターテインメント/管理','医療/分析/奉仕','法律/外交/デザイン','研究/調査/医学','教育/宗教/海外','行政/建設/公務員','技術/科学/革新','芸術/霊性/病院'][d60H10sign];

        let ch5 = '<strong>D60 10室： ' + SIGNS[d60H10sign] + ' ' + SIGN_SYMBOLS[d60H10sign] + '</strong> (10室主： ' + (RULER_NAMES[d60H10lord]||d60H10lord) + ')<br><br>';
        ch5 += '前世の職業カルマの方向： <strong>' + careerKarma + '</strong>。この分野に自然な引力。<br>';
        if (satD60) {
            const satD = getDeity(satD60.sidereal);
            const satH = ((satD60.dSign - dLagnaSign + 12) % 12) + 1;
            ch5 += '<br><strong>♄ 土星（カルマの主）</strong> → D60 ' + satH + 'H (' + houseThemes[satH] + ')' + deityTag(satD) + '<br>';
            ch5 += satD.deity && satD.deity.nature === 'benefic' ? 'Saturn under benefic — <strong>非常に稀な祝福！</strong> 忍耐の功徳が職業的試練を減らします。' : '土星が凶神の下 — 重い職業カルマ。忍耐、奉仕、マントラで溶かしましょう。';
        }
        if (d60H10planets.length > 0) ch5 += '<br><br><strong>D60 10室の惑星：</strong> ' + d60H10planets.map(p => p.name).join(', ') + ' — 職業カルマがここに集中。';
        html += subChapter('💼', '職業カルマ — 前世の使命', ch5);

        // Ch6: Wealth Karma
        const d60H2sign = (dLagnaSign + 1) % 12;
        const d60H2planets = dPositions.filter(p => p.dSign === d60H2sign);
        const wealthKarma = ['自力型の財運本能。','豊かな環境の前世。','知的な富の構築。','家族/不動産の財。','権威を通じた財。','奉仕を通じた財。倹約。','パートナーシップの財。','他者の財（遺産）。','幸運がもたらす財。海外。','遅いが確実。中年以降裕福。','革新の財。非伝統的。','霊的活動と財。寄付の傾向。'][d60H2sign];
        let ch6 = '<strong>D60 2室： ' + SIGNS[d60H2sign] + ' ' + SIGN_SYMBOLS[d60H2sign] + '</strong><br><br>' + wealthKarma + '<br>';
        if (d60H2planets.length > 0) {
            ch6 += '<br><strong>D60 2室の惑星：</strong><br>';
            d60H2planets.forEach(p => {
                ch6 += p.symbol + ' ' + p.name + deityTag(getDeity(p.sidereal)) + ' — ' + (p.natural === 'benefic' ? '良い財運カルマ。豊かさ。' : '財運の試練。努力で克服。') + '<br>';
            });
        }
        html += subChapter('💰', '財運カルマ — 前世の富', ch6);

        // Ch7: Deity List (compact)
        let ch7 = '';
        const lagnaD2 = getDeity(lagnaSidereal);
        if (lagnaD2.deity) { const lc = lagnaD2.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f'; ch7 += '<div style="padding:4px 0;">⬆ Lagna → <strong>' + lagnaD2.deity.name + '</strong> <span style="color:' + lc + ';">' + (lagnaD2.deity.nature === 'benefic' ? 'B' : 'M') + '</span></div>'; }
        positions.forEach(p => {
            const pD = getDeity(p.sidereal);
            if (pD.deity) { const c = pD.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f'; ch7 += '<div style="padding:4px 0;">' + p.symbol + ' ' + p.name + ' → <strong>' + pD.deity.name + '</strong> <span style="color:' + c + ';">' + (pD.deity.nature === 'benefic' ? 'B' : 'M') + '</span></div>'; }
        });
        html += subChapter('🕉️', '守護神一覧', ch7);

        // Ch8: Overall Judgment
        const beneficCount = positions.filter(p => { const pD = getDeity(p.sidereal); return pD.deity && pD.deity.nature === 'benefic'; }).length;
        const maleficPlanets = positions.filter(p => { const pD = getDeity(p.sidereal); return pD.deity && pD.deity.nature === 'malefic'; });
        let ch8 = '9惑星中： <strong style="color:#5cb85c">' + beneficCount + '吉</strong>, <strong style="color:#d9534f">' + (positions.length - beneficCount) + '凶</strong><br><br>';
        if (beneficCount >= 7) ch8 += '🌟 <strong>非常に強い前世の功徳。</strong> パラシャラはこれを「神々に祝福された魂」と呼びました。 ほとんどの惑星が吉神の下。';
        else if (beneficCount >= 5) { ch8 += '✨ <strong>前世の功徳が豊富。</strong> 吉神が優勢、多くの領域で保護。'; if (maleficPlanets.length > 0) ch8 += ' 注意： <strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong> — マントラと慈善を実践。'; }
        else if (beneficCount >= 3) { ch8 += '⚖️ <strong>カルマの均衡。</strong> 良い出来事と試練が交互に。'; if (maleficPlanets.length > 0) ch8 += '<br>Watch: <strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong>'; }
        else ch8 += '🔥 <strong>カルマ清算の人生。</strong> パラシャラは「最も重いカルマが最大の成長をもたらす」と言いました。 マントラと慈善が重要。';
        html += subChapter('📊', '総合カルマ判定', ch8);

    } else if (division === 2) {
        // D2 Hora — Wealth accumulation
        const d2LagnaInterp = ['自力で財を築く。独立的で積極的な投資。','感覚的投資と安定した財運。不動産、飲食、芸術収入。','知的活動で稼ぐ。執筆、教育、ビジネスセンス。','不動産と家族収入。母からの財産。感情的支出に注意。','リーダーシップと権威で財を築く。政府、金関連。見栄の支出。','分析力と技術で収入。医療、会計、サービス業。倹約家。','パートナーシップで財を築く。法律、外交、ファッション。','他人のお金（遺産、保険、投資）で富を築く。隠れた財源。','教育、海外、宗教を通じた収入。幸運が財をもたらす。','体系的な努力で財を築く。遅いが確実。中年以降裕福。','技術、革新、ネットワークで収入。非伝統的な財源。','霊的・芸術的活動で収入。海外関連の財。寄付の傾向。'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">💰 D2 ホーラ — 財運分析</div><div class="interp-text">';
        html += '<strong>D2 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d2LagnaInterp + '<br><br>';
        const sunD2 = dPositions.find(p => p.id === 'Sun');
        const moonD2 = dPositions.find(p => p.id === 'Moon');
        if (sunD2) html += '<strong>☉ Sun → ' + SIGNS[sunD2.dSign] + ':</strong> ' + (sunD2.dSign === 4 ? '🌟 <strong>太陽が自分のホーラ（獅子座）！</strong> 自力型。権威とリーダーシップで富を築きます。' : '太陽が月のホーラ。他者の助けや政府・公共部門を通じた収入。') + '<br>';
        if (moonD2) html += '<strong>☽ Moon → ' + SIGNS[moonD2.dSign] + ':</strong> ' + (moonD2.dSign === 3 ? '🌟 <strong>月が自分のホーラ（蟹座）！</strong> 人々や関係を通じて豊かな生活。' : '月が太陽のホーラ。自分の努力と独立した活動で生計。') + '<br>';
        const d2H2sign = (dLagnaSign + 1) % 12;
        const d2H2planets = dPositions.filter(p => p.dSign === d2H2sign);
        html += '<br><strong>D2 2室（蓄積された財産） — ' + SIGNS[d2H2sign] + ':</strong><br>';
        if (d2H2planets.length > 0) {
            const wealth = {Sun:'権威と地位を通じた財産',Moon:'大衆的活動を通じた財産',Mars:'不動産、技術、競争分野',Mercury:'ビジネス、知的活動、通信',Jupiter:'教育、法律、宗教 — 豊かな財産',Venus:'芸術、ファッション、高級品',Saturn:'ゆっくりだが着実な蓄積。中年以降安定',Rahu:'非伝統的方法、海外関連',Ketu:'物質から離れる。霊的価値を追求'};
            d2H2planets.forEach(p => { html += '• ' + p.name + ': ' + (wealth[p.id]||'') + '<br>'; });
        } else html += '2室に惑星なし — 2室主の位置が財運の鍵。<br>';
        html += '</div></div>';

    } else if (division === 3) {
        const d3LagnaInterp = ['独立的、兄弟姉妹の中でリーダー。勇敢なコミュニケーション。','安定的で物質的に豊かな兄弟関係。芸術的な兄弟の可能性。','知的でコミュニケーション豊かな兄弟。多くの兄弟か会話が多い。','感情的に深い兄弟の絆。母性的な兄弟。保護的。','カリスマ的で誇り高い兄弟。有名か成功した兄弟。','分析的で実用的な兄弟。医療・教育分野。批判的な面も。','外交的で魅力的な兄弟。兄弟を通じた社交的つながり。','強烈で秘密の多い兄弟関係。対立後の深い絆。','自由で哲学的な兄弟。海外の兄弟。宗教・教育関連。','責任感と野心のある兄弟。義務感。兄弟が少ないか真剣な関係。','ユニークで独立的な兄弟。非伝統的な兄弟関係。','霊的で芸術的な兄弟。海外の兄弟。感情的なつながり。'][dLagnaSign];
        const d3_3sign = (dLagnaSign + 2) % 12;
        const d3_3planets = dPositions.filter(p => p.dSign === d3_3sign);

        html += '<div class="interp-card"><div class="interp-title">👫 D3 ドレッカナ — 兄弟姉妹と勇気</div><div class="interp-text">';
        html += '<strong>D3 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d3LagnaInterp + '<br><br>';
        html += '<strong>D3 3室（弟妹） — ' + SIGNS[d3_3sign] + ':</strong><br>';
        if (d3_3planets.length > 0) {
            const bro = {Sun:'弟妹がリーダーシップと権威を持つ',Moon:'弟妹と感情的に近い',Mars:'活動的で勇敢な弟妹。対立の可能性',Mercury:'知的でコミュニケーション上手な弟妹',Jupiter:'知恵深く幸運をもたらす弟妹',Venus:'魅力的で芸術的な弟妹',Saturn:'弟妹との困難。年齢差がある可能性',Rahu:'ユニークな弟妹か海外との縁',Ketu:'弟妹との距離感。霊的なつながり'};
            d3_3planets.forEach(p => { html += '• ' + p.name + ': ' + (bro[p.id]||'') + '<br>'; });
        } else html += '3室に惑星なし — 3室主の位置を確認。<br>';
        html += '</div></div>';

    } else if (division === 4) {
        const d4LagnaInterp = ['積極的に不動産を取得。新居の建設や購入を好む。','安定した豊富な不動産。土地と農場。贅沢な住居。','複数の家か頻繁な引っ越し。知的な環境を好む。','家と不動産が感情的に重要。水辺。母からの不動産。','壮大で広い家。豪華なインテリア。一等地。','清潔で実用的な住居。健康重視の環境。小さな物件を複数所有。','美しく調和のとれた家。インテリアに興味。パートナーとの不動産。','不動産が変革を経る。相続不動産。秘密の場所。','広い土地と海外不動産。宗教・教育施設の近く。','体系的な不動産投資。古い建物。遅いが確実な資産成長。','ユニークな住居スタイル。モダンなアパート。テクノロジー関連。','水辺の美しい家。海外不動産。霊的な空間。'][dLagnaSign];
        const d4_4sign = (dLagnaSign + 3) % 12;
        const d4_4planets = dPositions.filter(p => p.dSign === d4_4sign);

        html += '<div class="interp-card"><div class="interp-title">🏠 D4 チャトゥルタムシャ — 不動産と幸運</div><div class="interp-text">';
        html += '<strong>D4 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d4LagnaInterp + '<br><br>';
        html += '<strong>D4 4室（不動産） — ' + SIGNS[d4_4sign] + ':</strong><br>';
        if (d4_4planets.length > 0) {
            const prop = {Sun:'政府所有の建物か威厳ある住居',Moon:'美しい家。水辺。母の影響',Mars:'新築。不動産紛争の可能性',Mercury:'商業不動産。複数所有',Jupiter:'広くて豊かな家！最高の不動産運',Venus:'豪華な家。美しいインテリア',Saturn:'古い家。修繕必要。中年以降安定',Rahu:'海外不動産。非伝統的な住居',Ketu:'不動産に無関心。霊的空間を好む'};
            d4_4planets.forEach(p => { html += '• ' + p.name + ': ' + (prop[p.id]||'') + '<br>'; });
        } else html += '4室に惑星なし — 4室主の位置が不動産の鍵。<br>';
        html += '</div></div>';

    } else if (division === 24) {
        const d24LagnaInterp = ['Physical education, military, leadership training.','Music, art, culinary, finance education.','Language, literature, communication, media education.','History, psychology, home science education.','Political science, theater, business education.','Medicine, science, statistics education. Precise learning.','Law, diplomacy, design education. Balanced learning.','Psychology, research, investigation, occult education.','Philosophy, theology, international studies. Study abroad likely.','Business, administration, architecture. Systematic learning.','IT, engineering, aviation, social science. Innovative learning.','Art, music, spirituality, film studies. Intuitive learning.'][dLagnaSign];
        const d24_4sign = (dLagnaSign + 3) % 12;
        const d24_5sign = (dLagnaSign + 4) % 12;
        const d24_4planets = dPositions.filter(p => p.dSign === d24_4sign);
        const jupD24 = dPositions.find(p => p.id === 'Jupiter');
        const merD24 = dPositions.find(p => p.id === 'Mercury');

        html += '<div class="interp-card"><div class="interp-title">📚 D24 チャトゥルヴィムシャムシャ — 教育</div><div class="interp-text">';
        html += '<strong>D24 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d24LagnaInterp + '<br><br>';
        html += '<strong>D24 4室（基礎教育） — ' + SIGNS[d24_4sign] + ':</strong><br>';
        if (d24_4planets.length > 0) {
            const edu4 = {Sun:'Prestigious school. Authoritative education',Moon:'Comfortable learning environment. Strong home education',Mars:'Competitive learning. Strong in sports/tech',Mercury:'Best placement! Outstanding academic ability',Jupiter:'Rich educational environment. Good teachers',Venus:'Art education. Beautiful school',Saturn:'Difficult education but deep knowledge when overcome',Rahu:'Unconventional education. Foreign school',Ketu:'Less interest in formal education. Intuitive learning'};
            d24_4planets.forEach(p => { html += '• ' + p.name + ': ' + (edu4[p.id]||'') + '<br>'; });
        } else html += '4室に惑星なし。<br>';
        if (jupD24) { const jH = ((jupD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>♃ 木星（知恵） → ' + jH + '室：</strong> ' + ([1,4,5,9].includes(jH) ? '🎓 <strong>高い学業成就が期待されます！</strong> 大学院・博士・留学の可能性。' : '学びを通じた成長。木星の祝福が' + jH + '.') + '<br>'; }
        if (merD24) { const mH = ((merD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<strong>☿ 水星（学習） → ' + mH + '室：</strong> ' + ([1,4,5,9].includes(mH) ? '📖 <strong>優れた知的能力！</strong> 数学、言語、分析に才能。' : '知的能力が発揮される室：' + mH + '.') + '<br>'; }
        html += '</div></div>';

    } else if (division === 30) {
        const d30LagnaInterp = ['Accidents, burns, headaches. Problems from hasty decisions. Manage anger.','Financial loss, dietary issues, thyroid. Watch overeating and attachment.','Nervous anxiety, insomnia, breathing problems. Avoid excessive worry.','Emotional instability, stomach issues, water-related problems. Control emotions.','Heart problems, pride damage, overwork. Need humility and rest.','Digestive disorders, allergies, perfectionism stress. Need relaxation.','Kidney problems, relationship conflicts, indecisiveness. Need decisiveness.','Secrets, accidents, surgery, sexual issues. Regular checkups important.','Liver problems, overweight, gambling/overspending. Need moderation.','Joint, bone, depression, loneliness. Need calcium and social interaction.','Blood pressure, circulation, unexpected accidents. Regular health checks.','Immune deficiency, addiction, mental health. Need meditation and sleep.'][dLagnaSign];
        const d30_6sign = (dLagnaSign + 5) % 12;
        const d30_8sign = (dLagnaSign + 7) % 12;
        const d30_12sign = (dLagnaSign + 11) % 12;
        const d30_6planets = dPositions.filter(p => p.dSign === d30_6sign);
        const d30_8planets = dPositions.filter(p => p.dSign === d30_8sign);

        html += '<div class="interp-card"><div class="interp-title">⚠️ D30 トリムシャムシャ — 不運と疾病</div><div class="interp-text">';
        html += '<strong>D30 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d30LagnaInterp + '<br><br>';
        const diseaseBySign = ['Head, brain, fever, inflammation','Neck, thyroid, diabetes','Lungs, nerves, anxiety','Stomach, water retention','Heart, back, blood pressure','Digestive, intestines, skin','Kidneys, lower back, urinary','Reproductive, chronic disease','Liver, thighs, overweight','Bones, joints, rheumatism','Circulation, blood pressure, ankles','Immune, feet, mental health'];
        html += '<strong>D30 6室（疾病） — ' + SIGNS[d30_6sign] + ':</strong><br>';
        html += '注意すべき点： <strong>' + diseaseBySign[d30_6sign] + '</strong><br>';
        if (d30_6planets.length > 0) {
            const dis = {Sun:'Eye, heart-related illness',Moon:'Mental health, water-related issues',Mars:'Accidents, surgery, burns',Mercury:'Nervous system, skin problems',Jupiter:'Liver, overweight',Venus:'Kidneys, diabetes, STDs',Saturn:'Chronic illness, joint problems',Rahu:'Unknown cause illness, addiction',Ketu:'Immune deficiency, allergies'};
            d30_6planets.forEach(p => { html += '• ' + p.name + ': ' + (dis[p.id]||'') + '<br>'; });
        }
        html += '<br><strong>D30 8室（危険） — ' + SIGNS[d30_8sign] + ':</strong><br>';
        if (d30_8planets.length > 0) {
            d30_8planets.forEach(p => { html += '• ' + p.name + ': ' + (p.natural === 'malefic' ? '危険・事故注意。保険と定期検診が重要。' : '危機から保護されます。') + '<br>'; });
        } else html += '8室に惑星なし — 危険リスク低い。<br>';
        html += '</div></div>';

    } else if (division === 40) {
        const d40LagnaInterp = ['Independent, strong-willed mother. Leadership inherited from maternal line.','Mother manages wealth well. Material abundance from maternal line.','Intellectual mother with good communication. Language/education talent inherited.','Very deep bond with mother. Sensitivity and intuition inherited.','Mother has authority and dignity. Leadership and honor inherited.','Mother excels at health management. Analytical/service spirit inherited.','Attractive, diplomatic mother. Artistic sense inherited.','Strong mother who went through transformation. Resilience inherited.','Educational, religious mother. Wisdom/philosophy inherited.','Responsible, strict mother. Patience and discipline inherited.','Unique, progressive mother. Innovative thinking inherited.','Spiritual, intuitive mother. Art/spirituality inherited.'][dLagnaSign];
        const moonD40 = dPositions.find(p => p.id === 'Moon');

        html += '<div class="interp-card"><div class="interp-title">👩 D40 カヴェダムシャ — 母系の遺産</div><div class="interp-text">';
        html += '<strong>D40 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d40LagnaInterp + '<br>';
        if (moonD40) { const mH = ((moonD40.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☽ 月（母のカラカ） → ' + mH + '室：</strong> ' + ['','母が自分に強い影響','母からの財産','母とのコミュニケーション良好','母との深い絆！最高の配置','創造的な母','奉仕的な母','母が人間関係に影響','母からの遺産','宗教的・教育的な母','社会的に成功した母','独立的な母','霊的な母'][mH] + '<br>'; }
        html += '</div></div>';

    } else if (division === 45) {
        const d45LagnaInterp = ['Active, action-oriented father. Courage and leadership inherited.','Financially stable father. Material values inherited.','Intellectual, versatile father. Communication/business ability inherited.','Emotional, family-oriented father. Caring instinct inherited.','Authoritative, respected father. Leadership inherited.','Practical, diligent father. Analytical/technical skills inherited.','Diplomatic, refined father. Social ability inherited.','Strong, mysterious father. Resilience/insight inherited.','Scholarly, religious father. Philosophy/morality inherited.','Strict, ambitious father. Patience/discipline inherited.','Creative, innovative father. Tech/scientific thinking inherited.','Spiritual, artistic father. Intuition/creativity inherited.'][dLagnaSign];
        const sunD45 = dPositions.find(p => p.id === 'Sun');

        html += '<div class="interp-card"><div class="interp-title">👨 D45 アクシャヴェダムシャ — 父系の遺産</div><div class="interp-text">';
        html += '<strong>D45 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d45LagnaInterp + '<br>';
        if (sunD45) { const sH = ((sunD45.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☉ 太陽（父のカラカ） → ' + sH + '室：</strong> ' + ['','父が自分に強い影響','父からの財産','父とのコミュニケーション良好','家庭的な父','創造的な父','奉仕的な父','父が人間関係に影響','父からの遺産','宗教的・教育的な父','社会的に成功した父！最高の配置','独立的な父','霊的な父'][sH] + '<br>'; }
        html += '</div></div>';
    }

    interpEl.innerHTML = html;
}


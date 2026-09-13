// ============================================================
// VEDIC ASTROLOGY ENGINE
// ============================================================
if (!window.vedicMode) window.vedicMode = 'easy';
var _lastCalcData = null;
function recalcMode() {
    if (!_lastCalcData) return;
    var d = _lastCalcData;
    renderInterpretation(d.positions, d.lagnaSign, d.moonPos);
    renderPlanetHouse(d.positions, d.lagnaSign);
    renderDignity(d.positions, d.lagnaSign);
    renderEducation(d.positions, d.lagnaSign);
    renderChildren(d.positions, d.lagnaSign);
    renderForeign(d.positions, d.lagnaSign);
    renderLucky(d.lagnaSign, d.moonPos);
    renderRemedy(d.positions, d.lagnaSign);
    renderNakshatra(d.moonPos);
    renderDasha(d.moonNakshatra, d.utcDate, d.moonPos ? d.moonPos.sidereal : 0);
    renderD9Chart(d.positions, d.lagnaSign, d.lagnaSidereal);
}
function updateCatHeaders() {
    var e = window.vedicMode === 'easy';
    // Category headers updated dynamically
}

// Ayanamsa (Lahiri) - approximate
function getAyanamsa(jd) {
    // Lahiri ayanamsa approximation
    const T = (jd - 2451545.0) / 36525.0;
    return 23.85 + 0.0137 * (jd - 2451545.0) / 365.25;
}

// Zodiac signs
const SIGNS = ['Aries','Touro','Gemeos','Cancer','Leao','Virgem',
               'Libra','Escorpiao','Sagitario','Capricornio','Aquario','Peixes'];
const SIGNS_EN = ['Aries','Touro','Gemeos','Cancer','Leao','Virgem',
                  'Libra','Escorpiao','Sagitario','Capricornio','Aquario','Peixes'];
const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

// Planets
const PLANETS = [
    { id: 'Sun', name: 'Sol', symbol: '☉', natural: 'malefic' },
    { id: 'Moon', name: 'Lua', symbol: '☽', natural: 'benefic' },
    { id: 'Mars', name: 'Marte', symbol: '♂', natural: 'malefic' },
    { id: 'Mercury', name: 'Mercurio', symbol: '☿', natural: 'neutral' },
    { id: 'Jupiter', name: 'Jupiter', symbol: '♃', natural: 'benefic' },
    { id: 'Venus', name: 'Venus', symbol: '♀', natural: 'benefic' },
    { id: 'Saturn', name: 'Saturno', symbol: '♄', natural: 'malefic' },
];

// Nakshatras (27 lunar mansions)
const NAKSHATRAS = [
    { name: 'Ashwini', ko: 'Ashwini', ruler: 'Ketu', meaning: 'Horse Twins', deity: 'Ashwini Kumaras', desc: 'Energy of healing and new beginnings. A person with quick action and healing abilities.' },
    { name: 'Bharani', ko: 'Bharani', ruler: 'Venus', meaning: 'The Bearer', deity: 'Yama', desc: 'The cycle of life and death. Strong patience and the power to lead change.' },
    { name: 'Krittika', ko: 'Krittika', ruler: 'Sun', meaning: 'The Cutter', deity: 'Agni', desc: 'The power of fire and purification. Sharp intellect and decisiveness.' },
    { name: 'Rohini', ko: 'Rohini', ruler: 'Moon', meaning: 'The Red Star', deity: 'Brahma', desc: 'The star of abundance and beauty. A creative and charming personality.' },
    { name: 'Mrigashira', ko: 'Mrigashira', ruler: 'Mars', meaning: 'Deer\'s Head', deity: 'Soma', desc: 'The star of exploration and curiosity. A tireless traveler seeking truth.' },
    { name: 'Ardra', ko: 'Ardra', ruler: 'Rahu', meaning: 'Teardrop', deity: 'Rudra', desc: 'Rebirth through storm and destruction. Intense emotions and transformative power.' },
    { name: 'Punarvasu', ko: 'Punarvasu', ruler: 'Jupiter', meaning: 'Return of Light', deity: 'Aditi', desc: 'The star of recovery and return. An optimistic and wise personality.' },
    { name: 'Pushya', ko: 'Pushya', ruler: 'Saturn', meaning: 'The Nourisher', deity: 'Brihaspati', desc: 'The most auspicious nakshatra. Energy of nurturing, protection, and prosperity.' },
    { name: 'Ashlesha', ko: 'Ashlesha', ruler: 'Mercury', meaning: 'The Entwiner', deity: 'Nagas', desc: 'Serpent wisdom and mystery. Insight and deep intuition.' },
    { name: 'Magha', ko: 'Magha', ruler: 'Ketu', meaning: 'The Great', deity: 'Pitris', desc: 'The star of royalty. Authority, respect, and ancestral blessings.' },
    { name: 'Purva Phalguni', ko: 'Purva Phalguni', ruler: 'Venus', meaning: 'Former Fruit', deity: 'Bhaga', desc: 'The star of joy and love. Artistic sense and romance.' },
    { name: 'Uttara Phalguni', ko: 'Uttara Phalguni', ruler: 'Sun', meaning: 'Latter Fruit', deity: 'Aryaman', desc: 'The star of friendship and contracts. Trust and devotion.' },
    { name: 'Hasta', ko: 'Hasta', ruler: 'Moon', meaning: 'The Hand', deity: 'Savitar', desc: 'The star of craftsmanship and skill. Healing hands, the artist.' },
    { name: 'Chitra', ko: 'Chitra', ruler: 'Mars', meaning: 'Shining Jewel', deity: 'Vishwakarma', desc: 'The star of beauty and creation. Exceptional aesthetic sense.' },
    { name: 'Swati', ko: 'Swati', ruler: 'Rahu', meaning: 'The Independent', deity: 'Vayu', desc: 'The freedom of wind. An independent and flexible personality.' },
    { name: 'Vishakha', ko: 'Vishakha', ruler: 'Jupiter', meaning: 'The Forked', deity: 'Indra-Agni', desc: 'The star of goals and determination. Strong focus and willpower.' },
    { name: 'Anuradha', ko: 'Anuradha', ruler: 'Saturn', meaning: 'Following Radha', deity: 'Mitra', desc: 'The star of friendship and devotion. Organizational skills and leadership.' },
    { name: 'Jyeshtha', ko: 'Jyeshtha', ruler: 'Mercury', meaning: 'The Eldest', deity: 'Indra', desc: 'The star of protection and authority. Strong sense of responsibility.' },
    { name: 'Mula', ko: 'Mula', ruler: 'Ketu', meaning: 'The Root', deity: 'Nirriti', desc: 'The star of destruction and rebuilding. One who seeks the root of truth.' },
    { name: 'Purva Ashadha', ko: 'Purva Ashadha', ruler: 'Venus', meaning: 'Former Invincible', deity: 'Apas', desc: 'The power of water and purification. Hidden victorious energy.' },
    { name: 'Uttara Ashadha', ko: 'Uttara Ashadha', ruler: 'Sun', meaning: 'Latter Invincible', deity: 'Vishvedevas', desc: 'The star of ultimate victory. Patience and leadership.' },
    { name: 'Shravana', ko: 'Shravana', ruler: 'Moon', meaning: 'The Listener', deity: 'Vishnu', desc: 'The star of knowledge and listening. A master of learning and communication.' },
    { name: 'Dhanishta', ko: 'Dhanishta', ruler: 'Mars', meaning: 'The Wealthiest', deity: 'Vasus', desc: 'The star of abundance and music. Talent and prosperity.' },
    { name: 'Shatabhisha', ko: 'Shatabhisha', ruler: 'Rahu', meaning: 'Hundred Healers', deity: 'Varuna', desc: 'The star of secrets and healing. Mysterious healing abilities.' },
    { name: 'Purva Bhadrapada', ko: 'Purva Bhadrapada', ruler: 'Jupiter', meaning: 'Former Lucky Feet', deity: 'Aja Ekapada', desc: 'The star of fire and transformation. Spiritual awakening.' },
    { name: 'Uttara Bhadrapada', ko: 'Uttara Bhadrapada', ruler: 'Saturn', meaning: 'Latter Lucky Feet', deity: 'Ahir Budhnya', desc: 'Wisdom of the deep ocean. Meditation and spiritual depth.' },
    { name: 'Revati', ko: 'Revati', ruler: 'Mercury', meaning: 'The Wealthy', deity: 'Pushan', desc: 'The star of travel and protection. The completion of all things.' },
];

// Dasha periods (years)
const DASHA_YEARS = {
    'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
    'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
};
const DASHA_ORDER = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
const DASHA_KO = {
    'Ketu': 'Ketu', 'Venus': 'Venus', 'Sun': 'Sun', 'Moon': 'Moon', 'Mars': 'Mars',
    'Rahu': 'Rahu', 'Jupiter': 'Jupiter', 'Saturn': 'Saturn', 'Mercury': 'Mercury'
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
    renderDivisionalChart(positions, lagnaSidereal, 10, 'd10Chart', 'd10InterpWrap', 'D10', 'Dasamsa');
    renderDivisionalChart(positions, lagnaSidereal, 7, 'd7Chart', 'd7InterpWrap', 'D7', 'Saptamsa');
    renderDivisionalChart(positions, lagnaSidereal, 12, 'd12Chart', 'd12InterpWrap', 'D12', 'Dwadasamsa');
    renderDivisionalChart(positions, lagnaSidereal, 60, 'd60Chart', 'd60InterpWrap', 'D60', 'Shashtiamsa');
    renderDivisionalChart(positions, lagnaSidereal, 2, 'd2Chart', 'd2InterpWrap', 'D2', 'Hora');
    renderDivisionalChart(positions, lagnaSidereal, 3, 'd3Chart', 'd3InterpWrap', 'D3', 'Drekkana');
    renderDivisionalChart(positions, lagnaSidereal, 4, 'd4Chart', 'd4InterpWrap', 'D4', 'Chaturthamsa');
    renderDivisionalChart(positions, lagnaSidereal, 16, 'd16Chart', 'd16InterpWrap', 'D16', 'Shodasamsa');
    renderDivisionalChart(positions, lagnaSidereal, 20, 'd20Chart', 'd20InterpWrap', 'D20', 'Vimsamsa');
    renderDivisionalChart(positions, lagnaSidereal, 24, 'd24Chart', 'd24InterpWrap', 'D24', 'Chaturvimsamsa');
    renderDivisionalChart(positions, lagnaSidereal, 27, 'd27Chart', 'd27InterpWrap', 'D27', 'Saptavimsamsa');
    renderDivisionalChart(positions, lagnaSidereal, 30, 'd30Chart', 'd30InterpWrap', 'D30', 'Trimsamsa');
    renderDivisionalChart(positions, lagnaSidereal, 40, 'd40Chart', 'd40InterpWrap', 'D40', 'Khavedamsa');
    renderDivisionalChart(positions, lagnaSidereal, 45, 'd45Chart', 'd45InterpWrap', 'D45', 'Akshavedamsa');
    renderNakshatra(moonPos);
    renderDasha(moonNakshatra, utcDate, moonPos ? moonPos.sidereal : 0);
    _lastCalcData = {positions, lagnaSign, moonPos, lagnaSidereal, moonNakshatra, utcDate};
    renderInterpretation(positions, lagnaSign, moonPos);
    renderPlanetHouse(positions, lagnaSign);
    renderEducation(positions, lagnaSign);
    renderChildren(positions, lagnaSign);
    renderForeign(positions, lagnaSign);
    renderDignity(positions, lagnaSign);
    renderLucky(lagnaSign, moonPos);
    renderRemedy(positions, lagnaSign);

    document.getElementById('resultSection').style.display = 'block';
    updateCatHeaders();
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

function renderPlanetTable(positions, lagnaSign, lagnaSidereal) {
    let html = '<table class="planet-table"><thead><tr>';
    html += '<th>Planeta</th><th>Signo</th><th>Grau</th><th>Nakshatra</th><th>Casa</th>';
    html += '</tr></thead><tbody>';

    // Add Lagna first with exact degree
    const lagnaDeg = lagnaSidereal % 30;
    const lagnaNakIdx = Math.floor(lagnaSidereal / (360/27));
    const lagnaNak = NAKSHATRAS[lagnaNakIdx] || {name:"-"};
    html += `<tr><td>⬆ ASC</td><td>${SIGN_SYMBOLS[lagnaSign]} ${SIGNS[lagnaSign]}</td><td>${lagnaDeg.toFixed(1)}°</td><td>${lagnaNak.name}</td><td>1</td></tr>`;

    positions.forEach(p => {
        const house = ((p.sign - lagnaSign + 12) % 12) + 1;
        const nak = NAKSHATRAS[p.nakshatra] || { ko: '-', name: '-' };
        const roleMap = { Sun:'Eu/Autoridade', Moon:'Emocoes/Mente', Mars:'Energia/Coragem', Mercury:'Inteligencia/Comunicacao', Jupiter:'Sorte/Sabedoria', Venus:'Amor/Charme', Saturn:'Paciencia/Responsabilidade', Rahu:'Desejo/Inovacao', Ketu:'Espiritualidade/Libertacao' };
        const houseArea = ['','Eu','Dinheiro/Familia','Comunicacao','Lar','Filhos/Romance','Saude','Conjuge','Transformacao','Sorte/Exterior','Carreira','Renda','Exterior/Espiritualidade'];
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
    const isEasy = window.vedicMode === 'easy';
    const SIGN_RULERS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
    const RULER_NAMES = {Sun:"Sol",Moon:"Lua",Mars:"Marte",Mercury:"Mercúrio",Jupiter:"Júpiter",Venus:"Vênus",Saturn:"Saturno",Rahu:"Rahu",Ketu:"Ketu"};

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
        "Liderança, militar, esportes, empreendedorismo (pioneiro de fogo)",
        "Finanças, agricultura, artes, imóveis, alimentação (estabilidade & material)",
        "Comunicação, mídia, escrita, ensino, marketing (intelectual)",
        "Enfermagem, cuidados, culinária, hospitalidade, aconselhamento (cuidado emocional)",
        "Política, entretenimento, liderança, criatividade (palco brilhante)",
        "Medicina, contabilidade, análise, edição, saúde/bem-estar (serviço preciso)",
        "Direito, diplomacia, design, moda, mediação (equilíbrio & beleza)",
        "Pesquisa, investigação, medicina, ocultismo, psicologia (profundidade & transformação)",
        "Educação, viagens, filosofia, religião, publicação (expansão & exploração)",
        "Governo, construção, gestão, CEO, líder organizacional (sistema & autoridade)",
        "Tecnologia, TI, invenção, ativismo social, ciência (inovação)",
        "Artes, espiritualidade, cura, música, caridade (transcendência & serviço)"
    ];

    const planetCareer = {
        Sun: "Funcionário público, político, médico, CEO — posições de autoridade",
        Moon: "Enfermeiro/a, conselheiro/a, chef, hospitalidade — funções de cuidado/emocionais",
        Mars: "Militar, policial, cirurgião, engenheiro, atleta",
        Mercury: "Escritor, professor, programador, contador, comerciante",
        Jupiter: "Professor universitário, juiz, líder religioso, consultor, profissional sênior",
        Venus: "Designer, ator, músico, moda, indústria da beleza",
        Saturn: "Construção, mineração, agricultura, gestão, artesão",
        Rahu: "TI, relacionado ao exterior, carreiras não convencionais, pesquisa",
        Ketu: "Espiritualidade, medicina alternativa, pesquisa, asceta"
    };

    let html = '';

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '🕉️ Você após o casamento: ${SIGNS[d9LagnaSign]} ${SIGN_SYMBOLS[d9LagnaSign]}' : '🕉️ D9 Lagna — Você após o casamento: ${SIGNS[d9LagnaSign]} ${SIGN_SYMBOLS[d9LagnaSign]}') + '</div>
        <div class="interp-text">
            O Navamsa Lagna está em <strong>${SIGNS[d9LagnaSign]}</strong>. Isso revela o seu verdadeiro eu após o casamento e na segunda metade da vida (após os 30 anos).
            ${d9LagnaSign === d1LagnaSign ? '<br><br><strong>D1 e D9 Lagna estão no mesmo signo!</strong> Isso se chama <strong>Vargottama</strong> — extremamente poderoso. Sua essência permanece inalterada após o casamento, o eu interior e exterior estão alinhados.' : ''}
            ${d9H1Planets.length > 0 ? '<br><br><strong>Planetas na 1ª casa do D9:</strong> ' + d9H1Planets.map(p => p.symbol + ' ' + p.name).join(', ') + ' — Esses planetas influenciam fortemente sua personalidade após o casamento.' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '💍 Caráter do cônjuge: ${SIGNS[d9H7Sign]} ${SIGN_SYMBOLS[d9H7Sign]}' : '💍 D9 7ª Casa — Caráter do cônjuge: ${SIGNS[d9H7Sign]} ${SIGN_SYMBOLS[d9H7Sign]}') + '</div>
        <div class="interp-text">
            A 7ª casa do Navamsa está em <strong>${SIGNS[d9H7Sign]}</strong>, regida por <strong>${RULER_NAMES[d9H7Ruler]}</strong>.<br><br>
            Isso revela a personalidade central do seu cônjuge — alguém com a energia de ${SIGNS[d9H7Sign]}.
            ${d9H7Planets.length > 0 ? '<br><br><strong>Planetas na 7ª casa do D9:</strong><br>' + d9H7Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${p.natural === 'benefic' ? 'Benéfico! Você recebe energia positiva do seu cônjuge.' : 'Maléfico — desafios no casamento, mas também oportunidades de crescimento.'}`).join('<br>') : '<br><br>Nenhum planeta na 7ª casa — a posição do regente da 7ª é mais importante.'}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '💼 Propósito de vida (Dharma): ${SIGNS[d9H10Sign]} ${SIGN_SYMBOLS[d9H10Sign]}' : '💼 D9 10ª Casa — Propósito de vida (Dharma): ${SIGNS[d9H10Sign]} ${SIGN_SYMBOLS[d9H10Sign]}') + '</div>
        <div class="interp-text">
            A 10ª casa do Navamsa está em <strong>${SIGNS[d9H10Sign]}</strong>, regida por <strong>${RULER_NAMES[d9H10Ruler]}</strong>.<br><br>
            Enquanto a 10ª do D1 mostra sua carreira, a 10ª do D9 revela seu <strong>propósito de vida maior (Dharma)</strong> — a verdadeira vocação que você segue após a maturidade.<br><br>
            <strong>Direção do propósito:</strong> ${careerBySgn[d9H10Sign]}
            ${d9H10Planets.length > 0 ? '<br><br><strong>Planetas na 10ª casa do D9:</strong><br>' + d9H10Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${planetCareer[p.id] || "Energia de carreira única"}`).join('<br>') : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">👔 Carreira do cônjuge — 10ª derivada (D9 4ª Casa): ${SIGNS[d9H4Sign]} ${SIGN_SYMBOLS[d9H4Sign]}</div>
        <div class="interp-text">
            <strong>Princípio da casa derivada:</strong> A 10ª da 7ª (cônjuge) = a 4ª casa do D9 mostra a carreira/atividade social do seu cônjuge.<br><br>
            A 4ª casa do D9 está em <strong>${SIGNS[d9H4Sign]}</strong>, regida por <strong>${RULER_NAMES[d9H4Ruler]}</strong>.<br><br>
            <strong>Tendência de carreira do cônjuge:</strong> ${careerBySgn[d9H4Sign]}
            ${d9H4Planets.length > 0 ? '<br><br><strong>Planetas na 4ª do D9 (10ª do cônjuge):</strong><br>' + d9H4Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: O cônjuge provavelmente trabalha em ${planetCareer[p.id] || "área especializada"}`).join('<br>') : ''}
        </div>
    </div>`;

    const vargottamaPlanets = d9Positions.filter(p => p.sign === p.d9Sign);
    if (vargottamaPlanets.length > 0) {
        html += `<div class="interp-card">
            <div class="interp-title">⭐ Planetas Vargottama — Excepcionalmente fortes</div>
            <div class="interp-text">
                Planetas no mesmo signo em D1 e D9 são chamados de <strong>Vargottama</strong>. São muito poderosos, sua energia atua de forma consistente ao longo da vida.<br><br>
                ${vargottamaPlanets.map(p => `<strong>${p.symbol} ${p.name}</strong>: Em ${SIGNS[p.sign]} em D1 e D9 — energia excepcionalmente forte!`).join('<br>')}
            </div>
        </div>`;
    }

    // 6. Spouse Direction — 6 Indicator Combined Analysis
    const DIRECTIONS = {
        0:"Leste", 1:"Sul", 2:"Oeste", 3:"Norte",
        4:"Leste", 5:"Sul", 6:"Oeste", 7:"Norte",
        8:"Leste", 9:"Sul", 10:"Oeste", 11:"Norte"
    };
    const DIR_DETAIL = {
        0:"Leste (Áries — fogo)",1:"Sul (Touro — terra)",2:"Oeste (Gêmeos — ar)",3:"Norte (Câncer — água)",
        4:"Leste (Leão — fogo)",5:"Sul (Virgem — terra)",6:"Oeste (Libra — ar)",7:"Norte (Escorpião — água)",
        8:"Leste (Sagitário — fogo)",9:"Sul (Capricórnio — terra)",10:"Oeste (Aquário — ar)",11:"Norte (Peixes — água)"
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
        {name:"D1 7ª Casa", sign: d1H7Sign, desc:"Casa do cônjuge no mapa natal"},
        {name:"D9 7ª Casa", sign: d9H7Sign, desc:"Casa do cônjuge no Navamsa"},
        {name:"Regente 7ª D9", sign: d9H7RulerSign, desc:"Onde vai o regente da 7ª do D9"},
        {name:"D9 Vênus", sign: venusD9Sign, desc:"Karaka do cônjuge no Navamsa"},
        {name:"Upapada (UL)", sign: ulSign, desc:"12ª Arudha — origem do cônjuge"},
        {name:"Darapada (A7)", sign: a7Sign, desc:"7ª Arudha — imagem social do cônjuge"}
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
        <div class="interp-title">🧭 Direção do cônjuge — Análise com 6 indicadores</div>
        <div class="interp-text">
            A astrologia védica determina a direção do cônjuge combinando múltiplos indicadores.<br><br>
            <strong>6 Indicadores:</strong><br>
            ${dirSources.map(s => `• <strong>${s.name}</strong>: ${SIGNS[s.sign]} ${SIGN_SYMBOLS[s.sign]} → <strong>${DIRECTIONS[s.sign]}</strong> <span style="color:#666;font-size:12px;">(${s.desc})</span>`).join('<br>')}
            <br><br>
            <strong>🧿 Upapada Lagna (UL):</strong> Arudha da 12ª — família/origem do cônjuge → <strong>${SIGNS[ulSign]} ${SIGN_SYMBOLS[ulSign]}</strong><br>
            <strong>🎯 Darapada (A7):</strong> Arudha da 7ª — imagem social do cônjuge → <strong>${SIGNS[a7Sign]} ${SIGN_SYMBOLS[a7Sign]}</strong><br>
            <strong>💍 Regente 7ª D9 (${RULER_NAMES[d9H7Ruler]}):</strong> Onde o regente da 7ª do Navamsa está → <strong>${SIGNS[d9H7RulerSign]} ${SIGN_SYMBOLS[d9H7RulerSign]}</strong><br>
            <strong>♀ D9 Vênus:</strong> Karaka do cônjuge no Navamsa → <strong>${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}</strong><br><br>
            <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:14px;margin-top:10px;">
                <strong style="font-size:16px;">🧭 Conclusão: direção ${agreement >= 4 ? 'esmagadoramente forte' : agreement >= 3 ? 'muito forte' : agreement >= 2 ? 'forte' : ''} ${primaryDir}</strong><br><br>
                <strong>${agreement}</strong> de 6 indicadores apontam para <strong>${primaryDir}</strong>.
                ${agreement >= 4 ? '<br>4+ indicadores concordam! <strong>Probabilidade muito alta</strong> de encontrar o cônjuge vindo da direção ' + primaryDir + '. Preste atenção a cidades, locais de trabalho ou viagens nessa direção.' : ''}
                ${agreement === 3 ? '<br>3 indicadores concordam — <strong>alta probabilidade</strong> da direção ' + primaryDir + '.' : ''}
                ${agreement === 2 ? '<br>2 indicadores concordam — ' + primaryDir + ' é favorecida, mas outras possibilidades existem.' : ''}
                ${agreement <= 1 ? '<br>Os indicadores estão dispersos — o cônjuge pode vir de várias direções. Mantenha a mente aberta.' : ''}
                ${sortedDirs.length > 1 && sortedDirs[1][1] === sortedDirs[0][1] ? '<br><br>💡 Duas direções igualmente indicadas: <strong>' + sortedDirs[0][0] + '</strong> e <strong>' + sortedDirs[1][0] + '</strong>.' : ''}
            </div>
        </div>
    </div>`;

    const meetingBySgn = [
        "Lugares ativos, esportes, ambientes competitivos, reuniões de líderes. Primeiro encontro intenso e repentino.",
        "Local de trabalho, instituições financeiras, restaurantes, natureza. Construção lenta de confiança.",
        "Redes sociais, escola, seminários, durante viagens, encontros arranjados. O relacionamento começa com uma conversa.",
        "Apresentações familiares, reuniões de bairro, amigos de infância. Começa em ambientes confortáveis.",
        "Festas, shows, reuniões criativas, locais glamorosos. Primeiro encontro dramático.",
        "Local de trabalho, hospital, atividades relacionadas à saúde, voluntariado. O encontro parte de necessidades práticas.",
        "Encontros arranjados, eventos jurídicos/diplomáticos, exposições de arte. Encontro elegante e refinado.",
        "Situações de crise, conversas profundas, lugares secretos, laboratórios de pesquisa. Atração fatal e intensa.",
        "No exterior, universidade, reuniões religiosas/filosóficas, durante viagens. Conexão de longe. Pode ser de outra cultura.",
        "Local de trabalho, eventos de negócios, funções oficiais. Encontro relacionado ao status social.",
        "Online, clubes de hobby, movimentos sociais, amigo de um amigo. Encontro único e não convencional.",
        "Reuniões espirituais, no exterior, artes/música, hospital, pistas em sonhos. Encontro místico e predestinado."
    ];

    const backgroundBySgn = [
        "Família independente e autossuficiente. Forte herança de liderança.",
        "Família financeiramente estável. Valores tradicionais. Origem possivelmente abastada.",
        "Família intelectual e comunicativa. Ênfase na educação.",
        "Lar acolhedor e familiar. Forte figura materna.",
        "Família prestigiosa e orgulhosa. Status social e reputação.",
        "Família prática e trabalhadora. Contexto saúde/médico/educação.",
        "Família equilibrada e digna. Contexto artes/direito/diplomacia.",
        "Família com segredos ou transformações. Profunda história familiar.",
        "Família erudita, religiosa/filosófica. Possível origem estrangeira.",
        "Família rígida e tradicional. Respeitada socialmente. Ênfase na responsabilidade.",
        "Estrutura familiar livre e única. Pensamento progressista.",
        "Família espiritual ou artística. Possível origem estrangeira. Rica sensibilidade."
    ];

    const imageBySgn = [
        "Primeira impressão energética e confiante. Imagem esportiva ou forte.",
        "Primeira impressão calma e confiável. Imagem refinada e digna.",
        "Primeira impressão viva e falante. Imagem intelectual e espirituosa.",
        "Primeira impressão calorosa e carinhosa. Imagem suave e atenciosa.",
        "Primeira impressão glamorosa e carismática. Imagem confiante.",
        "Primeira impressão organizada e arrumada. Imagem meticulosa e profissional.",
        "Primeira impressão elegante e encantadora. Imagem equilibrada e sofisticada.",
        "Primeira impressão misteriosa e intensa. Imagem profunda e carismática.",
        "Primeira impressão livre e vibrante. Imagem positiva e aventureira.",
        "Primeira impressão séria e madura. Imagem responsável e confiável.",
        "Primeira impressão única e individualista. Imagem moderna e original.",
        "Primeira impressão sonhadora e mística. Imagem artística e emocional."
    ];

    const attractBySgn = [
        "Energia forte e confiança. A natureza proativa e protetora é atraente.",
        "Estabilidade e charme sensual. Apreciar boa comida, aromas e texturas.",
        "Sagacidade e habilidade na conversa. A estimulação intelectual é a atração.",
        "Cuidado dedicado e emoção. Sentir-se em casa junto é o charme.",
        "Presença radiante e generosidade. Sentir-se especial juntos é atraente.",
        "Consideração delicada e perfeccionismo. A atenção aos detalhes é encantadora.",
        "Elegância e personalidade harmoniosa. O mundo fica bonito juntos.",
        "Olhar intenso e profundidade. O foco que atravessa a alma é a atração.",
        "Espírito livre e humor. As aventuras começam quando vocês estão juntos.",
        "Confiabilidade sólida e maturidade. A estabilidade inabalável é atraente.",
        "Individualidade única e pensamento progressista. Uma novidade nunca vista antes.",
        "Sensibilidade mística e profundidade espiritual. O romance onírico é o charme."
    ];

    const d1H7ForMeeting = (d1LagnaSign + 6) % 12;

    html += `<div class="interp-card">
        <div class="interp-title">🤝 Onde você conhece seu cônjuge ' + (isEasy ? '— 7ª: ${SIGNS[d1H7ForMeeting]} ${SIGN_SYMBOLS[d1H7ForMeeting]}' : '— D1 7ª: ${SIGNS[d1H7ForMeeting]} ${SIGN_SYMBOLS[d1H7ForMeeting]}') + '</div>
        <div class="interp-text">
            O signo da 7ª casa revela o ambiente e as circunstâncias do encontro com seu cônjuge.<br><br>
            <strong>${meetingBySgn[d1H7ForMeeting]}</strong>
            ${d1H7ForMeeting === 8 || d1H7ForMeeting === 11 ? '<br><br>💡 <strong>Possibilidade de cônjuge estrangeiro!</strong> Signos relacionados à 9ª (exterior) ou 12ª casa (residência no estrangeiro) estão na 7ª, sugerindo que o cônjuge pode ser estrangeiro ou que vocês podem se conhecer no exterior.' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">🏛️ Origem familiar do cônjuge — UL: ${SIGNS[ulSign]} ${SIGN_SYMBOLS[ulSign]}</div>
        <div class="interp-text">
            O Upapada Lagna (UL) revela o ambiente familiar e a criação do seu cônjuge.<br><br>
            <strong>${backgroundBySgn[ulSign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">👤 Primeira impressão do cônjuge — A7: ${SIGNS[a7Sign]} ${SIGN_SYMBOLS[a7Sign]}</div>
        <div class="interp-text">
            O Darapada (A7) mostra como seu cônjuge aparece para o mundo — sua imagem externa e primeira impressão.<br><br>
            <strong>${imageBySgn[a7Sign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">💎 Ponto de atração do cônjuge ' + (isEasy ? '— Vênus: ${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}' : '— D9 Vênus: ${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}') + '</div>
        <div class="interp-text">
            Vênus no Navamsa revela o charme central e o estilo amoroso do seu cônjuge.<br><br>
            <strong>${attractBySgn[venusD9Sign]}</strong>
        </div>
    </div>`;

    document.getElementById('d9InterpWrap').innerHTML = html;
}


function renderNakshatra(moonPos) {
    const isEasy = window.vedicMode === 'easy';
    if (!moonPos) return;
    const nak = NAKSHATRAS[moonPos.nakshatra];
    if (!nak) return;

    const html = `
        <div class="nakshatra-card">
            <div class="nakshatra-name">${nak.name}</div>
            <div class="nakshatra-meaning">"${nak.meaning}" — Planeta regente: ${DASHA_KO[nak.ruler] || nak.ruler}</div>
            <div class="nakshatra-detail">
                Divindade: ${nak.deity}<br><br>
                ${nak.desc}
            </div>
        </div>
    `;
    document.getElementById('nakshatraWrap').innerHTML = html;
}

function renderDasha(moonNakshatra, birthDate, moonSidereal) {
    const isEasy = window.vedicMode === 'easy';
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

    let html = '<div class="interp-card" style="margin-bottom:12px;border-left:3px solid #c9a84c;"><div class="interp-text" style="font-size:12px;color:#888;">💡 <strong>Vimshottari Dasha</strong> — A vida é dividida em períodos regidos por 9 planetas. <strong>Mahadasha</strong> is the major period, <strong>Antardasha (Bhukti)</strong> is the sub-period within it. Calculado a partir da posição do nakshatra lunar.<br><br>';
    html += '🌙 Lua natal: <strong>' + nak.ko + ' (' + nak.name + ')</strong> — Primeiro Dasha: <strong>' + DASHA_KO[startRuler] + '</strong> (restante: ' + remainingYears.toFixed(2) + ' anos)</div></div>';

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
        const dashaEasyDesc = {Ketu:'Reflexão interior e crescimento espiritual',Venus:'Amor, beleza e abundância',Sun:'Confiança e liderança brilham',Moon:'Emoções e lar são protagonistas',Mars:'Desafios e energia de ação',Rahu:'Grandes mudanças e novas oportunidades',Jupiter:'Sorte e crescimento chegam',Saturn:'Paciência traz grandes recompensas',Mercury:'Estudo, comunicação e negócios prosperam'};
        html += '<span class="dasha-planet">' + (isEasy ? dashaEasyDesc[p.planet] : DASHA_KO[p.planet]) + '</span>';
        html += '<span class="dasha-period">' + fmtDate(p.startD) + ' ~ ' + fmtDate(p.endD) + '</span>';
        html += '<span class="dasha-years">' + (p.actualDays / 365.25).toFixed(1) + ' anos</span>';
        if (isCurrent) html += '<span class="dasha-badge">Current</span>';
        html += '<span style="font-size:10px;color:#666;margin-left:4px;">(age ' + age + ') ▼</span>';

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
            html += '<span>' + (bCurrent ? '▶ ' : '  ') + (isEasy ? dashaEasyDesc[bPlanet] : DASHA_KO[p.planet] + '-' + DASHA_KO[bPlanet]) + '</span>';
            html += '<span>' + fmtDate(bStart) + '</span>';
            html += '<span>(age ' + bAge + ')</span>';
            html += '</div>';

            bhuktiDate = bEnd;
        }

        html += '</div></div>';
    });

    html += '</div>';
    document.getElementById('dashaWrap').innerHTML = html;
}
function renderInterpretation(positions, lagnaSign, moonPos) {
    const isEasy = window.vedicMode === 'easy';
    // Helper: get house number from sign
    function houseOf(signIdx) { return ((signIdx - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    let html = '';

    // ═══════════════════════════════════
    // 1. Personality & Appearance (1st House Lagna)
    // ═══════════════════════════════════
    const lagnaEasy = [
        'Pessoa de ação! Decisivo/a com qualidades de liderança. Adora novos desafios. Um pouco impaciente, mas incrivelmente motivado/a.',
        'Ama estabilidade. Aprecia conforto e beleza. Uma vez decidido/a, vai até o fim. Teimoso/a mas confiável.',
        'Curiosidade infinita! Ótimo/a comunicador/a e multitalentoso/a. Às vezes disperso/a, mas isso faz parte do seu charme.',
        'Caloroso/a e emocional. Valoriza a família e lê bem as emoções. Um/a cuidador/a natural que faz todos se sentirem confortáveis.',
        'Líder nato/a! Grande presença que atrai naturalmente a atenção. Confiante e magnético/a. Generoso/a com amor.',
        'Detalhista e analítico/a. Busca a perfeição. Observador/a que nota o que outros perdem. Preocupa-se muito, mas sempre preparado/a.',
        'Busca harmonia. Refinado/a e charmoso/a com excelente gosto artístico. Mais feliz cercado/a de coisas bonitas.',
        'Profundidade. Forte intuição que penetra até a verdade. Calmo/a por fora mas emoções intensas por dentro.',
        'Espírito livre! Ama viajar e aprender. Positivo/a e filosófico/a. Seu humor ilumina qualquer lugar.',
        'Ambicioso/a. Paciente e cada vez mais atraente com a idade. Trabalha sistematicamente em direção aos objetivos. Tipo de sucesso tardio.',
        'Único/a. Pensa diferente de todos. Odeia caixas e quer mudar o mundo do seu jeito.',
        'Profundamente sensível. Forte intuição atraída por arte e espiritualidade. Sonhos vívidos. Seu mundo interior é mais rico que o exterior.'
    ];
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
        const moonEasy = [
        'Uma paixão ardente queima dentro de você. Emoções sobem rápido e descem rápido. Quando estressado/a, precisa se mover — exercício funciona melhor.',
        'Emocionalmente muito estável. Não gosta de mudanças bruscas. Boa comida, música e natureza te curam. Uma vez que dá seu coração, raramente muda.',
        'Processa emoções conversando. Falar ajuda a organizar os sentimentos. Curioso/a e não suporta tédio. Seu humor pode aliviar qualquer ambiente.',
        'Extremamente sensível e empático/a. Absorve as emoções dos outros como uma esponja. O lar é seu refúgio. Cozinhar ou decorar traz paz emocional.',
        'Expressão emocional dramática e apaixonada. Precisa profundamente ser amado/a. Mas dá amor com a mesma generosidade. Atividades criativas são sua medicina.',
        'Analisa e organiza suas emoções. Preocupa-se muito mas resolve problemas praticamente. Rotinas diárias trazem estabilidade emocional.',
        'Encontra equilíbrio emocional nos relacionamentos. Sozinho/a se sente vazio/a. Odeia conflitos profundamente. Arte e beleza trazem paz.',
        'Suas emoções são tão profundas e intensas quanto o oceano. Ama profundamente e nunca esquece traição. Sua intuição é incrivelmente forte.',
        'Emocionalmente brilhante e otimista. Ama liberdade e odeia restrições. Viajar é seu melhor remédio emocional.',
        'Não mostra emoções facilmente. Forte senso de responsabilidade. Com a idade, torna-se mais aberto/a emocionalmente.',
        'Padrões emocionais únicos e imprevisíveis. Ama de maneiras não convencionais. Atividades sociais trazem satisfação emocional.',
        'Extremamente intuitivo/a e espiritual. Sonhos vívidos às vezes proféticos. Arte, meditação e água trazem paz.'
    ];
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
            <div class="interp-text">${isEasy ? moonEasy[moonPos.sign] : moonInterp[moonPos.sign]}</div>
        </div>`;
    }

    // ═══════════════════════════════════
    // 3. 💰 Wealth Fortune (2nd & 11th House Analysis)
    // ═══════════════════════════════════
    const h2planets = planetsInHouse(2);
    const h11planets = planetsInHouse(11);
    const h2sign = (lagnaSign + 1) % 12;
    const h11sign = (lagnaSign + 10) % 12;

    let wealthText = isEasy ? '' : `<strong>2nd House (Accumulated Wealth):</strong> Located in ${SIGNS[h2sign]}. `;
    if (h2planets.length === 0) {
        wealthText += 'Sem planetas na casa 2 — a acumulacao de riqueza e constante e estavel. ';
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
            wealthText += isEasy ? `${pWealth[p.id] || ''} ` : `${p.symbol} ${p.name}: ${pWealth[p.id] || ''} `;
        });
    }

    wealthText += isEasy ? '<br><br>' : `<br><br><strong>11th House (Income & Gains):</strong> Located in ${SIGNS[h11sign]}. `;
    if (h11planets.length === 0) {
        wealthText += 'Sem planetas na casa 11 — a renda e estavel sem grandes flutuacoes.';
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
            wealthText += isEasy ? `${pIncome[p.id] || ''} ` : `${p.symbol} ${p.name}: ${pIncome[p.id] || ''} `;
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
            spouseText += isEasy ? `<br>${pH7[p.id] || ''}` : `<br>${p.symbol} ${p.name}: ${pH7[p.id] || ''}`;
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
            careerText += isEasy ? `<br>${pCareer[p.id] || ''}` : `<br>${p.symbol} ${p.name}: ${pCareer[p.id] || ''}`;
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
        <div class="interp-text">${healthByLagna[lagnaSign]}${h6planets.length > 0 ? '<br><br>' + isEasy ? '' : h6planets.map(p => p.name).join(', ') + ' in the 6th house requires special attention to health management.' : ''}</div>
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
    const isEasy = window.vedicMode === 'easy';
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
    const isEasy = window.vedicMode === 'easy';
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
            text += `${isEasy ? "" : p.name + ": "}${h5p[p.id] || 'Influences academics'}. `;
        });
    }

    document.getElementById('educationWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// Children Fortune
// ═══════════════════════════════════════════════════
function renderChildren(positions, lagnaSign) {
    const isEasy = window.vedicMode === 'easy';
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
            text += `${ch[p.id] || ''}<br>`;
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
    const isEasy = window.vedicMode === 'easy';
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    const h9 = planetsInHouse(9);
    const h12 = planetsInHouse(12);
    const rahu = positions.find(p => p.id === 'Rahu');

    let text = '<strong>9th House (Foreign Travel · Fortune · Higher Education):</strong><br>';
    if (h9.length === 0) {
        text += 'Sem planetas na casa 9 — viagens ao exterior existem mas sem conexao particularmente forte.';
    } else {
        h9.forEach(p => {
            const f9 = { Sun: 'Father has foreign connections. Government/official overseas trips.', Moon: 'Emotionally enjoys foreign travel. Popularity abroad.', Mars: 'Adventure/challenges abroad. Military/technology-related foreign activities.', Mercury: 'Study abroad/business success! Multilingual abilities.', Jupiter: 'Great fortune abroad! Successful study/immigration. Meeting a foreign teacher.', Venus: 'Romance abroad. Art/fashion-related foreign activities.', Saturn: 'Hardship then success abroad. Long-term foreign residence.', Rahu: 'Strong indicator of foreign migration! Deeply immersed in foreign culture.', Ketu: 'Past-life foreign connections. Spiritual pilgrimage.' };
            text += isEasy ? `${f9[p.id] || ''}<br>` : `${p.symbol} ${p.name}: ${f9[p.id] || ''}<br>`;
        });
    }

    text += '<br><strong>12th House (Foreign Settlement · Immigration · Expenses):</strong><br>';
    if (h12.length === 0) {
        text += 'Sem planetas na casa 12 — a residencia domestica e mais natural que o assentamento no exterior.';
    } else {
        h12.forEach(p => {
            const f12 = { Sun: 'Finding identity abroad. Government-related foreign postings.', Moon: 'High possibility of living abroad! Emotional stability overseas.', Mars: 'Energy expenditure abroad. Foreign investment/real estate.', Mercury: 'Foreign business/IT activities. Overseas education.', Jupiter: 'Spiritual growth abroad. Charitable activities. Foreign universities.', Venus: 'Luxury and pleasure abroad. Overseas artistic activities.', Saturn: 'Hard labor abroad. But long-term settlement.', Rahu: 'Definitive indicator of foreign immigration! Adapting to Western culture.', Ketu: 'Spiritual practice abroad. Solitary overseas life.' };
            text += isEasy ? `${f12[p.id] || ''}<br>` : `${p.symbol} ${p.name}: ${f12[p.id] || ''}<br>`;
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
    const isEasy = window.vedicMode === 'easy';
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
            <strong>🪐 Lagna Planeta regente:</strong> ${lagnaRulers[lagnaSign]}
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
    const RULER_NAMES = {Sun:"Sol",Moon:"Lua",Mars:"Marte",Mercury:"Mercúrio",Jupiter:"Júpiter",Venus:"Vênus",Saturn:"Saturno",Rahu:"Rahu",Ketu:"Ketu"};

    const isEasy = window.vedicMode === 'easy';
    let html = '';

    if (division === 10) {
        // D10 해석: 직업/커리어
        const d10_1lord = SIGN_RULERS[dLagnaSign];
        const d10_10sign = (dLagnaSign + 9) % 12;
        const d10_10lord = SIGN_RULERS[d10_10sign];
        const d10_10planets = dPositions.filter(p => p.dSign === d10_10sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💼 Análise de Carreira' : '💼 D10 Análise de Carreira') + '</div><div class="interp-text">';
        html += '<strong>D10 Lagna:</strong> ' + SIGNS[dLagnaSign] + ' (Regente: ' + (RULER_NAMES[d10_1lord]||d10_1lord) + ')<br>';
        html += '<strong>D10 Casa 10 (Carreira):</strong> ' + SIGNS[d10_10sign] + ' (Regente: ' + (RULER_NAMES[d10_10lord]||d10_10lord) + ')<br>';
        if (d10_10planets.length > 0) {
            html += '<strong>Planetas na casa 10:</strong> ' + d10_10planets.map(p => p.name).join(', ') + '<br>';
        }

        // 직업 성향 by D10 라그나
        const careerBySign = [
            'Lideranca, Militar, Esportes, Empreendedor',  // 양자리
            'Financas, Artes, Imoveis, Gastronomia',     // 황소
            'Comunicacao, Midia, Educacao, TI',  // 쌍둥이
            'Enfermagem, Imoveis, Hoteis, Aconselhamento',    // 게
            'Politica, Entretenimento, Gestao, Administracao',        // 사자
            'Medico, Contabilidade, Analise, Pesquisa',          // 처녀
            'Direito, Diplomacia, Design, Consultoria',      // 천칭
            'Investigacao, Pesquisa, Medicina, Seguros',          // 전갈
            'Educacao, Religiao, Comercio Exterior, Editora',      // 사수
            'Administration, Construction, Mining, Civil Service',        // 염소
            'TI, Inovacao, ONG, Aviacao',           // 물병
            'Artes, Hospital, Exterior, Espiritualidade'           // 물고기
        ];
        html += '<strong>Campos adequados:</strong> ' + careerBySign[dLagnaSign];
        html += '</div></div>';

    } else if (division === 7) {
        // D7 해석: 자녀
        const d7_5sign = (dLagnaSign + 4) % 12;
        const d7_5lord = SIGN_RULERS[d7_5sign];
        const d7_5planets = dPositions.filter(p => p.dSign === d7_5sign);
        const benefics = d7_5planets.filter(p => p.natural === 'benefic');
        const malefics = d7_5planets.filter(p => p.natural === 'malefic');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👶 Análise de Filhos' : '👶 D7 Análise de Filhos') + '</div><div class="interp-text">';
        html += '<strong>D7 Lagna:</strong> ' + SIGNS[dLagnaSign] + '<br>';
        html += '<strong>D7 Casa 5 (Filhos):</strong> ' + SIGNS[d7_5sign] + ' (Regente: ' + (RULER_NAMES[d7_5lord]||d7_5lord) + ')<br>';
        if (d7_5planets.length > 0) {
            html += '<strong>Planetas na casa 5:</strong> ' + d7_5planets.map(p => p.name).join(', ') + '<br>';
        }
        if (benefics.length > 0) html += 'Benefico na casa 5 — abencoacado com filhos.<br>';
        if (malefics.length > 0) html += 'Malefico na casa 5 — desafios com filhos.<br>';
        if (d7_5planets.length === 0) html += 'Sem planetas na casa 5 — verifique a posicao do senhor da casa 5.';
        html += '</div></div>';

    } else if (division === 12) {
        // D12 해석: 부모
        const d12_4sign = (dLagnaSign + 3) % 12; // 4a casa = 어머니
        const d12_9sign = (dLagnaSign + 8) % 12; // 9a casa = 아버지
        const d12_4planets = dPositions.filter(p => p.dSign === d12_4sign);
        const d12_9planets = dPositions.filter(p => p.dSign === d12_9sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨‍👩‍👧 Análise de Pais' : '👨‍👩‍👧 D12 Análise de Pais') + '</div><div class="interp-text">';
        html += '<strong>D12 Lagna:</strong> ' + SIGNS[dLagnaSign] + '<br>';
        html += '<strong>D12 Casa 4 (Mae):</strong> ' + SIGNS[d12_4sign];
        if (d12_4planets.length > 0) html += ' — ' + d12_4planets.map(p => p.name).join(', ');
        html += '<br>';
        html += '<strong>D12 Casa 9 (Pai):</strong> ' + SIGNS[d12_9sign];
        if (d12_9planets.length > 0) html += ' — ' + d12_9planets.map(p => p.name).join(', ');
        html += '<br>';

        const moon4 = d12_4planets.find(p => p.id === 'Moon');
        const sun9 = d12_9planets.find(p => p.id === 'Sun');
        if (moon4) html += 'Lua na casa 4 — vinculo profundo com a mae.<br>';
        if (sun9) html += 'Sol na casa 9 — vinculo profundo com o pai.<br>';
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
            {name:'Ghora',nature:'malefic',desc:'Destruicao e medo. Karma sombrio'},
            {name:'Rakshasa',nature:'malefic',desc:'Energia demoniaca. Forte desejo'},
            {name:'Deva',nature:'benefic',desc:'Ser divino. Merito e bencaos de vidas passadas'},
            {name:'Kubera',nature:'benefic',desc:'Deus da riqueza. Karma de riqueza'},
            {name:'Yaksha',nature:'benefic',desc:'Guardiao da natureza. Harmonia'},
            {name:'Kinnara',nature:'benefic',desc:'Musico celestial. Talento artistico'},
            {name:'Bhrashta',nature:'malefic',desc:'O caido. Karma da queda'},
            {name:'Kulaghna',nature:'malefic',desc:'Destruidor de familia. Karma familiar'},
            {name:'Garala',nature:'malefic',desc:'Veneno. Karma de acoes toxicas'},
            {name:'Vahni',nature:'malefic',desc:'Deus do fogo. Karma de raiva e destruicao'},
            {name:'Maya',nature:'malefic',desc:'Ilusao. Karma de engano'},
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
            {name:'Brahma',nature:'benefic',desc:'Deus criador. Criacao e conhecimento'},
            {name:'Vishnu',nature:'benefic',desc:'Deus preservador. Protecao e ordem'},
            {name:'Maheshwara',nature:'benefic',desc:'Grande Senhor Shiva. Transformacao e libertacao'},
            {name:'Deva2',nature:'benefic',desc:'Santo. Pratica espiritual'},
            {name:'Bala',nature:'benefic',desc:'Strength. Fortitude and courage'},
            {name:'Vishwakarma',nature:'benefic',desc:'Cosmic architect. Building and creation'},
            {name:'Tamasa',nature:'malefic',desc:'Darkness. Ignorance karma'},
            {name:'Kanchana',nature:'benefic',desc:'Ouro. Pureza e valor'},
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
            {name:'Aryama',nature:'benefic',desc:'Divindade solar. Friendship and contracts'},
            {name:'Mitra',nature:'benefic',desc:'God of friendship. Trust and companionship'},
            {name:'Agni',nature:'malefic',desc:'Fire god. Purifying fire'},
            {name:'Varuna2',nature:'benefic',desc:'Deus do oceano. Sabedoria profunda'},
            {name:'Gauri',nature:'benefic',desc:'Parvati. Devocao e amor'},
            {name:'Mahakala',nature:'malefic',desc:'Great Time. Trying to master time'},
            {name:'Pitamaha',nature:'benefic',desc:'Great Father Brahma. Creator'},
            {name:'Kartikeya',nature:'benefic',desc:'War god. Righteous battle'},
            {name:'Yama',nature:'malefic',desc:'Deus da morte. Julgamento e justica'},
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
            {name:'Charachara',nature:'benefic',desc:'Todas as coisas. Unidade com tudo'}
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
            return ' — Divindade: <strong>' + d.deity.name + '</strong> <span style="color:' + c + ';font-weight:700;">' + (d.deity.nature === 'benefic' ? 'Benéfico' : 'Maléfico') + '</span>';
        }

        const houseThemes = ['','Eu','Riqueza','Comunicacao','Lar','Criacao','Servico','Relacoes','Transformacao','Sabedoria','Carreira','Desejos','Libertacao'];

        const pastLifeThemes = [
            'Guerreiro, Lider — Exerceu poder, lideranca natural e determinacao gravadas na alma.',
            'Artista, Agricultor — Trabalhou com a natureza, instinto profundo de estabilidade e beleza material.',
            'Erudito, Comerciante — Viveu do conhecimento, versatilidade e curiosidade permanecem.',
            'Protetor, Cuidador — Cuidou de outros, sensibilidade profunda e instinto maternal.',
            'Realeza, Sacerdote — Tinha alto status, autoridade e dignidade naturais.',
            'Curador, Servidor — Praticou medicina ou servico, excelentes habilidades analiticas.',
            'Diplomat, Artist — Pursued harmony and beauty, skilled in relationships. Partnership is core theme.',
            'Practitioner, Alchemist — Underwent deep transformation, strong attraction to secrets and mystery.',
            'Sage, Explorer — Sought truth, spiritual wisdom and adventurousness remain. Higher learning karma.',
            'Official, Architect — Built order, strong patience and responsibility. Discipline imprinted on soul.',
            'Official, Guardian — Built social order, organizational spirit. Saturn-ruled, duty imprinted on soul.',
            'Medium, Artist — Communed with spiritual world, extremely strong intuition. Closest to liberation.'
        ];

        const d60SunInterp = [
            'Viveu como guerreiro ou rei, ego forte e lideranca permanecem. Proposito da alma: estabelecer autoridade.',
            'Viveu como artista ou rico, a alma persegue abundancia material.',
            'Viveu como erudito ou comerciante, conhecimento e comunicacao sao temas centrais da alma.',
            'Viveu como protetor, cuidar dos outros e um instinto profundo da alma.',
            'Tinha alto status como realeza, autoridade natural permanece nesta vida.',
            'Viveu como curador, analise e servico sao o proposito da alma.',
            'Perseguiu harmonia, relacionamentos e equilibrio sao a tarefa da alma.',
            'Passou por transformacao profunda, segredos gravados na alma.',
            'Buscou a verdade, sabedoria e aventura sao a direcao da alma.',
            'Construiu ordem, sistemas e responsabilidade gravados na alma.',
            'Estava a frente do tempo, pensamento original e um traco da alma.',
            'Comunicou-se com o mundo espiritual, intuicao profunda permanece na alma.'
        ];
        const d60MoonInterp = [
            'Memoria emocional intensamente ardente. Raiva e paixao gravadas, dominar emocoes e a tarefa.',
            'Memoria emocional quente e estavel. Memorias de abundancia permanecem, buscando coisas belas.',
            'Memoria emocional intelectual e colorida. Muitas experiencias, forte curiosidade.',
            'Memoria emocional muito profunda. Fortes memorias de lar e cuidado.',
            'Orgulho e dignidade preenchem a memoria emocional.',
            'Servico e analise na memoria emocional. Coracao acolhedor.',
            'Harmonia e relacionamentos na memoria emocional. Buscando parceiro.',
            'Memoria emocional profunda e intensa. Profundidade como o oceano.',
            'Liberdade e exploracao na memoria emocional. Perseguindo expansao.',
            'Responsabilidade e paciencia na memoria emocional. Emocoes maduras.',
            'Memoria emocional unica e extraordinaria. Sensibilidade independente.',
            'Memoria emocional espiritual e transcendente. Sonhos vividos, conexao espiritual profunda.'
        ];

        // Parashara quote
        html += '<div class="interp-card" style="border-left:3px solid #8b7ec8;"><div class="interp-text" style="font-size:13px;color:#888;">';
        html += '📜 <strong>Parashara disse:</strong> "Shashtiamsa (D60) e a mais importante de todas as cartas divisionais. Planetas em divisoes de divindades beneficas dao bons resultados, maleficas dao maus."<br>';
        html += '<span style="color:#666;">— Brihat Parashara Hora Shastra (BPHS)</span></div></div>';

        // Ch1: Soul Identity
        const lagnaD = getDeity(lagnaSidereal);
        let ch1 = '<strong>D60 Lagna: ' + SIGNS[dLagnaSign] + ' ' + SIGN_SYMBOLS[dLagnaSign] + '</strong> (Regente: ' + (RULER_NAMES[d60_1lord]||d60_1lord) + ')' + deityTag(lagnaD) + '<br><br>';
        ch1 += pastLifeThemes[dLagnaSign] + '<br>';
        if (lagnaD.deity) {
            ch1 += '<br>' + (lagnaD.deity.nature === 'benefic' ?
                '<strong>' + lagnaD.deity.name + '</strong> protege o Lagna. ' + lagnaD.deity.desc + ' — O merito de vidas passadas protege esta vida, oportunidades vem naturalmente.' :
                '<strong>' + lagnaD.deity.name + '</strong> influencia o Lagna. ' + lagnaD.deity.desc + ' — Desafio carmico gravado na personalidade, mas supera-lo leva a maior crescimento.');
        }
        if (d60_planets_1.length > 0) ch1 += '<br><br>' + d60_planets_1.map(p => p.name).join(', ') + ' no D60 Lagna — karma central concentrado nestes planetas.';
        html += subChapter('🪐', 'Identidade da Alma — Quem você foi', ch1);

        // Ch2: Soul Purpose (Sun)
        const sunD60 = dPositions.find(p => p.id === 'Sun');
        if (sunD60) {
            const sunD = getDeity(sunD60.sidereal);
            let ch2 = '<strong>D60 Sol: ' + SIGNS[sunD60.dSign] + ' ' + SIGN_SYMBOLS[sunD60.dSign] + '</strong>' + deityTag(sunD) + '<br><br>';
            ch2 += (d60SunInterp[sunD60.dSign] || '') + '<br>';
            if (sunD.deity) {
                ch2 += '<br>Divindade solar <strong>' + sunD.deity.name + '</strong>: ' + sunD.deity.desc + '. ' + (sunD.deity.nature === 'benefic' ? 'O proposito da alma foi justamente perseguido, a autorrealizacao vem naturalmente.' : 'Desafios ao ego e autoridade, encontrar o verdadeiro eu e a tarefa.');
            }
            html += subChapter('☉', 'Propósito da Alma — Por que você nasceu', ch2);
        }

        // Ch3: Emotional Memory (Moon)
        const moonD60 = dPositions.find(p => p.id === 'Moon');
        if (moonD60) {
            const moonD = getDeity(moonD60.sidereal);
            let ch3 = '<strong>D60 Lua: ' + SIGNS[moonD60.dSign] + ' ' + SIGN_SYMBOLS[moonD60.dSign] + '</strong>' + deityTag(moonD) + '<br><br>';
            ch3 += (d60MoonInterp[moonD60.dSign] || '') + '<br>';
            if (moonD.deity) {
                ch3 += '<br>Divindade lunar <strong>' + moonD.deity.name + '</strong>: ' + moonD.deity.desc + '. ' + (moonD.deity.nature === 'benefic' ? 'A mente era pacifica, estabilidade emocional e intuicao sao inatas.' : 'Feridas emocionais permanecem no subconsciente. Meditacao e descanso perto da agua ajudam.');
            }
            html += subChapter('☽', 'Memória Emocional — Padrões inconscientes', ch3);
        }

        // Ch4: Spouse Karma
        const d60H7sign = (dLagnaSign + 6) % 12;
        const d60H7lord = SIGN_RULERS[d60H7sign];
        const d60H7planets = dPositions.filter(p => p.dSign === d60H7sign);
        const venusD60 = dPositions.find(p => p.id === 'Venus');
        const rahuD60 = dPositions.find(p => p.id === 'Rahu');
        const ketuD60 = dPositions.find(p => p.id === 'Ketu');

        const spouseKarma = ['Warrior/leader connection. Intense, independent spouse karma.','Artist/wealthy connection. Materially abundant marriage karma.','Scholar/merchant connection. Communication and intellectual rapport.','Family/protector connection. Deep emotional bond karma.','Royalty/nobility connection. Splendid, respected marriage.','Healer/server connection. Service and devotion karma.','Conexao diplomatico/artista. Casamento harmonioso e bonito.','Practitioner/mystic connection. Intense, transformative karma.','Sage/explorer connection. Free, expansive karma. Foreign spouse possible.','Official/architect connection. Responsible, stable. Late marriage possible.','Official/military connection. Saturn-ruled, disciplined spouse. Age difference possible.','Medium/artist connection. Mysterious, spiritual karma. May meet in dreams.'];

        let ch4 = '<strong>D60 Casa 7: ' + SIGNS[d60H7sign] + ' ' + SIGN_SYMBOLS[d60H7sign] + '</strong> (Senhor da casa 7: ' + (RULER_NAMES[d60H7lord]||d60H7lord) + ')<br><br>';
        ch4 += spouseKarma[d60H7sign] + '<br>';
        if (d60H7planets.length > 0) {
            ch4 += '<br><strong>Planetas na D60 casa 7:</strong><br>';
            d60H7planets.forEach(p => {
                const pD = getDeity(p.sidereal);
                ch4 += p.symbol + ' <strong>' + p.name + '</strong>' + deityTag(pD) + '<br>';
                ch4 += (p.natural === 'benefic' ? 'Benefico na casa 7 — bom karma com o conjuge, bencaos nesta vida.' : 'Malefico na casa 7 — karma nao resolvido com o conjuge, resolvendo-se nesta vida.') + '<br>';
            });
        }
        if (venusD60) {
            const venD = getDeity(venusD60.sidereal);
            const venH = ((venusD60.dSign - dLagnaSign + 12) % 12) + 1;
            ch4 += '<br><strong>♀ Vênus (Karaka do Amor)</strong> → D60 ' + venH + 'H (' + houseThemes[venH] + ')' + deityTag(venD) + '<br>';
            ch4 += venD.deity && venD.deity.nature === 'benefic' ? 'Venus sob protecao benefica. O amor foi bem praticado, belo amor espera.' : 'Venus sob influencia malefica. Aprender o verdadeiro significado do amor e a tarefa.';
        }
        if (rahuD60 && ketuD60) {
            const rahuH = ((rahuD60.dSign - dLagnaSign + 12) % 12) + 1;
            const ketuH = ((ketuD60.dSign - dLagnaSign + 12) % 12) + 1;
            if (rahuH === 7 || ketuH === 7 || rahuH === 1 || ketuH === 1) {
                ch4 += '<br><br>🔥 <strong>Eixo Rahu-Ketu na linha 1-7!</strong> Conexao muito forte de vidas passadas com o conjuge. Destinados a se encontrar.';
            }
        }
        const h7lordPlanet = dPositions.find(p => p.id === d60H7lord);
        if (h7lordPlanet) {
            const h7lH = ((h7lordPlanet.dSign - dLagnaSign + 12) % 12) + 1;
            ch4 += '<br><br><strong>Senhor da 7a ' + (RULER_NAMES[d60H7lord]||d60H7lord) + '</strong> → D60 ' + h7lH + 'H (' + houseThemes[h7lH] + ')' + deityTag(getDeity(h7lordPlanet.sidereal)) + '<br>';
            ch4 += 'O karma do conjuge se manifesta atraves de <strong>' + houseThemes[h7lH] + '</strong> area.';
        }
        html += subChapter('💍', 'Karma do Cônjuge — Conexão de vida passada', ch4);

        // Ch5: Career Karma
        const d60H10sign = (dLagnaSign + 9) % 12;
        const d60H10lord = SIGN_RULERS[d60H10sign];
        const d60H10planets = dPositions.filter(p => p.dSign === d60H10sign);
        const satD60 = dPositions.find(p => p.id === 'Saturn');
        const careerKarma = ['Militar/Lideranca/Esportes','Financas/Arte/Agricultura','Educacao/Midia/Comercio','Enfermagem/Imoveis/Hoteis','Politica/Entretenimento/Gestao','Medico/Analise/Servico','Direito/Diplomacia/Design','Pesquisa/Medicina','Educacao/Religiao/Exterior','Administracao/Construcao/Servico Publico','Tecnologia/Ciencia/Inovacao','Arte/Espiritualidade/Hospital'][d60H10sign];

        let ch5 = '<strong>D60 Casa 10: ' + SIGNS[d60H10sign] + ' ' + SIGN_SYMBOLS[d60H10sign] + '</strong> (Senhor da casa 10: ' + (RULER_NAMES[d60H10lord]||d60H10lord) + ')<br><br>';
        ch5 += 'Karma profissional de vidas passadas orientado para <strong>' + careerKarma + '</strong>. Atracao natural por este campo.<br>';
        if (satD60) {
            const satD = getDeity(satD60.sidereal);
            const satH = ((satD60.dSign - dLagnaSign + 12) % 12) + 1;
            ch5 += '<br><strong>♄ Saturno (Senhor do Karma)</strong> → D60 ' + satH + 'H (' + houseThemes[satH] + ')' + deityTag(satD) + '<br>';
            ch5 += satD.deity && satD.deity.nature === 'benefic' ? 'Saturno sob benefico — <strong>bencao muito rara!</strong> O merito da paciencia reduz provas profissionais.' : 'Saturno sob malefico — karma profissional pesado. Dissolver com paciencia, servico e mantra.';
        }
        if (d60H10planets.length > 0) ch5 += '<br><br><strong>Planetas na D60 casa 10:</strong> ' + d60H10planets.map(p => p.name).join(', ') + ' — karma profissional concentrado aqui.';
        html += subChapter('💼', 'Karma Profissional — Vocação de vida passada', ch5);

        // Ch6: Wealth Karma
        const d60H2sign = (dLagnaSign + 1) % 12;
        const d60H2planets = dPositions.filter(p => p.dSign === d60H2sign);
        const wealthKarma = ['Instinto de riqueza por esforco proprio.','Ambiente abundante em vida passada.','Construcao intelectual de riqueza.','Riqueza familiar/imobiliaria.','Riqueza por autoridade.','Riqueza por servico. Frugal.','Riqueza por parceria.','Riqueza alheia (heranca).','A fortuna traz riqueza.','Lento mas seguro. Rico apos meia-idade.','Riqueza por inovacao.','Atividade espiritual e riqueza.'][d60H2sign];
        let ch6 = '<strong>D60 Casa 2: ' + SIGNS[d60H2sign] + ' ' + SIGN_SYMBOLS[d60H2sign] + '</strong><br><br>' + wealthKarma + '<br>';
        if (d60H2planets.length > 0) {
            ch6 += '<br><strong>Planetas na D60 casa 2:</strong><br>';
            d60H2planets.forEach(p => {
                ch6 += p.symbol + ' ' + p.name + deityTag(getDeity(p.sidereal)) + ' — ' + (p.natural === 'benefic' ? 'Bom karma de riqueza. Abundancia.' : 'Desafio de riqueza. Superar com esforco.') + '<br>';
            });
        }
        html += subChapter('💰', 'Karma de Riqueza — Fortuna de vida passada', ch6);

        // Ch7: Deity List (compact)
        let ch7 = '';
        const lagnaD2 = getDeity(lagnaSidereal);
        if (lagnaD2.deity) { const lc = lagnaD2.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f'; ch7 += '<div style="padding:4px 0;">⬆ Lagna → <strong>' + lagnaD2.deity.name + '</strong> <span style="color:' + lc + ';">' + (lagnaD2.deity.nature === 'benefic' ? 'B' : 'M') + '</span></div>'; }
        positions.forEach(p => {
            const pD = getDeity(p.sidereal);
            if (pD.deity) { const c = pD.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f'; ch7 += '<div style="padding:4px 0;">' + p.symbol + ' ' + p.name + ' → <strong>' + pD.deity.name + '</strong> <span style="color:' + c + ';">' + (pD.deity.nature === 'benefic' ? 'B' : 'M') + '</span></div>'; }
        });
        html += subChapter('🕉️', 'Lista de Divindades', ch7);

        // Ch8: Overall Judgment
        const beneficCount = positions.filter(p => { const pD = getDeity(p.sidereal); return pD.deity && pD.deity.nature === 'benefic'; }).length;
        const maleficPlanets = positions.filter(p => { const pD = getDeity(p.sidereal); return pD.deity && pD.deity.nature === 'malefic'; });
        let ch8 = 'De 9 planetas: <strong style="color:#5cb85c">' + beneficCount + ' benefico</strong>, <strong style="color:#d9534f">' + (positions.length - beneficCount) + ' malefico</strong><br><br>';
        if (beneficCount >= 7) ch8 += '🌟 <strong>Merito muito forte de vidas passadas.</strong> Parashara chamou isso de "uma alma abencoacada pelos deuses." Maioria dos planetas sob divindades beneficas.';
        else if (beneficCount >= 5) { ch8 += '✨ <strong>Merito abundante de vidas passadas.</strong> Benefic predominate, protection in many areas.'; if (maleficPlanets.length > 0) ch8 += ' Atencao: <strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong> — practice mantras and charity.'; }
        else if (beneficCount >= 3) { ch8 += '⚖️ <strong>Karma equilibrado.</strong> Good events and challenges alternate.'; if (maleficPlanets.length > 0) ch8 += '<br>Watch: <strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong>'; }
        else ch8 += '🔥 <strong>Life of karmic settlement.</strong> Parashara said "the heaviest karma leads to greatest growth." Mantras e caridade são vitais.';
        html += subChapter('📊', 'Julgamento Cármico Geral', ch8);

    } else if (division === 2) {
        // D2 Hora — Wealth accumulation
        const d2LagnaInterp = ['Riqueza por esforco proprio. Investimento independente e agressivo.','Investimento sensorial e riqueza estavel. Imoveis, gastronomia, arte.','Ganho por atividade intelectual. Escrita, educacao, visao empresarial.','Renda imobiliaria e familiar. Propriedade da mae. Cuidado com gastos emocionais.','Riqueza por lideranca e autoridade. Governo, ouro. Gastos ostensivos.','Renda por analise e habilidades. Medico, contabilidade. Administrador frugal.','Riqueza por parceria. Direito, diplomacia, moda, arte.','Riqueza com dinheiro alheio (heranca, seguros). Fontes ocultas.','Renda por educacao, exterior, religiao. A fortuna traz riqueza.','Esforco sistematico constroi riqueza. Lento mas seguro. Rico apos meia-idade.','Renda por tecnologia, inovacao, redes. Fontes nao convencionais.','Renda por atividades espirituais/artisticas. Riqueza relacionada ao exterior.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💰 Análise de Riqueza' : '💰 D2 Hora — Análise de Riqueza') + '</div><div class="interp-text">';
        html += '<strong>D2 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d2LagnaInterp + '<br><br>';
        const sunD2 = dPositions.find(p => p.id === 'Sun');
        const moonD2 = dPositions.find(p => p.id === 'Moon');
        if (sunD2) html += '<strong>☉ Sun → ' + SIGNS[sunD2.dSign] + ':</strong> ' + (sunD2.dSign === 4 ? '🌟 <strong>Sol em sua propria hora (Leao)!</strong> Tipo autodidata. Constroi riqueza com autoridade e lideranca.' : 'Sol em hora da Lua. Renda por ajuda de outros ou setor publico.') + '<br>';
        if (moonD2) html += '<strong>☽ Moon → ' + SIGNS[moonD2.dSign] + ':</strong> ' + (moonD2.dSign === 3 ? '🌟 <strong>Lua em sua propria hora (Cancer)!</strong> Vida abundante atraves de pessoas e relacionamentos.' : 'Lua em hora do Sol. Sustento por esforco proprio.') + '<br>';
        const d2H2sign = (dLagnaSign + 1) % 12;
        const d2H2planets = dPositions.filter(p => p.dSign === d2H2sign);
        html += '<br><strong>D2 Casa 2 (Riqueza Acumulada) — ' + SIGNS[d2H2sign] + ':</strong><br>';
        if (d2H2planets.length > 0) {
            const wealth = {Sun:'Riqueza por autoridade e status',Moon:'Riqueza por atividades publicas',Mars:'Propriedade, tecnologia, campos competitivos',Mercury:'Negocios, atividade intelectual, comunicacao',Jupiter:'Educacao, direito, religiao — riqueza abundante',Venus:'Arte, moda, artigos de luxo',Saturn:'Acumulacao lenta mas constante. Estavel apos meia-idade',Rahu:'Metodos nao convencionais, relacionados ao exterior',Ketu:'Desapegado do material. Persegue valores espirituais'};
            d2H2planets.forEach(p => { html += '• ' + p.name + ': ' + (wealth[p.id]||'') + '<br>'; });
        } else html += 'Sem planetas na casa 2 — posicao do senhor e a chave.<br>';
        html += '</div></div>';

    } else if (division === 3) {
        const d3LagnaInterp = ['Independente, lider entre irmaos. Comunicacao corajosa.','Relacoes estaveis e confortaveis com irmaos. Irmaos artisticos possiveis.','Irmaos intelectuais e comunicativos. Muitas conversas.','Vinculo emocional profundo com irmaos. Irmaos protetores.','Irmaos carismaticos e orgulhosos. Irmao famoso ou bem-sucedido.','Irmaos analiticos e praticos. Area medica/educacional.','Irmaos diplomaticos e charmosos. Conexoes sociais.','Relacoes intensas e secretas com irmaos. Vinculos profundos apos conflitos.','Irmaos livres e filosoficos. Irmaos no exterior.','Irmaos responsaveis e ambiciosos. Poucos irmaos ou relacao seria.','Irmaos unicos e independentes. Relacoes nao convencionais.','Irmaos espirituais e artisticos. Irmaos no exterior.'][dLagnaSign];
        const d3_3sign = (dLagnaSign + 2) % 12;
        const d3_3planets = dPositions.filter(p => p.dSign === d3_3sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👫 Irmãos e Coragem' : '👫 D3 Drekkana — Irmãos e Coragem') + '</div><div class="interp-text">';
        html += '<strong>D3 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d3LagnaInterp + '<br><br>';
        html += '<strong>D3 Casa 3 (Irmaos Menores) — ' + SIGNS[d3_3sign] + ':</strong><br>';
        if (d3_3planets.length > 0) {
            const bro = {Sun:'Irmao mais novo tem lideranca e autoridade',Moon:'Emocionalmente proximo do irmao mais novo',Mars:'Irmao mais novo ativo e corajoso. Possiveis conflitos',Mercury:'Irmao mais novo inteligente com boa comunicacao',Jupiter:'Irmao mais novo sabio que traz boa sorte',Venus:'Irmao mais novo atraente e artistico',Saturn:'Dificuldades com irmao mais novo. Pode haver diferenca de idade',Rahu:'Irmao mais novo unico ou conexao estrangeira',Ketu:'Distancia com irmao mais novo. Conexao espiritual'};
            d3_3planets.forEach(p => { html += '• ' + p.name + ': ' + (bro[p.id]||'') + '<br>'; });
        } else html += 'Sem planetas na casa 3 — verifique a posicao do senhor.<br>';
        html += '</div></div>';

    } else if (division === 4) {
        const d4LagnaInterp = ['Adquire propriedades ativamente. Gosta de construir ou comprar casas novas.','Imoveis estaveis e abundantes. Terras e fazendas. Moradia luxuosa.','Multiplas casas ou mudancas frequentes. Prefere ambiente intelectual.','Casa e propriedade sao emocionalmente importantes. Perto da agua.','Casa grande e espacosa. Interior luxuoso. Area prestigiosa.','Moradia limpa e pratica. Multiplas propriedades pequenas.','Casa bonita e harmoniosa. Interesse em design de interiores.','Propriedade em transformacao. Propriedade herdada. Lugares secretos.','Grande terreno e propriedade no exterior. Perto de instituicoes educacionais.','Investimento imobiliario sistematico. Edificios antigos. Crescimento seguro.','Estilo de moradia unico. Apartamento moderno. Tecnologia.','Casa bonita perto da agua. Propriedade no exterior. Espaco espiritual.'][dLagnaSign];
        const d4_4sign = (dLagnaSign + 3) % 12;
        const d4_4planets = dPositions.filter(p => p.dSign === d4_4sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '🏠 Propriedade e Fortuna' : '🏠 D4 Chaturthamsa — Propriedade e Fortuna') + '</div><div class="interp-text">';
        html += '<strong>D4 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d4LagnaInterp + '<br><br>';
        html += '<strong>D4 Casa 4 (Propriedade) — ' + SIGNS[d4_4sign] + ':</strong><br>';
        if (d4_4planets.length > 0) {
            const prop = {Sun:'Edificios do governo ou moradia prestigiosa',Moon:'Casa bonita. Perto da agua. Influencia da mae',Mars:'Nova construcao. Possiveis disputas de propriedade',Mercury:'Propriedade comercial. Multipla posse',Jupiter:'Casa espacosa e abundante! Melhor sorte imobiliaria',Venus:'Casa luxuosa. Interior bonito',Saturn:'Casa antiga. Precisa de reparo. Estavel apos meia-idade',Rahu:'Propriedade no exterior. Moradia nao convencional',Ketu:'Indiferente a propriedade. Prefere espaco espiritual'};
            d4_4planets.forEach(p => { html += '• ' + p.name + ': ' + (prop[p.id]||'') + '<br>'; });
        } else html += 'Sem planetas na casa 4 — posicao do senhor e a chave.<br>';
        html += '</div></div>';

    } else if (division === 24) {
        const d24LagnaInterp = ['Physical education, military, leadership training.','Music, art, culinary, finance education.','Language, literature, communication, media education.','History, psychology, home science education.','Political science, theater, business education.','Medicine, science, statistics education. Precise learning.','Law, diplomacy, design education. Balanced learning.','Psychology, research, investigation, occult education.','Philosophy, theology, international studies. Study abroad likely.','Business, administration, architecture. Systematic learning.','IT, engineering, aviation, social science. Innovative learning.','Art, music, spirituality, film studies. Intuitive learning.'][dLagnaSign];
        const d24_4sign = (dLagnaSign + 3) % 12;
        const d24_5sign = (dLagnaSign + 4) % 12;
        const d24_4planets = dPositions.filter(p => p.dSign === d24_4sign);
        const jupD24 = dPositions.find(p => p.id === 'Jupiter');
        const merD24 = dPositions.find(p => p.id === 'Mercury');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '📚 Educação' : '📚 D24 Chaturvimsamsa — Educação') + '</div><div class="interp-text">';
        html += '<strong>D24 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d24LagnaInterp + '<br><br>';
        html += '<strong>D24 Casa 4 (Educacao Basica) — ' + SIGNS[d24_4sign] + ':</strong><br>';
        if (d24_4planets.length > 0) {
            const edu4 = {Sun:'Escola de prestigio. Educacao autoritativa',Moon:'Ambiente de aprendizado confortavel. Forte educacao domestica',Mars:'Aprendizado competitivo. Forte em esportes/tecnologia',Mercury:'Melhor posicao! Habilidade academica excepcional',Jupiter:'Ambiente educacional rico. Bons professores',Venus:'Educacao artistica. Escola bonita',Saturn:'Educacao dificil mas conhecimento profundo ao superar',Rahu:'Educacao nao convencional. Escola estrangeira',Ketu:'Menos interesse em educacao formal. Aprendizado intuitivo'};
            d24_4planets.forEach(p => { html += '• ' + p.name + ': ' + (edu4[p.id]||'') + '<br>'; });
        } else html += 'Sem planetas na casa 4.<br>';
        if (jupD24) { const jH = ((jupD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>♃ Júpiter (Sabedoria) → ' + jH + 'H:</strong> ' + ([1,4,5,9].includes(jH) ? '🎓 <strong>Alto desempenho academico esperado!</strong> Pos-graduacao/doutorado/estudos no exterior possiveis.' : 'Crescimento pelo aprendizado. Bencao de Jupiter na casa ' + jH + '.') + '<br>'; }
        if (merD24) { const mH = ((merD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<strong>☿ Mercúrio (Aprendizado) → ' + mH + 'H:</strong> ' + ([1,4,5,9].includes(mH) ? '📖 <strong>Habilidade intelectual excepcional!</strong> Talento em matematica, idiomas, analise.' : 'Habilidade intelectual expressa na casa ' + mH + '.') + '<br>'; }
        html += '</div></div>';

    } else if (division === 30) {
        const d30LagnaInterp = ['Accidents, burns, headaches. Problems from hasty decisions. Manage anger.','Financial loss, dietary issues, thyroid. Watch overeating and attachment.','Nervous anxiety, insomnia, breathing problems. Avoid excessive worry.','Emotional instability, stomach issues, water-related problems. Control emotions.','Heart problems, pride damage, overwork. Need humility and rest.','Digestive disorders, allergies, perfectionism stress. Need relaxation.','Kidney problems, relationship conflicts, indecisiveness. Need decisiveness.','Secrets, accidents, surgery, sexual issues. Regular checkups important.','Liver problems, overweight, gambling/overspending. Need moderation.','Joint, bone, depression, loneliness. Need calcium and social interaction.','Blood pressure, circulation, unexpected accidents. Regular health checks.','Immune deficiency, addiction, mental health. Need meditation and sleep.'][dLagnaSign];
        const d30_6sign = (dLagnaSign + 5) % 12;
        const d30_8sign = (dLagnaSign + 7) % 12;
        const d30_12sign = (dLagnaSign + 11) % 12;
        const d30_6planets = dPositions.filter(p => p.dSign === d30_6sign);
        const d30_8planets = dPositions.filter(p => p.dSign === d30_8sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '⚠️ Infortúnio e Doença' : '⚠️ D30 Trimsamsa — Infortúnio e Doença') + '</div><div class="interp-text">';
        html += '<strong>D30 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d30LagnaInterp + '<br><br>';
        const diseaseBySign = ['Cabeca, cerebro, febre, inflamacao','Pescoco, tireoide, diabetes','Pulmoes, nervos, ansiedade','Estomago, retencao de liquidos','Coracao, costas, pressao arterial','Digestivo, intestinos, pele','Rins, lombar, urinario','Reprodutivo, doenca cronica','Figado, coxas, sobrepeso','Ossos, articulacoes, reumatismo','Circulacao, pressao arterial, tornozelos','Imune, pes, saude mental'];
        html += '<strong>D30 Casa 6 (Doenca) — ' + SIGNS[d30_6sign] + ':</strong><br>';
        html += 'Atenção: <strong>' + diseaseBySign[d30_6sign] + '</strong><br>';
        if (d30_6planets.length > 0) {
            const dis = {Sun:'Doencas oculares e cardiacas',Moon:'Saude mental, problemas relacionados a agua',Mars:'Acidentes, cirurgia, queimaduras',Mercury:'Sistema nervoso, problemas de pele',Jupiter:'Figado, sobrepeso',Venus:'Rins, diabetes, DSTs',Saturn:'Doenca cronica, problemas articulares',Rahu:'Doenca de causa desconhecida, vicio',Ketu:'Deficiencia imunologica, alergias'};
            d30_6planets.forEach(p => { html += '• ' + p.name + ': ' + (dis[p.id]||'') + '<br>'; });
        }
        html += '<br><strong>D30 Casa 8 (Perigo) — ' + SIGNS[d30_8sign] + ':</strong><br>';
        if (d30_8planets.length > 0) {
            d30_8planets.forEach(p => { html += '• ' + p.name + ': ' + (p.natural === 'malefic' ? 'Precaucao contra perigo/acidentes. Seguro e exames importantes.' : 'Protegido em crise.') + '<br>'; });
        } else html += 'Sem planetas na casa 8 — baixo risco.<br>';
        html += '</div></div>';

    } else if (division === 40) {
        const d40LagnaInterp = ['Mae independente e determinada. Lideranca herdada da linha materna.','Mae administra bem a riqueza. Abundancia material da linha materna.','Mae intelectual com boa comunicacao. Talento em idiomas herdado.','Vinculo muito profundo com a mae. Sensibilidade e intuicao herdadas.','Mae com autoridade e dignidade. Lideranca e honra herdadas.','Mae excelente em gestao de saude. Espirito analitico herdado.','Mae atraente e diplomatica. Senso artistico herdado.','Mae forte que passou por transformacao. Resiliencia herdada.','Mae educativa e religiosa. Sabedoria herdada.','Mae responsavel e rigorosa. Paciencia e disciplina herdadas.','Mae unica e progressista. Pensamento inovador herdado.','Mae espiritual e intuitiva. Arte/espiritualidade herdados.'][dLagnaSign];
        const moonD40 = dPositions.find(p => p.id === 'Moon');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👩 Herança Materna' : '👩 D40 Khavedamsa — Herança Materna') + '</div><div class="interp-text">';
        html += '<strong>D40 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d40LagnaInterp + '<br>';
        if (moonD40) { const mH = ((moonD40.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☽ Lua (Karaka da Mãe) → ' + mH + 'H:</strong> ' + ['','Forte influência materna','Propriedade da mãe','Boa comunicação com a mãe','Vínculo profundo com a mãe! Melhor posição','Mãe criativa','Mãe orientada ao serviço','Mãe influencia relacionamentos','Herança da mãe','Mãe religiosa/educativa','Mãe socialmente bem-sucedida','Mãe independente','Mãe espiritual'][mH] + '<br>'; }
        html += '</div></div>';

    } else if (division === 45) {
        const d45LagnaInterp = ['Pai ativo e orientado a acao. Coragem e lideranca herdados.','Pai financeiramente estavel. Valores materiais herdados.','Pai intelectual e versatil. Habilidade de comunicacao herdada.','Pai emocional e familiar. Instinto de cuidado herdado.','Pai autoritativo e respeitado. Lideranca herdada.','Pai pratico e diligente. Habilidades analiticas herdadas.','Pai diplomatico e refinado. Habilidade social herdada.','Pai forte e misterioso. Resiliencia herdada.','Pai academico e religioso. Filosofia herdada.','Pai rigoroso e ambicioso. Paciencia e disciplina herdadas.','Pai criativo e inovador. Pensamento cientifico herdado.','Pai espiritual e artistico. Intuicao e criatividade herdadas.'][dLagnaSign];
        const sunD45 = dPositions.find(p => p.id === 'Sun');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨 Herança Paterna' : '👨 D45 Akshavedamsa — Herança Paterna') + '</div><div class="interp-text">';
        html += '<strong>D45 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d45LagnaInterp + '<br>';
        if (sunD45) { const sH = ((sunD45.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☉ Sol (Karaka do Pai) → ' + sH + 'H:</strong> ' + ['','Forte influência paterna','Propriedade do pai','Boa comunicação com o pai','Pai orientado à família','Pai criativo','Pai orientado ao serviço','Pai influencia relacionamentos','Herança do pai','Pai religioso/educativo','Pai socialmente bem-sucedido! Melhor posição','Pai independente','Pai espiritual'][sH] + '<br>'; }
        html += '</div></div>';
    }

    interpEl.innerHTML = html;
}


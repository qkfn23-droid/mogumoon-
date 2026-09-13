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
    var ids = {
        catGuide: e ? 'Glosario' : 'Guía de Astrología Védica',
        catBasic: e ? 'Mis Posiciones Planetarias' : 'Carta Básica — Posiciones & Carta Natal',
        catDasha: e ? 'Mis Períodos de Vida' : 'Dasha — Períodos de Vida',
        catInterp: e ? 'Mi Lectura — Personalidad·Riqueza·Carrera·Salud' : 'Interpretación — Personalidad·Riqueza·Carrera·Salud·Yoga',
        catMarriage: e ? 'Mi Pareja' : 'Matrimonio & Pareja — D9 Navamsha',
        catCareer: e ? 'Mi Carrera·Riqueza' : 'Carrera & Riqueza — D10·D2·D4',
        catFamily: e ? 'Mi Familia' : 'Familia — D7·D3·D12·D40·D45',
        catSpirit: e ? 'Espiritualidad·Educación·Salud' : 'Espiritualidad·Educación·Salud — D20·D24·D27·D16',
        catWarn: e ? 'Precauciones de Salud' : 'Precauciones — D30 Enfermedad·Extranjero',
        catKarma: e ? 'Karma de Vidas Pasadas' : 'Karma — D60 Vidas Pasadas',
    };
    for (var id in ids) { var el = document.getElementById(id); if (el) el.textContent = ids[id]; }
}

// Ayanamsa (Lahiri) - approximate
function getAyanamsa(jd) {
    // Lahiri ayanamsa approximation
    const T = (jd - 2451545.0) / 36525.0;
    return 23.85 + 0.0137 * (jd - 2451545.0) / 365.25;
}

// Zodiac signs
const SIGNS = ['Aries','Tauro','Geminis','Cancer','Leo','Virgo',
               'Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'];
const SIGNS_EN = ['Aries','Tauro','Geminis','Cancer','Leo','Virgo',
                  'Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'];
const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

// Planets
const PLANETS = [
    { id: 'Sun', name: 'Sol', symbol: '☉', natural: 'malefic' },
    { id: 'Moon', name: 'Luna', symbol: '☽', natural: 'benefic' },
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
            id: 'Rahu', name: 'Rahu (Nodo Norte)', symbol: '☊', natural: 'malefic',
            sidereal: rahuSidereal, sign: Math.floor(rahuSidereal / 30),
            degree: rahuSidereal % 30, nakshatra: Math.floor(rahuSidereal / (360/27)),
            nakshatraPada: Math.floor((rahuSidereal % (360/27)) / (360/108)) + 1
        });
        positions.push({
            id: 'Ketu', name: 'Ketu (Nodo Sur)', symbol: '☋', natural: 'malefic',
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
    html += '<th>Planeta</th><th>Signo</th><th>Grado</th><th>Nakshatra</th><th>Casa</th>';
    html += '</tr></thead><tbody>';

    // Add Lagna first with exact degree
    const lagnaDeg = lagnaSidereal % 30;
    const lagnaNakIdx = Math.floor(lagnaSidereal / (360/27));
    const lagnaNak = NAKSHATRAS[lagnaNakIdx] || {name:"-"};
    html += `<tr><td>⬆ ASC</td><td>${SIGN_SYMBOLS[lagnaSign]} ${SIGNS[lagnaSign]}</td><td>${lagnaDeg.toFixed(1)}°</td><td>${lagnaNak.name}</td><td>1</td></tr>`;

    positions.forEach(p => {
        const house = ((p.sign - lagnaSign + 12) % 12) + 1;
        const nak = NAKSHATRAS[p.nakshatra] || { ko: '-', name: '-' };
        const roleMap = { Sun:'Self/Authority', Moon:'Emotions/Mind', Mars:'Energy/Courage', Mercury:'Intelligence/Communication', Jupiter:'Luck/Wisdom', Venus:'Love/Charm', Saturn:'Patience/Responsibility', Rahu:'Desire/Innovation', Ketu:'Spirituality/Liberation' };
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
    const isEasy = window.vedicMode === 'easy';
    const SIGN_RULERS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
    const RULER_NAMES = {Sun:'Sol',Moon:'Luna',Mars:'Marte',Mercury:'Mercurio',Jupiter:'Júpiter',Venus:'Venus',Saturn:'Saturno',Rahu:'Rahu',Ketu:'Ketu'};

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
        'Liderazgo, milicia, deportes, emprendimiento (pionero de fuego)',
        'Finanzas, agricultura, artes, bienes raíces, alimentación (estabilidad y lo material)',
        'Comunicación, medios, escritura, enseñanza, marketing (intelectual)',
        'Enfermería, cuidado de personas, cocina, hostelería, orientación (cuidado emocional)',
        'Política, entretenimiento, liderazgo, creatividad (escenario brillante)',
        'Medicina, contabilidad, análisis, edición, salud/bienestar (servicio preciso)',
        'Derecho, diplomacia, diseño, moda, mediación (equilibrio y belleza)',
        'Investigación, medicina, ocultismo, psicología (profundidad y transformación)',
        'Educación, viajes, filosofía, religión, editorial (expansión y exploración)',
        'Gobierno, construcción, gestión, CEO, líder organizacional (sistema y autoridad)',
        'Tecnología, TI, invención, activismo social, ciencia (innovación)',
        'Artes, espiritualidad, sanación, música, caridad (trascendencia y servicio)'
    ];

    const planetCareer = {
        Sun: 'Funcionario de gobierno, político, médico, CEO — puestos de autoridad',
        Moon: 'Enfermero/a, consejero/a, chef, hostelería — roles de cuidado/emocionales',
        Mars: 'Milicia, policía, cirujano, ingeniero, atleta',
        Mercury: 'Escritor, maestro, programador, contador, comerciante',
        Jupiter: 'Profesor, juez, líder religioso, consultor, profesional senior',
        Venus: 'Diseñador, actor, músico, moda, industria de la belleza',
        Saturn: 'Construcción, minería, agricultura, gestión, artesano',
        Rahu: 'TI, relaciones con el extranjero, carreras no convencionales, investigación',
        Ketu: 'Espiritualidad, medicina alternativa, investigación, asceta'
    };

    let html = '';

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '🕉️ Tú Después del Matrimonio: ${SIGNS[d9LagnaSign]} ${SIGN_SYMBOLS[d9LagnaSign]}' : '🕉️ D9 Lagna — Tú Después del Matrimonio: ${SIGNS[d9LagnaSign]} ${SIGN_SYMBOLS[d9LagnaSign]}') + '</div>
        <div class="interp-text">
            El Lagna Navamsa está en <strong>${SIGNS[d9LagnaSign]}</strong>. Esto revela tu verdadero yo después del matrimonio y en la segunda mitad de la vida (a partir de los 30).
            ${d9LagnaSign === d1LagnaSign ? '<br><br><strong>¡El Lagna D1 y el D9 están en el mismo signo!</strong> Esto se llama <strong>Vargottama</strong> — extremadamente poderoso. Tu esencia permanece igual después del matrimonio; el yo interno y externo están alineados.' : ''}
            ${d9H1Planets.length > 0 ? '<br><br><strong>Planetas en la casa 1 D9:</strong> ' + d9H1Planets.map(p => p.symbol + ' ' + p.name).join(', ') + ' — Estos planetas influyen fuertemente en tu personalidad después del matrimonio.' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '💍 Carácter del Cónyuge: ${SIGNS[d9H7Sign]} ${SIGN_SYMBOLS[d9H7Sign]}' : '💍 D9 Casa 7 — Carácter del Cónyuge: ${SIGNS[d9H7Sign]} ${SIGN_SYMBOLS[d9H7Sign]}') + '</div>
        <div class="interp-text">
            La casa 7 del Navamsa está en <strong>${SIGNS[d9H7Sign]}</strong>, regida por <strong>${RULER_NAMES[d9H7Ruler]}</strong>.<br><br>
            Esto revela la personalidad esencial de tu cónyuge — alguien con la energía de ${SIGNS[d9H7Sign]}.
            ${d9H7Planets.length > 0 ? '<br><br><strong>Planetas en la casa 7 D9:</strong><br>' + d9H7Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${p.natural === 'benefic' ? '¡Benéfico! Recibes energía positiva de tu cónyuge.' : 'Maléfico — desafíos en el matrimonio, pero también oportunidades de crecimiento.'}`).join('<br>') : '<br><br>No hay planetas en la casa 7 — la posición del señor de la 7 es más relevante.'}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '💼 Propósito de Vida (Dharma): ${SIGNS[d9H10Sign]} ${SIGN_SYMBOLS[d9H10Sign]}' : '💼 D9 Casa 10 — Propósito de Vida (Dharma): ${SIGNS[d9H10Sign]} ${SIGN_SYMBOLS[d9H10Sign]}') + '</div>
        <div class="interp-text">
            La casa 10 del Navamsa está en <strong>${SIGNS[d9H10Sign]}</strong>, regida por <strong>${RULER_NAMES[d9H10Ruler]}</strong>.<br><br>
            Mientras que la casa 10 del D1 muestra tu carrera, la casa 10 del D9 revela tu <strong>propósito de vida superior (Dharma)</strong> — la vocación verdadera que persigues tras la madurez.<br><br>
            <strong>Dirección del propósito:</strong> ${careerBySgn[d9H10Sign]}
            ${d9H10Planets.length > 0 ? '<br><br><strong>Planetas en la casa 10 D9:</strong><br>' + d9H10Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${planetCareer[p.id] || 'Energía profesional única'}`).join('<br>') : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '👔 Carrera del Cónyuge' : '👔 Carrera del Cónyuge — Casa 10 Derivada (D9 Casa 4): ${SIGNS[d9H4Sign]} ${SIGN_SYMBOLS[d9H4Sign]}') + '</div>
        <div class="interp-text">
            <strong>Principio de casa derivada:</strong> La casa 10 desde la 7 (cónyuge) = la casa 4 del D9 muestra la carrera/actividad social de tu cónyuge.<br><br>
            La casa 4 D9 está en <strong>${SIGNS[d9H4Sign]}</strong>, regida por <strong>${RULER_NAMES[d9H4Ruler]}</strong>.<br><br>
            <strong>Tendencia profesional del cónyuge:</strong> ${careerBySgn[d9H4Sign]}
            ${d9H4Planets.length > 0 ? '<br><br><strong>Planetas en la casa 4 D9 (casa 10 del cónyuge):</strong><br>' + d9H4Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: El cónyuge probablemente trabaja en ${planetCareer[p.id] || 'campo especializado'}`).join('<br>') : ''}
        </div>
    </div>`;

    const vargottamaPlanets = d9Positions.filter(p => p.sign === p.d9Sign);
    if (vargottamaPlanets.length > 0) {
        html += `<div class="interp-card">
            <div class="interp-title">⭐ Planetas Vargottama — Excepcionalmente Fuertes</div>
            <div class="interp-text">
                Los planetas en el mismo signo tanto en D1 como en D9 se llaman <strong>Vargottama</strong>. Son muy poderosos; su energía actúa de forma constante a lo largo de toda la vida.<br><br>
                ${vargottamaPlanets.map(p => `<strong>${p.symbol} ${p.name}</strong>: En ${SIGNS[p.sign]} tanto en D1 como en D9 — ¡energía excepcionalmente fuerte!`).join('<br>')}
            </div>
        </div>`;
    }

    // 6. Spouse Direction — 6 Indicator Combined Analysis
    const DIRECTIONS = {
        0:'Este', 1:'Sur', 2:'Oeste', 3:'Norte',
        4:'Este', 5:'Sur', 6:'Oeste', 7:'Norte',
        8:'Este', 9:'Sur', 10:'Oeste', 11:'Norte'
    };
    const DIR_DETAIL = {
        0:'Este (Aries — fuego)',1:'Sur (Tauro — tierra)',2:'Oeste (Géminis — aire)',3:'Norte (Cáncer — agua)',
        4:'Este (Leo — fuego)',5:'Sur (Virgo — tierra)',6:'Oeste (Libra — aire)',7:'Norte (Escorpio — agua)',
        8:'Este (Sagitario — fuego)',9:'Sur (Capricornio — tierra)',10:'Oeste (Acuario — aire)',11:'Norte (Piscis — agua)'
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
        {name:'D1 Casa 7', sign: d1H7Sign, desc:'Casa del cónyuge en la carta natal'},
        {name:'D9 Casa 7', sign: d9H7Sign, desc:'Casa del cónyuge en el Navamsa'},
        {name:'Señor D9 Casa 7', sign: d9H7RulerSign, desc:'Donde va el señor de la casa 7 D9'},
        {name:'D9 Venus', sign: venusD9Sign, desc:'Karaka del cónyuge en el Navamsa'},
        {name:'Upapada (UL)', sign: ulSign, desc:'Arudha de la casa 12 — origen del cónyuge'},
        {name:'Darapada (A7)', sign: a7Sign, desc:'Arudha de la casa 7 — imagen social del cónyuge'}
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
        <div class="interp-title">' + (isEasy ? '🧭 Spouse Direction' : '🧭 Dirección del Cónyuge — Análisis de 6 Indicadores') + '</div>
        <div class="interp-text">
            La astrología védica determina la dirección del cónyuge combinando múltiples indicadores.<br><br>
            <strong>6 Indicadores:</strong><br>
            ${dirSources.map(s => `• <strong>${s.name}</strong>: ${SIGNS[s.sign]} ${SIGN_SYMBOLS[s.sign]} → <strong>${DIRECTIONS[s.sign]}</strong> <span style="color:#666;font-size:12px;">(${s.desc})</span>`).join('<br>')}
            <br><br>
            <strong>🧿 Upapada Lagna (UL):</strong> Arudha de la casa 12 — familia/origen del cónyuge → <strong>${SIGNS[ulSign]} ${SIGN_SYMBOLS[ulSign]}</strong><br>
            <strong>🎯 Darapada (A7):</strong> Arudha de la casa 7 — imagen social del cónyuge → <strong>${SIGNS[a7Sign]} ${SIGN_SYMBOLS[a7Sign]}</strong><br>
            <strong>💍 Señor D9 Casa 7 (${RULER_NAMES[d9H7Ruler]}):</strong> Donde se ubica el señor de la casa 7 Navamsa → <strong>${SIGNS[d9H7RulerSign]} ${SIGN_SYMBOLS[d9H7RulerSign]}</strong><br>
            <strong>♀ D9 Venus:</strong> Karaka del cónyuge en el Navamsa → <strong>${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}</strong><br><br>
            <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:14px;margin-top:10px;">
                <strong style="font-size:16px;">🧭 Conclusión: Dirección ${primaryDir} ${agreement >= 4 ? 'abrumadoramente fuerte' : agreement >= 3 ? 'muy fuerte' : agreement >= 2 ? 'fuerte' : ''}</strong><br><br>
                <strong>${agreement}</strong> de 6 indicadores apuntan hacia <strong>${primaryDir}</strong>.
                ${agreement >= 4 ? '<br>¡4 o más indicadores coinciden! <strong>Probabilidad muy alta</strong> de conocer al cónyuge por el ' + primaryDir + '. Presta atención a ciudades, lugares de trabajo o viajes en esa dirección.' : ''}
                ${agreement === 3 ? '<br>3 indicadores coinciden — <strong>alta probabilidad</strong> de dirección ' + primaryDir + '.' : ''}
                ${agreement === 2 ? '<br>2 indicadores coinciden — ' + primaryDir + ' es favorable pero existen otras posibilidades.' : ''}
                ${agreement <= 1 ? '<br>Los indicadores están dispersos — el cónyuge puede venir de distintas direcciones. Mantén la mente abierta.' : ''}
                ${sortedDirs.length > 1 && sortedDirs[1][1] === sortedDirs[0][1] ? '<br><br>💡 Dos direcciones indicadas por igual: <strong>' + sortedDirs[0][0] + '</strong> y <strong>' + sortedDirs[1][0] + '</strong>.' : ''}
            </div>
        </div>
    </div>`;

    const meetingBySgn = [
        "Lugares activos, deportes, entornos competitivos, reuniones de liderazgo. Primer encuentro intenso y repentino.",
        "Lugar de trabajo, instituciones financieras, restaurantes, naturaleza. Construyendo confianza poco a poco.",
        "Redes sociales, escuela, seminarios, viajes, citas a ciegas. La relación comienza con una conversación.",
        "Presentaciones familiares, reuniones de vecinos, amigos de la infancia. Comienza en ambientes cómodos.",
        "Fiestas, conciertos, reuniones creativas, lugares glamurosos. Primer encuentro dramático.",
        "Lugar de trabajo, hospital, actividades relacionadas con la salud o el voluntariado. El encuentro surge de necesidades prácticas.",
        "Citas a ciegas, intermediarios, eventos legales/diplomáticos, exposiciones de arte. Encuentro elegante y refinado.",
        "Situaciones de crisis, conversaciones profundas, lugares secretos, laboratorios de investigación. Atracción intensa y kármica.",
        "Extranjero, universidad, reuniones religiosas/filosóficas, durante un viaje. Conexión desde lejos. Posible diferencia cultural.",
        "Lugar de trabajo, eventos de negocios, actos oficiales. El encuentro está relacionado con el estatus social.",
        "En línea, clubes de hobbies, movimientos sociales, amigo de un amigo. Encuentro único y no convencional.",
        "Reuniones espirituales, extranjero, artes/música, hospital, indicios en sueños. Encuentro místico y predestinado."
    ];

    const backgroundBySgn = [
        "Familia independiente y forjada por sus propios medios. Fuerte herencia de liderazgo.",
        "Familia económicamente estable. Valores tradicionales. Posiblemente con buena posición económica.",
        "Familia intelectual y comunicativa. Énfasis en la educación.",
        "Hogar cálido y orientado a la familia. Figura materna fuerte.",
        "Familia prestigiosa y orgullosa. Estatus social y reputación.",
        "Familia práctica y trabajadora. Antecedentes en salud/medicina/educación.",
        "Familia equilibrada y digna. Antecedentes en artes/derecho/diplomacia.",
        "Familia con secretos o transformaciones. Historia familiar profunda.",
        "Familia académica, religiosa o filosófica. Posible origen extranjero.",
        "Familia estricta y tradicional. Respetada socialmente. Énfasis en la responsabilidad.",
        "Estructura familiar libre y única. Pensamiento progresista.",
        "Familia espiritual o artística. Posible origen extranjero. Rica sensibilidad."
    ];

    const imageBySgn = [
        "Primera impresión enérgica y segura. Imagen deportiva o fuerte.",
        "Primera impresión tranquila y confiable. Imagen refinada y digna.",
        "Primera impresión brillante y habladora. Imagen intelectual e ingeniosa.",
        "Primera impresión cálida y protectora. Imagen suave y afectuosa.",
        "Primera impresión glamurosa y carismática. Imagen segura de sí misma.",
        "Primera impresión ordenada y pulcra. Imagen meticulosa y profesional.",
        "Primera impresión elegante y encantadora. Imagen equilibrada y sofisticada.",
        "Primera impresión misteriosa e intensa. Imagen profunda y carismática.",
        "Primera impresión libre y vibrante. Imagen positiva y aventurera.",
        "Primera impresión seria y madura. Imagen responsable y fiable.",
        "Primera impresión única e individualista. Imagen moderna y original.",
        "Primera impresión soñadora y mística. Imagen artística y emotiva."
    ];

    const attractBySgn = [
        "Energía poderosa y confianza en sí mismo. La naturaleza proactiva y protectora resulta atractiva.",
        "Estabilidad y encanto sensual. Disfrutar juntos de buena comida, aromas y texturas.",
        "Ingenio y habilidad para conversar. La estimulación intelectual es el atractivo.",
        "Cuidado devoto y emoción. Sentirse en casa juntos es el encanto.",
        "Presencia radiante y generosidad. Sentirse especial juntos es atractivo.",
        "Consideración delicada y perfeccionismo. La atención al detalle resulta encantadora.",
        "Elegancia y personalidad armoniosa. El mundo se vuelve más bello juntos.",
        "Mirada intensa y profundidad. La concentración que llega al alma es el atractivo.",
        "Espíritu libre y humor. Las aventuras comienzan cuando estáis juntos.",
        "Confiabilidad sólida y madurez. Una estabilidad inquebrantable resulta atractiva.",
        "Individualidad única y pensamiento progresista. Una frescura nunca vista antes.",
        "Sensibilidad mística y profundidad espiritual. Un romance de ensueño es el encanto."
    ];

    const d1H7ForMeeting = (d1LagnaSign + 6) % 12;

    html += `<div class="interp-card">
        <div class="interp-title">🤝 Dónde Conoces a Tu Cónyuge ' + (isEasy ? '— Casa 7: ${SIGNS[d1H7ForMeeting]} ${SIGN_SYMBOLS[d1H7ForMeeting]}' : '— D1 Casa 7: ${SIGNS[d1H7ForMeeting]} ${SIGN_SYMBOLS[d1H7ForMeeting]}') + '</div>
        <div class="interp-text">
            El signo de la casa 7 revela el entorno y las circunstancias en que conoces a tu cónyuge.<br><br>
            <strong>${meetingBySgn[d1H7ForMeeting]}</strong>
            ${d1H7ForMeeting === 8 || d1H7ForMeeting === 11 ? '<br><br>💡 <strong>¡Posibilidad de cónyuge extranjero!</strong> Los signos relacionados con la casa 9 (extranjero) o la casa 12 (residencia en el exterior) están en la 7, lo que sugiere que el cónyuge puede ser extranjero o que el encuentro ocurra en el exterior.' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '🏛️ Origen Familiar del Cónyuge' : '🏛️ Origen Familiar del Cónyuge — UL: ${SIGNS[ulSign]} ${SIGN_SYMBOLS[ulSign]}') + '</div>
        <div class="interp-text">
            El Upapada Lagna (UL) revela el entorno familiar y la crianza de tu cónyuge.<br><br>
            <strong>${backgroundBySgn[ulSign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '👤 Primera Impresión del Cónyuge' : '👤 Primera Impresión del Cónyuge — A7: ${SIGNS[a7Sign]} ${SIGN_SYMBOLS[a7Sign]}') + '</div>
        <div class="interp-text">
            El Darapada (A7) muestra cómo aparece tu cónyuge ante el mundo — su imagen externa y primera impresión.<br><br>
            <strong>${imageBySgn[a7Sign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">💎 Punto de Atracción del Cónyuge ' + (isEasy ? '— Venus: ${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}' : '— D9 Venus: ${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}') + '</div>
        <div class="interp-text">
            Venus en el Navamsa revela el encanto esencial y el estilo amoroso de tu cónyuge.<br><br>
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

    const html = isEasy ? `
        <div class="nakshatra-card">
            <div class="nakshatra-name">Tu Estrella: ${nak.ko || nak.name}</div>
            <div class="nakshatra-meaning">"${nak.meaning}"</div>
            <div class="nakshatra-detail">${nak.desc}</div>
        </div>
    ` : `
        <div class="nakshatra-card">
            <div class="nakshatra-name">${nak.name}</div>
            <div class="nakshatra-meaning">"${nak.meaning}" — Planeta regente: ${DASHA_KO[nak.ruler] || nak.ruler}</div>
            <div class="nakshatra-detail">
                Deidad: ${nak.deity}<br><br>
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

    let html = '<div class="interp-card" style="margin-bottom:12px;border-left:3px solid #c9a84c;"><div class="interp-text" style="font-size:12px;color:#888;">💡 <strong>Vimshottari Dasha</strong> — La vida se divide en periodos gobernados por 9 planetas. <strong>Mahadasha</strong> es el periodo mayor, <strong>Antardasha (Bhukti)</strong> es el subperiodo. Calculado desde la posicion del nakshatra lunar.<br><br>';
    html += isEasy ? '</div></div>' : '🌙 Luna natal: <strong>' + nak.ko + ' (' + nak.name + ')</strong> — Primer Dasha: <strong>' + DASHA_KO[startRuler] + '</strong> (restante: ' + remainingYears.toFixed(2) + ' años)</div></div>';

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
        const dashaEasyDesc = {Ketu:'Reflexión interior y crecimiento espiritual',Venus:'Amor, belleza y abundancia',Sun:'Confianza y liderazgo brillan',Moon:'Emociones y hogar son protagonistas',Mars:'Desafíos y energía de acción',Rahu:'Grandes cambios y nuevas oportunidades',Jupiter:'Suerte y crecimiento llegan',Saturn:'La paciencia trae grandes recompensas',Mercury:'Estudio, comunicación y negocios prosperan'};
        html += '<span class="dasha-planet">' + (isEasy ? dashaEasyDesc[p.planet] : DASHA_KO[p.planet]) + '</span>';
        html += '<span class="dasha-period">' + fmtDate(p.startD) + ' ~ ' + fmtDate(p.endD) + '</span>';
        html += '<span class="dasha-years">' + (p.actualDays / 365.25).toFixed(1) + ' años</span>';
        if (isCurrent) html += '<span class="dasha-badge">Current</span>';
        html += '<span style="font-size:10px;color:#666;margin-left:4px;">(' + age + ') ▼</span>';

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
    const isEasy = window.vedicMode === 'easy';
    // Helper: get house number from sign
    function houseOf(signIdx) { return ((signIdx - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    let html = '';

    // ═══════════════════════════════════
    // 1. Personalidad y Apariencia (1st House Lagna)
    // ═══════════════════════════════════
    const lagnaEasy = [
        '¡Persona de acción! Decisivo/a con cualidades de liderazgo. Amas los nuevos desafíos. Un poco impaciente, pero increíblemente motivado/a.',
        'Amas la estabilidad. Disfrutas de la comodidad y la belleza. Una vez que decides algo, llegas hasta el final. Terco/a pero confiable.',
        '¡Curiosidad infinita! Gran comunicador/a y multitalentoso/a. Captas información rápidamente. A veces disperso/a, pero eso es parte de tu encanto.',
        'Cálido/a y emocional. Valoras la familia y lees bien las emociones. Un/a cuidador/a natural que hace que todos se sientan cómodos.',
        '¡Líder nato/a! Gran presencia que atrae naturalmente la atención. Seguro/a de sí mismo/a y magnético/a. Generoso/a con el amor.',
        'Detallista y analítico/a. Buscas la perfección. Observador/a agudo/a que nota lo que otros pasan por alto. Te preocupas mucho, pero siempre estás preparado/a.',
        'Buscas la armonía. Refinado/a y encantador/a con excelente gusto artístico. Más feliz cuando estás rodeado/a de cosas bellas.',
        'Profundidad. Fuerte intuición que penetra hasta la verdad. Tranquilo/a por fuera pero con emociones intensas por dentro.',
        '¡Espíritu libre! Amas viajar y aprender. Positivo/a y filosófico/a. Tu humor ilumina cualquier lugar.',
        'Ambicioso/a. Paciente y cada vez más atractivo/a con la edad. Trabajas sistemáticamente hacia tus metas. Tipo de éxito tardío.',
        'Único/a. Piensas diferente a todos los demás. Odias las cajas y quieres cambiar el mundo a tu manera.',
        'Profundamente sensible. Fuerte intuición atraída por el arte y la espiritualidad. Sueños vívidos. Tu mundo interior es más rico que el exterior.'
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
        <div class="interp-title">👤 Personalidad y Apariencia — Lagna: ${SIGNS[lagnaSign]} ${SIGN_SYMBOLS[lagnaSign]}</div>
        <div class="interp-text">${lagnaInterp[lagnaSign]}</div>
    </div>`;

    // ═══════════════════════════════════
    // 2. Yo Interior y Emociones (Moon Sign)
    // ═══════════════════════════════════
    if (moonPos) {
        const moonEasy = [
        'Hay una pasión ardiente dentro de ti. Las emociones suben rápido y bajan rápido. Cuando estás estresado/a, necesitas moverte — el ejercicio funciona mejor.',
        'Emocionalmente muy estable. No te gustan los cambios bruscos. Buena comida, música y naturaleza te sanan. Una vez que das tu corazón, rara vez cambias.',
        'Procesas emociones hablando. Hablar las cosas te hace sentir mejor. Curioso/a y no soportas el aburrimiento. Tu humor puede aligerar cualquier ambiente.',
        'Extremadamente sensible y empático/a. Absorbes las emociones de otros como una esponja. El hogar es tu refugio. Cocinar o decorar trae paz emocional.',
        'Expresión emocional dramática y apasionada. Necesitas profundamente ser amado/a y reconocido/a. Pero das amor con la misma generosidad. Las actividades creativas son tu medicina.',
        'Analizas y organizas tus emociones. Te preocupas mucho pero resuelves problemas de forma práctica. Las rutinas diarias traen estabilidad emocional.',
        'Encuentras equilibrio emocional en las relaciones. Te sientes solo/a cuando estás a solas. Odias profundamente el conflicto. El arte y la belleza te dan paz.',
        'Tus emociones son tan profundas e intensas como el océano. Amas profundamente y nunca olvidas la traición. Tu intuición es increíblemente fuerte.',
        'Emocionalmente brillante y optimista. Amas la libertad y odias las restricciones. Viajar es tu mejor remedio emocional.',
        'No muestras emociones fácilmente. Fuerte sentido de responsabilidad. Con la edad te vuelves más abierto/a emocionalmente.',
        'Patrones emocionales únicos e impredecibles. Amas de maneras poco convencionales. Encuentras satisfacción emocional en causas sociales.',
        'Extremadamente intuitivo/a y espiritual. Sueños vívidos que a veces se sienten proféticos. El arte, la meditación y el agua te dan paz.'
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
            <div class="interp-title">🌙 Yo Interior y Emociones — Moon: ${SIGNS[moonPos.sign]} ${SIGN_SYMBOLS[moonPos.sign]}</div>
            <div class="interp-text">${isEasy ? moonEasy[moonPos.sign] : moonInterp[moonPos.sign]}</div>
        </div>`;
    }

    // ═══════════════════════════════════
    // 3. 💰 Fortuna de Riqueza (2nd & 11th House Analysis)
    // ═══════════════════════════════════
    const h2planets = planetsInHouse(2);
    const h11planets = planetsInHouse(11);
    const h2sign = (lagnaSign + 1) % 12;
    const h11sign = (lagnaSign + 10) % 12;

    let wealthText = isEasy ? '' : `<strong>2nd House (Accumulated Wealth):</strong> Located in ${SIGNS[h2sign]}. `;
    if (h2planets.length === 0) {
        wealthText += 'Sin planetas en la casa 2 — la acumulacion de riqueza es constante y estable sin grandes fluctuaciones. ';
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
        wealthText += 'Sin planetas en la casa 11 — los ingresos son estables sin grandes fluctuaciones.';
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
        <div class="interp-title">💰 Fortuna de Riqueza</div>
        <div class="interp-text">${wealthText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 4. 💕 Fortuna del Conyuge y Matrimonio (7th House Analysis)
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
        <div class="interp-title">💕 Fortuna del Conyuge y Matrimonio — 7th House: ${SIGNS[h7sign]} ${SIGN_SYMBOLS[h7sign]}</div>
        <div class="interp-text">${spouseText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 5. 💼 Carrera y Logro Social (10th House Analysis)
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
        <div class="interp-title">💼 Carrera y Logro Social — 10th House: ${SIGNS[h10sign]} ${SIGN_SYMBOLS[h10sign]}</div>
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
        <div class="interp-title">🏥 Salud — Areas Vulnerables</div>
        <div class="interp-text">${healthByLagna[lagnaSign]}${h6planets.length > 0 ? '<br><br>' + isEasy ? '' : h6planets.map(p => p.name).join(', ') + ' in the 6th house requires special attention to health management.' : ''}</div>
    </div>`;

    // ═══════════════════════════════════
    // 7. ⏳ Actual Dasha Interpretation
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
                    <div class="interp-title">⏳ Actual Dasha: ${DASHA_KO[currentDasha]} Dasha</div>
                    <div class="interp-text">${dashaInterp[currentDasha]}</div>
                </div>`;
            }
        }
    }

    // ═══════════════════════════════════
    // 8. 🔮 Yogas Especiales (Combinaciones Planetarias)
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
            <div class="interp-title">🔮 Yogas Especiales (Combinaciones Planetarias)</div>
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
        text += 'Sin planetas en la casa 9 — hay viajes al extranjero pero sin conexion particularmente fuerte.';
    } else {
        h9.forEach(p => {
            const f9 = { Sun: 'Father has foreign connections. Government/official overseas trips.', Moon: 'Emotionally enjoys foreign travel. Popularity abroad.', Mars: 'Adventure/challenges abroad. Military/technology-related foreign activities.', Mercury: 'Study abroad/business success! Multilingual abilities.', Jupiter: 'Great fortune abroad! Successful study/immigration. Meeting a foreign teacher.', Venus: 'Romance abroad. Art/fashion-related foreign activities.', Saturn: 'Hardship then success abroad. Long-term foreign residence.', Rahu: 'Strong indicator of foreign migration! Deeply immersed in foreign culture.', Ketu: 'Past-life foreign connections. Spiritual pilgrimage.' };
            text += isEasy ? `${f9[p.id] || ''}<br>` : `${p.symbol} ${p.name}: ${f9[p.id] || ''}<br>`;
        });
    }

    text += '<br><strong>12th House (Foreign Settlement · Immigration · Expenses):</strong><br>';
    if (h12.length === 0) {
        text += 'Sin planetas en la casa 12 — la residencia domestica es mas natural que el asentamiento en el extranjero.';
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
            <strong>💡 Facil de entender:</strong> A planet's "dignity" refers to how well it can exert its power.<br><br>
            🟢 <strong>Exaltado</strong> = Peak condition! Great fortune and results in the life area this planet governs.<br>
            🟡 <strong>Signo Propio</strong> = Comfortable as if at home. Stable and good results.<br>
            ⚪ <strong>Neutro</strong> = Average. Neither particularly strong nor weak.<br>
            🔴 <strong>Debilitado</strong> = Weakened state. Difficulties in this area, but can be overcome with effort.
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
            dignity = 'Exaltado';
            emoji = '🟢';
            color = '#5cb85c';
            simpleDesc = `<strong>${p.name} is at maximum power!</strong> The "${role}" energy is maximized in the <strong>${house}${hSuffix} house (${area})</strong> area, bringing great blessings. Innate talents shine and good results come naturally.`;
        } else if (p.sign === DEBI[p.id]) {
            dignity = 'Debilitado';
            emoji = '🔴';
            color = '#d9534f';
            simpleDesc = `<strong>${p.name} is in a weakened state.</strong> The "${role}" energy is weakened in the <strong>${house}${hSuffix} house (${area})</strong> area. You may experience difficulties in this field, but conscious effort to overcome them can become a great opportunity for growth. See the remedies below.`;
        } else if (OWN[p.id] && OWN[p.id].includes(p.sign)) {
            dignity = 'Signo Propio';
            emoji = '🟡';
            color = '#c9a84c';
            simpleDesc = `<strong>${p.name} is at home!</strong> The "${role}" energy stably exerts its power in the <strong>${house}${hSuffix} house (${area})</strong> area. Good results come naturally.`;
        } else {
            dignity = 'Neutro';
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
            <strong>🎨 Color de la suerte:</strong> ${d.color}<br>
            <strong>🔢 Numero de la suerte:</strong> ${d.number}<br>
            <strong>📅 Dia de la suerte:</strong> ${d.day}<br>
            <strong>💎 Piedra de la suerte:</strong> ${d.gem}<br>
            <strong>🧭 Direccion de la suerte:</strong> ${d.dir}<br>
            <strong>🪐 Planeta Regente del Lagna:</strong> ${lagnaRulers[lagnaSign]}
        </div>
    </div>`;
    document.getElementById('luckyWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// Remedies & Metodos de Fortalecimiento
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
                <div class="interp-title">${p.symbol} ${p.name} Metodos de Fortalecimiento ${isDebi ? '(Debilitado — Especialmente Importante!)' : '(Posicion Debil)'}</div>
                <div class="interp-text">
                    <strong>💎 Piedra preciosa:</strong> ${r.gem} (Recommended to wear on ring finger)<br>
                    <strong>🙏 Mantra:</strong> "${r.mantra}" (Chant 108 times daily)<br>
                    <strong>🎨 Color:</strong> ${r.color}<br>
                    <strong>🍽️ Alimentos:</strong> ${r.food}<br>
                    <strong>🤝 Caridad:</strong> ${r.charity}
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
    const RULER_NAMES = {Sun:'Sol',Moon:'Luna',Mars:'Marte',Mercury:'Mercurio',Jupiter:'Júpiter',Venus:'Venus',Saturn:'Saturno',Rahu:'Rahu',Ketu:'Ketu'};

    const isEasy = window.vedicMode === 'easy';
    let html = '';

    if (division === 10) {
        // D10 해석: 직업/커리어
        const d10_1lord = SIGN_RULERS[dLagnaSign];
        const d10_10sign = (dLagnaSign + 9) % 12;
        const d10_10lord = SIGN_RULERS[d10_10sign];
        const d10_10planets = dPositions.filter(p => p.dSign === d10_10sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💼 Analisis de Carrera' : '💼 D10 Analisis de Carrera') + '</div><div class="interp-text">';
        html += '<strong>D10 Lagna:</strong> ' + SIGNS[dLagnaSign] + ' (Regente: ' + (RULER_NAMES[d10_1lord]||d10_1lord) + ')<br>';
        html += '<strong>D10 Casa 10 (Carrera):</strong> ' + SIGNS[d10_10sign] + ' (Regente: ' + (RULER_NAMES[d10_10lord]||d10_10lord) + ')<br>';
        if (d10_10planets.length > 0) {
            html += '<strong>Planetas en casa 10:</strong> ' + d10_10planets.map(p => p.name).join(', ') + '<br>';
        }

        // 직업 성향 by D10 라그나
        const careerBySign = [
            'Leadership, Military, Sports, Entrepreneur',  // 양자리
            'Finance, Arts, Real Estate, Food Industry',     // 황소
            'Communication, Media, Education, IT',  // 쌍둥이
            'Nursing, Real Estate, Hotels, Counseling',    // 게
            'Politics, Entertainment, Management, Administration',        // 사자
            'Medical, Accounting, Analysis, Research',          // 처녀
            'Law, Diplomacy, Design, Consulting',      // 천칭
            'Investigation, Research, Medicine, Insurance',          // 전갈
            'Education, Religion, Foreign Trade, Publishing',      // 사수
            'Administration, Construction, Mining, Civil Service',        // 염소
            'IT, Innovation, NGO, Aviation',           // 물병
            'Arts, Hospital, Foreign, Spirituality'           // 물고기
        ];
        html += '<strong>Campos adecuados:</strong> ' + careerBySign[dLagnaSign];
        html += '</div></div>';

    } else if (division === 7) {
        // D7 해석: 자녀
        const d7_5sign = (dLagnaSign + 4) % 12;
        const d7_5lord = SIGN_RULERS[d7_5sign];
        const d7_5planets = dPositions.filter(p => p.dSign === d7_5sign);
        const benefics = d7_5planets.filter(p => p.natural === 'benefic');
        const malefics = d7_5planets.filter(p => p.natural === 'malefic');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👶 Analisis de Hijos' : '👶 D7 Analisis de Hijos') + '</div><div class="interp-text">';
        html += '<strong>D7 Lagna:</strong> ' + SIGNS[dLagnaSign] + '<br>';
        html += '<strong>D7 Casa 5 (Hijos):</strong> ' + SIGNS[d7_5sign] + ' (Regente: ' + (RULER_NAMES[d7_5lord]||d7_5lord) + ')<br>';
        if (d7_5planets.length > 0) {
            html += '<strong>Planetas en casa 5:</strong> ' + d7_5planets.map(p => p.name).join(', ') + '<br>';
        }
        if (benefics.length > 0) html += 'Benefico en casa 5 — bendecido con hijos.<br>';
        if (malefics.length > 0) html += 'Malefico en casa 5 — desafios con hijos.<br>';
        if (d7_5planets.length === 0) html += 'Sin planetas en casa 5 — revise la posicion del señor de casa 5.';
        html += '</div></div>';

    } else if (division === 12) {
        // D12 해석: 부모
        const d12_4sign = (dLagnaSign + 3) % 12; // 4궁 = 어머니
        const d12_9sign = (dLagnaSign + 8) % 12; // 9궁 = 아버지
        const d12_4planets = dPositions.filter(p => p.dSign === d12_4sign);
        const d12_9planets = dPositions.filter(p => p.dSign === d12_9sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨‍👩‍👧 Analisis de Padres' : '👨‍👩‍👧 D12 Analisis de Padres') + '</div><div class="interp-text">';
        html += '<strong>D12 Lagna:</strong> ' + SIGNS[dLagnaSign] + '<br>';
        html += '<strong>D12 Casa 4 (Madre):</strong> ' + SIGNS[d12_4sign];
        if (d12_4planets.length > 0) html += ' — ' + d12_4planets.map(p => p.name).join(', ');
        html += '<br>';
        html += '<strong>D12 Casa 9 (Padre):</strong> ' + SIGNS[d12_9sign];
        if (d12_9planets.length > 0) html += ' — ' + d12_9planets.map(p => p.name).join(', ');
        html += '<br>';

        const moon4 = d12_4planets.find(p => p.id === 'Moon');
        const sun9 = d12_9planets.find(p => p.id === 'Sun');
        if (moon4) html += 'Luna en casa 4 — vinculo profundo con la madre.<br>';
        if (sun9) html += 'Sol en casa 9 — vinculo profundo con el padre.<br>';
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
            {name:'Ghora',nature:'malefic',desc:'Destruccion y miedo. Karma oscuro de vidas pasadas'},
            {name:'Rakshasa',nature:'malefic',desc:'Energia demoniaca. Fuerte deseo y apego'},
            {name:'Deva',nature:'benefic',desc:'Ser divino. Merito y bendiciones de vidas pasadas'},
            {name:'Kubera',nature:'benefic',desc:'Dios de la riqueza. Karma de construccion de riqueza'},
            {name:'Yaksha',nature:'benefic',desc:'Guardian de la naturaleza. Armonia con la naturaleza'},
            {name:'Kinnara',nature:'benefic',desc:'Musico celestial. Talento artistico'},
            {name:'Bhrashta',nature:'malefic',desc:'El caido. Karma de caer desde lo alto'},
            {name:'Kulaghna',nature:'malefic',desc:'Destructor de familia. Karma familiar'},
            {name:'Garala',nature:'malefic',desc:'Veneno. Karma de acciones toxicas'},
            {name:'Vahni',nature:'malefic',desc:'Dios del fuego. Karma de ira y destruccion'},
            {name:'Maya',nature:'malefic',desc:'Ilusion. Karma de engaño'},
            {name:'Purishaka',nature:'malefic',desc:'Atadura. Karma de restringir a otros'},
            {name:'Apampathi',nature:'benefic',desc:'Señor de las aguas. Purificacion y sanacion'},
            {name:'Marut',nature:'benefic',desc:'Dios del viento. Libertad y cambio'},
            {name:'Kala',nature:'malefic',desc:'Dios del tiempo. Karma de tiempo y muerte'},
            {name:'Sarpa',nature:'malefic',desc:'Serpiente. Atadura y apego — incapaz de soltar'},
            {name:'Amrita',nature:'benefic',desc:'Nectar de inmortalidad. Busqueda de vida eterna'},
            {name:'Indu',nature:'benefic',desc:'Luna. Sensibilidad e intuicion'},
            {name:'Mridu',nature:'benefic',desc:'El gentil. Dulzura y compasion'},
            {name:'Komala',nature:'benefic',desc:'El delicado. Arte y belleza'},
            {name:'Heramba',nature:'benefic',desc:'Avatar de Ganesha. Superacion de obstaculos'},
            {name:'Brahma',nature:'benefic',desc:'Dios creador. Creacion y conocimiento'},
            {name:'Vishnu',nature:'benefic',desc:'Dios preservador. Proteccion y orden'},
            {name:'Maheshwara',nature:'benefic',desc:'Gran Señor Shiva. Transformacion y liberacion'},
            {name:'Deva2',nature:'benefic',desc:'Santo. Practica espiritual'},
            {name:'Bala',nature:'benefic',desc:'Fuerza. Fortaleza y coraje'},
            {name:'Vishwakarma',nature:'benefic',desc:'Arquitecto cosmico. Construccion y creacion'},
            {name:'Tamasa',nature:'malefic',desc:'Oscuridad. Karma de ignorancia'},
            {name:'Kanchana',nature:'benefic',desc:'Oro. Pureza y valor'},
            {name:'Varaha',nature:'benefic',desc:'Avatar jabali de Vishnu. Salvacion'},
            {name:'Ramasala',nature:'benefic',desc:'Morada de Rama. Moral y deber'},
            {name:'Ghrisha',nature:'benefic',desc:'El radiante. Sabiduria e iluminacion'},
            {name:'Indra',nature:'benefic',desc:'Rey de los dioses. Liderazgo'},
            {name:'Jala',nature:'benefic',desc:'Agua. Flujo y adaptacion'},
            {name:'Vishwa',nature:'benefic',desc:'Universo. Amor universal'},
            {name:'Amara',nature:'benefic',desc:'Inmortal. Busqueda de eternidad'},
            {name:'Bala2',nature:'malefic',desc:'Fuerza joven. Uso inmaduro del poder'},
            {name:'Pitri',nature:'malefic',desc:'Ancestros. Karma ancestral'},
            {name:'Rudra',nature:'malefic',desc:'Dios de la tormenta. Transformacion destructiva'},
            {name:'Varuna',nature:'benefic',desc:'Dios del oceano. Orden cosmico'},
            {name:'Aryama',nature:'benefic',desc:'Deidad solar. Friendship and contracts'},
            {name:'Mitra',nature:'benefic',desc:'Dios de la amistad. Confianza y compañerismo'},
            {name:'Agni',nature:'malefic',desc:'Dios del fuego. Fuego purificador'},
            {name:'Varuna2',nature:'benefic',desc:'Dios del oceano. Sabiduria profunda'},
            {name:'Gauri',nature:'benefic',desc:'Parvati. Devocion y amor'},
            {name:'Mahakala',nature:'malefic',desc:'Gran Tiempo. Intentando dominar el tiempo'},
            {name:'Pitamaha',nature:'benefic',desc:'Gran Padre Brahma. Creador'},
            {name:'Kartikeya',nature:'benefic',desc:'Dios de la guerra. Batalla justa'},
            {name:'Yama',nature:'malefic',desc:'Dios de la muerte. Juicio y justicia'},
            {name:'Kala2',nature:'malefic',desc:'Tiempo. Perseguido por el tiempo'},
            {name:'Varuna3',nature:'benefic',desc:'Dios del oceano. Ley y verdad'},
            {name:'Kubera2',nature:'benefic',desc:'Dios de la riqueza. Generosidad'},
            {name:'Aditya',nature:'benefic',desc:'Dios solar. Luz y verdad'},
            {name:'Rishi',nature:'benefic',desc:'Sabio. Sabiduria y practica'},
            {name:'Vasu',nature:'benefic',desc:'Ser celestial. Gobernando la naturaleza'},
            {name:'Ashwini',nature:'benefic',desc:'Sanadores gemelos. Sanacion'},
            {name:'Naga',nature:'malefic',desc:'Deidad serpiente. Misterio y secretos'},
            {name:'Gandharva',nature:'benefic',desc:'Musico celestial. Arte y musica'},
            {name:'Prajapati',nature:'benefic',desc:'Creador. Creando vida'},
            {name:'Charachara',nature:'benefic',desc:'Todas las cosas. Unidad con todo'}
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
            if (!d.deity || isEasy) return '';
            const c = d.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f';
            return ' — Deidad: <strong>' + d.deity.name + '</strong> <span style="color:' + c + ';font-weight:700;">' + (d.deity.nature === 'benefic' ? 'Benefico' : 'Malefico') + '</span>';
        }

        const houseThemes = ['','Yo','Riqueza/Valores','Comunicacion','Hogar/Paz','Creacion/Amor','Servicio/Pruebas','Relaciones','Transformacion','Sabiduria/Religion','Carrera/Sociedad','Deseos/Ganancias','Liberacion'];

        const pastLifeThemes = [
            'Guerrero, Lider — Ejercio poder, liderazgo natural y determinacion grabados en el alma.',
            'Artista, Agricultor — Trabajo con la naturaleza, instinto profundo de estabilidad y belleza material.',
            'Erudito, Comerciante — Vivio del conocimiento, versatilidad y curiosidad permanecen.',
            'Protector, Cuidador — Cuidaba a otros, sensibilidad profunda e instinto maternal.',
            'Realeza, Sacerdote — Tenia alto estatus, autoridad y dignidad naturales.',
            'Sanador, Servidor — Practicaba medicina o servicio, excelentes habilidades analiticas.',
            'Diplomatico, Artista — Persiguio armonia y belleza, habil en relaciones.',
            'Practicante, Alquimista — Sufrio transformacion profunda, fuerte atraccion por secretos y misterio.',
            'Sabio, Explorador — Busco la verdad, sabiduria espiritual y aventura permanecen.',
            'Oficial, Arquitecto — Construyo orden, fuerte paciencia y responsabilidad.',
            'Oficial, Guardian — Construyo orden social, espiritu organizativo. Regido por Saturno.',
            'Medium, Artista — Comunico con el mundo espiritual, intuicion extremadamente fuerte.'
        ];

        const d60SunInterp = [
            'Vivio como guerrero o rey, fuerte ego y liderazgo permanecen. Proposito del alma: establecer autoridad.',
            'Vivio como artista o persona rica, el alma persigue abundancia material. Atraido por la belleza sensorial.',
            'Vivio como erudito o comerciante, conocimiento y comunicacion son temas centrales del alma.',
            'Vivio como protector o cuidador, cuidar a otros es un instinto profundo del alma.',
            'Tenia alto estatus como realeza o sacerdote, la autoridad natural permanece.',
            'Vivio como sanador o servidor, analisis y servicio son el proposito del alma.',
            'Persiguio la armonia como diplomatico o artista, relaciones y equilibrio son la tarea del alma.',
            'Sufrio transformacion profunda como practicante, secretos grabados en el alma.',
            'Busco la verdad como sabio o explorador, sabiduria y aventura son la direccion del alma.',
            'Construyo orden como oficial, sistemas y responsabilidad grabados en el alma.',
            'Estaba adelantado a su tiempo como innovador, pensamiento original es rasgo del alma.',
            'Se comunico con el mundo espiritual, intuicion profunda permanece en el alma.'
        ];
        const d60MoonInterp = [
            'Memoria emocional intensamente ardiente. Ira y pasion grabadas, dominar emociones es la tarea.',
            'Memoria emocional calida y estable. Recuerdos de abundancia permanecen, buscando cosas bellas.',
            'Memoria emocional intelectual y colorida. Muchas experiencias, fuerte curiosidad.',
            'Memoria emocional muy profunda. Fuertes recuerdos de hogar y cuidado, rica sensibilidad.',
            'Orgullo y dignidad llenan la memoria emocional. Recuerdos de reconocimiento permanecen.',
            'Servicio y analisis en la memoria emocional. Recuerdos de ayuda permanecen.',
            'Armonia y relaciones en la memoria emocional. Hermosos recuerdos de relaciones.',
            'Memoria emocional profunda e intensa. Recuerdos de cambios dramaticos, profundidad como el oceano.',
            'Libertad y exploracion en la memoria emocional. Recuerdos de viaje y aprendizaje.',
            'Responsabilidad y paciencia en la memoria emocional. Recuerdos de cargas pesadas.',
            'Memoria emocional unica y extraordinaria. Recuerdos de ser diferente, sensibilidad independiente.',
            'Memoria emocional espiritual y trascendente. Sueños vividos, conexion espiritual profunda.'
        ];

        // Parashara quote
        if (!isEasy) { html += '<div class="interp-card" style="border-left:3px solid #8b7ec8;"><div class="interp-text" style="font-size:13px;color:#888;">';
        html += '📜 <strong>Parashara dijo:</strong> "Shashtiamsa (D60) es la mas importante de todas las cartas divisionales. Planetas en divisiones de deidades beneficas dan buenos resultados, divisiones maleficas dan malos resultados."<br>';
        html += '<span style="color:#666;">— Brihat Parashara Hora Shastra (BPHS)</span></div></div>'; }

        // Ch1: Soul Identity
        const lagnaD = getDeity(lagnaSidereal);
        let ch1 = '<strong>D60 Lagna: ' + SIGNS[dLagnaSign] + ' ' + SIGN_SYMBOLS[dLagnaSign] + '</strong> (Regente: ' + (RULER_NAMES[d60_1lord]||d60_1lord) + ')' + deityTag(lagnaD) + '<br><br>';
        ch1 += pastLifeThemes[dLagnaSign] + '<br>';
        if (lagnaD.deity) {
            ch1 += '<br>' + (lagnaD.deity.nature === 'benefic' ?
                '<strong>' + lagnaD.deity.name + '</strong> protege el Lagna. ' + lagnaD.deity.desc + ' — El merito de vidas pasadas protege esta vida, las oportunidades llegan naturalmente.' :
                '<strong>' + lagnaD.deity.name + '</strong> influye en el Lagna. ' + lagnaD.deity.desc + ' — Desafio karmico grabado en la personalidad, pero superarlo lleva a mayor crecimiento.');
        }
        if (d60_planets_1.length > 0) ch1 += '<br><br>' + d60_planets_1.map(p => p.name).join(', ') + ' en D60 Lagna — karma central concentrado en estos planetas.';
        html += subChapter('🪐', 'Identidad del Alma — Quien fuiste', ch1);

        // Ch2: Soul Purpose (Sun)
        const sunD60 = dPositions.find(p => p.id === 'Sun');
        if (sunD60) {
            const sunD = getDeity(sunD60.sidereal);
            let ch2 = '<strong>D60 Sol: ' + SIGNS[sunD60.dSign] + ' ' + SIGN_SYMBOLS[sunD60.dSign] + '</strong>' + deityTag(sunD) + '<br><br>';
            ch2 += (d60SunInterp[sunD60.dSign] || '') + '<br>';
            if (sunD.deity) {
                ch2 += '<br>Deidad solar <strong>' + sunD.deity.name + '</strong>: ' + sunD.deity.desc + '. ' + (sunD.deity.nature === 'benefic' ? 'El proposito del alma fue correctamente perseguido, la autorrealizacion llega naturalmente.' : 'Desafios al ego y autoridad en vidas pasadas, encontrar el verdadero yo es la tarea.');
            }
            html += subChapter('☉', 'Proposito del Alma — Por que naciste', ch2);
        }

        // Ch3: Emotional Memory (Moon)
        const moonD60 = dPositions.find(p => p.id === 'Moon');
        if (moonD60) {
            const moonD = getDeity(moonD60.sidereal);
            let ch3 = '<strong>D60 Luna: ' + SIGNS[moonD60.dSign] + ' ' + SIGN_SYMBOLS[moonD60.dSign] + '</strong>' + deityTag(moonD) + '<br><br>';
            ch3 += (d60MoonInterp[moonD60.dSign] || '') + '<br>';
            if (moonD.deity) {
                ch3 += '<br>Deidad lunar <strong>' + moonD.deity.name + '</strong>: ' + moonD.deity.desc + '. ' + (moonD.deity.nature === 'benefic' ? 'La mente fue pacifica en vidas pasadas, estabilidad emocional e intuicion son innatas.' : 'Heridas emocionales permanecen en el subconsciente. Meditacion y descanso cerca del agua ayudan.');
            }
            html += subChapter('☽', 'Memoria Emocional — Patrones inconscientes', ch3);
        }

        // Ch4: Spouse Karma
        const d60H7sign = (dLagnaSign + 6) % 12;
        const d60H7lord = SIGN_RULERS[d60H7sign];
        const d60H7planets = dPositions.filter(p => p.dSign === d60H7sign);
        const venusD60 = dPositions.find(p => p.id === 'Venus');
        const rahuD60 = dPositions.find(p => p.id === 'Rahu');
        const ketuD60 = dPositions.find(p => p.id === 'Ketu');

        const spouseKarma = ['Conexion guerrero/lider. Karma de pareja intenso e independiente.','Conexion artista/rico. Karma matrimonial materialmente abundante.','Conexion erudito/comerciante. Comunicacion y rapport intelectual.','Conexion familia/protector. Karma de vinculo emocional profundo.','Conexion realeza/nobleza. Matrimonio esplendido y respetado.','Conexion sanador/servidor. Karma de servicio y devocion.','Conexion diplomatico/artista. Matrimonio armonioso y hermoso.','Conexion practicante/mistico. Karma intenso y transformador.','Conexion sabio/explorador. Karma libre y expansivo. Pareja extranjera posible.','Conexion oficial/arquitecto. Responsable y estable. Matrimonio tardio posible.','Conexion oficial/militar. Regido por Saturno, pareja disciplinada.','Conexion medium/artista. Karma misterioso y espiritual. Puede encontrarse en sueños.'];

        let ch4 = '<strong>D60 Casa 7: ' + SIGNS[d60H7sign] + ' ' + SIGN_SYMBOLS[d60H7sign] + '</strong> (Señor de casa 7: ' + (RULER_NAMES[d60H7lord]||d60H7lord) + ')<br><br>';
        ch4 += spouseKarma[d60H7sign] + '<br>';
        if (d60H7planets.length > 0) {
            ch4 += '<br><strong>Planetas en D60 casa 7:</strong><br>';
            d60H7planets.forEach(p => {
                const pD = getDeity(p.sidereal);
                ch4 += p.symbol + ' <strong>' + p.name + '</strong>' + deityTag(pD) + '<br>';
                ch4 += (p.natural === 'benefic' ? 'Benefico en casa 7 — buen karma con la pareja, bendiciones en esta vida.' : 'Malefico en casa 7 — karma sin resolver con la pareja, resolviendose en esta vida.') + '<br>';
            });
        }
        if (venusD60) {
            const venD = getDeity(venusD60.sidereal);
            const venH = ((venusD60.dSign - dLagnaSign + 12) % 12) + 1;
            ch4 += '<br><strong>♀ Venus (Karaka del Amor)</strong> → D60 ' + venH + 'H (' + houseThemes[venH] + ')' + deityTag(venD) + '<br>';
            ch4 += venD.deity && venD.deity.nature === 'benefic' ? 'Venus bajo proteccion benefica. El amor fue bien practicado, un amor hermoso espera.' : 'Venus bajo influencia malefica. Aprender el verdadero significado del amor es la tarea.';
        }
        if (rahuD60 && ketuD60) {
            const rahuH = ((rahuD60.dSign - dLagnaSign + 12) % 12) + 1;
            const ketuH = ((ketuD60.dSign - dLagnaSign + 12) % 12) + 1;
            if (rahuH === 7 || ketuH === 7 || rahuH === 1 || ketuH === 1) {
                ch4 += '<br><br>🔥 <strong>Eje Rahu-Ketu en linea 1-7!</strong> Conexion muy fuerte de vidas pasadas con la pareja. Destinados a encontrarse.';
            }
        }
        const h7lordPlanet = dPositions.find(p => p.id === d60H7lord);
        if (h7lordPlanet) {
            const h7lH = ((h7lordPlanet.dSign - dLagnaSign + 12) % 12) + 1;
            ch4 += '<br><br><strong>Senor de la 7a ' + (RULER_NAMES[d60H7lord]||d60H7lord) + '</strong> → D60 ' + h7lH + 'H (' + houseThemes[h7lH] + ')' + deityTag(getDeity(h7lordPlanet.sidereal)) + '<br>';
            ch4 += 'El karma de pareja se manifiesta a traves de <strong>' + houseThemes[h7lH] + '</strong> area.';
        }
        html += subChapter('💍', 'Karma de Pareja — Conexion de vida pasada', ch4);

        // Ch5: Career Karma
        const d60H10sign = (dLagnaSign + 9) % 12;
        const d60H10lord = SIGN_RULERS[d60H10sign];
        const d60H10planets = dPositions.filter(p => p.dSign === d60H10sign);
        const satD60 = dPositions.find(p => p.id === 'Saturn');
        const careerKarma = ['Militar/Liderazgo/Deportes','Finanzas/Arte/Agricultura','Educacion/Medios/Comercio','Enfermeria/Inmobiliaria/Hoteles','Politica/Entretenimiento/Gestion','Medico/Analisis/Servicio','Derecho/Diplomacia/Diseño','Investigacion/Medicina','Educacion/Religion/Extranjero','Administracion/Construccion/Servicio Civil','Tecnologia/Ciencia/Innovacion','Arte/Espiritualidad/Hospital'][d60H10sign];

        let ch5 = '<strong>D60 Casa 10: ' + SIGNS[d60H10sign] + ' ' + SIGN_SYMBOLS[d60H10sign] + '</strong> (Señor de casa 10: ' + (RULER_NAMES[d60H10lord]||d60H10lord) + ')<br><br>';
        ch5 += 'Karma profesional de vidas pasadas orientado hacia <strong>' + careerKarma + '</strong>. Atraccion natural hacia este campo.<br>';
        if (satD60) {
            const satD = getDeity(satD60.sidereal);
            const satH = ((satD60.dSign - dLagnaSign + 12) % 12) + 1;
            ch5 += '<br><strong>♄ Saturno (Señor del Karma)</strong> → D60 ' + satH + 'H (' + houseThemes[satH] + ')' + deityTag(satD) + '<br>';
            ch5 += satD.deity && satD.deity.nature === 'benefic' ? 'Saturno bajo benefico — <strong>bendicion muy rara!</strong> El merito de la paciencia reduce las pruebas profesionales.' : 'Saturno bajo malefico — karma profesional pesado. Disolver con paciencia, servicio y mantra (Om Shanaishcharaya Namaha).';
        }
        if (d60H10planets.length > 0) ch5 += '<br><br><strong>Planetas en D60 casa 10:</strong> ' + d60H10planets.map(p => p.name).join(', ') + ' — karma profesional concentrado aqui.';
        html += subChapter('💼', 'Karma Profesional — Vocacion pasada', ch5);

        // Ch6: Wealth Karma
        const d60H2sign = (dLagnaSign + 1) % 12;
        const d60H2planets = dPositions.filter(p => p.dSign === d60H2sign);
        const wealthKarma = ['Instinto de riqueza por esfuerzo propio.','Entorno abundante en vida pasada.','Construccion intelectual de riqueza.','Riqueza familiar/inmobiliaria.','Riqueza por autoridad.','Riqueza por servicio. Frugal.','Riqueza por asociacion.','Riqueza ajena (herencia).','La fortuna trae riqueza. Extranjero.','Lento pero seguro. Rico despues de mediana edad.','Riqueza por innovacion. No convencional.','Actividad espiritual y riqueza. Generoso.'][d60H2sign];
        let ch6 = '<strong>D60 Casa 2: ' + SIGNS[d60H2sign] + ' ' + SIGN_SYMBOLS[d60H2sign] + '</strong><br><br>' + wealthKarma + '<br>';
        if (d60H2planets.length > 0) {
            ch6 += '<br><strong>Planetas en D60 casa 2:</strong><br>';
            d60H2planets.forEach(p => {
                ch6 += p.symbol + ' ' + p.name + deityTag(getDeity(p.sidereal)) + ' — ' + (p.natural === 'benefic' ? 'Buen karma de riqueza. Abundancia.' : 'Desafio de riqueza. Superar con esfuerzo.') + '<br>';
            });
        }
        html += subChapter('💰', 'Karma de Riqueza — Fortuna pasada', ch6);

        // Ch7: Deity List (compact)
        let ch7 = '';
        const lagnaD2 = getDeity(lagnaSidereal);
        if (lagnaD2.deity) { const lc = lagnaD2.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f'; ch7 += '<div style="padding:4px 0;">⬆ Lagna → <strong>' + lagnaD2.deity.name + '</strong> <span style="color:' + lc + ';">' + (lagnaD2.deity.nature === 'benefic' ? 'B' : 'M') + '</span></div>'; }
        positions.forEach(p => {
            const pD = getDeity(p.sidereal);
            if (pD.deity) { const c = pD.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f'; ch7 += '<div style="padding:4px 0;">' + p.symbol + ' ' + p.name + ' → <strong>' + pD.deity.name + '</strong> <span style="color:' + c + ';">' + (pD.deity.nature === 'benefic' ? 'B' : 'M') + '</span></div>'; }
        });
        if (!isEasy) html += subChapter('🕉️', 'Lista de Deidades', ch7);

        // Ch8: Overall Judgment
        const beneficCount = positions.filter(p => { const pD = getDeity(p.sidereal); return pD.deity && pD.deity.nature === 'benefic'; }).length;
        const maleficPlanets = positions.filter(p => { const pD = getDeity(p.sidereal); return pD.deity && pD.deity.nature === 'malefic'; });
        let ch8 = 'De 9 planetas: <strong style="color:#5cb85c">' + beneficCount + ' benefico</strong>, <strong style="color:#d9534f">' + (positions.length - beneficCount) + ' malefico</strong><br><br>';
        if (beneficCount >= 7) ch8 += '🌟 <strong>Merito muy fuerte de vidas pasadas.</strong> Parashara llamo esto "un alma bendecida por los dioses." La mayoria de planetas bajo deidades beneficas.';
        else if (beneficCount >= 5) { ch8 += '✨ <strong>Merito abundante de vidas pasadas.</strong> Beneficos predominan, proteccion en muchas areas.'; if (maleficPlanets.length > 0) ch8 += ' Atencion: <strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong> — practicar mantras y caridad.'; }
        else if (beneficCount >= 3) { ch8 += '⚖️ <strong>Karma equilibrado.</strong> Buenos eventos y desafios se alternan.'; if (maleficPlanets.length > 0) ch8 += '<br>Watch: <strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong>'; }
        else ch8 += '🔥 <strong>Vida de liquidacion karmica.</strong> Parashara dijo "el karma mas pesado lleva al mayor crecimiento." Mantras y caridad son vitales.';
        html += subChapter('📊', 'Juicio Karmico General', ch8);

    } else if (division === 2) {
        // D2 Hora — Wealth accumulation
        const d2LagnaInterp = ['Riqueza por esfuerzo propio. Inversion independiente y agresiva.','Inversion sensorial y riqueza estable. Ingresos de inmuebles, gastronomia, arte.','Ganancia por actividad intelectual. Escritura, educacion, vision empresarial.','Ingresos inmobiliarios y familiares. Propiedad de la madre. Cuidado con gastos emocionales.','Riqueza por liderazgo y autoridad. Gobierno, oro. Gastos ostentosos.','Ingresos por analisis y habilidades. Medico, contable, servicio. Administrador frugal.','Riqueza por asociacion. Derecho, diplomacia, moda, arte.','Riqueza con dinero ajeno (herencia, seguros, inversiones). Fuentes ocultas.','Ingresos por educacion, extranjero, religion. La fortuna trae riqueza.','Esfuerzo sistematico construye riqueza. Lento pero seguro. Rico despues de mediana edad.','Ingresos por tecnologia, innovacion, redes. Fuentes no convencionales.','Ingresos por actividades espirituales/artisticas. Riqueza relacionada con el extranjero.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💰 Analisis de Riqueza' : '💰 D2 Hora — Analisis de Riqueza') + '</div><div class="interp-text">';
        html += '<strong>D2 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d2LagnaInterp + '<br><br>';
        const sunD2 = dPositions.find(p => p.id === 'Sun');
        const moonD2 = dPositions.find(p => p.id === 'Moon');
        if (sunD2) html += '<strong>☉ Sun → ' + SIGNS[sunD2.dSign] + ':</strong> ' + (sunD2.dSign === 4 ? '🌟 <strong>Sol en su propia hora (Leo)!</strong> Tipo autodidacta. Construye riqueza con autoridad y liderazgo.' : 'Sol en hora de Luna. Ingresos por ayuda de otros o sector publico.') + '<br>';
        if (moonD2) html += '<strong>☽ Moon → ' + SIGNS[moonD2.dSign] + ':</strong> ' + (moonD2.dSign === 3 ? '🌟 <strong>Luna en su propia hora (Cancer)!</strong> Vida abundante a traves de personas y relaciones.' : 'Luna en hora de Sol. Sustento por esfuerzo propio.') + '<br>';
        const d2H2sign = (dLagnaSign + 1) % 12;
        const d2H2planets = dPositions.filter(p => p.dSign === d2H2sign);
        html += '<br><strong>D2 Casa 2 (Riqueza Acumulada) — ' + SIGNS[d2H2sign] + ':</strong><br>';
        if (d2H2planets.length > 0) {
            const wealth = {Sun:'Riqueza por autoridad y estatus',Moon:'Riqueza por actividades publicas',Mars:'Propiedad, tecnologia, campos competitivos',Mercury:'Negocios, actividad intelectual, comunicacion',Jupiter:'Educacion, derecho, religion — riqueza abundante',Venus:'Arte, moda, articulos de lujo',Saturn:'Acumulacion lenta pero constante. Estable despues de mediana edad',Rahu:'Metodos no convencionales, relacionados con el extranjero',Ketu:'Desapegado de lo material. Persigue valores espirituales'};
            d2H2planets.forEach(p => { html += '• ' + p.name + ': ' + (wealth[p.id]||'') + '<br>'; });
        } else html += 'Sin planetas en casa 2 — la posicion del señor de casa 2 es clave.<br>';
        html += '</div></div>';

    } else if (division === 3) {
        const d3LagnaInterp = ['Independiente, lider entre hermanos. Comunicacion valiente.','Relaciones estables y materialmente comodas con hermanos. Hermanos artisticos posibles.','Hermanos intelectuales y comunicativos. Muchas conversaciones.','Vinculo emocional profundo con hermanos. Hermanos protectores.','Hermanos carismaticos y orgullosos. Hermano famoso o exitoso.','Hermanos analiticos y practicos. Campo medico/educativo.','Hermanos diplomaticos y encantadores. Conexiones sociales.','Relaciones intensas y secretas con hermanos. Vinculos profundos tras conflictos.','Hermanos libres y filosoficos. Hermanos en el extranjero.','Hermanos responsables y ambiciosos. Pocos hermanos o relacion seria.','Hermanos unicos e independientes. Relaciones no convencionales.','Hermanos espirituales y artisticos. Hermanos en el extranjero.'][dLagnaSign];
        const d3_3sign = (dLagnaSign + 2) % 12;
        const d3_3planets = dPositions.filter(p => p.dSign === d3_3sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👫 Hermanos y Coraje' : '👫 D3 Drekkana — Hermanos y Coraje') + '</div><div class="interp-text">';
        html += '<strong>D3 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d3LagnaInterp + '<br><br>';
        html += '<strong>D3 Casa 3 (Hermanos Menores) — ' + SIGNS[d3_3sign] + ':</strong><br>';
        if (d3_3planets.length > 0) {
            const bro = {Sun:'Hermano menor tiene liderazgo y autoridad',Moon:'Emocionalmente cercano al hermano menor',Mars:'Hermano menor activo y valiente. Posibles conflictos',Mercury:'Hermano menor inteligente con buena comunicacion',Jupiter:'Hermano menor sabio que trae buena fortuna',Venus:'Hermano menor atractivo y artistico',Saturn:'Dificultades con hermano menor. Puede haber diferencia de edad',Rahu:'Hermano menor unico o conexion extranjera',Ketu:'Distancia con hermano menor. Conexion espiritual'};
            d3_3planets.forEach(p => { html += '• ' + p.name + ': ' + (bro[p.id]||'') + '<br>'; });
        } else html += 'Sin planetas en casa 3 — revise la posicion del señor de casa 3.<br>';
        html += '</div></div>';

    } else if (division === 4) {
        const d4LagnaInterp = ['Adquiere propiedades activamente. Le gusta construir o comprar casas nuevas.','Bienes raices estables y abundantes. Tierras y granjas. Vivienda lujosa.','Multiples hogares o mudanzas frecuentes. Prefiere ambiente intelectual.','Hogar y propiedad son emocionalmente importantes. Cerca del agua. Propiedad de la madre.','Hogar grande y espacioso. Interior lujoso. Area prestigiosa.','Vivienda limpia y practica. Multiples propiedades pequeñas.','Hogar hermoso y armonioso. Interes en diseño de interiores.','Propiedad en transformacion. Propiedad heredada. Lugares secretos.','Terreno grande y propiedad en el extranjero. Cerca de instalaciones educativas.','Inversion inmobiliaria sistematica. Edificios antiguos. Crecimiento seguro.','Estilo de vivienda unico. Apartamento moderno. Tecnologia.','Hogar hermoso cerca del agua. Propiedad en el extranjero. Espacio espiritual.'][dLagnaSign];
        const d4_4sign = (dLagnaSign + 3) % 12;
        const d4_4planets = dPositions.filter(p => p.dSign === d4_4sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '🏠 Propiedad y Fortuna' : '🏠 D4 Chaturthamsa — Propiedad y Fortuna') + '</div><div class="interp-text">';
        html += '<strong>D4 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d4LagnaInterp + '<br><br>';
        html += '<strong>D4 Casa 4 (Propiedad) — ' + SIGNS[d4_4sign] + ':</strong><br>';
        if (d4_4planets.length > 0) {
            const prop = {Sun:'Edificios del gobierno o vivienda prestigiosa',Moon:'Casa hermosa. Cerca del agua. Influencia de la madre',Mars:'Nueva construccion. Posibles disputas de propiedad',Mercury:'Propiedad comercial. Multiples propiedades',Jupiter:'Casa espaciosa y abundante! Mejor fortuna inmobiliaria',Venus:'Casa lujosa. Interior hermoso',Saturn:'Casa antigua. Necesita reparacion. Estable despues de mediana edad',Rahu:'Propiedad en el extranjero. Vivienda no convencional',Ketu:'Indiferente a la propiedad. Prefiere espacio espiritual'};
            d4_4planets.forEach(p => { html += '• ' + p.name + ': ' + (prop[p.id]||'') + '<br>'; });
        } else html += 'Sin planetas en casa 4 — la posicion del señor de casa 4 es clave.<br>';
        html += '</div></div>';

    } else if (division === 24) {
        const d24LagnaInterp = ['Educacion fisica, militar, formacion en liderazgo.','Educacion en musica, arte, gastronomia, finanzas.','Educacion en idiomas, literatura, comunicacion, medios.','Educacion en historia, psicologia, ciencias del hogar.','Educacion en ciencias politicas, teatro, negocios.','Educacion en medicina, ciencia, estadistica. Aprendizaje preciso.','Educacion en derecho, diplomacia, diseño.','Educacion en psicologia, investigacion, ocultismo.','Filosofia, teologia, estudios internacionales. Probable estudio en el extranjero.','Negocios, administracion, arquitectura. Aprendizaje sistematico.','IT, ingenieria, aviacion, ciencias sociales. Aprendizaje innovador.','Arte, musica, espiritualidad, cine. Aprendizaje intuitivo.'][dLagnaSign];
        const d24_4sign = (dLagnaSign + 3) % 12;
        const d24_5sign = (dLagnaSign + 4) % 12;
        const d24_4planets = dPositions.filter(p => p.dSign === d24_4sign);
        const jupD24 = dPositions.find(p => p.id === 'Jupiter');
        const merD24 = dPositions.find(p => p.id === 'Mercury');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '📚 Educacion' : '📚 D24 Chaturvimsamsa — Educacion') + '</div><div class="interp-text">';
        html += '<strong>D24 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d24LagnaInterp + '<br><br>';
        html += '<strong>D24 Casa 4 (Educacion Basica) — ' + SIGNS[d24_4sign] + ':</strong><br>';
        if (d24_4planets.length > 0) {
            const edu4 = {Sun:'Escuela prestigiosa. Educacion autoritativa',Moon:'Ambiente de aprendizaje comodo. Fuerte educacion en casa',Mars:'Aprendizaje competitivo. Fuerte en deportes/tecnologia',Mercury:'Mejor posicion! Habilidad academica sobresaliente',Jupiter:'Ambiente educativo rico. Buenos profesores',Venus:'Educacion artistica. Escuela hermosa',Saturn:'Educacion dificil pero conocimiento profundo al superar',Rahu:'Educacion no convencional. Escuela extranjera',Ketu:'Menos interes en educacion formal. Aprendizaje intuitivo'};
            d24_4planets.forEach(p => { html += '• ' + p.name + ': ' + (edu4[p.id]||'') + '<br>'; });
        } else html += 'Sin planetas en casa 4.<br>';
        if (jupD24) { const jH = ((jupD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>♃ Jupiter (Sabiduria) → ' + jH + 'H:</strong> ' + ([1,4,5,9].includes(jH) ? '🎓 <strong>Se espera alto logro academico!</strong> Posgrado/doctorado/estudios en el extranjero posibles.' : 'Crecimiento por aprendizaje. Bendicion de Jupiter en casa ' + jH + '.') + '<br>'; }
        if (merD24) { const mH = ((merD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<strong>☿ Mercurio (Aprendizaje) → ' + mH + 'H:</strong> ' + ([1,4,5,9].includes(mH) ? '📖 <strong>Habilidad intelectual sobresaliente!</strong> Talento en matematicas, idiomas, analisis.' : 'Habilidad intelectual en casa ' + mH + '.') + '<br>'; }
        html += '</div></div>';

    } else if (division === 30) {
        const d30LagnaInterp = ['Accidentes, quemaduras, dolores de cabeza. Controlar la ira.','Perdida financiera, problemas dieteticos, tiroides. Cuidado con comer en exceso.','Ansiedad nerviosa, insomnio, problemas respiratorios. Evitar preocupacion excesiva.','Inestabilidad emocional, problemas estomacales. Controlar emociones.','Problemas cardiacos, daño al orgullo, exceso de trabajo. Necesita humildad y descanso.','Trastornos digestivos, alergias, estres por perfeccionismo. Necesita relajacion.','Problemas renales, conflictos en relaciones. Necesita decision.','Secretos, accidentes, cirugia. Chequeos regulares importantes.','Problemas hepaticos, sobrepeso, juego/gastos excesivos. Necesita moderacion.','Articulaciones, huesos, depresion, soledad. Necesita calcio e interaccion social.','Presion arterial, circulacion, accidentes inesperados. Chequeos regulares.','Deficiencia inmunologica, adiccion, salud mental. Necesita meditacion y sueño.'][dLagnaSign];
        const d30_6sign = (dLagnaSign + 5) % 12;
        const d30_8sign = (dLagnaSign + 7) % 12;
        const d30_12sign = (dLagnaSign + 11) % 12;
        const d30_6planets = dPositions.filter(p => p.dSign === d30_6sign);
        const d30_8planets = dPositions.filter(p => p.dSign === d30_8sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '⚠️ Infortunio y Enfermedad' : '⚠️ D30 Trimsamsa — Infortunio y Enfermedad') + '</div><div class="interp-text">';
        html += '<strong>D30 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d30LagnaInterp + '<br><br>';
        const diseaseBySign = ['Cabeza, cerebro, fiebre, inflamacion','Cuello, tiroides, diabetes','Pulmones, nervios, ansiedad','Estomago, retencion de liquidos','Corazon, espalda, presion arterial','Digestivo, intestinos, piel','Riñones, espalda baja, urinario','Reproductivo, enfermedad cronica','Higado, muslos, sobrepeso','Huesos, articulaciones, reumatismo','Circulacion, presion arterial, tobillos','Inmune, pies, salud mental'];
        html += '<strong>D30 Casa 6 (Enfermedad) — ' + SIGNS[d30_6sign] + ':</strong><br>';
        html += 'Atencion: <strong>' + diseaseBySign[d30_6sign] + '</strong><br>';
        if (d30_6planets.length > 0) {
            const dis = {Sun:'Enfermedades oculares y cardiacas',Moon:'Salud mental, problemas relacionados con agua',Mars:'Accidentes, cirugia, quemaduras',Mercury:'Sistema nervioso, problemas de piel',Jupiter:'Higado, sobrepeso',Venus:'Riñones, diabetes, ETS',Saturn:'Enfermedad cronica, problemas articulares',Rahu:'Enfermedad de causa desconocida, adiccion',Ketu:'Deficiencia inmunologica, alergias'};
            d30_6planets.forEach(p => { html += '• ' + p.name + ': ' + (dis[p.id]||'') + '<br>'; });
        }
        html += '<br><strong>D30 Casa 8 (Peligro) — ' + SIGNS[d30_8sign] + ':</strong><br>';
        if (d30_8planets.length > 0) {
            d30_8planets.forEach(p => { html += '• ' + p.name + ': ' + (p.natural === 'malefic' ? 'Precaucion ante peligro/accidentes. Seguro y chequeos importantes.' : 'Protegido en crisis.') + '<br>'; });
        } else html += 'Sin planetas en casa 8 — bajo riesgo de peligro.<br>';
        html += '</div></div>';

    } else if (division === 40) {
        const d40LagnaInterp = ['Madre independiente y de voluntad fuerte. Liderazgo heredado de linea materna.','Madre administra bien la riqueza. Abundancia material de linea materna.','Madre intelectual con buena comunicacion. Talento en idiomas/educacion heredado.','Vinculo muy profundo con la madre. Sensibilidad e intuicion heredadas.','Madre con autoridad y dignidad. Liderazgo y honor heredados.','Madre excelente en gestion de salud. Espiritu analitico/de servicio heredado.','Madre atractiva y diplomatica. Sentido artistico heredado.','Madre fuerte que paso por transformacion. Resiliencia heredada.','Madre educativa y religiosa. Sabiduria/filosofia heredada.','Madre responsable y estricta. Paciencia y disciplina heredadas.','Madre unica y progresista. Pensamiento innovador heredado.','Madre espiritual e intuitiva. Arte/espiritualidad heredados.'][dLagnaSign];
        const moonD40 = dPositions.find(p => p.id === 'Moon');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👩 Herencia Materna' : '👩 D40 Khavedamsa — Herencia Materna') + '</div><div class="interp-text">';
        html += '<strong>D40 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d40LagnaInterp + '<br>';
        if (moonD40) { const mH = ((moonD40.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☽ Luna (Karaka de la Madre) → ' + mH + 'H:</strong> ' + ['','Fuerte influencia materna','Propiedad de la madre','Buena comunicacion con la madre','Vinculo profundo con la madre! Mejor posicion','Madre creativa','Madre orientada al servicio','La madre influye en las relaciones','Herencia de la madre','Madre religiosa/educativa','Madre socialmente exitosa','Madre independiente','Madre espiritual'][mH] + '<br>'; }
        html += '</div></div>';

    } else if (division === 45) {
        const d45LagnaInterp = ['Padre activo y orientado a la accion. Coraje y liderazgo heredados.','Padre financieramente estable. Valores materiales heredados.','Padre intelectual y versatil. Habilidad de comunicacion/negocios heredada.','Padre emocional y familiar. Instinto de cuidado heredado.','Padre autoritativo y respetado. Liderazgo heredado.','Padre practico y diligente. Habilidades analiticas/tecnicas heredadas.','Padre diplomatico y refinado. Habilidad social heredada.','Padre fuerte y misterioso. Resiliencia/perspicacia heredada.','Padre academico y religioso. Filosofia/moralidad heredada.','Padre estricto y ambicioso. Paciencia/disciplina heredadas.','Padre creativo e innovador. Pensamiento tecnico/cientifico heredado.','Padre espiritual y artistico. Intuicion/creatividad heredadas.'][dLagnaSign];
        const sunD45 = dPositions.find(p => p.id === 'Sun');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨 Herencia Paterna' : '👨 D45 Akshavedamsa — Herencia Paterna') + '</div><div class="interp-text">';
        html += '<strong>D45 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d45LagnaInterp + '<br>';
        if (sunD45) { const sH = ((sunD45.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☉ Sol (Karaka del Padre) → ' + sH + 'H:</strong> ' + ['','Fuerte influencia paterna','Propiedad del padre','Buena comunicacion con el padre','Padre familiar','Padre creativo','Padre orientado al servicio','El padre influye en las relaciones','Herencia del padre','Padre religioso/educativo','Padre socialmente exitoso! Mejor posicion','Padre independiente','Padre espiritual'][sH] + '<br>'; }
        html += '</div></div>';
    }

    interpEl.innerHTML = html;
}


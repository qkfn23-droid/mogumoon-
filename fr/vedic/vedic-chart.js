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
        catGuide: e ? 'Glossaire' : 'Guide d\'Astrologie Védique',
        catBasic: e ? 'Mes Positions Planétaires' : 'Carte de Base — Positions & Carte de Naissance',
        catDasha: e ? 'Mes Périodes de Vie' : 'Dasha — Périodes de Vie',
        catInterp: e ? 'Ma Lecture — Personnalité·Richesse·Carrière·Santé' : 'Interprétation — Personnalité·Richesse·Carrière·Santé·Yoga',
        catMarriage: e ? 'Mon Conjoint' : 'Mariage & Conjoint — D9 Navamsha',
        catCareer: e ? 'Ma Carrière·Richesse' : 'Carrière & Richesse — D10·D2·D4',
        catFamily: e ? 'Ma Famille' : 'Famille — D7·D3·D12·D40·D45',
        catSpirit: e ? 'Spiritualité·Éducation·Santé' : 'Spiritualité·Éducation·Santé — D20·D24·D27·D16',
        catWarn: e ? 'Précautions Santé' : 'Précautions — D30 Maladie·Étranger',
        catKarma: e ? 'Karma des Vies Passées' : 'Karma — D60 Vies Passées',
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
const SIGNS = ['Bélier','Taureau','Gémeaux','Cancer','Lion','Vierge',
               'Balance','Scorpion','Sagittaire','Capricorne','Verseau','Poissons'];
const SIGNS_EN = ['Bélier','Taureau','Gémeaux','Cancer','Lion','Vierge',
                  'Balance','Scorpion','Sagittaire','Capricorne','Verseau','Poissons'];
const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

// Planets
const PLANETS = [
    { id: 'Sun', name: 'Soleil', symbol: '☉', natural: 'maléfique' },
    { id: 'Moon', name: 'Lune', symbol: '☽', natural: 'bénéfique' },
    { id: 'Mars', name: 'Mars', symbol: '♂', natural: 'maléfique' },
    { id: 'Mercury', name: 'Mercure', symbol: '☿', natural: 'neutre' },
    { id: 'Jupiter', name: 'Jupiter', symbol: '♃', natural: 'bénéfique' },
    { id: 'Venus', name: 'Vénus', symbol: '♀', natural: 'bénéfique' },
    { id: 'Saturn', name: 'Saturne', symbol: '♄', natural: 'maléfique' },
];

// Nakshatras (27 lunar mansions)
const NAKSHATRAS = [
    { name: 'Ashwini', ko: 'Ashwini', ruler: 'Ketu', meaning: 'Jumeaux-chevaux', deity: 'Ashwini Kumaras', desc: 'Énergie de guérison et de nouveaux commencements. Une personne avec une action rapide et des capacités de guérison.' },
    { name: 'Bharani', ko: 'Bharani', ruler: 'Venus', meaning: 'Le Porteur', deity: 'Yama', desc: 'Le cycle de la vie et de la mort. Forte patience et pouvoir de mener le changement.' },
    { name: 'Krittika', ko: 'Krittika', ruler: 'Sun', meaning: 'Le Tranchant', deity: 'Agni', desc: 'Le pouvoir du feu et de la purification. Intellect vif et détermination.' },
    { name: 'Rohini', ko: 'Rohini', ruler: 'Moon', meaning: 'L\'Étoile Rouge', deity: 'Brahma', desc: 'L\'étoile de l\'abondance et de la beauté. Une personnalité créative et charmante.' },
    { name: 'Mrigashira', ko: 'Mrigashira', ruler: 'Mars', meaning: 'Tête de Cerf', deity: 'Soma', desc: 'L\'étoile de l\'exploration et de la curiosité. Un voyageur infatigable en quête de vérité.' },
    { name: 'Ardra', ko: 'Ardra', ruler: 'Rahu', meaning: 'Larme', deity: 'Rudra', desc: 'Renaissance par la tempête et la destruction. Émotions intenses et pouvoir de transformation.' },
    { name: 'Punarvasu', ko: 'Punarvasu', ruler: 'Jupiter', meaning: 'Retour de la Lumière', deity: 'Aditi', desc: 'L\'étoile de la récupération et du retour. Une personnalité optimiste et sage.' },
    { name: 'Pushya', ko: 'Pushya', ruler: 'Saturn', meaning: 'Le Nourricier', deity: 'Brihaspati', desc: 'Le nakshatra le plus favorable. Énergie nourricière, protectrice et de prospérité.' },
    { name: 'Ashlesha', ko: 'Ashlesha', ruler: 'Mercury', meaning: 'L\'Enlaceur', deity: 'Nagas', desc: 'Sagesse et mystère du serpent. Perspicacité et intuition profonde.' },
    { name: 'Magha', ko: 'Magha', ruler: 'Ketu', meaning: 'Le Grand', deity: 'Pitris', desc: 'L\'étoile de la royauté. Autorité, respect et bénédictions ancestrales.' },
    { name: 'Purva Phalguni', ko: 'Purva Phalguni', ruler: 'Venus', meaning: 'Fruit Antérieur', deity: 'Bhaga', desc: 'L\'étoile de la joie et de l\'amour. Sens artistique et romance.' },
    { name: 'Uttara Phalguni', ko: 'Uttara Phalguni', ruler: 'Sun', meaning: 'Fruit Postérieur', deity: 'Aryaman', desc: 'L\'étoile de l\'amitié et des contrats. Confiance et dévouement.' },
    { name: 'Hasta', ko: 'Hasta', ruler: 'Moon', meaning: 'La Main', deity: 'Savitar', desc: 'L\'étoile de l\'artisanat et de l\'habileté. Les mains guérisseuses, l\'artiste.' },
    { name: 'Chitra', ko: 'Chitra', ruler: 'Mars', meaning: 'Joyau Brillant', deity: 'Vishwakarma', desc: 'L\'étoile de la beauté et de la création. Sens esthétique exceptionnel.' },
    { name: 'Swati', ko: 'Swati', ruler: 'Rahu', meaning: 'L\'Indépendant', deity: 'Vayu', desc: 'La liberté du vent. Une personnalité indépendante et flexible.' },
    { name: 'Vishakha', ko: 'Vishakha', ruler: 'Jupiter', meaning: 'Le Fourchu', deity: 'Indra-Agni', desc: 'L\'étoile des objectifs et de la détermination. Forte concentration et volonté.' },
    { name: 'Anuradha', ko: 'Anuradha', ruler: 'Saturn', meaning: 'Suivant Radha', deity: 'Mitra', desc: 'L\'étoile de l\'amitié et du dévouement. Compétences organisationnelles et leadership.' },
    { name: 'Jyeshtha', ko: 'Jyeshtha', ruler: 'Mercury', meaning: 'L\'Aîné', deity: 'Indra', desc: 'L\'étoile de la protection et de l\'autorité. Fort sens des responsabilités.' },
    { name: 'Mula', ko: 'Mula', ruler: 'Ketu', meaning: 'La Racine', deity: 'Nirriti', desc: 'L\'étoile de la destruction et de la reconstruction. Celui qui cherche la racine de la vérité.' },
    { name: 'Purva Ashadha', ko: 'Purva Ashadha', ruler: 'Venus', meaning: 'Ancien Invincible', deity: 'Apas', desc: 'Le pouvoir de l\'eau et de la purification. Énergie victorieuse cachée.' },
    { name: 'Uttara Ashadha', ko: 'Uttara Ashadha', ruler: 'Sun', meaning: 'Dernier Invincible', deity: 'Vishvedevas', desc: 'L\'étoile de la victoire ultime. Patience et leadership.' },
    { name: 'Shravana', ko: 'Shravana', ruler: 'Moon', meaning: 'L\'Auditeur', deity: 'Vishnu', desc: 'L\'étoile du savoir et de l\'écoute. Un maître de l\'apprentissage et de la communication.' },
    { name: 'Dhanishta', ko: 'Dhanishta', ruler: 'Mars', meaning: 'Le Plus Riche', deity: 'Vasus', desc: 'L\'étoile de l\'abondance et de la musique. Talent et prospérité.' },
    { name: 'Shatabhisha', ko: 'Shatabhisha', ruler: 'Rahu', meaning: 'Cent Guérisseurs', deity: 'Varuna', desc: 'L\'étoile des secrets et de la guérison. Capacités de guérison mystérieuses.' },
    { name: 'Purva Bhadrapada', ko: 'Purva Bhadrapada', ruler: 'Jupiter', meaning: 'Anciens Pieds Chanceux', deity: 'Aja Ekapada', desc: 'L\'étoile du feu et de la transformation. Éveil spirituel.' },
    { name: 'Uttara Bhadrapada', ko: 'Uttara Bhadrapada', ruler: 'Saturn', meaning: 'Derniers Pieds Chanceux', deity: 'Ahir Budhnya', desc: 'La sagesse de l\'océan profond. Méditation et profondeur spirituelle.' },
    { name: 'Revati', ko: 'Revati', ruler: 'Mercury', meaning: 'Le Riche', deity: 'Pushan', desc: 'L\'étoile du voyage et de la protection. L\'achèvement de toutes choses.' },
];

// Dasha periods (years)
const DASHA_YEARS = {
    'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
    'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
};
const DASHA_ORDER = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
const DASHA_KO = {
    'Ketu': 'Ketu', 'Venus': 'Vénus', 'Sun': 'Soleil', 'Moon': 'Lune', 'Mars': 'Mars',
    'Rahu': 'Rahu', 'Jupiter': 'Jupiter', 'Saturn': 'Saturne', 'Mercury': 'Mercure'
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
    html += '<th>Planète</th><th>Signe</th><th>Degré</th><th>Nakshatra</th><th>Maison</th>';
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
    const RULER_NAMES = {Sun:"Soleil",Moon:"Lune",Mars:"Mars",Mercury:"Mercure",Jupiter:"Jupiter",Venus:"Vénus",Saturn:"Saturne",Rahu:"Rahu",Ketu:"Ketu"};

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
        "Leadership, militaire, sport, entrepreneuriat (pionnier de feu)",
        "Finance, agriculture, arts, immobilier, alimentation (stabilité & matière)",
        "Communication, médias, écriture, enseignement, marketing (intellectuel)",
        "Soins infirmiers, aide à la personne, cuisine, hôtellerie, conseil (soin émotionnel)",
        "Politique, divertissement, leadership, créativité (scène brillante)",
        "Médecine, comptabilité, analyse, édition, santé/bien-être (service précis)",
        "Droit, diplomatie, design, mode, médiation (équilibre & beauté)",
        "Recherche, investigation, médecine, occulte, psychologie (profondeur & transformation)",
        "Éducation, voyage, philosophie, religion, édition (expansion & exploration)",
        "Gouvernement, construction, gestion, PDG, leader organisationnel (système & autorité)",
        "Technologie, informatique, invention, activisme social, science (innovation)",
        "Arts, spiritualité, guérison, musique, charité (transcendance & service)"
    ];

    const planetCareer = {
        Sun: "Fonctionnaire, politicien, médecin, PDG — postes d'autorité",
        Moon: "Infirmier/ère, conseiller/ère, chef cuisinier, hôtellerie — rôles de soin/émotionnels",
        Mars: "Militaire, police, chirurgien, ingénieur, athlète",
        Mercury: "Écrivain, enseignant, programmeur, comptable, commerçant",
        Jupiter: "Professeur, juge, leader religieux, consultant, professionnel senior",
        Venus: "Designer, acteur, musicien, mode, industrie de la beauté",
        Saturn: "Construction, mines, agriculture, gestion, artisan",
        Rahu: "Informatique, lié à l'étranger, carrières non conventionnelles, recherche",
        Ketu: "Spiritualité, médecine alternative, recherche, ascète"
    };

    let html = '';

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '🕉️ Vous après le mariage : ${SIGNS[d9LagnaSign]} ${SIGN_SYMBOLS[d9LagnaSign]}' : '🕉️ D9 Lagna — Vous après le mariage : ${SIGNS[d9LagnaSign]} ${SIGN_SYMBOLS[d9LagnaSign]}') + '</div>
        <div class="interp-text">
            Le Navamsa Lagna est en <strong>${SIGNS[d9LagnaSign]}</strong>. Ceci révèle votre vrai moi après le mariage et dans la seconde moitié de vie (après la trentaine).
            ${d9LagnaSign === d1LagnaSign ? '<br><br><strong>Le D1 et le D9 Lagna sont dans le même signe !</strong> Cela s\'appelle <strong>Vargottama</strong> — extrêmement puissant. Votre essence reste inchangée après le mariage, le moi intérieur et extérieur sont alignés.' : ''}
            ${d9H1Planets.length > 0 ? '<br><br><strong>Planètes dans la 1re maison du D9 :</strong> ' + d9H1Planets.map(p => p.symbol + ' ' + p.name).join(', ') + ' — Ces planètes influencent fortement votre personnalité après le mariage.' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '💍 Caractère du conjoint : ${SIGNS[d9H7Sign]} ${SIGN_SYMBOLS[d9H7Sign]}' : '💍 D9 7e maison — Caractère du conjoint : ${SIGNS[d9H7Sign]} ${SIGN_SYMBOLS[d9H7Sign]}') + '</div>
        <div class="interp-text">
            La 7e maison du Navamsa est en <strong>${SIGNS[d9H7Sign]}</strong>, gouvernée par <strong>${RULER_NAMES[d9H7Ruler]}</strong>.<br><br>
            Cela révèle la personnalité fondamentale de votre conjoint — quelqu'un avec l'énergie de ${SIGNS[d9H7Sign]}.
            ${d9H7Planets.length > 0 ? '<br><br><strong>Planètes dans la 7e maison du D9 :</strong><br>' + d9H7Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${p.natural === 'benefic' ? 'Bénéfique ! Vous recevez une énergie positive de votre conjoint.' : 'Maléfique — défis dans le mariage, mais aussi opportunités de croissance.'}`).join('<br>') : '<br><br>Aucune planète dans la 7e maison — la position du seigneur de la 7e est plus importante.'}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '💼 But de vie (Dharma) : ${SIGNS[d9H10Sign]} ${SIGN_SYMBOLS[d9H10Sign]}' : '💼 D9 10e maison — But de vie (Dharma) : ${SIGNS[d9H10Sign]} ${SIGN_SYMBOLS[d9H10Sign]}') + '</div>
        <div class="interp-text">
            La 10e maison du Navamsa est en <strong>${SIGNS[d9H10Sign]}</strong>, gouvernée par <strong>${RULER_NAMES[d9H10Ruler]}</strong>.<br><br>
            Tandis que la 10e du D1 montre votre carrière, la 10e du D9 révèle votre <strong>but de vie supérieur (Dharma)</strong> — la véritable vocation poursuivie après la maturité.<br><br>
            <strong>Direction du but :</strong> ${careerBySgn[d9H10Sign]}
            ${d9H10Planets.length > 0 ? '<br><br><strong>Planètes dans la 10e maison du D9 :</strong><br>' + d9H10Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${planetCareer[p.id] || "Énergie de carrière unique"}`).join('<br>') : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '👔 Carrière du conjoint' : '👔 Carrière du conjoint — 10e dérivée (D9 4e maison) : ${SIGNS[d9H4Sign]} ${SIGN_SYMBOLS[d9H4Sign]}') + '</div>
        <div class="interp-text">
            <strong>Principe de maison dérivée :</strong> La 10e depuis la 7e (conjoint) = la 4e maison du D9 montre la carrière/activité sociale de votre conjoint.<br><br>
            La 4e maison du D9 est en <strong>${SIGNS[d9H4Sign]}</strong>, gouvernée par <strong>${RULER_NAMES[d9H4Ruler]}</strong>.<br><br>
            <strong>Tendance de carrière du conjoint :</strong> ${careerBySgn[d9H4Sign]}
            ${d9H4Planets.length > 0 ? '<br><br><strong>Planètes dans la 4e du D9 (10e du conjoint) :</strong><br>' + d9H4Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: Le conjoint travaille probablement dans ${planetCareer[p.id] || "un domaine spécialisé"}`).join('<br>') : ''}
        </div>
    </div>`;

    const vargottamaPlanets = d9Positions.filter(p => p.sign === p.d9Sign);
    if (vargottamaPlanets.length > 0) {
        html += `<div class="interp-card">
            <div class="interp-title">⭐ Planètes Vargottama — Exceptionnellement puissantes</div>
            <div class="interp-text">
                Les planètes dans le même signe en D1 et D9 sont appelées <strong>Vargottama</strong>. Elles sont très puissantes, leur énergie agit de manière constante tout au long de la vie.<br><br>
                ${vargottamaPlanets.map(p => `<strong>${p.symbol} ${p.name}</strong>: En ${SIGNS[p.sign]} en D1 et D9 — énergie exceptionnellement forte !`).join('<br>')}
            </div>
        </div>`;
    }

    // 6. Spouse Direction — 6 Indicator Combined Analysis
    const DIRECTIONS = {
        0:"Est", 1:"Sud", 2:"Ouest", 3:"Nord",
        4:"Est", 5:"Sud", 6:"Ouest", 7:"Nord",
        8:"Est", 9:"Sud", 10:"Ouest", 11:"Nord"
    };
    const DIR_DETAIL = {
        0:"Est (Bélier — feu)",1:"Sud (Taureau — terre)",2:"Ouest (Gémeaux — air)",3:"Nord (Cancer — eau)",
        4:"Est (Lion — feu)",5:"Sud (Vierge — terre)",6:"Ouest (Balance — air)",7:"Nord (Scorpion — eau)",
        8:"Est (Sagittaire — feu)",9:"Sud (Capricorne — terre)",10:"Ouest (Verseau — air)",11:"Nord (Poissons — eau)"
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
        {name:"D1 7e maison", sign: d1H7Sign, desc:"Maison du conjoint dans le thème natal"},
        {name:"D9 7e maison", sign: d9H7Sign, desc:"Maison du conjoint dans le Navamsa"},
        {name:"Seigneur 7e D9", sign: d9H7RulerSign, desc:"Où va le seigneur de la 7e du D9"},
        {name:"D9 Vénus", sign: venusD9Sign, desc:"Karaka du conjoint dans le Navamsa"},
        {name:"Upapada (UL)", sign: ulSign, desc:"12e Arudha — origine du conjoint"},
        {name:"Darapada (A7)", sign: a7Sign, desc:"7e Arudha — image sociale du conjoint"}
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
        <div class="interp-title">' + (isEasy ? '🧭 Spouse Direction' : '🧭 Direction du conjoint — Analyse à 6 indicateurs') + '</div>
        <div class="interp-text">
            L'astrologie védique détermine la direction du conjoint en combinant plusieurs indicateurs.<br><br>
            <strong>6 Indicateurs :</strong><br>
            ${dirSources.map(s => `• <strong>${s.name}</strong>: ${SIGNS[s.sign]} ${SIGN_SYMBOLS[s.sign]} → <strong>${DIRECTIONS[s.sign]}</strong> <span style="color:#666;font-size:12px;">(${s.desc})</span>`).join('<br>')}
            <br><br>
            <strong>🧿 Upapada Lagna (UL) :</strong> Arudha de la 12e — famille/origine du conjoint → <strong>${SIGNS[ulSign]} ${SIGN_SYMBOLS[ulSign]}</strong><br>
            <strong>🎯 Darapada (A7) :</strong> Arudha de la 7e — image sociale du conjoint → <strong>${SIGNS[a7Sign]} ${SIGN_SYMBOLS[a7Sign]}</strong><br>
            <strong>💍 Seigneur 7e D9 (${RULER_NAMES[d9H7Ruler]}) :</strong> Où se trouve le seigneur de la 7e du Navamsa → <strong>${SIGNS[d9H7RulerSign]} ${SIGN_SYMBOLS[d9H7RulerSign]}</strong><br>
            <strong>♀ D9 Vénus :</strong> Karaka du conjoint dans le Navamsa → <strong>${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}</strong><br><br>
            <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:14px;margin-top:10px;">
                <strong style="font-size:16px;">🧭 Conclusion : direction ${agreement >= 4 ? 'écrasante' : agreement >= 3 ? 'très forte' : agreement >= 2 ? 'forte' : ''} ${primaryDir}</strong><br><br>
                <strong>${agreement}</strong> indicateurs sur 6 pointent vers <strong>${primaryDir}</strong>.
                ${agreement >= 4 ? '<br>4+ indicateurs concordent ! <strong>Très haute probabilité</strong> de rencontrer le conjoint venant de la direction ' + primaryDir + '. Prêtez attention aux villes, lieux de travail ou voyages dans cette direction.' : ''}
                ${agreement === 3 ? '<br>3 indicateurs concordent — <strong>haute probabilité</strong> de la direction ' + primaryDir + '.' : ''}
                ${agreement === 2 ? '<br>2 indicateurs concordent — ' + primaryDir + ' est favorisé mais d\'autres possibilités existent.' : ''}
                ${agreement <= 1 ? '<br>Les indicateurs sont dispersés — le conjoint peut venir de diverses directions. Restez ouvert(e).' : ''}
                ${sortedDirs.length > 1 && sortedDirs[1][1] === sortedDirs[0][1] ? '<br><br>💡 Deux directions également indiquées : <strong>' + sortedDirs[0][0] + '</strong> et <strong>' + sortedDirs[1][0] + '</strong>.' : ''}
            </div>
        </div>
    </div>`;

    const meetingBySgn = [
        "Lieux actifs, sport, environnements compétitifs, rassemblements de leaders. Première rencontre intense et soudaine.",
        "Lieu de travail, institutions financières, restaurants, nature. Construction lente de la confiance.",
        "Réseaux sociaux, école, séminaires, en voyage, rencontres arrangées. La relation commence par une conversation.",
        "Présentations familiales, rassemblements de quartier, amis d'enfance. Débute dans un cadre confortable.",
        "Fêtes, concerts, rassemblements créatifs, lieux glamours. Première rencontre dramatique.",
        "Lieu de travail, hôpital, activités liées à la santé, bénévolat. La rencontre part de besoins pratiques.",
        "Rencontres arrangées, événements juridiques/diplomatiques, expositions d'art. Rencontre élégante et raffinée.",
        "Situations de crise, conversations profondes, lieux secrets, laboratoires de recherche. Attraction fatale et intense.",
        "À l'étranger, université, rassemblements religieux/philosophiques, en voyage. Connexion de loin. Peut être d'une autre culture.",
        "Lieu de travail, événements d'affaires, fonctions officielles. Rencontre liée au statut social.",
        "En ligne, clubs de loisirs, mouvements sociaux, ami d'un ami. Rencontre unique et non conventionnelle.",
        "Rassemblements spirituels, à l'étranger, arts/musique, hôpital, indices dans les rêves. Rencontre mystique et fatale."
    ];

    const backgroundBySgn = [
        "Famille indépendante et autodidacte. Fort héritage de leadership.",
        "Famille financièrement stable. Valeurs traditionnelles. Origine potentiellement aisée.",
        "Famille intellectuelle et communicative. Accent sur l'éducation.",
        "Foyer chaleureux, orienté famille. Forte figure maternelle.",
        "Famille prestigieuse et fière. Statut social et réputation.",
        "Famille pratique et travailleuse. Contexte santé/médical/éducation.",
        "Famille équilibrée et digne. Contexte arts/droit/diplomatie.",
        "Famille avec des secrets ou transformations. Histoire familiale profonde.",
        "Famille érudite, religieuse/philosophique. Possible origine étrangère.",
        "Famille stricte et traditionnelle. Respectée socialement. Accent sur la responsabilité.",
        "Structure familiale libre et unique. Pensée progressiste.",
        "Famille spirituelle ou artistique. Possible origine étrangère. Grande sensibilité."
    ];

    const imageBySgn = [
        "Première impression énergique et confiante. Image sportive ou forte.",
        "Première impression calme et fiable. Image raffinée et digne.",
        "Première impression vive et bavarde. Image intellectuelle et spirituelle.",
        "Première impression chaleureuse et bienveillante. Image douce et attentionnée.",
        "Première impression glamour et charismatique. Image confiante.",
        "Première impression nette et ordonnée. Image méticuleuse et professionnelle.",
        "Première impression élégante et charmante. Image équilibrée et sophistiquée.",
        "Première impression mystérieuse et intense. Image profonde et charismatique.",
        "Première impression libre et vibrante. Image positive et aventurière.",
        "Première impression sérieuse et mature. Image responsable et fiable.",
        "Première impression unique et individualiste. Image tendance et originale.",
        "Première impression rêveuse et mystique. Image artistique et émotionnelle."
    ];

    const attractBySgn = [
        "Énergie forte et confiance. La nature proactive et protectrice est attirante.",
        "Stabilité et charme sensuel. Apprécier la bonne nourriture, les parfums et les textures.",
        "Esprit vif et talent pour la conversation. La stimulation intellectuelle est l'attraction.",
        "Soin dévoué et émotion. Se sentir chez soi ensemble est le charme.",
        "Présence rayonnante et générosité. Se sentir spécial ensemble est attrayant.",
        "Considération délicate et perfectionnisme. L'attention aux détails est charmante.",
        "Élégance et personnalité harmonieuse. Le monde devient beau ensemble.",
        "Regard intense et profondeur. La concentration qui perce l'âme est l'attraction.",
        "Esprit libre et humour. Les aventures commencent quand vous êtes ensemble.",
        "Fiabilité solide et maturité. La stabilité à toute épreuve est attrayante.",
        "Individualité unique et pensée progressiste. Une fraîcheur jamais vue auparavant.",
        "Sensibilité mystique et profondeur spirituelle. La romance onirique est le charme."
    ];

    const d1H7ForMeeting = (d1LagnaSign + 6) % 12;

    html += `<div class="interp-card">
        <div class="interp-title">🤝 Où vous rencontrez votre conjoint ' + (isEasy ? '— 7e : ${SIGNS[d1H7ForMeeting]} ${SIGN_SYMBOLS[d1H7ForMeeting]}' : '— D1 7e : ${SIGNS[d1H7ForMeeting]} ${SIGN_SYMBOLS[d1H7ForMeeting]}') + '</div>
        <div class="interp-text">
            Le signe de la 7e maison révèle l'environnement et les circonstances de la rencontre avec votre conjoint.<br><br>
            <strong>${meetingBySgn[d1H7ForMeeting]}</strong>
            ${d1H7ForMeeting === 8 || d1H7ForMeeting === 11 ? '<br><br>💡 <strong>Possibilité de conjoint étranger !</strong> Des signes liés à la 9e (étranger) ou la 12e maison (résidence étrangère) sont dans la 7e, suggérant que le conjoint peut être étranger ou que vous pourriez vous rencontrer à l\'étranger.' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '🏛️ Origine familiale du conjoint' : '🏛️ Origine familiale du conjoint — UL : ${SIGNS[ulSign]} ${SIGN_SYMBOLS[ulSign]}') + '</div>
        <div class="interp-text">
            L'Upapada Lagna (UL) révèle l'environnement familial et l'éducation de votre conjoint.<br><br>
            <strong>${backgroundBySgn[ulSign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '👤 Première impression du conjoint' : '👤 Première impression du conjoint — A7 : ${SIGNS[a7Sign]} ${SIGN_SYMBOLS[a7Sign]}') + '</div>
        <div class="interp-text">
            Le Darapada (A7) montre comment votre conjoint apparaît au monde — son image externe et première impression.<br><br>
            <strong>${imageBySgn[a7Sign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">💎 Point d'attraction du conjoint ' + (isEasy ? '— Vénus : ${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}' : '— D9 Vénus : ${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}') + '</div>
        <div class="interp-text">
            Vénus dans le Navamsa révèle le charme fondamental et le style amoureux de votre conjoint.<br><br>
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
            <div class="nakshatra-name">Votre Étoile: ${nak.ko || nak.name}</div>
            <div class="nakshatra-meaning">"${nak.meaning}"</div>
            <div class="nakshatra-detail">${nak.desc}</div>
        </div>
    ` : `
        <div class="nakshatra-card">
            <div class="nakshatra-name">${nak.name}</div>
            <div class="nakshatra-meaning">"${nak.meaning}" — Planète régnante: ${DASHA_KO[nak.ruler] || nak.ruler}</div>
            <div class="nakshatra-detail">
                Divinité: ${nak.deity}<br><br>
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

    let html = '<div class="interp-card" style="margin-bottom:12px;border-left:3px solid #c9a84c;"><div class="interp-text" style="font-size:12px;color:#888;">💡 <strong>Vimshottari Dasha</strong> — La vie est divisée en périodes gouvernées par 9 planètes. <strong>Mahadasha</strong> is the major period, <strong>Antardasha (Bhukti)</strong> is the sub-period within it. Calculé à partir de la position du nakshatra lunaire.<br><br>';
    html += isEasy ? '</div></div>' : '🌙 Lune natale: <strong>' + nak.ko + ' (' + nak.name + ')</strong> — Premier Dasha: <strong>' + DASHA_KO[startRuler] + '</strong> (restant: ' + remainingYears.toFixed(2) + ' ans)</div></div>';

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
        const dashaEasyDesc = {Ketu:"Réflexion intérieure et croissance spirituelle",Venus:"Amour, beauté et abondance",Sun:"Confiance et leadership brillent",Moon:"Émotions et foyer au centre",Mars:"Défis et énergie d\'action",Rahu:"Grands changements et nouvelles opportunités",Jupiter:"Chance et croissance arrivent",Saturn:"La patience apporte de grandes récompenses",Mercury:"Études, communication et affaires prospèrent"};
        html += '<span class="dasha-planet">' + (isEasy ? dashaEasyDesc[p.planet] : DASHA_KO[p.planet]) + '</span>';
        html += '<span class="dasha-period">' + fmtDate(p.startD) + ' ~ ' + fmtDate(p.endD) + '</span>';
        html += '<span class="dasha-years">' + (p.actualDays / 365.25).toFixed(1) + ' ans</span>';
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
        "Fonceur/fonceuse ! Décisions rapides avec des qualités de leader. Vous adorez les nouveaux défis. Un peu impatient(e), mais incroyablement motivé(e).",
        "Vous aimez la stabilité. Vous appréciez le confort et la beauté. Une fois décidé(e), vous allez jusqu\'au bout. Têtu(e) mais fiable.",
        "Curiosité infinie ! Grand(e) communicateur/trice et polyvalent(e). Parfois dispersé(e), mais c\'est votre charme.",
        "Chaleureux/chaleureuse et émotionnel(le). Vous chérissez la famille et lisez bien les émotions. Un(e) protecteur/trice naturel(le).",
        "Leader né(e) ! Grande présence qui attire naturellement l\'attention. Confiant(e) et magnétique. Généreux/généreuse en amour.",
        "Minutieux/minutieuse et analytique. Vous visez la perfection. Observateur/trice qui remarque ce que d\'autres manquent.",
        "Vous recherchez l'harmonie. Raffiné(e) et charmant(e) avec un excellent goût artistique. Plus heureux/heureuse entouré(e) de belles choses.",
        "Profondeur. Forte intuition qui perce jusqu'à la vérité. Calme en surface mais des émotions intenses à l'intérieur.",
        "Esprit libre ! Vous aimez voyager et apprendre. Positif/positive et philosophique. Votre humour illumine chaque pièce.",
        "Ambitieux/ambitieuse. Patient(e) et de plus en plus séduisant(e) avec l'âge. Travaillez systématiquement vers vos objectifs.",
        "Unique. Vous pensez différemment de tout le monde. Vous détestez les cases et voulez changer le monde à votre façon.",
        "Profondément sensible. Forte intuition attirée par l\'art et la spiritualité. Rêves vivides. Votre monde intérieur est plus riche que l\'extérieur."
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
        <div class="interp-title">👤 Personnalité et Apparence — Lagna : ${SIGNS[lagnaSign]} ${SIGN_SYMBOLS[lagnaSign]}</div>
        <div class="interp-text">${lagnaInterp[lagnaSign]}</div>
    </div>`;

    // ═══════════════════════════════════
    // 2. Inner Self & Emotions (Moon Sign)
    // ═══════════════════════════════════
    if (moonPos) {
        const moonEasy = [
        "Une passion ardente brûle en vous. Les émotions montent vite et redescendent vite. Quand vous êtes stressé(e), bougez — le sport fonctionne le mieux.",
        "Émotionnellement très stable. Vous n'aimez pas les changements brusques. Bonne nourriture, musique et nature vous guérissent.",
        "Vous traitez vos émotions en parlant. La curiosité vous anime et vous ne supportez pas l'ennui. Votre humour allège toute ambiance.",
        "Extrêmement sensible et empathique. Vous absorbez les émotions des autres comme une éponge. La maison est votre refuge. Cuisiner ou décorer apporte la paix.",
        "Expression émotionnelle dramatique et passionnée. Vous avez besoin d'être aimé(e). Mais vous donnez l'amour avec la même générosité. La créativité est votre médecine.",
        "Vous analysez et organisez vos émotions. Vous vous inquiétez beaucoup mais résolvez les problèmes pratiquement. Les routines quotidiennes apportent la stabilité.",
        "Vous trouvez l'équilibre émotionnel dans les relations. Seul(e), vous vous sentez vide. L'art et la beauté vous apportent la paix.",
        "Vos émotions sont aussi profondes et intenses que l'océan. Vous aimez profondément et n'oubliez jamais la trahison. Votre intuition est incroyablement forte.",
        "Émotionnellement lumineux/lumineuse et optimiste. Vous aimez la liberté. Le voyage est votre meilleur remède émotionnel.",
        "Vous ne montrez pas facilement vos émotions. Fort sens du devoir. Avec l'âge, vous devenez plus ouvert(e) émotionnellement.",
        "Schémas émotionnels uniques et imprévisibles. Vous aimez de manière non conventionnelle. Les activités sociales vous comblent émotionnellement.",
        "Extrêmement intuitif/intuitive et spirituel(le). Rêves vivides parfois prophétiques. L'art, la méditation et l'eau vous apportent la paix."
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
            <div class="interp-title">🌙 Moi intérieur et Émotions — Lune : ${SIGNS[moonPos.sign]} ${SIGN_SYMBOLS[moonPos.sign]}</div>
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
        wealthText += 'Pas de planetes en 2e maison — laccumulation de richesse est reguliere et stable. ';
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
        wealthText += 'Pas de planetes en 11e maison — les revenus sont stables sans grandes fluctuations.';
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
        <div class="interp-title">💰 Fortune financière</div>
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
        <div class="interp-title">💕 Conjoint et Fortune Maritale — 7ème Maison : ${SIGNS[h7sign]} ${SIGN_SYMBOLS[h7sign]}</div>
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
        <div class="interp-title">💼 Carrière et Réussite Sociale — 10ème Maison : ${SIGNS[h10sign]} ${SIGN_SYMBOLS[h10sign]}</div>
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
        <div class="interp-title">🏥 Santé — Zones vulnérables</div>
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
                    <div class="interp-title">⏳ Dasha actuel : Dasha de ${DASHA_KO[currentDasha]}</div>
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
        text += 'Pas de planetes en 9e maison — les voyages a letranger existent mais sans lien particulierement fort.';
    } else {
        h9.forEach(p => {
            const f9 = { Sun: 'Father has foreign connections. Government/official overseas trips.', Moon: 'Emotionally enjoys foreign travel. Popularity abroad.', Mars: 'Adventure/challenges abroad. Military/technology-related foreign activities.', Mercury: 'Study abroad/business success! Multilingual abilities.', Jupiter: 'Great fortune abroad! Successful study/immigration. Meeting a foreign teacher.', Venus: 'Romance abroad. Art/fashion-related foreign activities.', Saturn: 'Hardship then success abroad. Long-term foreign residence.', Rahu: 'Strong indicator of foreign migration! Deeply immersed in foreign culture.', Ketu: 'Past-life foreign connections. Spiritual pilgrimage.' };
            text += isEasy ? `${f9[p.id] || ''}<br>` : `${p.symbol} ${p.name}: ${f9[p.id] || ''}<br>`;
        });
    }

    text += '<br><strong>12th House (Foreign Settlement · Immigration · Expenses):</strong><br>';
    if (h12.length === 0) {
        text += 'Pas de planetes en 12e maison — la residence nationale est plus naturelle que letablissement a letranger.';
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
            <strong>🎨 Couleur porte-bonheur :</strong> ${d.color}<br>
            <strong>🔢 Nombre porte-bonheur :</strong> ${d.number}<br>
            <strong>📅 Jour porte-bonheur :</strong> ${d.day}<br>
            <strong>💎 Pierre précieuse :</strong> ${d.gem}<br>
            <strong>🧭 Direction porte-bonheur :</strong> ${d.dir}<br>
            <strong>🪐 Planète régente du Lagna :</strong> ${lagnaRulers[lagnaSign]}
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
    const RULER_NAMES = {Sun:"Soleil",Moon:"Lune",Mars:"Mars",Mercury:"Mercure",Jupiter:"Jupiter",Venus:"Vénus",Saturn:"Saturne",Rahu:"Rahu",Ketu:"Ketu"};

    const isEasy = window.vedicMode === 'easy';
    let html = '';

    if (division === 10) {
        // D10 해석: 직업/커리어
        const d10_1lord = SIGN_RULERS[dLagnaSign];
        const d10_10sign = (dLagnaSign + 9) % 12;
        const d10_10lord = SIGN_RULERS[d10_10sign];
        const d10_10planets = dPositions.filter(p => p.dSign === d10_10sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💼 Analyse de Carrière' : '💼 D10 Analyse de Carrière') + '</div><div class="interp-text">';
        html += '<strong>D10 Lagna:</strong> ' + SIGNS[dLagnaSign] + ' (Maitre: ' + (RULER_NAMES[d10_1lord]||d10_1lord) + ')<br>';
        html += '<strong>D10 10e Maison (Carriere):</strong> ' + SIGNS[d10_10sign] + ' (Maitre: ' + (RULER_NAMES[d10_10lord]||d10_10lord) + ')<br>';
        if (d10_10planets.length > 0) {
            html += '<strong>Planetes en 10e:</strong> ' + d10_10planets.map(p => p.name).join(', ') + '<br>';
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
        html += '<strong>Domaines adaptes:</strong> ' + careerBySign[dLagnaSign];
        html += '</div></div>';

    } else if (division === 7) {
        // D7 해석: 자녀
        const d7_5sign = (dLagnaSign + 4) % 12;
        const d7_5lord = SIGN_RULERS[d7_5sign];
        const d7_5planets = dPositions.filter(p => p.dSign === d7_5sign);
        const benefics = d7_5planets.filter(p => p.natural === 'benefic');
        const malefics = d7_5planets.filter(p => p.natural === 'malefic');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👶 Analyse des Enfants' : '👶 D7 Analyse des Enfants') + '</div><div class="interp-text">';
        html += '<strong>D7 Lagna:</strong> ' + SIGNS[dLagnaSign] + '<br>';
        html += '<strong>D7 5e Maison (Enfants):</strong> ' + SIGNS[d7_5sign] + ' (Maitre: ' + (RULER_NAMES[d7_5lord]||d7_5lord) + ')<br>';
        if (d7_5planets.length > 0) {
            html += '<strong>Planetes en 5e:</strong> ' + d7_5planets.map(p => p.name).join(', ') + '<br>';
        }
        if (benefics.length > 0) html += 'Benefique en 5e — beni avec des enfants.<br>';
        if (malefics.length > 0) html += 'Malefique en 5e — defis avec les enfants.<br>';
        if (d7_5planets.length === 0) html += 'Pas de planetes en 5e — verifiez la position du maitre.';
        html += '</div></div>';

    } else if (division === 12) {
        // D12 해석: 부모
        const d12_4sign = (dLagnaSign + 3) % 12; // 4궁 = 어머니
        const d12_9sign = (dLagnaSign + 8) % 12; // 9궁 = 아버지
        const d12_4planets = dPositions.filter(p => p.dSign === d12_4sign);
        const d12_9planets = dPositions.filter(p => p.dSign === d12_9sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨‍👩‍👧 Analyse des Parents' : '👨‍👩‍👧 D12 Analyse des Parents') + '</div><div class="interp-text">';
        html += '<strong>D12 Lagna:</strong> ' + SIGNS[dLagnaSign] + '<br>';
        html += '<strong>D12 4e (Mere):</strong> ' + SIGNS[d12_4sign];
        if (d12_4planets.length > 0) html += ' — ' + d12_4planets.map(p => p.name).join(', ');
        html += '<br>';
        html += '<strong>D12 9e (Pere):</strong> ' + SIGNS[d12_9sign];
        if (d12_9planets.length > 0) html += ' — ' + d12_9planets.map(p => p.name).join(', ');
        html += '<br>';

        const moon4 = d12_4planets.find(p => p.id === 'Moon');
        const sun9 = d12_9planets.find(p => p.id === 'Sun');
        if (moon4) html += 'Lune en 4e — lien profond avec la mere.<br>';
        if (sun9) html += 'Soleil en 9e — lien profond avec le pere.<br>';
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
            {name:'Ghora',nature:'malefic',desc:'Destruction et peur. Karma sombre'},
            {name:'Rakshasa',nature:'malefic',desc:'Energie demoniaque. Fort desir'},
            {name:'Deva',nature:'benefic',desc:'Etre divin. Merite et benedictions des vies passees'},
            {name:'Kubera',nature:'benefic',desc:'Dieu de la richesse. Karma de richesse'},
            {name:'Yaksha',nature:'benefic',desc:'Gardien de la nature. Harmonie'},
            {name:'Kinnara',nature:'benefic',desc:'Musicien celeste. Talent artistique'},
            {name:'Bhrashta',nature:'malefic',desc:'Le dechu. Karma de la chute'},
            {name:'Kulaghna',nature:'malefic',desc:'Destructeur de famille. Karma familial'},
            {name:'Garala',nature:'malefic',desc:'Poison. Karma dactions toxiques'},
            {name:'Vahni',nature:'malefic',desc:'Dieu du feu. Karma de colere et destruction'},
            {name:'Maya',nature:'malefic',desc:'Illusion. Karma de tromperie'},
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
            {name:'Brahma',nature:'benefic',desc:'Dieu createur. Creation et connaissance'},
            {name:'Vishnu',nature:'benefic',desc:'Dieu preservateur. Protection et ordre'},
            {name:'Maheshwara',nature:'benefic',desc:'Grand Seigneur Shiva. Transformation et liberation'},
            {name:'Deva2',nature:'benefic',desc:'Saint. Pratique spirituelle'},
            {name:'Bala',nature:'benefic',desc:'Strength. Fortitude and courage'},
            {name:'Vishwakarma',nature:'benefic',desc:'Cosmic architect. Building and creation'},
            {name:'Tamasa',nature:'malefic',desc:'Darkness. Ignorance karma'},
            {name:'Kanchana',nature:'benefic',desc:'Or. Purete et valeur'},
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
            {name:'Aryama',nature:'benefic',desc:'Divinite solaire. Friendship and contracts'},
            {name:'Mitra',nature:'benefic',desc:'God of friendship. Trust and companionship'},
            {name:'Agni',nature:'malefic',desc:'Fire god. Purifying fire'},
            {name:'Varuna2',nature:'benefic',desc:'Dieu de locean. Sagesse profonde'},
            {name:'Gauri',nature:'benefic',desc:'Parvati. Devotion et amour'},
            {name:'Mahakala',nature:'malefic',desc:'Great Time. Trying to master time'},
            {name:'Pitamaha',nature:'benefic',desc:'Great Father Brahma. Creator'},
            {name:'Kartikeya',nature:'benefic',desc:'War god. Righteous battle'},
            {name:'Yama',nature:'malefic',desc:'Dieu de la mort. Jugement et justice'},
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
            {name:'Charachara',nature:'benefic',desc:'Toutes choses. Unite avec tout'}
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
            return ' — Divinité: <strong>' + d.deity.name + '</strong> <span style="color:' + c + ';font-weight:700;">' + (d.deity.nature === 'benefic' ? 'Bénéfique' : 'Maléfique') + '</span>';
        }

        const houseThemes = ['','Soi','Richesse','Communication','Foyer','Creation','Service','Relations','Transformation','Sagesse','Carriere','Souhaits','Liberation'];

        const pastLifeThemes = [
            'Guerrier, Leader — A exerce le pouvoir, leadership naturel et determination graves dans lame.',
            'Artiste, Fermier — A travaille avec la nature, instinct profond de stabilite et de beaute materielle.',
            'Erudit, Marchand — A vecu du savoir, polyvalence et curiosite demeurent.',
            'Protecteur, Nourricier — A pris soin des autres, sensibilite profonde et instinct maternel.',
            'Royaute, Pretre — Avait un statut eleve, autorite et dignite naturelles.',
            'Guerisseur, Serviteur — A pratique la medecine ou le service, excellentes capacites analytiques.',
            'Diplomat, Artist — Pursued harmony and beauty, skilled in relationships. Partnership is core theme.',
            'Practitioner, Alchemist — Underwent deep transformation, strong attraction to secrets and mystery.',
            'Sage, Explorer — Sought truth, spiritual wisdom and adventurousness remain. Higher learning karma.',
            'Official, Architect — Built order, strong patience and responsibility. Discipline imprinted on soul.',
            'Official, Guardian — Built social order, organizational spirit. Saturn-ruled, duty imprinted on soul.',
            'Medium, Artist — Communed with spiritual world, extremely strong intuition. Closest to liberation.'
        ];

        const d60SunInterp = [
            'A vecu comme guerrier ou roi, ego fort et leadership demeurent. But de lame: etablir lautorite.',
            'A vecu comme artiste ou riche, lame poursuit labondance materielle.',
            'A vecu comme erudit ou marchand, savoir et communication sont les themes centraux de lame.',
            'A vecu comme protecteur, prendre soin des autres est un instinct profond de lame.',
            'Avait un statut eleve, lautorite naturelle demeure dans cette vie.',
            'A vecu comme guerisseur, analyse et service sont le but de lame.',
            'A poursuivi lharmonie, relations et equilibre sont la tache de lame.',
            'A subi une transformation profonde, secrets graves dans lame.',
            'A cherche la verite, sagesse et aventure sont la direction de lame.',
            'A construit lordre, systemes et responsabilite graves dans lame.',
            'Etait en avance sur son temps, pensee originale est un trait de lame.',
            'A commune avec le monde spirituel, intuition profonde demeure dans lame.'
        ];
        const d60MoonInterp = [
            'Memoire emotionnelle intensement ardente. Colere et passion gravees, maitriser les emotions est la tache.',
            'Memoire emotionnelle chaude et stable. Souvenirs dabondance demeurent.',
            'Memoire emotionnelle intellectuelle et coloree. Nombreuses experiences, forte curiosite.',
            'Memoire emotionnelle tres profonde. Forts souvenirs de foyer et de soins.',
            'Fierte et dignite remplissent la memoire emotionnelle.',
            'Service et analyse dans la memoire emotionnelle. Coeur bienveillant.',
            'Harmonie et relations dans la memoire emotionnelle. Cherche un partenaire.',
            'Memoire emotionnelle profonde et intense. Profondeur comme locean.',
            'Liberte et exploration dans la memoire emotionnelle. Poursuit lexpansion.',
            'Responsabilite et patience dans la memoire emotionnelle. Emotions matures.',
            'Memoire emotionnelle unique et extraordinaire. Sensibilite independante.',
            'Memoire emotionnelle spirituelle et transcendante. Reves vivaces, connexion spirituelle profonde.'
        ];

        // Parashara quote
        if (!isEasy) { html += '<div class="interp-card" style="border-left:3px solid #8b7ec8;"><div class="interp-text" style="font-size:13px;color:#888;">';
        html += '📜 <strong>Parashara a dit :</strong> "Shashtiamsa (D60) est la plus importante de toutes les cartes divisionnelles. Planetes en divisions benefiques donnent de bons resultats, malefiques de mauvais."<br>';
        html += '<span style="color:#666;">— Brihat Parashara Hora Shastra (BPHS)</span></div></div>'; }

        // Ch1: Soul Identity
        const lagnaD = getDeity(lagnaSidereal);
        let ch1 = '<strong>D60 Lagna: ' + SIGNS[dLagnaSign] + ' ' + SIGN_SYMBOLS[dLagnaSign] + '</strong> (Maitre: ' + (RULER_NAMES[d60_1lord]||d60_1lord) + ')' + deityTag(lagnaD) + '<br><br>';
        ch1 += pastLifeThemes[dLagnaSign] + '<br>';
        if (lagnaD.deity) {
            ch1 += '<br>' + (lagnaD.deity.nature === 'benefic' ?
                '<strong>' + lagnaD.deity.name + '</strong> protege le Lagna. ' + lagnaD.deity.desc + ' — Le merite des vies passees protege cette vie, les opportunites viennent naturellement.' :
                '<strong>' + lagnaD.deity.name + '</strong> influence le Lagna. ' + lagnaD.deity.desc + ' — Defi karmique grave dans la personnalite, mais le surmonter mene a une plus grande croissance.');
        }
        if (d60_planets_1.length > 0) ch1 += '<br><br>' + d60_planets_1.map(p => p.name).join(', ') + ' dans le D60 Lagna — karma central concentre dans ces planetes.';
        html += subChapter('🪐', 'Identité de lÂme — Qui vous étiez', ch1);

        // Ch2: Soul Purpose (Sun)
        const sunD60 = dPositions.find(p => p.id === 'Sun');
        if (sunD60) {
            const sunD = getDeity(sunD60.sidereal);
            let ch2 = '<strong>D60 Soleil: ' + SIGNS[sunD60.dSign] + ' ' + SIGN_SYMBOLS[sunD60.dSign] + '</strong>' + deityTag(sunD) + '<br><br>';
            ch2 += (d60SunInterp[sunD60.dSign] || '') + '<br>';
            if (sunD.deity) {
                ch2 += '<br>Divinite solaire <strong>' + sunD.deity.name + '</strong>: ' + sunD.deity.desc + '. ' + (sunD.deity.nature === 'benefic' ? 'Le but de lame a ete justement poursuivi, la realisation de soi vient naturellement.' : 'Defis a lego et lautorite, trouver le vrai soi est la tache.');
            }
            html += subChapter('☉', 'But de lÂme — Pourquoi vous êtes né', ch2);
        }

        // Ch3: Emotional Memory (Moon)
        const moonD60 = dPositions.find(p => p.id === 'Moon');
        if (moonD60) {
            const moonD = getDeity(moonD60.sidereal);
            let ch3 = '<strong>D60 Lune: ' + SIGNS[moonD60.dSign] + ' ' + SIGN_SYMBOLS[moonD60.dSign] + '</strong>' + deityTag(moonD) + '<br><br>';
            ch3 += (d60MoonInterp[moonD60.dSign] || '') + '<br>';
            if (moonD.deity) {
                ch3 += '<br>Divinite lunaire <strong>' + moonD.deity.name + '</strong>: ' + moonD.deity.desc + '. ' + (moonD.deity.nature === 'benefic' ? 'Lesprit etait paisible, stabilite emotionnelle et intuition sont innees.' : 'Blessures emotionnelles restent dans le subconscient. Meditation et repos pres de leau aident.');
            }
            html += subChapter('☽', 'Mémoire Émotionnelle — Schémas inconscients', ch3);
        }

        // Ch4: Spouse Karma
        const d60H7sign = (dLagnaSign + 6) % 12;
        const d60H7lord = SIGN_RULERS[d60H7sign];
        const d60H7planets = dPositions.filter(p => p.dSign === d60H7sign);
        const venusD60 = dPositions.find(p => p.id === 'Venus');
        const rahuD60 = dPositions.find(p => p.id === 'Rahu');
        const ketuD60 = dPositions.find(p => p.id === 'Ketu');

        const spouseKarma = ['Warrior/leader connection. Intense, independent spouse karma.','Artist/wealthy connection. Materially abundant marriage karma.','Scholar/merchant connection. Communication and intellectual rapport.','Family/protector connection. Deep emotional bond karma.','Royalty/nobility connection. Splendid, respected marriage.','Healer/server connection. Service and devotion karma.','Connexion diplomate/artiste. Mariage harmonieux et beau.','Practitioner/mystic connection. Intense, transformative karma.','Sage/explorer connection. Free, expansive karma. Foreign spouse possible.','Official/architect connection. Responsible, stable. Late marriage possible.','Official/military connection. Saturn-ruled, disciplined spouse. Age difference possible.','Medium/artist connection. Mysterious, spiritual karma. May meet in dreams.'];

        let ch4 = '<strong>D60 7e Maison: ' + SIGNS[d60H7sign] + ' ' + SIGN_SYMBOLS[d60H7sign] + '</strong> (Seigneur de la 7e: ' + (RULER_NAMES[d60H7lord]||d60H7lord) + ')<br><br>';
        ch4 += spouseKarma[d60H7sign] + '<br>';
        if (d60H7planets.length > 0) {
            ch4 += '<br><strong>Planetes dans la 7e D60:</strong><br>';
            d60H7planets.forEach(p => {
                const pD = getDeity(p.sidereal);
                ch4 += p.symbol + ' <strong>' + p.name + '</strong>' + deityTag(pD) + '<br>';
                ch4 += (p.natural === 'benefic' ? 'Benefique en 7e — bon karma avec le conjoint, benedictions dans cette vie.' : 'Malefique en 7e — karma non resolu avec le conjoint, se resolvant dans cette vie.') + '<br>';
            });
        }
        if (venusD60) {
            const venD = getDeity(venusD60.sidereal);
            const venH = ((venusD60.dSign - dLagnaSign + 12) % 12) + 1;
            ch4 += '<br><strong>♀ Vénus (Karaka de lAmour)</strong> → D60 ' + venH + 'H (' + houseThemes[venH] + ')' + deityTag(venD) + '<br>';
            ch4 += venD.deity && venD.deity.nature === 'benefic' ? 'Venus sous protection benefique. Lamour a ete bien pratique, un bel amour attend.' : 'Venus sous influence malefique. Apprendre le vrai sens de lamour est la tache.';
        }
        if (rahuD60 && ketuD60) {
            const rahuH = ((rahuD60.dSign - dLagnaSign + 12) % 12) + 1;
            const ketuH = ((ketuD60.dSign - dLagnaSign + 12) % 12) + 1;
            if (rahuH === 7 || ketuH === 7 || rahuH === 1 || ketuH === 1) {
                ch4 += '<br><br>🔥 <strong>Axe Rahu-Ketu sur la ligne 1-7!</strong> Tres forte connexion de vies passees avec le conjoint. Destines a se rencontrer.';
            }
        }
        const h7lordPlanet = dPositions.find(p => p.id === d60H7lord);
        if (h7lordPlanet) {
            const h7lH = ((h7lordPlanet.dSign - dLagnaSign + 12) % 12) + 1;
            ch4 += '<br><br><strong>Maitre de la 7e ' + (RULER_NAMES[d60H7lord]||d60H7lord) + '</strong> → D60 ' + h7lH + 'H (' + houseThemes[h7lH] + ')' + deityTag(getDeity(h7lordPlanet.sidereal)) + '<br>';
            ch4 += 'Le karma du conjoint se manifeste a travers <strong>' + houseThemes[h7lH] + '</strong> area.';
        }
        html += subChapter('💍', 'Karma du Conjoint — Connexion de vie antérieure', ch4);

        // Ch5: Career Karma
        const d60H10sign = (dLagnaSign + 9) % 12;
        const d60H10lord = SIGN_RULERS[d60H10sign];
        const d60H10planets = dPositions.filter(p => p.dSign === d60H10sign);
        const satD60 = dPositions.find(p => p.id === 'Saturn');
        const careerKarma = ['Militaire/Leadership/Sports','Finance/Art/Agriculture','Education/Medias/Commerce','Soins/Immobilier/Hotels','Politique/Divertissement/Gestion','Medical/Analyse/Service','Droit/Diplomatie/Design','Recherche/Medecine','Education/Religion/Etranger','Administration/Construction/Service Public','Technologie/Science/Innovation','Art/Spiritualite/Hopital'][d60H10sign];

        let ch5 = '<strong>D60 10e Maison: ' + SIGNS[d60H10sign] + ' ' + SIGN_SYMBOLS[d60H10sign] + '</strong> (Seigneur de la 10e: ' + (RULER_NAMES[d60H10lord]||d60H10lord) + ')<br><br>';
        ch5 += 'Karma professionnel de vies passees oriente vers <strong>' + careerKarma + '</strong>. Attraction naturelle vers ce domaine.<br>';
        if (satD60) {
            const satD = getDeity(satD60.sidereal);
            const satH = ((satD60.dSign - dLagnaSign + 12) % 12) + 1;
            ch5 += '<br><strong>♄ Saturne (Seigneur du Karma)</strong> → D60 ' + satH + 'H (' + houseThemes[satH] + ')' + deityTag(satD) + '<br>';
            ch5 += satD.deity && satD.deity.nature === 'benefic' ? 'Saturne sous benefique — <strong>benediction tres rare!</strong> Merit from patience reduces career trials.' : 'Saturne sous malefique — karma professionnel lourd. Dissoudre par la patience, le service et le mantra.';
        }
        if (d60H10planets.length > 0) ch5 += '<br><br><strong>Planetes dans la 10e D60:</strong> ' + d60H10planets.map(p => p.name).join(', ') + ' — karma professionnel concentre ici.';
        html += subChapter('💼', 'Karma de Carrière — Vocation de vie antérieure', ch5);

        // Ch6: Wealth Karma
        const d60H2sign = (dLagnaSign + 1) % 12;
        const d60H2planets = dPositions.filter(p => p.dSign === d60H2sign);
        const wealthKarma = ['Instinct de richesse par effort personnel.','Environnement abondant en vie passee.','Construction intellectuelle de richesse.','Richesse familiale/immobiliere.','Richesse par autorite.','Richesse par service. Econome.','Richesse par partenariat.','Richesse dautrui (heritage).','La fortune apporte la richesse.','Lent mais sur. Riche apres la quarantaine.','Richesse par innovation.','Activite spirituelle et richesse.'][d60H2sign];
        let ch6 = '<strong>D60 2e Maison: ' + SIGNS[d60H2sign] + ' ' + SIGN_SYMBOLS[d60H2sign] + '</strong><br><br>' + wealthKarma + '<br>';
        if (d60H2planets.length > 0) {
            ch6 += '<br><strong>Planetes dans la 2e D60:</strong><br>';
            d60H2planets.forEach(p => {
                ch6 += p.symbol + ' ' + p.name + deityTag(getDeity(p.sidereal)) + ' — ' + (p.natural === 'benefic' ? 'Bon karma de richesse. Abondance.' : 'Defi de richesse. Surmonter par leffort.') + '<br>';
            });
        }
        html += subChapter('💰', 'Karma de Richesse — Fortune de vie antérieure', ch6);

        // Ch7: Deity List (compact)
        let ch7 = '';
        const lagnaD2 = getDeity(lagnaSidereal);
        if (lagnaD2.deity) { const lc = lagnaD2.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f'; ch7 += '<div style="padding:4px 0;">⬆ Lagna → <strong>' + lagnaD2.deity.name + '</strong> <span style="color:' + lc + ';">' + (lagnaD2.deity.nature === 'benefic' ? 'B' : 'M') + '</span></div>'; }
        positions.forEach(p => {
            const pD = getDeity(p.sidereal);
            if (pD.deity) { const c = pD.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f'; ch7 += '<div style="padding:4px 0;">' + p.symbol + ' ' + p.name + ' → <strong>' + pD.deity.name + '</strong> <span style="color:' + c + ';">' + (pD.deity.nature === 'benefic' ? 'B' : 'M') + '</span></div>'; }
        });
        if (!isEasy) html += subChapter('🕉️', 'Liste des Divinités', ch7);

        // Ch8: Overall Judgment
        const beneficCount = positions.filter(p => { const pD = getDeity(p.sidereal); return pD.deity && pD.deity.nature === 'benefic'; }).length;
        const maleficPlanets = positions.filter(p => { const pD = getDeity(p.sidereal); return pD.deity && pD.deity.nature === 'malefic'; });
        let ch8 = 'Sur 9 planètes: <strong style="color:#5cb85c">' + beneficCount + ' benefique</strong>, <strong style="color:#d9534f">' + (positions.length - beneficCount) + ' malefique</strong><br><br>';
        if (beneficCount >= 7) ch8 += '🌟 <strong>Merite tres fort des vies passees.</strong> Parashara a appele cela "une ame benie par les dieux." La plupart des planetes sous divinites benefiques.';
        else if (beneficCount >= 5) { ch8 += '✨ <strong>Merite abondant des vies passees.</strong> Benefic predominate, protection in many areas.'; if (maleficPlanets.length > 0) ch8 += ' Attention: <strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong> — practice mantras and charity.'; }
        else if (beneficCount >= 3) { ch8 += '⚖️ <strong>Karma equilibre.</strong> Good events and challenges alternate.'; if (maleficPlanets.length > 0) ch8 += '<br>Watch: <strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong>'; }
        else ch8 += '🔥 <strong>Life of karmic settlement.</strong> Parashara said "the heaviest karma leads to greatest growth." Mantras et charité sont essentiels.';
        html += subChapter('📊', 'Jugement Karmique Global', ch8);

    } else if (division === 2) {
        // D2 Hora — Wealth accumulation
        const d2LagnaInterp = ['Richesse par effort personnel. Investissement independant et agressif.','Investissement sensoriel et richesse stable. Immobilier, gastronomie, art.','Gains par activite intellectuelle. Ecriture, education, sens des affaires.','Revenus immobiliers et familiaux. Propriete de la mere. Attention aux depenses emotionnelles.','Richesse par leadership et autorite. Gouvernement, or. Depenses ostentatoires.','Revenus par analyse et competences. Medical, comptabilite. Gestionnaire econome.','Richesse par partenariat. Droit, diplomatie, mode, art.','Richesse avec largent des autres (heritage, assurance). Sources cachees.','Revenus par education, etranger, religion. La fortune apporte la richesse.','Effort systematique construit la richesse. Lent mais sur. Riche apres la quarantaine.','Revenus par technologie, innovation, reseaux. Sources non conventionnelles.','Revenus par activites spirituelles/artistiques. Richesse liee a letranger.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💰 Analyse de Richesse' : '💰 D2 Hora — Analyse de Richesse') + '</div><div class="interp-text">';
        html += '<strong>D2 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d2LagnaInterp + '<br><br>';
        const sunD2 = dPositions.find(p => p.id === 'Sun');
        const moonD2 = dPositions.find(p => p.id === 'Moon');
        if (sunD2) html += '<strong>☉ Sun → ' + SIGNS[sunD2.dSign] + ':</strong> ' + (sunD2.dSign === 4 ? '🌟 <strong>Soleil dans sa propre hora (Lion)!</strong> Type autodidacte. Construit la richesse par autorite et leadership.' : 'Soleil en hora de Lune. Revenus par aide dautres ou secteur public.') + '<br>';
        if (moonD2) html += '<strong>☽ Moon → ' + SIGNS[moonD2.dSign] + ':</strong> ' + (moonD2.dSign === 3 ? '🌟 <strong>Lune dans sa propre hora (Cancer)!</strong> Vie abondante a travers les gens et les relations.' : 'Lune en hora de Soleil. Subsistance par effort personnel.') + '<br>';
        const d2H2sign = (dLagnaSign + 1) % 12;
        const d2H2planets = dPositions.filter(p => p.dSign === d2H2sign);
        html += '<br><strong>D2 2e Maison (Richesse Accumulee) — ' + SIGNS[d2H2sign] + ':</strong><br>';
        if (d2H2planets.length > 0) {
            const wealth = {Sun:'Richesse par autorite et statut',Moon:'Richesse par activites publiques',Mars:'Propriete, technologie, domaines competitifs',Mercury:'Affaires, activite intellectuelle, communication',Jupiter:'Education, droit, religion — richesse abondante',Venus:'Art, mode, produits de luxe',Saturn:'Accumulation lente mais constante. Stable apres la quarantaine',Rahu:'Methodes non conventionnelles, liees a letranger',Ketu:'Detache du materiel. Poursuit des valeurs spirituelles'};
            d2H2planets.forEach(p => { html += '• ' + p.name + ': ' + (wealth[p.id]||'') + '<br>'; });
        } else html += 'Pas de planetes en 2e — la position du maitre est la cle.<br>';
        html += '</div></div>';

    } else if (division === 3) {
        const d3LagnaInterp = ['Independant, leader parmi les freres et soeurs. Communication courageuse.','Relations stables et confortables avec les freres et soeurs.','Freres et soeurs intellectuels et communicatifs.','Lien emotionnel profond avec les freres et soeurs. Protecteurs.','Freres et soeurs charismatiques et fiers.','Freres et soeurs analytiques et pratiques.','Freres et soeurs diplomatiques et charmants.','Relations intenses et secretes avec les freres et soeurs.','Freres et soeurs libres et philosophiques. A letranger.','Freres et soeurs responsables et ambitieux.','Freres et soeurs uniques et independants.','Freres et soeurs spirituels et artistiques.'][dLagnaSign];
        const d3_3sign = (dLagnaSign + 2) % 12;
        const d3_3planets = dPositions.filter(p => p.dSign === d3_3sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👫 Fratrie et Courage' : '👫 D3 Drekkana — Fratrie et Courage') + '</div><div class="interp-text">';
        html += '<strong>D3 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d3LagnaInterp + '<br><br>';
        html += '<strong>D3 3e Maison (Cadets) — ' + SIGNS[d3_3sign] + ':</strong><br>';
        if (d3_3planets.length > 0) {
            const bro = {Sun:'Younger sibling has leadership and authority',Moon:'Emotionally close with younger sibling',Mars:'Active, brave younger sibling. Possible conflicts',Mercury:'Intelligent younger sibling with good communication',Jupiter:'Wise younger sibling who brings good fortune',Venus:'Attractive, artistic younger sibling',Saturn:'Difficulties with younger sibling. May have age gap',Rahu:'Unique younger sibling or foreign connection',Ketu:'Distance with younger sibling. Spiritual connection'};
            d3_3planets.forEach(p => { html += '• ' + p.name + ': ' + (bro[p.id]||'') + '<br>'; });
        } else html += 'Pas de planetes en 3e — verifiez la position du maitre.<br>';
        html += '</div></div>';

    } else if (division === 4) {
        const d4LagnaInterp = ['Acquiert activement des biens. Aime construire ou acheter des maisons.','Immobilier stable et abondant. Terres et fermes. Logement luxueux.','Plusieurs maisons ou demenagements frequents. Prefere un environnement intellectuel.','Maison et propriete sont emotionnellement importants. Pres de leau.','Grande maison spacieuse. Interieur luxueux. Quartier prestigieux.','Logement propre et pratique. Plusieurs petites proprietes.','Belle maison harmonieuse. Interet pour la decoration interieure.','Propriete en transformation. Propriete heritee. Lieux secrets.','Grand terrain et propriete a letranger. Pres detablissements educatifs.','Investissement immobilier systematique. Vieux batiments. Croissance sure.','Style de logement unique. Appartement moderne. Technologie.','Belle maison pres de leau. Propriete a letranger. Espace spirituel.'][dLagnaSign];
        const d4_4sign = (dLagnaSign + 3) % 12;
        const d4_4planets = dPositions.filter(p => p.dSign === d4_4sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '🏠 Propriété et Fortune' : '🏠 D4 Chaturthamsa — Propriété et Fortune') + '</div><div class="interp-text">';
        html += '<strong>D4 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d4LagnaInterp + '<br><br>';
        html += '<strong>D4 4e Maison (Propriete) — ' + SIGNS[d4_4sign] + ':</strong><br>';
        if (d4_4planets.length > 0) {
            const prop = {Sun:'Government-owned buildings or prestigious dwelling',Moon:'Beautiful home. Near water. Mother influence',Mars:'New construction. Possible property disputes',Mercury:'Commercial property. Multiple ownership',Jupiter:'Spacious, abundant home! Best property fortune',Venus:'Luxurious home. Beautiful interior',Saturn:'Old home. Needs repair. Stable after middle age',Rahu:'Foreign property. Unconventional dwelling',Ketu:'Indifferent to property. Prefers spiritual space'};
            d4_4planets.forEach(p => { html += '• ' + p.name + ': ' + (prop[p.id]||'') + '<br>'; });
        } else html += 'Pas de planetes en 4e — la position du maitre est la cle.<br>';
        html += '</div></div>';

    } else if (division === 24) {
        const d24LagnaInterp = ['Education physique, militaire, formation en leadership.','Education en musique, art, gastronomie, finance.','Education en langues, litterature, communication, medias.','Education en histoire, psychologie, sciences du foyer.','Education en sciences politiques, theatre, commerce.','Education en medecine, science, statistiques.','Education en droit, diplomatie, design.','Education en psychologie, recherche, occultisme.','Philosophie, theologie, etudes internationales. Etudes a letranger probables.','Commerce, administration, architecture. Apprentissage systematique.','IT, ingenierie, aviation, sciences sociales.','Art, musique, spiritualite, cinema. Apprentissage intuitif.'][dLagnaSign];
        const d24_4sign = (dLagnaSign + 3) % 12;
        const d24_5sign = (dLagnaSign + 4) % 12;
        const d24_4planets = dPositions.filter(p => p.dSign === d24_4sign);
        const jupD24 = dPositions.find(p => p.id === 'Jupiter');
        const merD24 = dPositions.find(p => p.id === 'Mercury');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '📚 Éducation' : '📚 D24 Chaturvimsamsa — Éducation') + '</div><div class="interp-text">';
        html += '<strong>D24 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d24LagnaInterp + '<br><br>';
        html += '<strong>D24 4e (Education de Base) — ' + SIGNS[d24_4sign] + ':</strong><br>';
        if (d24_4planets.length > 0) {
            const edu4 = {Sun:'Prestigious school. Authoritative education',Moon:'Comfortable learning environment. Strong home education',Mars:'Competitive learning. Strong in sports/tech',Mercury:'Best placement! Outstanding academic ability',Jupiter:'Rich educational environment. Good teachers',Venus:'Art education. Beautiful school',Saturn:'Difficult education but deep knowledge when overcome',Rahu:'Unconventional education. Foreign school',Ketu:'Less interest in formal education. Intuitive learning'};
            d24_4planets.forEach(p => { html += '• ' + p.name + ': ' + (edu4[p.id]||'') + '<br>'; });
        } else html += 'Pas de planetes en 4e.<br>';
        if (jupD24) { const jH = ((jupD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>♃ Jupiter (Sagesse) → ' + jH + 'H:</strong> ' + ([1,4,5,9].includes(jH) ? '🎓 <strong>Haute reussite academique attendue!</strong> Etudes superieures/doctorat/etudes a letranger possibles.' : 'Croissance par apprentissage. Benediction de Jupiter en maison ' + jH + '.') + '<br>'; }
        if (merD24) { const mH = ((merD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<strong>☿ Mercure (Apprentissage) → ' + mH + 'H:</strong> ' + ([1,4,5,9].includes(mH) ? '📖 <strong>Capacite intellectuelle exceptionnelle!</strong> Talent en maths, langues, analyse.' : 'Capacite intellectuelle en maison ' + mH + '.') + '<br>'; }
        html += '</div></div>';

    } else if (division === 30) {
        const d30LagnaInterp = ['Accidents, brulures, maux de tete. Gerer la colere.','Perte financiere, problemes alimentaires, thyroide.','Anxiete nerveuse, insomnie, problemes respiratoires.','Instabilite emotionnelle, problemes destomac. Controler les emotions.','Problemes cardiaques, surmenage. Besoin dhumilite et de repos.','Troubles digestifs, allergies, stress du perfectionnisme.','Problemes renaux, conflits relationnels. Besoin de decision.','Secrets, accidents, chirurgie. Bilans reguliers importants.','Problemes hepatiques, surpoids. Besoin de moderation.','Articulations, os, depression, solitude. Besoin de calcium et dinteraction sociale.','Pression arterielle, circulation, accidents inattendus.','Deficience immunitaire, addiction, sante mentale. Besoin de meditation et sommeil.'][dLagnaSign];
        const d30_6sign = (dLagnaSign + 5) % 12;
        const d30_8sign = (dLagnaSign + 7) % 12;
        const d30_12sign = (dLagnaSign + 11) % 12;
        const d30_6planets = dPositions.filter(p => p.dSign === d30_6sign);
        const d30_8planets = dPositions.filter(p => p.dSign === d30_8sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '⚠️ Malheur et Maladie' : '⚠️ D30 Trimsamsa — Malheur et Maladie') + '</div><div class="interp-text">';
        html += '<strong>D30 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d30LagnaInterp + '<br><br>';
        const diseaseBySign = ['Tete, cerveau, fievre, inflammation','Cou, thyroide, diabete','Poumons, nerfs, anxiete','Stomach, water retention','Coeur, dos, pression arterielle','Digestive, intestines, skin','Kidneys, lower back, urinary','Reproductive, chronic disease','Liver, thighs, overweight','Os, articulations, rhumatisme','Circulation, blood pressure, ankles','Immunitaire, pieds, sante mentale'];
        html += '<strong>D30 6e (Maladie) — ' + SIGNS[d30_6sign] + ':</strong><br>';
        html += 'Attention: <strong>' + diseaseBySign[d30_6sign] + '</strong><br>';
        if (d30_6planets.length > 0) {
            const dis = {Sun:'Eye, heart-related illness',Moon:'Mental health, water-related issues',Mars:'Accidents, surgery, burns',Mercury:'Nervous system, skin problems',Jupiter:'Liver, overweight',Venus:'Kidneys, diabetes, STDs',Saturn:'Chronic illness, joint problems',Rahu:'Unknown cause illness, addiction',Ketu:'Immune deficiency, allergies'};
            d30_6planets.forEach(p => { html += '• ' + p.name + ': ' + (dis[p.id]||'') + '<br>'; });
        }
        html += '<br><strong>D30 8e (Danger) — ' + SIGNS[d30_8sign] + ':</strong><br>';
        if (d30_8planets.length > 0) {
            d30_8planets.forEach(p => { html += '• ' + p.name + ': ' + (p.natural === 'malefic' ? 'Prudence danger/accident. Assurance et bilans importants.' : 'Protege en crise.') + '<br>'; });
        } else html += 'Pas de planetes en 8e — faible risque.<br>';
        html += '</div></div>';

    } else if (division === 40) {
        const d40LagnaInterp = ['Mere independante et volontaire. Leadership herite de la ligne maternelle.','Mere gere bien la richesse. Abondance materielle de la ligne maternelle.','Mere intellectuelle avec bonne communication. Talent en langues herite.','Lien tres profond avec la mere. Sensibilite et intuition heritees.','Mere avec autorite et dignite. Leadership et honneur herites.','Mere excelle en gestion de sante. Esprit analytique herite.','Mere attractive et diplomatique. Sens artistique herite.','Mere forte qui a traverse une transformation. Resilience heritee.','Mere educative et religieuse. Sagesse heritee.','Mere responsable et stricte. Patience et discipline heritees.','Mere unique et progressiste. Pensee innovante heritee.','Mere spirituelle et intuitive. Art/spiritualite herites.'][dLagnaSign];
        const moonD40 = dPositions.find(p => p.id === 'Moon');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👩 Héritage Maternel' : '👩 D40 Khavedamsa — Héritage Maternel') + '</div><div class="interp-text">';
        html += '<strong>D40 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d40LagnaInterp + '<br>';
        if (moonD40) { const mH = ((moonD40.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☽ Lune (Karaka de la Mère) → ' + mH + 'H:</strong> ' + ['','Forte influence maternelle','Propriété de la mère','Bonne communication avec la mère','Lien profond avec la mère! Meilleur placement','Mère créative','Mère orientée service','La mère influence les relations','Héritage de la mère','Mère religieuse/éducative','Mère socialement réussie','Mère indépendante','Mère spirituelle'][mH] + '<br>'; }
        html += '</div></div>';

    } else if (division === 45) {
        const d45LagnaInterp = ['Pere actif et oriente action. Courage et leadership herites.','Pere financierement stable. Valeurs materielles heritees.','Pere intellectuel et polyvalent. Capacite de communication heritee.','Pere emotionnel et familial. Instinct de soin herite.','Pere autoritaire et respecte. Leadership herite.','Pere pratique et diligent. Competences analytiques heritees.','Pere diplomatique et raffine. Capacite sociale heritee.','Pere fort et mysterieux. Resilience heritee.','Pere erudit et religieux. Philosophie heritee.','Pere strict et ambitieux. Patience et discipline heritees.','Pere creatif et innovant. Pensee scientifique heritee.','Pere spirituel et artistique. Intuition heritee.'][dLagnaSign];
        const sunD45 = dPositions.find(p => p.id === 'Sun');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨 Héritage Paternel' : '👨 D45 Akshavedamsa — Héritage Paternel') + '</div><div class="interp-text">';
        html += '<strong>D45 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>' + d45LagnaInterp + '<br>';
        if (sunD45) { const sH = ((sunD45.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☉ Soleil (Karaka du Père) → ' + sH + 'H:</strong> ' + ['','Forte influence paternelle','Propriété du père','Bonne communication avec le père','Père orienté famille','Père créatif','Père orienté service','Le père influence les relations','Héritage du père','Père religieux/éducatif','Père socialement réussi! Meilleur','Père indépendant','Père spirituel'][sH] + '<br>'; }
        html += '</div></div>';
    }

    interpEl.innerHTML = html;
}


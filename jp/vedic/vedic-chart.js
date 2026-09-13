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
        catGuide: e ? '用語説明' : 'ヴェーダ占星術ガイド',
        catBasic: e ? '私の惑星位置' : '基本チャート — 惑星位置 & 出生チャート',
        catDasha: e ? '私の運勢時期' : 'ダシャー — 人生の時期別運勢',
        catInterp: e ? '私の解釈 — 性格・財運・職業・健康' : '総合解釈 — 性格・財運・職業・健康・ヨーガ',
        catMarriage: e ? '私の配偶者詳細' : '結婚 & 配偶者 — D9 ナヴァムシャ',
        catCareer: e ? '私の職業・財運詳細' : '職業 & 財運 — D10・D2・D4',
        catFamily: e ? '私の家族' : '家族 — D7・D3・D12・D40・D45',
        catSpirit: e ? '霊性・教育・健康' : '霊性・教育・健康 — D20・D24・D27・D16',
        catWarn: e ? '健康注意事項' : '注意事項 — D30 疾病・海外運',
        catKarma: e ? '前世カルマ' : 'カルマ — D60 前世',
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
            id: 'Rahu', name: 'ラーフ', symbol: '☊', natural: 'malefic',
            sidereal: rahuSidereal, sign: Math.floor(rahuSidereal / 30),
            degree: rahuSidereal % 30, nakshatra: Math.floor(rahuSidereal / (360/27)),
            nakshatraPada: Math.floor((rahuSidereal % (360/27)) / (360/108)) + 1
        });
        positions.push({
            id: 'Ketu', name: 'ケートゥ', symbol: '☋', natural: 'malefic',
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
    html += '<th>惑星</th><th>星座</th><th>度数</th><th>ナクシャトラ</th><th>ハウス</th>';
    html += '</tr></thead><tbody>';

    // Add Lagna first
    const lagnaDeg = lagnaSidereal % 30;
    const lagnaNakIdx = Math.floor(lagnaSidereal / (360/27));
    const lagnaNak = NAKSHATRAS[lagnaNakIdx] || {ko:'-'};
    html += `<tr><td>⬆ ラグナ（上昇宮）</td><td>${SIGN_SYMBOLS[lagnaSign]} ${SIGNS[lagnaSign]}</td><td>${lagnaDeg.toFixed(1)}°</td><td>${lagnaNak.ko}</td><td>1</td></tr>`;

    positions.forEach(p => {
        const house = ((p.sign - lagnaSign + 12) % 12) + 1;
        const nak = NAKSHATRAS[p.nakshatra] || { ko: '-', name: '-' };
        const roleMap = { Sun:'自我・権威', Moon:'感情・心', Mars:'エネルギー・勇気', Mercury:'知性・コミュニケーション', Jupiter:'幸運・知恵', Venus:'愛・魅力', Saturn:'忍耐・責任', Rahu:'欲望・革新', Ketu:'霊性・解脱' };
        const houseArea = ['','自分自身','お金・家族','コミュニケーション','家庭','子供・恋愛','健康','配偶者','変革','幸運・海外','職業','収入','海外・霊性'];
        html += `<tr>
            <td>${p.symbol} ${p.name}<br><span style="color:#666;font-size:10px;">${roleMap[p.id]||''}</span></td>
            <td>${SIGN_SYMBOLS[p.sign]} ${SIGNS[p.sign]}</td>
            <td>${p.degree.toFixed(1)}°</td>
            <td>${nak.ko}</td>
            <td>${house}宮<br><span style="color:#666;font-size:10px;">${houseArea[house]||''}</span></td>
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
                cell.innerHTML = row === 1 && col === 1 ? '<div style="color:#c9a84c;font-size:10px;">D1<br>ラシ</div>' : '';
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
                cell.innerHTML = '<div style="font-size:11px;color:#444;text-align:center;">D9<br>ナヴァムシャ</div>';
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
    const RULER_NAMES = {Sun:'太陽',Moon:'月',Mars:'火星',Mercury:'水星',Jupiter:'木星',Venus:'金星',Saturn:'土星',Rahu:'ラーフ',Ketu:'ケートゥ'};

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
        'リーダーシップ、軍事、スポーツ、起業（火の開拓者）',
        '金融、農業、芸術、不動産、食品（安定と物質）',
        '通信、メディア、執筆、教育、マーケティング（知的）',
        '看護、介護、料理、接客、カウンセリング（感情的ケア）',
        '政治、エンターテインメント、リーダーシップ、創造性（輝くステージ）',
        '医療、会計、分析、編集、健康・ウェルネス（精密なサービス）',
        '法律、外交、デザイン、ファッション、調停（バランスと美）',
        '研究、調査、医療、オカルト、心理学（深さと変容）',
        '教育、旅行、哲学、宗教、出版（拡張と探求）',
        '政府、建設、経営、CEO、組織のリーダー（システムと権威）',
        'テクノロジー、IT、発明、社会活動、科学（革新）',
        '芸術、スピリチュアリティ、ヒーリング、音楽、慈善活動（超越と奉仕）'
    ];

    const planetCareer = {
        Sun: '政府官僚、政治家、医師、CEO — 権威ある職業',
        Moon: '看護師、カウンセラー、シェフ、接客業 — 介護・感情的な役割',
        Mars: '軍隊、警察、外科医、エンジニア、アスリート',
        Mercury: '作家、教師、プログラマー、会計士、商人',
        Jupiter: '教授、判事、宗教的指導者、コンサルタント、上級専門家',
        Venus: 'デザイナー、俳優、音楽家、ファッション、美容業界',
        Saturn: '建設、鉱業、農業、経営、職人',
        Rahu: 'IT、海外関連、非従来型のキャリア、研究',
        Ketu: 'スピリチュアリティ、代替医療、研究、修行者'
    };

    let html = '';

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '🕉️ 結婚後のあなた: ${SIGNS[d9LagnaSign]} ${SIGN_SYMBOLS[d9LagnaSign]}' : '🕉️ D9 ラグナ — 結婚後のあなた: ${SIGNS[d9LagnaSign]} ${SIGN_SYMBOLS[d9LagnaSign]}') + '</div>
        <div class="interp-text">
            ナヴァムシャ・ラグナは<strong>${SIGNS[d9LagnaSign]}</strong>。これは結婚後、そして人生後半（30代以降）に現れるあなたの本当の姿です。
            ${d9LagnaSign === d1LagnaSign ? '<br><br><strong>D1とD9のラグナが同じ星座にあります！</strong> これは<strong>バルゴッタマ(Vargottama)</strong> — 非常に強力です。結婚後もあなたの本質は変わらず、内面と外面が一致しています。' : ''}
            ${d9H1Planets.length > 0 ? '<br><br><strong>D9 1宮の惑星:</strong> ' + d9H1Planets.map(p => p.symbol + ' ' + p.name).join(', ') + ' — これらの惑星が結婚後のあなたの性格に強く影響を与えます。' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '💍 配偶者の性格: ${SIGNS[d9H7Sign]} ${SIGN_SYMBOLS[d9H7Sign]}' : '💍 D9 7宮 — 配偶者の性格: ${SIGNS[d9H7Sign]} ${SIGN_SYMBOLS[d9H7Sign]}') + '</div>
        <div class="interp-text">
            ナヴァムシャ7宮は<strong>${SIGNS[d9H7Sign]}</strong>、支配星は<strong>${RULER_NAMES[d9H7Ruler]}</strong>。<br><br>
            これは配偶者の核心的な性格を表します — ${SIGNS[d9H7Sign]}のエネルギーを持つパートナー。
            ${d9H7Planets.length > 0 ? '<br><br><strong>D9 7宮の惑星:</strong><br>' + d9H7Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${p.natural === 'benefic' ? '吉星！配偶者から良いエネルギーを受けます。' : '凶星 — 結婚生活での挑戦がありますが、成長の機会でもあります。'}`).join('<br>') : '<br><br>7宮に惑星がありません — 7宮の支配星の位置がより重要です。'}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '💼 人生の使命(ダルマ): ${SIGNS[d9H10Sign]} ${SIGN_SYMBOLS[d9H10Sign]}' : '💼 D9 10宮 — 人生の使命(ダルマ): ${SIGNS[d9H10Sign]} ${SIGN_SYMBOLS[d9H10Sign]}') + '</div>
        <div class="interp-text">
            ナヴァムシャ10宮は<strong>${SIGNS[d9H10Sign]}</strong>、支配星は<strong>${RULER_NAMES[d9H10Ruler]}</strong>。<br><br>
            D1の10宮が「職業」を示すなら、D9の10宮は<strong>人生のより大きな使命(ダルマ)</strong> — 成熟した後に追求する真の天職。<br><br>
            <strong>使命の方向：</strong> ${careerBySgn[d9H10Sign]}
            ${d9H10Planets.length > 0 ? '<br><br><strong>D9 10宮の惑星:</strong><br>' + d9H10Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${planetCareer[p.id] || '独自のキャリアエネルギー'}`).join('<br>') : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '👔 配偶者の職業' : '👔 配偶者の職業 — 派生10宮(D9 4宮): ${SIGNS[d9H4Sign]} ${SIGN_SYMBOLS[d9H4Sign]}') + '</div>
        <div class="interp-text">
            <strong>派生ハウスの原理：</strong> 7宮（配偶者）から10番目 = D9の4宮が配偶者の職業/社会活動を表します。<br><br>
            D9 4宮は<strong>${SIGNS[d9H4Sign]}</strong>、支配星は<strong>${RULER_NAMES[d9H4Ruler]}</strong>。<br><br>
            <strong>配偶者の職業傾向：</strong> ${careerBySgn[d9H4Sign]}
            ${d9H4Planets.length > 0 ? '<br><br><strong>D9 4宮（配偶者の10宮）の惑星:</strong><br>' + d9H4Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: 配偶者の仕事の可能性：${planetCareer[p.id] || '専門分野'}`).join('<br>') : ''}
        </div>
    </div>`;

    const vargottamaPlanets = d9Positions.filter(p => p.sign === p.d9Sign);
    if (vargottamaPlanets.length > 0) {
        html += `<div class="interp-card">
            <div class="interp-title">⭐ バルゴッタマ惑星 — 特別に強い惑星</div>
            <div class="interp-text">
                D1とD9の両方で同じ星座にある惑星を<strong>バルゴッタマ(Vargottama)</strong>と呼びます。これらは非常に強力で、人生を通じて一貫したエネルギーを発揮します。<br><br>
                ${vargottamaPlanets.map(p => `<strong>${p.symbol} ${p.name}</strong>: ${SIGNS[p.sign]}にD1とD9の両方に位置 — 特別に強いエネルギー！`).join('<br>')}
            </div>
        </div>`;
    }

    // 6. Spouse Direction — 6 Indicator Combined Analysis
    const DIRECTIONS = {
        0:'東', 1:'南', 2:'西', 3:'北',
        4:'東', 5:'南', 6:'西', 7:'北',
        8:'東', 9:'南', 10:'西', 11:'北'
    };
    const DIR_DETAIL = {
        0:'東（牡羊座 — 火）',1:'南（牡牛座 — 土）',2:'西（双子座 — 風）',3:'北（蟹座 — 水）',
        4:'東（獅子座 — 火）',5:'南（乙女座 — 土）',6:'西（天秤座 — 風）',7:'北（蠍座 — 水）',
        8:'東（射手座 — 火）',9:'南（山羊座 — 土）',10:'西（水瓶座 — 風）',11:'北（魚座 — 水）'
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
        {name:'D1 7宮', sign: d1H7Sign, desc:'出生図の配偶者ハウス'},
        {name:'D9 7宮', sign: d9H7Sign, desc:'ナヴァムシャの配偶者ハウス'},
        {name:'D9 7宮主', sign: d9H7RulerSign, desc:'D9 7宮主の位置'},
        {name:'D9 金星', sign: venusD9Sign, desc:'ナヴァムシャの配偶者カラカ'},
        {name:'ウパパダ(UL)', sign: ulSign, desc:'12宮アルダ — 配偶者の背景'},
        {name:'ダラパダ(A7)', sign: a7Sign, desc:'7宮アルダ — 配偶者の社会的イメージ'}
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
        <div class="interp-title">' + (isEasy ? '🧭 Spouse Direction' : '🧭 配偶者の方向 — 6指標分析') + '</div>
        <div class="interp-text">
            ヴェーダ占星術では複数の指標を組み合わせて配偶者の方向を分析します。<br><br>
            <strong>6つの指標：</strong><br>
            ${dirSources.map(s => `• <strong>${s.name}</strong>: ${SIGNS[s.sign]} ${SIGN_SYMBOLS[s.sign]} → <strong>${DIRECTIONS[s.sign]}</strong> <span style="color:#666;font-size:12px;">(${s.desc})</span>`).join('<br>')}
            <br><br>
            <strong>🧿 ウパパダ・ラグナ(UL):</strong> 12宮のアルダパダ — 配偶者の家庭/背景 → <strong>${SIGNS[ulSign]} ${SIGN_SYMBOLS[ulSign]}</strong><br>
            <strong>🎯 ダラパダ(A7):</strong> 7宮のアルダパダ — 配偶者の社会的イメージ → <strong>${SIGNS[a7Sign]} ${SIGN_SYMBOLS[a7Sign]}</strong><br>
            <strong>💍 D9 7宮主 (${RULER_NAMES[d9H7Ruler]}):</strong> ナヴァムシャ7宮主の位置 → <strong>${SIGNS[d9H7RulerSign]} ${SIGN_SYMBOLS[d9H7RulerSign]}</strong><br>
            <strong>♀ D9 金星:</strong> ナヴァムシャの配偶者カラカ → <strong>${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}</strong><br><br>
            <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:14px;margin-top:10px;">
                <strong style="font-size:16px;">🧭 結論： ${agreement >= 4 ? '圧倒的に強い' : agreement >= 3 ? '非常に強い' : agreement >= 2 ? '強い' : ''}${primaryDir}方向</strong><br><br>
                6つの指標中<strong>${agreement}</strong>つの指標が<strong>${primaryDir}</strong>を示しています。
                ${agreement >= 4 ? '<br>4つ以上の指標が一致！非常に高い確率で' + primaryDir + 'の方向から配偶者と出会います。この方向の都市、職場、旅行先に注目してください。' : ''}
                ${agreement === 3 ? '<br>3つの指標が一致 — 高い確率で' + primaryDir + '方向。' : ''}
                ${agreement === 2 ? '<br>2つの指標が一致 — ' + primaryDir + 'が有力ですが他の可能性もあります。' : ''}
                ${agreement <= 1 ? '<br>指標が分散しています — 配偶者は様々な方向から来る可能性があります。' : ''}
                ${sortedDirs.length > 1 && sortedDirs[1][1] === sortedDirs[0][1] ? '<br><br>💡 2つの方向が均等に示されています：<strong>' + sortedDirs[0][0] + '</strong>と<strong>' + sortedDirs[1][0] + '</strong>。' : ''}
            </div>
        </div>
    </div>`;

    const meetingBySgn = [
        "活動的な場所、スポーツ、競争環境、リーダーシップの集まり。激しく突然の出会い。",
        "職場、金融機関、レストラン、自然の中。ゆっくり信頼を築く出会い。",
        "SNS、学校、セミナー、旅行中、合コン。会話から始まる関係。",
        "家族の紹介、近所の集まり、幼馴染。居心地の良い環境からのスタート。",
        "パーティー、コンサート、クリエイティブな集まり、華やかな場所。劇的な出会い。",
        "職場、病院、健康関連、ボランティア活動。実際的なニーズからの出会い。",
        "合コン、マッチング、法律・外交イベント、美術展。上品で洗練された出会い。",
        "危機的状況、深い会話、秘密の場所、研究室。運命的で強烈な引き合い。",
        "海外、大学、宗教・哲学的な集まり、旅行中。遠い地からの縁。異文化の可能性。",
        "職場、ビジネスイベント、公式な場。社会的地位に関連した出会い。",
        "オンライン、趣味のクラブ、社会運動、友人の友人。ユニークで型破りな出会い。",
        "スピリチュアルな集まり、海外、芸術・音楽、病院、夢のヒント。神秘的で運命的な出会い。"
    ];

    const backgroundBySgn = [
        "独立心旺盛な自力で立った家族。強いリーダーシップの遺産。",
        "財政的に安定した家族。伝統的な価値観。裕福な背景の可能性。",
        "知的でコミュニケーション豊かな家族。教育を重視。",
        "温かく家族思いの家庭。強い母親像。",
        "名声があり誇り高い家族。社会的地位と評判。",
        "実践的で勤勉な家族。健康・医療・教育の背景。",
        "バランスが取れた品位ある家族。芸術・法律・外交の背景。",
        "秘密や変容のある家族。深い家族の歴史。",
        "学術的、宗教・哲学的な家族。海外の背景の可能性。",
        "厳格で伝統的な家族。社会的に尊敬されている。責任感を重視。",
        "自由奔放でユニークな家族構成。進歩的な考え方。",
        "スピリチュアルまたは芸術的な家族。海外の背景の可能性。豊かな感受性。"
    ];

    const imageBySgn = [
        "エネルギッシュで自信ある第一印象。スポーティーまたは力強いイメージ。",
        "穏やかで信頼できる第一印象。洗練されて品位あるイメージ。",
        "明るく話し好きな第一印象。知的で機知に富んだイメージ。",
        "温かく包容力のある第一印象。柔らかく思いやりのあるイメージ。",
        "華やかでカリスマ的な第一印象。自信あるイメージ。",
        "こぎれいで整然とした第一印象。几帳面でプロフェッショナルなイメージ。",
        "上品で魅力的な第一印象。バランスが取れて洗練されたイメージ。",
        "神秘的で強烈な第一印象。深みとカリスマのあるイメージ。",
        "自由奔放で活気ある第一印象。ポジティブで冒険好きなイメージ。",
        "真剣で成熟した第一印象。責任感があり信頼できるイメージ。",
        "ユニークで個性的な第一印象。トレンディーでオリジナルなイメージ。",
        "夢見がちで神秘的な第一印象。芸術的で感情豊かなイメージ。"
    ];

    const attractBySgn = [
        "強いエネルギーと自信。積極的で守護する性質が魅力的。",
        "安定感と感覚的な魅力。美食、香り、質感を楽しむ。",
        "機知と会話力。知的刺激が魅力のポイント。",
        "献身的なケアと感情。一緒にいると家にいるような安心感が魅力。",
        "輝く存在感と寛大さ。一緒にいると特別な気分になれる魅力。",
        "繊細な気配りと完璧主義。細部への注意が魅力的。",
        "上品さと調和的な人柄。一緒にいると世界が美しくなる。",
        "強烈な眼差しと深み。魂を貫くような集中力が魅力。",
        "自由な精神とユーモア。一緒にいると冒険が始まる。",
        "確固たる信頼性と成熟さ。揺るぎない安定感が魅力的。",
        "独自の個性と進歩的な思考。今まで見たことのない新鮮さ。",
        "神秘的な感受性とスピリチュアルな深み。夢のようなロマンスが魅力。"
    ];

    const d1H7ForMeeting = (d1LagnaSign + 6) % 12;

    html += `<div class="interp-card">
        <div class="interp-title">🤝 配偶者との出会いの場 ' + (isEasy ? '— 7宮: ${SIGNS[d1H7ForMeeting]} ${SIGN_SYMBOLS[d1H7ForMeeting]}' : '— D1 7宮: ${SIGNS[d1H7ForMeeting]} ${SIGN_SYMBOLS[d1H7ForMeeting]}') + '</div>
        <div class="interp-text">
            7宮の星座が配偶者との出会いの環境と状況を表します。<br><br>
            <strong>${meetingBySgn[d1H7ForMeeting]}</strong>
            ${d1H7ForMeeting === 8 || d1H7ForMeeting === 11 ? '<br><br>💡 <strong>海外の配偶者の可能性！</strong> 9宮（海外）または12宮（海外居住）に関連する星座が7宮にあり、配偶者が外国人または海外での出会いが示唆されます。' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '🏛️ 配偶者の家庭/背景' : '🏛️ 配偶者の家庭/背景 — UL: ${SIGNS[ulSign]} ${SIGN_SYMBOLS[ulSign]}') + '</div>
        <div class="interp-text">
            ウパパダ・ラグナ(UL)は配偶者の家庭環境と育ちを表します。<br><br>
            <strong>${backgroundBySgn[ulSign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '👤 配偶者の第一印象' : '👤 配偶者の第一印象 — A7: ${SIGNS[a7Sign]} ${SIGN_SYMBOLS[a7Sign]}') + '</div>
        <div class="interp-text">
            ダラパダ(A7)は配偶者が世界に見せる外的イメージと第一印象を表します。<br><br>
            <strong>${imageBySgn[a7Sign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">💎 配偶者の魅力ポイント ' + (isEasy ? '— 金星: ${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}' : '— D9 金星: ${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}') + '</div>
        <div class="interp-text">
            ${isEasy ? '' : 'ナヴァムシャの金星の位置は配偶者の核心的な魅力と愛のスタイルを表します。<br><br>'}
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
            <div class="nakshatra-name">あなたの星: ${nak.ko || nak.name}</div>
            <div class="nakshatra-meaning">"${nak.meaning}"</div>
            <div class="nakshatra-detail">${nak.desc}</div>
        </div>
    ` : `
        <div class="nakshatra-card">
            <div class="nakshatra-name">${nak.ko} (${nak.name})</div>
            <div class="nakshatra-meaning">"${nak.meaning}" — 支配星: ${DASHA_KO[nak.ruler] || nak.ruler}</div>
            <div class="nakshatra-detail">
                守護神： ${nak.deity}<br><br>
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

    let html = '<div class="interp-card" style="margin-bottom:12px;border-left:3px solid #c9a84c;"><div class="interp-text" style="font-size:12px;color:#888;">💡 <strong>ヴィムショータリ・ダシャー</strong> — 人生は9つの惑星が順番に支配する時期に分かれます。 <strong>大運（マハーダシャー）</strong>は大きな時期、<strong>小運（アンタルダシャー/ブクティ）</strong>はその中の細かい時期です。 月のナクシャトラ位置から計算されます。<br><br>';
    html += isEasy ? '</div></div>' : '🌙 出生時の月： <strong>' + nak.ko + ' (' + nak.name + ')</strong> — 最初のダシャー： <strong>' + DASHA_KO[startRuler] + '</strong> （残り： ' + remainingYears.toFixed(2) + '年）</div></div>';

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
        const dashaEasyDesc = {Ketu:'内面の省察と霊的成長の時期',Venus:'愛・美・豊かさの時期',Sun:'自信とリーダーシップが輝く時期',Moon:'感情と家庭が中心の時期',Mars:'挑戦と行動力の時期',Rahu:'大きな変化と新しいチャンスの時期',Jupiter:'幸運と成長が訪れる時期',Saturn:'忍耐すれば大きな成果が得られる時期',Mercury:'勉強・コミュニケーション・ビジネスが順調な時期'};
        html += '<span class="dasha-planet">' + (isEasy ? dashaEasyDesc[p.planet] : DASHA_KO[p.planet]) + '</span>';
        html += '<span class="dasha-period">' + fmtDate(p.startD) + ' ~ ' + fmtDate(p.endD) + '</span>';
        html += '<span class="dasha-years">' + (p.actualDays / 365.25).toFixed(1) + '年</span>';
        if (isCurrent) html += '<span class="dasha-badge">現在</span>';
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
    // 1. 性格 & 外見 (1宮 ラグナ)
    // ═══════════════════════════════════
    const lagnaEasy = [
        '行動派！決断力があり、リーダーの資質があります。新しい挑戦が大好き。少し短気かもしれませんが、その分推進力がすごいです。',
        '安定が大好き。快適で美しいもの、美味しいものが好き。一度決めたら最後まで貫くタイプ。頑固だけど信頼できる人です。',
        '好奇心旺盛！話し上手で多才。新しい情報をすぐ吸収し、ウィットのある会話で人を引きつけます。散漫に見えることもありますが、それが魅力です。',
        '感性的で温かい人。家族を大切にし、人の気持ちをよく読みます。誰かの世話をするのが天職。一緒にいると安心する存在です。',
        '生まれながらのリーダー！存在感が大きく、注目を集めます。認められたい気持ちが強いですが、その分愛情も惜しみなく注ぐ人です。',
        '細かくて分析的。完璧を目指し、健康に関心があります。他人が見逃すものを見つける鋭い観察力の持ち主です。',
        '調和を求めます。洗練されて魅力的、芸術的センスが抜群。美しいものに囲まれている時が一番幸せな人です。',
        '深みがあります。直感が強く、本質を見抜きます。表面は穏やかでも内面には激しい感情が流れています。',
        '自由な魂！旅行と学びを愛し、ポジティブ。異文化に興味があり、ユーモアのセンスで周りを明るくします。',
        '野心的。忍耐力が強く、年を重ねるほど魅力が増します。大器晩成型で、最終的に望むものを手に入れます。',
        'ユニーク。みんなと違う考え方をし、革新的。型にはまるのが嫌いで、テクノロジーや科学に才能があります。',
        '感受性が豊か。直感が強く、芸術やスピリチュアルなものに惹かれます。内面の世界が外の世界より豊かな人です。'
    ];
    const lagnaInterp = [
        '火星が支配する牡羊座ラグナ。強い意志とリーダーシップ、独立的な性格。行動が速く開拓者精神が強い。体格は鋭い目鼻立ちに活動的な印象。せっかちだが勇敢で、競争で頭角を現します。',
        '金星が支配する牡牛座ラグナ。安定と豊かさを追求し、感覚的な美しさを愛します。柔らかい外見に魅力的な声。物質的な安定を重視し、芸術的感覚に優れています。頑固だが信頼できる人。',
        '水星が支配する双子座ラグナ。知的好奇心が旺盛でコミュニケーション能力が卓越。若く見える外見にすばしっこい体型。多才だが散漫になりやすく、文章や言語に才能があります。',
        '月が支配する蟹座ラグナ。感受性が豊かで直観的。丸い顔に柔らかい印象。家庭と家族に献身的で保護本能が強い。感情の起伏はあるが深い共感能力の持ち主。',
        '太陽が支配する獅子座ラグナ。カリスマと創造的エネルギーにあふれています。堂々とした体格に存在感のある外見。リーダーシップが天賦であり、注目されることを楽しみます。自尊心が高いが寛大な心。',
        '水星が支配する乙女座ラグナ。分析的で完璧を追求します。端正な外見に知的な印象。細かい観察力と実用的な能力に優れ、健康と衛生に関心が高い。',
        '金星が支配する天秤座ラグナ。バランスと調和を追求し外交的。均整の取れた外見に洗練された印象。対人関係とパートナーシップに優れ、芸術と美への感覚が卓越。',
        '火星が支配する蠍座ラグナ。強烈な直観と変革の力。鋭い眼差しに神秘的な印象。深い洞察力で本質を見抜き、秘密を守ります。劇的な人生の変化を何度も経験します。',
        '木星が支配する射手座ラグナ。自由と真理を追求する哲学者。大きな体格に明るい印象。楽観的で道徳的価値を重視します。旅行と高等教育に縁が深い。',
        '土星が支配する山羊座ラグナ。野心と忍耐力が強い。痩せた体型に真面目な印象。体系的に目標に向かって進み、年齢を重ねるほど若返るタイプ。社会的地位と達成を重視します。',
        '土星が支配する水瓶座ラグナ。革新的で独創的。独特な外見に知的な印象。人道主義的な価値を重視し、型にはまらない思考方式。テクノロジーと科学に才能があります。',
        '木星が支配する魚座ラグナ。霊的で直観的。柔らかい外見に夢見るような印象。芸術的感受性が極めて優れ、超越的な世界に関心が高い。自己犠牲的な傾向。'
    ];

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '👤 性格 & 外見' : '👤 性格 & 外見 — ラグナ: ${SIGNS[lagnaSign]} ${SIGN_SYMBOLS[lagnaSign]}') + '</div>
        <div class="interp-text">${isEasy ? lagnaEasy[lagnaSign] : lagnaInterp[lagnaSign]}</div>
    </div>`;

    // ═══════════════════════════════════
    // 2. 内面 & 感情 (月の星座)
    // ═══════════════════════════════════
    if (moonPos) {
        const moonEasy = [
        '心の奥に炎のような情熱があります。感情が素早く上がって素早く冷めます。ストレスを感じたら体を動かすのが一番。運動やアウトドアが効果的です。',
        '感情的にとても安定しています。急な変化を嫌い、慣れ親しんだものに安心感を覚えます。美味しい食べ物、音楽、美しい自然で心が癒されます。',
        '感情を理性的に処理します。気分が悪い時は誰かと話すと心が整理されます。好奇心旺盛で退屈が苦手。軽いユーモアで雰囲気を変える才能があります。',
        '極度に感受性が豊かです。他人の感情をスポンジのように吸収します。家庭で安心感を感じ、母親との絆が強いです。料理やインテリアで心が安定します。',
        '感情表現が華やかで情熱的。愛され認められたい気持ちが強いですが、その分愛情も惜しみなく注ぎます。創作活動が感情的な治癒薬になります。',
        '感情を分析して整理する傾向があります。心配性ですが問題解決能力が優れています。日常のルーティンで感情的な安定を見つけます。',
        '関係の中で感情のバランスを見つけます。一人だと寂しさを感じ、パートナーや親しい友人と一緒にいると安定します。美しいものと芸術で心の平和を見つけます。',
        '感情は海のように深く激しいです。深く愛し、裏切りは絶対に忘れません。直感が非常に強く、言葉より目や行動から真実を読み取ります。',
        '感情的に明るく楽観的。自由を愛し束縛を嫌います。旅行が最高の癒し。哲学的な思考で感情を昇華させます。',
        '感情をあまり表に出しません。責任感が強く義務を優先します。年を重ねるほど感情的に成熟し、自分を楽に表現できるようになります。',
        'ユニークで予測不能な感情パターン。独立的で自由な感情生活を望みます。社会活動で感情的な満足を見つけます。',
        '極度に直感的でスピリチュアル。夢が鮮明で時に未来を予感します。芸術、瞑想、水辺で心の安定を見つけます。内面の世界が外の世界より豊かです。'
    ];
        const moonInterp = [
            '内面に炎のような情熱があります。感情が即興的で素早く変わります。怒りやすいがすぐ収まり、独立した感情生活を望みます。ストレスは運動で解消すると良いでしょう。',
            '感情的に非常に安定しており、快適さを追求します。変化を嫌い、馴染みのあるものに安心感を得ます。美味しい食事、音楽、自然で癒されます。一度心を開くと簡単には変わりません。',
            '感情を理性的に処理し、会話を通じて心を整理します。好奇心が多く複数の関心事を同時に追求します。感情的な深さより多様性を追求し、退屈に耐えられません。',
            '月の本宮（本来の居場所）。感受性が極めて豊かで他人の感情をスポンジのように吸収します。母性本能が強く家庭で安心を感じます。月の周期に応じて感情が変わることがあります。',
            '感情表現がドラマチックで情熱的。認められ愛されたい欲求が強く、無視されると深く傷つきます。創造的な活動が感情的な癒しになります。ロマンチックで寛大な心。',
            '感情を分析し整理する傾向があります。心配性で完璧主義的ですが実用的に解決します。健康への心配があり、日常のルーティンに安心感を見出します。',
            '関係の中で感情のバランスを見つけます。一人でいると不安で、パートナーと一緒にいると安定します。対立と不和を極度に嫌い、芸術と美しさに心の平和を見出します。',
            '感情が海のように深く激しい。愛も憎しみも深く、裏切りは絶対に許しません。直観が非常に強く、相手の本心を本能的に把握します。変革と再生の感情エネルギー。',
            '感情的に楽観的で自由を愛します。束縛を嫌い新しい経験を追求します。哲学的思考を通じて感情を昇華させ、旅行が最高の癒しです。',
            '感情をよくコントロールし表に出しません。責任感が強く感情より義務を優先します。幼少期に感情的困難があったかもしれませんが、年齢を重ねるほど感情的に成熟します。',
            '独特で予測不可能な感情パターン。独立的で一般的でない方法で愛します。社会的大義と人類への普遍的な愛を追求し、個人的感情より大きな絵を見ます。',
            '極めて直観的で霊的。夢が鮮明で予知的かもしれません。他人の苦しみに深く共感し、自己と他者の境界が曖昧。芸術、瞑想、霊的修行で安定を見出します。'
        ];
        html += `<div class="interp-card">
            <div class="interp-title">' + (isEasy ? '🌙 あなたの感情スタイル' : '🌙 内面 & 感情 — 月: ${SIGNS[moonPos.sign]} ${SIGN_SYMBOLS[moonPos.sign]}') + '</div>
            <div class="interp-text">${isEasy ? moonEasy[moonPos.sign] : moonInterp[moonPos.sign]}</div>
        </div>`;
    }

    // ═══════════════════════════════════
    // 3. 💰 財運 (2宮, 11宮 分析)
    // ═══════════════════════════════════
    const h2planets = planetsInHouse(2);
    const h11planets = planetsInHouse(11);
    const h2sign = (lagnaSign + 1) % 12;
    const h11sign = (lagnaSign + 10) % 12;

    let wealthText = isEasy ? '' : `<strong>2宮 (蓄積された財産):</strong> ${SIGNS[h2sign]}に位置。`;
    if (h2planets.length === 0) {
        wealthText += '2宮に惑星がなく、財産の蓄積は着実ですが特別な変動なく安定的です。';
    } else {
        h2planets.forEach(p => {
            const pWealth = {
                'Sun': '権威と地位を通じた収入。政府や公共部門で財を得る可能性があります。',
                'Moon': '流動的な財政状況。大衆に関連する事業や飲食分野で収入の可能性。',
                'Mars': '積極的な資産運用の傾向。不動産、技術、軍事関連分野で収入。',
                'Mercury': '知的能力でお金を稼ぎます。文筆、教育、通信、IT分野で財を成す。',
                'Jupiter': '最も吉兆な配置！豊かな財運。教育、法律、宗教分野で大きな収入。',
                'Venus': '贅沢品、芸術、エンターテインメント、ファッションで財を築きます。豊かな食生活。',
                'Saturn': 'ゆっくりと着実に財を築きます。初期に困難がありますが中年以降安定。',
                'Rahu': '非伝統的な方法でお金を稼ぎます。外国、技術、革新分野で突然の財。',
                'Ketu': '財に対する無関心。霊的な価値を物質より重視し、突然の損失に注意。'
            };
            wealthText += isEasy ? `${pWealth[p.id] || ''} ` : `${p.symbol} ${p.name}: ${pWealth[p.id] || ''} `;
        });
    }

    wealthText += isEasy ? '<br><br>' : `<br><br><strong>11宮 (収入と利益):</strong> ${SIGNS[h11sign]}に位置。`;
    if (h11planets.length === 0) {
        wealthText += '11宮に惑星がなく、収入は安定的ですが大きく変動しません。';
    } else {
        h11planets.forEach(p => {
            const pIncome = {
                'Jupiter': '大きな収入と豊かな利益！社会的ネットワークが財をもたらします。',
                'Venus': '芸術、社交、ファッションを通じた収入。女性の友人が助けになります。',
                'Saturn': '着実で安定した収入ですが成長は遅い。老後の保障が良い。',
                'Mars': '競争を通じた収入。技術、不動産、スポーツ関連の利益。',
                'Mercury': '知的ネットワークを通じた収入。事業家の気質。',
                'Sun': '権威を通じた収入。政治的な繋がりが財をもたらします。',
                'Moon': '大衆的な人気を通じた収入。変動はあるが着実な流れ。'
            };
            wealthText += isEasy ? `${pIncome[p.id] || ''} ` : `${p.symbol} ${p.name}: ${pIncome[p.id] || ''} `;
        });
    }

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '💰 私の財運' : '💰 財運') + '</div>
        <div class="interp-text">${wealthText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 4. 💕 配偶者 & 結婚運 (7宮 分析)
    // ═══════════════════════════════════
    const h7sign = (lagnaSign + 6) % 12;
    const h7planets = planetsInHouse(7);
    const venus = positions.find(p => p.id === 'Venus');

    const spouseSign = [
        '配偶者が独立的でエネルギーにあふれた性格。強い意志とリーダーシップを持つ人との縁。活動的で直接的なパートナー。',
        '美しく芸術的な配偶者。物質的に安定した人との縁。感覚的で忠実なパートナー。',
        '知的でコミュニケーション能力の高い配偶者。会話が弾む人との縁。ユーモアセンスがあり多才なパートナー。',
        '感性的で家庭的な配偶者。面倒見の良い性格の人との縁。母親のような温かさを持つパートナー。',
        'カリスマがあり堂々とした配偶者。社会的に注目される人との縁。自尊心は高いが寛大なパートナー。',
        '几帳面で実用的な配偶者。健康とウェルネスに関心の多い人との縁。分析的で奉仕的なパートナー。',
        '魅力的で洗練された配偶者。外交的でバランス感覚の良い人との縁。芸術的感覚に優れたパートナー。',
        '強烈で神秘的な配偶者。深い感情を持つ人との縁。変革的で情熱的なパートナー。秘密が多いかもしれません。',
        '自由で楽観的な配偶者。外国人や異文化圏の人との縁の可能性。哲学的で冒険好きなパートナー。',
        '真面目で野心のある配偶者。年齢差があるかもしれません。責任感が強く社会的に成功したパートナー。結婚が遅れることも。',
        '独特で独立的な配偶者。非伝統的な出会いや関係。知的で革新的なパートナー。自由な結婚形態。',
        '霊的で直観的な配偶者。芸術家や霊的従事者との縁。夢見るようなロマンチックなパートナー。理想化の傾向に注意。'
    ];

    let spouseText = spouseSign[h7sign];

    if (h7planets.length > 0) {
        spouseText += isEasy ? '<br><br>' : '<br><br><strong>7宮の惑星:</strong> ';
        h7planets.forEach(p => {
            const pH7 = {
                'Sun': '配偶者が社会的に認められている人。やや支配的かもしれないが尊敬できるパートナー。',
                'Moon': '感性的で面倒見の良い配偶者。感情的な交流が深い結婚生活。',
                'Mars': '情熱的だが争いが多いかもしれません。強い性格の配偶者。エネルギーあふれる関係。（クジャ・ドーシャに注意）',
                'Mercury': '知的で会話が弾む配偶者。ビジネスパートナーとしても良い関係。',
                'Jupiter': '最も祝福された配置！賢明で道徳的な配偶者。幸せな結婚生活。配偶者を通じた幸運。',
                'Venus': '非常に魅力的で愛にあふれた配偶者。ロマンチックな結婚生活。贅沢を好むかもしれません。',
                'Saturn': '結婚が遅れるか年齢差の大きい配偶者。初期の困難の後、安定して長続きする結婚。',
                'Rahu': '非伝統的な結婚。外国人や異なる背景の配偶者。突然の出会い。幻想に注意。',
                'Ketu': '配偶者への超然さ。前世の縁。霊的な繋がりは強いが世俗的な関係では距離感。'
            };
            spouseText += isEasy ? `<br>${pH7[p.id] || ''}` : `<br>${p.symbol} ${p.name}: ${pH7[p.id] || ''}`;
        });
    }

    if (venus) {
        const venusHouse = houseOf(venus.sign);
        spouseText += isEasy ? '<br><br>' : `<br><br><strong>金星の位置 (${venusHouse}宮):</strong> `;
        const venusHouseInterp = {
            1: '魅力的な外見。恋愛を楽しみ、すぐに恋に落ちます。',
            2: '配偶者を通じて財が入ります。美しい声と食通。',
            3: '芸術的なコミュニケーション能力。兄弟姉妹との楽しい関係。',
            4: '家庭での幸福と美しい住居。母親の影響が大きい。',
            5: 'ロマンスが豊かな人生。子供との良い関係。創作活動に喜び。',
            6: '恋愛で奉仕的な態度。職場でのロマンスの可能性。',
            7: '配偶者が非常に魅力的。幸せな結婚生活の強力な指標。',
            8: '深く変革的な愛。秘密の恋愛。配偶者の財産。',
            9: '海外でのロマンス。師匠やメンターとの縁。哲学的な愛。',
            10: '社会的に認められた結婚。職業を通じた出会い。',
            11: '友人から恋人へ。社交活動で縁を見つける。',
            12: '秘密の恋愛。海外での縁。霊的な愛。'
        };
        spouseText += venusHouseInterp[venusHouse] || '';
    }

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '💍 私の配偶者' : '💕 配偶者 & 結婚運 — 7宮: ${SIGNS[h7sign]} ${SIGN_SYMBOLS[h7sign]}') + '</div>
        <div class="interp-text">${spouseText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 5. 💼 職業 & 社会的達成 (10宮 分析)
    // ═══════════════════════════════════
    const h10sign = (lagnaSign + 9) % 12;
    const h10planets = planetsInHouse(10);

    const careerSign = [
        '軍隊、警察、スポーツ、外科、企業経営、リーダーシップ職に適しています。',
        '金融、飲食業、農業、ファッション、不動産、芸術、銀行関連職。',
        'メディア、文筆、教育、通信、IT、マーケティング、翻訳関連職。',
        '医療、看護、ホテル業、海洋、不動産、飲食関連職。',
        '政治、芸能、経営、政府機関、リーダーシップポジション、金関連職。',
        '医療、会計、分析、コンサルティング、健康管理、品質管理職。',
        '法律、外交、ファッション、インテリア、カウンセリング、イベント企画職。',
        '研究、調査、保険、医学、心理学、税務、鉱業関連職。',
        '教育、法律、宗教、出版、旅行、国際貿易関連職。',
        '経営、公務員、建築、土木、政治、大企業関連職。',
        '技術、科学、IT、航空、宇宙、社会福祉、イノベーション分野。',
        '芸術、映画、音楽、医療、海外、霊的分野、NGO関連職。'
    ];

    let careerText = isEasy ? careerSign[h10sign] : `10宮は${SIGNS[h10sign]}に位置。${careerSign[h10sign]}`;

    if (h10planets.length > 0) {
        careerText += isEasy ? '<br><br>' : '<br><br><strong>10宮の惑星:</strong>';
        h10planets.forEach(p => {
            const pCareer = {
                'Sun': ' 政府、リーダーシップ、権威ある職位。社会的に注目されるキャリア。',
                'Moon': ' 大衆に関連する職業。ケアリング、ホテル、飲食、感情関連職。',
                'Mars': ' 技術、エンジニアリング、軍事、外科、スポーツ。競争的な分野で成功。',
                'Mercury': ' ビジネス、コミュニケーション、IT、教育。知的能力で成功。',
                'Jupiter': ' 教育、法律、宗教、コンサルティング。尊敬される職業。最も良い配置の一つ。',
                'Venus': ' 芸術、エンターテインメント、ファッション、ビューティー、外交。創造的な分野で成功。',
                'Saturn': ' 遅いが確実な成功。体系的組織、建築、公務員。中年以降輝く。'
            };
            careerText += isEasy ? `<br>${pCareer[p.id] || ''}` : `<br>${p.symbol} ${p.name}: ${pCareer[p.id] || ''}`;
        });
    }

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '💼 私の職業' : '💼 職業 & 社会的達成 — 10宮: ${SIGNS[h10sign]} ${SIGN_SYMBOLS[h10sign]}') + '</div>
        <div class="interp-text">${careerText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 6. 🏥 健康 (6宮 + ラグナ 分析)
    // ═══════════════════════════════════
    const h6sign = (lagnaSign + 5) % 12;
    const h6planets = planetsInHouse(6);

    const healthByLagna = [
        '頭、脳、顔に関連する疾患に注意。頭痛、発熱、炎症の傾向。規則的な運動が必須。',
        '首、甲状腺、顎に関連する注意。過食と糖尿の傾向。声帯と首の健康管理。',
        '肺、腕、肩、神経系に注意。不安と睡眠の問題の可能性。呼吸瞑想が有効。',
        '胃腸、胸、乳房に関連する注意。消化障害と水分貯留。感情的ストレスが健康に直結。',
        '心臓、背中、脊椎に関連する注意。心血管の健康管理が必須。過労に注意。',
        '消化器系、腸、皮膚に関連する注意。消化不良とアレルギー。食事療法が重要。',
        '腎臓、腰、皮膚に関連する注意。水分摂取とバランスの取れた生活が必須。',
        '生殖器、排泄器系に関連する注意。慢性疾患の可能性。定期検診が重要。',
        '肝臓、太もも、臀部に関連する注意。過体重の傾向。アウトドア活動が健康に良い。',
        '骨、関節、膝、皮膚に関連する注意。リウマチ、関節炎。カルシウム摂取が重要。',
        '足首、ふくらはぎ、循環器系に関連する注意。血圧管理。独特な健康問題の可能性。',
        '足、リンパ系、免疫に関連する注意。原因不明の疾患の可能性。十分な睡眠が鍵。'
    ];

    html += `<div class="interp-card">
        <div class="interp-title">' + (isEasy ? '🏥 私の健康' : '🏥 健康 — 弱い部位') + '</div>
        <div class="interp-text">${healthByLagna[lagnaSign]}${h6planets.length > 0 ? '<br><br>6宮に' + h6planets.map(p => p.name).join('、') + 'が位置しており、健康管理に特別な注意が必要です。' : ''}</div>
    </div>`;

    // ═══════════════════════════════════
    // 7. ⏳ 現在の大運解釈
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
                    'Sun': '自我発見と権威の時期。リーダーシップを発揮し社会的な認知を受ける時期です。政府や権威者との関係が重要になります。父親との関係に変化が生じる可能性があります。健康では心臓と目に注意してください。この時期に自尊心とアイデンティティが強化されます。',
                    'Moon': '感情と内面の時期。家庭と母親との関係が重要になります。不動産関連のことが生じる可能性があり、大衆との関係が活発になります。感情的な変動は大きいですが直観が強まる時期。旅行と引越しの可能性。',
                    'Mars': '行動とエネルギーの時期。勇敢に新しいことを始めるのに良い時です。不動産の売買、手術、技術関連の活動が活発になります。兄弟との関係の変化。ただし紛争、事故、火傷に注意してください。運動と競争で良い結果。',
                    'Rahu': '急変と革新の時期。予想外の機会と挑戦が訪れます。外国関連の仕事が活発になり、技術と革新の分野で発展の可能性。物質的な欲望が強くなりますが幻想に陥らないよう注意。独特な経験をすることになります。18年の長い周期。',
                    'Jupiter': '幸運と成長の時期！教育、結婚、出産、昇進など人生の良いことが起きやすい時。霊的な成長と知恵が深まります。師匠やメンターに出会います。法律、教育、宗教関連の活動が有利です。',
                    'Saturn': '忍耐と試練の時期。遅いが確実な成長をします。責任が重くなり制限と構造化を経験します。健康、特に骨と関節に注意。19年の長い周期で、真の実力が試される時期。終われば強くなった自分を発見します。',
                    'Mercury': '知的活動とビジネスの時期。学習、コミュニケーション、文筆、事業に有利です。新しい技術を学ぶのに良い時。兄弟、友人との関係が活発になります。神経系の健康に注意。複数のことを同時に手がけることになります。',
                    'Ketu': '霊的覚醒と分離の時期。物質世界から超然とし霊的な関心が深まります。突然の変化と喪失を経験するかもしれませんが、それが霊的成長につながります。直観が非常に強まり、瞑想と修行に良い時期。',
                    'Venus': '愛と豊穣の時期！恋愛、結婚、芸術活動が活発になります。物質的な豊かさを享受し贅沢を楽しみます。新車、新居、宝石などを得るかもしれません。美的感覚が発達し社交活動が活発になります。20年の最も長い周期。'
                };
                html += `<div class="interp-card">
                    <div class="interp-title">⏳ 現在の大運: ${DASHA_KO[currentDasha]} ダシャー</div>
                    <div class="interp-text">${dashaInterp[currentDasha]}</div>
                </div>`;
            }
        }
    }

    // ═══════════════════════════════════
    // 8. 🔮 特別ヨーガ (惑星の組み合わせ)
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
            yogaText += '<strong>🐘 ガジャケーサリー・ヨーガ (Gajakesari)</strong> — 月と木星がケンドラ関係！知恵、名声、豊穣の組み合わせ。社会的に尊敬され知的能力に優れています。良い教育と子供運。<br><br>';
        }
    }

    // Budha-Aditya Yoga
    const sun = positions.find(p => p.id === 'Sun');
    const mercury = positions.find(p => p.id === 'Mercury');
    if (sun && mercury && sun.sign === mercury.sign) {
        yogaText += '<strong>📚 ブダ・アーディティヤ・ヨーガ</strong> — 太陽と水星が同じ星座！優れた知性とコミュニケーション能力。教育、文筆、ビジネスで成功。権威ある知的リーダー。<br><br>';
    }

    // Chandra-Mangala Yoga
    if (moonPos && mars && moonPos.sign === mars.sign) {
        yogaText += '<strong>🔥 チャンドラ・マンガラ・ヨーガ</strong> — 月と火星が同じ星座！強い意志と財の蓄積能力。事業で成功し大胆な決断を下します。<br><br>';
    }

    // Kuja Dosha (Manglik)
    if (mars) {
        const marsH = houseOf(mars.sign);
        if ([1,2,4,7,8,12].includes(marsH)) {
            yogaText += `<strong>⚠️ クジャ・ドーシャ（マンガリク）</strong> — 火星が${marsH}宮に位置しており、結婚生活に挑戦があるかもしれません。配偶者選びの際、相手のチャートも確認することをお勧めします。28歳以降の結婚が有利かもしれません。<br><br>`;
        }
    }

    if (yogaText) {
        html += `<div class="interp-card">
            <div class="interp-title">🔮 特別ヨーガ (惑星の組み合わせ)</div>
            <div class="interp-text">${yogaText}</div>
        </div>`;
    }

    document.getElementById('interpWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// 惑星別ハウス詳細解釈
// ═══════════════════════════════════════════════════
const PLANET_IN_HOUSE = {
    Sun: [
        '1宮: 強い自我とリーダーシップ。健康で活力にあふれる。自尊心が高く独立的。政府/権威との縁。',
        '2宮: 家門の名誉を重視。権威を通じた収入。父親からの財産。目の健康に注意。',
        '3宮: 勇敢で決断力がある。兄弟の中のリーダー。文筆/コミュニケーションで権威。短い旅行が多い。',
        '4宮: 親との関係に緊張。不動産/車の所有。内面の不安感。故郷を離れることも。',
        '5宮: 創造的才能が優れている。子供との良い関係。投資/投機の能力。ロマンチックな恋。',
        '6宮: 敵に勝つ力。健康管理能力。法的紛争で勝利。奉仕/医療分野に適している。',
        '7宮: 配偶者の社会的地位が高い。パートナーシップで主導権。結婚後の社会的成長。',
        '8宮: 寿命に注意。遺産/保険関連の利益。秘密の権力。霊的変革の経験。',
        '9宮: 父親が尊敬される人物。法律/宗教/高等教育で成功。海外旅行が多い。幸運。',
        '10宮: 最高の配置！社会的成功と名声。政府/公共分野のリーダー。父親のように成功。',
        '11宮: 大きな収入と社会的ネットワーク。上流層の友人。目標達成能力に優れる。',
        '12宮: 海外での成功。霊的追求。父親との距離。孤独を楽しむ傾向。目の健康に注意。'
    ],
    Moon: [
        '1宮: 魅力的な外見。感情的で変化の多い性格。大衆に人気。健康が月の周期に影響。',
        '2宮: 豊かな家庭環境。良い食生活。甘い話し方。家族との絆が強い。',
        '3宮: 創造的なコミュニケーション能力。旅行が好き。兄弟姉妹との感情的な絆。芸術的な趣味。',
        '4宮: 最高の配置！幸せな家庭。母親との強い絆。不動産運が良い。感情的安定。',
        '5宮: 子供への愛が深い。ロマンチックな性格。直感的な投資能力。創作活動に喜び。',
        '6宮: 感情的ストレスによる健康問題。敵に勝利。奉仕精神。消化障害に注意。',
        '7宮: 魅力的な配偶者。感情的に深い結婚。パートナーに依存的な傾向。大衆との関係。',
        '8宮: 感情的な混乱と変革。直観が非常に強い。遺産/相続の可能性。寿命は長いが感情的な危機。',
        '9宮: 霊的で哲学的。母親が宗教的。海外旅行/居住。幸運な旅行。',
        '10宮: 大衆的な人気と社会的成功。ホテル/飲食/ケアリング分野。母親の影響で成功。',
        '11宮: 友人が多く社交的。着実な収入。願望達成能力。女性の友人の助け。',
        '12宮: 海外居住の可能性。睡眠の問題。霊的傾向。母親との距離。孤独を楽しむ。'
    ],
    Mars: [
        '1宮: 強い体力と意志。傷/傷跡の可能性。せっかちだが勇敢。リーダーシップと競争心。',
        '2宮: 荒い言葉遣い。食習慣の問題。家族との争い。しかし財の蓄積能力。',
        '3宮: 最高の配置！勇気と冒険心。兄弟との強い絆。運動/スポーツの才能。',
        '4宮: 家庭内の対立。不動産関連の紛争。母親との緊張。しかし不動産投資の利益。',
        '5宮: 情熱的な恋愛。子供が活動的。投機的な投資。スポーツ/競争分野の才能。',
        '6宮: 敵を撃破する力！病気に勝つ体力。軍隊/警察/医療に適している。強い免疫力。',
        '7宮: クジャ・ドーシャ — 結婚生活に情熱と対立が共存。強い配偶者。28歳以降の結婚推奨。',
        '8宮: 事故/手術に注意。しかし危機を生き抜く力。保険/遺産の利益。タントラへの関心。',
        '9宮: 父親との対立。宗教への強い意見。法的紛争。海外での活動。',
        '10宮: 優れた職業成果！軍隊/エンジニアリング/外科/警察。社会で勇敢なリーダー。',
        '11宮: 大きな収入！目標達成能力が強い。兄弟からの助け。不動産の利益。',
        '12宮: 海外での支出が多い。睡眠の問題。性的エネルギーが強い。秘密の活動。'
    ],
    Jupiter: [
        '1宮: 祝福された配置！知恵深く寛大な性格。体格が大きく健康。尊敬される人物。',
        '2宮: 豊かな財産！大きな家門。教育を通じた収入。雄弁家。良い食生活。',
        '3宮: 兄弟姉妹が成功的。宗教/教育関連の文筆。短い巡礼旅行。',
        '4宮: 最高の配置の一つ！広い家。学問的成果。母親が知恵深い。内面の平和。',
        '5宮: 優れた知性と創造力！良い子供運。賢明な投資。霊的修行。前世の功徳。',
        '6宮: 敵に簡単に勝つ。法的勝利。奉仕精神。健康だが体重管理に注意。',
        '7宮: 賢明で道徳的な配偶者！幸せな結婚。ビジネスパートナーシップの成功。',
        '8宮: 長寿！遺産相続。霊的知識の深さ。占星術/神秘学への関心。配偶者の財産。',
        '9宮: 最も強力な配置！偉大な幸運。師匠の祝福。海外旅行。法律/宗教/哲学の成功。',
        '10宮: 社会的名声と尊敬！教育/法律/宗教分野のリーダー。道徳的権威。最高の職業運。',
        '11宮: 大きな収入と利益！願望成就。影響力のある人脈。社会的成功。',
        '12宮: 海外での幸運。霊的解放。天国の快楽。寄付と慈善。瞑想修行。'
    ],
    Venus: [
        '1宮: 非常に魅力的な外見！芸術的才能。贅沢を楽しむ。社交的で人気者。',
        '2宮: 豊かな財産！美味しい食事と贅沢品。甘い声。家族の調和。',
        '3宮: 芸術的なコミュニケーション。美しい文章。妹/女性の兄弟との良い関係。',
        '4宮: 美しい家と車！ラグジュアリーな生活。母親が美しく芸術的。',
        '5宮: ロマンチックな恋！芸術/エンターテインメントの才能。美しい子供。創作の喜び。',
        '6宮: 恋愛での困難。健康関連の美容。敵に魅力で勝利。',
        '7宮: 最高の配置！非常に魅力的な配偶者。幸せな結婚。ビジネスパートナーシップの成功。',
        '8宮: 深く変革的な愛。配偶者の財産。秘密のロマンス。長寿。',
        '9宮: 海外でのロマンス。芸術的な旅行。師匠との美しい関係。',
        '10宮: 芸術/ファッション/エンターテインメント分野の成功！社会的に魅力的。女性の助け。',
        '11宮: 社交的ネットワークを通じた収入！女性の友人の助け。願望成就。',
        '12宮: 海外での愛。秘密の恋愛。寝室の楽しみ。芸術的インスピレーション。'
    ],
    Saturn: [
        '1宮: 痩せた体型。真面目で責任感が強い。幼少期の困難。年齢を重ねるほど輝く。長寿。',
        '2宮: 財の蓄積が遅い。質素な生活。言葉が重い。家族との距離。中年以降安定。',
        '3宮: 優れた配置！強い意志と忍耐。兄弟への責任。体系的なコミュニケーション。',
        '4宮: 母親との困難。家庭環境が厳格。古い家/建物。内面の孤独。',
        '5宮: 子供が遅いか少ない。慎重な投資。学業での困難と克服。霊的修行。',
        '6宮: 敵を忍耐で制す！慢性疾患だが管理可能。奉仕分野での成功。良い配置。',
        '7宮: 結婚が遅い。年上の配偶者。初期の困難の後、安定した結婚。ビジネスパートナーに注意。',
        '8宮: 長寿！慢性疾患に注意。遺産関連の遅延。秘密の研究。タントラ/ヨーガへの関心。',
        '9宮: 父親との困難な関係。宗教への真剣なアプローチ。遅い海外旅行。',
        '10宮: 偉大な配置！遅いが確実な社会的成功。大企業/政府のリーダー。最高の職業運。',
        '11宮: 着実な収入成長！年上の友人。目標を忍耐で達成。組織での利益。',
        '12宮: 海外での困難と成長。睡眠の問題。霊的修行。孤独な作業を好む。'
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

        html += `<div class="interp-card">
            <div class="interp-title">${p.symbol} ${p.name} → ${house}宮 (${SIGNS[p.sign]})</div>
            <div class="interp-text">${isEasy ? desc.replace(/^\d+\w{0,4}\s*[宮House Casa Haus Maison]?:?\s*/i, '') : desc}</div>
        </div>`;
    });

    document.getElementById('planetHouseWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// 教育 & 知識
// ═══════════════════════════════════════════════════
function renderEducation(positions, lagnaSign) {
    const isEasy = window.vedicMode === 'easy';
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    const h4 = planetsInHouse(4);
    const h5 = planetsInHouse(5);
    const h4sign = (lagnaSign + 3) % 12;
    const h5sign = (lagnaSign + 4) % 12;

    let text = `<strong>4宮 (基礎教育・学位):</strong> ${SIGNS[h4sign]}。`;
    const eduSign4 = ['活動的な学習、体育/軍事教育', '美術/音楽/料理教育', '言語/文学/コミュニケーション', '家庭教育重視、歴史学', '演劇/リーダーシップ/政治学', '科学/医学/分析学', '法学/外交/デザイン', '心理学/研究/調査', '哲学/神学/国際学', '経営/行政/建築', 'IT/科学技術/航空', '芸術/映画/音楽/霊性'];
    text += eduSign4[h4sign] + 'に適しています。';
    if (h4.length > 0) text += '4宮の' + h4.map(p => p.name).join('、') + 'が教育に影響。';

    const jupiter = positions.find(p => p.id === 'Jupiter');
    if (jupiter) {
        const jH = houseOf(jupiter.sign);
        if ([1,4,5,9].includes(jH)) text += '<br><br>🎓 <strong>木星が' + jH + '宮に位置しており、高い学業成就が期待されます！</strong> 大学院/博士課程/海外留学の可能性。';
    }

    text += `<br><br><strong>5宮 (高等教育・知性・創造力):</strong> ${SIGNS[h5sign]}。`;
    if (h5.length > 0) {
        h5.forEach(p => {
            const h5p = { Sun: 'リーダーシップ/政治学分野に優れる', Moon: '芸術/心理学の才能', Mars: '工学/技術/体育の才能', Mercury: '数学/言語/ビジネスの天才', Jupiter: '最高の配置！学者/教授/研究者', Venus: '芸術/デザイン/音楽の才能', Saturn: '遅い学業だが深みのある研究' };
            text += `${isEasy ? "" : p.name + ": "}${h5p[p.id] || '学業に影響'}。`;
        });
    }

    document.getElementById('educationWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// 子供運
// ═══════════════════════════════════════════════════
function renderChildren(positions, lagnaSign) {
    const isEasy = window.vedicMode === 'easy';
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    const h5 = planetsInHouse(5);
    const h5sign = (lagnaSign + 4) % 12;
    const jupiter = positions.find(p => p.id === 'Jupiter');

    let text = `<strong>5宮 (子供・創造力):</strong> ${SIGNS[h5sign]}に位置。<br><br>`;

    const childSign = [
        '活発で独立的な子供。スポーツ/リーダーシップに才能。早く独立。',
        '穏やかで芸術的な子供。音楽/美術に才能。物質的に豊かな子供。',
        '賢くて話が早い子供。学業優秀。双子の可能性。',
        '感性的で優しい子供。母親と特別な絆。家庭的な子供。',
        'カリスマがあり創造的な子供。リーダーの気質。芸能/芸術の才能。',
        '几帳面で分析的な子供。医学/科学の才能。健康管理が重要。',
        '魅力的で社交的な子供。芸術/外交の才能。バランス感覚に優れる。',
        '強烈で直観的な子供。研究/探究精神。秘密が多いかもしれません。',
        '自由で冒険的な子供。海外留学/旅行の可能性。哲学的な傾向。',
        '真面目で野心のある子供。早く成熟する。社会的達成志向。',
        '独特で革新的な子供。技術/科学に才能。独立的な性格。',
        '芸術的で霊的な子供。想像力豊か。音楽/絵の才能。'
    ];
    text += childSign[h5sign];

    if (h5.length > 0) {
        text += '<br><br><strong>5宮の惑星:</strong><br>';
        h5.forEach(p => {
            const ch = { Sun: '息子との縁。子供がリーダーの気質。', Moon: '娘との縁。子供との感情的な絆が強い。', Mars: '活動的な子供。やや扱いにくいかもしれません。', Mercury: '非常に賢い子供！学業優秀。', Jupiter: '福のある子供！親孝行。子供を通じた幸運。', Venus: '美しく芸術的な子供。娘との縁。', Saturn: '子供が遅いか少ないかもしれません。しかし責任感のある子供。' };
            text += `${ch[p.id] || ''}<br>`;
        });
    }

    if (jupiter) {
        const jH = houseOf(jupiter.sign);
        if (jH === 5) text += '<br>🌟 <strong>木星が5宮！最高の子供運。子供が大きな幸運をもたらします。</strong>';
    }

    document.getElementById('childrenWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// 海外運 & 移住
// ═══════════════════════════════════════════════════
function renderForeign(positions, lagnaSign) {
    const isEasy = window.vedicMode === 'easy';
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    const h9 = planetsInHouse(9);
    const h12 = planetsInHouse(12);
    const rahu = positions.find(p => p.id === 'Rahu');

    let text = '<strong>9宮 (海外旅行・幸運・高等教育):</strong><br>';
    if (h9.length === 0) {
        text += isEasy ? '' : '9宮に惑星がなく、海外旅行はありますが特別に強い縁ではありません。';
    } else {
        h9.forEach(p => {
            const f9 = { Sun: '父親が海外関連。政府/公務の海外出張。', Moon: '海外旅行を感情的に楽しむ。海外での大衆人気。', Mars: '海外での冒険/挑戦。軍事/技術関連の海外活動。', Mercury: '海外留学/ビジネスの成功！多言語能力。', Jupiter: '海外で大きな幸運！留学/移民の成功。海外で師匠に出会う。', Venus: '海外でのロマンス。芸術/ファッション関連の海外活動。', Saturn: '海外での苦労の後に成功。長期海外滞在。', Rahu: '海外移住の強力な指標！外国文化に深くはまる。', Ketu: '前世からの海外の縁。霊的巡礼。' };
            text += isEasy ? `${f9[p.id] || ''}<br>` : `${p.symbol} ${p.name}: ${f9[p.id] || ''}<br>`;
        });
    }

    text += '<br><strong>12宮 (海外定住・移民・支出):</strong><br>';
    if (h12.length === 0) {
        text += isEasy ? '' : '12宮に惑星がなく、海外定住よりは国内居住が自然です。';
    } else {
        h12.forEach(p => {
            const f12 = { Sun: '海外でのアイデンティティ探し。政府関連の海外派遣。', Moon: '海外居住の可能性が高い！海外で感情的安定。', Mars: '海外でのエネルギー消耗。海外投資/不動産。', Mercury: '海外ビジネス/IT関連活動。海外教育。', Jupiter: '海外での霊的成長。慈善活動。海外の大学。', Venus: '海外での贅沢と快楽。海外の芸術活動。', Saturn: '海外での厳しい労働。しかし長期的な定住。', Rahu: '海外移民の確定的指標！西洋文化への適応。', Ketu: '海外での霊的修行。孤独な海外生活。' };
            text += isEasy ? `${f12[p.id] || ''}<br>` : `${p.symbol} ${p.name}: ${f12[p.id] || ''}<br>`;
        });
    }

    if (rahu) {
        const rH = houseOf(rahu.sign);
        if ([9, 12, 7].includes(rH)) text += '<br>✈️ <strong>ラーフが' + rH + '宮に位置しており、海外移住/長期滞在の可能性が非常に高いです！</strong>';
    }

    document.getElementById('foreignWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// 惑星の品位
// ═══════════════════════════════════════════════════
function renderDignity(positions, lagnaSign) {
    const isEasy = window.vedicMode === 'easy';
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    const houseArea = {1:'自分自身',2:'お金・家族',3:'コミュニケーション・兄弟',4:'家庭・母親',5:'子供・恋愛',6:'健康・敵',7:'配偶者',8:'変革・遺産',9:'幸運・海外',10:'職業・名声',11:'収入・願望',12:'海外・霊性'};
    const EXALT = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
    const DEBI = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };
    const OWN = { Sun: [4], Moon: [3], Mars: [0,7], Mercury: [2,5], Jupiter: [8,11], Venus: [1,6], Saturn: [9,10] };

    // わかりやすい説明
    const planetRole = {
        Sun: '自我・自信・父親・権威',
        Moon: '感情・心・母親・日常',
        Mars: 'エネルギー・勇気・行動力・競争',
        Mercury: '知性・コミュニケーション・学習・ビジネス',
        Jupiter: '幸運・知恵・財産・結婚',
        Venus: '愛・魅力・芸術・快楽',
        Saturn: '忍耐・試練・責任・努力'
    };

    let html = `<div class="interp-card" style="margin-bottom:16px;">
        <div class="interp-text">
            <strong>💡 わかりやすく理解する:</strong> 惑星の「品位」とは、その惑星がどれだけ力を発揮できるかを意味します。<br><br>
            🟢 <strong>高揚</strong> = 最高のコンディション！この惑星が担当する人生の領域で大きな幸運と成果。<br>
            🟡 <strong>本宮</strong> = 自分の家にいるように快適。安定的に良い結果。<br>
            ⚪ <strong>中立</strong> = 普通。特に強くも弱くもない。<br>
            🔴 <strong>減衰</strong> = 力が弱い状態。この領域で困難がありますが努力で克服可能。
        </div>
    </div>`;

    positions.forEach(p => {
        if (!EXALT.hasOwnProperty(p.id)) return;
        let dignity, emoji, meaning, color, simpleDesc;
        const role = planetRole[p.id];

        const house = houseOf(p.sign);
        const area = houseArea[house] || '';

        if (p.sign === EXALT[p.id]) {
            dignity = '高揚 (Exalted)';
            emoji = '🟢';
            color = '#5cb85c';
            simpleDesc = `<strong>${p.name}が最強！</strong>「${role}」のエネルギーが最大化された状態で<strong>${house}宮(${area})</strong>の領域で大きな祝福を受けています。生まれ持った才能が輝き、自然と良い結果を得ます。`;
        } else if (p.sign === DEBI[p.id]) {
            dignity = '減衰 (Debilitated)';
            emoji = '🔴';
            color = '#d9534f';
            simpleDesc = isEasy ? `<strong>${area}</strong> この分野で困難を感じるかもしれません。でも意識的に努力すれば、むしろ大きな成長のチャンスになります。下の改善方法を参考にしてください。` : `<strong>${p.name}が弱い状態。</strong>「${role}」のエネルギーが弱まった状態で<strong>${house}宮(${area})</strong>の領域にあります。この分野で困難を感じるかもしれませんが、意識的な努力で克服すればむしろ大きな成長の機会になります。下記の癒し法を参考にしてください。`;
        } else if (OWN[p.id] && OWN[p.id].includes(p.sign)) {
            dignity = '本宮 (Own Sign)';
            emoji = '🟡';
            color = '#c9a84c';
            simpleDesc = isEasy ? `<strong>${area}</strong> この分野で安定的に力を発揮します。自然に良い結果が生まれます。` : `<strong>${p.name}が自分の家に！</strong>「${role}」のエネルギーが安定的に<strong>${house}宮(${area})</strong>の領域で力を発揮します。自然と良い結果を生み出します。`;
        } else {
            dignity = '中立';
            emoji = '⚪';
            color = '#999';
            simpleDesc = isEasy ? `<strong>${area}</strong> この分野で普通の影響力です。特に強くも弱くもありません。` : `${p.name}の「${role}」のエネルギーが<strong>${house}宮(${area})</strong>の領域で普通の影響力を発揮します。他の惑星との関係によって結果が異なります。`;
        }

        html += `<div class="interp-card">
            <div class="interp-title">${emoji} ${isEasy ? area + ' — ' : p.symbol + ' ' + p.name + ' — ' + SIGNS[p.sign] + ' ' + SIGN_SYMBOLS[p.sign]} → ${house}宮(${area}) — <span style="color:${color}">${dignity}</span></div>
            <div class="interp-text">
                ${isEasy ? '' : '<span style="color:#666;font-size:12px;">担当: ${role} │ 位置: ${house}宮 = ${area}</span>'}<br><br>
                ${simpleDesc}
            </div>
        </div>`;
    });

    document.getElementById('dignityWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// ラッキー情報
// ═══════════════════════════════════════════════════
function renderLucky(lagnaSign, moonPos) {
    const luckyData = [
        { color: '赤、オレンジ', number: '1, 9', day: '火曜日', gem: 'サンゴ (Red Coral)', dir: '東' },
        { color: '白、ピンク', number: '2, 6', day: '金曜日', gem: 'ダイヤモンド', dir: '南東' },
        { color: '緑', number: '3, 5', day: '水曜日', gem: 'エメラルド', dir: '北' },
        { color: '白、銀', number: '2, 7', day: '月曜日', gem: 'パール', dir: '北西' },
        { color: '金、オレンジ', number: '1, 4', day: '日曜日', gem: 'ルビー', dir: '東' },
        { color: '緑、黄緑', number: '5, 3', day: '水曜日', gem: 'エメラルド', dir: '南' },
        { color: '白、パステル', number: '6, 2', day: '金曜日', gem: 'ダイヤモンド', dir: '西' },
        { color: '赤、深紅', number: '9, 1', day: '火曜日', gem: 'サンゴ', dir: '南' },
        { color: '黄、金', number: '3, 9', day: '木曜日', gem: 'イエローサファイア', dir: '北東' },
        { color: '紺、黒', number: '8, 4', day: '土曜日', gem: 'ブルーサファイア', dir: '西' },
        { color: '紺、紫', number: '4, 8', day: '土曜日', gem: 'ブルーサファイア', dir: '西' },
        { color: '黄、金', number: '3, 7', day: '木曜日', gem: 'イエローサファイア', dir: '北東' }
    ];

    const d = luckyData[lagnaSign];
    const html = `<div class="interp-card">
        <div class="interp-text">
            <strong>🎨 ラッキーカラー:</strong> ${d.color}<br>
            <strong>🔢 ラッキーナンバー:</strong> ${d.number}<br>
            <strong>📅 ラッキー曜日:</strong> ${d.day}<br>
            <strong>💎 ラッキージェム:</strong> ${d.gem}<br>
            <strong>🧭 ラッキー方角:</strong> ${d.dir}<br>
            <strong>🪐 ラグナ支配惑星:</strong> ${['火星','金星','水星','月','太陽','水星','金星','火星','木星','土星','土星','木星'][lagnaSign]}
        </div>
    </div>`;
    document.getElementById('luckyWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// 癒し & 強化方法
// ═══════════════════════════════════════════════════
function renderRemedy(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    const DEBI = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };

    const remedies = {
        Sun: { gem: 'ルビー (Ruby)', mantra: 'Om Suryaya Namaha', color: 'オレンジ/赤を日曜日に着用', food: '小麦、サフラン、ひまわりの種', charity: '日曜日に小麦/銅を寄付' },
        Moon: { gem: 'パール (Pearl)', mantra: 'Om Chandraya Namaha', color: '白/銀を月曜日に着用', food: '牛乳、米、ココナッツ', charity: '月曜日に米/牛乳を寄付' },
        Mars: { gem: 'サンゴ (Red Coral)', mantra: 'Om Mangalaya Namaha', color: '赤を火曜日に着用', food: 'レンズ豆、赤い果物', charity: '火曜日に赤いレンズ豆を寄付' },
        Mercury: { gem: 'エメラルド (Emerald)', mantra: 'Om Budhaya Namaha', color: '緑を水曜日に着用', food: '緑豆、緑の野菜', charity: '水曜日に緑の野菜を寄付' },
        Jupiter: { gem: 'イエローサファイア (Yellow Sapphire)', mantra: 'Om Gurave Namaha', color: '黄を木曜日に着用', food: 'ひよこ豆、バナナ、ターメリック', charity: '木曜日に黄色い食べ物/本を寄付' },
        Venus: { gem: 'ダイヤモンド (Diamond)', mantra: 'Om Shukraya Namaha', color: '白/パステルを金曜日に着用', food: '牛乳、クリーム、果物', charity: '金曜日に白い服/米を寄付' },
        Saturn: { gem: 'ブルーサファイア (Blue Sapphire)', mantra: 'Om Shanaishcharaya Namaha', color: '紺/黒を土曜日に着用', food: '黒豆、ゴマ', charity: '土曜日に黒豆/油を寄付' }
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
                <div class="interp-title">${p.symbol} ${p.name} 強化方法 ${isDebi ? '(減衰状態 — 特に重要！)' : '(弱い位置)'}</div>
                <div class="interp-text">
                    <strong>💎 宝石:</strong> ${r.gem} (薬指に着用推奨)<br>
                    <strong>🙏 マントラ:</strong> "${r.mantra}" (108回毎日唱える)<br>
                    <strong>🎨 色:</strong> ${r.color}<br>
                    <strong>🍽️ 食べ物:</strong> ${r.food}<br>
                    <strong>🤝 慈善:</strong> ${r.charity}
                </div>
            </div>`;
        }
    });

    if (!html) {
        html = '<div class="interp-card"><div class="interp-text">すべての惑星が良好な位置にあります！特別な癒しは必要ありません。ラッキージェムはラグナ支配惑星の宝石を着用すると良いでしょう。</div></div>';
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
    const RULER_NAMES = {Sun:'太陽',Moon:'月',Mars:'火星',Mercury:'水星',Jupiter:'木星',Venus:'金星',Saturn:'土星',Rahu:'ラーフ',Ketu:'ケートゥ'};

    const isEasy = window.vedicMode === 'easy';
    let html = '';

    if (division === 10) {
        // D10 해석: 직업/커리어
        const d10_1lord = SIGN_RULERS[dLagnaSign];
        const d10_10sign = (dLagnaSign + 9) % 12;
        const d10_10lord = SIGN_RULERS[d10_10sign];
        const d10_10planets = dPositions.filter(p => p.dSign === d10_10sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💼 職業分析' : '💼 D10 職業分析') + '</div><div class="interp-text">';
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

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👶 子供分析' : '👶 D7 子供分析') + '</div><div class="interp-text">';
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

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨‍👩‍👧 両親分析' : '👨‍👩‍👧 D12 両親分析') + '</div><div class="interp-text">';
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
            {name:'Ghora',nature:'malefic',desc:'破壊と恐怖。前世の暗いカルマ'},
            {name:'Rakshasa',nature:'malefic',desc:'悪魔のエネルギー。強い欲望と執着'},
            {name:'Deva',nature:'benefic',desc:'神聖な存在。前世の功徳と祝福'},
            {name:'Kubera',nature:'benefic',desc:'富の神。富を築くカルマ'},
            {name:'Yaksha',nature:'benefic',desc:'自然の守護者。自然との調和'},
            {name:'Kinnara',nature:'benefic',desc:'天上の音楽家。芸術的才能'},
            {name:'Bhrashta',nature:'malefic',desc:'堕落した者。高所からの転落のカルマ'},
            {name:'Kulaghna',nature:'malefic',desc:'家門の破壊者。家族関連のカルマ'},
            {name:'Garala',nature:'malefic',desc:'毒。毒となる行為のカルマ'},
            {name:'Vahni',nature:'malefic',desc:'火の神。怒りと破壊のカルマ'},
            {name:'Maya',nature:'malefic',desc:'幻想。欺瞞のカルマ'},
            {name:'Purishaka',nature:'malefic',desc:'束縛。他者を拘束したカルマ'},
            {name:'Apampathi',nature:'benefic',desc:'水の主。浄化と治癒'},
            {name:'Marut',nature:'benefic',desc:'風の神。自由と変化'},
            {name:'Kala',nature:'malefic',desc:'時間の神。時間と死のカルマ'},
            {name:'Sarpa',nature:'malefic',desc:'蛇。束縛と執着 — 手放せないカルマ'},
            {name:'Amrita',nature:'benefic',desc:'不死の甘露。永遠の命の追求'},
            {name:'Indu',nature:'benefic',desc:'月。感性と直感'},
            {name:'Mridu',nature:'benefic',desc:'柔らかい者。温和さと慈悲'},
            {name:'Komala',nature:'benefic',desc:'繊細な者。芸術と美'},
            {name:'Heramba',nature:'benefic',desc:'ガネーシャの化身。障害を克服'},
            {name:'Brahma',nature:'benefic',desc:'創造の神。創造と知識'},
            {name:'Vishnu',nature:'benefic',desc:'維持の神。保護と秩序'},
            {name:'Maheshwara',nature:'benefic',desc:'偉大なるシヴァ。変革と解脱'},
            {name:'Deva2',nature:'benefic',desc:'聖人。霊的修行'},
            {name:'Bala',nature:'benefic',desc:'力。強靭さと勇気'},
            {name:'Vishwakarma',nature:'benefic',desc:'宇宙の建築家。建設と創造'},
            {name:'Tamasa',nature:'malefic',desc:'闇。無知のカルマ'},
            {name:'Kanchana',nature:'benefic',desc:'黄金。純粋さと価値'},
            {name:'Varaha',nature:'benefic',desc:'ヴィシュヌの猪の化身。救済'},
            {name:'Ramasala',nature:'benefic',desc:'ラーマの住処。道徳と義務'},
            {name:'Ghrisha',nature:'benefic',desc:'輝く者。知恵と悟り'},
            {name:'Indra',nature:'benefic',desc:'神々の王。指導力'},
            {name:'Jala',nature:'benefic',desc:'水。流れと適応'},
            {name:'Vishwa',nature:'benefic',desc:'宇宙。普遍的な愛'},
            {name:'Amara',nature:'benefic',desc:'不滅。永遠の追求'},
            {name:'Bala2',nature:'malefic',desc:'若い力。未熟な力の使用'},
            {name:'Pitri',nature:'malefic',desc:'祖先。祖先のカルマ'},
            {name:'Rudra',nature:'malefic',desc:'嵐の神。破壊的変革'},
            {name:'Varuna',nature:'benefic',desc:'海の神。宇宙の秩序'},
            {name:'Aryama',nature:'benefic',desc:'太陽の守護神. Friendship and contracts'},
            {name:'Mitra',nature:'benefic',desc:'友情の神。信頼と仲間'},
            {name:'Agni',nature:'malefic',desc:'火の神。浄化の炎'},
            {name:'Varuna2',nature:'benefic',desc:'海の神。深い知恵'},
            {name:'Gauri',nature:'benefic',desc:'パールヴァティー。献身と愛'},
            {name:'Mahakala',nature:'malefic',desc:'偉大な時間。時間を支配しようとしたカルマ'},
            {name:'Pitamaha',nature:'benefic',desc:'偉大な父ブラフマー。創造者'},
            {name:'Kartikeya',nature:'benefic',desc:'戦争の神。正義の戦い'},
            {name:'Yama',nature:'malefic',desc:'死の神。審判と正義'},
            {name:'Kala2',nature:'malefic',desc:'時間。時間に追われるカルマ'},
            {name:'Varuna3',nature:'benefic',desc:'海の神。法と真実'},
            {name:'Kubera2',nature:'benefic',desc:'富の神。寛大さ'},
            {name:'Aditya',nature:'benefic',desc:'太陽神。光と真理'},
            {name:'Rishi',nature:'benefic',desc:'聖者。知恵と修行'},
            {name:'Vasu',nature:'benefic',desc:'天上の存在。自然を治める'},
            {name:'Ashwini',nature:'benefic',desc:'双子の治癒者。治癒'},
            {name:'Naga',nature:'malefic',desc:'蛇の神。神秘と秘密'},
            {name:'Gandharva',nature:'benefic',desc:'天上の音楽家。芸術と音楽'},
            {name:'Prajapati',nature:'benefic',desc:'創造主。生命の創造'},
            {name:'Charachara',nature:'benefic',desc:'万物。全てと一つであったカルマ'}
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
        if (!isEasy) { html += '<div class="interp-card" style="border-left:3px solid #8b7ec8;"><div class="interp-text" style="font-size:13px;color:#888;">';
        html += '📜 <strong>パラシャラ曰く：</strong> "シャシュティアムシャ（D60）は全分割チャートの中で最も重要である。吉神の分割にある惑星は良い結果を、凶神の分割にある惑星は悪い結果をもたらす。"<br>';
        html += '<span style="color:#666;">— ブリハット・パラシャラ・ホーラ・シャーストラ（BPHS）</span></div></div>'; }

        // Ch1: Soul Identity
        const lagnaD = getDeity(lagnaSidereal);
        let ch1 = '<strong>D60 ラグナ： ' + SIGNS[dLagnaSign] + ' ' + SIGN_SYMBOLS[dLagnaSign] + '</strong> (支配星： ' + (RULER_NAMES[d60_1lord]||d60_1lord) + ')' + deityTag(lagnaD) + '<br><br>';
        ch1 += pastLifeThemes[dLagnaSign] + '<br>';
        if (lagnaD.deity) {
            ch1 += '<br>' + (isEasy ?
                (lagnaD.deity.nature === 'benefic' ? '前世で多くの善行を積んだため、今世でも自然と良い機会が訪れます。あなたの存在そのものが守られています。' : '前世から解決していない課題が残っています。性格に影響していますが、乗り越えれば更に大きな成長が待っています。') :
                (lagnaD.deity.nature === 'benefic' ?
                    '<strong>' + lagnaD.deity.name + '</strong> がラグナを守護。 ' + lagnaD.deity.desc + ' — 前世の功徳が今生を守護。自然に良い機会が訪れます。' :
                    '<strong>' + lagnaD.deity.name + '</strong> がラグナに影響。 ' + lagnaD.deity.desc + ' — カルマ的試練が性格に刻まれていますが、克服すれば大きな成長があります。'));
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
            ch2 += '<br>' + (isEasy ?
                (sunD.deity.nature === 'benefic' ? '前世で自分の目的を正しく追求したため、自己実現が自然にできます。自信を持って大丈夫！' : '前世で自分が誰かについて混乱がありました。本当の自分を見つけていく過程が重要な課題です。') :
                (sunD.deity.nature === 'benefic' ?
                    '魂の目的を正しく追求、自己実現が自然に訪れます。' :
                    '前世で自我と権威への試練、真の自己を見つけることが課題。'));
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
            ch3 += '<br>' + (isEasy ?
                (moonD.deity.nature === 'benefic' ? '前世で心が穏やかだったため、感情的に安定していて直感が強いです。感覚を信じて大丈夫。' : '前世の感情的な辛い経験の痕跡が心の奥に残っています。瞑想や水辺での休息が癒しに役立ちます。') :
                (moonD.deity.nature === 'benefic' ?
                    '前世で心が平和、感情的安定と直感が生まれつき。' :
                    '感情的な傷が無意識に残存。瞑想と水辺の休息が助けになります。'));
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
            ch4 += isEasy ?
                (venD.deity && venD.deity.nature === 'benefic' ? '前世で真心を込めて愛したため、美しい愛が待っています。' : '前世で愛に関して解決できなかった課題があります。本当の愛を学ぶ過程が重要です。') :
                (venD.deity && venD.deity.nature === 'benefic' ? '金星が吉神の保護下。美しい愛が待っています。' : '金星が凶神の影響下。真の愛の意味を学ぶことが課題。');
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
            ch5 += isEasy ?
                (satD.deity && satD.deity.nature === 'benefic' ? 'これは非常にまれな祝福です！今世では仕事の大きな試練が軽減されます。' : '仕事に関して前世からの重い課題があります。地道な努力と他人を助けることが鍵です。') :
                (satD.deity && satD.deity.nature === 'benefic' ? 'Saturn under benefic — <strong>非常に稀な祝福！</strong> 忍耐の功徳が職業的試練を減らします。' : '土星が凶神の下 — 重い職業カルマ。忍耐、奉仕、マントラで溶かしましょう。');
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
        if (!isEasy) html += subChapter('🕉️', '守護神一覧', ch7);

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

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💰 財運分析' : '💰 D2 ホーラ — 財運分析') + '</div><div class="interp-text">';
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
            d2H2planets.forEach(p => { html += isEasy ? (wealth[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (wealth[p.id]||'') + '<br>'; });
        } else html += '2室に惑星なし — 2室主の位置が財運の鍵。<br>';
        html += '</div></div>';

    } else if (division === 3) {
        const d3LagnaInterp = ['独立的、兄弟姉妹の中でリーダー。勇敢なコミュニケーション。','安定的で物質的に豊かな兄弟関係。芸術的な兄弟の可能性。','知的でコミュニケーション豊かな兄弟。多くの兄弟か会話が多い。','感情的に深い兄弟の絆。母性的な兄弟。保護的。','カリスマ的で誇り高い兄弟。有名か成功した兄弟。','分析的で実用的な兄弟。医療・教育分野。批判的な面も。','外交的で魅力的な兄弟。兄弟を通じた社交的つながり。','強烈で秘密の多い兄弟関係。対立後の深い絆。','自由で哲学的な兄弟。海外の兄弟。宗教・教育関連。','責任感と野心のある兄弟。義務感。兄弟が少ないか真剣な関係。','ユニークで独立的な兄弟。非伝統的な兄弟関係。','霊的で芸術的な兄弟。海外の兄弟。感情的なつながり。'][dLagnaSign];
        const d3_3sign = (dLagnaSign + 2) % 12;
        const d3_3planets = dPositions.filter(p => p.dSign === d3_3sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👫 兄弟姉妹と勇気' : '👫 D3 ドレッカナ — 兄弟姉妹と勇気') + '</div><div class="interp-text">';
        html += '<strong>D3 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d3LagnaInterp + '<br><br>';
        html += '<strong>D3 3室（弟妹） — ' + SIGNS[d3_3sign] + ':</strong><br>';
        if (d3_3planets.length > 0) {
            const bro = {Sun:'弟妹がリーダーシップと権威を持つ',Moon:'弟妹と感情的に近い',Mars:'活動的で勇敢な弟妹。対立の可能性',Mercury:'知的でコミュニケーション上手な弟妹',Jupiter:'知恵深く幸運をもたらす弟妹',Venus:'魅力的で芸術的な弟妹',Saturn:'弟妹との困難。年齢差がある可能性',Rahu:'ユニークな弟妹か海外との縁',Ketu:'弟妹との距離感。霊的なつながり'};
            d3_3planets.forEach(p => { html += isEasy ? (bro[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (bro[p.id]||'') + '<br>'; });
        } else html += '3室に惑星なし — 3室主の位置を確認。<br>';
        html += '</div></div>';

    } else if (division === 4) {
        const d4LagnaInterp = ['積極的に不動産を取得。新居の建設や購入を好む。','安定した豊富な不動産。土地と農場。贅沢な住居。','複数の家か頻繁な引っ越し。知的な環境を好む。','家と不動産が感情的に重要。水辺。母からの不動産。','壮大で広い家。豪華なインテリア。一等地。','清潔で実用的な住居。健康重視の環境。小さな物件を複数所有。','美しく調和のとれた家。インテリアに興味。パートナーとの不動産。','不動産が変革を経る。相続不動産。秘密の場所。','広い土地と海外不動産。宗教・教育施設の近く。','体系的な不動産投資。古い建物。遅いが確実な資産成長。','ユニークな住居スタイル。モダンなアパート。テクノロジー関連。','水辺の美しい家。海外不動産。霊的な空間。'][dLagnaSign];
        const d4_4sign = (dLagnaSign + 3) % 12;
        const d4_4planets = dPositions.filter(p => p.dSign === d4_4sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '🏠 不動産と幸運' : '🏠 D4 チャトゥルタムシャ — 不動産と幸運') + '</div><div class="interp-text">';
        html += '<strong>D4 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d4LagnaInterp + '<br><br>';
        html += '<strong>D4 4室（不動産） — ' + SIGNS[d4_4sign] + ':</strong><br>';
        if (d4_4planets.length > 0) {
            const prop = {Sun:'政府所有の建物か威厳ある住居',Moon:'美しい家。水辺。母の影響',Mars:'新築。不動産紛争の可能性',Mercury:'商業不動産。複数所有',Jupiter:'広くて豊かな家！最高の不動産運',Venus:'豪華な家。美しいインテリア',Saturn:'古い家。修繕必要。中年以降安定',Rahu:'海外不動産。非伝統的な住居',Ketu:'不動産に無関心。霊的空間を好む'};
            d4_4planets.forEach(p => { html += isEasy ? (prop[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (prop[p.id]||'') + '<br>'; });
        } else html += '4室に惑星なし — 4室主の位置が不動産の鍵。<br>';
        html += '</div></div>';

    } else if (division === 24) {
        const d24LagnaInterp = ['体育、軍事、リーダーシップ教育。','音楽、芸術、料理、金融教育。','言語、文学、コミュニケーション、メディア教育。','歴史、心理学、家政学教育。','政治学、演劇、経営学教育。','医学、科学、統計学教育。精密な学習。','法学、外交、デザイン教育。','心理学、研究、調査、オカルト教育。','哲学、神学、国際学。留学の可能性。','経営、行政、建築。体系的学習。','IT、工学、航空、社会科学。革新的学習。','芸術、音楽、霊性、映画学。直感的学習。'][dLagnaSign];
        const d24_4sign = (dLagnaSign + 3) % 12;
        const d24_5sign = (dLagnaSign + 4) % 12;
        const d24_4planets = dPositions.filter(p => p.dSign === d24_4sign);
        const jupD24 = dPositions.find(p => p.id === 'Jupiter');
        const merD24 = dPositions.find(p => p.id === 'Mercury');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '📚 教育' : '📚 D24 チャトゥルヴィムシャムシャ — 教育') + '</div><div class="interp-text">';
        html += '<strong>D24 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d24LagnaInterp + '<br><br>';
        html += '<strong>D24 4室（基礎教育） — ' + SIGNS[d24_4sign] + ':</strong><br>';
        if (d24_4planets.length > 0) {
            const edu4 = {Sun:'名門校。権威ある教育',Moon:'快適な学習環境。家庭教育の影響大',Mars:'競争的学習。体育/技術に強い',Mercury:'最高の配置！優れた学業能力',Jupiter:'豊かな教育環境。良い教師',Venus:'芸術教育。美しい学校',Saturn:'困難な教育だが克服すれば深い学識',Rahu:'非伝統的教育。外国の学校',Ketu:'正規教育への関心薄い。直感的学習'};
            d24_4planets.forEach(p => { html += isEasy ? (edu4[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (edu4[p.id]||'') + '<br>'; });
        } else html += '4室に惑星なし。<br>';
        if (jupD24) { const jH = ((jupD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>♃ 木星（知恵） → ' + jH + '室：</strong> ' + ([1,4,5,9].includes(jH) ? '🎓 <strong>高い学業成就が期待されます！</strong> 大学院・博士・留学の可能性。' : '学びを通じた成長。木星の祝福が' + jH + '.') + '<br>'; }
        if (merD24) { const mH = ((merD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<strong>☿ 水星（学習） → ' + mH + '室：</strong> ' + ([1,4,5,9].includes(mH) ? '📖 <strong>優れた知的能力！</strong> 数学、言語、分析に才能。' : '知的能力が発揮される室：' + mH + '.') + '<br>'; }
        html += '</div></div>';

    } else if (division === 30) {
        const d30LagnaInterp = ['事故、火傷、頭痛。性急な決定からの問題。怒りの管理。','経済的損失、食事問題、甲状腺。過食と執着に注意。','神経不安、不眠、呼吸問題。過度の心配を避ける。','感情的不安定、胃の問題、水関連の問題。感情制御。','心臓問題、自尊心の損傷、過労。謙虚さと休息が必要。','消化障害、アレルギー、完璧主義のストレス。リラックスが必要。','腎臓問題、関係の葛藤、優柔不断。決断力が必要。','秘密、事故、手術、性的問題。定期検診が重要。','肝臓問題、過体重、ギャンブル/浪費。節制が必要。','関節、骨、うつ、孤独。カルシウムと社交が必要。','血圧、循環、予期しない事故。定期健康診断。','免疫低下、依存症、メンタルヘルス。瞑想と睡眠が必要。'][dLagnaSign];
        const d30_6sign = (dLagnaSign + 5) % 12;
        const d30_8sign = (dLagnaSign + 7) % 12;
        const d30_12sign = (dLagnaSign + 11) % 12;
        const d30_6planets = dPositions.filter(p => p.dSign === d30_6sign);
        const d30_8planets = dPositions.filter(p => p.dSign === d30_8sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '⚠️ 不運と疾病' : '⚠️ D30 トリムシャムシャ — 不運と疾病') + '</div><div class="interp-text">';
        html += '<strong>D30 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d30LagnaInterp + '<br><br>';
        const diseaseBySign = ['頭、脳、発熱、炎症','首、甲状腺、糖尿病','肺、神経、不安','胃、水分貯留','心臓、背中、血圧','消化器、腸、皮膚','腎臓、腰、泌尿器','生殖器、慢性疾患','肝臓、太もも、過体重','骨、関節、リウマチ','循環、血圧、足首','免疫、足、メンタルヘルス'];
        html += '<strong>D30 6室（疾病） — ' + SIGNS[d30_6sign] + ':</strong><br>';
        html += '注意すべき点： <strong>' + diseaseBySign[d30_6sign] + '</strong><br>';
        if (d30_6planets.length > 0) {
            const dis = {Sun:'目、心臓関連の疾患',Moon:'メンタルヘルス、水関連の問題',Mars:'事故、手術、火傷',Mercury:'神経系、皮膚問題',Jupiter:'肝臓、過体重',Venus:'腎臓、糖尿病、性病',Saturn:'慢性疾患、関節問題',Rahu:'原因不明の疾患、依存症',Ketu:'免疫低下、アレルギー'};
            d30_6planets.forEach(p => { html += isEasy ? (dis[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (dis[p.id]||'') + '<br>'; });
        }
        html += '<br><strong>D30 8室（危険） — ' + SIGNS[d30_8sign] + ':</strong><br>';
        if (d30_8planets.length > 0) {
            d30_8planets.forEach(p => { html += isEasy ? (p.natural === 'malefic' ? '危険・事故注意。保険と定期検診が重要。' : '危機から保護されます。') + '<br>' : '• ' + p.name + ': ' + (p.natural === 'malefic' ? '危険・事故注意。保険と定期検診が重要。' : '危機から保護されます。') + '<br>'; });
        } else html += '8室に惑星なし — 危険リスク低い。<br>';
        html += '</div></div>';

    } else if (division === 40) {
        const d40LagnaInterp = ['独立的で意志の強い母。母系からリーダーシップを受け継ぐ。','母が財を上手に管理。母系から物質的豊かさ。','知的でコミュニケーション上手な母。言語/教育の才能を受け継ぐ。','母との非常に深い絆。感受性と直感を受け継ぐ。','権威と尊厳のある母。リーダーシップと名誉を受け継ぐ。','母が健康管理に優れる。分析力/奉仕精神を受け継ぐ。','魅力的で外交的な母。芸術的感覚を受け継ぐ。','変革を経た強い母。回復力を受け継ぐ。','教育的で宗教的な母。知恵/哲学を受け継ぐ。','責任感のある厳格な母。忍耐と規律を受け継ぐ。','ユニークで進歩的な母。革新的思考を受け継ぐ。','霊的で直感的な母。芸術/霊性を受け継ぐ。'][dLagnaSign];
        const moonD40 = dPositions.find(p => p.id === 'Moon');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👩 母系の遺産' : '👩 D40 カヴェダムシャ — 母系の遺産') + '</div><div class="interp-text">';
        html += '<strong>D40 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d40LagnaInterp + '<br>';
        if (moonD40) { const mH = ((moonD40.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☽ 月（母のカラカ） → ' + mH + '室：</strong> ' + ['','母が自分に強い影響','母からの財産','母とのコミュニケーション良好','母との深い絆！最高の配置','創造的な母','奉仕的な母','母が人間関係に影響','母からの遺産','宗教的・教育的な母','社会的に成功した母','独立的な母','霊的な母'][mH] + '<br>'; }
        html += '</div></div>';

    } else if (division === 45) {
        const d45LagnaInterp = ['活動的で行動指向の父。勇気とリーダーシップを受け継ぐ。','経済的に安定した父。物質的価値観を受け継ぐ。','知的で多才な父。コミュニケーション/ビジネス能力を受け継ぐ。','感情的で家庭的な父。世話の本能を受け継ぐ。','権威があり尊敬される父。リーダーシップを受け継ぐ。','実用的で勤勉な父。分析力/技術力を受け継ぐ。','外交的で洗練された父。社交能力を受け継ぐ。','強くて神秘的な父。回復力/洞察力を受け継ぐ。','学問的で宗教的な父。哲学/道徳を受け継ぐ。','厳格で野心のある父。忍耐/規律を受け継ぐ。','創造的で革新的な父。技術/科学的思考を受け継ぐ。','霊的で芸術的な父。直感/創造性を受け継ぐ。'][dLagnaSign];
        const sunD45 = dPositions.find(p => p.id === 'Sun');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨 父系の遺産' : '👨 D45 アクシャヴェダムシャ — 父系の遺産') + '</div><div class="interp-text">';
        html += '<strong>D45 ラグナ： ' + SIGNS[dLagnaSign] + '</strong><br>' + d45LagnaInterp + '<br>';
        if (sunD45) { const sH = ((sunD45.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☉ 太陽（父のカラカ） → ' + sH + '室：</strong> ' + ['','父が自分に強い影響','父からの財産','父とのコミュニケーション良好','家庭的な父','創造的な父','奉仕的な父','父が人間関係に影響','父からの遺産','宗教的・教育的な父','社会的に成功した父！最高の配置','独立的な父','霊的な父'][sH] + '<br>'; }
        html += '</div></div>';
    }

    interpEl.innerHTML = html;
}


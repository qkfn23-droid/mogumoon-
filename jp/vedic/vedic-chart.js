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

// ── フォーム初期化 ──
function initForm() {
    const yearSel = document.getElementById('birthYear');
    const monthSel = document.getElementById('birthMonth');
    const daySel = document.getElementById('birthDay');
    const hourSel = document.getElementById('birthHour');
    const minSel = document.getElementById('birthMinute');

    // 年: 1940~2025
    for (let y = 2025; y >= 1940; y--) {
        const opt = document.createElement('option');
        opt.value = y; opt.textContent = y + '年';
        if (y === 1995) opt.selected = true;
        yearSel.appendChild(opt);
    }
    // 月: 1~12
    for (let m = 1; m <= 12; m++) {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = m + '月';
        if (m === 3) opt.selected = true;
        monthSel.appendChild(opt);
    }
    // 日: 1~31
    for (let d = 1; d <= 31; d++) {
        const opt = document.createElement('option');
        opt.value = d; opt.textContent = d + '日';
        if (d === 15) opt.selected = true;
        daySel.appendChild(opt);
    }
    // 時: 12, 1~11
    [12,1,2,3,4,5,6,7,8,9,10,11].forEach(h => {
        const opt = document.createElement('option');
        opt.value = h; opt.textContent = h + '時';
        if (h === 10) opt.selected = true;
        hourSel.appendChild(opt);
    });
    // 分: 00, 01, 02, ... 59 (1min)
    for (let m = 0; m < 60; m += 1) {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = String(m).padStart(2,'0') + '分';
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
        hour = 12; minute = 0; // 正午デフォルト
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
            lat: parseFloat(document.getElementById('birthLat').value) || 35.68,
            lng: parseFloat(document.getElementById('birthLng').value) || 139.69
        };
    }
    const parts = sel.value.split(',').map(Number);
    return { lat: parts[0], lng: parts[1], tz: parts[2] || 0 };
}

// ページ読み込み時にフォーム初期化
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

    // Ascendant (ラグナ) - proper calculation with latitude
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
    html += '<th>惑星</th><th>星座</th><th>度数</th><th>ナクシャトラ</th><th>ハウス</th>';
    html += '</tr></thead><tbody>';

    // Add ラグナ first
    const lagnaDeg = lagnaSidereal % 30;
    const lagnaNakIdx = Math.floor(lagnaSidereal / (360/27));
    const lagnaNak = NAKSHATRAS[lagnaNakIdx] || {ko:'-'};
    html += `<tr><td>⬆ ASC</td><td>${SIGN_SYMBOLS[lagnaSign]} ${SIGNS[lagnaSign]}</td><td>${lagnaDeg.toFixed(1)}°</td><td>${lagnaNak.ko}</td><td>1</td></tr>`;

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
                cell.innerHTML = row === 1 && col === 1 ? '<div style="color:#c9a84c;font-size:10px;">D1<br>ラーシ</div>' : '';
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
                    const cls = (p.natural === 'malefic') ? 'planet凶' : 'planet吉';
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
        <div class="interp-title">🕉️ D9 ラグナ — 結婚後のあなた: ${SIGNS[d9LagnaSign]} ${SIGN_SYMBOLS[d9LagnaSign]}</div>
        <div class="interp-text">
            ナヴァムシャ・ラグナは<strong>${SIGNS[d9LagnaSign]}</strong>。これは結婚後、そして人生後半（30代以降）に現れるあなたの本当の姿です。
            ${d9LagnaSign === d1LagnaSign ? '<br><br><strong>D1とD9のラグナが同じ星座にあります！</strong> これは<strong>バルゴッタマ(Vargottama)</strong> — 非常に強力です。結婚後もあなたの本質は変わらず、内面と外面が一致しています。' : ''}
            ${d9H1Planets.length > 0 ? '<br><br><strong>D9 1宮の惑星:</strong> ' + d9H1Planets.map(p => p.symbol + ' ' + p.name).join(', ') + ' — これらの惑星が結婚後のあなたの性格に強く影響を与えます。' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">💍 D9 7宮 — 配偶者の性格: ${SIGNS[d9H7Sign]} ${SIGN_SYMBOLS[d9H7Sign]}</div>
        <div class="interp-text">
            ナヴァムシャ7宮は<strong>${SIGNS[d9H7Sign]}</strong>、支配星は<strong>${RULER_NAMES[d9H7Ruler]}</strong>。<br><br>
            これは配偶者の核心的な性格を表します — ${SIGNS[d9H7Sign]}のエネルギーを持つパートナー。
            ${d9H7Planets.length > 0 ? '<br><br><strong>D9 7宮の惑星:</strong><br>' + d9H7Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${p.natural === 'benefic' ? '吉星！配偶者から良いエネルギーを受けます。' : '凶星 — 結婚生活での挑戦がありますが、成長の機会でもあります。'}`).join('<br>') : '<br><br>7宮に惑星がありません — 7宮の支配星の位置がより重要です。'}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">💼 D9 10宮 — 人生の使命(ダルマ): ${SIGNS[d9H10Sign]} ${SIGN_SYMBOLS[d9H10Sign]}</div>
        <div class="interp-text">
            ナヴァムシャ10宮は<strong>${SIGNS[d9H10Sign]}</strong>、支配星は<strong>${RULER_NAMES[d9H10Ruler]}</strong>。<br><br>
            D1の10宮が「職業」を示すなら、D9の10宮は<strong>人生のより大きな使命(ダルマ)</strong> — 成熟した後に追求する真の天職。<br><br>
            <strong>使命の方向：</strong> ${careerBySgn[d9H10Sign]}
            ${d9H10Planets.length > 0 ? '<br><br><strong>D9 10宮の惑星:</strong><br>' + d9H10Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${planetCareer[p.id] || '独自のキャリアエネルギー'}`).join('<br>') : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">👔 配偶者の職業 — 派生10宮(D9 4宮): ${SIGNS[d9H4Sign]} ${SIGN_SYMBOLS[d9H4Sign]}</div>
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
        <div class="interp-title">🧭 配偶者の方向 — 6指標分析</div>
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
        <div class="interp-title">🤝 配偶者との出会いの場 — D1 7宮: ${SIGNS[d1H7ForMeeting]} ${SIGN_SYMBOLS[d1H7ForMeeting]}</div>
        <div class="interp-text">
            7宮の星座が配偶者との出会いの環境と状況を表します。<br><br>
            <strong>${meetingBySgn[d1H7ForMeeting]}</strong>
            ${d1H7ForMeeting === 8 || d1H7ForMeeting === 11 ? '<br><br>💡 <strong>海外の配偶者の可能性！</strong> 9宮（海外）または12宮（海外居住）に関連する星座が7宮にあり、配偶者が外国人または海外での出会いが示唆されます。' : ''}
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">🏛️ 配偶者の家庭/背景 — UL: ${SIGNS[ulSign]} ${SIGN_SYMBOLS[ulSign]}</div>
        <div class="interp-text">
            ウパパダ・ラグナ(UL)は配偶者の家庭環境と育ちを表します。<br><br>
            <strong>${backgroundBySgn[ulSign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">👤 配偶者の第一印象 — A7: ${SIGNS[a7Sign]} ${SIGN_SYMBOLS[a7Sign]}</div>
        <div class="interp-text">
            ダラパダ(A7)は配偶者が世界に見せる外的イメージと第一印象を表します。<br><br>
            <strong>${imageBySgn[a7Sign]}</strong>
        </div>
    </div>`;

    html += `<div class="interp-card">
        <div class="interp-title">💎 配偶者の魅力ポイント — D9 金星: ${SIGNS[venusD9Sign]} ${SIGN_SYMBOLS[venusD9Sign]}</div>
        <div class="interp-text">
            ナヴァムシャの金星の位置は配偶者の核心的な魅力と愛のスタイルを表します。<br><br>
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
            <div class="nakshatra-name">${nak.ko} (${nak.name})</div>
            <div class="nakshatra-meaning">"${nak.meaning}" — 支配惑星: ${DASHA_KO[nak.ruler] || nak.ruler}</div>
            <div class="nakshatra-detail">
                神格: ${nak.deity}<br><br>
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

    let html = '<div class="interp-card" style="margin-bottom:12px;border-left:3px solid #c9a84c;"><div class="interp-text" style="font-size:12px;color:#888;">\xf0\x9f\x92\xa1 <strong>Vimshottari Dasha</strong> \xe2\x80\x94 Life is divided into periods ruled by 9 planets. <strong>Mahadasha</strong> is the major period, <strong>Antardasha (Bhukti)</strong> is the sub-period within it. Calculated from the Moon nakshatra position.<br><br>';
    html += '\xf0\x9f\x8c\x99 Birth Moon: <strong>' + nak.ko + ' (' + nak.name + ')</strong> \xe2\x80\x94 First Dasha: <strong>' + DASHA_KO[startRuler] + '</strong> (remaining: ' + remainingYears.toFixed(2) + ' yrs)</div></div>';

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
        html += '<span class="dasha-years">' + (p.actualDays / 365.25).toFixed(1) + ' yrs</span>';
        if (isCurrent) html += '<span class="dasha-badge">Current</span>';
        html += '<span style="font-size:10px;color:#666;margin-left:4px;">(age ' + age + ') \xe2\x96\xbc</span>';

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
    // Helper: get house number from sign
    function houseOf(signIdx) { return ((signIdx - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    let html = '';

    // ═══════════════════════════════════
    // 1. 性格 & 外見 (1宮 ラグナ)
    // ═══════════════════════════════════
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
        <div class="interp-title">👤 性格 & 外見 — ラグナ: ${SIGNS[lagnaSign]} ${SIGN_SYMBOLS[lagnaSign]}</div>
        <div class="interp-text">${lagnaInterp[lagnaSign]}</div>
    </div>`;

    // ═══════════════════════════════════
    // 2. 内面 & 感情 (月の星座)
    // ═══════════════════════════════════
    if (moonPos) {
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
            <div class="interp-title">🌙 内面 & 感情 — 月: ${SIGNS[moonPos.sign]} ${SIGN_SYMBOLS[moonPos.sign]}</div>
            <div class="interp-text">${moonInterp[moonPos.sign]}</div>
        </div>`;
    }

    // ═══════════════════════════════════
    // 3. 💰 財運 (2宮, 11宮 分析)
    // ═══════════════════════════════════
    const h2planets = planetsInHouse(2);
    const h11planets = planetsInHouse(11);
    const h2sign = (lagnaSign + 1) % 12;
    const h11sign = (lagnaSign + 10) % 12;

    let wealthText = `<strong>2宮 (蓄積された財産):</strong> ${SIGNS[h2sign]}に位置。`;
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
            wealthText += `${p.symbol} ${p.name}: ${pWealth[p.id] || ''} `;
        });
    }

    wealthText += `<br><br><strong>11宮 (収入と利益):</strong> ${SIGNS[h11sign]}に位置。`;
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
            wealthText += `${p.symbol} ${p.name}: ${pIncome[p.id] || ''} `;
        });
    }

    html += `<div class="interp-card">
        <div class="interp-title">💰 財運</div>
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
        spouseText += '<br><br><strong>7宮の惑星:</strong> ';
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
            spouseText += `<br>${p.symbol} ${p.name}: ${pH7[p.id] || ''}`;
        });
    }

    if (venus) {
        const venusHouse = houseOf(venus.sign);
        spouseText += `<br><br><strong>金星の位置 (${venusHouse}宮):</strong> `;
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
        <div class="interp-title">💕 配偶者 & 結婚運 — 7宮: ${SIGNS[h7sign]} ${SIGN_SYMBOLS[h7sign]}</div>
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

    let careerText = `10宮は${SIGNS[h10sign]}に位置。${careerSign[h10sign]}`;

    if (h10planets.length > 0) {
        careerText += '<br><br><strong>10宮の惑星:</strong>';
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
            careerText += `<br>${p.symbol} ${p.name}: ${pCareer[p.id] || ''}`;
        });
    }

    html += `<div class="interp-card">
        <div class="interp-title">💼 職業 & 社会的達成 — 10宮: ${SIGNS[h10sign]} ${SIGN_SYMBOLS[h10sign]}</div>
        <div class="interp-text">${careerText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 6. 🏥 健康 (6宮 + ラグナ 分析)
    // ═══════════════════════════════════
    const h6sign = (lagnaSign + 5) % 12;
    const h6planets = planetsInHouse(6);

    const healthByラグナ = [
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
        <div class="interp-title">🏥 健康 — 弱い部位</div>
        <div class="interp-text">${healthByラグナ[lagnaSign]}${h6planets.length > 0 ? '<br><br>6宮に' + h6planets.map(p => p.name).join('、') + 'が位置しており、健康管理に特別な注意が必要です。' : ''}</div>
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
    function houseOf(signIdx) { return ((signIdx - lagnaSign + 12) % 12) + 1; }
    let html = '';

    positions.forEach(p => {
        if (!PLANET_IN_HOUSE[p.id]) return;
        const house = houseOf(p.sign);
        const desc = PLANET_IN_HOUSE[p.id][house - 1];
        if (!desc) return;

        html += `<div class="interp-card">
            <div class="interp-title">${p.symbol} ${p.name} → ${house}宮 (${SIGNS[p.sign]})</div>
            <div class="interp-text">${desc}</div>
        </div>`;
    });

    document.getElementById('planetHouseWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// 教育 & 知識
// ═══════════════════════════════════════════════════
function renderEducation(positions, lagnaSign) {
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
            text += `${p.name}: ${h5p[p.id] || '学業に影響'}。`;
        });
    }

    document.getElementById('educationWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// 子供運
// ═══════════════════════════════════════════════════
function renderChildren(positions, lagnaSign) {
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
            text += `${p.symbol} ${p.name}: ${ch[p.id] || ''}<br>`;
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
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    const h9 = planetsInHouse(9);
    const h12 = planetsInHouse(12);
    const rahu = positions.find(p => p.id === 'Rahu');

    let text = '<strong>9宮 (海外旅行・幸運・高等教育):</strong><br>';
    if (h9.length === 0) {
        text += '9宮に惑星がなく、海外旅行はありますが特別に強い縁ではありません。';
    } else {
        h9.forEach(p => {
            const f9 = { Sun: '父親が海外関連。政府/公務の海外出張。', Moon: '海外旅行を感情的に楽しむ。海外での大衆人気。', Mars: '海外での冒険/挑戦。軍事/技術関連の海外活動。', Mercury: '海外留学/ビジネスの成功！多言語能力。', Jupiter: '海外で大きな幸運！留学/移民の成功。海外で師匠に出会う。', Venus: '海外でのロマンス。芸術/ファッション関連の海外活動。', Saturn: '海外での苦労の後に成功。長期海外滞在。', Rahu: '海外移住の強力な指標！外国文化に深くはまる。', Ketu: '前世からの海外の縁。霊的巡礼。' };
            text += `${p.symbol} ${p.name}: ${f9[p.id] || ''}<br>`;
        });
    }

    text += '<br><strong>12宮 (海外定住・移民・支出):</strong><br>';
    if (h12.length === 0) {
        text += '12宮に惑星がなく、海外定住よりは国内居住が自然です。';
    } else {
        h12.forEach(p => {
            const f12 = { Sun: '海外でのアイデンティティ探し。政府関連の海外派遣。', Moon: '海外居住の可能性が高い！海外で感情的安定。', Mars: '海外でのエネルギー消耗。海外投資/不動産。', Mercury: '海外ビジネス/IT関連活動。海外教育。', Jupiter: '海外での霊的成長。慈善活動。海外の大学。', Venus: '海外での贅沢と快楽。海外の芸術活動。', Saturn: '海外での厳しい労働。しかし長期的な定住。', Rahu: '海外移民の確定的指標！西洋文化への適応。', Ketu: '海外での霊的修行。孤独な海外生活。' };
            text += `${p.symbol} ${p.name}: ${f12[p.id] || ''}<br>`;
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
            simpleDesc = `<strong>${p.name}が弱い状態。</strong>「${role}」のエネルギーが弱まった状態で<strong>${house}宮(${area})</strong>の領域にあります。この分野で困難を感じるかもしれませんが、意識的な努力で克服すればむしろ大きな成長の機会になります。下記の癒し法を参考にしてください。`;
        } else if (OWN[p.id] && OWN[p.id].includes(p.sign)) {
            dignity = '本宮 (Own Sign)';
            emoji = '🟡';
            color = '#c9a84c';
            simpleDesc = `<strong>${p.name}が自分の家に！</strong>「${role}」のエネルギーが安定的に<strong>${house}宮(${area})</strong>の領域で力を発揮します。自然と良い結果を生み出します。`;
        } else {
            dignity = '中立';
            emoji = '⚪';
            color = '#999';
            simpleDesc = `${p.name}の「${role}」のエネルギーが<strong>${house}宮(${area})</strong>の領域で普通の影響力を発揮します。他の惑星との関係によって結果が異なります。`;
        }

        html += `<div class="interp-card">
            <div class="interp-title">${emoji} ${p.symbol} ${p.name} — ${SIGNS[p.sign]} ${SIGN_SYMBOLS[p.sign]} → ${house}宮(${area}) — <span style="color:${color}">${dignity}</span></div>
            <div class="interp-text">
                <span style="color:#666;font-size:12px;">担当: ${role} │ 位置: ${house}宮 = ${area}</span><br><br>
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
        // D7 (サプタムシャ): 홀수 사인은 같은 사인부터, 짝수 사인은 7번째 사인부터
        const startSign = (sign % 2 === 0) ? sign : (sign + 6) % 12;
        return (startSign + part) % 12;
    } else if (division === 10) {
        // D10 (ダシャムシャ): 홀수 사인은 같은 사인부터, 짝수 사인은 9번째 사인부터
        const startSign = (sign % 2 === 0) ? sign : (sign + 8) % 12;
        return (startSign + part) % 12;
    } else if (division === 12) {
        // D12 (드와ダシャムシャ): 같은 사인부터 시작
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
                    const cls = (p.natural === 'malefic') ? 'planet凶' : 'planet吉';
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

    let html = '';

    if (division === 10) {
        // D10 해석: 직업/커리어
        const d10_1lord = SIGN_RULERS[dLagnaSign];
        const d10_10sign = (dLagnaSign + 9) % 12;
        const d10_10lord = SIGN_RULERS[d10_10sign];
        const d10_10planets = dPositions.filter(p => p.dSign === d10_10sign);

        html += '<div class="interp-card"><div class="interp-title">💼 D10 職業分析</div><div class="interp-text">';
        html += '<strong>D10ラグナ：</strong> ' + SIGNS[dLagnaSign] + ' (支配星：' + (RULER_NAMES[d10_1lord]||d10_1lord) + ')<br>';
        html += '<strong>D10 10宮（職業）：</strong> ' + SIGNS[d10_10sign] + ' (支配星：' + (RULER_NAMES[d10_10lord]||d10_10lord) + ')<br>';
        if (d10_10planets.length > 0) {
            html += '<strong>10宮の惑星：</strong> ' + d10_10planets.map(p => p.name).join(', ') + '<br>';
        }

        // 직업 성향 by D10 라그나
        const careerBySign = [
            'リーダーシップ、軍事、スポーツ、起業家',  // 양자리
            '金融、芸術、不動産、飲食業',     // 황소
            'コミュニケーション、メディア、教育、IT',  // 쌍둥이
            '看護、不動産、ホテル、心理カウンセリング',    // 게
            '政治、芸能、管理職、行政',        // 사자
            '医療、会計、分析、研究',          // 처녀
            '法律、外交、デザイン、コンサルティング',      // 천칭
            '捜査、研究、医学、保険',          // 전갈
            '教育、宗教、貿易、出版',      // 사수
            '行政、建設、鉱業、公務員',        // 염소
            'IT、革新、NGO、航空',           // 물병
            '芸術、病院、海外、スピリチュアル'           // 물고기
        ];
        html += '<strong>適合分野：</strong> ' + careerBySign[dLagnaSign];
        html += '</div></div>';

    } else if (division === 7) {
        // D7 해석: 자녀
        const d7_5sign = (dLagnaSign + 4) % 12;
        const d7_5lord = SIGN_RULERS[d7_5sign];
        const d7_5planets = dPositions.filter(p => p.dSign === d7_5sign);
        const吉s = d7_5planets.filter(p => p.natural === 'benefic');
        const凶s = d7_5planets.filter(p => p.natural === 'malefic');

        html += '<div class="interp-card"><div class="interp-title">👶 D7 子女分析</div><div class="interp-text">';
        html += '<strong>D7ラグナ：</strong> ' + SIGNS[dLagnaSign] + '<br>';
        html += '<strong>D7 5宮（子女）：</strong> ' + SIGNS[d7_5sign] + ' (支配星：' + (RULER_NAMES[d7_5lord]||d7_5lord) + ')<br>';
        if (d7_5planets.length > 0) {
            html += '<strong>5宮の惑星：</strong> ' + d7_5planets.map(p => p.name).join(', ') + '<br>';
        }
        if (benefics.length > 0) html += '吉星が5宮にあり子女に恵まれます。<br>';
        if (malefics.length > 0) html += '凶星が5宮にあり子女関連の困難がある可能性。<br>';
        if (d7_5planets.length === 0) html += '5宮に惑星がなく5宮主の位置を見る必要があります。';
        html += '</div></div>';

    } else if (division === 12) {
        // D12 해석: 부모
        const d12_4sign = (dLagnaSign + 3) % 12; // 4궁 = 어머니
        const d12_9sign = (dLagnaSign + 8) % 12; // 9궁 = 아버지
        const d12_4planets = dPositions.filter(p => p.dSign === d12_4sign);
        const d12_9planets = dPositions.filter(p => p.dSign === d12_9sign);

        html += '<div class="interp-card"><div class="interp-title">👨‍👩‍👧 D12 両親分析</div><div class="interp-text">';
        html += '<strong>D12ラグナ：</strong> ' + SIGNS[dLagnaSign] + '<br>';
        html += '<strong>D12 4宮（母）：</strong> ' + SIGNS[d12_4sign];
        if (d12_4planets.length > 0) html += ' — ' + d12_4planets.map(p => p.name).join(', ');
        html += '<br>';
        html += '<strong>D12 9宮（父）：</strong> ' + SIGNS[d12_9sign];
        if (d12_9planets.length > 0) html += ' — ' + d12_9planets.map(p => p.name).join(', ');
        html += '<br>';

        const moon4 = d12_4planets.find(p => p.id === 'Moon');
        const sun9 = d12_9planets.find(p => p.id === 'Sun');
        if (moon4) html += '月が4宮にあり母との縁が深い。<br>';
        if (sun9) html += '太陽が9宮にあり父との縁が深い。<br>';
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

        const houseThemes = ['','Self/Being','Wealth/Values','Communication','Home/Peace','Creation/Love','Service/Trials','Relationships','Transformation','Wisdom/Religion','Career/Society','Wishes/Gains','Liberation'];

        const pastLifeThemes = [
            'Warrior, Leader — Wielded power, natural leadership and decisiveness imprinted on the soul.',
            'Artist, Farmer — Worked with nature, deep instinct for stability and material beauty.',
            'Scholar, Merchant — Lived by knowledge, versatility and curiosity remain. Natural talent for language.',
            'Protector, Nurturer — Cared for others, deep sensitivity and maternal instinct. Strong home karma.',
            'Royalty, Priest — Held high status, natural authority and dignity. Standing on stage is soul instinct.',
            'Healer, Server — Practiced medicine or service, excellent analytical skills. Helping others is soul duty.',
            'Diplomat, Artist — Pursued harmony and beauty, skilled in relationships. Partnership is core theme.',
            'Practitioner, Alchemist — Underwent deep transformation, strong attraction to secrets and mystery.',
            'Sage, Explorer — Sought truth, spiritual wisdom and adventurousness remain. Higher learning karma.',
            'Official, Architect — Built order, strong patience and responsibility. Discipline imprinted on soul.',
            'Official, Guardian — Built social order, organizational spirit. Saturn-ruled, duty imprinted on soul.',
            'Medium, Artist — Communed with spiritual world, extremely strong intuition. Closest to liberation.'
        ];

        const d60SunInterp = [
            'Lived as warrior or king, strong ego and leadership remain. Soul purpose to establish authority.',
            'Lived as artist or wealthy person, soul pursues material abundance. Drawn to sensory beauty.',
            'Lived as scholar or merchant, knowledge and communication are core soul themes.',
            'Lived as protector or nurturer, caring for others is a deep soul instinct.',
            'Held high status as royalty or priest, natural authority remains in this life.',
            'Lived as healer or server, analysis and service are the soul purpose.',
            'Pursued harmony as diplomat or artist, relationships and balance are the soul task.',
            'Underwent deep transformation as practitioner, secrets imprinted on the soul.',
            'Sought truth as sage or explorer, wisdom and adventure are the soul direction.',
            'Built order as official, systems and responsibility engraved on the soul.',
            'Was ahead of times as innovator, original thinking is a soul trait.',
            'Communed with spiritual world, deep intuition remains in the soul.'
        ];
        const d60MoonInterp = [
            'Intensely fiery emotional memory. Anger and passion imprinted, mastering emotions is the task.',
            'Warm, stable emotional memory. Memories of abundance remain, seeking beautiful things.',
            'Intellectual, colorful emotional memory. Many experiences, strong curiosity.',
            'Very deep emotional memory. Strong home and care memories, rich sensitivity.',
            'Pride and dignity fill emotional memory. Memories of recognition and respect remain.',
            'Service and analysis in emotional memory. Helping memories remain, caring heart.',
            'Harmony and relationships in emotional memory. Beautiful relationship memories, seeking partner.',
            'Deep, intense emotional memory. Dramatic change memories, emotional depth like ocean.',
            'Freedom and exploration in emotional memory. Travel and learning memories, pursuing expansion.',
            'Responsibility and patience in emotional memory. Heavy burden memories, mature emotions.',
            'Unique, extraordinary emotional memory. Being different memories, independent sensibility.',
            'Spiritual, transcendent emotional memory. Vivid dreams, deep spiritual connection.'
        ];

        // Parashara quote
        html += '<div class="interp-card" style="border-left:3px solid #8b7ec8;"><div class="interp-text" style="font-size:13px;color:#888;">';
        html += '📜 <strong>パラシャラ曰く：</strong> "シャシュティアムシャ（D60）は全分割チャートの中で最も重要である。吉神の分割にある惑星は良い結果を、凶神の分割にある惑星は悪い結果をもたらす。"<br>';
        html += '<span style="color:#666;">— ブリハット・パラシャラ・ホーラ・シャーストラ（BPHS）</span></div></div>';

        // Ch1: Soul Identity
        const lagnaD = getDeity(lagnaSidereal);
        let ch1 = '<strong>D60ラグナ： ' + SIGNS[dLagnaSign] + ' ' + SIGN_SYMBOLS[dLagnaSign] + '</strong> (支配星： ' + (RULER_NAMES[d60_1lord]||d60_1lord) + ')' + deityTag(lagnaD) + '<br><br>';
        ch1 += pastLifeThemes[dLagnaSign] + '<br>';
        if (lagnaD.deity) {
            ch1 += '<br>' + (lagnaD.deity.nature === 'benefic' ?
                '<strong>' + lagnaD.deity.name + '</strong> がラグナを守護しています。 ' + lagnaD.deity.desc + ' — 前世の功徳が今生を守り、自然に良い機会が訪れます。' :
                '<strong>' + lagnaD.deity.name + '</strong> がラグナに影響を与えています。 ' + lagnaD.deity.desc + ' — カルマ的な試練が性格に刻まれていますが、克服すれば大きな成長があります。');
        }
        if (d60_planets_1.length > 0) ch1 += '<br><br>' + d60_planets_1.map(p => p.name).join(', ') + ' がD60ラグナに位置 — 核心カルマがこれらの惑星に集中。';
        html += subChapter('🪐', '魂の正体 — 前世での姿', ch1);

        // Ch2: Soul Purpose (Sun)
        const sunD60 = dPositions.find(p => p.id === 'Sun');
        if (sunD60) {
            const sunD = getDeity(sunD60.sidereal);
            let ch2 = '<strong>D60太陽： ' + SIGNS[sunD60.dSign] + ' ' + SIGN_SYMBOLS[sunD60.dSign] + '</strong>' + deityTag(sunD) + '<br><br>';
            ch2 += (d60SunInterp[sunD60.dSign] || '') + '<br>';
            if (sunD.deity) {
                ch2 += '<br>太陽の守護神 <strong>' + sunD.deity.name + '</strong>: ' + sunD.deity.desc + '. ' + (sunD.deity.nature === 'benefic' ? '魂の目的を正しく追求し、自己実現が自然に訪れます。' : '前世で自我と権威への試練があり、真の自己を見つけることが課題です。');
            }
            html += subChapter('☉', '魂の目的 — なぜ生まれたのか', ch2);
        }

        // Ch3: Emotional Memory (Moon)
        const moonD60 = dPositions.find(p => p.id === 'Moon');
        if (moonD60) {
            const moonD = getDeity(moonD60.sidereal);
            let ch3 = '<strong>D60月： ' + SIGNS[moonD60.dSign] + ' ' + SIGN_SYMBOLS[moonD60.dSign] + '</strong>' + deityTag(moonD) + '<br><br>';
            ch3 += (d60MoonInterp[moonD60.dSign] || '') + '<br>';
            if (moonD.deity) {
                ch3 += '<br>月の守護神 <strong>' + moonD.deity.name + '</strong>: ' + moonD.deity.desc + '. ' + (moonD.deity.nature === 'benefic' ? '前世で心が平和であり、感情的安定と直感が生まれつきです。' : '感情的な傷が無意識に残っています。瞑想と水辺の休息が助けになります。');
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

        const spouseKarma = ['Warrior/leader connection. Intense, independent spouse karma.','Artist/wealthy connection. Materially abundant marriage karma.','Scholar/merchant connection. Communication and intellectual rapport.','Family/protector connection. Deep emotional bond karma.','Royalty/nobility connection. Splendid, respected marriage.','Healer/server connection. Service and devotion karma.','Diplomat/artist connection. Harmonious, beautiful marriage.','Practitioner/mystic connection. Intense, transformative karma.','Sage/explorer connection. Free, expansive karma. Foreign spouse possible.','Official/architect connection. Responsible, stable. Late marriage possible.','Official/military connection. Saturn-ruled, disciplined spouse. Age difference possible.','Medium/artist connection. Mysterious, spiritual karma. May meet in dreams.'];

        let ch4 = '<strong>D60 7室： ' + SIGNS[d60H7sign] + ' ' + SIGN_SYMBOLS[d60H7sign] + '</strong> (7室主： ' + (RULER_NAMES[d60H7lord]||d60H7lord) + ')<br><br>';
        ch4 += spouseKarma[d60H7sign] + '<br>';
        if (d60H7planets.length > 0) {
            ch4 += '<br><strong>D60 7室の惑星：</strong><br>';
            d60H7planets.forEach(p => {
                const pD = getDeity(p.sidereal);
                ch4 += p.symbol + ' <strong>' + p.name + '</strong>' + deityTag(pD) + '<br>';
                ch4 += (p.natural === 'benefic' ? '吉星が7室 — 配偶者と良いカルマ、今生でも祝福を受けます。' : '凶星が7室 — 配偶者との未解決カルマ、今生で清算します。') + '<br>';
            });
        }
        if (venusD60) {
            const venD = getDeity(venusD60.sidereal);
            const venH = ((venusD60.dSign - dLagnaSign + 12) % 12) + 1;
            ch4 += '<br><strong>♀ 金星（愛のカラカ）</strong> → D60 ' + venH + 'H (' + houseThemes[venH] + ')' + deityTag(venD) + '<br>';
            ch4 += venD.deity && venD.deity.nature === 'benefic' ? '金星が吉神の保護下。愛を正しく実践し、美しい愛が待っています。' : '金星が凶神の影響下。真の愛の意味を学ぶことが課題です。';
        }
        if (rahuD60 && ketuD60) {
            const rahuH = ((rahuD60.dSign - dLagnaSign + 12) % 12) + 1;
            const ketuH = ((ketuD60.dSign - dLagnaSign + 12) % 12) + 1;
            if (rahuH === 7 || ketuH === 7 || rahuH === 1 || ketuH === 1) {
                ch4 += '<br><br>🔥 <strong>ラフ・ケートゥ軸が1-7室ライン！</strong> 配偶者との非常に強い前世の縁。運命的に出会います。';
            }
        }
        const h7lordPlanet = dPositions.find(p => p.id === d60H7lord);
        if (h7lordPlanet) {
            const h7lH = ((h7lordPlanet.dSign - dLagnaSign + 12) % 12) + 1;
            ch4 += '<br><br><strong>7th Lord ' + (RULER_NAMES[d60H7lord]||d60H7lord) + '</strong> → D60 ' + h7lH + 'H (' + houseThemes[h7lH] + ')' + deityTag(getDeity(h7lordPlanet.sidereal)) + '<br>';
            ch4 += '配偶者カルマが発現する領域： <strong>' + houseThemes[h7lH] + '</strong> ';
        }
        html += subChapter('💍', '配偶者カルマ — 前世の縁', ch4);

        // Ch5: Career Karma
        const d60H10sign = (dLagnaSign + 9) % 12;
        const d60H10lord = SIGN_RULERS[d60H10sign];
        const d60H10planets = dPositions.filter(p => p.dSign === d60H10sign);
        const satD60 = dPositions.find(p => p.id === 'Saturn');
        const careerKarma = ['Military/Leadership/Sports','Finance/Art/Agriculture','Education/Media/Commerce','Nursing/Real Estate/Hotels','Politics/Entertainment/Management','Medical/Analysis/Service','Law/Diplomacy/Design','Research/Investigation/Medicine','Education/Religion/Foreign','Administration/Construction/Civil Service','Technology/Science/Innovation','Art/Spirituality/Hospital'][d60H10sign];

        let ch5 = '<strong>D60 10室： ' + SIGNS[d60H10sign] + ' ' + SIGN_SYMBOLS[d60H10sign] + '</strong> (10室主： ' + (RULER_NAMES[d60H10lord]||d60H10lord) + ')<br><br>';
        ch5 += '前世の職業カルマの方向： <strong>' + careerKarma + '</strong>。この分野に自然な引力があります。<br>';
        if (satD60) {
            const satD = getDeity(satD60.sidereal);
            const satH = ((satD60.dSign - dLagnaSign + 12) % 12) + 1;
            ch5 += '<br><strong>♄ 土星（カルマの主）</strong> → D60 ' + satH + 'H (' + houseThemes[satH] + ')' + deityTag(satD) + '<br>';
            ch5 += satD.deity && satD.deity.nature === 'benefic' ? '土星が吉神の下 — <strong>非常に稀な祝福！</strong> 忍耐の功徳が職業的試練を減らします。' : '土星が凶神の下 — 重い職業カルマ。忍耐、奉仕、マントラ（Om Shanaishcharaya Namaha）で溶かしましょう。';
        }
        if (d60H10planets.length > 0) ch5 += '<br><br><strong>D60 10室の惑星：</strong> ' + d60H10planets.map(p => p.name).join(', ') + ' — 職業カルマがここに集中。';
        html += subChapter('💼', '職業カルマ — 前世の使命', ch5);

        // Ch6: Wealth Karma
        const d60H2sign = (dLagnaSign + 1) % 12;
        const d60H2planets = dPositions.filter(p => p.dSign === d60H2sign);
        const wealthKarma = ['Self-made wealth instinct.','Abundant environment past life.','Intellectual wealth building.','Family/property wealth.','Wealth through authority.','Wealth through service. Frugal.','Partnership wealth.','Others wealth (inheritance).','Fortune brings wealth. Foreign.','Slow but sure. Rich after midlife.','Innovation wealth. Unconventional.','Spiritual activity and wealth. Giving.'][d60H2sign];
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
        if (lagnaD2.deity) { const lc = lagnaD2.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f'; ch7 += '<div style="padding:4px 0;">⬆ ラグナ → <strong>' + lagnaD2.deity.name + '</strong> <span style="color:' + lc + ';">' + (lagnaD2.deity.nature === 'benefic' ? 'B' : 'M') + '</span></div>'; }
        positions.forEach(p => {
            const pD = getDeity(p.sidereal);
            if (pD.deity) { const c = pD.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f'; ch7 += '<div style="padding:4px 0;">' + p.symbol + ' ' + p.name + ' → <strong>' + pD.deity.name + '</strong> <span style="color:' + c + ';">' + (pD.deity.nature === 'benefic' ? 'B' : 'M') + '</span></div>'; }
        });
        html += subChapter('🕉️', '守護神一覧', ch7);

        // Ch8: Overall Judgment
        const吉Count = positions.filter(p => { const pD = getDeity(p.sidereal); return pD.deity && pD.deity.nature === 'benefic'; }).length;
        const凶Planets = positions.filter(p => { const pD = getDeity(p.sidereal); return pD.deity && pD.deity.nature === 'malefic'; });
        let ch8 = '9惑星中： <strong style="color:#5cb85c">' +吉Count + '吉</strong>, <strong style="color:#d9534f">' + (positions.length -吉Count) + '凶</strong><br><br>';
        if (beneficCount >= 7) ch8 += '🌟 <strong>非常に強い前世の功徳。</strong> パラシャラはこれを「神々に祝福された魂」と呼びました。 Most planets under吉 deities.';
        else if (beneficCount >= 5) { ch8 += '✨ <strong>前世の功徳が豊富。</strong> 吉神が優勢、多くの領域で保護。'; if (maleficPlanets.length > 0) ch8 += ' 注意： <strong>' +凶Planets.map(p => p.name).join(', ') + '</strong> — マントラと慈善を実践しましょう。'; }
        else if (beneficCount >= 3) { ch8 += '⚖️ <strong>カルマの均衡状態。</strong> 良い出来事と試練が交互に訪れます。'; if (maleficPlanets.length > 0) ch8 += '<br>注意： <strong>' +凶Planets.map(p => p.name).join(', ') + '</strong>'; }
        else ch8 += '🔥 <strong>カルマ清算の人生。</strong> パラシャラは「最も重いカルマが最大の成長をもたらす」と言いました。 マントラと慈善が特に重要です。';
        html += subChapter('📊', '総合カルマ判定', ch8);

    } else if (division === 2) {
        // D2 Hora — Wealth accumulation
        const d2LagnaInterp = ['Self-made wealth. Independent and aggressive investing.','Sensory investment and stable wealth. Real estate, food, art income.','Earning through intellectual activity. Writing, education, business acumen.','Real estate and family income. Property from mother. Watch emotional spending.','Wealth through leadership and authority. Government, gold. Showy spending.','Income through analysis and skills. Medical, accounting, service. Frugal manager.','Wealth through partnership. Law, diplomacy, fashion, art income.','Building wealth through others money (inheritance, insurance, investments). Hidden sources.','Income through education, foreign, religion. Fortune brings wealth.','Systematic effort builds wealth. Slow but sure. Rich after middle age.','Income through technology, innovation, networks. Unconventional sources.','Income through spiritual/artistic activities. Foreign-related wealth. Giving nature.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">💰 D2 Hora — Wealth Analysis</div><div class="interp-text">';
        html += '<strong>D2 ラグナ: ' + SIGNS[dLagnaSign] + '</strong><br>' + d2LagnaInterp + '<br><br>';
        const sunD2 = dPositions.find(p => p.id === 'Sun');
        const moonD2 = dPositions.find(p => p.id === 'Moon');
        if (sunD2) html += '<strong>☉ Sun → ' + SIGNS[sunD2.dSign] + ':</strong> ' + (sunD2.dSign === 4 ? '🌟 <strong>Sun in own hora (Leo)!</strong> Self-made type. Builds wealth through authority and leadership.' : 'Sun in Moon hora. Income through others help or government/public sector.') + '<br>';
        if (moonD2) html += '<strong>☽ Moon → ' + SIGNS[moonD2.dSign] + ':</strong> ' + (moonD2.dSign === 3 ? '🌟 <strong>Moon in own hora (Cancer)!</strong> Abundant life through people and relationships.' : 'Moon in Sun hora. Livelihood through own effort and independent activity.') + '<br>';
        const d2H2sign = (dLagnaSign + 1) % 12;
        const d2H2planets = dPositions.filter(p => p.dSign === d2H2sign);
        html += '<br><strong>D2 2nd House (Accumulated Wealth) — ' + SIGNS[d2H2sign] + ':</strong><br>';
        if (d2H2planets.length > 0) {
            const wealth = {Sun:'Wealth through authority and status',Moon:'Wealth through public activities',Mars:'Property, technology, competitive fields',Mercury:'Business, intellectual activity, communication',Jupiter:'Education, law, religion — abundant wealth',Venus:'Art, fashion, luxury goods',Saturn:'Slow but steady accumulation. Stable after middle age',Rahu:'Unconventional methods, foreign-related',Ketu:'Detached from material. Pursues spiritual values'};
            d2H2planets.forEach(p => { html += '• ' + p.name + ': ' + (wealth[p.id]||'') + '<br>'; });
        } else html += 'No planets in 2nd — the 2nd lord position is key to wealth.<br>';
        html += '</div></div>';

    } else if (division === 3) {
        const d3LagnaInterp = ['Independent, leadership among siblings. Brave communication style.','Stable, materially comfortable sibling relationships. Artistic siblings possible.','Intellectual, communicative siblings. Many siblings or lots of conversation.','Emotionally deep sibling bond. Motherly sibling. Protective siblings.','Charismatic, proud siblings. Famous or successful sibling.','Analytical, practical siblings. Medical/education field. Can be critical.','Diplomatic, charming siblings. Social connections through siblings.','Intense, secretive sibling relationships. Deep bonds after conflicts.','Free, philosophical siblings. Siblings abroad. Religion/education related.','Responsible, ambitious siblings. Sense of duty. Siblings few or serious relationship.','Unique, independent siblings. Unconventional sibling relationships.','Spiritual, artistic siblings. Siblings abroad. Emotional connection.'][dLagnaSign];
        const d3_3sign = (dLagnaSign + 2) % 12;
        const d3_3planets = dPositions.filter(p => p.dSign === d3_3sign);

        html += '<div class="interp-card"><div class="interp-title">👫 D3 Drekkana — Siblings & Courage</div><div class="interp-text">';
        html += '<strong>D3 ラグナ: ' + SIGNS[dLagnaSign] + '</strong><br>' + d3LagnaInterp + '<br><br>';
        html += '<strong>D3 3rd House (Younger Siblings) — ' + SIGNS[d3_3sign] + ':</strong><br>';
        if (d3_3planets.length > 0) {
            const bro = {Sun:'Younger sibling has leadership and authority',Moon:'Emotionally close with younger sibling',Mars:'Active, brave younger sibling. Possible conflicts',Mercury:'Intelligent younger sibling with good communication',Jupiter:'Wise younger sibling who brings good fortune',Venus:'Attractive, artistic younger sibling',Saturn:'Difficulties with younger sibling. May have age gap',Rahu:'Unique younger sibling or foreign connection',Ketu:'Distance with younger sibling. Spiritual connection'};
            d3_3planets.forEach(p => { html += '• ' + p.name + ': ' + (bro[p.id]||'') + '<br>'; });
        } else html += 'No planets in 3rd — check the 3rd lord position.<br>';
        html += '</div></div>';

    } else if (division === 4) {
        const d4LagnaInterp = ['Actively acquires property. Likes building or buying new homes.','Stable, abundant real estate. Land and farms. Luxurious dwelling.','Multiple homes or frequent moves. Prefers intellectual environment.','Home and property are emotionally important. Near water. Property from mother.','Grand, spacious home. Luxurious interior. Prestigious ','Clean, practical dwelling. Health-focused environment. Multiple small properties.','Beautiful, harmonious home. Interest in interior design. Property with partner.','Property undergoes transformation. Inherited property. Secret places.','Large land and foreign property. Near religious/educational facilities.','Systematic property investment. Old buildings. Slow but sure asset growth.','Unique dwelling style. Modern apartment. Tech-related facilities.','Beautiful home near water. Foreign property. Spiritual space.'][dLagnaSign];
        const d4_4sign = (dLagnaSign + 3) % 12;
        const d4_4planets = dPositions.filter(p => p.dSign === d4_4sign);

        html += '<div class="interp-card"><div class="interp-title">🏠 D4 Chaturthamsa — Property & Fortune</div><div class="interp-text">';
        html += '<strong>D4 ラグナ: ' + SIGNS[dLagnaSign] + '</strong><br>' + d4LagnaInterp + '<br><br>';
        html += '<strong>D4 4th House (Property) — ' + SIGNS[d4_4sign] + ':</strong><br>';
        if (d4_4planets.length > 0) {
            const prop = {Sun:'Government-owned buildings or prestigious dwelling',Moon:'Beautiful home. Near water. Mother influence',Mars:'New construction. Possible property disputes',Mercury:'Commercial property. Multiple ownership',Jupiter:'Spacious, abundant home! Best property fortune',Venus:'Luxurious home. Beautiful interior',Saturn:'Old home. Needs repair. Stable after middle age',Rahu:'Foreign property. Unconventional dwelling',Ketu:'Indifferent to property. Prefers spiritual space'};
            d4_4planets.forEach(p => { html += '• ' + p.name + ': ' + (prop[p.id]||'') + '<br>'; });
        } else html += 'No planets in 4th — the 4th lord position is key to property.<br>';
        html += '</div></div>';

    } else if (division === 24) {
        const d24LagnaInterp = ['Physical education, military, leadership training.','Music, art, culinary, finance education.','Language, literature, communication, media education.','History, psychology, home science education.','Political science, theater, business education.','Medicine, science, statistics education. Precise learning.','Law, diplomacy, design education. Balanced learning.','Psychology, research, investigation, occult education.','Philosophy, theology, international studies. Study abroad likely.','Business, administration, architecture. Systematic learning.','IT, engineering, aviation, social science. Innovative learning.','Art, music, spirituality, film studies. Intuitive learning.'][dLagnaSign];
        const d24_4sign = (dLagnaSign + 3) % 12;
        const d24_5sign = (dLagnaSign + 4) % 12;
        const d24_4planets = dPositions.filter(p => p.dSign === d24_4sign);
        const jupD24 = dPositions.find(p => p.id === 'Jupiter');
        const merD24 = dPositions.find(p => p.id === 'Mercury');

        html += '<div class="interp-card"><div class="interp-title">📚 D24 Chaturvimsamsa — Education</div><div class="interp-text">';
        html += '<strong>D24 ラグナ: ' + SIGNS[dLagnaSign] + '</strong><br>' + d24LagnaInterp + '<br><br>';
        html += '<strong>D24 4th (Basic Education) — ' + SIGNS[d24_4sign] + ':</strong><br>';
        if (d24_4planets.length > 0) {
            const edu4 = {Sun:'Prestigious school. Authoritative education',Moon:'Comfortable learning environment. Strong home education',Mars:'Competitive learning. Strong in sports/tech',Mercury:'Best placement! Outstanding academic ability',Jupiter:'Rich educational environment. Good teachers',Venus:'Art education. Beautiful school',Saturn:'Difficult education but deep knowledge when overcome',Rahu:'Unconventional education. Foreign school',Ketu:'Less interest in formal education. Intuitive learning'};
            d24_4planets.forEach(p => { html += '• ' + p.name + ': ' + (edu4[p.id]||'') + '<br>'; });
        } else html += 'No planets in 4th.<br>';
        if (jupD24) { const jH = ((jupD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>♃ Jupiter (Wisdom) → ' + jH + 'H:</strong> ' + ([1,4,5,9].includes(jH) ? '🎓 <strong>High academic achievement expected!</strong> Graduate school/PhD/study abroad possible.' : 'Growth through learning. Jupiter blessing in house ' + jH + '.') + '<br>'; }
        if (merD24) { const mH = ((merD24.dSign - dLagnaSign + 12) % 12) + 1; html += '<strong>☿ Mercury (Learning) → ' + mH + 'H:</strong> ' + ([1,4,5,9].includes(mH) ? '📖 <strong>Outstanding intellectual ability!</strong> Talented in math, language, analysis.' : 'Intellectual ability expressed in house ' + mH + '.') + '<br>'; }
        html += '</div></div>';

    } else if (division === 30) {
        const d30LagnaInterp = ['Accidents, burns, headaches. Problems from hasty decisions. Manage anger.','Financial loss, dietary issues, thyroid. Watch overeating and attachment.','Nervous anxiety, insomnia, breathing problems. Avoid excessive worry.','Emotional instability, stomach issues, water-related problems. Control emotions.','Heart problems, pride damage, overwork. Need humility and rest.','Digestive disorders, allergies, perfectionism stress. Need relaxation.','Kidney problems, relationship conflicts, indecisiveness. Need decisiveness.','Secrets, accidents, surgery, sexual issues. Regular checkups important.','Liver problems, overweight, gambling/overspending. Need moderation.','Joint, bone, depression, loneliness. Need calcium and social interaction.','Blood pressure, circulation, unexpected accidents. Regular health checks.','Immune deficiency, addiction, mental health. Need meditation and sleep.'][dLagnaSign];
        const d30_6sign = (dLagnaSign + 5) % 12;
        const d30_8sign = (dLagnaSign + 7) % 12;
        const d30_12sign = (dLagnaSign + 11) % 12;
        const d30_6planets = dPositions.filter(p => p.dSign === d30_6sign);
        const d30_8planets = dPositions.filter(p => p.dSign === d30_8sign);

        html += '<div class="interp-card"><div class="interp-title">⚠️ D30 Trimsamsa — Misfortune & Disease</div><div class="interp-text">';
        html += '<strong>D30 ラグナ: ' + SIGNS[dLagnaSign] + '</strong><br>' + d30LagnaInterp + '<br><br>';
        const diseaseBySign = ['Head, brain, fever, inflammation','Neck, thyroid, diabetes','Lungs, nerves, anxiety','Stomach, water retention','Heart, back, blood pressure','Digestive, intestines, skin','Kidneys, lower back, urinary','Reproductive, chronic disease','Liver, thighs, overweight','Bones, joints, rheumatism','Circulation, blood pressure, ankles','Immune, feet, mental health'];
        html += '<strong>D30 6th (Disease) — ' + SIGNS[d30_6sign] + ':</strong><br>';
        html += 'Watch for: <strong>' + diseaseBySign[d30_6sign] + '</strong><br>';
        if (d30_6planets.length > 0) {
            const dis = {Sun:'Eye, heart-related illness',Moon:'Mental health, water-related issues',Mars:'Accidents, surgery, burns',Mercury:'Nervous system, skin problems',Jupiter:'Liver, overweight',Venus:'Kidneys, diabetes, STDs',Saturn:'Chronic illness, joint problems',Rahu:'Unknown cause illness, addiction',Ketu:'Immune deficiency, allergies'};
            d30_6planets.forEach(p => { html += '• ' + p.name + ': ' + (dis[p.id]||'') + '<br>'; });
        }
        html += '<br><strong>D30 8th (Danger) — ' + SIGNS[d30_8sign] + ':</strong><br>';
        if (d30_8planets.length > 0) {
            d30_8planets.forEach(p => { html += '• ' + p.name + ': ' + (p.natural === 'malefic' ? 'Danger/accident caution. Insurance and checkups important.' : 'Protected in crisis.') + '<br>'; });
        } else html += 'No planets in 8th — low danger risk.<br>';
        html += '</div></div>';

    } else if (division === 40) {
        const d40LagnaInterp = ['Independent, strong-willed mother. Leadership inherited from maternal line.','Mother manages wealth well. Material abundance from maternal line.','Intellectual mother with good communication. Language/education talent inherited.','Very deep bond with mother. Sensitivity and intuition inherited.','Mother has authority and dignity. Leadership and honor inherited.','Mother excels at health management. Analytical/service spirit inherited.','Attractive, diplomatic mother. Artistic sense inherited.','Strong mother who went through transformation. Resilience inherited.','Educational, religious mother. Wisdom/philosophy inherited.','Responsible, strict mother. Patience and discipline inherited.','Unique, progressive mother. Innovative thinking inherited.','Spiritual, intuitive mother. Art/spirituality inherited.'][dLagnaSign];
        const moonD40 = dPositions.find(p => p.id === 'Moon');

        html += '<div class="interp-card"><div class="interp-title">👩 D40 Khavedamsa — Maternal Legacy</div><div class="interp-text">';
        html += '<strong>D40 ラグナ: ' + SIGNS[dLagnaSign] + '</strong><br>' + d40LagnaInterp + '<br>';
        if (moonD40) { const mH = ((moonD40.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☽ Moon (Mother karaka) → ' + mH + 'H:</strong> ' + ['','Strong maternal influence on self','Property from mother','Good communication with mother','Deep bond with mother! Best placement','Creative mother','Service-oriented mother','Mother influences relationships','Inheritance from mother','Religious/educational mother','Socially successful mother','Independent mother','Spiritual mother'][mH] + '<br>'; }
        html += '</div></div>';

    } else if (division === 45) {
        const d45LagnaInterp = ['Active, action-oriented father. Courage and leadership inherited.','Financially stable father. Material values inherited.','Intellectual, versatile father. Communication/business ability inherited.','Emotional, family-oriented father. Caring instinct inherited.','Authoritative, respected father. Leadership inherited.','Practical, diligent father. Analytical/technical skills inherited.','Diplomatic, refined father. Social ability inherited.','Strong, mysterious father. Resilience/insight inherited.','Scholarly, religious father. Philosophy/morality inherited.','Strict, ambitious father. Patience/discipline inherited.','Creative, innovative father. Tech/scientific thinking inherited.','Spiritual, artistic father. Intuition/creativity inherited.'][dLagnaSign];
        const sunD45 = dPositions.find(p => p.id === 'Sun');

        html += '<div class="interp-card"><div class="interp-title">👨 D45 Akshavedamsa — Paternal Legacy</div><div class="interp-text">';
        html += '<strong>D45 ラグナ: ' + SIGNS[dLagnaSign] + '</strong><br>' + d45LagnaInterp + '<br>';
        if (sunD45) { const sH = ((sunD45.dSign - dLagnaSign + 12) % 12) + 1; html += '<br><strong>☉ Sun (Father karaka) → ' + sH + 'H:</strong> ' + ['','Strong paternal influence on self','Property from father','Good communication with father','Family-oriented father','Creative father','Service-oriented father','Father influences relationships','Inheritance from father','Religious/educational father','Socially successful father! Best placement','Independent father','Spiritual father'][sH] + '<br>'; }
        html += '</div></div>';
    }

    interpEl.innerHTML = html;
}


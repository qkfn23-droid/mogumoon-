// ============================================================
// VEDIC ASTROLOGY ENGINE
// ============================================================
var isEasy = false;
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
    renderDivisionalChart(d.positions, d.lagnaSidereal, 10, 'd10Chart', 'd10InterpWrap', 'D10', 'Dashamsha');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 7, 'd7Chart', 'd7InterpWrap', 'D7', 'Saptamsha');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 12, 'd12Chart', 'd12InterpWrap', 'D12', 'Dwadashamsha');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 60, 'd60Chart', 'd60InterpWrap', 'D60', 'Shashtiamsha');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 2, 'd2Chart', 'd2InterpWrap', 'D2', 'Hora');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 3, 'd3Chart', 'd3InterpWrap', 'D3', 'Drekkana');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 4, 'd4Chart', 'd4InterpWrap', 'D4', 'Chaturthamsha');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 16, 'd16Chart', 'd16InterpWrap', 'D16', 'Shodashamsha');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 20, 'd20Chart', 'd20InterpWrap', 'D20', 'Vimshamsha');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 24, 'd24Chart', 'd24InterpWrap', 'D24', 'Chaturvimshamsha');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 27, 'd27Chart', 'd27InterpWrap', 'D27', 'Saptavimshamsha');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 30, 'd30Chart', 'd30InterpWrap', 'D30', 'Trimshamsha');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 40, 'd40Chart', 'd40InterpWrap', 'D40', 'Khavedamsha');
    renderDivisionalChart(d.positions, d.lagnaSidereal, 45, 'd45Chart', 'd45InterpWrap', 'D45', 'Akshavedamsha');
}
function updateCatHeaders() {
    var e = window.vedicMode === 'easy';
    var ids = {
        catGuide: e ? 'Glossary' : 'Vedic Astrology Beginner\'s Guide',
        catBasic: e ? 'My Planet Positions' : 'Basic Chart — Planet Positions & Birth Chart',
        catDasha: e ? 'My Life Periods' : 'Dasha — Life Period Analysis',
        catInterp: e ? 'My Reading — Personality·Wealth·Career·Health' : 'Interpretation — Personality·Wealth·Career·Health·Yoga',
        catMarriage: e ? 'My Spouse Details' : 'Marriage & Spouse — D9 Navamsha',
        catCareer: e ? 'My Career·Wealth Details' : 'Career & Wealth — D10·D2·D4',
        catFamily: e ? 'My Family' : 'Family — D7·D3·D12·D40·D45',
        catSpirit: e ? 'Spirituality·Education·Health' : 'Spirituality·Education·Health — D20·D24·D27·D16',
        catWarn: e ? 'Health Cautions' : 'Cautions — D30 Disease·Foreign',
        catKarma: e ? 'Past Life Karma' : 'Karma — D60 Past Life·Karma'
    };
    for (var id in ids) { var el = document.getElementById(id); if (el) el.textContent = ids[id]; }

    var secs = {
        secPlanetHouse: e ? '🪐 How Each Planet Affects You' : '🪐 Planet-in-House Analysis',
        secDignity: e ? '⚖️ Your Strengths & Weaknesses' : '⚖️ Planetary Dignity (Exaltation·Debilitation·Own Sign)',
        secLucky: e ? '🍀 Lucky Info' : '🍀 Lucky Information',
        secRemedy: e ? '💎 Ways to Boost Your Luck' : '💎 Remedies & Strengthening',
        secD10: e ? '💼 Career Details' : '💼 D10 Dashamsha (Career)',
        secD2: e ? '💰 Wealth Details' : '💰 D2 Hora (Wealth)',
        secD4: e ? '🏠 Property & Real Estate' : '🏠 D4 Chaturthamsha (Property)',
        secD7: e ? '👶 Children' : '👶 D7 Saptamsha (Children)',
        secD3: e ? '👫 Siblings & Courage' : '👫 D3 Drekkana (Siblings)',
        secD12: e ? '👨‍👩‍👧 Parents' : '👨‍👩‍👧 D12 Dwadashamsha (Parents)',
        secD40: e ? '👩 Maternal Heritage' : '👩 D40 Khavedamsha (Maternal)',
        secD45: e ? '👨 Paternal Heritage' : '👨 D45 Akshavedamsha (Paternal)',
        secD24: e ? '📚 Education' : '📚 D24 Chaturvimshamsha (Education)',
        secD20: e ? '🙏 Spirituality' : '🙏 D20 Vimshamsha (Spirituality)',
        secD27: e ? '💪 Physical Strength' : '💪 D27 Saptavimshamsha (Strength)',
        secD16: e ? '🚗 Vehicles & Comfort' : '🚗 D16 Shodashamsha (Vehicles)',
        secD30: e ? '⚠️ Health Caution Details' : '⚠️ D30 Trimshamsha (Disease)',
        secForeign: e ? '✈️ Foreign & Immigration' : '✈️ Foreign & Immigration (9th·12th House)'
    };
    for (var sid in secs) { var sel = document.getElementById(sid); if (sel) sel.textContent = secs[sid]; }
}
function renderEasyMode(positions, lagnaSign, moonPos) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    var html = '';
    // Personality
    var personality = ['Action-oriented! Quick decisions with leadership qualities. Loves new challenges.','Loves stability. Enjoys comfort and beauty. Once decided, sees it through.','Endlessly curious! Great communicator and multi-talented.','Warm and emotional. Treasures family and reads people well.','Born leader! Great presence with creative talent.','Detail-oriented and analytical. Seeks perfection and cares about health.','Seeks harmony. Refined, charming, with excellent artistic sense.','Has depth. Strong intuition that sees through to the truth.','Free spirit! Loves travel and learning, very positive.','Ambitious. Patient and more attractive with age.','Unique. Thinks differently from everyone else, innovative.','Deeply sensitive. Strong intuition drawn to art and spirituality.'][lagnaSign];
    html += '<div class="interp-card"><div class="interp-title">👤 My Personality</div><div class="interp-text">' + personality + '</div></div>';

    // Emotions
    if (moonPos) {
        var emotion = ['A fiery passion burns inside you. Emotions rise fast and cool fast. When stressed, you need to move your body. Exercise and outdoor activities work best.','Emotionally very stable. Dislikes sudden changes, finds security in the familiar. Good food, music, and nature heal your soul.','Processes emotions rationally. Talking helps organize feelings. Curious about many things at once and cannot stand boredom.','Extremely sensitive. Absorbs others emotions like a sponge. Home is your safe space with strong bond with mother.','Dramatic and passionate emotional expression. Deeply needs love and recognition. Creative activities are your emotional medicine.','Tends to analyze and organize emotions. Worries a lot but excellent at practical solutions. Daily routines bring emotional stability.','Finds emotional balance in relationships. Feels lonely alone, stabilizes with partner or close friends. Art and beauty bring peace.','Emotions are as deep and intense as the ocean. Loves deeply and never forgets betrayal. Incredibly strong intuition.','Emotionally bright and optimistic. Loves freedom and hates constraints. Travel is the best emotional remedy.','Does not show emotions easily. Strong sense of responsibility. Grows more emotionally open with age.','Unique, unpredictable emotional patterns. Loves in unconventional ways. Finds emotional fulfillment in social causes.','Extremely intuitive and spiritual. Dreams are vivid and sometimes prophetic. Art, meditation, and water bring peace.'][moonPos.sign];
        html += '<div class="interp-card"><div class="interp-title">🌙 My Emotional Style</div><div class="interp-text">' + emotion + '</div></div>';
    }

    // Wealth
    var wealth = ['Self-made type. Aggressive investment style, better suited for self-employment or freelance. Can earn fast early but watch hasty investments.','Steadily accumulates wealth. Income likely from real estate, art, food. Balance spending is key. Saving habits are your greatest weapon.','Earns through intellectual abilities. Income from writing, education, IT, marketing. Multiple income streams suit you well.','Wealth tends to come through home and family. May inherit from mother or earn through real estate/food. Watch emotional spending.','Earns through leadership and authority. Wealth follows higher positions. Connected to government and gold. Your dignity attracts wealth.','Earns through analysis and professional skills. Stable income from medical, accounting, service fields. Frugal manager style.','Earns through partnerships. Better fortune with others. Income from law, diplomacy, fashion, art. Spouse may bring wealth.','Accumulates through others\' resources — inheritance, insurance, investments. Joint investments connected. Can protect wealth in crisis.','Fortune follows your wealth. Income from education, foreign, philosophy. Unexpected luck brings wealth. Positive mindset attracts fortune.','Accumulates slowly but surely. Financial difficulties early but steady wealth after middle age. Patience is the best investment strategy.','Earns through technology, innovation, social networks. Unconventional income methods. IT, science, social movements connected.','Earns through art or spiritual activities. Foreign wealth connections. Interested in charity. Spiritual richness paradoxically attracts wealth.'][lagnaSign];
    html += '<div class="interp-card"><div class="interp-title">💰 My Wealth</div><div class="interp-text">' + wealth + '</div></div>';

    // Spouse
    var spouse = ['Your spouse is energetic and independent. Active and direct, passionate about their work. Not the type to quietly follow — a partner who challenges together. May be somewhat impatient, but the relationship will be equally passionate.','Your spouse is beautiful and sensual. Enjoys the finer things, stable and loyal. May have talent in cooking or art. Comfortable to be around. Likely materially stable.','Your spouse is eloquent and witty. Great conversation is the biggest charm, with excellent humor. An intellectual, versatile partner you can share many interests with.','Your spouse is warm and family-oriented. Excellent caregiving abilities. Being together feels like home. Desires deep emotional bonds and treasures family above all.','Your spouse is charismatic and dignified. May hold a socially prominent position. High self-esteem but equally generous. Being together makes you feel special.','Your spouse is meticulous and practical. Interested in health and wellness. A caring type who pays attention to details. May be perfectionist but reliable.','Your spouse is charming and refined. Diplomatic with good sense of balance, excellent artistic taste. Being together makes the world more beautiful.','Your spouse is intense and mysterious. Deep emotions — once committed, goes all the way. May have many secrets but desires deep connection. A fated, intense attraction.','Your spouse is free-spirited and optimistic. May be from a different culture or connected to foreign lands. Philosophical and adventurous. Wants freedom even after marriage.','Your spouse is serious and ambitious. Strong sense of responsibility, likely socially successful. May have age difference. Marriage may come late but lasts long.','Your spouse is unique and independent. May meet through unconventional ways. Intellectual with innovative thinking. Prefers a free-form, friend-like relationship.','Your spouse is spiritual and intuitive. Connected to an artist or spiritual practitioner. Gives a dreamy, romantic feeling. May need to adjust realistic expectations.'][(lagnaSign+6)%12];
    // 7 house 행성 추가 정보
    var h7p = positions.filter(function(p){return houseOf(p.sign)===7;});
    var spouseExtra = '';
    h7p.forEach(function(p) {
        var desc = {Sun:'A spouse with high social status.',Moon:'An emotional and caring spouse.',Mars:'Passionate but arguments possible. Strong spouse.',Mercury:'An intellectual spouse with great conversation.',Jupiter:'A wise and moral spouse! Best marriage fortune.',Venus:'A very attractive and loving spouse.',Saturn:'Late marriage but lasting relationship. Age difference possible.',Rahu:'Unconventional marriage. Foreign spouse possible.',Ketu:'Past-life connection. A spouse with strong spiritual bond.'};
        if (desc[p.id]) spouseExtra += '<br>✦ ' + desc[p.id];
    });
    html += '<div class="interp-card"><div class="interp-title">💍 My Spouse</div><div class="interp-text">' + spouse + spouseExtra + '</div></div>';

    // Career
    var career = ['Leadership careers. Military, police, sports, surgery, business management. Self-employment suits well.','Finance, food, real estate, fashion, art. Excels in sensual, stable environments. Natural talent with money.','Communication and intellectual careers. Media, writing, education, IT, marketing. Changes the world with words.','Caring professions. Medical, nursing, hospitality, cooking, counseling. Excels in emotionally connected work.','Stage careers. Politics, entertainment, management, government. Creative, authoritative positions are your calling.','Analysis and precision careers. Medical, accounting, consulting, health management. Detail observation is your strength.','Harmony and beauty careers. Law, diplomacy, fashion, interior, counseling. Talent in connecting people.','Deep investigation careers. Research, insurance, medicine, psychology, tax. Talent in handling secrets.','Learning and exploration careers. Education, law, religion, publishing, travel. Deep foreign connections.','System and organization careers. Management, civil service, architecture. Slow but certain success. High social position.','Innovation and technology careers. IT, science, aviation, social work. Changes the world in ways nobody thought of.','Art and spirituality careers. Art, film, music, medical, foreign, NGO. Finds meaning in healing the world.'][(lagnaSign+9)%12];
    html += '<div class="interp-card"><div class="interp-title">💼 My Career</div><div class="interp-text">' + career + '</div></div>';

    // Health
    var health = ['Head and face are weak points. Headaches and fevers common. Exercise regularly and stay hydrated. Watch for accidents.','Neck and thyroid are weak. Tendency to overeat — watch weight and diabetes. Good food in moderation. Nature walks are best.','Lungs, arms, shoulders, nervous system. Anxiety and sleep issues possible. Breathing meditation helps. Maintain sleep routine.','Stomach and chest areas. Emotional stress directly affects digestion. Warm food and tea help. Time near water heals.','Heart, back, spine. Watch for overwork. Cardio exercise regularly. Rest enough. Managing pride reduces stress.','Digestive system, intestines, skin. Indigestion and allergies possible. Diet is crucial. Yoga and meditation help.','Kidneys, lower back, skin. Stay hydrated and balanced. Reduce sugar. Skin reflects stress — inner peace equals skin health.','Reproductive and excretory systems. Chronic conditions possible. Regular checkups important. Deep breathing and meditation help.','Liver, thighs, hips. Watch weight. Outdoor activities best. Reduce sitting time. Foreign travel heals body and mind.','Bones, joints, knees, skin. Watch rheumatism. Calcium and vitamin D important. Stretching becomes more attractive with age.','Ankles, calves, circulatory system. Blood pressure management important. Walk regularly. Get checked for unusual symptoms.','Feet, lymphatic, immune system. Adequate sleep is your most powerful health secret. Water, meditation, yoga boost immunity. Sensitive to alcohol.'][lagnaSign];
    html += '<div class="interp-card"><div class="interp-title">🏥 My Health</div><div class="interp-text">' + health + '</div></div>';

    // Current dasha summary
    if (moonPos) {
        var nak = NAKSHATRAS[moonPos.nakshatra];
        if (nak) {
            var startRuler = nak.ruler;
            var startIdx = DASHA_ORDER.indexOf(startRuler);
            if (startIdx === -1) startIdx = 0;
            var now = new Date();
            var bd = new Date(Date.UTC(parseInt(document.getElementById('birthYear').value),parseInt(document.getElementById('birthMonth').value)-1,parseInt(document.getElementById('birthDay').value)));
            var cd = new Date(bd);
            var nakSpan = 360/27;
            var moonInNak = moonPos.sidereal - (moonPos.nakshatra * nakSpan);
            var elapsed = moonInNak / nakSpan;
            var remDays = DASHA_YEARS[startRuler] * (1-elapsed) * 365.25;
            for (var i=0;i<9;i++) {
                var idx = (startIdx+i)%9;
                var planet = DASHA_ORDER[idx];
                var days = (i===0) ? remDays : DASHA_YEARS[planet]*365.25;
                var endD = new Date(cd.getTime()+days*86400000);
                if (now>=cd && now<endD) {
                    var dashaDesc = {Ketu:'A period of spiritual growth. Focus on inner self over material things.',Venus:'A time of love and abundance! Romance, marriage, and art flourish.',Sun:'A time of self-discovery and leadership. Confidence grows strong.',Moon:'A time of emotions and home. Family relationships become important.',Mars:'A time of action and energy. Great for starting new things.',Rahu:'A time of change and innovation. Unexpected opportunities arise.',Jupiter:'A time of luck and growth! Many good things in education, marriage, promotion.',Saturn:'A time of patience and trials. Slow but certain growth.',Mercury:'A time of intellectual activity. Favorable for study, business, communication.'};
                    html += '<div class="interp-card"><div class="interp-title">⏳ My Current Period</div><div class="interp-text">Current period: <strong style="color:#c9a84c;">' + DASHA_KO[planet] + '</strong> period.<br><br>' + (dashaDesc[planet]||'') + '</div></div>';
                    break;
                }
                cd = endD;
            }
        }
    }

    document.getElementById('easyInterpWrap').innerHTML = html;
}

// Ayanamsa (Lahiri) - Indian Astronomical Ephemeris official formula
function getAyanamsa(jd) {
    // Lahiri (Chitrapaksha): Spica = 0° Libra sidereal
    // Based on Newcomb precession with IAE reference point
    const T = (jd - 2451545.0) / 36525.0;
    // Precession in arcseconds (Newcomb)
    const prec = 5029.0966 * T + 1.11113 * T * T - 0.000006 * T * T * T;
    // Lahiri reference calibrated to Indian Astronomical Ephemeris
    return 23.86325 + prec / 3600.0;
}

// Zodiac signs
const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
               'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGNS_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

// Planets
const PLANETS = [
    { id: 'Sun', name: 'Sun', symbol: '☉', natural: 'malefic' },
    { id: 'Moon', name: 'Moon', symbol: '☽', natural: 'benefic' },
    { id: 'Mars', name: 'Mars', symbol: '♂', natural: 'malefic' },
    { id: 'Mercury', name: 'Mercury', symbol: '☿', natural: 'neutral' },
    { id: 'Jupiter', name: 'Jupiter', symbol: '♃', natural: 'benefic' },
    { id: 'Venus', name: 'Venus', symbol: '♀', natural: 'benefic' },
    { id: 'Saturn', name: 'Saturn', symbol: '♄', natural: 'malefic' },
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

// ── Form init ──
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
    for (let m = 1; m <= 12; m++) {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = 'Month ' + m;
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
    // Minute: 00, 01, 02, ... 59 (1분 단위 — D60 정밀도)
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

// Init form on page load
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
            const vec = Astronomy.GeoVector(planetId, date, true);
            return Astronomy.Ecliptic(vec).elon;
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
        const md = month * 100 + day; // MMDD format for easy comparison
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
        // Mean longitude of ascending node (tropical)
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
    renderDivisionalChart(positions, lagnaSidereal, 10, 'd10Chart', 'd10InterpWrap', 'D10', 'Dashamsha');
    renderDivisionalChart(positions, lagnaSidereal, 7, 'd7Chart', 'd7InterpWrap', 'D7', 'Saptamsha');
    renderDivisionalChart(positions, lagnaSidereal, 12, 'd12Chart', 'd12InterpWrap', 'D12', 'Dwadashamsha');
    renderDivisionalChart(positions, lagnaSidereal, 60, 'd60Chart', 'd60InterpWrap', 'D60', 'Shashtiamsha');
    renderDivisionalChart(positions, lagnaSidereal, 2, 'd2Chart', 'd2InterpWrap', 'D2', 'Hora');
    renderDivisionalChart(positions, lagnaSidereal, 3, 'd3Chart', 'd3InterpWrap', 'D3', 'Drekkana');
    renderDivisionalChart(positions, lagnaSidereal, 4, 'd4Chart', 'd4InterpWrap', 'D4', 'Chaturthamsha');
    renderDivisionalChart(positions, lagnaSidereal, 16, 'd16Chart', 'd16InterpWrap', 'D16', 'Shodashamsha');
    renderDivisionalChart(positions, lagnaSidereal, 20, 'd20Chart', 'd20InterpWrap', 'D20', 'Vimshamsha');
    renderDivisionalChart(positions, lagnaSidereal, 24, 'd24Chart', 'd24InterpWrap', 'D24', 'Chaturvimshamsha');
    renderDivisionalChart(positions, lagnaSidereal, 27, 'd27Chart', 'd27InterpWrap', 'D27', 'Saptavimshamsha');
    renderDivisionalChart(positions, lagnaSidereal, 30, 'd30Chart', 'd30InterpWrap', 'D30', 'Trimshamsha');
    renderDivisionalChart(positions, lagnaSidereal, 40, 'd40Chart', 'd40InterpWrap', 'D40', 'Khavedamsha');
    renderDivisionalChart(positions, lagnaSidereal, 45, 'd45Chart', 'd45InterpWrap', 'D45', 'Akshavedamsha');
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
    html += '<th>Planet</th><th>Sign</th><th>Degree</th><th>Nakshatra</th><th>House</th>';
    html += '</tr></thead><tbody>';

    // Add Lagna first with exact degree
    const lagnaDeg = lagnaSidereal % 30;
    const lagnaNakIdx = Math.floor(lagnaSidereal / (360/27));
    const lagnaNak = NAKSHATRAS[lagnaNakIdx] || {ko:'-'};
    html += `<tr><td>⬆ Lagna (상승궁)</td><td>${SIGN_SYMBOLS[lagnaSign]} ${SIGNS[lagnaSign]}</td><td>${lagnaDeg.toFixed(1)}°</td><td>${lagnaNak.ko}</td><td>1</td></tr>`;

    positions.forEach(p => {
        const house = ((p.sign - lagnaSign + 12) % 12) + 1;
        const nak = NAKSHATRAS[p.nakshatra] || { ko: '-', name: '-' };
        const roleMap = { Sun:'Self/Authority', Moon:'Emotions/Mind', Mars:'Energy/Courage', Mercury:'Intelligence/Communication', Jupiter:'Luck/Wisdom', Venus:'Love/Charm', Saturn:'Patience/Responsibility', Rahu:'Desire/Innovation', Ketu:'Spirituality/Liberation' };
        const houseArea = ['','Self','Money·Family','Communication','Home','Children·Romance','Health','Spouse','Transformation','Fortune·Foreign','Career','Income','Spirituality'];
        html += `<tr>
            <td>${p.symbol} ${p.name}<br><span style="color:#666;font-size:10px;">${roleMap[p.id]||''}</span></td>
            <td>${SIGN_SYMBOLS[p.sign]} ${SIGNS[p.sign]}</td>
            <td>${p.degree.toFixed(1)}°</td>
            <td>${nak.ko}</td>
            <td>${house}<br><span style="color:#666;font-size:10px;">${houseArea[house]||''}</span></td>
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
                cell.innerHTML = row === 1 && col === 1 ? '<div style="color:#c9a84c;font-size:10px;">D1<br>라시</div>' : '';
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
    // Navamsa: 각 사인(30도)을 9등분(3.333...도), 파다에 따라 사인 배정
    // 불의 사인(0,4,8=Aries,Leo,Sagittarius): Aries부터 시작
    // 흙의 사인(1,5,9=Taurus,Virgo,Capricorn): Capricorn자리부터 시작
    // 바람의 사인(2,6,10=Gemini,Libra,Aquarius): Libra자리부터 시작
    // 물의 사인(3,7,11=게,Scorpio,Pisces): 게자리부터 시작
    const sign = Math.floor(siderealLon / 30);
    const degInSign = siderealLon % 30;
    const pada = Math.floor(degInSign / (30/9)); // 0~8
    const element = sign % 4; // 0=fire, 1=earth, 2=air, 3=water
    const startSign = [0, 9, 6, 3][element]; // Aries,Capricorn,Libra,Cancer
    return (startSign + pada) % 12;
}

function renderD9Chart(positions, lagnaSign, lagnaSidereal) {
    // D9 Lagna 계산
    const d9LagnaSign = getNavamsaSign(lagnaSidereal);

    // D9 행성 position
    const d9Positions = positions.map(p => ({
        ...p,
        d9Sign: getNavamsaSign(p.sidereal)
    }));

    // 차트 그리기 (D1과 같은 남인도식)
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

    // D9 해석
    renderD9Interpretation(d9Positions, d9LagnaSign, lagnaSign);
}

function renderD9Interpretation(d9Positions, d9LagnaSign, d1LagnaSign) {
    const SIGN_RULERS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
    const RULER_NAMES = {Sun:'Sun',Moon:'Moon',Mars:'Mars',Mercury:'Mercury',Jupiter:'Jupiter',Venus:'Venus',Saturn:'Saturn',Rahu:'Rahu',Ketu:'Ketu'};
    const isEasy = window.vedicMode === 'easy';

    function d9HouseOf(signIdx) { return ((signIdx - d9LagnaSign + 12) % 12) + 1; }
    function d9PlanetsInHouse(h) { return d9Positions.filter(p => d9HouseOf(p.d9Sign) === h); }

    // D9 7 house (spouse)
    const d9H7Sign = (d9LagnaSign + 6) % 12;
    const d9H7Ruler = SIGN_RULERS[d9H7Sign];
    const d9H7Planets = d9PlanetsInHouse(7);

    // D9 10 house (사명/dharma career)
    const d9H10Sign = (d9LagnaSign + 9) % 12;
    const d9H10Ruler = SIGN_RULERS[d9H10Sign];
    const d9H10Planets = d9PlanetsInHouse(10);

    // Spouse의 10 house (파생하우스: 7 house서 10번째 = D9 4궁)
    const spouseH10 = 4; // 10th from 7th
    const d9H4Sign = (d9LagnaSign + 3) % 12;
    const d9H4Ruler = SIGN_RULERS[d9H4Sign];
    const d9H4Planets = d9PlanetsInHouse(4);

    // D9 1 house (결혼 후 본인)
    const d9H1Planets = d9PlanetsInHouse(1);

    // 사인별 career 경향
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

    // 행성별 spouse career 경향
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

    // 1. D9 Lagna 분석 (결혼 후 본인)
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '🕉️ You After Marriage' : '🕉️ D9 Lagna — You After Marriage: ' + SIGNS[d9LagnaSign] + ' ' + SIGN_SYMBOLS[d9LagnaSign]}</div>
        <div class="interp-text">
            ${isEasy ? 'This reveals your true self after marriage and in the second half of life (after 30s).' : 'Navamsa Lagna is in <strong>' + SIGNS[d9LagnaSign] + '</strong>에 있습. This is 결혼 후, 그리고 인생 후반(30대 이후)에 드러나는 Your 진짜 모습입.'}
            ${d9LagnaSign === d1LagnaSign ? (isEasy ? '<br><br><strong>특별한 표시!</strong> Your 본질이 결혼 후에도 변하지 않으며, 내면과 외면이 일치하는 사람입.' : '<br><br><strong>D1 and D9 Lagna in same sign!</strong> Called <strong>Vargottama</strong> — very powerful. Your essence remains unchanged after marriage.') : ''}
            ${d9H1Planets.length > 0 ? '<br><br>' + (isEasy ? 'There are energies that strongly influence your personality after marriage.' : '<strong>Planets in D9 1st:</strong> ' + d9H1Planets.map(p => p.symbol + ' ' + p.name).join(', ') + ' — strongly influence your personality after marriage.') : ''}
        </div>
    </div>`;

    // 2. D9 7 house (spouse)
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '💍 Spouse Character' : '💍 D9 7th House — Spouse Character: ' + SIGNS[d9H7Sign] + ' ' + SIGN_SYMBOLS[d9H7Sign]}</div>
        <div class="interp-text">
            ${isEasy ? ((careerBySgn[d9H7Sign]||'').split(/[（(]/)[1]?.replace(/[）)]/,'') || 'unique charm') + ' quality partner.' : 'Navamsa 7th house is in <strong>' + SIGNS[d9H7Sign] + '</strong>, ruled by <strong>' + RULER_NAMES[d9H7Ruler] + '</strong>.<br><br>This reveals your spouse\'s core personality. ' + SIGNS[d9H7Sign] + ' energy partner — ' + ((careerBySgn[d9H7Sign]||'').split(/[（(]/)[1]?.replace(/[）)]/,'') || 'unique charm') + ' qualities.'}
            ${d9H7Planets.length > 0 ? '<br><br>' + (isEasy ? d9H7Planets.map(p => p.natural === 'benefic' ? 'Positive energy! You receive blessings from your spouse.' : 'Challenge energy — also opportunities for growth in marriage.').join('<br>') : '<strong>Planets in D9 7th:</strong><br>' + d9H7Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${p.natural === 'benefic' ? 'Benefic! Blessings from your spouse.' : 'Challenge energy — also opportunities for growth in marriage.'}`).join('<br>')) : ''}
        </div>
    </div>`;

    // 3. D9 10 house (본인의 Dharma/사명)
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '💼 Life Purpose' : '💼 D9 10th House — Life Purpose (Dharma): ' + SIGNS[d9H10Sign] + ' ' + SIGN_SYMBOLS[d9H10Sign]}</div>
        <div class="interp-text">
            ${isEasy ? 'The true calling you pursue after maturity.' : 'Navamsa 10th house is in <strong>' + SIGNS[d9H10Sign] + '</strong>, ruled by <strong>' + RULER_NAMES[d9H10Ruler] + '</strong>.<br><br>While D1\'s 10th shows your career, D9\'s 10th reveals your <strong>greater life purpose (Dharma)</strong>.'}<br><br>
            <strong>사명의 방향:</strong> ${careerBySgn[d9H10Sign]}
            ${d9H10Planets.length > 0 ? '<br><br>' + (isEasy ? d9H10Planets.map(p => planetCareer[p.id] || 'unique career energy').join('<br>') : '<strong>Planets in D9 10th:</strong><br>' + d9H10Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${planetCareer[p.id] || 'unique career energy'}`).join('<br>')) : ''}
        </div>
    </div>`;

    // 4. spouse의 career (파생하우스: D9 4 house = 7 house서 10번째)
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '👔 Spouse Career' : '👔 Spouse Career — Derived 10th (D9 4th): ' + SIGNS[d9H4Sign] + ' ' + SIGN_SYMBOLS[d9H4Sign]}</div>
        <div class="interp-text">
            ${isEasy ? '' : '<strong>Derived house:</strong> 10th from 7th (spouse) = D9 4th house shows spouse career.<br><br>D9 4th is in <strong>' + SIGNS[d9H4Sign] + '</strong>, ruled by <strong>' + RULER_NAMES[d9H4Ruler] + '</strong>.<br><br>'}
            <strong>Spouse career tendency:</strong> ${careerBySgn[d9H4Sign]}
            ${d9H4Planets.length > 0 ? '<br><br>' + (isEasy ? d9H4Planets.map(p => `spouse가 ${planetCareer[p.id] || 'specialized field'} 분야에서 활동할 가능성`).join('<br>') : '<strong>Planets in D9 4th (spouse 10th):</strong><br>' + d9H4Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: spouse가 ${planetCareer[p.id] || 'specialized field'} 분야에서 활동할 가능성`).join('<br>')) : ''}
        </div>
    </div>`;

    // 5. 바르고타마 행성 체크
    const vargottamaPlanets = d9Positions.filter(p => p.sign === p.d9Sign);
    if (vargottamaPlanets.length > 0) {
        html += `<div class="interp-card">
            <div class="interp-title">${isEasy ? '⭐ Exceptionally Strong Planets' : '⭐ Vargottama Planets — Exceptionally Strong'}</div>
            <div class="interp-text">
                ${isEasy ? 'These planets are exceptionally powerful and act consistently throughout life.' : 'Planets in the same sign in both D1 and D9 are called <strong>Vargottama</strong>. Very powerful, acting consistently throughout life.'}<br><br>
                ${isEasy ? 'Exceptionally strong energy acts consistently throughout your life!' : vargottamaPlanets.map(p => `<strong>${p.symbol} ${p.name}</strong>: D1과 D9 both ${SIGNS[p.sign]}에 position — 이 행성의 에너지가 특별히 강합니다!`).join('<br>')}
            </div>
        </div>`;
    }

    // 6. spouse 방향 분석 (UL + A7 + D1 7 house + D9 7 house 종합)
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

    // Arudha Pada 계산 함수
    function calcArudha(houseNum, lagnaS, pos) {
        const houseSign = (lagnaS + houseNum - 1) % 12;
        const ruler = SIGN_RULERS[houseSign];
        const rulerPlanet = pos.find(p => p.id === ruler);
        if (!rulerPlanet) return houseSign;
        const rulerSign = rulerPlanet.sign;
        const dist = ((rulerSign - houseSign) + 12) % 12;
        let arudhaSign = (rulerSign + dist) % 12;
        // 예외: 아루다가 같은 사인이거나 7번째이면 10번째로
        if (arudhaSign === houseSign || arudhaSign === (houseSign + 6) % 12) {
            arudhaSign = (houseSign + 9) % 12;
        }
        return arudhaSign;
    }

    // D1에서의 원래 positions 사용 (d9Positions에는 d1 sign도 있음)
    const d1Positions = d9Positions; 

    // UL (Upapada Lagna) = 12 house 아루다
    const ulSign = calcArudha(12, d1LagnaSign, d1Positions);

    // A7 (Darapada) = 7 house 아루다
    const a7Sign = calcArudha(7, d1LagnaSign, d1Positions);

    // D1 7 house 사인
    const d1H7Sign = (d1LagnaSign + 6) % 12;

    // D9 7 house 주인의 D9 position
    const d9H7RulerPlanet = d9Positions.find(p => p.id === d9H7Ruler);
    const d9H7RulerSign = d9H7RulerPlanet ? d9H7RulerPlanet.d9Sign : d9H7Sign;

    // D9 Venus(Venus) position — spouse의 karaka(상징 행성)
    const venusD9 = d9Positions.find(p => p.id === 'Venus');
    const venusD9Sign = venusD9 ? venusD9.d9Sign : 0;

    // 방향 집계 — 6가지 지표
    const dirSources = [
        {name:'D1 7th', sign: d1H7Sign, desc:'Spouse house in birth chart'},
        {name:'D9 7th', sign: d9H7Sign, desc:'Spouse house in Navamsa'},
        {name:'D9 7th Lord', sign: d9H7RulerSign, desc:'Where D9 7th lord goes'},
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
        <div class="interp-title">${isEasy ? '🧭 Where Your Spouse Comes From' : '🧭 Spouse Direction — 6-Indicator Analysis'}</div>
        <div class="interp-text">
            ${isEasy ? 'Analysis of which direction your spouse may come from.' : 'Vedic astrology determines spouse direction by combining multiple indicators.'}<br><br>
            ${isEasy ? '' : '<strong>6 Indicators:</strong><br>' + dirSources.map(s => `• <strong>${s.name}</strong>: ${SIGNS[s.sign]} ${SIGN_SYMBOLS[s.sign]} → <strong>${DIRECTIONS[s.sign]}</strong> <span style="color:#666;font-size:12px;">(${s.desc})</span>`).join('<br>') + '<br><br><strong>🧿 우파파다 Lagna(UL):</strong> 12 house 아루다 파다. spouse의 가문/배경과 결혼의 환경을 나타냅. → <strong>' + SIGNS[ulSign] + ' ' + SIGN_SYMBOLS[ulSign] + '</strong><br><strong>🎯 다라파다(A7):</strong> 7 house 아루다 파다. spouse의 사회적 이미지와 외적 인상을 나타냅. → <strong>' + SIGNS[a7Sign] + ' ' + SIGN_SYMBOLS[a7Sign] + '</strong><br><strong>💍 D9 7 lord(' + RULER_NAMES[d9H7Ruler] + '):</strong> Navamsa 7 house 주인이 가는 사인이 spouse의 실질적 방향을 나타냅. → <strong>' + SIGNS[d9H7RulerSign] + ' ' + SIGN_SYMBOLS[d9H7RulerSign] + '</strong><br><strong>♀ D9 Venus:</strong> spouse의 karaka(상징 행성). Venus의 Navamsa position가 spouse 에너지의 근원지입. → <strong>' + SIGNS[venusD9Sign] + ' ' + SIGN_SYMBOLS[venusD9Sign] + '</strong><br><br>'}
            <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:14px;margin-top:10px;">
                <strong style="font-size:16px;">🧭 Conclusion: ${agreement >= 4 ? 'Overwhelmingly strong' : agreement >= 3 ? 'Very strong' : agreement >= 2 ? '강한' : ''} ${primaryDir} 방향</strong><br><br>
                Out of 6 indicators <strong>${agreement}</strong> point to <strong>${primaryDir}</strong>을 가리키고 있습.
                ${agreement >= 4 ? '<br>4+ indicators agree! <strong>매우 높은 확률</strong>로 ' + primaryDir + ' direction. Pay attention to cities, workplaces, or travels in this direction.' : ''}
                ${agreement === 3 ? '<br>3 indicators — <strong>높은 확률</strong>로 ' + primaryDir + ' direction.' : ''}
                ${agreement === 2 ? '<br>2 indicators — ' + primaryDir + ' favored but other possibilities exist.' : ''}
                ${agreement <= 1 ? '<br>지표가 분산되어 있어 특정 방향보다는 다양한 경로에서 만남이 올 수 있습. 열린 마음으로 인연을 기다리세요.' : ''}
                ${sortedDirs.length > 1 && sortedDirs[1][1] === sortedDirs[0][1] ? '<br><br>💡 Two directions equally: <strong>' + sortedDirs[0][0] + '</strong> and <strong>' + sortedDirs[1][0] + '</strong> both possible.' : ''}
            </div>
        </div>
    </div>`;

    document.getElementById('d9InterpWrap').innerHTML = html;

    // Spouse 프로필은 별도 함수로
    renderSpouseProfile(d1LagnaSign, ulSign, a7Sign, venusD9Sign);
}

function renderSpouseProfile(d1LagnaSign, ulSign, a7Sign, venusD9Sign) {
    const isEasy = window.vedicMode === 'easy';
    let html = '';
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

    // D1 7 house 사인으로 만남 환경
    const d1H7ForMeeting = (d1LagnaSign + 6) % 12;

    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '🤝 Meeting Environment' : '🤝 Meeting Environment — D1 7th: ' + SIGNS[d1H7ForMeeting] + ' ' + SIGN_SYMBOLS[d1H7ForMeeting]}</div>
        <div class="interp-text">
            ${isEasy ? '' : '7 house 사인이 spouse와의 만남의 환경과 방식을 나타냅.<br><br>'}
            <strong>${meetingBySgn[d1H7ForMeeting]}</strong>
            ${d1H7ForMeeting === 8 || d1H7ForMeeting === 11 ? '<br><br>💡 <strong>해외 인연 가능성!</strong> spouse가 외국인이거나 해외에서 만날 가능성이 있습.' : ''}
        </div>
    </div>`;

    // UL 사인으로 spouse 가문/배경
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '🏛️ Spouse Family Background' : '🏛️ Spouse Background — UL: ' + SIGNS[ulSign] + ' ' + SIGN_SYMBOLS[ulSign]}</div>
        <div class="interp-text">
            ${isEasy ? '' : '우파파다 Lagna(UL)는 spouse의 가정환경과 성장 배경을 나타냅.<br><br>'}
            <strong>${backgroundBySgn[ulSign]}</strong>
        </div>
    </div>`;

    // A7 사인으로 spouse 외적 이미지
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '👤 Spouse First Impression' : '👤 Spouse First Impression — A7: ' + SIGNS[a7Sign] + ' ' + SIGN_SYMBOLS[a7Sign]}</div>
        <div class="interp-text">
            ${isEasy ? '' : '다라파다(A7)는 spouse가 세상에 보여주는 외적 이미지, first impression을 나타냅.<br><br>'}
            <strong>${imageBySgn[a7Sign]}</strong>
        </div>
    </div>`;

    // D9 Venus 사인으로 spouse 매력 포인트
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '💎 Spouse Attraction Point' : '💎 Spouse Attraction — D9 Venus: ' + SIGNS[venusD9Sign] + ' ' + SIGN_SYMBOLS[venusD9Sign]}</div>
        <div class="interp-text">
            ${isEasy ? '' : 'Navamsa의 Venus position는 spouse의 핵심 매력과 사랑의 스타일을 나타냅.<br><br>'}
            <strong>${attractBySgn[venusD9Sign]}</strong>
        </div>
    </div>`;

    document.getElementById('spouseProfileWrap').innerHTML = html;
}

function renderNakshatra(moonPos) {
    if (!moonPos) return;
    const nak = NAKSHATRAS[moonPos.nakshatra];
    if (!nak) return;
    const isEasy = window.vedicMode === 'easy';

    const html = isEasy ? `
        <div class="nakshatra-card">
            <div class="nakshatra-name">Your 별: ${nak.ko}</div>
            <div class="nakshatra-meaning">"${nak.meaning}"</div>
            <div class="nakshatra-detail">${nak.desc}</div>
        </div>
    ` : `
        <div class="nakshatra-card">
            <div class="nakshatra-name">${nak.ko} (${nak.name})</div>
            <div class="nakshatra-meaning">"${nak.meaning}" — Ruling Planet: ${DASHA_KO[nak.ruler] || nak.ruler}</div>
            <div class="nakshatra-detail">
                신성: ${nak.deity}<br><br>
                ${nak.desc}
            </div>
        </div>
    `;
    document.getElementById('nakshatraWrap').innerHTML = html;
}

function renderDasha(moonNakshatra, birthDate, moonSidereal) {
    const nak = NAKSHATRAS[moonNakshatra];
    if (!nak) return;

    // Find starting dasha from nakshatra ruler
    const startRuler = nak.ruler;
    let startIdx = DASHA_ORDER.indexOf(startRuler);
    if (startIdx === -1) startIdx = 0;

    // Calculate remaining portion of first dasha
    // Each nakshatra spans 13°20' (13.3333°). Moon's position within nakshatra determines elapsed portion.
    const nakSpan = 360 / 27; // 13.3333°
    const moonInNak = moonSidereal - (moonNakshatra * nakSpan); // degree within current nakshatra
    const elapsedFraction = moonInNak / nakSpan; // 0~1, how much of nakshatra has passed
    const firstDashaYears = DASHA_YEARS[startRuler];
    const remainingYears = firstDashaYears * (1 - elapsedFraction); // remaining portion of first dasha
    const remainingDays = remainingYears * 365.25;

    // Helper: add days to date
    function addDays(date, days) {
        const d = new Date(date);
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        return d;
    }

    // Helper: format date
    function fmtDate(d) {
        return d.getFullYear() + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + String(d.getDate()).padStart(2,'0');
    }

    // Helper: calculate age
    function getAge(d) {
        const diff = d.getTime() - birthDate.getTime();
        return (diff / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1);
    }

    const now = new Date();
    let currentDate = new Date(birthDate);

    const isEasy = window.vedicMode === 'easy';
    let html = isEasy ?
        '<div class="interp-card" style="margin-bottom:12px;border-left:3px solid #c9a84c;"><div class="interp-text" style="font-size:12px;color:#888;">💡 인생은 시기별로 다른 에너지가 흐릅. 아래에서 지금 당신이 어떤 시기에 있는지, 앞으로 어떤 시기가 오는지 확인하세요.<br><br>' :
        '<div class="interp-card" style="margin-bottom:12px;border-left:3px solid #c9a84c;"><div class="interp-text" style="font-size:12px;color:#888;">💡 <strong>빔쇼타리 대운(Vimshottari Dasha)</strong> — Life is divided into periods ruled by 9 planets. <strong>Mahadasha</strong> is the major period, <strong>Antardasha (Bhukti)</strong> is the sub-period. Calculated from Moon nakshatra position.<br><br>';
    html += isEasy ?
        '</div></div>' :
        '🌙 Birth Moon: <strong>' + nak.ko + ' (' + nak.name + ')</strong> — First Dasha: <strong>' + DASHA_KO[startRuler] + '</strong> (remaining: ' + remainingYears.toFixed(2) + ' yrs)</div></div>';

    // Build all mahadasha periods with correct first period
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
        const dashaEasyDesc = {Ketu:'Inner reflection & spiritual growth',Venus:'Love, beauty & abundance',Sun:'Confidence & leadership shines',Moon:'Emotions & home take center stage',Mars:'Challenges & action energy',Rahu:'Big changes & new opportunities',Jupiter:'Luck & growth arrive',Saturn:'Patience brings great rewards',Mercury:'Study, communication & business thrive'};
        html += '<span class="dasha-planet">' + (isEasy ? dashaEasyDesc[p.planet] : DASHA_KO[p.planet]) + '</span>';
        html += '<span class="dasha-period">' + fmtDate(p.startD) + ' ~ ' + fmtDate(p.endD) + '</span>';
        html += '<span class="dasha-years">' + (p.actualDays / 365.25).toFixed(1) + ' yrs</span>';
        if (isCurrent) html += '<span class="dasha-badge">Current</span>';
        html += '<span style="font-size:10px;color:#666;margin-left:4px;">(' + age + '세) ▼</span>';

        // Antardasha (Bhukti) - sub-periods within this mahadasha
        html += '<div class="bhukti-list" style="display:' + (isCurrent ? '' : 'none') + ';margin-top:8px;padding-top:8px;border-top:1px solid #2a2a5a;">';

        const mahaDays = p.actualDays;
        const mahaYears = p.fullYears;
        let bhuktiDate = new Date(p.startD);
        const bhuktiStartIdx = DASHA_ORDER.indexOf(p.planet);

        for (let j = 0; j < 9; j++) {
            const bIdx = (bhuktiStartIdx + j) % 9;
            const bPlanet = DASHA_ORDER[bIdx];
            const bFullDays = (DASHA_YEARS[p.planet] * DASHA_YEARS[bPlanet] / 120) * 365.25;
            // Scale to actual mahadasha length (for first partial mahadasha)
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
    // Helper: get house number from sign
    function houseOf(signIdx) { return ((signIdx - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }
    const isEasy = window.vedicMode === 'easy';

    let html = '';

    // ═══════════════════════════════════
    // 1. 성격 & appearance (1 house Lagna)
    // ═══════════════════════════════════
    const lagnaEasy = [
        'Action-oriented! Quick to decide with natural leadership qualities. You love new challenges. People often ask you to take the lead. A bit impatient, but incredibly driven.',
        'You love stability. You enjoy comfort, beauty, and good food. Once you make up your mind, you see it through. Stubborn, but that makes you incredibly reliable.',
        'Curious about everything! Great communicator and multi-talented. You pick up new information fast and draw people in with your wit. Sometimes scattered, but that\'s part of your charm.',
        'Warm and emotional. You treasure family and read people\'s feelings well. A natural caregiver who makes everyone feel comfortable. Mood swings happen, but your empathy is your superpower.',
        'Born leader! You have a big presence and naturally draw attention. Confident and magnetic. You crave recognition, but you\'re equally generous with love and praise.',
        'Detail-oriented and analytical. You strive for perfection and care about health. Sharp observer who catches what others miss. You worry a bit much, but that means you\'re always prepared.',
        'You seek harmony. Refined, charming, with excellent artistic taste. A natural peacemaker who hates conflict. Happiest when surrounded by beautiful things.',
        'You have depth. Strong intuition that cuts through to the truth. Calm on the surface but intense emotions underneath. Life throws big changes at you, and each one makes you stronger.',
        'Free spirit! You love travel and learning. Positive and philosophical. Interested in different cultures, with a broad worldview. Your humor lights up any room.',
        'Ambitious. Patient and increasingly attractive with age. Systematically works toward goals. Even if you struggle early on, you\'re the late-bloomer type who eventually gets everything they want.',
        'Unique. You think differently from everyone else and you\'re innovative. You hate being boxed in and want to change the world in your own way. Talented in tech or science.',
        'Deeply sensitive. Strong intuition drawn to art and spirituality. Vivid dreams and rich imagination. You empathize deeply with others\' pain. Your inner world is richer than the outer one.'
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
        <div class="interp-title">👤 ${isEasy ? 'Your Personality' : 'Personality & Appearance — Lagna: ' + SIGNS[lagnaSign] + ' ' + SIGN_SYMBOLS[lagnaSign]}</div>
        <div class="interp-text">${isEasy ? lagnaEasy[lagnaSign] : lagnaInterp[lagnaSign]}</div>
    </div>`;

    // ═══════════════════════════════════
    // 2. 내면 & 감정 (Moon 별자리)
    // ═══════════════════════════════════
    if (moonPos) {
        const moonEasy = [
            'There\'s a fiery passion inside you. Emotions rise fast and cool down fast. When you\'re stressed, you need to move your body — exercise or outdoor activities work best.',
            'You\'re emotionally very stable. You dislike sudden changes and find comfort in the familiar. Good food, music, and beautiful nature heal your soul. Once you give your heart, it rarely changes.',
            'You process emotions through conversation. Talking things out makes you feel better. You\'re curious about everything and can\'t stand boredom. Your humor can lighten any mood.',
            'You\'re extremely sensitive and empathetic. You absorb others\' emotions like a sponge. Home is your safe space, and your bond with your mother is strong. Cooking or decorating brings emotional peace.',
            'Your emotional expression is dramatic and passionate. You deeply need to be loved and recognized. But you give love just as generously. Creative activities — art, writing, music — are your emotional medicine.',
            'You tend to analyze your emotions. You worry a lot but are great at solving problems practically. Daily routines — morning exercise, healthy meals, organizing — bring emotional stability.',
            'You find emotional balance in relationships. You feel lonely when alone and stabilize when with close friends or a partner. You deeply hate conflict and find peace in beauty and art.',
            'Your emotions are as deep and intense as the ocean. You love deeply and never forget betrayal. Your intuition is incredibly strong — you read truth through eyes and actions, not words.',
            'You\'re emotionally bright and optimistic. You love freedom and hate being constrained. Travel is your best emotional remedy. You process feelings through philosophical thinking.',
            'You don\'t show emotions easily. Strong sense of responsibility, always putting duty first. You may have been mature beyond your years as a child, but you grow more emotionally open with age.',
            'You have unique, unpredictable emotional patterns. You love in unconventional ways and see the bigger picture. You find emotional fulfillment in social causes and community activities.',
            'You\'re extremely intuitive and spiritual. Your dreams are vivid and sometimes feel prophetic. You deeply empathize with others\' pain. Art, meditation, and being near water bring you peace.'
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
            <div class="interp-title">🌙 ${isEasy ? 'Your Emotional Style' : 'Inner Self & Emotions — Moon: ' + SIGNS[moonPos.sign] + ' ' + SIGN_SYMBOLS[moonPos.sign]}</div>
            <div class="interp-text">${isEasy ? moonEasy[moonPos.sign] : moonInterp[moonPos.sign]}</div>
        </div>`;
    }

    // ═══════════════════════════════════
    // 3. 💰 wealth운 (2궁, 11 house 분석)
    // ═══════════════════════════════════
    const h2planets = planetsInHouse(2);
    const h11planets = planetsInHouse(11);
    const h2sign = (lagnaSign + 1) % 12;
    const h11sign = (lagnaSign + 10) % 12;

    let wealthText = isEasy ? '' : `<strong>2 house (축적된 재산):</strong> ${SIGNS[h2sign]}에 position. `;
    if (h2planets.length === 0) {
        wealthText += isEasy ? 'Wealth accumulation is steady and stable. 큰 변동 없이 차곡차곡 모이는 타입이에요. ' : 'No planets in 2nd — steady wealth accumulation. ';
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

    wealthText += isEasy ? '<br><br>' : `<br><br><strong>11 house (수입과 이익):</strong> ${SIGNS[h11sign]}에 position. `;
    if (h11planets.length === 0) {
        wealthText += isEasy ? 'Income is stable but without major fluctuations.' : 'No planets in 11th — stable income without major changes.';
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
        <div class="interp-title">💰 ${isEasy ? 'My Wealth Fortune' : 'Wealth Fortune'}</div>
        <div class="interp-text">${wealthText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 4. 💕 spouse & Marriage Fortune (7 house 분석)
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

    const spouseAppearance = [
        'Sharp features, strong impression. Athletic build. Intense eyes full of energy. Red tones suit well. Active, dynamic vibe.',
        'Soft, attractive appearance. Full figure with sensual lips. Good skin with natural beauty. Warm, comfortable impression.',
        'Youthful appearance, bright impression. Slim and tall. Expressive face with sparkling eyes. Trendy and stylish.',
        'Round face, soft impression. Slightly curvy figure. Fair skin with large eyes. Motherly vibe. More attractive at home.',
        'Dignified build with charismatic appearance. Rich hair is a feature. Commanding presence, well-dressed. Draws attention everywhere.',
        'Neat, clean appearance. Lean with good proportions. Intellectual impression. Minimal fashion, cleanliness is charm.',
        'Balanced appearance, refined impression. Symmetrical face. Charming smile, social vibe. Always well-dressed. May have dimples.',
        'Sharp, mysterious appearance. Deep eyes leave strong impression. Lean with sharp features. Prefers dark tones. Hidden sexiness.',
        'Tall with good build. Bright, open impression. Exotic charm. Casual, free clothing. Attractive smile, sporty style.',
        'Serious, mature appearance. Lean with defined bone structure. Looks older than age but grows more attractive over time. Classic suit style.',
        'Unique, extraordinary appearance. Distinctive fashion. Tall or with notable features. Unconventional charm. Futuristic style.',
        'Soft, dreamy appearance. Large eyes with dreamy expression. Slightly plump with translucent skin. Pastel tones suit. Mystical charm.'
    ];

    let spouseText = (isEasy ? '' : '<strong>📐 spouse Appearance & First Impression:</strong><br>') + spouseAppearance[h7sign] + (isEasy ? '<br><br>' : isEasy ? '<br><br>' : '<br><br><strong>📋 spouse 성격:</strong><br>') + spouseSign[h7sign];

    if (h7planets.length > 0) {
        spouseText += isEasy ? '<br><br>' : '<br><br><strong>7 house 행성:</strong> ';
        h7planets.forEach(p => {
            const pH7 = {
                'Sun': 'Spouse is socially recognized. May be somewhat dominant but a respectable partner.',
                'Moon': 'An emotional and caring spouse. Marriage life with deep emotional connection.',
                'Mars': 'Passionate but may have frequent arguments. A strong-willed spouse. Energetic relationship.',
                'Mercury': 'An intellectual spouse with great conversation. A good relationship as business partners too.',
                'Jupiter': 'Most blessed placement! A wise and moral spouse. Happy married life. Luck through spouse.',
                'Venus': 'A very attractive and loving spouse. Romantic married life. May enjoy luxury.',
                'Saturn': 'Late marriage or spouse with significant age difference. Difficult early on but stable, long-lasting marriage.',
                'Rahu': 'Unconventional marriage. Spouse from foreign country or different background. Sudden meeting.',
                'Ketu': 'Past-life connection. Strong spiritual bond but some distance in worldly relationships.'
            };
            spouseText += isEasy ? `<br>${pH7[p.id] || ''}` : `<br>${p.symbol} ${p.name}: ${pH7[p.id] || ''}`;
        });
    }

    if (venus) {
        const venusHouse = houseOf(venus.sign);
        spouseText += isEasy ? '<br><br>' : `<br><br><strong>Venus position (${venusHouse}궁):</strong> `;
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
        <div class="interp-title">${isEasy ? '💍 My Spouse' : '💕 spouse & Marriage Fortune — 7궁: ' + SIGNS[h7sign] + ' ' + SIGN_SYMBOLS[h7sign]}</div>
        <div class="interp-text">${spouseText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 5. 💼 career & 사회적 성취 (10 house 분석)
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

    let careerText = isEasy ? careerSign[h10sign] : `10th house is in ${SIGNS[h10sign]}에 position. ${careerSign[h10sign]}`;

    if (h10planets.length > 0) {
        careerText += isEasy ? '<br><br>' : '<br><br><strong>10 house 행성:</strong>';
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
        <div class="interp-title">${isEasy ? '💼 My Career' : '💼 career & 사회적 성취 — 10궁: ' + SIGNS[h10sign] + ' ' + SIGN_SYMBOLS[h10sign]}</div>
        <div class="interp-text">${careerText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 6. 🏥 health (6 house + Lagna 분석)
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
        <div class="interp-title">${isEasy ? '🏥 My Health' : '🏥 health — 취약 부위'}</div>
        <div class="interp-text">${healthByLagna[lagnaSign]}${h6planets.length > 0 ? isEasy ? '<br><br>Special health attention needed.' : '<br><br>6 house ' + h6planets.map(p => p.name).join(', ') + ' requires special attention to health.' : ''}</div>
    </div>`;

    // ═══════════════════════════════════
    // 7. ⏳ 현재 대운 해석
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
                    <div class="interp-title">${isEasy ? '⏳ Current Period: ' + DASHA_KO[currentDasha] : '⏳ Current Dasha: ' + DASHA_KO[currentDasha] + ' Dasha'}</div>
                    <div class="interp-text">${dashaInterp[currentDasha]}</div>
                </div>`;
            }
        }
    }

    // ═══════════════════════════════════
    // 8. 🔮 특별 요가 (행성 조합)
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
            yogaText += isEasy ? '<strong>🐘 지혜와 명성의 축복</strong>' : '<strong>🐘 가자케사리 요가 (Gajakesari)</strong> — Moon과 Jupiter이 켄드라 관계! 지혜, 명성, 풍요의 조합. 사회적으로 존경받고 지적 능력이 뛰어납. 좋은 교육과 children 운.<br><br>';
        }
    }

    // Budha-Aditya Yoga
    const sun = positions.find(p => p.id === 'Sun');
    const mercury = positions.find(p => p.id === 'Mercury');
    if (sun && mercury && sun.sign === mercury.sign) {
        yogaText += isEasy ? '<strong>📚 뛰어난 지성의 축복</strong>' : '<strong>📚 부다-아디티야 요가</strong> — Sun과 Mercury이 같은 별자리! 뛰어난 지성과 소통 능력. 교육, 글쓰기, 비즈니스에서 성공. 권위 있는 지적 리더.<br><br>';
    }

    // Chandra-Mangala Yoga
    if (moonPos && mars && moonPos.sign === mars.sign) {
        yogaText += isEasy ? '<strong>🔥 강한 의지와 wealth의 축복</strong>' : '<strong>🔥 찬드라-망갈라 요가</strong> — Moon과 Mars이 같은 별자리! 강한 의지와 wealth 축적 능력. 사업에서 성공하며 대담한 결정을 내립.<br><br>';
    }

    // Kuja Dosha (Manglik)
    if (mars) {
        const marsH = houseOf(mars.sign);
        if ([1,2,4,7,8,12].includes(marsH)) {
            yogaText += isEasy ? `<strong>⚠️ 결혼 시 주의사항</strong>` : `<strong>⚠️ 쿠자 도샤 (망갈리크)</strong> — Mars이 ${marsH} house position하여 결혼 생활에 도전이 있을 수 있습. spouse 선택 시 상대의 차트도 확인하는 것이 좋습. 28세 이후 결혼이 유리할 수 있습.<br><br>`;
        }
    }

    if (yogaText) {
        html += `<div class="interp-card">
            <div class="interp-title">${isEasy ? '🔮 Your 특별한 재능' : '🔮 특별 요가 (행성 조합)'}</div>
            <div class="interp-text">${yogaText}</div>
        </div>`;
    }

    document.getElementById('interpWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// 행성별 하우스 상세 해석
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
    const isEasy = window.vedicMode === 'easy';
    const houseArea = ['','Self','Money·Family','Communication','Home','Children·Romance','Health','Spouse','Transformation','Fortune·Foreign','Career','Income','Spirituality'];
    let html = '';

    positions.forEach(p => {
        if (!PLANET_IN_HOUSE[p.id]) return;
        const house = houseOf(p.sign);
        const desc = PLANET_IN_HOUSE[p.id][house - 1];
        if (!desc) return;

        html += `<div class="interp-card">
            <div class="interp-title">${isEasy ? (houseArea[house]||'') : p.symbol + ' ' + p.name + ' → ' + house + ' house (' + SIGNS[p.sign] + ')'}</div>
            <div class="interp-text">${isEasy ? desc.replace(/^\d+궁:\s*/, '') : desc}</div>
        </div>`;
    });

    document.getElementById('planetHouseWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// 교육 & 지식
// ═══════════════════════════════════════════════════
function renderEducation(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    const h4 = planetsInHouse(4);
    const h5 = planetsInHouse(5);
    const h4sign = (lagnaSign + 3) % 12;
    const h5sign = (lagnaSign + 4) % 12;

    const isEasy = window.vedicMode === 'easy';
    let text = isEasy ? '<strong>기초 교육:</strong> ' : `<strong>4 house (기초 교육·학위):</strong> ${SIGNS[h4sign]}. `;
    const eduSign4 = ['Active learning, physical/military education', 'Fine arts/music/culinary education', 'Languages/literature/communication', 'Home education emphasis, history', 'Drama/leadership/political science', 'Science/medicine/analytics', 'Law/diplomacy/design', 'Psychology/research/investigation', 'Philosophy/theology/international studies', 'Business/administration/architecture', 'IT/science technology/aviation', 'Art/film/music/spirituality'];
    text += eduSign4[h4sign] + ' suited. ';
    if (h4.length > 0 && !isEasy) text += 'In 4th house, ' + h4.map(p => p.name).join(', ') + ' influences education. ';

    const jupiter = positions.find(p => p.id === 'Jupiter');
    if (jupiter) {
        const jH = houseOf(jupiter.sign);
        if ([1,4,5,9].includes(jH)) text += isEasy ? '<br><br>🎓 <strong>높은 학업 성취가 기대됩니다!</strong> 대학원/박사과정/해외 유학 가능성.' : '<br><br>🎓 <strong>Jupiter이 ' + jH + ' house position하여 높은 학업 성취가 기대됩니다!</strong> 대학원/박사과정/해외 유학 가능성.';
    }

    text += isEasy ? '<br><br><strong>Higher education:</strong> ' : `<br><br><strong>5 house (Higher Education)::</strong> ${SIGNS[h5sign]}. `;
    if (h5.length > 0) {
        h5.forEach(p => {
            const h5p = { Sun: '리더십/정치학 분야 뛰어남', Moon: '예술/심리학 재능', Mars: '공학/기술/체육 재능', Mercury: '수학/언어/비즈니스 천재', Jupiter: 'Best placement! 학자/교수/연구자', Venus: '예술/디자인/음악 재능', Saturn: '늦은 학업이지만 깊이 있는 연구' };
            text += isEasy ? `${h5p[p.id] || 'influences academics'}. ` : `${p.name}: ${h5p[p.id] || 'influences academics'}. `;
        });
    } else {
        text += isEasy ? 'No particularly strong academic energy, but steady effort will bring good results.' : 'No planets in 5th — 5th lord position is key.';
    }

    document.getElementById('educationWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// children운
// ═══════════════════════════════════════════════════
function renderChildren(positions, lagnaSign) {
    const isEasy = window.vedicMode === 'easy';
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    const h5 = planetsInHouse(5);
    const h5sign = (lagnaSign + 4) % 12;
    const jupiter = positions.find(p => p.id === 'Jupiter');

    let text = isEasy ? "" : `<strong>5 house (children·창조력):</strong> ${SIGNS[h5sign]}에 position.<br><br>`;

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
        text += isEasy ? '<br><br>' : '<br><br><strong>5 house 행성:</strong><br>';
        h5.forEach(p => {
            const ch = { Sun: 'Connection with sons. Children have leadership.', Moon: 'Connection with daughters. Strong emotional bond.', Mars: 'Active children. May be difficult to manage.', Mercury: 'Very smart children! Excellent academics.', Jupiter: 'Blessed children! Fortune through children.', Venus: 'Beautiful artistic children. Connection with daughters.', Saturn: 'Children may come late. But responsible children.' };
            text += `${ch[p.id] || ''}<br>`;
        });
    }

    if (jupiter) {
        const jH = houseOf(jupiter.sign);
        if (jH === 5) text += isEasy ? '<br>🌟 <strong>Best children운! children가 큰 행운을 가져옵.</strong>' : '<br>🌟 <strong>Jupiter이 5궁! Best children운. children가 큰 행운을 가져옵.</strong>';
    }

    document.getElementById('childrenWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// 해외운 & 이주
// ═══════════════════════════════════════════════════
function renderForeign(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    function planetsInHouse(h) { return positions.filter(p => houseOf(p.sign) === h); }

    const h9 = planetsInHouse(9);
    const h12 = planetsInHouse(12);
    const rahu = positions.find(p => p.id === 'Rahu');

    const isEasy = window.vedicMode === 'easy';
    let text = isEasy ? '<strong>해외 여행·행운:</strong><br>' : '<strong>9 house (해외 여행·행운·Higher education):</strong><br>';
    if (h9.length === 0) {
        text += 'Foreign travel exists but not a strong connection.';
    } else {
        h9.forEach(p => {
            const f9 = { Sun: 'Father가 해외 관련. 정부/공무 해외 출장.', Moon: '해외 여행을 감정적으로 즐김. 해외 대중 인기.', Mars: '해외에서의 모험/도전. 군사/기술 관련 해외 활동.', Mercury: '해외 유학/비즈니스 성공! 다국어 능력.', Jupiter: '해외에서 큰 행운! 유학/이민 성공. 해외 스승 만남.', Venus: '해외에서의 로맨스. 예술/패션 관련 해외 활동.', Saturn: '해외에서의 고생 후 성공. 장기 해외 체류.', Rahu: '해외 이주 강력한 지표! 외국 문화에 깊이 빠짐.', Ketu: '전생에서의 해외 인연. 영적 순례.' };
            text += isEasy ? `${f9[p.id] || ''}<br>` : `${p.symbol} ${p.name}: ${f9[p.id] || ''}<br>`;
        });
    }

    text += isEasy ? '<br><strong>해외 정착·이민:</strong><br>' : '<br><strong>12 house (해외 정착·이민·지출):</strong><br>';
    if (h12.length === 0) {
        text += 'Domestic residence is more natural.';
    } else {
        h12.forEach(p => {
            const f12 = { Sun: 'Finding identity abroad. Government foreign posting.', Moon: '해외 거주 가능성 높음! 해외에서 감정적 안정.', Mars: '해외에서의 에너지 소모. 해외 투자/부동산.', Mercury: '해외 비즈니스/IT 관련 활동. 해외 교육.', Jupiter: '해외에서의 영적 성장. 자선 활동. 해외 대학.', Venus: '해외에서의 사치와 쾌락. 해외 예술 활동.', Saturn: '해외에서의 고된 노동. 하지만 장기적 정착.', Rahu: '해외 이민 확정적 지표! 서양 문화 적응.', Ketu: '해외에서의 영적 practice. 고독한 해외 생활.' };
            text += isEasy ? `${f12[p.id] || ''}<br>` : `${p.symbol} ${p.name}: ${f12[p.id] || ''}<br>`;
        });
    }

    if (rahu) {
        const rH = houseOf(rahu.sign);
        if ([9, 12, 7].includes(rH)) text += isEasy ? '<br>✈️ <strong>해외 이주/장기 체류 가능성이 매우 높습니다!</strong>' : '<br>✈️ <strong>Rahu가 ' + rH + ' house position하여 해외 이주/장기 체류 가능성이 매우 높습니다!</strong>';
    }

    document.getElementById('foreignWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// 행성 품위
// ═══════════════════════════════════════════════════
function renderDignity(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    const isEasy = window.vedicMode === 'easy';
    const houseArea = {1:'Self',2:'Money/Family',3:'Communication/Siblings',4:'Home/Mother',5:'Children/Romance',6:'Health/Enemies',7:'Spouse',8:'Transformation/Inheritance',9:'Luck/Foreign',10:'Career/Fame',11:'Income/Wishes',12:'Foreign/Spirituality'};
    const EXALT = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
    const DEBI = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };
    const OWN = { Sun: [4], Moon: [3], Mars: [0,7], Mercury: [2,5], Jupiter: [8,11], Venus: [1,6], Saturn: [9,10] };

    // 쉬운 설명
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
            ${isEasy ?
            '<strong>💡 쉽게 이해하기:</strong> 각 행성이 Your 인생에서 얼마나 힘을 잘 발휘하는지 보여드릴게요.<br><br>🟢 <strong>매우 강함</strong> = Best 컨디션! 큰 행운과 성과.<br>🟡 <strong>강함</strong> = 안정적으로 좋은 결과.<br>⚪ <strong>보통</strong> = 특별히 강하지도 약하지도 않음.<br>🔴 <strong>약한 상태</strong> = 어려움이 있지만 노력으로 극복 가능.' :
            '<strong>💡 쉽게 이해하기:</strong> Planetary dignity means how well a planet exerts its power.<br><br>🟢 <strong>Exalted</strong> = Best 컨디션! 이 행성이 담당하는 인생 영역에서 큰 행운과 성과.<br>🟡 <strong>본궁</strong> = 자기 집에 있는 것처럼 편안. 안정적으로 좋은 결과.<br>⚪ <strong>중립</strong> = 보통. 특별히 강하지도 약하지도 않음.<br>🔴 <strong>Debilitated</strong> = 힘이 약한 상태. 이 영역에서 어려움이 있지만 노력으로 극복 가능.'}
        </div>
    </div>`;

    positions.forEach(p => {
        if (!EXALT.hasOwnProperty(p.id)) return;
        let dignity, emoji, meaning, color, simpleDesc;
        const role = planetRole[p.id];

        const house = houseOf(p.sign);
        const area = houseArea[house] || '';

        if (p.sign === EXALT[p.id]) {
            dignity = 'Exalted';
            emoji = '🟢';
            color = '#5cb85c';
            simpleDesc = isEasy
                ? `<strong>${area}</strong> 영역에서 Best 축복을 받았어요! 이 분야에서 타고난 재능이 빛나며 자연스럽게 좋은 결과를 얻습.`
                : `<strong>${p.name} 최강!</strong> "${role}" 에너지가 극대화된 상태로 <strong>${house}(${area})</strong> 영역에서 큰 축복을 받았습. 타고난 재능이 빛나며 자연스럽게 좋은 결과를 얻습.`;
        } else if (p.sign === DEBI[p.id]) {
            dignity = 'Debilitated';
            emoji = '🔴';
            color = '#d9534f';
            simpleDesc = isEasy
                ? `<strong>${area}</strong> 영역에서 어려움을 느낄 수 있어요. 하지만 의식적으로 노력하면 오히려 큰 성장의 기회가 됩. 아래 치유법을 참고하세요.`
                : `<strong>${p.name} 약한 상태.</strong> "${role}" 에너지가 약해진 채로 <strong>${house}(${area})</strong> 영역에 있습. 이 분야에서 어려움을 느낄 수 있지만, 의식적 노력으로 극복하면 오히려 큰 성장의 기회가 됩. 아래 치유법을 참고하세요.`;
        } else if (OWN[p.id] && OWN[p.id].includes(p.sign)) {
            dignity = 'Own Sign';
            emoji = '🟡';
            color = '#c9a84c';
            simpleDesc = isEasy
                ? `<strong>${area}</strong> 영역에서 안정적으로 힘을 발휘해요. 자연스럽게 좋은 결과를 만들어냅.`
                : `<strong>${p.name} 자기 집에!</strong> "${role}" 에너지가 안정적으로 <strong>${house}(${area})</strong> 영역에서 힘을 발휘합. 자연스럽게 좋은 결과를 만들어냅.`;
        } else {
            dignity = 'Neutral';
            emoji = '⚪';
            color = '#999';
            simpleDesc = isEasy
                ? `<strong>${area}</strong> 영역에서 보통의 영향력이에요. 특별히 강하지도 약하지도 않습.`
                : `${p.name}의 "${role}" 에너지가 <strong>${house}(${area})</strong> 영역에서 보통의 영향력을 발휘합. Results vary depending on other planets.`;
        }

        html += `<div class="interp-card">
            <div class="interp-title">${emoji} ${isEasy ? area + ' — ' : p.symbol + ' ' + p.name + ' — ' + SIGNS[p.sign] + ' ' + SIGN_SYMBOLS[p.sign] + ' → ' + house + '궁(' + area + ') — '}<span style="color:${color}">${isEasy ? (dignity.includes('Exalted') ? 'Very Strong!' : dignity.includes('Debilitated') ? 'Weak' : dignity.includes('Own Sign') ? 'Strong' : 'Average') : dignity}</span></div>
            <div class="interp-text">
                ${isEasy ? '' : '<span style="color:#666;font-size:12px;">담당: ' + role + ' │ Position: ' + house + ' = ' + area + '</span><br><br>'}
                ${simpleDesc}
            </div>
        </div>`;
    });

    document.getElementById('dignityWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// 행운의 정보
// ═══════════════════════════════════════════════════
function renderLucky(lagnaSign, moonPos) {
    const luckyData = [
        { color: 'Red, Orange', number: '1, 9', day: 'Tuesday', gem: 'Red Coral', dir: 'East' },
        { color: 'White, Pink', number: '2, 6', day: 'Friday', gem: 'Diamond', dir: 'Southeast' },
        { color: 'Green', number: '3, 5', day: 'Wednesday', gem: 'Emerald', dir: 'North' },
        { color: 'White, Silver', number: '2, 7', day: 'Monday', gem: 'Pearl', dir: 'Northwest' },
        { color: 'Gold, Orange', number: '1, 4', day: 'Sunday', gem: '루비', dir: 'East' },
        { color: 'Green, Light Green', number: '5, 3', day: 'Wednesday', gem: 'Emerald', dir: 'South' },
        { color: 'White, Pastel', number: '6, 2', day: 'Friday', gem: 'Diamond', dir: 'West' },
        { color: 'Red, Crimson', number: '9, 1', day: 'Tuesday', gem: '산호', dir: 'South' },
        { color: 'Yellow, Gold', number: '3, 9', day: 'Thursday', gem: '노란 사파이어', dir: 'Northeast' },
        { color: 'Navy, Black', number: '8, 4', day: 'Saturday', gem: 'Blue Sapphire', dir: 'West' },
        { color: 'Navy, Purple', number: '4, 8', day: 'Saturday', gem: 'Blue Sapphire', dir: 'West' },
        { color: 'Yellow, Gold', number: '3, 7', day: 'Thursday', gem: '노란 사파이어', dir: 'Northeast' }
    ];

    const d = luckyData[lagnaSign];
    const html = `<div class="interp-card">
        <div class="interp-text">
            <strong>🎨 Lucky Color:</strong> ${d.color}<br>
            <strong>🔢 Lucky Number:</strong> ${d.number}<br>
            <strong>📅 Lucky Day:</strong> ${d.day}<br>
            <strong>💎 Lucky Gem:</strong> ${d.gem}<br>
            <strong>🧭 Lucky Direction:</strong> ${d.dir}<br>
            <strong>🪐 Lagna 지배 행성:</strong> ${['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'][lagnaSign]}
        </div>
    </div>`;
    document.getElementById('luckyWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// 치유 & 강화 방법
// ═══════════════════════════════════════════════════
function renderRemedy(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    const DEBI = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };

    const remedies = {
        Sun: { gem: '루비 (Ruby)', mantra: 'Om Suryaya Namaha', color: 'Orange/red on Sunday', food: 'Wheat, saffron, sunflower seeds', charity: 'Sunday: donate wheat/copper' },
        Moon: { gem: '진주 (Pearl)', mantra: 'Om Chandraya Namaha', color: 'White/silver on Monday', food: 'Milk, rice, coconut', charity: 'Monday: donate rice/milk' },
        Mars: { gem: 'Red Coral', mantra: 'Om Mangalaya Namaha', color: 'Red on Tuesday', food: 'Lentils, red fruits', charity: 'Tuesday: donate red lentils' },
        Mercury: { gem: 'Emerald', mantra: 'Om Budhaya Namaha', color: 'Green on Wednesday', food: 'Green beans, green vegetables', charity: 'Wednesday: donate green vegetables' },
        Jupiter: { gem: 'Yellow Sapphire', mantra: 'Om Gurave Namaha', color: 'Yellow on Thursday', food: 'Chickpeas, bananas, turmeric', charity: 'Thursday: donate yellow food/books' },
        Venus: { gem: 'Diamond', mantra: 'Om Shukraya Namaha', color: 'White/pastel on Friday', food: 'Milk, cream, fruits', charity: 'Friday: donate white clothes/rice' },
        Saturn: { gem: '블루 사파이어 (Blue Sapphire)', mantra: 'Om Shanaishcharaya Namaha', color: 'Navy/black on Saturday', food: 'Black beans, sesame', charity: 'Saturday: donate black beans/oil' }
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
                <div class="interp-title">${p.symbol} ${p.name} 강화 방법 ${isDebi ? '(Debilitated — Especially Important!)' : '(Weak Position)'}</div>
                <div class="interp-text">
                    <strong>💎 Gem:</strong> ${r.gem} (Ring finger recommended)<br>
                    <strong>🙏 mantra:</strong> "${r.mantra}" (108회 매일 암송)<br>
                    <strong>🎨 Color:</strong> ${r.color}<br>
                    <strong>🍽️ Food:</strong> ${r.food}<br>
                    <strong>🤝 Charity:</strong> ${r.charity}
                </div>
            </div>`;
        }
    });

    if (!html) {
        html = '<div class="interp-card"><div class="interp-text">모든 행성이 양호한 position에 있습니다! 특별한 치유가 필요하지 않습. 행운의 보석은 Lagna 지배 행성의 보석을 착용하면 좋습.</div></div>';
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
        // D7 (삽탐샤): 홀수 사인은 같은 사인부터, 짝수 사인은 7번째 사인부터
        const startSign = (sign % 2 === 0) ? sign : (sign + 6) % 12;
        return (startSign + part) % 12;
    } else if (division === 10) {
        // D10 (다샴샤): 홀수 사인은 같은 사인부터, 짝수 사인은 9번째 사인부터
        const startSign = (sign % 2 === 0) ? sign : (sign + 8) % 12;
        return (startSign + part) % 12;
    } else if (division === 12) {
        // D12 (드와다샴샤): 같은 사인부터 시작
        return (sign + part) % 12;
    } else if (division === 60) {
        // D60 (샤슈티암샤): 같은 사인부터 시작, 60등분
        return (sign + part) % 12;
    }
    if (division === 2) {
        // D2 (Hora): 홀수 사인=Sun(Leo=4), 짝수 사인=Moon(게=3)
        return (part === 0) ? ((sign % 2 === 0) ? 3 : 4) : ((sign % 2 === 0) ? 4 : 3);
    } else if (division === 3) {
        // D3 (Drekkana): 같은 사인, 5번째, 9번째
        const d3starts = [0, 4, 8];
        return (sign + d3starts[part]) % 12;
    } else if (division === 4) {
        // D4 (Chaturthamsha): 같은 사인부터 시작
        return (sign + part * 3) % 12;
    } else if (division === 16) {
        // D16 (Shodashamsha): Aries부터 순서대로
        return (sign + part) % 12;
    } else if (division === 20) {
        // D20 (Vimshamsha): Aries부터 (불), Sagittarius부터 (흙), Leo부터 (바람), 게부터 (물)
        const d20start = [0, 8, 4, 3][sign % 4];
        return (d20start + part) % 12;
    } else if (division === 24) {
        // D24 (차투르Vimshamsha): 홀수 사인=Leo, 짝수 사인=게
        const d24start = (sign % 2 === 0) ? 4 : 3;
        return (d24start + part) % 12;
    } else if (division === 27) {
        // D27 (삽타Vimshamsha/나크샤트람샤): 불→양, 흙→게, 바람→Libra, 물→Capricorn
        const d27start = [0, 3, 6, 9][sign % 4];
        return (d27start + part) % 12;
    } else if (division === 30) {
        // D30 (Trimshamsha): 특수 규칙 (홀수/짝수 사인에 따라 다른 ruler)
        const d30odd = [0, 10, 8, 2, 6]; // Mars, Saturn, Jupiter, Mercury, Venus
        const d30even = [1, 5, 11, 3, 7]; // Venus, Mercury, Jupiter, Saturn, Mars
        const d30parts = [5, 5, 8, 7, 5]; // 각 부분의 도수
        let cumDeg = 0;
        let d30part = 0;
        for (let i = 0; i < 5; i++) {
            cumDeg += d30parts[i];
            if (degInSign < cumDeg) { d30part = i; break; }
        }
        return (sign % 2 === 0) ? d30odd[d30part] : d30even[d30part];
    } else if (division === 40) {
        // D40 (Khavedamsha): 홀수 사인=Aries, 짝수 사인=Libra
        const d40start = (sign % 2 === 0) ? 0 : 6;
        return (d40start + part) % 12;
    } else if (division === 45) {
        // D45 (Akshavedamsha): 불→양, 흙→Leo, 바람→Sagittarius, 물→같은 패턴 반복
        const d45start = [0, 4, 8, 0][sign % 4];
        return (d45start + part) % 12;
    }
    return (sign + part) % 12; // fallback
}

function renderDivisionalChart(positions, lagnaSidereal, division, chartId, interpId, label, koName) {
    const chartEl = document.getElementById(chartId);
    const interpEl = document.getElementById(interpId);
    if (!chartEl) return;

    // 분할 Lagna
    const dLagnaSign = getDivisionalSign(lagnaSidereal, division);

    // 분할 행성 position
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

    const isEasy = window.vedicMode === 'easy';
    let html = '';

    if (division === 10) {
        // D10 해석: career/커리어
        const d10_1lord = SIGN_RULERS[dLagnaSign];
        const d10_10sign = (dLagnaSign + 9) % 12;
        const d10_10lord = SIGN_RULERS[d10_10sign];
        const d10_10planets = dPositions.filter(p => p.dSign === d10_10sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💼 career 상세 분석' : '💼 D10 career 분석') + '</div><div class="interp-text">';
        if (isEasy) {
            html += '<strong>Your career 성향:</strong><br>';
        } else {
            html += '<strong>D10 Lagna:</strong> ' + SIGNS[dLagnaSign] + ' (ruler: ' + (RULER_NAMES[d10_1lord]||d10_1lord) + ')<br>';
            html += '<strong>D10 10 house (career):</strong> ' + SIGNS[d10_10sign] + ' (ruler: ' + (RULER_NAMES[d10_10lord]||d10_10lord) + ')<br>';
        }
        if (d10_10planets.length > 0) {
            if (!isEasy) html += '<strong>10 house 행성:</strong> ' + d10_10planets.map(p => p.name).join(', ') + '<br>';
        }

        // Career 성향 by D10 Lagna
        const careerBySign = [
            'Leadership, Military, Sports, Entrepreneur',  // Aries
            'Finance, Arts, Real Estate, Food Industry',     // 황소
            'Communication, Media, Education, IT',  // Gemini
            'Nursing, Real Estate, Hotels, Counseling',    // Cancer
            'Politics, Entertainment, Management, Administration',        // 사자
            'Medical, Accounting, Analysis, Research',          // 처녀
            'Law, Diplomacy, Design, Consulting',      // 천칭
            'Investigation, Research, Medicine, Insurance',          // 전갈
            'Education, Religion, Foreign Trade, Publishing',      // 사수
            'Administration, Construction, Mining, Civil Service',        // 염소
            'IT, Innovation, NGO, Aviation',           // 물병
            'Arts, Hospital, Foreign, Spirituality'           // Pisces
        ];
        html += '<strong>적합 분야:</strong> ' + careerBySign[dLagnaSign];
        html += '</div></div>';

    } else if (division === 7) {
        // D7 해석: children
        const d7_5sign = (dLagnaSign + 4) % 12;
        const d7_5lord = SIGN_RULERS[d7_5sign];
        const d7_5planets = dPositions.filter(p => p.dSign === d7_5sign);
        const benefics = d7_5planets.filter(p => p.natural === 'benefic');
        const malefics = d7_5planets.filter(p => p.natural === 'malefic');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👶 children 분석' : '👶 D7 children 분석') + '</div><div class="interp-text">';
        if (!isEasy) {
            if (!isEasy) html += '<strong>D7 Lagna:</strong> ' + SIGNS[dLagnaSign] + '<br>';
            html += '<strong>D7 5 house (children):</strong> ' + SIGNS[d7_5sign] + ' (ruler: ' + (RULER_NAMES[d7_5lord]||d7_5lord) + ')<br>';
        }
        if (d7_5planets.length > 0) {
            if (!isEasy) html += '<strong>5 house 행성:</strong> ' + d7_5planets.map(p => p.name).join(', ') + '<br>';
        }
        if (benefics.length > 0) html += (isEasy ? 'Benefic planets — blessed with children.' : 'Benefic 5 house 있어 blessed with children.') + '<br>';
        if (malefics.length > 0) html += (isEasy ? '도전의 행성이 children position 있어 children 관련 difficulties possible.' : 'Malefic 5 house 있어 children 관련 difficulties possible.') + '<br>';
        if (d7_5planets.length === 0) html += isEasy ? 'children position no planets — 다른 요소를 종합적으로 봐야 합.' : '5 house no planets — 5 lord(ruler)의 position를 봐야 합.';
        html += '</div></div>';

    } else if (division === 12) {
        // D12 해석: 부모
        const d12_4sign = (dLagnaSign + 3) % 12; // 4 house = Mother
        const d12_9sign = (dLagnaSign + 8) % 12; // 9 house = Father
        const d12_4planets = dPositions.filter(p => p.dSign === d12_4sign);
        const d12_9planets = dPositions.filter(p => p.dSign === d12_9sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨‍👩‍👧 부모 분석' : '👨‍👩‍👧 D12 부모 분석') + '</div><div class="interp-text">';
        if (!isEasy) {
            if (!isEasy) html += '<strong>D12 Lagna:</strong> ' + SIGNS[dLagnaSign] + '<br>';
        }
        html += '<strong>' + (isEasy ? 'Mother' : 'D12 4 house (Mother): ' + SIGNS[d12_4sign]) + '</strong>';
        if (d12_4planets.length > 0 && !isEasy) html += ' — ' + d12_4planets.map(p => p.name).join(', ');
        html += '<br>';
        html += '<strong>' + (isEasy ? 'Father' : 'D12 9 house (Father): ' + SIGNS[d12_9sign]) + '</strong>';
        if (d12_9planets.length > 0 && !isEasy) html += ' — ' + d12_9planets.map(p => p.name).join(', ');
        html += '<br>';

        const moon4 = d12_4planets.find(p => p.id === 'Moon');
        const sun9 = d12_9planets.find(p => p.id === 'Sun');
        if (moon4) html += (isEasy ? 'Moon이 Mother position 있어 Mother와의 인연이 깊습.' : 'Moon이 4 house 있어 Mother와의 인연이 깊습.') + '<br>';
        if (sun9) html += (isEasy ? 'Sun이 Father position 있어 Father와의 인연이 깊습.' : 'Sun이 9 house 있어 Father와의 인연이 깊습.') + '<br>';
        html += '</div></div>';

    } else if (division === 60) {
        // D60 해석: 전생 karma (소챕터 구조)
        const d60_1lord = SIGN_RULERS[dLagnaSign];
        const d60_planets_1 = dPositions.filter(p => p.dSign === dLagnaSign);

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
            {name:'Aryama',nature:'benefic',desc:'Sun deity. Friendship and contracts'},
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

        // 소챕터 아코디언 헬퍼
        function subChapter(icon, title, content) {
            if (window.vedicMode === 'easy') {
                return '<div style="margin:8px 0;"><h4 style="color:#c9a84c;margin:12px 0 6px;">' + icon + ' ' + title + '</h4><div style="padding:0 0 10px;color:#999;font-size:13px;line-height:1.7;">' + content + '</div></div>';
            }
            return '<div style="margin:8px 0;border:1px solid #2a2a5a;border-radius:8px;overflow:hidden;">' +
                '<div onclick="var c=this.nextElementSibling;c.style.display=c.style.display===\'none\'?\'\':\'none\';this.querySelector(\'.sc-arrow\').textContent=c.style.display===\'none\'?\'▶\':\'▼\'" style="cursor:pointer;padding:12px 14px;background:linear-gradient(135deg,#12122a,#1a1a3e);">' +
                '<span style="font-size:15px;font-weight:700;color:#c9a84c;">' + icon + ' ' + title + '</span>' +
                '<span class="sc-arrow" style="float:right;color:#666;">▶</span></div>' +
                '<div style="display:none;padding:14px;">' + content + '</div></div>';
        }

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

        // 행성별 D60 사인 해석 (전통)
        const d60PlanetInSign = {
            Sun: ['In past lives, 전사나 왕으로 살았으며, 강한 자아와 지도력이 이번 생에도 남아있습. 권위를 세우려는 soul의 목적이 있습.','In past lives, 예술가나 부유한 자로 살았으며, 물질적 풍요를 추구하는 soul입. 감각적 아름다움에 끌립.','In past lives, 학자나 상인으로 살았으며, 지식과 소통이 soul의 핵심 주제입.','In past lives, 보호자나 양육자로 살았으며, 타인을 돌보는 것이 soul의 깊은 본능입.','In past lives, 왕족이나 성직자로 높은 지위에 있었으며, 이번 생에서도 자연스러운 권위를 지닙.','In past lives, 치유자나 봉Leo로 살았으며, 분석과 service가 soul의 목적입.','In past lives, 외교관이나 예술가로 조화를 추구했으며, 관계와 균형이 soul의 task.','In past lives, practice자나 연금술사로 깊은 변혁을 겪었으며, 비밀과 변혁이 soul에 각인되어 있습.','In past lives, 현자나 탐험가로 진리를 추구했으며, 지혜와 모험이 soul의 방향입.','In past lives, 관료나 건축가로 질서를 세웠으며, 체계와 책임이 soul에 새겨져 있습.','In past lives, 혁명가나 발명가로 시대를 앞서갔으며, 독창적 사고가 soul의 특성입.','In past lives, 영매나 예술가로 영적 세계와 교류했으며, 깊은 직관이 soul에 남아있습.'],
            Moon: ['Past life 감정적 기억이 불같이 강렬합. 분노와 열정이 무의식에 각인되어 있으며, 이번 생에서 감정을 다스리는 것이 task.','Past life 감정적 기억이 따뜻하고 안정적입. 풍요와 안정 속에서 살았던 기억이 무의식에 남아, 아름다운 것을 찾습.','Past life 감정적 기억이 지적이고 다채롭습. 여러 경험을 했던 기억이 남아 호기심이 강합.','Past life 감정적 기억이 매우 깊습. 가정과 돌봄의 기억이 강하게 남아 감Mercury이 풍부합.','Past life 감정적 기억이 자부심과 존엄으로 가득합. 인정받고 존경받았던 기억이 남아있습.','Past life 감정적 기억이 service와 분석에 관련됩. 누군가를 도왔던 기억이 남아 세심한 마음을 가집.','Past life 감정적 기억이 조화와 관계에 관련됩. 아름다운 관계의 기억이 남아 파트너를 찾습.','Past life 감정적 기억이 깊고 강렬합. 극적인 변화를 겪었던 기억이 남아 감정의 깊이가 바다와 같습.','Past life 감정적 기억이 자유와 탐구에 관련됩. 여행하고 배웠던 기억이 남아 확장을 추구합.','Past life 감정적 기억이 책임과 인내에 관련됩. 무거운 짐을 졌던 기억이 남아 성숙한 감정을 가집.','Past life 감정적 기억이 독특하고 비범합. 다른 사람들과 Moon랐던 기억이 남아 독립적 감성을 가집.','Past life 감정적 기억이 영적이고 초월적입. 꿈과 비전이 선명하며, 영적 세계와의 연결이 깊습.']
        };

        // 신 계산 헬퍼
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
            return ' — deity: <strong>' + d.deity.name + '</strong>(' + d.deity.ko + ') <span style="color:' + c + ';font-weight:700;">' + (d.deity.nature === 'benefic' ? '길(吉)' : '흉(凶)') + '</span>';
        }

        const houseThemes = ['','Self/Existence','Wealth/Value','Communication/Learning','Home/Rest','Creation/Love','Service/Trial','Relationship/Partner','Transformation/Secret','Wisdom/Religion','Society/Career','Wish/Gain','Liberation/Transcendence'];

        // Parasara 인용
        if (!isEasy) {
            html += '<div class="interp-card" style="border-left:3px solid #8b7ec8;"><div class="interp-text" style="font-size:13px;color:#888;">';
            html += '📜 <strong>Parasara 曰:</strong> "샤슈티암샤(D60) is the most important of all divisional charts. Benefic (吉神) planets in benefic divisions give good results, malefic (凶神) planets in malefic divisions give bad results."<br>';
            html += '<span style="color:#666;">— Brihat Parasara Hora 샤스트라(BPHS)</span></div></div>';
        }

        // ─── 소챕터 1: soul의 정체성 ───
        const lagnaD = getDeity(lagnaSidereal);
        let ch1 = isEasy
            ? '<strong>Past life 정체성</strong>' + deityTag(lagnaD) + '<br><br>'
            : '<strong>D60 Lagna: ' + SIGNS[dLagnaSign] + ' ' + SIGN_SYMBOLS[dLagnaSign] + '</strong> (ruler: ' + (RULER_NAMES[d60_1lord]||d60_1lord) + ')' + deityTag(lagnaD) + '<br><br>';
        ch1 += pastLifeThemes[dLagnaSign] + '<br>';
        if (lagnaD.deity) {
            ch1 += '<br>' + (isEasy ?
                (lagnaD.deity.nature === 'benefic' ?
                    'You did many good things in past lives, so good opportunities come naturally. Your existence is protected.' :
                    'Unresolved lessons from past lives affect your personality, but overcoming them leads to greater growth.') :
                (lagnaD.deity.nature === 'benefic' ?
                    '<strong>' + lagnaD.deity.ko + '</strong> guards the Lagna. ' + lagnaD.deity.desc + ' — Past life merit protects — good opportunities come naturally.' :
                    '<strong>' + lagnaD.deity.ko + '</strong> influences the Lagna. ' + lagnaD.deity.desc + ' — Karmic challenge imprinted, but overcoming leads to growth.'));
        }
        if (d60_planets_1.length > 0) ch1 += '<br><br>' + d60_planets_1.map(p => p.name).join(', ') + (isEasy ? ' Past life 핵심 position에 있습니다 — Past life karma가 이 행성에 집중되어 있습.' : ' D60 Lagna에 position — Core past-life karma concentrated in these planets.');
        html += subChapter('🪐', 'Soul Identity — Who Were You in Past Lives', ch1);

        // ─── 소챕터 2: soul의 목적 ───
        const sunD60 = dPositions.find(p => p.id === 'Sun');
        if (sunD60) {
            const sunD = getDeity(sunD60.sidereal);
            let ch2 = (isEasy ? '<strong>Sun의 전생 기억</strong>' : '<strong>D60 Sun: ' + SIGNS[sunD60.dSign] + ' ' + SIGN_SYMBOLS[sunD60.dSign] + '</strong>') + deityTag(sunD) + '<br><br>';
            ch2 += (d60PlanetInSign.Sun[sunD60.dSign] || '') + '<br>';
            if (sunD.deity) {
                ch2 += '<br>' + (isEasy ?
                    (sunD.deity.nature === 'benefic' ?
                        'You pursued your true purpose well in past lives, so self-realization comes naturally. Be confident!' :
                        'There was confusion about who you are in past lives. Finding your true self is an important journey that makes you grow.') :
                    (sunD.deity.nature === 'benefic' ?
                        'Sun deity <strong>' + sunD.deity.ko + '</strong>: ' + sunD.deity.desc + '. Soul purpose correctly pursued — self-realization comes naturally.' :
                        'Sun deity <strong>' + sunD.deity.ko + '</strong>: ' + sunD.deity.desc + '. Past life challenge with self/authority — finding true self is the soul task.'));
            }
            html += subChapter('☉', 'Soul Purpose — Why Were You Born', ch2);
        }

        // ─── 소챕터 3: 감정의 기억 ───
        const moonD60 = dPositions.find(p => p.id === 'Moon');
        if (moonD60) {
            const moonD = getDeity(moonD60.sidereal);
            let ch3 = (isEasy ? '<strong>Moon의 전생 기억</strong>' : '<strong>D60 Moon: ' + SIGNS[moonD60.dSign] + ' ' + SIGN_SYMBOLS[moonD60.dSign] + '</strong>') + deityTag(moonD) + '<br><br>';
            ch3 += (d60PlanetInSign.Moon[moonD60.dSign] || '') + '<br>';
            if (moonD.deity) {
                ch3 += '<br>' + (isEasy ?
                    (moonD.deity.nature === 'benefic' ?
                        'Your mind was peaceful in past lives, so you are emotionally stable with strong intuition. Trust your gut.' :
                        'Traces of emotional hardship from past lives remain deep in your heart. Meditation and being near water greatly helps healing.') :
                    (moonD.deity.nature === 'benefic' ?
                        'Moon deity <strong>' + moonD.deity.ko + '</strong>: ' + moonD.deity.desc + '. Mind was peaceful — emotionally stable with strong intuition.' :
                        'Moon deity <strong>' + moonD.deity.ko + '</strong>: ' + moonD.deity.desc + '. Emotional wounds remain unconscious. Recognizing and healing is this life emotional task. Meditation and rest near water helps.'));
            }
            html += subChapter('☽', 'Emotional Memory — Unconscious Patterns', ch3);
        }

        // ─── 소챕터 4: spouse karma ───
        const d60H7sign = (dLagnaSign + 6) % 12;
        const d60H7lord = SIGN_RULERS[d60H7sign];
        const d60H7planets = dPositions.filter(p => p.dSign === d60H7sign);
        const venusD60 = dPositions.find(p => p.id === 'Venus');
        const jupD60 = dPositions.find(p => p.id === 'Jupiter');
        const rahuD60 = dPositions.find(p => p.id === 'Rahu');
        const ketuD60 = dPositions.find(p => p.id === 'Ketu');

        const spouseKarmaBySign = [
            'Past life warrior/leader connection. Intense, independent spouse karma. Souls who fought or competed together.',
            'Past life artist/wealthy connection. Materially abundant marriage karma. Souls who pursued beauty together.',
            'Past life scholar/merchant connection. Intellectual marriage karma. Souls who studied or traded together.',
            'Past life family/protector connection. Deep emotional bond marriage karma. Souls who cared for each other.',
            'Past life royalty/nobility connection. Splendid, respected marriage karma. Souls who ruled together.',
            'In past lives, 치유자/봉Leo와의 인연. service와 헌신의 결혼 karma. In past lives, 함께 타인을 도왔던 soul.',
            'Past life diplomat/artist connection. Harmonious, beautiful marriage karma. Souls who sought balance together.',
            'Past life practitioner/mystic connection. Intense, transformative marriage karma. Souls who shared life and death.',
            'Past life sage/explorer connection. Free, expansive marriage karma. Foreign spouse possible.',
            'Past life official/architect connection. Responsible, stable marriage karma. Late marriage possible.',
            'In past lives, 관료/군인/체계적 career인과의 인연. Saturn이 지배하는 사인으로, 책임감 있고 규율적인 spouse karma. In past lives, 함께 사회적 의무를 practice한 soul. 결혼이 다소 늦거나 나이 차이가 있을 수 있음.',
            'Past life medium/artist connection. Mystical, spiritual marriage karma. May meet first in dreams.'
        ];

        let ch4 = (isEasy
            ? '<strong>spouse와의 전생 인연</strong><br><br>'
            : '<strong>D60 7 house (spouse): ' + SIGNS[d60H7sign] + ' ' + SIGN_SYMBOLS[d60H7sign] + '</strong> (7 lord: ' + (RULER_NAMES[d60H7lord]||d60H7lord) + ')<br><br>');
        ch4 += spouseKarmaBySign[d60H7sign] + '<br>';

        if (d60H7planets.length > 0) {
            ch4 += '<br><strong>' + (isEasy ? 'Planets in spouse position:' : 'D60 7 house 행성:') + '</strong><br>';
            d60H7planets.forEach(p => {
                const pD = getDeity(p.sidereal);
                if (isEasy) {
                    ch4 += (p.natural === 'benefic'
                        ? 'Good past-life connection with spouse — blessings in this life.'
                        : 'Unresolved past-life issues with spouse. Challenges but growth opportunities.') + '<br>';
                } else {
                    ch4 += p.symbol + ' <strong>' + p.name + '</strong>' + deityTag(pD) + '<br>';
                    ch4 += (p.natural === 'benefic'
                        ? 'Benefic 7 house position — In past lives, spouse와 좋은 karma를 쌓았으며, 이번 생에서도 spouse에게서 축복을 받습.'
                        : 'Malefic 7 house position — In past lives, spouse와 해결하지 못한 karma가 있으며, 이번 생에서 이를 정산합. 도전이지만 성장의 기회입.') + '<br>';
                }
            });
        }

        // Venus (사랑의 karma)
        if (venusD60) {
            const venD = getDeity(venusD60.sidereal);
            const venH = ((venusD60.dSign - dLagnaSign + 12) % 12) + 1;
            if (isEasy) {
                ch4 += '<br>' + (venD.deity && venD.deity.nature === 'benefic' ?
                    'You loved sincerely in past lives, so beautiful love awaits.' :
                    'Unresolved love lessons from past lives. Learning true love is important and makes you deeper.');
            } else {
                ch4 += '<br><strong>♀ Venus (사랑의 행성)</strong> → D60 ' + venH + ' house (' + houseThemes[venH] + ')' + deityTag(venD) + '<br>';
                ch4 += venD.deity && venD.deity.nature === 'benefic' ?
                    'Venus under benefic <strong>' + venD.deity.ko + '</strong> protection. Love practiced well — beautiful love awaits. ' + venD.deity.desc :
                    'Venus under malefic <strong>' + (venD.deity?venD.deity.ko:'') + '</strong> influence. Past love challenges — learning true love is the task. ' + (venD.deity?venD.deity.desc:'');
            }
        }

        // Rahu-Ketu 축 (1-7궁이면 전생 인연)
        if (rahuD60 && ketuD60) {
            const rahuH = ((rahuD60.dSign - dLagnaSign + 12) % 12) + 1;
            const ketuH = ((ketuD60.dSign - dLagnaSign + 12) % 12) + 1;
            if (rahuH === 7 || ketuH === 7 || rahuH === 1 || ketuH === 1) {
                ch4 += isEasy
                    ? '<br><br>🔥 <strong>very strong past-life connection!</strong> spouse와 In past lives, 깊은 연결이 있었으며, 이번 생에서도 운명적으로 만나게 됩.'
                    : '<br><br>🔥 <strong>Rahu-Ketu axis D60 1-7 line!</strong> This is spouse와의 <strong>very strong past-life connection</strong> with your spouse. Destined to meet in this life.';
            }
        }

        // 7 lord의 D60 position
        const h7lordPlanet = dPositions.find(p => p.id === d60H7lord);
        if (h7lordPlanet) {
            const h7lH = ((h7lordPlanet.dSign - dLagnaSign + 12) % 12) + 1;
            const h7lD = getDeity(h7lordPlanet.sidereal);
            if (isEasy) {
                const h7lDesc = h7lH === 1 ? 'Spouse directly connected to your growth.' : h7lH === 4 ? 'Meet spouse through home and sanctuary.' : h7lH === 9 ? 'Spouse connection through foreign/education.' : h7lH === 10 ? 'Spouse connection through career/social.' : h7lH === 12 ? 'Meet spouse in foreign/spiritual settings.' : '';
                if (h7lDesc) ch4 += '<br><br>' + h7lDesc;
            } else {
                ch4 += '<br><br><strong>7 lord ' + (RULER_NAMES[d60H7lord]||d60H7lord) + '</strong> → D60 ' + h7lH + ' house (' + houseThemes[h7lH] + ')' + deityTag(h7lD) + '<br>';
                ch4 += 'Karmic connection with spouse <strong>' + houseThemes[h7lH] + '</strong> manifests through this area. ';
                ch4 += h7lH === 1 ? 'Spouse directly connected to your growth.' : h7lH === 4 ? 'Meet spouse through home and sanctuary.' : h7lH === 9 ? 'Spouse connection through foreign/education.' : h7lH === 10 ? 'Spouse connection through career/social.' : h7lH === 12 ? 'Karma to meet spouse in foreign/spiritual settings.' : '';
            }
        }
        html += subChapter('💍', 'Spouse Karma — Past Life Connection', ch4);

        // ─── 소챕터 5: career karma ───
        const d60H10sign = (dLagnaSign + 9) % 12;
        const d60H10lord = SIGN_RULERS[d60H10sign];
        const d60H10planets = dPositions.filter(p => p.dSign === d60H10sign);
        const satD60 = dPositions.find(p => p.id === 'Saturn');
        const careerKarma = ['군사/리더십/스포츠','금융/예술/농업','교육/미디어/상업','간호/부동산/호텔','정치/연예/관리','의료/분석/service','법률/외교/디자인','연구/수사/의학','교육/종교/해외','행정/건설/공무원','기술/과학/혁신','예술/영성/병원'][d60H10sign];

        let ch5 = (isEasy
            ? '<strong>Past life career karma</strong><br><br>'
            : '<strong>D60 10 house (career): ' + SIGNS[d60H10sign] + ' ' + SIGN_SYMBOLS[d60H10sign] + '</strong> (10 lord: ' + (RULER_NAMES[d60H10lord]||d60H10lord) + ')<br><br>');
        ch5 += '전생에서의 career적 karma가 <strong>' + careerKarma + '</strong> direction. Natural attraction to this field in this life.<br>';
        if (satD60) {
            const satD = getDeity(satD60.sidereal);
            const satH = ((satD60.dSign - dLagnaSign + 12) % 12) + 1;
            if (!isEasy) ch5 += '<br><strong>♄ Saturn (karma의 주인)</strong> → D60 ' + satH + ' house (' + houseThemes[satH] + ')' + deityTag(satD) + '<br>';
            ch5 += isEasy ?
                ('<br>' + (satD.deity && satD.deity.nature === 'benefic' ?
                    'This is a <strong>very rare blessing</strong>! Past life patience reduces career challenges in this life.' :
                    'Heavy career lesson from past lives. Steady effort and helping others is the key.')) :
                (satD.deity && satD.deity.nature === 'benefic' ?
                    'Saturn under benefic  is a <strong>매우 희귀한 축복</strong>입니다! Past life patience reduces career  trials are reduced.' :
                    'Saturn under malefic 아래에 있어 career적 영역에서 <strong>heavy past-life karma</strong>가 있습. ' + (satD.deity?satD.deity.desc:'') + '. Patience, service, mantra(Om Shanaishcharaya Namaha) to dissolve this karma.');
        }
        if (d60H10planets.length > 0) {
            ch5 += '<br><br><strong>' + (isEasy ? 'Career planets:' : 'D60 10 house 행성:') + '</strong> ' + d60H10planets.map(p => p.name).join(', ') + ' — Career karma concentrated in these planets.';
        }
        html += subChapter('💼', 'Career Karma — Past Life Calling', ch5);

        // ─── 소챕터 6: wealth karma ───
        const d60H2sign = (dLagnaSign + 1) % 12;
        const d60H2planets = dPositions.filter(p => p.dSign === d60H2sign);
        let ch6 = (isEasy
            ? '<strong>Past life wealth karma</strong><br><br>'
            : '<strong>D60 2 house (wealth): ' + SIGNS[d60H2sign] + ' ' + SIGN_SYMBOLS[d60H2sign] + '</strong><br><br>');
        const wealthKarma = ['Self-made wealth instinct.','Abundant environment past life.','Intellectual wealth building.','Family/property wealth.','Wealth through authority.','Wealth through service. Frugal.','Partnership wealth.','Others wealth (inheritance).','Fortune brings wealth. Foreign.','Slow but sure. Rich after midlife.','Innovation wealth. Unconventional.','Spiritual activity and wealth. Giving.'][d60H2sign];
        ch6 += wealthKarma + '<br>';
        if (d60H2planets.length > 0) {
            ch6 += isEasy ? '<br>' : '<br><strong>D60 2 house 행성:</strong><br>';
            d60H2planets.forEach(p => {
                const pD = getDeity(p.sidereal);
                ch6 += (isEasy ? '' : p.symbol + ' ' + p.name + deityTag(pD) + ' — ') + (p.natural === 'benefic' ? 'Good wealth connections from past lives — abundance in this life too.' : 'Wealth lessons from past lives. Steady effort can overcome them.') + '<br>';
            });
        }
        html += subChapter('💰', 'Wealth Karma — Past Life Fortune', ch6);

        // ─── 소챕터 7: 행성별 신 목록 (전문가 모드만) ───
        if (!isEasy) {
            let ch7 = '';
            const lagnaD2 = getDeity(lagnaSidereal);
            if (lagnaD2.deity) {
                const lc = lagnaD2.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f';
                ch7 += '<div style="padding:4px 0;">⬆ Lagna → <strong>' + lagnaD2.deity.name + '</strong>(' + lagnaD2.deity.ko + ') <span style="color:' + lc + ';">' + (lagnaD2.deity.nature === 'benefic' ? '길' : '흉') + '</span></div>';
            }
            positions.forEach(p => {
                const pD = getDeity(p.sidereal);
                if (pD.deity) {
                    const c = pD.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f';
                    ch7 += '<div style="padding:4px 0;">' + p.symbol + ' ' + p.name + ' → <strong>' + pD.deity.name + '</strong>(' + pD.deity.ko + ') <span style="color:' + c + ';">' + (pD.deity.nature === 'benefic' ? '길' : '흉') + '</span></div>';
                }
            });
            html += subChapter('🕉️', 'Planetary Deity List', ch7);
        }

        // ─── 소챕터 8: 종합 karma 판단 ───
        const beneficCount = positions.filter(p => {
            const pD = getDeity(p.sidereal);
            return pD.deity && pD.deity.nature === 'benefic';
        }).length;
        const maleficPlanets = positions.filter(p => {
            const pD = getDeity(p.sidereal);
            return pD.deity && pD.deity.nature === 'malefic';
        });

        let ch8 = isEasy ?
            '9개 행성 중 <strong style="color:#5cb85c">' + beneficCount + '개가 좋은 기운</strong>, <strong style="color:#d9534f">' + (positions.length - beneficCount) + '개가 주의 기운</strong><br><br>' :
            '9개 행성 중 <strong style="color:#5cb85c">' + beneficCount + '개 길신</strong>, <strong style="color:#d9534f">' + (positions.length - beneficCount) + '개 흉신</strong> placement<br><br>';
        if (beneficCount >= 7) {
            ch8 += isEasy ?
                '🌟 <strong>In past lives, 정말 좋은 일을 많이 했어요!</strong> 거의 모든 행성이 좋은 기운 아래 있어서, 이번 생에서 자연스럽게 좋은 결과를 얻습. 타고난 행운이 강한 편이에요.' :
                '🌟 <strong>매우 강한 전생 merit.</strong> Parasara called such charts "a soul blessed by the gods". Most planets under benefics — good results naturally.';
        } else if (beneficCount >= 5) {
            ch8 += isEasy ?
                '✨ <strong>In past lives, 쌓은 좋은 기운이 풍부해요.</strong> 삶의 많은 영역에서 보호받고 있습.' :
                '✨ <strong>Abundant past life merit.</strong> Benefics dominate — protected in many areas.';
            if (maleficPlanets.length > 0) ch8 += isEasy ?
                ' However, some areas need more effort.' :
                ' 다만 <strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong>의 영역에서 karma적 도전이 있으니 해당 행성의 mantra와 자선을 실천하세요.';
        } else if (beneficCount >= 3) {
            ch8 += isEasy ?
                '⚖️ <strong>좋은 기운과 도전의 기운이 반반이에요.</strong> 인생에서 좋은 일과 힘든 일이 번갈아 찾아옵.' :
                '⚖️ <strong>Karma in balance.</strong> Mixed fortune — good and challenges alternate.';
            if (maleficPlanets.length > 0) ch8 += '<br>' + (isEasy ? 'Planets to watch: ' : 'Planets to watch: ') + '<strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong>';
        } else {
            ch8 += isEasy ?
                '🔥 <strong>이번 생은 Past life 숙제를 풀러 온 거예요.</strong> 도전이 많지만, 가장 무거운 숙제를 받은 사람이 가장 크게 성장합. 꾸준한 노력과 다른 사람을 돕는 것이 특히 중요해요.' :
                '🔥 <strong>A life of karma settlement.</strong> Many challenges from past lives, but Parasara said "the soul with heaviest karma grows the most". Mantra practice and charity are especially important.';
        }
        html += subChapter('📊', 'Overall Karma Assessment', ch8);

        // (이전 코드 제거됨 - 신 목록과 해석은 위 소챕터에 통합)

    } else if (division === 2) {
        // D2 Hora — wealth·부의 축적
        const d2LagnaInterp = ['Self-made wealth. Independent and aggressive investing.','Sensory investment and stable wealth. Real estate, food, art income.','Earning through intellectual activity. Writing, education, business acumen.','Real estate and family income. Property from mother. Watch emotional spending.','Wealth through leadership and authority. Government, gold. Showy spending.','Income through analysis and skills. Medical, accounting, service. Frugal manager.','Wealth through partnership. Law, diplomacy, fashion, art income.','Building wealth through others money (inheritance, insurance, investments). Hidden sources.','Income through education, foreign, religion. Fortune brings wealth.','Systematic effort builds wealth. Slow but sure. Rich after middle age.','Income through technology, innovation, networks. Unconventional sources.','Income through spiritual/artistic activities. Foreign-related wealth. Giving nature.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💰 wealth과 부의 상세 분석' : '💰 D2 Hora — wealth과 부의 분석') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D2 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d2LagnaInterp + '<br><br>';

        const sunD2 = dPositions.find(p => p.id === 'Sun');
        const moonD2 = dPositions.find(p => p.id === 'Moon');
        const jupD2 = dPositions.find(p => p.id === 'Jupiter');
        const venD2 = dPositions.find(p => p.id === 'Venus');

        if (sunD2) {
            const sunInOwn = sunD2.dSign === 4; // Leo
            html += (isEasy ? '' : '<strong>☉ Sun → ' + SIGNS[sunD2.dSign] + ':</strong> ') + (sunInOwn ? (isEasy ? '🌟 <strong>자Mercury가형!</strong> 권위와 리더십으로 스스로 부를 만듦.' : '🌟 <strong>Sun이 자기 Hora(Leo)!</strong> 자Mercury가형. 권위와 리더십으로 스스로 부를 만듦.') : (isEasy ? '타인의 도움이나 정부/공공 부문을 통한 수입.' : 'Sun이 Moon의 Hora. 타인의 도움이나 정부/공공 부문을 통한 수입.')) + '<br>';
        }
        if (moonD2) {
            const moonInOwn = moonD2.dSign === 3; // Cancer
            html += (isEasy ? '' : '<strong>☽ Moon → ' + SIGNS[moonD2.dSign] + ':</strong> ') + (moonInOwn ? (isEasy ? '🌟 <strong>대중과 관계를 통해 풍족한 삶!</strong>' : '🌟 <strong>Moon이 자기 Hora(게)!</strong> 대중과 관계를 통해 풍족한 삶.') : (isEasy ? '자기 노력과 독립적 활동으로 생계.' : 'Moon이 Sun의 Hora. 자기 노력과 독립적 활동으로 생계.')) + '<br>';
        }
        if (jupD2) html += (isEasy ? '' : '<strong>♃ Jupiter → ' + SIGNS[jupD2.dSign] + ':</strong> ') + (isEasy ? (jupD2.dSign === 4 ? '자기 능력으로 큰 부를 쌓을 수 있어요.' : '타인과 관계를 통한 풍요.') : 'Jupiter in ' + (jupD2.dSign === 4 ? 'Sun Hora — 자기 능력으로 큰 부.' : 'Moon Hora — 타인과 관계를 통한 풍요.')) + '<br>';
        if (venD2) html += (isEasy ? '' : '<strong>♀ Venus → ' + SIGNS[venD2.dSign] + ':</strong> ') + (isEasy ? (venD2.dSign === 4 ? '예술/사치품으로 자Mercury가.' : 'spouse나 파트너를 통한 wealth.') : 'Venus이 ' + (venD2.dSign === 4 ? 'Sun Hora — 예술/사치품으로 자Mercury가.' : 'Moon Hora — spouse나 파트너를 통한 wealth.')) + '<br>';

        // D2 2궁(축적된 부) 분석
        const d2H2sign = (dLagnaSign + 1) % 12;
        const d2H2planets = dPositions.filter(p => p.dSign === d2H2sign);
        html += '<br><strong>' + (isEasy ? 'Accumulated wealth:' : 'D2 2 house (축적된 부) — ' + SIGNS[d2H2sign] + ':') + '</strong><br>';
        if (d2H2planets.length > 0) {
            d2H2planets.forEach(p => {
                const wealth = {Sun:'권위와 지위를 통한 재산 축적',Moon:'대중적 활동을 통한 유동적 재산',Mars:'부동산·기술·경쟁 분야의 재산',Mercury:'사업·지적 활동·통신 분야의 재산',Jupiter:'교육·종교·법률 분야의 풍족한 재산',Venus:'예술·패션·사치품 관련 재산',Saturn:'느리지만 꾸준한 재산 축적. 중년 이후 안정',Rahu:'비전통적 방법·외국 관련 재산',Ketu:'물질에 초연. 영적 가치 추구'};
                html += isEasy ? (wealth[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (wealth[p.id]||'') + '<br>';
            });
        } else {
            html += isEasy ? 'Steadily wealth이 쌓이는 타입이에요.<br>' : '2 house no planets — 2 house 주인의 position가 wealth 축적의 열쇠.<br>';
        }
        html += '</div></div>';

    } else if (division === 3) {
        // D3 Drekkana — sibling·용기·소통
        const d3LagnaInterp = ['Independent, leadership among siblings. Brave communication style.','Stable, materially comfortable sibling relationships. Artistic siblings possible.','Intellectual, communicative siblings. Many siblings or lots of conversation.','Emotionally deep sibling bond. Motherly sibling. Protective siblings.','Charismatic, proud siblings. Famous or successful sibling.','Analytical, practical siblings. Medical/education field. Can be critical.','Diplomatic, charming siblings. Social connections through siblings.','Intense, secretive sibling relationships. Deep bonds after conflicts.','Free, philosophical siblings. Siblings abroad. Religion/education related.','Responsible, ambitious siblings. Sense of duty. Siblings few or serious relationship.','Unique, independent siblings. Unconventional sibling relationships.','Spiritual, artistic siblings. Siblings abroad. Emotional connection.'][dLagnaSign];

        const d3_3sign = (dLagnaSign + 2) % 12;
        const d3_11sign = (dLagnaSign + 10) % 12;
        const d3_3planets = dPositions.filter(p => p.dSign === d3_3sign);
        const d3_11planets = dPositions.filter(p => p.dSign === d3_11sign);
        const marsD3 = dPositions.find(p => p.id === 'Mars');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👫 sibling·용기·소통 분석' : '👫 D3 Drekkana — sibling·용기·소통 분석') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D3 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d3LagnaInterp + '<br><br>';

        html += '<strong>' + (isEasy ? 'Younger siblings:' : 'D3 3 house (younger) — ' + SIGNS[d3_3sign] + ':') + '</strong><br>';
        if (d3_3planets.length > 0) {
            const bro = {Sun:'younger이 리더십 있고 권위적',Moon:'younger과 감정적으로 가까움',Mars:'younger이 활동적이고 용감. 다툼 가능',Mercury:'younger이 지적이고 소통 능력 좋음',Jupiter:'younger이 현명하고 행운 가져옴',Venus:'younger이 매력적이고 예술적',Saturn:'younger과 관계에 어려움. 나이 차이 클 수 있음',Rahu:'younger이 독특하거나 외국 관련',Ketu:'younger과 거리감. 영적 연결'};
            d3_3planets.forEach(p => { html += isEasy ? (bro[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (bro[p.id]||'') + '<br>'; });
        } else html += isEasy ? '' : '3 house no planets — 3 lord의 position를 확인하세요.<br>';

        html += '<br><strong>' + (isEasy ? 'Older siblings:' : 'D3 11 house (형/sister) — ' + SIGNS[d3_11sign] + ':') + '</strong><br>';
        if (d3_11planets.length > 0) {
            d3_11planets.forEach(p => { html += isEasy ? '형/sister와의 관계에 영향이 있습.<br>' : '• ' + p.name + ' 11 house position하여 형/sister와의 관계에 영향.<br>'; });
        } else html += isEasy ? '' : '11 house no planets.<br>';

        if (marsD3) {
            const marsH = ((marsD3.dSign - dLagnaSign + 12) % 12) + 1;
            html += isEasy ? '<br>' : '<br><strong>♂ Mars (sibling의 karaka):</strong> ';
            html += marsH <= 4 ? 'Close sibling relationship. Courageous siblings.' : marsH <= 8 ? 'Sibling conflicts or transformation through siblings.' : 'Siblings abroad or spiritual tendency.';
        }
        html += '</div></div>';

    } else if (division === 4) {
        // D4 Chaturthamsha — 재산·부동산·행운
        const d4LagnaInterp = ['Actively acquires property. Likes building or buying new homes.','Stable, abundant real estate. Land and farms. Luxurious dwelling.','Multiple homes or frequent moves. Prefers intellectual environment.','Home and property are emotionally important. Near water. Property from mother.','Grand, spacious home. Luxurious interior. Prestigious area.','Clean, practical dwelling. Health-focused environment. Multiple small properties.','Beautiful, harmonious home. Interest in interior design. Property with partner.','Property undergoes transformation. Inherited property. Secret places.','Large land and foreign property. Near religious/educational facilities.','Systematic property investment. Old buildings. Slow but sure asset growth.','Unique dwelling style. Modern apartment. Tech-related facilities.','Beautiful home near water. Foreign property. Spiritual space.'][dLagnaSign];

        const d4_4sign = (dLagnaSign + 3) % 12;
        const d4_4planets = dPositions.filter(p => p.dSign === d4_4sign);
        const d4_10sign = (dLagnaSign + 9) % 12;
        const d4_10planets = dPositions.filter(p => p.dSign === d4_10sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '🏠 Property & Fortune Analysis' : '🏠 D4 Chaturthamsha — Property & Fortune Analysis') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D4 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d4LagnaInterp + '<br><br>';

        html += '<strong>' + (isEasy ? 'Property/Home:' : 'D4 4 house (부동산/가정) — ' + SIGNS[d4_4sign] + ':') + '</strong><br>';
        if (d4_4planets.length > 0) {
            const prop = {Sun:'정부 소유 건물이나 권위 있는 주거',Moon:'아름다운 집. 물 근처. Mother의 영향',Mars:'새 집 건축. 부동산 분쟁 가능',Mercury:'사업용 부동산. 여러 채 소유',Jupiter:'넓고 풍족한 집! Best 부동산 운',Venus:'럭셔리한 집. 아름다운 인테리어',Saturn:'오래된 집. 수리 필요. 중년 이후 안정',Rahu:'해외 부동산. 비전통적 주거',Ketu:'부동산에 무관심. 영적 공간 선호'};
            d4_4planets.forEach(p => { html += isEasy ? (prop[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (prop[p.id]||'') + '<br>'; });
        } else html += isEasy ? '안정적인 부동산 운이에요.<br>' : '4 house no planets — 4 lord의 position가 부동산의 열쇠.<br>';

        html += '<br><strong>' + (isEasy ? 'Overall fortune:' : 'D4 10 house (전반적 행운) — ' + SIGNS[d4_10sign] + ':') + '</strong><br>';
        if (d4_10planets.length > 0) {
            d4_10planets.forEach(p => {
                html += isEasy ? (p.natural === 'benefic' ? '전반적 행운이 좋음!<br>' : '행운을 위해 노력이 필요하지만 성장의 기회.<br>') : '• ' + p.name + ': ' + (p.natural === 'benefic' ? 'Benefic 10 house position하여 전반적 행운이 좋음!' : 'Malefic 10 house — 행운을 위해 노력이 필요하지만 성장의 기회.') + '<br>';
            });
        } else html += isEasy ? '' : '10 house no planets.<br>';
        html += '</div></div>';

    } else if (division === 16) {
        // D16 Shodashamsha — 차량·comfort·행복
        const d16LagnaInterp = ['Sports cars, motorcycles — dynamic vehicles. Enjoys driving.','고급 차량과 편안한 이동 수단. 럭셔리한 물질적 comfort.','여러 대의 차량 또는 다양한 이동 수단. 기술적 기기 좋아함.','편안한 가정용 차량. 가족과의 여행. 물질적 안정이 행복.','최고급 차량. 과시적 소비. 고급 브랜드 선호.','실용적이고 연비 좋은 차량. health 관련 기기.','세련되고 디자인 좋은 차량. 미적 감각 있는 물건들.','중고차나 상속받은 차량. 보험이 중요. 변혁적 물질 경험.','SUV나 해외 브랜드. 여행용 차량. 모험적 이동 수단.','검소하지만 튼튼한 차량. 실용성 우선. 중년 이후 좋은 차.','전기차나 최신 기술 차량. 독특한 이동 수단.','물 관련 이동(보트). 감성적으로 좋아하는 물건들.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '🚗 차량·comfort·행복 분석' : '🚗 D16 Shodashamsha — 차량·comfort·행복 분석') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D16 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d16LagnaInterp + '<br><br>';

        const d16_4sign = (dLagnaSign + 3) % 12;
        const d16_4planets = dPositions.filter(p => p.dSign === d16_4sign);
        html += '<strong>' + (isEasy ? 'Comfort/Happiness:' : 'D16 4 house (comfort/행복) — ' + SIGNS[d16_4sign] + ':') + '</strong><br>';
        if (d16_4planets.length > 0) {
            d16_4planets.forEach(p => {
                html += isEasy ? (p.natural === 'benefic' ? '물질적 comfort와 행복이 풍부!<br>' : '물질적 comfort를 위해 노력 필요.<br>') : '• ' + p.name + ': ' + (p.natural === 'benefic' ? 'Material comfort and happiness abundant!' : 'Effort needed for material comfort.') + '<br>';
            });
        } else html += isEasy ? '물질적 comfort는 보통이에요.<br>' : '4 house no planets — 4 lord의 position가 행복의 열쇠.<br>';

        const venD16 = dPositions.find(p => p.id === 'Venus');
        if (venD16) {
            const vH = ((venD16.dSign - dLagnaSign + 12) % 12) + 1;
            html += isEasy ? '<br>' : '<br><strong>♀ Venus (comfort의 karaka):</strong> ';
            html += [,'Creates own comfort','Comfort through wealth','Happiness through communication','Great happiness at home!','Happiness through children/romance','Comfort through health management','Happiness through spouse!','Happiness through transformation','Happiness through travel/learning','Comfort through social status','Happiness through friends/network','Happiness through spiritual peace'][vH] || '';
        }
        html += '</div></div>';

    } else if (division === 20) {
        // D20 Vimshamsha — 영적 practice·종교
        const d20LagnaInterp = ['Active spirituality. Karma yoga. Practice through active service.','Spirituality through nature and senses. Mantra practice. Temple meditation.','지적 영성. 경전 연구. 명상보다 지식을 통한 깨Moon음.','감정적 영성. 바크티 요가(헌신). Mother 같은 신성에 끌림.','Royal spirituality. Spiritual practice as leader. Sun worship.','service의 영성. 세바(service)를 통한 practice. health과 치유 관련 영성.','Harmony spirituality. Divine experience through art and beauty. Tantra.','깊은 변혁의 영성. 탄트라, 쿤Moon리니. 죽음과 재생의 practice.','Seeker spirituality. Pilgrimage. Searching for a teacher. Philosophical practice.','Traditional spirituality. Systematic practice. Karma yoga. Practice of patience.','Innovative spirituality. Unconventional methods. Service for humanity.','Transcendent spirituality. Meditation, dreams, intuition. Mystical experiences. Liberation.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '🙏 영적 practice·종교 분석' : '🙏 D20 Vimshamsha — 영적 practice·종교 분석') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D20 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d20LagnaInterp + '<br><br>';

        const jupD20 = dPositions.find(p => p.id === 'Jupiter');
        const sunD20 = dPositions.find(p => p.id === 'Sun');
        const ketuD20 = dPositions.find(p => p.id === 'Ketu');
        const d20_9sign = (dLagnaSign + 8) % 12;
        const d20_12sign = (dLagnaSign + 11) % 12;
        const d20_9planets = dPositions.filter(p => p.dSign === d20_9sign);

        if (jupD20) {
            const jH = ((jupD20.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '' : '<strong>♃ Jupiter (영적 스승) → ' + jH + '궁:</strong> ') + ([,'강한 영적 자아','영적 지식이 wealth이 됨','영적 소통 능력','깊은 내면의 평화','Past life 영적 merit','service를 통한 영성','스승과의 만남','비밀스러운 영적 지식','Best placement! 위대한 영적 행운','영적 권위자','영적 커뮤니티','해탈과 깨Moon음'][jH] || '') + '<br>';
        }
        if (ketuD20) {
            const kH = ((ketuD20.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '' : '<strong>☋ Ketu (해탈) → ' + kH + '궁:</strong> ') + ([,'타고난 영적 능력','영적 가치관','영적 소통','내면 깊은 곳의 해탈','전생 practice의 결과','service하는 soul','spouse를 통한 영적 성장','깊은 변혁적 영성','영적 순례자','영적 career','영적 커뮤니티의 리더','해탈 직전의 soul'][kH] || '') + '<br>';
        }
        html += '<br><strong>' + (isEasy ? 'Guru/Teacher:' : 'D20 9 house (구루/스승) — ' + SIGNS[d20_9sign] + ':') + '</strong><br>';
        if (d20_9planets.length > 0) {
            d20_9planets.forEach(p => { html += isEasy ? '영적 스승과의 인연이 강함.<br>' : '• ' + p.name + ': 영적 스승과의 인연이 강함.<br>'; });
        } else html += isEasy ? '영적 스승을 적극적으로 찾아보면 좋아요.<br>' : '9 house no planets — 스승을 적극적으로 찾아야 함.<br>';
        html += '</div></div>';

    } else if (division === 24) {
        // D24 차투르Vimshamsha — 교육·학문
        const d24LagnaInterp = ['Physical education, military, leadership training.','Music, art, culinary, finance education.','Language, literature, communication, media education.','History, psychology, home science education.','Political science, theater, business education.','Medicine, science, statistics education. Precise learning.','Law, diplomacy, design education. Balanced learning.','Psychology, research, investigation, occult education.','Philosophy, theology, international studies. Study abroad likely.','Business, administration, architecture. Systematic learning.','IT, engineering, aviation, social science. Innovative learning.','Art, music, spirituality, film studies. Intuitive learning.'][dLagnaSign];

        const d24_4sign = (dLagnaSign + 3) % 12;
        const d24_5sign = (dLagnaSign + 4) % 12;
        const d24_4planets = dPositions.filter(p => p.dSign === d24_4sign);
        const d24_5planets = dPositions.filter(p => p.dSign === d24_5sign);
        const jupD24 = dPositions.find(p => p.id === 'Jupiter');
        const merD24 = dPositions.find(p => p.id === 'Mercury');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '📚 교육·학문 분석' : '📚 D24 차투르Vimshamsha — 교육·학문 분석') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D24 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d24LagnaInterp + '<br><br>';

        html += '<strong>' + (isEasy ? 'Basic Education:' : 'D24 4 house (기초 교육) — ' + SIGNS[d24_4sign] + ':') + '</strong><br>';
        if (d24_4planets.length > 0) {
            d24_4planets.forEach(p => {
                const edu4 = {Sun:'명문 학교. 권위 있는 교육',Moon:'편안한 학습 환경. 가정 교육 영향 큼',Mars:'경쟁적 학습. 체육/기술 교육 강함',Mercury:'Best placement! 뛰어난 학업 능력',Jupiter:'풍부한 교육 환경. 좋은 스승',Venus:'예술 교육. 아름다운 학교',Saturn:'어려운 교육 환경이지만 극복하면 깊은 학식',Rahu:'비전통적 교육. 외국 학교',Ketu:'교육에 관심 적음. 직관적 학습'};
                html += isEasy ? (edu4[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (edu4[p.id]||'') + '<br>';
            });
        } else html += isEasy ? '안정적인 교육 환경에서 Steadily 성장하는 타입이에요.<br>' : '4 house no planets.<br>';

        html += '<br><strong>' + (isEasy ? 'Higher Education:' : 'D24 5 house (고등 교육/지성) — ' + SIGNS[d24_5sign] + ':') + '</strong><br>';
        if (d24_5planets.length > 0) {
            d24_5planets.forEach(p => {
                html += isEasy ? (p.natural === 'benefic' ? '고등 교육에서 뛰어난 성취!<br>' : '학업에서의 도전이 성장으로 이어짐.<br>') : '• ' + p.name + ': ' + (p.natural === 'benefic' ? 'Outstanding higher education achievement!' : 'Academic challenges lead to growth.') + '<br>';
            });
        } else html += isEasy ? '꾸준한 노력으로 좋은 결과를 얻을 수 있어요.<br>' : '5 house no planets.<br>';

        if (jupD24) {
            const jH = ((jupD24.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '<br>' : '<br><strong>♃ Jupiter (지혜) → ' + jH + '궁:</strong> ') + ([1,4,5,9].includes(jH) ? '🎓 <strong>높은 학업 성취 기대!</strong> 대학원/박사/해외 유학 가능.' : (isEasy ? '학업을 통한 성장이 기대됩.' : '학업을 통한 성장. Jupiter의 축복이 ' + jH + ' house 영역에서 나타남.')) + '<br>';
        }
        if (merD24) {
            const mH = ((merD24.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '' : '<strong>☿ Mercury (학습) → ' + mH + '궁:</strong> ') + ([1,4,5,9].includes(mH) ? '📖 <strong>뛰어난 지적 능력!</strong> 수학, 언어, 분석에 재능.' : (isEasy ? '지적 능력이 잘 발휘됩.' : '지적 능력이 ' + mH + ' house 영역에서 발휘됨.')) + '<br>';
        }
        html += '</div></div>';

    } else if (division === 27) {
        // D27 삽타Vimshamsha — 체력·강점·약점
        const d27LagnaInterp = ['강한 체력과 에너지. 운동 능력 탁월. 머리/얼굴이 강점.','지구력과 인내력이 강점. 목/성대가 강함. 근력 좋음.','민첩성과 반사 신경이 강점. 손/팔이 능숙. 신경계 관리 필요.','감정적 회복력이 강점. 가슴/위장 관리 필요. 수영에 재능.','심장과 척추가 강함. 카리스마 있는 체격. 과로 주의.','소화력과 분석력이 강점. 장/피부 관리 필요. 요가 적합.','균형감과 조화로운 체형. 신장/허리 관리 필요. 댄스 적합.','회복력과 저항력이 강점. 생식기 health 관리. 극한 스포츠 가능.','허벅지와 간이 강함. 야외 운동 적합. 과체중 주의.','뼈와 관절이 강함. 인내력 최고. 나이 들수록 health해짐.','순환계와 발목이 주의점. 독특한 운동법 선호. 혁신적 health법.','면역력과 직관이 강점. 발/림프 관리 필요. 수중 운동 적합.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💪 체력·강점·약점 분석' : '💪 D27 삽타Vimshamsha — 체력·강점·약점 분석') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D27 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d27LagnaInterp + '<br><br>';

        const marsD27 = dPositions.find(p => p.id === 'Mars');
        const sunD27 = dPositions.find(p => p.id === 'Sun');
        const satD27 = dPositions.find(p => p.id === 'Saturn');
        if (marsD27) {
            const mH = ((marsD27.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '' : '<strong>♂ Mars (에너지) → ' + mH + '궁:</strong> ') + ([,'강한 체력과 의지!','체력으로 돈을 벌 수 있음','용기와 모험심 강함','가정에서 운동하는 타입','스포츠 재능!','질병을 이기는 면역력','spouse와 함께 운동','위기에서 살아남는 힘','모험/탐험 분야 강함','career적 체력 활용','목표 Moon성 에너지','해외에서 체력 활동'][mH] || '') + '<br>';
        }
        if (sunD27) {
            const sH = ((sunD27.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '' : '<strong>☉ Sun (활력) → ' + sH + '궁:</strong> ') + (isEasy ? 'Source of vitality: ' : '활력의 원천이 ' + sH + ' house 영역. ') + ([,'자아에서 에너지','wealth 활동에서 활력','소통에서 에너지','가정에서 안정','창작에서 활력','service에서 에너지','관계에서 활력','변혁에서 에너지','여행에서 활력','career에서 에너지','사회에서 활력','영적 practice에서 에너지'][sH] || '') + '<br>';
        }

        // D27 6 house (약점/질병) 분석
        const d27_6sign = (dLagnaSign + 5) % 12;
        const d27_6planets = dPositions.filter(p => p.dSign === d27_6sign);
        html += '<br><strong>' + (isEasy ? 'Weakness:' : 'D27 6 house (약점/취약점) — ' + SIGNS[d27_6sign] + ':') + '</strong><br>';
        const bodyParts = ['Head/Brain','Neck/Thyroid','Lungs/Arms','Stomach/Chest','Heart/Back','Digestive/Intestines','Kidneys/Lower back','Reproductive','Liver/Thighs','Bones/Joints','Ankles/Circulatory','Feet/Immune'];
        html += 'Vulnerable area: <strong>' + bodyParts[d27_6sign] + '</strong> — 이 부위의 health 관리에 주의하세요.<br>';
        if (d27_6planets.length > 0) {
            d27_6planets.forEach(p => { html += isEasy ? '이 부위에 특별한 주의가 필요합.<br>' : '• ' + p.name + ' 6 house position하여 이 부위에 특별한 주의가 필요합.<br>'; });
        }
        html += '</div></div>';

    } else if (division === 30) {
        // D30 Trimshamsha — 불행·질병·장애
        const d30LagnaInterp = ['Accidents, burns, headaches. Problems from hasty decisions. Manage anger.','Financial loss, dietary issues, thyroid. Watch overeating and attachment.','Nervous anxiety, insomnia, breathing problems. Avoid excessive worry.','Emotional instability, stomach issues, water-related problems. Control emotions.','Heart problems, pride damage, overwork. Need humility and rest.','Digestive disorders, allergies, perfectionism stress. Need relaxation.','Kidney problems, relationship conflicts, indecisiveness. Need decisiveness.','Secrets, accidents, surgery, sexual issues. Regular checkups important.','Liver problems, overweight, gambling/overspending. Need moderation.','Joint, bone, depression, loneliness. Need calcium and social interaction.','Blood pressure, circulation, unexpected accidents. Regular health checks.','Immune deficiency, addiction, mental health. Need meditation and sleep.'][dLagnaSign];

        const d30_6sign = (dLagnaSign + 5) % 12;
        const d30_8sign = (dLagnaSign + 7) % 12;
        const d30_12sign = (dLagnaSign + 11) % 12;
        const d30_6planets = dPositions.filter(p => p.dSign === d30_6sign);
        const d30_8planets = dPositions.filter(p => p.dSign === d30_8sign);
        const d30_12planets = dPositions.filter(p => p.dSign === d30_12sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '⚠️ health 주의사항 상세' : '⚠️ D30 Trimshamsha — 불행·질병·장애 분석') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D30 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d30LagnaInterp + '<br><br>';

        html += '<strong>' + (isEasy ? 'Disease caution:' : 'D30 6 house (질병/적) — ' + SIGNS[d30_6sign] + ':') + '</strong><br>';
        const diseaseBySign = ['Headache, fever, inflammation','Neck, thyroid, diabetes','Lungs, nerves, anxiety','Stomach, water retention','Heart, back, blood pressure','Digestive, intestines, skin','Kidneys, lower back, urinary','Reproductive, chronic conditions','Liver, thighs, overweight','Bones, joints, rheumatism','Circulatory, blood pressure, ankles','Immune, feet, mental health'];
        html += 'Watch for: <strong>' + diseaseBySign[d30_6sign] + '</strong><br>';
        if (d30_6planets.length > 0) {
            const dis = {Sun:'눈, 심장 관련 질환 주의',Moon:'정신 health, 수분 관련 문제',Mars:'사고, 수술, 화상 주의',Mercury:'신경계, 피부 문제',Jupiter:'간, 과체중 주의',Venus:'신장, 당뇨, 성병 주의',Saturn:'만성 질환, 관절 문제',Rahu:'원인불명 질환, 중독',Ketu:'면역 저하, 알레르기'};
            d30_6planets.forEach(p => { html += isEasy ? (dis[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (dis[p.id]||'') + '<br>'; });
        }

        html += '<br><strong>' + (isEasy ? 'Danger/Surgery:' : 'D30 8 house (위험/수술) — ' + SIGNS[d30_8sign] + ':') + '</strong><br>';
        if (d30_8planets.length > 0) {
            d30_8planets.forEach(p => { html += isEasy ? (p.natural === 'malefic' ? 'Danger/accident caution. Insurance important.' : 'Protected in crisis.') + '<br>' : '• ' + p.name + ': ' + (p.natural === 'malefic' ? 'Danger/accident caution. Insurance important.' : 'Protected in crisis.') + '<br>'; });
        } else html += isEasy ? '큰 위험은 적어요.<br>' : '8 house no planets — 큰 위험은 적음.<br>';

        html += '<br><strong>' + (isEasy ? 'Hospitalization:' : 'D30 12 house (입원/손실) — ' + SIGNS[d30_12sign] + ':') + '</strong><br>';
        if (d30_12planets.length > 0) {
            d30_12planets.forEach(p => { html += isEasy ? (p.natural === 'malefic' ? 'Hospitalization possible.' : 'Spiritual healing and recovery.') + '<br>' : '• ' + p.name + ': ' + (p.natural === 'malefic' ? 'Hospitalization possible. Foreign medical.' : 'Spiritual healing and recovery.') + '<br>'; });
        } else html += isEasy ? '입원 위험은 낮아요.<br>' : '12 house no planets — 입원 위험 낮음.<br>';
        html += '</div></div>';

    } else if (division === 40) {
        // D40 Khavedamsha — 모계 유산
        const d40LagnaInterp = ['Independent, strong-willed mother. Leadership inherited from maternal line.','Mother manages wealth well. Material abundance from maternal line.','Intellectual mother with good communication. Language/education talent inherited.','Very deep bond with mother. Sensitivity and intuition inherited.','Mother has authority and dignity. Leadership and honor inherited.','Mother excels at health management. Analytical/service spirit inherited.','Attractive, diplomatic mother. Artistic sense inherited.','Strong mother who went through transformation. Resilience inherited.','Educational, religious mother. Wisdom/philosophy inherited.','Responsible, strict mother. Patience and discipline inherited.','Unique, progressive mother. Innovative thinking inherited.','Spiritual, intuitive mother. Art/spirituality inherited.'][dLagnaSign];

        const d40_4sign = (dLagnaSign + 3) % 12;
        const d40_4planets = dPositions.filter(p => p.dSign === d40_4sign);
        const moonD40 = dPositions.find(p => p.id === 'Moon');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👩 Mother 쪽 유산 분석' : '👩 D40 Khavedamsha — 모계 유산 분석') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D40 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d40LagnaInterp + '<br><br>';

        if (moonD40) {
            const mH = ((moonD40.dSign - dLagnaSign + 12) % 12) + 1;
            if (!isEasy) html += '<strong>☽ Moon (Mother karaka):</strong> ';
            html += [,'Mother has strong influence','Wealth from mother','Good communication with mother','Mother와 깊은 유대! Best placement','Mother is creative','Mother is service-oriented','Mother influences relationships','Inheritance from mother','Mother is religious/educational','Mother has social status','Mother is independent','Mother is spiritual'][mH] || '';
            html += '<br>';
        }

        html += '<br><strong>' + (isEasy ? 'Maternal family:' : 'D40 4 house (모계 가정) — ' + SIGNS[d40_4sign] + ':') + '</strong><br>';
        if (d40_4planets.length > 0) {
            d40_4planets.forEach(p => { html += isEasy ? 'Mother 쪽 가정에서 강하게 유전된 에너지가 있습.<br>' : '• ' + p.name + ': 모계 가정에서 이 행성의 에너지가 강하게 유전됨.<br>'; });
        } else html += isEasy ? 'Mother 쪽에서 안정적인 유산이 있어요.<br>' : '4 house no planets — 4 lord의 position가 모계 유산의 열쇠.<br>';
        html += '</div></div>';

    } else if (division === 45) {
        // D45 Akshavedamsha — 부계 유산
        const d45LagnaInterp = ['Active, action-oriented father. Courage and leadership inherited.','Financially stable father. Material values inherited.','Intellectual, versatile father. Communication/business ability inherited.','Emotional, family-oriented father. Caring instinct inherited.','Authoritative, respected father. Leadership inherited.','Practical, diligent father. Analytical/technical skills inherited.','Diplomatic, refined father. Social ability inherited.','Strong, mysterious father. Resilience/insight inherited.','Scholarly, religious father. Philosophy/morality inherited.','Strict, ambitious father. Patience/discipline inherited.','Creative, innovative father. Tech/scientific thinking inherited.','Spiritual, artistic father. Intuition/creativity inherited.'][dLagnaSign];

        const d45_9sign = (dLagnaSign + 8) % 12;
        const d45_9planets = dPositions.filter(p => p.dSign === d45_9sign);
        const sunD45 = dPositions.find(p => p.id === 'Sun');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨 Father 쪽 유산 분석' : '👨 D45 Akshavedamsha — 부계 유산 분석') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D45 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d45LagnaInterp + '<br><br>';

        if (sunD45) {
            const sH = ((sunD45.dSign - dLagnaSign + 12) % 12) + 1;
            if (!isEasy) html += '<strong>☉ Sun (Father karaka):</strong> ';
            html += [,'Father has strong influence','Wealth from father','Good communication with father','Father is family-oriented','Father is creative','Father is service-oriented','Father influences relationships','Inheritance from father','Father is religious/educational','Father가 사회적으로 성공! Best placement','Father is independent','Father is spiritual'][sH] || '';
            html += '<br>';
        }

        html += '<br><strong>' + (isEasy ? 'Paternal family:' : 'D45 9 house (부계 가정/Father) — ' + SIGNS[d45_9sign] + ':') + '</strong><br>';
        if (d45_9planets.length > 0) {
            d45_9planets.forEach(p => { html += isEasy ? 'Father 쪽 가정에서 강하게 유전된 에너지가 있습.<br>' : '• ' + p.name + ': 부계에서 이 행성의 에너지가 강하게 유전됨.<br>'; });
        } else html += isEasy ? 'Father 쪽에서 안정적인 유산이 있어요.<br>' : '9 house no planets — 9 lord의 position가 부계 유산의 열쇠.<br>';
        html += '</div></div>';
    }

    interpEl.innerHTML = html;
}


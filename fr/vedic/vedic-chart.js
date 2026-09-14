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
}
function updateCatHeaders() {
    var e = window.vedicMode === 'easy';
    var ids = {
        catGuide: e ? 'Glossaire' : 'Guide du débutant en astrologie védique',
        catBasic: e ? 'Mes positions planétaires' : 'Carte de base — Positions planétaires & Thème natal',
        catDasha: e ? 'Mes périodes de vie' : 'Dasha — Analyse des périodes de vie',
        catInterp: e ? 'Ma lecture — Personnalité·Richesse·Carrière·Santé' : 'Interprétation — Personnalité·Richesse·Carrière·Santé·Yoga',
        catMarriage: e ? 'Détails de mon partenaire' : 'Mariage & Partenaire — D9 Navamsha',
        catCareer: e ? 'Ma carrière·Richesse' : 'Carrière & Richesse — D10·D2·D4',
        catFamily: e ? 'Ma famille' : 'Famille — D7·D3·D12·D40·D45',
        catSpirit: e ? 'Spiritualité·Éducation·Santé' : 'Spiritualité·Éducation·Santé — D20·D24·D27·D16',
        catWarn: e ? 'Précautions de santé' : 'Précautions — D30 Maladie·Étranger',
        catKarma: e ? 'Karma des vies passées' : 'Karma — D60 Vies passées·Karma'
    };
    for (var id in ids) { var el = document.getElementById(id); if (el) el.textContent = ids[id]; }

    var secs = {
        secPlanetHouse: e ? 'Comment chaque planète vous affecte' : 'Analyse planète-en-maison',
        secDignity: e ? 'Vos forces et faiblesses' : 'Dignité planétaire (Exaltation·Débilité·Domicile)',
        secLucky: e ? 'Info chance' : 'Informations de chance',
        secRemedy: e ? 'Façons de renforcer votre chance' : 'Remèdes & Renforcement',
        secD10: e ? 'Détails de carrière' : 'D10 Dashamsha (Carrière)',
        secD2: e ? 'Détails de richesse' : 'D2 Hora (Richesse)',
        secD4: e ? 'Propriétés & Immobilier' : 'D4 Chaturthamsha (Propriété)',
        secD7: e ? 'Enfants' : 'D7 Saptamsha (Enfants)',
        secD3: e ? 'Frères/Sœurs & Courage' : 'D3 Drekkana (Frères/Sœurs)',
        secD12: e ? 'Parents' : 'D12 Dwadashamsha (Parents)',
        secD40: e ? 'Héritage maternel' : 'D40 Khavedamsha (Maternel)',
        secD45: e ? 'Héritage paternel' : 'D45 Akshavedamsha (Paternel)',
        secD24: e ? 'Éducation' : 'D24 Chaturvimshamsha (Éducation)',
        secD20: e ? 'Spiritualité' : 'D20 Vimshamsha (Spiritualité)',
        secD27: e ? 'Force physique' : 'D27 Saptavimshamsha (Force)',
        secD16: e ? 'Véhicules & Confort' : 'D16 Shodashamsha (Véhicules)',
        secD30: e ? 'Détails précautions santé' : 'D30 Trimshamsha (Maladie)',
        secForeign: e ? 'Étranger & Immigration' : 'Étranger & Immigration (9e·12e Maison)'
    };
    for (var sid in secs) { var sel = document.getElementById(sid); if (sel) sel.textContent = secs[sid]; }
}
function renderEasyMode(positions, lagnaSign, moonPos) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    var html = '';
    // Personality
    var personality = ['Orienté action ! Décisions rapides avec des qualités de leadership. Aime les nouveaux défis.','Aime la stabilité. Apprécie le confort et la beauté. Une fois décidé, va jusqu\'au bout.','Infiniment curieux ! Grand communicateur et multi-talentueux.','Chaleureux et émotionnel. Chérit la famille et lit bien les gens.','Leader né ! Grande présence avec un talent créatif.','Orienté détails et analytique. Cherche la perfection et prend soin de sa santé.','Cherche l\'harmonie. Raffiné, charmant, avec un excellent sens artistique.','A de la profondeur. Forte intuition qui voit la vérité.','Esprit libre ! Aime voyager et apprendre, très positif.','Ambitieux. Patient et plus attrayant avec l\'âge.','Unique. Pense différemment de tout le monde, innovant.','Profondément sensible. Forte intuition attirée par l\'art et la spiritualité.'][lagnaSign];
    html += '<div class="interp-card"><div class="interp-title">👤 Ma personnalité</div><div class="interp-text">' + personality + '</div></div>';

    // Emotions
    if (moonPos) {
        var emotion = ['Une passion ardente brûle en vous. Les émotions montent vite et redescendent vite. En cas de stress, bougez votre corps. L\'exercice et les activités en plein air marchent le mieux.','Émotionnellement très stable. N\'aime pas les changements soudains, trouve la sécurité dans le familier. Bonne nourriture, musique et nature guérissent votre âme.','Traite les émotions rationnellement. Parler aide à organiser les sentiments. Curieux de beaucoup de choses à la fois et ne supporte pas l\'ennui.','Extrêmement sensible. Absorbe les émotions des autres comme une éponge. La maison est votre espace sûr avec un lien fort avec la mère.','Expression émotionnelle dramatique et passionnée. A profondément besoin d\'amour et de reconnaissance. Les activités créatives sont votre médecine émotionnelle.','Tend à analyser et organiser les émotions. S\'inquiète beaucoup mais excellent en solutions pratiques. Les routines quotidiennes apportent la stabilité émotionnelle.','Trouve l\'équilibre émotionnel dans les relations. Se sent seul(e) seul(e), se stabilise avec un partenaire ou des amis proches. L\'art et la beauté apportent la paix.','Les émotions sont aussi profondes et intenses que l\'océan. Aime profondément et n\'oublie jamais la trahison. Intuition incroyablement forte.','Émotionnellement lumineux et optimiste. Aime la liberté et déteste les contraintes. Voyager est le meilleur remède émotionnel.','Ne montre pas facilement ses émotions. Fort sens des responsabilités. Devient plus ouvert émotionnellement avec l\'âge.','Schémas émotionnels uniques et imprévisibles. Aime de manières non conventionnelles. Trouve l\'épanouissement émotionnel dans les causes sociales.','Extrêmement intuitif et spirituel. Les rêves sont vivides et parfois prophétiques. Art, méditation et eau apportent la paix.'][moonPos.sign];
        html += '<div class="interp-card"><div class="interp-title">🌙 Mon style émotionnel</div><div class="interp-text">' + emotion + '</div></div>';
    }

    // Wealth
    var wealth = ['Type autodidacte. Style d\'investissement agressif, mieux adapté au travail indépendant. Peut gagner vite mais attention aux investissements hâtifs.','Accumule la richesse régulièrement. Revenus probables de l\'immobilier, art, alimentation. L\'équilibre des dépenses est la clé.','Gagne par les capacités intellectuelles. Revenus de l\'écriture, éducation, informatique, marketing. Plusieurs sources de revenus conviennent bien.','La richesse vient par la maison et la famille. Peut hériter de la mère ou gagner par l\'immobilier. Attention aux dépenses émotionnelles.','Gagne par le leadership et l\'autorité. La richesse suit les positions élevées. Lié au gouvernement et à l\'or.','Gagne par l\'analyse et les compétences professionnelles. Revenus stables de la médecine, comptabilité, service.','Gagne par les partenariats. Meilleure fortune avec les autres. Revenus du droit, diplomatie, mode, art.','Accumule par les ressources des autres — héritage, assurance, investissements. Peut protéger la richesse en crise.','La fortune suit votre richesse. Revenus de l\'éducation, étranger, philosophie. La chance inattendue apporte la richesse.','Accumule lentement mais sûrement. Difficultés financières au début mais richesse stable après la cinquantaine.','Gagne par la technologie, innovation, réseaux sociaux. Méthodes de revenus non conventionnelles.','Gagne par l\'art ou les activités spirituelles. Connexions de richesse étrangère. La richesse spirituelle attire paradoxalement la richesse.'][lagnaSign];
    html += '<div class="interp-card"><div class="interp-title">💰 Ma richesse</div><div class="interp-text">' + wealth + '</div></div>';

    // Spouse
    var spouse = ['Votre partenaire est énergique et indépendant. Actif et direct, passionné par son travail. Pas du type à suivre en silence — un partenaire qui défie ensemble.','Votre partenaire est beau et sensuel. Apprécie les belles choses, stable et loyal. Peut avoir du talent en cuisine ou art.','Votre partenaire est éloquent et spirituel. La grande conversation est le plus grand charme. Un partenaire intellectuel et polyvalent.','Votre partenaire est chaleureux et orienté famille. Excellentes capacités de soins. Être ensemble donne le sentiment d\'être chez soi.','Votre partenaire est charismatique et digne. Peut occuper une position socialement importante. Haute estime de soi mais également généreux.','Votre partenaire est méticuleux et pratique. Intéressé par la santé et le bien-être. Un type attentionné aux détails.','Votre partenaire est charmant et raffiné. Diplomatique avec un bon sens de l\'équilibre, excellent goût artistique.','Votre partenaire est intense et mystérieux. Émotions profondes — une fois engagé, va jusqu\'au bout. Attraction intense et prédestinée.','Votre partenaire est libre d\'esprit et optimiste. Peut être d\'une autre culture ou lié à l\'étranger. Philosophique et aventurier.','Votre partenaire est sérieux et ambitieux. Fort sens des responsabilités, probablement socialement réussi. Le mariage peut venir tard mais dure longtemps.','Votre partenaire est unique et indépendant. Peut se rencontrer de manières non conventionnelles. Intellectuel avec une pensée innovante.','Votre partenaire est spirituel et intuitif. Lié à un artiste ou praticien spirituel. Donne un sentiment rêveur et romantique.'][(lagnaSign+6)%12];
    // 7 house 행성 추가 정보
    var h7p = positions.filter(function(p){return houseOf(p.sign)===7;});
    var spouseExtra = '';
    h7p.forEach(function(p) {
        var desc = {Sun:'A spouse with high social status.',Moon:'An emotional and caring spouse.',Mars:'Passionate but arguments possible. Strong spouse.',Mercury:'An intellectual spouse with great conversation.',Jupiter:'A wise and moral spouse! Best marriage fortune.',Venus:'A very attractive and loving spouse.',Saturn:'Late marriage but lasting relationship. Age difference possible.',Rahu:'Unconventional marriage. Foreign spouse possible.',Ketu:'Past-life connection. A spouse with strong spiritual bond.'};
        if (desc[p.id]) spouseExtra += '<br>✦ ' + desc[p.id];
    });
    html += '<div class="interp-card"><div class="interp-title">💍 Mon partenaire</div><div class="interp-text">' + spouse + spouseExtra + '</div></div>';

    // Career
    var career = ['Carrières de leadership. Militaire, police, sport, chirurgie, gestion d\'entreprise. Le travail indépendant convient bien.','Finance, alimentation, immobilier, mode, art. Excelle dans les environnements sensuels et stables.','Carrières de communication et intellectuelles. Médias, écriture, éducation, informatique, marketing.','Professions de soins. Médecine, soins infirmiers, hôtellerie, cuisine, conseil.','Carrières de scène. Politique, divertissement, gestion, gouvernement. Positions créatives et autoritaires.','Carrières d\'analyse et de précision. Médecine, comptabilité, conseil, gestion de santé.','Carrières d\'harmonie et de beauté. Droit, diplomatie, mode, design intérieur, conseil.','Carrières d\'investigation profonde. Recherche, assurance, médecine, psychologie, impôts.','Carrières d\'apprentissage et d\'exploration. Éducation, droit, religion, édition, voyage.','Carrières de système et d\'organisation. Gestion, fonction publique, architecture. Succès lent mais certain.','Carrières d\'innovation et de technologie. Informatique, science, aviation, travail social.','Carrières d\'art et de spiritualité. Art, cinéma, musique, médecine, étranger, ONG.'][(lagnaSign+9)%12];
    html += '<div class="interp-card"><div class="interp-title">💼 Ma carrière</div><div class="interp-text">' + career + '</div></div>';

    // Health
    var health = ['Tête et visage sont des points faibles. Maux de tête et fièvres fréquents. Exercice régulier et rester hydraté. Attention aux accidents.','Cou et thyroïde sont faibles. Tendance à trop manger — attention au poids et diabète. Bonne nourriture avec modération.','Poumons, bras, épaules, système nerveux. Anxiété et problèmes de sommeil possibles. La méditation respiratoire aide.','Zone de l\'estomac et de la poitrine. Le stress émotionnel affecte directement la digestion. Nourriture chaude et thé aident.','Cœur, dos, colonne vertébrale. Attention au surmenage. Exercice cardiovasculaire régulier. Se reposer suffisamment.','Système digestif, intestins, peau. Indigestion et allergies possibles. Le régime est crucial.','Reins, bas du dos, peau. Rester hydraté et équilibré. Réduire le sucre.','Systèmes reproducteur et excréteur. Conditions chroniques possibles. Examens réguliers importants.','Foie, cuisses, hanches. Attention au poids. Activités en plein air les meilleures.','Os, articulations, genoux, peau. Attention au rhumatisme. Calcium et vitamine D importants.','Chevilles, mollets, système circulatoire. Gestion de la pression artérielle importante.','Pieds, lymphatique, système immunitaire. Un sommeil adéquat est votre secret de santé le plus puissant.'][lagnaSign];
    html += '<div class="interp-card"><div class="interp-title">🏥 Ma santé</div><div class="interp-text">' + health + '</div></div>';

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
                    var dashaDesc = {Ketu:'Une phase de croissance spirituelle. Concentrez-vous sur votre intérieur plutôt que le matériel.',Venus:'Un temps d\'amour et d\'abondance ! Romance, mariage et art fleurissent.',Sun:'Un temps de découverte de soi et de leadership. La confiance grandit fortement.',Moon:'Un temps d\'émotions et de foyer. Les relations familiales deviennent importantes.',Mars:'Un temps d\'action et d\'énergie. Excellent pour commencer de nouvelles choses.',Rahu:'Un temps de changement et d\'innovation. Des opportunités inattendues surgissent.',Jupiter:'Un temps de chance et de croissance ! Beaucoup de bonnes choses en éducation, mariage, promotion.',Saturn:'Un temps de patience et d\'épreuves. Croissance lente mais certaine.',Mercury:'Un temps d\'activité intellectuelle. Favorable pour les études, affaires, communication.'};
                    html += '<div class="interp-card"><div class="interp-title">⏳ Ma période actuelle</div><div class="interp-text">Période actuelle : <strong style="color:#c9a84c;">' + DASHA_KO[planet] + '</strong>.<br><br>' + (dashaDesc[planet]||'') + '</div></div>';
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
const SIGNS = ['Bélier','Taureau','Gémeaux','Cancer','Lion','Vierge',
               'Balance','Scorpion','Sagittaire','Capricorne','Verseau','Poissons'];
const SIGNS_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

// Planets
const PLANETS = [
    { id: 'Sun', name: 'Soleil', symbol: '☉', natural: 'malefic' },
    { id: 'Moon', name: 'Lune', symbol: '☽', natural: 'benefic' },
    { id: 'Mars', name: 'Mars', symbol: '♂', natural: 'malefic' },
    { id: 'Mercury', name: 'Mercure', symbol: '☿', natural: 'neutral' },
    { id: 'Jupiter', name: 'Jupiter', symbol: '♃', natural: 'benefic' },
    { id: 'Venus', name: 'Venus', symbol: '♀', natural: 'benefic' },
    { id: 'Saturn', name: 'Saturne', symbol: '♄', natural: 'malefic' },
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
    html += '<th>Planète</th><th>Signe</th><th>Degré</th><th>Nakshatra</th><th>Maison</th>';
    html += '</tr></thead><tbody>';

    // Add Lagna first with exact degree
    const lagnaDeg = lagnaSidereal % 30;
    const lagnaNakIdx = Math.floor(lagnaSidereal / (360/27));
    const lagnaNak = NAKSHATRAS[lagnaNakIdx] || {ko:'-'};
    html += `<tr><td>⬆ Lagna (Ascendant)</td><td>${SIGN_SYMBOLS[lagnaSign]} ${SIGNS[lagnaSign]}</td><td>${lagnaDeg.toFixed(1)}°</td><td>${lagnaNak.ko}</td><td>1</td></tr>`;

    positions.forEach(p => {
        const house = ((p.sign - lagnaSign + 12) % 12) + 1;
        const nak = NAKSHATRAS[p.nakshatra] || { ko: '-', name: '-' };
        const roleMap = { Sun:'Soi/Autorité', Moon:'Émotions/Esprit', Mars:'Énergie/Courage', Mercury:'Intelligence/Communication', Jupiter:'Chance/Sagesse', Venus:'Amour/Charme', Saturn:'Patience/Responsabilité', Rahu:'Désir/Innovation', Ketu:'Spiritualité/Libération' };
        const houseArea = ['','Soi','Argent·Famille','Communication','Foyer','Enfants·Romance','Santé','Partenaire','Transformation','Fortune·Étranger','Carrière','Revenus','Spiritualité'];
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
    // Navamsa: 각 사인(30도)을 9등분(3.333...도), 파다에 따라 사인 배정
    // Fire signs(0,4,8=Aries,Leo,Sagittarius): Aries부터 시작
    // Earth signs(1,5,9=Taurus,Virgo,Capricorn): Capricorn자리부터 시작
    // Air signs(2,6,10=Gemini,Libra,Aquarius): Libra자리부터 시작
    // Water signs(3,7,11=게,Scorpio,Pisces): 게자리부터 시작
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
        'Leadership, militaire, sport, entrepreneuriat (pionnier de feu)',
        'Finance, agriculture, arts, immobilier, alimentation (stabilite et materiel)',
        'Communication, medias, ecriture, enseignement, marketing (intellectuel)',
        'Soins infirmiers, cuisine, hotellerie, conseil (soin emotionnel)',
        'Politique, divertissement, leadership, creativite (scene brillante)',
        'Medecine, comptabilite, analyse, edition, sante (service precis)',
        'Droit, diplomatie, design, mode, mediation (equilibre et beaute)',
        'Recherche, investigation, medecine, occultisme, psychologie (profondeur)',
        'Education, voyage, philosophie, religion, edition (expansion)',
        'Gouvernement, construction, gestion, CEO, leader (systeme et autorite)',
        'Technologie, IT, invention, activisme social, science (innovation)',
        'Arts, spiritualite, guerison, musique, charite (transcendance et service)'
    ];

    // 행성별 spouse career 경향
    const planetCareer = {
        Sun: 'Fonctionnaire, politicien, medecin, CEO — positions autoritaires',
        Moon: 'Infirmier, conseiller, chef, hotellerie — roles de soins',
        Mars: 'Militaire, police, chirurgien, ingenieur, athlete',
        Mercury: 'Ecrivain, professeur, programmeur, comptable, commercant',
        Jupiter: 'Professeur, juge, leader religieux, consultant, professionnel senior',
        Venus: 'Designer, acteur, musicien, mode, industrie de la beaute',
        Saturn: 'Construction, mines, agriculture, gestion, artisan',
        Rahu: 'IT, lie a l\'etranger, carrieres non conventionnelles, recherche',
        Ketu: 'Spiritualite, medecine alternative, recherche, ascete'
    };

    let html = '';

    // 1. D9 Lagna 분석 (결혼 후 본인)
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '🕉️ Vous après le mariage' : '🕉️ D9 Lagna — You After Marriage: ' + SIGNS[d9LagnaSign] + ' ' + SIGN_SYMBOLS[d9LagnaSign]}</div>
        <div class="interp-text">
            ${isEasy ? 'This reveals your true self after marriage and in the second half of life (after 30s).' : 'Navamsa Lagna is in <strong>' + SIGNS[d9LagnaSign] + '</strong>. This reveals your true self after marriage and in the second half of life (after 30s).'}
            ${d9LagnaSign === d1LagnaSign ? (isEasy ? '<br><br><strong>Special sign!</strong> Your essence remains unchanged after marriage — inner and outer self are aligned.' : '<br><br><strong>D1 and D9 Lagna in same sign!</strong> Called <strong>Vargottama</strong> — very powerful. Your essence remains unchanged after marriage.') : ''}
            ${d9H1Planets.length > 0 ? '<br><br>' + (isEasy ? 'There are energies that strongly influence your personality after marriage.' : '<strong>Planets in D9 1st:</strong> ' + d9H1Planets.map(p => p.symbol + ' ' + p.name).join(', ') + ' — strongly influence your personality after marriage.') : ''}
        </div>
    </div>`;

    // 2. D9 7 house (spouse)
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '💍 Caractère du partenaire' : '💍 D9 7th House — Spouse Character: ' + SIGNS[d9H7Sign] + ' ' + SIGN_SYMBOLS[d9H7Sign]}</div>
        <div class="interp-text">
            ${isEasy ? ((careerBySgn[d9H7Sign]||'').split(/[（(]/)[1]?.replace(/[）)]/,'') || 'unique charm') + ' quality partner.' : 'Navamsa 7th house is in <strong>' + SIGNS[d9H7Sign] + '</strong>, ruled by <strong>' + RULER_NAMES[d9H7Ruler] + '</strong>.<br><br>This reveals your spouse\'s core personality. ' + SIGNS[d9H7Sign] + ' energy partner — ' + ((careerBySgn[d9H7Sign]||'').split(/[（(]/)[1]?.replace(/[）)]/,'') || 'unique charm') + ' qualities.'}
            ${d9H7Planets.length > 0 ? '<br><br>' + (isEasy ? d9H7Planets.map(p => p.natural === 'benefic' ? 'Positive energy! You receive blessings from your spouse.' : 'Challenge energy — also opportunities for growth in marriage.').join('<br>') : '<strong>Planets in D9 7th:</strong><br>' + d9H7Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${p.natural === 'benefic' ? 'Benefic! Blessings from your spouse.' : 'Challenge energy — also opportunities for growth in marriage.'}`).join('<br>')) : ''}
        </div>
    </div>`;

    // 3. D9 10 house (본인의 Dharma/사명)
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '💼 But de vie' : '💼 D9 10th House — Life Purpose (Dharma): ' + SIGNS[d9H10Sign] + ' ' + SIGN_SYMBOLS[d9H10Sign]}</div>
        <div class="interp-text">
            ${isEasy ? 'The true calling you pursue after maturity.' : 'Navamsa 10th house is in <strong>' + SIGNS[d9H10Sign] + '</strong>, ruled by <strong>' + RULER_NAMES[d9H10Ruler] + '</strong>.<br><br>While D1\'s 10th shows your career, D9\'s 10th reveals your <strong>greater life purpose (Dharma)</strong>.'}<br><br>
            <strong>Direction of purpose:</strong> ${careerBySgn[d9H10Sign]}
            ${d9H10Planets.length > 0 ? '<br><br>' + (isEasy ? d9H10Planets.map(p => planetCareer[p.id] || 'unique career energy').join('<br>') : '<strong>Planets in D9 10th:</strong><br>' + d9H10Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: ${planetCareer[p.id] || 'unique career energy'}`).join('<br>')) : ''}
        </div>
    </div>`;

    // 4. spouse의 career (파생하우스: D9 4 house = 7 house서 10번째)
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '👔 Carrière du partenaire' : '👔 Spouse Career — Derived 10th (D9 4th): ' + SIGNS[d9H4Sign] + ' ' + SIGN_SYMBOLS[d9H4Sign]}</div>
        <div class="interp-text">
            ${isEasy ? '' : '<strong>Derived house:</strong> 10th from 7th (spouse) = D9 4th house shows spouse career.<br><br>D9 4th is in <strong>' + SIGNS[d9H4Sign] + '</strong>, ruled by <strong>' + RULER_NAMES[d9H4Ruler] + '</strong>.<br><br>'}
            <strong>Spouse career tendency:</strong> ${careerBySgn[d9H4Sign]}
            ${d9H4Planets.length > 0 ? '<br><br>' + (isEasy ? d9H4Planets.map(p => `Spouse likely works in ${planetCareer[p.id] || 'specialized field'}`).join('<br>') : '<strong>Planets in D9 4th (spouse 10th):</strong><br>' + d9H4Planets.map(p => `${p.symbol} <strong>${p.name}</strong>: Spouse likely works in ${planetCareer[p.id] || 'specialized field'}`).join('<br>')) : ''}
        </div>
    </div>`;

    // 5. 바르고타마 행성 체크
    const vargottamaPlanets = d9Positions.filter(p => p.sign === p.d9Sign);
    if (vargottamaPlanets.length > 0) {
        html += `<div class="interp-card">
            <div class="interp-title">${isEasy ? '⭐ Planètes exceptionnellement fortes' : '⭐ Vargottama Planets — Exceptionally Strong'}</div>
            <div class="interp-text">
                ${isEasy ? 'These planets are exceptionally powerful and act consistently throughout life.' : 'Planets in the same sign in both D1 and D9 are called <strong>Vargottama</strong>. Very powerful, acting consistently throughout life.'}<br><br>
                ${isEasy ? 'Exceptionally strong energy acts consistently throughout your life!' : vargottamaPlanets.map(p => `<strong>${p.symbol} ${p.name}</strong>: In both D1 and D9 ${SIGNS[p.sign]} — this planet's energy is exceptionally strong!`).join('<br>')}
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
        <div class="interp-title">${isEasy ? '🧭 D\'où vient votre partenaire' : '🧭 Spouse Direction — 6-Indicator Analysis'}</div>
        <div class="interp-text">
            ${isEasy ? 'Analysis of which direction your spouse may come from.' : 'Vedic astrology determines spouse direction by combining multiple indicators.'}<br><br>
            ${isEasy ? '' : '<strong>6 Indicators:</strong><br>' + dirSources.map(s => `• <strong>${s.name}</strong>: ${SIGNS[s.sign]} ${SIGN_SYMBOLS[s.sign]} → <strong>${DIRECTIONS[s.sign]}</strong> <span style="color:#666;font-size:12px;">(${s.desc})</span>`).join('<br>') + '<br><br><strong>🧿 Upapada Lagna (UL):</strong> 12th house Arudha Pada. Indicates spouse\'s family/background and marriage environment. → <strong>' + SIGNS[ulSign] + ' ' + SIGN_SYMBOLS[ulSign] + '</strong><br><strong>🎯 Darapada (A7):</strong> 7th house Arudha Pada. Indicates spouse\'s social image and outer impression. → <strong>' + SIGNS[a7Sign] + ' ' + SIGN_SYMBOLS[a7Sign] + '</strong><br><strong>💍 D9 7th lord (' + RULER_NAMES[d9H7Ruler] + '):</strong> The sign where Navamsa 7th house ruler goes indicates spouse\'s actual direction. → <strong>' + SIGNS[d9H7RulerSign] + ' ' + SIGN_SYMBOLS[d9H7RulerSign] + '</strong><br><strong>♀ D9 Venus:</strong> Natural significator of spouse. Venus\'s Navamsa position shows the source of spouse energy. → <strong>' + SIGNS[venusD9Sign] + ' ' + SIGN_SYMBOLS[venusD9Sign] + '</strong><br><br>'}
            <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:14px;margin-top:10px;">
                <strong style="font-size:16px;">🧭 Conclusion: ${agreement >= 4 ? 'Overwhelmingly strong' : agreement >= 3 ? 'Very strong' : agreement >= 2 ? 'Strong' : ''} ${primaryDir} direction</strong><br><br>
                Out of 6 indicators <strong>${agreement}</strong> point to <strong>${primaryDir}</strong> point to this direction.
                ${agreement >= 4 ? '<br>4+ indicators agree! <strong>Very high probability</strong>of ' + primaryDir + ' direction. Pay attention to cities, workplaces, or travels in this direction.' : ''}
                ${agreement === 3 ? '<br>3 indicators — <strong>High probability</strong>of ' + primaryDir + ' direction.' : ''}
                ${agreement === 2 ? '<br>2 indicators — ' + primaryDir + ' favored but other possibilities exist.' : ''}
                ${agreement <= 1 ? '<br>Indicators spread — spouse may come from various directions. Keep an open mind.' : ''}
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
        "Lieux actifs, sport, environnements competitifs. Premiere rencontre intense et soudaine.",
        "Lieu de travail, institutions financieres, restaurants, nature. Construire la confiance lentement.",
        "Reseaux sociaux, ecole, seminaires, en voyageant. La relation commence par la conversation.",
        "Presentations familiales, reunions de quartier, amis d'enfance. Cadres confortables.",
        "Fetes, concerts, rassemblements creatifs, lieux glamour. Premiere rencontre dramatique.",
        "Lieu de travail, hopital, lie a la sante, benevolat. Rencontre par besoins pratiques.",
        "Rendez-vous arranges, evenements juridiques/diplomatiques, expositions d'art. Rencontre elegante.",
        "Situations de crise, conversations profondes, lieux secrets. Attraction intense et predestinee.",
        "Etranger, universite, rassemblements religieux/philosophiques. Connexion de loin.",
        "Lieu de travail, evenements d'affaires, fonctions officielles. Rencontre liee au statut social.",
        "En ligne, clubs de loisirs, mouvements sociaux, ami d'un ami. Rencontre unique.",
        "Rassemblements spirituels, etranger, arts/musique, hopital. Rencontre mystique et predestinee."
    ];

    const backgroundBySgn = [
        "Famille independante et autodidacte. Fort heritage de leadership.",
        "Famille financierement stable. Valeurs traditionnelles.",
        "Famille intellectuelle et communicative. Accent sur l\'education.",
        "Foyer chaleureux et oriente famille. Forte figure maternelle.",
        "Famille prestigieuse et fiere. Statut social et reputation.",
        "Famille pratique et travailleuse. Contexte sante/medical/education.",
        "Famille equilibree et digne. Contexte arts/droit/diplomatie.",
        "Famille avec secrets ou transformations. Histoire familiale profonde.",
        "Famille savante, religieuse/philosophique. Possible contexte etranger.",
        "Famille stricte et traditionnelle. Socialement respectee.",
        "Structure familiale libre et unique. Pensee progressiste.",
        "Famille spirituelle ou artistique. Possible contexte etranger."
    ];

    const imageBySgn = [
        "Premiere impression energique et confiante. Image sportive ou forte.",
        "Premiere impression calme et fiable. Image raffinee et digne.",
        "Premiere impression brillante et bavarde. Image intellectuelle.",
        "Premiere impression chaleureuse et bienveillante. Image douce.",
        "Premiere impression glamour et charismatique. Image confiante.",
        "Premiere impression soignee et ordonnee. Image professionnelle.",
        "Premiere impression elegante et charmante. Image sophistiquee.",
        "Premiere impression mysterieuse et intense. Image profonde.",
        "Premiere impression libre et vibrante. Image aventuriere.",
        "Premiere impression serieuse et mature. Image responsable.",
        "Premiere impression unique et individualiste. Image originale.",
        "Premiere impression reveuse et mystique. Image artistique."
    ];

    const attractBySgn = [
        "Energie forte et confiance. Nature proactive et protectrice attrayante.",
        "Stabilite et charme sensuel. Apprecier bonne nourriture et textures.",
        "Esprit et conversation. La stimulation intellectuelle est l'attraction.",
        "Soins devoues et emotion. Se sentir chez soi ensemble.",
        "Presence brillante et generosite. Se sentir special ensemble.",
        "Consideration delicate et perfectionnisme. L'attention aux details charme.",
        "Elegance et personnalite harmonieuse. Le monde devient beau ensemble.",
        "Regard intense et profondeur. Focus penetrant l'ame est l'attraction.",
        "Esprit libre et humour. Les aventures commencent ensemble.",
        "Fiabilite solide et maturite. Stabilite de roc attrayante.",
        "Individualite unique et pensee progressiste. Fraicheur jamais vue.",
        "Sensibilite mystique et profondeur spirituelle. Romance de reve."
    ];

    // D1 7 house 사인으로 만남 환경
    const d1H7ForMeeting = (d1LagnaSign + 6) % 12;

    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '🤝 Environnement de rencontre' : '🤝 Environnement de rencontre — D1 7e : ' + SIGNS[d1H7ForMeeting] + ' ' + SIGN_SYMBOLS[d1H7ForMeeting]}</div>
        <div class="interp-text">
            ${isEasy ? '' : '7th house sign reveals meeting environment.<br><br>'}
            <strong>${meetingBySgn[d1H7ForMeeting]}</strong>
            ${d1H7ForMeeting === 8 || d1H7ForMeeting === 11 ? '<br><br>💡 <strong>Foreign connection possibility!</strong> Spouse may be a foreigner or you may meet abroad.' : ''}
        </div>
    </div>`;

    // UL 사인으로 spouse 가문/배경
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '🏛️ Contexte familial du partenaire' : '🏛️ Contexte du partenaire — UL : ' + SIGNS[ulSign] + ' ' + SIGN_SYMBOLS[ulSign]}</div>
        <div class="interp-text">
            ${isEasy ? '' : 'Upapada Lagna (UL) reveals spouse family background.<br><br>'}
            <strong>${backgroundBySgn[ulSign]}</strong>
        </div>
    </div>`;

    // A7 사인으로 spouse 외적 이미지
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '👤 Première impression du partenaire' : '👤 Première impression — A7 : ' + SIGNS[a7Sign] + ' ' + SIGN_SYMBOLS[a7Sign]}</div>
        <div class="interp-text">
            ${isEasy ? '' : 'Darapada (A7) shows spouse first impression.<br><br>'}
            <strong>${imageBySgn[a7Sign]}</strong>
        </div>
    </div>`;

    // D9 Venus 사인으로 spouse 매력 포인트
    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '💎 Point d\'attraction du partenaire' : '💎 Attraction du partenaire — D9 Vénus : ' + SIGNS[venusD9Sign] + ' ' + SIGN_SYMBOLS[venusD9Sign]}</div>
        <div class="interp-text">
            ${isEasy ? '' : 'Venus in Navamsa reveals spouse charm and love style.<br><br>'}
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
            <div class="nakshatra-name">Your Star: ${nak.ko}</div>
            <div class="nakshatra-meaning">"${nak.meaning}"</div>
            <div class="nakshatra-detail">${nak.desc}</div>
        </div>
    ` : `
        <div class="nakshatra-card">
            <div class="nakshatra-name">${nak.ko} (${nak.name})</div>
            <div class="nakshatra-meaning">"${nak.meaning}" — Ruling Planet: ${DASHA_KO[nak.ruler] || nak.ruler}</div>
            <div class="nakshatra-detail">
                Deity: ${nak.deity}<br><br>
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
        '<div class="interp-card" style="margin-bottom:12px;border-left:3px solid #c9a84c;"><div class="interp-text" style="font-size:12px;color:#888;">💡 Life flows with different energies. Check your current period.<br><br>' :
        '<div class="interp-card" style="margin-bottom:12px;border-left:3px solid #c9a84c;"><div class="interp-text" style="font-size:12px;color:#888;">💡 <strong>Vimshottari Dasha</strong> — Life is divided into periods ruled by 9 planets. <strong>Mahadasha</strong> is the major period, <strong>Antardasha (Bhukti)</strong> is the sub-period. Calculated from Moon nakshatra position.<br><br>';
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
        const dashaEasyDesc = {Ketu:'Réflexion intérieure & croissance spirituelle',Venus:'Amour, beauté & abondance',Sun:'Confiance & leadership brillent',Moon:'Émotions & foyer au premier plan',Mars:'Défis & énergie d\'action',Rahu:'Grands changements & nouvelles opportunités',Jupiter:'Chance & croissance arrivent',Saturn:'La patience apporte de grandes récompenses',Mercury:'Études, communication & affaires prospèrent'};
        html += '<span class="dasha-planet">' + (isEasy ? dashaEasyDesc[p.planet] : DASHA_KO[p.planet]) + '</span>';
        html += '<span class="dasha-period">' + fmtDate(p.startD) + ' ~ ' + fmtDate(p.endD) + '</span>';
        html += '<span class="dasha-years">' + (p.actualDays / 365.25).toFixed(1) + ' yrs</span>';
        if (isCurrent) html += '<span class="dasha-badge">Current</span>';
        html += '<span style="font-size:10px;color:#666;margin-left:4px;">(' + age + ') ▼</span>';

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
        'Orienté action ! Rapide à décider avec des qualités de leadership naturel. Vous aimez les nouveaux défis. On vous demande souvent de prendre les devants. Un peu impatient, mais incroyablement déterminé.',
        'Vous aimez la stabilité. Vous appréciez le confort, la beauté et la bonne nourriture. Une fois décidé, vous allez jusqu\'au bout. Têtu, mais cela vous rend incroyablement fiable.',
        'Curieux de tout ! Grand communicateur et multi-talentueux. Vous assimilez vite les nouvelles informations et attirez les gens par votre esprit. Parfois dispersé, mais c\'est votre charme.',
        'Chaleureux et émotionnel. Vous chérissez la famille et lisez bien les sentiments des gens. Un soignant naturel qui met tout le monde à l\'aise. Les sautes d\'humeur arrivent, mais votre empathie est votre superpouvoir.',
        'Leader né ! Vous avez une grande présence et attirez naturellement l\'attention. Confiant et magnétique. Vous désirez la reconnaissance, mais vous êtes également généreux en amour et en louanges.',
        'Orienté détails et analytique. Vous visez la perfection et prenez soin de votre santé. Observateur aiguisé qui capte ce que les autres manquent. Vous vous inquiétez un peu trop, mais cela signifie que vous êtes toujours préparé.',
        'Vous cherchez l\'harmonie. Raffiné, charmant, avec un excellent goût artistique. Un pacificateur naturel qui déteste les conflits. Plus heureux entouré de belles choses.',
        'Vous avez de la profondeur. Forte intuition qui voit la vérité. Calme en surface mais émotions intenses en dessous. La vie vous lance de grands changements, et chacun vous rend plus fort.',
        'Esprit libre ! Vous aimez voyager et apprendre. Positif et philosophique. Intéressé par différentes cultures, avec une vision large du monde. Votre humour illumine toute pièce.',
        'Ambitieux. Patient et de plus en plus attrayant avec l\'âge. Travaille systématiquement vers ses objectifs. Même si vous luttez au début, vous êtes du type à éclore tardivement.',
        'Unique. Vous pensez différemment de tout le monde et vous êtes innovant. Vous détestez être dans une case et voulez changer le monde à votre façon. Talent en technologie ou science.',
        'Profondément sensible. Forte intuition attirée par l\'art et la spiritualité. Rêves vivides et imagination riche. Vous ressentez profondément la douleur des autres. Votre monde intérieur est plus riche que l\'extérieur.'
    ];
    const lagnaInterp = [
        'Lagna Bélier gouverné par Mars. Forte volonté et leadership, personnalité indépendante. Rapide à agir avec un esprit pionnier. Traits marqués avec impression active. Impulsif mais courageux.',
        'Lagna Taureau gouverné par Vénus. Cherche stabilité et abondance, aime la beauté sensorielle. Apparence douce avec voix attrayante. Sens artistique exceptionnel. Têtu mais fiable.',
        'Lagna Gémeaux gouverné par Mercure. Intellectuellement curieux avec d\'excellentes compétences en communication. Apparence jeune avec carrure agile. Polyvalent mais peut être dispersé.',
        'Lagna Cancer gouverné par la Lune. Riche en sensibilité et hautement intuitif. Visage rond avec impression douce. Dévoué au foyer et à la famille. Hauts et bas émotionnels mais profondément empathique.',
        'Lagna Lion gouverné par le Soleil. Débordant de charisme et d\'énergie créative. Carrure digne avec présence imposante. Leader né qui apprécie les projecteurs. Haute estime de soi mais cœur généreux.',
        'Lagna Vierge gouverné par Mercure. Analytique et perfectionniste. Apparence soignée avec impression intellectuelle. Excellente attention aux détails, intérêt pour la santé et l\'hygiène.',
        'Lagna Balance gouverné par Vénus. Cherche équilibre et harmonie, diplomatiquement habile. Apparence proportionnée avec impression raffinée. Excelle dans les relations avec un superbe sens esthétique.',
        'Lagna Scorpion gouverné par Mars. Intuition intense et pouvoir transformateur. Yeux perçants avec impression mystérieuse. Pénètre l\'essentiel, garde bien les secrets. Vit des changements dramatiques multiples.',
        'Lagna Sagittaire gouverné par Jupiter. Philosophe cherchant liberté et vérité. Grande carrure avec impression lumineuse. Optimiste et valorise les principes moraux. Connexions profondes avec voyages et éducation.',
        'Lagna Capricorne gouverné par Saturne. Forte ambition et patience. Carrure mince avec impression sérieuse. Travaille systématiquement vers ses objectifs, rajeunit avec l\'âge.',
        'Lagna Verseau gouverné par Saturne. Innovant et original. Apparence unique avec impression intellectuelle. Valorise les idéaux humanitaires avec pensée non conventionnelle.',
        'Lagna Poissons gouverné par Jupiter. Spirituel et intuitif. Apparence douce avec impression rêveuse. Sensibilité artistique extrêmement douée. Tendance au sacrifice de soi.'
    ];

    html += `<div class="interp-card">
        <div class="interp-title">👤 ${isEasy ? 'Votre personnalité' : 'Personnalité & Apparence — Lagna : ' + SIGNS[lagnaSign] + ' ' + SIGN_SYMBOLS[lagnaSign]}</div>
        <div class="interp-text">${isEasy ? lagnaEasy[lagnaSign] : lagnaInterp[lagnaSign]}</div>
    </div>`;

    // ═══════════════════════════════════
    // 2. 내면 & 감정 (Moon 별자리)
    // ═══════════════════════════════════
    if (moonPos) {
        const moonEasy = [
            'Une passion ardente brûle en vous. Les émotions montent vite et redescendent vite. En cas de stress, vous devez bouger — exercice ou activités en plein air marchent le mieux.',
            'Vous êtes émotionnellement très stable. Vous n\'aimez pas les changements soudains et trouvez le réconfort dans le familier. Bonne nourriture, musique et belle nature guérissent votre âme.',
            'Vous traitez les émotions par la conversation. Parler vous fait du bien. Vous êtes curieux de tout et ne supportez pas l\'ennui. Votre humour peut alléger toute humeur.',
            'Vous êtes extrêmement sensible et empathique. Vous absorbez les émotions des autres comme une éponge. Votre maison est votre espace sûr, et votre lien avec votre mère est fort.',
            'Votre expression émotionnelle est dramatique et passionnée. Vous avez profondément besoin d\'être aimé et reconnu. Mais vous donnez l\'amour avec autant de générosité. Les activités créatives sont votre médecine émotionnelle.',
            'Vous tendez à analyser vos émotions. Vous vous inquiétez beaucoup mais êtes excellent pour résoudre les problèmes pratiquement. Les routines quotidiennes apportent la stabilité émotionnelle.',
            'Vous trouvez l\'équilibre émotionnel dans les relations. Vous vous sentez seul(e) quand vous êtes seul(e) et vous stabilisez avec des amis proches ou un partenaire. Vous détestez les conflits et trouvez la paix dans la beauté et l\'art.',
            'Vos émotions sont aussi profondes et intenses que l\'océan. Vous aimez profondément et n\'oubliez jamais la trahison. Votre intuition est incroyablement forte — vous lisez la vérité à travers les yeux et les actes.',
            'Vous êtes émotionnellement lumineux et optimiste. Vous aimez la liberté et détestez être contraint. Voyager est votre meilleur remède émotionnel.',
            'Vous ne montrez pas facilement vos émotions. Fort sens des responsabilités, le devoir passe toujours en premier. Vous étiez peut-être mature au-delà de votre âge enfant, mais vous devenez plus ouvert émotionnellement avec l\'âge.',
            'Vous avez des schémas émotionnels uniques et imprévisibles. Vous aimez de manières non conventionnelles et voyez la vue d\'ensemble. Vous trouvez l\'épanouissement émotionnel dans les causes sociales.',
            'Vous êtes extrêmement intuitif et spirituel. Vos rêves sont vivides et parfois prophétiques. Vous ressentez profondément la douleur des autres. Art, méditation et eau vous apportent la paix.'
        ];
        const moonInterp = [
            'Une passion ardente brûle intérieurement. Les émotions sont spontanées et changent vite. La colère s\'enflamme vite mais s\'éteint aussi vite ; désir d\'indépendance émotionnelle.',
            'Émotionnellement très stable, cherchant le confort. N\'aime pas le changement et trouve la sécurité dans le familier. Guéri par la bonne nourriture, la musique et la nature.',
            'Traite les émotions rationnellement et organise les sentiments par la conversation. Curieux avec de nombreux intérêts simultanés. Cherche la variété plutôt que la profondeur émotionnelle.',
            'Lune dans son propre signe (domicile). Extrêmement riche en sensibilité, absorbant les émotions des autres. Forts instincts maternels, trouvant la stabilité à la maison.',
            'Expression émotionnelle dramatique et passionnée. Fort besoin d\'être reconnu et aimé. Les activités créatives servent de guérison émotionnelle. Cœur romantique et généreux.',
            'Tendance à analyser et organiser les émotions. S\'inquiète beaucoup et est perfectionniste mais résout les choses pratiquement. Trouve la stabilité dans les routines quotidiennes.',
            'Trouve l\'équilibre émotionnel dans les relations. Se sent anxieux seul et se stabilise avec un partenaire. Extrêmement averse aux conflits, trouvant la paix dans l\'art et la beauté.',
            'Les émotions sont aussi profondes et intenses que l\'océan. Aime profondément et déteste profondément ; ne pardonne jamais la trahison. Intuition très forte.',
            'Émotionnellement optimiste et amoureux de la liberté. N\'aime pas être contraint et cherche de nouvelles expériences. Sublime les émotions par la pensée philosophique.',
            'Contrôle bien les émotions et ne les montre pas extérieurement. Fort sens des responsabilités. Peut avoir eu des difficultés émotionnelles dans l\'enfance, mais mûrit avec l\'âge.',
            'Schémas émotionnels uniques et imprévisibles. Indépendant, aimant de manières non conventionnelles. Poursuit l\'amour universel pour l\'humanité et les causes sociales.',
            'Extrêmement intuitif et spirituel. Les rêves sont vivides et peuvent être prophétiques. Empathise profondément avec la souffrance des autres. Trouve la stabilité dans l\'art et la méditation.'
        ];
        html += `<div class="interp-card">
            <div class="interp-title">🌙 ${isEasy ? 'Votre style émotionnel' : 'Intérieur & Émotions — Lune : ' + SIGNS[moonPos.sign] + ' ' + SIGN_SYMBOLS[moonPos.sign]}</div>
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

    let wealthText = isEasy ? '' : `<strong>2e Maison (Richesse accumulée) :</strong> ${SIGNS[h2sign]}. `;
    if (h2planets.length === 0) {
        wealthText += isEasy ? 'L\'accumulation de richesse est stable et régulière. Se construit sans grandes fluctuations. ' : 'Pas de planètes en 2e — accumulation de richesse régulière. ';
    } else {
        h2planets.forEach(p => {
            const pWealth = {
                'Sun': 'Revenus par autorite et statut. Gains potentiels du gouvernement ou secteur public.',
                'Moon': 'Situation financiere fluctuante. Revenus possibles dans les affaires publiques ou la restauration.',
                'Mars': 'Tendances d\'investissement agressives. Revenus de l\'immobilier, technologie ou domaines militaires.',
                'Mercury': 'Gagner de l\'argent par les capacites intellectuelles. Richesse de l\'ecriture, education et IT.',
                'Jupiter': 'La position la plus auspicieuse ! Fortune abondante. Grands revenus de l\'education, droit ou religion.',
                'Venus': 'Accumule la richesse par articles de luxe, art, divertissement et mode.',
                'Saturn': 'Accumule lentement et regulierement. Difficultes au debut mais stabilisation apres la cinquantaine.',
                'Rahu': 'Gagne de l\'argent par des methodes non conventionnelles. Richesse soudaine de l\'etranger.',
                'Ketu': 'Indifference a la richesse. Valorise le spirituel sur le materiel ; attention aux pertes soudaines.'
            };
            wealthText += isEasy ? `${pWealth[p.id] || ''} ` : `${p.symbol} ${p.name}: ${pWealth[p.id] || ''} `;
        });
    }

    wealthText += isEasy ? '<br><br>' : `<br><br><strong>11e Maison (Revenus & Gains) :</strong> ${SIGNS[h11sign]}. `;
    if (h11planets.length === 0) {
        wealthText += isEasy ? 'Les revenus sont stables mais sans grandes fluctuations.' : 'Pas de planètes en 11e — revenus stables sans grands changements.';
    } else {
        h11planets.forEach(p => {
            const pIncome = {
                'Jupiter': 'Grands revenus et profits abondants ! Les reseaux sociaux apportent la richesse.',
                'Venus': 'Revenus par l\'art, la sociabilite et la mode. Les amies sont utiles.',
                'Saturn': 'Revenus stables mais croissance lente. Bonne securite retraite.',
                'Mars': 'Revenus par la competition. Profits de la technologie, immobilier et sport.',
                'Mercury': 'Revenus par les reseaux intellectuels. Aptitude entrepreneuriale.',
                'Sun': 'Revenus par l\'autorite. Les connexions politiques apportent la richesse.',
                'Moon': 'Revenus par la popularite publique. Fluctuant mais flux regulier.'
            };
            wealthText += isEasy ? `${pIncome[p.id] || ''} ` : `${p.symbol} ${p.name}: ${pIncome[p.id] || ''} `;
        });
    }

    html += `<div class="interp-card">
        <div class="interp-title">💰 ${isEasy ? 'Ma fortune de richesse' : 'Fortune de richesse'}</div>
        <div class="interp-text">${wealthText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 4. 💕 spouse & Marriage Fortune (7 house 분석)
    // ═══════════════════════════════════
    const h7sign = (lagnaSign + 6) % 12;
    const h7planets = planetsInHouse(7);
    const venus = positions.find(p => p.id === 'Venus');

    const spouseSign = [
        'Un partenaire indépendant et énergique. Destiné à quelqu\'un avec une forte volonté et du leadership. Un partenaire actif et direct.',
        'Un partenaire beau et artistique. Destiné à quelqu\'un matériellement stable. Un partenaire sensuel et loyal.',
        'Un partenaire intelligent avec de bonnes compétences en communication. Destiné à quelqu\'un avec qui bien converser.',
        'Un partenaire émotionnel et domestique. Destiné à quelqu\'un de bienveillant. Un partenaire avec une chaleur maternelle.',
        'Un partenaire charismatique et digne. Destiné à quelqu\'un de socialement proéminent. Un partenaire avec haute estime de soi mais généreux.',
        'Un partenaire méticuleux et pratique. Destiné à quelqu\'un intéressé par la santé. Un partenaire analytique et orienté service.',
        'Un partenaire attrayant et raffiné. Destiné à quelqu\'un de diplomatique. Un partenaire avec un excellent goût artistique.',
        'Un partenaire intense et mystérieux. Destiné à quelqu\'un avec des émotions profondes. Un partenaire transformateur et passionné.',
        'Un partenaire libre et optimiste. Possible connexion avec l\'étranger ou une autre culture. Un partenaire philosophique et aventurier.',
        'Un partenaire sérieux et ambitieux. Possible différence d\'âge. Un partenaire responsable et socialement réussi. Le mariage peut venir tard.',
        'Un partenaire unique et indépendant. Rencontre ou relation non conventionnelle. Un partenaire intellectuel et innovant.',
        'Un partenaire spirituel et intuitif. Lié à un artiste ou praticien spirituel. Un partenaire rêveur et romantique.'
    ];

    const spouseAppearance = [
        'Traits marqués, impression forte. Carrure athlétique. Yeux intenses pleins d\'énergie. Les tons rouges conviennent bien.',
        'Apparence douce et attrayante. Silhouette pleine avec lèvres sensuelles. Belle peau avec beauté naturelle.',
        'Apparence jeune, impression brillante. Mince et grand(e). Visage expressif avec yeux pétillants. Tendance et stylé(e).',
        'Visage rond, impression douce. Silhouette légèrement courbe. Peau claire avec grands yeux. Aura maternelle.',
        'Carrure digne avec apparence charismatique. Cheveux abondants sont un trait. Présence imposante, bien habillé(e).',
        'Apparence soignée et propre. Mince avec bonnes proportions. Impression intellectuelle. Mode minimaliste.',
        'Apparence équilibrée, impression raffinée. Visage symétrique. Sourire charmant, aura sociale. Peut avoir des fossettes.',
        'Apparence aiguisée et mystérieuse. Yeux profonds laissant forte impression. Mince avec traits aiguisés. Préfère les tons sombres.',
        'Grand(e) avec bonne carrure. Impression brillante et ouverte. Charme exotique. Vêtements décontractés.',
        'Apparence sérieuse et mature. Mince avec structure osseuse définie. Paraît plus âgé(e) mais plus attrayant(e) avec le temps.',
        'Apparence unique et extraordinaire. Mode distinctive. Grand(e) ou avec traits notables. Charme non conventionnel.',
        'Apparence douce et rêveuse. Grands yeux avec expression rêveuse. Légèrement potelé(e) avec peau translucide. Charme mystique.'
    ];

    let spouseText = (isEasy ? '' : '<strong>📐 Apparence du partenaire :</strong><br>') + spouseAppearance[h7sign] + (isEasy ? '<br><br>' : isEasy ? '<br><br>' : '<br><br><strong>📋 Personnalité du partenaire :</strong><br>') + spouseSign[h7sign];

    if (h7planets.length > 0) {
        spouseText += isEasy ? '<br><br>' : '<br><br><strong>Planètes en 7e :</strong> ';
        h7planets.forEach(p => {
            const pH7 = {
                'Sun': 'Le partenaire est socialement reconnu. Peut etre dominant mais respectable.',
                'Moon': 'Un partenaire emotionnel et attentionne. Vie conjugale avec connexion profonde.',
                'Mars': 'Passionne mais disputes possibles. Un partenaire a forte volonte.',
                'Mercury': 'Un partenaire intellectuel avec grande conversation. Bon partenariat d\'affaires.',
                'Jupiter': 'La position la plus benie ! Un partenaire sage et moral. Vie conjugale heureuse.',
                'Venus': 'Un partenaire tres attrayant et aimant. Vie conjugale romantique.',
                'Saturn': 'Mariage tardif ou partenaire avec grande difference d\'age. Difficile mais stable.',
                'Rahu': 'Mariage non conventionnel. Partenaire de l\'etranger ou autre contexte.',
                'Ketu': 'Connexion de vies passees. Fort lien spirituel mais distance dans les relations.'
            };
            spouseText += isEasy ? `<br>${pH7[p.id] || ''}` : `<br>${p.symbol} ${p.name}: ${pH7[p.id] || ''}`;
        });
    }

    if (venus) {
        const venusHouse = houseOf(venus.sign);
        spouseText += isEasy ? '<br><br>' : `<br><br><strong>Venus Position (${venusHouse}th):</strong> `;
        const venusHouseInterp = {
            1: 'Apparence attrayante. Apprecie la romance et tombe amoureux facilement.',
            2: 'La richesse vient par le partenaire. Belle voix et gouts gourmets.',
            3: 'Competences de communication artistiques. Relations agreables avec les freres/soeurs.',
            4: 'Bonheur a la maison avec belle residence. Forte influence de la mere.',
            5: 'Une vie riche en romance. Bonne relation avec les enfants.',
            6: 'Attitude de service dans la romance. Possibilite de romance au travail.',
            7: 'Partenaire tres attrayant. Fort indicateur de vie conjugale heureuse.',
            8: 'Amour profond et transformateur. Romance secrete. Richesse du partenaire.',
            9: 'Romance a l\'etranger. Connexion avec un professeur ou mentor.',
            10: 'Mariage socialement reconnu. Rencontre par la carriere.',
            11: 'D\'amis a amoureux. Connexions par activites sociales.',
            12: 'Romance secrete. Connexions etrangeres. Amour spirituel.'
        };
        spouseText += venusHouseInterp[venusHouse] || '';
    }

    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '💍 Mon partenaire' : '💕 Partenaire & Mariage — 7e Maison : ' + SIGNS[h7sign] + ' ' + SIGN_SYMBOLS[h7sign]}</div>
        <div class="interp-text">${spouseText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 5. 💼 career & 사회적 성취 (10 house 분석)
    // ═══════════════════════════════════
    const h10sign = (lagnaSign + 9) % 12;
    const h10planets = planetsInHouse(10);

    const careerSign = [
        'Adapte au militaire, police, sport, chirurgie, gestion d\'entreprise, leadership.',
        'Finance, industrie alimentaire, agriculture, mode, immobilier, art, banque.',
        'Medias, ecriture, education, communications, informatique, marketing, traduction.',
        'Medical, soins infirmiers, hotellerie, maritime, immobilier, restauration.',
        'Politique, divertissement, gestion, agences gouvernementales, positions de leadership.',
        'Medical, comptabilite, analyse, conseil, sante, controle qualite.',
        'Droit, diplomatie, mode, design interieur, conseil, planification d\'evenements.',
        'Recherche, investigation, assurance, medecine, psychologie, fiscalite, mines.',
        'Education, droit, religion, edition, voyage, commerce international.',
        'Gestion, fonction publique, architecture, genie civil, politique, grandes entreprises.',
        'Technologie, science, informatique, aviation, aerospatiale, travail social, innovation.',
        'Art, cinema, musique, medical, etranger, domaines spirituels, ONG.'
    ];

    let careerText = isEasy ? careerSign[h10sign] : `La 10e maison est en ${SIGNS[h10sign]}. ${careerSign[h10sign]}`;

    if (h10planets.length > 0) {
        careerText += isEasy ? '<br><br>' : '<br><br><strong>Planètes en 10e :</strong>';
        h10planets.forEach(p => {
            const pCareer = {
                'Sun': ' Gouvernement, leadership, positions autoritaires. Carriere avec attention sociale.',
                'Moon': ' Carriere publique. Soins, hotellerie, restauration, domaines emotionnels.',
                'Mars': ' Technologie, ingenierie, militaire, chirurgie, sport. Succes en competition.',
                'Mercury': ' Affaires, communication, IT, education. Succes par capacites intellectuelles.',
                'Jupiter': ' Education, droit, religion, conseil. Carriere respectee. Meilleure position.',
                'Venus': ' Art, divertissement, mode, beaute, diplomatie. Succes en domaines creatifs.',
                'Saturn': ' Succes lent mais certain. Organisations systematiques, architecture, fonction publique.'
            };
            careerText += isEasy ? `<br>${pCareer[p.id] || ''}` : `<br>${p.symbol} ${p.name}: ${pCareer[p.id] || ''}`;
        });
    }

    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '💼 Ma carrière' : '💼 Carrière & Réussite sociale — 10e Maison : ' + SIGNS[h10sign] + ' ' + SIGN_SYMBOLS[h10sign]}</div>
        <div class="interp-text">${careerText}</div>
    </div>`;

    // ═══════════════════════════════════
    // 6. 🏥 health (6 house + Lagna 분석)
    // ═══════════════════════════════════
    const h6sign = (lagnaSign + 5) % 12;
    const h6planets = planetsInHouse(6);

    const healthByLagna = [
        'Attention aux conditions de tete, cerveau et visage. Maux de tete, fievres et inflammations.',
        'Attention aux problemes de cou, thyroide et machoire. Tendance a trop manger et diabete.',
        'Attention aux poumons, bras, epaules et systeme nerveux. Anxiete et problemes de sommeil.',
        'Attention aux problemes d\'estomac, poitrine et seins. Troubles digestifs.',
        'Attention aux problemes de coeur, dos et colonne. Gestion cardiovasculaire essentielle.',
        'Attention au systeme digestif, intestins et peau. Indigestion et allergies.',
        'Attention aux reins, bas du dos et peau. Hydratation et equilibre essentiels.',
        'Attention aux systemes reproducteur et excreteur. Conditions chroniques possibles.',
        'Attention au foie, cuisses et hanches. Tendance au surpoids.',
        'Attention aux os, articulations, genoux et peau. Rhumatisme et arthrite.',
        'Attention aux chevilles, mollets et systeme circulatoire. Gestion pression arterielle.',
        'Attention aux pieds, systeme lymphatique et immunite. Conditions inexpliquees possibles.'
    ];

    html += `<div class="interp-card">
        <div class="interp-title">${isEasy ? '🏥 Ma santé' : '🏥 Santé — Zones vulnérables'}</div>
        <div class="interp-text">${healthByLagna[lagnaSign]}${h6planets.length > 0 ? isEasy ? '<br><br>Attention particulière à la santé nécessaire.' : '<br><br>6e maison : ' + h6planets.map(p => p.name).join(', ') + ' requiert une attention particulière à la santé.' : ''}</div>
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
                    <div class="interp-title">${isEasy ? '⏳ Période actuelle : ' + DASHA_KO[currentDasha] : '⏳ Dasha actuel : ' + DASHA_KO[currentDasha] + ' Dasha'}</div>
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
            yogaText += isEasy ? '<strong>🐘 Bénédiction de sagesse et renommée</strong>' : '<strong>🐘 Gajakesari Yoga (Gajakesari)</strong> — Moon-Jupiter Kendra relationship! Wisdom, fame, abundance combination. Respected in society with outstanding intellect. Good education and children fortune.<br><br>';
        }
    }

    // Budha-Aditya Yoga
    const sun = positions.find(p => p.id === 'Sun');
    const mercury = positions.find(p => p.id === 'Mercury');
    if (sun && mercury && sun.sign === mercury.sign) {
        yogaText += isEasy ? '<strong>📚 Bénédiction d\'intelligence exceptionnelle</strong>' : '<strong>📚 Budha-Aditya Yoga</strong> — Sun-Mercury same sign! Outstanding intellect and communication. Success in education, writing, business. Authoritative intellectual leader.<br><br>';
    }

    // Chandra-Mangala Yoga
    if (moonPos && mars && moonPos.sign === mars.sign) {
        yogaText += isEasy ? '<strong>🔥 Bénédiction de volonté forte et richesse</strong>' : '<strong>🔥 Chandra-Mangala Yoga</strong> — Moon-Mars same sign! Strong will and wealth accumulation. Success in business with bold decision-making.<br><br>';
    }

    // Kuja Dosha (Manglik)
    if (mars) {
        const marsH = houseOf(mars.sign);
        if ([1,2,4,7,8,12].includes(marsH)) {
            yogaText += isEasy ? `<strong>⚠️ Précaution matrimoniale</strong>` : `<strong>⚠️ Kuja Dosha (Manglik)</strong> — Mars in ${marsH}th house — challenges in married life possible. Check partner chart recommended. Marriage after age 28 may be favorable.<br><br>`;
        }
    }

    if (yogaText) {
        html += `<div class="interp-card">
            <div class="interp-title">${isEasy ? '🔮 Your Special Talents' : '🔮 Special Yogas (Planetary Combinations)'}</div>
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
        '1re Maison : Soi fort et leadership. Sain et vital. Haute estime de soi et indépendant.',
        '2e Maison : Valorise l\'honneur familial. Revenus par l\'autorité. Héritage du père. Santé oculaire à surveiller.',
        '3e Maison : Courageux et décisif. Leader parmi les frères/sœurs. Autorité en écriture/communication.',
        '4e Maison : Tension dans les relations parentales. Propriété immobilière/véhicules. Agitation intérieure.',
        '5e Maison : Talent créatif exceptionnel. Bonne relation avec les enfants. Capacités d\'investissement.',
        '6e Maison : Pouvoir de vaincre les ennemis. Capacités de gestion de santé. Victoire dans les litiges.',
        '7e Maison : Partenaire de haut statut social. Rôle de leader dans les partenariats.',
        '8e Maison : Longévité à surveiller. Avantages d\'héritage/assurance. Pouvoir secret.',
        '9e Maison : Le père est une figure respectée. Succès en droit/religion/éducation supérieure.',
        '10e Maison : La meilleure position ! Succès social et renommée. Leader dans le secteur gouvernemental/public.',
        '11e Maison : Grands revenus et réseau social. Amis de haut statut. Excellente réalisation d\'objectifs.',
        '12e Maison : Succès à l\'étranger. Quêtes spirituelles. Distance du père. Apprécie la solitude.'
    ],
    Moon: [
        '1re Maison : Apparence attrayante. Personnalité émotionnelle et changeante. Populaire auprès du public.',
        '2e Maison : Environnement familial confortable. Bonne alimentation. Parole douce. Liens familiaux forts.',
        '3e Maison : Compétences de communication créatives. Aime voyager. Lien émotionnel avec les frères/sœurs.',
        '4e Maison : La meilleure position ! Foyer heureux. Lien fort avec la mère. Bonne fortune immobilière.',
        '5e Maison : Amour profond pour les enfants. Personnalité romantique. Capacité d\'investissement intuitive.',
        '6e Maison : Problèmes de santé par stress émotionnel. Victoire sur les ennemis. Esprit de service.',
        '7e Maison : Partenaire attrayant. Mariage émotionnellement profond. Tendance à dépendre du partenaire.',
        '8e Maison : Turbulences émotionnelles et transformation. Intuition très forte. Héritage possible.',
        '9e Maison : Spirituel et philosophique. La mère est religieuse. Voyage/résidence à l\'étranger.',
        '10e Maison : Popularité publique et succès social. Hôtellerie/soins/alimentation.',
        '11e Maison : Beaucoup d\'amis et sociable. Revenus stables. Capacité à réaliser ses souhaits.',
        '12e Maison : Résidence possible à l\'étranger. Problèmes de sommeil. Inclinations spirituelles.'
    ],
    Mars: [
        '1re Maison : Physique fort et volonté. Cicatrices/blessures possibles. Impulsif mais courageux.',
        '2e Maison : Parole dure. Problèmes alimentaires. Disputes familiales. Mais capacité à accumuler la richesse.',
        '3e Maison : La meilleure position ! Courage et esprit aventurier. Fort lien fraternel. Talent sportif.',
        '4e Maison : Conflits domestiques. Litiges immobiliers. Tension avec la mère.',
        '5e Maison : Romance passionnée. Enfants actifs. Investissements spéculatifs. Talent sportif.',
        '6e Maison : Pouvoir d\'écraser les ennemis ! Force physique contre la maladie. Militaire/police/médecine.',
        '7e Maison : Kuja Dosha — Passion et conflit coexistent dans le mariage. Partenaire fort. Mariage après 28 recommandé.',
        '8e Maison : Attention aux accidents/chirurgies. Mais pouvoir de survivre aux crises.',
        '9e Maison : Conflit avec le père. Opinions fortes sur la religion. Litiges juridiques.',
        '10e Maison : Performance professionnelle exceptionnelle ! Militaire/ingénierie/chirurgie/police.',
        '11e Maison : Grands revenus ! Forte réalisation d\'objectifs. Aide des frères/sœurs.',
        '12e Maison : Dépenses élevées à l\'étranger. Problèmes de sommeil. Forte énergie sexuelle.'
    ],
    Jupiter: [
        '1re Maison : Position bénie ! Personnalité sage et généreuse. Grande stature et en bonne santé.',
        '2e Maison : Richesse abondante ! Grande famille. Revenus par l\'éducation. Orateur éloquent.',
        '3e Maison : Frères/sœurs qui réussissent. Écriture liée à la religion/éducation.',
        '4e Maison : Une des meilleures positions ! Maison spacieuse. Réussite académique. Mère sage.',
        '5e Maison : Intellect et créativité exceptionnels ! Bonne fortune avec les enfants. Investissements sages.',
        '6e Maison : Vainc facilement les ennemis. Victoires juridiques. Esprit de service. Attention au poids.',
        '7e Maison : Un partenaire sage et moral ! Mariage heureux. Partenariats d\'affaires réussis.',
        '8e Maison : Longévité ! Héritage. Profondeur de connaissance spirituelle. Intérêt pour l\'astrologie.',
        '9e Maison : La position la plus puissante ! Grande fortune. Bénédictions du maître. Voyages à l\'étranger.',
        '10e Maison : Renommée et respect social ! Leader en éducation/droit/religion. Meilleure fortune de carrière.',
        '11e Maison : Grands revenus et profits ! Réalisation de souhaits. Connexions influentes.',
        '12e Maison : Fortune à l\'étranger. Libération spirituelle. Plaisirs célestes. Dons et charité.'
    ],
    Venus: [
        '1re Maison : Apparence très attrayante ! Talent artistique. Apprécie le luxe. Sociable et populaire.',
        '2e Maison : Richesse abondante ! Nourriture fine et articles de luxe. Voix douce. Harmonie familiale.',
        '3e Maison : Communication artistique. Belle écriture. Bonne relation avec les sœurs.',
        '4e Maison : Belle maison et véhicules ! Style de vie luxueux. Mère belle et artistique.',
        '5e Maison : Amour romantique ! Talent en art/divertissement. Beaux enfants.',
        '6e Maison : Difficultés en romance. Beauté liée à la santé. Victoire sur les ennemis par le charme.',
        '7e Maison : La meilleure position ! Partenaire très attrayant. Mariage heureux.',
        '8e Maison : Amour profond et transformateur. Richesse du partenaire. Romance secrète.',
        '9e Maison : Romance à l\'étranger. Voyages artistiques. Belle relation avec les professeurs.',
        '10e Maison : Succès en art/mode/divertissement ! Socialement attrayant. Aide des femmes.',
        '11e Maison : Revenus par les réseaux sociaux ! Aide d\'amies. Réalisation de souhaits.',
        '12e Maison : Amour à l\'étranger. Romance secrète. Plaisirs intimes. Inspiration artistique.'
    ],
    Saturn: [
        '1re Maison : Stature mince. Sérieux et responsable. Difficultés d\'enfance. Brille avec l\'âge.',
        '2e Maison : Accumulation lente de richesse. Style de vie frugal. Parole lourde. Distance de la famille.',
        '3e Maison : Excellente position ! Forte volonté et patience. Responsabilité envers les frères/sœurs.',
        '4e Maison : Difficultés avec la mère. Environnement domestique strict. Vieilles maisons.',
        '5e Maison : Enfants tardifs ou peu nombreux. Investissements prudents. Luttes académiques.',
        '6e Maison : Vainc les ennemis par la patience ! Conditions chroniques mais gérables. Succès dans le service.',
        '7e Maison : Mariage tardif. Partenaire plus âgé. Difficile au début mais mariage stable.',
        '8e Maison : Longévité ! Attention aux conditions chroniques. Retards dans les héritages.',
        '9e Maison : Relation difficile avec le père. Approche sérieuse de la religion.',
        '10e Maison : Grande position ! Succès social lent mais certain. Leader dans les grandes entreprises/gouvernement.',
        '11e Maison : Croissance régulière des revenus ! Amis plus âgés. Atteindre les objectifs par la patience.',
        '12e Maison : Difficultés et croissance à l\'étranger. Problèmes de sommeil. Pratique spirituelle.'
    ]
};

function renderPlanetHouse(positions, lagnaSign) {
    function houseOf(signIdx) { return ((signIdx - lagnaSign + 12) % 12) + 1; }
    const isEasy = window.vedicMode === 'easy';
    const houseArea = ['','Soi','Argent·Famille','Communication','Foyer','Enfants·Romance','Santé','Partenaire','Transformation','Fortune·Étranger','Carrière','Revenus','Spiritualité'];
    let html = '';

    positions.forEach(p => {
        if (!PLANET_IN_HOUSE[p.id]) return;
        const house = houseOf(p.sign);
        const desc = PLANET_IN_HOUSE[p.id][house - 1];
        if (!desc) return;

        html += `<div class="interp-card">
            <div class="interp-title">${isEasy ? (houseArea[house]||'') : p.symbol + ' ' + p.name + ' → ' + house + 'e Maison (' + SIGNS[p.sign] + ')'}</div>
            <div class="interp-text">${isEasy ? desc.replace(/^\d+\w{0,2}\s*[Hh]ouse:?\s*/, '') : desc}</div>
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
    let text = isEasy ? '<strong>Éducation de base :</strong> ' : `<strong>4e Maison (Éducation de base) :</strong> ${SIGNS[h4sign]}. `;
    const eduSign4 = ['Active learning, physical/military education', 'Fine arts/music/culinary education', 'Languages/literature/communication', 'Home education emphasis, history', 'Drama/leadership/political science', 'Science/medicine/analytics', 'Law/diplomacy/design', 'Psychology/research/investigation', 'Philosophy/theology/international studies', 'Business/administration/architecture', 'IT/science technology/aviation', 'Art/film/music/spirituality'];
    text += eduSign4[h4sign] + ' suited. ';
    if (h4.length > 0 && !isEasy) text += 'In 4th house, ' + h4.map(p => p.name).join(', ') + ' influences education. ';

    const jupiter = positions.find(p => p.id === 'Jupiter');
    if (jupiter) {
        const jH = houseOf(jupiter.sign);
        if ([1,4,5,9].includes(jH)) text += isEasy ? '<br><br>🎓 <strong>High academic achievement expected!</strong> Graduate school/PhD/study abroad possible.' : '<br><br>🎓 <strong>Jupiter in ' + jH + 'th house — high academic achievement expected!</strong> Graduate school/PhD/study abroad possible.';
    }

    text += isEasy ? '<br><br><strong>Éducation supérieure :</strong> ' : `<br><br><strong>5e Maison (Éducation supérieure) :</strong> ${SIGNS[h5sign]}. `;
    if (h5.length > 0) {
        h5.forEach(p => {
            const h5p = { Sun: 'Excels in leadership/political science', Moon: 'art/psychology talent', Mars: 'Engineering/technology/sports talent', Mercury: 'Math/language/business genius', Jupiter: 'Best placement! Scholar/professor/researcher', Venus: 'art/design/music talent', Saturn: 'Late academics but deep research' };
            text += isEasy ? `${h5p[p.id] || 'influences academics'}. ` : `${p.name}: ${h5p[p.id] || 'influences academics'}. `;
        });
    } else {
        text += isEasy ? 'Pas d\'énergie académique particulièrement forte, mais un effort régulier donnera de bons résultats.' : 'Pas de planètes en 5e — la position du 5e seigneur est la clé.';
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

    let text = isEasy ? '' : `<strong>5e Maison (Enfants) :</strong> ${SIGNS[h5sign]}.<br><br>`;

    const childSign = [
        'Enfants actifs et independants. Talent en sport/leadership. Independants tot.',
        'Enfants calmes et artistiques. Talent en musique/art. Materiellement confortables.',
        'Enfants intelligents et eloquents. Excellents en academique. Possibilite de jumeaux.',
        'Enfants sensibles et gentils. Lien special avec la mere. Enfants domestiques.',
        'Enfants charismatiques et creatifs. Qualites de leader. Talent en divertissement.',
        'Enfants meticuleux et analytiques. Talent en medecine/science.',
        'Enfants charmants et sociables. Talent en art/diplomatie. Bon equilibre.',
        'Enfants intenses et intuitifs. Esprit de recherche/exploration.',
        'Enfants libres et aventuriers. Possible etude/voyage a l\'etranger.',
        'Enfants serieux et ambitieux. Murissent tot. Orientes vers la reussite.',
        'Enfants uniques et innovants. Talent en technologie/science.',
        'Enfants artistiques et spirituels. Riche imagination. Talent en musique/peinture.'
    ];
    text += childSign[h5sign];

    if (h5.length > 0) {
        text += isEasy ? '<br><br>' : '<br><br><strong>Planètes en 5e :</strong><br>';
        h5.forEach(p => {
            const ch = { Sun: 'Connection with sons. Children have leadership.', Moon: 'Connection with daughters. Strong emotional bond.', Mars: 'Active children. May be difficult to manage.', Mercury: 'Very smart children! Excellent academics.', Jupiter: 'Blessed children! Fortune through children.', Venus: 'Beautiful artistic children. Connection with daughters.', Saturn: 'Children may come late. But responsible children.' };
            text += `${ch[p.id] || ''}<br>`;
        });
    }

    if (jupiter) {
        const jH = houseOf(jupiter.sign);
        if (jH === 5) text += isEasy ? '<br>🌟 <strong>Meilleure fortune d\'enfants ! Les enfants apportent grande chance.</strong>' : '<br>🌟 <strong>Jupiter en 5e ! Meilleure fortune d\'enfants.</strong>';
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
    let text = isEasy ? '<strong>Voyages à l\'étranger·fortune :</strong><br>' : '<strong>9e Maison (Voyages·fortune·Éducation supérieure) :</strong><br>';
    if (h9.length === 0) {
        text += 'Les voyages à l\'étranger existent mais pas de connexion forte.';
    } else {
        h9.forEach(p => {
            const f9 = { Sun: 'Father has foreign connections. Government overseas trips.', Moon: 'Enjoys foreign travel emotionally. Popularity abroad.', Mars: 'Adventure/challenge abroad. Military/technology related foreign activities.', Mercury: 'Study abroad/business success! Multilingual ability.', Jupiter: 'Great fortune abroad! Study abroad/immigration success. Meeting foreign teachers.', Venus: 'Romance abroad. Art/fashion-related foreign activities.', Saturn: 'Success after hardship abroad. Long-term foreign residence.', Rahu: 'Strong foreign migration indicator! Deeply immersed in foreign culture.', Ketu: 'Past-life foreign connection. Spiritual pilgrimage.' };
            text += isEasy ? `${f9[p.id] || ''}<br>` : `${p.symbol} ${p.name}: ${f9[p.id] || ''}<br>`;
        });
    }

    text += isEasy ? '<br><strong>Installation à l\'étranger :</strong><br>' : '<br><strong>12e Maison (Installation·Immigration) :</strong><br>';
    if (h12.length === 0) {
        text += 'La résidence domestique est plus naturelle.';
    } else {
        h12.forEach(p => {
            const f12 = { Sun: 'Finding identity abroad. Government foreign posting.', Moon: 'High possibility of living abroad! Emotional stability overseas.', Mars: 'Energy expenditure abroad. Foreign investment/real estate.', Mercury: 'Foreign business/IT. Overseas education.', Jupiter: 'foreignSpiritual growth abroad. Charity. Foreign university.', Venus: 'Luxury and pleasure abroad. Foreign art activities.', Saturn: 'Hard labor abroad. But long-term settlement.', Rahu: 'Strong immigration indicator! Adapting to Western culture.', Ketu: 'Spiritual practice abroad. Solitary overseas life.' };
            text += isEasy ? `${f12[p.id] || ''}<br>` : `${p.symbol} ${p.name}: ${f12[p.id] || ''}<br>`;
        });
    }

    if (rahu) {
        const rH = houseOf(rahu.sign);
        if ([9, 12, 7].includes(rH)) text += isEasy ? '<br>✈️ <strong>Très haute possibilité de migration !</strong>' : '<br>✈️ <strong>Rahu en ' + rH + 'e — très haute chance de résidence à l\'étranger !</strong>';
    }

    document.getElementById('foreignWrap').innerHTML = `<div class="interp-card"><div class="interp-text">${text}</div></div>`;
}

// ═══════════════════════════════════════════════════
// 행성 품위
// ═══════════════════════════════════════════════════
function renderDignity(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    const isEasy = window.vedicMode === 'easy';
    const houseArea = {1:'Soi',2:'Argent/Famille',3:'Communication/Frères',4:'Foyer/Mère',5:'Enfants/Romance',6:'Santé/Ennemis',7:'Partenaire',8:'Transformation/Héritage',9:'Chance/Étranger',10:'Carrière/Renommée',11:'Revenus/Souhaits',12:'Étranger/Spiritualité'};
    const EXALT = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
    const DEBI = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };
    const OWN = { Sun: [4], Moon: [3], Mars: [0,7], Mercury: [2,5], Jupiter: [8,11], Venus: [1,6], Saturn: [9,10] };

    // 쉬운 설명
    const planetRole = {
        Sun: 'Soi/Confiance/Père/Autorité',
        Moon: 'Émotions/Esprit/Mère/Quotidien',
        Mars: 'Énergie/Courage/Action/Compétition',
        Mercury: 'Intelligence/Communication/Apprentissage/Affaires',
        Jupiter: 'Chance/Sagesse/Richesse/Mariage',
        Venus: 'Amour/Charme/Art/Plaisir',
        Saturn: 'Patience/Épreuves/Responsabilité/Effort'
    };

    let html = `<div class="interp-card" style="margin-bottom:16px;">
        <div class="interp-text">
            ${isEasy ?
            '<strong>💡 Guide simple :</strong> Montre la force de chaque energie dans votre vie.<br><br>🟢 <strong>Tres Fort</strong> = Condition maximale ! Grande fortune et resultats.<br>🟡 <strong>Fort</strong> = Stable, bons resultats.<br>⚪ <strong>Moyen</strong> = Ni fort ni faible.<br>🔴 <strong>Faible</strong> = Defis mais surmontables avec effort.' :
            '<strong>💡 Guide :</strong> La dignite planetaire montre la force d\'un planete.<br><br>🟢 <strong>Exalte</strong> = Condition maximale ! Grande fortune dans ce domaine.<br>🟡 <strong>Domicile</strong> = Comme chez soi. Resultats stables et bons.<br>⚪ <strong>Neutre</strong> = Moyen. Ni fort ni faible.<br>🔴 <strong>Debilite</strong> = Affaibli. Defis mais surmontables avec effort.'}
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
                ? `<strong>${area}</strong> — plus grande benediction ! Les talents innes brillent et les bons resultats arrivent naturellement.`
                : `<strong>${p.name} a puissance maximale !</strong> L'energie de "${role}" maximisee dans <strong>${house}(${area})</strong>. Les talents brillent.`;
        } else if (p.sign === DEBI[p.id]) {
            dignity = 'Debilitated';
            emoji = '🔴';
            color = '#d9534f';
            simpleDesc = isEasy
                ? `<strong>${area}</strong> — peut faire face a des defis. Mais l'effort conscient mene a une grande croissance. Voir les remedes ci-dessous.`
                : `<strong>${p.name} affaibli.</strong> L'energie de "${role}" affaiblie dans <strong>${house}(${area})</strong>. Defis mais croissance par l'effort.`;
        } else if (OWN[p.id] && OWN[p.id].includes(p.sign)) {
            dignity = 'Own Sign';
            emoji = '🟡';
            color = '#c9a84c';
            simpleDesc = isEasy
                ? `<strong>${area}</strong> — travaille stablement en votre faveur. Les bons resultats arrivent naturellement.`
                : `<strong>${p.name} chez soi !</strong> L'energie de "${role}" travaille stablement dans <strong>${house}(${area})</strong>.`;
        } else {
            dignity = 'Neutral';
            emoji = '⚪';
            color = '#999';
            simpleDesc = isEasy
                ? `<strong>${area}</strong> — influence moyenne. Ni particulierement fort ni faible.`
                : `L'energie de "${role}" de ${p.name} exerce une influence moyenne dans <strong>${house}(${area})</strong>.`;
        }

        html += `<div class="interp-card">
            <div class="interp-title">${emoji} ${isEasy ? area + ' — ' : p.symbol + ' ' + p.name + ' — ' + SIGNS[p.sign] + ' ' + SIGN_SYMBOLS[p.sign] + ' → ' + house + ' (' + area + ') — '}<span style="color:${color}">${isEasy ? (dignity.includes('Exalted') ? 'Tres Fort !' : dignity.includes('Debilitated') ? 'Faible' : dignity.includes('Own Sign') ? 'Fort' : 'Moyen') : dignity}</span></div>
            <div class="interp-text">
                ${isEasy ? '' : '<span style="color:#666;font-size:12px;">Role: ' + role + ' │ Position: ' + house + ' = ' + area + '</span><br><br>'}
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
        { color: 'Red, Orange', number: '1, 9', day: 'Mardi', gem: 'Red Coral', dir: 'East' },
        { color: 'White, Pink', number: '2, 6', day: 'Vendredi', gem: 'Diamond', dir: 'Southeast' },
        { color: 'Green', number: '3, 5', day: 'Mercredi', gem: 'Emerald', dir: 'North' },
        { color: 'White, Silver', number: '2, 7', day: 'Lundi', gem: 'Pearl', dir: 'Northwest' },
        { color: 'Gold, Orange', number: '1, 4', day: 'Dimanche', gem: 'Ruby', dir: 'East' },
        { color: 'Green, Light Green', number: '5, 3', day: 'Mercredi', gem: 'Emerald', dir: 'South' },
        { color: 'White, Pastel', number: '6, 2', day: 'Vendredi', gem: 'Diamond', dir: 'West' },
        { color: 'Red, Crimson', number: '9, 1', day: 'Mardi', gem: 'Red Coral', dir: 'South' },
        { color: 'Yellow, Gold', number: '3, 9', day: 'Jeudi', gem: 'Yellow Sapphire', dir: 'Northeast' },
        { color: 'Navy, Black', number: '8, 4', day: 'Samedi', gem: 'Blue Sapphire', dir: 'West' },
        { color: 'Navy, Purple', number: '4, 8', day: 'Samedi', gem: 'Blue Sapphire', dir: 'West' },
        { color: 'Yellow, Gold', number: '3, 7', day: 'Jeudi', gem: 'Yellow Sapphire', dir: 'Northeast' }
    ];

    const d = luckyData[lagnaSign];
    const html = `<div class="interp-card">
        <div class="interp-text">
            <strong>🎨 Couleur porte-bonheur :</strong> ${d.color}<br>
            <strong>🔢 Numéro porte-bonheur :</strong> ${d.number}<br>
            <strong>📅 Jour porte-bonheur :</strong> ${d.day}<br>
            <strong>💎 Pierre porte-bonheur :</strong> ${d.gem}<br>
            <strong>🧭 Direction porte-bonheur :</strong> ${d.dir}<br>
            <strong>🪐 Planète maîtresse du Lagna :</strong> ${['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'][lagnaSign]}
        </div>
    </div>`;
    document.getElementById('luckyWrap').innerHTML = html;
}

// ═══════════════════════════════════════════════════
// 치유 & Strengthening
// ═══════════════════════════════════════════════════
function renderRemedy(positions, lagnaSign) {
    function houseOf(s) { return ((s - lagnaSign + 12) % 12) + 1; }
    const DEBI = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };

    const remedies = {
        Sun: { gem: 'Ruby', mantra: 'Om Suryaya Namaha', color: 'Orange/red on Sunday', food: 'Wheat, saffron, sunflower seeds', charity: 'Sunday: donate wheat/copper' },
        Moon: { gem: 'Pearl', mantra: 'Om Chandraya Namaha', color: 'White/silver on Monday', food: 'Milk, rice, coconut', charity: 'Monday: donate rice/milk' },
        Mars: { gem: 'Red Coral', mantra: 'Om Mangalaya Namaha', color: 'Red on Tuesday', food: 'Lentils, red fruits', charity: 'Tuesday: donate red lentils' },
        Mercury: { gem: 'Emerald', mantra: 'Om Budhaya Namaha', color: 'Green on Wednesday', food: 'Green beans, green vegetables', charity: 'Wednesday: donate green vegetables' },
        Jupiter: { gem: 'Yellow Sapphire', mantra: 'Om Gurave Namaha', color: 'Yellow on Thursday', food: 'Chickpeas, bananas, turmeric', charity: 'Thursday: donate yellow food/books' },
        Venus: { gem: 'Diamond', mantra: 'Om Shukraya Namaha', color: 'White/pastel on Friday', food: 'Milk, cream, fruits', charity: 'Friday: donate white clothes/rice' },
        Saturn: { gem: 'Blue Sapphire', mantra: 'Om Shanaishcharaya Namaha', color: 'Navy/black on Saturday', food: 'Black beans, sesame', charity: 'Saturday: donate black beans/oil' }
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
                <div class="interp-title">${p.symbol} ${p.name} Strengthening ${isDebi ? '(Debilitated — Especially Important!)' : '(Weak Position)'}</div>
                <div class="interp-text">
                    <strong>💎 Gem:</strong> ${r.gem} (Ring finger recommended)<br>
                    <strong>🙏 mantra:</strong> "${r.mantra}" (108 times daily)<br>
                    <strong>🎨 Color:</strong> ${r.color}<br>
                    <strong>🍽️ Food:</strong> ${r.food}<br>
                    <strong>🤝 Charity:</strong> ${r.charity}
                </div>
            </div>`;
        }
    });

    if (!html) {
        html = '<div class="interp-card"><div class="interp-text">All planets in good positions! No special remedies needed. Wear the gem of your Lagna ruler for luck.</div></div>';
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
        const d30parts = [5, 5, 8, 7, 5]; // Degree of each part
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

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💼 Analyse détaillée de carrière' : '💼 D10 Analyse de carrière') + '</div><div class="interp-text">';
        if (isEasy) {
            html += '<strong>Your career tendency:</strong><br>';
        } else {
            html += '<strong>D10 Lagna:</strong> ' + SIGNS[dLagnaSign] + ' (ruler: ' + (RULER_NAMES[d10_1lord]||d10_1lord) + ')<br>';
            html += '<strong>D10 10 house (career):</strong> ' + SIGNS[d10_10sign] + ' (ruler: ' + (RULER_NAMES[d10_10lord]||d10_10lord) + ')<br>';
        }
        if (d10_10planets.length > 0) {
            if (!isEasy) html += '<strong>Planets in 10th:</strong> ' + d10_10planets.map(p => p.name).join(', ') + '<br>';
        }

        // Career 성향 by D10 Lagna
        const careerBySign = [
            'Leadership, Military, Sports, Entrepreneur',  // Aries
            'Finance, Arts, Real Estate, Food Industry',     // Taurus
            'Communication, Media, Education, IT',  // Gemini
            'Nursing, Real Estate, Hotels, Counseling',    // Cancer
            'Politics, Entertainment, Management, Administration',        // Leo
            'Medical, Accounting, Analysis, Research',          // Virgo
            'Law, Diplomacy, Design, Consulting',      // Libra
            'Investigation, Research, Medicine, Insurance',          // Scorpio
            'Education, Religion, Foreign Trade, Publishing',      // Sagittarius
            'Administration, Construction, Mining, Civil Service',        // Capricorn
            'IT, Innovation, NGO, Aviation',           // Aquarius
            'Arts, Hospital, Foreign, Spirituality'           // Pisces
        ];
        html += '<strong>suitable field:</strong> ' + careerBySign[dLagnaSign];
        html += '</div></div>';

    } else if (division === 7) {
        // D7 해석: children
        const d7_5sign = (dLagnaSign + 4) % 12;
        const d7_5lord = SIGN_RULERS[d7_5sign];
        const d7_5planets = dPositions.filter(p => p.dSign === d7_5sign);
        const benefics = d7_5planets.filter(p => p.natural === 'benefic');
        const malefics = d7_5planets.filter(p => p.natural === 'malefic');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👶 Analyse des enfants' : '👶 D7 Analyse des enfants') + '</div><div class="interp-text">';
        if (!isEasy) {
            if (!isEasy) html += '<strong>D7 Lagna:</strong> ' + SIGNS[dLagnaSign] + '<br>';
            html += '<strong>D7 5 house (children):</strong> ' + SIGNS[d7_5sign] + ' (ruler: ' + (RULER_NAMES[d7_5lord]||d7_5lord) + ')<br>';
        }
        if (d7_5planets.length > 0) {
            if (!isEasy) html += '<strong>5 house planet:</strong> ' + d7_5planets.map(p => p.name).join(', ') + '<br>';
        }
        if (benefics.length > 0) html += (isEasy ? 'Benefic planets — blessed with children.' : 'Benefic planets in 5th house — blessed with children.') + '<br>';
        if (malefics.length > 0) html += (isEasy ? 'Challenge planets — children difficulties possible.' : 'Malefic planets in 5th house — children related difficulties possible.') + '<br>';
        if (d7_5planets.length === 0) html += isEasy ? 'No planets in children position — other factors need analysis.' : '5th house empty — check 5th lord position.';
        html += '</div></div>';

    } else if (division === 12) {
        // D12 해석: 부모
        const d12_4sign = (dLagnaSign + 3) % 12; // 4 house = Mother
        const d12_9sign = (dLagnaSign + 8) % 12; // 9 house = Father
        const d12_4planets = dPositions.filter(p => p.dSign === d12_4sign);
        const d12_9planets = dPositions.filter(p => p.dSign === d12_9sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨‍👩‍👧 Analyse des parents' : '👨‍👩‍👧 D12 Analyse des parents') + '</div><div class="interp-text">';
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
        if (moon4) html += (isEasy ? 'Moon in mother position — deep connection with mother.' : 'Moon in 4th house — deep connection with mother.') + '<br>';
        if (sun9) html += (isEasy ? 'Sun in father position — deep connection with father.' : 'Sun in 9th house — deep connection with father.') + '<br>';
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
            Sun: ['Lived as a warrior or king in past lives. Strong ego and leadership remain. Soul purpose to establish authority.','Lived as an artist or wealthy person. Soul pursues material abundance. Drawn to sensory beauty.','Lived as a scholar or merchant. Knowledge and communication are core soul themes.','Lived as a protector or nurturer. Caring for others is a deep soul instinct.','Held high status as royalty or clergy. Natural authority carries over to this life.','Lived as a healer or server. Analysis and service are the soul purpose.','Lived as a diplomat or artist pursuing harmony. Relationships and balance are the soul task.','Lived as a practitioner or alchemist through deep transformation. Secrets and transformation imprinted on soul.','Lived as a sage or explorer seeking truth. Wisdom and adventure are the soul direction.','Lived as an official or architect building order. System and responsibility engraved in soul.','Lived as a revolutionary or inventor ahead of the times. Originality is the soul trait.','Lived as a medium or artist communing with the spiritual world. Deep intuition remains in soul.'],
            Moon: ['Past life emotional memories are fiercely intense. Anger and passion imprinted in the unconscious. Mastering emotions is the task.','Past life emotional memories are warm and stable. Memories of abundance remain in the unconscious, seeking beauty.','Past life emotional memories are intellectual and varied. Curiosity is strong from many past experiences.','Past life emotional memories are very deep. Strong memories of home and nurturing create rich emotions.','Past life emotional memories are full of pride and dignity. Memories of being recognized and respected remain.','Past life emotional memories relate to service and analysis. Memories of helping others create a caring heart.','Past life emotional memories relate to harmony and relationships. Memories of beautiful connections drive seeking a partner.','Past life emotional memories are deep and intense. Memories of extreme changes create ocean-deep emotions.','Past life emotional memories relate to freedom and exploration. Memories of travel and learning drive expansion.','Past life emotional memories relate to responsibility and patience. Memories of heavy burdens create mature emotions.','Past life emotional memories are unique and extraordinary. Memories of being different create independent sensibility.','Past life emotional memories are spiritual and transcendent. Dreams and visions are vivid with deep spiritual connection.']
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
            return ' — deity: <strong>' + d.deity.name + '</strong>(' + d.deity.ko + ') <span style="color:' + c + ';font-weight:700;">' + (d.deity.nature === 'benefic' ? 'Benefic' : 'Malefic') + '</span>';
        }

        const houseThemes = ['','Self/Existence','Wealth/Value','Communication/Learning','Home/Rest','Creation/Love','Service/Trial','Relationship/Partner','Transformation/Secret','Wisdom/Religion','Society/Career','Wish/Gain','Liberation/Transcendence'];

        // Parasara 인용
        if (!isEasy) {
            html += '<div class="interp-card" style="border-left:3px solid #8b7ec8;"><div class="interp-text" style="font-size:13px;color:#888;">';
            html += '📜 <strong>Parasara says:</strong> "Shashtiamsha (D60) is the most important of all divisional charts. Benefic planets in benefic divisions give good results, malefic planets in malefic divisions give bad results."<br>';
            html += '<span style="color:#666;">— Brihat Parasara Hora Shastra (BPHS)</span></div></div>';
        }

        // ─── 소챕터 1: soul의 정체성 ───
        const lagnaD = getDeity(lagnaSidereal);
        let ch1 = isEasy
            ? '<strong>Past life identity</strong>' + deityTag(lagnaD) + '<br><br>'
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
        if (d60_planets_1.length > 0) ch1 += '<br><br>' + d60_planets_1.map(p => p.name).join(', ') + (isEasy ? ' — core past-life karma concentrated in these planets.' : ' positioned in D60 Lagna — Core past-life karma concentrated in these planets.');
        html += subChapter('🪐', 'Identité de l\'âme — Qui étiez-vous dans vos vies passées', ch1);

        // ─── 소챕터 2: soul의 목적 ───
        const sunD60 = dPositions.find(p => p.id === 'Sun');
        if (sunD60) {
            const sunD = getDeity(sunD60.sidereal);
            let ch2 = (isEasy ? '<strong>Sun Past Life Memory</strong>' : '<strong>D60 Sun: ' + SIGNS[sunD60.dSign] + ' ' + SIGN_SYMBOLS[sunD60.dSign] + '</strong>') + deityTag(sunD) + '<br><br>';
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
            html += subChapter('☉', 'But de l\'âme — Pourquoi êtes-vous né', ch2);
        }

        // ─── 소챕터 3: 감정의 기억 ───
        const moonD60 = dPositions.find(p => p.id === 'Moon');
        if (moonD60) {
            const moonD = getDeity(moonD60.sidereal);
            let ch3 = (isEasy ? '<strong>Moon Past Life Memory</strong>' : '<strong>D60 Moon: ' + SIGNS[moonD60.dSign] + ' ' + SIGN_SYMBOLS[moonD60.dSign] + '</strong>') + deityTag(moonD) + '<br><br>';
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
            html += subChapter('☽', 'Mémoire émotionnelle — Schémas inconscients', ch3);
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
            'Past life healer/servant connection. Service and devotion marriage karma. Souls who helped others together.',
            'Past life diplomat/artist connection. Harmonious, beautiful marriage karma. Souls who sought balance together.',
            'Past life practitioner/mystic connection. Intense, transformative marriage karma. Souls who shared life and death.',
            'Past life sage/explorer connection. Free, expansive marriage karma. Foreign spouse possible.',
            'Past life official/architect connection. Responsible, stable marriage karma. Late marriage possible.',
            'Past life official/soldier/systematic professional connection. Saturn-ruled sign with responsible, disciplined spouse karma. Souls who practiced social duty together. Marriage may be somewhat late or with age gap.',
            'Past life medium/artist connection. Mystical, spiritual marriage karma. May meet first in dreams.'
        ];

        let ch4 = (isEasy
            ? '<strong>Past Life Spouse Connection</strong><br><br>'
            : '<strong>D60 7 house (spouse): ' + SIGNS[d60H7sign] + ' ' + SIGN_SYMBOLS[d60H7sign] + '</strong> (7 lord: ' + (RULER_NAMES[d60H7lord]||d60H7lord) + ')<br><br>');
        ch4 += spouseKarmaBySign[d60H7sign] + '<br>';

        if (d60H7planets.length > 0) {
            ch4 += '<br><strong>' + (isEasy ? 'Planets in spouse position:' : 'D60 Planets in 7th:') + '</strong><br>';
            d60H7planets.forEach(p => {
                const pD = getDeity(p.sidereal);
                if (isEasy) {
                    ch4 += (p.natural === 'benefic'
                        ? 'Good past-life connection with spouse — blessings in this life.'
                        : 'Unresolved past-life issues with spouse. Challenges but growth opportunities.') + '<br>';
                } else {
                    ch4 += p.symbol + ' <strong>' + p.name + '</strong>' + deityTag(pD) + '<br>';
                    ch4 += (p.natural === 'benefic'
                        ? 'Benefic in 7th house — Built good karma with spouse in past lives. Blessings from spouse in this life too.'
                        : 'Malefic in 7th house — Unresolved karma with spouse from past lives. Settling it in this life. Challenging but opportunity for growth.') + '<br>';
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
                ch4 += '<br><strong>♀ Venus (Planet of Love)</strong> → D60 ' + venH + ' house (' + houseThemes[venH] + ')' + deityTag(venD) + '<br>';
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
                    ? '<br><br>🔥 <strong>Very strong past-life connection!</strong> Deep connection with spouse in past lives — destined to meet in this life.'
                    : '<br><br>🔥 <strong>Rahu-Ketu axis on D60 1-7 line!</strong> This indicates a <strong>very strong past-life connection</strong> with your spouse. Destined to meet in this life.';
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
        html += subChapter('💍', 'Karma du partenaire — Connexion des vies passées', ch4);

        // ─── 소챕터 5: career karma ───
        const d60H10sign = (dLagnaSign + 9) % 12;
        const d60H10lord = SIGN_RULERS[d60H10sign];
        const d60H10planets = dPositions.filter(p => p.dSign === d60H10sign);
        const satD60 = dPositions.find(p => p.id === 'Saturn');
        const careerKarma = ['military/leadership/sports','finance/art/agriculture','education/media/commerce','nursing/real estate/hospitality','politics/entertainment/management','medical/analysis/service','law/diplomacy/design','research/investigation/medicine','education/religion/foreign','administration/construction/civil servant','technology/science/innovation','art/spirituality/hospital'][d60H10sign];

        let ch5 = (isEasy
            ? '<strong>Past life career karma</strong><br><br>'
            : '<strong>D60 10 house (career): ' + SIGNS[d60H10sign] + ' ' + SIGN_SYMBOLS[d60H10sign] + '</strong> (10 lord: ' + (RULER_NAMES[d60H10lord]||d60H10lord) + ')<br><br>');
        ch5 += 'Past life career karma in <strong>' + careerKarma + '</strong> direction. Natural attraction to this field.<br>';
        if (satD60) {
            const satD = getDeity(satD60.sidereal);
            const satH = ((satD60.dSign - dLagnaSign + 12) % 12) + 1;
            if (!isEasy) ch5 += '<br><strong>♄ Saturn (Lord of Karma)</strong> → D60 ' + satH + ' house (' + houseThemes[satH] + ')' + deityTag(satD) + '<br>';
            ch5 += isEasy ?
                ('<br>' + (satD.deity && satD.deity.nature === 'benefic' ?
                    'This is a <strong>very rare blessing</strong>! Past life patience reduces career challenges in this life.' :
                    'Heavy career lesson from past lives. Steady effort and helping others is the key.')) :
                (satD.deity && satD.deity.nature === 'benefic' ?
                    'Saturn under benefic deity is a <strong>very rare blessing</strong>! Past life patience reduces career trials.' :
                    'Saturn under malefic deity — <strong>heavy past-life karma</strong> in career area. ' + (satD.deity?satD.deity.desc:'') + '. Patience, service, mantra(Om Shanaishcharaya Namaha) to dissolve this karma.');
        }
        if (d60H10planets.length > 0) {
            ch5 += '<br><br><strong>' + (isEasy ? 'Career planets:' : 'D60 Planets in 10th:') + '</strong> ' + d60H10planets.map(p => p.name).join(', ') + ' — Career karma concentrated in these planets.';
        }
        html += subChapter('💼', 'Karma de carrière — Vocation des vies passées', ch5);

        // ─── 소챕터 6: wealth karma ───
        const d60H2sign = (dLagnaSign + 1) % 12;
        const d60H2planets = dPositions.filter(p => p.dSign === d60H2sign);
        let ch6 = (isEasy
            ? '<strong>Past life wealth karma</strong><br><br>'
            : '<strong>D60 2 house (wealth): ' + SIGNS[d60H2sign] + ' ' + SIGN_SYMBOLS[d60H2sign] + '</strong><br><br>');
        const wealthKarma = ['Self-made wealth instinct.','Abundant environment past life.','Intellectual wealth building.','Family/property wealth.','Wealth through authority.','Wealth through service. Frugal.','Partnership wealth.','Others wealth (inheritance).','Fortune brings wealth. Foreign.','Slow but sure. Rich after midlife.','Innovation wealth. Unconventional.','Spiritual activity and wealth. Giving.'][d60H2sign];
        ch6 += wealthKarma + '<br>';
        if (d60H2planets.length > 0) {
            ch6 += isEasy ? '<br>' : '<br><strong>D60 2 house planet:</strong><br>';
            d60H2planets.forEach(p => {
                const pD = getDeity(p.sidereal);
                ch6 += (isEasy ? '' : p.symbol + ' ' + p.name + deityTag(pD) + ' — ') + (p.natural === 'benefic' ? 'Good wealth connections from past lives — abundance in this life too.' : 'Wealth lessons from past lives. Steady effort can overcome them.') + '<br>';
            });
        }
        html += subChapter('💰', 'Karma de richesse — Fortune des vies passées', ch6);

        // ─── 소챕터 7: 행성별 신 목록 (전문가 모드만) ───
        if (!isEasy) {
            let ch7 = '';
            const lagnaD2 = getDeity(lagnaSidereal);
            if (lagnaD2.deity) {
                const lc = lagnaD2.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f';
                ch7 += '<div style="padding:4px 0;">⬆ Lagna → <strong>' + lagnaD2.deity.name + '</strong>(' + lagnaD2.deity.ko + ') <span style="color:' + lc + ';">' + (lagnaD2.deity.nature === 'benefic' ? 'Benefic' : 'Malefic') + '</span></div>';
            }
            positions.forEach(p => {
                const pD = getDeity(p.sidereal);
                if (pD.deity) {
                    const c = pD.deity.nature === 'benefic' ? '#5cb85c' : '#d9534f';
                    ch7 += '<div style="padding:4px 0;">' + p.symbol + ' ' + p.name + ' → <strong>' + pD.deity.name + '</strong>(' + pD.deity.ko + ') <span style="color:' + c + ';">' + (pD.deity.nature === 'benefic' ? 'Benefic' : 'Malefic') + '</span></div>';
                }
            });
            html += subChapter('🕉️', 'Liste des divinités planétaires', ch7);
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
            '<strong style="color:#5cb85c">' + beneficCount + ' good energy</strong>, <strong style="color:#d9534f">' + (positions.length - beneficCount) + ' caution energy</strong> out of 9 planets<br><br>' :
            '<strong style="color:#5cb85c">' + beneficCount + ' benefic</strong>, <strong style="color:#d9534f">' + (positions.length - beneficCount) + ' malefic</strong> placement<br><br>';
        if (beneficCount >= 7) {
            ch8 += isEasy ?
                '🌟 <strong>You did so many good things in past lives!</strong> Almost all planets under good energy — naturally getting good results. Strong innate fortune.' :
                '🌟 <strong>Very strong past-life merit.</strong> Parasara called such charts "a soul blessed by the gods". Most planets under benefics — good results naturally.';
        } else if (beneficCount >= 5) {
            ch8 += isEasy ?
                '✨ <strong>Abundant good energy from past lives.</strong> Protected in many areas of life.' :
                '✨ <strong>Abundant past life merit.</strong> Benefics dominate — protected in many areas.';
            if (maleficPlanets.length > 0) ch8 += isEasy ?
                ' However, some areas need more effort.' :
                ' However, karmic challenges exist in <strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong> areas. Practice mantra and charity for these planets.';
        } else if (beneficCount >= 3) {
            ch8 += isEasy ?
                '⚖️ <strong>Good energy and challenging energy are half and half.</strong> Good things and hard things alternate in life.' :
                '⚖️ <strong>Karma in balance.</strong> Mixed fortune — good and challenges alternate.';
            if (maleficPlanets.length > 0) ch8 += '<br>' + (isEasy ? 'Planets to watch: ' : 'Planets to watch: ') + '<strong>' + maleficPlanets.map(p => p.name).join(', ') + '</strong>';
        } else {
            ch8 += isEasy ?
                '🔥 <strong>This life is about resolving past life lessons.</strong> Many challenges, but those with the heaviest lessons grow the most. Steady effort and helping others is especially important.' :
                '🔥 <strong>A life of karma settlement.</strong> Many challenges from past lives, but Parasara said "the soul with heaviest karma grows the most". Mantra practice and charity are especially important.';
        }
        html += subChapter('📊', 'Évaluation globale du karma', ch8);

        // (이전 코드 제거됨 - 신 목록과 해석은 위 소챕터에 통합)

    } else if (division === 2) {
        // D2 Hora — wealth·부의 축적
        const d2LagnaInterp = ['Richesse autodidacte. Investissement independant et agressif.','Investissement sensoriel et richesse stable. Immobilier, alimentation, art.','Gagner par activite intellectuelle. Ecriture, education, sens des affaires.','Revenus immobiliers et familiaux. Propriete de la mere. Attention aux depenses emotionnelles.','Richesse par leadership et autorite. Gouvernement, or. Depenses ostentatoires.','Revenus par analyse et competences. Medical, comptabilite, service. Gestionnaire frugal.','Richesse par partenariat. Droit, diplomatie, mode, art.','Construire la richesse avec l\'argent des autres (heritage, assurance, investissements).','Revenus par education, etranger, religion. La fortune apporte la richesse.','Effort systematique construit la richesse. Lent mais sur. Riche apres la cinquantaine.','Revenus par technologie, innovation, reseaux. Sources non conventionnelles.','Revenus par activites spirituelles/artistiques. Richesse etrangere. Nature genereuse.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💰 Analyse détaillée de richesse' : '💰 D2 Hora — Analyse de richesse') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D2 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d2LagnaInterp + '<br><br>';

        const sunD2 = dPositions.find(p => p.id === 'Sun');
        const moonD2 = dPositions.find(p => p.id === 'Moon');
        const jupD2 = dPositions.find(p => p.id === 'Jupiter');
        const venD2 = dPositions.find(p => p.id === 'Venus');

        if (sunD2) {
            const sunInOwn = sunD2.dSign === 4; // Leo
            html += (isEasy ? '' : '<strong>☉ Sun → ' + SIGNS[sunD2.dSign] + ':</strong> ') + (sunInOwn ? (isEasy ? '🌟 <strong>Self-made!</strong> Builds wealth through authority and leadership.' : '🌟 <strong>Sun in own Hora (Leo)!</strong> Self-made type. Builds wealth through authority and leadership.') : (isEasy ? 'Income through others or government/public sector.' : 'Sun in Moon Hora. Income through others help or government/public sector.')) + '<br>';
        }
        if (moonD2) {
            const moonInOwn = moonD2.dSign === 3; // Cancer
            html += (isEasy ? '' : '<strong>☽ Moon → ' + SIGNS[moonD2.dSign] + ':</strong> ') + (moonInOwn ? (isEasy ? '🌟 <strong>Abundant life through public relations!</strong>' : '🌟 <strong>Moon in own Hora (Cancer)!</strong> Abundant life through public and relationships.') : (isEasy ? 'Income through own effort and independent activity.' : 'Moon in Sun Hora. Income through own effort and independent activity.')) + '<br>';
        }
        if (jupD2) html += (isEasy ? '' : '<strong>♃ Jupiter → ' + SIGNS[jupD2.dSign] + ':</strong> ') + (isEasy ? (jupD2.dSign === 4 ? 'Can build great wealth through own ability.' : 'Abundance through relationships with others.') : 'Jupiter in ' + (jupD2.dSign === 4 ? 'Sun Hora — great wealth through own ability.' : 'Moon Hora — abundance through relationships with others.')) + '<br>';
        if (venD2) html += (isEasy ? '' : '<strong>♀ Venus → ' + SIGNS[venD2.dSign] + ':</strong> ') + (isEasy ? (venD2.dSign === 4 ? 'Self-made through art/luxury goods.' : 'Wealth through spouse or partner.') : 'Venus in ' + (venD2.dSign === 4 ? 'Sun Hora — self-made through art/luxury goods.' : 'Moon Hora — wealth through spouse or partner.')) + '<br>';

        // D2 2궁(축적된 부) 분석
        const d2H2sign = (dLagnaSign + 1) % 12;
        const d2H2planets = dPositions.filter(p => p.dSign === d2H2sign);
        html += '<br><strong>' + (isEasy ? 'Accumulated wealth:' : 'D2 2nd house (accumulated wealth) — ' + SIGNS[d2H2sign] + ':') + '</strong><br>';
        if (d2H2planets.length > 0) {
            d2H2planets.forEach(p => {
                const wealth = {Sun:'Wealth through authority and status',Moon:'Fluid wealth through public activities',Mars:'Wealth in real estate, technology, competitive fields',Mercury:'Wealth in business, intellectual, communication fields',Jupiter:'Abundant wealth in education, religion, law fields',Venus:'Wealth related to art, fashion, luxury goods',Saturn:'Slow but steady wealth. Stable after middle age',Rahu:'Wealth through unconventional methods or foreign sources',Ketu:'Detached from material. Pursues spiritual values'};
                html += isEasy ? (wealth[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (wealth[p.id]||'') + '<br>';
            });
        } else {
            html += isEasy ? 'Steadily accumulates wealth.<br>' : '2nd house empty — 2nd house lord position is key to wealth accumulation.<br>';
        }
        html += '</div></div>';

    } else if (division === 3) {
        // D3 Drekkana — sibling·용기·소통
        const d3LagnaInterp = ['Independant, leadership parmi les freres/soeurs. Style de communication courageux.','Relations fraternelles stables et materiellement confortables. Freres artistiques possibles.','Freres/soeurs intellectuels et communicatifs. Beaucoup de freres ou conversations.','Lien fraternel emotionnellement profond. Frere/soeur maternel. Freres protecteurs.','Freres/soeurs charismatiques et fiers. Frere celebre ou a succes.','Freres/soeurs analytiques et pratiques. Domaine medical/educatif. Peuvent etre critiques.','Freres/soeurs diplomatiques et charmants. Connexions sociales par les freres.','Relations fraternelles intenses et secretes. Liens profonds apres conflits.','Freres/soeurs libres et philosophiques. Freres a l\'etranger. Lie a la religion/education.','Freres/soeurs responsables et ambitieux. Sens du devoir. Peu de freres ou relation serieuse.','Freres/soeurs uniques et independants. Relations fraternelles non conventionnelles.','Freres/soeurs spirituels et artistiques. Freres a l\'etranger. Connexion emotionnelle.'][dLagnaSign];

        const d3_3sign = (dLagnaSign + 2) % 12;
        const d3_11sign = (dLagnaSign + 10) % 12;
        const d3_3planets = dPositions.filter(p => p.dSign === d3_3sign);
        const d3_11planets = dPositions.filter(p => p.dSign === d3_11sign);
        const marsD3 = dPositions.find(p => p.id === 'Mars');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👫 Analyse frères/sœurs & courage' : '👫 D3 Drekkana — Frères/Sœurs & Courage') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D3 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d3LagnaInterp + '<br><br>';

        html += '<strong>' + (isEasy ? 'Younger siblings:' : 'D3 3 house (younger) — ' + SIGNS[d3_3sign] + ':') + '</strong><br>';
        if (d3_3planets.length > 0) {
            const bro = {Sun:'Younger sibling has leadership and authority',Moon:'Emotionally close with younger sibling',Mars:'Active and brave younger sibling. Arguments possible',Mercury:'Younger sibling is intellectual with good communication',Jupiter:'Younger sibling is wise and brings fortune',Venus:'Younger sibling is charming and artistic',Saturn:'Difficulty with younger sibling. Age gap possible',Rahu:'Younger sibling is unique or foreign-related',Ketu:'Distance with younger sibling. Spiritual connection'};
            d3_3planets.forEach(p => { html += isEasy ? (bro[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (bro[p.id]||'') + '<br>'; });
        } else html += isEasy ? '' : '3rd house empty — check 3rd lord position.<br>';

        html += '<br><strong>' + (isEasy ? 'Older siblings:' : 'D3 11th house (older siblings) — ' + SIGNS[d3_11sign] + ':') + '</strong><br>';
        if (d3_11planets.length > 0) {
            d3_11planets.forEach(p => { html += isEasy ? 'Influences older sibling relationship.<br>' : '• ' + p.name + ' in 11th house — influences relationship with older siblings.<br>'; });
        } else html += isEasy ? '' : '11 house no planets.<br>';

        if (marsD3) {
            const marsH = ((marsD3.dSign - dLagnaSign + 12) % 12) + 1;
            html += isEasy ? '<br>' : '<br><strong>♂ Mars (sibling karaka):</strong> ';
            html += marsH <= 4 ? 'Close sibling relationship. Courageous siblings.' : marsH <= 8 ? 'Sibling conflicts or transformation through siblings.' : 'Siblings abroad or spiritual tendency.';
        }
        html += '</div></div>';

    } else if (division === 4) {
        // D4 Chaturthamsha — 재산·부동산·행운
        const d4LagnaInterp = ['Acquiert activement des proprietes. Aime construire ou acheter de nouvelles maisons.','Immobilier stable et abondant. Terres et fermes. Habitation luxueuse.','Plusieurs maisons ou demenagements frequents. Prefere environnement intellectuel.','Maison et propriete sont emotionnellement importants. Pres de l\'eau. Propriete de la mere.','Grande maison spacieuse. Interieur luxueux. Zone prestigieuse.','Habitation propre et pratique. Environnement axe sur la sante. Plusieurs petites proprietes.','Belle maison harmonieuse. Interet pour le design interieur. Propriete avec partenaire.','Propriete subit une transformation. Propriete heritee. Lieux secrets.','Grand terrain et propriete etrangere. Pres d\'installations religieuses/educatives.','Investissement immobilier systematique. Vieux batiments. Croissance lente mais sure.','Style d\'habitation unique. Appartement moderne. Installations technologiques.','Belle maison pres de l\'eau. Propriete etrangere. Espace spirituel.'][dLagnaSign];

        const d4_4sign = (dLagnaSign + 3) % 12;
        const d4_4planets = dPositions.filter(p => p.dSign === d4_4sign);
        const d4_10sign = (dLagnaSign + 9) % 12;
        const d4_10planets = dPositions.filter(p => p.dSign === d4_10sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '🏠 Analyse propriété & fortune' : '🏠 D4 Chaturthamsha — Analyse propriété & fortune') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D4 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d4LagnaInterp + '<br><br>';

        html += '<strong>' + (isEasy ? 'Property/Home:' : 'D4 4 house (real estate/home) — ' + SIGNS[d4_4sign] + ':') + '</strong><br>';
        if (d4_4planets.length > 0) {
            const prop = {Sun:'Government-owned building or prestigious residence',Moon:'Beautiful home. Near water. Mother\'s influence',Mars:'New home construction. Real estate disputes possible',Mercury:'Commercial real estate. Multiple properties',Jupiter:'Spacious, abundant home! Best real estate fortune',Venus:'Luxurious home. Beautiful interior',Saturn:'Old property. Repairs needed. Stable after middle age',Rahu:'Foreign real estate. Unconventional dwelling',Ketu:'Indifferent to real estate. Prefers spiritual spaces'};
            d4_4planets.forEach(p => { html += isEasy ? (prop[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (prop[p.id]||'') + '<br>'; });
        } else html += isEasy ? 'Stable real estate fortune.<br>' : '4th house empty — 4th lord position is key to real estate fortune.<br>';

        html += '<br><strong>' + (isEasy ? 'Overall fortune:' : 'D4 10th house (overall fortune) — ' + SIGNS[d4_10sign] + ':') + '</strong><br>';
        if (d4_10planets.length > 0) {
            d4_10planets.forEach(p => {
                html += isEasy ? (p.natural === 'benefic' ? 'Overall fortune is good!<br>' : 'Effort needed but growth opportunity.<br>') : '• ' + p.name + ': ' + (p.natural === 'benefic' ? 'Benefic in 10th house — overall fortune is good!' : 'Malefic in 10th house — effort needed for fortune but opportunity for growth.') + '<br>';
            });
        } else html += isEasy ? '' : '10 house no planets.<br>';
        html += '</div></div>';

    } else if (division === 16) {
        // D16 Shodashamsha — 차량·comfort·행복
        const d16LagnaInterp = ['Voitures de sport, motos — vehicules dynamiques. Aime conduire.','Vehicules premium et transport confortable. Confort materiel luxueux.','Plusieurs vehicules ou transports varies. Aime les gadgets tech.','Vehicule familial confortable. Voyager en famille. La stabilite materielle est le bonheur.','Vehicules de luxe haut de gamme. Depenses voyantes. Prefere les marques premium.','Vehicules pratiques et economes. Appareils de sante.','Vehicule raffine et bien concu. Articles esthetiquement agreables.','Vehicule d\'occasion ou herite. Assurance importante. Experience materielle transformatrice.','SUV ou marques etrangeres. Vehicule de voyage. Transport aventureux.','Vehicule simple mais solide. Praticite d\'abord. Meilleure voiture apres la cinquantaine.','Vehicule electrique ou derniere technologie. Transport unique.','Transport lie a l\'eau (bateau). Articles emotionnellement favoris.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '🚗 Véhicules & Confort' : '🚗 D16 Shodashamsha — Véhicules & Confort') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D16 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d16LagnaInterp + '<br><br>';

        const d16_4sign = (dLagnaSign + 3) % 12;
        const d16_4planets = dPositions.filter(p => p.dSign === d16_4sign);
        html += '<strong>' + (isEasy ? 'Comfort/Happiness:' : 'D16 4th house (comfort/happiness) — ' + SIGNS[d16_4sign] + ':') + '</strong><br>';
        if (d16_4planets.length > 0) {
            d16_4planets.forEach(p => {
                html += isEasy ? (p.natural === 'benefic' ? 'Abundant material comfort and happiness!<br>' : 'Effort needed for material comfort.<br>') : '• ' + p.name + ': ' + (p.natural === 'benefic' ? 'Material comfort and happiness abundant!' : 'Effort needed for material comfort.') + '<br>';
            });
        } else html += isEasy ? 'Average material comfort.<br>' : '4th house empty — 4th lord position is key to happiness.<br>';

        const venD16 = dPositions.find(p => p.id === 'Venus');
        if (venD16) {
            const vH = ((venD16.dSign - dLagnaSign + 12) % 12) + 1;
            html += isEasy ? '<br>' : '<br><strong>♀ Venus (comfort karaka):</strong> ';
            html += [,'Creates own comfort','Comfort through wealth','Happiness through communication','Great happiness at home!','Happiness through children/romance','Comfort through health management','Happiness through spouse!','Happiness through transformation','Happiness through travel/learning','Comfort through social status','Happiness through friends/network','Happiness through spiritual peace'][vH] || '';
        }
        html += '</div></div>';

    } else if (division === 20) {
        // D20 Vimshamsha — 영적 practice·종교
        const d20LagnaInterp = ['Spiritualite active. Karma yoga. Pratique par le service actif.','Spiritualite par la nature et les sens. Pratique de mantras. Meditation au temple.','Spiritualite intellectuelle. Recherche scripturaire. Eveil par la connaissance.','Spiritualite emotionnelle. Bhakti yoga (devotion). Attire par la divinite maternelle.','Spiritualite royale. Pratique spirituelle en tant que leader. Adoration du soleil.','Spiritualite de service. Pratique par le seva (service). Spiritualite de guerison.','Spiritualite d\'harmonie. Experience divine par l\'art et la beaute. Tantra.','Spiritualite transformatrice profonde. Tantra, Kundalini. Mort et renaissance.','Spiritualite de chercheur. Pelerinage. Recherche d\'un maitre. Pratique philosophique.','Spiritualite traditionnelle. Pratique systematique. Karma yoga. Pratique de patience.','Spiritualite innovante. Methodes non conventionnelles. Service a l\'humanite.','Spiritualite transcendante. Meditation, reves, intuition. Experiences mystiques. Liberation.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '🙏 Spiritualité' : '🙏 D20 Vimshamsha — Spiritualité') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D20 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d20LagnaInterp + '<br><br>';

        const jupD20 = dPositions.find(p => p.id === 'Jupiter');
        const sunD20 = dPositions.find(p => p.id === 'Sun');
        const ketuD20 = dPositions.find(p => p.id === 'Ketu');
        const d20_9sign = (dLagnaSign + 8) % 12;
        const d20_12sign = (dLagnaSign + 11) % 12;
        const d20_9planets = dPositions.filter(p => p.dSign === d20_9sign);

        if (jupD20) {
            const jH = ((jupD20.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '' : '<strong>♃ Jupiter (Spiritual Teacher) → ' + jH + 'th:</strong> ') + ([,'Strong spiritual self','Spiritual knowledge becomes wealth','Spiritual communication ability','Deep inner peace','Past life spiritual merit','Spirituality through service','Meeting a teacher','Secret spiritual knowledge','Best placement! Great spiritual fortune','Spiritual authority','Spiritual community','Liberation and awakening'][jH] || '') + '<br>';
        }
        if (ketuD20) {
            const kH = ((ketuD20.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '' : '<strong>☋ Ketu (Liberation) → ' + kH + 'th:</strong> ') + ([,'Innate spiritual ability','Spiritual values','Spiritual communication','Deep inner liberation','Result of past life practice','Serving soul','Spiritual growth through spouse','Deep transformative spirituality','Spiritual pilgrim','Spiritual career','Leader of spiritual community','Soul near liberation'][kH] || '') + '<br>';
        }
        html += '<br><strong>' + (isEasy ? 'Guru/Teacher:' : 'D20 9th house (guru/teacher) — ' + SIGNS[d20_9sign] + ':') + '</strong><br>';
        if (d20_9planets.length > 0) {
            d20_9planets.forEach(p => { html += isEasy ? 'Strong spiritual teacher connection.<br>' : '• ' + p.name + ': Strong connection with spiritual teacher.<br>'; });
        } else html += isEasy ? 'Good to actively seek a spiritual teacher.<br>' : '9th house empty — actively seek a spiritual teacher.<br>';
        html += '</div></div>';

    } else if (division === 24) {
        // D24 차투르Vimshamsha — 교육·학문
        const d24LagnaInterp = ['Education physique, militaire, formation au leadership.','Musique, art, culinaire, education financiere.','Langues, litterature, communication, education mediatique.','Histoire, psychologie, sciences domestiques.','Sciences politiques, theatre, education commerciale.','Medecine, science, statistiques. Apprentissage precis.','Droit, diplomatie, education en design. Apprentissage equilibre.','Psychologie, recherche, investigation, education occulte.','Philosophie, theologie, etudes internationales. Etudes a l\'etranger probable.','Commerce, administration, architecture. Apprentissage systematique.','IT, ingenierie, aviation, sciences sociales. Apprentissage innovant.','Art, musique, spiritualite, etudes cinematographiques. Apprentissage intuitif.'][dLagnaSign];

        const d24_4sign = (dLagnaSign + 3) % 12;
        const d24_5sign = (dLagnaSign + 4) % 12;
        const d24_4planets = dPositions.filter(p => p.dSign === d24_4sign);
        const d24_5planets = dPositions.filter(p => p.dSign === d24_5sign);
        const jupD24 = dPositions.find(p => p.id === 'Jupiter');
        const merD24 = dPositions.find(p => p.id === 'Mercury');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '📚 Analyse éducation' : '📚 D24 Chaturvimshamsha — Analyse éducation') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D24 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d24LagnaInterp + '<br><br>';

        html += '<strong>' + (isEasy ? 'Basic Education:' : 'D24 4th house (basic education) — ' + SIGNS[d24_4sign] + ':') + '</strong><br>';
        if (d24_4planets.length > 0) {
            d24_4planets.forEach(p => {
                const edu4 = {Sun:'Prestigious school. Authoritative education',Moon:'Comfortable learning environment. Strong home education influence',Mars:'Competitive learning. Physical/technical education strong',Mercury:'Best placement! Outstanding academic ability',Jupiter:'Rich educational environment. Good teachers',Venus:'Art education. Beautiful school',Saturn:'Difficult education environment but deep knowledge if overcome',Rahu:'Unconventional education. Foreign school',Ketu:'Less interest in education. Intuitive learning'};
                html += isEasy ? (edu4[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (edu4[p.id]||'') + '<br>';
            });
        } else html += isEasy ? 'Grows steadily in stable educational environment.<br>' : '4 house no planets.<br>';

        html += '<br><strong>' + (isEasy ? 'Higher Education:' : 'D24 5th house (higher education/intellect) — ' + SIGNS[d24_5sign] + ':') + '</strong><br>';
        if (d24_5planets.length > 0) {
            d24_5planets.forEach(p => {
                html += isEasy ? (p.natural === 'benefic' ? 'Outstanding achievement in higher education!<br>' : 'Academic challenges lead to growth.<br>') : '• ' + p.name + ': ' + (p.natural === 'benefic' ? 'Outstanding higher education achievement!' : 'Academic challenges lead to growth.') + '<br>';
            });
        } else html += isEasy ? 'Steady effort brings good results.<br>' : '5 house no planets.<br>';

        if (jupD24) {
            const jH = ((jupD24.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '<br>' : '<br><strong>♃ Jupiter (Wisdom) → ' + jH + 'th:</strong> ') + ([1,4,5,9].includes(jH) ? '🎓 <strong>High academic achievement expected!</strong> Graduate/doctoral/study abroad possible.' : (isEasy ? 'Growth through academics expected.' : 'Growth through academics. Jupiter\'s blessing manifests in ' + jH + 'th house area.')) + '<br>';
        }
        if (merD24) {
            const mH = ((merD24.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '' : '<strong>☿ Mercury (Learning) → ' + mH + 'th:</strong> ') + ([1,4,5,9].includes(mH) ? '📖 <strong>Outstanding intellect!</strong> Talent in math, language, analysis.' : (isEasy ? 'Intellectual ability well expressed.' : 'Intellectual ability in ' + mH + 'th house area.')) + '<br>';
        }
        html += '</div></div>';

    } else if (division === 27) {
        // D27 삽타Vimshamsha — 체력·강점·약점
        const d27LagnaInterp = ['Forte endurance et energie. Excellente capacite athletique. Tete/visage est la force.','Endurance et patience sont les forces. Cou/cordes vocales forts.','Agilite et reflexes forts. Soin du systeme nerveux necessaire.','Resilience emotionnelle est la force. Surveiller poitrine/estomac. Talent pour la natation.','Coeur et colonne vertebrale forts. Physique charismatique. Attention au surmenage.','Pouvoir digestif et analytique sont les forces. Surveiller intestins/peau. Yoga adapte.','Physique equilibre et harmonieux. Surveiller reins/dos. La danse convient.','Recuperation et resistance sont les forces. Surveiller sante reproductive. Sports extremes possibles.','Cuisses et foie sont forts. Exercice en plein air adapte. Attention au surpoids.','Os et articulations sont forts. Meilleure patience. Plus sain avec l\'age.','Surveiller systeme circulatoire et chevilles. Prefere exercice unique. Methodes de sante innovantes.','Immunite et intuition sont les forces. Surveiller pieds/lymphe. Exercice aquatique adapte.'][dLagnaSign];

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '💪 Analyse de force physique' : '💪 D27 Saptavimshamsha — Analyse de force physique') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D27 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d27LagnaInterp + '<br><br>';

        const marsD27 = dPositions.find(p => p.id === 'Mars');
        const sunD27 = dPositions.find(p => p.id === 'Sun');
        const satD27 = dPositions.find(p => p.id === 'Saturn');
        if (marsD27) {
            const mH = ((marsD27.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '' : '<strong>♂ Mars (Energy) → ' + mH + 'th:</strong> ') + ([,'Strong physique and will!','Can earn through physical strength','Courage and adventurous spirit strong','Home exercise type','Sports talent!','Immunity to overcome disease','Exercise with spouse','Survival strength in crisis','Strong in adventure/exploration','Physical strength for career','Goal achievement energy','Physical activity abroad'][mH] || '') + '<br>';
        }
        if (sunD27) {
            const sH = ((sunD27.dSign - dLagnaSign + 12) % 12) + 1;
            html += (isEasy ? '' : '<strong>☉ Sun (Vitality) → ' + sH + 'th:</strong> ') + (isEasy ? 'Source of vitality: ' : 'Source of vitality in ' + sH + 'th house area. ') + ([,'Energy from self','Vitality from wealth activities','Energy from communication','Stability from home','Vitality from creation','Energy from service','Vitality from relationships','Energy from transformation','Vitality from travel','Energy from career','Vitality from society','Energy from spiritual practice'][sH] || '') + '<br>';
        }

        // D27 6 house (약점/질병) 분석
        const d27_6sign = (dLagnaSign + 5) % 12;
        const d27_6planets = dPositions.filter(p => p.dSign === d27_6sign);
        html += '<br><strong>' + (isEasy ? 'Weakness:' : 'D27 6th house (weakness/vulnerability) — ' + SIGNS[d27_6sign] + ':') + '</strong><br>';
        const bodyParts = ['Head/Brain','Neck/Thyroid','Lungs/Arms','Stomach/Chest','Heart/Back','Digestive/Intestines','Kidneys/Lower back','Reproductive','Liver/Thighs','Bones/Joints','Ankles/Circulatory','Feet/Immune'];
        html += 'Vulnerable area: <strong>' + bodyParts[d27_6sign] + '</strong> — watch this area carefully.<br>';
        if (d27_6planets.length > 0) {
            d27_6planets.forEach(p => { html += isEasy ? 'Special attention needed for this area.<br>' : '• ' + p.name + ' in 6th house — special attention needed for this area.<br>'; });
        }
        html += '</div></div>';

    } else if (division === 30) {
        // D30 Trimshamsha — 불행·질병·장애
        const d30LagnaInterp = ['Accidents, brulures, maux de tete. Problemes de decisions hatives. Gerer la colere.','Perte financiere, problemes alimentaires, thyroide. Attention a trop manger.','Anxiete nerveuse, insomnie, problemes respiratoires. Eviter l\'inquietude excessive.','Instabilite emotionnelle, problemes d\'estomac, problemes lies a l\'eau. Controler les emotions.','Problemes cardiaques, dommage a l\'orgueil, surmenage. Besoin d\'humilite et de repos.','Troubles digestifs, allergies, stress perfectionniste. Besoin de relaxation.','Problemes renaux, conflits relationnels, indecision. Besoin de determination.','Secrets, accidents, chirurgie, problemes sexuels. Examens reguliers importants.','Problemes hepatiques, surpoids, jeu/depenses excessives. Besoin de moderation.','Articulations, os, depression, solitude. Besoin de calcium et interaction sociale.','Pression arterielle, circulation, accidents inattendus. Bilans de sante reguliers.','Deficience immunitaire, addiction, sante mentale. Besoin de meditation et sommeil.'][dLagnaSign];

        const d30_6sign = (dLagnaSign + 5) % 12;
        const d30_8sign = (dLagnaSign + 7) % 12;
        const d30_12sign = (dLagnaSign + 11) % 12;
        const d30_6planets = dPositions.filter(p => p.dSign === d30_6sign);
        const d30_8planets = dPositions.filter(p => p.dSign === d30_8sign);
        const d30_12planets = dPositions.filter(p => p.dSign === d30_12sign);

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '⚠️ Détails précautions santé' : '⚠️ D30 Trimshamsha — Maladie') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D30 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d30LagnaInterp + '<br><br>';

        html += '<strong>' + (isEasy ? 'Disease caution:' : 'D30 6th house (disease/enemy) — ' + SIGNS[d30_6sign] + ':') + '</strong><br>';
        const diseaseBySign = ['Headache, fever, inflammation','Neck, thyroid, diabetes','Lungs, nerves, anxiety','Stomach, water retention','Heart, back, blood pressure','Digestive, intestines, skin','Kidneys, lower back, urinary','Reproductive, chronic conditions','Liver, thighs, overweight','Bones, joints, rheumatism','Circulatory, blood pressure, ankles','Immune, feet, mental health'];
        html += 'Watch for: <strong>' + diseaseBySign[d30_6sign] + '</strong><br>';
        if (d30_6planets.length > 0) {
            const dis = {Sun:'Watch for eye and heart related disease',Moon:'Mental health and water retention issues',Mars:'Watch for accidents, surgery, burns',Mercury:'Nervous system and skin problems',Jupiter:'Watch for liver and overweight',Venus:'Watch for kidney, diabetes, STD',Saturn:'Chronic disease, joint problems',Rahu:'Unknown cause disease, addiction',Ketu:'Lowered immunity, allergy'};
            d30_6planets.forEach(p => { html += isEasy ? (dis[p.id]||'') + '<br>' : '• ' + p.name + ': ' + (dis[p.id]||'') + '<br>'; });
        }

        html += '<br><strong>' + (isEasy ? 'Danger/Surgery:' : 'D30 8 house (danger/surgery) — ' + SIGNS[d30_8sign] + ':') + '</strong><br>';
        if (d30_8planets.length > 0) {
            d30_8planets.forEach(p => { html += isEasy ? (p.natural === 'malefic' ? 'Danger/accident caution. Insurance important.' : 'Protected in crisis.') + '<br>' : '• ' + p.name + ': ' + (p.natural === 'malefic' ? 'Danger/accident caution. Insurance important.' : 'Protected in crisis.') + '<br>'; });
        } else html += isEasy ? 'Few big dangers.<br>' : '8th house empty — few major dangers.<br>';

        html += '<br><strong>' + (isEasy ? 'Hospitalization:' : 'D30 12th house (hospitalization/loss) — ' + SIGNS[d30_12sign] + ':') + '</strong><br>';
        if (d30_12planets.length > 0) {
            d30_12planets.forEach(p => { html += isEasy ? (p.natural === 'malefic' ? 'Hospitalization possible.' : 'Spiritual healing and recovery.') + '<br>' : '• ' + p.name + ': ' + (p.natural === 'malefic' ? 'Hospitalization possible. Foreign medical.' : 'Spiritual healing and recovery.') + '<br>'; });
        } else html += isEasy ? 'Low hospitalization risk.<br>' : '12th house empty — hospitalization risk is low.<br>';
        html += '</div></div>';

    } else if (division === 40) {
        // D40 Khavedamsha — 모계 유산
        const d40LagnaInterp = ['Independent, strong-willed mother. Leadership inherited from maternal line.','Mother manages wealth well. Material abundance from maternal line.','Intellectual mother with good communication. Language/education talent inherited.','Very deep bond with mother. Sensitivity and intuition inherited.','Mother has authority and dignity. Leadership and honor inherited.','Mother excels at health management. Analytical/service spirit inherited.','Attractive, diplomatic mother. Artistic sense inherited.','Strong mother who went through transformation. Resilience inherited.','Educational, religious mother. Wisdom/philosophy inherited.','Responsible, strict mother. Patience and discipline inherited.','Unique, progressive mother. Innovative thinking inherited.','Spiritual, intuitive mother. Art/spirituality inherited.'][dLagnaSign];

        const d40_4sign = (dLagnaSign + 3) % 12;
        const d40_4planets = dPositions.filter(p => p.dSign === d40_4sign);
        const moonD40 = dPositions.find(p => p.id === 'Moon');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👩 Héritage maternel' : '👩 D40 Khavedamsha — Héritage maternel') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D40 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d40LagnaInterp + '<br><br>';

        if (moonD40) {
            const mH = ((moonD40.dSign - dLagnaSign + 12) % 12) + 1;
            if (!isEasy) html += '<strong>☽ Moon (Mother karaka):</strong> ';
            html += [,'Mother has strong influence','Wealth from mother','Good communication with mother','Deep bond with mother! Best placement','Mother is creative','Mother is service-oriented','Mother influences relationships','Inheritance from mother','Mother is religious/educational','Mother has social status','Mother is independent','Mother is spiritual'][mH] || '';
            html += '<br>';
        }

        html += '<br><strong>' + (isEasy ? 'Maternal family:' : 'D40 4th house (maternal home) — ' + SIGNS[d40_4sign] + ':') + '</strong><br>';
        if (d40_4planets.length > 0) {
            d40_4planets.forEach(p => { html += isEasy ? 'Strongly inherited energy from maternal side.<br>' : '• ' + p.name + ': This planet\'s energy is strongly inherited from maternal line.<br>'; });
        } else html += isEasy ? 'Stable heritage from maternal side.<br>' : '4th house empty — 4th lord position is key to maternal heritage.<br>';
        html += '</div></div>';

    } else if (division === 45) {
        // D45 Akshavedamsha — 부계 유산
        const d45LagnaInterp = ['Active, action-oriented father. Courage and leadership inherited.','Financially stable father. Material values inherited.','Intellectual, versatile father. Communication/business ability inherited.','Emotional, family-oriented father. Caring instinct inherited.','Authoritative, respected father. Leadership inherited.','Practical, diligent father. Analytical/technical skills inherited.','Diplomatic, refined father. Social ability inherited.','Strong, mysterious father. Resilience/insight inherited.','Scholarly, religious father. Philosophy/morality inherited.','Strict, ambitious father. Patience/discipline inherited.','Creative, innovative father. Tech/scientific thinking inherited.','Spiritual, artistic father. Intuition/creativity inherited.'][dLagnaSign];

        const d45_9sign = (dLagnaSign + 8) % 12;
        const d45_9planets = dPositions.filter(p => p.dSign === d45_9sign);
        const sunD45 = dPositions.find(p => p.id === 'Sun');

        html += '<div class="interp-card"><div class="interp-title">' + (isEasy ? '👨 Héritage paternel' : '👨 D45 Akshavedamsha — Héritage paternel') + '</div><div class="interp-text">';
        html += (isEasy ? '' : '<strong>D45 Lagna: ' + SIGNS[dLagnaSign] + '</strong><br>') + d45LagnaInterp + '<br><br>';

        if (sunD45) {
            const sH = ((sunD45.dSign - dLagnaSign + 12) % 12) + 1;
            if (!isEasy) html += '<strong>☉ Sun (Father karaka):</strong> ';
            html += [,'Father has strong influence','Wealth from father','Good communication with father','Father is family-oriented','Father is creative','Father is service-oriented','Father influences relationships','Inheritance from father','Father is religious/educational','Father succeeds in society! Best placement','Father is independent','Father is spiritual'][sH] || '';
            html += '<br>';
        }

        html += '<br><strong>' + (isEasy ? 'Paternal family:' : 'D45 9th house (paternal home/father) — ' + SIGNS[d45_9sign] + ':') + '</strong><br>';
        if (d45_9planets.length > 0) {
            d45_9planets.forEach(p => { html += isEasy ? 'Strongly inherited energy from paternal side.<br>' : '• ' + p.name + ': This planet\'s energy is strongly inherited from paternal line.<br>'; });
        } else html += isEasy ? 'Stable heritage from paternal side.<br>' : '9th house empty — 9th lord position is key to paternal heritage.<br>';
        html += '</div></div>';
    }

    interpEl.innerHTML = html;
}


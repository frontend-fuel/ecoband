const translations = {
    en: {
        // Landing Page
        title: "EcoBand+",
        tagline: "The Wearable that Measures your Carbon Karma",
        subtitle: "Gamifying sustainable living with activity recognition, air quality, and temperature data",
        signUp: "Sign Up",
        logIn: "Log In",
        alreadyHaveAccount: "Already have an account?",
        dontHaveAccount: "Don't have an account?",

        // Sign Up Page
        signUpTitle: "Sign Up",
        name: "Name",
        email: "Email address",
        password: "Password",

        // Login Page
        loginTitle: "Log In",
        forgotPassword: "Forgot password?",

        // Dashboard Page
        greenScore: "Green Score",
        streak: "Streak",
        temperature: "Temperature",
        humidity: "Humidity",
        airQuality: "Air Quality",
        findMyBand: "Find My Band",
        ready: "Ready",
        currentStatus: "Current Status",
        safetyTips: "Safety Tips",

        // Status Messages
        good: "Good",
        moderate: "Moderate",
        poor: "Poor",
        unhealthy: "Unhealthy",

        // Tips
        goodTips: [
            "Keep up the great work!",
            "Share your eco-friendly practices with others",
            "Consider setting new environmental goals"
        ],
        moderateTips: [
            "Try to reduce energy consumption",
            "Consider using public transportation",
            "Monitor your daily carbon footprint"
        ],
        poorTips: [
            "Limit outdoor activities",
            "Use air purifiers indoors",
            "Check local air quality alerts"
        ],
        unhealthyTips: [
            "Stay indoors if possible",
            "Wear a mask when going outside",
            "Contact local authorities for guidance"
        ],

        // Settings Page
        settings: "Settings",
        back: "← Back",
        userProfile: "User Profile",
        memberSince: "Member Since",
        logout: "Logout",

        // Find Band Page
        findBandTitle: "Find My Band",
        bandStatus: "Band Status",
        finding: "Finding...",
        activatingBuzzer: "Activating buzzer...",
        buzzing: "Buzzing... ({seconds}s remaining)"
    },
    te: {
        // Landing Page
        title: "ఎకోబ్యాండ్+",
        tagline: "మీ కార్బన్ కర్మను కొలిచే వేర్బుల్",
        subtitle: "కార్యకలాప గుర్తింపు, గాలి నాణ్యత మరియు ఉష్ణోగ్రత డేటాతో సుస్థిర జీవనాన్ని ఆటగా మార్చడం",
        signUp: "సైన్ అప్",
        logIn: "లాగిన్",
        alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా?",
        dontHaveAccount: "ఖాతా లేదా?",

        // Sign Up Page
        signUpTitle: "సైన్ అప్",
        name: "పేరు",
        email: "ఇమెయిల్ చిరునామా",
        password: "పాస్వర్డ్",

        // Login Page
        loginTitle: "లాగిన్",
        forgotPassword: "పాస్వర్డ్ మర్చిపోయారా?",

        // Dashboard Page
        greenScore: "గ్రీన్ స్కోర్",
        streak: "స్ట్రీక్",
        temperature: "ఉష్ణోగ్రత",
        humidity: "తేమ",
        airQuality: "గాలి నాణ్యత",
        findMyBand: "నా బ్యాండ్ను కనుగొనండి",
        ready: "సిద్ధం",
        currentStatus: "ప్రస్తుతింని",
        safetyTips: "భద్రతా చిట్కాలు",

        // Status Messages
        good: "మంచిది",
        moderate: "మధ్యస్థం",
        poor: "పేద",
        unhealthy: "ఆరోగ్యకరం కాదు",

        // Tips
        goodTips: [
            "మంచి పనిని కొనసాగించండి!",
            "మీ పర్యావరణ అనుకూల పద్ధతులను ఇతరులతో పంచుకోండి",
            "కొత్త పర్యావరణ లక్ష్యాలను పరిగణించండి"
        ],
        moderateTips: [
            "విద్యుత్ వినియోగాన్ని తగ్గించడానికి ప్రయత్నించండి",
            "ప్రజా రవాణాను పరిగణించండి",
            "మీ రోజువారీ కార్బన్ ఫుట్‌ప్రింట్‌ను పర్యవేక్షించండి"
        ],
        poorTips: [
            "బయటి కార్యకలాపాలను పరిమితం చేయండి",
            "ఇండోర్స్‌లో ఎయిర్ ప్యూరిఫయర్‌లను ఉపయోగించండి",
            "స్థానిక గాలి నాణ్యత హెచ్చరికలను తనిఖీ చేయండి"
        ],
        unhealthyTips: [
            "సాధ్యమైతే లోపల ఉండండి",
            "బయటకు వెళ్లేటప్పుడు మాస్క్ ధరించండి",
            "మార్గదర్శకత్వం కోసం స్థానిక అధికారులను సంప్రదించండి"
        ],

        // Settings Page
        settings: "సెట్టింగ్‌లు",
        back: "← వెనుకకు",
        userProfile: "వినియోగదారు ప్రొఫైల్",
        memberSince: "సభ్యత్వం నుండి",
        logout: "లాగ్అవుట్",

        // Find Band Page
        findBandTitle: "నా బ్యాండ్ను కనుగొనండి",
        bandStatus: "బ్యాండ్ స్థితి",
        finding: "కనుగొంటోంది...",
        activatingBuzzer: "బజర్ యాక్టివేట్ అవుతోంది...",
        buzzing: "బజ్జింగ్... ({seconds}s మిగిలి ఉంది)"
    }
};

// Function to update all text content based on selected language
function updateLanguage(lang) {
    const t = translations[lang];
    
    // Add fade-out effect
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        // Update Landing Page
        document.querySelector('#landing-page h1').textContent = t.title;
        document.querySelector('#landing-page p:nth-of-type(1)').textContent = t.tagline;
        document.querySelector('#landing-page .subtitle').textContent = t.subtitle;
        document.querySelector('#landing-page .btn').textContent = t.signUp;
        document.querySelector('#landing-page .small').innerHTML = 
            `${t.alreadyHaveAccount} <a href="#" onclick="showPage('login-page')">${t.logIn}</a>`;

        // Update Sign Up Page
        document.querySelector('#signup-page h2').textContent = t.signUpTitle;
        document.querySelector('#signup-page [name="name"]').placeholder = t.name;
        document.querySelector('#signup-page [name="email"]').placeholder = t.email;
        document.querySelector('#signup-page [name="password"]').placeholder = t.password;
        document.querySelector('#signup-page button').textContent = t.signUp;
        document.querySelector('#signup-page .small').innerHTML = 
            `${t.alreadyHaveAccount} <a href="#" onclick="showPage('login-page')">${t.logIn}</a>`;

        // Update Login Page
        document.querySelector('#login-page h2').textContent = t.loginTitle;
        document.querySelector('#login-page [name="email"]').placeholder = t.email;
        document.querySelector('#login-page [name="password"]').placeholder = t.password;
        document.querySelector('#login-page button').textContent = t.logIn;
        document.querySelector('#login-page .small:first-of-type').textContent = t.forgotPassword;
        document.querySelector('#login-page .small:last-of-type').innerHTML = 
            `${t.dontHaveAccount} <a href="#" onclick="showPage('signup-page')">${t.signUp}</a>`;

        // Update Dashboard Page
        document.querySelector('#green-score-card h2').textContent = t.greenScore;
        document.querySelector('.streak span:first-child').textContent = `🔥 ${t.streak}`;
        document.querySelectorAll('.metric-card h3')[0].textContent = t.temperature;
        document.querySelectorAll('.metric-card h3')[1].textContent = t.humidity;
        document.querySelectorAll('.metric-card h3')[2].textContent = t.airQuality;
        document.querySelector('.find-band-btn').textContent = t.findMyBand;
        document.querySelector('#buzzerStatus').textContent = t.ready;
        document.querySelector('.score-info-card h3').textContent = t.currentStatus;
        document.querySelector('#safety-tips h4').textContent = t.safetyTips;

        // Update Settings Page
        document.querySelector('#settings-page h2').textContent = t.settings;
        document.querySelector('#settings-page .back-btn').textContent = t.back;
        document.querySelector('.user-details-card h3').textContent = t.userProfile;
        document.querySelector('.info-row:nth-child(1) .label').textContent = t.name;
        document.querySelector('.info-row:nth-child(2) .label').textContent = t.email;
        document.querySelector('.info-row:nth-child(3) .label').textContent = t.memberSince;
        document.querySelector('#settings-page .btn').textContent = t.logout;

        // Update Find Band Page
        document.querySelector('#find-page h2').textContent = t.findBandTitle;
        document.querySelector('#find-page .status-card h3').textContent = t.bandStatus;
        document.querySelector('#find-page #buzzerStatus').textContent = t.ready;
        document.querySelector('#find-page #buzzerBtn').textContent = t.findMyBand;

        // Add fade-in effect
        document.body.style.opacity = '1';
    }, 300);

    // Store the selected language in localStorage
    localStorage.setItem('selectedLanguage', lang);
}

// Function to change language
function changeLanguage(lang) {
    updateLanguage(lang);
}

// Initialize with the stored language preference or default to English
window.addEventListener('load', () => {
    const storedLang = localStorage.getItem('selectedLanguage') || 'en';
    document.getElementById('languageSelect').value = storedLang;
    updateLanguage(storedLang);
});

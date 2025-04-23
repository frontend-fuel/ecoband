// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    
    // Update active state of navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-btn[onclick*="'${pageId}'"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

// API endpoints
const API_URL = '/api';

// Form Handling
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch(`${API_URL}/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password')
            })
        });
        
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            showPage('dashboard-page');
        } else {
            alert(data.message || 'Signup failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });
        
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            showPage('dashboard-page');
        } else {
            alert(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Settings Page Functions
function logout() {
    localStorage.removeItem('token');
    showPage('landing-page');
}

async function loadUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        showPage('landing-page');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            document.getElementById('user-name').textContent = userData.name;
            document.getElementById('user-email').textContent = userData.email;
            document.getElementById('user-joined').textContent = new Date(userData.createdAt).toLocaleDateString();
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        alert('Failed to load user profile');
        showPage('landing-page');
    }
}

// Add event listener for settings page navigation
document.querySelector('.nav-btn[onclick="showPage(\'settings-page\')"]').addEventListener('click', loadUserProfile);

async function fetchHistoricalData(days) {
    try {
        const endDate = new Date();
        const startDate = new Date(endDate - days * 24 * 60 * 60 * 1000);
        const url = `${THINGSPEAK_URL}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        return data.feeds.map(feed => ({
            created_at: feed.created_at,
            field1: feed.field1, // Air Quality
            field2: feed.field2, // Temperature
            field3: feed.field3  // Humidity
        }));
    } catch (error) {
        console.error('Error fetching historical data:', error);
        return [];
    }
}





async function updateCharts(data) {
    const timestamps = data.map(entry => new Date(entry.created_at));
    const airQualityData = data.map(entry => parseFloat(entry.field1) || 0);
    const temperatureData = data.map(entry => parseFloat(entry.field2) || 0);
    const humidityData = data.map(entry => parseFloat(entry.field3) || 0);

    charts.airQuality.data = {
        labels: timestamps,
        datasets: [{
            label: 'Air Quality',
            data: airQualityData,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    charts.temperature.data = {
        labels: timestamps,
        datasets: [{
            label: 'Temperature',
            data: temperatureData,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
        }]
    };

    charts.humidity.data = {
        labels: timestamps,
        datasets: [{
            label: 'Humidity',
            data: humidityData,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
        }]
    };

    Object.values(charts).forEach(chart => chart.update());
}

async function updateTimeRange(days) {
    currentTimeRange = days;
    document.querySelectorAll('.range-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(days.toString())) {
            btn.classList.add('active');
        }
    });

    const data = await fetchHistoricalData(days);
    await updateCharts(data);
}

// Initialize charts when history page is shown
document.querySelector('.nav-btn:nth-child(2)').addEventListener('click', async () => {
    showPage('history-page');
    if (!charts.airQuality) {
        const data = await fetchHistoricalData(currentTimeRange);
        initializeCharts();
        await updateCharts(data);
    }
});

// ThingSpeak Configuration
const THINGSPEAK_CHANNEL_ID = '2928017';
const THINGSPEAK_API_KEY = '4VPCWH5REJ3RN21T';
const THINGSPEAK_URL = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds/last.json?api_key=${THINGSPEAK_API_KEY}`;

// Dashboard Page Functions
// Update dashboard with real-time data
async function updateDashboard() {
    try {
        const response = await fetch(THINGSPEAK_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch data from ThingSpeak');
        }
        const data = await response.json();
        
        // Update metrics
        const airQuality = parseFloat(data.field1) || 0;
        const temperature = parseFloat(data.field2) || 0;
        const humidity = parseFloat(data.field3) || 0;
        
        // Update UI
        document.getElementById('temperature').textContent = `${temperature.toFixed(1)}°C`;
        document.getElementById('humidity').textContent = `${humidity.toFixed(1)}%`;
        document.getElementById('air-quality').textContent = airQuality;
        
        // Calculate green score
        const greenScore = calculateGreenScore(temperature, humidity, airQuality);
        document.getElementById('green-score').textContent = greenScore;
        
        // Update score card appearance and avatar
        updateScoreCardAppearance(greenScore);
        
        // Update streak
        updateStreak(greenScore);
        
        // Update status and tips
        updateStatusAndTips(greenScore);
        
        // Schedule next update
        setTimeout(updateDashboard, 15000); // Update every 15 seconds
    } catch (error) {
        console.error('Error fetching data:', error);
        setTimeout(updateDashboard, 15000); // Retry after 15 seconds on error
    }
}

function updateScoreCardAppearance(score) {
    const scoreCard = document.getElementById('green-score-card');
    const avatar = document.getElementById('eco-avatar');
    
    if (score >= 80) {
        scoreCard.dataset.score = 'good';
        avatar.innerHTML = '<img src="images/good.png" alt="Good Avatar">';
    } else if (score >= 60) {
        scoreCard.dataset.score = 'moderate';
        avatar.innerHTML = '<img src="images/modrate.png" alt="Moderate Avatar">';
    } else if (score >= 40) {
        scoreCard.dataset.score = 'poor';
        avatar.innerHTML = '<img src="images/poor.png" alt="Poor Avatar">';
    } else {
        scoreCard.dataset.score = 'unhealthy';
        avatar.innerHTML = '<img src="images/unhealthy.png" alt="Unhealthy Avatar">';
    }
}

function updateStatusAndTips(score) {
    const statusLabel = document.getElementById('status-label');
    const tipsList = document.getElementById('tips-list');
    let status, tips;
    
    if (score >= 80) {
        status = 'Good';
        tips = [
            'Keep up the great work!',
            'Share your eco-friendly practices with others',
            'Consider setting new environmental goals'
        ];
    } else if (score >= 60) {
        status = 'Moderate';
        tips = [
            'Try to reduce energy consumption',
            'Consider using public transportation',
            'Monitor your daily carbon footprint'
        ];
    } else if (score >= 40) {
        status = 'Poor';
        tips = [
            'Limit outdoor activities',
            'Use air purifiers indoors',
            'Check local air quality alerts'
        ];
    } else {
        status = 'Unhealthy';
        tips = [
            'Stay indoors if possible',
            'Wear a mask when going outside',
            'Contact local authorities for guidance'
        ];
    }
    
    statusLabel.textContent = status;
    tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
}

async function updateCityData() {
    const citySelect = document.getElementById('citySelect');
    const aqiLevelIndicator = document.getElementById('aqi-level-indicator');
    const aqiWidgetContainer = document.getElementById('aqi-widget-container');
    const allWidgets = aqiWidgetContainer.querySelectorAll('div[data-aqi-widget-payload]');

    if (citySelect.value === '') {
        aqiLevelIndicator.style.display = 'block';
        aqiWidgetContainer.style.display = 'none';
    } else {
        aqiLevelIndicator.style.display = 'none';
        aqiWidgetContainer.style.display = 'block';
        
        // Hide all widgets first
        allWidgets.forEach(widget => {
            widget.style.display = 'none';
        });
        
        // Show only the selected city's widget
        const selectedWidget = Array.from(allWidgets).find(widget => {
            const payload = widget.getAttribute('data-aqi-widget-payload');
            return payload.toLowerCase().includes(citySelect.value.toLowerCase());
        });
        
        if (selectedWidget) {
            selectedWidget.style.display = 'block';
        }
    }
}

function calculateGreenScore(temperature, humidity, airQuality) {
    // Score based on ideal ranges
    let tempScore = 100 - Math.abs(temperature - 22) * 5; // Ideal temp: 22°C
    let humidityScore = 100 - Math.abs(humidity - 45) * 2; // Ideal humidity: 45%
    let airScore = airQuality;
    
    // Ensure scores are between 0 and 100
    tempScore = Math.max(0, Math.min(100, tempScore));
    humidityScore = Math.max(0, Math.min(100, humidityScore));
    airScore = Math.max(0, Math.min(100, airScore));
    
    // Calculate final score (weighted average)
    return Math.round((tempScore * 0.3 + humidityScore * 0.3 + airScore * 0.4));
}

function updateStreak(greenScore) {
    const today = new Date().toDateString();
    const lastUpdate = localStorage.getItem('lastStreakUpdate');
    
    if (greenScore >= 80) {
        if (lastUpdate !== today) {
            currentStreak = (parseInt(localStorage.getItem('currentStreak')) || 0) + 1;
            localStorage.setItem('currentStreak', currentStreak);
            document.getElementById('streak').textContent = currentStreak;
            localStorage.setItem('lastStreakUpdate', today);
        }
    } else {
        currentStreak = 0;
        localStorage.setItem('currentStreak', currentStreak);
        document.getElementById('streak').textContent = currentStreak;
    }
}

const THINGSPEAK_WRITE_API_KEY = 'QXVZ5MBXVXVWJBXE';

async function findMyBand() {
    const findButton = document.getElementById('buzzerBtn');
    const statusElement = document.getElementById('buzzerStatus');
    
    if (findButton.disabled) {
        return; // Prevent multiple clicks while buzzing
    }
    
    findButton.disabled = true;
    findButton.textContent = 'Finding...';
    findButton.classList.add('loading');
    statusElement.textContent = 'Activating buzzer...';
    statusElement.classList.add('status-active');
    
    try {
        // Send signal to ThingSpeak to turn on buzzer
        const response = await fetch(`https://api.thingspeak.com/update?api_key=REXGXHUD3G0CWGVX&field1=1`);
        
        if (!response.ok) {
            throw new Error('Failed to activate buzzer');
        }
        
        statusElement.textContent = 'Buzzing... (16s remaining)';
        
        // Start countdown timer
        let timeLeft = 16;
        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                statusElement.textContent = `Buzzing... (${timeLeft}s remaining)`;
            }
        }, 1000);
        
        // Auto turn off after 16 seconds
        await new Promise(resolve => setTimeout(resolve, 16000));
        
        clearInterval(countdownInterval);
        
        // Turn off buzzer
        const turnOffResponse = await fetch(`https://api.thingspeak.com/update?api_key=REXGXHUD3G0CWGVX&field1=0`);
        
        if (!turnOffResponse.ok) {
            throw new Error('Failed to deactivate buzzer');
        }
        
        statusElement.textContent = 'Ready';
        statusElement.classList.remove('status-active');
    } catch (error) {
        console.error('Error controlling buzzer:', error);
        statusElement.textContent = `Error: ${error.message}. Please try again.`;
        statusElement.classList.add('status-error');
    } finally {
        findButton.disabled = false;
        findButton.textContent = 'Find My Band';
        findButton.classList.remove('loading');
    }
}

// Initialize charts when page loads
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (token) {
        showPage('dashboard-page');
        updateDashboard();
        // Initialize streak
        currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
        document.getElementById('streak').textContent = currentStreak;
    } else {
        showPage('landing-page');
    }
});

let currentChartType = 'line';
let selectedMetrics = {
    temperature: true,
    humidity: true,
    airQuality: true
};

function updateChartType(type) {
    currentChartType = type;
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === type);
    });
    
    Object.values(charts).forEach(chart => {
        chart.config.type = type === 'combined' ? 'line' : type;
        chart.update();
    });
}

function toggleMetric(metric) {
    selectedMetrics[metric] = !selectedMetrics[metric];
    document.querySelector(`.chart-wrapper canvas#${metric}Chart`).parentElement.style.display = 
        selectedMetrics[metric] ? 'block' : 'none';
}


function checkGreenScore(score) {
    if (score < 20) {
        // Make a call using Twilio API
        const phoneNumber = '+919391502293'; // Include country code
        fetch('/api/twilio/call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber })
        })
        .then(response => response.json())
        .then(data => console.log('Twilio call initiated:', data))
        .catch(error => console.error('Error making Twilio call:', error));
    }
}

// Add the check whenever the green score is updated
function updateGreenScore(score) {
    document.getElementById('green-score').textContent = score;
    checkGreenScore(score);
}

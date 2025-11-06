// Initialize the chart with serene colors
const ctx = document.getElementById('myChart').getContext('2d');

// Serene color palette
const colors = {
  primary: '#6B9BD1',
  secondary: '#A8D5BA',
  accent: '#E8B4B8',
  light: '#D4E6F1',
  dark: '#5A8FB8'
};

// Initial data - Days of the week with sleep hours
let chartData = {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  datasets: [{
    label: 'Hours of Sleep',
    data: [7, 6.5, 8, 7.5, 6, 9, 8.5],
    backgroundColor: [
      'rgba(59, 130, 246, 0.6)',    // Blue
      'rgba(99, 102, 241, 0.6)',    // Indigo
      'rgba(139, 92, 246, 0.6)',    // Purple
      'rgba(14, 165, 233, 0.6)',    // Sky blue
      'rgba(20, 184, 166, 0.6)',    // Teal
      'rgba(6, 182, 212, 0.6)',     // Cyan
      'rgba(147, 51, 234, 0.6)'     // Violet
    ],
    borderColor: [
      'rgba(59, 130, 246, 1)',      // Blue
      'rgba(99, 102, 241, 1)',      // Indigo
      'rgba(139, 92, 246, 1)',      // Purple
      'rgba(14, 165, 233, 1)',      // Sky blue
      'rgba(20, 184, 166, 1)',      // Teal
      'rgba(6, 182, 212, 1)',       // Cyan
      'rgba(147, 51, 234, 1)'       // Violet
    ],
    borderWidth: 2,
    borderRadius: 8,
    borderSkipped: false,
  }]
};

// Store data for different weeks of the month
const weeklySleepData = {
  week1: [7, 6.5, 8, 7.5, 6, 9, 8.5],      // Week 1
  week2: [8, 7, 7.5, 8, 6.5, 9.5, 8],      // Week 2
  week3: [6.5, 7.5, 8.5, 7, 5.5, 10, 9],   // Week 3
  week4: [7.5, 8, 7, 8.5, 7, 8.5, 7.5]     // Week 4
};

// Track current week (0-indexed)
let currentWeekIndex = 0;
const weekKeys = ['week1', 'week2', 'week3', 'week4'];
const totalWeeks = weekKeys.length;

// Chart configuration
const config = {
  type: 'bar',
  data: chartData,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 14
          },
          color: '#2C3E50',
          padding: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2C3E50',
        bodyColor: '#2C3E50',
        borderColor: colors.primary,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: '500'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 12,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#7F8C8D',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 10,
          callback: function(value) {
            return value + ' hrs';
          }
        },
        title: {
          display: true,
          text: 'Hours',
          color: '#7F8C8D',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#7F8C8D',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 10
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  }
};

// Create the chart
let myChart = new Chart(ctx, config);

// Initialize week indicator
updateWeekIndicator();

// Update week indicator display
function updateWeekIndicator() {
  const weekIndicator = document.getElementById('weekIndicator');
  if (weekIndicator) {
    weekIndicator.textContent = `Week ${currentWeekIndex + 1} of ${totalWeeks}`;
  }
}

// Update data function - cycles through weeks of the month
function updateChartData() {
  // Move to next week (cycle back to week 1 after week 4)
  currentWeekIndex = (currentWeekIndex + 1) % totalWeeks;
  const currentWeekKey = weekKeys[currentWeekIndex];
  
  // Update chart data with the selected week's data
  chartData.datasets[0].data = [...weeklySleepData[currentWeekKey]];
  myChart.update('active');
  
  // Update week indicator
  updateWeekIndicator();
}

// Reset data function - goes back to week 1
function resetChartData() {
  currentWeekIndex = 0;
  chartData.datasets[0].data = [...weeklySleepData.week1];
  myChart.update('active');
  
  // Update week indicator
  updateWeekIndicator();
}

// Event listeners
document.getElementById('updateData').addEventListener('click', updateChartData);
document.getElementById('resetData').addEventListener('click', resetChartData);

// Attempt to load sleep data from a mocked health data file
async function loadSleepFromHealth() {
  try {
    const response = await fetch('health-sleep-sample.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch health data');
    const payload = await response.json();

    // Expecting shape: { week1: number[7], week2: number[7], week3: number[7], week4: number[7] }
    const maybeWeeks = ['week1', 'week2', 'week3', 'week4'];
    const valid = maybeWeeks.every(k => Array.isArray(payload[k]) && payload[k].length === 7 && payload[k].every(n => typeof n === 'number'));
    if (!valid) throw new Error('Invalid health data shape');

    // Update our weekly store and reset to week 1
    weeklySleepData.week1 = [...payload.week1];
    weeklySleepData.week2 = [...payload.week2];
    weeklySleepData.week3 = [...payload.week3];
    weeklySleepData.week4 = [...payload.week4];

    currentWeekIndex = 0;
    chartData.datasets[0].data = [...weeklySleepData.week1];
    myChart.update('active');
    updateWeekIndicator();

    // Optional toast via console
    console.info('Health data loaded into chart');
  } catch (err) {
    console.warn('Using built-in sample data. Health data unavailable:', err.message || err);
    // No-op; chart remains on built-in weekly data
  }
}

const connectBtn = document.getElementById('connectHealth');
if (connectBtn) {
  connectBtn.addEventListener('click', loadSleepFromHealth);
}

// Google Fit integration (backend at localhost:3001)
async function openOAuthPopup(url) {
  const w = 480, h = 640;
  const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
  const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
  window.open(url, 'googlefit_oauth', `width=${w},height=${h},left=${x},top=${y}`);
}

async function connectGoogleFit() {
  try {
    await openOAuthPopup('http://localhost:3001/auth/google');
  } catch (e) {
    console.warn('Failed to open OAuth popup', e);
  }
}

async function loadFromGoogleFit() {
  try {
    const resp = await fetch('http://localhost:3001/api/fit/sleep', { credentials: 'include' });
    if (!resp.ok) throw new Error('Not authorized or backend unavailable');
    const data = await resp.json();
    const maybeWeeks = ['week1', 'week2', 'week3', 'week4'];
    const valid = maybeWeeks.every(k => Array.isArray(data[k]) && data[k].length === 7 && data[k].every(n => typeof n === 'number'));
    if (!valid) throw new Error('Invalid payload');
    weeklySleepData.week1 = [...data.week1];
    weeklySleepData.week2 = [...data.week2];
    weeklySleepData.week3 = [...data.week3];
    weeklySleepData.week4 = [...data.week4];
    currentWeekIndex = 0;
    chartData.datasets[0].data = [...weeklySleepData.week1];
    myChart.update('active');
    updateWeekIndicator();
  } catch (e) {
    console.warn('Failed to load from Google Fit:', e?.message || e);
  }
}

const connectGoogleBtn = document.getElementById('connectGoogleFit');
if (connectGoogleBtn) connectGoogleBtn.addEventListener('click', connectGoogleFit);
const loadGoogleBtn = document.getElementById('loadGoogleFit');
if (loadGoogleBtn) loadGoogleBtn.addEventListener('click', loadFromGoogleFit);

// Sheep interaction system - 2 cute pixelated sheep following cursor
const sheepContainer = document.getElementById('sheepContainer');
let sheep1 = null;
let sheep2 = null;
let sheepAnimationFrame = null;
let isMouseInChart = false;
let mouseX = 0;
let mouseY = 0;

// Create a sheep element
function createSheep(id) {
  const sheep = document.createElement('div');
  sheep.className = 'sheep';
  sheep.id = `sheep-${id}`;
  
  // Different positions and speeds for each sheep
  if (id === 1) {
    sheep.dataset.angle = 0; // Start at top
    sheep.dataset.speed = 0.03;
    sheep.dataset.radius = 40;
  } else {
    sheep.dataset.angle = Math.PI; // Start at bottom
    sheep.dataset.speed = 0.04;
    sheep.dataset.radius = 50;
  }
  
  sheep.style.opacity = '0';
  sheepContainer.appendChild(sheep);
  
  // Fade in
  setTimeout(() => {
    sheep.style.transition = 'opacity 0.3s ease';
    sheep.style.opacity = '1';
  }, 10);
  
  return sheep;
}

// Initialize the 2 sheep
function initializeSheep() {
  if (!sheep1) {
    sheep1 = createSheep(1);
  }
  if (!sheep2) {
    sheep2 = createSheep(2);
  }
}

// Animate sheep hopping around cursor
function animateSheep() {
  if (!isMouseInChart || (!sheep1 && !sheep2)) {
    sheepAnimationFrame = null;
    return;
  }
  
  const chartRect = chartCanvas.getBoundingClientRect();
  const relativeX = mouseX - chartRect.left;
  const relativeY = mouseY - chartRect.top;
  
  // Animate sheep 1
  if (sheep1 && sheep1.parentNode) {
    let angle1 = parseFloat(sheep1.dataset.angle) + parseFloat(sheep1.dataset.speed);
    const radius1 = parseFloat(sheep1.dataset.radius);
    sheep1.dataset.angle = angle1;
    
    const offsetX1 = Math.cos(angle1) * radius1;
    const offsetY1 = Math.sin(angle1) * radius1;
    
    sheep1.style.left = (relativeX + offsetX1) + 'px';
    sheep1.style.top = (relativeY + offsetY1) + 'px';
  }
  
  // Animate sheep 2
  if (sheep2 && sheep2.parentNode) {
    let angle2 = parseFloat(sheep2.dataset.angle) + parseFloat(sheep2.dataset.speed);
    const radius2 = parseFloat(sheep2.dataset.radius);
    sheep2.dataset.angle = angle2;
    
    const offsetX2 = Math.cos(angle2) * radius2;
    const offsetY2 = Math.sin(angle2) * radius2;
    
    sheep2.style.left = (relativeX + offsetX2) + 'px';
    sheep2.style.top = (relativeY + offsetY2) + 'px';
  }
  
  sheepAnimationFrame = requestAnimationFrame(animateSheep);
}

// Clear all sheep
function clearSheep() {
  if (sheep1 && sheep1.parentNode) {
    sheep1.style.transition = 'opacity 0.3s ease';
    sheep1.style.opacity = '0';
    setTimeout(() => {
      if (sheep1 && sheep1.parentNode) {
        sheep1.remove();
        sheep1 = null;
      }
    }, 300);
  }
  if (sheep2 && sheep2.parentNode) {
    sheep2.style.transition = 'opacity 0.3s ease';
    sheep2.style.opacity = '0';
    setTimeout(() => {
      if (sheep2 && sheep2.parentNode) {
        sheep2.remove();
        sheep2 = null;
      }
    }, 300);
  }
  if (sheepAnimationFrame) {
    cancelAnimationFrame(sheepAnimationFrame);
    sheepAnimationFrame = null;
  }
}

// Chart hover event handlers
const chartCanvas = document.getElementById('myChart');
chartCanvas.style.cursor = 'pointer';

// Track mouse position and show sheep when mouse enters chart area
chartCanvas.addEventListener('mouseenter', () => {
  isMouseInChart = true;
  initializeSheep();
  if (!sheepAnimationFrame) {
    animateSheep();
  }
});

// Update mouse position and keep sheep following
chartCanvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  if (isMouseInChart && !sheepAnimationFrame) {
    animateSheep();
  }
});

// Clear sheep when mouse leaves chart area
chartCanvas.addEventListener('mouseleave', () => {
  isMouseInChart = false;
  clearSheep();
});

// Add some interactivity - change chart type on double click (optional enhancement)
let chartTypeIndex = 0;
const chartTypes = ['bar', 'line', 'radar'];
chartCanvas.addEventListener('dblclick', () => {
  chartTypeIndex = (chartTypeIndex + 1) % chartTypes.length;
  config.type = chartTypes[chartTypeIndex];
  
  // Adjust colors for line/radar charts
  if (config.type === 'line' || config.type === 'radar') {
    chartData.datasets[0].backgroundColor = 'rgba(59, 130, 246, 0.2)';
    chartData.datasets[0].borderColor = 'rgba(99, 102, 241, 1)';
    chartData.datasets[0].fill = true;
  } else {
    chartData.datasets[0].backgroundColor = [
      'rgba(59, 130, 246, 0.6)',    // Blue
      'rgba(99, 102, 241, 0.6)',    // Indigo
      'rgba(139, 92, 246, 0.6)',    // Purple
      'rgba(14, 165, 233, 0.6)',    // Sky blue
      'rgba(20, 184, 166, 0.6)',    // Teal
      'rgba(6, 182, 212, 0.6)',     // Cyan
      'rgba(147, 51, 234, 0.6)'     // Violet
    ];
    chartData.datasets[0].borderColor = [
      'rgba(59, 130, 246, 1)',      // Blue
      'rgba(99, 102, 241, 1)',      // Indigo
      'rgba(139, 92, 246, 1)',      // Purple
      'rgba(14, 165, 233, 1)',      // Sky blue
      'rgba(20, 184, 166, 1)',      // Teal
      'rgba(6, 182, 212, 1)',       // Cyan
      'rgba(147, 51, 234, 1)'       // Violet
    ];
    chartData.datasets[0].fill = false;
  }
  
  myChart.destroy();
  const newCtx = document.getElementById('myChart').getContext('2d');
  myChart = new Chart(newCtx, config);
});


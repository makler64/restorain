let currentView = 'list';
let eventsData = [];
let page = 0;
const perPage = 9;

const listView = document.getElementById('listView');
const calendarEl = document.getElementById('calendar');
const mapEl = document.getElementById('map');
let calendar, map;

async function loadEvents() {
  const res = await fetch('/.netlify/functions/afisha');
  const data = await res.json();
  eventsData = data.events || [];
  renderList();
  initCalendar();
  initMap();
}

function renderList() {
  listView.innerHTML = '';
  let items = eventsData.slice(0, (page+1)*perPage);
  items.forEach(ev => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${ev.title}</h3><p>${ev.date}</p><p>${ev.location}</p>`;
    listView.appendChild(card);
  });
}

function initCalendar() {
  if (!calendar) {
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: eventsData.map(ev => ({title: ev.title, start: ev.startDate, end: ev.endDate}))
    });
    calendar.render();
  }
}

function initMap() {
  if (!map) {
    map = L.map(mapEl).setView([43.1155, 131.8855], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    eventsData.forEach(ev => {
      if(ev.lat && ev.lng){
        L.marker([ev.lat, ev.lng]).addTo(map).bindPopup(ev.title);
      }
    });
  }
}

document.getElementById('toggleView').onclick = () => {
  document.querySelectorAll('.view').forEach(v => v.style.display='none');
  if(currentView==='list'){currentView='calendar';document.getElementById('calendarView').style.display='block';}
  else if(currentView==='calendar'){currentView='map';document.getElementById('mapView').style.display='block';}
  else {currentView='list';document.getElementById('listView').style.display='block';}
};

document.getElementById('loadMore').onclick = () => {page++; renderList();};

document.getElementById('toggleTheme').onclick = () => {
  document.body.classList.toggle('dark');
};

loadEvents();

// script.js - FULL UPDATED FILE

/***********************************************
 * Data Setup
 ***********************************************/
const samplePlacesAll = [
  { id: "c1", name: "Beachside Tacos", category: "Restaurants", image: "tacos.png" },
  { id: "c2", name: "Mayan Ruins Tour", category: "All", image: "mayan_ruins.png" },
  { id: "c3", name: "Local Handicraft Shop", category: "Shops", image: "handicraft.png" },
  { id: "c4", name: "Cancun Seafood Fest", category: "Restaurants", image: "seafood.png" },
  { id: "c5", name: "Romantic Sunset Cruise", category: "All", image: "cruise.png" },
  { id: "c6", name: "Resort Gift Shop", category: "Shops", image: "gift_shop.png" },
];

let reviews = [
  { title: "Art Gallery", text: "Amazing collection and inspiring exhibitions!" },
  { title: "Gourmet Bistro", text: "Delicious food and impeccable service." }
];

/***********************************************
 * Trip + Itinerary State
 ***********************************************/
// give your default trip at least a 3‐day window
 const today = new Date();
 const pad = (n)=>String(n).padStart(2,'0');
 const iso = d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
 let trips = [
   {
     name: "Default Trip",
     destination: "",
     startDate: iso(today),
     endDate: iso(new Date(today.getTime() + 2*24*60*60*1000)), // +2 days
     image: "",
     items: []
   }
 ];

let currentTripIndex = 0;
let selectedPlace = null;

/***********************************************
 * Global State
 ***********************************************/
let currentScreen = "homePage";
let likedItems = [];

/***********************************************
 * Screen Management
 ***********************************************/
function showScreen(screenId) {
  const screens = [
    "homePage","locationPage","searchResultsPage",
    "cancunPage1","cancunPage2","cancunPage3","cancunPage4",
    "likesPage","reviewsPage","profilePage",
    "itinerariesOverviewPage","createItineraryPage","itineraryEditPage"
  ];
  screens.forEach(id => document.getElementById(id).classList.remove("active"));
  document.querySelectorAll(".top-nav").forEach(el => el.classList.add("hidden"));
  const topMap = {
    locationPage: "topNavLocation",
    searchResultsPage: "topNavResults",
    cancunPage1: "topNavCancun",
    cancunPage2: "topNavCancun",
    cancunPage3: "topNavCancun",
    cancunPage4: "topNavCancun",
    likesPage: "topNavLikes"
  };
  if (topMap[screenId]) document.getElementById(topMap[screenId]).classList.remove("hidden");
  if (screenId === "homePage") document.getElementById("topNavHome").classList.remove("hidden");
  document.getElementById(screenId).classList.add("active");
  currentScreen = screenId;
}

/***********************************************
 * Home & Favorites
 ***********************************************/
function goHome() {
  showScreen("homePage");
  populateFavorites();
}

function populateFavorites() {
  const favsEl = document.getElementById("favoritesList");
  if (!favsEl) return;
  favsEl.innerHTML = "";
  const favs = samplePlacesAll.filter(p => likedItems.includes(p.id));
  if (!favs.length) favsEl.innerHTML = "<p>No favorites yet.</p>";
  else favs.forEach(p => favsEl.appendChild(createCard(p, true)));
}

/***********************************************
 * Location Screen
 ***********************************************/
function cancelSearch() {
  showScreen("homePage");
}

document.getElementById("locationInput")?.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    const q = e.target.value.trim().toLowerCase();
    if (q === "cancun") goToCancunPage(1);
    else alert("Please search for 'Cancun'!");
  }
});

/***********************************************
 * Cancun Pages
 ***********************************************/
function goToCancunPage(n) {
  populateCancunPages();
  showScreen(`cancunPage${n}`);
}

function populateCancunPages() {
  // All
  const a1 = document.getElementById("cancunList1");
  a1.innerHTML = "";
  samplePlacesAll.forEach(p => a1.appendChild(createCard(p, true)));
  // Fav
  const a2 = document.getElementById("cancunList2");
  a2.innerHTML = "";
  const favs = samplePlacesAll.filter(p => likedItems.includes(p.id));
  a2.innerHTML = !favs.length ? "<p>No likes yet.</p>" : "";
  favs.forEach(p => a2.appendChild(createCard(p, true)));
  // Restaurants
  const a3 = document.getElementById("cancunList3");
  a3.innerHTML = "";
  samplePlacesAll.filter(p => p.category==="Restaurants")
    .forEach(p => a3.appendChild(createCard(p, true)));
  // Shops
  const a4 = document.getElementById("cancunList4");
  a4.innerHTML = "";
  samplePlacesAll.filter(p => p.category==="Shops")
    .forEach(p => a4.appendChild(createCard(p, true)));
}

/***********************************************
 * Card Creation
 ***********************************************/
function createCard(place, showItinBtn = false, itineraryView = false) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = place.image || "https://via.placeholder.com/60";
  card.appendChild(img);

  const info = document.createElement("div");
  info.className = "card-info";
  const name = document.createElement("p");
  name.innerText = place.name;
  const cat = document.createElement("p");
  cat.innerText = place.category;
  info.append(name, cat);
  card.appendChild(info);

  const likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.innerText = likedItems.includes(place.id) ? "♥" : "♡";
  likeBtn.onclick = () => toggleLike(place.id, likeBtn);
  card.appendChild(likeBtn);

  if (showItinBtn) {
    if (itineraryView) {
      // ↓ add a drag‑handle instead of whole card ↓
    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.innerHTML = "☰";
    card.appendChild(handle);
    handle.draggable = true;
    handle.addEventListener("dragstart", e => 
      e.dataTransfer.setData("text/plain", place.id)
    );
      const rm = document.createElement("button");
      rm.className = "itinerary-btn remove-btn";
      rm.innerText = "Remove";
      rm.onclick = () => {
        trips[currentTripIndex].items =
          trips[currentTripIndex].items.filter(i => i.id !== place.id);
        renderItinerary();
      };
      card.appendChild(rm);
    } else {
      const itinBtn = document.createElement("button");
      itinBtn.className = "itinerary-btn";
      itinBtn.innerText = "Add to Itinerary";
      itinBtn.onclick = () => addToItinerary(place);
      card.appendChild(itinBtn);
    }
  }
  return card;
}

/***********************************************
 * Like Toggling
 ***********************************************/
function toggleLike(id, btn) {
  if (likedItems.includes(id)) {
    likedItems = likedItems.filter(x => x!==id);
    btn.innerText = "♡";
  } else {
    likedItems.push(id);
    btn.innerText = "♥";
  }
  if (currentScreen === "cancunPage2") populateCancunPages();
  if (currentScreen === "likesPage") renderLikesPage();
}

/***********************************************
 * Likes Screen
 ***********************************************/
function goToLikes() {
  showScreen("likesPage");
  renderLikesPage();
}

function renderLikesPage() {
  const el = document.getElementById("likesList");
  el.innerHTML = "";
  if (!likedItems.length) {
    el.innerHTML = "<p>No likes yet.</p>";
    return;
  }
  samplePlacesAll
    .filter(p => likedItems.includes(p.id))
    .forEach(p => el.appendChild(createCard(p, true)));
}

/***********************************************
 * Reviews
 ***********************************************/
function goToReviews() {
  showScreen("reviewsPage");
  renderReviews();
}

function renderReviews() {
  const list = document.getElementById("reviewList");
  list.innerHTML = "";
  reviews.forEach((r,i) => {
    const div = document.createElement("div");
    div.className = "review-card";
    const img = document.createElement("img");
    img.className = "review-icon";
    img.src = "https://img.icons8.com/ios-filled/50/000000/museum.png";
    const info = document.createElement("div");
    info.className = "review-info";
    const t = document.createElement("h3"); t.innerText = r.title;
    const txt = document.createElement("p"); txt.innerText = r.text;
    info.append(t, txt);
    const del = document.createElement("button");
    del.className = "delete-review-btn";
    del.innerText = "Delete";
    del.onclick = () => { reviews.splice(i,1); renderReviews(); };
    div.append(img, info, del);
    list.append(div);
  });
}

function addReview() {
  const t = document.getElementById("reviewTitle").value.trim();
  const txt = document.getElementById("reviewText").value.trim();
  if (!t||!txt) { alert("Please enter both title and text."); return; }
  reviews.push({ title:t, text:txt });
  renderReviews();
}

/***********************************************
 * Profile
 ***********************************************/
function goToProfile() {
  showScreen("profilePage");
}

/***********************************************
 * Itineraries Overview
 ***********************************************/
function goToOverview() {
  showScreen("itinerariesOverviewPage");
  populateOverview();
}

function populateOverview() {
  const up = document.getElementById("upcomingItinerariesList");
  const past = document.getElementById("pastItinerariesList");
  up.innerHTML = ""; past.innerHTML = "";
  const today = new Date();
  trips.forEach((trip,i) => {
    const card = document.createElement("div");
    card.className = "itinerary-overview-card";
    const img = document.createElement("img");
    img.src = trip.image || "https://via.placeholder.com/80x60?text=Trip";
    const h4 = document.createElement("h4");
    h4.innerText = trip.name;
    const p = document.createElement("p");
    p.innerText = trip.startDate && trip.endDate 
      ? `${trip.startDate} – ${trip.endDate}` : "";
    card.append(img,h4,p);
    card.onclick = () => openEditItinerary(i);
    const e = trip.endDate ? new Date(trip.endDate) : null;
    if (e && e < today) past.append(card);
    else up.append(card);
  });
}

/***********************************************
 * Create Itinerary
 ***********************************************/
function goToCreateItinerary() {
  showScreen("createItineraryPage");
}

function createItinerary() {
  const name = document.getElementById("newItineraryName").value.trim();
  const dest = document.getElementById("newItineraryDestination").value.trim();
  const start = document.getElementById("newItineraryStart").value;
  const end = document.getElementById("newItineraryEnd").value;
  const img  = document.getElementById("newItineraryImage").value.trim();
  if (!name||!dest||!start||!end) {
    alert("Fill in all fields."); return;
  }
  trips.push({
    name, destination:dest,
    startDate:start, endDate:end,
    image: img, items: []
  });
  openEditItinerary(trips.length-1);
}

function cancelCreateItinerary() {
  goToOverview();
}

/***********************************************
 * Edit Itinerary & Drag/Drop
 ***********************************************/
function openEditItinerary(idx) {
  currentTripIndex = idx;
  document.getElementById("editItineraryTitle").innerText = trips[idx].name;
  showScreen("itineraryEditPage");
  renderItinerary();
}

function renderItinerary() {
  const grid = document.getElementById("calendarGrid");
  const unsch = document.getElementById("unscheduledList");
  grid.innerHTML = ""; unsch.innerHTML = "";
  const trip = trips[currentTripIndex];

  // Unscheduled
  const uns = trip.items.filter(i => !i.time);
  if (!uns.length) unsch.innerHTML = "<p>No unscheduled items.</p>";
  else uns.forEach(it => {
    const c = createCard(it,true,true);
    unsch.append(c);
  });

  // Calendar
  // 1) show all 24 hours
  const hours = Array.from({length:24},(_,i) => i);

  // 2) compute only the days between this trip's start & end dates
  const start = new Date(trips[currentTripIndex].startDate);
  const end   = new Date(trips[currentTripIndex].endDate);
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
    days.push(dayNames[d.getDay()]);
  }

  // 3) make the grid exactly N columns (1 gutter + your #days)
  grid.style.gridTemplateColumns = `50px repeat(${days.length},1fr)`;

  // Header row
  grid.appendChild(document.createElement("div"));
  days.forEach(d=>{
    const hd=document.createElement("div");
    hd.className="calendar-hour"; hd.innerText=d;
    grid.appendChild(hd);
  });

  // hour rows + droppable cells
  hours.forEach(h=>{
    const gutter=document.createElement("div");
    gutter.className="calendar-hour";
    gutter.innerText = h.toString().padStart(2,"0") + ":00";
    grid.appendChild(gutter);

    days.forEach(day=>{
      const cell=document.createElement("div");
      cell.className="calendar-cell";
      cell.dataset.day = day;
      cell.dataset.hour = h;
      cell.addEventListener("dragover",e=>e.preventDefault());
      cell.addEventListener("drop",e=>{
        const pid=e.dataTransfer.getData("text/plain");
        handleDrop(pid, day, h);
      });
      grid.appendChild(cell);
    });
  });

  // place scheduled events
  trip.items.filter(i=>i.time).forEach(it=>{
    const dayIdx = days.indexOf(it.day);
    const hourIdx = parseInt(it.time.split(":")[0]);
    if (dayIdx >= 0 && hourIdx >= 0 && hourIdx < hours.length) {
      const cellIndex = (1 + hourIdx) * days.length + dayIdx; // skip header row
      const cell = grid.querySelectorAll(".calendar-cell")[cellIndex];
      if (!cell) return;
  
      const ev = document.createElement("div");
      ev.className = "calendar-event";
      ev.innerText = it.name;
      ev.draggable = true;
      ev.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", it.id));
  
      const handle = document.createElement("span");
      handle.className = "drag-handle";
      handle.innerHTML = "☰";
      ev.prepend(handle);
      handle.draggable = true;
      handle.addEventListener("dragstart", e =>
        e.dataTransfer.setData("text/plain", it.id)
      );
  
      ev.style.height = `${(it.duration || 1) * 41}px`; // 40px + 1px gap per hour
      ev.addEventListener("mouseup", () => {
        const slots = Math.max(1, Math.round(ev.offsetHeight / 41));
        it.duration = slots;
        ev.style.height = `${slots * 41}px`;
      });
  
      cell.appendChild(ev);
    }
  });
  
}

function handleDrop(placeId, day, hour) {
  const arr = trips[currentTripIndex].items;
  const uns = arr.find(i=>i.id===placeId && !i.time);
  if (uns) {
    uns.day = day;
    uns.time = `${hour}:00`;
  } else {
    const sch=arr.find(i=>i.id===placeId && i.time);
    if (sch) {
      sch.day = day;
      sch.time = `${hour}:00`;
    }
  }
  renderItinerary();
}

/***********************************************
 * Add to Itinerary Modal
 ***********************************************/
function addToItinerary(place) {
  selectedPlace = place;
  const sel = document.getElementById("tripSelectModal");
  sel.innerHTML="";
  trips.forEach((t,i)=>{
    const o=document.createElement("option");
    o.value=i; o.innerText=t.name;
    sel.append(o);
  });
  document.getElementById("itinerarySelectModal").classList.remove("hidden");
}

function confirmAddToItinerary() {
  const idx = parseInt(document.getElementById("tripSelectModal").value);
  trips[idx].items.push({...selectedPlace});

  // Update the "Add to Itinerary" button text if it's still in the DOM
  document.querySelectorAll(".itinerary-btn").forEach(btn => {
    if (btn.closest(".card")?.querySelector(".card-info p")?.innerText === selectedPlace.name) {
      btn.innerText = "Added";
      btn.disabled = true;
      btn.style.background = "#aaa"; // optional visual feedback
    }
  });

  closeItineraryModal();
  if (currentScreen==="itineraryEditPage" && idx===currentTripIndex) renderItinerary();
}

function closeItineraryModal() {
  document.getElementById("itinerarySelectModal").classList.add("hidden");
  selectedPlace = null;
}

// Initial call
showScreen("homePage");

// script.js - FULL UPDATED FILE

/***********************************************
 * Data Setup
 ***********************************************/
const samplePlacesAll = [
  { id: "c1", name: "Beachside Tacos", category: "Restaurants", image: "tacos.png", open: 16, close: 20 },
  { id: "c2", name: "Mayan Ruins Tour", category: "All", image: "mayan_ruins.png", open: 8, close: 19 },
  { id: "c3", name: "Local Handicraft Shop", category: "Shops", image: "handicraft.png" },
  { id: "c4", name: "Cancun Seafood Fest", category: "Restaurants", image: "seafood.png", open: 16, close: 20 },
  { id: "c5", name: "Romantic Sunset Cruise", category: "All", image: "cruise.png", open: 18, close: 22 },
  { id: "c6", name: "Resort Gift Shop", category: "Shops", image: "gift_shop.png" },
];

let reviews = [
  { title: "Art Gallery", text: "Amazing collection and inspiring exhibitions!" },
  { title: "Gourmet Bistro", text: "Delicious food and impeccable service." }
];

/***********************************************
 * Auth State
 ***********************************************/
let isLoggedIn = false;

/***********************************************
 * Screen Management
 ***********************************************/
let currentScreen = "";

function showScreen(screenId) {
  // allow unauthenticated access only to login & signup
  if (!isLoggedIn && screenId !== "loginPage" && screenId !== "signUpPage") {
    screenId = "loginPage";
  }

  const screens = [
    "loginPage", "signUpPage",
    "homePage","locationPage","searchResultsPage",
    "cancunPage1","cancunPage2","cancunPage3","cancunPage4",
    "likesPage","reviewsPage","profilePage",
    "itinerariesOverviewPage","createItineraryPage","itineraryEditPage"
  ];
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });
  document.querySelectorAll(".top-nav").forEach(el => el.classList.add("hidden"));

  const topMap = {
    locationPage:      "topNavLocation",
    searchResultsPage: "topNavResults",
    cancunPage1:       "topNavCancun",
    cancunPage2:       "topNavCancun",
    cancunPage3:       "topNavCancun",
    cancunPage4:       "topNavCancun",
    likesPage:         "topNavLikes"
  };
  if (topMap[screenId]) {
    document.getElementById(topMap[screenId]).classList.remove("hidden");
  }
  if (screenId === "homePage") {
    document.getElementById("topNavHome").classList.remove("hidden");
  }

  const target = document.getElementById(screenId);
  if (target) target.classList.add("active");
  currentScreen = screenId;
}

/***********************************************
 * Trip + Itinerary State
 ***********************************************/
const today = new Date();
const pad   = n => String(n).padStart(2, "0");
const iso   = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

let trips = [
  {
    name: "Puerto Rico",
    destination: "",
    startDate: iso(today),
    endDate:   iso(new Date(today.getTime() + 2*24*60*60*1000)), // +2 days
    image: "",
    items: []
  }
];
let currentTripIndex = 0;
let selectedPlace    = null;

/***********************************************
 * Global State
 ***********************************************/
let likedItems = [];

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
  // Favorites
  const a2 = document.getElementById("cancunList2");
  a2.innerHTML = "";
  const favs = samplePlacesAll.filter(p => likedItems.includes(p.id));
  a2.innerHTML = !favs.length ? "<p>No likes yet.</p>" : "";
  favs.forEach(p => a2.appendChild(createCard(p, true)));
  // Restaurants
  const a3 = document.getElementById("cancunList3");
  a3.innerHTML = "";
  samplePlacesAll.filter(p => p.category === "Restaurants")
                 .forEach(p => a3.appendChild(createCard(p, true)));
  // Shops
  const a4 = document.getElementById("cancunList4");
  a4.innerHTML = "";
  samplePlacesAll.filter(p => p.category === "Shops")
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
  const cat  = document.createElement("p");
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
    likedItems = likedItems.filter(x => x !== id);
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
  reviews.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "review-card";

    const img = document.createElement("img");
    img.className = "review-icon";
    img.src = "https://img.icons8.com/ios-filled/50/000000/museum.png";

    const info = document.createElement("div");
    info.className = "review-info";
    const t   = document.createElement("h3"); t.innerText = r.title;
    const txt = document.createElement("p");  txt.innerText = r.text;
    info.append(t, txt);

    const del = document.createElement("button");
    del.className = "delete-review-btn";
    del.innerText = "Delete";
    del.onclick = () => { reviews.splice(i, 1); renderReviews(); };

    div.append(img, info, del);
    list.append(div);
  });
}

function addReview() {
  const t   = document.getElementById("reviewTitle").value.trim();
  const txt = document.getElementById("reviewText").value.trim();
  if (!t || !txt) {
    alert("Please enter both title and text.");
    return;
  }
  reviews.push({ title: t, text: txt });
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
  const up   = document.getElementById("upcomingItinerariesList");
  const past = document.getElementById("pastItinerariesList");
  up.innerHTML = ""; past.innerHTML = "";
  const now = new Date();

  trips.forEach((trip, i) => {
    const card = document.createElement("div");
    card.className = "itinerary-overview-card";

    const img = document.createElement("img");
    img.src = trip.image || "https://via.placeholder.com/80x60?text=Trip";

    const h4 = document.createElement("h4");
    h4.innerText = trip.name;

    const p = document.createElement("p");
    p.innerText = trip.startDate && trip.endDate
      ? `${trip.startDate} – ${trip.endDate}` : "";

    card.append(img, h4, p);
    card.onclick = () => openEditItinerary(i);

    const eDate = trip.endDate ? new Date(trip.endDate) : null;
    if (eDate && eDate < now) past.append(card);
    else up.append(card);
  });

  // 👇 Append the "Add Itinerary" card at the end
  const addCard = document.createElement("div");
  addCard.className = "itinerary-overview-card add-card";
  addCard.onclick = goToCreateItinerary;

  const plus = document.createElement("span");
  plus.className = "plus";
  plus.innerText = "+";

  const label = document.createElement("span");
  label.innerText = "Add Itinerary";

  addCard.append(plus, label);
  up.appendChild(addCard);
}

/***********************************************
 * Create Itinerary
 ***********************************************/
function goToCreateItinerary() {
  showScreen("createItineraryPage");
}

function createItinerary() {
  const name  = document.getElementById("newItineraryName").value.trim();
  const dest  = document.getElementById("newItineraryDestination").value.trim();
  const start = document.getElementById("newItineraryStart").value;
  const end   = document.getElementById("newItineraryEnd").value;
  const img   = document.getElementById("newItineraryImage").value.trim();

  if (!name || !dest || !start || !end) {
    alert("Fill in all fields.");
    return;
  }

  trips.push({
    name, destination: dest,
    startDate: start, endDate: end,
    image: img, items: []
  });
  openEditItinerary(trips.length - 1);
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

function showAlert(msg) {
  const popup = document.createElement("div");
  popup.innerText = msg;
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.background = "#ff4444";
  popup.style.color = "#fff";
  popup.style.padding = "10px 20px";
  popup.style.borderRadius = "8px";
  popup.style.zIndex = "9999";
  popup.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2500);
}

function renderItinerary() {
  const grid = document.getElementById("calendarGrid");
  const unsch= document.getElementById("unscheduledList");
  grid.innerHTML = ""; unsch.innerHTML = "";

  const trip = trips[currentTripIndex];

  // Unscheduled items
  const uns = trip.items.filter(i => !i.time);
  if (!uns.length) unsch.innerHTML = "<p>No unscheduled items.</p>";
  else uns.forEach(it => unsch.appendChild(createCard(it, true, true)));

  // Calendar setup
  const hours    = Array.from({ length: 24 }, (_, i) => i);
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const days     = [];
  for (let d = new Date(trip.startDate); d <= new Date(trip.endDate); d.setDate(d.getDate()+1)) {
    days.push(dayNames[d.getDay()]);
  }

  grid.style.gridTemplateColumns = `50px repeat(${days.length}, 1fr)`;

  // Header row
  grid.appendChild(document.createElement("div"));
  days.forEach(d => {
    const hd = document.createElement("div");
    hd.className = "calendar-hour";
    hd.innerText = d;
    grid.appendChild(hd);
  });

  // Hour rows + cells
  hours.forEach(h => {
    const gutter = document.createElement("div");
    gutter.className = "calendar-hour";
    gutter.innerText = `${String(h).padStart(2,"0")}:00`;
    grid.appendChild(gutter);

    days.forEach(day => {
      const cell = document.createElement("div");
      cell.className = "calendar-cell";
      cell.dataset.day  = day;
      cell.dataset.hour = h;
      cell.addEventListener("dragover", e => e.preventDefault());
      cell.addEventListener("drop", e => {
        const pid = e.dataTransfer.getData("text/plain");
        handleDrop(pid, day, h);
      });
      grid.appendChild(cell);
    });
  });

  // Scheduled events
  trip.items.filter(i => i.time).forEach(it => {
    const dayIdx  = days.indexOf(it.day);
    const hourIdx = parseInt(it.time.split(":")[0], 10);
    if (dayIdx < 0 || hourIdx < 0 || hourIdx >= hours.length) return;

    const cellIndex = (1 + hourIdx) * days.length + dayIdx;
    const cell = grid.querySelectorAll(".calendar-cell")[cellIndex];
    if (!cell) return;

    const ev = document.createElement("div");
    ev.className = "calendar-event";
    ev.innerText = it.name;
    ev.draggable = true;
    ev.addEventListener("dragstart", e =>
      e.dataTransfer.setData("text/plain", it.id)
    );

    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.innerHTML = "☰";
    ev.prepend(handle);
    handle.draggable = true;
    handle.addEventListener("dragstart", e =>
      e.dataTransfer.setData("text/plain", it.id)
    );

    ev.style.height = `${(it.duration || 1) * 41}px`;
    ev.addEventListener("mouseup", () => {
      const slots = Math.max(1, Math.round(ev.offsetHeight / 41));
      it.duration = slots;
      ev.style.height = `${slots * 41}px`;
    });

    cell.appendChild(ev);
  });

  // === Smart Suggestion: Location Optimization ===
  const mustHaveIds = ["c2", "c1", "c3"]; // Mayan Ruins, Beachside Tacos, Handicraft Shop
  const dayToItems = {};

  trip.items.forEach(item => {
    if (!item.time || !item.day) return;
    if (!dayToItems[item.day]) dayToItems[item.day] = [];
    dayToItems[item.day].push(item);
  });

  days.forEach((day, dayIndex) => {
    const itemsToday = dayToItems[day] || [];
    const matched = itemsToday.filter(it => mustHaveIds.includes(it.id));
    if (matched.length !== 3) return;

    const correctOrder = ["c2", "c1", "c3"];
    const matchedSorted = matched.slice().sort((a, b) =>
      parseInt(a.time.split(":")[0], 10) - parseInt(b.time.split(":")[0], 10)
    );
    const matchedIds = matchedSorted.map(item => item.id);
    
    // Check if matchedIds are in the correct order
    const isCorrectOrder = JSON.stringify(matchedIds) === JSON.stringify(correctOrder);
    
    if (isCorrectOrder) return;
    
    
      // const headerCells = grid.querySelectorAll(".calendar-hour");
      // const headerCell  = headerCells[1 + dayIndex]; // 0 is the blank corner
    const headerCell = grid.children[1 + dayIndex];
    headerCell.style.background = "#ffdddd";
    const alertSpan = document.createElement("span");
    alertSpan.innerText = "❗ Unoptimized route";
    alertSpan.style.color = "#cc0000";
    alertSpan.style.fontSize = "10px";
    alertSpan.style.display = "block";
    alertSpan.style.marginTop = "1px";  // less spacing
    alertSpan.style.lineHeight = "0.8";

    headerCell.appendChild(alertSpan);
    const btn = document.createElement("button");
    btn.innerText = "Optimize Now";
    Object.assign(btn.style, {
      background: "#cc0000",
      color: "#fff",
      border: "none",
      padding: "2px 6px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "4px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
    });
    btn.onclick = () => {
      const baseHour = Math.min(...matched.map(x => parseInt(x.time)));
      const sorted = mustHaveIds.map(id => matched.find(x => x.id === id));
      sorted.forEach((ev, i) => {
        ev.time = `${baseHour + i}:00`;
        ev.day = day;
      });
      renderItinerary();
    };
    headerCell.appendChild(btn);
  });

}

function handleDrop(placeId, day, hour) {
  const tripItems = trips[currentTripIndex].items;
  const place = samplePlacesAll.find(p => p.id === placeId);
  const item = tripItems.find(i => i.id === placeId);

  if (!place || !item) return;

  const openHour = place.open ?? 0;
  const closeHour = place.close ?? 24;

  if (hour < openHour || hour >= closeHour) {
    showAlert(`"${place.name}" is only open from ${openHour}:00 to ${closeHour}:00`);
    return;
  }

  item.day = day;
  item.time = `${hour}:00`;

  renderItinerary();
}


/***********************************************
 * Add to Itinerary Modal
 ***********************************************/
function addToItinerary(place) {
  selectedPlace = place;
  const sel = document.getElementById("tripSelectModal");
  sel.innerHTML = "";
  trips.forEach((t, i) => {
    const o = document.createElement("option");
    o.value = i; o.innerText = t.name;
    sel.append(o);
  });
  document.getElementById("itinerarySelectModal").classList.remove("hidden");
}

function confirmAddToItinerary() {
  const idx = parseInt(document.getElementById("tripSelectModal").value, 10);
  trips[idx].items.push({ ...selectedPlace });

  document.querySelectorAll(".itinerary-btn").forEach(btn => {
    if (btn.closest(".card")
        ?.querySelector(".card-info p")
        ?.innerText === selectedPlace.name) {
      btn.innerText = "Added";
      btn.disabled  = true;
      btn.style.background = "#aaa";
    }
  });

  closeItineraryModal();
  if (currentScreen === "itineraryEditPage" && idx === currentTripIndex) {
    renderItinerary();
  }
}

function closeItineraryModal() {
  document.getElementById("itinerarySelectModal").classList.add("hidden");
  selectedPlace = null;
}
/***********************************************
 * Invite Friends
 ***********************************************/
const allFriends = [
  { id: 1, name: "Alice Johnson", image: "https://i.pravatar.cc/36?u=1" },
  { id: 2, name: "Bob Smith", image: "https://i.pravatar.cc/36?u=2" },
  { id: 3, name: "Charlie Lee", image: "https://i.pravatar.cc/36?u=3" },
  { id: 4, name: "Diana Chen", image: "https://i.pravatar.cc/36?u=4" },
];

let invitedFriends = []; // [{ id, name, status: "pending" | "accepted" }]

function openInviteModal() {
  document.getElementById("inviteModal").classList.remove("hidden");
  renderFriendList();
}

function closeInviteModal() {
  document.getElementById("inviteModal").classList.add("hidden");
  document.getElementById("friendSearch").value = "";
  renderFriendList();
}

function renderFriendList() {
  const list = document.getElementById("friendList");
  const search = document.getElementById("friendSearch").value.toLowerCase();
  list.innerHTML = "";

  allFriends.forEach(friend => {
    if (!friend.name.toLowerCase().includes(search)) return;

    const entry = document.createElement("div");
    entry.className = "friend-entry";

    const img = document.createElement("img");
    img.src = friend.image;

    const label = document.createElement("label");
    label.innerText = friend.name;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = friend.id;
    checkbox.addEventListener("change", updateInviteButton);

    entry.append(img, label, checkbox);
    list.appendChild(entry);
  });

  updateInviteButton();
}

function updateInviteButton() {
  const anyChecked = [...document.querySelectorAll("#friendList input[type='checkbox']")]
    .some(box => box.checked);
  document.getElementById("inviteButton").disabled = !anyChecked;
}

function inviteSelectedFriends() {
  const selected = [...document.querySelectorAll("#friendList input[type='checkbox']")]
    .filter(box => box.checked)
    .map(box => parseInt(box.value));

  const newInvites = allFriends
    .filter(f => selected.includes(f.id))
    .filter(f => !invitedFriends.find(i => i.id === f.id))
    .map(f => ({ ...f, status: "pending" }));

  invitedFriends.push(...newInvites);

  closeInviteModal();
  renderInvitedStatus();
}

function renderInvitedStatus() {
  const container = document.getElementById("invitedStatusContainer");
  container.innerHTML = "";

  if (!invitedFriends.length) return;

  const heading = document.createElement("h4");
  heading.innerText = "Shared with:";
  container.appendChild(heading);

  invitedFriends.forEach(f => {
    const tag = document.createElement("div");
    tag.className = "invited-tag";
    tag.innerText = `${f.name} – ${f.status}`;
    container.appendChild(tag);
  });
}

function filterFriends() {
  renderFriendList();
}

/***********************************************
 * Persistent Users via localStorage
 ***********************************************/
const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(storedUsers));
}

/***********************************************
 * Auth Handling
 ***********************************************/
function handleSignUp() {
  const user = document.getElementById("signUpUsername").value.trim();
  const pw   = document.getElementById("signUpPassword").value.trim();
  const pw2  = document.getElementById("signUpPassword2").value.trim();

  if (!user || !pw || !pw2) {
    alert("Please fill in all fields.");
    return;
  }
  if (pw !== pw2) {
    alert("Passwords do not match.");
    return;
  }
  if (storedUsers[user]) {
    alert("Username already exists.");
    return;
  }

  storedUsers[user] = pw;
  saveUsers();
  alert("Account created! You can now log in.");
  showScreen("loginPage");
}

function handleLogin() {
  const user = document.getElementById("loginUsername").value.trim();
  const pw   = document.getElementById("loginPassword").value.trim();

  if (!user || !pw) {
    alert("Please enter both username and password.");
    return;
  }
  if (storedUsers[user] === pw) {
    isLoggedIn = true;
    clearLoginInputs();
    goHome();
  } else {
    alert("Invalid credentials.");
  }
}

function clearLoginInputs() {
  ["loginUsername","loginPassword","signUpUsername","signUpPassword","signUpPassword2"]
    .forEach(id => document.getElementById(id).value = "");
}

function handleLogout() {
  isLoggedIn = false;
  showScreen("loginPage");
}

/***********************************************
 * Initial Load
 ***********************************************/
showScreen("loginPage");
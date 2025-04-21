// script.js - FULL FILE with Schedule Support

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
let trips = [
  { name: "Default Trip", items: [] }
];
let currentTripIndex = 0;
let selectedPlace = null;  // for scheduling


/***********************************************
 * Global State
 ***********************************************/
// let currentScreen = "homePage";
// let likedItems = [];
// let itineraryItems = [];
// let selectedPlace = null;
let currentScreen = "homePage";
let likedItems = [];

/***********************************************
 * Screen Management
 ***********************************************/
function showScreen(screenId) {
  const screens = ["homePage", "locationPage", "searchResultsPage", "cancunPage1", "cancunPage2", "cancunPage3", "cancunPage4", "likesPage", "itineraryPage", "reviewsPage", "profilePage"];
  screens.forEach((id) => document.getElementById(id).classList.remove("active"));
  document.getElementById("topNavLocation").classList.add("hidden");
  document.getElementById("topNavCancun").classList.add("hidden");
  document.getElementById("topNavLikes").classList.add("hidden");
  document.getElementById("topNavResults").classList.add("hidden");
  document.getElementById(screenId).classList.add("active");
  if (screenId === "locationPage") document.getElementById("topNavLocation").classList.remove("hidden");
  else if (screenId === "searchResultsPage") document.getElementById("topNavResults").classList.remove("hidden");
  else if (screenId.startsWith("cancunPage")) document.getElementById("topNavCancun").classList.remove("hidden");
  else if (screenId === "likesPage") document.getElementById("topNavLikes").classList.remove("hidden");
  currentScreen = screenId;
}

function goHome() {
  showScreen("homePage");
  populateFavorites();
}

function populateFavorites() {
  const favoritesList = document.getElementById("favoritesList");
  if (!favoritesList) return;
  favoritesList.innerHTML = "";
  const favs = samplePlacesAll.filter((place) => likedItems.includes(place.id));
  if (favs.length === 0) favoritesList.innerHTML = "<p>No favorites yet.</p>";
  else favs.forEach((place) => favoritesList.appendChild(createCard(place, true)));
}

/***********************************************
 * Location Screen Functions
 ***********************************************/
function cancelSearch() {
  showScreen("homePage");
}

const locationInput = document.getElementById("locationInput");
if (locationInput) {
  locationInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      const query = e.target.value.trim().toLowerCase();
      if (query === "cancun") goToCancunPage(1);
      else alert("Please search for 'Cancun' to see sample data!");
    }
  });
}

/***********************************************
 * Cancun Pages Functions
 ***********************************************/
function goToCancunPage(pageNum) {
  populateCancunPages();
  showScreen(`cancunPage${pageNum}`);
}

function populateCancunPages() {
  const listAll = document.getElementById("cancunList1");
  listAll.innerHTML = "";
  samplePlacesAll.forEach(place => listAll.appendChild(createCard(place, true)));

  const listFav = document.getElementById("cancunList2");
  listFav.innerHTML = "";
  const favPlaces = samplePlacesAll.filter(p => likedItems.includes(p.id));
  listFav.innerHTML = favPlaces.length === 0 ? "<p>You haven't liked anything yet.</p>" : "";
  favPlaces.forEach(place => listFav.appendChild(createCard(place, true)));

  const listRest = document.getElementById("cancunList3");
  listRest.innerHTML = "";
  const restPlaces = samplePlacesAll.filter(p => p.category === "Restaurants");
  restPlaces.forEach(place => listRest.appendChild(createCard(place, true)));

  const listShops = document.getElementById("cancunList4");
  listShops.innerHTML = "";
  const shopPlaces = samplePlacesAll.filter(p => p.category === "Shops");
  shopPlaces.forEach(place => listShops.appendChild(createCard(place, true)));
}

/***********************************************
 * Card Creation
 ***********************************************/
function createCard(place, showItineraryBtn = true, itineraryView = false) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = place.image;

  const infoDiv = document.createElement("div");
  infoDiv.className = "card-info";

  const nameP = document.createElement("p");
  nameP.innerText = place.name;

  const catP = document.createElement("p");
  catP.innerText = place.category;

  infoDiv.appendChild(nameP);
  infoDiv.appendChild(catP);

  const likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.innerText = likedItems.includes(place.id) ? "♥" : "♡";
  likeBtn.onclick = () => toggleLike(place.id, likeBtn);

  card.appendChild(img);
  card.appendChild(infoDiv);
  card.appendChild(likeBtn);

  if (showItineraryBtn) {
    if (itineraryView) {
      const removeBtn = document.createElement("button");
      removeBtn.className = "itinerary-btn remove-btn";
      removeBtn.innerText = "Remove";
      removeBtn.onclick = () => removeFromItinerary(place);
      card.appendChild(removeBtn);
    } else {
      const itineraryBtn = document.createElement("button");
      itineraryBtn.className = "itinerary-btn";
      itineraryBtn.innerText = "Add to Itinerary";
      itineraryBtn.onclick = () => addToItinerary(place);
      card.appendChild(itineraryBtn);
    }
  }

  return card;
}

/***********************************************
 * Likes Functions
 ***********************************************/
function toggleLike(placeId, btnEl) {
  if (likedItems.includes(placeId)) {
    likedItems = likedItems.filter(id => id !== placeId);
    btnEl.innerText = "♡";
  } else {
    likedItems.push(placeId);
    btnEl.innerText = "♥";
  }
  if (currentScreen === "cancunPage2") populateCancunPages();
  if (currentScreen === "likesPage") renderLikesPage();
}

/***********************************************
 * NEW: Trip Management
 ***********************************************/
function populateTripSelect() {
  const sel = document.getElementById("tripSelect");
  sel.innerHTML = "";
  trips.forEach((t,i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.innerText = t.name;
    sel.appendChild(opt);
  });
  sel.value = currentTripIndex;
}

function changeTrip() {
  currentTripIndex = parseInt(document.getElementById("tripSelect").value);
  renderItinerary();
}

function createNewTrip() {
  const name = prompt("Enter a name for your new trip:");
  if (!name) return;
  trips.push({ name, items: [] });
  currentTripIndex = trips.length - 1;
  populateTripSelect();
  renderItinerary();
}

function duplicateTrip() {
  const orig = trips[currentTripIndex];
  const copyName = orig.name + " Copy";
  const newItems = orig.items.map(it => ({ ...it }));
  trips.push({ name: copyName, items: newItems });
  currentTripIndex = trips.length - 1;
  populateTripSelect();
  renderItinerary();
}

/***********************************************
 * Itinerary Functions (upgraded)
 ***********************************************/
function addToItinerary(place) {
  selectedPlace = place;
  document.getElementById("scheduleModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("scheduleModal").classList.add("hidden");
  selectedPlace = null;
}

function confirmSchedule() {
  const day  = document.getElementById("daySelect").value;
  const time = document.getElementById("timeInput").value;
  const dur  = document.getElementById("durationInput").value;
  if (!day||!time) {
    alert("Please choose both a day and start time.");
    return;
  }
  // push into the current trip's items
  trips[currentTripIndex].items.push({
    ...selectedPlace,
    day, time, duration: parseFloat(dur)
  });
  closeModal();
  renderItinerary();
}

function removeFromItinerary(item) {
  let arr = trips[currentTripIndex].items;
  trips[currentTripIndex].items = arr.filter(i => i.id!==item.id);
  renderItinerary();
}

function goToItinerary() {
  showScreen("itineraryPage");
  populateTripSelect();
  renderItinerary();
}

function renderItinerary() {
  const grid = document.getElementById("calendarGrid");
  const unsch = document.getElementById("unscheduledList");
  grid.innerHTML = "";
  unsch.innerHTML = "";

  const trip = trips[currentTripIndex];
  document.querySelector("#itineraryPage h2").innerText = trip.name;

  // 1) Unscheduled
  const uns = trip.items.filter(i=>!i.time);
  if (uns.length===0) {
    unsch.innerHTML = "<p>No unscheduled items.</p>";
  } else {
    uns.forEach(it => {
      const card = createCard(it, true, true);
      unsch.appendChild(card);
    });
  }

  // 2) Calendar grid
  // hours 9–20 (you can adjust)
  const hours = Array.from({length:12},(_,i)=>9+i);
  // days Mon–Sun
  const days  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  // set dynamic CSS columns
  grid.style.gridTemplateColumns = `50px repeat(${days.length},1fr)`;

  // first row: blank cell + day headers
  grid.appendChild(document.createElement("div")); // corner blank
  days.forEach(d => {
    const hd = document.createElement("div");
    hd.className = "calendar-hour";
    hd.innerText = d;
    grid.appendChild(hd);
  });

  // then for each hour: first column hour label, then one cell per day
  hours.forEach(h=>{
    // hour gutter
    const gutter = document.createElement("div");
    gutter.className = "calendar-hour";
    gutter.innerText = h + ":00";
    grid.appendChild(gutter);

    days.forEach(day=>{
      const cell = document.createElement("div");
      cell.className = "calendar-cell";
      grid.appendChild(cell);
    });
  });

  // finally place events
  trip.items.filter(i=>i.time).forEach(it=>{
    const dayIdx = days.indexOf(it.day.slice(0,3)); 
    const hourIdx = parseInt(it.time.split(":")[0]) - 9;
    if (dayIdx>=0 && hourIdx>=0 && hourIdx<hours.length) {
      // calculate the grid position:
      // column = 2 + dayIdx
      // row = 2 + hourIdx
      const ev = document.createElement("div");
      ev.className = "calendar-event";
      ev.innerText = `${it.name} (${it.time})`;
      ev.style.gridColumnStart = 2 + dayIdx;
      ev.style.gridRowStart    = 2 + hourIdx;
      grid.appendChild(ev);
    }
  });
}


/***********************************************
 * Review Functions
 ***********************************************/
function goToReviews() {
  showScreen("reviewsPage");
  renderReviews();
}

function renderReviews() {
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = "";
  reviews.forEach((review, index) => {
    const reviewCard = document.createElement("div");
    reviewCard.className = "review-card";

    const icon = document.createElement("img");
    icon.className = "review-icon";
    icon.src = "https://img.icons8.com/ios-filled/50/000000/museum.png";
    icon.alt = "Review icon";

    const infoDiv = document.createElement("div");
    infoDiv.className = "review-info";

    const titleEl = document.createElement("h3");
    titleEl.innerText = review.title;

    const textEl = document.createElement("p");
    textEl.innerText = review.text;

    infoDiv.appendChild(titleEl);
    infoDiv.appendChild(textEl);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-review-btn";
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = () => deleteReview(index);

    reviewCard.appendChild(icon);
    reviewCard.appendChild(infoDiv);
    reviewCard.appendChild(deleteBtn);
    reviewList.appendChild(reviewCard);
  });
}

function deleteReview(index) {
  reviews.splice(index, 1);
  renderReviews();
}

function addReview() {
  const titleInput = document.getElementById("reviewTitle");
  const textInput = document.getElementById("reviewText");
  const title = titleInput.value.trim();
  const text = textInput.value.trim();
  if (!title || !text) {
    alert("Please enter both a title and review text.");
    return;
  }
  reviews.push({ title, text });
  alert("Review added!");
  titleInput.value = "";
  textInput.value = "";
  renderReviews();
}

/***********************************************
 * Profile
 ***********************************************/
function goToProfile() {
  showScreen("profilePage");
}

/***********************************************
 * Likes
 ***********************************************/
function goToLikes() {
  showScreen("likesPage");
  renderLikesPage();
}

function renderLikesPage() {
  const likesList = document.getElementById("likesList");
  likesList.innerHTML = "";
  if (likedItems.length === 0) {
    likesList.innerHTML = "<p>You haven't liked anything yet.</p>";
    return;
  }
  const likedPlaces = samplePlacesAll.filter(p => likedItems.includes(p.id));
  likedPlaces.forEach(place => likesList.appendChild(createCard(place, true)));
}

// Initial screen
showScreen("homePage");

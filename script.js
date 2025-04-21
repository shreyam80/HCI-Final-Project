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
 * Global State
 ***********************************************/
let currentScreen = "homePage";
let likedItems = [];
let itineraryItems = [];
let selectedPlace = null;

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
 * Itinerary Functions with Scheduling
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
  const day = document.getElementById("daySelect").value;
  const time = document.getElementById("timeInput").value;
  if (!day || !time) {
    alert("Please select both a day and time.");
    return;
  }
  itineraryItems.push({ ...selectedPlace, day, time });
  alert(`${selectedPlace.name} scheduled for ${day} at ${time}`);
  closeModal();
  renderItinerary();
}

function removeFromItinerary(place) {
  itineraryItems = itineraryItems.filter(item => item.id !== place.id);
  alert(place.name + " removed from your itinerary.");
  renderItinerary();
}

function goToItinerary() {
  showScreen("itineraryPage");
  renderItinerary();
}

function renderItinerary() {
  const calendarGrid = document.getElementById("calendarGrid");
  const unscheduledList = document.getElementById("unscheduledList");

  calendarGrid.innerHTML = "";
  unscheduledList.innerHTML = "";

  // Create calendar layout for each day
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  daysOfWeek.forEach(day => {
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    const dayHeader = document.createElement("h4");
    dayHeader.innerText = day;
    dayDiv.appendChild(dayHeader);

    // Add scheduled items
    const scheduled = itineraryItems.filter(p => p.day === day && p.time);
    scheduled.forEach(item => {
      const block = document.createElement("div");
      block.className = "calendar-event";
      block.innerText = `${item.name} (${item.time})`;
      dayDiv.appendChild(block);
    });

    calendarGrid.appendChild(dayDiv);
  });

  // Add unscheduled items
  const unscheduled = itineraryItems.filter(p => !p.time || !p.day);
  if (unscheduled.length === 0) {
    unscheduledList.innerHTML = "<p>No unscheduled experiences.</p>";
  } else {
    unscheduled.forEach(item => {
      const card = createCard(item, true, true);
      unscheduledList.appendChild(card);
    });
  }
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

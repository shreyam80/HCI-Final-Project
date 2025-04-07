/***********************************************
 * Data Setup
 ***********************************************/
const samplePlacesAll = [
    {
      id: "c1",
      name: "Beachside Tacos",
      category: "Restaurants",
      image: "tacos.png",           
    },
    {
      id: "c2",
      name: "Mayan Ruins Tour",
      category: "All",
      image: "mayan_ruins.png",    
    },
    {
      id: "c3",
      name: "Local Handicraft Shop",
      category: "Shops",
      image: "handicraft.png",     
    },
    {
      id: "c4",
      name: "Cancun Seafood Fest",
      category: "Restaurants",
      image: "seafood.png",        
    },
    {
      id: "c5",
      name: "Romantic Sunset Cruise",
      category: "All",
      image: "cruise.png",         
    },
    {
      id: "c6",
      name: "Resort Gift Shop",
      category: "Shops",
      image: "gift_shop.png",      
    },
  ];
  
  
  let reviews = [
    {
      title: "Art Gallery",
      text: "Amazing collection and inspiring exhibitions!"
    },
    {
      title: "Gourmet Bistro",
      text: "Delicious food and impeccable service."
    }
  ];
  
  /***********************************************
   * Global State
   ***********************************************/
  let currentScreen = "homePage";
  let likedItems = [];    
  let itineraryItems = [];   
  
  /***********************************************
   * Screen Management
   ***********************************************/
  function showScreen(screenId) {
    const screens = [
      "homePage",
      "locationPage",
      "searchResultsPage",
      "cancunPage1",
      "cancunPage2",
      "cancunPage3",
      "cancunPage4",
      "likesPage",
      "itineraryPage",
      "reviewsPage",
      "profilePage"
    ];
    screens.forEach((id) => {
      document.getElementById(id).classList.remove("active");
    });
    // Hide all top nav bars
    document.getElementById("topNavLocation").classList.add("hidden");
    document.getElementById("topNavCancun").classList.add("hidden");
    document.getElementById("topNavLikes").classList.add("hidden");
    document.getElementById("topNavResults").classList.add("hidden");
  
    document.getElementById(screenId).classList.add("active");
  
    if (screenId === "locationPage") {
      document.getElementById("topNavLocation").classList.remove("hidden");
    } else if (screenId === "searchResultsPage") {
      document.getElementById("topNavResults").classList.remove("hidden");
    } else if (screenId.startsWith("cancunPage")) {
      document.getElementById("topNavCancun").classList.remove("hidden");
    } else if (screenId === "likesPage") {
      document.getElementById("topNavLikes").classList.remove("hidden");
    }
    currentScreen = screenId;
  }
  
  /***********************************************
   * Home Screen Functions
   ***********************************************/
  function goHome() {
    showScreen("homePage");
    populateFavorites();
  }
  
  function populateFavorites() {
    const favoritesList = document.getElementById("favoritesList");
    if (!favoritesList) return;
    favoritesList.innerHTML = "";
    const favs = samplePlacesAll.filter((place) =>
      likedItems.includes(place.id)
    );
    if (favs.length === 0) {
      favoritesList.innerHTML = "<p>No favorites yet.</p>";
    } else {
      favs.forEach((place) => {
        favoritesList.appendChild(createCard(place, true));
      });
    }
  }
  
  /***********************************************
   * Location Screen Functions (Old Search)
   ***********************************************/
  function cancelSearch() {
    showScreen("homePage");
  }
  
  const locationInput = document.getElementById("locationInput");
  if (locationInput) {
    locationInput.addEventListener("keyup", function(e) {
      if (e.key === "Enter") {
        const query = e.target.value.trim().toLowerCase();
        if (query === "cancun") {
          goToCancunPage(1);
        } else {
          alert("Please search for 'Cancun' to see sample data!");
        }
      }
    });
  }
  
  /***********************************************
   * Cancun Pages Functions
   ***********************************************/
  function goToCancunPage(pageNum) {
    populateCancunPages();
    switch (pageNum) {
      case 1:
        showScreen("cancunPage1");
        break;
      case 2:
        showScreen("cancunPage2");
        break;
      case 3:
        showScreen("cancunPage3");
        break;
      case 4:
        showScreen("cancunPage4");
        break;
    }
  }
  
  function populateCancunPages() {
    const listAll = document.getElementById("cancunList1");
    listAll.innerHTML = "";
    samplePlacesAll.forEach(place => {
      listAll.appendChild(createCard(place, true));
    });
    const listFav = document.getElementById("cancunList2");
    listFav.innerHTML = "";
    const favPlaces = samplePlacesAll.filter(p => likedItems.includes(p.id));
    if (favPlaces.length === 0) {
      listFav.innerHTML = "<p>You haven't liked anything yet.</p>";
    } else {
      favPlaces.forEach(place => {
        listFav.appendChild(createCard(place, true));
      });
    }
    const listRest = document.getElementById("cancunList3");
    listRest.innerHTML = "";
    const restPlaces = samplePlacesAll.filter(p => p.category === "Restaurants");
    restPlaces.forEach(place => {
      listRest.appendChild(createCard(place, true));
    });
    const listShops = document.getElementById("cancunList4");
    listShops.innerHTML = "";
    const shopPlaces = samplePlacesAll.filter(p => p.category === "Shops");
    shopPlaces.forEach(place => {
      listShops.appendChild(createCard(place, true));
    });
  }
  
  /***********************************************
   * Card Creation (includes Itinerary Button)
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
        removeBtn.style.position = "absolute";
        removeBtn.onclick = () => removeFromItinerary(place);
        card.appendChild(removeBtn);
      } else {
        const itineraryBtn = document.createElement("button");
        itineraryBtn.className = "itinerary-btn";
        itineraryBtn.innerText = "Add to Itinerary";
        itineraryBtn.style.position = "absolute";
        itineraryBtn.onclick = () => addToItinerary(place);
        card.appendChild(itineraryBtn);
      }
    }
    
    return card;
  }
  
  /***********************************************
   * Toggling Likes
   ***********************************************/
  function toggleLike(placeId, btnEl) {
    if (likedItems.includes(placeId)) {
      likedItems = likedItems.filter(id => id !== placeId);
      btnEl.innerText = "♡";
    } else {
      likedItems.push(placeId);
      btnEl.innerText = "♥";
    }
    if (currentScreen === "cancunPage2") {
      populateCancunPages();
    }
    if (currentScreen === "likesPage") {
      renderLikesPage();
    }
  }
  
  /***********************************************
   * Itinerary Functions
   ***********************************************/
  function addToItinerary(place) {
    if (!itineraryItems.some(item => item.id === place.id)) {
      itineraryItems.push(place);
      alert(place.name + " added to your itinerary!");
    } else {
      alert(place.name + " is already in your itinerary.");
    }
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
    const itineraryList = document.getElementById("itineraryList");
    itineraryList.innerHTML = "";
    if (itineraryItems.length === 0) {
      itineraryList.innerHTML = "<p>Your itinerary is empty.</p>";
      return;
    }
    itineraryItems.forEach(place => {
      itineraryList.appendChild(createCard(place, true, true));
    });
  }
  
  /***********************************************
   * Reviews Functions
   ***********************************************/
  function goToReviews() {
    showScreen("reviewsPage");
    renderReviews();
  }
  
  function renderReviews() {
    const reviewList = document.getElementById("reviewList");
    reviewList.innerHTML = "";
    // Render each review with a Delete button
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
      
      // Create Delete button for each review
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
    // Remove the review at the specified index
    reviews.splice(index, 1);
    renderReviews();
  }
  
  /***********************************************
   * Add Review Functionality
   ***********************************************/
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
   * Profile Functions
   ***********************************************/
  function goToProfile() {
    showScreen("profilePage");
    renderProfile();
  }
  
  /***********************************************
   * Likes Page Functions
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
    likedPlaces.forEach(place => {
      likesList.appendChild(createCard(place, true));
    });
  }
  
  showScreen("homePage");
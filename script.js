const navMap = {
  'Home': 'index.html',
  'My Likes': 'likes.html',
  'Itinerary': 'itinerary.html',
  'Reviews': 'reviews.html',
  'Profile': 'profile.html'
};

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.nav-label')?.textContent?.trim();
      const targetPage = navMap[label];
      if (targetPage && !window.location.href.endsWith(targetPage)) {
        window.location.href = targetPage;
      }
    });
  });
});
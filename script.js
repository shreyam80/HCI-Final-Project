// script.js

// Mapping of navigation icons to corresponding pages
const navMap = {
    '🏠': 'index.html',
    '❤️': 'likes.html',
    '🗓️': 'itinerary.html',
    '📝': 'reviews.html',
    '👤': 'profile.html'
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const emoji = item.textContent.trim();
        const targetPage = navMap[emoji];
        
        if (targetPage && !window.location.href.endsWith(targetPage)) {
          window.location.href = targetPage;
        }
      });
    });
  });
  
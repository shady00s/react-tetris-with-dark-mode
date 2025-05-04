// Immediately apply theme on page load
(function() {
  var storedTheme = localStorage.getItem('tetris_theme');
  var isDarkTheme = storedTheme ? 
    storedTheme === 'dark' : 
    window.location.search.includes('theme=dark');
  
  if (isDarkTheme) {
    document.body.style.backgroundColor = '#333';
    document.body.classList.add('dark-theme');
    
    // Add dark theme CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/dark-theme.css';
    document.head.appendChild(link);
  }
})();

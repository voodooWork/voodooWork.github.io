const hour = new Date().getHours();
if (hour >= 9 && hour < 18) {
    document.documentElement.classList.add('light-theme');
}

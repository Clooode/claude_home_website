document.getElementById('icon-crochet').addEventListener('click', function() {
  window.location.href = 'crochet.html';
});

// document.getElementById('icon-birds').addEventListener('click', function() {
//   window.location.href = 'birds.html';
// });

document.getElementById('icon-baking').addEventListener('click', function() {
  window.location.href = 'baking.html';
});


document.getElementById('icon-work').addEventListener('click', function() {
  window.location.href = 'work.html';
});

document.getElementById('icon-bears').addEventListener('click', function() {
  window.location.href = 'bears.html';
});

document.getElementById('icon-birds').addEventListener('click', function() {
  window.location.href = 'birds.html';
});


document.getElementById('icon-contact').addEventListener('click', function() {
  window.location.href = 'contact.html';
});

let inactivityTimer;
const nudge = document.getElementById('nudge-box');

function showNudge() {
  nudge.classList.add('visible');
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  nudge.classList.remove('visible');
  inactivityTimer = setTimeout(showNudge, 20000); // 20 seconds
}

['click', 'mousemove', 'keydown', 'touchstart'].forEach(event =>
  document.addEventListener(event, resetInactivityTimer)
);

// Start timer on load
resetInactivityTimer();

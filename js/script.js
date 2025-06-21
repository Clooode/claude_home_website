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


document.addEventListener('DOMContentLoaded', function () {
  const birdIcon = document.getElementById('icon-birds');
  if (birdIcon) {
    birdIcon.addEventListener('click', function () {
      alert("Oops! This page isn't ready yet — check back soon 🐦");
    });
  } else {
    console.warn("Couldn't find #icon-birds in the DOM.");
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const birdIcon = document.getElementById('icon-bears');
  if (birdIcon) {
    birdIcon.addEventListener('click', function () {
      alert("Oops! This page isn't ready yet — check back soon 🐻");
    });
  } else {
    console.warn("Couldn't find #icon-snoot in the DOM.");
  }
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('/lyrics')
    .then((response) => response.json())
    .then((data) => {
      renderLyrics(data);
      enableDynamicArrangement();
    })
    .catch((error) => console.error('Error Fetching Lyrics:', error));
});

function renderLyrics(lyrics) {
  let lyricsContainer = document.getElementById('lyrics-container');

  if (!lyricsContainer) {
    lyricsContainer = document.createElement('div');
    lyricsContainer.id = 'lyrics-container';
    document.body.appendChild(lyricsContainer);
  }

  lyricsContainer.innerHTML = '';

  Object.keys(lyrics).forEach((key) => {
    const lyricDiv = document.createElement('div');
    lyricDiv.classList.add('lyric-item');
    lyricDiv.textContent = lyrics[key].lyric;
    lyricsContainer.appendChild(lyricDiv);
  });
}

function enableDynamicArrangement() {
  const lyricsContainer = document.getElementById('lyrics-container');
  if (!lyricsContainer) return;

  let activeElement = null;
  let offsetX = 0;
  let offsetY = 0;

  lyricsContainer.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('lyric-item')) {
      activeElement = e.target;
      const rect = activeElement.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      activeElement.style.position = 'absolute';
      activeElement.style.zIndex = 1000;
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (activeElement) {
      const containerRect = lyricsContainer.getBoundingClientRect();
      let x = e.clientX - containerRect.left - offsetX;
      let y = e.clientY - containerRect.top - offsetY;

      x = Math.max(
        0,
        Math.min(containerRect.width - activeElement.offsetWidth, x)
      );
      y = Math.max(
        0,
        Math.min(containerRect.height - activeElement.offsetHeight, y)
      );

      activeElement.style.left = `${x}px`;
      activeElement.style.top = `${y}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (activeElement) {
      activeElement.style.zIndex = '';
      activeElement = null;
    }
  });
}

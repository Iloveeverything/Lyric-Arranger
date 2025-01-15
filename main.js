const update = document.querySelector('#update-button');
update.addEventListener('click', (_) => {
  fetch('/lyrics', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: '2025-01-03',
      lyric: 'If your tears could speak what would they say',
    }),
  });
});

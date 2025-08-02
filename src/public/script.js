document.getElementById('startBtn').addEventListener('click', async () => {
  const username = document.getElementById('usernameInput').value.trim();
  const welcomeMsg = document.getElementById('welcomeMsg');
  const welcomeSection = document.getElementById('welcomeSection');

  if (!username) {
    alert('⚠️ Please enter your name!');
    return;
  }

  try {
    const res = await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    if (!res.ok) throw new Error('❌ Failed to register user');

    const user = await res.json();

    // ✅ Save both full user and userId separately
    localStorage.setItem('zunoUser', JSON.stringify(user));
    localStorage.setItem('userId', user._id);

    welcomeMsg.textContent = `👋 Welcome, ${user.username}! Redirecting...`;
    welcomeSection.classList.remove('hidden');

    setTimeout(() => {
      window.location.href = '/home/home.html';
    }, 1500);
  } catch (err) {
    console.error(err);
    alert('❌ Could not register user. Please try again.');
  }
});

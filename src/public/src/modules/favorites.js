import { post } from './api.js';
import { getCurrentUser } from './auth.js';

export async function toggleFavorite(songId, isLiking) {
  const user = getCurrentUser();
  if (!user) return;

  console.log('🔁 toggleFavorite', {
    username: user.username,
    songId,
    action: isLiking ? 'add' : 'remove'
  });

  try {
    const res = await post('/users/favorite', {
      username: user.username,
      songId,
      action: isLiking ? 'add' : 'remove'
    });

    user.favorites = res.favorites; // update memory
  } catch (err) {
    console.error('❌ toggleFavorite failed:', err);
  }
}

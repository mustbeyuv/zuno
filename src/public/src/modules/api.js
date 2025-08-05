export async function get(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('GET request failed');
    return await response.json();
  } catch (err) {
    console.error('GET error:', err);
    throw err;
  }
}

export async function post(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('POST request failed');
    return await response.json();
  } catch (err) {
    console.error('POST error:', err);
    throw err;
  }
}

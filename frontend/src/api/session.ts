
export async function ensureGuestSession(): Promise<void> {
  const response = await fetch('/api/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error('Failed to initialize guest session');
  }

  const data: { status: string } = await response.json();

  if (data.status !== 'ok') {
    throw new Error('Unexpected session status');
  }
}


export async function checkBackendHealth(): Promise<void> {
  const response = await fetch('/api/health');

  if (!response.ok) {
    throw new Error('Backend request failed');
  }

  const data: { status: string } = await response.json();

  if (data.status !== 'ok') {
    throw new Error('Unexpected backend status');
  }
}

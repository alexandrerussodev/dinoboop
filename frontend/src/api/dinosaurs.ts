
export interface CreatedDinosaur {
  id: string;
  name: string;
}

export async function createDinosaur(name: string): Promise<CreatedDinosaur> {
  const response = await fetch('/api/dinosaurs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to create dinosaur');
  }

  return (await response.json()) as CreatedDinosaur;
}



export async function getMyDinosaur(): Promise<CreatedDinosaur | null> {
  const response = await fetch('/api/dinosaurs/me');

  if (!response.ok) {
    throw new Error('Failed to retrieve dinosaur');
  }

  const data: { dinosaur: CreatedDinosaur | null } = await response.json();

  return data.dinosaur;
}

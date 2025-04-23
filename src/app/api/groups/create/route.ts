import { NextRequest, NextResponse } from 'next/server';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, date, participants, ownerId } = body;

  if (!name || !date || !participants || !ownerId) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  if (participants.length < 2) {
    return NextResponse.json({ error: 'Mínimo de 2 participantes' }, { status: 400 });
  }

  const shuffled = shuffleArray(participants);
  const pairs = shuffled.map((giver, index) => ({
    giver,
    receiver: shuffled[(index + 1) % shuffled.length],
  }));

  const docRef = await addDoc(collection(db, 'groups'), {
    name,
    date,
    participants,
    ownerId,
    pairs,
    createdAt: serverTimestamp(),
  });

  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
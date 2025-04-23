import { NextRequest, NextResponse } from 'next/server';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import nodemailer from 'nodemailer';
import { shuffleArray } from '@/utils/shuffleArray';

interface Participant {
  name: string;
  email: string;
}

interface Pair {
  giver: Participant;
  receiver: Participant;
}
async function sendEmail(receiverEmail: string, giverName: string) {
  console.log(receiverEmail);
  console.log(giverName);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NEXT_EMAIL_USER,
      pass: process.env.NEXT_EMAIL_PASSWORD,
    },
  });

  console.log(process.env.NEXT_EMAIL_USER);
  console.log(process.env.NEXT_EMAIL_PASSWORD);

  const mailOptions = {
    from: process.env.NEXT_EMAIL_USER,
    to: receiverEmail,
    subject: 'Seu Amigo Secreto',
    text: `Olá! Seu amigo secreto é: ${giverName}. Não conte para ninguém! 🎉`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
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

  const shuffled: Participant[] = shuffleArray(participants);
  
  const pairs: Pair[] = shuffled.map((giver, index) => ({
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

  await Promise.all(
    pairs.map(async (pair: Pair) => {
      await sendEmail(pair.receiver.email, pair.giver.name);
    })
  );

  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
import { NextRequest, NextResponse } from 'next/server';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import nodemailer from 'nodemailer';
import { shuffleArray } from '@/utils/shuffleArray';
import { formatDate } from '@/utils/formatDate';

interface Participant {
  name: string;
  email: string;
}

interface Pair {
  giver: Participant;
  receiver: Participant;
}
async function sendEmail(receiverEmail: string, giverName: string, date: string) {
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NEXT_EMAIL_USER,
      pass: process.env.NEXT_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NEXT_EMAIL_USER,
    to: receiverEmail,  
    subject: "🎁 Você tirou um amigo secreto!",
    text: "Você tirou Fulano! Não conte para ninguém!",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 30px;">
          <h2 style="text-align: center; color: #4f46e5;">🎉 Amigo Secreto 🎉</h2>
          <p style="font-size: 16px; color: #374151; text-align: center;">
            Olá! Tudo pronto para a brincadeira?
          </p>
          <p style="font-size: 18px; text-align: center; color: #111827; margin-top: 30px;">
            <strong>Você tirou:</strong>
          </p>
          <div style="font-size: 24px; font-weight: bold; text-align: center; color: #10b981; margin: 10px 0;">
            ${giverName}
          </div>
          <p style="font-size: 16px; color: #4b5563; text-align: center; margin-top: 20px;">
            📅 A revelação acontecerá no dia <strong style="color: #ef4444;">${formatDate(date)}</strong>
          </p>
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 10px;">
            Guarde esse segredo até o grande dia! 😉
          </p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            Enviado por Sua Aplicação de Amigo Secreto
          </p>
        </div>
      </div>
    `,
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
      await sendEmail(pair.receiver.email, pair.giver.name, date);
    })
  );

  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
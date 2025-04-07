"use client";

// import api from "../api";
import { useQuery } from '@tanstack/react-query';

const MOCK_GROUP = {
    id: '9f1b3e26-2f99-4e2e-9a6e-1dfcfae7b001',
    title: 'Desenvolvimento Frontend',
    date: '01/02/2025',
    yourSecret: 'Lucas',
    participants: [
      { name: 'Tiago', email: 'tiago@gmail.com' },
      { name: 'Camila', email: 'camila.santos@gmail.com' },
      { name: 'Lucas', email: 'lucas.dev@gmail.com' },
      { name: 'Fernanda', email: 'fernanda.design@gmail.com' },
      { name: 'João Pedro', email: 'jp.front@gmail.com' },
      { name: 'Marina', email: 'marina.codes@gmail.com' },
      { name: 'Ricardo', email: 'ricardo.js@gmail.com' },
      { name: 'Ana Clara', email: 'ana.clara.dev@gmail.com' },
      { name: 'Bruno', email: 'bruno.react@gmail.com' },
      { name: 'Larissa', email: 'larissa.vue@gmail.com' },
      { name: 'Fábio', email: 'fabio.angular@gmail.com' },
      { name: 'Vitória', email: 'vitoria.web@gmail.com' },
      { name: 'Diego', email: 'diego.frontend@gmail.com' },
      { name: 'Jéssica', email: 'jessica.uiux@gmail.com' },
    ],
  };

const fetchGroupForId = async () => {
  const response = MOCK_GROUP
  // if (!response.ok) throw new Error('Erro ao buscar os grupos');
  return response;
  // return response.json();
};

export const useGroupForId = (id: string) => {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: fetchGroupForId,
    staleTime: 1000 * 60 * 5,
  });
};
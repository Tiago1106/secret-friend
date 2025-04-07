"use client";

// import api from "../api";
import { useQuery } from '@tanstack/react-query';

const MOCK_GROUPS = [
  {
    id: '9f1b3e26-2f99-4e2e-9a6e-1dfcfae7b001',
    title: 'Desenvolvimento Frontend',
    date: '01/02/2025',
    participants: '14',
  },
  {
    id: 'a2c4d7f1-8e34-42d2-9b7a-ccfe9e9c4302',
    title: 'Equipe UX/UI Design',
    date: '05/03/2025',
    participants: '8',
  },
  {
    id: '7f3f9bde-2134-4bd9-80f7-b728f15d4c03',
    title: 'Squad de Backend',
    date: '10/04/2025',
    participants: '12',
  },
  {
    id: 'e4a27c62-c1d8-46fc-92ea-8c4580cdd204',
    title: 'Marketing Digital',
    date: '15/05/2025',
    participants: '18',
  },
  {
    id: '1b09cfd4-3d67-4f24-93f3-7fd7272b2f05',
    title: 'Estratégia e Produto',
    date: '20/06/2025',
    participants: '10',
  },
  {
    id: 'ac2d3ff1-e45c-4fd9-8d9f-6f1c2e728906',
    title: 'Equipe de Dados e BI',
    date: '25/07/2025',
    participants: '7',
  },
  {
    id: 'd5f4be11-9bcd-4e30-bf90-5f9f5e3c1a07',
    title: 'Time de Suporte Técnico',
    date: '30/08/2025',
    participants: '15',
  },
  {
    id: 'b30c1a88-4de9-48a2-9ff6-e709d4eb3208',
    title: 'Pesquisa e Inovação',
    date: '10/09/2025',
    participants: '9',
  },
];

const fetchGroups = async () => {
  const response = MOCK_GROUPS
  // if (!response.ok) throw new Error('Erro ao buscar os grupos');
  return response;
  // return response.json();
};

export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 1000 * 60 * 5,
  });
};
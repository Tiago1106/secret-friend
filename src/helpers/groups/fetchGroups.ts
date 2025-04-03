"use client";

// import api from "../api";
import { useQuery } from '@tanstack/react-query';

const MOCK_GROUPS = [
  {
    id: '1',
    title: 'Desenvolvimento Frontend',
    date: '01/02/2025',
    participants: '14',
  },
  {
    id: '2',
    title: 'Equipe UX/UI Design',
    date: '05/03/2025',
    participants: '8',
  },
  {
    id: '3',
    title: 'Squad de Backend',
    date: '10/04/2025',
    participants: '12',
  },
  {
    id: '4',
    title: 'Marketing Digital',
    date: '15/05/2025',
    participants: '18',
  },
  {
    id: '5',
    title: 'Estratégia e Produto',
    date: '20/06/2025',
    participants: '10',
  },
  {
    id: '6',
    title: 'Equipe de Dados e BI',
    date: '25/07/2025',
    participants: '7',
  },
  {
    id: '7',
    title: 'Time de Suporte Técnico',
    date: '30/08/2025',
    participants: '15',
  },
  {
    id: '8',
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
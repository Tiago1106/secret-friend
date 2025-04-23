export type Participant = {
  name: string;
  email: string;
};

export type GroupFormValues = {
  name: string;
  date?: string;
  participants: Participant[];
  pairs?: { giver: Participant; receiver: Participant }[];
};

export interface Group {
  id: string;
  name: string;
  date: string;
  participants: Participant[];
  ownerId: string;
}
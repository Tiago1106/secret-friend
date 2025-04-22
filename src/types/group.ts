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
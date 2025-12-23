export interface VacancyInfo {
  title: string;
  company: string;
  salary: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  experience: string;
  telegram: string;
  message: string;
}

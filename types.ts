import React from 'react';

export interface MousePosition {
  x: number;
  y: number;
}

export interface ScrollState {
  current: number;
  target: number;
  last: number;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  url: string;
  year: string;
}

export interface ServicePrice {
  id: number;
  title: string;
  price: string;
  description: string;
  features: string[];
}

export interface ConceptResponse {
  tagline: string;
  visualDirection: string;
  features: string[];
}

// Helper type for mapping old IDs to URL slugs if needed
export type ServiceID = 
  | 'SERVICE_WEB' 
  | 'SERVICE_BOTS' 
  | 'SERVICE_AI' 
  | 'SERVICE_COMPLEX' 
  | 'SERVICE_TMA' 
  | 'SERVICE_REPUTATION' 
  | 'SERVICE_CUSTOM';

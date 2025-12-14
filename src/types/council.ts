export interface Persona {
  name: string;
  description: string;
}

export interface DialogueItem {
  speaker: string;
  text: string;
}

export interface CouncilData {
  personas: Persona[];
  dialogue: DialogueItem[];
  synthesis: string;
}

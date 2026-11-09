export type StepId = 'lights' | 'banner' | 'balloons' | 'main_cake' | 'mini_cake' | 'flowers';

export interface DecorItem {
  id: StepId;
  name: string;
  icon: string;
  hintText: string;
  roomHotspot: {
    top: string;
    left: string;
    label: string;
  };
}

export type GameStage = 'DECORATING' | 'WISHING' | 'CELEBRATING';

export interface BlessingContent {
  recipient: string;
  age: number;
  mainBlessing: string;
  subBlessing: string;
  sender: string;
}

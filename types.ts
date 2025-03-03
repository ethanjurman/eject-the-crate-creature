export type TextAction = {
  delay: number;
  type: "TEXT";
  data: {
    text: string;
    readoutKey?: string; // fallback for text
    id: number;
    partOfPrevious?: boolean;
    skipSpeaking?: boolean;
  };
};

export type GameStates =
  | "MENU_START"
  | "MENU"
  | "OPENING"
  | "READY"
  | "START"
  | "GAME"
  | "END";

export type GameStateUpdate = {
  delay: number;
  type: "GAME_STATE_UPDATE";
  data: {
    state: GameStates;
    id: number;
  };
};

export type CreatureRun = {
  delay: number;
  type: "CREATURE_RUN";
  data: {
    count: number;
    id: number;
  };
};

export type CreatureAttack = {
  delay: number;
  type: "CREATURE_ATTACK";
  data: {
    id: number;
  };
};

export type Action =
  | TextAction
  | GameStateUpdate
  | CreatureRun
  | CreatureAttack;

export type GameState = {
  state: GameStates;
  creature: {
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    behavior: "RUN" | "ATTACK";
  };
  radarKey: string;
  // each queued action waits until the previous one is done
  queuedActions: Action[];
  // each unqueued action goes at the same time
  unqueuedActions: Action[];
  cargo: Record<
    string,
    {
      damage: number;
      ejected: boolean;
    }
  >;
  showCreatureAndDamage: boolean;
};

export type TextAction = {
  delay: number;
  type: "TEXT";
  data: {
    text: string;
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

export type Action = TextAction | CreatureRun | CreatureAttack;

export type GameState = {
  state: "MENU" | "READY" | "START" | "GAME" | "END";
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
  ejecting: boolean;
};

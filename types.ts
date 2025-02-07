export type TextAction = {
  delay: number;
  type: "text";
  data: {
    text: string;
  };
};

export type NewLineAction = {
  delay: number;
  type: "new-line";
  data: {};
};

export type Action = TextAction | NewLineAction;

export type GameState = {
  state: "READY" | "START" | "GAME" | "END";
  creature: {
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    behavior: "HIGH_HEALTH" | "LOW_HEALTH" | "RUN" | "ATTACK";
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
  showCargos: boolean;
  ejecting: boolean;
};

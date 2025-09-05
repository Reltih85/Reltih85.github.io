export function listenBoards(cb: (boards: any[]) => void): () => void;
export function createBoardWithPassword(name: string, password?: string): Promise<string>;
export function renameBoard(boardId: string, newName: string): Promise<void>;
export function deleteBoardHard(boardId: string): Promise<void>;
export function checkBoardPassword(boardId: string, password: string): Promise<boolean>;
export function joinBoard(boardId: string): Promise<void>;

export function listenLists(boardId: string, cb: (lists: any[]) => void): () => void;
export function listenCards(boardId: string, cb: (cards: any[]) => void): () => void;
export function createList(boardId: string, title: string, order?: number): Promise<void>;

export function createCard(
  boardId: string,
  listId: string,
  title: string,
  order?: number,
  description?: string,
  hours?: number,
  assignee?: string
): Promise<void>;

export function updateCardPosition(
  boardId: string,
  cardId: string,
  toListId: string,
  newOrder: number
): Promise<void>;

export function updateCardFields(
  boardId: string,
  cardId: string,
  data: Partial<{ title: string; description: string; hours: number; assignee: string; order: number; listId: string; }>
): Promise<void>;

export function deleteCard(boardId: string, cardId: string): Promise<void>;

export function getOrCreateBoardIdByName(name: string): Promise<string>;

// Alias para compatibilidad con código viejo
export function createBoard(name: string): Promise<string>;
export function ensureDefaultLists(boardId: string): Promise<void>;

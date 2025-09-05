// src/services/boardService.d.ts
export function createBoard(name: string): Promise<string>;
export function joinBoard(boardId: string): Promise<void>;

export function listenLists(
  boardId: string,
  cb: (lists: any[]) => void
): () => void;

export function listenCards(
  boardId: string,
  cb: (cards: any[]) => void
): () => void;

export function createList(
  boardId: string,
  title: string,
  order?: number
): Promise<void>;

export function createCard(
  boardId: string,
  listId: string,
  title: string,
  order?: number,
  description?: string
): Promise<void>;

export function updateCardPosition(
  boardId: string,
  cardId: string,
  toListId: string,
  newOrder: number
): Promise<void>;

export function getCardsByList(
  boardId: string,
  listId: string
): Promise<any[]>;

export function getOrCreateBoardIdByName(name: string): Promise<string>;

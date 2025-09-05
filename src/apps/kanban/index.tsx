import React, { useEffect } from 'react';
import { KanbanProvider, useKanban } from './KanbanContext';
import ProjectList from './ProjectList';
import Board from './Board';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { joinBoard, createBoard } from '../../services/boardService';

function Inner() {
  const { selectedId } = useKanban();

  // Auto-join al abrir un board
  useEffect(() => {
    const off = onAuthStateChanged(auth, (user) => {
      if (user && selectedId) joinBoard(selectedId);
    });
    return () => off();
  }, [selectedId]);

  return selectedId ? <Board /> : <ProjectList />;
}

export default function KanbanApp() {
  return (
    <KanbanProvider>
      <Inner />
    </KanbanProvider>
  );
}

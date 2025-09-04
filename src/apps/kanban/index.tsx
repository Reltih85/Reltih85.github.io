import React from 'react';
import { KanbanProvider, useKanban } from './KanbanContext';
import ProjectList from './ProjectList';
import Board from './Board';

function Inner() {
  const { selectedId } = useKanban();
  return selectedId ? <Board /> : <ProjectList />;
}

export default function KanbanApp() {
  return (
    <KanbanProvider>
      <Inner />
    </KanbanProvider>
  );
}

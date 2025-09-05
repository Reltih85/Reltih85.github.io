import React from "react";
import ProjectList from "./ProjectList";
import Board from "./Board";
import { useSearchParams } from "react-router-dom";

function Inner() {
  const [sp] = useSearchParams();
  const b = sp.get("b");
  return b ? <Board /> : <ProjectList />;
}

export default function KanbanApp() {
  return <Inner />;
}

"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CATEGORY_LABELS } from "@/lib/questions";

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuestionDragDrop({ question, onAnswer }) {
  const [order, setOrder] = useState(() => shuffle(question.items));

  useEffect(() => {
    onAnswer(order.map((item) => item.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  function handleDragEnd(result) {
    if (!result.destination) return;
    const next = [...order];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    setOrder(next);
    onAnswer(next.map((item) => item.id));
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <span className="w-fit rounded-full bg-primary/40 px-3 py-1 text-xs font-medium text-slate-200">
        {CATEGORY_LABELS[question.category] || question.category}
      </span>

      <h2 className="text-2xl font-semibold leading-snug text-white sm:text-3xl">
        {question.question}
      </h2>

      {question.instruction && (
        <p className="text-sm text-slate-400">{question.instruction}</p>
      )}

      <p className="text-sm italic text-slate-500">
        {question.id === "dragdrop-1"
          ? "✅ Ce qui compte : chaque fichier doit être placé dans le bon dossier parent, dans le bon niveau d'indentation. L'ordre entre dossiers frères est libre."
          : "⚠️ L'ordre exact est important — c'est une séquence chronologique."}
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dragdrop-tree">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
            >
              {order.map((item, index) => {
                const depth = item.depth ?? 0;
                const isFolder = Boolean(item.isFolder);
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(dragProvided, dragSnapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={{
                          paddingLeft: `${depth * 24 + 12}px`,
                          ...dragProvided.draggableProps.style,
                        }}
                        className={`flex items-center gap-2 rounded-lg border-2 py-2 pr-3 text-sm transition-colors sm:text-base ${
                          dragSnapshot.isDragging
                            ? "border-accent bg-slate-800"
                            : "border-transparent bg-transparent hover:bg-slate-800/60"
                        }`}
                      >
                        <span className="text-slate-600">⠿</span>
                        <span>{item.icon || (isFolder ? "📁" : "📄")}</span>
                        <span className={`font-mono ${isFolder ? "font-bold text-sky-300" : "text-slate-200"}`}>
                          {item.label}
                        </span>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

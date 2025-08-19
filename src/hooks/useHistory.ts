"use client";

import { useState, useCallback, useRef } from 'react';

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export const useHistory = <T>(initialState: T) => {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });
  
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;
  
  const setInitialState = useCallback((newInitialState: T) => {
    setState({
        past: [],
        present: newInitialState,
        future: [],
    });
  }, []);

  const set = useCallback((newState: T) => {
    setState(currentState => {
      if (JSON.stringify(newState) === JSON.stringify(currentState.present)) {
        return currentState;
      }
      return {
        past: [...currentState.past, currentState.present],
        present: newState,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(currentState => {
      if (!canUndo) return currentState;
      const newPresent = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, currentState.past.length - 1);
      return {
        past: newPast,
        present: newPresent,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    setState(currentState => {
      if (!canRedo) return currentState;
      const newPresent = currentState.future[0];
      const newFuture = currentState.future.slice(1);
      return {
        past: [...currentState.past, currentState.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, [canRedo]);
  
  return {
    state: state.present,
    setState: set,
    undo,
    redo,
    canUndo,
    canRedo,
    setInitialState,
  };
};
'use client';

import {useEffect, type RefObject} from 'react';

/** Native touch scrolling, with the same direct manipulation for mouse and pen. */
export function useDragScroll(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;
    let gesture: {id: number; x: number; y: number; left: number; dragging: boolean} | null = null;
    let suppressClick = false;
    let clickTimer: ReturnType<typeof setTimeout> | undefined;

    const down = (event: PointerEvent) => {
      clearTimeout(clickTimer);
      suppressClick = false;
      // Let the browser own touch inertia and vertical page scrolling.
      if (event.pointerType === 'touch' || event.button !== 0 || !event.isPrimary) return;
      gesture = {id: event.pointerId, x: event.clientX, y: event.clientY, left: rail.scrollLeft, dragging: false};
    };
    const move = (event: PointerEvent) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (!gesture.dragging) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
        if (Math.abs(dy) > Math.abs(dx)) { gesture = null; return; }
        gesture.dragging = true;
        suppressClick = true;
        rail.classList.add('is-dragging');
        rail.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      rail.scrollLeft = gesture.left - dx;
    };
    const end = (event: PointerEvent) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dragged = gesture.dragging;
      gesture = null;
      if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
      rail.classList.remove('is-dragging');
      if (dragged) clickTimer = setTimeout(() => { suppressClick = false; }, 400);
    };
    const click = (event: MouseEvent) => {
      if (!suppressClick || event.detail === 0) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const preventNativeDrag = (event: DragEvent) => event.preventDefault();
    rail.addEventListener('pointerdown', down);
    rail.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    rail.addEventListener('lostpointercapture', end);
    rail.addEventListener('click', click, true);
    rail.addEventListener('dragstart', preventNativeDrag);
    return () => {
      clearTimeout(clickTimer);
      rail.classList.remove('is-dragging');
      rail.removeEventListener('pointerdown', down);
      rail.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      rail.removeEventListener('lostpointercapture', end);
      rail.removeEventListener('click', click, true);
      rail.removeEventListener('dragstart', preventNativeDrag);
    };
  }, [ref]);
}

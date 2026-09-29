import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Layer, Point, Stroke, Tool, Camera } from '../types';

export type InputMode = 'touch' | 'pen-only' | 'hybrid';

interface CanvasProps {
  layers: Layer[];
  activeLayerId: string;
  tool: Tool;
  color: string;
  snapEnabled: boolean;
  angleGuidesEnabled: boolean;
  protractorEnabled: boolean;
  rulerEnabled: boolean;
  inputMode?: InputMode;
  boxGridStartNumber: number;
  boxGridShape?: 'square' | 'line';
  boxGridNumbered?: boolean;
  initialCamera?: Camera;
  isDarkMode?: boolean;
  onCameraChange?: (camera: Camera) => void;
  onLayersChange: (newLayers: Layer[]) => void;
}

export interface CanvasWorkspaceRef {
  copySelection: () => Stroke[];
  pasteStrokes: (strokes: Stroke[]) => void;
  deleteSelection: () => void;
  hasSelection: () => boolean;
  strokeRulerLine: () => void;
  getCamera: () => Camera;
  setCamera: (camera: Camera) => void;
  resetView: () => void;
  fitContent: () => void;
}

function distSq(v: Point, w: Point) {
  return Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
}

function distToSegmentSq(p: Point, v: Point, w: Point) {
  const l2 = distSq(v, w);
  if (l2 === 0) return distSq(p, v);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return distSq(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y), p: 0 });
}

function getAdaptiveStrokeColor(color: string, isDarkMode: boolean, isSelected: boolean): string {
  if (isSelected) return '#3b82f6';
  const strokeColor = color || '#1e293b';

  let hex = strokeColor.trim().toLowerCase();
  if (hex === '#1e293b' || hex === '#000' || hex === '#000000' || hex === '#0f172a' || hex === '#1e1e1e' || hex === '#09090b' || hex === 'black') {
    return isDarkMode ? '#f8fafc' : '#1e293b';
  }

  if (hex.startsWith('#')) {
    let cleanHex = hex.slice(1);
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      if (isDarkMode && luminance < 0.35) {
        return '#f8fafc';
      }
      if (!isDarkMode && luminance > 0.92) {
        return '#1e293b';
      }
    }
  }

  return strokeColor;
}

export const CanvasWorkspace = forwardRef<CanvasWorkspaceRef, CanvasProps>(({
  layers,
  activeLayerId,
  tool,
  color,
  snapEnabled,
  angleGuidesEnabled,
  protractorEnabled,
  rulerEnabled,
  inputMode = 'hybrid',
  boxGridStartNumber,
  boxGridShape = 'square',
  boxGridNumbered = true,
  initialCamera,
  isDarkMode = false,
  onCameraChange,
  onLayersChange
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const interactionStateRef = useRef<{
    isDrawing: boolean;
    currentStroke: Stroke | null;
    selectedStrokeIds: string[];
    selectionBox: { start: Point; end: Point } | null;
    isMovingSelection: boolean;
    movingStroke: Stroke | null;
    moveStartPoint: Point | null;
    strokeConstraint: 'none' | 'angle' | 'protractor-base' | 'protractor-arc' | 'ruler';
    lockedAngle: number | null;
    lockedRadius: number | null;
    lockedLocalY: number | null;
    interactingWith: 'none' | 'protractor-move' | 'protractor-rotate' | 'ruler-p1' | 'ruler-p2' | 'ruler-move';
    lastPinchDist: number | null;
    lastPinchCenter: Point | null;
  }>({
    isDrawing: false,
    currentStroke: null,
    selectedStrokeIds: [],
    selectionBox: null,
    isMovingSelection: false,
    movingStroke: null,
    moveStartPoint: null,
    strokeConstraint: 'none',
    lockedAngle: null,
    lockedRadius: null,
    lockedLocalY: null,
    interactingWith: 'none',
    lastPinchDist: null,
    lastPinchCenter: null
  });

  const mutableLayersRef = useRef<Layer[]>([]);
  useEffect(() => {
    mutableLayersRef.current = JSON.parse(JSON.stringify(layers));
    render();
  }, [layers]);

  useEffect(() => {
    render();
  }, [isDarkMode]);

  useEffect(() => {
    if (inputMode === 'pen-only') {
      activeTouchesRef.current.clear();
      interactionStateRef.current.lastPinchDist = null;
      interactionStateRef.current.lastPinchCenter = null;
    }
  }, [inputMode]);

  const rulerRef = useRef({
    p1: { x: 0, y: 0 },
    p2: { x: 300, y: 0 }
  });

  useImperativeHandle(ref, () => ({
    copySelection: () => {
      const activeLayer = mutableLayersRef.current.find(l => l.id === activeLayerId);
      if (!activeLayer) return [];
      const selectedIds = interactionStateRef.current.selectedStrokeIds;
      return activeLayer.strokes.filter(s => selectedIds.includes(s.id)).map(s => JSON.parse(JSON.stringify(s)));
    },
    pasteStrokes: (strokesToPaste: Stroke[]) => {
      if (strokesToPaste.length === 0) return;
      const activeLayer = mutableLayersRef.current.find(l => l.id === activeLayerId);
      if (!activeLayer || activeLayer.locked || !activeLayer.visible) return;

      const newStrokes = strokesToPaste.map(s => {
        const copy = JSON.parse(JSON.stringify(s));
        copy.id = Math.random().toString();
        // offset pasted strokes slightly so they don't exactly overlap
        copy.points.forEach((p: Point) => {
          p.x += 20;
          p.y += 20;
        });
        return copy;
      });
      activeLayer.strokes.push(...newStrokes);
      interactionStateRef.current.selectedStrokeIds = newStrokes.map(s => s.id);
      onLayersChange(JSON.parse(JSON.stringify(mutableLayersRef.current)));
      render();
    },
    deleteSelection: () => {
      const activeLayer = mutableLayersRef.current.find(l => l.id === activeLayerId);
      if (!activeLayer || activeLayer.locked || !activeLayer.visible) return;

      const selectedIds = interactionStateRef.current.selectedStrokeIds;
      if (selectedIds.length === 0) return;

      activeLayer.strokes = activeLayer.strokes.filter(s => !selectedIds.includes(s.id));
      interactionStateRef.current.selectedStrokeIds = [];
      onLayersChange(JSON.parse(JSON.stringify(mutableLayersRef.current)));
      render();
    },
    hasSelection: () => interactionStateRef.current.selectedStrokeIds.length > 0,
    strokeRulerLine: () => {
      const activeLayer = mutableLayersRef.current.find(l => l.id === activeLayerId);
      if (!activeLayer || activeLayer.locked || !activeLayer.visible) return;
      const stroke: Stroke = {
        id: Math.random().toString(),
        type: 'line',
        points: [
          { x: rulerRef.current.p1.x, y: rulerRef.current.p1.y, p: 0.5 },
          { x: rulerRef.current.p2.x, y: rulerRef.current.p2.y, p: 0.5 }
        ],
        color
      };
      activeLayer.strokes.push(stroke);
      onLayersChange(JSON.parse(JSON.stringify(mutableLayersRef.current)));
      render();
    },
    getCamera: () => ({ ...cameraRef.current }),
    setCamera: (newCamera: Camera) => {
      cameraRef.current = { ...newCamera };
      render();
      onCameraChange?.(cameraRef.current);
    },
    resetView: () => {
      cameraRef.current = { x: 0, y: 0, zoom: 1 };
      render();
      onCameraChange?.(cameraRef.current);
    },
    fitContent: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const width = canvas.width || window.innerWidth;
      const height = canvas.height || window.innerHeight;

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      let count = 0;

      for (const layer of mutableLayersRef.current) {
        if (!layer.visible) continue;
        for (const stroke of layer.strokes) {
          if (stroke.type === 'box-grid' && stroke.points.length > 0) {
            const p = stroke.points[0];
            const size = stroke.boxData?.size || 50;
            minX = Math.min(minX, p.x - size);
            maxX = Math.max(maxX, p.x + size);
            minY = Math.min(minY, p.y - size);
            maxY = Math.max(maxY, p.y + size);
            count++;
          } else {
            for (const pt of stroke.points) {
              minX = Math.min(minX, pt.x);
              maxX = Math.max(maxX, pt.x);
              minY = Math.min(minY, pt.y);
              maxY = Math.max(maxY, pt.y);
              count++;
            }
          }
        }
      }

      if (count === 0 || !isFinite(minX)) {
        cameraRef.current = { x: 0, y: 0, zoom: 1 };
      } else {
        const contentWidth = Math.max(80, maxX - minX);
        const contentHeight = Math.max(80, maxY - minY);
        const padding = 80;
        const scaleX = (width - padding * 2) / contentWidth;
        const scaleY = (height - padding * 2) / contentHeight;
        const zoom = Math.max(0.1, Math.min(Math.min(scaleX, scaleY), 5));
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        cameraRef.current = {
          x: width / 2 - centerX * zoom,
          y: height / 2 - centerY * zoom,
          zoom
        };
      }
      render();
      onCameraChange?.(cameraRef.current);
    }
  }));

  const protractorRef = useRef({ x: 0, y: 0, radius: 200, rotation: 0 });
  useEffect(() => {
    if (protractorEnabled && canvasRef.current) {
      // Reposition protractor to the center of the current screen view in world coordinates
      const centerWorld = screenToWorld(canvasRef.current.width / 2, canvasRef.current.height / 2);
      protractorRef.current.x = centerWorld.x;
      protractorRef.current.y = centerWorld.y;
      // Set comfortable initial size based on current zoom
      protractorRef.current.radius = Math.max(60, 180 / cameraRef.current.zoom);
    }
    // Always render so that toggling OFF removes the protractor from the canvas immediately
    render();
  }, [protractorEnabled]);

  useEffect(() => {
    if (rulerEnabled && canvasRef.current) {
      // Reposition ruler horizontally at the center of the current screen view
      const centerWorld = screenToWorld(canvasRef.current.width / 2, canvasRef.current.height / 2);
      const halfLen = Math.max(80, 160 / cameraRef.current.zoom);
      rulerRef.current.p1 = { x: centerWorld.x - halfLen, y: centerWorld.y };
      rulerRef.current.p2 = { x: centerWorld.x + halfLen, y: centerWorld.y };
    }
    render();
  }, [rulerEnabled]);

  useEffect(() => {
    try {
      localStorage.removeItem('infinite_drafting_input_mode');
    } catch {}
    const handleGlobalPointerCleanup = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        activeTouchesRef.current.delete(e.pointerId);
        if (activeTouchesRef.current.size < 2) {
          interactionStateRef.current.lastPinchDist = null;
          interactionStateRef.current.lastPinchCenter = null;
        }
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerCleanup);
    window.addEventListener('pointercancel', handleGlobalPointerCleanup);
    window.addEventListener('blur', () => {
      activeTouchesRef.current.clear();
      interactionStateRef.current.lastPinchDist = null;
      interactionStateRef.current.lastPinchCenter = null;
    });
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerCleanup);
      window.removeEventListener('pointercancel', handleGlobalPointerCleanup);
    };
  }, []);

  useEffect(() => {
    if (tool !== 'select') {
      interactionStateRef.current.selectedStrokeIds = [];
      interactionStateRef.current.selectionBox = null;
      interactionStateRef.current.isMovingSelection = false;
      render();
    }
  }, [tool]);

  const cameraRef = useRef<Camera>(initialCamera ? { ...initialCamera } : { x: 0, y: 0, zoom: 1 });
  const activeTouchesRef = useRef<Map<number, { x: number; y: number }>>(new Map());

  useEffect(() => {
    if (initialCamera) {
      cameraRef.current = { ...initialCamera };
      render();
    }
  }, [initialCamera?.x, initialCamera?.y, initialCamera?.zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const camera = cameraRef.current;
      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = Math.pow(0.997, e.deltaY);
        const newZoom = Math.max(0.1, Math.min(camera.zoom * zoomFactor, 20));
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        camera.x = mouseX - (mouseX - camera.x) * (newZoom / camera.zoom);
        camera.y = mouseY - (mouseY - camera.y) * (newZoom / camera.zoom);
        camera.zoom = newZoom;
      } else {
        camera.x -= e.deltaX;
        camera.y -= e.deltaY;
      }
      render();
      onCameraChange?.(camera);
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [onCameraChange]);

  const strokeBoundsCache = useRef<WeakMap<Stroke, { minX: number; minY: number; maxX: number; maxY: number }>>(new WeakMap());
  const rafIdRef = useRef<number | null>(null);

  const getStrokeBounds = (stroke: Stroke) => {
    let bounds = strokeBoundsCache.current.get(stroke);
    if (!bounds) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let i = 0; i < stroke.points.length; i++) {
        const pt = stroke.points[i];
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.y > maxY) maxY = pt.y;
      }
      const padding = stroke.type === 'box-grid' ? (stroke.boxData?.size || 50) * 3 : 30;
      bounds = {
        minX: minX - padding,
        minY: minY - padding,
        maxX: maxX + padding,
        maxY: maxY + padding
      };
      strokeBoundsCache.current.set(stroke, bounds);
    }
    return bounds;
  };

  const render = () => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      drawCanvasContent();
    });
  };

  const drawCanvasContent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const camera = cameraRef.current;
    const state = interactionStateRef.current;

    // Calculate viewport bounds in canvas space for spatial culling
    const margin = 50 / camera.zoom;
    const viewMinX = -camera.x / camera.zoom - margin;
    const viewMinY = -camera.y / camera.zoom - margin;
    const viewMaxX = (width - camera.x) / camera.zoom + margin;
    const viewMaxY = (height - camera.y) / camera.zoom + margin;

    ctx.fillStyle = isDarkMode ? '#0f172a' : '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    const GRID_SIZE = 50;
    const scaledGrid = GRID_SIZE * camera.zoom;
    const offsetX = camera.x % scaledGrid;
    const offsetY = camera.y % scaledGrid;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = isDarkMode ? '#1e293b' : '#e9ecef';
    ctx.lineWidth = 1;
    for (let x = offsetX; x < width; x += scaledGrid) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
    for (let y = offsetY; y < height; y += scaledGrid) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = isDarkMode ? '#334155' : '#ced4da';
    ctx.lineWidth = 2;
    const majorOffsetX = camera.x % (scaledGrid * 5);
    const majorOffsetY = camera.y % (scaledGrid * 5);
    for (let x = majorOffsetX; x < width; x += scaledGrid * 5) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
    for (let y = majorOffsetY; y < height; y += scaledGrid * 5) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const layer of mutableLayersRef.current) {
      if (!layer.visible) continue;
      for (const stroke of layer.strokes) {
        if (stroke.points.length < 2) continue;

        // SPATIAL VIEWPORT CULLING: Skip drawing strokes that are off-screen
        const bounds = getStrokeBounds(stroke);
        if (bounds.maxX < viewMinX || bounds.minX > viewMaxX || bounds.maxY < viewMinY || bounds.minY > viewMaxY) {
          continue;
        }

        const isSelected = stroke === state.movingStroke || state.selectedStrokeIds.includes(stroke.id);

        if (stroke.type === 'box-grid') {
          const p0 = stroke.points[0];
          if (!p0) continue;
          const p1 = stroke.points[1] || p0;
          const size = stroke.boxData?.size || 50;
          const isLine = stroke.boxData?.shape === 'line';
          const showNumber = stroke.boxData?.showNumber ?? true;

          let cells: { x: number, y: number }[] = [];

          if (isLine) {
            // Line generation (diagonal enabled via Bresenham-style sampling)
            const gx0 = Math.floor(p0.x / size);
            const gy0 = Math.floor(p0.y / size);
            const gx1 = Math.floor(p1.x / size);
            const gy1 = Math.floor(p1.y / size);

            const dx = gx1 - gx0;
            const dy = gy1 - gy0;
            const steps = Math.max(Math.abs(dx), Math.abs(dy));

            if (steps === 0) {
              cells.push({ x: gx0 * size, y: gy0 * size });
            } else {
              for (let i = 0; i <= steps; i++) {
                cells.push({
                  x: Math.round(gx0 + (dx * i) / steps) * size,
                  y: Math.round(gy0 + (dy * i) / steps) * size
                });
              }
            }
          } else {
            // Square logic (respecting drag direction for numbering)
            const minXRaw = Math.min(p0.x, p1.x);
            const maxXRaw = Math.max(p0.x, p1.x);
            const minYRaw = Math.min(p0.y, p1.y);
            const maxYRaw = Math.max(p0.y, p1.y);

            const minX = Math.floor(minXRaw / size) * size;
            const maxX = Math.max(minX + size, Math.ceil(maxXRaw / size) * size);
            const minY = Math.floor(minYRaw / size) * size;
            const maxY = Math.max(minY + size, Math.ceil(maxYRaw / size) * size);

            const cols = Math.max(1, Math.round((maxX - minX) / size));
            const rows = Math.max(1, Math.round((maxY - minY) / size));

            const dirX = p1.x >= p0.x ? 1 : -1;
            const dirY = p1.y >= p0.y ? 1 : -1;

            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                const r = dirY === 1 ? i : rows - 1 - i;
                const c = dirX === 1 ? j : cols - 1 - j;
                cells.push({
                  x: minX + c * size,
                  y: minY + r * size
                });
              }
            }
          }

          ctx.strokeStyle = getAdaptiveStrokeColor(stroke.color, isDarkMode, isSelected);
          ctx.fillStyle = ctx.strokeStyle;
          ctx.lineWidth = 2;
          ctx.font = `${size * 0.4}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.beginPath();
          let currentNum = stroke.boxData?.startNumber || 1;

          for (const cell of cells) {
            ctx.rect(cell.x, cell.y, size, size);
            if (showNumber) {
              ctx.fillText(String(currentNum++), cell.x + size/2, cell.y + size/2);
            }
          }
          ctx.stroke();
        } else {
          ctx.strokeStyle = getAdaptiveStrokeColor(stroke.color, isDarkMode, isSelected);
          ctx.beginPath();
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          for (let i = 1; i < stroke.points.length; i++) {
            const pt = stroke.points[i];
            ctx.lineWidth = 2 + pt.p * 2;
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }
      }
    }

    if (state.selectionBox) {
      ctx.save();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1 / camera.zoom;
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.setLineDash([5 / camera.zoom, 5 / camera.zoom]);
      const { start, end } = state.selectionBox;
      ctx.beginPath();
      ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    if (angleGuidesEnabled && state.isDrawing && state.currentStroke && state.currentStroke.points.length > 0) {
      const p0 = state.currentStroke.points[0];
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 1 / camera.zoom;
      const r = 4000;
      for (let i = 0; i < 12; i++) {
        const a = i * (Math.PI / 12);
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p0.x + Math.cos(a) * r, p0.y + Math.sin(a) * r);
      }
      ctx.stroke();
    }

    if (rulerEnabled && state.isDrawing && state.strokeConstraint === 'ruler' && state.currentStroke && state.currentStroke.points.length > 0) {
      const p0 = state.currentStroke.points[0];
      const { p1, p2 } = rulerRef.current;
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
      ctx.lineWidth = 1 / camera.zoom;
      ctx.setLineDash([6 / camera.zoom, 6 / camera.zoom]);
      const r = 5000;
      ctx.moveTo(p0.x - Math.cos(angle) * r, p0.y - Math.sin(angle) * r);
      ctx.lineTo(p0.x + Math.cos(angle) * r, p0.y + Math.sin(angle) * r);
      ctx.stroke();
      ctx.restore();
    }

    if (protractorEnabled) {
      const pr = protractorRef.current;
      ctx.save();
      ctx.translate(pr.x, pr.y);
      ctx.rotate(pr.rotation);

      // Draw plastic body
      ctx.beginPath();
      ctx.arc(0, 0, pr.radius, 0, Math.PI);
      ctx.lineTo(pr.radius, 0);
      ctx.lineTo(-pr.radius, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(240, 248, 255, 0.6)';
      ctx.fill();
      ctx.lineWidth = 2 / camera.zoom;
      ctx.strokeStyle = '#3b82f6';
      ctx.stroke();

      // Tick marks
      ctx.beginPath();
      ctx.lineWidth = 1 / camera.zoom;
      ctx.strokeStyle = '#1e3a8a';
      for(let i=0; i<=18; i++) {
        const a = i * (Math.PI / 18);
        const isMajor = i % 9 === 0;
        const tickLength = isMajor ? 20 : 10;
        ctx.moveTo(Math.cos(a) * pr.radius, Math.sin(a) * pr.radius);
        ctx.lineTo(Math.cos(a) * (pr.radius - tickLength / camera.zoom), Math.sin(a) * (pr.radius - tickLength / camera.zoom));
      }
      ctx.stroke();

      // Draw center handle
      ctx.beginPath();
      ctx.arc(0, 0, 10 / camera.zoom, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.lineWidth = 1 / camera.zoom;
      ctx.strokeStyle = '#3b82f6';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 4 / camera.zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();

      // Draw rotate handle at peak (0, pr.radius)
      ctx.beginPath();
      ctx.arc(0, pr.radius, 15 / camera.zoom, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, pr.radius, 6 / camera.zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();

      ctx.restore();
    }

    if (rulerEnabled) {
      const p1 = rulerRef.current.p1;
      const p2 = rulerRef.current.p2;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const angleDeg = ((angle * 180 / Math.PI) % 360 + 360) % 360;

      ctx.save();
      ctx.translate(p1.x, p1.y);
      ctx.rotate(angle);

      // Width of the physical ruler body in world coordinates
      const rulerHeight = 44 / camera.zoom;

      // Ruler acrylic translucent body (below the inking guide line)
      ctx.beginPath();
      ctx.rect(0, 0, len, rulerHeight);
      ctx.fillStyle = 'rgba(238, 246, 255, 0.78)';
      ctx.fill();
      ctx.lineWidth = 1.5 / camera.zoom;
      ctx.strokeStyle = '#2563eb';
      ctx.stroke();

      // Top guide edge (the inking edge where pen strokes lock)
      const isDrawingAlongRuler = state.isDrawing && state.strokeConstraint === 'ruler';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(len, 0);
      ctx.lineWidth = (isDrawingAlongRuler ? 3.5 : 2.5) / camera.zoom;
      ctx.strokeStyle = isDrawingAlongRuler ? '#2563eb' : '#1d4ed8';
      ctx.stroke();

      // Tick marks along the ruler top edge
      const step = 25;
      const numTicks = Math.floor(len / step);
      ctx.beginPath();
      ctx.lineWidth = 1 / camera.zoom;
      ctx.strokeStyle = '#1e3a8a';
      for (let i = 0; i <= numTicks; i++) {
        const x = i * step;
        const isMajor = i % 4 === 0;
        const tickLength = (isMajor ? 14 : 7) / camera.zoom;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, tickLength);
      }
      ctx.stroke();

      // Numbers on major ticks
      ctx.fillStyle = '#1e3a8a';
      ctx.font = `600 ${Math.max(9, 10 / camera.zoom)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (let i = 0; i <= numTicks; i += 4) {
        const x = i * step;
        if (x > 15 && x < len - 15) {
          ctx.fillText(`${x}`, x, 16 / camera.zoom);
        }
      }

      // Center measurement readout badge & move handle
      const midX = len / 2;
      const badgeW = Math.max(120 / camera.zoom, Math.min(len - 40, 200 / camera.zoom));
      const badgeH = 26 / camera.zoom;
      const badgeY = rulerHeight * 0.45;

      if (badgeW > 60 / camera.zoom) {
        ctx.beginPath();
        ctx.roundRect(midX - badgeW / 2, badgeY, badgeW, badgeH, 6 / camera.zoom);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
        ctx.lineWidth = 1.5 / camera.zoom;
        ctx.strokeStyle = '#93c5fd';
        ctx.stroke();

        ctx.fillStyle = '#1e3a8a';
        ctx.font = `bold ${Math.max(10, 11 / camera.zoom)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const info = `✥ ${Math.round(len)} px  |  ${angleDeg.toFixed(1)}°`;
        ctx.fillText(info, midX, badgeY + badgeH / 2);
      }

      // Handle A (Point 1)
      ctx.beginPath();
      ctx.arc(0, 0, 14 / camera.zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2.5 / camera.zoom;
      ctx.strokeStyle = '#2563eb';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 4 / camera.zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#2563eb';
      ctx.fill();

      // Tag A
      ctx.font = `bold ${Math.max(10, 11 / camera.zoom)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#1d4ed8';
      ctx.fillText('A', 0, -6 / camera.zoom);

      // Handle B (Point 2)
      ctx.beginPath();
      ctx.arc(len, 0, 14 / camera.zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2.5 / camera.zoom;
      ctx.strokeStyle = '#2563eb';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(len, 0, 4 / camera.zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#2563eb';
      ctx.fill();

      // Tag B
      ctx.font = `bold ${Math.max(10, 11 / camera.zoom)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#1d4ed8';
      ctx.fillText('B', len, -6 / camera.zoom);

      ctx.restore();
    }

    ctx.restore();
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        render();
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const screenToWorld = (x: number, y: number): Point => {
    const camera = cameraRef.current;
    return {
      x: (x - camera.x) / camera.zoom,
      y: (y - camera.y) / camera.zoom,
      p: 0.5
    };
  };

  const checkProtractorGrab = (worldPt: Point) => {
    if (!protractorEnabled) return 'none';
    const pr = protractorRef.current;
    const dx = worldPt.x - pr.x;
    const dy = worldPt.y - pr.y;
    const localX = dx * Math.cos(-pr.rotation) - dy * Math.sin(-pr.rotation);
    const localY = dx * Math.sin(-pr.rotation) + dy * Math.cos(-pr.rotation);

    // Bias slightly towards the curve if exactly on the line
    if (localY >= -10 / cameraRef.current.zoom) {
      return 'protractor-arc';
    }
    return 'protractor-base';
  };

  const checkRulerGrab = (worldPt: Point, isTouch: boolean): 'none' | 'ruler-p1' | 'ruler-p2' | 'ruler-move' => {
    if (!rulerEnabled) return 'none';
    const { p1, p2 } = rulerRef.current;
    const zoom = cameraRef.current.zoom;

    // Dist to Point A (p1) handle
    const distA = Math.hypot(worldPt.x - p1.x, worldPt.y - p1.y);
    if (distA <= 26 / zoom) return 'ruler-p1';

    // Dist to Point B (p2) handle
    const distB = Math.hypot(worldPt.x - p2.x, worldPt.y - p2.y);
    if (distB <= 26 / zoom) return 'ruler-p2';

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    if (len <= 0.001) return 'none';

    const angle = Math.atan2(dy, dx);
    const diffX = worldPt.x - p1.x;
    const diffY = worldPt.y - p1.y;
    const localX = diffX * Math.cos(-angle) - diffY * Math.sin(-angle);
    const localY = diffX * Math.sin(-angle) + diffY * Math.cos(-angle);

    const rulerHeight = 44 / zoom;
    const midX = len / 2;
    const badgeW = Math.max(120 / zoom, Math.min(len - 40, 200 / zoom));
    const badgeH = 26 / zoom;
    const badgeY = rulerHeight * 0.45;

    // Central Move badge grab (works with pen, mouse, or touch)
    if (Math.abs(localX - midX) <= (badgeW / 2 + 8 / zoom) && localY >= badgeY - 6 / zoom && localY <= (badgeY + badgeH + 6 / zoom)) {
      return 'ruler-move';
    }

    // Touch pointer (finger): touching anywhere on the acrylic body can slide the ruler
    if (isTouch) {
      if (localX >= -10 / zoom && localX <= len + 10 / zoom && localY >= -6 / zoom && localY <= rulerHeight + 10 / zoom) {
        return 'ruler-move';
      }
    }

    return 'none';
  };

  const processPoint = (screenX: number, screenY: number, isStartPoint = false) => {
    const state = interactionStateRef.current;
    const pt = screenToWorld(screenX, screenY);
    pt.p = 0.5;

    if (isStartPoint && snapEnabled) {
      const GRID_SIZE = 50;
      pt.x = Math.round(pt.x / GRID_SIZE) * GRID_SIZE;
      pt.y = Math.round(pt.y / GRID_SIZE) * GRID_SIZE;
    }

    if (state.strokeConstraint === 'ruler') {
      const { p1, p2 } = rulerRef.current;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const angle = Math.atan2(dy, dx);

      const diffX = pt.x - p1.x;
      const diffY = pt.y - p1.y;
      const localX = diffX * Math.cos(-angle) - diffY * Math.sin(-angle);

      const snapLocalX = localX; // Move freely along the ruler's orientation
      const snapLocalY = state.lockedLocalY !== null ? state.lockedLocalY : 0;

      pt.x = p1.x + snapLocalX * Math.cos(angle) - snapLocalY * Math.sin(angle);
      pt.y = p1.y + snapLocalX * Math.sin(angle) + snapLocalY * Math.cos(angle);
      return pt;
    }

    if (state.strokeConstraint === 'protractor-base') {
      const pr = protractorRef.current;
      const dx = pt.x - pr.x;
      const dy = pt.y - pr.y;
      const localX = dx * Math.cos(-pr.rotation) - dy * Math.sin(-pr.rotation);

      const snapLocalX = localX; // Move freely along X
      const snapLocalY = state.lockedLocalY !== null ? state.lockedLocalY : 0;

      pt.x = pr.x + snapLocalX * Math.cos(pr.rotation) - snapLocalY * Math.sin(pr.rotation);
      pt.y = pr.y + snapLocalX * Math.sin(pr.rotation) + snapLocalY * Math.cos(pr.rotation);
      return pt;
    }

    if (state.strokeConstraint === 'protractor-arc') {
      const pr = protractorRef.current;
      const dx = pt.x - pr.x;
      const dy = pt.y - pr.y;
      const localX = dx * Math.cos(-pr.rotation) - dy * Math.sin(-pr.rotation);
      const localY = dx * Math.sin(-pr.rotation) + dy * Math.cos(-pr.rotation);

      let angle = Math.atan2(localY, localX);
      const radius = state.lockedRadius !== null ? state.lockedRadius : pr.radius;

      const snapLocalX = radius * Math.cos(angle);
      const snapLocalY = radius * Math.sin(angle);

      pt.x = pr.x + snapLocalX * Math.cos(pr.rotation) - snapLocalY * Math.sin(pr.rotation);
      pt.y = pr.y + snapLocalX * Math.sin(pr.rotation) + snapLocalY * Math.cos(pr.rotation);
      return pt;
    }

    if (state.strokeConstraint === 'angle' && state.currentStroke && state.currentStroke.points.length > 0 && !isStartPoint) {
      const origin = state.currentStroke.points[0];
      const dx = pt.x - origin.x;
      const dy = pt.y - origin.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (state.lockedAngle === null) {
        if (dist > 15 / cameraRef.current.zoom) {
          const angle = Math.atan2(dy, dx);
          const step = Math.PI / 12; // 15 degrees
          state.lockedAngle = Math.round(angle / step) * step;
        } else {
          const tempAngle = Math.round(Math.atan2(dy, dx) / (Math.PI / 12)) * (Math.PI / 12);
          const dirX = Math.cos(tempAngle);
          const dirY = Math.sin(tempAngle);
          const dot = dx * dirX + dy * dirY;
          pt.x = origin.x + dot * dirX;
          pt.y = origin.y + dot * dirY;
          return pt;
        }
      }

      if (state.lockedAngle !== null) {
        const dirX = Math.cos(state.lockedAngle);
        const dirY = Math.sin(state.lockedAngle);
        const dot = dx * dirX + dy * dirY;
        pt.x = origin.x + dot * dirX;
        pt.y = origin.y + dot * dirY;
        return pt;
      }
    }

    if (!isStartPoint && snapEnabled && state.strokeConstraint === 'none') {
      const GRID_SIZE = 50;
      pt.x = Math.round(pt.x / GRID_SIZE) * GRID_SIZE;
      pt.y = Math.round(pt.y / GRID_SIZE) * GRID_SIZE;
    }

    return pt;
  };

  const findStrokeAt = (worldPt: Point) => {
    const camera = cameraRef.current;
    const thresholdSq = Math.pow(15 / camera.zoom, 2);
    const activeLayer = mutableLayersRef.current.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked || !activeLayer.visible) return null;

    const strokes = activeLayer.strokes;
    for (let i = strokes.length - 1; i >= 0; i--) {
      const stroke = strokes[i];
      if (stroke.type === 'box-grid' && stroke.points.length >= 2) {
        const p0 = stroke.points[0];
        const p1 = stroke.points[1];
        const size = stroke.boxData?.size || 50;

        const minXRaw = Math.min(p0.x, p1.x);
        const maxXRaw = Math.max(p0.x, p1.x);
        const minYRaw = Math.min(p0.y, p1.y);
        const maxYRaw = Math.max(p0.y, p1.y);

        const minX = Math.floor(minXRaw / size) * size;
        const maxX = Math.max(minX + size, Math.ceil(maxXRaw / size) * size);
        const minY = Math.floor(minYRaw / size) * size;
        const maxY = Math.max(minY + size, Math.ceil(maxYRaw / size) * size);

        if (worldPt.x >= minX && worldPt.x <= maxX && worldPt.y >= minY && worldPt.y <= maxY) {
          return { stroke, index: i, layer: activeLayer };
        }
      } else {
        for (let j = 0; j < stroke.points.length - 1; j++) {
          if (distToSegmentSq(worldPt, stroke.points[j], stroke.points[j + 1]) < thresholdSq) {
            return { stroke, index: i, layer: activeLayer };
          }
        }
      }
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = interactionStateRef.current;
    const touches = activeTouchesRef.current;

    e.currentTarget.setPointerCapture(e.pointerId);

    const isPenOnly = inputMode === 'pen-only';

    if (e.pointerType === 'touch') {
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touches.size >= 2) {
        if (state.isDrawing) {
          if (state.currentStroke) {
            const activeLayer = mutableLayersRef.current.find(l => l.id === activeLayerId);
            if (activeLayer) {
              const idx = activeLayer.strokes.findIndex(s => s.id === state.currentStroke?.id);
              if (idx !== -1) activeLayer.strokes.splice(idx, 1);
            }
            state.currentStroke = null;
          }
          state.isDrawing = false;
          state.movingStroke = null;
          state.moveStartPoint = null;
          state.selectionBox = null;
          state.isMovingSelection = false;
        }
        state.interactingWith = 'none';

        // Pre-seed pinch distance and center so pinch-to-zoom/pan starts immediately
        const pts: { x: number; y: number }[] = Array.from(touches.values());
        state.lastPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        state.lastPinchCenter = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };

        render();
        return;
      }
    }

    const isTouch = e.pointerType === 'touch';
    const initialWorldPt = screenToWorld(e.clientX, e.clientY);

    // Guide interactions (draggable with pen, mouse, or touch)
    if (rulerEnabled) {
      const rulerGrab = checkRulerGrab(initialWorldPt, isTouch);
      if (rulerGrab === 'ruler-p1' || rulerGrab === 'ruler-p2') {
        state.interactingWith = rulerGrab;
        return;
      } else if (rulerGrab === 'ruler-move') {
        state.interactingWith = 'ruler-move';
        state.moveStartPoint = initialWorldPt;
        return;
      }
    }

    if (protractorEnabled) {
      const pr = protractorRef.current;
      const distCenter = Math.hypot(initialWorldPt.x - pr.x, initialWorldPt.y - pr.y);
      if (distCenter < 35 / cameraRef.current.zoom) {
        state.interactingWith = 'protractor-move';
        return;
      }

      const peakX = pr.x - pr.radius * Math.sin(pr.rotation);
      const peakY = pr.y + pr.radius * Math.cos(pr.rotation);
      const distPeak = Math.hypot(initialWorldPt.x - peakX, initialWorldPt.y - peakY);
      if (distPeak < 35 / cameraRef.current.zoom) {
        state.interactingWith = 'protractor-rotate';
        return;
      }
    }

    // Inking & drafting strokes:
    // Pen & Mouse button 1 can always draw.
    // In Touch Mode (!isPenOnly), single finger touch ALSO draws just like the pen!
    const canDraw = e.pointerType === 'pen' ||
                    (e.pointerType === 'mouse' && e.buttons === 1) ||
                    (e.pointerType === 'touch' && !isPenOnly && touches.size === 1);
    if (!canDraw) {
      return;
    }

    const activeLayer = mutableLayersRef.current.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked || !activeLayer.visible) return;

    const activeTool = (e.pointerType === 'pen' && e.button === 5) ? 'erase' : tool;
    state.isDrawing = true;

    // Check stroke constraint
    state.strokeConstraint = 'none';

    if (rulerEnabled && protractorEnabled) {
      const { p1, p2 } = rulerRef.current;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const lenSq = dx * dx + dy * dy;
      let rulerDist = 999999;
      if (lenSq > 0) {
        const t = Math.max(0, Math.min(1, ((initialWorldPt.x - p1.x) * dx + (initialWorldPt.y - p1.y) * dy) / lenSq));
        rulerDist = Math.hypot(initialWorldPt.x - (p1.x + t * dx), initialWorldPt.y - (p1.y + t * dy));
      }
      const protractorDist = Math.hypot(initialWorldPt.x - protractorRef.current.x, initialWorldPt.y - protractorRef.current.y);
      if (rulerDist <= protractorDist) {
        state.strokeConstraint = 'ruler';
      } else {
        state.strokeConstraint = checkProtractorGrab(initialWorldPt);
      }
    } else if (rulerEnabled) {
      state.strokeConstraint = 'ruler';
    } else if (protractorEnabled) {
      state.strokeConstraint = checkProtractorGrab(initialWorldPt);
    }

    if (state.strokeConstraint === 'ruler') {
      const { p1, p2 } = rulerRef.current;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const angle = Math.atan2(dy, dx);
      const diffX = initialWorldPt.x - p1.x;
      const diffY = initialWorldPt.y - p1.y;
      const localY = diffX * Math.sin(-angle) + diffY * Math.cos(-angle);

      // If started within 18px of the top inking edge of the ruler, snap directly onto the ruler guide edge (localY = 0)
      if (Math.abs(localY) <= 18 / cameraRef.current.zoom) {
        state.lockedLocalY = 0;
      } else {
        // Otherwise, allow drawing a straight line from wherever the user starts drawing (just like protractor)
        state.lockedLocalY = localY;
      }
    }

    if (state.strokeConstraint === 'protractor-arc' || state.strokeConstraint === 'protractor-base') {
      const pr = protractorRef.current;
      const dx = initialWorldPt.x - pr.x;
      const dy = initialWorldPt.y - pr.y;
      const localX = dx * Math.cos(-pr.rotation) - dy * Math.sin(-pr.rotation);
      const localY = dx * Math.sin(-pr.rotation) + dy * Math.cos(-pr.rotation);

      if (state.strokeConstraint === 'protractor-arc') {
        state.lockedRadius = Math.hypot(localX, localY);
      } else if (state.strokeConstraint === 'protractor-base') {
        state.lockedLocalY = localY;
      }
    }

    if (state.strokeConstraint === 'none' && angleGuidesEnabled) {
      state.strokeConstraint = 'angle';
    }
    state.lockedAngle = null;

    const pt = processPoint(e.clientX, e.clientY, true);
    pt.p = e.pressure || (e.pointerType === 'touch' ? 0.75 : 0.5);

    if (activeTool === 'pen' || activeTool === 'line') {
      state.currentStroke = { id: Math.random().toString(), type: activeTool, points: [pt], color };
      activeLayer.strokes.push(state.currentStroke);
    } else if (activeTool === 'box-grid') {
      state.currentStroke = {
        id: Math.random().toString(),
        type: activeTool,
        points: [pt, { ...pt }],
        color,
        boxData: { size: 50, startNumber: boxGridStartNumber, shape: boxGridShape, showNumber: boxGridNumbered }
      };
      activeLayer.strokes.push(state.currentStroke);
    } else if (activeTool === 'erase') {
      const hit = findStrokeAt(pt);
      if (hit) {
        hit.layer.strokes.splice(hit.index, 1);
      }
    } else if (activeTool === 'move') {
      const hit = findStrokeAt(pt);
      if (hit) {
        state.movingStroke = hit.stroke;
        state.moveStartPoint = pt;
      }
    } else if (activeTool === 'select') {
      const hit = findStrokeAt(pt);
      if (hit && state.selectedStrokeIds.includes(hit.stroke.id)) {
        state.isMovingSelection = true;
        state.moveStartPoint = pt;
      } else if (hit) {
        state.selectedStrokeIds = [hit.stroke.id];
        state.isMovingSelection = true;
        state.moveStartPoint = pt;
      } else {
        state.selectedStrokeIds = [];
        state.selectionBox = { start: pt, end: pt };
      }
    }
    render();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = interactionStateRef.current;
    const touches = activeTouchesRef.current;
    const camera = cameraRef.current;
    const isPenOnly = inputMode === 'pen-only';

    if (e.pointerType === 'touch') {
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (touches.size >= 2) {
        const pts: { x: number; y: number }[] = Array.from(touches.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const centerX = (pts[0].x + pts[1].x) / 2;
        const centerY = (pts[0].y + pts[1].y) / 2;

        if (state.lastPinchDist && state.lastPinchCenter) {
          camera.x += (centerX - state.lastPinchCenter.x);
          camera.y += (centerY - state.lastPinchCenter.y);

          const scale = dist / state.lastPinchDist;
          const newZoom = camera.zoom * scale;

          camera.x = centerX - (centerX - camera.x) * scale;
          camera.y = centerY - (centerY - camera.y) * scale;
          camera.zoom = Math.max(0.1, Math.min(newZoom, 20));
        }
        state.lastPinchDist = dist;
        state.lastPinchCenter = { x: centerX, y: centerY };
        render();
        onCameraChange?.(camera);
        return;
      } else {
        state.lastPinchDist = null;
        state.lastPinchCenter = null;
        if (isPenOnly && state.interactingWith === 'none') {
          return;
        }
      }
    }

    // Ruler handles movement
    if (state.interactingWith === 'ruler-p1') {
      const pt = screenToWorld(e.clientX, e.clientY);
      if (snapEnabled) {
        const GRID_SIZE = 50;
        pt.x = Math.round(pt.x / GRID_SIZE) * GRID_SIZE;
        pt.y = Math.round(pt.y / GRID_SIZE) * GRID_SIZE;
      }
      rulerRef.current.p1 = pt;
      render();
      return;
    }

    if (state.interactingWith === 'ruler-p2') {
      const pt = screenToWorld(e.clientX, e.clientY);
      if (snapEnabled) {
        const GRID_SIZE = 50;
        pt.x = Math.round(pt.x / GRID_SIZE) * GRID_SIZE;
        pt.y = Math.round(pt.y / GRID_SIZE) * GRID_SIZE;
      }
      rulerRef.current.p2 = pt;
      render();
      return;
    }

    if (state.interactingWith === 'ruler-move') {
      const pt = screenToWorld(e.clientX, e.clientY);
      if (state.moveStartPoint) {
        const dx = pt.x - state.moveStartPoint.x;
        const dy = pt.y - state.moveStartPoint.y;
        rulerRef.current.p1.x += dx;
        rulerRef.current.p1.y += dy;
        rulerRef.current.p2.x += dx;
        rulerRef.current.p2.y += dy;
        state.moveStartPoint = pt;
      }
      render();
      return;
    }

    // Protractor handles movement
    if (state.interactingWith === 'protractor-move') {
      const pt = screenToWorld(e.clientX, e.clientY);
      protractorRef.current.x = pt.x;
      protractorRef.current.y = pt.y;
      render();
      return;
    }
    if (state.interactingWith === 'protractor-rotate') {
      const pt = screenToWorld(e.clientX, e.clientY);
      const pr = protractorRef.current;
      const dx = pt.x - pr.x;
      const dy = pt.y - pr.y;
      pr.radius = Math.max(50, Math.hypot(dx, dy));
      pr.rotation = Math.atan2(dy, dx) - Math.PI / 2;
      render();
      return;
    }

    const canDraw = e.pointerType === 'pen' ||
                    (e.pointerType === 'mouse' && e.buttons === 1) ||
                    (e.pointerType === 'touch' && !isPenOnly && touches.size === 1);
    if (!canDraw) {
      return;
    }

    if (state.isDrawing) {
      const activeTool = (e.pointerType === 'pen' && e.buttons === 32) ? 'erase' : tool;
      const pt = processPoint(e.clientX, e.clientY, false);
      pt.p = e.pressure || (e.pointerType === 'touch' ? 0.75 : 0.5);

      if (activeTool === 'pen' && state.currentStroke) {
        state.currentStroke.points.push(pt);
      } else if ((activeTool === 'line' || activeTool === 'box-grid') && state.currentStroke) {
        if (state.currentStroke.points.length === 1) {
          state.currentStroke.points.push(pt);
        } else {
          state.currentStroke.points[1] = pt;
        }
      } else if (activeTool === 'erase') {
        const hit = findStrokeAt(pt);
        if (hit) {
          hit.layer.strokes.splice(hit.index, 1);
        }
      } else if (activeTool === 'move' && state.movingStroke && state.moveStartPoint) {
        const dx = pt.x - state.moveStartPoint.x;
        const dy = pt.y - state.moveStartPoint.y;
        for (let p of state.movingStroke.points) {
          p.x += dx;
          p.y += dy;
        }
        state.moveStartPoint = pt;
      } else if (activeTool === 'select') {
        if (state.isMovingSelection && state.moveStartPoint) {
          const dx = pt.x - state.moveStartPoint.x;
          const dy = pt.y - state.moveStartPoint.y;
          const activeLayer = mutableLayersRef.current.find(l => l.id === activeLayerId);
          if (activeLayer) {
            for (const stroke of activeLayer.strokes) {
              if (state.selectedStrokeIds.includes(stroke.id)) {
                for (const p of stroke.points) {
                  p.x += dx;
                  p.y += dy;
                }
              }
            }
          }
          state.moveStartPoint = pt;
        } else if (state.selectionBox) {
          state.selectionBox.end = pt;
        }
      }
      render();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = interactionStateRef.current;
    const touches = activeTouchesRef.current;

    const isPenOnly = inputMode === 'pen-only';

    // Always unconditionally clean up touch pointers to prevent any stale touch state
    if (e.pointerType === 'touch') {
      touches.delete(e.pointerId);
      if (touches.size < 2) {
        state.lastPinchDist = null;
        state.lastPinchCenter = null;
      }
      if (isPenOnly && state.interactingWith === 'none') {
        return;
      }
    }

    if (state.interactingWith !== 'none') {
      state.interactingWith = 'none';
      render();
      return;
    }

    const canDraw = e.pointerType === 'pen' ||
                    e.pointerType === 'mouse' ||
                    (e.pointerType === 'touch' && !isPenOnly);
    if (canDraw) {
      if (state.selectionBox) {
        const { start, end } = state.selectionBox;
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);

        const activeLayer = mutableLayersRef.current.find(l => l.id === activeLayerId);
        if (activeLayer && !activeLayer.locked && activeLayer.visible) {
          state.selectedStrokeIds = activeLayer.strokes.filter(s =>
            s.points.some(p => p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY)
          ).map(s => s.id);
        }
        state.selectionBox = null;
        render();
      } else if (state.isMovingSelection) {
        onLayersChange(JSON.parse(JSON.stringify(mutableLayersRef.current)));
        state.isMovingSelection = false;
      } else if (state.isDrawing) {
        if (state.currentStroke && state.currentStroke.type === 'box-grid' && state.currentStroke.points.length >= 2) {
          const activeLayer = mutableLayersRef.current.find(l => l.id === activeLayerId);
          if (activeLayer) {
            activeLayer.strokes = activeLayer.strokes.filter(s => s.id !== state.currentStroke!.id);
            const stroke = state.currentStroke;
            const p0 = stroke.points[0];
            const p1 = stroke.points[1];
            const size = stroke.boxData?.size || 50;
            const isLine = stroke.boxData?.shape === 'line';
            const showNumber = stroke.boxData?.showNumber ?? true;

            let cells: { x: number, y: number }[] = [];

            if (isLine) {
              const gx0 = Math.floor(p0.x / size);
              const gy0 = Math.floor(p0.y / size);
              const gx1 = Math.floor(p1.x / size);
              const gy1 = Math.floor(p1.y / size);

              const dx = gx1 - gx0;
              const dy = gy1 - gy0;
              const steps = Math.max(Math.abs(dx), Math.abs(dy));

              if (steps === 0) {
                cells.push({ x: gx0 * size, y: gy0 * size });
              } else {
                for (let i = 0; i <= steps; i++) {
                  cells.push({
                    x: Math.round(gx0 + (dx * i) / steps) * size,
                    y: Math.round(gy0 + (dy * i) / steps) * size
                  });
                }
              }
            } else {
              const minXRaw = Math.min(p0.x, p1.x);
              const maxXRaw = Math.max(p0.x, p1.x);
              const minYRaw = Math.min(p0.y, p1.y);
              const maxYRaw = Math.max(p0.y, p1.y);

              const minX = Math.floor(minXRaw / size) * size;
              const maxX = Math.max(minX + size, Math.ceil(maxXRaw / size) * size);
              const minY = Math.floor(minYRaw / size) * size;
              const maxY = Math.max(minY + size, Math.ceil(maxYRaw / size) * size);

              const cols = Math.max(1, Math.round((maxX - minX) / size));
              const rows = Math.max(1, Math.round((maxY - minY) / size));

              const dirX = p1.x >= p0.x ? 1 : -1;
              const dirY = p1.y >= p0.y ? 1 : -1;

              for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                  const r = dirY === 1 ? i : rows - 1 - i;
                  const c = dirX === 1 ? j : cols - 1 - j;
                  cells.push({
                    x: minX + c * size,
                    y: minY + r * size
                  });
                }
              }
            }

            let currentNum = stroke.boxData?.startNumber || 1;
            for (const cell of cells) {
              activeLayer.strokes.push({
                id: Math.random().toString(),
                type: 'box-grid',
                color: stroke.color,
                points: [{ x: cell.x + size/2, y: cell.y + size/2, p: 1 }, { x: cell.x + size/2, y: cell.y + size/2, p: 1 }],
                boxData: { size, startNumber: currentNum++, showNumber }
              });
            }
          }
        }
        onLayersChange(JSON.parse(JSON.stringify(mutableLayersRef.current)));
      }
      state.isDrawing = false;
      state.currentStroke = null;
      state.movingStroke = null;
      state.moveStartPoint = null;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={e => e.preventDefault()}
      className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
    />
  );
});

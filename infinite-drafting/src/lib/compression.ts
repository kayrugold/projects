// Utilities for stroke point optimization and gzip compression
import { Layer, Camera } from '../types';

/**
 * Optimizes coordinates to 1 decimal place and pressure to 2 decimal places.
 * Sub-pixel floating point precision beyond 1 decimal is imperceptible on screen
 * but consumes massive amounts of bytes in JSON.
 */
export function optimizeLayers(layers: Layer[]): Layer[] {
  return layers.map(layer => ({
    ...layer,
    strokes: layer.strokes.map(stroke => ({
      ...stroke,
      points: stroke.points.map(pt => ({
        x: Math.round(pt.x * 10) / 10,
        y: Math.round(pt.y * 10) / 10,
        p: Math.round((pt.p !== undefined ? pt.p : 0.5) * 100) / 100
      }))
    }))
  }));
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 16384;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return btoa(binary);
}

function base64ToUint8Array(b64: string): Uint8Array {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Compresses a string using the browser's native CompressionStream (gzip)
 */
export async function compressString(str: string): Promise<string> {
  if (typeof CompressionStream === 'undefined') {
    return str;
  }
  const stream = new Blob([str]).stream().pipeThrough(new CompressionStream('gzip'));
  const buffer = await new Response(stream).arrayBuffer();
  return uint8ArrayToBase64(new Uint8Array(buffer));
}

/**
 * Decompresses a base64 gzip string using native DecompressionStream
 */
export async function decompressString(b64: string): Promise<string> {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('DecompressionStream is not supported in this environment');
  }
  const bytes = base64ToUint8Array(b64);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return await new Response(stream).text();
}

export interface SessionDataPayload {
  layers: Layer[];
  camera?: Camera;
}

/**
 * Encodes layers and optional camera viewport into a compact string (compressed if possible)
 */
export async function serializeSessionData(layers: Layer[], camera?: Camera): Promise<string> {
  const optimized = optimizeLayers(layers);
  const payload = camera ? { layers: optimized, camera } : { layers: optimized };
  const rawJson = JSON.stringify(payload);
  try {
    const compressed = await compressString(rawJson);
    const gzResult = `gz:${compressed}`;
    if (gzResult.length < rawJson.length) {
      return gzResult;
    }
  } catch (e) {
    console.warn('Gzip compression skipped, using raw JSON', e);
  }
  return rawJson;
}

/**
 * Decodes layers and camera from either compressed (gz:...) or raw JSON
 */
export async function deserializeSessionData(layersData: string): Promise<SessionDataPayload> {
  let parsed: any;
  if (layersData.startsWith('gz:')) {
    const b64 = layersData.slice(3);
    const json = await decompressString(b64);
    parsed = JSON.parse(json);
  } else {
    parsed = JSON.parse(layersData);
  }

  if (Array.isArray(parsed)) {
    return { layers: parsed, camera: undefined };
  } else if (parsed && Array.isArray(parsed.layers)) {
    return { layers: parsed.layers, camera: parsed.camera };
  }
  return { layers: [], camera: undefined };
}

/**
 * Encodes layers into a compact string (compressed if possible)
 */
export async function serializeLayers(layers: Layer[]): Promise<string> {
  return serializeSessionData(layers);
}

/**
 * Decodes layers from either compressed (gz:...) or raw JSON
 */
export async function deserializeLayers(layersData: string): Promise<Layer[]> {
  const res = await deserializeSessionData(layersData);
  return res.layers;
}


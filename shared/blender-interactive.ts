export const INTERACTIVE_BLENDER_POLICY = 'linux-private-xvfb-blender-v1';
export type BlenderInput = { kind: 'click'; x: number; y: number } | { kind: 'key'; key: 'Escape' | 'Return' | 'Tab' | 'Delete' | 'g' | 'r' | 's' | 'x' | 'y' | 'z' | 'a' } | { kind: 'text'; text: string };
export function validateBlenderInput(value: unknown): BlenderInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid dedicated Blender input.');
  const input = value as Record<string, unknown>;
  const keys = Object.keys(input).sort().join();
  if (input.kind === 'click' && keys === 'kind,x,y' && Number.isInteger(input.x) && Number.isInteger(input.y) && Number(input.x) >= 0 && Number(input.x) < 960 && Number(input.y) >= 0 && Number(input.y) < 640) return input as BlenderInput;
  if (input.kind === 'key' && keys === 'key,kind' && ['Escape','Return','Tab','Delete','g','r','s','x','y','z','a'].includes(String(input.key))) return input as BlenderInput;
  if (input.kind === 'text' && keys === 'kind,text' && typeof input.text === 'string' && /^[-+0-9. ]{1,64}$/.test(input.text)) return input as BlenderInput;
  throw new Error('Use a viewport click, supported Blender key or bounded numeric text; scripts, paths, clipboard and arbitrary desktop input are unavailable.');
}

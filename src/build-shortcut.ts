export type BuildShortcutPreference='disabled'|'alt+x'|'alt+s'|'alt+y';

export const BUILD_SHORTCUT_STORAGE_KEY='cocreate-build-shortcut';

export function defaultBuildShortcut(isMac:boolean):BuildShortcutPreference{
  return isMac?'disabled':'alt+x';
}

export function readBuildShortcut(storage:Pick<Storage,'getItem'>,isMac:boolean):BuildShortcutPreference{
  const value=storage.getItem(BUILD_SHORTCUT_STORAGE_KEY);
  return value==='disabled'||value==='alt+x'||value==='alt+s'||value==='alt+y'?value:defaultBuildShortcut(isMac);
}

export function shortcutLabel(value:BuildShortcutPreference){
  return value==='disabled'?'Disabled':`Alt + ${value.at(-1)!.toUpperCase()}`;
}

export function ariaShortcut(value:BuildShortcutPreference){
  return value==='disabled'?undefined:`Alt+${value.at(-1)!.toUpperCase()}`;
}

type ShortcutEvent=Pick<KeyboardEvent,'key'|'altKey'|'ctrlKey'|'shiftKey'|'metaKey'|'repeat'|'isComposing'|'getModifierState'>;

export function isBuildShortcut(event:ShortcutEvent,preference:BuildShortcutPreference){
  if(preference==='disabled'||event.repeat||event.isComposing||event.getModifierState('AltGraph'))return false;
  if(!event.altKey||event.ctrlKey||event.shiftKey||event.metaKey)return false;
  return event.key.toLowerCase()===preference.at(-1);
}

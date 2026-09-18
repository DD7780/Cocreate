import assert from'node:assert/strict';
import test from'node:test';
import{ariaShortcut,defaultBuildShortcut,isBuildShortcut,readBuildShortcut,shortcutLabel}from'../src/build-shortcut.js';

const event=(overrides:Partial<KeyboardEvent>={})=>({
  key:'x',altKey:true,ctrlKey:false,shiftKey:false,metaKey:false,repeat:false,isComposing:false,
  getModifierState:(name:string)=>name==='AltGraph'?false:false,
  ...overrides,
})as KeyboardEvent;

test('Alt+X is exact and ignores repeats, composition, AltGraph and extra modifiers',()=>{
  assert.equal(isBuildShortcut(event(),'alt+x'),true);
  assert.equal(isBuildShortcut(event({repeat:true}),'alt+x'),false);
  assert.equal(isBuildShortcut(event({isComposing:true}),'alt+x'),false);
  assert.equal(isBuildShortcut(event({ctrlKey:true}),'alt+x'),false);
  assert.equal(isBuildShortcut(event({shiftKey:true}),'alt+x'),false);
  assert.equal(isBuildShortcut(event({metaKey:true}),'alt+x'),false);
  assert.equal(isBuildShortcut(event({altKey:false}),'alt+x'),false);
  assert.equal(isBuildShortcut(event({key:'Enter'}),'alt+x'),false);
  assert.equal(isBuildShortcut(event({key:'b'}),'alt+x'),false);
  assert.equal(isBuildShortcut(event({getModifierState:(name:string)=>name==='AltGraph'}),'alt+x'),false);
});

test('preferences disable or remap the shortcut and macOS defaults to disabled',()=>{
  assert.equal(defaultBuildShortcut(false),'alt+x');
  assert.equal(defaultBuildShortcut(true),'disabled');
  assert.equal(readBuildShortcut({getItem:()=>null},true),'disabled');
  assert.equal(readBuildShortcut({getItem:()=> 'alt+s'},false),'alt+s');
  assert.equal(isBuildShortcut(event({key:'s'}),'alt+s'),true);
  assert.equal(isBuildShortcut(event(),'alt+s'),false);
  assert.equal(isBuildShortcut(event(),'disabled'),false);
  assert.equal(shortcutLabel('alt+x'),'Alt + X');
  assert.equal(ariaShortcut('alt+x'),'Alt+X');
  assert.equal(ariaShortcut('disabled'),undefined);
});

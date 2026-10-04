// This function runs in a separate CDP isolated world, with pristine browser DOM prototypes.
// Page scripts cannot replace these assertions or the parent's criterion/plan hashes.
function inspectList(action) {
  const visible = (element) => element.getClientRects().length > 0 &&
    getComputedStyle(element).visibility !== 'hidden' && getComputedStyle(element).opacity !== '0' && !element.closest('[hidden]');
  const root = document.getElementById('root');
  const list = [...root.querySelectorAll('ul,ol,[role="list"],tbody')].find(visible);
  const items = list ? [...list.children].filter(visible) : [...root.querySelectorAll('article')].filter(visible);
  const names = items.map(element => (element.querySelector('h2,h3,h4')?.textContent || element.firstChild?.textContent || element.textContent || '').trim());
  const label = (element) => [element.getAttribute('aria-label'), element.getAttribute('placeholder'),
    ...((element).labels || [])].map(value => typeof value === 'string' ? value : value?.textContent || '').join(' ');
  const controls = [...root.querySelectorAll('input,select,button')].filter(visible);
  const control = controls.find(element => action.kind === 'filter' ?
    /filter|search/i.test(label(element)) && (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) :
    action.kind === 'favorites' ? /favou?rite/i.test(label(element) + element.textContent) &&
      (element instanceof HTMLButtonElement || (element instanceof HTMLInputElement && element.type === 'checkbox')) :
      /sort/i.test(label(element) + element.textContent) && (element instanceof HTMLButtonElement || element instanceof HTMLSelectElement));
  if (control && action.step !== 'inspect') {
    if (control instanceof HTMLInputElement && control.type !== 'checkbox') {
      control.focus(); control.value = action.step === 'reset' ? '' : action.value;
      control.dispatchEvent(new Event('input', {bubbles: true})); control.dispatchEvent(new Event('change', {bubbles: true}));
    } else if (control instanceof HTMLSelectElement) {
      control.value = action.value; control.dispatchEvent(new Event('change', {bubbles: true}));
    } else (control).click();
  }
  return {implemented: !!control && !(control).disabled && items.length >= 2,
    names, state: control instanceof HTMLInputElement ? String(control.checked) : control?.getAttribute('aria-pressed'),
    controlType: control?.tagName, options: control instanceof HTMLSelectElement ? [...control.options].map(option => ({value: option.value, label: option.textContent})) : [],
    query: names.flatMap(name => name.match(/[\p{L}\p{N}]+/gu) || []).find(word => names.filter(name => name.toLowerCase().includes(word.toLowerCase())).length === 1)};
}

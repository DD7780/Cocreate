const defaultRefreshLeewayMs=60_000;

export function needsSessionRefresh(expiresAtSeconds:number|undefined,nowMs=Date.now(),leewayMs=defaultRefreshLeewayMs){
  return !expiresAtSeconds||expiresAtSeconds*1_000<=nowMs+leewayMs;
}

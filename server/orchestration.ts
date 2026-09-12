export const shouldPromoteRevision = (completedRevision:number, requestedRevision:number) => completedRevision === requestedRevision;
export function keepLastSuccess<T>(lastSuccessful:T|undefined, candidate:T|undefined, error?:unknown) { return error || candidate === undefined ? lastSuccessful : candidate; }

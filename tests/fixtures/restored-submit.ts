import type {RoomManager,Room} from '../../server/rooms.js';

/** The restored interaction uses classic submit; these retained tests do not simulate a capture receipt. */
export async function submitAndProcess(manager:RoomManager,room:Room,actorId:string,requestId:string){
  return manager.submitChanges(room,actorId,requestId);
}

import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type TimerId = bigint;
export interface _SERVICE {
  'cancelTimer' : ActorMethod<[TimerId], undefined>,
  'getRandomPrompt' : ActorMethod<[], string>,
  'getWritings' : ActorMethod<[], Array<[string, string]>>,
  'saveWriting' : ActorMethod<[string, string], undefined>,
  'startTimer' : ActorMethod<[], TimerId>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

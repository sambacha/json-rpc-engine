
import { IEthereumRpcError } from 'eth-rpc-errors/@types'

/**
 * A String specifying the version of the JSON-RPC protocol.
 * MUST be exactly "2.0".
 */
export type JsonRpcVersion = "2.0";

/** Method names that begin with the word rpc followed by a period character
 * (U+002E or ASCII 46) are reserved for rpc-internal methods and extensions
 * and MUST NOT be used for anything else.
 */
export type JsonRpcReservedMethod = string;

/**
 * An identifier established by the Client that MUST contain a String, Number,
 * or NULL value if included. If it is not included it is assumed to be a
 * notification. The value SHOULD normally not be Null and Numbers SHOULD
 * NOT contain fractional parts.
 */
export type JsonRpcId = number | string | void;

export interface JsonRpcError<T> extends IEthereumRpcError<T> {}

export interface JsonRpcRequest<T> {
  jsonrpc: JsonRpcVersion;
  method: string;
  id: JsonRpcId;
  params?: T;
}

export interface JsonRpcNotification<T> {
  jsonrpc: JsonRpcVersion;
  method: string,
  params?: T;
}

interface JsonRpcResponseBase {
  jsonrpc: JsonRpcVersion,
  id: JsonRpcId,
}

export interface JsonRpcSuccess<T> extends JsonRpcResponseBase {
  result: T;
}

export interface JsonRpcFailure<T> extends JsonRpcResponseBase {
  error: JsonRpcError<T>;
}

export type JsonRpcResponse<T> = JsonRpcSuccess<T> | JsonRpcFailure<T>

export type JsonRpcEngineEndCallback = (error?: JsonRpcError<unknown>) => void;
export type JsonRpcEngineNextCallback = (
  returnFlightCallback?: (done: () => void) => void,
) => void;

export interface JsonRpcMiddleware {
  (
    req: JsonRpcRequest<unknown>,
    res: JsonRpcResponse<unknown>,
    next: JsonRpcEngineNextCallback,
    end: JsonRpcEngineEndCallback,
  ) : void;
}

export interface JsonRpcEngine {
  push: (middleware: JsonRpcMiddleware) => void;
  handle: (
    req: JsonRpcRequest<unknown>,
    callback: (
      error: JsonRpcError<unknown>,
      res: JsonRpcResponse<unknown>,
    ) => void,
  ) => void;
}

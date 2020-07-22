import {ProviderOptions} from "@ganache/options";
import Emittery from "emittery";
import {types, utils} from "@ganache/utils";
import JsonRpc from "@ganache/utils/src/things/jsonrpc";
import FilecoinApi from "./api";
import { string } from "yargs";

// Meant to mimic this provider: 
// https://github.com/filecoin-shipyard/js-lotus-client-provider-browser
export default class FilecoinProvider extends Emittery.Typed<undefined, "message" | "connect" | "disconnect"> 
  // Do I actually need this? `types.Provider` doesn't actually define anything behavior
  implements types.Provider<FilecoinApi>
  {

  #options: ProviderOptions;
  #api: FilecoinApi;
  #executor: utils.Executor;

  // Used by the original Filecoin provider. Will mimic them for now.
  // Not entirely sure they're needed.
  #connectPromise: PromiseLike<never>;

  constructor(providerOptions: ProviderOptions = null, executor: utils.Executor) {
    super();
    this.#options = ProviderOptions.getDefault(providerOptions);

    this.#executor = executor;
    this.#api = new FilecoinApi({}, this);
  }

  async connect () {
    if (this.#connectPromise) {
      this.#connectPromise = new Promise((resolve) => {resolve();});
    }
    return this.#connectPromise;
  }

  async send(payload: JsonRpc.Request<FilecoinApi>) {
    return this.#executor.execute(this.#api, payload.method, []).then(result => {
      const promise = result.value as PromiseLike<ReturnType<FilecoinApi[JsonRpc.Request<FilecoinApi>["method"]]>>;
      
      return promise.then(JSON.stringify).then(JSON.parse);
    });
  }

  async sendHttp () {
    throw new Error("Method not supported (sendHttp)");
  }

  async sendWs () {
    throw new Error("Method not supported (sendWs)");
  }

  async sendSubscription () {
    throw new Error("Method not supported (sendSubscription)");
  }

  async receive () {
    throw new Error("Method not supported (receive)");
  }

  async import () {
    throw new Error("Method not supported (import)");
  }

  async destroy () {
    throw new Error("Method not supported (destroy)");
  }
}
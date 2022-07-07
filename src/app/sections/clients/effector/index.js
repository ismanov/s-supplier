import { combine } from "effector";
import * as effects from "./effects";
import * as events from "./events";
import * as stores from "./stores";

export default {
  store: combine(stores),
  effects,
  events
}
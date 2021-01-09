import initMixin from "./initMixin.js";
import { lifecycleMixin } from "./lifecycle.js";
import { initRenderMixin } from "./render.js";

function Vue(options) {
  this._init(options);
}
initMixin(Vue);
initRenderMixin(Vue);
lifecycleMixin(Vue);

export default Vue;
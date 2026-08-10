// src/lib/element.ts
import { LitElement } from "lit";
var SdsElement = class extends LitElement {
  /* Render into the element itself — see above. */
  createRenderRoot() {
    return this;
  }
};
var registered = /* @__PURE__ */ new Set();
function writeHostRule(doc) {
  if (!registered.size) return;
  const id = "sds-host-rule";
  const style = doc.getElementById(id) ?? doc.createElement("style");
  style.id = id;
  style.textContent = `${[...registered].join(",")}{display:contents}`;
  if (!style.isConnected) doc.head.append(style);
}
function installHostRule(doc = document) {
  writeHostRule(doc);
}
function define(tag, ctor) {
  if (typeof customElements === "undefined") return;
  registered.add(tag);
  if (typeof document !== "undefined") writeHostRule(document);
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

// src/components/icon.ts
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

// src/lib/icons.generated.ts
var ICON_SVG = {
  "actions-arrow-right": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M2,9h7.3v2c0,0.4,0.5,0.6,0.8,0.4l3.7-3c0.2-0.2,0.2-0.6,0-0.8l-3.7-3C9.8,4.4,9.3,4.6,9.3,5v2H2V9z"/>\n</g>\n</svg>\n',
  "actions-book": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M12,1H3v14h9c0.552,0,1-0.448,1-1V2C13,1.448,12.552,1,12,1z M12,13v1H4V2h8v9h-1v2H12z"/>\n	<path d="M11,3.25C11,3.112,10.888,3,10.75,3h-5.5C5.112,3,5,3.112,5,3.25v2.5C5,5.888,5.112,6,5.25,6h5.5\n		C10.888,6,11,5.888,11,5.75V3.25z"/>\n	<rect x="5" y="12" width="2" height="1"/>\n</g>\n</svg>\n',
  "actions-check": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M13.3,4.8l-0.7-0.7c-0.2-0.2-0.5-0.2-0.7,0c0,0,0,0-5.4,5.4L4,6.9c-0.2-0.2-0.5-0.2-0.7,0L2.7,7.6c-0.2,0.2-0.2,0.5,0,0.7\n		l3.6,3.6c0.2,0.2,0.5,0.2,0.7,0c4.9-4.9,0,0,6.4-6.4C13.5,5.3,13.5,5,13.3,4.8z"/>\n</g>\n</svg>\n',
  "actions-check-circle": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M12.1,5.3L11.7,5c-0.1-0.1-0.3-0.1-0.4,0L6.6,9.8l-2-2c-0.1-0.1-0.3-0.1-0.4,0L3.9,8.2c-0.1,0.1-0.1,0.3,0,0.4L6,10.7\n		L6.4,11c0.1,0.1,0.3,0.1,0.4,0l0.4-0.4l4.9-4.9C12.2,5.6,12.2,5.4,12.1,5.3z"/>\n	<path d="M8,2c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6S4.7,2,8,2 M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7S11.9,1,8,1L8,1z"/>\n</g>\n</svg>\n',
  "actions-chevron-down": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<polygon points="4.464,6.05 3.757,6.757 8,11 12.243,6.757 11.536,6.05 8,9.586 	"/>\n</g>\n</svg>\n',
  "actions-chevron-end": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<polygon points="9.586,8 6.05,11.536 6.757,12.243 11,8 6.757,3.757 6.05,4.464 	"/>\n</g>\n</svg>\n',
  "actions-chevron-start": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<polygon points="6.414,8 9.95,4.464 9.243,3.757 5,8 9.243,12.243 9.95,11.536 	"/>\n</g>\n</svg>\n',
  "actions-chevron-up": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<polygon points="8,6.664 11.536,10.2 12.243,9.493 8,5.25 3.757,9.493 4.464,10.2 	"/>\n</g>\n</svg>\n',
  "actions-clock": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M8,2.6c3.1,0,5.4,2.4,5.4,5.4s-2.4,5.4-5.4,5.4S2.5,11.1,2.5,8S4.9,2.6,8,2.6 M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7\n		S11.9,1,8,1L8,1z"/>\n	<path d="M7,4.1V8l4.1,2.5c0.2-0.3,0.4-0.5,0.5-0.9L8,7.4V4C7.7,4,7.3,4.1,7,4.1z"/>\n</g>\n</svg>\n',
  "actions-close": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M11.9,5.5L9.4,8l2.5,2.5c0.2,0.2,0.2,0.5,0,0.7l-0.7,0.7c-0.2,0.2-0.5,0.2-0.7,0L8,9.4l-2.5,2.5c-0.2,0.2-0.5,0.2-0.7,0\n		l-0.7-0.7c-0.2-0.2-0.2-0.5,0-0.7L6.6,8L4.1,5.5C3.9,5.3,3.9,5,4.1,4.8l0.7-0.7c0.2-0.2,0.5-0.2,0.7,0L8,6.6l2.5-2.5\n		c0.2-0.2,0.5-0.2,0.7,0l0.7,0.7C12.1,5,12.1,5.3,11.9,5.5z"/>\n</g>\n</svg>\n',
  "actions-code": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n<polygon points="7,14 5.8,14 9,2 10.3,2 "/>\n<polygon points="5.3,4 1,7.3 1,8.7 5.3,12 5.2,10.3 2.3,8 5.3,5.7 "/>\n<polygon points="10.8,4 10.8,5.7 13.7,8 10.8,10.3 10.8,12 15,8.7 15,7.3 "/>\n</g>\n</svg>\n',
  "actions-code-commit": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M8,5c1.378,0,2.5,1.122,2.5,2.5S9.378,10,8,10S5.5,8.878,5.5,7.5S6.622,5,8,5 M8,4C6.071,4,4.5,5.571,4.5,7.5\n		S6.071,11,8,11s3.5-1.571,3.5-3.5S9.929,4,8,4L8,4z"/>\n	<rect x="1" y="7" width="4" height="1"/>\n	<rect x="11" y="7" width="4" height="1"/>\n</g>\n</svg>\n',
  "actions-code-compare": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M12.5,11c0.828,0,1.5,0.672,1.5,1.5S13.328,14,12.5,14S11,13.328,11,12.5S11.672,11,12.5,11 M12.5,10\n		c-1.378,0-2.5,1.122-2.5,2.5s1.122,2.5,2.5,2.5s2.5-1.122,2.5-2.5S13.878,10,12.5,10L12.5,10z"/>\n	<path d="M3.5,2C4.328,2,5,2.672,5,3.5S4.328,5,3.5,5S2,4.328,2,3.5S2.672,2,3.5,2 M3.5,1C2.122,1,1,2.122,1,3.5S2.122,6,3.5,6\n		S6,4.878,6,3.5S4.878,1,3.5,1L3.5,1z"/>\n	<polygon points="8.914,3 10.536,1.379 9.828,0.672 7,3.5 9.828,6.328 10.536,5.621 8.914,4 12,4 12,11 13,11 13,3 	"/>\n	<polygon points="6.172,9.672 5.464,10.379 7.086,12 4,12 4,5 3,5 3,13 7.086,13 5.464,14.621 6.172,15.329 9,12.5 	"/>\n</g>\n</svg>\n',
  "actions-code-pull-request": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M12.5,11c0.828,0,1.5,0.672,1.5,1.5S13.328,14,12.5,14S11,13.328,11,12.5S11.672,11,12.5,11 M12.5,10\n		c-1.378,0-2.5,1.122-2.5,2.5s1.122,2.5,2.5,2.5s2.5-1.122,2.5-2.5S13.878,10,12.5,10L12.5,10z"/>\n	<path d="M3.5,2C4.328,2,5,2.672,5,3.5S4.328,5,3.5,5S2,4.328,2,3.5S2.672,2,3.5,2 M3.5,1C2.122,1,1,2.122,1,3.5S2.122,6,3.5,6\n		S6,4.878,6,3.5S4.878,1,3.5,1L3.5,1z"/>\n	<path d="M3.5,11C4.328,11,5,11.672,5,12.5S4.328,14,3.5,14S2,13.328,2,12.5S2.672,11,3.5,11 M3.5,10C2.122,10,1,11.122,1,12.5\n		S2.122,15,3.5,15S6,13.878,6,12.5S4.878,10,3.5,10L3.5,10z"/>\n	<rect x="3" y="5" width="1" height="6"/>\n	<polygon points="8.914,3 10.536,1.379 9.828,0.672 7,3.5 9.828,6.328 10.536,5.621 8.914,4 12,4 12,11 13,11 13,3 	"/>\n</g>\n</svg>\n',
  "actions-cog": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M14.413,9.393l-0.865-0.5C13.594,8.602,13.625,8.305,13.625,8s-0.031-0.602-0.078-0.893l0.865-0.5\n		c0.478-0.276,0.642-0.888,0.366-1.366l-1-1.732c-0.276-0.478-0.888-0.642-1.366-0.366L11.552,3.64\n		C11.09,3.264,10.566,2.963,10,2.748V2c0-0.552-0.448-1-1-1H7C6.448,1,6,1.448,6,2v0.748C5.434,2.964,4.91,3.264,4.448,3.64\n		L3.587,3.143c-0.478-0.276-1.09-0.112-1.366,0.366l-1,1.732c-0.276,0.478-0.112,1.09,0.366,1.366l0.865,0.5\n		C2.406,7.398,2.375,7.695,2.375,8s0.031,0.602,0.078,0.893l-0.865,0.5c-0.478,0.276-0.642,0.888-0.366,1.366l1,1.732\n		c0.276,0.478,0.888,0.642,1.366,0.366l0.861-0.497C4.91,12.736,5.434,13.036,6,13.252V14c0,0.552,0.448,1,1,1h2\n		c0.552,0,1-0.448,1-1v-0.748c0.566-0.216,1.09-0.516,1.552-0.892l0.861,0.497c0.478,0.276,1.09,0.112,1.366-0.366l1-1.732\n		C15.055,10.281,14.891,9.669,14.413,9.393z M12.913,11.991l-1.515-0.875C10.768,11.803,9.942,12.302,9,12.51V14H7v-1.49\n		c-0.942-0.208-1.768-0.707-2.398-1.394l-1.515,0.875l-1-1.732l1.521-0.878C3.47,8.942,3.375,8.484,3.375,8S3.47,7.058,3.608,6.619\n		L2.087,5.741l1-1.732l1.515,0.875C5.232,4.197,6.058,3.698,7,3.49V2h2v1.49c0.942,0.208,1.768,0.707,2.398,1.394l1.515-0.875\n		l1,1.732l-1.521,0.878C12.53,7.058,12.625,7.516,12.625,8s-0.095,0.942-0.233,1.381l1.521,0.878L12.913,11.991z"/>\n	<path d="M8,5.875c1.172,0,2.125,0.953,2.125,2.125S9.172,10.125,8,10.125S5.875,9.172,5.875,8S6.828,5.875,8,5.875 M8,4.875\n		C6.274,4.875,4.875,6.274,4.875,8S6.274,11.125,8,11.125S11.125,9.726,11.125,8S9.726,4.875,8,4.875L8,4.875z"/>\n</g>\n</svg>\n',
  "actions-database": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n<path d="M2,3.5001831v9c0,1.6416016,3.0185547,2.5,6,2.5s6-0.8583984,6-2.5v-9C14,0.2179565,2,0.2179565,2,3.5001831z M8,2.0001831\n	c3.0055542,0,4.9995728,0.90271,4.999939,1.4998169h-0.0002441C12.9979858,4.097168,11.0045776,4.9992065,8,4.9992065\n	S3.0020142,4.097168,3.0003052,3.5H3.000061C3.0004272,2.9028931,4.9944458,2.0001831,8,2.0001831z M12.9996948,6.5003052\n	C12.9979858,7.0974731,11.0045776,7.9995117,8,7.9995117S3.0020142,7.0974731,3.0003052,6.5003052H3V4.9316406\n	c1.1303101,0.7017212,3.0668335,1.0675659,5,1.0675659c1.9331055,0,3.8695679-0.3658447,5-1.0673828v1.5684814H12.9996948z\n	 M13,7.9321289v1.5684814h-0.0003052C12.9979858,10.0977783,11.0045776,10.9998169,8,10.9998169\n	s-4.9979858-0.9020386-4.9996948-1.4992065H3V7.9319458C4.1303101,8.633667,6.0668335,8.9995117,8,8.9995117\n	C9.9331055,8.9995117,11.8695679,8.633667,13,7.9321289z M8,14.0001831c-3.0058594,0-5-0.9023438-5-1.5V10.932251\n	c1.1303101,0.7017212,3.0668335,1.0675659,5,1.0675659c1.9331055,0,3.8695679-0.3658447,5-1.0673828v1.567749\n	C13,13.0978394,11.0058594,14.0001831,8,14.0001831z"/>\n</g>\n</svg>\n',
  "actions-debug": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M15,9V8h-3V6l1.9-1.9C13.9,4.1,14,3.9,14,3.8V1h-1v2.3c0,0.1-0.1,0.3-0.1,0.4L12,4.5V4h-2V3L9.1,2.1C9.1,2.1,8.9,2,8.8,2\n		H7.2C7.1,2,6.9,2.1,6.9,2.1L6,3v1H4v1L3.1,4.1C3.1,4.1,3,3.9,3,3.8V1H2v3.3c0,0.1,0.1,0.3,0.1,0.4L4,6.5V8H1v1h3v1.5l-1.9,1.9\n		C2.1,12.4,2,12.6,2,12.7V15h1v-1.8c0-0.1,0.1-0.3,0.1-0.4L4,12l1.9,1.9C5.9,13.9,6.1,14,6.2,14h3.6c0.1,0,0.3-0.1,0.4-0.1l1.6-1.6\n		l1.1,1.1c0.1,0.1,0.1,0.2,0.1,0.4V15h1v-1.8c0-0.1-0.1-0.3-0.1-0.4L12,11V9H15z M7,3.4L7.4,3h1.2L9,3.4V4H7V3.4z M11,11.6L9.6,13\n		H6.4L5,11.6V5h2.5v6h1V5H11V11.6z"/>\n</g>\n</svg>\n',
  "actions-duplicate": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n	<g fill="currentColor">\n		<path d="M14,4h-2V2V1h-1H2H1v1v9v1h1h2v2v1h1h9h1v-1V5V4H14z M4,4v1v6H2V2h9v2H5H4z M14,14H5V5h9V14z"/>\n	</g>\n</svg>\n',
  "actions-exclamation-circle": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M8,2c3.3000002,0,6,2.6999998,6,6s-2.6999998,6-6,6s-6-2.6999998-6-6S4.6999998,2,8,2 M8,1C4.0999999,1,1,4.0999999,1,8\n		s3.0999999,7,7,7s7-3.1000004,7-7S11.8999996,1,8,1L8,1z"/>\n	<circle cx="8" cy="11" r="1"/>\n	<path d="M8.5,9h-1L7.054975,4.5497518C7.0255408,4.2554088,7.2566829,4,7.5524936,4H8.447506\n		c0.2958117,0,0.5269527,0.2554088,0.4975185,0.5497518L8.5,9z"/>\n</g>\n</svg>\n',
  "actions-exclamation-triangle": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<circle cx="8" cy="12" r="1"/>\n	<path d="M8.5,10h-1L7.054975,5.5497518C7.0255408,5.2554088,7.2566829,5,7.5524936,5H8.447506\n		c0.2958117,0,0.5269527,0.2554088,0.4975185,0.5497518L8.5,10z"/>\n	<path d="M8,2.0081444c0.1771402,0,0.6169796,0.05021,0.8746996,0.5153399l5.5364609,9.9918499\n		c0.2499895,0.4511709,0.0741091,0.8442307-0.0131102,0.99228c-0.0872307,0.1480408-0.3457899,0.4923906-0.8615904,0.4923906\n		H2.4635501c-0.5158101,0-0.7743701-0.3443499-0.8615901-0.4923906C1.51473,13.3595648,1.33884,12.9665051,1.58884,12.5153246\n		l5.5364599-9.9918404C7.3830199,2.0583649,7.8228598,2.0081444,8,2.0081444 M8,1.0081491\n		c-0.6843376,0-1.3686752,0.3435555-1.7494001,1.0306654L0.71414,12.0306549\n		c-0.73862,1.3330297,0.22542,2.9693499,1.7494102,2.9693499h11.0729103c1.5239801,0,2.4880209-1.6363201,1.7494001-2.9693403\n		L9.7494001,2.0388145C9.3686752,1.3517046,8.6843376,1.0081491,8,1.0081491L8,1.0081491z"/>\n</g>\n</svg>\n',
  "actions-extension": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n<path d="M13.408,3.546L7.913,1.087C7.783,1.029,7.644,1,7.504,1C7.365,1,7.226,1.029,7.096,1.087L1.592,3.545\n	C1.232,3.706,1,4.064,1,4.459v7.102c0,0.395,0.233,0.754,0.594,0.914l5.496,2.439C7.219,14.971,7.357,15,7.496,15\n	c0.138,0,0.277-0.029,0.406-0.086l5.504-2.446C13.767,12.308,14,11.95,14,11.554V4.459C14,4.064,13.768,3.707,13.408,3.546z\n	 M7.504,2l4.89,2.187L7.5,6.449L2.607,4.188L7.504,2z M2,5.01l5,2.31v6.46l-5-2.219V5.01z M8,13.776V7.32l5-2.31v6.545L8,13.776z"/>\n</g>\n</svg>\n',
  "actions-filter": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M14,2c-1.333,1.667-2.667,3.333-4,5c0,2.28,0,4.56,0,6.84l-4-2.56V7L2,2C6,2,10,2,14,2 M14,1H2\n		C1.616,1,1.265,1.22,1.099,1.567c-0.167,0.346-0.12,0.758,0.12,1.058L5,7.351v3.929c0,0.341,0.174,0.658,0.461,0.842l4,2.56\n		C9.625,14.787,9.812,14.84,10,14.84c0.165,0,0.33-0.041,0.48-0.123C10.801,14.542,11,14.205,11,13.84V7.351l1.781-2.226l2-2.5\n		c0.24-0.3,0.287-0.711,0.12-1.058C14.735,1.22,14.384,1,14,1L14,1z"/>\n</g>\n</svg>\n',
  "actions-history": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M9.2,8.9C9.2,9,9,9.2,8.9,9.2H6C5.8,9.2,5.7,9,5.7,8.9V8.3C5.7,8.1,5.8,8,6,8h2V4.8c0-0.2,0.1-0.3,0.3-0.3h0.6\n		c0.2,0,0.3,0.1,0.3,0.3L9.2,8.9L9.2,8.9z"/>\n	<path d="M5.4,6H1.3C1.1,6,1,5.9,1,5.8V1.6c0-0.2,0.3-0.3,0.4-0.2l4.1,4.1C5.7,5.7,5.6,6,5.4,6z"/>\n	<path d="M8,1C5.1,1,2.6,2.8,1.6,5.3h1.7C4.2,3.6,6,2.5,8,2.5c3,0,5.5,2.5,5.5,5.5S11,13.5,8,13.5c-1.8,0-3.3-0.8-4.4-2.2l-1.1,1.1\n		C3.9,14,5.8,15,8,15c3.9,0,7-3.1,7-7S11.9,1,8,1z"/>\n</g>\n</svg>\n',
  "actions-info-circle": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M8,2c3.3000002,0,6,2.6999998,6,6s-2.6999998,6-6,6s-6-2.6999998-6-6S4.6999998,2,8,2 M8,1C4.0999999,1,1,4.0999999,1,8\n		s3.0999999,7,7,7s7-3.1000004,7-7S11.8999996,1,8,1L8,1z"/>\n	<path d="M7,4.999999C7,4.4477148,7.4477148,4,7.999999,4H8.000001C8.5522852,4,9,4.4477148,9,4.999999V5.000001\n		C9,5.5522852,8.5522852,6,8.000001,6H7.999999C7.4477148,6,7,5.5522852,7,5.000001V4.999999z"/>\n	<path d="M7,7.999999C7,7.4477148,7.4477148,7,7.999999,7H8.000001C8.5522852,7,9,7.4477148,9,7.999999v3.0000019\n		C9,11.5522852,8.5522852,12,8.000001,12H7.999999C7.4477148,12,7,11.5522852,7,11.000001V7.999999z"/>\n</g>\n</svg>\n',
  "actions-link": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M13.7,3.8l-1.4-1.4c-0.8-0.8-2-0.8-2.8,0L5.9,5.9c-0.8,0.8-0.8,2,0,2.8l1.2,1.2L8,9.1L6.9,8c-0.4-0.4-0.4-1,0-1.4l3.2-3.2\n		c0.4-0.4,1-0.4,1.4,0l1.1,1.1c0.4,0.4,0.4,1,0,1.4l-1.3,1.3c0.2,0.4,0.4,0.9,0.4,1.4l2-2C14.4,5.8,14.4,4.5,13.7,3.8z"/>\n	<path d="M8.9,6.1L8,6.9L9.1,8c0.4,0.4,0.4,1,0,1.4l-3.2,3.2c-0.4,0.4-1,0.4-1.4,0l-1.1-1.1c-0.4-0.4-0.4-1,0-1.4l1.3-1.3\n		C4.5,8.4,4.3,7.9,4.3,7.4l-2,2c-0.8,0.8-0.8,2,0,2.8l1.4,1.4c0.8,0.8,2,0.8,2.8,0l3.5-3.5c0.8-0.8,0.8-2,0-2.8L8.9,6.1z"/>\n</g>\n</svg>\n',
  "actions-list": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<rect x="2" y="3" width="2" height="1"/>\n	<rect x="5" y="3" width="9" height="1"/>\n	<rect x="2" y="6" width="2" height="1"/>\n	<rect x="5" y="6" width="9" height="1"/>\n	<rect x="2" y="9" width="2" height="1"/>\n	<rect x="5" y="9" width="9" height="1"/>\n	<rect x="2" y="12" width="2" height="1"/>\n	<rect x="5" y="12" width="9" height="1"/>\n</g>\n</svg>\n',
  "actions-menu-alternative": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M8.5,9h-1C7.2,9,7,8.8,7,8.5v-1C7,7.2,7.2,7,7.5,7h1C8.8,7,9,7.2,9,7.5v1C9,8.8,8.8,9,8.5,9z"/>\n	<path d="M8.5,4h-1C7.2,4,7,3.8,7,3.5v-1C7,2.2,7.2,2,7.5,2h1C8.8,2,9,2.2,9,2.5v1C9,3.8,8.8,4,8.5,4z"/>\n	<path d="M8.5,14h-1C7.2,14,7,13.8,7,13.5v-1C7,12.2,7.2,12,7.5,12h1C8.8,12,9,12.2,9,12.5v1C9,13.8,8.8,14,8.5,14z"/>\n</g>\n</svg>\n',
  "actions-play": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M5,3.9L11.2,8L5,12.1L5,3.9 M5,2.9c-0.5,0-1,0.4-1,1v8.3c0,0.6,0.5,1,1,1c0.2,0,0.4-0.1,0.6-0.2l6.2-4.1\n		c0.6-0.4,0.6-1.3,0-1.7L5.6,3C5.4,2.9,5.2,2.9,5,2.9L5,2.9z"/>\n</g>\n</svg>\n',
  "actions-question-circle": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M8,2c3.3000002,0,6,2.6999998,6,6s-2.6999998,6-6,6s-6-2.6999998-6-6S4.6999998,2,8,2 M8,1C4.0999999,1,1,4.0999999,1,8\n		s3.0999999,7,7,7s7-3.1000004,7-7S11.8999996,1,8,1L8,1z"/>\n	<path d="M8.7449665,11H7.244966c-0.138,0-0.25,0.1120005-0.25,0.25v1.5c0,0.1379995,0.112,0.25,0.25,0.25h1.5000005\n		c0.1379995,0,0.25-0.1120005,0.25-0.25v-1.5C8.9949665,11.1120005,8.882966,11,8.7449665,11z"/>\n	<path d="M10.9459667,5.4510002c-0.2130003-1.2010002-1.1970005-2.187-2.3990002-2.401\n		c-1.8070006-0.322-3.3900008,0.9749999-3.5410004,2.6830001C4.9939661,5.8759999,5.1169662,6,5.2609658,6H6.771966\n		c0.1269999,0,0.2189999-0.098,0.2470002-0.2220001C7.120966,5.3330002,7.5199661,5,7.994966,5\n		c0.5510001,0,1.0000005,0.4489999,1.0000005,1c0,0.3569999-0.1990004,0.6570001-0.4820004,0.8330002\n		C7.606966,7.3470001,6.994966,8.316,6.994966,9.4329996V9.75c0,0.1379995,0.112,0.25,0.25,0.25h1.5000005\n		c0.1379995,0,0.25-0.1120005,0.25-0.25V9.4329996c0-0.3590002,0.2010002-0.6590004,0.4860001-0.835\n		C10.5299664,8,11.1839666,6.7919998,10.9459667,5.4510002z"/>\n</g>\n</svg>\n',
  "actions-refresh": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M15.549,8H14c0-3.31-2.69-6-6-6C6.88,2,5.84,2.31,4.94,2.84l0.61,0.97C6.27,3.39,7.1,3.13,8,3.13\n		c2.68,0,4.87,2.18,4.87,4.87h-1.419c-0.196,0-0.316,0.216-0.212,0.383l2.049,3.278c0.098,0.157,0.326,0.157,0.424,0l2.049-3.278\n		C15.865,8.216,15.745,8,15.549,8z"/>\n	<path d="M10.37,12.23c-0.7,0.4-1.5,0.64-2.37,0.64c-2.68,0-4.87-2.18-4.87-4.87h1.419c0.196,0,0.316-0.216,0.212-0.383L2.712,4.339\n		c-0.098-0.157-0.326-0.157-0.424,0L0.239,7.617C0.135,7.784,0.255,8,0.451,8H2c0,3.31,2.69,6,6,6c1.09,0,2.1-0.29,2.98-0.8\n		L10.37,12.23z"/>\n</g>\n</svg>\n',
  "actions-search": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M13.92,15c-0.29,0-0.56-0.12-0.76-0.32l-2.89-2.88c-0.98,0.68-2.16,1.04-3.36,1.04C3.65,12.85,1,10.2,1,6.92\n		C1,3.65,3.65,1,6.92,1s5.92,2.65,5.92,5.92c0,1.19-0.36,2.37-1.04,3.36l2.89,2.89c0.19,0.19,0.31,0.47,0.31,0.76\n		C15,14.51,14.51,15,13.92,15z M6.92,2.42c-2.48,0-4.5,2.02-4.5,4.5s2.02,4.5,4.5,4.5s4.5-2.02,4.5-4.5S9.4,2.42,6.92,2.42z"/>\n</g>\n</svg>\n',
  "actions-tag": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<path d="M6.657,1H3.828H1v2.828v2.828l8.485,8.485l5.657-5.657L6.657,1z M1.99,6.232V4.111V1.99h2.121h2.122l7.495,7.494\n		l-4.243,4.243L1.99,6.232z"/>\n	<path d="M3.475,3.475c-0.683,0.683-0.683,1.792,0,2.475s1.792,0.683,2.475,0s0.683-1.792,0-2.475S4.159,2.791,3.475,3.475z\n		 M4.182,4.182c0.293-0.293,0.768-0.293,1.061,0s0.293,0.768,0,1.061s-0.768,0.293-1.061,0C3.889,4.949,3.889,4.475,4.182,4.182z"/>\n	<rect x="7.381" y="6.632" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.7826 9.1315)" width="3.5" height="5"/>\n</g>\n</svg>\n',
  "actions-window-open": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 16">\n<g fill="currentColor">\n	<rect x="11.672" y="2.328" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 16.6569 18.5563)" width="1" height="7"/>\n	<path d="M13,8.536V12H3V5h6.464l1-1H2.5C2.224,4,2,4.224,2,4.5v8C2,12.776,2.224,13,2.5,13h11c0.276,0,0.5-0.224,0.5-0.5V7.535\n		L13,8.536z"/>\n	<path d="M15.573,6.573l-4.146-4.146C11.269,2.269,11.381,2,11.604,2h4.146C15.888,2,16,2.112,16,2.25v4.146\n		C16,6.619,15.731,6.731,15.573,6.573z"/>\n</g>\n</svg>\n'
};

// src/components/icon.ts
var SdsIcon = class extends SdsElement {
  static {
    this.properties = {
      name: { type: String, reflect: true },
      size: { type: Number, reflect: true },
      /** Only for an icon that stands without a label. SKILL.md lists the four
          that may: answered, version-bound, not bootable, a stated boundary.
          Everything else sits beside its own text and is hidden from assistive
          tech rather than read out twice. */
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.size = 16;
  }
  /* The package ships each icon pretty-printed over several lines.
     Collapsing newlines and tabs to single spaces reproduces, character for
     character, the inline form the hand-written cards carried — which is what
     lets the generated cards pixel-match the baseline instead of merely
     looking the same. `version="1.1"` is dropped (it means nothing in SVG 2)
     and the self-closing shapes are expanded, because a card is parsed as
     HTML, where a self-closing tag on a non-void element does not close. */
  inline(svg) {
    return svg.replace(/[\n\t]/g, " ").replace(/\s*version="1\.1"/, "").replace(/<(path|rect|circle|polygon|ellipse|line|polyline)([^>]*?)\s*\/>/g, "<$1$2></$1>").trimEnd();
  }
  render() {
    const svg = ICON_SVG[this.name];
    if (!svg) {
      throw new Error(`unknown icon "${this.name}" \u2014 add it to the ICONS list in scripts/icons.ts and run \`make icons\``);
    }
    const a11y = this.label ? `role="img" aria-label="${this.label}"` : 'aria-hidden="true"';
    const cls = this.className || "sds-icon";
    const open = `<svg width="${this.size}" height="${this.size}" class="${cls}" ${a11y} `;
    return html`${unsafeHTML(this.inline(svg).replace(/^<svg\s*/, open))}`;
  }
};
define("sds-icon", SdsIcon);
var iconIds = Object.keys(ICON_SVG);

// src/components/button.ts
import { html as html2, nothing } from "lit";
function buttonClass({ variant = "primary", size = "md", label = "", disabled = false }) {
  const cls = ["sds-btn", `sds-btn--${variant}`];
  if (size === "sm") cls.push("sds-btn--sm");
  if (!label) cls.push("sds-btn--icon");
  if (disabled) cls.push("is-disabled");
  return cls.join(" ");
}
var SdsButton = class extends SdsElement {
  static {
    this.properties = {
      variant: { type: String, reflect: true },
      size: { type: String, reflect: true },
      label: { type: String },
      icon: { type: String },
      title: { type: String },
      disabled: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.variant = "primary";
    this.size = "md";
    this.label = "";
    this.disabled = false;
  }
  render() {
    const cls = buttonClass({
      variant: this.variant,
      size: this.size,
      label: this.label,
      disabled: this.disabled
    });
    const body = html2`${this.icon ? html2`<sds-icon name="${this.icon}"></sds-icon>` : nothing}${this.label}`;
    return this.title ? html2`<button class="${cls}" title="${this.title}">${body}</button>` : html2`<button class="${cls}">${body}</button>`;
  }
};
define("sds-button", SdsButton);

// src/components/badge.ts
import { html as html3 } from "lit";
var SdsBadge = class _SdsBadge extends SdsElement {
  static {
    /** The glyph each result tone carries. */
    this.TONE_ICON = {
      ok: "actions-check-circle",
      warn: "actions-exclamation-triangle",
      error: "actions-exclamation-circle"
    };
  }
  static {
    this.properties = {
      label: { type: String },
      tone: { type: String, reflect: true },
      icon: { type: String }
    };
  }
  constructor() {
    super();
    this.label = "";
    this.tone = "default";
  }
  render() {
    const glyph = this.icon ?? _SdsBadge.TONE_ICON[this.tone];
    const cls = this.tone === "default" ? "sds-badge" : `sds-badge sds-badge--${this.tone}`;
    return glyph ? html3`<span class="${cls}"><sds-icon name="${glyph}"></sds-icon>${this.label}</span>` : html3`<span class="${cls}">${this.label}</span>`;
  }
};
define("sds-badge", SdsBadge);

// src/components/link.ts
import { html as html4 } from "lit";
var SdsLink = class extends SdsElement {
  static {
    this.properties = {
      label: { type: String },
      href: { type: String, reflect: true },
      external: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.label = "";
    this.href = "#";
    this.external = false;
  }
  render() {
    return this.external ? html4`<a class="sds-link sds-link--external" href="${this.href}" target="_blank" rel="noreferrer">${this.label} <sds-icon name="actions-window-open"></sds-icon></a>` : html4`<a class="sds-link" href="${this.href}">${this.label}</a>`;
  }
};
define("sds-link", SdsLink);

// src/components/field.ts
import { html as html5, nothing as nothing2 } from "lit";
function fieldClass({ focused, invalid, filled, select }) {
  const cls = ["sds-field"];
  if (select) cls.push("sds-select");
  if (focused) cls.push("is-focused");
  if (invalid) cls.push("is-invalid");
  if (filled) cls.push("is-filled");
  return cls.join(" ");
}
var SdsFieldError = class extends SdsElement {
  static {
    this.properties = { message: { type: String } };
  }
  constructor() {
    super();
    this.message = "";
  }
  render() {
    return html5`<span class="sds-field-error"><sds-icon name="actions-exclamation-circle"></sds-icon>${this.message}</span>`;
  }
};
define("sds-field-error", SdsFieldError);
var SdsField = class extends SdsElement {
  static {
    this.properties = {
      value: { type: String },
      icon: { type: String },
      focused: { type: Boolean, reflect: true },
      invalid: { type: Boolean, reflect: true },
      filled: { type: Boolean, reflect: true },
      select: { type: Boolean, reflect: true },
      minWidth: { type: Number, attribute: "min-width" }
    };
  }
  constructor() {
    super();
    this.value = "";
    this.focused = false;
    this.invalid = false;
    this.filled = false;
    this.select = false;
    this.minWidth = 220;
  }
  render() {
    const cls = fieldClass(this);
    if (this.select) {
      return html5`<span class="${cls}" style="min-width:${this.minWidth}px">${this.value} <span style="color:var(--text-muted);"><sds-icon name="actions-chevron-down"></sds-icon></span></span>`;
    }
    const caret = this.focused ? html5`<span style="width:2px; height:15px; background:var(--accent);"></span>` : nothing2;
    const text = this.focused ? html5`<span style="color:var(--text-primary)">${this.value}</span>` : this.icon ? html5`<span>${this.value}</span>` : html5`${this.value}`;
    return html5`<span class="${cls}" style="min-width:${this.minWidth}px">${this.icon ? html5`<sds-icon name="${this.icon}"></sds-icon>` : nothing2}${text}${caret}</span>`;
  }
};
define("sds-field", SdsField);

// src/components/pills.ts
import { html as html7 } from "lit";

// src/lib/template.ts
function lines(parts, indent = 0) {
  const gap = `
${" ".repeat(indent)}`;
  const out = [];
  parts.forEach((part, i) => {
    if (i) out.push(gap);
    out.push(part);
  });
  return out;
}

// src/components/nav-base.ts
import { html as html6 } from "lit";
var SdsNav = class extends SdsElement {
  static {
    this.properties = {
      items: { type: Array },
      active: { type: Number, reflect: true }
    };
  }
  constructor() {
    super();
    this.items = [];
    this.active = 0;
  }
  items_() {
    return this.items.map(
      (label, i) => html6`<span class="${i === this.active ? `${this.item} is-active` : this.item}">${label}</span>`
    );
  }
};

// src/components/pills.ts
var SdsPills = class extends SdsNav {
  constructor() {
    super(...arguments);
    this.block = "sds-pills";
    this.item = "sds-pill";
  }
  render() {
    return html7`<nav class="${this.block}">
  ${lines(this.items_(), 2)}
</nav>`;
  }
};
define("sds-pills", SdsPills);

// src/components/tabs.ts
import { html as html8 } from "lit";
var SdsTabs = class extends SdsNav {
  constructor() {
    super(...arguments);
    this.block = "sds-tabs";
    this.item = "sds-tab";
  }
  render() {
    return html8`<div class="${this.block}">
  ${lines(this.items_(), 2)}
</div>`;
  }
};
define("sds-tabs", SdsTabs);

// src/components/rail.ts
import { html as html9 } from "lit";
var SdsRail = class extends SdsNav {
  constructor() {
    super(...arguments);
    this.block = "sds-rail";
    this.item = "sds-rail__item";
  }
  render() {
    return html9`<div class="${this.block}">
  ${lines(this.items_(), 2)}
</div>`;
  }
};
define("sds-rail", SdsRail);

// src/components/card.ts
import { html as html10 } from "lit";
var SdsSurface = class extends SdsElement {
  static {
    this.properties = {
      plane: { type: String, reflect: true },
      heading: { type: String },
      body: { type: String },
      /* The host is `display: contents`, so it is not in the box tree and
         cannot be sized from outside. Layout for the plane goes here and lands
         on the element that is actually laid out. */
      boxStyle: { type: String, attribute: "box-style" }
    };
  }
  constructor() {
    super();
    this.plane = "card";
    this.heading = "";
    this.body = "";
    this.boxStyle = "flex:1; min-width:200px";
  }
  render() {
    return html10`<div class="sds-${this.plane}" style="${this.boxStyle}">
  <div class="sds-surface-title">${this.heading}</div>
  <div class="sds-surface-body">${this.body}</div>
</div>`;
  }
};
define("sds-surface", SdsSurface);

// src/components/overlay.ts
import { html as html11 } from "lit";
var SdsOverlay = class extends SdsElement {
  render() {
    return html11`<div class="sds-overlay"></div>`;
  }
};
var SdsModal = class extends SdsElement {
  static {
    this.properties = {
      heading: { type: String },
      body: { type: String },
      /** Rendered buttons. Ghost first, primary last — the destructive-free
          order the rest of the system reads in. */
      actions: { type: Array },
      width: { type: Number, reflect: true }
    };
  }
  constructor() {
    super();
    this.heading = "";
    this.body = "";
    this.actions = [];
    this.width = 330;
  }
  render() {
    return html11`<div class="sds-modal" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:${this.width}px">
  <div class="sds-modal__head">
    <span>${this.heading}</span>
    <span style="color:var(--text-muted);"><sds-icon name="actions-close"></sds-icon></span>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>
</div>`;
  }
};
var SdsDrawer = class extends SdsElement {
  static {
    this.properties = {
      body: { type: String },
      width: { type: Number, reflect: true }
    };
  }
  constructor() {
    super();
    this.body = "";
    this.width = 120;
  }
  render() {
    return html11`<div class="sds-drawer" style="position:absolute; right:0; top:0; bottom:0; width:${this.width}px">
  ${this.body}
</div>`;
  }
};
define("sds-overlay", SdsOverlay);
define("sds-modal", SdsModal);
define("sds-drawer", SdsDrawer);

// src/components/dialog.ts
import { html as html12 } from "lit";
var SdsDialog = class extends SdsElement {
  static {
    this.properties = {
      heading: { type: String },
      body: { type: String },
      actions: { type: Array },
      width: { type: Number, reflect: true },
      open: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.heading = "";
    this.body = "";
    this.actions = [];
    this.width = 330;
    this.open = false;
  }
  get dialog() {
    return this.querySelector("dialog");
  }
  /** Open it modally: the platform makes the rest of the page inert, moves
      the focus in, and traps it until this closes. */
  show() {
    this.open = true;
    void this.updateComplete.then(() => {
      const el = this.dialog;
      if (el && !el.open) el.showModal();
    });
  }
  close() {
    this.dialog?.close();
    this.open = false;
  }
  updated() {
    const el = this.dialog;
    if (!el) return;
    if (!this.isConnected) return;
    try {
      if (this.open && !el.open) el.showModal();
      if (!this.open && el.open) el.close();
    } catch {
      if (this.open) el.setAttribute("open", "");
    }
  }
  render() {
    return html12`<dialog
      class="sds-modal"
      style="width:${this.width}px"
      aria-label="${this.heading}"
      @close="${() => {
      this.open = false;
    }}"
    >
  <div class="sds-modal__head">
    <span>${this.heading}</span>
    <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" title="Close" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>
</dialog>`;
  }
};
define("sds-dialog", SdsDialog);

// src/components/table.ts
import { html as html13 } from "lit";
var SdsTable = class extends SdsElement {
  static {
    this.properties = {
      density: { type: String, reflect: true },
      scrollable: { type: Boolean, reflect: true },
      columns: { type: Array },
      rows: { type: Array }
    };
  }
  constructor() {
    super();
    this.density = "medium";
    this.scrollable = false;
    this.columns = [];
    this.rows = [];
  }
  cell(value, cls) {
    return cls ? html13`<td class="${cls}">${value}</td>` : html13`<td>${value}</td>`;
  }
  bodyRow(row) {
    const cells = lines(row.cells.map((v, i) => this.cell(v, this.columns[i]?.cls)), 6);
    return row.style ? html13`<tr style="${row.style}">
      ${cells}
    </tr>` : html13`<tr>
      ${cells}
    </tr>`;
  }
  render() {
    const cls = `sds-table sds-table--${this.density}${this.scrollable ? " sds-table--scroll" : ""}`;
    return html13`<table class="${cls}">
  <thead><tr>
    ${lines(this.columns.map((c) => html13`<th>${c.head}</th>`), 4)}
  </tr></thead>
  <tbody>
    ${lines(this.rows.map((r) => this.bodyRow(r)), 4)}
  </tbody>
</table>`;
  }
};
define("sds-table", SdsTable);

// src/components/code.ts
import { html as html14 } from "lit";
var SdsCode = class extends SdsElement {
  constructor() {
    super();
    /* Content written between the tags, taken before Lit renders over it.
    
         The element renders light DOM, so `render()` replaces its children — and
         the children are the whole point when the block comes from a renderer
         rather than from a story:
    
           <sds-code lang="bash" copy><code>…</code></sds-code>
    
         So they are lifted out on connect and handed back to the template as
         nodes. Lit renders a DOM node as a child value, and re-rendering moves
         the same nodes rather than copying them. */
    this.taken = null;
    /* A button that cannot do its one job is worse than no button, so a
       browser with no clipboard gets none. That is decided on connect rather
       than at render time: `renderStatic` runs this in Node, where there is no
       `navigator` at all, and a guard on the object itself would silently drop
       the affordance from every specimen card — which is a picture of the
       component and should show what it has. */
    this.clipboard = true;
    this.lang = "";
    this.body = [];
    this.copy = false;
    this.copied = false;
  }
  static {
    this.properties = {
      lang: { type: String, reflect: true },
      /* Styled lines, which no attribute can carry — a shell prompt, a comment
         and a result are three different spans, and flattening them to a string
         would throw away the only thing the component does. */
      body: { type: Array },
      action: { type: Object },
      copy: { type: Boolean, reflect: true },
      copied: { type: Boolean, state: true }
    };
  }
  connectedCallback() {
    if (typeof navigator !== "undefined") this.clipboard = Boolean(navigator.clipboard);
    if (this.taken === null && this.childNodes.length > 0) {
      this.taken = [...this.childNodes];
      for (const node of this.taken) node.remove();
    }
    super.connectedCallback();
  }
  /** Whatever the block would put on the clipboard: its text, trailing
      blank lines dropped the way a shell would not want them. */
  get text() {
    return (this.textContent ?? "").replace(/\n+$/, "");
  }
  async toClipboard() {
    try {
      await navigator.clipboard.writeText(this.text);
    } catch {
      return;
    }
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 1600);
  }
  get copyButton() {
    if (!this.copy || !this.clipboard) return void 0;
    return html14`<button type="button" class="sds-code__copy${this.copied ? " is-copied" : ""}" aria-label="Copy this block" @click="${() => void this.toClipboard()}"><span class="sds-code__glyph"><sds-icon name="actions-duplicate"></sds-icon></span><span class="sds-code__copied"><sds-icon name="actions-check"></sds-icon></span><span>${this.copied ? "copied" : "copy"}</span></button>`;
  }
  /* The lines the free `comment()`, `shell()` and `ok()` helpers used to
     build. They were three exported functions that assembled markup a caller
     then handed back in — which made the component's own output something any
     caller could half-write. A line is data now, and only this file turns it
     into spans. */
  line({ kind, text, code }) {
    const tail = code ? html14` <span class="sds-code__cmd">${code}</span>` : void 0;
    switch (kind) {
      case "shell":
        return html14`<span class="sds-code__prompt">$</span> <span class="sds-code__cmd">${text}</span>${tail}`;
      case "comment":
        return html14`<span class="sds-code__comment">${text}</span>${tail}`;
      case "ok":
        return html14`<span class="sds-code__ok">✓</span> ${text}${tail}`;
      default:
        return html14`${text}${tail}`;
    }
  }
  /* Content written between the tags, in the `<code>` a code block is
       supposed to have.
  
       The element renders that wrapper, and the `language-` class on it, from
       its own `lang`. A caller writing
  
         <sds-code lang="json"><code class="language-json">…</code></sds-code>
  
       says the language twice, and the two can disagree unnoticed — `lang`
       paints the head, the class decides the highlighting. The component owns
       it, so a caller writes the body and nothing else. */
  get wrapped() {
    return this.lang ? html14`<code class="language-${this.lang}">${this.taken}</code>` : html14`<code>${this.taken}</code>`;
  }
  render() {
    const affordance = this.action ?? this.copyButton;
    const head = this.lang || affordance ? html14`<div class="sds-code__head">
    <span class="sds-code__lang">${this.lang}</span>
    ${affordance}
  </div>` : void 0;
    return html14`<div class="sds-code">
  ${head}
  <pre class="sds-code__body">${this.taken ? this.wrapped : lines(this.body.map((l) => this.line(l)), 0)}</pre>
</div>`;
  }
};
var SdsDiff = class extends SdsElement {
  static {
    this.properties = {
      path: { type: String, reflect: true },
      icon: { type: String },
      body: { type: Array }
    };
  }
  constructor() {
    super();
    this.path = "";
    this.body = [];
  }
  /* Diff rows carry no newline between them: each `sds-diff__line` is a
     block, so a newline inside the `<pre>` would add an empty line between
     every pair of rows. */
  line({ kind, text }) {
    if (kind === "context") return html14`<span class="sds-diff__line">   ${text}</span>`;
    const mark = kind === "add" ? "+" : "-";
    return html14`<span class="sds-diff__line sds-diff__line--${kind}"><span class="sds-diff__mark">${mark}</span>  ${text}</span>`;
  }
  render() {
    return html14`<div class="sds-code">
  <div class="sds-code__head" style="justify-content:flex-start"><sds-icon name="${this.icon ?? "actions-code-compare"}"></sds-icon><span class="spec-cap">${this.path}</span></div>
  <pre class="sds-diff">${this.body.map((l) => this.line(l))}</pre>
</div>`;
  }
};
define("sds-code", SdsCode);
define("sds-diff", SdsDiff);

// src/index.ts
if (typeof document !== "undefined") installHostRule();
var TAGS = [
  "sds-icon",
  "sds-button",
  "sds-badge",
  "sds-link",
  "sds-field",
  "sds-field-error",
  "sds-pills",
  "sds-tabs",
  "sds-rail",
  "sds-surface",
  "sds-overlay",
  "sds-modal",
  "sds-drawer",
  "sds-dialog",
  "sds-table",
  "sds-code",
  "sds-diff"
];
export {
  SdsBadge,
  SdsButton,
  SdsCode,
  SdsDialog,
  SdsDiff,
  SdsDrawer,
  SdsElement,
  SdsField,
  SdsFieldError,
  SdsIcon,
  SdsLink,
  SdsModal,
  SdsOverlay,
  SdsPills,
  SdsRail,
  SdsSurface,
  SdsTable,
  SdsTabs,
  TAGS,
  buttonClass,
  define,
  fieldClass,
  iconIds,
  installHostRule
};
//# sourceMappingURL=index.js.map

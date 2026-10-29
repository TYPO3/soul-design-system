var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// packages/frontend/src/lib/diagram/metrics.generated.ts
var CHARS, WIDTHS;
var init_metrics_generated = __esm({
  "packages/frontend/src/lib/diagram/metrics.generated.ts"() {
    "use strict";
    CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\xD0\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\xDD\xDE\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF0\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\xFE\xFF\u0100\u0101\u0102\u0103\u0104\u0105\u0106\u0107\u0108\u0109\u010A\u010B\u010C\u010D\u010E\u010F\u0110\u0111\u0112\u0113\u0114\u0115\u0116\u0117\u0118\u0119\u011A\u011B\u011C\u011D\u011E\u011F\u0120\u0121\u0122\u0123\u0124\u0125\u0126\u0127\u0128\u0129\u012A\u012B\u012C\u012D\u012E\u012F\u0130\u0131\u0132\u0133\u0134\u0135\u0136\u0137\u0138\u0139\u013A\u013B\u013C\u013D\u013E\u013F\u0140\u0141\u0142\u0143\u0144\u0145\u0146\u0147\u0148\u0149\u014A\u014B\u014C\u014D\u014E\u014F\u0150\u0151\u0152\u0153\u0154\u0155\u0156\u0157\u0158\u0159\u015A\u015B\u015C\u015D\u015E\u015F\u0160\u0161\u0162\u0163\u0164\u0165\u0166\u0167\u0168\u0169\u016A\u016B\u016C\u016D\u016E\u016F\u0170\u0171\u0172\u0173\u0174\u0175\u0176\u0177\u0178\u0179\u017A\u017B\u017C\u017D\u017E\u017F\u2010\u2011\u2012\u2013\u2014\u2015\u2016\u2017\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F\u2020\u2021\u2022\u2023\u2024\u2025\u2026\u2027\u2030\u2031\u2032\u2033\u2034\u2035\u2036\u2037\u2038\u2039\u203A\u2190\u2191\u2192\u2193\u2194\u2195\u2196\u2197\u2198\u2199\u21D2\u21D3\u21D4\u2212\u2260\u2261\u2262\u2263\u2264\u2265\u2460\u2461\u2462\u2463\u2464\u2465\u2466\u2467\u2468\u2469\u246A\u246B\u246C\u246D\u246E\u246F\u2470\u2471\u2472\u2473\u2713\u2714\u2715\u2716\u2717";
    WIDTHS = {
      "sans-400": [200, 289, 426, 497, 497, 824, 609, 249, 303, 303, 418, 497, 249, 311, 249, 350, 497, 497, 497, 497, 497, 497, 497, 497, 497, 497, 249, 249, 497, 497, 497, 425, 847, 543, 588, 571, 615, 527, 494, 617, 652, 263, 479, 579, 486, 727, 647, 664, 566, 664, 569, 534, 536, 645, 515, 786, 513, 476, 539, 303, 350, 303, 497, 500, 542, 504, 553, 456, 555, 496, 292, 504, 544, 246, 247, 495, 255, 829, 547, 542, 555, 555, 347, 419, 338, 544, 467, 719, 446, 467, 425, 303, 241, 303, 497, 200, 289, 497, 497, 497, 497, 241, 497, 542, 744, 345, 429, 497, 0, 423, 542, 331, 497, 367, 367, 542, 562, 560, 249, 542, 367, 365, 429, 781, 808, 796, 425, 543, 543, 544, 543, 543, 544, 822, 571, 527, 527, 527, 527, 263, 263, 263, 263, 639, 647, 664, 664, 664, 664, 664, 497, 664, 645, 645, 645, 645, 476, 583, 576, 504, 504, 504, 504, 504, 504, 778, 456, 496, 496, 496, 496, 246, 246, 246, 246, 544, 547, 542, 542, 542, 542, 542, 497, 542, 544, 544, 544, 544, 467, 555, 467, 544, 504, 544, 504, 544, 504, 571, 456, 571, 456, 571, 456, 571, 456, 615, 573, 635, 562, 527, 496, 527, 496, 527, 496, 527, 496, 527, 496, 617, 504, 617, 504, 617, 504, 617, 504, 652, 544, 692, 557, 263, 246, 263, 246, 263, 246, 263, 246, 263, 247, 526, 493, 480, 247, 579, 495, 495, 486, 255, 486, 255, 486, 265, 486, 362, 500, 298, 647, 547, 647, 547, 647, 547, 769, 635, 547, 664, 542, 664, 542, 664, 542, 847, 839, 569, 347, 569, 347, 569, 347, 534, 419, 534, 419, 534, 419, 534, 419, 536, 338, 536, 338, 536, 338, 645, 544, 645, 544, 645, 544, 645, 544, 645, 544, 645, 544, 786, 718, 476, 467, 476, 539, 425, 539, 425, 539, 425, 271, 334, 334, 556, 480, 800, 1e3, 577, 500, 249, 249, 249, 334, 426, 426, 426, 400, 454, 500, 304, 400, 500, 1e3, 948, 278, 1e3, 1e3, 249, 426, 575, 274, 469, 680, 376, 271, 271, 1e3, 619, 1e3, 619, 1e3, 500, 1e3, 1e3, 1e3, 1e3, 1e3, 603, 1e3, 497, 549, 564, 500, 600, 549, 549, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 846, 762, 761, 571],
      "sans-600": [200, 315, 482, 513, 513, 841, 639, 275, 324, 324, 438, 513, 275, 322, 275, 344, 513, 513, 513, 513, 513, 513, 513, 513, 513, 513, 275, 275, 513, 513, 513, 444, 875, 558, 597, 576, 625, 538, 510, 628, 663, 282, 494, 597, 502, 745, 657, 674, 582, 674, 592, 545, 546, 655, 536, 800, 541, 501, 540, 324, 344, 324, 513, 500, 549, 516, 563, 462, 564, 507, 317, 520, 558, 262, 263, 522, 271, 843, 560, 549, 564, 564, 373, 431, 361, 556, 495, 748, 481, 495, 443, 324, 255, 324, 513, 200, 315, 513, 513, 513, 513, 255, 513, 549, 747, 352, 455, 513, 0, 443, 549, 348, 513, 372, 372, 549, 578, 599, 275, 549, 372, 369, 455, 795, 827, 807, 444, 558, 558, 558, 558, 558, 558, 834, 576, 538, 538, 538, 538, 282, 282, 282, 282, 651, 656, 674, 674, 674, 674, 674, 513, 674, 655, 655, 655, 655, 501, 600, 604, 516, 516, 516, 516, 516, 516, 780, 462, 507, 507, 507, 507, 262, 262, 262, 262, 552, 560, 549, 549, 549, 549, 549, 513, 549, 556, 556, 556, 556, 495, 564, 495, 558, 516, 558, 516, 558, 516, 576, 462, 576, 462, 576, 462, 576, 462, 625, 594, 645, 564, 538, 507, 538, 507, 538, 507, 538, 507, 538, 507, 628, 520, 628, 520, 628, 520, 628, 520, 663, 558, 703, 566, 282, 262, 282, 262, 282, 262, 282, 262, 282, 262, 565, 524, 494, 263, 597, 522, 522, 502, 271, 502, 271, 502, 292, 502, 408, 522, 329, 656, 560, 656, 560, 656, 560, 810, 651, 560, 674, 549, 674, 549, 674, 549, 859, 830, 592, 373, 592, 373, 592, 373, 545, 431, 545, 431, 545, 431, 545, 431, 546, 361, 546, 361, 546, 361, 655, 556, 655, 556, 655, 556, 655, 556, 655, 556, 655, 556, 800, 748, 501, 495, 501, 540, 443, 540, 443, 540, 443, 292, 334, 334, 556, 480, 800, 1e3, 577, 500, 275, 275, 275, 334, 482, 482, 482, 400, 482, 500, 325, 400, 500, 1e3, 964, 278, 1e3, 1e3, 275, 482, 575, 274, 469, 680, 376, 282, 282, 1e3, 618, 1e3, 618, 1e3, 500, 1e3, 1e3, 1e3, 1e3, 1e3, 603, 1e3, 513, 549, 570, 500, 600, 549, 549, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 846, 762, 761, 571],
      "mono-400": [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 0, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 334, 334, 556, 600, 600, 1e3, 577, 500, 600, 600, 600, 334, 600, 600, 600, 400, 600, 500, 600, 400, 500, 1e3, 600, 278, 1e3, 1e3, 600, 600, 575, 274, 469, 680, 376, 600, 600, 1e3, 600, 1e3, 600, 1e3, 500, 1e3, 1e3, 1e3, 1e3, 1e3, 603, 1e3, 600, 549, 564, 500, 600, 549, 549, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 846, 762, 761, 571],
      "mono-600": [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 0, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 334, 334, 556, 600, 600, 1e3, 577, 500, 600, 600, 600, 334, 600, 600, 600, 400, 600, 500, 600, 400, 500, 1e3, 600, 278, 1e3, 1e3, 600, 600, 575, 274, 469, 680, 376, 600, 600, 1e3, 600, 1e3, 600, 1e3, 500, 1e3, 1e3, 1e3, 1e3, 1e3, 603, 1e3, 600, 549, 570, 500, 600, 549, 549, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 846, 762, 761, 571],
      "fallback-sans-400": [318, 401, 460, 838, 636, 950, 780, 275, 390, 390, 500, 838, 318, 361, 318, 337, 636, 636, 636, 636, 636, 636, 636, 636, 636, 636, 337, 337, 838, 838, 838, 531, 1e3, 684, 686, 698, 770, 632, 575, 775, 752, 295, 295, 656, 557, 863, 748, 787, 603, 787, 695, 635, 611, 732, 684, 989, 685, 611, 685, 390, 337, 390, 838, 500, 500, 613, 635, 550, 635, 615, 352, 635, 634, 278, 278, 579, 278, 974, 634, 612, 635, 635, 411, 521, 392, 634, 592, 818, 592, 592, 525, 636, 337, 636, 838, 318, 401, 636, 636, 636, 636, 337, 500, 500, 1e3, 471, 612, 838, 0, 1e3, 500, 500, 838, 401, 401, 500, 636, 636, 318, 500, 401, 471, 612, 969, 969, 969, 531, 684, 684, 684, 684, 684, 684, 974, 698, 632, 632, 632, 632, 295, 295, 295, 295, 775, 748, 787, 787, 787, 787, 787, 838, 787, 732, 732, 732, 732, 611, 605, 630, 613, 613, 613, 613, 613, 613, 982, 550, 615, 615, 615, 615, 278, 278, 278, 278, 612, 634, 612, 612, 612, 612, 612, 838, 612, 634, 634, 634, 634, 592, 635, 592, 684, 613, 684, 613, 684, 613, 698, 550, 698, 550, 698, 550, 698, 550, 770, 635, 775, 635, 632, 615, 632, 615, 632, 615, 632, 615, 632, 615, 775, 635, 775, 635, 775, 635, 775, 635, 752, 634, 916, 695, 295, 278, 295, 278, 295, 278, 295, 278, 295, 278, 590, 556, 295, 278, 656, 579, 579, 557, 278, 557, 278, 557, 375, 557, 342, 562, 284, 748, 634, 748, 634, 748, 634, 813, 748, 634, 787, 612, 787, 612, 787, 612, 1070, 1023, 695, 411, 695, 411, 695, 411, 635, 521, 635, 521, 635, 521, 635, 521, 611, 392, 611, 392, 611, 392, 732, 634, 732, 634, 732, 634, 732, 634, 732, 634, 732, 634, 989, 818, 611, 592, 611, 685, 525, 685, 525, 685, 525, 352, 361, 361, 636, 500, 1e3, 1e3, 500, 500, 318, 318, 318, 318, 518, 518, 518, 518, 500, 500, 590, 590, 334, 667, 1e3, 318, 1342, 1735, 227, 374, 520, 227, 374, 520, 339, 400, 400, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 896, 896, 896, 896, 896, 896, 896, 896, 896, 896, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 838, 838, 838, 838, 838],
      "fallback-sans-600": [348, 456, 521, 838, 696, 1002, 872, 306, 457, 457, 523, 838, 380, 415, 380, 365, 696, 696, 696, 696, 696, 696, 696, 696, 696, 696, 400, 400, 838, 838, 838, 580, 1e3, 774, 762, 734, 830, 683, 683, 821, 837, 372, 372, 775, 637, 995, 837, 850, 733, 850, 770, 720, 682, 812, 774, 1103, 771, 724, 725, 457, 365, 457, 838, 500, 500, 675, 716, 593, 716, 678, 435, 716, 712, 343, 343, 665, 343, 1042, 712, 687, 716, 716, 493, 595, 478, 712, 652, 924, 645, 652, 582, 712, 365, 712, 838, 348, 456, 696, 696, 636, 696, 365, 500, 500, 1e3, 564, 646, 838, 0, 1e3, 500, 500, 838, 438, 438, 500, 736, 636, 380, 500, 438, 564, 646, 1035, 1035, 1035, 580, 774, 774, 774, 774, 774, 774, 1085, 734, 683, 683, 683, 683, 372, 372, 372, 372, 838, 837, 850, 850, 850, 850, 850, 838, 850, 812, 812, 812, 812, 724, 738, 719, 675, 675, 675, 675, 675, 675, 1048, 593, 678, 678, 678, 678, 343, 343, 343, 343, 687, 712, 687, 687, 687, 687, 687, 838, 687, 712, 712, 712, 712, 652, 716, 652, 774, 675, 774, 675, 774, 675, 734, 593, 734, 593, 734, 593, 734, 593, 830, 716, 838, 716, 683, 678, 683, 678, 683, 678, 683, 678, 683, 678, 821, 716, 821, 716, 821, 716, 821, 716, 837, 712, 974, 790, 372, 343, 372, 343, 372, 343, 372, 343, 372, 343, 744, 686, 372, 343, 775, 665, 665, 637, 343, 637, 343, 637, 479, 637, 557, 642, 371, 837, 712, 837, 712, 837, 712, 983, 837, 712, 850, 687, 850, 687, 850, 687, 1167, 1094, 770, 493, 770, 493, 770, 493, 720, 595, 720, 595, 720, 595, 720, 595, 682, 478, 682, 478, 682, 478, 812, 712, 812, 712, 812, 712, 812, 712, 812, 712, 812, 712, 1103, 924, 724, 652, 724, 725, 582, 725, 582, 725, 582, 435, 415, 415, 696, 500, 1e3, 1e3, 500, 500, 380, 380, 380, 380, 657, 657, 657, 657, 500, 500, 639, 639, 333, 667, 1e3, 348, 1440, 1887, 264, 447, 630, 264, 447, 630, 733, 412, 412, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 838, 847, 847, 847, 847, 847, 847, 847, 847, 847, 847, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 838, 838, 838, 838, 838],
      "fallback-mono-400": [602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 0, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 500, 1e3, 602, 278, 602, 602, 602, 602, 602, 602, 602, 602, 376, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 602, 602, 602, 602, 602],
      "fallback-mono-600": [602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 0, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 500, 1e3, 602, 278, 602, 602, 602, 602, 602, 602, 602, 602, 376, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 602, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 1e3, 602, 602, 602, 602, 602]
    };
  }
});

// packages/frontend/src/lib/diagram/text.ts
var INDEX, table, keyOf, sum, measure, measureSet, pieces, AFTER_ICON, lines3, byParts, narrowest, wrap, fit;
var init_text = __esm({
  "packages/frontend/src/lib/diagram/text.ts"() {
    "use strict";
    init_metrics_generated();
    INDEX = new Map([...CHARS].map((c, i) => [c, i]));
    table = (key2) => {
      const widths = WIDTHS[key2];
      if (!widths) throw new Error(`no measurement for ${key2} \u2014 run \`make fonts\``);
      return widths;
    };
    keyOf = (face, weight) => `${face}-${weight >= 600 ? 600 : 400}`;
    sum = (s, size, widths, spacing, round) => {
      let total = 0;
      for (const c of s) {
        const i = INDEX.get(c);
        const advance = (i === void 0 ? 1e3 : widths[i] ?? 1e3) * size / 1e3;
        total += (round ? Math.round(advance) : advance) + spacing;
      }
      return total;
    };
    measure = (s, size, face = "sans", weight = 400, spacing = 0) => {
      const key2 = keyOf(face, weight);
      const shipped = table(key2);
      const fallback = table(`fallback-${key2}`);
      return Math.max(sum(s, size, shipped, spacing, false), sum(s, size, shipped, spacing, true), sum(s, size, fallback, spacing, false));
    };
    measureSet = (s, size, face = "sans", weight = 400) => sum(s, size, table(keyOf(face, weight)), 0, false);
    pieces = (word, fits) => (fits(word) ? [word] : word.split(/(?<=[-/._])|(?<=[a-z])(?=[A-Z])/)).map((text2, i) => ({ text: text2, joined: i > 0 }));
    AFTER_ICON = /(?<![\uE000-\uF8FF]) (?!·)/;
    lines3 = (s, max, fits) => {
      const out = [];
      for (const paragraph of s.split("\n")) {
        let current = "";
        for (const piece of paragraph.split(AFTER_ICON).flatMap((w) => pieces(w, (t) => fits(t, max)))) {
          const next = current + (current && !piece.joined ? " " : "") + piece.text;
          if (current && !fits(next, max)) {
            out.push(current);
            current = piece.text;
          } else {
            current = next;
          }
        }
        out.push(current);
      }
      return out;
    };
    byParts = (s, max, fits) => {
      const all = s.split(/(?<= ·) /);
      if (all.length < 2 || !all.every((p) => fits(p, max))) return void 0;
      const out = [];
      for (const p of all) {
        const last = out[out.length - 1];
        if (last !== void 0 && fits(`${last} ${p}`, max)) out[out.length - 1] = `${last} ${p}`;
        else out.push(p);
      }
      return out;
    };
    narrowest = (s, setting) => Math.max(0, ...s.split(/(?<![\uE000-\uF8FF])\s+(?!·)/).flatMap((word) => word.split(/(?<=[-/._])|(?<=[a-z])(?=[A-Z])/)).map((piece) => measure(piece, setting.size, setting.face, setting.weight, setting.spacing)));
    wrap = (s, max, setting, what) => {
      const width2 = (t) => measure(t, setting.size, setting.face, setting.weight, setting.spacing);
      const fits = (t, room) => width2(t) <= room + 0.5;
      let out = lines3(s, max, fits);
      const parted = out.length > 1 && !s.includes("\n") ? byParts(s, max, fits) : void 0;
      if (parted && parted.length <= out.length) return parted;
      const widow = out.length > 1 && width2(out[out.length - 1] ?? "") < max / 3;
      if (widow && Number.isFinite(max)) {
        let [low, high] = [max / out.length, max];
        while (high - low > 1) {
          const mid = (low + high) / 2;
          const tried = lines3(s, mid, fits);
          if (tried.length === out.length && tried.every((l) => fits(l, mid))) high = mid;
          else low = mid;
        }
        out = lines3(s, high, fits);
      }
      for (const l of out) {
        if (!fits(l, max)) throw new Error(`${what}: "${l}" is ${Math.ceil(width2(l))} wide, and its box is ${Math.floor(max)}`);
      }
      return out;
    };
    fit = (s, max, setting, what) => {
      const lines5 = wrap(s.replace(/\n/g, " "), Number.POSITIVE_INFINITY, setting, what);
      const one = lines5.join(" ");
      const w = measure(one, setting.size, setting.face, setting.weight, setting.spacing);
      if (w - max > 0.5 + 1e-6) throw new Error(`${what}: "${one}" is ${Math.ceil(w)} wide, and its room is ${Math.floor(max)}`);
      return one;
    };
  }
});

// packages/frontend/src/lib/diagram/paint.ts
var INK, SECONDARY, MUTED, CANVAS, RAISED, SUNKEN, INSET, SUBTLE, STRONG, ACCENT, OK, WARN, ERROR, QUIET, CLAIM, TONE, FAMILY, SIZE, FLOOR, fmt, escape, GLYPHS, GLYPH_BASE, GLYPH_CHAR, glyphChar, glyph, withGlyphs, text, rect, line, connector, arrowhead, circle, SIGN_MEANING, screen, check, sign, PLACE, placeSign, hatch, marker, pointer, cross, person, store, shapeSign;
var init_paint = __esm({
  "packages/frontend/src/lib/diagram/paint.ts"() {
    "use strict";
    init_text();
    INK = "var(--text-primary, #1C1A17)";
    SECONDARY = "var(--text-secondary, #4A453D)";
    MUTED = "var(--text-muted, #726C63)";
    CANVAS = "var(--surface-canvas, #FBFAF7)";
    RAISED = "var(--surface-raised, #FFFFFF)";
    SUNKEN = "var(--surface-sunken, #F3F1EC)";
    INSET = "var(--surface-inset, #EFEBE3)";
    SUBTLE = "var(--border-subtle, #E3DFD6)";
    STRONG = "var(--border-strong, #C9C3B7)";
    ACCENT = "var(--accent, #FF8700)";
    OK = "var(--status-ok, #4F7A3A)";
    WARN = "var(--status-warn, #986200)";
    ERROR = "var(--status-error, #A33328)";
    QUIET = {
      ok: "var(--surface-ok-quiet, #EEF3EA)",
      warn: "var(--surface-warn-quiet, #FBF3E4)",
      error: "var(--surface-error-quiet, #FCEFEC)"
    };
    CLAIM = { accent: ACCENT, error: ERROR, warn: WARN, ok: OK };
    TONE = { ink: INK, muted: MUTED, ok: OK, warn: WARN, error: ERROR };
    FAMILY = {
      sans: "&#39;Soul Diagram Sans&#39;,&#39;Source Sans 3&#39;,system-ui,sans-serif",
      mono: "&#39;Soul Diagram Mono&#39;,&#39;Source Code Pro&#39;,ui-monospace,monospace"
    };
    SIZE = { title: 36, lead: 17, node: 16, body: 14, label: 13 };
    FLOOR = 13;
    fmt = (n) => String(Math.round(n * 10) / 10);
    escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    GLYPHS = ["clock", "people", "person", "lock", "dot", "ring", "plus", "up", "down", "text", "image", "media", "list", "blocked", "site", "page", "yes", "no", "partly"];
    GLYPH_BASE = 57344;
    GLYPH_CHAR = /[-]/;
    glyphChar = (name) => {
      const i = GLYPHS.indexOf(name);
      return i < 0 ? void 0 : String.fromCharCode(GLYPH_BASE + i);
    };
    glyph = (name, cx, cy, s, ink) => {
      const u = s / 14;
      const p = (d, fill = "none") => `<path d="${d}" fill="${fill}" stroke="${fill === "none" ? ink : "none"}" stroke-width="${fmt(1.3 * u)}" stroke-linecap="round" stroke-linejoin="round"></path>`;
      const n = (v) => fmt(v);
      const ring = (r) => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * u)}" fill="none" stroke="${ink}" stroke-width="${fmt(1.3 * u)}"></circle>`;
      const bars3 = (x0, rows) => rows.map((w, i) => rect(x0, cy - 3 * u + i * 3 * u, w * u, 1.6 * u, { fill: ink })).join("");
      switch (name) {
        /* A status keeps its own colour, as in a matrix: the colour is the meaning. */
        case "yes":
        case "no":
        case "partly":
          return `<g transform="translate(${n(cx)} ${n(cy)}) scale(${fmt(u * 0.8)})">${sign(name, 0, 0)}</g>`;
        case "clock":
          return ring(5.5) + p(`M${n(cx)} ${n(cy - 3.2 * u)} V${n(cy)} H${n(cx + 2.6 * u)}`);
        case "person":
          return `<circle cx="${n(cx)}" cy="${n(cy - 2.6 * u)}" r="${n(2.7 * u)}" fill="${ink}"></circle>` + p(`M${n(cx - 5 * u)} ${n(cy + 6 * u)} a${n(5 * u)} ${n(5 * u)} 0 0 1 ${n(10 * u)} 0Z`, ink);
        case "people":
          return [-2.8, 2.8].map((d) => `<circle cx="${n(cx + d * u)}" cy="${n(cy - 2.6 * u)}" r="${n(2.2 * u)}" fill="${ink}"></circle>` + p(`M${n(cx + (d - 3.6) * u)} ${n(cy + 5.5 * u)} a${n(3.6 * u)} ${n(4 * u)} 0 0 1 ${n(7.2 * u)} 0Z`, ink)).join("");
        case "lock":
          return rect(cx - 4.5 * u, cy - 1 * u, 9 * u, 7 * u, { fill: ink, radius: 1 }) + p(`M${n(cx - 2.8 * u)} ${n(cy - 1 * u)} v${n(-2.2 * u)} a${n(2.8 * u)} ${n(2.8 * u)} 0 0 1 ${n(5.6 * u)} 0 v${n(2.2 * u)}`);
        case "dot":
          return circle(cx, cy, 3.5 * u, ink);
        case "ring":
          return ring(3.5);
        case "plus":
          return ring(6) + p(`M${n(cx - 3 * u)} ${n(cy)} H${n(cx + 3 * u)} M${n(cx)} ${n(cy - 3 * u)} V${n(cy + 3 * u)}`);
        case "up":
        case "down": {
          const d = name === "up" ? -1 : 1;
          return ring(6) + p(`M${n(cx)} ${n(cy - d * 3.2 * u)} V${n(cy + d * 3.2 * u)} M${n(cx - 2.6 * u)} ${n(cy + d * 0.8 * u)} L${n(cx)} ${n(cy + d * 3.4 * u)} L${n(cx + 2.6 * u)} ${n(cy + d * 0.8 * u)}`);
        }
        case "text":
          return bars3(cx - 5.5 * u, [11, 11, 7]);
        case "image":
          return rect(cx - 5.5 * u, cy - 4.5 * u, 11 * u, 9 * u, { stroke: ink, width: 1.2 * u, radius: 1 }) + p(`M${n(cx - 4 * u)} ${n(cy + 3 * u)} L${n(cx - 1 * u)} ${n(cy - 0.5 * u)} L${n(cx + 1.5 * u)} ${n(cy + 1.5 * u)} L${n(cx + 4 * u)} ${n(cy - 1.5 * u)}`);
        case "media":
          return rect(cx - 5.5 * u, cy - 4 * u, 5 * u, 8 * u, { fill: ink, radius: 1 }) + bars3(cx + 1 * u, [4.5, 4.5, 3]);
        case "list":
          return [0, 1, 2].map((i) => circle(cx - 4.5 * u, cy - 3 * u + i * 3 * u + 0.8 * u, 1 * u, ink)).join("") + bars3(cx - 2 * u, [7.5, 7.5, 5.5]);
        case "blocked":
          return ring(5.5) + p(`M${n(cx - 3.9 * u)} ${n(cy + 3.9 * u)} L${n(cx + 3.9 * u)} ${n(cy - 3.9 * u)}`);
        case "site":
          return ring(5.5) + p(`M${n(cx - 5.5 * u)} ${n(cy)} H${n(cx + 5.5 * u)} M${n(cx)} ${n(cy - 5.5 * u)} a${n(2.6 * u)} ${n(5.5 * u)} 0 0 0 0 ${n(11 * u)} a${n(2.6 * u)} ${n(5.5 * u)} 0 0 0 0 ${n(-11 * u)}`);
        case "page":
          return p(`M${n(cx - 4 * u)} ${n(cy - 5.5 * u)} H${n(cx + 1.5 * u)} L${n(cx + 4 * u)} ${n(cy - 3 * u)} V${n(cy + 5.5 * u)} H${n(cx - 4 * u)}Z`);
      }
    };
    withGlyphs = (x, y, content, style) => {
      const { size } = style;
      const face = style.face ?? "sans";
      const weight = style.weight ?? 400;
      const parts2 = content.split(/([-])/).filter(Boolean);
      const widthOf2 = (s) => GLYPH_CHAR.test(s) ? size : measureSet(s, size, face, weight);
      const whole = parts2.reduce((sum2, s) => sum2 + widthOf2(s), 0);
      let cx = style.anchor === "middle" ? x - whole / 2 : style.anchor === "end" ? x - whole : x;
      const out = [];
      for (const s of parts2) {
        if (GLYPH_CHAR.test(s)) {
          const name = GLYPHS[s.charCodeAt(0) - GLYPH_BASE];
          if (name) out.push(glyph(name, cx + size / 2, y - size * 0.33, size, style.fill ?? INK));
        } else if (s.trim()) {
          const lead = s.length - s.trimStart().length;
          out.push(text(cx + measureSet(s.slice(0, lead), size, face, weight), y, s.trim(), { ...style, anchor: "start" }));
        }
        cx += widthOf2(s);
      }
      return out.join("");
    };
    text = (x, y, content, style) => {
      if (style.size < FLOOR) throw new Error(`"${content}": type at ${style.size} is under the floor of ${FLOOR}`);
      if (GLYPH_CHAR.test(content)) return withGlyphs(x, y, content, style);
      const attrs = [
        `x="${fmt(x)}"`,
        `y="${fmt(y)}"`,
        `fill="${style.fill ?? INK}"`,
        `font-family="${FAMILY[style.face ?? "sans"]}"`,
        `font-size="${style.size}"`,
        style.weight && style.weight !== 400 ? `font-weight="${style.weight}"` : "",
        style.anchor && style.anchor !== "start" ? `text-anchor="${style.anchor}"` : "",
        style.spacing ? `letter-spacing="${style.spacing}"` : "",
        style.halo ? `stroke="${CANVAS}" stroke-width="5" stroke-linejoin="round" paint-order="stroke"` : ""
      ].filter(Boolean);
      return `<text ${attrs.join(" ")}>${escape(content)}</text>`;
    };
    rect = (x, y, w, h, style = {}) => {
      if ((style.radius ?? 0) > 6) throw new Error(`a radius of ${style.radius} is above the limit of 6`);
      const attrs = [
        `x="${fmt(x)}"`,
        `y="${fmt(y)}"`,
        `width="${fmt(w)}"`,
        `height="${fmt(h)}"`,
        style.radius ? `rx="${style.radius}"` : "",
        `fill="${style.fill ?? "none"}"`,
        style.stroke ? `stroke="${style.stroke}" stroke-width="${style.width ?? 1}"` : "",
        style.dashed ? 'stroke-dasharray="5 4"' : ""
      ].filter(Boolean);
      return `<rect ${attrs.join(" ")}></rect>`;
    };
    line = (x1, y1, x2, y2, stroke = SUBTLE, width2 = 1, dashed = false) => `<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${stroke}" stroke-width="${width2}"${dashed ? ' stroke-dasharray="5 4"' : ""}></line>`;
    connector = (points, stroke = MUTED, width2 = 1.5, dashed = false, head = true, tail = false) => {
      const d = points.map(([x, y], i) => `${i ? "L" : "M"}${fmt(x)} ${fmt(y)}`).join(" ");
      const path = `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width2}"${dashed ? ' stroke-dasharray="5 4"' : ""}></path>`;
      const [end, before] = [points.at(-1), points.at(-2)];
      const [start, after] = [points[0], points[1]];
      return path + (head && end && before ? arrowhead(end, before, stroke) : "") + (tail && start && after ? arrowhead(start, after, stroke) : "");
    };
    arrowhead = ([x, y], [fx, fy], fill = MUTED) => {
      const dx = Math.sign(x - fx);
      const dy = Math.sign(y - fy);
      const [bx, by] = [x - dx * 9, y - dy * 9];
      const [px, py] = [dy * 4, dx * 4];
      return `<path d="M${fmt(bx + px)} ${fmt(by + py)} L${fmt(x)} ${fmt(y)} L${fmt(bx - px)} ${fmt(by - py)}Z" fill="${fill}"></path>`;
    };
    circle = (cx, cy, r, fill, stroke) => `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="1.5"` : ""}></circle>`;
    SIGN_MEANING = {
      yes: "yes, available",
      partly: "in part",
      no: "no, missing",
      unknown: "not known",
      dot: "present",
      ring: "planned",
      page: "in the page",
      panel: "in a panel next to the page",
      both: "both",
      form: "in a form or dialog",
      bar: "in the bar over the page",
      nav: "in the navigation beside the page",
      docheader: "in the head of a module",
      any: "in the editing interface, filled for each case"
    };
    screen = (cx, cy, page, panel) => rect(cx - 11, cy - 8, 22, 16, { stroke: INK, width: 1.5, radius: 2 }) + (page ? rect(cx - 7, cy - 4, panel ? 8 : 14, 8, { fill: INK }) : "") + (panel ? rect(cx + 3, cy - 8, 8, 16, { fill: INK, radius: 2 }) : "");
    check = (cx, cy, stroke) => `<path d="M${fmt(cx - 6)} ${fmt(cy)} L${fmt(cx - 2)} ${fmt(cy + 4)} L${fmt(cx + 6)} ${fmt(cy - 5)}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`;
    sign = (kind, cx, cy) => {
      switch (kind) {
        case "yes":
          return check(cx, cy, OK);
        case "partly": {
          const arc = (side) => `<path d="M${fmt(cx + side * 9)} ${fmt(cy - 8)} A9 9 0 0 ${side > 0 ? 1 : 0} ${fmt(cx + side * 9)} ${fmt(cy + 8)}" fill="none" stroke="${WARN}" stroke-width="1.5" stroke-linecap="round"></path>`;
          return arc(-1) + check(cx, cy, WARN) + arc(1);
        }
        case "no":
          return `<line x1="${fmt(cx - 6)}" y1="${fmt(cy)}" x2="${fmt(cx + 6)}" y2="${fmt(cy)}" stroke="${ERROR}" stroke-width="2" stroke-linecap="round"></line>`;
        case "unknown":
          return text(cx, cy + 6, "?", { size: 18, fill: MUTED, face: "mono", weight: 600, anchor: "middle" });
        case "dot":
          return circle(cx, cy, 5, INK);
        case "ring":
          return circle(cx, cy, 4.5, "none", INK);
        case "page":
          return screen(cx, cy, true, false);
        case "panel":
          return screen(cx, cy, false, true);
        case "both":
          return screen(cx, cy, true, true);
        case "nav":
          return rect(cx - 11, cy - 8, 22, 16, { stroke: INK, width: 1.5, radius: 2 }) + rect(cx - 11, cy - 8, 8, 16, { fill: INK, radius: 2 });
        case "docheader":
          return rect(cx - 11, cy - 8, 22, 16, { stroke: INK, width: 1.5, radius: 2 }) + rect(cx - 11, cy - 8, 22, 4, { fill: INK, radius: 2 }) + rect(cx - 8, cy - 2, 16, 3, { fill: INK });
        /* No place of its own: the parts of a screen, each in a quiet fill. */
        case "any":
          return rect(cx - 11, cy - 8, 22, 16, { fill: RAISED, stroke: MUTED, radius: 2 }) + [[-10, -7, 20, 3], [-10, -3, 5, 10], [-4, -3, 9, 10], [6, -3, 4, 10]].map(([dx = 0, dy = 0, w = 0, h = 0]) => rect(cx + dx, cy + dy, w, h, { fill: STRONG, radius: 1 })).join("");
        case "bar":
          return rect(cx - 11, cy - 8, 22, 16, { stroke: INK, width: 1.5, radius: 2 }) + rect(cx - 11, cy - 8, 22, 4, { fill: INK, radius: 2 });
        case "form":
          return rect(cx - 7, cy - 9, 14, 18, { stroke: INK, width: 1.5, radius: 2 }) + [-4, 0, 4].map((d) => `<line x1="${fmt(cx - 3.5)}" y1="${fmt(cy + d)}" x2="${fmt(cx + 3.5)}" y2="${fmt(cy + d)}" stroke="${INK}" stroke-width="1.2"></line>`).join("");
      }
    };
    PLACE = { width: 44, height: 28 };
    placeSign = (kind, x, y) => {
      const { width: w, height: h } = PLACE;
      const parts2 = [
        [["docheader"], 2, 2, w - 4, 4],
        [["nav"], 2, 7.5, 10, h - 9.5],
        [["bar"], 13.5, 7.5, w - 15.5, 3.5],
        [["page", "both", "form"], 13.5, 12.5, 18, h - 14.5],
        [["panel", "both"], 33, 12.5, w - 35, h - 14.5]
      ];
      return rect(x, y, w, h, { fill: RAISED, stroke: MUTED, radius: 3 }) + parts2.map(([on, dx, dy, pw, ph]) => rect(x + dx, y + dy, pw, ph, { fill: on.includes(kind) ? INK : SUBTLE, radius: 1 })).join("") + (kind === "form" ? [16, 20, 24].map((d) => line(x + 16, y + d, x + 29, y + d, CANVAS, 1.2)).join("") : "");
    };
    hatch = (x, y, w, h, stroke = STRONG) => {
      const d = [];
      for (let k = 8; k < w + h; k += 8) {
        const [x0, y0] = k <= w ? [x + k, y] : [x + w, y + k - w];
        const [x1, y1] = k <= h ? [x, y + k] : [x + k - h, y + h];
        d.push(`M${fmt(x0)} ${fmt(y0)} L${fmt(x1)} ${fmt(y1)}`);
      }
      return `<path d="${d.join(" ")}" fill="none" stroke="${stroke}" stroke-width="1"></path>`;
    };
    marker = (cx, cy, label) => circle(cx, cy, 11, INK) + text(cx, cy + 4.5, label, { size: 13, fill: CANVAS, weight: 600, anchor: "middle" });
    pointer = (x, y) => `<path d="M${fmt(x)} ${fmt(y)} l0 15 l4 -3.5 l3 6.5 l2.5 -1.2 l-3 -6.3 l5.5 -0.5 Z" fill="${INK}" stroke="${CANVAS}" stroke-width="1" stroke-linejoin="round"></path>`;
    cross = (cx, cy) => `<path d="M${fmt(cx - 6)} ${fmt(cy - 6)} L${fmt(cx + 6)} ${fmt(cy + 6)} M${fmt(cx + 6)} ${fmt(cy - 6)} L${fmt(cx - 6)} ${fmt(cy + 6)}" stroke="${ERROR}" stroke-width="2" stroke-linecap="round"></path>`;
    person = (x, cy, stroke = INK) => `<circle cx="${fmt(x + 6)}" cy="${fmt(cy - 4)}" r="3.5" fill="none" stroke="${stroke}" stroke-width="1.5"></circle><path d="M${fmt(x)} ${fmt(cy + 7)} a6 6 0 0 1 12 0" fill="none" stroke="${stroke}" stroke-width="1.5"></path>`;
    store = (x, cy, stroke = INK) => `<ellipse cx="${fmt(x + 6)}" cy="${fmt(cy - 5)}" rx="6" ry="2.5" fill="none" stroke="${stroke}" stroke-width="1.5"></ellipse><path d="M${fmt(x)} ${fmt(cy - 5)} V${fmt(cy + 5)} a6 2.5 0 0 0 12 0 V${fmt(cy - 5)} M${fmt(x)} ${fmt(cy)} a6 2.5 0 0 0 12 0" fill="none" stroke="${stroke}" stroke-width="1.5"></path>`;
    shapeSign = (shape2, x, cy, stroke = INK) => shape2 === "person" ? person(x, cy, stroke) : shape2 === "store" ? store(x, cy, stroke) : "";
  }
});

// node_modules/highlight.js/lib/core.js
var require_core = __commonJS({
  "node_modules/highlight.js/lib/core.js"(exports, module) {
    function deepFreeze(obj) {
      if (obj instanceof Map) {
        obj.clear = obj.delete = obj.set = function() {
          throw new Error("map is read-only");
        };
      } else if (obj instanceof Set) {
        obj.add = obj.clear = obj.delete = function() {
          throw new Error("set is read-only");
        };
      }
      Object.freeze(obj);
      Object.getOwnPropertyNames(obj).forEach((name) => {
        const prop = obj[name];
        const type = typeof prop;
        if ((type === "object" || type === "function") && !Object.isFrozen(prop)) {
          deepFreeze(prop);
        }
      });
      return obj;
    }
    var Response = class {
      /**
       * @param {CompiledMode} mode
       */
      constructor(mode) {
        if (mode.data === void 0) mode.data = {};
        this.data = mode.data;
        this.isMatchIgnored = false;
      }
      ignoreMatch() {
        this.isMatchIgnored = true;
      }
    };
    function escapeHTML(value) {
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    }
    function inherit$1(original, ...objects) {
      const result = /* @__PURE__ */ Object.create(null);
      for (const key2 in original) {
        result[key2] = original[key2];
      }
      objects.forEach(function(obj) {
        for (const key2 in obj) {
          result[key2] = obj[key2];
        }
      });
      return (
        /** @type {T} */
        result
      );
    }
    var SPAN_CLOSE = "</span>";
    var emitsWrappingTags = (node) => {
      return !!node.scope;
    };
    var scopeToCSSClass = (name, { prefix }) => {
      if (name.startsWith("language:")) {
        return name.replace("language:", "language-");
      }
      if (name.includes(".")) {
        const pieces2 = name.split(".");
        return [
          `${prefix}${pieces2.shift()}`,
          ...pieces2.map((x, i) => `${x}${"_".repeat(i + 1)}`)
        ].join(" ");
      }
      return `${prefix}${name}`;
    };
    var HTMLRenderer = class {
      /**
       * Creates a new HTMLRenderer
       *
       * @param {Tree} parseTree - the parse tree (must support `walk` API)
       * @param {{classPrefix: string}} options
       */
      constructor(parseTree, options) {
        this.buffer = "";
        this.classPrefix = options.classPrefix;
        parseTree.walk(this);
      }
      /**
       * Adds texts to the output stream
       *
       * @param {string} text */
      addText(text2) {
        this.buffer += escapeHTML(text2);
      }
      /**
       * Adds a node open to the output stream (if needed)
       *
       * @param {Node} node */
      openNode(node) {
        if (!emitsWrappingTags(node)) return;
        const className = scopeToCSSClass(
          node.scope,
          { prefix: this.classPrefix }
        );
        this.span(className);
      }
      /**
       * Adds a node close to the output stream (if needed)
       *
       * @param {Node} node */
      closeNode(node) {
        if (!emitsWrappingTags(node)) return;
        this.buffer += SPAN_CLOSE;
      }
      /**
       * returns the accumulated buffer
      */
      value() {
        return this.buffer;
      }
      // helpers
      /**
       * Builds a span element
       *
       * @param {string} className */
      span(className) {
        this.buffer += `<span class="${className}">`;
      }
    };
    var newNode = (opts = {}) => {
      const result = { children: [] };
      Object.assign(result, opts);
      return result;
    };
    var TokenTree = class _TokenTree {
      constructor() {
        this.rootNode = newNode();
        this.stack = [this.rootNode];
      }
      get top() {
        return this.stack[this.stack.length - 1];
      }
      get root() {
        return this.rootNode;
      }
      /** @param {Node} node */
      add(node) {
        this.top.children.push(node);
      }
      /** @param {string} scope */
      openNode(scope) {
        const node = newNode({ scope });
        this.add(node);
        this.stack.push(node);
      }
      closeNode() {
        if (this.stack.length > 1) {
          return this.stack.pop();
        }
        return void 0;
      }
      closeAllNodes() {
        while (this.closeNode()) ;
      }
      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }
      /**
       * @typedef { import("./html_renderer").Renderer } Renderer
       * @param {Renderer} builder
       */
      walk(builder) {
        return this.constructor._walk(builder, this.rootNode);
      }
      /**
       * @param {Renderer} builder
       * @param {Node} node
       */
      static _walk(builder, node) {
        if (typeof node === "string") {
          builder.addText(node);
        } else if (node.children) {
          builder.openNode(node);
          node.children.forEach((child) => this._walk(builder, child));
          builder.closeNode(node);
        }
        return builder;
      }
      /**
       * @param {Node} node
       */
      static _collapse(node) {
        if (typeof node === "string") return;
        if (!node.children) return;
        if (node.children.every((el) => typeof el === "string")) {
          node.children = [node.children.join("")];
        } else {
          node.children.forEach((child) => {
            _TokenTree._collapse(child);
          });
        }
      }
    };
    var TokenTreeEmitter = class extends TokenTree {
      /**
       * @param {*} options
       */
      constructor(options) {
        super();
        this.options = options;
      }
      /**
       * @param {string} text
       */
      addText(text2) {
        if (text2 === "") {
          return;
        }
        this.add(text2);
      }
      /** @param {string} scope */
      startScope(scope) {
        this.openNode(scope);
      }
      endScope() {
        this.closeNode();
      }
      /**
       * @param {Emitter & {root: DataNode}} emitter
       * @param {string} name
       */
      __addSublanguage(emitter, name) {
        const node = emitter.root;
        if (name) node.scope = `language:${name}`;
        this.add(node);
      }
      toHTML() {
        const renderer = new HTMLRenderer(this, this.options);
        return renderer.value();
      }
      finalize() {
        this.closeAllNodes();
        return true;
      }
    };
    function source(re) {
      if (!re) return null;
      if (typeof re === "string") return re;
      return re.source;
    }
    function lookahead(re) {
      return concat("(?=", re, ")");
    }
    function anyNumberOfTimes(re) {
      return concat("(?:", re, ")*");
    }
    function optional(re) {
      return concat("(?:", re, ")?");
    }
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }
    function stripOptionsFromArgs(args) {
      const opts = args[args.length - 1];
      if (typeof opts === "object" && opts.constructor === Object) {
        args.splice(args.length - 1, 1);
        return opts;
      } else {
        return {};
      }
    }
    function either(...args) {
      const opts = stripOptionsFromArgs(args);
      const joined = "(" + (opts.capture ? "" : "?:") + args.map((x) => source(x)).join("|") + ")";
      return joined;
    }
    function countMatchGroups(re) {
      return new RegExp(re.toString() + "|").exec("").length - 1;
    }
    function startsWith(re, lexeme) {
      const match = re && re.exec(lexeme);
      return match && match.index === 0;
    }
    var BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
    function _rewriteBackreferences(regexps, { joinWith }) {
      let numCaptures = 0;
      return regexps.map((regex) => {
        numCaptures += 1;
        const offset = numCaptures;
        let re = source(regex);
        let out = "";
        while (re.length > 0) {
          const match = BACKREF_RE.exec(re);
          if (!match) {
            out += re;
            break;
          }
          out += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] === "\\" && match[1]) {
            out += "\\" + String(Number(match[1]) + offset);
          } else {
            out += match[0];
            if (match[0] === "(") {
              numCaptures++;
            }
          }
        }
        return out;
      }).map((re) => `(${re})`).join(joinWith);
    }
    var MATCH_NOTHING_RE = /\b\B/;
    var IDENT_RE3 = "[a-zA-Z]\\w*";
    var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
    var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
    var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
    var BINARY_NUMBER_RE = "\\b(0b[01]+)";
    var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
    var SHEBANG = (opts = {}) => {
      const beginShebang = /^#![ ]*\//;
      if (opts.binary) {
        opts.begin = concat(
          beginShebang,
          /.*\b/,
          opts.binary,
          /\b.*/
        );
      }
      return inherit$1({
        scope: "meta",
        begin: beginShebang,
        end: /$/,
        relevance: 0,
        /** @type {ModeCallback} */
        "on:begin": (m, resp) => {
          if (m.index !== 0) resp.ignoreMatch();
        }
      }, opts);
    };
    var BACKSLASH_ESCAPE = {
      begin: "\\\\[\\s\\S]",
      relevance: 0
    };
    var APOS_STRING_MODE = {
      scope: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [BACKSLASH_ESCAPE]
    };
    var QUOTE_STRING_MODE = {
      scope: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [BACKSLASH_ESCAPE]
    };
    var PHRASAL_WORDS_MODE = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    };
    var COMMENT = function(begin, end, modeOptions = {}) {
      const mode = inherit$1(
        {
          scope: "comment",
          begin,
          end,
          contains: []
        },
        modeOptions
      );
      mode.contains.push({
        scope: "doctag",
        // hack to avoid the space from being included. the space is necessary to
        // match here to prevent the plain text rule below from gobbling up doctags
        begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
        end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
        excludeBegin: true,
        relevance: 0
      });
      const ENGLISH_WORD = either(
        // list of common 1 and 2 letter words in English
        "I",
        "a",
        "is",
        "so",
        "us",
        "to",
        "at",
        "if",
        "in",
        "it",
        "on",
        // note: this is not an exhaustive list of contractions, just popular ones
        /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
        // contractions - can't we'd they're let's, etc
        /[A-Za-z]+[-][a-z]+/,
        // `no-way`, etc.
        /[A-Za-z][a-z]{2,}/
        // allow capitalized words at beginning of sentences
      );
      mode.contains.push(
        {
          // TODO: how to include ", (, ) without breaking grammars that use these for
          // comment delimiters?
          // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
          // ---
          // this tries to find sequences of 3 english words in a row (without any
          // "programming" type syntax) this gives us a strong signal that we've
          // TRULY found a comment - vs perhaps scanning with the wrong language.
          // It's possible to find something that LOOKS like the start of the
          // comment - but then if there is no readable text - good chance it is a
          // false match and not a comment.
          //
          // for a visual example please see:
          // https://github.com/highlightjs/highlight.js/issues/2827
          begin: concat(
            /[ ]+/,
            // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
            "(",
            ENGLISH_WORD,
            /[.]?[:]?([.][ ]|[ ])/,
            "){3}"
          )
          // look for 3 words in a row
        }
      );
      return mode;
    };
    var C_LINE_COMMENT_MODE = COMMENT("//", "$");
    var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
    var HASH_COMMENT_MODE = COMMENT("#", "$");
    var NUMBER_MODE = {
      scope: "number",
      begin: NUMBER_RE,
      relevance: 0
    };
    var C_NUMBER_MODE = {
      scope: "number",
      begin: C_NUMBER_RE,
      relevance: 0
    };
    var BINARY_NUMBER_MODE = {
      scope: "number",
      begin: BINARY_NUMBER_RE,
      relevance: 0
    };
    var REGEXP_MODE = {
      scope: "regexp",
      begin: /\/(?=[^/\n]*\/)/,
      end: /\/[gimuy]*/,
      contains: [
        BACKSLASH_ESCAPE,
        {
          begin: /\[/,
          end: /\]/,
          relevance: 0,
          contains: [BACKSLASH_ESCAPE]
        }
      ]
    };
    var TITLE_MODE = {
      scope: "title",
      begin: IDENT_RE3,
      relevance: 0
    };
    var UNDERSCORE_TITLE_MODE = {
      scope: "title",
      begin: UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    var METHOD_GUARD = {
      // excludes method names from keyword processing
      begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    var END_SAME_AS_BEGIN = function(mode) {
      return Object.assign(
        mode,
        {
          /** @type {ModeCallback} */
          "on:begin": (m, resp) => {
            resp.data._beginMatch = m[1];
          },
          /** @type {ModeCallback} */
          "on:end": (m, resp) => {
            if (resp.data._beginMatch !== m[1]) resp.ignoreMatch();
          }
        }
      );
    };
    var MODES3 = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      APOS_STRING_MODE,
      BACKSLASH_ESCAPE,
      BINARY_NUMBER_MODE,
      BINARY_NUMBER_RE,
      COMMENT,
      C_BLOCK_COMMENT_MODE,
      C_LINE_COMMENT_MODE,
      C_NUMBER_MODE,
      C_NUMBER_RE,
      END_SAME_AS_BEGIN,
      HASH_COMMENT_MODE,
      IDENT_RE: IDENT_RE3,
      MATCH_NOTHING_RE,
      METHOD_GUARD,
      NUMBER_MODE,
      NUMBER_RE,
      PHRASAL_WORDS_MODE,
      QUOTE_STRING_MODE,
      REGEXP_MODE,
      RE_STARTERS_RE,
      SHEBANG,
      TITLE_MODE,
      UNDERSCORE_IDENT_RE,
      UNDERSCORE_TITLE_MODE
    });
    function skipIfHasPrecedingDot(match, response) {
      const before = match.input[match.index - 1];
      if (before === ".") {
        response.ignoreMatch();
      }
    }
    function scopeClassName(mode, _parent) {
      if (mode.className !== void 0) {
        mode.scope = mode.className;
        delete mode.className;
      }
    }
    function beginKeywords(mode, parent) {
      if (!parent) return;
      if (!mode.beginKeywords) return;
      mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)";
      mode.__beforeBegin = skipIfHasPrecedingDot;
      mode.keywords = mode.keywords || mode.beginKeywords;
      delete mode.beginKeywords;
      if (mode.relevance === void 0) mode.relevance = 0;
    }
    function compileIllegal(mode, _parent) {
      if (!Array.isArray(mode.illegal)) return;
      mode.illegal = either(...mode.illegal);
    }
    function compileMatch(mode, _parent) {
      if (!mode.match) return;
      if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");
      mode.begin = mode.match;
      delete mode.match;
    }
    function compileRelevance(mode, _parent) {
      if (mode.relevance === void 0) mode.relevance = 1;
    }
    var beforeMatchExt = (mode, parent) => {
      if (!mode.beforeMatch) return;
      if (mode.starts) throw new Error("beforeMatch cannot be used with starts");
      const originalMode = Object.assign({}, mode);
      Object.keys(mode).forEach((key2) => {
        delete mode[key2];
      });
      mode.keywords = originalMode.keywords;
      mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
      mode.starts = {
        relevance: 0,
        contains: [
          Object.assign(originalMode, { endsParent: true })
        ]
      };
      mode.relevance = 0;
      delete originalMode.beforeMatch;
    };
    var COMMON_KEYWORDS = [
      "of",
      "and",
      "for",
      "in",
      "not",
      "or",
      "if",
      "then",
      "parent",
      // common variable name
      "list",
      // common variable name
      "value"
      // common variable name
    ];
    var DEFAULT_KEYWORD_SCOPE = "keyword";
    function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
      const compiledKeywords = /* @__PURE__ */ Object.create(null);
      if (typeof rawKeywords === "string") {
        compileList(scopeName, rawKeywords.split(" "));
      } else if (Array.isArray(rawKeywords)) {
        compileList(scopeName, rawKeywords);
      } else {
        Object.keys(rawKeywords).forEach(function(scopeName2) {
          Object.assign(
            compiledKeywords,
            compileKeywords(rawKeywords[scopeName2], caseInsensitive, scopeName2)
          );
        });
      }
      return compiledKeywords;
      function compileList(scopeName2, keywordList) {
        if (caseInsensitive) {
          keywordList = keywordList.map((x) => x.toLowerCase());
        }
        keywordList.forEach(function(keyword) {
          const pair = keyword.split("|");
          compiledKeywords[pair[0]] = [scopeName2, scoreForKeyword(pair[0], pair[1])];
        });
      }
    }
    function scoreForKeyword(keyword, providedScore) {
      if (providedScore) {
        return Number(providedScore);
      }
      return commonKeyword(keyword) ? 0 : 1;
    }
    function commonKeyword(keyword) {
      return COMMON_KEYWORDS.includes(keyword.toLowerCase());
    }
    var seenDeprecations = {};
    var error = (message) => {
      console.error(message);
    };
    var warn = (message, ...args) => {
      console.log(`WARN: ${message}`, ...args);
    };
    var deprecated = (version2, message) => {
      if (seenDeprecations[`${version2}/${message}`]) return;
      console.log(`Deprecated as of ${version2}. ${message}`);
      seenDeprecations[`${version2}/${message}`] = true;
    };
    var MultiClassError = new Error();
    function remapScopeNames(mode, regexes, { key: key2 }) {
      let offset = 0;
      const scopeNames = mode[key2];
      const emit = {};
      const positions = {};
      for (let i = 1; i <= regexes.length; i++) {
        positions[i + offset] = scopeNames[i];
        emit[i + offset] = true;
        offset += countMatchGroups(regexes[i - 1]);
      }
      mode[key2] = positions;
      mode[key2]._emit = emit;
      mode[key2]._multi = true;
    }
    function beginMultiClass(mode) {
      if (!Array.isArray(mode.begin)) return;
      if (mode.skip || mode.excludeBegin || mode.returnBegin) {
        error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
        throw MultiClassError;
      }
      if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
        error("beginScope must be object");
        throw MultiClassError;
      }
      remapScopeNames(mode, mode.begin, { key: "beginScope" });
      mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
    }
    function endMultiClass(mode) {
      if (!Array.isArray(mode.end)) return;
      if (mode.skip || mode.excludeEnd || mode.returnEnd) {
        error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
        throw MultiClassError;
      }
      if (typeof mode.endScope !== "object" || mode.endScope === null) {
        error("endScope must be object");
        throw MultiClassError;
      }
      remapScopeNames(mode, mode.end, { key: "endScope" });
      mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
    }
    function scopeSugar(mode) {
      if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
        mode.beginScope = mode.scope;
        delete mode.scope;
      }
    }
    function MultiClass(mode) {
      scopeSugar(mode);
      if (typeof mode.beginScope === "string") {
        mode.beginScope = { _wrap: mode.beginScope };
      }
      if (typeof mode.endScope === "string") {
        mode.endScope = { _wrap: mode.endScope };
      }
      beginMultiClass(mode);
      endMultiClass(mode);
    }
    function compileLanguage(language) {
      function langRe(value, global) {
        return new RegExp(
          source(value),
          "m" + (language.case_insensitive ? "i" : "") + (language.unicodeRegex ? "u" : "") + (global ? "g" : "")
        );
      }
      class MultiRegex {
        constructor() {
          this.matchIndexes = {};
          this.regexes = [];
          this.matchAt = 1;
          this.position = 0;
        }
        // @ts-ignore
        addRule(re, opts) {
          opts.position = this.position++;
          this.matchIndexes[this.matchAt] = opts;
          this.regexes.push([opts, re]);
          this.matchAt += countMatchGroups(re) + 1;
        }
        compile() {
          if (this.regexes.length === 0) {
            this.exec = () => null;
          }
          const terminators = this.regexes.map((el) => el[1]);
          this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: "|" }), true);
          this.lastIndex = 0;
        }
        /** @param {string} s */
        exec(s) {
          this.matcherRe.lastIndex = this.lastIndex;
          const match = this.matcherRe.exec(s);
          if (!match) {
            return null;
          }
          const i = match.findIndex((el, i2) => i2 > 0 && el !== void 0);
          const matchData = this.matchIndexes[i];
          match.splice(0, i);
          return Object.assign(match, matchData);
        }
      }
      class ResumableMultiRegex {
        constructor() {
          this.rules = [];
          this.multiRegexes = [];
          this.count = 0;
          this.lastIndex = 0;
          this.regexIndex = 0;
        }
        // @ts-ignore
        getMatcher(index) {
          if (this.multiRegexes[index]) return this.multiRegexes[index];
          const matcher = new MultiRegex();
          this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
          matcher.compile();
          this.multiRegexes[index] = matcher;
          return matcher;
        }
        resumingScanAtSamePosition() {
          return this.regexIndex !== 0;
        }
        considerAll() {
          this.regexIndex = 0;
        }
        // @ts-ignore
        addRule(re, opts) {
          this.rules.push([re, opts]);
          if (opts.type === "begin") this.count++;
        }
        /** @param {string} s */
        exec(s) {
          const m = this.getMatcher(this.regexIndex);
          m.lastIndex = this.lastIndex;
          let result = m.exec(s);
          if (this.resumingScanAtSamePosition()) {
            if (result && result.index === this.lastIndex) ;
            else {
              const m2 = this.getMatcher(0);
              m2.lastIndex = this.lastIndex + 1;
              result = m2.exec(s);
            }
          }
          if (result) {
            this.regexIndex += result.position + 1;
            if (this.regexIndex === this.count) {
              this.considerAll();
            }
          }
          return result;
        }
      }
      function buildModeRegex(mode) {
        const mm = new ResumableMultiRegex();
        mode.contains.forEach((term) => mm.addRule(term.begin, { rule: term, type: "begin" }));
        if (mode.terminatorEnd) {
          mm.addRule(mode.terminatorEnd, { type: "end" });
        }
        if (mode.illegal) {
          mm.addRule(mode.illegal, { type: "illegal" });
        }
        return mm;
      }
      function compileMode(mode, parent) {
        const cmode = (
          /** @type CompiledMode */
          mode
        );
        if (mode.isCompiled) return cmode;
        [
          scopeClassName,
          // do this early so compiler extensions generally don't have to worry about
          // the distinction between match/begin
          compileMatch,
          MultiClass,
          beforeMatchExt
        ].forEach((ext) => ext(mode, parent));
        language.compilerExtensions.forEach((ext) => ext(mode, parent));
        mode.__beforeBegin = null;
        [
          beginKeywords,
          // do this later so compiler extensions that come earlier have access to the
          // raw array if they wanted to perhaps manipulate it, etc.
          compileIllegal,
          // default to 1 relevance if not specified
          compileRelevance
        ].forEach((ext) => ext(mode, parent));
        mode.isCompiled = true;
        let keywordPattern = null;
        if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
          mode.keywords = Object.assign({}, mode.keywords);
          keywordPattern = mode.keywords.$pattern;
          delete mode.keywords.$pattern;
        }
        keywordPattern = keywordPattern || /\w+/;
        if (mode.keywords) {
          mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
        }
        cmode.keywordPatternRe = langRe(keywordPattern, true);
        if (parent) {
          if (!mode.begin) mode.begin = /\B|\b/;
          cmode.beginRe = langRe(cmode.begin);
          if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
          if (mode.end) cmode.endRe = langRe(cmode.end);
          cmode.terminatorEnd = source(cmode.end) || "";
          if (mode.endsWithParent && parent.terminatorEnd) {
            cmode.terminatorEnd += (mode.end ? "|" : "") + parent.terminatorEnd;
          }
        }
        if (mode.illegal) cmode.illegalRe = langRe(
          /** @type {RegExp | string} */
          mode.illegal
        );
        if (!mode.contains) mode.contains = [];
        mode.contains = [].concat(...mode.contains.map(function(c) {
          return expandOrCloneMode(c === "self" ? mode : c);
        }));
        mode.contains.forEach(function(c) {
          compileMode(
            /** @type Mode */
            c,
            cmode
          );
        });
        if (mode.starts) {
          compileMode(mode.starts, parent);
        }
        cmode.matcher = buildModeRegex(cmode);
        return cmode;
      }
      if (!language.compilerExtensions) language.compilerExtensions = [];
      if (language.contains && language.contains.includes("self")) {
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
      }
      language.classNameAliases = inherit$1(language.classNameAliases || {});
      return compileMode(
        /** @type Mode */
        language
      );
    }
    function dependencyOnParent(mode) {
      if (!mode) return false;
      return mode.endsWithParent || dependencyOnParent(mode.starts);
    }
    function expandOrCloneMode(mode) {
      if (mode.variants && !mode.cachedVariants) {
        mode.cachedVariants = mode.variants.map(function(variant) {
          return inherit$1(mode, { variants: null }, variant);
        });
      }
      if (mode.cachedVariants) {
        return mode.cachedVariants;
      }
      if (dependencyOnParent(mode)) {
        return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
      }
      if (Object.isFrozen(mode)) {
        return inherit$1(mode);
      }
      return mode;
    }
    var version = "11.11.1";
    var HTMLInjectionError = class extends Error {
      constructor(reason, html78) {
        super(reason);
        this.name = "HTMLInjectionError";
        this.html = html78;
      }
    };
    var escape3 = escapeHTML;
    var inherit = inherit$1;
    var NO_MATCH = /* @__PURE__ */ Symbol("nomatch");
    var MAX_KEYWORD_HITS = 7;
    var HLJS = function(hljs) {
      const languages = /* @__PURE__ */ Object.create(null);
      const aliases = /* @__PURE__ */ Object.create(null);
      const plugins = [];
      let SAFE_MODE = true;
      const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
      const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: "Plain text", contains: [] };
      let options = {
        ignoreUnescapedHTML: false,
        throwUnescapedHTML: false,
        noHighlightRe: /^(no-?highlight)$/i,
        languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
        classPrefix: "hljs-",
        cssSelector: "pre code",
        languages: null,
        // beta configuration options, subject to change, welcome to discuss
        // https://github.com/highlightjs/highlight.js/issues/1086
        __emitter: TokenTreeEmitter
      };
      function shouldNotHighlight(languageName) {
        return options.noHighlightRe.test(languageName);
      }
      function blockLanguage(block) {
        let classes = block.className + " ";
        classes += block.parentNode ? block.parentNode.className : "";
        const match = options.languageDetectRe.exec(classes);
        if (match) {
          const language = getLanguage(match[1]);
          if (!language) {
            warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
            warn("Falling back to no-highlight mode for this block.", block);
          }
          return language ? match[1] : "no-highlight";
        }
        return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
      }
      function highlight3(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
        let code = "";
        let languageName = "";
        if (typeof optionsOrCode === "object") {
          code = codeOrLanguageName;
          ignoreIllegals = optionsOrCode.ignoreIllegals;
          languageName = optionsOrCode.language;
        } else {
          deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
          deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
          languageName = codeOrLanguageName;
          code = optionsOrCode;
        }
        if (ignoreIllegals === void 0) {
          ignoreIllegals = true;
        }
        const context = {
          code,
          language: languageName
        };
        fire("before:highlight", context);
        const result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals);
        result.code = context.code;
        fire("after:highlight", result);
        return result;
      }
      function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
        const keywordHits = /* @__PURE__ */ Object.create(null);
        function keywordData(mode, matchText) {
          return mode.keywords[matchText];
        }
        function processKeywords() {
          if (!top.keywords) {
            emitter.addText(modeBuffer);
            return;
          }
          let lastIndex = 0;
          top.keywordPatternRe.lastIndex = 0;
          let match = top.keywordPatternRe.exec(modeBuffer);
          let buf = "";
          while (match) {
            buf += modeBuffer.substring(lastIndex, match.index);
            const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
            const data = keywordData(top, word);
            if (data) {
              const [kind, keywordRelevance] = data;
              emitter.addText(buf);
              buf = "";
              keywordHits[word] = (keywordHits[word] || 0) + 1;
              if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
              if (kind.startsWith("_")) {
                buf += match[0];
              } else {
                const cssClass = language.classNameAliases[kind] || kind;
                emitKeyword(match[0], cssClass);
              }
            } else {
              buf += match[0];
            }
            lastIndex = top.keywordPatternRe.lastIndex;
            match = top.keywordPatternRe.exec(modeBuffer);
          }
          buf += modeBuffer.substring(lastIndex);
          emitter.addText(buf);
        }
        function processSubLanguage() {
          if (modeBuffer === "") return;
          let result2 = null;
          if (typeof top.subLanguage === "string") {
            if (!languages[top.subLanguage]) {
              emitter.addText(modeBuffer);
              return;
            }
            result2 = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
            continuations[top.subLanguage] = /** @type {CompiledMode} */
            result2._top;
          } else {
            result2 = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
          }
          if (top.relevance > 0) {
            relevance += result2.relevance;
          }
          emitter.__addSublanguage(result2._emitter, result2.language);
        }
        function processBuffer() {
          if (top.subLanguage != null) {
            processSubLanguage();
          } else {
            processKeywords();
          }
          modeBuffer = "";
        }
        function emitKeyword(keyword, scope) {
          if (keyword === "") return;
          emitter.startScope(scope);
          emitter.addText(keyword);
          emitter.endScope();
        }
        function emitMultiClass(scope, match) {
          let i = 1;
          const max = match.length - 1;
          while (i <= max) {
            if (!scope._emit[i]) {
              i++;
              continue;
            }
            const klass = language.classNameAliases[scope[i]] || scope[i];
            const text2 = match[i];
            if (klass) {
              emitKeyword(text2, klass);
            } else {
              modeBuffer = text2;
              processKeywords();
              modeBuffer = "";
            }
            i++;
          }
        }
        function startNewMode(mode, match) {
          if (mode.scope && typeof mode.scope === "string") {
            emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
          }
          if (mode.beginScope) {
            if (mode.beginScope._wrap) {
              emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
              modeBuffer = "";
            } else if (mode.beginScope._multi) {
              emitMultiClass(mode.beginScope, match);
              modeBuffer = "";
            }
          }
          top = Object.create(mode, { parent: { value: top } });
          return top;
        }
        function endOfMode(mode, match, matchPlusRemainder) {
          let matched = startsWith(mode.endRe, matchPlusRemainder);
          if (matched) {
            if (mode["on:end"]) {
              const resp = new Response(mode);
              mode["on:end"](match, resp);
              if (resp.isMatchIgnored) matched = false;
            }
            if (matched) {
              while (mode.endsParent && mode.parent) {
                mode = mode.parent;
              }
              return mode;
            }
          }
          if (mode.endsWithParent) {
            return endOfMode(mode.parent, match, matchPlusRemainder);
          }
        }
        function doIgnore(lexeme) {
          if (top.matcher.regexIndex === 0) {
            modeBuffer += lexeme[0];
            return 1;
          } else {
            resumeScanAtSamePosition = true;
            return 0;
          }
        }
        function doBeginMatch(match) {
          const lexeme = match[0];
          const newMode = match.rule;
          const resp = new Response(newMode);
          const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
          for (const cb of beforeCallbacks) {
            if (!cb) continue;
            cb(match, resp);
            if (resp.isMatchIgnored) return doIgnore(lexeme);
          }
          if (newMode.skip) {
            modeBuffer += lexeme;
          } else {
            if (newMode.excludeBegin) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (!newMode.returnBegin && !newMode.excludeBegin) {
              modeBuffer = lexeme;
            }
          }
          startNewMode(newMode, match);
          return newMode.returnBegin ? 0 : lexeme.length;
        }
        function doEndMatch(match) {
          const lexeme = match[0];
          const matchPlusRemainder = codeToHighlight.substring(match.index);
          const endMode = endOfMode(top, match, matchPlusRemainder);
          if (!endMode) {
            return NO_MATCH;
          }
          const origin = top;
          if (top.endScope && top.endScope._wrap) {
            processBuffer();
            emitKeyword(lexeme, top.endScope._wrap);
          } else if (top.endScope && top.endScope._multi) {
            processBuffer();
            emitMultiClass(top.endScope, match);
          } else if (origin.skip) {
            modeBuffer += lexeme;
          } else {
            if (!(origin.returnEnd || origin.excludeEnd)) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (origin.excludeEnd) {
              modeBuffer = lexeme;
            }
          }
          do {
            if (top.scope) {
              emitter.closeNode();
            }
            if (!top.skip && !top.subLanguage) {
              relevance += top.relevance;
            }
            top = top.parent;
          } while (top !== endMode.parent);
          if (endMode.starts) {
            startNewMode(endMode.starts, match);
          }
          return origin.returnEnd ? 0 : lexeme.length;
        }
        function processContinuations() {
          const list = [];
          for (let current = top; current !== language; current = current.parent) {
            if (current.scope) {
              list.unshift(current.scope);
            }
          }
          list.forEach((item) => emitter.openNode(item));
        }
        let lastMatch = {};
        function processLexeme(textBeforeMatch, match) {
          const lexeme = match && match[0];
          modeBuffer += textBeforeMatch;
          if (lexeme == null) {
            processBuffer();
            return 0;
          }
          if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
            modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
            if (!SAFE_MODE) {
              const err = new Error(`0 width match regex (${languageName})`);
              err.languageName = languageName;
              err.badRule = lastMatch.rule;
              throw err;
            }
            return 1;
          }
          lastMatch = match;
          if (match.type === "begin") {
            return doBeginMatch(match);
          } else if (match.type === "illegal" && !ignoreIllegals) {
            const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || "<unnamed>") + '"');
            err.mode = top;
            throw err;
          } else if (match.type === "end") {
            const processed = doEndMatch(match);
            if (processed !== NO_MATCH) {
              return processed;
            }
          }
          if (match.type === "illegal" && lexeme === "") {
            modeBuffer += "\n";
            return 1;
          }
          if (iterations > 1e5 && iterations > match.index * 3) {
            const err = new Error("potential infinite loop, way more iterations than matches");
            throw err;
          }
          modeBuffer += lexeme;
          return lexeme.length;
        }
        const language = getLanguage(languageName);
        if (!language) {
          error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
          throw new Error('Unknown language: "' + languageName + '"');
        }
        const md = compileLanguage(language);
        let result = "";
        let top = continuation || md;
        const continuations = {};
        const emitter = new options.__emitter(options);
        processContinuations();
        let modeBuffer = "";
        let relevance = 0;
        let index = 0;
        let iterations = 0;
        let resumeScanAtSamePosition = false;
        try {
          if (!language.__emitTokens) {
            top.matcher.considerAll();
            for (; ; ) {
              iterations++;
              if (resumeScanAtSamePosition) {
                resumeScanAtSamePosition = false;
              } else {
                top.matcher.considerAll();
              }
              top.matcher.lastIndex = index;
              const match = top.matcher.exec(codeToHighlight);
              if (!match) break;
              const beforeMatch = codeToHighlight.substring(index, match.index);
              const processedCount = processLexeme(beforeMatch, match);
              index = match.index + processedCount;
            }
            processLexeme(codeToHighlight.substring(index));
          } else {
            language.__emitTokens(codeToHighlight, emitter);
          }
          emitter.finalize();
          result = emitter.toHTML();
          return {
            language: languageName,
            value: result,
            relevance,
            illegal: false,
            _emitter: emitter,
            _top: top
          };
        } catch (err) {
          if (err.message && err.message.includes("Illegal")) {
            return {
              language: languageName,
              value: escape3(codeToHighlight),
              illegal: true,
              relevance: 0,
              _illegalBy: {
                message: err.message,
                index,
                context: codeToHighlight.slice(index - 100, index + 100),
                mode: err.mode,
                resultSoFar: result
              },
              _emitter: emitter
            };
          } else if (SAFE_MODE) {
            return {
              language: languageName,
              value: escape3(codeToHighlight),
              illegal: false,
              relevance: 0,
              errorRaised: err,
              _emitter: emitter,
              _top: top
            };
          } else {
            throw err;
          }
        }
      }
      function justTextHighlightResult(code) {
        const result = {
          value: escape3(code),
          illegal: false,
          relevance: 0,
          _top: PLAINTEXT_LANGUAGE,
          _emitter: new options.__emitter(options)
        };
        result._emitter.addText(code);
        return result;
      }
      function highlightAuto(code, languageSubset) {
        languageSubset = languageSubset || options.languages || Object.keys(languages);
        const plaintext2 = justTextHighlightResult(code);
        const results = languageSubset.filter(getLanguage).filter(autoDetection).map(
          (name) => _highlight(name, code, false)
        );
        results.unshift(plaintext2);
        const sorted = results.sort((a, b) => {
          if (a.relevance !== b.relevance) return b.relevance - a.relevance;
          if (a.language && b.language) {
            if (getLanguage(a.language).supersetOf === b.language) {
              return 1;
            } else if (getLanguage(b.language).supersetOf === a.language) {
              return -1;
            }
          }
          return 0;
        });
        const [best, secondBest] = sorted;
        const result = best;
        result.secondBest = secondBest;
        return result;
      }
      function updateClassName(element, currentLang, resultLang) {
        const language = currentLang && aliases[currentLang] || resultLang;
        element.classList.add("hljs");
        element.classList.add(`language-${language}`);
      }
      function highlightElement(element) {
        let node = null;
        const language = blockLanguage(element);
        if (shouldNotHighlight(language)) return;
        fire(
          "before:highlightElement",
          { el: element, language }
        );
        if (element.dataset.highlighted) {
          console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
          return;
        }
        if (element.children.length > 0) {
          if (!options.ignoreUnescapedHTML) {
            console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
            console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
            console.warn("The element with unescaped HTML:");
            console.warn(element);
          }
          if (options.throwUnescapedHTML) {
            const err = new HTMLInjectionError(
              "One of your code blocks includes unescaped HTML.",
              element.innerHTML
            );
            throw err;
          }
        }
        node = element;
        const text2 = node.textContent;
        const result = language ? highlight3(text2, { language, ignoreIllegals: true }) : highlightAuto(text2);
        element.innerHTML = result.value;
        element.dataset.highlighted = "yes";
        updateClassName(element, language, result.language);
        element.result = {
          language: result.language,
          // TODO: remove with version 11.0
          re: result.relevance,
          relevance: result.relevance
        };
        if (result.secondBest) {
          element.secondBest = {
            language: result.secondBest.language,
            relevance: result.secondBest.relevance
          };
        }
        fire("after:highlightElement", { el: element, result, text: text2 });
      }
      function configure(userOptions) {
        options = inherit(options, userOptions);
      }
      const initHighlighting = () => {
        highlightAll();
        deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
      };
      function initHighlightingOnLoad() {
        highlightAll();
        deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
      }
      let wantsHighlight = false;
      function highlightAll() {
        function boot() {
          highlightAll();
        }
        if (document.readyState === "loading") {
          if (!wantsHighlight) {
            window.addEventListener("DOMContentLoaded", boot, false);
          }
          wantsHighlight = true;
          return;
        }
        const blocks = document.querySelectorAll(options.cssSelector);
        blocks.forEach(highlightElement);
      }
      function registerLanguage(languageName, languageDefinition) {
        let lang = null;
        try {
          lang = languageDefinition(hljs);
        } catch (error$1) {
          error("Language definition for '{}' could not be registered.".replace("{}", languageName));
          if (!SAFE_MODE) {
            throw error$1;
          } else {
            error(error$1);
          }
          lang = PLAINTEXT_LANGUAGE;
        }
        if (!lang.name) lang.name = languageName;
        languages[languageName] = lang;
        lang.rawDefinition = languageDefinition.bind(null, hljs);
        if (lang.aliases) {
          registerAliases(lang.aliases, { languageName });
        }
      }
      function unregisterLanguage(languageName) {
        delete languages[languageName];
        for (const alias of Object.keys(aliases)) {
          if (aliases[alias] === languageName) {
            delete aliases[alias];
          }
        }
      }
      function listLanguages() {
        return Object.keys(languages);
      }
      function getLanguage(name) {
        name = (name || "").toLowerCase();
        return languages[name] || languages[aliases[name]];
      }
      function registerAliases(aliasList, { languageName }) {
        if (typeof aliasList === "string") {
          aliasList = [aliasList];
        }
        aliasList.forEach((alias) => {
          aliases[alias.toLowerCase()] = languageName;
        });
      }
      function autoDetection(name) {
        const lang = getLanguage(name);
        return lang && !lang.disableAutodetect;
      }
      function upgradePluginAPI(plugin) {
        if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
          plugin["before:highlightElement"] = (data) => {
            plugin["before:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
        if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
          plugin["after:highlightElement"] = (data) => {
            plugin["after:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
      }
      function addPlugin(plugin) {
        upgradePluginAPI(plugin);
        plugins.push(plugin);
      }
      function removePlugin(plugin) {
        const index = plugins.indexOf(plugin);
        if (index !== -1) {
          plugins.splice(index, 1);
        }
      }
      function fire(event, args) {
        const cb = event;
        plugins.forEach(function(plugin) {
          if (plugin[cb]) {
            plugin[cb](args);
          }
        });
      }
      function deprecateHighlightBlock(el) {
        deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
        deprecated("10.7.0", "Please use highlightElement now.");
        return highlightElement(el);
      }
      Object.assign(hljs, {
        highlight: highlight3,
        highlightAuto,
        highlightAll,
        highlightElement,
        // TODO: Remove with v12 API
        highlightBlock: deprecateHighlightBlock,
        configure,
        initHighlighting,
        initHighlightingOnLoad,
        registerLanguage,
        unregisterLanguage,
        listLanguages,
        getLanguage,
        registerAliases,
        autoDetection,
        inherit,
        addPlugin,
        removePlugin
      });
      hljs.debugMode = function() {
        SAFE_MODE = false;
      };
      hljs.safeMode = function() {
        SAFE_MODE = true;
      };
      hljs.versionString = version;
      hljs.regex = {
        concat,
        lookahead,
        either,
        optional,
        anyNumberOfTimes
      };
      for (const key2 in MODES3) {
        if (typeof MODES3[key2] === "object") {
          deepFreeze(MODES3[key2]);
        }
      }
      Object.assign(hljs, MODES3);
      return hljs;
    };
    var highlight2 = HLJS({});
    highlight2.newInstance = () => HLJS({});
    module.exports = highlight2;
    highlight2.HighlightJS = highlight2;
    highlight2.default = highlight2;
  }
});

// node_modules/highlight.js/es/core.js
var import_core, core_default;
var init_core = __esm({
  "node_modules/highlight.js/es/core.js"() {
    import_core = __toESM(require_core(), 1);
    core_default = import_core.default;
  }
});

// node_modules/highlight.js/es/languages/bash.js
function bash(hljs) {
  const regex = hljs.regex;
  const VAR = {};
  const BRACED_VAR = {
    begin: /\$\{/,
    end: /\}/,
    contains: [
      "self",
      {
        begin: /:-/,
        contains: [VAR]
      }
      // default values
    ]
  };
  Object.assign(VAR, {
    className: "variable",
    variants: [
      { begin: regex.concat(
        /\$[\w\d#@][\w\d_]*/,
        // negative look-ahead tries to avoid matching patterns that are not
        // Perl at all like $ident$, @ident@, etc.
        `(?![\\w\\d])(?![$])`
      ) },
      BRACED_VAR
    ]
  });
  const SUBST = {
    className: "subst",
    begin: /\$\(/,
    end: /\)/,
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  const COMMENT = hljs.inherit(
    hljs.COMMENT(),
    {
      match: [
        /(^|\s)/,
        /#.*$/
      ],
      scope: {
        2: "comment"
      }
    }
  );
  const HERE_DOC = {
    begin: /<<-?\s*(?=\w+)/,
    starts: { contains: [
      hljs.END_SAME_AS_BEGIN({
        begin: /(\w+)/,
        end: /(\w+)/,
        className: "string"
      })
    ] }
  };
  const QUOTE_STRING = {
    className: "string",
    begin: /"/,
    end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VAR,
      SUBST
    ]
  };
  SUBST.contains.push(QUOTE_STRING);
  const ESCAPED_QUOTE = {
    match: /\\"/
  };
  const APOS_STRING = {
    className: "string",
    begin: /'/,
    end: /'/
  };
  const ESCAPED_APOS = {
    match: /\\'/
  };
  const ARITHMETIC = {
    begin: /\$?\(\(/,
    end: /\)\)/,
    contains: [
      {
        begin: /\d+#[0-9a-f]+/,
        className: "number"
      },
      hljs.NUMBER_MODE,
      VAR
    ]
  };
  const SH_LIKE_SHELLS = [
    "fish",
    "bash",
    "zsh",
    "sh",
    "csh",
    "ksh",
    "tcsh",
    "dash",
    "scsh"
  ];
  const KNOWN_SHEBANG = hljs.SHEBANG({
    binary: `(${SH_LIKE_SHELLS.join("|")})`,
    relevance: 10
  });
  const FUNCTION = {
    className: "function",
    begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
    returnBegin: true,
    contains: [hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
    relevance: 0
  };
  const KEYWORDS3 = [
    "if",
    "then",
    "else",
    "elif",
    "fi",
    "time",
    "for",
    "while",
    "until",
    "in",
    "do",
    "done",
    "case",
    "esac",
    "coproc",
    "function",
    "select"
  ];
  const LITERALS3 = [
    "true",
    "false"
  ];
  const PATH_MODE = { match: /(\/[a-z._-]+)+/ };
  const SHELL_BUILT_INS = [
    "break",
    "cd",
    "continue",
    "eval",
    "exec",
    "exit",
    "export",
    "getopts",
    "hash",
    "pwd",
    "readonly",
    "return",
    "shift",
    "test",
    "times",
    "trap",
    "umask",
    "unset"
  ];
  const BASH_BUILT_INS = [
    "alias",
    "bind",
    "builtin",
    "caller",
    "command",
    "declare",
    "echo",
    "enable",
    "help",
    "let",
    "local",
    "logout",
    "mapfile",
    "printf",
    "read",
    "readarray",
    "source",
    "sudo",
    "type",
    "typeset",
    "ulimit",
    "unalias"
  ];
  const ZSH_BUILT_INS = [
    "autoload",
    "bg",
    "bindkey",
    "bye",
    "cap",
    "chdir",
    "clone",
    "comparguments",
    "compcall",
    "compctl",
    "compdescribe",
    "compfiles",
    "compgroups",
    "compquote",
    "comptags",
    "comptry",
    "compvalues",
    "dirs",
    "disable",
    "disown",
    "echotc",
    "echoti",
    "emulate",
    "fc",
    "fg",
    "float",
    "functions",
    "getcap",
    "getln",
    "history",
    "integer",
    "jobs",
    "kill",
    "limit",
    "log",
    "noglob",
    "popd",
    "print",
    "pushd",
    "pushln",
    "rehash",
    "sched",
    "setcap",
    "setopt",
    "stat",
    "suspend",
    "ttyctl",
    "unfunction",
    "unhash",
    "unlimit",
    "unsetopt",
    "vared",
    "wait",
    "whence",
    "where",
    "which",
    "zcompile",
    "zformat",
    "zftp",
    "zle",
    "zmodload",
    "zparseopts",
    "zprof",
    "zpty",
    "zregexparse",
    "zsocket",
    "zstyle",
    "ztcp"
  ];
  const GNU_CORE_UTILS = [
    "chcon",
    "chgrp",
    "chown",
    "chmod",
    "cp",
    "dd",
    "df",
    "dir",
    "dircolors",
    "ln",
    "ls",
    "mkdir",
    "mkfifo",
    "mknod",
    "mktemp",
    "mv",
    "realpath",
    "rm",
    "rmdir",
    "shred",
    "sync",
    "touch",
    "truncate",
    "vdir",
    "b2sum",
    "base32",
    "base64",
    "cat",
    "cksum",
    "comm",
    "csplit",
    "cut",
    "expand",
    "fmt",
    "fold",
    "head",
    "join",
    "md5sum",
    "nl",
    "numfmt",
    "od",
    "paste",
    "ptx",
    "pr",
    "sha1sum",
    "sha224sum",
    "sha256sum",
    "sha384sum",
    "sha512sum",
    "shuf",
    "sort",
    "split",
    "sum",
    "tac",
    "tail",
    "tr",
    "tsort",
    "unexpand",
    "uniq",
    "wc",
    "arch",
    "basename",
    "chroot",
    "date",
    "dirname",
    "du",
    "echo",
    "env",
    "expr",
    "factor",
    // "false", // keyword literal already
    "groups",
    "hostid",
    "id",
    "link",
    "logname",
    "nice",
    "nohup",
    "nproc",
    "pathchk",
    "pinky",
    "printenv",
    "printf",
    "pwd",
    "readlink",
    "runcon",
    "seq",
    "sleep",
    "stat",
    "stdbuf",
    "stty",
    "tee",
    "test",
    "timeout",
    // "true", // keyword literal already
    "tty",
    "uname",
    "unlink",
    "uptime",
    "users",
    "who",
    "whoami",
    "yes"
  ];
  return {
    name: "Bash",
    aliases: [
      "sh",
      "zsh"
    ],
    keywords: {
      $pattern: /\b[a-z][a-z0-9._-]+\b/,
      keyword: KEYWORDS3,
      literal: LITERALS3,
      built_in: [
        ...SHELL_BUILT_INS,
        ...BASH_BUILT_INS,
        // Shell modifiers
        "set",
        "shopt",
        ...ZSH_BUILT_INS,
        ...GNU_CORE_UTILS
      ]
    },
    contains: [
      KNOWN_SHEBANG,
      // to catch known shells and boost relevancy
      hljs.SHEBANG(),
      // to catch unknown shells but still highlight the shebang
      FUNCTION,
      ARITHMETIC,
      COMMENT,
      HERE_DOC,
      PATH_MODE,
      QUOTE_STRING,
      ESCAPED_QUOTE,
      APOS_STRING,
      ESCAPED_APOS,
      VAR
    ]
  };
}
var init_bash = __esm({
  "node_modules/highlight.js/es/languages/bash.js"() {
  }
});

// node_modules/highlight.js/es/languages/css.js
function css(hljs) {
  const regex = hljs.regex;
  const modes = MODES(hljs);
  const VENDOR_PREFIX = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ };
  const AT_MODIFIERS = "and or not only";
  const AT_PROPERTY_RE = /@-?\w[\w]*(-\w+)*/;
  const IDENT_RE3 = "[a-zA-Z-][a-zA-Z0-9_-]*";
  const STRINGS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE
  ];
  return {
    name: "CSS",
    case_insensitive: true,
    illegal: /[=|'\$]/,
    keywords: { keyframePosition: "from to" },
    classNameAliases: {
      // for visual continuity with `tag {}` and because we
      // don't have a great class for this?
      keyframePosition: "selector-tag"
    },
    contains: [
      modes.BLOCK_COMMENT,
      VENDOR_PREFIX,
      // to recognize keyframe 40% etc which are outside the scope of our
      // attribute value mode
      modes.CSS_NUMBER_MODE,
      {
        className: "selector-id",
        begin: /#[A-Za-z0-9_-]+/,
        relevance: 0
      },
      {
        className: "selector-class",
        begin: "\\." + IDENT_RE3,
        relevance: 0
      },
      modes.ATTRIBUTE_SELECTOR_MODE,
      {
        className: "selector-pseudo",
        variants: [
          { begin: ":(" + PSEUDO_CLASSES.join("|") + ")" },
          { begin: ":(:)?(" + PSEUDO_ELEMENTS.join("|") + ")" }
        ]
      },
      // we may actually need this (12/2020)
      // { // pseudo-selector params
      //   begin: /\(/,
      //   end: /\)/,
      //   contains: [ hljs.CSS_NUMBER_MODE ]
      // },
      modes.CSS_VARIABLE,
      {
        className: "attribute",
        begin: "\\b(" + ATTRIBUTES.join("|") + ")\\b"
      },
      // attribute values
      {
        begin: /:/,
        end: /[;}{]/,
        contains: [
          modes.BLOCK_COMMENT,
          modes.HEXCOLOR,
          modes.IMPORTANT,
          modes.CSS_NUMBER_MODE,
          ...STRINGS,
          // needed to highlight these as strings and to avoid issues with
          // illegal characters that might be inside urls that would tigger the
          // languages illegal stack
          {
            begin: /(url|data-uri)\(/,
            end: /\)/,
            relevance: 0,
            // from keywords
            keywords: { built_in: "url data-uri" },
            contains: [
              ...STRINGS,
              {
                className: "string",
                // any character other than `)` as in `url()` will be the start
                // of a string, which ends with `)` (from the parent mode)
                begin: /[^)]/,
                endsWithParent: true,
                excludeEnd: true
              }
            ]
          },
          modes.FUNCTION_DISPATCH
        ]
      },
      {
        begin: regex.lookahead(/@/),
        end: "[{;]",
        relevance: 0,
        illegal: /:/,
        // break on Less variables @var: ...
        contains: [
          {
            className: "keyword",
            begin: AT_PROPERTY_RE
          },
          {
            begin: /\s/,
            endsWithParent: true,
            excludeEnd: true,
            relevance: 0,
            keywords: {
              $pattern: /[a-z-]+/,
              keyword: AT_MODIFIERS,
              attribute: MEDIA_FEATURES.join(" ")
            },
            contains: [
              {
                begin: /[a-z-]+(?=:)/,
                className: "attribute"
              },
              ...STRINGS,
              modes.CSS_NUMBER_MODE
            ]
          }
        ]
      },
      {
        className: "selector-tag",
        begin: "\\b(" + TAGS2.join("|") + ")\\b"
      }
    ]
  };
}
var MODES, HTML_TAGS, SVG_TAGS, TAGS2, MEDIA_FEATURES, PSEUDO_CLASSES, PSEUDO_ELEMENTS, ATTRIBUTES;
var init_css = __esm({
  "node_modules/highlight.js/es/languages/css.js"() {
    MODES = (hljs) => {
      return {
        IMPORTANT: {
          scope: "meta",
          begin: "!important"
        },
        BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
        HEXCOLOR: {
          scope: "number",
          begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
        },
        FUNCTION_DISPATCH: {
          className: "built_in",
          begin: /[\w-]+(?=\()/
        },
        ATTRIBUTE_SELECTOR_MODE: {
          scope: "selector-attr",
          begin: /\[/,
          end: /\]/,
          illegal: "$",
          contains: [
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE
          ]
        },
        CSS_NUMBER_MODE: {
          scope: "number",
          begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
          relevance: 0
        },
        CSS_VARIABLE: {
          className: "attr",
          begin: /--[A-Za-z_][A-Za-z0-9_-]*/
        }
      };
    };
    HTML_TAGS = [
      "a",
      "abbr",
      "address",
      "article",
      "aside",
      "audio",
      "b",
      "blockquote",
      "body",
      "button",
      "canvas",
      "caption",
      "cite",
      "code",
      "dd",
      "del",
      "details",
      "dfn",
      "div",
      "dl",
      "dt",
      "em",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hgroup",
      "html",
      "i",
      "iframe",
      "img",
      "input",
      "ins",
      "kbd",
      "label",
      "legend",
      "li",
      "main",
      "mark",
      "menu",
      "nav",
      "object",
      "ol",
      "optgroup",
      "option",
      "p",
      "picture",
      "q",
      "quote",
      "samp",
      "section",
      "select",
      "source",
      "span",
      "strong",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "textarea",
      "tfoot",
      "th",
      "thead",
      "time",
      "tr",
      "ul",
      "var",
      "video"
    ];
    SVG_TAGS = [
      "defs",
      "g",
      "marker",
      "mask",
      "pattern",
      "svg",
      "switch",
      "symbol",
      "feBlend",
      "feColorMatrix",
      "feComponentTransfer",
      "feComposite",
      "feConvolveMatrix",
      "feDiffuseLighting",
      "feDisplacementMap",
      "feFlood",
      "feGaussianBlur",
      "feImage",
      "feMerge",
      "feMorphology",
      "feOffset",
      "feSpecularLighting",
      "feTile",
      "feTurbulence",
      "linearGradient",
      "radialGradient",
      "stop",
      "circle",
      "ellipse",
      "image",
      "line",
      "path",
      "polygon",
      "polyline",
      "rect",
      "text",
      "use",
      "textPath",
      "tspan",
      "foreignObject",
      "clipPath"
    ];
    TAGS2 = [
      ...HTML_TAGS,
      ...SVG_TAGS
    ];
    MEDIA_FEATURES = [
      "any-hover",
      "any-pointer",
      "aspect-ratio",
      "color",
      "color-gamut",
      "color-index",
      "device-aspect-ratio",
      "device-height",
      "device-width",
      "display-mode",
      "forced-colors",
      "grid",
      "height",
      "hover",
      "inverted-colors",
      "monochrome",
      "orientation",
      "overflow-block",
      "overflow-inline",
      "pointer",
      "prefers-color-scheme",
      "prefers-contrast",
      "prefers-reduced-motion",
      "prefers-reduced-transparency",
      "resolution",
      "scan",
      "scripting",
      "update",
      "width",
      // TODO: find a better solution?
      "min-width",
      "max-width",
      "min-height",
      "max-height"
    ].sort().reverse();
    PSEUDO_CLASSES = [
      "active",
      "any-link",
      "blank",
      "checked",
      "current",
      "default",
      "defined",
      "dir",
      // dir()
      "disabled",
      "drop",
      "empty",
      "enabled",
      "first",
      "first-child",
      "first-of-type",
      "fullscreen",
      "future",
      "focus",
      "focus-visible",
      "focus-within",
      "has",
      // has()
      "host",
      // host or host()
      "host-context",
      // host-context()
      "hover",
      "indeterminate",
      "in-range",
      "invalid",
      "is",
      // is()
      "lang",
      // lang()
      "last-child",
      "last-of-type",
      "left",
      "link",
      "local-link",
      "not",
      // not()
      "nth-child",
      // nth-child()
      "nth-col",
      // nth-col()
      "nth-last-child",
      // nth-last-child()
      "nth-last-col",
      // nth-last-col()
      "nth-last-of-type",
      //nth-last-of-type()
      "nth-of-type",
      //nth-of-type()
      "only-child",
      "only-of-type",
      "optional",
      "out-of-range",
      "past",
      "placeholder-shown",
      "read-only",
      "read-write",
      "required",
      "right",
      "root",
      "scope",
      "target",
      "target-within",
      "user-invalid",
      "valid",
      "visited",
      "where"
      // where()
    ].sort().reverse();
    PSEUDO_ELEMENTS = [
      "after",
      "backdrop",
      "before",
      "cue",
      "cue-region",
      "first-letter",
      "first-line",
      "grammar-error",
      "marker",
      "part",
      "placeholder",
      "selection",
      "slotted",
      "spelling-error"
    ].sort().reverse();
    ATTRIBUTES = [
      "accent-color",
      "align-content",
      "align-items",
      "align-self",
      "alignment-baseline",
      "all",
      "anchor-name",
      "animation",
      "animation-composition",
      "animation-delay",
      "animation-direction",
      "animation-duration",
      "animation-fill-mode",
      "animation-iteration-count",
      "animation-name",
      "animation-play-state",
      "animation-range",
      "animation-range-end",
      "animation-range-start",
      "animation-timeline",
      "animation-timing-function",
      "appearance",
      "aspect-ratio",
      "backdrop-filter",
      "backface-visibility",
      "background",
      "background-attachment",
      "background-blend-mode",
      "background-clip",
      "background-color",
      "background-image",
      "background-origin",
      "background-position",
      "background-position-x",
      "background-position-y",
      "background-repeat",
      "background-size",
      "baseline-shift",
      "block-size",
      "border",
      "border-block",
      "border-block-color",
      "border-block-end",
      "border-block-end-color",
      "border-block-end-style",
      "border-block-end-width",
      "border-block-start",
      "border-block-start-color",
      "border-block-start-style",
      "border-block-start-width",
      "border-block-style",
      "border-block-width",
      "border-bottom",
      "border-bottom-color",
      "border-bottom-left-radius",
      "border-bottom-right-radius",
      "border-bottom-style",
      "border-bottom-width",
      "border-collapse",
      "border-color",
      "border-end-end-radius",
      "border-end-start-radius",
      "border-image",
      "border-image-outset",
      "border-image-repeat",
      "border-image-slice",
      "border-image-source",
      "border-image-width",
      "border-inline",
      "border-inline-color",
      "border-inline-end",
      "border-inline-end-color",
      "border-inline-end-style",
      "border-inline-end-width",
      "border-inline-start",
      "border-inline-start-color",
      "border-inline-start-style",
      "border-inline-start-width",
      "border-inline-style",
      "border-inline-width",
      "border-left",
      "border-left-color",
      "border-left-style",
      "border-left-width",
      "border-radius",
      "border-right",
      "border-right-color",
      "border-right-style",
      "border-right-width",
      "border-spacing",
      "border-start-end-radius",
      "border-start-start-radius",
      "border-style",
      "border-top",
      "border-top-color",
      "border-top-left-radius",
      "border-top-right-radius",
      "border-top-style",
      "border-top-width",
      "border-width",
      "bottom",
      "box-align",
      "box-decoration-break",
      "box-direction",
      "box-flex",
      "box-flex-group",
      "box-lines",
      "box-ordinal-group",
      "box-orient",
      "box-pack",
      "box-shadow",
      "box-sizing",
      "break-after",
      "break-before",
      "break-inside",
      "caption-side",
      "caret-color",
      "clear",
      "clip",
      "clip-path",
      "clip-rule",
      "color",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "color-scheme",
      "column-count",
      "column-fill",
      "column-gap",
      "column-rule",
      "column-rule-color",
      "column-rule-style",
      "column-rule-width",
      "column-span",
      "column-width",
      "columns",
      "contain",
      "contain-intrinsic-block-size",
      "contain-intrinsic-height",
      "contain-intrinsic-inline-size",
      "contain-intrinsic-size",
      "contain-intrinsic-width",
      "container",
      "container-name",
      "container-type",
      "content",
      "content-visibility",
      "counter-increment",
      "counter-reset",
      "counter-set",
      "cue",
      "cue-after",
      "cue-before",
      "cursor",
      "cx",
      "cy",
      "direction",
      "display",
      "dominant-baseline",
      "empty-cells",
      "enable-background",
      "field-sizing",
      "fill",
      "fill-opacity",
      "fill-rule",
      "filter",
      "flex",
      "flex-basis",
      "flex-direction",
      "flex-flow",
      "flex-grow",
      "flex-shrink",
      "flex-wrap",
      "float",
      "flood-color",
      "flood-opacity",
      "flow",
      "font",
      "font-display",
      "font-family",
      "font-feature-settings",
      "font-kerning",
      "font-language-override",
      "font-optical-sizing",
      "font-palette",
      "font-size",
      "font-size-adjust",
      "font-smooth",
      "font-smoothing",
      "font-stretch",
      "font-style",
      "font-synthesis",
      "font-synthesis-position",
      "font-synthesis-small-caps",
      "font-synthesis-style",
      "font-synthesis-weight",
      "font-variant",
      "font-variant-alternates",
      "font-variant-caps",
      "font-variant-east-asian",
      "font-variant-emoji",
      "font-variant-ligatures",
      "font-variant-numeric",
      "font-variant-position",
      "font-variation-settings",
      "font-weight",
      "forced-color-adjust",
      "gap",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "grid",
      "grid-area",
      "grid-auto-columns",
      "grid-auto-flow",
      "grid-auto-rows",
      "grid-column",
      "grid-column-end",
      "grid-column-start",
      "grid-gap",
      "grid-row",
      "grid-row-end",
      "grid-row-start",
      "grid-template",
      "grid-template-areas",
      "grid-template-columns",
      "grid-template-rows",
      "hanging-punctuation",
      "height",
      "hyphenate-character",
      "hyphenate-limit-chars",
      "hyphens",
      "icon",
      "image-orientation",
      "image-rendering",
      "image-resolution",
      "ime-mode",
      "initial-letter",
      "initial-letter-align",
      "inline-size",
      "inset",
      "inset-area",
      "inset-block",
      "inset-block-end",
      "inset-block-start",
      "inset-inline",
      "inset-inline-end",
      "inset-inline-start",
      "isolation",
      "justify-content",
      "justify-items",
      "justify-self",
      "kerning",
      "left",
      "letter-spacing",
      "lighting-color",
      "line-break",
      "line-height",
      "line-height-step",
      "list-style",
      "list-style-image",
      "list-style-position",
      "list-style-type",
      "margin",
      "margin-block",
      "margin-block-end",
      "margin-block-start",
      "margin-bottom",
      "margin-inline",
      "margin-inline-end",
      "margin-inline-start",
      "margin-left",
      "margin-right",
      "margin-top",
      "margin-trim",
      "marker",
      "marker-end",
      "marker-mid",
      "marker-start",
      "marks",
      "mask",
      "mask-border",
      "mask-border-mode",
      "mask-border-outset",
      "mask-border-repeat",
      "mask-border-slice",
      "mask-border-source",
      "mask-border-width",
      "mask-clip",
      "mask-composite",
      "mask-image",
      "mask-mode",
      "mask-origin",
      "mask-position",
      "mask-repeat",
      "mask-size",
      "mask-type",
      "masonry-auto-flow",
      "math-depth",
      "math-shift",
      "math-style",
      "max-block-size",
      "max-height",
      "max-inline-size",
      "max-width",
      "min-block-size",
      "min-height",
      "min-inline-size",
      "min-width",
      "mix-blend-mode",
      "nav-down",
      "nav-index",
      "nav-left",
      "nav-right",
      "nav-up",
      "none",
      "normal",
      "object-fit",
      "object-position",
      "offset",
      "offset-anchor",
      "offset-distance",
      "offset-path",
      "offset-position",
      "offset-rotate",
      "opacity",
      "order",
      "orphans",
      "outline",
      "outline-color",
      "outline-offset",
      "outline-style",
      "outline-width",
      "overflow",
      "overflow-anchor",
      "overflow-block",
      "overflow-clip-margin",
      "overflow-inline",
      "overflow-wrap",
      "overflow-x",
      "overflow-y",
      "overlay",
      "overscroll-behavior",
      "overscroll-behavior-block",
      "overscroll-behavior-inline",
      "overscroll-behavior-x",
      "overscroll-behavior-y",
      "padding",
      "padding-block",
      "padding-block-end",
      "padding-block-start",
      "padding-bottom",
      "padding-inline",
      "padding-inline-end",
      "padding-inline-start",
      "padding-left",
      "padding-right",
      "padding-top",
      "page",
      "page-break-after",
      "page-break-before",
      "page-break-inside",
      "paint-order",
      "pause",
      "pause-after",
      "pause-before",
      "perspective",
      "perspective-origin",
      "place-content",
      "place-items",
      "place-self",
      "pointer-events",
      "position",
      "position-anchor",
      "position-visibility",
      "print-color-adjust",
      "quotes",
      "r",
      "resize",
      "rest",
      "rest-after",
      "rest-before",
      "right",
      "rotate",
      "row-gap",
      "ruby-align",
      "ruby-position",
      "scale",
      "scroll-behavior",
      "scroll-margin",
      "scroll-margin-block",
      "scroll-margin-block-end",
      "scroll-margin-block-start",
      "scroll-margin-bottom",
      "scroll-margin-inline",
      "scroll-margin-inline-end",
      "scroll-margin-inline-start",
      "scroll-margin-left",
      "scroll-margin-right",
      "scroll-margin-top",
      "scroll-padding",
      "scroll-padding-block",
      "scroll-padding-block-end",
      "scroll-padding-block-start",
      "scroll-padding-bottom",
      "scroll-padding-inline",
      "scroll-padding-inline-end",
      "scroll-padding-inline-start",
      "scroll-padding-left",
      "scroll-padding-right",
      "scroll-padding-top",
      "scroll-snap-align",
      "scroll-snap-stop",
      "scroll-snap-type",
      "scroll-timeline",
      "scroll-timeline-axis",
      "scroll-timeline-name",
      "scrollbar-color",
      "scrollbar-gutter",
      "scrollbar-width",
      "shape-image-threshold",
      "shape-margin",
      "shape-outside",
      "shape-rendering",
      "speak",
      "speak-as",
      "src",
      // @font-face
      "stop-color",
      "stop-opacity",
      "stroke",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "tab-size",
      "table-layout",
      "text-align",
      "text-align-all",
      "text-align-last",
      "text-anchor",
      "text-combine-upright",
      "text-decoration",
      "text-decoration-color",
      "text-decoration-line",
      "text-decoration-skip",
      "text-decoration-skip-ink",
      "text-decoration-style",
      "text-decoration-thickness",
      "text-emphasis",
      "text-emphasis-color",
      "text-emphasis-position",
      "text-emphasis-style",
      "text-indent",
      "text-justify",
      "text-orientation",
      "text-overflow",
      "text-rendering",
      "text-shadow",
      "text-size-adjust",
      "text-transform",
      "text-underline-offset",
      "text-underline-position",
      "text-wrap",
      "text-wrap-mode",
      "text-wrap-style",
      "timeline-scope",
      "top",
      "touch-action",
      "transform",
      "transform-box",
      "transform-origin",
      "transform-style",
      "transition",
      "transition-behavior",
      "transition-delay",
      "transition-duration",
      "transition-property",
      "transition-timing-function",
      "translate",
      "unicode-bidi",
      "user-modify",
      "user-select",
      "vector-effect",
      "vertical-align",
      "view-timeline",
      "view-timeline-axis",
      "view-timeline-inset",
      "view-timeline-name",
      "view-transition-name",
      "visibility",
      "voice-balance",
      "voice-duration",
      "voice-family",
      "voice-pitch",
      "voice-range",
      "voice-rate",
      "voice-stress",
      "voice-volume",
      "white-space",
      "white-space-collapse",
      "widows",
      "width",
      "will-change",
      "word-break",
      "word-spacing",
      "word-wrap",
      "writing-mode",
      "x",
      "y",
      "z-index",
      "zoom"
    ].sort().reverse();
  }
});

// node_modules/highlight.js/es/languages/diff.js
function diff(hljs) {
  const regex = hljs.regex;
  return {
    name: "Diff",
    aliases: ["patch"],
    contains: [
      {
        className: "meta",
        relevance: 10,
        match: regex.either(
          /^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,
          /^\*\*\* +\d+,\d+ +\*\*\*\*$/,
          /^--- +\d+,\d+ +----$/
        )
      },
      {
        className: "comment",
        variants: [
          {
            begin: regex.either(
              /Index: /,
              /^index/,
              /={3,}/,
              /^-{3}/,
              /^\*{3} /,
              /^\+{3}/,
              /^diff --git/
            ),
            end: /$/
          },
          { match: /^\*{15}$/ }
        ]
      },
      {
        className: "addition",
        begin: /^\+/,
        end: /$/
      },
      {
        className: "deletion",
        begin: /^-/,
        end: /$/
      },
      {
        className: "addition",
        begin: /^!/,
        end: /$/
      }
    ]
  };
}
var init_diff = __esm({
  "node_modules/highlight.js/es/languages/diff.js"() {
  }
});

// node_modules/highlight.js/es/languages/javascript.js
function javascript(hljs) {
  const regex = hljs.regex;
  const hasClosingTag = (match, { after }) => {
    const tag = "</" + match[0].slice(1);
    const pos = match.input.indexOf(tag, after);
    return pos !== -1;
  };
  const IDENT_RE$1 = IDENT_RE;
  const FRAGMENT = {
    begin: "<>",
    end: "</>"
  };
  const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
  const XML_TAG = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (match, response) => {
      const afterMatchIndex = match[0].length + match.index;
      const nextChar = match.input[afterMatchIndex];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        nextChar === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        nextChar === ","
      ) {
        response.ignoreMatch();
        return;
      }
      if (nextChar === ">") {
        if (!hasClosingTag(match, { after: afterMatchIndex })) {
          response.ignoreMatch();
        }
      }
      let m;
      const afterMatch = match.input.substring(afterMatchIndex);
      if (m = afterMatch.match(/^\s*=/)) {
        response.ignoreMatch();
        return;
      }
      if (m = afterMatch.match(/^\s+extends\s+/)) {
        if (m.index === 0) {
          response.ignoreMatch();
          return;
        }
      }
    }
  };
  const KEYWORDS$1 = {
    $pattern: IDENT_RE,
    keyword: KEYWORDS,
    literal: LITERALS,
    built_in: BUILT_INS,
    "variable.language": BUILT_IN_VARIABLES
  };
  const decimalDigits = "[0-9](_?[0-9])*";
  const frac = `\\.(${decimalDigits})`;
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const NUMBER = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})\\b` },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
      // DecimalBigIntegerLiteral
      { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  };
  const SUBST = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: KEYWORDS$1,
    contains: []
    // defined later
  };
  const HTML_TEMPLATE = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "xml"
    }
  };
  const CSS_TEMPLATE = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "css"
    }
  };
  const GRAPHQL_TEMPLATE = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "graphql"
    }
  };
  const TEMPLATE_STRING = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  const JSDOC_COMMENT = hljs.COMMENT(
    /\/\*\*(?!\/)/,
    "\\*/",
    {
      relevance: 0,
      contains: [
        {
          begin: "(?=@[A-Za-z]+)",
          relevance: 0,
          contains: [
            {
              className: "doctag",
              begin: "@[A-Za-z]+"
            },
            {
              className: "type",
              begin: "\\{",
              end: "\\}",
              excludeEnd: true,
              excludeBegin: true,
              relevance: 0
            },
            {
              className: "variable",
              begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
              endsParent: true,
              relevance: 0
            },
            // eat spaces (not newlines) so we can find
            // types or variables
            {
              begin: /(?=[^\n])\s/,
              relevance: 0
            }
          ]
        }
      ]
    }
  );
  const COMMENT = {
    className: "comment",
    variants: [
      JSDOC_COMMENT,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]
  };
  const SUBST_INTERNALS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    GRAPHQL_TEMPLATE,
    TEMPLATE_STRING,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    NUMBER
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  SUBST.contains = SUBST_INTERNALS.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS$1,
    contains: [
      "self"
    ].concat(SUBST_INTERNALS)
  });
  const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
  const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: KEYWORDS$1,
      contains: ["self"].concat(SUBST_AND_COMMENTS)
    }
  ]);
  const PARAMS = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS$1,
    contains: PARAMS_CONTAINS
  };
  const CLASS_OR_EXTENDS = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1,
          /\s+/,
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  };
  const CLASS_REFERENCE = {
    relevance: 0,
    match: regex.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...TYPES,
        ...ERROR_TYPES
      ]
    }
  };
  const USE_STRICT = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  };
  const FUNCTION_DEFINITION = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          IDENT_RE$1,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [PARAMS],
    illegal: /%/
  };
  const UPPER_CASE_CONSTANT = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function noneOf(list) {
    return regex.concat("(?!", list.join("|"), ")");
  }
  const FUNCTION_CALL = {
    match: regex.concat(
      /\b/,
      noneOf([
        ...BUILT_IN_GLOBALS,
        "super",
        "import"
      ].map((x) => `${x}\\s*\\(`)),
      IDENT_RE$1,
      regex.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  };
  const PROPERTY_ACCESS = {
    begin: regex.concat(/\./, regex.lookahead(
      regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
    )),
    end: IDENT_RE$1,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  };
  const GETTER_OR_SETTER = {
    match: [
      /get|set/,
      /\s+/,
      IDENT_RE$1,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        // eat to avoid empty params
        begin: /\(\)/
      },
      PARAMS
    ]
  };
  const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
  const FUNCTION_VARIABLE = {
    match: [
      /const|var|let/,
      /\s+/,
      IDENT_RE$1,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      regex.lookahead(FUNC_LEAD_IN_RE)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      PARAMS
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: KEYWORDS$1,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
    illegal: /#(?![$_A-z])/,
    contains: [
      hljs.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      USE_STRICT,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      COMMENT,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER,
      CLASS_REFERENCE,
      {
        scope: "attr",
        match: IDENT_RE$1 + regex.lookahead(":"),
        relevance: 0
      },
      FUNCTION_VARIABLE,
      {
        // "value" container
        begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          COMMENT,
          hljs.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: FUNC_LEAD_IN_RE,
            returnBegin: true,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: hljs.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /(\s*)\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: KEYWORDS$1,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          {
            // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            // JSX
            variants: [
              { begin: FRAGMENT.begin, end: FRAGMENT.end },
              { match: XML_SELF_CLOSING },
              {
                begin: XML_TAG.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": XML_TAG.isTrulyOpeningTag,
                end: XML_TAG.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: XML_TAG.begin,
                end: XML_TAG.end,
                skip: true,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      FUNCTION_DEFINITION,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: true,
        label: "func.def",
        contains: [
          PARAMS,
          hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      PROPERTY_ACCESS,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + IDENT_RE$1,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [PARAMS]
      },
      FUNCTION_CALL,
      UPPER_CASE_CONSTANT,
      CLASS_OR_EXTENDS,
      GETTER_OR_SETTER,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
var IDENT_RE, KEYWORDS, LITERALS, TYPES, ERROR_TYPES, BUILT_IN_GLOBALS, BUILT_IN_VARIABLES, BUILT_INS;
var init_javascript = __esm({
  "node_modules/highlight.js/es/languages/javascript.js"() {
    IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
    KEYWORDS = [
      "as",
      // for exports
      "in",
      "of",
      "if",
      "for",
      "while",
      "finally",
      "var",
      "new",
      "function",
      "do",
      "return",
      "void",
      "else",
      "break",
      "catch",
      "instanceof",
      "with",
      "throw",
      "case",
      "default",
      "try",
      "switch",
      "continue",
      "typeof",
      "delete",
      "let",
      "yield",
      "const",
      "class",
      // JS handles these with a special rule
      // "get",
      // "set",
      "debugger",
      "async",
      "await",
      "static",
      "import",
      "from",
      "export",
      "extends",
      // It's reached stage 3, which is "recommended for implementation":
      "using"
    ];
    LITERALS = [
      "true",
      "false",
      "null",
      "undefined",
      "NaN",
      "Infinity"
    ];
    TYPES = [
      // Fundamental objects
      "Object",
      "Function",
      "Boolean",
      "Symbol",
      // numbers and dates
      "Math",
      "Date",
      "Number",
      "BigInt",
      // text
      "String",
      "RegExp",
      // Indexed collections
      "Array",
      "Float32Array",
      "Float64Array",
      "Int8Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Int16Array",
      "Int32Array",
      "Uint16Array",
      "Uint32Array",
      "BigInt64Array",
      "BigUint64Array",
      // Keyed collections
      "Set",
      "Map",
      "WeakSet",
      "WeakMap",
      // Structured data
      "ArrayBuffer",
      "SharedArrayBuffer",
      "Atomics",
      "DataView",
      "JSON",
      // Control abstraction objects
      "Promise",
      "Generator",
      "GeneratorFunction",
      "AsyncFunction",
      // Reflection
      "Reflect",
      "Proxy",
      // Internationalization
      "Intl",
      // WebAssembly
      "WebAssembly"
    ];
    ERROR_TYPES = [
      "Error",
      "EvalError",
      "InternalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError"
    ];
    BUILT_IN_GLOBALS = [
      "setInterval",
      "setTimeout",
      "clearInterval",
      "clearTimeout",
      "require",
      "exports",
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "escape",
      "unescape"
    ];
    BUILT_IN_VARIABLES = [
      "arguments",
      "this",
      "super",
      "console",
      "window",
      "document",
      "localStorage",
      "sessionStorage",
      "module",
      "global"
      // Node.js
    ];
    BUILT_INS = [].concat(
      BUILT_IN_GLOBALS,
      TYPES,
      ERROR_TYPES
    );
  }
});

// node_modules/highlight.js/es/languages/json.js
function json(hljs) {
  const ATTRIBUTE = {
    className: "attr",
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  };
  const PUNCTUATION = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  };
  const LITERALS3 = [
    "true",
    "false",
    "null"
  ];
  const LITERALS_MODE = {
    scope: "literal",
    beginKeywords: LITERALS3.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc"],
    keywords: {
      literal: LITERALS3
    },
    contains: [
      ATTRIBUTE,
      PUNCTUATION,
      hljs.QUOTE_STRING_MODE,
      LITERALS_MODE,
      hljs.C_NUMBER_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
var init_json = __esm({
  "node_modules/highlight.js/es/languages/json.js"() {
  }
});

// node_modules/highlight.js/es/languages/markdown.js
function markdown(hljs) {
  const regex = hljs.regex;
  const INLINE_HTML = {
    begin: /<\/?[A-Za-z_]/,
    end: ">",
    subLanguage: "xml",
    relevance: 0
  };
  const HORIZONTAL_RULE = {
    begin: "^[-\\*]{3,}",
    end: "$"
  };
  const CODE = {
    className: "code",
    variants: [
      // TODO: fix to allow these to work with sublanguage also
      { begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
      { begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*" },
      // needed to allow markdown as a sublanguage to work
      {
        begin: "```",
        end: "```+[ ]*$"
      },
      {
        begin: "~~~",
        end: "~~~+[ ]*$"
      },
      { begin: "`.+?`" },
      {
        begin: "(?=^( {4}|\\t))",
        // use contains to gobble up multiple lines to allow the block to be whatever size
        // but only have a single open/close tag vs one per line
        contains: [
          {
            begin: "^( {4}|\\t)",
            end: "(\\n)$"
          }
        ],
        relevance: 0
      }
    ]
  };
  const LIST = {
    className: "bullet",
    begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
    end: "\\s+",
    excludeEnd: true
  };
  const LINK_REFERENCE = {
    begin: /^\[[^\n]+\]:/,
    returnBegin: true,
    contains: [
      {
        className: "symbol",
        begin: /\[/,
        end: /\]/,
        excludeBegin: true,
        excludeEnd: true
      },
      {
        className: "link",
        begin: /:\s*/,
        end: /$/,
        excludeBegin: true
      }
    ]
  };
  const URL_SCHEME = /[A-Za-z][A-Za-z0-9+.-]*/;
  const LINK = {
    variants: [
      // too much like nested array access in so many languages
      // to have any real relevance
      {
        begin: /\[.+?\]\[.*?\]/,
        relevance: 0
      },
      // popular internet URLs
      {
        begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
        relevance: 2
      },
      {
        begin: regex.concat(/\[.+?\]\(/, URL_SCHEME, /:\/\/.*?\)/),
        relevance: 2
      },
      // relative urls
      {
        begin: /\[.+?\]\([./?&#].*?\)/,
        relevance: 1
      },
      // whatever else, lower relevance (might not be a link at all)
      {
        begin: /\[.*?\]\(.*?\)/,
        relevance: 0
      }
    ],
    returnBegin: true,
    contains: [
      {
        // empty strings for alt or link text
        match: /\[(?=\])/
      },
      {
        className: "string",
        relevance: 0,
        begin: "\\[",
        end: "\\]",
        excludeBegin: true,
        returnEnd: true
      },
      {
        className: "link",
        relevance: 0,
        begin: "\\]\\(",
        end: "\\)",
        excludeBegin: true,
        excludeEnd: true
      },
      {
        className: "symbol",
        relevance: 0,
        begin: "\\]\\[",
        end: "\\]",
        excludeBegin: true,
        excludeEnd: true
      }
    ]
  };
  const BOLD = {
    className: "strong",
    contains: [],
    // defined later
    variants: [
      {
        begin: /_{2}(?!\s)/,
        end: /_{2}/
      },
      {
        begin: /\*{2}(?!\s)/,
        end: /\*{2}/
      }
    ]
  };
  const ITALIC = {
    className: "emphasis",
    contains: [],
    // defined later
    variants: [
      {
        begin: /\*(?![*\s])/,
        end: /\*/
      },
      {
        begin: /_(?![_\s])/,
        end: /_/,
        relevance: 0
      }
    ]
  };
  const BOLD_WITHOUT_ITALIC = hljs.inherit(BOLD, { contains: [] });
  const ITALIC_WITHOUT_BOLD = hljs.inherit(ITALIC, { contains: [] });
  BOLD.contains.push(ITALIC_WITHOUT_BOLD);
  ITALIC.contains.push(BOLD_WITHOUT_ITALIC);
  let CONTAINABLE = [
    INLINE_HTML,
    LINK
  ];
  [
    BOLD,
    ITALIC,
    BOLD_WITHOUT_ITALIC,
    ITALIC_WITHOUT_BOLD
  ].forEach((m) => {
    m.contains = m.contains.concat(CONTAINABLE);
  });
  CONTAINABLE = CONTAINABLE.concat(BOLD, ITALIC);
  const HEADER = {
    className: "section",
    variants: [
      {
        begin: "^#{1,6}",
        end: "$",
        contains: CONTAINABLE
      },
      {
        begin: "(?=^.+?\\n[=-]{2,}$)",
        contains: [
          { begin: "^[=-]*$" },
          {
            begin: "^",
            end: "\\n",
            contains: CONTAINABLE
          }
        ]
      }
    ]
  };
  const BLOCKQUOTE = {
    className: "quote",
    begin: "^>\\s+",
    contains: CONTAINABLE,
    end: "$"
  };
  const ENTITY = {
    //https://spec.commonmark.org/0.31.2/#entity-references
    scope: "literal",
    match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/
  };
  return {
    name: "Markdown",
    aliases: [
      "md",
      "mkdown",
      "mkd"
    ],
    contains: [
      HEADER,
      INLINE_HTML,
      LIST,
      BOLD,
      ITALIC,
      BLOCKQUOTE,
      CODE,
      HORIZONTAL_RULE,
      LINK,
      LINK_REFERENCE,
      ENTITY
    ]
  };
}
var init_markdown = __esm({
  "node_modules/highlight.js/es/languages/markdown.js"() {
  }
});

// node_modules/highlight.js/es/languages/php.js
function php(hljs) {
  const regex = hljs.regex;
  const NOT_PERL_ETC = /(?![A-Za-z0-9])(?![$])/;
  const IDENT_RE3 = regex.concat(
    /[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/,
    NOT_PERL_ETC
  );
  const PASCAL_CASE_CLASS_NAME_RE = regex.concat(
    /(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,
    NOT_PERL_ETC
  );
  const UPCASE_NAME_RE = regex.concat(
    /[A-Z]+/,
    NOT_PERL_ETC
  );
  const VARIABLE = {
    scope: "variable",
    match: "\\$+" + IDENT_RE3
  };
  const PREPROCESSOR = {
    scope: "meta",
    variants: [
      { begin: /<\?php/, relevance: 10 },
      // boost for obvious PHP
      { begin: /<\?=/ },
      // less relevant per PSR-1 which says not to use short-tags
      { begin: /<\?/, relevance: 0.1 },
      { begin: /\?>/ }
      // end php tag
    ]
  };
  const SUBST = {
    scope: "subst",
    variants: [
      { begin: /\$\w+/ },
      {
        begin: /\{\$/,
        end: /\}/
      }
    ]
  };
  const SINGLE_QUOTED = hljs.inherit(hljs.APOS_STRING_MODE, { illegal: null });
  const DOUBLE_QUOTED = hljs.inherit(hljs.QUOTE_STRING_MODE, {
    illegal: null,
    contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST)
  });
  const HEREDOC = {
    begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
    end: /[ \t]*(\w+)\b/,
    contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST),
    "on:begin": (m, resp) => {
      resp.data._beginMatch = m[1] || m[2];
    },
    "on:end": (m, resp) => {
      if (resp.data._beginMatch !== m[1]) resp.ignoreMatch();
    }
  };
  const NOWDOC = hljs.END_SAME_AS_BEGIN({
    begin: /<<<[ \t]*'(\w+)'\n/,
    end: /[ \t]*(\w+)\b/
  });
  const WHITESPACE = "[ 	\n]";
  const STRING = {
    scope: "string",
    variants: [
      DOUBLE_QUOTED,
      SINGLE_QUOTED,
      HEREDOC,
      NOWDOC
    ]
  };
  const NUMBER = {
    scope: "number",
    variants: [
      { begin: `\\b0[bB][01]+(?:_[01]+)*\\b` },
      // Binary w/ underscore support
      { begin: `\\b0[oO][0-7]+(?:_[0-7]+)*\\b` },
      // Octals w/ underscore support
      { begin: `\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b` },
      // Hex w/ underscore support
      // Decimals w/ underscore support, with optional fragments and scientific exponent (e) suffix.
      { begin: `(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?` }
    ],
    relevance: 0
  };
  const LITERALS3 = [
    "false",
    "null",
    "true"
  ];
  const KWS = [
    // Magic constants:
    // <https://www.php.net/manual/en/language.constants.predefined.php>
    "__CLASS__",
    "__DIR__",
    "__FILE__",
    "__FUNCTION__",
    "__COMPILER_HALT_OFFSET__",
    "__LINE__",
    "__METHOD__",
    "__NAMESPACE__",
    "__TRAIT__",
    // Function that look like language construct or language construct that look like function:
    // List of keywords that may not require parenthesis
    "die",
    "echo",
    "exit",
    "include",
    "include_once",
    "print",
    "require",
    "require_once",
    // These are not language construct (function) but operate on the currently-executing function and can access the current symbol table
    // 'compact extract func_get_arg func_get_args func_num_args get_called_class get_parent_class ' +
    // Other keywords:
    // <https://www.php.net/manual/en/reserved.php>
    // <https://www.php.net/manual/en/language.types.type-juggling.php>
    "array",
    "abstract",
    "and",
    "as",
    "binary",
    "bool",
    "boolean",
    "break",
    "callable",
    "case",
    "catch",
    "class",
    "clone",
    "const",
    "continue",
    "declare",
    "default",
    "do",
    "double",
    "else",
    "elseif",
    "empty",
    "enddeclare",
    "endfor",
    "endforeach",
    "endif",
    "endswitch",
    "endwhile",
    "enum",
    "eval",
    "extends",
    "final",
    "finally",
    "float",
    "for",
    "foreach",
    "from",
    "global",
    "goto",
    "if",
    "implements",
    "instanceof",
    "insteadof",
    "int",
    "integer",
    "interface",
    "isset",
    "iterable",
    "list",
    "match|0",
    "mixed",
    "new",
    "never",
    "object",
    "or",
    "private",
    "protected",
    "public",
    "readonly",
    "real",
    "return",
    "string",
    "switch",
    "throw",
    "trait",
    "try",
    "unset",
    "use",
    "var",
    "void",
    "while",
    "xor",
    "yield"
  ];
  const BUILT_INS3 = [
    // Standard PHP library:
    // <https://www.php.net/manual/en/book.spl.php>
    "Error|0",
    "AppendIterator",
    "ArgumentCountError",
    "ArithmeticError",
    "ArrayIterator",
    "ArrayObject",
    "AssertionError",
    "BadFunctionCallException",
    "BadMethodCallException",
    "CachingIterator",
    "CallbackFilterIterator",
    "CompileError",
    "Countable",
    "DirectoryIterator",
    "DivisionByZeroError",
    "DomainException",
    "EmptyIterator",
    "ErrorException",
    "Exception",
    "FilesystemIterator",
    "FilterIterator",
    "GlobIterator",
    "InfiniteIterator",
    "InvalidArgumentException",
    "IteratorIterator",
    "LengthException",
    "LimitIterator",
    "LogicException",
    "MultipleIterator",
    "NoRewindIterator",
    "OutOfBoundsException",
    "OutOfRangeException",
    "OuterIterator",
    "OverflowException",
    "ParentIterator",
    "ParseError",
    "RangeException",
    "RecursiveArrayIterator",
    "RecursiveCachingIterator",
    "RecursiveCallbackFilterIterator",
    "RecursiveDirectoryIterator",
    "RecursiveFilterIterator",
    "RecursiveIterator",
    "RecursiveIteratorIterator",
    "RecursiveRegexIterator",
    "RecursiveTreeIterator",
    "RegexIterator",
    "RuntimeException",
    "SeekableIterator",
    "SplDoublyLinkedList",
    "SplFileInfo",
    "SplFileObject",
    "SplFixedArray",
    "SplHeap",
    "SplMaxHeap",
    "SplMinHeap",
    "SplObjectStorage",
    "SplObserver",
    "SplPriorityQueue",
    "SplQueue",
    "SplStack",
    "SplSubject",
    "SplTempFileObject",
    "TypeError",
    "UnderflowException",
    "UnexpectedValueException",
    "UnhandledMatchError",
    // Reserved interfaces:
    // <https://www.php.net/manual/en/reserved.interfaces.php>
    "ArrayAccess",
    "BackedEnum",
    "Closure",
    "Fiber",
    "Generator",
    "Iterator",
    "IteratorAggregate",
    "Serializable",
    "Stringable",
    "Throwable",
    "Traversable",
    "UnitEnum",
    "WeakReference",
    "WeakMap",
    // Reserved classes:
    // <https://www.php.net/manual/en/reserved.classes.php>
    "Directory",
    "__PHP_Incomplete_Class",
    "parent",
    "php_user_filter",
    "self",
    "static",
    "stdClass"
  ];
  const dualCase = (items) => {
    const result = [];
    items.forEach((item) => {
      result.push(item);
      if (item.toLowerCase() === item) {
        result.push(item.toUpperCase());
      } else {
        result.push(item.toLowerCase());
      }
    });
    return result;
  };
  const KEYWORDS3 = {
    keyword: KWS,
    literal: dualCase(LITERALS3),
    built_in: BUILT_INS3
  };
  const normalizeKeywords = (items) => {
    return items.map((item) => {
      return item.replace(/\|\d+$/, "");
    });
  };
  const CONSTRUCTOR_CALL = { variants: [
    {
      match: [
        /new/,
        regex.concat(WHITESPACE, "+"),
        // to prevent built ins from being confused as the class constructor call
        regex.concat("(?!", normalizeKeywords(BUILT_INS3).join("\\b|"), "\\b)"),
        PASCAL_CASE_CLASS_NAME_RE
      ],
      scope: {
        1: "keyword",
        4: "title.class"
      }
    }
  ] };
  const CONSTANT_REFERENCE = regex.concat(IDENT_RE3, "\\b(?!\\()");
  const LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON = { variants: [
    {
      match: [
        regex.concat(
          /::/,
          regex.lookahead(/(?!class\b)/)
        ),
        CONSTANT_REFERENCE
      ],
      scope: { 2: "variable.constant" }
    },
    {
      match: [
        /::/,
        /class/
      ],
      scope: { 2: "variable.language" }
    },
    {
      match: [
        PASCAL_CASE_CLASS_NAME_RE,
        regex.concat(
          /::/,
          regex.lookahead(/(?!class\b)/)
        ),
        CONSTANT_REFERENCE
      ],
      scope: {
        1: "title.class",
        3: "variable.constant"
      }
    },
    {
      match: [
        PASCAL_CASE_CLASS_NAME_RE,
        regex.concat(
          "::",
          regex.lookahead(/(?!class\b)/)
        )
      ],
      scope: { 1: "title.class" }
    },
    {
      match: [
        PASCAL_CASE_CLASS_NAME_RE,
        /::/,
        /class/
      ],
      scope: {
        1: "title.class",
        3: "variable.language"
      }
    }
  ] };
  const NAMED_ARGUMENT = {
    scope: "attr",
    match: regex.concat(IDENT_RE3, regex.lookahead(":"), regex.lookahead(/(?!::)/))
  };
  const PARAMS_MODE = {
    relevance: 0,
    begin: /\(/,
    end: /\)/,
    keywords: KEYWORDS3,
    contains: [
      NAMED_ARGUMENT,
      VARIABLE,
      LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
      hljs.C_BLOCK_COMMENT_MODE,
      STRING,
      NUMBER,
      CONSTRUCTOR_CALL
    ]
  };
  const FUNCTION_INVOKE = {
    relevance: 0,
    match: [
      /\b/,
      // to prevent keywords from being confused as the function title
      regex.concat("(?!fn\\b|function\\b|", normalizeKeywords(KWS).join("\\b|"), "|", normalizeKeywords(BUILT_INS3).join("\\b|"), "\\b)"),
      IDENT_RE3,
      regex.concat(WHITESPACE, "*"),
      regex.lookahead(/(?=\()/)
    ],
    scope: { 3: "title.function.invoke" },
    contains: [PARAMS_MODE]
  };
  PARAMS_MODE.contains.push(FUNCTION_INVOKE);
  const ATTRIBUTE_CONTAINS = [
    NAMED_ARGUMENT,
    LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
    hljs.C_BLOCK_COMMENT_MODE,
    STRING,
    NUMBER,
    CONSTRUCTOR_CALL
  ];
  const ATTRIBUTES3 = {
    begin: regex.concat(
      /#\[\s*\\?/,
      regex.either(
        PASCAL_CASE_CLASS_NAME_RE,
        UPCASE_NAME_RE
      )
    ),
    beginScope: "meta",
    end: /]/,
    endScope: "meta",
    keywords: {
      literal: LITERALS3,
      keyword: [
        "new",
        "array"
      ]
    },
    contains: [
      {
        begin: /\[/,
        end: /]/,
        keywords: {
          literal: LITERALS3,
          keyword: [
            "new",
            "array"
          ]
        },
        contains: [
          "self",
          ...ATTRIBUTE_CONTAINS
        ]
      },
      ...ATTRIBUTE_CONTAINS,
      {
        scope: "meta",
        variants: [
          { match: PASCAL_CASE_CLASS_NAME_RE },
          { match: UPCASE_NAME_RE }
        ]
      }
    ]
  };
  return {
    case_insensitive: false,
    keywords: KEYWORDS3,
    contains: [
      ATTRIBUTES3,
      hljs.HASH_COMMENT_MODE,
      hljs.COMMENT("//", "$"),
      hljs.COMMENT(
        "/\\*",
        "\\*/",
        { contains: [
          {
            scope: "doctag",
            match: "@[A-Za-z]+"
          }
        ] }
      ),
      {
        match: /__halt_compiler\(\);/,
        keywords: "__halt_compiler",
        starts: {
          scope: "comment",
          end: hljs.MATCH_NOTHING_RE,
          contains: [
            {
              match: /\?>/,
              scope: "meta",
              endsParent: true
            }
          ]
        }
      },
      PREPROCESSOR,
      {
        scope: "variable.language",
        match: /\$this\b/
      },
      VARIABLE,
      FUNCTION_INVOKE,
      LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
      {
        match: [
          /const/,
          /\s/,
          IDENT_RE3
        ],
        scope: {
          1: "keyword",
          3: "variable.constant"
        }
      },
      CONSTRUCTOR_CALL,
      {
        scope: "function",
        relevance: 0,
        beginKeywords: "fn function",
        end: /[;{]/,
        excludeEnd: true,
        illegal: "[$%\\[]",
        contains: [
          { beginKeywords: "use" },
          hljs.UNDERSCORE_TITLE_MODE,
          {
            begin: "=>",
            // No markup, just a relevance booster
            endsParent: true
          },
          {
            scope: "params",
            begin: "\\(",
            end: "\\)",
            excludeBegin: true,
            excludeEnd: true,
            keywords: KEYWORDS3,
            contains: [
              "self",
              ATTRIBUTES3,
              VARIABLE,
              LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
              hljs.C_BLOCK_COMMENT_MODE,
              STRING,
              NUMBER
            ]
          }
        ]
      },
      {
        scope: "class",
        variants: [
          {
            beginKeywords: "enum",
            illegal: /[($"]/
          },
          {
            beginKeywords: "class interface trait",
            illegal: /[:($"]/
          }
        ],
        relevance: 0,
        end: /\{/,
        excludeEnd: true,
        contains: [
          { beginKeywords: "extends implements" },
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      // both use and namespace still use "old style" rules (vs multi-match)
      // because the namespace name can include `\` and we still want each
      // element to be treated as its own *individual* title
      {
        beginKeywords: "namespace",
        relevance: 0,
        end: ";",
        illegal: /[.']/,
        contains: [hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
      },
      {
        beginKeywords: "use",
        relevance: 0,
        end: ";",
        contains: [
          // TODO: title.function vs title.class
          {
            match: /\b(as|const|function)\b/,
            scope: "keyword"
          },
          // TODO: could be title.class or title.function
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      STRING,
      NUMBER
    ]
  };
}
var init_php = __esm({
  "node_modules/highlight.js/es/languages/php.js"() {
  }
});

// node_modules/highlight.js/es/languages/plaintext.js
function plaintext(hljs) {
  return {
    name: "Plain text",
    aliases: [
      "text",
      "txt"
    ],
    disableAutodetect: true
  };
}
var init_plaintext = __esm({
  "node_modules/highlight.js/es/languages/plaintext.js"() {
  }
});

// node_modules/highlight.js/es/languages/scss.js
function scss(hljs) {
  const modes = MODES2(hljs);
  const PSEUDO_ELEMENTS$1 = PSEUDO_ELEMENTS2;
  const PSEUDO_CLASSES$1 = PSEUDO_CLASSES2;
  const AT_IDENTIFIER = "@[a-z-]+";
  const AT_MODIFIERS = "and or not only";
  const IDENT_RE3 = "[a-zA-Z-][a-zA-Z0-9_-]*";
  const VARIABLE = {
    className: "variable",
    begin: "(\\$" + IDENT_RE3 + ")\\b",
    relevance: 0
  };
  return {
    name: "SCSS",
    case_insensitive: true,
    illegal: "[=/|']",
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      // to recognize keyframe 40% etc which are outside the scope of our
      // attribute value mode
      modes.CSS_NUMBER_MODE,
      {
        className: "selector-id",
        begin: "#[A-Za-z0-9_-]+",
        relevance: 0
      },
      {
        className: "selector-class",
        begin: "\\.[A-Za-z0-9_-]+",
        relevance: 0
      },
      modes.ATTRIBUTE_SELECTOR_MODE,
      {
        className: "selector-tag",
        begin: "\\b(" + TAGS3.join("|") + ")\\b",
        // was there, before, but why?
        relevance: 0
      },
      {
        className: "selector-pseudo",
        begin: ":(" + PSEUDO_CLASSES$1.join("|") + ")"
      },
      {
        className: "selector-pseudo",
        begin: ":(:)?(" + PSEUDO_ELEMENTS$1.join("|") + ")"
      },
      VARIABLE,
      {
        // pseudo-selector params
        begin: /\(/,
        end: /\)/,
        contains: [modes.CSS_NUMBER_MODE]
      },
      modes.CSS_VARIABLE,
      {
        className: "attribute",
        begin: "\\b(" + ATTRIBUTES2.join("|") + ")\\b"
      },
      { begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b" },
      {
        begin: /:/,
        end: /[;}{]/,
        relevance: 0,
        contains: [
          modes.BLOCK_COMMENT,
          VARIABLE,
          modes.HEXCOLOR,
          modes.CSS_NUMBER_MODE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          modes.IMPORTANT,
          modes.FUNCTION_DISPATCH
        ]
      },
      // matching these here allows us to treat them more like regular CSS
      // rules so everything between the {} gets regular rule highlighting,
      // which is what we want for page and font-face
      {
        begin: "@(page|font-face)",
        keywords: {
          $pattern: AT_IDENTIFIER,
          keyword: "@page @font-face"
        }
      },
      {
        begin: "@",
        end: "[{;]",
        returnBegin: true,
        keywords: {
          $pattern: /[a-z-]+/,
          keyword: AT_MODIFIERS,
          attribute: MEDIA_FEATURES2.join(" ")
        },
        contains: [
          {
            begin: AT_IDENTIFIER,
            className: "keyword"
          },
          {
            begin: /[a-z-]+(?=:)/,
            className: "attribute"
          },
          VARIABLE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          modes.HEXCOLOR,
          modes.CSS_NUMBER_MODE
        ]
      },
      modes.FUNCTION_DISPATCH
    ]
  };
}
var MODES2, HTML_TAGS2, SVG_TAGS2, TAGS3, MEDIA_FEATURES2, PSEUDO_CLASSES2, PSEUDO_ELEMENTS2, ATTRIBUTES2;
var init_scss = __esm({
  "node_modules/highlight.js/es/languages/scss.js"() {
    MODES2 = (hljs) => {
      return {
        IMPORTANT: {
          scope: "meta",
          begin: "!important"
        },
        BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
        HEXCOLOR: {
          scope: "number",
          begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
        },
        FUNCTION_DISPATCH: {
          className: "built_in",
          begin: /[\w-]+(?=\()/
        },
        ATTRIBUTE_SELECTOR_MODE: {
          scope: "selector-attr",
          begin: /\[/,
          end: /\]/,
          illegal: "$",
          contains: [
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE
          ]
        },
        CSS_NUMBER_MODE: {
          scope: "number",
          begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
          relevance: 0
        },
        CSS_VARIABLE: {
          className: "attr",
          begin: /--[A-Za-z_][A-Za-z0-9_-]*/
        }
      };
    };
    HTML_TAGS2 = [
      "a",
      "abbr",
      "address",
      "article",
      "aside",
      "audio",
      "b",
      "blockquote",
      "body",
      "button",
      "canvas",
      "caption",
      "cite",
      "code",
      "dd",
      "del",
      "details",
      "dfn",
      "div",
      "dl",
      "dt",
      "em",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hgroup",
      "html",
      "i",
      "iframe",
      "img",
      "input",
      "ins",
      "kbd",
      "label",
      "legend",
      "li",
      "main",
      "mark",
      "menu",
      "nav",
      "object",
      "ol",
      "optgroup",
      "option",
      "p",
      "picture",
      "q",
      "quote",
      "samp",
      "section",
      "select",
      "source",
      "span",
      "strong",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "textarea",
      "tfoot",
      "th",
      "thead",
      "time",
      "tr",
      "ul",
      "var",
      "video"
    ];
    SVG_TAGS2 = [
      "defs",
      "g",
      "marker",
      "mask",
      "pattern",
      "svg",
      "switch",
      "symbol",
      "feBlend",
      "feColorMatrix",
      "feComponentTransfer",
      "feComposite",
      "feConvolveMatrix",
      "feDiffuseLighting",
      "feDisplacementMap",
      "feFlood",
      "feGaussianBlur",
      "feImage",
      "feMerge",
      "feMorphology",
      "feOffset",
      "feSpecularLighting",
      "feTile",
      "feTurbulence",
      "linearGradient",
      "radialGradient",
      "stop",
      "circle",
      "ellipse",
      "image",
      "line",
      "path",
      "polygon",
      "polyline",
      "rect",
      "text",
      "use",
      "textPath",
      "tspan",
      "foreignObject",
      "clipPath"
    ];
    TAGS3 = [
      ...HTML_TAGS2,
      ...SVG_TAGS2
    ];
    MEDIA_FEATURES2 = [
      "any-hover",
      "any-pointer",
      "aspect-ratio",
      "color",
      "color-gamut",
      "color-index",
      "device-aspect-ratio",
      "device-height",
      "device-width",
      "display-mode",
      "forced-colors",
      "grid",
      "height",
      "hover",
      "inverted-colors",
      "monochrome",
      "orientation",
      "overflow-block",
      "overflow-inline",
      "pointer",
      "prefers-color-scheme",
      "prefers-contrast",
      "prefers-reduced-motion",
      "prefers-reduced-transparency",
      "resolution",
      "scan",
      "scripting",
      "update",
      "width",
      // TODO: find a better solution?
      "min-width",
      "max-width",
      "min-height",
      "max-height"
    ].sort().reverse();
    PSEUDO_CLASSES2 = [
      "active",
      "any-link",
      "blank",
      "checked",
      "current",
      "default",
      "defined",
      "dir",
      // dir()
      "disabled",
      "drop",
      "empty",
      "enabled",
      "first",
      "first-child",
      "first-of-type",
      "fullscreen",
      "future",
      "focus",
      "focus-visible",
      "focus-within",
      "has",
      // has()
      "host",
      // host or host()
      "host-context",
      // host-context()
      "hover",
      "indeterminate",
      "in-range",
      "invalid",
      "is",
      // is()
      "lang",
      // lang()
      "last-child",
      "last-of-type",
      "left",
      "link",
      "local-link",
      "not",
      // not()
      "nth-child",
      // nth-child()
      "nth-col",
      // nth-col()
      "nth-last-child",
      // nth-last-child()
      "nth-last-col",
      // nth-last-col()
      "nth-last-of-type",
      //nth-last-of-type()
      "nth-of-type",
      //nth-of-type()
      "only-child",
      "only-of-type",
      "optional",
      "out-of-range",
      "past",
      "placeholder-shown",
      "read-only",
      "read-write",
      "required",
      "right",
      "root",
      "scope",
      "target",
      "target-within",
      "user-invalid",
      "valid",
      "visited",
      "where"
      // where()
    ].sort().reverse();
    PSEUDO_ELEMENTS2 = [
      "after",
      "backdrop",
      "before",
      "cue",
      "cue-region",
      "first-letter",
      "first-line",
      "grammar-error",
      "marker",
      "part",
      "placeholder",
      "selection",
      "slotted",
      "spelling-error"
    ].sort().reverse();
    ATTRIBUTES2 = [
      "accent-color",
      "align-content",
      "align-items",
      "align-self",
      "alignment-baseline",
      "all",
      "anchor-name",
      "animation",
      "animation-composition",
      "animation-delay",
      "animation-direction",
      "animation-duration",
      "animation-fill-mode",
      "animation-iteration-count",
      "animation-name",
      "animation-play-state",
      "animation-range",
      "animation-range-end",
      "animation-range-start",
      "animation-timeline",
      "animation-timing-function",
      "appearance",
      "aspect-ratio",
      "backdrop-filter",
      "backface-visibility",
      "background",
      "background-attachment",
      "background-blend-mode",
      "background-clip",
      "background-color",
      "background-image",
      "background-origin",
      "background-position",
      "background-position-x",
      "background-position-y",
      "background-repeat",
      "background-size",
      "baseline-shift",
      "block-size",
      "border",
      "border-block",
      "border-block-color",
      "border-block-end",
      "border-block-end-color",
      "border-block-end-style",
      "border-block-end-width",
      "border-block-start",
      "border-block-start-color",
      "border-block-start-style",
      "border-block-start-width",
      "border-block-style",
      "border-block-width",
      "border-bottom",
      "border-bottom-color",
      "border-bottom-left-radius",
      "border-bottom-right-radius",
      "border-bottom-style",
      "border-bottom-width",
      "border-collapse",
      "border-color",
      "border-end-end-radius",
      "border-end-start-radius",
      "border-image",
      "border-image-outset",
      "border-image-repeat",
      "border-image-slice",
      "border-image-source",
      "border-image-width",
      "border-inline",
      "border-inline-color",
      "border-inline-end",
      "border-inline-end-color",
      "border-inline-end-style",
      "border-inline-end-width",
      "border-inline-start",
      "border-inline-start-color",
      "border-inline-start-style",
      "border-inline-start-width",
      "border-inline-style",
      "border-inline-width",
      "border-left",
      "border-left-color",
      "border-left-style",
      "border-left-width",
      "border-radius",
      "border-right",
      "border-right-color",
      "border-right-style",
      "border-right-width",
      "border-spacing",
      "border-start-end-radius",
      "border-start-start-radius",
      "border-style",
      "border-top",
      "border-top-color",
      "border-top-left-radius",
      "border-top-right-radius",
      "border-top-style",
      "border-top-width",
      "border-width",
      "bottom",
      "box-align",
      "box-decoration-break",
      "box-direction",
      "box-flex",
      "box-flex-group",
      "box-lines",
      "box-ordinal-group",
      "box-orient",
      "box-pack",
      "box-shadow",
      "box-sizing",
      "break-after",
      "break-before",
      "break-inside",
      "caption-side",
      "caret-color",
      "clear",
      "clip",
      "clip-path",
      "clip-rule",
      "color",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "color-scheme",
      "column-count",
      "column-fill",
      "column-gap",
      "column-rule",
      "column-rule-color",
      "column-rule-style",
      "column-rule-width",
      "column-span",
      "column-width",
      "columns",
      "contain",
      "contain-intrinsic-block-size",
      "contain-intrinsic-height",
      "contain-intrinsic-inline-size",
      "contain-intrinsic-size",
      "contain-intrinsic-width",
      "container",
      "container-name",
      "container-type",
      "content",
      "content-visibility",
      "counter-increment",
      "counter-reset",
      "counter-set",
      "cue",
      "cue-after",
      "cue-before",
      "cursor",
      "cx",
      "cy",
      "direction",
      "display",
      "dominant-baseline",
      "empty-cells",
      "enable-background",
      "field-sizing",
      "fill",
      "fill-opacity",
      "fill-rule",
      "filter",
      "flex",
      "flex-basis",
      "flex-direction",
      "flex-flow",
      "flex-grow",
      "flex-shrink",
      "flex-wrap",
      "float",
      "flood-color",
      "flood-opacity",
      "flow",
      "font",
      "font-display",
      "font-family",
      "font-feature-settings",
      "font-kerning",
      "font-language-override",
      "font-optical-sizing",
      "font-palette",
      "font-size",
      "font-size-adjust",
      "font-smooth",
      "font-smoothing",
      "font-stretch",
      "font-style",
      "font-synthesis",
      "font-synthesis-position",
      "font-synthesis-small-caps",
      "font-synthesis-style",
      "font-synthesis-weight",
      "font-variant",
      "font-variant-alternates",
      "font-variant-caps",
      "font-variant-east-asian",
      "font-variant-emoji",
      "font-variant-ligatures",
      "font-variant-numeric",
      "font-variant-position",
      "font-variation-settings",
      "font-weight",
      "forced-color-adjust",
      "gap",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "grid",
      "grid-area",
      "grid-auto-columns",
      "grid-auto-flow",
      "grid-auto-rows",
      "grid-column",
      "grid-column-end",
      "grid-column-start",
      "grid-gap",
      "grid-row",
      "grid-row-end",
      "grid-row-start",
      "grid-template",
      "grid-template-areas",
      "grid-template-columns",
      "grid-template-rows",
      "hanging-punctuation",
      "height",
      "hyphenate-character",
      "hyphenate-limit-chars",
      "hyphens",
      "icon",
      "image-orientation",
      "image-rendering",
      "image-resolution",
      "ime-mode",
      "initial-letter",
      "initial-letter-align",
      "inline-size",
      "inset",
      "inset-area",
      "inset-block",
      "inset-block-end",
      "inset-block-start",
      "inset-inline",
      "inset-inline-end",
      "inset-inline-start",
      "isolation",
      "justify-content",
      "justify-items",
      "justify-self",
      "kerning",
      "left",
      "letter-spacing",
      "lighting-color",
      "line-break",
      "line-height",
      "line-height-step",
      "list-style",
      "list-style-image",
      "list-style-position",
      "list-style-type",
      "margin",
      "margin-block",
      "margin-block-end",
      "margin-block-start",
      "margin-bottom",
      "margin-inline",
      "margin-inline-end",
      "margin-inline-start",
      "margin-left",
      "margin-right",
      "margin-top",
      "margin-trim",
      "marker",
      "marker-end",
      "marker-mid",
      "marker-start",
      "marks",
      "mask",
      "mask-border",
      "mask-border-mode",
      "mask-border-outset",
      "mask-border-repeat",
      "mask-border-slice",
      "mask-border-source",
      "mask-border-width",
      "mask-clip",
      "mask-composite",
      "mask-image",
      "mask-mode",
      "mask-origin",
      "mask-position",
      "mask-repeat",
      "mask-size",
      "mask-type",
      "masonry-auto-flow",
      "math-depth",
      "math-shift",
      "math-style",
      "max-block-size",
      "max-height",
      "max-inline-size",
      "max-width",
      "min-block-size",
      "min-height",
      "min-inline-size",
      "min-width",
      "mix-blend-mode",
      "nav-down",
      "nav-index",
      "nav-left",
      "nav-right",
      "nav-up",
      "none",
      "normal",
      "object-fit",
      "object-position",
      "offset",
      "offset-anchor",
      "offset-distance",
      "offset-path",
      "offset-position",
      "offset-rotate",
      "opacity",
      "order",
      "orphans",
      "outline",
      "outline-color",
      "outline-offset",
      "outline-style",
      "outline-width",
      "overflow",
      "overflow-anchor",
      "overflow-block",
      "overflow-clip-margin",
      "overflow-inline",
      "overflow-wrap",
      "overflow-x",
      "overflow-y",
      "overlay",
      "overscroll-behavior",
      "overscroll-behavior-block",
      "overscroll-behavior-inline",
      "overscroll-behavior-x",
      "overscroll-behavior-y",
      "padding",
      "padding-block",
      "padding-block-end",
      "padding-block-start",
      "padding-bottom",
      "padding-inline",
      "padding-inline-end",
      "padding-inline-start",
      "padding-left",
      "padding-right",
      "padding-top",
      "page",
      "page-break-after",
      "page-break-before",
      "page-break-inside",
      "paint-order",
      "pause",
      "pause-after",
      "pause-before",
      "perspective",
      "perspective-origin",
      "place-content",
      "place-items",
      "place-self",
      "pointer-events",
      "position",
      "position-anchor",
      "position-visibility",
      "print-color-adjust",
      "quotes",
      "r",
      "resize",
      "rest",
      "rest-after",
      "rest-before",
      "right",
      "rotate",
      "row-gap",
      "ruby-align",
      "ruby-position",
      "scale",
      "scroll-behavior",
      "scroll-margin",
      "scroll-margin-block",
      "scroll-margin-block-end",
      "scroll-margin-block-start",
      "scroll-margin-bottom",
      "scroll-margin-inline",
      "scroll-margin-inline-end",
      "scroll-margin-inline-start",
      "scroll-margin-left",
      "scroll-margin-right",
      "scroll-margin-top",
      "scroll-padding",
      "scroll-padding-block",
      "scroll-padding-block-end",
      "scroll-padding-block-start",
      "scroll-padding-bottom",
      "scroll-padding-inline",
      "scroll-padding-inline-end",
      "scroll-padding-inline-start",
      "scroll-padding-left",
      "scroll-padding-right",
      "scroll-padding-top",
      "scroll-snap-align",
      "scroll-snap-stop",
      "scroll-snap-type",
      "scroll-timeline",
      "scroll-timeline-axis",
      "scroll-timeline-name",
      "scrollbar-color",
      "scrollbar-gutter",
      "scrollbar-width",
      "shape-image-threshold",
      "shape-margin",
      "shape-outside",
      "shape-rendering",
      "speak",
      "speak-as",
      "src",
      // @font-face
      "stop-color",
      "stop-opacity",
      "stroke",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "tab-size",
      "table-layout",
      "text-align",
      "text-align-all",
      "text-align-last",
      "text-anchor",
      "text-combine-upright",
      "text-decoration",
      "text-decoration-color",
      "text-decoration-line",
      "text-decoration-skip",
      "text-decoration-skip-ink",
      "text-decoration-style",
      "text-decoration-thickness",
      "text-emphasis",
      "text-emphasis-color",
      "text-emphasis-position",
      "text-emphasis-style",
      "text-indent",
      "text-justify",
      "text-orientation",
      "text-overflow",
      "text-rendering",
      "text-shadow",
      "text-size-adjust",
      "text-transform",
      "text-underline-offset",
      "text-underline-position",
      "text-wrap",
      "text-wrap-mode",
      "text-wrap-style",
      "timeline-scope",
      "top",
      "touch-action",
      "transform",
      "transform-box",
      "transform-origin",
      "transform-style",
      "transition",
      "transition-behavior",
      "transition-delay",
      "transition-duration",
      "transition-property",
      "transition-timing-function",
      "translate",
      "unicode-bidi",
      "user-modify",
      "user-select",
      "vector-effect",
      "vertical-align",
      "view-timeline",
      "view-timeline-axis",
      "view-timeline-inset",
      "view-timeline-name",
      "view-transition-name",
      "visibility",
      "voice-balance",
      "voice-duration",
      "voice-family",
      "voice-pitch",
      "voice-range",
      "voice-rate",
      "voice-stress",
      "voice-volume",
      "white-space",
      "white-space-collapse",
      "widows",
      "width",
      "will-change",
      "word-break",
      "word-spacing",
      "word-wrap",
      "writing-mode",
      "x",
      "y",
      "z-index",
      "zoom"
    ].sort().reverse();
  }
});

// node_modules/highlight.js/es/languages/sql.js
function sql(hljs) {
  const regex = hljs.regex;
  const COMMENT_MODE = hljs.COMMENT("--", "$");
  const STRING = {
    scope: "string",
    variants: [
      {
        begin: /'/,
        end: /'/,
        contains: [{ match: /''/ }]
      }
    ]
  };
  const QUOTED_IDENTIFIER = {
    begin: /"/,
    end: /"/,
    contains: [{ match: /""/ }]
  };
  const LITERALS3 = [
    "true",
    "false",
    // Not sure it's correct to call NULL literal, and clauses like IS [NOT] NULL look strange that way.
    // "null",
    "unknown"
  ];
  const MULTI_WORD_TYPES = [
    "double precision",
    "large object",
    "with timezone",
    "without timezone"
  ];
  const TYPES3 = [
    "bigint",
    "binary",
    "blob",
    "boolean",
    "char",
    "character",
    "clob",
    "date",
    "dec",
    "decfloat",
    "decimal",
    "float",
    "int",
    "integer",
    "interval",
    "nchar",
    "nclob",
    "national",
    "numeric",
    "real",
    "row",
    "smallint",
    "time",
    "timestamp",
    "varchar",
    "varying",
    // modifier (character varying)
    "varbinary"
  ];
  const NON_RESERVED_WORDS = [
    "add",
    "asc",
    "collation",
    "desc",
    "final",
    "first",
    "last",
    "view"
  ];
  const RESERVED_WORDS = [
    "abs",
    "acos",
    "all",
    "allocate",
    "alter",
    "and",
    "any",
    "are",
    "array",
    "array_agg",
    "array_max_cardinality",
    "as",
    "asensitive",
    "asin",
    "asymmetric",
    "at",
    "atan",
    "atomic",
    "authorization",
    "avg",
    "begin",
    "begin_frame",
    "begin_partition",
    "between",
    "bigint",
    "binary",
    "blob",
    "boolean",
    "both",
    "by",
    "call",
    "called",
    "cardinality",
    "cascaded",
    "case",
    "cast",
    "ceil",
    "ceiling",
    "char",
    "char_length",
    "character",
    "character_length",
    "check",
    "classifier",
    "clob",
    "close",
    "coalesce",
    "collate",
    "collect",
    "column",
    "commit",
    "condition",
    "connect",
    "constraint",
    "contains",
    "convert",
    "copy",
    "corr",
    "corresponding",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "create",
    "cross",
    "cube",
    "cume_dist",
    "current",
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_row",
    "current_schema",
    "current_time",
    "current_timestamp",
    "current_path",
    "current_role",
    "current_transform_group_for_type",
    "current_user",
    "cursor",
    "cycle",
    "date",
    "day",
    "deallocate",
    "dec",
    "decimal",
    "decfloat",
    "declare",
    "default",
    "define",
    "delete",
    "dense_rank",
    "deref",
    "describe",
    "deterministic",
    "disconnect",
    "distinct",
    "double",
    "drop",
    "dynamic",
    "each",
    "element",
    "else",
    "empty",
    "end",
    "end_frame",
    "end_partition",
    "end-exec",
    "equals",
    "escape",
    "every",
    "except",
    "exec",
    "execute",
    "exists",
    "exp",
    "external",
    "extract",
    "false",
    "fetch",
    "filter",
    "first_value",
    "float",
    "floor",
    "for",
    "foreign",
    "frame_row",
    "free",
    "from",
    "full",
    "function",
    "fusion",
    "get",
    "global",
    "grant",
    "group",
    "grouping",
    "groups",
    "having",
    "hold",
    "hour",
    "identity",
    "in",
    "indicator",
    "initial",
    "inner",
    "inout",
    "insensitive",
    "insert",
    "int",
    "integer",
    "intersect",
    "intersection",
    "interval",
    "into",
    "is",
    "join",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "language",
    "large",
    "last_value",
    "lateral",
    "lead",
    "leading",
    "left",
    "like",
    "like_regex",
    "listagg",
    "ln",
    "local",
    "localtime",
    "localtimestamp",
    "log",
    "log10",
    "lower",
    "match",
    "match_number",
    "match_recognize",
    "matches",
    "max",
    "member",
    "merge",
    "method",
    "min",
    "minute",
    "mod",
    "modifies",
    "module",
    "month",
    "multiset",
    "national",
    "natural",
    "nchar",
    "nclob",
    "new",
    "no",
    "none",
    "normalize",
    "not",
    "nth_value",
    "ntile",
    "null",
    "nullif",
    "numeric",
    "octet_length",
    "occurrences_regex",
    "of",
    "offset",
    "old",
    "omit",
    "on",
    "one",
    "only",
    "open",
    "or",
    "order",
    "out",
    "outer",
    "over",
    "overlaps",
    "overlay",
    "parameter",
    "partition",
    "pattern",
    "per",
    "percent",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "period",
    "portion",
    "position",
    "position_regex",
    "power",
    "precedes",
    "precision",
    "prepare",
    "primary",
    "procedure",
    "ptf",
    "range",
    "rank",
    "reads",
    "real",
    "recursive",
    "ref",
    "references",
    "referencing",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "release",
    "result",
    "return",
    "returns",
    "revoke",
    "right",
    "rollback",
    "rollup",
    "row",
    "row_number",
    "rows",
    "running",
    "savepoint",
    "scope",
    "scroll",
    "search",
    "second",
    "seek",
    "select",
    "sensitive",
    "session_user",
    "set",
    "show",
    "similar",
    "sin",
    "sinh",
    "skip",
    "smallint",
    "some",
    "specific",
    "specifictype",
    "sql",
    "sqlexception",
    "sqlstate",
    "sqlwarning",
    "sqrt",
    "start",
    "static",
    "stddev_pop",
    "stddev_samp",
    "submultiset",
    "subset",
    "substring",
    "substring_regex",
    "succeeds",
    "sum",
    "symmetric",
    "system",
    "system_time",
    "system_user",
    "table",
    "tablesample",
    "tan",
    "tanh",
    "then",
    "time",
    "timestamp",
    "timezone_hour",
    "timezone_minute",
    "to",
    "trailing",
    "translate",
    "translate_regex",
    "translation",
    "treat",
    "trigger",
    "trim",
    "trim_array",
    "true",
    "truncate",
    "uescape",
    "union",
    "unique",
    "unknown",
    "unnest",
    "update",
    "upper",
    "user",
    "using",
    "value",
    "values",
    "value_of",
    "var_pop",
    "var_samp",
    "varbinary",
    "varchar",
    "varying",
    "versioning",
    "when",
    "whenever",
    "where",
    "width_bucket",
    "window",
    "with",
    "within",
    "without",
    "year"
  ];
  const RESERVED_FUNCTIONS = [
    "abs",
    "acos",
    "array_agg",
    "asin",
    "atan",
    "avg",
    "cast",
    "ceil",
    "ceiling",
    "coalesce",
    "corr",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "cume_dist",
    "dense_rank",
    "deref",
    "element",
    "exp",
    "extract",
    "first_value",
    "floor",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "last_value",
    "lead",
    "listagg",
    "ln",
    "log",
    "log10",
    "lower",
    "max",
    "min",
    "mod",
    "nth_value",
    "ntile",
    "nullif",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "position",
    "position_regex",
    "power",
    "rank",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "row_number",
    "sin",
    "sinh",
    "sqrt",
    "stddev_pop",
    "stddev_samp",
    "substring",
    "substring_regex",
    "sum",
    "tan",
    "tanh",
    "translate",
    "translate_regex",
    "treat",
    "trim",
    "trim_array",
    "unnest",
    "upper",
    "value_of",
    "var_pop",
    "var_samp",
    "width_bucket"
  ];
  const POSSIBLE_WITHOUT_PARENS = [
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_schema",
    "current_transform_group_for_type",
    "current_user",
    "session_user",
    "system_time",
    "system_user",
    "current_time",
    "localtime",
    "current_timestamp",
    "localtimestamp"
  ];
  const COMBOS = [
    "create table",
    "insert into",
    "primary key",
    "foreign key",
    "not null",
    "alter table",
    "add constraint",
    "grouping sets",
    "on overflow",
    "character set",
    "respect nulls",
    "ignore nulls",
    "nulls first",
    "nulls last",
    "depth first",
    "breadth first"
  ];
  const FUNCTIONS = RESERVED_FUNCTIONS;
  const KEYWORDS3 = [
    ...RESERVED_WORDS,
    ...NON_RESERVED_WORDS
  ].filter((keyword) => {
    return !RESERVED_FUNCTIONS.includes(keyword);
  });
  const VARIABLE = {
    scope: "variable",
    match: /@[a-z0-9][a-z0-9_]*/
  };
  const OPERATOR2 = {
    scope: "operator",
    match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0
  };
  const FUNCTION_CALL = {
    match: regex.concat(/\b/, regex.either(...FUNCTIONS), /\s*\(/),
    relevance: 0,
    keywords: { built_in: FUNCTIONS }
  };
  function kws_to_regex(list) {
    return regex.concat(
      /\b/,
      regex.either(...list.map((kw) => {
        return kw.replace(/\s+/, "\\s+");
      })),
      /\b/
    );
  }
  const MULTI_WORD_KEYWORDS = {
    scope: "keyword",
    match: kws_to_regex(COMBOS),
    relevance: 0
  };
  function reduceRelevancy(list, {
    exceptions,
    when
  } = {}) {
    const qualifyFn = when;
    exceptions = exceptions || [];
    return list.map((item) => {
      if (item.match(/\|\d+$/) || exceptions.includes(item)) {
        return item;
      } else if (qualifyFn(item)) {
        return `${item}|0`;
      } else {
        return item;
      }
    });
  }
  return {
    name: "SQL",
    case_insensitive: true,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: reduceRelevancy(KEYWORDS3, { when: (x) => x.length < 3 }),
      literal: LITERALS3,
      type: TYPES3,
      built_in: POSSIBLE_WITHOUT_PARENS
    },
    contains: [
      {
        scope: "type",
        match: kws_to_regex(MULTI_WORD_TYPES)
      },
      MULTI_WORD_KEYWORDS,
      FUNCTION_CALL,
      VARIABLE,
      STRING,
      QUOTED_IDENTIFIER,
      hljs.C_NUMBER_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      COMMENT_MODE,
      OPERATOR2
    ]
  };
}
var init_sql = __esm({
  "node_modules/highlight.js/es/languages/sql.js"() {
  }
});

// node_modules/highlight.js/es/languages/twig.js
function twig(hljs) {
  const regex = hljs.regex;
  const FUNCTION_NAMES = [
    "absolute_url",
    "asset|0",
    "asset_version",
    "attribute",
    "block",
    "constant",
    "controller|0",
    "country_timezones",
    "csrf_token",
    "cycle",
    "date",
    "dump",
    "expression",
    "form|0",
    "form_end",
    "form_errors",
    "form_help",
    "form_label",
    "form_rest",
    "form_row",
    "form_start",
    "form_widget",
    "html_classes",
    "include",
    "is_granted",
    "logout_path",
    "logout_url",
    "max",
    "min",
    "parent",
    "path|0",
    "random",
    "range",
    "relative_path",
    "render",
    "render_esi",
    "source",
    "template_from_string",
    "url|0"
  ];
  const FILTERS = [
    "abs",
    "abbr_class",
    "abbr_method",
    "batch",
    "capitalize",
    "column",
    "convert_encoding",
    "country_name",
    "currency_name",
    "currency_symbol",
    "data_uri",
    "date",
    "date_modify",
    "default",
    "escape",
    "file_excerpt",
    "file_link",
    "file_relative",
    "filter",
    "first",
    "format",
    "format_args",
    "format_args_as_text",
    "format_currency",
    "format_date",
    "format_datetime",
    "format_file",
    "format_file_from_text",
    "format_number",
    "format_time",
    "html_to_markdown",
    "humanize",
    "inky_to_html",
    "inline_css",
    "join",
    "json_encode",
    "keys",
    "language_name",
    "last",
    "length",
    "locale_name",
    "lower",
    "map",
    "markdown",
    "markdown_to_html",
    "merge",
    "nl2br",
    "number_format",
    "raw",
    "reduce",
    "replace",
    "reverse",
    "round",
    "slice",
    "slug",
    "sort",
    "spaceless",
    "split",
    "striptags",
    "timezone_name",
    "title",
    "trans",
    "transchoice",
    "trim",
    "u|0",
    "upper",
    "url_encode",
    "yaml_dump",
    "yaml_encode"
  ];
  let TAG_NAMES = [
    "apply",
    "autoescape",
    "block",
    "cache",
    "deprecated",
    "do",
    "embed",
    "extends",
    "filter",
    "flush",
    "for",
    "form_theme",
    "from",
    "if",
    "import",
    "include",
    "macro",
    "sandbox",
    "set",
    "stopwatch",
    "trans",
    "trans_default_domain",
    "transchoice",
    "use",
    "verbatim",
    "with"
  ];
  TAG_NAMES = TAG_NAMES.concat(TAG_NAMES.map((t) => `end${t}`));
  const STRING = {
    scope: "string",
    variants: [
      {
        begin: /'/,
        end: /'/
      },
      {
        begin: /"/,
        end: /"/
      }
    ]
  };
  const NUMBER = {
    scope: "number",
    match: /\d+/
  };
  const PARAMS = {
    begin: /\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    contains: [
      STRING,
      NUMBER
    ]
  };
  const FUNCTIONS = {
    beginKeywords: FUNCTION_NAMES.join(" "),
    keywords: { name: FUNCTION_NAMES },
    relevance: 0,
    contains: [PARAMS]
  };
  const FILTER = {
    match: /\|(?=[A-Za-z_]+:?)/,
    beginScope: "punctuation",
    relevance: 0,
    contains: [
      {
        match: /[A-Za-z_]+:?/,
        keywords: FILTERS
      }
    ]
  };
  const tagNamed = (tagnames, { relevance }) => {
    return {
      beginScope: {
        1: "template-tag",
        3: "name"
      },
      relevance: relevance || 2,
      endScope: "template-tag",
      begin: [
        /\{%/,
        /\s*/,
        regex.either(...tagnames)
      ],
      end: /%\}/,
      keywords: "in",
      contains: [
        FILTER,
        FUNCTIONS,
        STRING,
        NUMBER
      ]
    };
  };
  const CUSTOM_TAG_RE = /[a-z_]+/;
  const TAG = tagNamed(TAG_NAMES, { relevance: 2 });
  const CUSTOM_TAG = tagNamed([CUSTOM_TAG_RE], { relevance: 1 });
  return {
    name: "Twig",
    aliases: ["craftcms"],
    case_insensitive: true,
    subLanguage: "xml",
    contains: [
      hljs.COMMENT(/\{#/, /#\}/),
      TAG,
      CUSTOM_TAG,
      {
        className: "template-variable",
        begin: /\{\{/,
        end: /\}\}/,
        contains: [
          "self",
          FILTER,
          FUNCTIONS,
          STRING,
          NUMBER
        ]
      }
    ]
  };
}
var init_twig = __esm({
  "node_modules/highlight.js/es/languages/twig.js"() {
  }
});

// node_modules/highlight.js/es/languages/typescript.js
function javascript2(hljs) {
  const regex = hljs.regex;
  const hasClosingTag = (match, { after }) => {
    const tag = "</" + match[0].slice(1);
    const pos = match.input.indexOf(tag, after);
    return pos !== -1;
  };
  const IDENT_RE$1 = IDENT_RE2;
  const FRAGMENT = {
    begin: "<>",
    end: "</>"
  };
  const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
  const XML_TAG = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (match, response) => {
      const afterMatchIndex = match[0].length + match.index;
      const nextChar = match.input[afterMatchIndex];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        nextChar === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        nextChar === ","
      ) {
        response.ignoreMatch();
        return;
      }
      if (nextChar === ">") {
        if (!hasClosingTag(match, { after: afterMatchIndex })) {
          response.ignoreMatch();
        }
      }
      let m;
      const afterMatch = match.input.substring(afterMatchIndex);
      if (m = afterMatch.match(/^\s*=/)) {
        response.ignoreMatch();
        return;
      }
      if (m = afterMatch.match(/^\s+extends\s+/)) {
        if (m.index === 0) {
          response.ignoreMatch();
          return;
        }
      }
    }
  };
  const KEYWORDS$1 = {
    $pattern: IDENT_RE2,
    keyword: KEYWORDS2,
    literal: LITERALS2,
    built_in: BUILT_INS2,
    "variable.language": BUILT_IN_VARIABLES2
  };
  const decimalDigits = "[0-9](_?[0-9])*";
  const frac = `\\.(${decimalDigits})`;
  const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
  const NUMBER = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})\\b` },
      { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },
      // DecimalBigIntegerLiteral
      { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  };
  const SUBST = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: KEYWORDS$1,
    contains: []
    // defined later
  };
  const HTML_TEMPLATE = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "xml"
    }
  };
  const CSS_TEMPLATE = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "css"
    }
  };
  const GRAPHQL_TEMPLATE = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: "graphql"
    }
  };
  const TEMPLATE_STRING = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  const JSDOC_COMMENT = hljs.COMMENT(
    /\/\*\*(?!\/)/,
    "\\*/",
    {
      relevance: 0,
      contains: [
        {
          begin: "(?=@[A-Za-z]+)",
          relevance: 0,
          contains: [
            {
              className: "doctag",
              begin: "@[A-Za-z]+"
            },
            {
              className: "type",
              begin: "\\{",
              end: "\\}",
              excludeEnd: true,
              excludeBegin: true,
              relevance: 0
            },
            {
              className: "variable",
              begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
              endsParent: true,
              relevance: 0
            },
            // eat spaces (not newlines) so we can find
            // types or variables
            {
              begin: /(?=[^\n])\s/,
              relevance: 0
            }
          ]
        }
      ]
    }
  );
  const COMMENT = {
    className: "comment",
    variants: [
      JSDOC_COMMENT,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_LINE_COMMENT_MODE
    ]
  };
  const SUBST_INTERNALS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    GRAPHQL_TEMPLATE,
    TEMPLATE_STRING,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    NUMBER
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  SUBST.contains = SUBST_INTERNALS.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: KEYWORDS$1,
    contains: [
      "self"
    ].concat(SUBST_INTERNALS)
  });
  const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
  const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: KEYWORDS$1,
      contains: ["self"].concat(SUBST_AND_COMMENTS)
    }
  ]);
  const PARAMS = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS$1,
    contains: PARAMS_CONTAINS
  };
  const CLASS_OR_EXTENDS = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1,
          /\s+/,
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE$1
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  };
  const CLASS_REFERENCE = {
    relevance: 0,
    match: regex.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...TYPES2,
        ...ERROR_TYPES2
      ]
    }
  };
  const USE_STRICT = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  };
  const FUNCTION_DEFINITION = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          IDENT_RE$1,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [PARAMS],
    illegal: /%/
  };
  const UPPER_CASE_CONSTANT = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function noneOf(list) {
    return regex.concat("(?!", list.join("|"), ")");
  }
  const FUNCTION_CALL = {
    match: regex.concat(
      /\b/,
      noneOf([
        ...BUILT_IN_GLOBALS2,
        "super",
        "import"
      ].map((x) => `${x}\\s*\\(`)),
      IDENT_RE$1,
      regex.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  };
  const PROPERTY_ACCESS = {
    begin: regex.concat(/\./, regex.lookahead(
      regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
    )),
    end: IDENT_RE$1,
    excludeBegin: true,
    keywords: "prototype",
    className: "property",
    relevance: 0
  };
  const GETTER_OR_SETTER = {
    match: [
      /get|set/,
      /\s+/,
      IDENT_RE$1,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        // eat to avoid empty params
        begin: /\(\)/
      },
      PARAMS
    ]
  };
  const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
  const FUNCTION_VARIABLE = {
    match: [
      /const|var|let/,
      /\s+/,
      IDENT_RE$1,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      regex.lookahead(FUNC_LEAD_IN_RE)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      PARAMS
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: KEYWORDS$1,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
    illegal: /#(?![$_A-z])/,
    contains: [
      hljs.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      USE_STRICT,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      COMMENT,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER,
      CLASS_REFERENCE,
      {
        scope: "attr",
        match: IDENT_RE$1 + regex.lookahead(":"),
        relevance: 0
      },
      FUNCTION_VARIABLE,
      {
        // "value" container
        begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          COMMENT,
          hljs.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: FUNC_LEAD_IN_RE,
            returnBegin: true,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: hljs.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: true
                  },
                  {
                    begin: /(\s*)\(/,
                    end: /\)/,
                    excludeBegin: true,
                    excludeEnd: true,
                    keywords: KEYWORDS$1,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          {
            // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            // JSX
            variants: [
              { begin: FRAGMENT.begin, end: FRAGMENT.end },
              { match: XML_SELF_CLOSING },
              {
                begin: XML_TAG.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": XML_TAG.isTrulyOpeningTag,
                end: XML_TAG.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: XML_TAG.begin,
                end: XML_TAG.end,
                skip: true,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      FUNCTION_DEFINITION,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: true,
        label: "func.def",
        contains: [
          PARAMS,
          hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      PROPERTY_ACCESS,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + IDENT_RE$1,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [PARAMS]
      },
      FUNCTION_CALL,
      UPPER_CASE_CONSTANT,
      CLASS_OR_EXTENDS,
      GETTER_OR_SETTER,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
function typescript(hljs) {
  const regex = hljs.regex;
  const tsLanguage = javascript2(hljs);
  const IDENT_RE$1 = IDENT_RE2;
  const TYPES3 = [
    "any",
    "void",
    "number",
    "boolean",
    "string",
    "object",
    "never",
    "symbol",
    "bigint",
    "unknown"
  ];
  const NAMESPACE = {
    begin: [
      /namespace/,
      /\s+/,
      hljs.IDENT_RE
    ],
    beginScope: {
      1: "keyword",
      3: "title.class"
    }
  };
  const INTERFACE = {
    beginKeywords: "interface",
    end: /\{/,
    excludeEnd: true,
    keywords: {
      keyword: "interface extends",
      built_in: TYPES3
    },
    contains: [tsLanguage.exports.CLASS_REFERENCE]
  };
  const USE_STRICT = {
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use strict['"]/
  };
  const TS_SPECIFIC_KEYWORDS = [
    "type",
    // "namespace",
    "interface",
    "public",
    "private",
    "protected",
    "implements",
    "declare",
    "abstract",
    "readonly",
    "enum",
    "override",
    "satisfies"
  ];
  const KEYWORDS$1 = {
    $pattern: IDENT_RE2,
    keyword: KEYWORDS2.concat(TS_SPECIFIC_KEYWORDS),
    literal: LITERALS2,
    built_in: BUILT_INS2.concat(TYPES3),
    "variable.language": BUILT_IN_VARIABLES2
  };
  const DECORATOR = {
    className: "meta",
    begin: "@" + IDENT_RE$1
  };
  const swapMode = (mode, label, replacement) => {
    const indx = mode.contains.findIndex((m) => m.label === label);
    if (indx === -1) {
      throw new Error("can not find mode to replace");
    }
    mode.contains.splice(indx, 1, replacement);
  };
  Object.assign(tsLanguage.keywords, KEYWORDS$1);
  tsLanguage.exports.PARAMS_CONTAINS.push(DECORATOR);
  const ATTRIBUTE_HIGHLIGHT = tsLanguage.contains.find((c) => c.scope === "attr");
  const OPTIONAL_KEY_OR_ARGUMENT = Object.assign(
    {},
    ATTRIBUTE_HIGHLIGHT,
    { match: regex.concat(IDENT_RE$1, regex.lookahead(/\s*\?:/)) }
  );
  tsLanguage.exports.PARAMS_CONTAINS.push([
    tsLanguage.exports.CLASS_REFERENCE,
    // class reference for highlighting the params types
    ATTRIBUTE_HIGHLIGHT,
    // highlight the params key
    OPTIONAL_KEY_OR_ARGUMENT
    // Added for optional property assignment highlighting
  ]);
  tsLanguage.contains = tsLanguage.contains.concat([
    DECORATOR,
    NAMESPACE,
    INTERFACE,
    OPTIONAL_KEY_OR_ARGUMENT
    // Added for optional property assignment highlighting
  ]);
  swapMode(tsLanguage, "shebang", hljs.SHEBANG());
  swapMode(tsLanguage, "use_strict", USE_STRICT);
  const functionDeclaration = tsLanguage.contains.find((m) => m.label === "func.def");
  functionDeclaration.relevance = 0;
  Object.assign(tsLanguage, {
    name: "TypeScript",
    aliases: [
      "ts",
      "tsx",
      "mts",
      "cts"
    ]
  });
  return tsLanguage;
}
var IDENT_RE2, KEYWORDS2, LITERALS2, TYPES2, ERROR_TYPES2, BUILT_IN_GLOBALS2, BUILT_IN_VARIABLES2, BUILT_INS2;
var init_typescript = __esm({
  "node_modules/highlight.js/es/languages/typescript.js"() {
    IDENT_RE2 = "[A-Za-z$_][0-9A-Za-z$_]*";
    KEYWORDS2 = [
      "as",
      // for exports
      "in",
      "of",
      "if",
      "for",
      "while",
      "finally",
      "var",
      "new",
      "function",
      "do",
      "return",
      "void",
      "else",
      "break",
      "catch",
      "instanceof",
      "with",
      "throw",
      "case",
      "default",
      "try",
      "switch",
      "continue",
      "typeof",
      "delete",
      "let",
      "yield",
      "const",
      "class",
      // JS handles these with a special rule
      // "get",
      // "set",
      "debugger",
      "async",
      "await",
      "static",
      "import",
      "from",
      "export",
      "extends",
      // It's reached stage 3, which is "recommended for implementation":
      "using"
    ];
    LITERALS2 = [
      "true",
      "false",
      "null",
      "undefined",
      "NaN",
      "Infinity"
    ];
    TYPES2 = [
      // Fundamental objects
      "Object",
      "Function",
      "Boolean",
      "Symbol",
      // numbers and dates
      "Math",
      "Date",
      "Number",
      "BigInt",
      // text
      "String",
      "RegExp",
      // Indexed collections
      "Array",
      "Float32Array",
      "Float64Array",
      "Int8Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Int16Array",
      "Int32Array",
      "Uint16Array",
      "Uint32Array",
      "BigInt64Array",
      "BigUint64Array",
      // Keyed collections
      "Set",
      "Map",
      "WeakSet",
      "WeakMap",
      // Structured data
      "ArrayBuffer",
      "SharedArrayBuffer",
      "Atomics",
      "DataView",
      "JSON",
      // Control abstraction objects
      "Promise",
      "Generator",
      "GeneratorFunction",
      "AsyncFunction",
      // Reflection
      "Reflect",
      "Proxy",
      // Internationalization
      "Intl",
      // WebAssembly
      "WebAssembly"
    ];
    ERROR_TYPES2 = [
      "Error",
      "EvalError",
      "InternalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError"
    ];
    BUILT_IN_GLOBALS2 = [
      "setInterval",
      "setTimeout",
      "clearInterval",
      "clearTimeout",
      "require",
      "exports",
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "escape",
      "unescape"
    ];
    BUILT_IN_VARIABLES2 = [
      "arguments",
      "this",
      "super",
      "console",
      "window",
      "document",
      "localStorage",
      "sessionStorage",
      "module",
      "global"
      // Node.js
    ];
    BUILT_INS2 = [].concat(
      BUILT_IN_GLOBALS2,
      TYPES2,
      ERROR_TYPES2
    );
  }
});

// node_modules/highlight.js/es/languages/xml.js
function xml(hljs) {
  const regex = hljs.regex;
  const TAG_NAME_RE = regex.concat(/[\p{L}_]/u, regex.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u);
  const XML_IDENT_RE = /[\p{L}0-9._:-]+/u;
  const XML_ENTITIES = {
    className: "symbol",
    begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
  };
  const XML_META_KEYWORDS = {
    begin: /\s/,
    contains: [
      {
        className: "keyword",
        begin: /#?[a-z_][a-z1-9_-]+/,
        illegal: /\n/
      }
    ]
  };
  const XML_META_PAR_KEYWORDS = hljs.inherit(XML_META_KEYWORDS, {
    begin: /\(/,
    end: /\)/
  });
  const APOS_META_STRING_MODE = hljs.inherit(hljs.APOS_STRING_MODE, { className: "string" });
  const QUOTE_META_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, { className: "string" });
  const TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: "attr",
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: "string",
            endsParent: true,
            variants: [
              {
                begin: /"/,
                end: /"/,
                contains: [XML_ENTITIES]
              },
              {
                begin: /'/,
                end: /'/,
                contains: [XML_ENTITIES]
              },
              { begin: /[^\s"'=<>`]+/ }
            ]
          }
        ]
      }
    ]
  };
  return {
    name: "HTML, XML",
    aliases: [
      "html",
      "xhtml",
      "rss",
      "atom",
      "xjb",
      "xsd",
      "xsl",
      "plist",
      "wsf",
      "svg"
    ],
    case_insensitive: true,
    unicodeRegex: true,
    contains: [
      {
        className: "meta",
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [
          XML_META_KEYWORDS,
          QUOTE_META_STRING_MODE,
          APOS_META_STRING_MODE,
          XML_META_PAR_KEYWORDS,
          {
            begin: /\[/,
            end: /\]/,
            contains: [
              {
                className: "meta",
                begin: /<![a-z]/,
                end: />/,
                contains: [
                  XML_META_KEYWORDS,
                  XML_META_PAR_KEYWORDS,
                  QUOTE_META_STRING_MODE,
                  APOS_META_STRING_MODE
                ]
              }
            ]
          }
        ]
      },
      hljs.COMMENT(
        /<!--/,
        /-->/,
        { relevance: 10 }
      ),
      {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      },
      XML_ENTITIES,
      // xml processing instructions
      {
        className: "meta",
        end: /\?>/,
        variants: [
          {
            begin: /<\?xml/,
            relevance: 10,
            contains: [
              QUOTE_META_STRING_MODE
            ]
          },
          {
            begin: /<\?[a-z][a-z0-9]+/
          }
        ]
      },
      {
        className: "tag",
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending bracket.
        */
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: "style" },
        contains: [TAG_INTERNALS],
        starts: {
          end: /<\/style>/,
          returnEnd: true,
          subLanguage: [
            "css",
            "xml"
          ]
        }
      },
      {
        className: "tag",
        // See the comment in the <style tag about the lookahead pattern
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: "script" },
        contains: [TAG_INTERNALS],
        starts: {
          end: /<\/script>/,
          returnEnd: true,
          subLanguage: [
            "javascript",
            "handlebars",
            "xml"
          ]
        }
      },
      // we need this for now for jSX
      {
        className: "tag",
        begin: /<>|<\/>/
      },
      // open tag
      {
        className: "tag",
        begin: regex.concat(
          /</,
          regex.lookahead(regex.concat(
            TAG_NAME_RE,
            // <tag/>
            // <tag>
            // <tag ...
            regex.either(/\/>/, />/, /\s/)
          ))
        ),
        end: /\/?>/,
        contains: [
          {
            className: "name",
            begin: TAG_NAME_RE,
            relevance: 0,
            starts: TAG_INTERNALS
          }
        ]
      },
      // close tag
      {
        className: "tag",
        begin: regex.concat(
          /<\//,
          regex.lookahead(regex.concat(
            TAG_NAME_RE,
            />/
          ))
        ),
        contains: [
          {
            className: "name",
            begin: TAG_NAME_RE,
            relevance: 0
          },
          {
            begin: />/,
            relevance: 0,
            endsParent: true
          }
        ]
      }
    ]
  };
}
var init_xml = __esm({
  "node_modules/highlight.js/es/languages/xml.js"() {
  }
});

// node_modules/highlight.js/es/languages/yaml.js
function yaml(hljs) {
  const LITERALS3 = "true false yes no null";
  const URI_CHARACTERS = "[\\w#;/?:@&=+$,.~*'()[\\]]+";
  const KEY = {
    className: "attr",
    variants: [
      // added brackets support and special char support
      { begin: /[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/ },
      {
        // double quoted keys - with brackets and special char support
        begin: /"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/
      },
      {
        // single quoted keys - with brackets and special char support
        begin: /'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/
      }
    ]
  };
  const TEMPLATE_VARIABLES = {
    className: "template-variable",
    variants: [
      {
        // jinja templates Ansible
        begin: /\{\{/,
        end: /\}\}/
      },
      {
        // Ruby i18n
        begin: /%\{/,
        end: /\}/
      }
    ]
  };
  const SINGLE_QUOTE_STRING = {
    className: "string",
    relevance: 0,
    begin: /'/,
    end: /'/,
    contains: [
      {
        match: /''/,
        scope: "char.escape",
        relevance: 0
      }
    ]
  };
  const STRING = {
    className: "string",
    relevance: 0,
    variants: [
      {
        begin: /"/,
        end: /"/
      },
      { begin: /\S+/ }
    ],
    contains: [
      hljs.BACKSLASH_ESCAPE,
      TEMPLATE_VARIABLES
    ]
  };
  const CONTAINER_STRING = hljs.inherit(STRING, { variants: [
    {
      begin: /'/,
      end: /'/,
      contains: [
        {
          begin: /''/,
          relevance: 0
        }
      ]
    },
    {
      begin: /"/,
      end: /"/
    },
    { begin: /[^\s,{}[\]]+/ }
  ] });
  const DATE_RE = "[0-9]{4}(-[0-9][0-9]){0,2}";
  const TIME_RE = "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?";
  const FRACTION_RE = "(\\.[0-9]*)?";
  const ZONE_RE = "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?";
  const TIMESTAMP = {
    className: "number",
    begin: "\\b" + DATE_RE + TIME_RE + FRACTION_RE + ZONE_RE + "\\b"
  };
  const VALUE_CONTAINER = {
    end: ",",
    endsWithParent: true,
    excludeEnd: true,
    keywords: LITERALS3,
    relevance: 0
  };
  const OBJECT = {
    begin: /\{/,
    end: /\}/,
    contains: [VALUE_CONTAINER],
    illegal: "\\n",
    relevance: 0
  };
  const ARRAY = {
    begin: "\\[",
    end: "\\]",
    contains: [VALUE_CONTAINER],
    illegal: "\\n",
    relevance: 0
  };
  const MODES3 = [
    KEY,
    {
      className: "meta",
      begin: "^---\\s*$",
      relevance: 10
    },
    {
      // multi line string
      // Blocks start with a | or > followed by a newline
      //
      // Indentation of subsequent lines must be the same to
      // be considered part of the block
      className: "string",
      begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
    },
    {
      // Ruby/Rails erb
      begin: "<%[%=-]?",
      end: "[%-]?%>",
      subLanguage: "ruby",
      excludeBegin: true,
      excludeEnd: true,
      relevance: 0
    },
    {
      // named tags
      className: "type",
      begin: "!\\w+!" + URI_CHARACTERS
    },
    // https://yaml.org/spec/1.2/spec.html#id2784064
    {
      // verbatim tags
      className: "type",
      begin: "!<" + URI_CHARACTERS + ">"
    },
    {
      // primary tags
      className: "type",
      begin: "!" + URI_CHARACTERS
    },
    {
      // secondary tags
      className: "type",
      begin: "!!" + URI_CHARACTERS
    },
    {
      // fragment id &ref
      className: "meta",
      begin: "&" + hljs.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // fragment reference *ref
      className: "meta",
      begin: "\\*" + hljs.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // array listing
      className: "bullet",
      // TODO: remove |$ hack when we have proper look-ahead support
      begin: "-(?=[ ]|$)",
      relevance: 0
    },
    hljs.HASH_COMMENT_MODE,
    {
      beginKeywords: LITERALS3,
      keywords: { literal: LITERALS3 }
    },
    TIMESTAMP,
    // numbers are any valid C-style number that
    // sit isolated from other words
    {
      className: "number",
      begin: hljs.C_NUMBER_RE + "\\b",
      relevance: 0
    },
    OBJECT,
    ARRAY,
    SINGLE_QUOTE_STRING,
    STRING
  ];
  const VALUE_MODES = [...MODES3];
  VALUE_MODES.pop();
  VALUE_MODES.push(CONTAINER_STRING);
  VALUE_CONTAINER.contains = VALUE_MODES;
  return {
    name: "YAML",
    case_insensitive: true,
    aliases: ["yml"],
    contains: MODES3
  };
}
var init_yaml = __esm({
  "node_modules/highlight.js/es/languages/yaml.js"() {
  }
});

// packages/frontend/src/lib/grammars/typoscript.ts
var CONSTANT, OPERATOR, TYPOSCRIPT;
var init_typoscript = __esm({
  "packages/frontend/src/lib/grammars/typoscript.ts"() {
    "use strict";
    CONSTANT = { className: "variable", begin: "\\{\\$[^}\\n]*\\}" };
    OPERATOR = "(?::=|=<|=|<|>)(?=[ \\t]*\\S)";
    TYPOSCRIPT = {
      /* TSconfig is TypoScript — the same operators, paths and conditions, read
         by the backend rather than the frontend. TYPO3's own documentation
         grammar aliases it the same way. */
      aliases: ["tsconfig"],
      case_insensitive: false,
      contains: [
        { className: "comment", begin: "/\\*", end: "\\*/" },
        /* Only at the start of a line. TypoScript has no trailing comment, and a
           `#` in the middle of one is a colour in a value. */
        { className: "comment", begin: "^[ \\t]*(?:#|//).*$" },
        /* A condition, and the `[END]`, `[ELSE]` and `[GLOBAL]` that close one.
           Before the operator below, because a condition is full of them. */
        { className: "meta", begin: "^[ \\t]*\\[", end: "\\]" },
        { className: "meta", begin: "^[ \\t]*@import\\b.*$" },
        /* Ahead of the copy operator, which begins on the same character. */
        { className: "meta", begin: "<INCLUDE_TYPOSCRIPT:", end: ">" },
        /* The object path that takes the value — the whole of it, up to whichever
           operator or brace follows. */
        { className: "attr", begin: "^[ \\t]*[\\w.-]+(?=[ \\t]*(?::?=<?|<|>|\\{|\\())" },
        /* An object type, which is what an all-caps word standing alone on the
           right of an assignment is: `= PAGE`, `= FLUIDTEMPLATE`. Read from the
           shape rather than from a list of them, because the list is TYPO3's and
           grows a name every release. */
        {
          className: "built_in",
          begin: "(?::?=)[ \\t]*(?=[A-Z][A-Z0-9_]*[ \\t]*$)",
          excludeBegin: true,
          end: "$"
        },
        {
          className: "string",
          begin: OPERATOR,
          excludeBegin: true,
          end: "$",
          contains: [CONSTANT]
        },
        /* A value written over several lines, which is the one place a newline is
           part of the value rather than the end of it. */
        { className: "string", begin: "\\([ \\t]*$", end: "^[ \\t]*\\)", contains: [CONSTANT] },
        CONSTANT
      ]
    };
  }
});

// packages/frontend/src/lib/grammars/index.ts
var WRITTEN;
var init_grammars = __esm({
  "packages/frontend/src/lib/grammars/index.ts"() {
    "use strict";
    init_typoscript();
    WRITTEN = { typoscript: TYPOSCRIPT };
  }
});

// packages/frontend/src/lib/highlight.ts
var highlight_exports = {};
__export(highlight_exports, {
  highlight: () => highlight,
  highlights: () => highlights
});
function highlights(lang) {
  return lang in GRAMMARS;
}
function highlight(lang, source) {
  if (!highlights(lang)) return null;
  return core_default.highlight(source, { language: lang, ignoreIllegals: true }).value;
}
var GRAMMARS;
var init_highlight = __esm({
  "packages/frontend/src/lib/highlight.ts"() {
    "use strict";
    init_core();
    init_bash();
    init_css();
    init_diff();
    init_javascript();
    init_json();
    init_markdown();
    init_php();
    init_plaintext();
    init_scss();
    init_sql();
    init_twig();
    init_typescript();
    init_xml();
    init_yaml();
    init_grammars();
    GRAMMARS = {
      bash,
      css,
      diff,
      html: xml,
      javascript,
      json,
      markdown,
      php,
      scss,
      sql,
      text: plaintext,
      twig,
      typescript,
      xml,
      yaml,
      /* A written grammar is the mode tree itself, and highlight.js takes a
         function that returns one. Its aliases are entries of their own rather
         than left to the library. `highlights` answers from this map, and a name
         the highlighter knows and this does not prints a block uncoloured. The
         cast is the whole of what `Mode` gives up — the library types a
         definition against helpers no grammar here uses. */
      ...Object.fromEntries(Object.entries(WRITTEN).flatMap(
        ([name, mode]) => [name, ...mode.aliases ?? []].map(
          (as) => [as, (() => mode)]
        )
      ))
    };
    for (const [name, grammar] of Object.entries(GRAMMARS)) core_default.registerLanguage(name, grammar);
  }
});

// packages/frontend/src/lib/diagram/parse.ts
function layoutOf(first, body) {
  const head = read(first);
  const layout2 = LAYOUTS[head.head] ?? fail(first, `"${head.head}" is not a layout: write ${Object.keys(LAYOUTS).join(", ")}`);
  const options = clean({
    columns: numbers(head, "columns"),
    gap: numbers(head, "gap"),
    max: numberOf(head, "max"),
    unit: option(head, "unit"),
    ticks: numbers(head, "ticks"),
    bands: option(head, "bands")?.split(",").map((b) => b.trim()),
    axis: option(head, "axis"),
    lines: numberOf(head, "lines"),
    head: option(head, "head"),
    key: option(head, "key"),
    height: numberOf(head, "height"),
    labelWidth: numberOf(head, "label-width"),
    rowGroups: oneOf(head, "row-groups", ["over", "beside"]),
    notesOutside: oneOf(head, "notes", ["outside"]) === "outside" || void 0,
    direction: head.head === "compose" ? oneOf(head, "direction", ["row", "column"]) : oneOf(head, "direction", ["rows", "columns"]),
    across: numberOf(head, "across"),
    figures: head.flags.has("figures") || void 0,
    left: head.head === "matrix" ? head.flags.has("left") || void 0 : void 0,
    blocks: head.head === "matrix" ? head.flags.has("blocks") || void 0 : void 0,
    chain: head.flags.has("chain") || void 0,
    rise: head.flags.has("rise") || void 0,
    heads: head.head === "sketch" ? head.flags.has("heads") || void 0 : void 0,
    boxed: head.head === "cells" ? head.flags.has("boxed") || void 0 : void 0,
    bare: head.head === "columns" ? head.flags.has("bare") || void 0 : void 0,
    centred: head.head === "columns" ? head.flags.has("centred") || void 0 : void 0,
    aside: head.head === "tiles" ? head.flags.has("aside") || void 0 : void 0,
    ids: head.head === "matrix" ? head.flags.has("ids") || void 0 : void 0,
    rules: head.head === "matrix" ? head.flags.has("rules") || void 0 : void 0,
    rows: head.head === "columns" ? option(head, "rows")?.split(",").map((r) => r.trim()) : void 0,
    fan: head.flags.has("fan") || void 0,
    curve: head.flags.has("curve") || void 0,
    even: head.head === "flow" ? head.flags.has("even") || void 0 : void 0
  });
  if (head.head === "tiles" && options.columns) Object.assign(options, { columns: options.columns[0] });
  if (head.head === "compose" && options.gap) Object.assign(options, { gap: options.gap[0] });
  return { kind: head.head, ...options, ...layout2(body) };
}
var ARROWS, fail, quoted, tokenize, tree, OPTIONS, FLAGS, PARTS, fold, ungroup, read, option, numberOf, numbers, textOf, oneOf, state, shape, SIGNS2, isSign, TONES2, clean, flow, sequence, cell, matrix, bars, tiles, WIDGETS, isWidget, isControlRow, isControl, flag, controlOf, listRow, lines4, widgetOf, columns, columnsOf, region, sketch, units, chipOf, subOf, chips, cells, notes, compose, LAYOUTS, parse;
var init_parse = __esm({
  "packages/frontend/src/lib/diagram/parse.ts"() {
    "use strict";
    init_paint();
    ARROWS = ["<->", "-->", "->", "=>", "-x"];
    fail = (line2, message) => {
      throw new Error(`line ${line2.number}: ${message}`);
    };
    quoted = (source, at, quote, number) => {
      let value = "";
      let i = at + 1;
      while (i < source.length && source[i] !== quote) {
        if (source[i] === "\\" && quote === '"' && source[i + 1] === "n") {
          value += "\n";
          i += 2;
          continue;
        }
        if (source[i] === "\\" && quote === '"' && i + 1 < source.length) i++;
        value += source[i];
        i++;
      }
      if (i >= source.length) fail({ number }, `a ${quote === '"' ? "text" : "name"} with no closing ${quote}`);
      if (quote === '"') value = value.replace(/\{([a-z]+)\}/g, (all, name) => glyphChar(name) ?? all);
      return [value, i + 1];
    };
    tokenize = (source, number) => {
      const tokens = [];
      let i = 0;
      while (i < source.length) {
        const c = source[i] ?? "";
        if (c === " " || c === "	") {
          i++;
        } else if (c === "#") {
          break;
        } else if (c === '"' || c === "`") {
          const [value, next] = quoted(source, i, c, number);
          tokens.push({ kind: "text", value, code: c === "`" });
          i = next;
        } else if (c === ":") {
          tokens.push({ kind: "colon" });
          i++;
        } else {
          const arrow = ARROWS.find((a) => source.startsWith(a, i));
          if (arrow) {
            tokens.push({ kind: "arrow", value: arrow });
            i += arrow.length;
            continue;
          }
          let word = "";
          while (i < source.length && !/[\s"`#:]/.test(source[i] ?? "") && source[i] !== "=" && !(word && ARROWS.some((a) => source.startsWith(a, i)))) {
            word += source[i++];
          }
          if (source[i] === "=") {
            i++;
            const q = source[i];
            if (q === '"' || q === "`") {
              const [value, next] = quoted(source, i, q, number);
              tokens.push({ kind: "option", key: word, value, code: q === "`" });
              i = next;
            } else {
              let value = "";
              while (i < source.length && !/[\s#:]/.test(source[i] ?? "")) value += source[i++];
              tokens.push({ kind: "option", key: word, value, code: false });
            }
          } else if (word) {
            tokens.push({ kind: "word", value: word });
          } else {
            fail({ number }, `"${c}" stands where no statement expects it`);
          }
        }
      }
      return tokens;
    };
    tree = (text2) => {
      const root = { number: 0, indent: -1, tokens: [], children: [] };
      const stack2 = [root];
      text2.split("\n").forEach((source, i) => {
        const tokens = tokenize(source, i + 1);
        if (!tokens.length) return;
        const indent = source.length - source.trimStart().length;
        while ((stack2.at(-1)?.indent ?? -1) >= indent) stack2.pop();
        const line2 = { number: i + 1, indent, tokens, children: [] };
        stack2.at(-1)?.children.push(line2);
        stack2.push(line2);
      });
      for (const line2 of root.children) fold(line2);
      return root.children;
    };
    OPTIONS = /* @__PURE__ */ new Set([
      "active",
      "at",
      "badge",
      "letter",
      "bend",
      "body",
      "caption",
      "cards",
      "count",
      "eyebrow",
      "flow",
      "foot",
      "heading",
      "id",
      "mark",
      "marker",
      "marks",
      "missing",
      "nav",
      "over",
      "place",
      "placeholder",
      "right",
      "sign",
      "size",
      "span",
      "sub",
      "surface",
      "tag",
      "rows",
      "target",
      "tone",
      "unit",
      "value",
      "via",
      "weight",
      "width",
      "icons",
      "show",
      // the options of a layout's first line
      "across",
      "axis",
      "bands",
      "claim",
      "columns",
      "direction",
      "gap",
      "head",
      "height",
      "key",
      "label-width",
      "max",
      "notes",
      "row-groups",
      "slide",
      "ticks"
    ]);
    FLAGS = /* @__PURE__ */ new Set([
      "absent",
      "boxed",
      "chain",
      "close",
      "figures",
      "fill",
      "rise",
      "curve",
      "changed",
      "cursor",
      "degraded",
      "emphasis",
      "fan",
      "focus",
      "handle",
      "hidden",
      "ink",
      "large",
      "muted",
      "new",
      "person",
      "push",
      "selected",
      "slim",
      "small",
      "split",
      "steps",
      "store",
      "strong",
      "switch",
      "arrow",
      "bare",
      "plain",
      "left",
      "heads",
      "blocks",
      "corner",
      "dashed",
      "device",
      "dim",
      "head",
      "inplace",
      "on",
      "over",
      "pointer",
      "rendered",
      "ring",
      "round",
      "dot",
      "sheet",
      "even",
      "aside",
      "end",
      "square",
      "ids",
      "rules",
      "bar",
      "centred"
    ]);
    PARTS = /* @__PURE__ */ new Set(["cells", "chips", "parts", "segments"]);
    fold = (line2) => {
      const kept2 = [];
      for (const child of line2.children) {
        fold(child);
        const [head, value, ...rest] = child.tokens;
        const word = head?.kind === "word" ? head.value : "";
        const colon = line2.tokens.findIndex((t) => t.kind === "colon");
        const before = (t) => {
          if (colon < 0) line2.tokens.push(t);
          else line2.tokens.splice(colon, 0, t);
        };
        const layoutOfPart = line2.tokens[0]?.kind === "word" && line2.tokens[0].value === "part" && Object.hasOwn(LAYOUTS, word);
        const parent = line2.tokens[0]?.kind === "word" ? line2.tokens[0].value : "";
        const control = ["column", "frame", "row", "region", "band"].includes(parent) && isWidget(word);
        if (child.children.length || layoutOfPart || control) {
          kept2.push(child);
        } else if (FLAGS.has(word) && !value) {
          before({ kind: "word", value: word });
        } else if ((OPTIONS.has(word) || line2.tokens[0]?.kind === "word" && line2.tokens[0].value === "legend") && value && !rest.length && (value.kind === "text" || value.kind === "word")) {
          before({ kind: "option", key: word, value: value.value, code: value.kind === "text" && value.code });
        } else if (PARTS.has(word)) {
          if (colon < 0) line2.tokens.push({ kind: "colon" });
          line2.tokens.push(...child.tokens.slice(1).filter((t) => t.kind !== "colon"));
        } else {
          kept2.push(child);
        }
      }
      line2.children = kept2;
    };
    ungroup = (lines5) => lines5.flatMap((line2) => {
      const s = read(line2);
      if (s.head !== "group" || !line2.children.length) return [line2];
      const tag = { kind: "option", key: "group", value: textOf(s), code: false };
      return line2.children.map((child) => {
        const colon = child.tokens.findIndex((t) => t.kind === "colon");
        const tokens = [...child.tokens];
        tokens.splice(colon < 0 ? tokens.length : colon, 0, tag);
        return { ...child, tokens };
      });
    });
    read = (line2) => {
      const [first, ...rest] = line2.tokens;
      const statement = {
        line: line2,
        head: first?.kind === "word" ? first.value : "",
        texts: [],
        options: /* @__PURE__ */ new Map(),
        flags: /* @__PURE__ */ new Set(),
        words: [],
        after: []
      };
      const tokens = first?.kind === "word" ? rest : line2.tokens;
      const colon = tokens.findIndex((t) => t.kind === "colon");
      const before = colon < 0 ? tokens : tokens.slice(0, colon);
      statement.after = colon < 0 ? [] : tokens.slice(colon + 1);
      for (const t of before) {
        if (t.kind === "text") statement.texts.push({ value: t.value, code: t.code });
        else if (t.kind === "option") statement.options.set(t.key, { value: t.value, code: t.code });
        else if (t.kind === "arrow") statement.arrow = t.value;
        else if (t.kind === "word") statement.words.push(t.value);
      }
      for (const w of statement.words) statement.flags.add(w);
      return statement;
    };
    option = (s, key2) => s.options.get(key2)?.value;
    numberOf = (s, key2) => {
      const raw = option(s, key2);
      if (raw === void 0) return void 0;
      const n = Number(raw);
      if (!Number.isFinite(n)) fail(s.line, `${key2}=${raw} is not a number`);
      return n;
    };
    numbers = (s, key2) => {
      const raw = option(s, key2);
      if (raw === void 0) return void 0;
      return raw.split(",").map((part) => {
        const n = Number(part);
        if (!Number.isFinite(n)) fail(s.line, `${key2}=${raw} is not a list of numbers`);
        return n;
      });
    };
    textOf = (s, index = 0) => {
      const t = s.texts[index];
      if (!t) return fail(s.line, `${s.head || "this statement"} needs a text in double quotes`);
      return t.value;
    };
    oneOf = (s, key2, allowed) => {
      const raw = option(s, key2);
      if (raw === void 0) return void 0;
      if (!allowed.includes(raw)) fail(s.line, `${key2}=${raw}: write one of ${allowed.join(", ")}`);
      return raw;
    };
    state = (s) => s.flags.has("absent") ? "absent" : s.flags.has("degraded") ? "degraded" : void 0;
    shape = (s) => s.flags.has("person") ? "person" : s.flags.has("store") ? "store" : void 0;
    SIGNS2 = ["yes", "partly", "no", "unknown", "dot", "ring", "page", "panel", "both", "form", "bar", "nav", "docheader", "any"];
    isSign = (w) => SIGNS2.includes(w);
    TONES2 = ["ink", "muted", "ok", "warn", "error"];
    clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== void 0 && v !== false));
    flow = (lines5) => {
      const nodes = [];
      const edges = [];
      const groups = [];
      const node = (s) => {
        const id = s.head;
        const items = s.line.children.map(read).filter((c) => c.head === "item").map((c) => clean({ title: textOf(c), body: option(c, "body"), value: option(c, "value") }));
        const title = s.texts[0] ?? (items.length ? { value: "", code: false } : fail(s.line, `node ${id} needs its title in double quotes or backticks`));
        const at = numbers(s, "at");
        if (!at || at.length !== 2) fail(s.line, `node ${id} needs at=column,row`);
        const mark = s.flags.has("new") ? "new" : s.flags.has("changed") ? "changed" : void 0;
        nodes.push(
          clean({
            id,
            at,
            span: numberOf(s, "span"),
            rows: numberOf(s, "rows"),
            title: title.value,
            code: title.code || void 0,
            body: option(s, "body"),
            value: option(s, "value"),
            items: items.length ? items : void 0,
            across: numberOf(s, "across"),
            mark,
            shape: shape(s),
            state: state(s),
            emphasis: s.flags.has("emphasis") || void 0,
            fill: flag(s, "fill"),
            ink: s.flags.has("ink") || void 0,
            strong: flag(s, "strong"),
            plain: flag(s, "plain"),
            dashed: flag(s, "dashed"),
            eyebrow: option(s, "eyebrow"),
            tag: option(s, "tag")
          })
        );
        return id;
      };
      const group = (line2, within) => {
        const s = read(line2);
        const id = s.words.find((w) => !["absent", "degraded"].includes(w));
        const label = textOf(s);
        const members = line2.children.flatMap((child) => read(child).head === "group" ? group(child, id ?? `group:${label}`) : [node(read(child))]);
        groups.push(clean({ id, label, nodes: members, state: state(s), within, emphasis: flag(s, "emphasis") }));
        return members;
      };
      const rows = [];
      const heads = [];
      const letters = [];
      const claims = [];
      const eyebrows = [];
      for (const line2 of lines5) {
        const s = read(line2);
        if (s.head === "group") {
          group(line2);
        } else if (s.head === "column" && !s.arrow) {
          const index = Number(s.words[0]);
          if (!Number.isInteger(index) || index < 0) fail(line2, 'a column head is `column <number> "head"`, from 0');
          while (heads.length <= index) heads.push("");
          heads[index] = textOf(s);
          if (s.flags.has("emphasis")) claims.push(index);
          const letter = option(s, "letter");
          if (letter) {
            while (letters.length <= index) letters.push("");
            letters[index] = letter;
          }
          const eyebrow = option(s, "eyebrow");
          if (eyebrow) {
            while (eyebrows.length <= index) eyebrows.push("");
            eyebrows[index] = eyebrow;
          }
        } else if (s.head === "row" && !s.arrow) {
          const index = Number(s.words[0]);
          if (!Number.isInteger(index) || index < 0) fail(line2, 'a row label is `row <number> "label"`, from 0');
          while (rows.length <= index) rows.push({});
          rows[index] = clean({ label: s.texts[0]?.value, note: option(s, "note") ?? line2.children.filter((c) => read(c).head === "note").map((c) => textOf(read(c)))[0] });
        } else if (s.arrow) {
          const [to] = s.words.filter((w) => !["absent", "degraded", "emphasis"].includes(w));
          if (!to) fail(line2, "a connector needs the id it goes to");
          edges.push(
            clean({
              from: s.head,
              to,
              label: s.texts[0]?.value,
              via: oneOf(s, "via", ["h", "v"]),
              bend: numberOf(s, "bend"),
              state: s.arrow === "-->" ? "absent" : state(s),
              fails: s.arrow === "-x" || void 0,
              both: s.arrow === "<->" || void 0,
              emphasis: s.arrow === "=>" || s.flags.has("emphasis") || void 0
            })
          );
        } else {
          node(s);
        }
      }
      return clean({ nodes, edges, groups: groups.length ? groups : void 0, rows: rows.length ? rows : void 0, heads: heads.length ? heads : void 0, letters: letters.length ? letters : void 0, claims: claims.length ? claims : void 0, eyebrows: eyebrows.length ? eyebrows : void 0 });
    };
    sequence = (lines5) => {
      const lanes = [];
      const hosts = [];
      const phases = [];
      const steps = (children) => children.map((line2) => {
        const s = read(line2);
        if (s.head === "note") {
          const over = option(s, "over")?.split(",");
          if (over && over.length !== 2) fail(line2, "over=first,last names two lanes");
          return clean({ note: textOf(s), over });
        }
        if (!s.arrow) fail(line2, 'a step is `from -> to "text"`, or a note');
        const [to] = s.words.filter((w) => !["absent", "degraded", "emphasis"].includes(w));
        if (!to) fail(line2, "a step needs the lane it goes to");
        return clean({
          from: s.head,
          to,
          text: textOf(s),
          state: s.arrow === "-->" ? "absent" : state(s),
          fails: s.arrow === "-x" || void 0,
          emphasis: s.arrow === "=>" || s.flags.has("emphasis") || void 0
        });
      });
      for (const line2 of lines5) {
        const s = read(line2);
        if (s.head === "lane") {
          const [id] = s.words;
          if (!id) fail(line2, "a lane needs an id");
          lanes.push(clean({ id, label: textOf(s), sub: option(s, "sub"), shape: shape(s) }));
        } else if (s.head === "host") {
          hosts.push({ label: textOf(s), lanes: s.words });
        } else if (s.head === "phase") {
          phases.push(clean({ title: s.texts[0]?.value, tone: oneOf(s, "tone", ["error", "warn", "ok"]), steps: steps(line2.children) }));
        } else {
          fail(line2, `"${s.head}" is not a statement of a sequence: write lane, host or phase`);
        }
      }
      return clean({ lanes, hosts: hosts.length ? hosts : void 0, phases });
    };
    cell = (t, line2) => {
      if (t.kind === "word") {
        if (t.value === "-") return "";
        if (isSign(t.value)) return t.value;
        const noted = /^(\w+)\^(\d+)$/.exec(t.value);
        if (noted && isSign(noted[1] ?? "")) return { sign: noted[1], note: Number(noted[2]) };
        return fail(line2, `"${t.value}" is not a cell: write ${SIGNS2.join(", ")}, - or a text, and sign^1 for a note`);
      }
      if (t.kind === "text") return clean({ text: t.value, code: t.code || void 0 });
      if (t.kind === "option") {
        if (t.key === "chip") return { chips: t.value.split(",").map((x) => x.trim()).filter(Boolean) };
        if (t.key === "path") return { path: t.value.split("\u203A").map((x) => x.trim()).filter(Boolean) };
        if (!isSign(t.key)) fail(line2, `"${t.key}" is not a sign: write a sign=text, chip=A1,A2 or path="a \u203A b"`);
        return clean({ sign: t.key, text: t.value, code: t.code || void 0 });
      }
      return fail(line2, "a cell is a sign, - or a text");
    };
    matrix = (all) => {
      const lines5 = ungroup(all);
      const columns3 = [];
      const rows = [];
      const emphasis = { row: [], column: [] };
      let legend;
      let legendNote;
      const notes3 = [];
      for (const line2 of lines5) {
        const s = read(line2);
        if (s.head === "column") columns3.push(clean({ label: textOf(s), letter: option(s, "letter"), sub: option(s, "sub"), group: option(s, "group"), split: s.flags.has("split") || void 0, sign: oneOf(s, "sign", SIGNS2), weight: numberOf(s, "weight"), end: flag(s, "end") }));
        else if (s.head === "note") notes3.push(textOf(s));
        else if (s.head === "row") {
          if (!s.after.length) fail(line2, "a row lists its cells after a colon, or on a `cells \u2026` line under it");
          rows.push(clean({ label: textOf(s), sub: option(s, "sub"), group: option(s, "group"), cells: s.after.map((t) => cell(t, line2)) }));
        } else if (s.head === "emphasis") {
          for (const key2 of ["row", "column"]) {
            const value = option(s, key2);
            if (value !== void 0) emphasis[key2].push(value);
          }
        } else if (s.head === "legend") {
          legend = Object.fromEntries([...s.options].filter(([k]) => k !== "note").map(([k, v]) => [k, v.value]));
          legendNote = option(s, "note");
        } else fail(line2, `"${s.head}" is not a statement of a matrix: write column, row, note, emphasis or legend`);
      }
      const one = (all2) => all2.length > 1 ? all2 : all2[0];
      const marked = clean({ row: one(emphasis.row), column: one(emphasis.column) });
      return clean({ columns: columns3, rows, emphasis: Object.keys(marked).length ? marked : void 0, legend, legendNote, notes: notes3.length ? notes3 : void 0 });
    };
    bars = (all) => {
      const lines5 = ungroup(all);
      const rows = [];
      let legend;
      for (const line2 of lines5) {
        const s = read(line2);
        if (s.head === "row") {
          const segments = s.after.map((t) => {
            if (t.kind === "option") {
              if (t.key === "absent") return { value: Number(t.value), absent: true };
              const tone = TONES2.includes(t.key) ? t.key : fail(line2, `"${t.key}" is not a tone: write ${TONES2.join(", ")} or absent`);
              return { value: Number(t.value), tone };
            }
            if (t.kind === "word" && Number.isFinite(Number(t.value))) return { value: Number(t.value) };
            return fail(line2, "a segment is a number, or tone=number");
          });
          rows.push(
            clean({
              label: textOf(s),
              code: s.texts[0]?.code || void 0,
              sub: option(s, "sub"),
              group: option(s, "group"),
              segments,
              target: numberOf(s, "target"),
              value: option(s, "value"),
              emphasis: s.flags.has("emphasis") || void 0
            })
          );
        } else if (s.head === "legend") {
          legend = [...s.options].map(([tone, v]) => ({ tone, label: v.value }));
        } else {
          fail(line2, `"${s.head}" is not a statement of bars: write row or legend`);
        }
      }
      return clean({ rows, legend });
    };
    tiles = (lines5) => ({
      tiles: lines5.map((line2) => {
        const s = read(line2);
        if (s.head !== "tile") fail(line2, "tiles hold tile statements");
        return clean({
          value: textOf(s, 0),
          label: textOf(s, 1),
          unit: option(s, "unit"),
          body: option(s, "body"),
          sign: oneOf(s, "sign", SIGNS2),
          state: state(s),
          emphasis: s.flags.has("emphasis") || void 0
        });
      })
    });
    WIDGETS = [
      "text",
      "field",
      "button",
      "tabs",
      "chip",
      "hint",
      "label",
      "step",
      "code",
      "page",
      "lock",
      "image",
      "tree",
      "tools",
      "lines",
      "devices",
      "site",
      "rule",
      "keycap",
      "toolbar",
      "frame",
      "list",
      "pill",
      "tag",
      "arrow",
      "progress",
      "dots",
      "thumb",
      "crop",
      "map",
      "toggle",
      "drop",
      "insert",
      "entry",
      "keyboard",
      "span"
    ];
    isWidget = (head) => WIDGETS.includes(head);
    isControlRow = (line2) => read(line2).head === "row" && line2.children.length > 0 && line2.children.every((c) => isWidget(read(c).head));
    isControl = (line2) => isWidget(read(line2).head) || isControlRow(line2);
    flag = (s, name) => s.flags.has(name) || void 0;
    controlOf = (line2) => {
      if (!isControl(line2)) fail(line2, `"${read(line2).head}" is not a control: write row or one of ${WIDGETS.join(", ")}`);
      const s = read(line2);
      return clean({ ...widgetOf(s), push: flag(s, "push"), weight: numberOf(s, "weight"), id: option(s, "id"), corner: flag(s, "corner"), pointer: flag(s, "pointer") });
    };
    listRow = (line2) => {
      const s = read(line2);
      if (s.head !== "row") fail(line2, 'a list holds `row "Label"` statements');
      const raw = textOf(s);
      const label = raw.trimStart();
      return clean({
        text: label,
        indent: numberOf(s, "indent") ?? (Math.floor((raw.length - label.length) / 2) || void 0),
        selected: flag(s, "selected"),
        boxed: flag(s, "boxed"),
        muted: flag(s, "muted"),
        strong: flag(s, "strong"),
        state: state(s),
        emphasis: flag(s, "emphasis"),
        right: option(s, "right"),
        button: option(s, "button"),
        mark: oneOf(s, "mark", TONES2),
        chip: option(s, "chip"),
        head: flag(s, "head"),
        marker: option(s, "marker"),
        id: option(s, "id")
      });
    };
    lines4 = (s, what) => {
      const out = s.line.children.map((c) => {
        const l = read(c);
        if (l.head !== "line") fail(c, `${what} holds \`line "\u2026"\` statements`);
        return textOf(l);
      });
      return out.length ? out : void 0;
    };
    widgetOf = (s) => {
      const marker2 = option(s, "marker");
      const chip2 = option(s, "chip");
      const strong = flag(s, "strong");
      const t = s.texts[0];
      switch (s.head) {
        case "text":
          return clean({ w: "text", text: textOf(s), code: t?.code || void 0, strong, large: flag(s, "large"), small: flag(s, "small"), tone: oneOf(s, "tone", ["ink", "muted", "error"]), marker: marker2, chip: chip2 });
        case "field":
          return clean({
            w: "field",
            text: t?.value,
            code: t?.code || void 0,
            placeholder: option(s, "placeholder"),
            cursor: s.flags.has("cursor") || void 0,
            tag: option(s, "tag"),
            lines: numberOf(s, "lines"),
            focus: s.flags.has("focus") || void 0,
            emphasis: flag(s, "emphasis"),
            large: s.flags.has("large") || void 0,
            slim: flag(s, "slim"),
            strong,
            state: state(s),
            hidden: flag(s, "hidden"),
            ring: flag(s, "ring"),
            dim: flag(s, "dim"),
            inplace: flag(s, "inplace"),
            right: option(s, "right"),
            more: lines4(s, "a field"),
            dot: flag(s, "dot"),
            bare: flag(s, "bare"),
            marker: marker2,
            chip: chip2
          });
        case "button":
          return clean({ w: "button", text: textOf(s), strong, ink: flag(s, "ink"), small: flag(s, "small"), round: flag(s, "round"), square: flag(s, "square"), emphasis: flag(s, "emphasis"), marker: marker2, chip: chip2 });
        case "tabs":
          return clean({ w: "tabs", items: textOf(s).split(",").map((x) => x.trim()), active: numberOf(s, "active"), switch: flag(s, "switch"), small: flag(s, "small"), marker: marker2, chip: chip2 });
        case "toolbar":
          return clean({ w: "toolbar", items: textOf(s).split(",").map((x) => x.trim()), active: numbers(s, "active"), strong, ink: flag(s, "ink"), marker: marker2, chip: chip2 });
        case "pill":
          return clean({ w: "pill", text: textOf(s), ink: flag(s, "ink"), marker: marker2, chip: chip2 });
        case "tag":
          return clean({ w: "tag", text: textOf(s), marker: marker2, chip: chip2 });
        case "arrow":
          return clean({ w: "arrow", text: t?.value, marker: marker2 });
        case "progress": {
          const value = numberOf(s, "value") ?? fail(s.line, "a progress bar needs value= from 0 to 1");
          if (value < 0 || value > 1) fail(s.line, `value=${value}: a progress bar takes a share from 0 to 1`);
          return clean({ w: "progress", value, marker: marker2 });
        }
        case "chip":
          return clean({ w: "chip", text: textOf(s), label: s.texts[1]?.value, emphasis: flag(s, "emphasis"), fill: flag(s, "fill"), strong, marker: marker2 });
        case "dots": {
          const of = numberOf(s, "of") ?? fail(s.line, "dots need of= for the whole, and value= for the filled ones");
          const value = numberOf(s, "value") ?? fail(s.line, "dots need value= for the filled ones");
          if (!Number.isInteger(of) || !Number.isInteger(value) || of < 1 || value < 0 || value > of) fail(s.line, `value=${value} of=${of}: write whole counts, the value no more than the whole`);
          return clean({ w: "dots", value, of, text: t?.value, marker: marker2 });
        }
        case "keycap":
          return clean({ w: s.head, text: textOf(s), marker: marker2 });
        case "hint":
          return clean({ w: "hint", text: textOf(s), right: option(s, "right"), emphasis: flag(s, "emphasis"), marker: marker2, chip: chip2 });
        case "label":
        case "step":
          return clean({ w: s.head, text: textOf(s), chip: chip2, marker: marker2 });
        case "code": {
          const block = lines4(s, "a code block");
          if (!block && !t) fail(s.line, 'code needs a text, or `line "\u2026"` lines under it');
          return clean({ w: "code", text: t?.value, lines: block, strong, marker: marker2, chip: chip2 });
        }
        case "thumb":
          return clean({
            w: "thumb",
            text: t?.value,
            show: oneOf(s, "show", ["picture", "lines", "teaser", "page", "person"]),
            split: numbers(s, "split"),
            selected: flag(s, "selected"),
            state: state(s),
            marker: marker2
          });
        case "crop":
          return clean({ w: "crop", marker: marker2 });
        case "map":
          return clean({ w: "map", text: t?.value, marker: marker2 });
        case "toggle":
          return clean({ w: "toggle", text: textOf(s), on: flag(s, "on"), marker: marker2 });
        case "drop":
          return clean({ w: "drop", text: t?.value, marker: marker2 });
        case "insert":
          return clean({ w: "insert", strong, marker: marker2, chip: chip2 });
        case "keyboard":
          return clean({ w: "keyboard", marker: marker2 });
        case "span":
          return clean({ w: "span", text: textOf(s), marker: marker2 });
        case "entry":
          return clean({ w: "entry", text: textOf(s), body: option(s, "body"), sign: oneOf(s, "sign", GLYPHS), selected: flag(s, "selected"), state: state(s), marker: marker2, chip: chip2 });
        case "lock":
          return clean({ w: s.head, text: textOf(s), strong, marker: marker2, chip: chip2 });
        case "page":
          return clean({ w: s.head, text: textOf(s), dot: flag(s, "dot"), marker: marker2 });
        case "image":
          return clean({ w: "image", text: t?.value, lines: numberOf(s, "lines"), marker: marker2 });
        case "tree":
        case "lines":
          return clean({ w: s.head, lines: numberOf(s, "lines"), marker: marker2 });
        case "tools":
          return clean({ w: "tools", count: numberOf(s, "count"), marker: marker2 });
        case "devices":
          return clean({ w: "devices", text: textOf(s), active: oneOf(s, "active", ["phone", "tablet", "desktop"]), chip: chip2, marker: marker2 });
        case "site":
          return clean({
            w: "site",
            name: textOf(s),
            nav: option(s, "nav"),
            heading: option(s, "heading"),
            cards: numberOf(s, "cards"),
            width: numberOf(s, "width"),
            selected: s.flags.has("selected") || void 0,
            cursor: s.flags.has("cursor") || void 0,
            marker: marker2
          });
        case "row":
          return clean({ w: "row", items: s.line.children.map(controlOf), bar: flag(s, "bar") });
        case "frame":
          return clean({
            w: "frame",
            title: t?.value,
            close: flag(s, "close"),
            tone: oneOf(s, "tone", ["ok", "warn", "error"]),
            strong,
            state: state(s),
            hidden: flag(s, "hidden"),
            width: numberOf(s, "width"),
            ink: flag(s, "ink"),
            over: flag(s, "over"),
            bare: flag(s, "bare"),
            fill: flag(s, "fill"),
            sheet: flag(s, "sheet"),
            device: flag(s, "device"),
            dot: flag(s, "dot"),
            chip: chip2,
            marker: marker2,
            items: s.line.children.map(controlOf)
          });
        case "list":
          if (!s.line.children.length) fail(s.line, 'a list needs its `row "Label"` lines under it');
          return clean({ w: "list", handle: flag(s, "handle"), steps: flag(s, "steps"), columns: numbers(s, "columns"), rendered: flag(s, "rendered"), marker: marker2, rows: s.line.children.map(listRow) });
        default:
          return { w: "rule" };
      }
    };
    columns = (all) => {
      const legend = all.filter((l) => read(l).head === "key").map((l) => {
        const k = read(l);
        return clean({ label: textOf(k), chip: option(k, "chip"), badge: option(k, "badge"), pill: option(k, "pill"), sign: oneOf(k, "sign", SIGNS2) });
      });
      const lines5 = all.filter((l) => read(l).head !== "key");
      return clean({ legend: legend.length ? legend : void 0, ...columnsOf(lines5) });
    };
    columnsOf = (lines5) => ({
      columns: lines5.map((line2) => {
        const s = read(line2);
        if (s.head !== "column") fail(line2, "columns hold column statements");
        const items = [];
        const terminal = [];
        const widgets = [];
        const notes3 = [];
        const joins = [];
        for (const child of line2.children) {
          const i = read(child);
          if (i.head === "join") {
            const [from, to] = i.words;
            if (!from || !to) fail(child, "a join names two ids: `join a b`");
            joins.push(clean({ from, to, dashed: flag(i, "dashed"), arrow: flag(i, "arrow"), right: flag(i, "right") }));
            continue;
          }
          if (isControl(child)) {
            widgets.push(controlOf(child));
            continue;
          }
          if (i.head === "line") {
            terminal.push(textOf(i));
            continue;
          }
          if (i.head === "note" && !i.options.size) {
            notes3.push(textOf(i));
            continue;
          }
          if (i.head !== "item") fail(child, `a column holds item, line, join and control statements: row, ${WIDGETS.join(", ")}`);
          const marks = option(i, "marks")?.split(",");
          for (const m of marks ?? []) if (!TONES2.includes(m)) fail(child, `"${m}" is not a tone: write ${TONES2.join(", ")}`);
          items.push(
            clean({
              text: textOf(i),
              code: i.texts[0]?.code || void 0,
              id: option(i, "id"),
              sign: oneOf(i, "sign", SIGNS2),
              mark: oneOf(i, "mark", TONES2),
              marks,
              boxed: i.flags.has("boxed") || void 0,
              strong: flag(i, "strong"),
              state: state(i),
              emphasis: i.flags.has("emphasis") || void 0,
              fill: flag(i, "fill")
            })
          );
        }
        return clean({
          eyebrow: option(s, "eyebrow"),
          letter: option(s, "letter"),
          value: option(s, "value"),
          title: s.texts[0]?.value,
          sub: option(s, "sub"),
          id: option(s, "id"),
          place: oneOf(s, "place", SIGNS2),
          badge: option(s, "badge"),
          widgets: widgets.length ? widgets : void 0,
          joins: joins.length ? joins : void 0,
          body: option(s, "body"),
          items: items.length ? items : void 0,
          terminal: terminal.length ? terminal : void 0,
          note: option(s, "note") ?? (notes3.length ? notes3.join(" ") : void 0),
          foot: option(s, "foot"),
          strong: flag(s, "strong"),
          state: state(s),
          emphasis: s.flags.has("emphasis") || void 0
        });
      })
    });
    region = (line2) => {
      const s = read(line2);
      if (!["row", "column", "region"].includes(s.head)) fail(line2, `"${s.head}" is not a region: write row, column or region`);
      const regions = line2.children.filter((c) => !isControl(c));
      const widgets = line2.children.filter(isControl).map(controlOf);
      const children = regions.map(region);
      return clean({
        label: s.texts[0]?.value,
        split: s.head === "region" ? void 0 : s.head,
        size: numberOf(s, "size"),
        surface: oneOf(s, "surface", ["raised", "sunken", "none"]),
        lines: numberOf(s, "lines"),
        marker: option(s, "marker"),
        state: state(s),
        emphasis: s.flags.has("emphasis") || void 0,
        strong: flag(s, "strong"),
        hidden: flag(s, "hidden"),
        head: flag(s, "head"),
        plain: flag(s, "plain"),
        flow: oneOf(s, "flow", ["row", "column"]),
        across: numberOf(s, "across"),
        icons: numberOf(s, "icons"),
        widgets: widgets.length ? widgets : void 0,
        children: children.length ? children : void 0
      });
    };
    sketch = (lines5) => ({
      screens: lines5.map((line2) => {
        const s = read(line2);
        if (s.head !== "screen") fail(line2, "a sketch holds screen statements");
        const bands = line2.children.filter((c) => read(c).head === "band");
        const [root, ...more] = line2.children.filter((c) => !bands.includes(c));
        if (!root || more.length) fail(line2, "a screen holds exactly one region, and a band under it");
        if (bands.length > 1) fail(bands[1], "a screen holds one band");
        const b = bands[0];
        const band2 = b ? clean({ label: read(b).texts[0]?.value, across: numberOf(read(b), "across"), widgets: b.children.map(controlOf) }) : void 0;
        return clean({ title: s.texts[0]?.value, caption: option(s, "caption"), weight: numberOf(s, "weight"), device: flag(s, "device"), root: region(root), band: band2 });
      })
    });
    units = (lines5) => ({
      rows: lines5.map((line2) => {
        const s = read(line2);
        if (s.head !== "row") fail(line2, "units hold row statements");
        if (!s.after.length) fail(line2, "a row lists its parts after a colon, or on a `parts \u2026` line under it");
        const parts2 = s.after.map((t) => {
          if (t.kind === "word" && Number.isInteger(Number(t.value))) return { count: Number(t.value) };
          if (t.kind === "option" && (t.key === "absent" || t.key === "degraded") && Number.isInteger(Number(t.value))) return { count: Number(t.value), state: t.key };
          return fail(line2, "a part is a count, or absent=count or degraded=count");
        });
        const below = line2.children.filter((c) => read(c).head === "note").map((c) => textOf(read(c)));
        const sub = [option(s, "sub"), option(s, "note"), ...below].filter((v) => Boolean(v));
        return clean({ label: textOf(s), sub: sub.length ? sub : void 0, parts: parts2, missing: option(s, "missing"), emphasis: s.flags.has("emphasis") || void 0 });
      })
    });
    chipOf = (t, line2) => {
      if (t.kind !== "word") return fail(line2, "a chip is a bare identifier: A1, (A1) or ~A1");
      const m = /^(~?)(\(?)([^()*!~]+)\)?([*!]*)$/.exec(t.value);
      if (!m) return fail(line2, `"${t.value}" is not a chip: write A1, (A1) or ~A1, with * or ! after it`);
      return clean({
        id: m[3],
        kind: m[1] ? "plain" : m[2] ? "outline" : void 0,
        ring: m[4]?.includes("*") || void 0,
        emphasis: m[4]?.includes("!") || void 0
      });
    };
    subOf = (s) => option(s, "sub")?.split("|").map((x) => x.trim());
    chips = (lines5) => {
      const groups = [];
      let legend;
      for (const line2 of lines5) {
        const s = read(line2);
        if (s.head === "legend") {
          legend = [...s.options].map(
            ([kind, v]) => ["filled", "outline", "plain", "ring"].includes(kind) ? { kind, label: v.value } : fail(line2, `"${kind}" is not a chip: write filled, outline, plain or ring`)
          );
        } else if (s.head === "row" || s.head === "column") {
          const tasks = line2.children.filter((c) => read(c).head === "task").map((c) => textOf(read(c)));
          const more = line2.children.filter((c) => read(c).head === "chips").flatMap((c) => read(c).after);
          groups.push(clean({ label: textOf(s), sub: subOf(s), tasks: tasks.length ? tasks : void 0, chips: [...s.after, ...more].map((t) => chipOf(t, line2)) }));
        } else {
          fail(line2, `"${s.head}" is not a statement of chips: write row, column or legend`);
        }
      }
      return clean({ groups, legend });
    };
    cells = (lines5) => {
      const groups = [];
      let legend;
      for (const line2 of lines5) {
        const s = read(line2);
        if (s.head === "legend") legend = Object.fromEntries([...s.options].map(([k, v]) => [k, v.value]));
        else if (s.head === "group") {
          const inline = s.after.map((t) => {
            if (t.kind === "option" && isSign(t.value)) return { id: t.key, sign: t.value };
            if (t.kind === "word") return { id: t.value };
            return fail(line2, "a cell is an id, or id=sign");
          });
          const below = line2.children.map((child) => {
            const [id, mark, ...rest] = child.tokens;
            if (id?.kind !== "word" || rest.length || mark && (mark.kind !== "word" || !isSign(mark.value))) {
              return fail(child, `a cell is its id and its sign: write F1.1 partly, with a sign of ${SIGNS2.join(", ")}`);
            }
            return clean({ id: id.value, sign: mark?.kind === "word" ? mark.value : void 0 });
          });
          const list = [...inline, ...below];
          groups.push(clean({ title: textOf(s), sub: option(s, "sub"), tone: oneOf(s, "tone", ["ok", "warn", "error"]), cells: list }));
        } else fail(line2, `"${s.head}" is not a statement of cells: write group or legend`);
      }
      return clean({ groups, legend });
    };
    notes = (lines5) => ({
      notes: lines5.map((line2) => {
        const s = read(line2);
        if (s.head !== "note" || !s.words[0]) fail(line2, 'a note is `note <marker> "Title" body="\u2026"`');
        return clean({ marker: s.words[0], title: textOf(s), body: option(s, "body") });
      })
    });
    compose = (lines5) => ({
      parts: lines5.map((line2) => {
        const s = read(line2);
        if (s.head !== "part") fail(line2, "a composed drawing holds part statements");
        const labels = line2.children.filter((c) => read(c).head === "label" && !c.children.length);
        const [first, ...rest] = line2.children.filter((c) => !labels.includes(c));
        if (!first) return fail(line2, "a part needs its layout on the line under it");
        const label = option(s, "label") ?? (labels[0] ? textOf(read(labels[0])) : void 0);
        return clean({ weight: numberOf(s, "weight"), label, spec: layoutOf(first, [...first.children, ...rest]) });
      })
    });
    LAYOUTS = { flow, sequence, matrix, bars, tiles, columns, sketch, units, chips, cells, notes, compose };
    parse = (text2) => {
      const [first, ...rest] = tree(text2);
      if (!first) throw new Error("line 1: the text is empty \u2014 start with the layout, for example `flow`");
      const head = read(first);
      let title;
      let description;
      const body = [...first.children];
      for (const line2 of rest) {
        const s = read(line2);
        if (s.head === "title") title = textOf(s);
        else if (s.head === "description") description = textOf(s);
        else body.push(line2);
      }
      if (!LAYOUTS[head.head]) fail(first, `"${head.head}" is not a layout: write ${Object.keys(LAYOUTS).join(", ")}`);
      if (!title) fail(first, 'a diagram needs a `title "\u2026"` line: it is the accessible name of the file');
      if (!description) fail(first, 'a diagram needs a `description "\u2026"` line: it is what a reader who cannot see the drawing gets');
      const spec = layoutOf(first, body);
      const claim = oneOf(head, "claim", ["accent", "error", "warn", "ok"]);
      const room = numbers(head, "slide");
      if (room && room.length !== 2) fail(first, "slide=width,height names the room of a slide");
      return clean({ ...spec, title, description, claim, slide: room ? { width: room[0], height: room[1] } : void 0 });
    };
  }
});

// packages/frontend/src/lib/diagram/bars.ts
var ROW, BAR, VALUE, bars2, shortfall;
var init_bars = __esm({
  "packages/frontend/src/lib/diagram/bars.ts"() {
    "use strict";
    init_paint();
    init_text();
    ROW = 34;
    BAR = 16;
    VALUE = 96;
    bars2 = (spec, room, ctx) => {
      const bands = spec.bands ?? [];
      const max = spec.max ?? (bands.length || ctx.fail("a scale needs max=, or bands="));
      const valued = !bands.length || spec.rows.some((r) => r.value !== void 0);
      const widest = Math.max(
        ...spec.rows.map((r) => measure(r.label, SIZE.body, r.code ? "mono" : "sans", 600)),
        ...spec.rows.map((r) => r.sub ? measure(r.sub, SIZE.label, r.code ? "sans" : "mono") : 0),
        spec.axis ? measure(spec.axis, SIZE.label, "sans", 600) : 0
      );
      const labelW = Math.min(widest + 32, room.width * 0.35);
      const x0 = room.x + labelW;
      const scale = (room.width - labelW - (valued ? VALUE : 0)) / max;
      const out = [];
      let y = room.y;
      if (bands.length) {
        if (spec.axis) out.push(text(room.x, y + 14, fit(spec.axis, labelW - 16, { size: SIZE.label, weight: 600 }, `${ctx.name}: the axis`), { size: SIZE.label, weight: 600, fill: SECONDARY }));
        const heads = bands.map((b) => wrap(b, scale - 16, { size: SIZE.label, face: "mono" }, `${ctx.name}: band ${b}`));
        const lines5 = Math.max(...heads.map((h) => h.length));
        heads.forEach((h, i) => {
          h.forEach((l, j) => out.push(text(x0 + i * scale + 8, y + 14 + (lines5 - h.length + j) * 17, l, { size: SIZE.label, face: "mono", fill: MUTED })));
        });
        y += 32 + (lines5 - 1) * 17;
      }
      const top = y;
      let group;
      spec.rows.forEach((row2, index) => {
        const what = `${ctx.name}: bar ${row2.label}`;
        if (row2.group && row2.group !== group) {
          group = row2.group;
          out.push(text(room.x, y + 22, row2.group.toUpperCase(), { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8, fill: MUTED }));
          y += 32;
        }
        const face = row2.code ? "mono" : "sans";
        const subFace = row2.code ? "sans" : "mono";
        const label = wrap(row2.label, labelW - 16, { size: SIZE.body, weight: 600, face }, what);
        const sub = row2.sub ? fit(row2.sub, labelW - 16, { size: SIZE.label, face: subFace }, what) : "";
        const h = Math.max(ROW, label.length * 18 + (sub ? 17 : 0) + 14);
        let ty = y + (h - (label.length * 18 + (sub ? 17 : 0))) / 2 + 13;
        for (const t of label) {
          out.push(text(room.x, ty, t, { size: SIZE.body, weight: 600, face }));
          ty += 18;
        }
        if (sub) out.push(text(room.x, ty - 1, sub, { size: SIZE.label, face: subFace, fill: SECONDARY }));
        const by = y + (h - BAR) / 2;
        const inked = row2.segments.some((s) => !s.absent && (s.tone ?? "ink") === "ink");
        const claim = row2.emphasis ? ctx.emphasis("bar", `bar ${row2.label}`) : void 0;
        let x = x0;
        let run2 = [];
        let runStart = x0;
        const close = () => {
          if (!run2.length) return;
          const clip = `${ctx.name}-bar-${index}-${runStart.toFixed(0)}`;
          out.push(`<clipPath id="${clip}">${rect(runStart, by, x - runStart, BAR, { radius: 4 })}</clipPath>`);
          out.push(`<g clip-path="url(#${clip})">${run2.join("")}</g>`);
          run2 = [];
        };
        for (const s of row2.segments) {
          if (s.value < 0) ctx.fail(`${what}: a segment of ${s.value}`);
          const w = s.value * scale;
          if (s.absent) {
            close();
            out.push(rect(x, by, w - 4, BAR, { stroke: STRONG, width: 1.5, radius: 4, dashed: true }));
            x += w;
            runStart = x;
            continue;
          }
          const tone = s.tone ?? "ink";
          run2.push(rect(x, by, w, BAR, { fill: claim && tone === "ink" ? claim : TONE[tone] }));
          x += w;
        }
        close();
        const total = row2.segments.reduce((sum2, s) => sum2 + s.value, 0);
        const filled = row2.segments.reduce((sum2, s) => sum2 + (s.absent ? 0 : s.value), 0);
        const end = Math.max(total, row2.target ?? 0);
        if (end > max) ctx.fail(`${what}: ${end} runs past the end of the scale, ${max}`);
        if (row2.target !== void 0 && row2.target > total) out.push(shortfall(x0 + total * scale, x0 + row2.target * scale, by, total === 0));
        if (claim && !inked) out.push(rect(x0 - 6, by - 6, end * scale + 12, BAR + 12, { stroke: claim, width: 2, radius: 6 }));
        if (valued) {
          const value = row2.value ?? `${fmt(filled)}${spec.unit ? ` ${spec.unit}` : ""}`;
          out.push(text(x0 + end * scale + 12, by + 12.5, fit(value, VALUE - 12, { size: SIZE.label, face: "mono" }, what), { size: SIZE.label, face: "mono", fill: SECONDARY }));
        }
        y += h;
      });
      for (let i = 1; i < bands.length; i++) out.unshift(line(x0 + i * scale, top - 4, x0 + i * scale, y, SUBTLE));
      if (spec.ticks?.length) {
        y += 6;
        out.push(line(x0, y, x0 + max * scale, y, SUBTLE));
        for (const t of spec.ticks) {
          const tx = x0 + t * scale;
          out.push(line(tx, y, tx, y + 5, SUBTLE));
          out.push(text(tx, y + 22, String(t), { size: SIZE.label, face: "mono", fill: MUTED, anchor: "middle" }));
        }
        y += 26;
      }
      if (spec.legend?.length && ctx.legend) {
        y += 30;
        let x = room.x;
        for (const entry of spec.legend) {
          const w = 22 + measure(entry.label, SIZE.label) + 28;
          if (x + w > room.x + room.width + 28) {
            x = room.x;
            y += 24;
          }
          out.push(
            entry.tone === "absent" ? rect(x, y - 11, 12, 12, { stroke: STRONG, width: 1.5, radius: 2, dashed: true }) : rect(x, y - 11, 12, 12, { fill: TONE[entry.tone], radius: 2 })
          );
          out.push(text(x + 20, y, entry.label, { size: SIZE.label, fill: SECONDARY }));
          x += w;
        }
        y += 6;
      }
      return { svg: out.join("\n"), height: y - room.y };
    };
    shortfall = (from, to, y, whole) => {
      const r = Math.min(4, (to - from) / 2);
      const right = `H${fmt(to - r)} A${r} ${r} 0 0 1 ${fmt(to)} ${fmt(y + r)} V${fmt(y + BAR - r)} A${r} ${r} 0 0 1 ${fmt(to - r)} ${fmt(y + BAR)}`;
      const d = whole ? `M${fmt(from + r)} ${fmt(y)} ${right} H${fmt(from + r)} A${r} ${r} 0 0 1 ${fmt(from)} ${fmt(y + BAR - r)} V${fmt(y + r)} A${r} ${r} 0 0 1 ${fmt(from + r)} ${fmt(y)}Z` : `M${fmt(from)} ${fmt(y)} ${right} H${fmt(from)}`;
      return `<path d="${d}" fill="none" stroke="${MUTED}" stroke-width="1.5" stroke-dasharray="5 4"></path>`;
    };
  }
});

// packages/frontend/src/lib/diagram/widgets.ts
var BAR2, RUN, KINDS, plain, runsOf, isBold, setLine, setWidth, placeLines, run, chipW, chipAt, ids, chipsW, chipsAt, itemW, DOT, dotsW, pillW, tagW, keycapW, toolW, toolbarW, tabsW, OWN_CHIPS, chipOf2, naturalWidth, rowWidth, parts, leastWidth, ROW_GAP, BAR_PAD, BLOCKS, isBlock, row, stack, box, LIST_ROW, rowButtonW, STEP_ROW, STEP_GAP, INDENT, widget, draw;
var init_widgets = __esm({
  "packages/frontend/src/lib/diagram/widgets.ts"() {
    "use strict";
    init_paint();
    init_text();
    BAR2 = 6;
    RUN = /\*\*__(.+?)__\*\*|~~(.+?)~~|__(.+?)__|\*\*(.+?)\*\*/g;
    KINDS = ["both", "strike", "under", "bold"];
    plain = (s) => s.replace(RUN, (...m) => m.slice(1, 5).find((x) => x !== void 0) ?? "");
    runsOf = (s) => {
      const out = [];
      let shift = 0;
      for (const m of s.matchAll(RUN)) {
        const at = [1, 2, 3, 4].find((k) => m[k] !== void 0) ?? 4;
        const inner = m[at] ?? "";
        const from = (m.index ?? 0) - shift;
        out.push({ from, to: from + inner.length, kind: KINDS[at - 1] ?? "bold" });
        shift += m[0].length - inner.length;
      }
      return out;
    };
    isBold = (r) => r.kind === "bold" || r.kind === "both";
    setLine = (l, start, runs, x, y, size, face, weight, fill) => {
      const bold = (i) => runs.some((r) => isBold(r) && start + i >= r.from && start + i < r.to);
      const at = [0];
      for (let i = 0; i < l.length; i++) at.push((at[i] ?? 0) + measureSet(l[i] ?? "", size, face, bold(i) ? 600 : weight));
      const out = [];
      let from = 0;
      for (let i = 1; i <= l.length; i++) {
        if (i < l.length && bold(i) === bold(from)) continue;
        const piece = l.slice(from, i);
        const lead = piece.length - piece.trimStart().length;
        if (piece.trim()) out.push(text(x + (at[from + lead] ?? 0), y, piece.trim(), { size, face, weight: bold(from) ? 600 : weight, fill }));
        from = i;
      }
      for (const r of runs) {
        const [a, b] = [Math.max(r.from - start, 0), Math.min(r.to - start, l.length)];
        if (r.kind === "bold" || a >= b) continue;
        const yy = r.kind === "strike" ? y - size * 0.32 : y + 3;
        out.push(line(x + (at[a] ?? 0), yy, x + (at[b] ?? 0), yy, fill, 1.2));
      }
      return out.join("");
    };
    setWidth = (l, start, runs, size, face, weight) => [...l].reduce((sum2, c, i) => sum2 + measureSet(c, size, face, runs.some((r) => isBold(r) && start + i >= r.from && start + i < r.to) ? 600 : weight), 0);
    placeLines = (whole, lines5) => {
      let at = 0;
      return lines5.map((l) => {
        const start = whole.indexOf(l, at);
        at = start + l.length;
        return [l, start];
      });
    };
    run = (s, x, y, size, face, weight, fill) => text(x, y, s, { size, face, weight, fill });
    chipW = (s) => measure(s, SIZE.label, "mono", 600) + 14;
    chipAt = (s, x, y) => rect(x, y, chipW(s), 20, { fill: SUNKEN, stroke: STRONG, radius: 4 }) + run(s, x + 7, y + 14.5, SIZE.label, "mono", 600, INK);
    ids = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);
    chipsW = (s) => ids(s).reduce((sum2, id, i) => sum2 + chipW(id) + (i ? 4 : 0), 0);
    chipsAt = (s, x, y) => {
      let cx = x;
      return ids(s).map((id) => {
        const out = chipAt(id, cx, y);
        cx += chipW(id) + 4;
        return out;
      }).join("");
    };
    itemW = (id, label) => measure(id, SIZE.label, "mono", 600) + 8 + measure(label, SIZE.body, "sans", 600) + 20;
    DOT = 18;
    dotsW = (of) => (of - 1) * DOT + 10;
    pillW = (s) => measure(s, SIZE.label, "sans", 600) + 16;
    tagW = (s) => measure(s, SIZE.label, "sans", 600) + 14;
    keycapW = (s) => Math.max(22, measure(s, SIZE.label, "mono", 600) + 12);
    toolW = (s) => s === "|" ? 6 : measure(s, SIZE.label, "sans", 600) + 10;
    toolbarW = (items) => items.reduce((sum2, t) => sum2 + toolW(t) + 2, 6);
    tabsW = (items) => items.reduce((sum2, t) => sum2 + measure(t, SIZE.body, "sans", 600) + 16, 0);
    OWN_CHIPS = /* @__PURE__ */ new Set(["label", "step", "devices", "frame", "chip", "arrow", "progress"]);
    chipOf2 = (w) => "chip" in w && !OWN_CHIPS.has(w.w) ? w.chip : void 0;
    naturalWidth = (w) => {
      const chip2 = chipOf2(w);
      const own = (() => {
        switch (w.w) {
          case "text":
            return measure(plain(w.text), w.large ? 20 : w.code || w.small ? SIZE.label : SIZE.body, w.code ? "mono" : "sans", w.strong || w.large || /\*\*/.test(w.text) ? 600 : 400);
          case "span":
            return Math.max(44, measure(w.text, SIZE.label) + 8);
          case "button":
            if (w.round) return w.small ? 22 : 28;
            if (w.square) return 44;
            return w.small ? measure(w.text, SIZE.label, "sans", w.strong || w.ink ? 600 : 400) + 16 : measure(w.text, SIZE.body, "sans", w.strong || w.ink ? 600 : 400) + 24;
          case "tabs":
            return w.switch ? 0 : tabsW(w.items);
          case "chip":
            return w.label ? itemW(w.text, w.label) : chipsW(w.text);
          case "dots":
            return w.text ? 0 : dotsW(w.of);
          case "pill":
            return pillW(w.text);
          case "tag":
            return tagW(w.text);
          case "tools":
            return (w.count ?? 3) * 22 + 10;
          case "keycap":
            return keycapW(w.text);
          case "toolbar":
            return toolbarW(w.items);
          case "toggle":
            return measure(w.text, SIZE.label) + 36;
          default:
            return 0;
        }
      })();
      return own && chip2 ? own + chipsW(chip2) + 8 : own;
    };
    rowWidth = (w) => {
      switch (w.w) {
        case "text":
          return naturalWidth(w) + (w.chip ? chipsW(w.chip) + 8 : 0);
        case "hint":
          return measure(w.text, SIZE.label, "sans", w.emphasis ? 600 : 400) + (w.right ? measure(w.right, SIZE.label) + 10 : 0) + (w.chip ? chipsW(w.chip) + 8 : 0);
        case "label":
          return measure(w.text, SIZE.label) + (w.chip ? chipsW(w.chip) + 10 : 0);
        case "step":
          return measure(`\u2193 ${w.text}`, SIZE.label) + 4 + (w.chip ? chipsW(w.chip) + 10 : 0);
        default:
          return naturalWidth(w);
      }
    };
    parts = (s) => s.split(/(?<= ·) /);
    leastWidth = (w, ctx) => {
      const chip2 = chipOf2(w);
      if (chip2) return leastWidth({ ...w, chip: void 0 }, ctx) + chipsW(chip2) + 8;
      const k = (page, slide) => ctx.pick(page, slide);
      const own = (c, gap) => c ? chipsW(c) + gap : 0;
      switch (w.w) {
        case "text":
          return narrowest(plain(w.text), { size: w.large ? 20 : w.code || w.small ? SIZE.label : SIZE.body, face: w.code ? "mono" : "sans", weight: w.strong || w.large || /\*\*/.test(w.text) ? 600 : 400 });
        case "field": {
          const source = [w.text ?? w.placeholder ?? "", ...w.more ?? []].join(" ");
          const shown = plain(source);
          const bold = source !== shown && /\*\*/.test(source);
          const tag = w.tag ? measure(w.tag, SIZE.label, "sans", 600) + 34 : 0;
          const setting = w.large ? { size: 20, weight: 600 } : w.code ? { size: SIZE.label, face: "mono" } : { size: SIZE.body, weight: bold || w.dim ? 600 : 400 };
          if (w.slim) return Math.max(...parts(shown).map((p) => measure(p, setting.size, setting.face, setting.weight))) + 24 + (w.cursor ? 4 : 0) + (tag ? tag + 6 : 0) + (w.right ? measure(w.right, SIZE.label) + 10 : 0);
          return narrowest(shown, setting) + 24 + (w.cursor ? 4 : 0);
        }
        case "toggle":
          return naturalWidth(w);
        case "entry":
          return 54 + Math.max(measure(w.text, SIZE.body, "sans", 600), w.body ? narrowest(plain(w.body), { size: SIZE.label, weight: /\*\*/.test(w.body) ? 600 : 400 }) : 0);
        case "drop":
          return w.text ? tagW(w.text) + 24 : 0;
        case "thumb":
          return w.text ? measure(w.text, SIZE.label, "sans", w.selected ? 600 : 400) : 0;
        case "map":
          return w.text ? measure(w.text, SIZE.label) + 80 : 0;
        case "tabs":
          return w.switch ? w.items.length * (Math.max(0, ...w.items.map((t) => measure(t, w.small ? SIZE.label : SIZE.body, "sans", 600))) + (w.small ? 7.5 : 15.5)) + 0.5 : tabsW(w.items) - 16;
        case "hint":
          return narrowest(w.text, { size: SIZE.label, weight: w.emphasis ? 600 : 400 }) + (w.right ? measure(w.right, SIZE.label) + 10 : 0);
        case "label":
          return measure(w.text, SIZE.label) + own(w.chip, 10);
        case "step":
          return measure(w.text, SIZE.label) + 16 + own(w.chip, 10);
        case "code": {
          const lines5 = [...w.text ? [w.text] : [], ...w.lines ?? []];
          const bare = (l) => l.replace(/^(\s*)\*\*(.*)\*\*$/, "$1$2");
          return Math.max(0, ...lines5.map((l) => measure(bare(l).trim(), SIZE.label, "mono", bare(l) === l ? 400 : 600) + measure(l.slice(0, l.length - l.trimStart().length), SIZE.label, "mono"))) + 24;
        }
        case "page":
          return measure(w.text, SIZE.node, "sans", 600) + 44;
        case "lock":
          return measure(w.text, SIZE.label) + 48;
        case "devices":
          return 116 + measure(w.text, SIZE.label, "sans", 600) + own(w.chip, 10);
        case "arrow":
          return w.text ? measure(w.text, SIZE.label) + (w.push ? 40 : 28) : 0;
        case "dots":
          return Math.max(dotsW(w.of), w.text ? measure(w.text, SIZE.node, "sans", 600) + measure(`${w.value} of ${w.of}`, SIZE.body) + 12 : 0);
        case "frame": {
          if (w.width !== void 0 && w.width < 1 && !w.over) return leastWidth({ ...w, width: void 0 }, ctx) / Math.max(0.2, w.width);
          const pad = w.bare ? 0 : k(10, 8);
          const items = w.items.map((wd) => wd.w === "frame" && wd.over ? leastWidth(wd, ctx) / Math.min(1, wd.width ?? 0.7) : leastWidth(wd, ctx) + ("marker" in wd && wd.marker && !wd.corner && !naturalWidth(wd) ? 18 : 0));
          const title = w.title ? narrowest(w.title, { size: SIZE.label, weight: 600 }) + (w.close ? 18 : 0) + own(w.chip, 8) : 0;
          return Math.max(title, ...items) + 2 * pad;
        }
        case "list":
          return Math.max(
            0,
            ...w.rows.map((r) => {
              const lead = (w.steps ? 34 : 8) + (r.indent ?? 0) * INDENT + (w.handle ? 14 : 0);
              const trail = 6 + own(r.chip, 8) + (r.mark ? 18 : 0) + (r.marker ? 26 : 0) + (r.button ? rowButtonW(r.button) + 8 : 0);
              const setting = { size: r.head ? SIZE.label : SIZE.body, weight: (r.selected || r.strong) && !r.head ? 600 : 400 };
              const shares = w.columns ?? [];
              const total = shares.reduce((a, b) => a + b, 0);
              const label = w.columns ? Math.max(0, ...r.text.split(/\s*\|\s*/).map((c, j) => (measure(plain(c.trim()), setting.size, "sans", runsOf(c).some(isBold) ? 600 : setting.weight) + 8) * total / (shares[j] ?? 1))) : narrowest(plain(r.text), { ...setting, weight: runsOf(r.text).some(isBold) ? 600 : setting.weight });
              return lead + trail + (r.right ? Math.max(measure(r.right, SIZE.label) + 10 + label, measure(r.right, SIZE.label) + 24) : label);
            })
          );
        case "row": {
          const flexible = w.items.filter((wd) => wd.weight || wd.w === "text" || !rowWidth(wd));
          const fixed = w.items.filter((wd) => !flexible.includes(wd)).reduce((sum2, wd) => sum2 + rowWidth(wd), 0);
          const leasts = flexible.reduce((sum2, wd) => sum2 + Math.max(24, leastWidth(wd, ctx)), 0);
          const marks = w.items.filter((wd) => "marker" in wd && wd.marker).length * 28;
          return fixed + leasts + marks + (w.items.length - 1) * ROW_GAP + (w.bar ? 2 * BAR_PAD[0] : 0);
        }
        default:
          return naturalWidth(w);
      }
    };
    ROW_GAP = 8;
    BAR_PAD = [4, 3];
    BLOCKS = /* @__PURE__ */ new Set(["list", "frame", "image", "tree"]);
    isBlock = (wd) => BLOCKS.has(wd.w) || wd.w === "code" && Boolean(wd.lines?.length);
    row = (items, x, y, width2, ctx, what) => {
      const bare = items.map((wd) => "marker" in wd && wd.marker ? { ...wd, marker: void 0 } : wd);
      const marks = items.map((wd) => "marker" in wd && wd.marker ? 28 : 0);
      const sum2 = (ws) => ws.reduce((total, ww, i) => total + ww + (marks[i] ?? 0), 0) + (items.length - 1) * ROW_GAP;
      const widths = bare.map((wd) => wd.weight ? 0 : rowWidth(wd));
      const texts = bare.map((wd, i) => i).filter((i) => bare[i]?.w === "text").sort((a, b) => (widths[b] ?? 0) - (widths[a] ?? 0));
      for (const i of texts) {
        const flexible2 = widths.filter((ww) => ww === 0).length;
        if (sum2(widths) + 24 * flexible2 <= width2) break;
        widths[i] = 0;
      }
      const used = sum2(widths);
      const weights = bare.map((wd, i) => widths[i] === 0 ? wd.weight ?? 1 : 0);
      const flexible = weights.filter(Boolean).length;
      const leasts = bare.map((wd, i) => weights[i] ? Math.max(24, leastWidth(wd, ctx)) : 0);
      const held2 = /* @__PURE__ */ new Set();
      let share = 0;
      for (; ; ) {
        const open = weights.map((k, i) => k && !held2.has(i) ? i : -1).filter((i) => i >= 0);
        const total = open.reduce((a, i) => a + (weights[i] ?? 0), 0);
        share = total ? (width2 - used - [...held2].reduce((a, i) => a + (leasts[i] ?? 0), 0)) / total : 0;
        const short = open.filter((i) => share * (weights[i] ?? 0) < (leasts[i] ?? 0) - 0.5);
        if (!short.length || short.length === open.length) break;
        for (const i of short) held2.add(i);
      }
      const sized = widths.map((ww, i) => ww || (held2.has(i) ? leasts[i] ?? 0 : share * (weights[i] ?? 1)));
      const least = Math.min(Infinity, ...sized.filter((ww, i) => weights[i]));
      if (flexible && least < 23.5) ctx.fail(`${what}: the controls of a row need ${Math.ceil(used + 24 * flexible)} of width, and the row has ${Math.floor(width2)}`);
      if (used > width2 + 0.5) ctx.fail(`${what}: the controls of a row are ${Math.ceil(used)} wide, and the row is ${Math.floor(width2)}`);
      const free = flexible ? 0 : width2 - used;
      const heights = bare.map((wd, i) => widget(wd, 0, 0, sized[i] ?? 0, ctx, what).height);
      const height = Math.max(0, ...heights);
      if (bare.filter((wd) => wd.w === "frame").length > 1) {
        bare.forEach((wd, i) => {
          if (wd.w === "frame") bare[i] = { ...wd, least: height };
        });
      }
      const out = [];
      const beside = bare.some(isBlock);
      let cx = x;
      let pushed = false;
      bare.forEach((wd, i) => {
        if (wd.push && !pushed) {
          cx += free;
          pushed = true;
        }
        const ww = sized[i] ?? 0;
        const h = heights[i] ?? 0;
        const block = isBlock(wd) || wd.w === "text" && beside;
        out.push(widget(wd, cx, block ? y : y + (height - h) / 2, ww, ctx, what).svg);
        cx += ww;
        const m = items[i];
        if (m && "marker" in m && m.marker) {
          out.push(marker(cx + 14, y + height / 2, m.marker));
          cx += 28;
        }
        cx += ROW_GAP;
      });
      return { svg: out.join(""), width: width2, height };
    };
    stack = (items, x, y, width2, ctx, what, gap = 10) => {
      const out = [];
      const over = [];
      let cy = y;
      let bottom = y;
      for (const wd of items) {
        if (wd.w === "frame" && wd.over) {
          const fw = width2 * Math.min(1, wd.width ?? 0.7);
          const placed3 = widget({ ...wd, width: void 0 }, x + width2 - fw, cy, fw, ctx, `${what}, a frame`);
          over.push(placed3.svg);
          bottom = Math.max(bottom, cy + placed3.height);
          continue;
        }
        const marked = "marker" in wd && wd.marker && !wd.corner ? 18 : 0;
        const ww = naturalWidth(wd) && wd.w !== "text" ? Math.min(naturalWidth(wd), width2) : width2 - marked;
        const placed2 = widget(wd, x, cy, ww, ctx, `${what}, a ${wd.w}`);
        out.push(placed2.svg);
        bottom = Math.max(bottom, cy + placed2.height);
        cy += placed2.height + gap;
      }
      return { svg: [...out, ...over].join(""), width: width2, height: items.length ? bottom - y : 0 };
    };
    box = (x, y, w, h, state2, hidden, ring) => {
      const empty = state2 && state2 !== "present";
      return rect(x, y, w, h, {
        fill: empty ? "none" : SUNKEN,
        stroke: typeof ring === "string" ? ring : ring ? INK : state2 === "degraded" ? WARN : empty ? MUTED : STRONG,
        width: ring ? 2 : empty ? 1.5 : 1,
        radius: 4,
        dashed: Boolean(empty)
      }) + (hidden ? hatch(x + 1, y + 1, w - 2, h - 2) : "");
    };
    LIST_ROW = 24;
    rowButtonW = (s) => measure(s, SIZE.label, "sans", 600) + 14;
    STEP_ROW = 30;
    STEP_GAP = 10;
    INDENT = 16;
    widget = (w, x, y, width2, ctx, what) => {
      const placed2 = draw(w, x, y, width2, ctx, what);
      if (w.id) ctx.places.set(w.id, { x, y, width: w.w === "button" || w.w === "tag" || w.w === "pill" ? placed2.width : width2, height: placed2.height });
      if (!w.pointer) return placed2;
      return { ...placed2, svg: placed2.svg + pointer(x + Math.min(width2, placed2.width) - 30, y + placed2.height / 2 - 2) };
    };
    draw = (w, x, y, width2, ctx, what) => {
      const chip2 = chipOf2(w);
      if (chip2) {
        const cw = chipsW(chip2);
        const base = draw({ ...w, chip: void 0 }, x, y, width2 - cw - 8, ctx, what);
        const top = y + Math.max(0, (Math.min(base.height, 28) - 20) / 2);
        return { svg: base.svg + chipsAt(chip2, x + width2 - cw, top), width: width2, height: Math.max(base.height, 20) };
      }
      const out = [];
      let height = 0;
      const k = (page, slide) => ctx.pick(page, slide);
      const mark = (h) => {
        if ("marker" in w && w.marker) out.push(w.corner ? marker(x + width2 - 4, y + 4, w.marker) : marker(x + width2, y + h / 2, w.marker));
      };
      switch (w.w) {
        case "text": {
          const size = w.large ? 20 : w.code || w.small ? SIZE.label : SIZE.body;
          const face = w.code ? "mono" : "sans";
          const weight = w.strong || w.large ? 600 : 400;
          const whole = plain(w.text);
          const runs = runsOf(w.text);
          const bold = runs.some(isBold);
          const lines5 = wrap(whole, width2, { size, face, weight: bold ? 600 : weight }, what);
          const fill = w.tone === "error" ? ERROR : w.tone === "muted" ? MUTED : w.strong || w.large ? INK : SECONDARY;
          const lead = w.large ? k(26, 24) : w.small ? k(18, 16) : k(19, 17);
          placeLines(whole, lines5).forEach(([l, start], i) => out.push(setLine(l, start, runs, x, y + (w.large ? 20 : 14) + i * lead, size, face, weight, fill)));
          height = lines5.length * lead + k(2, 1);
          break;
        }
        case "label":
        case "hint": {
          const right = w.w === "label" ? w.chip : w.right;
          const rightW = right ? (w.w === "label" ? chipsW(right) : measure(right, SIZE.label)) + 10 : 0;
          const o = k(0, -2);
          const claim = w.w === "hint" && w.emphasis ? ctx.emphasis("place", `hint ${w.text}`) : void 0;
          const setting = { size: SIZE.label, weight: claim ? 600 : 400 };
          const lines5 = w.w === "hint" ? wrap(w.text, width2 - rightW, setting, what) : [fit(w.text, width2 - rightW, setting, what)];
          const lead = k(18, 16);
          lines5.forEach((l, i) => out.push(run(l, x, y + 15 + o + i * lead, SIZE.label, "sans", setting.weight, claim ?? (w.w === "hint" ? MUTED : SECONDARY))));
          if (right && w.w === "label") out.push(chipsAt(right, x + width2 - chipsW(right), y + 1 + o));
          if (right && w.w === "hint") out.push(text(x + width2, y + 15 + o, right, { size: SIZE.label, fill: MUTED, anchor: "end" }));
          height = 22 + 2 * o + (lines5.length - 1) * lead;
          break;
        }
        case "step": {
          const chip3 = w.chip ? chipsW(w.chip) + 10 : 0;
          const o = k(0, -2);
          out.push(run(`\u2193 ${fit(w.text, width2 - chip3 - 16, { size: SIZE.label }, what)}`, x + 4, y + 15 + o, SIZE.label, "sans", 400, SECONDARY));
          if (w.chip) out.push(chipsAt(w.chip, x + width2 - chipsW(w.chip), y + 1 + o));
          height = 22 + 2 * o;
          break;
        }
        case "field": {
          const ring = w.emphasis ? ctx.emphasis("place", `field ${w.text ?? w.placeholder ?? ""}`) : w.focus || w.strong || w.ring;
          const frame3 = (h, tw) => w.bare ? "" : w.dim ? rect(x, y, width2, h, { fill: SUBTLE, radius: 4 }) : w.inplace ? rect(x, y, Math.min(width2, tw + 24), h, { stroke: INK, width: 1.2, radius: 2, dashed: true }) : box(x, y, width2, h, w.state, w.hidden, ring) + (w.ring ? rect(x - 3, y - 3, width2 + 6, h + 6, { stroke: INK, width: 1.5, radius: 6 }) : "");
          const ink = w.text && !w.state && !w.dim ? INK : MUTED;
          if (w.slim) {
            const shown2 = plain(w.text ?? w.placeholder ?? "");
            const tag2 = w.tag ? measure(w.tag, SIZE.label, "sans", 600) + 34 : 0;
            const right = w.right ? measure(w.right, SIZE.label) + 10 : 0;
            const [fs, ff] = w.code ? [SIZE.label, "mono"] : [SIZE.body, "sans"];
            const room = width2 - 24 - (w.cursor ? 4 : 0) - (tag2 ? tag2 + 6 : 0) - right;
            const setting = { size: fs, face: ff, weight: w.dim ? 600 : 400 };
            const fits = (t, max) => measure(t, fs, ff, setting.weight) <= max + 0.5;
            const split = fits(shown2, room) ? [shown2] : byParts(shown2, room, fits) ?? [shown2];
            const one = split.length > 1 ? "" : fit(shown2, room, setting, what);
            for (const l of split) if (split.length > 1) fit(l, room, setting, what);
            const o = k(0, -2);
            const more = (split.length - 1) * k(20, 18);
            out.push(frame3(28 + 2 * o + more, Math.max(...split.map((l) => measure(l, fs, ff))) + (w.cursor ? 4 : 0)));
            if (split.length > 1) split.forEach((l, i) => out.push(text(x + 12, y + 19 + o + i * k(20, 18), l, { ...setting, fill: ink })));
            if (w.tag) {
              out.push(rect(x + width2 - tag2 - 5, y + 5 + o, tag2, 18, { fill: INK, radius: 4 }));
              out.push(run(`${w.tag} \u283F \u22EF`, x + width2 - tag2 + 3, y + 18 + o, SIZE.label, "sans", 600, CANVAS));
            }
            if (one) out.push(setLine(one, 0, runsOf(w.text ?? ""), x + 12, y + 19 + o, fs, ff, w.dim ? 600 : 400, ink));
            if (w.right) out.push(text(x + width2 - 12 - tag2, y + 19 + o, w.right, { size: SIZE.label, fill: MUTED, anchor: "end" }));
            if (w.cursor) {
              const cx = x + 12 + (one ? setWidth(one, 0, runsOf(w.text ?? ""), fs, ff, w.dim ? 600 : 400) + 3 : 0);
              out.push(line(cx, y + 7 + o, cx, y + 21 + o, INK, 1.5));
            }
            if (w.dot) out.push(circle(x + width2 - 10 - tag2, y + 14 + o, 3.5, INK));
            height = 28 + 2 * o + more;
            break;
          }
          const size = w.large ? 20 : w.code ? SIZE.label : SIZE.body;
          const face = w.code ? "mono" : "sans";
          const weight = w.large ? 600 : 400;
          const source = [w.text ?? w.placeholder ?? "", ...w.more ?? []].join("\n");
          const shown = plain(source);
          const runs = runsOf(source);
          const tag = w.tag ? measure(w.tag, SIZE.label, "sans", 600) + 34 : 0;
          const lines5 = shown ? wrap(shown, width2 - 24 - (w.cursor ? 4 : 0), { size, face, weight: runs.some(isBold) ? 600 : weight }, what) : [];
          const [pad, lead, bar] = k([12, 8, 12], [7, 5, 10]);
          const tagged = k(26, 24);
          const top = w.tag ? tagged : pad;
          height = top + lines5.length * (size + lead) + (w.lines ?? 0) * bar + pad;
          out.push(frame3(height, Math.max(0, ...lines5.map((l) => measure(l, size, face, weight))) + (w.cursor ? 4 : 0)));
          if (w.tag) {
            out.push(rect(x + width2 - tag - 6, y + tagged - 20, tag, 18, { fill: INK, radius: 4 }));
            out.push(run(`${w.tag} \u283F \u22EF`, x + width2 - tag + 2, y + tagged - 7, SIZE.label, "sans", 600, CANVAS));
          }
          let ty = y + top;
          placeLines(shown, lines5).forEach(([l, start], i) => {
            out.push(setLine(l, start, runs, x + 12, ty + size, size, face, weight, ink));
            if (w.cursor && i === lines5.length - 1) {
              const cx = x + 12 + setWidth(l, start, runs, size, face, weight) + 3;
              out.push(line(cx, ty + 4, cx, ty + size + 4, INK, 1.5));
            }
            ty += size + lead;
          });
          if (!lines5.length && w.cursor) out.push(line(x + 12, y + pad - 2, x + 12, y + height - pad + 2, INK, 1.5));
          if (w.dot) out.push(circle(x + width2 - 10, w.tag ? y + height - 10 : y + 10, 3.5, INK));
          for (let i = 0; i < (w.lines ?? 0); i++) out.push(rect(x + 12, ty + 4 + i * bar, (width2 - 24) * (i % 2 ? 0.45 : 0.68), BAR2, { fill: STRONG, radius: 2 }));
          break;
        }
        case "button": {
          const bw = Math.min(width2, naturalWidth(w));
          const weight = w.strong || w.ink ? 600 : 400;
          const [bh, size, inset] = w.small ? [k(22, 20), SIZE.label, 8] : [k(28, 24), SIZE.body, 12];
          const claim = w.emphasis ? ctx.emphasis("place", `button ${w.text}`) : void 0;
          if (w.square) {
            out.push(rect(x, y, 44, 44, { fill: w.ink ? INK : RAISED, stroke: claim ?? INK, width: 2, radius: 4 }));
            const big = [...w.text].length <= 2 ? 20 : size;
            out.push(text(x + 22, y + 22 + big / 2 - 2, fit(w.text, 40, { size: big, weight: 600 }, what), { size: big, weight: 600, fill: w.ink ? CANVAS : claim ?? INK, anchor: "middle" }));
            if (w.marker) out.push(marker(x + 58, y + 22, w.marker));
            return { svg: out.join(""), width: 44 + (w.marker ? 28 : 0), height: 44 };
          }
          if (w.round) {
            out.push(circle(x + bh / 2, y + bh / 2, bh / 2 - 1, w.ink ? INK : RAISED, claim ?? INK));
            out.push(text(x + bh / 2, y + bh / 2 + size / 2 - 2, fit(w.text, bh, { size, weight }, what), { size, weight, fill: w.ink ? CANVAS : claim ?? INK, anchor: "middle" }));
            if (w.marker) out.push(marker(x + bh + 14, y + bh / 2, w.marker));
            return { svg: out.join(""), width: bh + (w.marker ? 28 : 0), height: bh };
          }
          out.push(rect(x, y, bw, bh, { fill: w.ink ? INK : RAISED, stroke: claim ?? (w.strong || w.ink ? INK : STRONG), width: w.strong || claim ? 2 : 1, radius: 4 }));
          out.push(run(fit(w.text, bw - 2 * inset, { size, weight }, what), x + inset, y + bh / 2 + size / 2 - 2 + (w.small ? 0.5 : 0), size, "sans", weight, w.ink ? CANVAS : claim ?? INK));
          height = bh;
          if (w.marker) out.push(marker(x + bw + 14, y + bh / 2, w.marker));
          return { svg: out.join(""), width: bw + (w.marker ? 28 : 0), height };
        }
        case "tabs": {
          if (w.switch) {
            const sw = width2 / w.items.length;
            const sh = k(28, 24);
            out.push(rect(x, y, width2, sh, { fill: RAISED, stroke: STRONG, radius: 4 }));
            w.items.forEach((t, i) => {
              const on = i === (w.active ?? 0);
              if (on) out.push(rect(x + i * sw + 2, y + 2, sw - 4, sh - 4, { fill: SUNKEN, stroke: INK, width: 1.5, radius: 3 }));
              const size = w.small ? SIZE.label : SIZE.body;
              const shown = fit(t, sw - (w.small ? 8 : 16), { size, weight: 600 }, `${what}, a switch`);
              out.push(text(x + i * sw + sw / 2, y + sh / 2 + (w.small ? 4.5 : 5), shown, { size, weight: on ? 600 : 400, fill: on ? INK : SECONDARY, anchor: "middle" }));
            });
            height = sh;
            break;
          }
          const need = tabsW(w.items) - 16;
          if (need > width2 + 0.5) ctx.fail(`${what}: the tabs "${w.items.join(", ")}" are ${Math.ceil(need)} wide, and their room is ${Math.floor(width2)}`);
          let tx = x;
          w.items.forEach((t, i) => {
            const tw = measure(t, SIZE.body, "sans", 600);
            const active = i === (w.active ?? 0);
            out.push(run(t, tx, y + k(17, 15), SIZE.body, "sans", active ? 600 : 400, active ? INK : MUTED));
            if (active) out.push(line(tx, y + k(25, 21), tx + tw, y + k(25, 21), INK, 2));
            tx += tw + 16;
          });
          height = k(28, 24);
          if (w.marker) out.push(marker(tx + 4, y + 12, w.marker));
          return { svg: out.join(""), width: tx - x + (w.marker ? 24 : 0), height };
        }
        case "chip":
          if (w.label) {
            const need = itemW(w.text, w.label);
            if (need > width2 + 0.5) ctx.fail(`${what}: the item ${w.text} is ${Math.ceil(need)} wide, and its room is ${Math.floor(width2)}`);
            const stroke = w.emphasis ? ctx.emphasis("place", `item ${w.text}`) : w.strong ? INK : STRONG;
            const filled = w.emphasis && w.fill;
            const ch = k(28, 24);
            const o = (ch - 28) / 2;
            out.push(rect(x, y, width2, ch, { fill: filled ? stroke : RAISED, stroke, width: w.emphasis || w.strong ? 2 : 1, radius: 4 }));
            out.push(run(w.text, x + 10, y + 18.5 + o, SIZE.label, "mono", 600, filled ? CANVAS : SECONDARY));
            out.push(run(w.label, x + 18 + measure(w.text, SIZE.label, "mono", 600), y + 19 + o, SIZE.body, "sans", 600, filled ? CANVAS : INK));
            if (w.marker) out.push(marker(x + width2 + 14, y + ch / 2, w.marker));
            return { svg: out.join(""), width: width2 + (w.marker ? 28 : 0), height: ch };
          }
          out.push(chipsAt(w.text, x, y));
          if (w.marker) out.push(marker(x + chipsW(w.text) + 14, y + 10, w.marker));
          return { svg: out.join(""), width: chipsW(w.text) + (w.marker ? 28 : 0), height: 20 };
        case "dots": {
          if (w.value > w.of) ctx.fail(`${what}: ${w.value} of ${w.of} dots is more than the whole`);
          if (dotsW(w.of) > width2 + 0.5) ctx.fail(`${what}: ${w.of} dots are ${dotsW(w.of)} wide, and their room is ${Math.floor(width2)}`);
          let top = y;
          if (w.text) {
            const count = `${w.value} of ${w.of}`;
            const cw = measure(count, SIZE.body);
            out.push(run(fit(w.text, width2 - cw - 12, { size: SIZE.node, weight: 600 }, what), x, y + 16, SIZE.node, "sans", 600, INK));
            out.push(text(x + width2, y + 16, count, { size: SIZE.body, fill: SECONDARY, anchor: "end" }));
            top += k(28, 22);
          }
          const step = w.text && w.of > 1 ? Math.min(26, Math.max(DOT, (width2 - 10) / (w.of - 1))) : DOT;
          for (let i = 0; i < w.of; i++) {
            const cx = x + 5 + i * step;
            out.push(i < w.value ? circle(cx, top + 7, 5, INK) : circle(cx, top + 7, 4.5, "none", MUTED));
          }
          height = top + 14 - y + (w.text ? k(10, 4) : 0);
          mark(height);
          break;
        }
        case "code": {
          if (w.lines?.length) {
            const [lead, edge] = k([19, 8], [17, 5]);
            height = (w.text ? w.lines.length + 1 : w.lines.length) * lead + 2 * edge;
            out.push(rect(x, y, width2, height, { fill: SUNKEN, stroke: w.strong ? INK : SUBTLE, width: w.strong ? 2 : 1, radius: 4 }));
            [...w.text ? [w.text] : [], ...w.lines].forEach((marked, i) => {
              const bold = /^\s*\*\*.*\*\*$/.test(marked);
              const l = bold ? marked.replace(/\*\*(.*)\*\*$/, "$1") : marked;
              fit(l.trim(), width2 - 24 - measure(l.slice(0, l.length - l.trimStart().length), SIZE.label, "mono"), { size: SIZE.label, face: "mono", weight: bold ? 600 : 400 }, what);
              for (const m of l.matchAll(/\S+(?: \S+)*/g)) {
                out.push(run(m[0], x + 12 + measure(l.slice(0, m.index), SIZE.label, "mono"), y + edge + 14 + i * lead, SIZE.label, "mono", bold ? 600 : 400, INK));
              }
            });
            break;
          }
          height = k(30, 24);
          out.push(rect(x, y, width2, height, { fill: RAISED, stroke: w.strong ? INK : STRONG, width: w.strong ? 2 : 1, radius: 4 }));
          out.push(run(fit(w.text ?? "", width2 - 24, { size: SIZE.label, face: "mono" }, what), x + 12, y + height / 2 + 5, SIZE.label, "mono", 400, INK));
          break;
        }
        case "page": {
          const [top, th] = k([18, 30], [10, 26]);
          height = k(80, 60);
          out.push(rect(x, y, width2, height, { fill: SUNKEN, radius: 4 }));
          const tw = measure(w.text, SIZE.node, "sans", 600) + 20;
          if (tw > width2 - 24) ctx.fail(`${what}: "${w.text}" is wider than its page`);
          out.push(rect(x + 12, y + top, tw, th, { fill: RAISED, radius: 2 }));
          out.push(run(w.text, x + 22, y + top + th / 2 + 6, SIZE.node, "sans", 600, INK));
          out.push(line(x, y + height - 26, x + width2, y + height - 32, STRONG, 1.5));
          if (w.dot) out.push(circle(x + width2 - 16, y + 14, 6, RAISED));
          break;
        }
        case "lock": {
          height = k(44, 34);
          const o = (height - 44) / 2;
          out.push(rect(x, y, width2, height, { fill: SUNKEN, stroke: w.strong ? INK : SUBTLE, width: w.strong ? 2 : 1, radius: 4 }));
          out.push(rect(x + 14, y + 20 + o, 12, 10, { fill: INK, radius: 2 }));
          out.push(`<path d="M${fmt(x + 16)} ${fmt(y + 20 + o)} v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="${INK}" stroke-width="1.5"></path>`);
          out.push(run(fit(w.text, width2 - 48, { size: SIZE.label }, what), x + 36, y + 27 + o, SIZE.label, "sans", 400, SECONDARY));
          break;
        }
        case "image": {
          height = k(72, 52);
          const iw = w.lines === 0 ? width2 : Math.min(width2 * 0.45, 150);
          out.push(rect(x, y, iw, height, { fill: SUNKEN, radius: 2 }));
          if (w.text) out.push(text(x + iw / 2, y + height / 2 + 4.5, fit(w.text, iw - 12, { size: SIZE.label }, what), { size: SIZE.label, fill: MUTED, anchor: "middle" }));
          for (let i = 0; i < (w.lines ?? 2); i++) out.push(rect(x + iw + 12, y + k(10, 8) + i * k(12, 10), (width2 - iw - 12) * (i % 2 ? 0.7 : 1), BAR2, { fill: STRONG, radius: 2 }));
          if (w.corner && w.marker) return { svg: out.join("") + marker(x + iw - 4, y + 4, w.marker), width: width2, height };
          break;
        }
        case "tree": {
          const n = w.lines ?? 5;
          const pitch = k(20, 16);
          for (let i = 0; i < n; i++) {
            const indent = i % 3 === 0 ? 0 : 14;
            out.push(rect(x + indent, y + i * pitch + pitch / 2 - 6, 8, 8, { fill: MUTED, radius: 2 }));
            out.push(rect(x + indent + 14, y + i * pitch + pitch / 2 - 5, Math.max(20, width2 * 0.55 - indent), BAR2, { fill: STRONG, radius: 2 }));
          }
          height = n * pitch;
          break;
        }
        case "tools": {
          const n = w.count ?? 3;
          const tw = n * 22 + 10;
          out.push(rect(x, y, tw, 24, { fill: RAISED, stroke: INK, radius: 4 }));
          for (let i = 0; i < n; i++) out.push(rect(x + 8 + i * 22, y + 7, 14, 10, { fill: MUTED, radius: 2 }));
          if (w.marker) out.push(marker(x + tw + 14, y + 12, w.marker));
          return { svg: out.join(""), width: tw + (w.marker ? 28 : 0), height: 24 };
        }
        case "lines": {
          const n = w.lines ?? 2;
          const pitch = k(12, 10);
          for (let i = 0; i < n; i++) out.push(rect(x, y + 4 + i * pitch, width2 * (i % 2 ? 0.6 : 0.85), BAR2, { fill: STRONG, radius: 2 }));
          height = n * pitch + 2;
          break;
        }
        case "devices": {
          height = k(32, 28);
          const o = (height - 32) / 2;
          out.push(rect(x, y, width2, height, { fill: RAISED, stroke: STRONG, radius: 4 }));
          const kinds = ["phone", "tablet", "desktop"];
          let dx = x + 12;
          for (const k2 of kinds) {
            const [gw, gh] = k2 === "phone" ? [8, 14] : k2 === "tablet" ? [12, 16] : [22, 14];
            const on = k2 === (w.active ?? "desktop");
            if (on) out.push(rect(dx - 5, y + 4 + o, gw + 10, 24, { stroke: INK, width: 1.5, radius: 4 }));
            out.push(rect(dx, y + 16 + o - gh / 2, gw, gh, { stroke: INK, width: 1.2, radius: 2 }));
            dx += gw + 18;
          }
          const chip3 = w.chip ? chipsW(w.chip) + 10 : 0;
          out.push(run(fit(w.text, x + width2 - dx - chip3 - 8, { size: SIZE.label, weight: 600 }, what), dx + 2, y + 21 + o, SIZE.label, "sans", 600, INK));
          if (w.chip) out.push(chipsAt(w.chip, x + width2 - chipsW(w.chip) - 8, y + 6 + o));
          break;
        }
        case "site": {
          const share = Math.min(1, w.width ?? 1);
          const sw = width2 * share;
          const sx = x + (width2 - sw) / 2;
          const narrow = share < 1;
          const cards = w.cards ?? 3;
          const top = narrow ? 8 : 0;
          const inner = sw - 24;
          const heading = w.heading ? fit(w.heading, inner - (w.selected ? 16 : 0), { size: SIZE.node, weight: 600 }, what) : "";
          const grid2 = narrow ? 1 : cards;
          const cardH = narrow ? 26 : 30;
          const rows = narrow ? Math.min(cards, 2) : 1;
          const body = 28 + 12 + 52 + (heading ? 40 : 0) + rows * (cardH + 8) + (narrow ? 0 : 22) + 8;
          height = body + 2 * top;
          if (narrow) out.push(rect(x, y, width2, height, { fill: SUNKEN, radius: 4 }));
          out.push(rect(sx, y + top, sw, body, { fill: RAISED, stroke: INK, width: 1.5, radius: narrow ? 6 : 4 }));
          out.push(rect(sx + 1, y + top + 1, sw - 2, 24, { fill: SUNKEN }));
          out.push(run(fit(w.name, narrow ? inner - 20 : inner * 0.55, { size: SIZE.label, weight: 600 }, what), sx + 10, y + top + 17, SIZE.label, "sans", 600, SECONDARY));
          const nav = narrow ? "\u2630" : w.nav ?? "";
          if (nav) out.push(text(sx + sw - 10, y + top + 17, fit(nav, inner * 0.45, { size: SIZE.label }, what), { size: SIZE.label, fill: MUTED, anchor: "end" }));
          let cy = y + top + 36;
          out.push(rect(sx + 12, cy, inner, 46, { fill: SUNKEN, radius: 2 }));
          cy += 56;
          if (heading) {
            if (w.selected) out.push(rect(sx + 8, cy, Math.min(inner + 8, measure(heading, SIZE.node, "sans", 600) + 24), 30, { stroke: INK, width: 1.5, radius: 2 }));
            out.push(run(heading, sx + (w.selected ? 16 : 12), cy + 21, SIZE.node, "sans", 600, INK));
            if (w.cursor) {
              const cx = sx + (w.selected ? 16 : 12) + measureSet(heading, SIZE.node, "sans", 600) - 8;
              out.push(line(cx, cy + 6, cx, cy + 25, INK, 1.5));
            }
            cy += 40;
          }
          const cw = (inner - (grid2 - 1) * 8) / grid2;
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < grid2; c++) {
              out.push(rect(sx + 12 + c * (cw + 8), cy, cw, cardH, { fill: SUNKEN, radius: 2 }));
              if (!narrow) out.push(rect(sx + 12 + c * (cw + 8), cy + cardH + 8, cw, 4, { fill: SUBTLE, radius: 2 }) + rect(sx + 12 + c * (cw + 8), cy + cardH + 16, cw * 0.6, 4, { fill: SUBTLE, radius: 2 }));
            }
            cy += cardH + 8;
          }
          break;
        }
        case "pill":
        case "tag": {
          const pw = w.w === "pill" ? pillW(w.text) : tagW(w.text);
          if (pw > width2 + 0.5) ctx.fail(`${what}: the ${w.w} "${w.text}" is ${Math.ceil(pw)} wide, and its room is ${Math.floor(width2)}`);
          const filled = w.w === "tag" || w.ink;
          out.push(rect(x, y, pw, 20, { fill: filled ? INK : RAISED, stroke: filled ? void 0 : INK, width: 1.2, radius: w.w === "pill" ? 6 : 4 }));
          out.push(text(x + pw / 2, y + 14.5, w.text, { size: SIZE.label, weight: 600, fill: filled ? CANVAS : INK, anchor: "middle" }));
          if (w.marker) out.push(marker(x + pw + 14, y + 10, w.marker));
          return { svg: out.join(""), width: pw + (w.marker ? 28 : 0), height: 20 };
        }
        case "arrow": {
          const say = w.text ? fit(w.text, width2 - (w.push ? 40 : 28), { size: SIZE.label }, what) : "";
          const ax = w.push ? x + width2 - 12 : say ? x + 12 : x + width2 / 2;
          height = k(28, 22);
          out.push(connector([[ax, y + 2], [ax, y + height - 2]]));
          if (say) out.push(text(w.push ? ax - 14 : ax + 14, y + height / 2 + 5, say, { size: SIZE.label, fill: MUTED, anchor: w.push ? "end" : "start" }));
          break;
        }
        case "progress": {
          const share = Math.max(0, Math.min(1, w.value));
          out.push(rect(x, y + 2, width2, 4, { fill: SUBTLE, radius: 2 }));
          out.push(rect(x, y + 2, width2 * share, 4, { fill: INK, radius: 2 }));
          height = 8;
          break;
        }
        case "keycap": {
          const kw = keycapW(w.text);
          out.push(rect(x, y, kw, 22, { fill: RAISED, stroke: INK, width: 1.2, radius: 3 }));
          out.push(text(x + kw / 2, y + 15.5, w.text, { size: SIZE.label, face: "mono", weight: 600, anchor: "middle" }));
          height = 22;
          if (w.marker) out.push(marker(x + kw + 14, y + 11, w.marker));
          return { svg: out.join(""), width: kw + (w.marker ? 28 : 0), height };
        }
        case "toolbar": {
          const tw = toolbarW(w.items);
          if (tw > width2 + 0.5) ctx.fail(`${what}: the toolbar "${w.items.join(" ")}" is ${Math.ceil(tw)} wide, and its room is ${Math.floor(width2)}`);
          const bh = k(28, 24);
          const o = (bh - 28) / 2;
          out.push(rect(x, y, tw, bh, { fill: w.ink ? INK : RAISED, stroke: w.strong || w.ink ? INK : STRONG, width: w.strong ? 2 : 1, radius: 4 }));
          let tx = x + 4;
          let n = 0;
          for (const t of w.items) {
            if (t === "|") {
              out.push(line(tx + 3, y + 7 + o, tx + 3, y + 21 + o, w.ink ? MUTED : STRONG));
            } else {
              const on = (w.active ?? []).includes(n++);
              if (on) out.push(rect(tx, y + 3 + o / 2, toolW(t), bh - 6 - o, w.ink ? { fill: CANVAS, radius: 3 } : { fill: SUNKEN, stroke: INK, width: 1.2, radius: 3 }));
              out.push(text(tx + 5, y + 18.5 + o, t, { size: SIZE.label, weight: on || w.ink ? 600 : 400, fill: w.ink && !on ? CANVAS : INK }));
            }
            tx += toolW(t) + 2;
          }
          height = bh;
          if (w.marker) out.push(marker(x + tw + 14, y + bh / 2, w.marker));
          return { svg: out.join(""), width: tw + (w.marker ? 28 : 0), height };
        }
        case "row": {
          if (!w.bar) return row(w.items, x, y, width2, ctx, what);
          const [px, py] = BAR_PAD;
          const last = w.items.at(-1);
          const id = last?.w === "chip" && last.push && w.items.length > 1 ? last : void 0;
          const idW = id ? chipsW(id.text) + px : 0;
          const inner = row(id ? w.items.slice(0, -1) : w.items, x + px, y + py, width2 - 2 * px - idW, ctx, what);
          const h = inner.height + 2 * py;
          const tagH = id ? widget(id, 0, 0, idW - px, ctx, what).height : 0;
          const placed2 = id ? widget(id, x + width2 - idW + px, y + (h - tagH) / 2, idW - px, ctx, what).svg : "";
          return { svg: rect(x, y, width2 - idW, h, { fill: RAISED, stroke: STRONG, radius: 4 }) + inner.svg + placed2, width: width2, height: h };
        }
        case "frame": {
          if (w.width !== void 0 && w.width < 1 && !w.over) {
            const fw = width2 * Math.max(0.2, w.width);
            const inner = draw({ ...w, width: void 0 }, x + (width2 - fw) / 2, y, fw, ctx, what);
            return { svg: inner.svg, width: width2, height: inner.height };
          }
          if (w.bare) {
            const body2 = stack(w.items, x, y, width2, ctx, `${what}, a stack`, k(8, 5));
            return { svg: body2.svg, width: width2, height: body2.height };
          }
          const pad = w.device ? k(12, 10) : k(10, 8);
          const grip = w.sheet || w.device ? k(10, 8) : 0;
          const [edge, lead] = k([12 + grip, 18], [8 + grip, 17]);
          const tone = w.tone ? TONE[w.tone] : void 0;
          const close = w.close ? 18 : 0;
          const chips3 = w.chip ? chipsW(w.chip) + 8 : 0;
          const title = w.title ? wrap(w.title, width2 - 2 * pad - close - chips3, { size: SIZE.label, weight: 600 }, `${what}, the frame's title`) : [];
          const head = w.title || w.close || w.chip ? edge + Math.max(1, title.length) * lead : 0;
          const top = head ? head + k(6, 4) : pad + grip;
          const body = stack(w.items, x + pad, y + top, width2 - 2 * pad, ctx, `${what}, the frame ${w.title ?? ""}`.trim(), k(8, 5));
          height = Math.max(w.least ?? 0, w.items.length ? top + body.height + pad : head);
          const state2 = w.state && w.state !== "present" ? w.state : void 0;
          out.push(
            rect(x, y, width2, height, {
              fill: w.ink ? INK : state2 ? "none" : w.tone ? QUIET[w.tone] : w.fill ? INSET : RAISED,
              stroke: w.ink || w.device ? INK : tone ?? (w.strong ? INK : state2 === "degraded" ? WARN : state2 ? MUTED : STRONG),
              width: w.strong || w.device ? 2 : tone || state2 ? 1.5 : 1,
              radius: w.device ? 6 : 4,
              dashed: Boolean(state2)
            })
          );
          if (w.hidden) out.push(hatch(x + 1, y + 1, width2 - 2, height - 2));
          if (grip) out.push(rect(x + width2 / 2 - (w.device ? 12 : 16), y + grip / 2, w.device ? 24 : 32, 4, { fill: w.device ? STRONG : MUTED, radius: 2 }));
          if (w.dot) out.push(circle(x + width2 - pad, y + (head ? edge + 3 : pad), 3.5, INK));
          if (head && (w.strong || w.close || w.chip) && !w.tone && !w.ink && w.items.length) out.push(line(x + 1, y + head, x + width2 - 1, y + head, SUBTLE));
          title.forEach((l, i) => out.push(text(x + pad, y + edge + 8 + i * lead, l, { size: SIZE.label, weight: 600, fill: w.ink ? CANVAS : INK })));
          if (w.chip) out.push(chipsAt(w.chip, x + width2 - pad - close - chips3 + 8, y + edge - 7));
          if (w.close) out.push(text(x + width2 - pad, y + edge + 8, "\u2715", { size: SIZE.label, fill: MUTED, anchor: "end" }));
          out.push(w.ink ? [INK, SECONDARY, MUTED].reduce((svg2, c) => svg2.split(`fill="${c}"`).join(`fill="${CANVAS}"`), body.svg) : body.svg);
          break;
        }
        case "list": {
          const listRow2 = k(LIST_ROW, 20);
          const rowH = w.steps ? k(STEP_ROW, 26) : listRow2;
          const gap = w.steps ? k(STEP_GAP, 9) : w.rendered ? k(6, 4) : k(2, 1);
          const lead = k(17, 16);
          const extra = w.rendered ? k(12, 10) : 0;
          const laid = w.rows.map((r) => {
            const lx = (w.steps ? 34 : 8) + (r.indent ?? 0) * INDENT + (w.handle ? 14 : 0);
            let rx = width2 - 6 - (r.chip ? chipsW(r.chip) + 8 : 0) - (r.mark ? 18 : 0) - (r.marker ? 26 : 0) - (r.button ? rowButtonW(r.button) + 8 : 0);
            const right = r.right ? fit(r.right, rx - lx - 24, { size: SIZE.label }, `${what}, the row ${r.text}`) : "";
            if (right) rx -= measure(right, SIZE.label) + 10;
            const weight = (r.selected || r.strong) && !r.head ? 600 : 400;
            const size = r.head ? SIZE.label : SIZE.body;
            const lines5 = w.columns ? [r.text] : wrap(plain(r.text), rx - lx, { size, weight: runsOf(r.text).some(isBold) ? 600 : weight }, `${what}, the row ${r.text}`);
            return { lx, rx, right, weight, size, lines: lines5, h: rowH + extra + (lines5.length - 1) * lead };
          });
          const joins = [];
          let ry = y;
          w.rows.forEach((r, i) => {
            const { lines: lines5, h, right, weight, size, rx: textEnd } = laid[i] ?? { lines: [], h: rowH, right: "", weight: 400, size: SIZE.body, rx: width2 };
            const mid = ry + rowH / 2;
            const state2 = r.state;
            if (r.id) ctx.places.set(r.id, { x, y: ry, width: width2, height: h });
            if (w.steps) {
              const ring = r.selected || r.strong;
              out.push(rect(x, ry, width2, h, { fill: RAISED, stroke: r.emphasis ? ctx.emphasis("place", `step ${r.text}`) : ring ? INK : STRONG, width: ring || r.emphasis ? 2 : 1, radius: 4, dashed: Boolean(state2) }));
              if (i < w.rows.length - 1) joins.push(line(x + 18, mid + 9, x + 18, ry + h + gap + rowH / 2 - 9, INK, 1.5));
              out.push(circle(x + 18, mid, 9, INK) + text(x + 18, mid + 4.5, String(i + 1), { size: SIZE.label, weight: 600, fill: CANVAS, anchor: "middle" }));
            } else if (r.boxed && !r.selected && !state2 && !r.emphasis) out.push(rect(x, ry, width2, h, { fill: SUNKEN, radius: 4 }));
            else if (r.emphasis || r.selected || state2 || w.rendered) {
              out.push(
                rect(x, ry, width2, h, {
                  fill: r.selected && !state2 ? INSET : w.rendered && !state2 ? RAISED : "none",
                  stroke: r.emphasis ? ctx.emphasis("place", `row ${r.text}`) : state2 === "degraded" ? WARN : state2 ? MUTED : r.selected ? INK : SUBTLE,
                  width: r.emphasis || r.selected ? 2 : state2 ? 1.5 : 1,
                  radius: 4,
                  dashed: Boolean(state2)
                })
              );
            }
            let lx = x + (w.steps ? 34 : 8) + (r.indent ?? 0) * INDENT;
            if (w.handle) {
              out.push(text(lx, mid + 5, "\u283F", { size: SIZE.label, fill: MUTED }));
              lx += 14;
            }
            if (w.rendered) out.push(rect(lx, mid + rowH / 2 + 1 + (lines5.length - 1) * lead, (x + textEnd - lx) * 0.8, 4, { fill: state2 ? SUBTLE : STRONG, radius: 2 }));
            let rx = x + width2 - 6;
            if (r.marker) {
              out.push(marker(rx - 11, mid, r.marker));
              rx -= 30;
            }
            if (r.chip) {
              rx -= chipsW(r.chip);
              out.push(chipsAt(r.chip, rx, ry + (rowH - 20) / 2));
              rx -= 8;
            }
            if (r.mark) {
              out.push(rect(rx - 10, mid - 5, 10, 10, { fill: TONE[r.mark], radius: 2 }));
              rx -= 18;
            }
            if (r.button) {
              const bw = rowButtonW(r.button);
              out.push(rect(rx - bw, mid - 9, bw, 18, { fill: RAISED, stroke: INK, width: 1.5, radius: 4 }) + text(rx - bw / 2, mid + 4.5, r.button, { size: SIZE.label, weight: 600, anchor: "middle" }));
              rx -= bw + 8;
            }
            if (right) out.push(text(rx, mid + 5, right, { size: SIZE.label, fill: MUTED, anchor: "end" }));
            const fill = r.head || r.muted || state2 ? MUTED : INK;
            if (w.columns) {
              const cells3 = r.text.split(/\s*\|\s*/);
              const shares = w.columns;
              const total = shares.reduce((a, b) => a + b, 0);
              const room = x + textEnd - lx;
              if (cells3.length !== shares.length) ctx.fail(`${what}: the row "${r.text}" has ${cells3.length} cells, and the list has ${shares.length} columns`);
              let cx = lx;
              cells3.forEach((c, j) => {
                const cw = room * (shares[j] ?? 1) / total;
                const shown = fit(plain(c.trim()), cw - 8, { size, weight: runsOf(c).some(isBold) ? 600 : weight }, `${what}, the row ${r.text}`);
                if (shown) out.push(setLine(shown, 0, runsOf(c.trim()), cx, mid + 5, size, "sans", weight, fill));
                cx += cw;
              });
            } else {
              const runs = runsOf(r.text);
              placeLines(plain(r.text), lines5).forEach(([l, start], j) => out.push(setLine(l, start, runs, lx, mid + 5 + j * lead, size, "sans", weight, fill)));
            }
            ry += h + gap;
          });
          out.push(...joins);
          height = ry - gap - y;
          break;
        }
        case "thumb": {
          const ph = k(40, 34);
          const label = w.text ? fit(w.text, width2, { size: SIZE.label, weight: w.selected ? 600 : 400 }, what) : "";
          const empty = w.state && w.state !== "present";
          if (w.show !== "person") out.push(rect(x, y, width2, ph, { fill: empty ? "none" : w.split || w.show === "page" || w.show === "lines" ? RAISED : SUNKEN, stroke: w.selected ? INK : empty ? MUTED : STRONG, width: w.selected ? 2 : empty ? 1.5 : 1, radius: 4, dashed: Boolean(empty) }));
          const [ix, iy, iw, ih] = [x + 6, y + 6, width2 - 12, ph - 12];
          if (w.split) {
            const total = w.split.reduce((a, b) => a + b, 0);
            let sx = ix;
            for (const part of w.split) {
              const sw = (iw - (w.split.length - 1) * 3) * part / total;
              out.push(rect(sx, iy, sw, ih, { fill: SUNKEN, stroke: INK, width: 1.2, radius: 2 }));
              sx += sw + 3;
            }
          } else if (!empty) {
            const show = w.show ?? "picture";
            if (show === "person") {
              out.push(circle(x + width2 / 2, y + ph / 2, ph / 2 - 2, SUBTLE));
            } else if (show === "picture" || show === "teaser") {
              const pw = show === "teaser" ? iw * 0.4 : iw;
              const [px, py] = show === "teaser" ? [ix, iy] : [x, y];
              const [qw, qh] = show === "teaser" ? [pw, ih] : [width2, ph];
              if (show === "teaser") out.push(rect(px, py, qw, qh, { fill: SUNKEN, radius: 2 }));
              out.push(`<path d="M${fmt(px + 6)} ${fmt(py + qh - 6)} L${fmt(px + qw * 0.35)} ${fmt(py + qh * 0.45)} L${fmt(px + qw * 0.55)} ${fmt(py + qh * 0.7)} L${fmt(px + qw * 0.72)} ${fmt(py + qh * 0.5)} L${fmt(px + qw - 6)} ${fmt(py + qh - 6)}" fill="none" stroke="${MUTED}" stroke-width="1.2"></path>`);
              if (show === "picture") out.push(circle(px + qw - 14, py + 11, 4, RAISED, STRONG));
              if (show === "teaser") {
                out.push(rect(ix + pw + 6, iy + 2, (iw - pw - 6) * 0.8, 5, { fill: INK, radius: 1 }));
                out.push(rect(ix + pw + 6, iy + 11, (iw - pw - 6) * 0.6, 4, { fill: STRONG, radius: 1 }));
                out.push(rect(ix + pw + 6, iy + ih - 7, (iw - pw - 6) * 0.4, 7, { fill: INK, radius: 1 }));
              }
            } else {
              [0.85, 0.6, 0.75].slice(0, show === "page" ? 2 : 3).forEach((share, i) => out.push(rect(ix, iy + i * 7, iw * share, 4, { fill: STRONG, radius: 1 })));
              if (show === "page") out.push(rect(ix + iw * 0.2, iy + ih - 9, iw * 0.6, 9, { stroke: INK, width: 1.2, radius: 2 }));
            }
          }
          const centred = w.split || w.show === "person";
          if (label) out.push(text(centred ? x + width2 / 2 : x, y + ph + 15, label, { size: SIZE.label, weight: w.selected ? 600 : 400, fill: empty ? MUTED : INK, anchor: centred ? "middle" : "start" }));
          height = ph + (label ? 20 : 0);
          break;
        }
        case "crop": {
          height = k(96, 80);
          out.push(rect(x, y, width2, height, { fill: SUNKEN, radius: 4 }));
          const [fx, fy, fw, fh] = [x + width2 * 0.08, y + 10, width2 * 0.7, height - 20];
          out.push(rect(fx, fy, fw, fh, { fill: RAISED, stroke: INK, width: 1.5 }));
          for (const [hx, hy] of [[fx, fy], [fx + fw, fy], [fx, fy + fh], [fx + fw, fy + fh]]) out.push(rect(hx - 3.5, hy - 3.5, 7, 7, { fill: RAISED, stroke: INK, width: 1.2 }));
          out.push(circle(fx + fw * 0.8, fy + fh * 0.3, 8, RAISED, INK));
          break;
        }
        case "map": {
          height = k(80, 64);
          out.push(rect(x, y, width2, height, { fill: SUNKEN, radius: 4 }));
          out.push(`<path d="M${fmt(x + 10)} ${fmt(y + height - 12)} L${fmt(x + width2 * 0.4)} ${fmt(y + 12)}" fill="none" stroke="${STRONG}" stroke-width="1.5"></path>`);
          out.push(`<path d="M${fmt(x + width2 * 0.2)} ${fmt(y + height - 6)} L${fmt(x + width2 - 10)} ${fmt(y + height * 0.55)}" fill="none" stroke="${STRONG}" stroke-width="1.5"></path>`);
          const [px, py] = [x + width2 * 0.5, y + height * 0.4];
          out.push(circle(px, py, 6, INK));
          if (w.text) out.push(text(px + 12, py + 4.5, fit(w.text, x + width2 - px - 18, { size: SIZE.label }, what), { size: SIZE.label, fill: SECONDARY }));
          break;
        }
        case "toggle": {
          const o = k(0, -1);
          out.push(rect(x, y + 3 + o, 28, 14, { fill: w.on ? INK : RAISED, stroke: w.on ? INK : STRONG, radius: 6 }));
          out.push(circle(w.on ? x + 21 : x + 7, y + 10 + o, 4.5, w.on ? CANVAS : STRONG));
          out.push(text(x + 36, y + 14.5 + o, fit(w.text, width2 - 36, { size: SIZE.label }, what), { size: SIZE.label, fill: INK }));
          height = 20 + 2 * o;
          break;
        }
        case "drop": {
          height = w.text ? 22 : k(14, 10);
          const ly = y + height / 2;
          out.push(line(x + 4, ly, x + width2 - 4, ly, INK, 2) + circle(x + 4, ly, 3.5, INK) + circle(x + width2 - 4, ly, 3.5, INK));
          if (w.text) {
            const tw = tagW(w.text);
            out.push(rect(x + 12, y + 1, tw, 20, { fill: INK, radius: 4 }) + text(x + 12 + tw / 2, y + 15.5, fit(w.text, width2 - 24, { size: SIZE.label, weight: 600 }, what), { size: SIZE.label, weight: 600, fill: CANVAS, anchor: "middle" }));
          }
          break;
        }
        case "entry": {
          const empty = w.state && w.state !== "present";
          const tile = k(30, 26);
          const tx = x + 8 + tile + 10;
          const body = w.body ? wrap(plain(w.body), x + width2 - 8 - tx, { size: SIZE.label, weight: /\*\*/.test(w.body) ? 600 : 400 }, what) : [];
          const lead = k(16, 15);
          height = Math.max(tile + 12, k(26, 23) + body.length * lead + k(8, 6));
          out.push(rect(x, y, width2, height, { fill: w.selected ? SUNKEN : empty ? "none" : RAISED, stroke: w.selected ? INK : empty ? MUTED : STRONG, width: w.selected ? 2 : empty ? 1.5 : 1, radius: 4, dashed: Boolean(empty) }));
          out.push(rect(x + 8, y + 6, tile, tile, { fill: SUNKEN, stroke: STRONG, radius: 3 }));
          if (w.sign) out.push(text(x + 8 + tile / 2, y + 6 + tile / 2 + 5.5, glyphChar(w.sign) ?? "", { size: 16, fill: empty ? MUTED : INK, anchor: "middle" }));
          out.push(run(fit(w.text, x + width2 - 8 - tx, { size: SIZE.body, weight: 600 }, what), tx, y + k(19, 17), SIZE.body, "sans", 600, empty ? MUTED : INK));
          const runs = runsOf(w.body ?? "");
          placeLines(plain(w.body ?? ""), body).forEach(([l, start], i) => out.push(setLine(l, start, runs, tx, y + k(19, 17) + (i + 1) * lead, SIZE.label, "sans", 400, empty ? MUTED : SECONDARY)));
          break;
        }
        case "span": {
          const say = fit(w.text, width2, { size: SIZE.label }, what);
          out.push(line(x, y + 6, x + width2, y + 6, MUTED, 1.2) + line(x, y + 1, x, y + 11, MUTED, 1.2) + line(x + width2, y + 1, x + width2, y + 11, MUTED, 1.2));
          out.push(text(x + width2 / 2, y + 26, say, { size: SIZE.label, fill: SECONDARY, anchor: "middle" }));
          height = 30;
          break;
        }
        case "keyboard": {
          const [rows, cols, gap] = [3, 7, 5];
          const kh = k(22, 18);
          const kw = (width2 - (cols - 1) * gap) / cols;
          for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push(rect(x + c * (kw + gap), y + r * (kh + gap), kw, kh, { fill: RAISED, stroke: SUBTLE, radius: 3 }));
          height = rows * kh + (rows - 1) * gap;
          break;
        }
        case "insert": {
          height = k(24, 20);
          const [cx, cy] = [x + width2 / 2, y + height / 2];
          out.push(line(x, cy, cx - 12, cy, MUTED, 1.2, true) + line(cx + 12, cy, x + width2, cy, MUTED, 1.2, true));
          out.push(circle(cx, cy, 8, w.strong ? INK : RAISED, INK));
          out.push(line(cx - 4, cy, cx + 4, cy, w.strong ? CANVAS : INK, 1.6) + line(cx, cy - 4, cx, cy + 4, w.strong ? CANVAS : INK, 1.6));
          break;
        }
        case "rule":
          out.push(line(x, y + k(8, 5), x + width2, y + k(8, 5), SUBTLE));
          return { svg: out.join(""), width: width2, height: k(16, 10) };
      }
      mark(height);
      return { svg: out.join(""), width: width2, height };
    };
  }
});

// packages/frontend/src/lib/diagram/columns.ts
var MARK, METRICS, CHAIN_GAP, VALUE_LINE, VALUE_SIZES, columns2, PLACES, badgeW, badge;
var init_columns = __esm({
  "packages/frontend/src/lib/diagram/columns.ts"() {
    "use strict";
    init_paint();
    init_widgets();
    init_text();
    MARK = 10;
    METRICS = {
      page: { pad: 18, gap: 24, line: 19, eyebrow: 18, title: 22, sub: 18, body: 20, item: [14, 10, 8, 2], block: 10, rule: [18, 10], foot: 30, legend: [30, 28] },
      slide: { pad: 12, gap: 16, line: 17, eyebrow: 16, title: 20, sub: 16, body: 18, item: [8, 6, 4, 0], block: 6, rule: [12, 6], foot: 22, legend: [22, 24] }
    };
    CHAIN_GAP = 32;
    VALUE_LINE = 44;
    VALUE_SIZES = [SIZE.title, 32, 28, 24];
    columns2 = (spec, space, ctx) => {
      const n = spec.columns.length;
      const M = ctx.pick(METRICS.page, METRICS.slide);
      const { line: LINE2 } = M;
      const PAD2 = spec.bare ? 0 : M.pad;
      const key2 = spec.bare ? { size: SIZE.body, face: "sans", weight: 400 } : { size: SIZE.label, face: "mono", weight: 600 };
      const [boxedPad, plainPad, boxedGap, plainGap] = M.item;
      const gap = spec.chain ? CHAIN_GAP : M.gap;
      const leasts = spec.columns.map(
        (c) => Math.max(
          narrowest(c.title ?? "", { size: SIZE.node, weight: 600 }) + 1,
          narrowest(c.body ?? "", { size: SIZE.body }) + 1,
          ...(c.items ?? []).map((i) => narrowest(i.text, { size: i.code ? SIZE.label : SIZE.body, face: i.code ? "mono" : "sans" }) + 1),
          ...(c.widgets ?? []).map((wd) => (wd.w === "frame" && wd.over ? leastWidth(wd, ctx) / Math.min(1, wd.width ?? 0.7) : leastWidth(wd, ctx) + ("marker" in wd && wd.marker && !wd.corner && !(naturalWidth(wd) && wd.w !== "text") ? 18 : 0)) - 0.5)
        ) + 2 * PAD2
      );
      const named2 = spec.rows ?? [];
      const nameW = named2.length ? Math.max(...named2.map((r) => measure(r, SIZE.body))) + 16 : 0;
      const even = (space.width - nameW - (n - 1) * gap) / n;
      const ws = leasts.map(() => Math.max(even, ...leasts));
      const xs = ws.map((_, i) => ws.slice(0, i).reduce((a, b) => a + b + gap, 0));
      const across = ws.reduce((a, b) => a + b, 0) + (n - 1) * gap;
      if (across > 2 * space.width) ctx.fail("the text asks for more than twice the room");
      const lift = spec.columns.some((c) => c.badge) ? 10 : 0;
      const room = { ...space, x: space.x + nameW, y: space.y + lift, width: across };
      const laid = spec.columns.map((c, ci) => {
        const inner = (ws[ci] ?? 0) - 2 * PAD2;
        const what = `${ctx.name}: column ${c.title ?? c.eyebrow ?? ci + 1}`;
        const blocks = [];
        const eyebrow = c.eyebrow ? wrap(c.eyebrow.toUpperCase(), inner, { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8 }, what) : [];
        const aside = (c.id ? measure(c.id, SIZE.label, "mono", 600) + 12 : 0) + (c.place ? PLACE.width + 8 : 0);
        const letterW = c.letter ? measure(c.letter, SIZE.lead, "sans", 600) + 8 : 0;
        const title = c.title ? wrap(c.title, inner - aside - letterW, { size: SIZE.node, weight: 600 }, what) : [];
        const subSetting = { size: SIZE.label, face: "mono" };
        const beside = c.sub ? wrap(c.sub, inner - (c.place ? PLACE.width + 8 : 0), subSetting, what) : [];
        const wide = c.sub && c.place && beside.length > 1 ? wrap(c.sub, inner, subSetting, what) : beside;
        const sub = wide.length < beside.length ? wide : beside;
        const drop = sub === beside ? 0 : Math.max(0, PLACE.height - 3 - title.length * M.title);
        const body = c.body ? wrap(c.body, inner, { size: SIZE.body }, what) : [];
        const valueSize = c.value ? VALUE_SIZES.find((size) => measure(c.value ?? "", size, "sans", 600) <= inner - aside) ?? SIZE.lead : SIZE.title;
        const value = c.value ? fit(c.value, inner - aside, { size: valueSize, weight: 600 }, what) : "";
        const follows = Boolean(c.items?.length || c.terminal?.length || c.note);
        const ruled2 = title.length + body.length > 0 && !c.widgets?.length && follows;
        const headH2 = Math.max(c.place ? PLACE.height + 8 : 0, eyebrow.length * M.eyebrow + (value ? VALUE_LINE : 0) + title.length * M.title + drop + sub.length * M.sub + (body.length ? 4 + body.length * M.body : 0));
        const items = c.items ?? [];
        const idW = Math.max(0, ...items.map((i) => i.id ? measure(i.id, key2.size, key2.face, key2.weight) + (spec.bare ? 20 : 10) : 0));
        for (const item of items) {
          const boxed = Boolean(item.boxed || item.emphasis || item.strong || (item.state ?? "present") !== "present");
          const lead = (item.sign ? 30 : 0) + (item.mark ? MARK + 10 : 0) + (item.id ? idW : 0) + (boxed ? 10 : 0);
          const trail = item.marks?.length ? item.marks.length * (MARK + 4) + 10 : 0;
          const face = item.code ? "mono" : "sans";
          const size = item.code ? SIZE.label : SIZE.body;
          const lines5 = named2.length ? [""] : wrap(item.text, inner - lead - trail - (boxed ? 10 : 0), { size, face }, `${what}, item ${item.id ?? item.text}`);
          const height = lines5.length * LINE2 + (boxed ? boxedPad : plainPad);
          blocks.push({
            height: height + (boxed ? boxedGap : plainGap),
            draw: (x, y) => {
              const out2 = [];
              const state2 = item.state ?? "present";
              const colour = item.emphasis ? ctx.emphasis("item", `item ${item.id ?? item.text}`) : state2 === "degraded" ? WARN : MUTED;
              if (boxed) {
                out2.push(
                  rect(x, y, inner, height, {
                    fill: item.emphasis && item.fill ? colour : item.boxed && state2 === "present" ? RAISED : "none",
                    stroke: item.emphasis || state2 !== "present" ? colour : item.strong ? INK : SUBTLE,
                    width: item.emphasis || item.strong ? 2 : state2 === "present" ? 1 : 1.5,
                    radius: 4,
                    dashed: state2 !== "present"
                  })
                );
              }
              let tx = x + (boxed ? 10 : 0);
              const cy = y + height / 2;
              if (item.sign) {
                out2.push(sign(item.sign, named2.length ? x + inner / 2 : tx + 10, cy));
                tx += 30;
              }
              if (item.mark) {
                out2.push(rect(tx, cy - MARK / 2, MARK, MARK, { fill: TONE[item.mark], radius: 2 }));
                tx += MARK + 10;
              }
              if (item.id) {
                out2.push(text(tx, y + (boxed ? boxedPad : plainPad) / 2 + 14, item.id, { ...key2, fill: item.emphasis && item.fill ? CANVAS : spec.bare ? MUTED : SECONDARY }));
                tx += idW;
              }
              lines5.forEach(
                (l, j) => out2.push(text(tx, y + (boxed ? boxedPad : plainPad) / 2 + 14 + j * LINE2, l, { size, face, fill: item.emphasis && item.fill ? CANVAS : state2 === "absent" ? MUTED : INK }))
              );
              (item.marks ?? []).forEach((m, j, all) => {
                const mx = x + inner - (boxed ? 10 : 0) - (all.length - j) * (MARK + 4) + 4;
                out2.push(rect(mx, cy - MARK / 2, MARK, MARK, { fill: TONE[m], radius: 2 }));
              });
              return out2;
            }
          });
        }
        if (c.terminal?.length) {
          const lines5 = c.terminal.map((l) => fit(l, inner - 24, { size: SIZE.label, face: "mono" }, `${what}, the terminal`));
          const edge = ctx.pick(10, 6);
          const height = lines5.length * LINE2 + 2 * edge;
          blocks.push({
            height: height + M.block + 2,
            draw: (x, y) => [
              rect(x, y, inner, height, { fill: INK, radius: 4 }),
              ...lines5.map((l, j) => text(x + 12, y + edge + 14 + j * LINE2, l, { size: SIZE.label, face: "mono", fill: CANVAS }))
            ]
          });
        }
        const widgets = c.widgets ?? [];
        const overAt = widgets.findIndex((wd) => wd.w === "frame" && wd.over);
        let afterRule = false;
        for (const wd of overAt < 0 ? widgets : widgets.slice(0, overAt)) {
          afterRule ||= wd.w === "rule";
          const marked = "marker" in wd && wd.marker && !wd.corner ? 18 : 0;
          const ww = naturalWidth(wd) && wd.w !== "text" ? Math.min(naturalWidth(wd), inner) : inner - marked;
          const probe = widget(wd, 0, 0, ww, ctx, `${what}, a ${wd.w}`);
          blocks.push({ height: probe.height + M.block, draw: (x, y) => [widget(wd, x, y, ww, ctx, `${what}, a ${wd.w}`).svg], foot: afterRule });
        }
        if (overAt >= 0) {
          const rest = widgets.slice(overAt);
          const probe = stack(rest, 0, 0, inner, ctx, what, M.block);
          blocks.push({ height: probe.height + M.block, draw: (x, y) => [stack(rest, x, y, inner, ctx, what, M.block).svg] });
        }
        if (c.note) {
          const lines5 = wrap(c.note, inner, { size: SIZE.label }, `${what}, the note`);
          blocks.push({
            height: lines5.length * M.sub + M.block - 2,
            draw: (x, y) => lines5.map((l, j) => text(x, y + 13 + j * M.sub, l, { size: SIZE.label, fill: SECONDARY }))
          });
        }
        const foot = c.foot ? fit(c.foot, inner, { size: SIZE.label, face: "mono" }, `${what}, the foot`) : "";
        const blocksH2 = blocks.reduce((sum2, b) => sum2 + b.height, 0);
        const footBlocksH = blocks.reduce((sum2, b) => sum2 + (b.foot ? b.height : 0), 0);
        return { c, eyebrow, value, valueSize, title, sub, drop, body, ruled: ruled2, headH: headH2, blocks, blocksH: blocksH2, footBlocksH, foot };
      });
      const headH = Math.max(...laid.map((l) => l.headH));
      const ruled = laid.some((l) => l.ruled);
      const top = PAD2 + (headH > 0 ? headH + (ruled ? M.rule[0] ?? 0 : M.rule[1] ?? 0) : 0);
      const footH = laid.some((l) => l.foot) ? M.foot : 0;
      const footed = !spec.rise && !named2.length && laid.some((l) => l.footBlocksH > 0);
      const blocksH = footed ? Math.max(...laid.map((l) => l.blocksH - l.footBlocksH)) + Math.max(...laid.map((l) => l.footBlocksH)) : Math.max(...laid.map((l) => l.blocksH));
      const h = top + blocksH + footH + PAD2 - 8;
      const footTop = Math.max(...laid.map((l) => l.blocksH - l.footBlocksH));
      const rise = spec.rise ? ctx.pick(20, 16) : 0;
      const out = [];
      laid.forEach((l, i) => {
        const x = room.x + (xs[i] ?? 0);
        const w = ws[i] ?? 0;
        const y0 = room.y + rise * (n - 1 - i);
        const hh = h + rise * i;
        if (spec.chain && i > 0) out.push(connector([[x - gap + 4, y0 + h / 2], [x - 2, y0 + h / 2]]));
        const state2 = l.c.state ?? "present";
        const stroke = l.c.emphasis ? ctx.emphasis("column", `column ${l.c.title ?? l.c.eyebrow ?? i + 1}`) : state2 === "degraded" ? WARN : state2 === "absent" ? MUTED : l.c.strong ? INK : SUBTLE;
        if (!spec.bare) out.push(
          rect(x, y0, w, hh, {
            fill: state2 === "present" ? RAISED : "none",
            stroke,
            width: l.c.emphasis || l.c.strong ? 2 : state2 === "present" ? 1 : 1.5,
            radius: 6,
            dashed: state2 !== "present"
          })
        );
        let y = y0 + PAD2;
        for (const t of l.eyebrow) {
          out.push(text(x + PAD2, y + 13, t, { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8, fill: l.c.emphasis && (spec.chain || spec.rise) ? stroke : MUTED }));
          y += M.eyebrow;
        }
        if (l.value) {
          out.push(text(x + PAD2, y + 36, l.value, { size: l.valueSize, weight: 600, spacing: -0.5 }));
          y += VALUE_LINE;
        }
        if (l.c.badge) {
          const label = fit(l.c.badge, w - 2 * PAD2 - 14, { size: SIZE.label, weight: 600 }, `${ctx.name}: the badge of column ${l.c.title ?? i + 1}`);
          out.push(badge(label, x + w - PAD2 + 8 - badgeW(label), y0 - 10));
        }
        if (l.c.id) out.push(text(x + w - PAD2 - (l.c.place ? PLACE.width + 8 : 0), y + 17, l.c.id, { size: SIZE.label, face: "mono", weight: 600, fill: MUTED, anchor: "end" }));
        if (l.c.place) out.push(placeSign(l.c.place, x + w - PAD2 - PLACE.width, y));
        const letterW = l.c.letter ? measure(l.c.letter, SIZE.lead, "sans", 600) + 8 : 0;
        if (l.c.letter) out.push(text(x + PAD2, y + 18, l.c.letter, { size: SIZE.lead, weight: 600, fill: ACCENT }));
        const [hx, anchor] = spec.centred ? [x + w / 2, "middle"] : [x + PAD2, "start"];
        for (const t of l.title) {
          out.push(text(spec.centred ? hx : hx + letterW, y + 17, t, { size: SIZE.node, weight: 600, anchor }));
          y += M.title;
        }
        y += l.drop;
        for (const t of l.sub) {
          out.push(text(x + PAD2, y + 14, t, { size: SIZE.label, face: "mono", fill: SECONDARY }));
          y += M.sub;
        }
        if (l.body.length) y += 4;
        for (const t of l.body) {
          out.push(text(hx, y + 15, t, { size: SIZE.body, fill: SECONDARY, anchor }));
          y += M.body;
        }
        if (ruled && !spec.centred) out.push(line(x + PAD2, y0 + PAD2 + headH + (M.rule[0] ?? 0) / 2 + 1, x + w - PAD2, y0 + PAD2 + headH + (M.rule[0] ?? 0) / 2 + 1, SUBTLE));
        y = spec.rise || named2.length ? y0 + hh - PAD2 + 8 - footH - l.blocksH : y0 + top;
        for (const b of l.blocks) {
          if (footed && b.foot && !l.blocks[l.blocks.indexOf(b) - 1]?.foot) y = Math.max(y, y0 + top + footTop);
          out.push(...b.draw(x + PAD2, y));
          y += b.height;
        }
        if (l.foot) out.push(text(x + PAD2, y0 + hh - PAD2 - 2, l.foot, { size: SIZE.label, face: "mono", fill: MUTED }));
      });
      for (const j of spec.columns.flatMap((c) => c.joins ?? [])) {
        const [a, b] = [ctx.places.get(j.from), ctx.places.get(j.to)];
        if (!a || !b) ctx.fail(`a join names ${a ? j.to : j.from}, and no control has that id`);
        const [top2, foot] = [Math.max(a.y, b.y), Math.min(a.y + a.height, b.y + b.height)];
        if (!j.right && top2 < foot && (b.x >= a.x + a.width || a.x >= b.x + b.width)) {
          const yy = (top2 + foot) / 2;
          const [ax2, bx2] = b.x >= a.x + a.width ? [a.x + a.width, b.x] : [a.x, b.x + b.width];
          const stroke2 = j.dashed ? MUTED : INK;
          out.push(j.arrow ? connector([[ax2, yy], [bx2, yy]], stroke2, 1.5, j.dashed) : line(ax2, yy, bx2, yy, stroke2, 1.5, j.dashed));
          continue;
        }
        const down = b.y >= a.y + a.height / 2;
        const [from, to] = [Math.max(a.x, b.x), Math.min(a.x + a.width, b.x + b.width)];
        const ax = j.right ? to - 14 : from < to ? (from + to) / 2 : a.x + a.width / 2;
        const bx = j.right || from < to ? ax : b.x + b.width / 2;
        const [ay, by] = down ? [a.y + a.height, b.y] : [a.y, b.y + b.height];
        const stroke = j.dashed ? MUTED : INK;
        out.push(j.arrow ? connector([[ax, ay], [bx, by]], stroke, 1.5, j.dashed) : line(ax, ay, bx, by, stroke, 1.5, j.dashed));
      }
      const last = laid.at(-1);
      if (named2.length && last) {
        let ny = room.y + h + rise * (n - 1) - PAD2 + 8 - footH - last.blocksH;
        last.blocks.forEach((b, j) => {
          const name = named2[j];
          if (name) out.push(text(space.x, ny + (b.height - plainGap) / 2 + 5, name, { size: SIZE.body, fill: SECONDARY }));
          ny += b.height;
        });
      }
      let bottom = room.y + h + rise * (n - 1);
      if (spec.legend?.length && ctx.legend) {
        bottom += M.legend[0] ?? 0;
        let x = space.x;
        for (const entry of spec.legend) {
          const lead = entry.chip ? measure(entry.chip, SIZE.label, "mono", 600) + 14 : entry.badge ? badgeW(entry.badge) : entry.pill ? badgeW(entry.pill) + 2 : entry.sign ? PLACES.has(entry.sign) ? PLACE.width * 0.75 : 22 : 0;
          if (x > space.x && x + lead + 10 + measure(entry.label, SIZE.body) > room.x + room.width) {
            x = space.x;
            bottom += M.legend[1] ?? 0;
          }
          let lw = 0;
          if (entry.chip) {
            const cw = measure(entry.chip, SIZE.label, "mono", 600) + 14;
            out.push(rect(x, bottom - 15, cw, 20, { fill: SUNKEN, stroke: STRONG, radius: 4 }) + text(x + 7, bottom, entry.chip, { size: SIZE.label, face: "mono", weight: 600 }));
            lw = cw;
          } else if (entry.badge || entry.pill) {
            const label = entry.badge ?? entry.pill ?? "";
            out.push(entry.badge ? badge(label, x, bottom - 15) : rect(x, bottom - 15, badgeW(label) + 2, 20, { fill: RAISED, stroke: INK, width: 1.2, radius: 6 }) + text(x + badgeW(label) / 2 + 1, bottom, label, { size: SIZE.label, weight: 600, anchor: "middle" }));
            lw = badgeW(label) + (entry.pill ? 2 : 0);
          } else if (entry.sign && PLACES.has(entry.sign)) {
            out.push(`<g transform="translate(${x} ${bottom - 18}) scale(0.75)">${placeSign(entry.sign, 0, 0)}</g>`);
            lw = PLACE.width * 0.75;
          } else if (entry.sign) {
            out.push(sign(entry.sign, x + 11, bottom - 5));
            lw = 22;
          }
          out.push(text(x + lw + 10, bottom, entry.label, { size: SIZE.body, fill: SECONDARY }));
          x += lw + 10 + measure(entry.label, SIZE.body) + 32;
        }
        bottom += 6;
      }
      const took = room.width + nameW;
      return took > space.width + 0.5 ? { svg: out.join("\n"), height: bottom - space.y, width: Math.ceil(took) } : { svg: out.join("\n"), height: bottom - space.y };
    };
    PLACES = /* @__PURE__ */ new Set(["page", "panel", "both", "form", "bar", "nav", "docheader", "any"]);
    badgeW = (s) => measure(s, SIZE.label, "sans", 600) + 14;
    badge = (s, x, y) => rect(x, y, badgeW(s), 20, { fill: INK, radius: 4 }) + text(x + badgeW(s) / 2, y + 14.5, s, { size: SIZE.label, weight: 600, fill: CANVAS, anchor: "middle" });
  }
});

// packages/frontend/src/lib/diagram/context.ts
var Context;
var init_context = __esm({
  "packages/frontend/src/lib/diagram/context.ts"() {
    "use strict";
    init_paint();
    Context = class {
      constructor(name, claim = "accent", dense = false) {
        /** The share of its stated height a screen of a sketch takes. A slide
            lowers it where the drawing is too tall for the room. */
        this.squeeze = 1;
        this.spent = "";
        this.kind = "";
        /** A part of a composed drawing whose legend a later part repeats draws none. */
        this.legend = true;
        /** The box of each control with an id, where the drawing last set it: the ends of a join. */
        this.places = /* @__PURE__ */ new Map();
        this.name = name;
        this.claim = CLAIM[claim];
        this.dense = dense;
      }
      /** The page's metric, or the slide's where the drawing is dense. */
      pick(page, slide) {
        return this.dense ? slide : page;
      }
      /** The claim colour, for the one part the drawing is about, or for
          peers of one kind that make the same claim. A part of another kind
          that asks for it is an error, because two claims are two drawings. */
      emphasis(kind, what) {
        if (this.spent && this.kind !== kind) throw new Error(`${this.name}: ${what} is a second emphasis after ${this.spent} \u2014 one claim: one part, or peers of one kind`);
        if (!this.spent) [this.spent, this.kind] = [what, kind];
        return this.claim;
      }
      /** One way to draw. A refusal takes back the claim it spent, so the next
          way starts where this one did. */
      attempt(way) {
        const [spent, kind] = [this.spent, this.kind];
        try {
          return way();
        } catch (error) {
          [this.spent, this.kind] = [spent, kind];
          throw error;
        }
      }
      fail(message) {
        throw new Error(`${this.name}: ${message}`);
      }
    };
  }
});

// packages/frontend/src/lib/diagram/card.ts
var PAD_X, padX, titleSetting, LINES, MARK_LINE, RISE, SPLIT, GLYPH2, ITEM, signed, itemSetting, measureCard, leastCard, drawCard;
var init_card = __esm({
  "packages/frontend/src/lib/diagram/card.ts"() {
    "use strict";
    init_paint();
    init_text();
    PAD_X = 16;
    padX = (spec) => spec.plain ? 0 : PAD_X;
    titleSetting = (spec) => ({ size: spec.plain ? SIZE.body : SIZE.node, weight: spec.plain ? 400 : 600, face: spec.code ? "mono" : "sans" });
    LINES = { page: { pad: 14, title: 22, body: 20 }, slide: { pad: 9, title: 20, body: 18 } };
    MARK_LINE = 20;
    RISE = 3;
    SPLIT = 12;
    GLYPH2 = 20;
    ITEM = { gap: 6, across: 24, lead: 10 };
    signed = (s) => /^[\ue000-\ue0ff] /.test(s);
    itemSetting = (item) => ({ size: SIZE.body, weight: item.body ? 600 : 400 });
    measureCard = (spec, width2, what, dense = false) => {
      const lines5 = dense ? LINES.slide : LINES.page;
      const inner = width2 - 2 * padX(spec);
      const glyph2 = spec.shape && spec.shape !== "node" ? GLYPH2 : 0;
      const value = spec.value ? measure(spec.value, SIZE.body) + 12 : 0;
      if (value > inner / 2) throw new Error(`${what}: the value "${spec.value}" takes more than half the card`);
      const tag = spec.tag ? measure(spec.tag, SIZE.label, "mono", 600) + 8 : 0;
      const title = spec.title ? wrap(spec.title, inner - glyph2 - value - tag, titleSetting(spec), what) : [];
      const body = spec.body ? wrap(spec.body, inner, { size: SIZE.body }, what) : [];
      const across = Math.max(1, spec.across ?? 1);
      const itemWidth = (inner - (across - 1) * ITEM.across) / across;
      const entries = (spec.items ?? []).map((item) => {
        const value2 = item.value ? measure(item.value, SIZE.body) + 12 : 0;
        const hang = signed(item.title) ? SIZE.body + measure(" ", SIZE.body) : 0;
        const words = wrap(hang ? item.title.slice(2) : item.title, itemWidth - value2 - hang, itemSetting(item), what);
        const title2 = hang ? words.map((l, i) => i ? l : `${item.title.slice(0, 2)}${l}`) : words;
        return { item, hang, title: title2, body: item.body ? wrap(item.body, itemWidth, { size: SIZE.body }, what) : [] };
      });
      const per = Math.ceil(entries.length / across);
      const items = Array.from({ length: entries.length ? across : 0 }, (_, c) => entries.slice(c * per, (c + 1) * per));
      const list = Math.max(0, ...items.map((col) => col.reduce((a, e) => a + (e.title.length + e.body.length) * lines5.body, 0) + (col.length - 1) * ITEM.gap));
      const above = title.length || body.length ? ITEM.lead : 0;
      const height = lines5.pad * 2 + (spec.mark ? MARK_LINE : 0) + (spec.eyebrow ? MARK_LINE : 0) + title.length * lines5.title + body.length * lines5.body - 6 + (spec.plain && body.length ? SPLIT : 0) + (list ? above + list : 0);
      return { spec, width: width2, height, title, body, items, itemWidth, lines: lines5 };
    };
    leastCard = (spec) => {
      const glyph2 = spec.shape && spec.shape !== "node" ? GLYPH2 : 0;
      const value = spec.value ? measure(spec.value, SIZE.body) + 12 : 0;
      const tag = spec.tag ? measure(spec.tag, SIZE.label, "mono", 600) + 8 : 0;
      const title = narrowest(spec.title, titleSetting(spec)) + glyph2 + value + tag;
      const across = Math.max(1, spec.across ?? 1);
      const item = Math.max(0, ...(spec.items ?? []).map((i) => Math.max(narrowest(i.title, itemSetting(i)) + (i.value ? measure(i.value, SIZE.body) + 12 : 0), narrowest(i.body ?? "", { size: SIZE.body }))));
      return 2 * padX(spec) + Math.max(title, narrowest(spec.body ?? "", { size: SIZE.body }), 2 * value, across * item + (across - 1) * ITEM.across);
    };
    drawCard = (m, x, y, height, ctx, what) => {
      const { spec } = m;
      const state2 = spec.state ?? "present";
      const changed = spec.mark === "changed" && state2 === "present" && !spec.ink;
      const stroke = spec.emphasis ? ctx.emphasis("node", what) : state2 === "degraded" || changed ? WARN : state2 === "absent" || spec.dashed ? MUTED : spec.strong ? INK : SUBTLE;
      const filled = spec.emphasis && spec.fill;
      const out = [
        spec.plain ? "" : rect(x, y, m.width, height, {
          fill: filled ? stroke : spec.ink ? INK : state2 === "present" ? RAISED : "none",
          stroke: spec.ink && !spec.emphasis ? void 0 : stroke,
          width: spec.emphasis || spec.strong ? 2 : changed || state2 !== "present" || spec.dashed ? 1.5 : 1,
          radius: 6,
          dashed: state2 !== "present" || Boolean(spec.dashed)
        })
      ];
      const quiet = state2 === "absent";
      const [ink, soft] = spec.ink || filled ? [CANVAS, CANVAS] : [quiet ? MUTED : INK, quiet ? MUTED : SECONDARY];
      let ty = y + (height - m.height) / 2 + m.lines.pad - RISE;
      if (spec.mark) {
        const label = spec.mark === "new" ? "NEW" : "CHANGED";
        out.push(text(x + PAD_X, ty + 12, label, { size: SIZE.label, face: "mono", weight: 600, spacing: 1.2, fill: spec.mark === "new" ? INK : WARN }));
        ty += MARK_LINE;
      }
      if (spec.eyebrow) {
        out.push(text(x + padX(spec), ty + 12, spec.eyebrow.toUpperCase(), { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8, fill: quiet ? MUTED : soft }));
        ty += MARK_LINE;
      }
      const glyph2 = spec.shape && spec.shape !== "node" ? GLYPH2 : 0;
      if (glyph2) out.push(shapeSign(spec.shape, x + PAD_X, ty + 11, ink));
      const tag = spec.tag ? measure(spec.tag, SIZE.label, "mono", 600) + 8 : 0;
      if (spec.tag) out.push(text(x + padX(spec) + glyph2, ty + 16, spec.tag, { size: SIZE.label, face: "mono", weight: 600, fill: quiet ? MUTED : soft }));
      m.title.forEach((l, i) => {
        out.push(
          text(x + padX(spec) + glyph2 + tag, ty + 16 + i * m.lines.title, l, { ...titleSetting(spec), fill: ink })
        );
      });
      if (spec.value) {
        out.push(text(x + m.width - PAD_X, ty + 16, spec.value, { size: SIZE.body, fill: soft, anchor: "end" }));
      }
      ty += m.title.length * m.lines.title + (spec.plain && m.body.length ? SPLIT : 0);
      m.body.forEach((l, i) => {
        out.push(text(x + padX(spec), ty + 14 + i * m.lines.body, l, { size: SIZE.body, fill: soft }));
      });
      ty += m.body.length * m.lines.body + (m.title.length || m.body.length ? ITEM.lead : 0);
      m.items.forEach((col, c) => {
        const ix = x + padX(spec) + c * (m.itemWidth + ITEM.across);
        let iy = ty;
        for (const e of col) {
          e.title.forEach((l, i) => out.push(text(ix + (i ? e.hang : 0), iy + 14 + i * m.lines.body, l, { ...itemSetting(e.item), fill: ink })));
          if (e.item.value) out.push(text(ix + m.itemWidth, iy + 14, e.item.value, { size: SIZE.body, fill: soft, anchor: "end" }));
          iy += e.title.length * m.lines.body;
          e.body.forEach((l, i) => out.push(text(ix, iy + 14 + i * m.lines.body, l, { size: SIZE.body, fill: soft })));
          iy += e.body.length * m.lines.body + ITEM.gap;
        }
      });
      return out.join("\n");
    };
  }
});

// packages/frontend/src/lib/diagram/flow.ts
var PAGE_GROUP, PLAIN_CLEAR, folds, flow2, place2, centre, curved, fan, apart, route, edgeLabel;
var init_flow = __esm({
  "packages/frontend/src/lib/diagram/flow.ts"() {
    "use strict";
    init_card();
    init_paint();
    init_text();
    PAGE_GROUP = { pad: 16, head: 30, note: 30 };
    PLAIN_CLEAR = 10;
    folds = (spec, width2) => {
      const nodes = [...spec.nodes].sort((a, b) => a.at[0] - b.at[0]);
      const place3 = (id) => nodes.findIndex((n) => n.id === id);
      const chain = nodes.length >= 3 && !spec.groups?.length && !spec.rows?.length && nodes.every((n, i) => n.at[1] === 0 && (n.span ?? 1) === 1 && (n.rows ?? 1) === 1 && n.at[0] === i) && (spec.edges ?? []).every((e) => place3(e.from) >= 0 && place3(e.to) === place3(e.from) + 1);
      if (!chain) return [spec];
      const gap = spec.gap?.[0] ?? 64;
      const out = [];
      for (let rows = 1; rows <= 3; rows++) {
        const across = Math.ceil(nodes.length / rows);
        if (rows > 1 && across === Math.ceil(nodes.length / (rows - 1))) continue;
        const w = rows === 1 ? 0 : (width2 - (across - 1) * gap) / across;
        let lines5 = 0;
        let tidy2 = true;
        try {
          for (const n of nodes) {
            const m = measureCard(n, rows === 1 ? (width2 - (nodes.length - 1) * gap) / nodes.length : w, "a fold");
            lines5 += m.title.length + m.body.length;
            if (m.title.length > 2 || m.body.length > 3) tidy2 = false;
          }
        } catch {
          continue;
        }
        const turns = (e) => place3(e.to) % across === 0;
        const folded = rows === 1 ? spec : {
          ...spec,
          columns: Array(across).fill(1),
          nodes: nodes.map((n) => ({ ...n, at: [n.at[0] % across, Math.floor(n.at[0] / across)] })),
          edges: (spec.edges ?? []).map((e) => turns(e) ? { ...e, via: "v" } : e)
        };
        out.push({ spec: folded, lines: lines5, tidy: tidy2 });
      }
      const tidy = out.filter((o) => o.tidy);
      const rest = out.filter((o) => !o.tidy).sort((a, b) => a.lines - b.lines);
      return out.length ? [...tidy, ...rest].map((o) => o.spec) : [spec];
    };
    flow2 = (spec, space, ctx) => {
      try {
        return ctx.attempt(() => place2(spec, space, ctx, false));
      } catch (first) {
        try {
          return ctx.attempt(() => place2(spec, space, ctx, true));
        } catch {
          throw first;
        }
      }
    };
    place2 = (spec, space, ctx, grow) => {
      const [stated, gapY] = spec.gap ?? [64, ctx.pick(48, 32)];
      const [GROUP_PAD, GROUP_HEAD, NOTE] = ctx.pick([PAGE_GROUP.pad, PAGE_GROUP.head, PAGE_GROUP.note], [12, 24, 22]);
      const groups = spec.groups ?? [];
      const keyOf2 = (g) => g.id ?? `group:${g.label}`;
      const inside = (g) => groups.filter((c) => c.within === keyOf2(g));
      const depth = (g) => 1 + Math.max(0, ...inside(g).map(depth));
      for (const g of groups) if (g.within && !groups.some((o) => keyOf2(o) === g.within)) ctx.fail(`boundary ${g.label} stands inside ${g.within}, and there is no such boundary`);
      const inset = groups.length ? GROUP_PAD * Math.max(...groups.map(depth)) : 0;
      const labels = (spec.rows ?? []).map((r) => r.label ?? "");
      const labelW = labels.some(Boolean) ? Math.max(...labels.map((l) => measure(l, SIZE.body, "sans", 600))) + 32 : 0;
      const where = new Map(spec.nodes.map((n) => [n.id, n]));
      const reach = (g) => [...g.nodes.flatMap((id) => {
        const n = where.get(id);
        return n ? [n.at[0], n.at[0] + (n.span ?? 1) - 1] : [];
      }), ...inside(g).flatMap(reach)];
      const parted = groups.some((g) => {
        const cols = reach(g);
        return cols.length > 0 && (Math.min(...cols) > 0 || Math.max(...cols) < spec.columns.length - 1);
      });
      if (parted && stated < 2 * GROUP_PAD + 8) ctx.fail(`a gap of ${stated} between columns leaves no room for a boundary`);
      const column = new Map(spec.nodes.map((n) => [n.id, n.at[0]]));
      const crossed = (spec.edges ?? []).filter((e) => e.label && column.get(e.from) !== column.get(e.to));
      const gapX = !grow ? stated : Math.max(stated, ...crossed.map((e) => measure(e.label ?? "", SIZE.label, "mono") + 8 + (groups.length ? 2 * GROUP_PAD + 16 : 0)));
      const total = spec.columns.reduce((a, b) => a + b, 0);
      const between = (spec.columns.length - 1) * gapX;
      const given = space.width - labelW - 2 * inset - between;
      let widths = spec.columns.map((w) => given * w / total);
      if (grow) {
        const need = spec.columns.map((_, c) => Math.max(spec.letters?.[c] ? measure(spec.heads?.[c] ?? "", SIZE.node, "sans", 600) + measure(spec.letters[c] ?? "", SIZE.node, "sans", 600) + 8 : measure((spec.heads?.[c] ?? "").toUpperCase(), SIZE.label, "mono", 600, 0.8), ...spec.nodes.filter((n) => n.at[0] === c && (n.span ?? 1) === 1).map(leastCard)));
        for (const g of groups) {
          const cs = g.nodes.flatMap((id) => spec.nodes.filter((n) => n.id === id).map((n) => n.at[0]));
          const [first, last] = [Math.min(...cs), Math.max(...cs)];
          const weight = spec.columns.slice(first, last + 1).reduce((a, b) => a + b, 0);
          const head = measure(g.label, SIZE.label, "mono") - (last - first) * gapX;
          for (let c = first; c <= last; c++) need[c] = Math.max(need[c] ?? 0, head * (spec.columns[c] ?? 0) / weight);
        }
        const at = (k) => widths.map((w, c) => Math.max(need[c] ?? 0, w * k));
        let [low, high] = [0, 1];
        for (let i = 0; i < 30; i++) {
          const k = (low + high) / 2;
          if (at(k).reduce((a, w) => a + w, 0) > given) high = k;
          else low = k;
        }
        widths = at(low);
        const across = (first, last, need2) => {
          const has = widths.slice(first, last + 1).reduce((a, w) => a + w, 0) + (last - first) * gapX;
          if (has >= need2) return;
          for (let c = first; c <= last; c++) widths[c] = (widths[c] ?? 0) * (1 + (need2 - has) / (has - (last - first) * gapX));
        };
        for (const n of spec.nodes) {
          if ((n.span ?? 1) > 1) across(n.at[0], n.at[0] + (n.span ?? 1) - 1, leastCard(n));
        }
        for (const g of groups) {
          const cs = g.nodes.flatMap((id) => spec.nodes.filter((n) => n.id === id).map((n) => n.at[0]));
          across(Math.min(...cs), Math.max(...cs), measure(g.label, SIZE.label, "mono"));
        }
      }
      const free = widths.reduce((a, w) => a + w, 0);
      if (free + between > 2 * (given + between)) ctx.fail("the text asks for more than twice the room");
      const room = { x: space.x + labelW + inset, y: space.y, width: free + between };
      const colX = [];
      const colW = [];
      let cx = room.x;
      for (const width2 of widths) {
        colX.push(cx);
        colW.push(width2);
        cx += width2 + gapX;
      }
      const columnEdge = (c) => {
        const x = colX[c];
        const w = colW[c];
        if (x === void 0 || w === void 0) return ctx.fail(`column ${c} is outside the ${spec.columns.length} the drawing has`);
        return x + w;
      };
      const measured = spec.nodes.map((n) => {
        const [c, r] = n.at;
        const x = colX[c] ?? ctx.fail(`node ${n.id} stands in column ${c}, outside the grid`);
        const w = columnEdge(c + (n.span ?? 1) - 1) - x;
        return { n, x, r, m: measureCard(n, w, `${ctx.name}: node ${n.id}`, ctx.dense) };
      });
      const rows = Math.max(...spec.nodes.map((n) => n.at[1] + (n.rows ?? 1) - 1)) + 1;
      const tall = (m) => m.n.rows ?? 1;
      const rowH = Array.from({ length: rows }, (_, r) => Math.max(0, ...measured.filter((m) => m.r === r && tall(m) === 1).map((m) => m.m.height)));
      if (spec.even) rowH.fill(Math.max(0, ...rowH));
      for (const m of measured.filter((x) => tall(x) > 1)) {
        const last = m.r + tall(m) - 1;
        const has = rowH.slice(m.r, last + 1).reduce((a, b) => a + b, 0) + (tall(m) - 1) * gapY;
        if (has < m.m.height) rowH[last] = (rowH[last] ?? 0) + m.m.height - has;
      }
      const ids2 = new Map(measured.map((m) => [m.n.id, m]));
      const extraAbove = Array(rows).fill(0);
      const extraBelow = Array(rows).fill(0);
      const rowsOf = (g) => g.nodes.map((id) => (ids2.get(id) ?? ctx.fail(`boundary ${g.label} names no node ${id}`)).r);
      const above = (g) => 1 + Math.max(0, ...inside(g).filter((c) => Math.min(...rowsOf(c)) === Math.min(...rowsOf(g))).map(above));
      const below = (g) => 1 + Math.max(0, ...inside(g).filter((c) => Math.max(...rowsOf(c)) === Math.max(...rowsOf(g))).map(below));
      for (const g of groups) {
        const rs = rowsOf(g);
        const top = Math.min(...rs);
        const bottom2 = Math.max(...rs);
        extraAbove[top] = Math.max(extraAbove[top] ?? 0, above(g) * ((g.label ? GROUP_HEAD : 0) + GROUP_PAD));
        extraBelow[bottom2] = Math.max(extraBelow[bottom2] ?? 0, below(g) * GROUP_PAD);
      }
      (spec.rows ?? []).forEach((r, i) => {
        if (r.note && i < rows) extraBelow[i] = (extraBelow[i] ?? 0) + NOTE;
      });
      const lift = spec.eyebrows?.some(Boolean) ? 18 : 0;
      const headH = spec.heads?.some(Boolean) ? ctx.pick(30, 26) + lift : 0;
      const rowY = [];
      let y = room.y + headH;
      for (let r = 0; r < rows; r++) {
        y += extraAbove[r] ?? 0;
        rowY.push(y);
        y += (rowH[r] ?? 0) + (extraBelow[r] ?? 0) + gapY;
      }
      const bottom = y - gapY;
      const boxes2 = /* @__PURE__ */ new Map();
      const heightOf = (n, r) => {
        const last = r + (n.rows ?? 1) - 1;
        return (rowY[last] ?? 0) + (rowH[last] ?? 0) - (rowY[r] ?? 0);
      };
      for (const { n, x, r, m } of measured) {
        if (boxes2.has(n.id)) ctx.fail(`two nodes have the id ${n.id}`);
        boxes2.set(n.id, { x, y: rowY[r] ?? 0, w: m.width, h: heightOf(n, r), row: r });
      }
      const out = [];
      (spec.heads ?? []).forEach((h, c) => {
        if (!h) return;
        if (colX[c] === void 0) ctx.fail(`column ${c} has a head, and the drawing has ${spec.columns.length} columns`);
        const letter = spec.letters?.[c];
        const what = `${ctx.name}: the head of column ${c}`;
        const eyebrow = spec.eyebrows?.[c];
        if (eyebrow) {
          const capitals = { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8 };
          out.push(text(colX[c] ?? 0, room.y + 13, fit(eyebrow.toUpperCase(), columnEdge(c) - (colX[c] ?? 0), capitals, what), { ...capitals, fill: MUTED }));
          out.push(text(colX[c] ?? 0, room.y + 16 + lift, fit(h, columnEdge(c) - (colX[c] ?? 0), { size: SIZE.node, weight: 600 }, what), { size: SIZE.node, weight: 600 }));
          return;
        }
        if (letter) {
          const lw = measure(letter, SIZE.node, "sans", 600) + 8;
          out.push(text(colX[c] ?? 0, room.y + 16, letter, { size: SIZE.node, weight: 600, fill: ACCENT }));
          out.push(text((colX[c] ?? 0) + lw, room.y + 16, fit(h, columnEdge(c) - (colX[c] ?? 0) - lw, { size: SIZE.node, weight: 600 }, what), { size: SIZE.node, weight: 600 }));
          return;
        }
        const shown = fit(h.toUpperCase(), columnEdge(c) - (colX[c] ?? 0), { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8 }, what);
        const claim = spec.claims?.includes(c) ? ctx.emphasis("boundary", `the head ${h}`) : void 0;
        out.push(text(colX[c] ?? 0, room.y + 14, shown, { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8, fill: claim ?? MUTED }));
      });
      for (const g of [...groups].sort((a, b) => depth(a) - depth(b))) {
        const nested = inside(g).flatMap((c) => c.nodes);
        const members = [...g.nodes.filter((id) => !nested.includes(id)), ...inside(g).map(keyOf2)].map((id) => boxes2.get(id));
        const x0 = Math.min(...members.map((b) => b.x)) - GROUP_PAD;
        const x1 = Math.max(...members.map((b) => b.x + b.w)) + GROUP_PAD;
        const y0 = Math.min(...members.map((b) => b.y)) - GROUP_PAD - (g.label ? GROUP_HEAD : 0);
        const y1 = Math.max(...members.map((b) => b.y + b.h)) + GROUP_PAD;
        const state2 = g.state ?? "present";
        out.push(
          rect(x0, y0, x1 - x0, y1 - y0, {
            stroke: g.emphasis ? ctx.emphasis("boundary", `boundary ${g.label}`) : state2 === "degraded" ? WARN : STRONG,
            width: g.emphasis ? 2 : 1.5,
            radius: 6,
            dashed: state2 !== "present"
          })
        );
        const head = fit(g.label, x1 - x0 - 2 * GROUP_PAD, { size: SIZE.label, face: "mono" }, `${ctx.name}: boundary ${g.label}`);
        if (head) out.push(text(x0 + GROUP_PAD, y0 + GROUP_HEAD - 4, head, { size: SIZE.label, face: "mono", fill: MUTED }));
        const key2 = g.id ?? `group:${g.label}`;
        if (boxes2.has(key2)) ctx.fail(`a boundary and a node have the same name, ${key2}`);
        boxes2.set(key2, { x: x0, y: y0, w: x1 - x0, h: y1 - y0, row: -1 });
      }
      (spec.rows ?? []).forEach((r, i) => {
        const ry = rowY[i];
        if (ry === void 0) return ctx.fail(`row ${i} has a label, and the grid has ${rows} rows`);
        if (r.label) out.push(text(space.x, ry + (rowH[i] ?? 0) / 2 + 5, r.label, { size: SIZE.body, weight: 600, fill: SECONDARY }));
        if (r.note) {
          const note = fit(r.note, room.width, { size: SIZE.label }, `${ctx.name}: the note of row ${i}`);
          out.push(text(room.x, ry + (rowH[i] ?? 0) + NOTE - 6, note, { size: SIZE.label, fill: SECONDARY }));
        }
      });
      const edgeLabels = [];
      const groupKeys = new Set(groups.map((g) => g.id ?? `group:${g.label}`));
      const nodeBoxes = [...boxes2.entries()].filter(([id]) => !groupKeys.has(id)).map(([, b]) => b);
      const groupBoxes = [...boxes2.entries()].filter(([id]) => groupKeys.has(id)).map(([, b]) => b);
      const plain2 = new Set(spec.nodes.filter((n) => n.plain).map((n) => n.id));
      const clear = (id, box2) => plain2.has(id) ? { ...box2, x: box2.x - PLAIN_CLEAR, w: box2.w + 2 * PLAIN_CLEAR } : box2;
      const routed = (spec.edges ?? []).map((e) => {
        const what = `edge ${e.from} \u2192 ${e.to}`;
        const a = clear(e.from, boxes2.get(e.from) ?? ctx.fail(`${what} starts at nothing`));
        const b = clear(e.to, boxes2.get(e.to) ?? ctx.fail(`${what} ends at nothing`));
        return { e, what, a, b, points: route(a, b, e.via, (e.bend ?? 0.5) * gapX, (e.bend ?? 0.5) * gapY) };
      });
      if (spec.fan) fan(routed, gapX);
      apart(routed);
      for (const { e, what, a, b, points } of routed) {
        const colour = e.emphasis ? ctx.emphasis("connector", what) : e.fails ? ERROR : e.state === "degraded" ? WARN : MUTED;
        const across = spec.curve && spec.fan && (b.x >= a.x + a.w || b.x + b.w <= a.x);
        if (across) out.push(curved(a, b, colour, e.emphasis || e.fails ? 2 : 1.5, (e.state ?? "present") !== "present"));
        else out.push(connector(points, colour, e.emphasis || e.fails ? 2 : 1.5, (e.state ?? "present") !== "present", true, e.both));
        if (e.label) edgeLabels.push(edgeLabel(e.label, points, colour, nodeBoxes, groupBoxes, ctx, what));
      }
      for (const { n, x, r, m } of measured) out.push(drawCard(m, x, rowY[r] ?? 0, heightOf(n, r), ctx, `node ${n.id}`));
      out.push(...edgeLabels);
      const took = room.width + labelW + 2 * inset;
      return took > space.width + 0.5 ? { svg: out.join("\n"), height: bottom - room.y, width: Math.ceil(took) } : { svg: out.join("\n"), height: bottom - room.y };
    };
    centre = (b) => [b.x + b.w / 2, b.y + b.h / 2];
    curved = (a, b, stroke, width2, dashed) => {
      const right = b.x >= a.x + a.w;
      const [x0, y0] = [right ? a.x + a.w : a.x, a.y + a.h / 2];
      const [x1, y1] = [right ? b.x : b.x + b.w, b.y + b.h / 2];
      const pull = (x1 - x0) / 2;
      const end = right ? x1 - 9 : x1 + 9;
      return `<path d="M${fmt(x0)} ${fmt(y0)} C${fmt(x0 + pull)} ${fmt(y0)} ${fmt(x1 - pull)} ${fmt(y1)} ${fmt(end)} ${fmt(y1)} L${fmt(x1)} ${fmt(y1)}" fill="none" stroke="${stroke}" stroke-width="${width2}"${dashed ? ' stroke-dasharray="5 4"' : ""}></path>${arrowhead([x1, y1], [end, y1], stroke)}`;
    };
    fan = (routed, gapX) => {
      const sides = /* @__PURE__ */ new Map();
      for (const { e, a, points } of routed) {
        const [start, next] = points;
        if (points.length !== 4 && points.length !== 2 || !start || !next || start[1] !== next[1] || e.bend !== void 0) continue;
        const key2 = `${e.from}:${next[0] > start[0] ? "r" : "l"}`;
        const side = sides.get(key2) ?? { a, all: [] };
        side.all.push(points);
        sides.set(key2, side);
      }
      const placed2 = [];
      [...sides.entries()].forEach(([key2, { a, all }], order) => {
        const right = key2.endsWith("r");
        all.sort((p, q) => (p.at(-1)?.[1] ?? 0) - (q.at(-1)?.[1] ?? 0));
        const ys = all.map((_, i) => a.y + a.h * (i + 1) / (all.length + 1));
        const up = all.map((p, i) => (p.at(-1)?.[1] ?? 0) < (ys[i] ?? 0));
        const rising = up.filter(Boolean).length;
        all.forEach((points, i) => {
          const end = points.at(-1);
          const y = Math.abs(end[1] - (ys[i] ?? 0)) < 8 && end[1] > a.y && end[1] < a.y + a.h ? end[1] : ys[i] ?? 0;
          const rank2 = up[i] ? i / Math.max(1, rising) : (all.length - 1 - i) / Math.max(1, all.length - rising);
          placed2.push({ points, y, rank: rank2, right, x0: points[0][0], order });
        });
      });
      const gaps = /* @__PURE__ */ new Map();
      for (const p of placed2) {
        const key2 = `${Math.round(p.x0)}:${p.right}`;
        gaps.set(key2, [...gaps.get(key2) ?? [], p]);
      }
      for (const group of gaps.values()) {
        const bending = group.filter((p) => Math.abs(p.points.at(-1)[1] - p.y) >= 1);
        bending.sort((p, q) => p.rank - q.rank || p.order - q.order);
        for (const p of group) {
          const end = p.points.at(-1);
          const slot = bending.indexOf(p);
          if (slot < 0) {
            p.points.splice(0, p.points.length, [p.x0, end[1]], end);
            continue;
          }
          const share = 0.15 + 0.7 * slot / Math.max(1, bending.length - 1);
          const bx = p.right ? p.x0 + gapX * share : p.x0 - gapX * share;
          p.points.splice(0, p.points.length, [p.x0, p.y], [bx, p.y], [bx, end[1]], end);
        }
      }
    };
    apart = (routed) => {
      const ends = (i) => routed.filter((_, j) => j !== i).flatMap((r) => [r.points[0], r.points.at(-1)]).filter((p) => !!p);
      routed.forEach(({ b, points }, i) => {
        const last = points.at(-1);
        if (points.length !== 4 || !last || !ends(i).some(([x, y]) => Math.abs(x - last[0]) < 2 && Math.abs(y - last[1]) < 2)) return;
        const [, , turn] = points;
        const across = turn[1] === last[1];
        if (across) {
          const shift = Math.min(b.h / 4, 14) * (points[0][1] > last[1] ? 1 : -1);
          points[2] = [turn[0], turn[1] + shift];
          points[3] = [last[0], last[1] + shift];
        } else {
          const shift = Math.min(b.w / 4, 14) * (points[0][0] > last[0] ? 1 : -1);
          points[2] = [turn[0] + shift, turn[1]];
          points[3] = [last[0] + shift, last[1]];
        }
      });
    };
    route = (a, b, via, outX, outY) => {
      const [ax, ay] = centre(a);
      const [bx, by] = centre(b);
      const overlapY = Math.max(a.y, b.y) < Math.min(a.y + a.h, b.y + b.h);
      const overlapX = Math.max(a.x, b.x) < Math.min(a.x + a.w, b.x + b.w);
      if (via === "h" || via !== "v" && (overlapY || !overlapX)) {
        const right = bx > ax;
        const x0 = right ? a.x + a.w : a.x;
        const x1 = right ? b.x : b.x + b.w;
        if (overlapY) {
          const yy = (Math.max(a.y, b.y) + Math.min(a.y + a.h, b.y + b.h)) / 2;
          return [[x0, yy], [x1, yy]];
        }
        const mx = right ? x0 + outX : x0 - outX;
        return [[x0, ay], [mx, ay], [mx, by], [x1, by]];
      }
      const down = by > ay;
      const y0 = down ? a.y + a.h : a.y;
      const y1 = down ? b.y : b.y + b.h;
      if (overlapX) {
        const xx = (Math.max(a.x, b.x) + Math.min(a.x + a.w, b.x + b.w)) / 2;
        return [[xx, y0], [xx, y1]];
      }
      const my = down ? y0 + outY : y0 - outY;
      return [[ax, y0], [ax, my], [bx, my], [bx, y1]];
    };
    edgeLabel = (label, points, colour, boxes2, groups, ctx, what) => {
      const w = measure(label, SIZE.label, "mono");
      const segments = points.slice(1).map((q, i) => [points[i], q]);
      const stretches = segments.filter(([[, py], [, qy]]) => py === qy).flatMap(([[px, py], [qx]]) => {
        const [a, b] = [Math.min(px, qx), Math.max(px, qx)];
        const cuts = groups.flatMap((g) => py > g.y && py < g.y + g.h ? [g.x, g.x + g.w] : []).filter((x) => x > a && x < b);
        const edges = [a, ...cuts.sort((m, n) => m - n), b];
        return edges.slice(1).map((end, i) => ({ from: (edges[i] ?? a) + (i ? 8 : 0), to: end - (i < edges.length - 2 ? 8 : 0), y: py }));
      });
      const across = stretches.find((s) => s.to - s.from >= w + 8);
      const clear = (x, y) => !boxes2.some((b) => x + w > b.x && x < b.x + b.w && y > b.y && y - 13 < b.y + b.h) && !groups.some((g) => g.x > x && g.x < x + w || g.x + g.w > x && g.x + g.w < x + w);
      const under = stretches[0] && clear(stretches[0].from + 8, stretches[0].y + 20) ? stretches[0] : void 0;
      let lx;
      let ly;
      if (across) {
        lx = (across.from + across.to) / 2 - w / 2;
        ly = across.y - 8;
      } else if (under) {
        lx = under.from + 8;
        ly = under.y + 20;
      } else {
        const down = segments.filter(([[px2], [qx]]) => px2 === qx);
        const longest = down.sort(([a, b], [c, d]) => Math.abs(d[1] - c[1]) - Math.abs(b[1] - a[1]))[0];
        if (!longest) return ctx.fail(`${what}: the label "${label}" has no room on its connector \u2014 widen the gap or shorten the label`);
        const [[px, py], [, qy]] = longest;
        lx = px + 8;
        ly = (py + qy) / 2 + 4;
      }
      const hit = boxes2.find((b) => lx + w > b.x && lx < b.x + b.w && ly > b.y && ly - 13 < b.y + b.h);
      if (hit) ctx.fail(`${what}: the label "${label}" runs into a node \u2014 widen the gap or shorten the label`);
      return rect(lx - 3, ly - 13, w + 6, 18, { fill: CANVAS }) + text(lx, ly, label, { size: SIZE.label, face: "mono", fill: colour });
    };
  }
});

// packages/frontend/src/lib/diagram/matrix.ts
var ORDER, chipW2, stepW, HEAD_LINE, JOIN, PATH_LINE, matrix2;
var init_matrix = __esm({
  "packages/frontend/src/lib/diagram/matrix.ts"() {
    "use strict";
    init_paint();
    init_text();
    ORDER = ["page", "panel", "both", "form", "bar", "nav", "docheader", "any", "yes", "partly", "no", "unknown", "dot", "ring"];
    chipW2 = (id) => measure(id, SIZE.label, "mono", 600) + 14;
    stepW = (step) => measure(step, SIZE.label) + 18;
    HEAD_LINE = 17;
    JOIN = 20;
    PATH_LINE = 28;
    matrix2 = (spec, space, ctx) => {
      const beside = spec.rowGroups === "beside";
      const [ROW2, GROUP_ROW, PAD2, LEGEND_GAP, LEGEND_WORD, HEAD_PAD2, GROUP_GAP] = ctx.pick([34, 34, 16, 28, 32, 9, 24], [24, 24, 6, 14, 28, 5, 16]);
      const groupSetting = { size: SIZE.label, face: "sans", weight: 600, spacing: 0.8 };
      const groupW = beside ? Math.max(0, ...spec.rows.map((r) => r.group ? measure(r.group.toUpperCase(), SIZE.label, "sans", 600, 0.8) : 0)) + GROUP_GAP : 0;
      const split = (label) => spec.ids ? [label.split(" ")[0] ?? "", label.split(" ").slice(1).join(" ")] : ["", label];
      const idW = spec.ids ? Math.max(...spec.rows.map((r) => measure(split(r.label)[0], SIZE.label, "mono", 600))) + 12 : 0;
      const labelWeight = spec.ids ? 400 : 600;
      const widest = Math.max(...spec.rows.map((r) => idW + measure(split(r.label)[1], SIZE.body, "sans", labelWeight)));
      const labelW = spec.labelWidth ?? Math.min(widest + GROUP_GAP, space.width * 0.4 - groupW);
      const weights = spec.columns.map((c) => c.weight ?? 1);
      const total = weights.reduce((a, b) => a + b, 0);
      const steps = spec.columns.map((_, i) => Math.max(0, ...spec.rows.map((r) => {
        const c = r.cells[i];
        return typeof c === "object" && c.path ? Math.max(...c.path.map(stepW)) + 10 : 0;
      })));
      const least = Math.max(0, ...spec.columns.map((c, i) => Math.max(narrowest(c.label, { size: SIZE.label, weight: 600 }) + HEAD_PAD2, steps[i] ?? 0) / (weights[i] ?? 1)));
      const unit = Math.max((space.width - groupW - labelW) / total, least);
      const widths = weights.map((k) => unit * k);
      const room = { ...space, width: groupW + labelW + unit * total };
      const labelX = room.x + groupW;
      const colX = (i) => labelX + labelW + widths.slice(0, i).reduce((a, b) => a + b, 0);
      const out = [];
      let y = room.y;
      const grouped2 = spec.columns.some((c) => c.group);
      if (grouped2) {
        let start = 0;
        spec.columns.forEach((c, i) => {
          const next = spec.columns[i + 1];
          if (next && next.group === c.group) return;
          if (c.group) {
            const a = colX(start) + 6;
            const b = colX(i + 1) - 6;
            const label = fit(c.group.toUpperCase(), b - a, { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8 }, `${ctx.name}: column group`);
            out.push(text((a + b) / 2, y + 14, label, { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8, fill: MUTED, anchor: "middle" }));
            out.push(line(a, y + 24, b, y + 24, SUBTLE));
          }
          start = i + 1;
        });
        y += 34;
      }
      const used = /* @__PURE__ */ new Set();
      const capitals = { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8 };
      const lettered = spec.columns.some((c) => c.letter);
      const named2 = lettered || spec.blocks;
      const headSetting = { size: SIZE.label, weight: 600 };
      const heads = spec.columns.map(
        (c, i) => spec.left ? [fit(c.label.toUpperCase(), (widths[i] ?? 0) - 8, capitals, `${ctx.name}: column ${c.label}`)] : wrap(c.label, (widths[i] ?? 0) - 4, headSetting, `${ctx.name}: column ${c.label}`)
      );
      const exampled = spec.columns.some((c) => c.sub);
      const headH = (Math.max(...heads.map((h) => h.length)) + (exampled ? 1 : 0)) * HEAD_LINE + (lettered ? 22 : 0) + 10;
      const top = y;
      if (spec.head) out.push(text(labelX, y + headH - 10, fit(spec.head.toUpperCase(), labelW - 8, capitals, `${ctx.name}: the head of the rows`), { ...capitals, fill: MUTED }));
      heads.forEach((lines5, i) => {
        if (spec.left) {
          const end = spec.columns[i]?.end;
          out.push(text(end ? colX(i) + (widths[i] ?? 0) - 5 : colX(i) + 5, y + headH - 10, lines5[0] ?? "", { ...capitals, fill: MUTED, anchor: end ? "end" : "start" }));
          return;
        }
        const column = spec.columns[i];
        const marked2 = column?.sign;
        const cx = colX(i) + (widths[i] ?? 0) / 2 + (marked2 ? 14 : 0);
        const base = y + headH - 10 - (exampled ? HEAD_LINE : 0);
        lines5.forEach((t, j) => {
          out.push(text(cx, base - (lines5.length - 1 - j) * HEAD_LINE, t, { ...headSetting, fill: named2 ? INK : SECONDARY, anchor: "middle" }));
        });
        if (column?.letter) out.push(text(cx, base - lines5.length * HEAD_LINE - 4, column.letter, { size: SIZE.node, weight: 600, anchor: "middle" }));
        if (column?.sub) out.push(text(cx, base + HEAD_LINE, fit(column.sub, (widths[i] ?? 0) - 8, { size: SIZE.label }, `${ctx.name}: column ${column.label}`), { size: SIZE.label, fill: MUTED, anchor: "middle" }));
        if (marked2) {
          out.push(sign(marked2, cx - Math.max(...lines5.map((t) => measure(t, headSetting.size, "sans", 600))) / 2 - 16, y + headH - 15));
        }
      });
      y += headH;
      out.push(line(room.x, y, room.x + room.width, y, SUBTLE));
      let group;
      const emphasised = (key2) => [spec.emphasis?.[key2] ?? []].flat();
      const rowSpans = [];
      for (const row2 of spec.rows) {
        if (row2.cells.length !== spec.columns.length) {
          ctx.fail(`row ${row2.label} has ${row2.cells.length} cells for ${spec.columns.length} columns`);
        }
        let groupLabel = "";
        if (row2.group && row2.group !== group) {
          if (beside) {
            if (group !== void 0) out.push(line(room.x, y, room.x + room.width, y, SUBTLE));
            groupLabel = fit(row2.group.toUpperCase(), groupW - 16, groupSetting, `${ctx.name}: row group`);
          } else {
            if (group !== void 0 && !spec.rules) out.push(line(room.x, y, room.x + room.width, y, SUBTLE));
            out.push(text(room.x, y + GROUP_ROW - 10, row2.group.toUpperCase(), { ...groupSetting, fill: MUTED }));
            y += GROUP_ROW;
          }
          group = row2.group;
        }
        const [rowId, name] = split(row2.label);
        const label = wrap(name, labelW - 16 - idW, { size: SIZE.body, weight: labelWeight }, `${ctx.name}: row ${row2.label}`);
        const rowX = labelX;
        const sub = row2.sub ? fit(row2.sub, labelW - 16, { size: SIZE.label, face: "mono" }, `${ctx.name}: row ${row2.label}`) : "";
        const cells3 = row2.cells.map((cell2, ci) => {
          const colW = widths[ci] ?? 0;
          const c = typeof cell2 === "string" ? cell2 ? { sign: cell2 } : {} : cell2;
          const face = c.code ? "mono" : "sans";
          const size = spec.figures ? SIZE.title : SIZE.label;
          const weight = spec.figures ? 600 : 400;
          const room2 = c.sign ? colW - 40 : colW - 10;
          const what = `${ctx.name}: a cell of ${row2.label}`;
          const lines5 = !c.text ? [] : spec.figures ? [fit(c.text, room2, { size, face, weight }, what)] : wrap(c.text, room2, { size, face, weight }, what);
          const chipLines = [];
          for (const id of c.chips ?? []) {
            const current = chipLines.at(-1);
            const width2 = (ids2) => ids2.reduce((sum2, x, i) => sum2 + chipW2(x) + (i ? 4 : 0), 0);
            if (chipW2(id) > colW - 10) ctx.fail(`${what}: the chip ${id} is ${Math.ceil(chipW2(id))} wide, and its cell is ${Math.floor(colW - 10)}`);
            if (current && width2([...current, id]) <= colW - 10) current.push(id);
            else chipLines.push([id]);
          }
          const pathLines = [];
          for (const step of c.path ?? []) {
            const current = pathLines.at(-1);
            const width2 = (all) => all.reduce((sum2, x, i) => sum2 + stepW(x) + (i ? JOIN : 0), 0);
            if (current && width2([...current, step]) <= colW - 10) current.push(step);
            else pathLines.push([step]);
          }
          return { c, face, size, weight, lines: lines5, chipLines, pathLines };
        });
        const tallest = Math.max(0, ...cells3.map((x) => (x.lines.length > 1 ? x.lines.length * 17 : 0) + x.chipLines.length * 24 + x.pathLines.length * PATH_LINE + PAD2));
        const h = Math.max(spec.figures ? 56 : ROW2, label.length * 18 + (sub ? 17 : 0) + PAD2, tallest);
        let ty = y + (h - (label.length * 18 + (sub ? 17 : 0))) / 2 + 13;
        if (groupLabel) out.push(text(room.x, ty, groupLabel, { ...groupSetting, fill: MUTED }));
        if (rowId) out.push(text(rowX, ty, rowId, { size: SIZE.label, face: "mono", weight: 600, fill: MUTED }));
        for (const t of label) {
          out.push(text(rowX + idW, ty, t, { size: SIZE.body, weight: labelWeight }));
          ty += 18;
        }
        if (sub) out.push(text(rowX, ty - 1, sub, { size: SIZE.label, face: "mono", fill: SECONDARY }));
        const cy = y + h / 2;
        cells3.forEach(({ c, face, size, weight, lines: lines5, chipLines, pathLines }, i) => {
          const colW = widths[i] ?? 0;
          const cx = colX(i) + colW / 2;
          let py = cy - (pathLines.length * PATH_LINE - 6) / 2;
          pathLines.forEach((all, j) => {
            let px = colX(i) + 5;
            all.forEach((step, k) => {
              if (k) out.push(text(px - JOIN / 2, py + 15, "\u203A", { size: SIZE.label, fill: MUTED, anchor: "middle" }));
              out.push(rect(px, py, stepW(step), 22, { fill: "none", stroke: STRONG, radius: 6 }) + text(px + 9, py + 15, step, { size: SIZE.label, fill: INK }));
              px += stepW(step) + JOIN;
            });
            if (j < pathLines.length - 1) out.push(text(px - JOIN / 2, py + 15, "\u203A", { size: SIZE.label, fill: MUTED, anchor: "middle" }));
            py += PATH_LINE;
          });
          if (c.sign) {
            used.add(c.sign);
            out.push(sign(c.sign, c.text ? cx - colW / 2 + 18 : cx, cy));
          }
          if (c.note !== void 0) {
            if (!spec.notesOutside && !spec.notes?.[c.note - 1]) ctx.fail(`a cell of ${row2.label} points at note ${c.note}, and there is none`);
            out.push(text((c.sign ? cx : cx + 8) + 13, cy - 5, String(c.note), { size: SIZE.label, face: "mono", weight: 600, fill: WARN }));
          }
          const block = (lines5.length > 1 ? lines5.length * 17 : lines5.length ? 17 : 0) + chipLines.length * 24 - (chipLines.length ? 4 : 0);
          let ty2 = lines5.length > 1 || chipLines.length ? cy - block / 2 + 12.5 : cy + (spec.figures ? 12 : 4.5);
          if (spec.blocks && c.text && !c.sign) {
            const outlined = /^\(.*\)$/.test(c.text);
            const shown = fit(outlined ? c.text.slice(1, -1) : c.text, colW - 16, { size, face: "mono", weight: 600 }, `${ctx.name}: a cell of ${row2.label}`);
            out.push(rect(colX(i) + 4, cy - 10, colW - 8, 20, outlined ? { fill: "none", stroke: INK, width: 1.2, radius: 3 } : { fill: SUNKEN, radius: 3 }));
            out.push(text(cx, cy + 4.5, shown, { size, face: "mono", weight: 600, fill: INK, anchor: "middle" }));
            lines5.length = 0;
          }
          for (const t of lines5) {
            const end = spec.left && spec.columns[i]?.end && !c.sign;
            out.push(text(c.sign ? cx - colW / 2 + 32 : end ? colX(i) + colW - 5 : spec.left ? colX(i) + 5 : cx, ty2, t, { size, face, weight, fill: INK, anchor: end ? "end" : c.sign || spec.left ? "start" : "middle" }));
            ty2 += 17;
          }
          let chipY = lines5.length ? ty2 - 12.5 + 4 : cy - block / 2;
          for (const ids2 of chipLines) {
            const width2 = ids2.reduce((sum2, x, k) => sum2 + chipW2(x) + (k ? 4 : 0), 0);
            let chipX = cx - width2 / 2;
            for (const id of ids2) {
              out.push(rect(chipX, chipY, chipW2(id), 20, { fill: SUNKEN, stroke: STRONG, radius: 4 }) + text(chipX + 7, chipY + 14.5, id, { size: SIZE.label, face: "mono", weight: 600 }));
              chipX += chipW2(id) + 4;
            }
            chipY += 24;
          }
        });
        if (emphasised("row").includes(row2.label)) rowSpans.push({ label: row2.label, y0: y, y1: y + h });
        y += h;
        if (spec.rules && !beside && row2 !== spec.rows.at(-1)) out.push(line(room.x, y, room.x + room.width, y, SUBTLE));
      }
      out.push(line(room.x, y, room.x + room.width, y, SUBTLE));
      spec.columns.forEach((c, i) => {
        if (c.split && i > 0) out.push(line(colX(i), top - 4, colX(i), y, SUBTLE));
      });
      for (const label of emphasised("row")) if (!rowSpans.some((r) => r.label === label)) ctx.fail(`the emphasis names no row ${label}`);
      rowSpans.forEach((r, i) => {
        const before = rowSpans[i - 1];
        if (before && before.y1 === r.y0) return;
        let end = i;
        while (rowSpans[end + 1]?.y0 === rowSpans[end]?.y1) end++;
        const colour = ctx.emphasis("row", `row ${r.label}`);
        out.push(rect(room.x - 8, r.y0 + 2, room.width + 16, (rowSpans[end]?.y1 ?? r.y1) - r.y0 - 4, { stroke: colour, width: 2, radius: 4 }));
      });
      const marked = emphasised("column").map((label) => {
        const i = spec.columns.findIndex((c) => c.label === label);
        return i < 0 ? ctx.fail(`the emphasis names no column ${label}`) : i;
      });
      for (const i of marked) {
        if (marked.includes(i - 1)) continue;
        let end = i;
        while (marked.includes(end + 1)) end++;
        const colour = ctx.emphasis("column", `column ${spec.columns[i]?.label}`);
        out.push(rect(colX(i) + 2, top - 4, colX(end + 1) - colX(i) - 4, y - top + 8, { stroke: colour, width: 2, radius: 4 }));
      }
      if (used.size && ctx.legend) {
        y += 34;
        let x = room.x;
        for (const s of ORDER) {
          if (!used.has(s)) continue;
          const word = spec.legend?.[s] ?? SIGN_MEANING[s];
          const w = LEGEND_WORD + measure(word, SIZE.label) + LEGEND_GAP;
          if (x + w > room.x + room.width + LEGEND_GAP) {
            x = room.x;
            y += 24;
          }
          out.push(sign(s, x + 11, y - 4));
          out.push(text(x + LEGEND_WORD, y, word, { size: SIZE.label, fill: SECONDARY }));
          x += w;
        }
        if (spec.legendNote) {
          const note = fit(spec.legendNote, room.x + room.width - x, { size: SIZE.label }, `${ctx.name}: the note of the legend`);
          out.push(text(x, y, note, { size: SIZE.label, fill: SECONDARY }));
        }
        y += 6;
      }
      (spec.notesOutside ? [] : spec.notes ?? []).forEach((note, i) => {
        const lines5 = wrap(note, room.width - 24, { size: SIZE.label }, `${ctx.name}: note ${i + 1}`);
        y += 10;
        out.push(text(room.x, y + 13, String(i + 1), { size: SIZE.label, face: "mono", weight: 600, fill: WARN }));
        lines5.forEach((l, j) => out.push(text(room.x + 20, y + 13 + j * 18, l, { size: SIZE.label, fill: SECONDARY })));
        y += lines5.length * 18;
      });
      return room.width > space.width + 0.5 ? { svg: out.join("\n"), height: y - room.y, width: Math.ceil(room.width) } : { svg: out.join("\n"), height: y - room.y };
    };
  }
});

// packages/frontend/src/lib/diagram/sequence.ts
var GUTTER, BAND_PAD, HEAD_PAD, LINE, HOST_PAD, sequence2;
var init_sequence = __esm({
  "packages/frontend/src/lib/diagram/sequence.ts"() {
    "use strict";
    init_paint();
    init_text();
    GUTTER = 162;
    BAND_PAD = 12;
    HEAD_PAD = 12;
    LINE = 19;
    HOST_PAD = 12;
    sequence2 = (spec, room, ctx) => {
      const titled = spec.phases.some((p) => p.title);
      const x0 = room.x + (titled ? GUTTER : 0);
      const span = (room.x + room.width - x0) / spec.lanes.length;
      const laneX = new Map(spec.lanes.map((l, i) => [l.id, x0 + span * i + span / 2]));
      const at = (id, what) => laneX.get(id) ?? ctx.fail(`${what} names no lane ${id}`);
      const out = [];
      const rows = [];
      const hosted = (spec.hosts ?? []).length > 0;
      const headY = room.y + (hosted ? 34 : 0);
      const headW = span - (hosted ? 40 : 16);
      const heads = spec.lanes.map((l) => {
        const glyph2 = l.shape && l.shape !== "node" ? 20 : 0;
        const title = wrap(l.label, headW - 24 - glyph2, { size: SIZE.node, weight: 600 }, `${ctx.name}: lane ${l.id}`);
        const sub = l.sub ? fit(l.sub, headW - 24, { size: SIZE.label, face: "mono" }, `${ctx.name}: lane ${l.id}`) : "";
        return { l, title, sub, glyph: glyph2 };
      });
      const headH = Math.max(...heads.map((h) => HEAD_PAD * 2 + h.title.length * 21 + (h.sub ? 18 : 0)));
      for (const h of heads) {
        const cx = at(h.l.id, "a lane");
        out.push(rect(cx - headW / 2, headY, headW, headH, { fill: RAISED, stroke: SUBTLE, radius: 6 }));
        const block = h.title.length * 21 + (h.sub ? 18 : 0);
        let ty = headY + (headH - block) / 2 + 15;
        const widest = Math.max(...h.title.map((t) => measure(t, SIZE.node, "sans", 600)));
        if (h.glyph) out.push(shapeSign(h.l.shape, cx - widest / 2 - h.glyph / 2 - 6, ty - 4));
        for (const t of h.title) {
          out.push(text(cx + h.glyph / 2, ty, t, { size: SIZE.node, weight: 600, anchor: "middle" }));
          ty += 21;
        }
        if (h.sub) out.push(text(cx, ty - 2, h.sub, { size: SIZE.label, face: "mono", fill: SECONDARY, anchor: "middle" }));
      }
      const lifeTop = headY + headH;
      let y = lifeTop + (hosted ? HOST_PAD : 0) + 16;
      let number = 0;
      const bands = [];
      for (const phase of spec.phases) {
        const y0 = y;
        y += 12;
        const title = phase.title ? wrap(phase.title.toUpperCase(), GUTTER - 20, { size: SIZE.label, face: "mono", weight: 600, spacing: 0.6 }, `${ctx.name}: a phase`) : [];
        for (const step of phase.steps) {
          if ("note" in step) {
            const [first, last] = step.over ?? [spec.lanes[0]?.id ?? "", spec.lanes.at(-1)?.id ?? ""];
            const a = Math.min(at(first, "a note"), at(last, "a note")) - span / 2 + 16;
            const b = Math.max(at(first, "a note"), at(last, "a note")) + span / 2 - 16;
            const lines6 = wrap(step.note, b - a - 24, { size: SIZE.body }, `${ctx.name}: a note`);
            const h = lines6.length * LINE + 14;
            rows.push(rect(a, y, b - a, h, { fill: RAISED, stroke: STRONG, radius: 4 }));
            lines6.forEach((t, i) => rows.push(text((a + b) / 2, y + 21 + i * LINE, t, { size: SIZE.body, anchor: "middle" })));
            y += h + 12;
            continue;
          }
          number++;
          const what = `${ctx.name}: step ${number}`;
          const xa = at(step.from, `step ${number}`);
          const xb = at(step.to, `step ${number}`);
          const colour = step.emphasis ? ctx.emphasis("step", `step ${number}`) : step.fails ? ERROR : step.state === "degraded" ? WARN : MUTED;
          const weight = step.emphasis || step.fails ? 2 : 1.5;
          const dashed = (step.state ?? "present") !== "present";
          if (xa === xb) {
            const lines6 = wrap(step.text, Math.min(span - 52, room.x + room.width - xa - 44), { size: SIZE.body }, what);
            const ly = y + 8;
            rows.push(connector([[xa + 12, ly], [xa + 36, ly], [xa + 36, ly + 18], [xa + 2, ly + 18]], colour, weight, dashed));
            lines6.forEach((t, i) => rows.push(text(xa + 44, ly + 13 + i * LINE, t, { size: SIZE.body, fill: step.fails ? ERROR : INK, halo: true })));
            rows.push(marker(xa, ly, String(number)));
            y += Math.max(36, lines6.length * LINE + 16);
            continue;
          }
          const right2 = xb > xa;
          const lines5 = wrap(step.text, Math.abs(xb - xa) - 44, { size: SIZE.body }, what);
          const ay = y + lines5.length * LINE + 6;
          lines5.forEach(
            (t, i) => rows.push(text((xa + xb) / 2, y + 14 + i * LINE, t, { size: SIZE.body, fill: step.fails ? ERROR : INK, anchor: "middle", halo: true }))
          );
          const dir = right2 ? 1 : -1;
          const end = step.fails ? xb - dir * 6 : xb - dir;
          rows.push(line(xa + dir * 11, ay, end, ay, colour, weight, dashed));
          rows.push(step.fails ? cross(xb, ay) : arrowhead([end, ay], [xa, ay], colour));
          rows.push(marker(xa, ay, String(number)));
          y += lines5.length * LINE + 22;
        }
        y = Math.max(y, y0 + 12 + title.length * 17 + 8);
        bands.push({ y0, y1: y, title, tone: phase.tone });
        y += 4;
      }
      const lifeBottom = y;
      const right = Math.max(...spec.lanes.map((l) => at(l.id, "a lane"))) + headW / 2 + (hosted ? HOST_PAD : 0);
      for (const band2 of bands) {
        out.push(rect(room.x, band2.y0, right - room.x, band2.y1 - band2.y0, { fill: band2.tone ? QUIET[band2.tone] : SUNKEN, radius: 6 }));
        const colour = band2.tone ? TONE[band2.tone] : MUTED;
        band2.title.forEach(
          (t, i) => out.push(text(room.x + BAND_PAD, band2.y0 + 26 + i * 17, t, { size: SIZE.label, face: "mono", weight: 600, spacing: 0.6, fill: colour }))
        );
      }
      for (const l of spec.lanes) {
        const x = at(l.id, "a lane");
        out.push(line(x, lifeTop, x, lifeBottom, STRONG));
      }
      for (const host of spec.hosts ?? []) {
        const xs = host.lanes.map((id) => at(id, `host ${host.label}`));
        const a = Math.min(...xs) - headW / 2 - HOST_PAD;
        const b = Math.max(...xs) + headW / 2 + HOST_PAD;
        out.push(rect(a, room.y, b - a, headY + headH + HOST_PAD - room.y, { stroke: STRONG, width: 1.5, radius: 6 }));
        out.push(text(a + 12, room.y + 22, fit(host.label, b - a - 24, { size: SIZE.label, face: "mono" }, `${ctx.name}: host`), { size: SIZE.label, face: "mono", fill: MUTED }));
      }
      out.push(...rows);
      return { svg: out.join("\n"), height: lifeBottom - room.y };
    };
  }
});

// packages/frontend/src/lib/diagram/sketch.ts
var GAP, INSET2, LENGTHS, sketch2, region2, band, grid, controls;
var init_sketch = __esm({
  "packages/frontend/src/lib/diagram/sketch.ts"() {
    "use strict";
    init_paint();
    init_text();
    init_widgets();
    GAP = 32;
    INSET2 = 6;
    LENGTHS = [0.92, 0.7, 0.84, 0.55];
    sketch2 = (spec, room, ctx) => {
      const height = Math.round(spec.height * ctx.squeeze);
      const total = spec.screens.reduce((sum2, s) => sum2 + (s.weight ?? 1), 0);
      const gap = ctx.pick(GAP, 24);
      const [titleLine, captionLine, under] = ctx.pick([22, 20, 8], [20, 18, 6]);
      const free = room.width - (spec.screens.length - 1) * gap;
      const out = [];
      const lift = spec.heads ? ctx.pick(26, 22) : 0;
      const top = room.y + lift;
      let x = room.x;
      let bottom = top + height;
      for (const screen2 of spec.screens) {
        const w = free * (screen2.weight ?? 1) / total;
        if (spec.heads && screen2.title) {
          const caps = { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8 };
          out.push(text(x, room.y + 13, fit(screen2.title.toUpperCase(), w, caps, `${ctx.name}: a screen`), { ...caps, fill: screen2.root.emphasis ? ctx.claim : MUTED }));
        }
        const edge = screen2.device ? 12 : INSET2;
        if (screen2.device) out.push(rect(x, top, w, height, { fill: RAISED, stroke: INK, width: 2, radius: 6 }) + rect(x + w / 2 - 16, top + height - 8, 32, 3, { fill: INK, radius: 1 }));
        else out.push(rect(x, top, w, height, { fill: RAISED, stroke: STRONG, width: 1.5, radius: 6 }));
        region2(screen2.root, x + edge, top + edge, w - 2 * edge, height - 2 * edge, out, ctx);
        let y = top + height + under;
        if (screen2.band) y = band(screen2.band, x, y + under / 2, w, out, ctx) + under;
        if (screen2.title && !spec.heads) {
          for (const l of wrap(screen2.title, w, { size: SIZE.node, weight: 600 }, `${ctx.name}: a screen`)) {
            y += titleLine;
            out.push(text(x, y, l, { size: SIZE.node, weight: 600 }));
          }
        }
        if (screen2.caption) {
          for (const l of wrap(screen2.caption, w, { size: SIZE.body }, `${ctx.name}: a screen`)) {
            y += captionLine;
            out.push(text(x, y, l, { size: SIZE.body, fill: SECONDARY }));
          }
        }
        bottom = Math.max(bottom, y + 6);
        x += w + gap;
      }
      return { svg: out.join("\n"), height: bottom - room.y };
    };
    region2 = (r, x, y, w, h, out, ctx) => {
      const what = `region ${r.label ?? r.marker ?? ""}`.trim();
      if (w < 8 || h < 8) ctx.fail(`${what} has no room: ${Math.round(w)} \xD7 ${Math.round(h)}`);
      const leaf = !r.children?.length;
      const state2 = r.state ?? "present";
      const surface = r.surface ?? (leaf ? "sunken" : "none");
      const stroke = r.emphasis ? ctx.emphasis("place", what) : state2 === "degraded" ? WARN : state2 === "absent" ? MUTED : r.strong ? INK : surface === "none" ? void 0 : SUBTLE;
      const boxed = Boolean(stroke) || surface !== "none";
      if (boxed) {
        out.push(
          rect(x, y, w, h, {
            fill: state2 !== "present" || surface === "none" ? "none" : surface === "raised" ? RAISED : SUNKEN,
            stroke,
            width: r.emphasis || r.strong ? 2 : state2 === "present" ? 1 : 1.5,
            radius: 4,
            dashed: state2 !== "present"
          })
        );
      }
      if (r.hidden) out.push(hatch(x + 1, y + 1, w - 2, h - 2));
      const bar = h <= 40;
      const head = bar ? y + h / 2 : y + 15;
      let top = y + 8;
      if (r.label) {
        const space = w - 16 - (r.marker ? 26 : 0);
        const face = r.head ? { size: SIZE.body, face: "sans", weight: 600 } : r.plain ? { size: SIZE.label, face: "sans" } : { size: SIZE.label, face: "mono" };
        out.push(text(x + 8, head + 4.5, fit(r.label, space, face, what), { ...face, fill: r.head ? INK : MUTED }));
        top = y + ctx.pick(28, 24);
      }
      if (r.marker) out.push(marker(x + w - 15, head, r.marker));
      if (leaf) {
        for (let i = 0; i < (r.icons ?? 0); i++) out.push(rect(x + w / 2 - 5, top + i * 16, 10, 10, { stroke: INK, width: 1.2, radius: 2 }));
        for (let i = 0; i < (r.lines ?? 0); i++) {
          const ly = top + i * 12;
          if (ly + 6 > y + h - 6) {
            const need = Math.ceil(top - y + ((r.lines ?? 0) - 1) * 12 + 12);
            ctx.fail(`${what}: ${r.lines} lines need a height of ${need}, and it has ${Math.round(h)}`);
          }
          out.push(rect(x + 8, ly, (w - 16) * (LENGTHS[i % LENGTHS.length] ?? 1), 6, { fill: STRONG, radius: 2 }));
        }
        if (r.widgets?.length) controls(r, x, r.lines ? top + r.lines * 12 + 4 : top, w, y + h, out, ctx, what);
        return;
      }
      const children = r.children ?? [];
      const across = r.split === "row";
      const pad = boxed ? INSET2 : 0;
      const ix = x + pad;
      const iy = r.label ? top - 4 : y + pad;
      const iw = w - 2 * pad;
      const ih = y + h - pad - iy;
      const length = across ? iw : ih;
      const fixed = children.reduce((sum2, c) => sum2 + (c.size ?? 0), 0);
      const flexible = children.filter((c) => c.size === void 0).length;
      const share = flexible ? (length - fixed - (children.length - 1) * INSET2) / flexible : 0;
      if (flexible && share < 8) ctx.fail(`${what}: its children need ${Math.ceil((8 - share) * flexible)} more ${across ? "width" : "height"} than it has`);
      let at = across ? ix : iy;
      for (const c of children) {
        const l = c.size ?? share;
        if (across) region2(c, at, iy, l, ih, out, ctx);
        else region2(c, ix, at, iw, l, out, ctx);
        at += l + INSET2;
      }
    };
    band = (r, x, y, w, out, ctx) => {
      const what = `band ${r.label ?? ""}`.trim();
      const widgets = r.widgets ?? [];
      const pad = ctx.pick(12, 8);
      const labelW = r.label ? measure(r.label, SIZE.label, "mono") + 24 : 0;
      const placed2 = grid(widgets, r.across ?? widgets.length, x + pad + labelW, y + pad, w - 2 * pad - labelW, ctx, what);
      const h = Math.max(placed2.height, 20) + 2 * pad;
      out.push(rect(x, y, w, h, { stroke: MUTED, width: 1.5, radius: 4, dashed: true }));
      if (r.label) out.push(text(x + pad + 4, y + h / 2 + 4.5, r.label, { size: SIZE.label, face: "mono", fill: MUTED }));
      out.push(placed2.svg);
      return y + h;
    };
    grid = (widgets, across, x, y, w, ctx, what) => {
      if (!Number.isInteger(across) || across < 1) ctx.fail(`${what}: across=${across} is not a count of columns`);
      const gap = 8;
      const cw = (w - (across - 1) * gap) / across;
      const out = [];
      let cy = y;
      for (let i = 0; i < widgets.length; i += across) {
        let rowH = 0;
        widgets.slice(i, i + across).forEach((wd, j) => {
          const placed2 = widget(wd, x + j * (cw + gap), cy, cw, ctx, what);
          out.push(placed2.svg);
          rowH = Math.max(rowH, placed2.height);
        });
        cy += rowH + gap;
      }
      return { svg: out.join(""), height: widgets.length ? cy - gap - y : 0 };
    };
    controls = (r, x, top, w, bottom, out, ctx, what) => {
      const widgets = r.widgets ?? [];
      const pad = w < 40 ? 4 : 10;
      if (r.across) {
        const placed2 = grid(widgets, r.across, x + pad, top, w - 2 * pad, ctx, what);
        out.push(placed2.svg);
        const short2 = Math.ceil(top + placed2.height - (bottom - 8));
        if (short2 > 0) ctx.fail(`${what}: its controls are ${Math.round(placed2.height)} high, ${short2} more than its room. Give the region ${short2} more size, or the sketch ${short2} more height`);
        return;
      }
      if (r.flow === "row") {
        const label = r.label ? fit(r.label, w, { size: SIZE.label, face: "mono" }, what) : "";
        const start = x + pad + (label ? 0 : 0);
        const fixed = widgets.reduce((sum2, wd) => sum2 + naturalWidth(wd) + ("marker" in wd && wd.marker ? 28 : 0), 0);
        const flexible = widgets.filter((wd) => naturalWidth(wd) === 0).length;
        const used = fixed + (widgets.length - 1) * 10;
        const share = flexible ? (w - 2 * pad - used) / flexible : 0;
        if (flexible ? share < 24 : used > w - 2 * pad + 0.5) ctx.fail(`${what}: its controls are ${Math.ceil(used + (flexible ? 24 * flexible : 0))} wide, and its room is ${Math.floor(w - 2 * pad)}`);
        let cx = r.label ? x + w - pad - fixed - share * flexible - (widgets.length - 1) * 10 : start;
        const mid = r.label ? top - 28 + (bottom - top + 28) / 2 : top + (bottom - top) / 2;
        for (const wd of widgets) {
          const ww = naturalWidth(wd) || share;
          const own = ["button", "tabs", "chip", "tools", "keycap", "toolbar"].includes(wd.w);
          const marked = !own && "marker" in wd && wd.marker ? wd.marker : "";
          const placed2 = widget(marked ? { ...wd, marker: void 0 } : wd, cx, mid - ctx.pick(14, 12), ww, ctx, what);
          out.push(placed2.svg);
          if (marked) out.push(marker(cx + ww + 14, mid, marked));
          cx += Math.max(placed2.width, ww) + (marked ? 28 : 0) + 10;
        }
        return;
      }
      const step = ctx.pick(10, 6);
      let cy = top + 4;
      for (const wd of widgets) {
        const marked = "marker" in wd && wd.marker && !wd.corner ? 18 : 0;
        const ww = naturalWidth(wd) && wd.w !== "text" ? Math.min(naturalWidth(wd), w - 2 * pad) : w - 2 * pad - marked;
        const placed2 = widget(wd, x + pad, cy, ww, ctx, what);
        out.push(placed2.svg);
        cy += placed2.height + step;
      }
      const short = Math.ceil(cy - step - (bottom - 4));
      if (short > 0) ctx.fail(`${what}: its controls are ${Math.round(cy - top)} high, ${short} more than its room. Give the region ${short} more size, or the sketch ${short} more height`);
    };
  }
});

// packages/frontend/src/lib/diagram/tiles.ts
var PAD, GAP2, tiles2;
var init_tiles = __esm({
  "packages/frontend/src/lib/diagram/tiles.ts"() {
    "use strict";
    init_paint();
    init_text();
    PAD = 20;
    GAP2 = 24;
    tiles2 = (spec, room, ctx) => {
      const perRow = spec.columns ?? Math.min(spec.tiles.length, 4);
      const w = (room.width - (perRow - 1) * GAP2) / perRow;
      const inner = w - 2 * PAD;
      const laid = spec.tiles.map((t) => {
        const what = `${ctx.name}: tile ${t.label}`;
        const value = fit(t.value, inner - (t.sign ? 36 : 0), { size: SIZE.title, weight: 600 }, what);
        const valueW = measure(value, SIZE.title, "sans", 600);
        const unit = t.unit ? fit(t.unit, inner - valueW - 8, { size: SIZE.lead }, what) : "";
        const label = wrap(t.label, spec.aside ? inner - valueW - 12 : inner, { size: SIZE.node, weight: 600 }, what);
        const body = t.body ? wrap(t.body, inner, { size: SIZE.body }, what) : [];
        const head = spec.aside ? Math.max(40, label.length * 22 + (t.unit ? 20 : 0)) + 16 : 40 + 12 + label.length * 22;
        const h = PAD + head + (body.length ? 6 + body.length * 20 : 0) + PAD - 6;
        return { t, value, valueW, unit, label, body, h };
      });
      const out = [];
      let y = room.y;
      for (let start = 0; start < laid.length; start += perRow) {
        const row2 = laid.slice(start, start + perRow);
        const h = Math.max(...row2.map((r) => r.h));
        row2.forEach((r, i) => {
          const x = room.x + i * (w + GAP2);
          const state2 = r.t.state ?? "present";
          const stroke = r.t.emphasis ? ctx.emphasis("tile", `tile ${r.t.label}`) : state2 === "degraded" ? WARN : state2 === "absent" ? MUTED : SUBTLE;
          out.push(
            rect(x, y, w, h, {
              fill: state2 === "present" ? RAISED : "none",
              stroke,
              width: r.t.emphasis ? 2 : state2 === "present" ? 1 : 1.5,
              radius: 6,
              dashed: state2 !== "present"
            })
          );
          const quiet = state2 === "absent";
          if (spec.aside) {
            const top = Math.max(40, r.label.length * 22 + (r.t.unit ? 20 : 0));
            out.push(text(x + w - PAD, y + PAD + 32, r.value, { size: SIZE.title, weight: 600, spacing: -0.5, anchor: "end", fill: quiet ? MUTED : void 0 }));
            r.label.forEach((l, j) => out.push(text(x + PAD, y + PAD + 16 + j * 22, l, { size: SIZE.node, weight: 600, fill: quiet ? MUTED : void 0 })));
            if (r.unit) out.push(text(x + PAD, y + PAD + 16 + r.label.length * 22, r.unit, { size: SIZE.body, fill: SECONDARY }));
            out.push(line(x + PAD, y + PAD + top + 8, x + w - PAD, y + PAD + top + 8, SUBTLE));
            r.body.forEach((l, j) => out.push(text(x + PAD, y + PAD + top + 16 + 6 + 14 + j * 20, l, { size: SIZE.body, fill: SECONDARY })));
            return;
          }
          let ty = y + PAD + 32;
          if (r.t.sign) out.push(sign(r.t.sign, x + PAD + 10, ty - 12));
          const vx = x + PAD + (r.t.sign ? 36 : 0);
          const value = text(vx, ty, r.value, { size: SIZE.title, weight: 600, spacing: -0.5, fill: quiet ? MUTED : void 0 });
          out.push(r.unit ? value.replace("</text>", `<tspan dx="8" font-size="${SIZE.lead}" font-weight="400" letter-spacing="0" fill="${SECONDARY}">${escape(r.unit)}</tspan></text>`) : value);
          ty += 8;
          for (const l of r.label) {
            ty += 22;
            out.push(text(x + PAD, ty, l, { size: SIZE.node, weight: 600, fill: quiet ? MUTED : void 0 }));
          }
          if (r.body.length) ty += 6;
          for (const l of r.body) {
            ty += 20;
            out.push(text(x + PAD, ty, l, { size: SIZE.body, fill: SECONDARY }));
          }
        });
        y += h + GAP2;
      }
      return { svg: out.join("\n"), height: y - GAP2 - room.y };
    };
  }
});

// packages/frontend/src/lib/diagram/units.ts
var SQUARE, STEP2, ROW_GAP2, units2;
var init_units = __esm({
  "packages/frontend/src/lib/diagram/units.ts"() {
    "use strict";
    init_paint();
    init_text();
    SQUARE = 15;
    STEP2 = 21;
    ROW_GAP2 = 48;
    units2 = (spec, room, ctx) => {
      const lines5 = spec.lines ?? 4;
      const widest = Math.max(
        ...spec.rows.map((r) => measure(r.label, SIZE.body, "sans", 600)),
        ...spec.rows.flatMap((r) => (r.sub ?? []).map((s) => measure(s, SIZE.label, "mono"))),
        spec.head ? measure(spec.head, SIZE.label, "mono") : 0
      );
      const labelW = Math.min(widest + 40, room.width * 0.4);
      const x0 = room.x + labelW;
      const out = [];
      let y = room.y;
      if (spec.head || spec.key) {
        if (spec.head) out.push(text(room.x, y + 13, spec.head, { size: SIZE.label, face: "mono", fill: MUTED }));
        if (spec.key) out.push(text(x0, y + 13, fit(spec.key, room.width - labelW, { size: SIZE.label, face: "mono" }, `${ctx.name}: the key`), { size: SIZE.label, face: "mono", fill: MUTED }));
        y += 40;
      }
      for (const row2 of spec.rows) {
        const what = `${ctx.name}: row ${row2.label}`;
        const total = row2.parts.reduce((sum2, p) => sum2 + p.count, 0);
        const columns3 = Math.ceil(total / lines5);
        if (x0 + columns3 * STEP2 - (STEP2 - SQUARE) > room.x + room.width + 0.5) ctx.fail(`${what}: ${total} squares in ${lines5} lines run past the edge`);
        const label = wrap(row2.label, labelW - 24, { size: SIZE.body, weight: 600 }, what);
        let ty = y + 13;
        for (const l of label) {
          out.push(text(room.x, ty, l, { size: SIZE.body, weight: 600 }));
          ty += 19;
        }
        for (const s of row2.sub ?? []) {
          out.push(text(room.x, ty + 2, fit(s, labelW - 24, { size: SIZE.label, face: "mono" }, what), { size: SIZE.label, face: "mono", fill: SECONDARY }));
          ty += 19;
        }
        const colour = row2.emphasis ? ctx.emphasis("row", `row ${row2.label}`) : INK;
        let i = 0;
        let missingFrom;
        let missingState;
        for (const part of row2.parts) {
          const state2 = part.state ?? "present";
          if (state2 !== "present") [missingFrom, missingState] = [Math.floor(i / lines5), state2];
          for (let n = 0; n < part.count; n++, i++) {
            const sx = x0 + Math.floor(i / lines5) * STEP2;
            const sy = y + i % lines5 * STEP2;
            out.push(
              state2 === "present" ? rect(sx, sy, SQUARE, SQUARE, { fill: colour, radius: 2 }) : rect(sx, sy, SQUARE, SQUARE, { stroke: state2 === "degraded" ? WARN : MUTED, radius: 2, dashed: true })
            );
          }
        }
        let bottom = Math.max(ty - 13, y + lines5 * STEP2);
        if (row2.missing && missingFrom !== void 0) {
          const mx = x0 + missingFrom * STEP2;
          out.push(text(mx, y + lines5 * STEP2 + 16, fit(row2.missing, room.x + room.width - mx, { size: SIZE.label }, what), { size: SIZE.label, fill: missingState === "degraded" ? WARN : MUTED }));
          bottom = Math.max(bottom, y + lines5 * STEP2 + 20);
        }
        y = bottom + ROW_GAP2;
      }
      return { svg: out.join("\n"), height: y - ROW_GAP2 - room.y };
    };
  }
});

// packages/frontend/src/lib/diagram/cells.ts
var CELL_H, HEAD, cells2, boxedGroups;
var init_cells = __esm({
  "packages/frontend/src/lib/diagram/cells.ts"() {
    "use strict";
    init_paint();
    init_text();
    CELL_H = 64;
    HEAD = 52;
    cells2 = (spec, room, ctx) => {
      const [pad, GAP4, GROUP_GAP] = ctx.pick([20, 6, 40], [10, 4, 20]);
      const cellW = Math.max(...spec.groups.flatMap((g) => g.cells.map((c) => measure(c.id, SIZE.node, "mono", 600))), 30) + pad;
      const out = [];
      const used = /* @__PURE__ */ new Set();
      let x = room.x;
      let y = room.y;
      if (spec.boxed) {
        y = boxedGroups(spec, room, ctx, used, out);
      }
      for (const g of spec.boxed ? [] : spec.groups) {
        const what = `${ctx.name}: group ${g.title}`;
        const w = Math.max(
          g.cells.length * (cellW + GAP4) - GAP4,
          measure(g.title, SIZE.node, "sans", 600),
          g.sub ? measure(g.sub, SIZE.body, "sans", g.tone ? 600 : 400) : 0
        );
        if (w > room.width) ctx.fail(`${what} is wider than the drawing: ${g.cells.length} cells`);
        if (x > room.x && x + w > room.x + room.width) {
          x = room.x;
          y += HEAD + CELL_H + 32;
        }
        out.push(text(x, y + 16, fit(g.title, w, { size: SIZE.node, weight: 600 }, what), { size: SIZE.node, weight: 600 }));
        if (g.sub) out.push(text(x, y + 38, g.sub, g.tone ? { size: SIZE.body, weight: 600, fill: TONE[g.tone] } : { size: SIZE.body, fill: SECONDARY }));
        g.cells.forEach((c, i) => {
          const cx = x + i * (cellW + GAP4);
          const state2 = c.state ?? "present";
          const stroke = c.emphasis ? ctx.emphasis("cell", `cell ${c.id}`) : state2 === "degraded" ? WARN : state2 === "absent" ? MUTED : SUBTLE;
          out.push(
            rect(cx, y + HEAD, cellW, CELL_H, {
              fill: state2 === "present" ? RAISED : "none",
              stroke,
              width: c.emphasis ? 2 : state2 === "present" ? 1 : 1.5,
              radius: 4,
              dashed: state2 !== "present"
            })
          );
          out.push(text(cx + cellW / 2, y + HEAD + 24, c.id, { size: SIZE.node, face: "mono", weight: 600, anchor: "middle", fill: state2 === "absent" ? MUTED : void 0 }));
          if (c.sign) {
            used.add(c.sign);
            out.push(sign(c.sign, cx + cellW / 2, y + HEAD + 45));
          }
        });
        x += w + GROUP_GAP;
      }
      if (!spec.boxed) y += HEAD + CELL_H;
      if (used.size && ctx.legend) {
        y += 34;
        let lx = room.x;
        for (const s of ["yes", "partly", "no", "unknown", "dot", "ring", "page", "panel", "both", "form", "bar", "nav"]) {
          if (!used.has(s)) continue;
          const word = spec.legend?.[s] ?? SIGN_MEANING[s];
          const lw = 32 + measure(word, SIZE.body, "sans", 600) + 32;
          if (lx + lw > room.x + room.width + 32) {
            lx = room.x;
            y += 26;
          }
          out.push(sign(s, lx + 11, y - 5));
          out.push(text(lx + 32, y, word, { size: SIZE.body, weight: 600 }));
          lx += lw;
        }
        y += 6;
      }
      return { svg: out.join("\n"), height: y - room.y };
    };
    boxedGroups = (spec, room, ctx, used, out) => {
      const [pad, gap, step] = ctx.pick([12, 12, 32], [10, 10, 34]);
      const need = spec.groups.map(
        (g) => Math.max(g.cells.length * step, measure(g.title, SIZE.node, "sans", 600), g.sub ? measure(g.sub, SIZE.body, "sans", g.tone ? 600 : 400) : 0) + 2 * pad
      );
      const sum2 = need.reduce((a, b) => a + b, 0) + (spec.groups.length - 1) * gap;
      if (sum2 > room.width) ctx.fail(`the boxed groups are ${Math.ceil(sum2)} wide, and the drawing is ${Math.floor(room.width)}`);
      const extra = (room.width - sum2) / spec.groups.length;
      const h = ctx.pick(112, 104);
      let x = room.x;
      spec.groups.forEach((g, i) => {
        const w = (need[i] ?? 0) + extra;
        out.push(rect(x, room.y, w, h, { fill: RAISED, stroke: SUBTLE, radius: 6 }));
        out.push(text(x + pad, room.y + pad + 14, g.title, { size: SIZE.node, weight: 600 }));
        g.cells.forEach((c, j) => {
          const cx = x + pad + j * step + step / 2;
          const stroke = c.emphasis ? ctx.emphasis("cell", `cell ${c.id}`) : void 0;
          out.push(text(cx, room.y + pad + 40, c.id, { size: SIZE.label, face: "mono", weight: 600, anchor: "middle", fill: stroke ?? ((c.state ?? "present") === "absent" ? MUTED : SECONDARY) }));
          if (c.sign) {
            used.add(c.sign);
            out.push(sign(c.sign, cx, room.y + pad + 58));
          }
        });
        if (g.sub) out.push(text(x + pad, room.y + h - pad, g.sub, g.tone ? { size: SIZE.body, weight: 600, fill: TONE[g.tone] } : { size: SIZE.body, fill: SECONDARY }));
        x += w + gap;
      });
      return room.y + h;
    };
  }
});

// packages/frontend/src/lib/diagram/chips.ts
var H, GAP3, TIGHT_GAP, RING_H, width, chip, chips2;
var init_chips = __esm({
  "packages/frontend/src/lib/diagram/chips.ts"() {
    "use strict";
    init_paint();
    init_text();
    H = 30;
    GAP3 = 8;
    TIGHT_GAP = 4;
    RING_H = 18;
    width = (c) => Math.max(measure(c.id, SIZE.label, "mono", 600) + 20, 44);
    chip = (c, x, y, w, ctx) => {
      const kind = c.kind ?? "filled";
      const stroke = c.emphasis ? ctx.emphasis("chip", `chip ${c.id}`) : kind === "outline" ? INK : void 0;
      const out = [
        kind === "plain" && !c.emphasis ? "" : rect(x, y, w, H, { fill: kind === "filled" ? INK : "none", stroke, width: stroke ? 2 : 1, radius: 4 }),
        text(x + w / 2, y + 20, c.id, { size: SIZE.label, face: "mono", weight: 600, anchor: "middle", fill: kind === "filled" ? CANVAS : kind === "plain" ? MUTED : INK })
      ];
      if (c.ring) out.push(circle(x + w / 2, y + H + 11, 5.5, "none", INK) + circle(x + w / 2, y + H + 11, 2.5, INK));
      return out.join("");
    };
    chips2 = (spec, room, ctx) => {
      const out = [];
      let y = room.y;
      if (spec.direction === "columns") {
        const n = spec.groups.length;
        const colW = room.width / n;
        const across = spec.across ?? 2;
        const cw = (colW - 20 - (across - 1) * GAP3) / across;
        let bottom = y;
        spec.groups.forEach((g, i) => {
          const x = room.x + i * colW + 10;
          let cy = y;
          for (const l of wrap(g.label, colW - 20, { size: SIZE.node, weight: 600 }, `${ctx.name}: column ${g.label}`)) {
            out.push(text(x, cy + 16, l, { size: SIZE.node, weight: 600 }));
            cy += 22;
          }
          for (const l of g.sub ?? []) {
            out.push(text(x, cy + 14, fit(l, colW - 20, { size: SIZE.body }, `${ctx.name}: column ${g.label}`), { size: SIZE.body, fill: SECONDARY }));
            cy += 19;
          }
          cy += 16;
          for (const task of g.tasks ?? []) {
            const lines5 = wrap(task, colW - 44, { size: SIZE.body }, `${ctx.name}: a task of ${g.label}`);
            const h = lines5.length * 18 + 14;
            out.push(rect(x, cy, colW - 20, h, { fill: SUNKEN, radius: 4 }));
            lines5.forEach((l, j) => out.push(text(x + 12, cy + 20 + j * 18, l, { size: SIZE.body })));
            cy += h + GAP3;
          }
          g.chips.forEach((c, j) => {
            if (width(c) > cw + 0.5) ctx.fail(`chip ${c.id} is wider than its place in ${g.label}`);
            const row2 = Math.floor(j / across);
            const rowH = H + GAP3 + (g.chips.slice(row2 * across, row2 * across + across).some((k) => k.ring) ? RING_H : 0);
            if (j % across === 0 && j) cy += rowH;
            out.push(chip(c, x + j % across * (cw + GAP3), cy, cw, ctx));
          });
          if (g.chips.length) cy += H + (g.chips.slice(-across).some((k) => k.ring) ? RING_H : 0);
          bottom = Math.max(bottom, cy);
        });
        for (let i = 1; i < n; i++) out.push(line(room.x + i * colW, y, room.x + i * colW, bottom + 8, SUBTLE));
        y = bottom + 8;
      } else {
        const labelW = Math.max(
          ...spec.groups.map((g) => measure(g.label, SIZE.node, "sans", 600)),
          ...spec.groups.flatMap((g) => (g.sub ?? []).map((s) => measure(s, SIZE.body)))
        ) + 32;
        const all = spec.groups.flatMap((g) => g.chips);
        const tightest = Math.max(0, ...all.map((c) => measure(c.id, SIZE.label, "mono", 600) + ((c.kind ?? "filled") === "plain" ? 2 : 10)));
        const longest = Math.max(1, ...spec.groups.map((g) => g.chips.length));
        const free = room.width - labelW;
        const even = Math.max(...all.map(width), 0);
        const fits = (w, gap2) => longest * w + (longest - 1) * gap2 <= free + 0.5;
        const gap = fits(even, GAP3) ? GAP3 : TIGHT_GAP;
        const uniform = fits(even, gap) ? even : Math.max(tightest, (free - (longest - 1) * gap) / longest);
        for (const g of spec.groups) {
          const what = `${ctx.name}: row ${g.label}`;
          out.push(text(room.x, y + 18, fit(g.label, labelW - 24, { size: SIZE.node, weight: 600 }, what), { size: SIZE.node, weight: 600 }));
          (g.sub ?? []).forEach((s, i) => out.push(text(room.x, y + 38 + i * 19, s, { size: SIZE.body, fill: SECONDARY })));
          let x = room.x + labelW;
          let line0 = y;
          let ringed = false;
          for (const c of g.chips) {
            const w = uniform;
            if (x + w > room.x + room.width + 0.5) {
              line0 += H + GAP3 + (ringed ? RING_H : 0);
              x = room.x + labelW;
              ringed = false;
            }
            out.push(chip(c, x, line0, w, ctx));
            ringed ||= Boolean(c.ring);
            x += w + gap;
          }
          y = Math.max(line0 + H + (ringed ? RING_H : 0), y + 22 + (g.sub?.length ?? 0) * 19) + 28;
        }
        y -= 12;
      }
      if (spec.legend?.length && ctx.legend) {
        y += 20;
        let x = room.x;
        for (const entry of spec.legend) {
          const sample = entry.kind === "ring" ? { id: "", kind: "plain", ring: true } : { id: "ID", kind: entry.kind };
          const w = entry.kind === "ring" ? 12 : width(sample);
          const lw = w + 10 + measure(entry.label, SIZE.body) + 28;
          if (x + lw > room.x + room.width + 28) {
            x = room.x;
            y += 32;
          }
          if (entry.kind === "ring") out.push(circle(x + 6, y + 15, 5.5, "none", INK) + circle(x + 6, y + 15, 2.5, INK));
          else out.push(chip(sample, x, y, w, ctx));
          out.push(text(x + w + 10, y + 20, entry.label, { size: SIZE.body, fill: SECONDARY }));
          x += lw;
        }
        y += H;
      }
      return { svg: out.join("\n"), height: y - room.y };
    };
  }
});

// packages/frontend/src/lib/diagram/notes.ts
var notes2;
var init_notes = __esm({
  "packages/frontend/src/lib/diagram/notes.ts"() {
    "use strict";
    init_paint();
    init_text();
    notes2 = (spec, room, ctx) => {
      const out = [];
      let y = room.y;
      for (const n of spec.notes) {
        const what = `${ctx.name}: note ${n.marker}`;
        const title = wrap(n.title, room.width - 36, { size: SIZE.node, weight: 600 }, what);
        const body = n.body ? wrap(n.body, room.width - 36, { size: SIZE.body }, what) : [];
        out.push(marker(room.x + 11, y + 11, n.marker));
        title.forEach((l, i) => out.push(text(room.x + 36, y + 16 + i * 21, l, { size: SIZE.node, weight: 600 })));
        body.forEach((l, i) => out.push(text(room.x + 36, y + 16 + title.length * 21 + i * 19, l, { size: SIZE.body, fill: SECONDARY })));
        y += title.length * 21 + body.length * 19 + 12;
      }
      return { svg: out.join("\n"), height: y - 12 - room.y };
    };
  }
});

// packages/frontend/src/lib/diagram/draw.ts
var WIDTH, MARGIN, BODY, layout, PART_LABEL, compose2, draw2;
var init_draw = __esm({
  "packages/frontend/src/lib/diagram/draw.ts"() {
    "use strict";
    init_bars();
    init_columns();
    init_context();
    init_flow();
    init_matrix();
    init_paint();
    init_text();
    init_sequence();
    init_sketch();
    init_tiles();
    init_units();
    init_cells();
    init_chips();
    init_notes();
    WIDTH = 1200;
    MARGIN = 60;
    BODY = WIDTH - 2 * MARGIN;
    layout = (spec, room, ctx) => {
      switch (spec.kind) {
        case "flow":
          return flow2(spec, room, ctx);
        case "sequence":
          return sequence2(spec, room, ctx);
        case "matrix":
          return matrix2(spec, room, ctx);
        case "tiles":
          return tiles2(spec, room, ctx);
        case "columns":
          return columns2(spec, room, ctx);
        case "bars":
          return bars2(spec, room, ctx);
        case "sketch":
          return sketch2(spec, room, ctx);
        case "units":
          return units2(spec, room, ctx);
        case "chips":
          return chips2(spec, room, ctx);
        case "cells":
          return cells2(spec, room, ctx);
        case "notes":
          return notes2(spec, room, ctx);
        case "compose":
          return compose2(spec, room, ctx);
      }
    };
    PART_LABEL = 30;
    compose2 = (spec, room, ctx) => {
      const across = (spec.direction ?? "row") === "row";
      const gap = spec.gap ?? (across ? ctx.pick(48, 32) : ctx.pick(36, 20));
      const total = spec.parts.reduce((sum2, p) => sum2 + (p.weight ?? 1), 0);
      const free = room.width - (spec.parts.length - 1) * gap;
      const out = [];
      let x = room.x;
      let y = room.y;
      let bottom = room.y;
      const legendOf = (p) => {
        if (!("legend" in p) || !p.legend) return "";
        const entries = Array.isArray(p.legend) ? p.legend.map((e) => `${"sign" in e ? e.sign ?? "" : "tone" in e ? e.tone : "kind" in e ? e.kind : ""}=${e.label}`) : Object.entries(p.legend).map(([k, v]) => `${k}=${String(v)}`);
        return entries.sort().join("|");
      };
      for (const [i, part] of spec.parts.entries()) {
        const w = across ? free * (part.weight ?? 1) / total : room.width;
        let top = y;
        if (part.label) {
          out.push(text(x, top + 13, fit(part.label.toUpperCase(), w, { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8 }, `${ctx.name}: a part`), { size: SIZE.label, face: "mono", weight: 600, spacing: 0.8, fill: MUTED }));
          top += ctx.pick(PART_LABEL, 22);
        }
        ctx.legend = !legendOf(part.spec) || !spec.parts.slice(i + 1).some((p) => legendOf(p.spec) === legendOf(part.spec));
        const drawn2 = layout(part.spec, { x, y: top, width: w }, ctx);
        ctx.legend = true;
        if (spec.chain && across && i > 0) {
          const ay = top + ctx.pick(28, 24);
          out.push(connector([[x - gap + 6, ay], [x - 6, ay]]));
        }
        if (drawn2.width) ctx.fail(`a part needs ${drawn2.width} across, and its room is ${Math.floor(w)}`);
        out.push(drawn2.svg);
        bottom = Math.max(bottom, top + drawn2.height);
        if (across) x += w + gap;
        else y = top + drawn2.height + gap;
      }
      return { svg: out.join("\n"), height: (across ? bottom : y - gap) - room.y };
    };
    draw2 = (spec, options) => {
      const { name } = options;
      const slide = options.slide ?? spec.slide;
      const ctx = new Context(options.name, spec.claim, Boolean(options.slide));
      let body;
      let width2;
      let height;
      let fill;
      if (slide) {
        const ways = spec.kind === "flow" ? folds(spec, slide.width) : [spec];
        const squeezes = ctx.dense && JSON.stringify(spec).includes('"sketch"') ? [1, 0.95, 0.9, 0.85, 0.8, 0.7] : [1];
        let drawn2;
        let first;
        for (const way of ways.flatMap((w) => squeezes.map((s) => [w, s]))) {
          try {
            ctx.squeeze = way[1];
            drawn2 = ctx.attempt(() => {
              const tried = layout(way[0], { x: 0, y: 0, width: slide.width }, ctx);
              if (tried.width) ctx.fail(`the drawing needs ${tried.width} across, and the slide's room is ${slide.width}`);
              if (tried.height > slide.height + 0.5) ctx.fail(`the drawing is ${Math.ceil(tried.height)} high, and the slide's room is ${slide.height}`);
              return tried;
            });
            break;
          } catch (error) {
            first ??= error;
          }
        }
        if (!drawn2) throw first;
        ({ width: width2 } = slide);
        height = Math.ceil(drawn2.height);
        fill = drawn2.height / slide.height;
        body = drawn2.svg;
      } else {
        const drawn2 = layout(spec, { x: MARGIN, y: MARGIN, width: BODY }, ctx);
        width2 = Math.max(WIDTH, (drawn2.width ?? 0) + 2 * MARGIN);
        height = Math.ceil(drawn2.height + 2 * MARGIN);
        body = [rect(0, 0, width2, height, { fill: CANVAS }), drawn2.svg].join("\n");
      }
      const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="${width2}" height="${height}" viewBox="0 0 ${width2} ${height}" role="img" aria-labelledby="${name}-title ${name}-desc">
<title id="${name}-title">${escape(spec.title)}</title>
<desc id="${name}-desc">${escape(spec.description)}</desc>
<g id="soul-ref">
${body}
</g>
</svg>
`;
      return fill === void 0 ? { svg: svg2, width: width2, height } : { svg: svg2, width: width2, height, fill };
    };
  }
});

// packages/frontend/src/lib/diagram/engine.ts
var engine_exports = {};
__export(engine_exports, {
  draw: () => draw2,
  parse: () => parse
});
var init_engine = __esm({
  "packages/frontend/src/lib/diagram/engine.ts"() {
    "use strict";
    init_parse();
    init_draw();
  }
});

// packages/frontend/src/components/icon.ts
import { html } from "lit";

// packages/frontend/src/lib/element.ts
import { LitElement } from "lit";
var CONTENT = "data-sds-content";
var TEXT = "text";
function regionOf(node) {
  const el = node.nodeType === 1 ? node : null;
  let children;
  return {
    tag: el?.localName ?? "",
    attrs: el ? Object.fromEntries([...el.attributes].map((a) => [a.name, a.value])) : {},
    node,
    inner: el ? [...el.childNodes] : [],
    text: (node.textContent ?? "").trim(),
    get children() {
      return children ??= el ? [...el.children].map((child) => regionOf(child)) : [];
    }
  };
}
var SdsElement = class extends LitElement {
  static {
    /** The regions an element takes between its tags, by name. A child names
        its region with `slot`, and one with none goes to `text`. */
    this.regions = [];
  }
  createRenderRoot() {
    return this;
  }
  static {
    /** What a caller wrote between the tags, for a renderer that cannot write
        between them. `@lit-labs/ssr` never runs `connectedCallback`, so there are
        no children to lift in Node. A property is the one channel both sides
        have, and it carries markup, which an attribute cannot. Every component
        reads `this.taken ?? this.content`. A property, so a caller who hands
        over another set gets it drawn. */
    this.properties = {
      content: { attribute: false },
      regions: { attribute: false }
    };
  }
  /* The regions a browser read off the children, once. */
  #own = null;
  /** The children of one region. In a browser, off what the caller wrote,
      which leaves the element on the first call. In Node, off `regions`. A
      region nobody wrote is empty. The text region holds every child whose
      `slot` names no region of the element. */
  region(name) {
    if (this.regions) {
      if (name !== TEXT) return this.regions[name] ?? [];
      const named2 = this.constructor.regions;
      return Object.entries(this.regions).flatMap(([key2, list]) => key2 === TEXT || !named2.includes(key2) ? list : []);
    }
    if (typeof this.querySelector !== "function") return [];
    if (!this.#own) {
      const named2 = this.constructor.regions;
      this.#own = /* @__PURE__ */ new Map();
      for (const node of this.lifted().filter((one) => !isBlank(one))) {
        const slot = node.nodeType === 1 ? node.getAttribute("slot") : null;
        const key2 = slot && named2.includes(slot) ? slot : TEXT;
        const list = this.#own.get(key2);
        if (list) list.push(regionOf(node));
        else this.#own.set(key2, [regionOf(node)]);
      }
    }
    return this.#own.get(name) ?? [];
  }
  /** Asked once. These elements render into themselves, so after the first
      render the children are the element's own output. `connectedCallback`
      runs again every time an element moves in the document, and a second
      look lifts that output as what the author wrote. */
  #looked = false;
  /** Lit renders *after* whatever children it finds and does not empty the
      container. So an element that arrives with its own prerendered markup
      holds two copies. The marker says the build wrote that markup; content
      a caller wrote carries none and stays. */
  connectedCallback() {
    if (this.querySelector(`:scope > template[${CONTENT}]`)) {
      for (const node of [...this.childNodes]) node.remove();
    }
    super.connectedCallback();
  }
  /** What a caller wrote between the tags, left where it stands: in the
      template of a prerendered element, as the children otherwise. For an
      element that reads facts out of its children before it takes them. A
      removal runs the removed child's own `connectedCallback`, and that
      takes what stood under it out of reach. */
  standing() {
    const kept2 = this.querySelector(`:scope > template[${CONTENT}]`);
    return kept2 ? [...kept2.content.childNodes] : [...this.childNodes];
  }
  lifted() {
    if (this.#looked) return [];
    this.#looked = true;
    const kept2 = this.querySelector(`:scope > template[${CONTENT}]`);
    const nodes = this.standing();
    if (kept2) for (const node of [...this.childNodes]) node.remove();
    for (const node of nodes) node.remove();
    return nodes;
  }
};
var isBlank = (node) => node.nodeType === 8 || node.nodeType === 3 && !(node.textContent ?? "").trim();
function define(tag, ctor) {
  if (typeof customElements === "undefined") return;
  if (typeof document !== "undefined" && document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => define(tag, ctor), { once: true });
    return;
  }
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

// packages/frontend/src/components/icons.generated.ts
var ICON_IDS = [
  "actions-accessibility",
  "actions-approve",
  "actions-archive",
  "actions-arrow-down",
  "actions-arrow-down-alt",
  "actions-arrow-down-end",
  "actions-arrow-down-end-alt",
  "actions-arrow-down-left",
  "actions-arrow-down-left-alt",
  "actions-arrow-down-right",
  "actions-arrow-down-right-alt",
  "actions-arrow-down-start",
  "actions-arrow-down-start-alt",
  "actions-arrow-end",
  "actions-arrow-end-alt",
  "actions-arrow-end-down",
  "actions-arrow-end-down-alt",
  "actions-arrow-end-up",
  "actions-arrow-end-up-alt",
  "actions-arrow-left",
  "actions-arrow-left-alt",
  "actions-arrow-right",
  "actions-arrow-right-alt",
  "actions-arrow-right-down",
  "actions-arrow-right-down-alt",
  "actions-arrow-right-up",
  "actions-arrow-right-up-alt",
  "actions-arrow-start",
  "actions-arrow-start-alt",
  "actions-arrow-up",
  "actions-arrow-up-alt",
  "actions-aspect-ratio",
  "actions-badge",
  "actions-ban",
  "actions-barcode",
  "actions-barcode-read",
  "actions-barcode-scan",
  "actions-bell",
  "actions-bell-ring",
  "actions-bell-slash",
  "actions-bolt",
  "actions-bolt-alt",
  "actions-book",
  "actions-bookmark",
  "actions-bookmark-add",
  "actions-bookmark-remove",
  "actions-bookmarks",
  "actions-brand-apple",
  "actions-brand-bluesky",
  "actions-brand-discord",
  "actions-brand-facebook",
  "actions-brand-git",
  "actions-brand-github",
  "actions-brand-gitlab",
  "actions-brand-google",
  "actions-brand-instagram",
  "actions-brand-linkedin",
  "actions-brand-linux",
  "actions-brand-mastodon",
  "actions-brand-php",
  "actions-brand-slack",
  "actions-brand-threads",
  "actions-brand-typo3",
  "actions-brand-windows",
  "actions-brand-x",
  "actions-brand-xing",
  "actions-brand-youtube",
  "actions-briefcase",
  "actions-brightness-high",
  "actions-brightness-low",
  "actions-browser",
  "actions-brush",
  "actions-building",
  "actions-bullhorn",
  "actions-bullhorn-slash",
  "actions-calendar",
  "actions-calendar-alternative",
  "actions-canvas",
  "actions-capslock",
  "actions-caret-bar-bottom",
  "actions-caret-bar-end",
  "actions-caret-bar-start",
  "actions-caret-bar-top",
  "actions-caret-down",
  "actions-caret-end",
  "actions-caret-start",
  "actions-caret-up",
  "actions-cart",
  "actions-category",
  "actions-certificate",
  "actions-certificate-alternative",
  "actions-chat",
  "actions-check",
  "actions-check-badge",
  "actions-check-badge-alt",
  "actions-check-circle",
  "actions-check-circle-alt",
  "actions-check-square",
  "actions-check-square-alt",
  "actions-chevron-bar-down",
  "actions-chevron-bar-end",
  "actions-chevron-bar-start",
  "actions-chevron-bar-up",
  "actions-chevron-contract",
  "actions-chevron-double-end",
  "actions-chevron-double-start",
  "actions-chevron-down",
  "actions-chevron-end",
  "actions-chevron-expand",
  "actions-chevron-start",
  "actions-chevron-up",
  "actions-circle",
  "actions-circle-full",
  "actions-circle-half",
  "actions-clipboard",
  "actions-clipboard-close",
  "actions-clipboard-paste",
  "actions-clock",
  "actions-close",
  "actions-cloud",
  "actions-cloud-download",
  "actions-cloud-slash",
  "actions-cloud-upload",
  "actions-code",
  "actions-code-commit",
  "actions-code-compare",
  "actions-code-fork",
  "actions-code-merge",
  "actions-code-merge-localization",
  "actions-code-pull-request",
  "actions-code-pull-request-close",
  "actions-code-pull-request-draft",
  "actions-coffee",
  "actions-cog",
  "actions-cog-alt",
  "actions-comment",
  "actions-container",
  "actions-cookie",
  "actions-cookie-bite",
  "actions-copyright",
  "actions-cpu",
  "actions-credit-card",
  "actions-crop",
  "actions-cut",
  "actions-cut-release",
  "actions-database",
  "actions-database-export",
  "actions-database-import",
  "actions-database-reload",
  "actions-debug",
  "actions-delete",
  "actions-delete-edit",
  "actions-delete-restore",
  "actions-device-desktop",
  "actions-device-desktop-star",
  "actions-device-desktop-user",
  "actions-device-mobile",
  "actions-device-orientation-change",
  "actions-device-tablet",
  "actions-device-unidentified",
  "actions-dice",
  "actions-dice-1",
  "actions-dice-2",
  "actions-dice-3",
  "actions-dice-4",
  "actions-dice-5",
  "actions-dice-6",
  "actions-document",
  "actions-document-add",
  "actions-document-edit",
  "actions-document-edit-access",
  "actions-document-localize",
  "actions-document-move",
  "actions-document-readonly",
  "actions-document-select",
  "actions-document-share",
  "actions-document-synchronize",
  "actions-document-view",
  "actions-dot",
  "actions-download",
  "actions-drag",
  "actions-duplicate",
  "actions-duplicates",
  "actions-envelope",
  "actions-envelope-open",
  "actions-envelope-open-text",
  "actions-exchange",
  "actions-exclamation",
  "actions-exclamation-circle",
  "actions-exclamation-circle-alt",
  "actions-exclamation-triangle",
  "actions-exclamation-triangle-alt",
  "actions-expand",
  "actions-extension",
  "actions-extension-add",
  "actions-extension-import",
  "actions-extension-refresh",
  "actions-extension-remove",
  "actions-eye",
  "actions-eye-link",
  "actions-file",
  "actions-file-add",
  "actions-file-audio",
  "actions-file-certificate",
  "actions-file-csv",
  "actions-file-csv-download",
  "actions-file-edit",
  "actions-file-html",
  "actions-file-image",
  "actions-file-move",
  "actions-file-openoffice",
  "actions-file-pdf",
  "actions-file-search",
  "actions-file-shield",
  "actions-file-t3d",
  "actions-file-t3d-download",
  "actions-file-t3d-upload",
  "actions-file-text",
  "actions-file-video",
  "actions-file-view",
  "actions-filter",
  "actions-folder",
  "actions-folder-add",
  "actions-form-insert-after",
  "actions-form-insert-before",
  "actions-form-insert-in",
  "actions-fullscreen",
  "actions-gift",
  "actions-gift-card",
  "actions-git",
  "actions-globe",
  "actions-globe-alt",
  "actions-graduation-cap",
  "actions-hand-pointer",
  "actions-heart",
  "actions-heart-alt",
  "actions-history",
  "actions-house",
  "actions-hyphen",
  "actions-id-badge",
  "actions-image",
  "actions-infinity",
  "actions-info",
  "actions-info-circle",
  "actions-info-circle-alt",
  "actions-insert",
  "actions-key",
  "actions-lightbulb",
  "actions-lightbulb-on",
  "actions-line-columns",
  "actions-link",
  "actions-list",
  "actions-list-alternative",
  "actions-lock",
  "actions-login",
  "actions-logout",
  "actions-magnet",
  "actions-map",
  "actions-marker",
  "actions-menu",
  "actions-menu-alternative",
  "actions-menu-sidebar-collapsed",
  "actions-menu-sidebar-expanded",
  "actions-message",
  "actions-message-add",
  "actions-message-dots",
  "actions-message-localize",
  "actions-message-remove",
  "actions-microchip",
  "actions-minus",
  "actions-minus-badge",
  "actions-minus-badge-alt",
  "actions-minus-circle",
  "actions-minus-circle-alt",
  "actions-minus-square",
  "actions-minus-square-alt",
  "actions-moon",
  "actions-move",
  "actions-music",
  "actions-music-alt",
  "actions-newspaper",
  "actions-note",
  "actions-notebook",
  "actions-notebook-typoscript",
  "actions-open",
  "actions-options",
  "actions-package",
  "actions-pagetree",
  "actions-pagetree-mount",
  "actions-panel-collapse-end",
  "actions-panel-collapse-start",
  "actions-panel-expand-end",
  "actions-panel-expand-start",
  "actions-paperplane",
  "actions-paste-after",
  "actions-paste-before",
  "actions-pause",
  "actions-percent",
  "actions-percent-badge",
  "actions-phone",
  "actions-placeholder",
  "actions-placeholder-add",
  "actions-play",
  "actions-plus",
  "actions-plus-badge",
  "actions-plus-badge-alt",
  "actions-plus-circle",
  "actions-plus-circle-alt",
  "actions-plus-square",
  "actions-plus-square-alt",
  "actions-preview",
  "actions-qrcode",
  "actions-question",
  "actions-question-circle",
  "actions-question-circle-alt",
  "actions-random",
  "actions-receipt",
  "actions-redo",
  "actions-refresh",
  "actions-rename",
  "actions-replace",
  "actions-rocket",
  "actions-rss",
  "actions-save",
  "actions-save-add",
  "actions-save-close",
  "actions-save-translation",
  "actions-save-translation-clearcache",
  "actions-save-view",
  "actions-search",
  "actions-selection",
  "actions-selection-elements-all",
  "actions-selection-elements-invert",
  "actions-selection-elements-none",
  "actions-server",
  "actions-share",
  "actions-share-alt",
  "actions-shield",
  "actions-shield-star",
  "actions-shield-typo3",
  "actions-soft-hyphen",
  "actions-sort-amount",
  "actions-sort-amount-down",
  "actions-sort-amount-up",
  "actions-square",
  "actions-star",
  "actions-star-alt",
  "actions-store",
  "actions-surfboard",
  "actions-swap",
  "actions-synchronize",
  "actions-table",
  "actions-tag",
  "actions-template",
  "actions-template-new",
  "actions-terminal",
  "actions-text-indent",
  "actions-thumbtack",
  "actions-ticket",
  "actions-toggle-off",
  "actions-toggle-on",
  "actions-translate",
  "actions-triangle",
  "actions-trophy",
  "actions-undo",
  "actions-university",
  "actions-unlink",
  "actions-unlock",
  "actions-upload",
  "actions-user",
  "actions-user-emulate",
  "actions-user-switch",
  "actions-users",
  "actions-variable",
  "actions-variable-add",
  "actions-variable-remove",
  "actions-video",
  "actions-viewmode-compare",
  "actions-viewmode-layout",
  "actions-viewmode-list",
  "actions-viewmode-photos",
  "actions-viewmode-tiles",
  "actions-wallet",
  "actions-wand",
  "actions-wand-sparkles",
  "actions-wave",
  "actions-webhook",
  "actions-window",
  "actions-window-cog",
  "actions-window-open",
  "actions-window-restore",
  "actions-workspace",
  "spinner-circle"
];
var ICON_CATEGORIES = [
  "actions",
  "spinner"
];

// packages/frontend/src/components/icon.ts
var KNOWN = new Set(ICON_IDS);
var SHARED = 500;
var shared = /* @__PURE__ */ new Map();
function once(markup) {
  let made = shared.get(markup);
  if (!made) {
    const strings = Object.assign([markup], { raw: [markup] });
    made = html(strings);
    if (shared.size >= SHARED) shared.delete(shared.keys().next().value);
    shared.set(markup, made);
  }
  return made;
}
var DEFAULT_SIZE = "em";
var INTRINSIC = 16;
function bundledBeside() {
  try {
    return new URL("./assets/icons/sprites/", import.meta.url).href;
  } catch {
    return "assets/icons/sprites/";
  }
}
var spriteDir = bundledBeside();
var setIconSprites = (dir) => {
  spriteDir = dir.endsWith("/") ? dir : `${dir}/`;
};
var glyphs = {};
var inlineIcons = (svgs) => {
  glyphs = { ...glyphs, ...svgs };
};
function spriteFor(id) {
  const category = ICON_CATEGORIES.find((c) => id.startsWith(`${c}-`));
  return `${spriteDir}${category ?? ICON_CATEGORIES[0]}.svg`;
}
var SdsIcon = class extends SdsElement {
  static {
    this.properties = {
      name: { type: String, reflect: true },
      size: { type: Number, reflect: true },
      /** Only for an icon that stands without a label. SKILL.md lists the four
          that can: answered, version-bound, not bootable, a stated boundary.
          Everything else sits beside its own text and hides from assistive
          tech rather than reads out twice. */
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.size = DEFAULT_SIZE;
  }
  render() {
    if (!KNOWN.has(this.name)) {
      throw new Error(`unknown icon "${this.name}" \u2014 add its category to CATEGORIES in scripts/icons.ts and run \`make icons\``);
    }
    const a11y = this.label ? `role="img" aria-label="${this.label}"` : 'aria-hidden="true"';
    const cls = this.getAttribute("class") || "sds-icon";
    const sized = this.size === "em" ? "" : ` style="width:${this.size}px;height:${this.size}px"`;
    const carried = glyphs[this.name];
    const inner = carried ? carried.replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "") : `<use href="${spriteFor(this.name)}#${this.name}"></use>`;
    return once(
      `<svg width="${INTRINSIC}" height="${INTRINSIC}"${sized} class="${cls}" ${a11y} viewBox="0 0 16 16" data-icon="${this.name}">${inner}</svg>`
    );
  }
};
define("sds-icon", SdsIcon);
var iconIds = ICON_IDS;

// packages/frontend/src/components/search.ts
import { html as html6, nothing as nothing2 } from "lit";

// packages/frontend/src/components/search-hits.ts
import { html as html5 } from "lit";

// packages/frontend/src/components/search-result.ts
import { html as html4, nothing } from "lit";

// packages/frontend/src/components/badge.ts
import { html as html2 } from "lit";
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
    const glyph2 = this.icon ?? _SdsBadge.TONE_ICON[this.tone];
    const cls = this.tone === "default" ? "sds-badge" : `sds-badge sds-badge--${this.tone}`;
    return glyph2 ? html2`<span class="${cls}"><sds-icon name="${glyph2}"></sds-icon>${this.label}</span>` : html2`<span class="${cls}">${this.label}</span>`;
  }
};
define("sds-badge", SdsBadge);

// packages/frontend/src/lib/art.ts
import { html as html3 } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
var DRAWING = /\.svg(?:[?#].*)?$/i;
var ESCAPE = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
var attr = (name, value) => value === void 0 || value === "" ? "" : ` ${name}="${String(value).replace(/[&<>"]/g, (c) => ESCAPE[c])}"`;
var exported = (src) => DRAWING.test(src);
function art(src, alt, options = {}) {
  const { cls = "sds-art", width: width2, height } = options;
  const size = attr("width", width2) + attr("height", height);
  const escaped = alt.replace(/[&<>"]/g, (c) => ESCAPE[c]);
  return html3`${unsafeHTML(`<img${attr("class", cls)} src="${src}" alt="${escaped}"${size}>`)}`;
}

// packages/frontend/src/components/search-result.ts
function nearest(hay, words, from) {
  let best;
  for (const word of words) {
    const at = hay.indexOf(word, from);
    if (at === -1) continue;
    if (!best || at < best.at || at === best.at && word.length > best.length) best = { at, length: word.length };
  }
  return best;
}
var SdsSearchResult = class extends SdsElement {
  static {
    this.properties = {
      heading: { type: String },
      href: { type: String },
      path: { type: String },
      snippet: { type: String },
      match: { type: String },
      kind: { type: String },
      meta: { type: String },
      src: { type: String },
      alt: { type: String }
    };
  }
  constructor() {
    super();
    this.heading = "";
    this.href = "#";
    this.path = "";
    this.snippet = "";
    this.match = "";
    this.kind = "";
    this.meta = "";
    this.src = "";
    this.alt = "";
  }
  /** The text with every occurrence of each word of the query in a `<mark>`.
  
        Split rather than replaced, so nothing ever lands as markup. What comes
        back is text nodes and elements, and a query with `<` in it is a query
        and not a tag. */
  marked(text2) {
    const words = this.match.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length || !text2) return text2;
    const out = [];
    const hay = text2.toLowerCase();
    let at = 0;
    for (let next = nearest(hay, words, at); next; next = nearest(hay, words, at)) {
      if (next.at > at) out.push(text2.slice(at, next.at));
      out.push(html4`<mark class="sds-mark">${text2.slice(next.at, next.at + next.length)}</mark>`);
      at = next.at + next.length;
    }
    out.push(text2.slice(at));
    return out;
  }
  /* Beside the text rather than over it. A reader reads a hit as a line, and
     a picture on top of one makes a list of them a grid of cards. Empty `alt`
     where the caller wrote none — the title names the target already, and a
     second name for it is the same page announced twice. */
  thumb() {
    if (!this.src) return nothing;
    const kind = exported(this.src) ? " sds-result__thumb--exported" : "";
    return html4`<div class="sds-result__thumb${kind}">${art(this.src, this.alt)}</div>`;
  }
  /* What kind of thing it is, where it is and what it holds for, on one line.
     The line goes rather than stays empty. A source that reports none of the
     three has no structure to report. A blank first row is a hole above
     every title in the list. */
  above() {
    if (!this.kind && !this.path && !this.meta) return nothing;
    return html4`<span class="sds-row">
      ${this.kind ? html4`<sds-badge label="${this.kind}"></sds-badge>` : nothing}
      ${this.path ? html4`<span class="sds-result__path">${this.path}</span>` : nothing}
      ${this.meta ? html4`<span class="sds-result__meta">${this.meta}</span>` : nothing}
    </span>`;
  }
  /** The whole hit is the link, so the hit *is* an anchor. One element rather
      than a title's anchor stretched over the row by a pseudo-element. That
      is what a card does, and it costs a reader the text selection. Named by
      its heading: without that the link's name is everything in the row read
      out at once. Nowhere to go, no anchor. */
  render() {
    const body = html4`${this.thumb()}
  <span class="sds-result__body">
    ${this.above()}
    <h3 class="sds-result__title">${this.marked(this.heading)}</h3>
    ${this.snippet ? html4`<p class="sds-result__text">${this.marked(this.snippet)}</p>` : nothing}
  </span>`;
    return this.href ? html4`<a class="sds-result" href="${this.href}" aria-label="${this.heading}">${body}</a>` : html4`<article class="sds-result">${body}</article>`;
  }
};
define("sds-search-result", SdsSearchResult);

// packages/frontend/src/components/search-hits.ts
var SEARCHED = "The search covered every page of this site \u2014 its titles and its opening lines. The index does not hold the body of a page, so a word used once deep in one of them does not appear.";
var SdsSearchHits = class extends SdsElement {
  static {
    this.properties = {
      items: { type: Array },
      match: { type: String },
      empty: { type: String }
    };
  }
  constructor() {
    super();
    this.items = [];
    this.match = "";
    this.empty = SEARCHED;
  }
  /** An answer of nothing is an answer: which pages the search covered, and
      what the index leaves out. So a reader can tell a search that found
      nothing from one that broke. */
  nothing() {
    const asked2 = this.match.trim();
    return html5`<div class="sds-hits__empty">
    <div class="sds-surface-title">Nothing here matches${asked2 ? html5` “${asked2}”` : ""}</div>
    ${this.empty.trim() ? html5`<p>${this.empty}</p>` : ""}
  </div>`;
  }
  render() {
    return html5`<div class="sds-hits">
  ${this.items.length ? this.items.map(
      (hit) => html5`<sds-search-result
    heading="${hit.heading}"
    href="${hit.href ?? "#"}"
    path="${hit.path ?? ""}"
    snippet="${hit.snippet ?? ""}"
    kind="${hit.kind ?? ""}"
    meta="${hit.meta ?? ""}"
    src="${hit.src ?? ""}"
    alt="${hit.alt ?? ""}"
    match="${this.match}"
  ></sds-search-result>`
    ) : this.nothing()}
</div>`;
  }
};
define("sds-search-hits", SdsSearchHits);

// packages/frontend/src/lib/flyout.ts
var anchored = () => typeof CSS !== "undefined" && CSS.supports?.("anchor-name", "--a") === true;
function place(panel, anchor, side, gapFrom) {
  const gap = parseFloat(getComputedStyle(panel).getPropertyValue(gapFrom)) || 0;
  panel.style.positionArea = "none";
  let wide = 0;
  const measure2 = () => {
    panel.style.insetInlineEnd = "auto";
    panel.style.insetInlineStart = "0px";
    wide = panel.getBoundingClientRect().width;
  };
  const put = () => {
    const at = anchor.getBoundingClientRect();
    const room = document.documentElement.clientWidth;
    panel.style.insetBlockStart = `${at.bottom + gap}px`;
    const asked2 = side === "end" ? at.right - wide : at.left;
    const other = side === "end" ? at.left : at.right - wide;
    const fits = (x) => x >= 0 && x + wide <= room;
    panel.style.insetInlineStart = `${!fits(asked2) && fits(other) ? other : asked2}px`;
  };
  let frame3 = 0;
  let resized2 = false;
  const soon = () => {
    if (frame3) return;
    frame3 = requestAnimationFrame(() => {
      frame3 = 0;
      if (resized2) measure2();
      resized2 = false;
      put();
    });
  };
  const stop = new AbortController();
  const { signal } = stop;
  measure2();
  put();
  addEventListener("scroll", soon, { capture: true, passive: true, signal });
  addEventListener("resize", () => {
    resized2 = true;
    soon();
  }, { passive: true, signal });
  return () => {
    stop.abort();
    cancelAnimationFrame(frame3);
  };
}

// packages/frontend/src/lib/field-box.ts
function fieldBox({ focused, invalid, filled, disabled, readonly, error, size = "md" }) {
  const cls = ["sds-field"];
  if (size === "sm") cls.push("sds-field--sm");
  else if (size === "lg") cls.push("sds-field--lg");
  if (focused) cls.push("is-focused");
  if (invalid || error) cls.push("is-invalid");
  if (filled) cls.push("is-filled");
  if (disabled) cls.push("is-disabled");
  if (readonly) cls.push("is-readonly");
  return cls.join(" ");
}

// packages/frontend/src/components/search.ts
var seq = 0;
function rank({ title, all }, query, words) {
  if (title === query) return 0;
  if (title.startsWith(query)) return 1;
  if (title.includes(query)) return 2;
  if (words.every((word) => title.includes(word))) return 3;
  return words.every((word) => all.includes(word)) ? 4 : Infinity;
}
var HITS = 8;
var SdsSearch = class extends SdsElement {
  constructor() {
    super();
    this.panelId = `sds-search-${++seq}`;
    /** The anchor this drop stands against, named per instance. One name for
        every field on a page resolves to whichever the browser met last. A bar
        can hold a second search in its drawer. */
    this.anchor = `--${this.panelId}`;
    /* A press anywhere else closes it, the popover's own light dismiss, not a
       listener here. Not `blur` either way. A press on a result blurs the
       field before the link fires. A close there is a race the panel wins
       about as often as the reader does. */
    this.onToggle = (event) => {
      const open = event.newState === "open";
      if (!open) this.open = false;
      this.following?.();
      this.following = void 0;
      const drop = this.querySelector(".sds-search__panel");
      const field = this.querySelector(".sds-field");
      if (open && !anchored() && drop && field) {
        this.following = place(drop, field, "end", "--sds-search-panel-gap");
      }
    };
    this.index = "";
    this.label = "Search";
    this.size = "md";
    this.query = "";
    this.entries = null;
    this.open = false;
  }
  static {
    this.properties = {
      /** Where the index is. Relative to the page, like every other asset. */
      index: { type: String },
      label: { type: String },
      size: { type: String, reflect: true },
      query: { type: String, state: true },
      entries: { type: Array, state: true },
      open: { type: Boolean, state: true }
    };
  }
  disconnectedCallback() {
    this.following?.();
    this.following = void 0;
    super.disconnectedCallback();
  }
  /* The drop draws only while there is something in it. So it shows the
     moment it exists, not by an attribute a template carries. */
  updated() {
    const drop = this.querySelector(".sds-search__panel");
    if (drop && !drop.matches(":popover-open")) drop.showPopover();
    if (!drop && this.following) {
      this.following();
      this.following = void 0;
    }
  }
  load() {
    if (this.entries || !this.index) return Promise.resolve();
    this.loading ??= fetch(this.index).then(async (res) => {
      this.entries = await res.json();
    }).catch(() => {
      this.entries = [];
    });
    return this.loading;
  }
  /** Where the site's root is, from this page. The index lists every page as
      the build sees them, and a reader rarely stands in the root. So a path
      out of it resolves against the index's own address, which *is* the
      root. Left to the browser, a hit one directory down names a page that
      does not exist. A picture beside it names a file that is not there. */
  from(path) {
    return new URL(path, new URL(".", new URL(this.index, location.href))).href;
  }
  /** The eight best hits. Every word of the query must occur, in any order,
      so "page add" finds "Add a page". A title that is the query comes
      first, then a title that starts with it, then one that holds it. A hit
      in the text alone comes last. The index order breaks a tie. */
  get hits() {
    const q = this.query.trim().toLowerCase();
    if (!q || !this.entries) return [];
    if (this.#asked?.query === q && this.#asked.entries === this.entries) return this.#asked.hits;
    if (this.#read?.entries !== this.entries) {
      this.#read = {
        entries: this.entries,
        read: this.entries.map((entry) => {
          const title = entry.title.toLowerCase();
          return { entry, title, all: `${title} ${entry.text.toLowerCase()}` };
        })
      };
    }
    const words = q.split(/\s+/);
    const best = [];
    for (const one of this.#read.read) {
      const at = rank(one, q, words);
      if (at === Infinity || best.length === HITS && at >= (best[HITS - 1]?.rank ?? 0)) continue;
      let put = best.length;
      while (put > 0 && (best[put - 1]?.rank ?? 0) > at) put -= 1;
      best.splice(put, 0, { rank: at, entry: one.entry });
      if (best.length > HITS) best.pop();
    }
    const hits = best.map((hit) => hit.entry);
    this.#asked = { query: q, entries: this.entries, hits };
    return hits;
  }
  #read;
  #asked;
  async type(event) {
    this.query = event.target.value;
    this.open = this.query.trim().length > 0;
    await this.load();
  }
  /** The links in the drop, in the reader's order.
  
        Asked of the markup, not kept as a list. `sds-search-result` draws what
        is in the panel, and the class is the contract between them, the same
        contract the stylesheet works through. */
  links() {
    return [...this.querySelectorAll(".sds-search__panel a")];
  }
  /** In the field: down goes into the list, Escape gives the page back.
  
        Focus moves for real, and no row gets a mark as if it had. These are
        links, and a reader who arrowed to one can open it in a new tab like
        any other. */
  onFieldKey(event) {
    if (event.key === "Escape") {
      this.open = false;
      return;
    }
    if (event.key !== "ArrowDown" || !this.open) return;
    event.preventDefault();
    this.links()[0]?.focus();
  }
  /** In the drop: the arrows walk it, and up from the first goes back to the
      typed text. Escape closes from anywhere in it, which is where a reader
      who changed their mind stands. */
  onPanelKey(event) {
    const field = this.querySelector(".sds-input");
    if (event.key === "Escape") {
      this.open = false;
      field?.focus();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const links = this.links();
    const here = links.indexOf(document.activeElement);
    const next = here + (event.key === "ArrowDown" ? 1 : -1);
    if (next < 0) field?.focus();
    else links[Math.min(next, links.length - 1)]?.focus();
  }
  /** Left entirely — a press elsewhere, or a tab out of the last hit. */
  onLeave(event) {
    const to = event.relatedTarget;
    if (to && this.contains(to)) return;
    this.open = false;
  }
  /* The field says it is a combobox, because that is the only way it can say
     the rest. `aria-expanded` and `aria-controls` are not attributes of a
     plain text input, and axe reports the pair without the role as a serious
     violation. It is also what this is: a box you type in, with a list
     underneath. */
  render() {
    const hits = this.hits;
    const open = this.open && this.query.trim().length > 0;
    return html6`<div class="sds-search" @focusout="${(e) => this.onLeave(e)}">
  <span class="${fieldBox({ size: this.size })}" style="anchor-name: ${this.anchor}">
    <sds-icon name="actions-search" size="16"></sds-icon>
    <input
      class="sds-input"
      type="text"
      role="combobox"
      aria-autocomplete="list"
      autocomplete="off"
      spellcheck="false"
      .value="${this.query}"
      placeholder="${this.label}"
      aria-label="${this.label}"
      aria-controls="${this.panelId}"
      aria-expanded="${open ? "true" : "false"}"
      @input="${(e) => void this.type(e)}"
      @keydown="${(e) => this.onFieldKey(e)}"
      @focus="${() => {
      this.open = this.query.trim().length > 0;
    }}"
    />
  </span>
  ${open ? this.panel(hits) : nothing2}
</div>`;
  }
  /** What the index has, as what a result draws from. The only place the two
        vocabularies meet. A page has a title and a URL, a hit has a heading and
        an href, and nothing below here knows about an index.
  
        The whole sentence the index kept. How much of it a reader sees is the
        drop's question and not this one's, and the class layer answers it. A
        hit under a field gives two lines of it, a page of results the lot. */
  hitOf(entry) {
    return {
      heading: entry.title,
      href: this.from(entry.url),
      path: entry.url,
      snippet: entry.text,
      src: entry.image ? this.from(entry.image) : ""
    };
  }
  /** The drop, and what is in it. The box is this element's. Where it hangs
        and how far it can grow are questions about the field it belongs to.
        `sds-search-hits` draws the answer inside it, hits or none.
  
        The query goes over, and the mark does not happen here. The highlight
        has to be the real search term. */
  panel(hits) {
    return html6`<div
  class="sds-search__panel"
  id="${this.panelId}"
  popover
  style="position-anchor: ${this.anchor}"
  aria-label="${this.label}"
  @toggle="${this.onToggle}"
  @keydown="${(e) => this.onPanelKey(e)}"
>
  <sds-search-hits
    .items="${hits.map((hit) => this.hitOf(hit))}"
    match="${this.query}"
  ></sds-search-hits>
</div>`;
  }
};
define("sds-search", SdsSearch);

// packages/frontend/src/components/theme.ts
import { html as html7, nothing as nothing3 } from "lit";

// packages/frontend/src/lib/mode.ts
var written = /* @__PURE__ */ new Set();
var machine = /* @__PURE__ */ new Set();
var watch = null;
var dark = null;
var tell = (who) => () => {
  for (const hear of [...who]) hear();
};
var toldMachine = tell(machine);
function onWritten(hear) {
  written.add(hear);
  if (!watch) {
    watch = new MutationObserver(tell(written));
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }
  return () => {
    written.delete(hear);
    if (!written.size) {
      watch?.disconnect();
      watch = null;
    }
  };
}
function onMachine(hear) {
  machine.add(hear);
  if (!dark) {
    dark = matchMedia("(prefers-color-scheme: dark)");
    dark.addEventListener("change", toldMachine);
  }
  return {
    dark: () => dark?.matches ?? false,
    stop: () => {
      machine.delete(hear);
      if (!machine.size) {
        dark?.removeEventListener("change", toldMachine);
        dark = null;
      }
    }
  };
}

// packages/frontend/src/components/theme.ts
var STATES = ["machine", "light", "dark"];
var GLYPH = {
  machine: "actions-device-desktop",
  light: "actions-brightness-high",
  dark: "actions-moon"
};
var themeBoot = (key2 = "soul-theme") => `var t=localStorage.getItem(${JSON.stringify(key2)});if(t){document.documentElement.dataset.theme=t}`;
var SdsTheme = class extends SdsElement {
  static {
    this.properties = {
      key: { type: String },
      current: { type: String, state: true },
      machine: { type: String, state: true }
    };
  }
  constructor() {
    super();
    this.key = "soul-theme";
    this.current = null;
    this.machine = "light";
  }
  /** What the reader reads in, which is not always what they chose. */
  get inForce() {
    return this.current ?? this.machine;
  }
  /** If this element has read the document yet. Until it has — a page with no
      script, or the frame before one runs — the button says only what a press
      does. That is true in every state. A state it has not read is a
      sentence that is wrong on two pages out of three. */
  #seen = false;
  /* Watches the attribute, does not own it. `soul-boot.js` writes the stored
     choice before the paint, and a second tab changes it too. Read once on
     connect, the switch shows the wrong side. The attribute never carries
     the machine's setting. An attribute for that is a choice this element
     cannot tell from one, and a stop with no way back. */
  #stop = null;
  #dark = null;
  connectedCallback() {
    super.connectedCallback();
    if (typeof document === "undefined") return;
    this.#read();
    this.#stop = onWritten(() => this.#read());
    this.#dark = onMachine(this.#machine);
    this.#machine();
  }
  disconnectedCallback() {
    this.#dark?.stop();
    this.#dark = null;
    this.#stop?.();
    this.#stop = null;
    super.disconnectedCallback();
  }
  #machine = () => {
    this.machine = this.#dark?.dark() ? "dark" : "light";
  };
  /* What the document already says. The element's own idea of it disagrees
     with the paint. */
  #read() {
    const written2 = document.documentElement.dataset["theme"];
    this.current = written2 === "light" || written2 === "dark" ? written2 : null;
    this.#seen = true;
  }
  /* One press, and it steps to the next of three. The machine's setting is a
     stop on the way round, not something only a cleared key gives back. A
     control that reaches two of its three states takes the default away from
     whoever tries it once. */
  step() {
    const at = STATES.indexOf(this.current ?? "machine");
    const to = STATES[(at + 1) % STATES.length] ?? "machine";
    const next = to === "machine" ? null : to;
    this.current = next;
    const root = document.documentElement;
    root.toggleAttribute("data-switching", true);
    requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute("data-switching")));
    if (next) {
      root.dataset["theme"] = next;
      localStorage.setItem(this.key, next);
    } else {
      delete root.dataset["theme"];
      localStorage.removeItem(this.key);
    }
    this.dispatchEvent(
      new CustomEvent("sds-theme-change", {
        detail: { theme: next },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    const mark = (state2) => html7`<span
      class="sds-theme__mark sds-theme__mark--${state2}"
    ><sds-icon name="${GLYPH[state2]}"></sds-icon></span>`;
    const at = STATES.indexOf(this.current ?? "machine");
    const to = STATES[(at + 1) % STATES.length] ?? "machine";
    const said = {
      machine: "the machine\u2019s setting",
      light: "light",
      dark: "dark"
    };
    return html7`<button
      type="button"
      class="sds-btn sds-btn--ghost sds-btn--icon sds-theme__toggle"
      title="Switch colour mode"
      aria-label="${this.#seen ? `Colour mode: ${said[STATES[at] ?? "machine"]}. Switch to ${said[to]}.` : nothing3}"
      @click="${() => this.step()}"
    >${mark("machine")}${mark("light")}${mark("dark")}</button>`;
  }
};
define("sds-theme", SdsTheme);

// packages/frontend/src/components/button.ts
import { html as html8 } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
function buttonClass({ variant = "primary", size = "md", iconOnly = false, disabled = false }) {
  const cls = ["sds-btn", `sds-btn--${variant}`];
  if (size === "sm" || size === "lg") cls.push(`sds-btn--${size}`);
  if (iconOnly) cls.push("sds-btn--icon");
  if (disabled) cls.push("is-disabled");
  return cls.join(" ");
}
var LABEL = "sds-btn__label";
var buttonLabel = (body) => html8`<span class="${LABEL}">${body}</span>`;
function linkMarkup(props, body) {
  const cls = buttonClass({ ...props, disabled: false });
  const said = (value) => value || void 0;
  return html8`<a
    class="${cls}"
    href="${props.href ?? ""}"
    rel="${ifDefined(said(props.rel))}"
    target="${ifDefined(said(props.target))}"
    download="${ifDefined(said(props.download))}"
    title="${ifDefined(said(props.title))}"
  >${body}</a>`;
}
function buttonMarkup(props, body) {
  const inner = typeof body === "string" && body ? buttonLabel(body) : body;
  if (props.href) return linkMarkup(props, inner);
  const cls = buttonClass(props);
  const type = props.type ?? "button";
  if (props.title) {
    return props.disabled ? html8`<button class="${cls}" type="${type}" title="${props.title}" disabled>${inner}</button>` : html8`<button class="${cls}" type="${type}" title="${props.title}">${inner}</button>`;
  }
  return props.disabled ? html8`<button class="${cls}" type="${type}" disabled>${inner}</button>` : html8`<button class="${cls}" type="${type}">${inner}</button>`;
}
var isGlyph = (node) => {
  const el = node;
  return el.tagName?.toLowerCase() === "sds-icon" || (el.classList?.contains("sds-icon") ?? false);
};
function labelled(nodes) {
  const out = [];
  let run2 = [];
  const close = () => {
    if (run2.some((node) => !isBlank(node))) out.push(buttonLabel(run2));
    run2 = [];
  };
  for (const node of nodes) {
    if (isGlyph(node) || node.classList?.contains(LABEL)) {
      close();
      out.push(node);
    } else run2.push(node);
  }
  close();
  return out;
}
var SdsButton = class extends SdsElement {
  constructor() {
    super();
    /* The label, taken before Lit renders over it — the element renders light
       DOM, so `render()` otherwise replaces exactly what it is for. */
    this.taken = [];
    /* The press, sent to whatever the button names. An id and an event, so
       neither end holds the other and a page wires the two in markup. It fires
       **on the target**, the way the platform's own invokers do, so what
       answers listens to itself. It bubbles, so a page that wants every
       command still hears them. Without `for` the button keeps its own click. */
    this.onPress = () => {
      if (!this.for || this.disabled) return;
      const target = document.getElementById(this.for);
      if (!target) return;
      target.dispatchEvent(
        new CustomEvent("sds-command", {
          detail: { command: this.command || "show", source: this },
          bubbles: true,
          composed: true
        })
      );
    };
    this.variant = "primary";
    this.size = "md";
    this.disabled = false;
    this.type = "button";
    this.href = "";
    this.rel = "";
    this.download = "";
    this.target = "";
    this.for = "";
    this.command = "show";
    this.iconOnly = false;
  }
  static {
    this.properties = {
      variant: { type: String, reflect: true },
      size: { type: String, reflect: true },
      title: { type: String },
      disabled: { type: Boolean, reflect: true },
      type: { type: String, reflect: true },
      href: { type: String },
      rel: { type: String },
      download: { type: String },
      target: { type: String },
      for: { type: String, reflect: true },
      command: { type: String, reflect: true },
      iconOnly: { type: Boolean, attribute: "icon-only", reflect: true }
    };
  }
  connectedCallback() {
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
    this.addEventListener("click", this.onPress);
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.onPress);
    super.disconnectedCallback();
  }
  render() {
    const iconOnly = this.iconOnly || this.taken.every(
      (node) => node.nodeType === 8 || (node.textContent ?? "").trim() === ""
    ) && this.taken.some((node) => node.tagName?.toLowerCase() === "sds-icon");
    return buttonMarkup(
      {
        variant: this.variant,
        size: this.size,
        iconOnly,
        title: this.title,
        disabled: this.disabled,
        type: this.type,
        href: this.href,
        rel: this.rel,
        download: this.download,
        target: this.target
      },
      this.taken.length ? labelled(this.taken) : this.content ?? this.taken
    );
  }
};
define("sds-button", SdsButton);

// packages/frontend/src/components/dropdown.ts
import { html as html9, nothing as nothing4 } from "lit";

// packages/frontend/src/lib/template.ts
function lines(parts2, indent = 0) {
  const gap = `
${" ".repeat(indent)}`;
  const out = [];
  parts2.forEach((part, i) => {
    if (i) out.push(gap);
    out.push(part);
  });
  return out;
}

// packages/frontend/src/components/dropdown.ts
var seq2 = 0;
var SdsDropdown = class extends SdsElement {
  constructor() {
    super();
    this.panelId = `sds-dropdown-panel-${++seq2}`;
    /** The anchor this panel stands against, named per instance. One name for
        every dropdown on a page resolves to whichever the browser met last. So
        each states its own and reads only that. */
    this.anchor = `--${this.panelId}`;
    /** What the browser did, read back, not assumed. Light dismiss and Escape
        are the platform's here. So a press outside or a key this element never
        saw still arrives as a state change. `aria-expanded`, the marker and
        the placement all follow this one event. */
    this.onToggle = (event) => {
      this.open = event.newState === "open";
      this.following?.();
      this.following = void 0;
      if (this.open && !anchored() && this.panel && this.button) {
        this.following = place(this.panel, this.button, this.align, "--sds-dropdown-panel-gap");
      }
    };
    this.label = "";
    this.name = "";
    this.choices = [];
    this.align = "start";
    this.variant = "secondary";
    this.size = "md";
    this.iconOnly = false;
    this.open = false;
  }
  static {
    this.properties = {
      label: { type: String },
      name: { type: String },
      choices: { type: Array },
      align: { type: String, reflect: true },
      variant: { type: String },
      size: { type: String },
      iconOnly: { type: Boolean, attribute: "icon-only" },
      icon: { type: String },
      open: { type: Boolean, state: true }
    };
  }
  disconnectedCallback() {
    this.following?.();
    this.following = void 0;
    super.disconnectedCallback();
  }
  get panel() {
    return this.querySelector(".sds-dropdown__panel");
  }
  get button() {
    return this.querySelector(".sds-dropdown__button");
  }
  /** The whole name, with the label still in it. Without the visible word,
      nobody can ask for the control by the name they can see. */
  get called() {
    return this.name && this.label ? `${this.name}: ${this.label}` : this.name || this.label;
  }
  /** Pages or commands. Asked of the entries rather than declared, because a
      caller who has to say which one it is can say the wrong one. */
  get commands() {
    return this.choices.length > 0 && this.choices.every((choice) => !choice.href);
  }
  /** The rows a key can move between: the drawn ones that take a press. */
  rows() {
    return [...this.querySelectorAll('.sds-dropdown__item:not([aria-disabled="true"])')];
  }
  onKey(event) {
    if (event.key === "Escape") {
      if (this.open) event.stopPropagation();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const rows = this.rows();
    if (!rows.length) return;
    event.preventDefault();
    if (!this.open) {
      this.panel?.showPopover();
      const first = event.key === "ArrowUp" || event.key === "End";
      void this.updateComplete.then(() => {
        const now = this.rows();
        (first ? now[now.length - 1] : now[0])?.focus();
      });
      return;
    }
    const from = event.target;
    const at = from ? rows.indexOf(from) : -1;
    const to = event.key === "Home" ? 0 : event.key === "End" ? rows.length - 1 : (
      /* Stops at the ends rather than wrapping: a list that starts over at
         the bottom hides how long it was from whoever cannot see it. */
      Math.min(rows.length - 1, Math.max(0, at + (event.key === "ArrowDown" ? 1 : -1)))
    );
    rows[to]?.focus();
  }
  /** What a press reports, and what it does not do. An entry with a target is
      a link and stays one. The event stands beside the navigation, not
      instead of it, so a page that never listens still works.
      `preventDefault()` is how an app takes the navigation over. */
  choose(choice, index, event) {
    if (choice.disabled) {
      event.preventDefault();
      return;
    }
    const told = this.dispatchEvent(
      new CustomEvent("sds-dropdown-choose", {
        detail: { choice, index },
        bubbles: true,
        composed: true,
        cancelable: true
      })
    );
    if (!told) event.preventDefault();
    this.panel?.hidePopover();
  }
  entry(choice, index) {
    const inside = choice.icon ? html9`<sds-icon name="${choice.icon}"></sds-icon>${choice.label}` : html9`${choice.label}`;
    const shared2 = {
      class: choice.current ? "sds-dropdown__item is-active" : "sds-dropdown__item",
      lang: choice.lang
    };
    if (this.commands) {
      return html9`<button
        type="button"
        role="menuitem"
        class="${shared2.class}"
        lang="${shared2.lang ?? nothing4}"
        aria-disabled="${choice.disabled ? "true" : nothing4}"
        @click="${(event) => this.choose(choice, index, event)}"
      >${inside}</button>`;
    }
    return html9`<a
      class="${shared2.class}"
      href="${choice.href ?? "#"}"
      lang="${shared2.lang ?? nothing4}"
      hreflang="${shared2.lang ?? nothing4}"
      target="${choice.external ? "_blank" : nothing4}"
      rel="${choice.external ? "noreferrer" : nothing4}"
      aria-current="${choice.current ? "true" : nothing4}"
      aria-disabled="${choice.disabled ? "true" : nothing4}"
      @click="${(event) => this.choose(choice, index, event)}"
    >${inside}</a>`;
  }
  render() {
    const commands = this.commands;
    const cls = `${buttonClass({ variant: this.variant, size: this.size, iconOnly: this.iconOnly })} sds-dropdown__button`;
    const inside = this.iconOnly ? html9`${this.icon ? html9`<sds-icon name="${this.icon}"></sds-icon>` : ""}` : html9`${this.icon ? html9`<sds-icon name="${this.icon}"></sds-icon>` : ""}${buttonLabel(this.label)}<span
        class="sds-dropdown__marker"
      ><sds-icon name="actions-chevron-down"></sds-icon></span>`;
    return html9`<div class="sds-dropdown" @keydown="${(e) => this.onKey(e)}">
  <button
    type="button"
    class="${cls}"
    style="anchor-name: ${this.anchor}"
    title="${this.iconOnly ? this.called : nothing4}"
    aria-label="${this.name && !this.iconOnly ? this.called : nothing4}"
    aria-haspopup="${commands ? "menu" : nothing4}"
    aria-expanded="${this.open ? "true" : "false"}"
    aria-controls="${this.panelId}"
    popovertarget="${this.panelId}"
  >${inside}</button>
  <div
    class="sds-dropdown__panel"
    id="${this.panelId}"
    popover
    style="position-anchor: ${this.anchor}"
    role="${commands ? "menu" : nothing4}"
    aria-label="${commands ? this.called : nothing4}"
    @toggle="${this.onToggle}"
  >
    ${lines(this.choices.map((choice, at) => this.entry(choice, at)), 4)}
  </div>
</div>`;
  }
};
define("sds-dropdown", SdsDropdown);

// packages/frontend/src/components/eyebrow.ts
import { html as html10 } from "lit";
var SdsEyebrow = class extends SdsElement {
  static {
    this.properties = {
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.label = "";
  }
  render() {
    return html10`<div class="sds-eyebrow">${this.label}</div>`;
  }
};
define("sds-eyebrow", SdsEyebrow);

// packages/frontend/src/components/link.ts
import { html as html11 } from "lit";
var SdsLink = class _SdsLink extends SdsElement {
  static {
    this.properties = {
      label: { type: String },
      href: { type: String, reflect: true },
      external: { type: Boolean, reflect: true },
      icon: { type: String },
      bare: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.label = "";
    this.href = "#";
    this.external = false;
    this.bare = false;
  }
  /** If a glyph is about direction rather than about the thing. A glyph
      leads its label and a direction glyph follows it, which is a property of
      the glyph — so the component decides. A boolean here is a caller's
      chance to put an arrow in front of a word. */
  static leads(icon) {
    return !/^actions-(arrow|chevron|caret)-/.test(icon);
  }
  render() {
    if (this.bare && this.icon) {
      const mark = html11`<sds-icon name="${this.icon}" size="24"></sds-icon>`;
      return this.external ? html11`<a class="sds-link sds-link--bare" href="${this.href}" target="_blank" rel="noreferrer" aria-label="${this.label}" title="${this.label}">${mark}</a>` : html11`<a class="sds-link sds-link--bare" href="${this.href}" aria-label="${this.label}" title="${this.label}">${mark}</a>`;
    }
    const glyph2 = this.icon ? html11`<sds-icon name="${this.icon}"></sds-icon>` : "";
    const lead = this.icon && _SdsLink.leads(this.icon) ? glyph2 : "";
    const trail = this.icon && !_SdsLink.leads(this.icon) ? glyph2 : "";
    return this.external ? html11`<a class="sds-link sds-link--external" href="${this.href}" target="_blank" rel="noreferrer">${lead}${this.label} ${trail}<sds-icon name="actions-window-open"></sds-icon></a>` : html11`<a class="sds-link" href="${this.href}">${lead}${this.label}${trail ? html11` ${trail}` : ""}</a>`;
  }
};
define("sds-link", SdsLink);

// packages/frontend/src/components/nav-breadcrumb.ts
import { html as html12 } from "lit";
var SdsNavBreadcrumb = class extends SdsElement {
  static {
    this.properties = {
      items: { type: Array },
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.items = [];
    this.label = "Breadcrumb";
  }
  render() {
    return html12`<nav class="sds-crumbs" aria-label="${this.label}">
  ${this.items.map((crumb, i) => {
      const here = i === this.items.length - 1;
      const step = here ? html12`<span class="sds-crumbs__here" aria-current="page">${crumb.label}</span>` : html12`<a href="${crumb.href ?? "#"}">${crumb.label}</a>`;
      return html12`${i > 0 ? html12`<span class="sds-crumbs__sep" aria-hidden="true">/</span>` : ""}${step}`;
    })}
</nav>`;
  }
};
define("sds-nav-breadcrumb", SdsNavBreadcrumb);

// packages/frontend/src/components/field.ts
import { html as html15, nothing as nothing6 } from "lit";

// packages/frontend/src/components/field-error.ts
import { html as html13 } from "lit";
var SdsFieldError = class extends SdsElement {
  static {
    this.properties = { message: { type: String } };
  }
  constructor() {
    super();
    this.message = "";
  }
  render() {
    return html13`<span class="sds-field-error"><sds-icon name="actions-exclamation-circle"></sds-icon>${this.message}</span>`;
  }
};
define("sds-field-error", SdsFieldError);

// packages/frontend/src/lib/field-row.ts
import { html as html14, nothing as nothing5 } from "lit";
function fieldRow(row2, control) {
  if (!row2.caption) return control;
  const id = row2.fieldId || void 0;
  return html14`<div class="sds-field-row">
  <label class="sds-field-label" for="${id ?? nothing5}">${row2.caption}${row2.required ? html14` <span class="sds-field-req">required</span>` : nothing5}</label>
  ${control}
  ${row2.hint ? html14`<span class="sds-field-hint">${row2.hint}</span>` : nothing5}
  ${row2.error ? html14`<sds-field-error message="${row2.error}"></sds-field-error>` : nothing5}
</div>`;
}

// packages/frontend/src/lib/form-element.ts
var SdsFormElement = class extends SdsElement {
  constructor() {
    super();
    /** If an ancestor `<fieldset disabled>` has turned this off. The element's
        own `disabled` is a property it renders; this is the other half, which
        nothing but the platform can tell it. */
    this.inheritedDisabled = false;
    if (typeof this.attachInternals === "function") this.internals = this.attachInternals();
  }
  static {
    /** What puts the element in `form.elements`, sends it the form's lifecycle
        callbacks and lets it hold a validity of its own. */
    this.formAssociated = true;
  }
  /** The form this control answers to, wherever it stands — including one it
      only reaches through the `form` attribute. */
  get form() {
    return this.internals?.form ?? null;
  }
  /** The `<label>`s pointing at it, so a caller can move focus the way a
      platform control lets one. */
  get labels() {
    return this.internals?.labels;
  }
  get validity() {
    return this.internals?.validity;
  }
  get validationMessage() {
    return this.internals?.validationMessage ?? "";
  }
  get willValidate() {
    return this.internals?.willValidate ?? false;
  }
  checkValidity() {
    return this.internals?.checkValidity() ?? true;
  }
  reportValidity() {
    return this.internals?.reportValidity() ?? true;
  }
  formDisabledCallback(disabled) {
    this.inheritedDisabled = disabled;
    this.requestUpdate();
  }
  /** What the markup said, put back. The browser resets the real control inside
      at the same time and to the same value. This is the element's own copy of
      the state, in step with it. */
  formResetCallback() {
    this.restore();
  }
  restore() {
  }
  /** A message the browser refuses to submit past, reported on the real
        control inside. So the bubble points at the box and not at the element
        around it. An empty message clears it.
  
        Called after a render and never during one. There is no element to anchor
        to before the first, and in Node there is no `querySelector` at all. */
  setValidity(message, selector = "input, select, textarea", flag2 = "customError") {
    if (!this.internals) return;
    if (!message) {
      this.internals.setValidity({});
      return;
    }
    const anchor = this.querySelector(selector);
    this.internals.setValidity({ [flag2]: true }, message, anchor ?? void 0);
  }
};

// packages/frontend/src/components/field.ts
var SdsField = class extends SdsFormElement {
  static {
    this.properties = {
      size: { type: String, reflect: true },
      value: { type: String },
      icon: { type: String },
      focused: { type: Boolean, reflect: true },
      invalid: { type: Boolean, reflect: true },
      filled: { type: Boolean, reflect: true },
      label: { type: String },
      minWidth: { type: Number, attribute: "min-width" },
      caption: { type: String },
      hint: { type: String },
      error: { type: String },
      required: { type: Boolean, reflect: true },
      fieldId: { type: String, attribute: "field-id" },
      name: { type: String },
      type: { type: String },
      disabled: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      prefix: { type: String },
      suffix: { type: String },
      autocomplete: { type: String },
      inputmode: { type: String },
      min: { type: String },
      max: { type: String },
      step: { type: String },
      maxlength: { type: Number },
      pattern: { type: String }
    };
  }
  constructor() {
    super();
    this.size = "md";
    this.value = "";
    this.focused = false;
    this.invalid = false;
    this.filled = false;
    this.minWidth = 220;
    this.caption = "";
    this.hint = "";
    this.error = "";
    this.required = false;
    this.fieldId = "";
    this.name = "";
    this.type = "text";
    this.disabled = false;
    this.readonly = false;
    this.prefix = "";
    this.suffix = "";
    this.autocomplete = "";
    this.inputmode = "";
    this.min = "";
    this.max = "";
    this.step = "";
    this.maxlength = 0;
    this.pattern = "";
  }
  /* The value the markup came with, which is what a reset puts back. Read once,
     before the first keystroke. */
  #initial;
  willUpdate() {
    this.#initial ??= this.filled ? this.value : "";
  }
  /* What the caller said is wrong is what the browser refuses to submit past,
     reported on the box itself. Set from the render rather than from a setter,
     so a page that arrives with the sentence already in it arrives blocked. */
  updated(changed) {
    if (changed.has("error") || !this.#validated) this.setValidity(this.error, "input");
    this.#validated = true;
  }
  #validated = false;
  restore() {
    this.value = this.#initial || this.value;
    this.filled = !!this.#initial;
  }
  /* A keystroke is what makes a value the user's. `is-filled` used to be a
     state a caller set and then had to unset, which no keystroke into the
     field can do. */
  onInput(event) {
    const control = event.target;
    this.value = control.value;
    this.filled = control.value !== "";
    this.error = "";
    this.dispatchEvent(new CustomEvent("sds-input", { detail: control.value, bubbles: true, composed: true }));
  }
  render() {
    return fieldRow(this, this.control());
  }
  control() {
    const cls = fieldBox(this);
    const box2 = `width:${this.minWidth}px; max-width:100%`;
    const id = this.fieldId || nothing6;
    const name = this.name || nothing6;
    const invalid = this.invalid || this.error ? "true" : nothing6;
    const disabled = this.disabled || this.inheritedDisabled;
    const caret = this.focused ? html15`<span style="width:2px; height:15px; background:var(--accent);"></span>` : nothing6;
    const affix = (text2) => text2 ? html15`<span class="sds-field__affix">${text2}</span>` : nothing6;
    return html15`<span class="${cls}" style="${box2}">${this.icon ? html15`<sds-icon name="${this.icon}"></sds-icon>` : nothing6}${affix(this.prefix)}<input
    class="sds-input"
    type="${this.type}"
    id="${id}"
    name="${name}"
    value="${this.filled ? this.value : nothing6}"
    placeholder="${this.filled ? nothing6 : this.value}"
    aria-label="${this.label ?? nothing6}"
    aria-invalid="${invalid}"
    autocomplete="${this.autocomplete || nothing6}"
    inputmode="${this.inputmode || nothing6}"
    min="${this.min || nothing6}"
    max="${this.max || nothing6}"
    step="${this.step || nothing6}"
    maxlength="${this.maxlength || nothing6}"
    pattern="${this.pattern || nothing6}"
    ?required="${this.required}"
    ?disabled="${disabled}"
    ?readonly="${this.readonly}"
    @input="${this.onInput}"
  >${affix(this.suffix)}${caret}</span>`;
  }
};
define("sds-field", SdsField);

// packages/frontend/src/components/select.ts
import { html as html16, nothing as nothing7 } from "lit";
var seq3 = 0;
var SdsSelect = class extends SdsFormElement {
  constructor() {
    super();
    this.listId = `sds-select-list-${++seq3}`;
    /** The anchor the list stands against, named per instance. One name for
        every select on a page resolves to whichever the browser met last. */
    this.anchor = `--${this.listId}`;
    /* The keys moved the row, so it scrolls into view. A pointer moves it
       only where the reader already sees it. */
    this.#keyed = false;
    /** What the browser did, read back, not assumed. Light dismiss and Escape
        are the platform's, so a press outside or a key this element never saw
        still arrives as a state change. So does a press on the button, which
        opens the popover through `popovertarget` and never comes past `show`. */
    this.onToggle = (event) => {
      this.shown = event.newState === "open";
      this.following?.();
      this.following = void 0;
      if (!this.shown) {
        this.active = -1;
        return;
      }
      if (this.active < 0) this.aim();
      if (!anchored() && this.list && this.button) {
        this.following = place(this.list, this.button, "start", "--sds-select-list-gap");
      }
    };
    /** The typed text at the list in the last second, and what it matched.
        Type-ahead is how a reader who knows the answer gets to it. It is the
        only way to use a long list from the keyboard. */
    this.#typed = "";
    this.#typedAt = 0;
    this.#settled = false;
    this.caption = "";
    this.name = "";
    this.fieldId = "";
    this.value = "";
    this.options = [];
    this.hint = "";
    this.error = "";
    this.required = false;
    this.disabled = false;
    this.size = "md";
    this.minWidth = 220;
    this.filled = false;
    this.focused = false;
    this.invalid = false;
    this.open = false;
    this.shown = false;
    this.active = -1;
  }
  static {
    this.properties = {
      caption: { type: String },
      label: { type: String },
      name: { type: String },
      fieldId: { type: String, attribute: "field-id" },
      value: { type: String },
      options: { type: Array },
      hint: { type: String },
      error: { type: String },
      required: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      size: { type: String, reflect: true },
      minWidth: { type: Number, attribute: "min-width" },
      filled: { type: Boolean, reflect: true },
      focused: { type: Boolean, reflect: true },
      invalid: { type: Boolean, reflect: true },
      open: { type: Boolean, reflect: true },
      /** If the popover shows, read back from the browser, which owns that.
          Apart from `open`, which is a still picture's state and takes the
          popover away. One property for both re-adds the attribute the moment
          the list opens, and closes it again. */
      shown: { type: Boolean, state: true },
      /** Which entry the keys are on while the list is open. Not the chosen one:
          a reader walking the list has moved nothing until they say so. */
      active: { type: Number, state: true }
    };
  }
  /* The answer the markup came with, which is what a reset puts back. */
  #initial;
  willUpdate() {
    this.#initial ??= this.filled ? this.value : "";
  }
  restore() {
    this.value = this.#initial || this.value;
    this.filled = !!this.#initial;
  }
  disconnectedCallback() {
    this.following?.();
    this.following = void 0;
    super.disconnectedCallback();
  }
  /** The list as entries, each with where it sits: one flat run, because the
      keys walk the answers and never the headings. */
  get entries() {
    if (this.#entries?.from !== this.options) this.#entries = { from: this.options, list: this.options.map((entry) => typeof entry === "string" ? { label: entry } : entry) };
    return this.#entries.list;
  }
  #entries;
  #keyed;
  /** Which entries a key can land on. A disabled one reads out, and the keys
      step over it, the way the platform does. */
  get reachable() {
    return this.entries.flatMap((option2, at) => option2.disabled ? [] : [at]);
  }
  /** What an entry sends. Not `valueOf`, which every object already has. */
  sends(option2) {
    return option2.value ?? option2.label;
  }
  /** What the closed box says. The chosen entry's *label*, which is not always
      its value. And the prompt while there is no choice. */
  get says() {
    if (!this.filled) return this.value;
    const chosen = this.entries.find((option2) => this.sends(option2) === this.value);
    return chosen?.label ?? this.value;
  }
  /** If the list is in front of the reader, by either route. The reader
      opened it, or a card that can press nothing drew it open. */
  get listed() {
    return this.open || this.shown;
  }
  get list() {
    return this.querySelector(".sds-select__list");
  }
  get button() {
    return this.querySelector(".sds-select__button");
  }
  updated(changed) {
    const control = this.querySelector("select");
    const settled2 = this.#settled && !["value", "filled", "required", "error", "options", "name"].some((key2) => changed.has(key2));
    this.#settled = true;
    if (control && !settled2) {
      if (this.filled) control.value = this.value;
      control.tabIndex = -1;
      control.setAttribute("aria-hidden", "true");
      control.required = false;
    }
    const missing = this.required && !this.filled;
    if (!settled2) {
      if (this.error) this.setValidity(this.error, ".sds-select__button");
      else if (missing) this.setValidity("Choose one of the answers on the list", ".sds-select__button", "valueMissing");
      else this.setValidity("");
    }
    if (this.listed && this.active >= 0 && (this.#keyed || changed.has("open") || changed.has("shown"))) {
      this.querySelector(`#${this.listId}-${this.active}`)?.scrollIntoView({ block: "nearest" });
    }
    this.#keyed = false;
  }
  /** Where the keys start: on the choice, or on the first answer there is. A
      list that opens at the top every time makes a reader find their own
      answer again before they can move off it. */
  aim() {
    const at = this.entries.findIndex((option2) => this.sends(option2) === this.value);
    this.active = at >= 0 && !this.entries[at]?.disabled ? at : this.reachable[0] ?? -1;
  }
  /* Open and close move this element's own state first and the popover second.
     The browser queues `toggle` and does not fire it at its cause. So a key
     straight after another one arrives while this still holds the list shut,
     and reads as a second press to open it. */
  show() {
    if (this.disabled || this.inheritedDisabled || this.shown) return;
    this.shown = true;
    this.aim();
    this.list?.showPopover();
  }
  hide() {
    this.shown = false;
    this.active = -1;
    this.list?.hidePopover();
  }
  /** Move the keys `step` entries along, stopping at the ends. A list that
      starts over at the bottom hides how long it was from whoever cannot see
      it. */
  step(step) {
    const rows = this.reachable;
    if (!rows.length) return;
    const at = rows.indexOf(this.active);
    const to = at < 0 ? step > 0 ? 0 : rows.length - 1 : Math.min(rows.length - 1, Math.max(0, at + step));
    this.active = rows[to];
  }
  #typed;
  #typedAt;
  typeahead(key2, now) {
    if (key2.length !== 1 || key2 === " ") return false;
    this.#typed = now - this.#typedAt > 1e3 ? key2 : this.#typed + key2;
    this.#typedAt = now;
    const wanted = this.#typed.toLowerCase();
    const rows = this.reachable;
    const from = rows.indexOf(this.active) + 1;
    const order = [...rows.slice(from), ...rows.slice(0, from)];
    const hit = order.find((at) => this.entries[at].label.toLowerCase().startsWith(wanted));
    if (hit === void 0) return false;
    this.active = hit;
    if (!this.shown) this.choose(hit);
    return true;
  }
  #settled;
  onKey(event) {
    this.#keyed = true;
    if (this.disabled || this.inheritedDisabled) return;
    const now = event.timeStamp;
    if (event.key === "Escape") {
      if (this.shown) event.stopPropagation();
      return;
    }
    if (!this.shown) {
      if (["ArrowDown", "ArrowUp", "Enter", " ", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        this.show();
        if (event.key === "Home") this.active = this.reachable[0] ?? -1;
        else if (event.key === "End") this.active = this.reachable.at(-1) ?? -1;
        return;
      }
      if (this.typeahead(event.key, now)) event.preventDefault();
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.step(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        this.step(-1);
        return;
      case "Home":
        event.preventDefault();
        this.active = this.reachable[0] ?? -1;
        return;
      case "End":
        event.preventDefault();
        this.active = this.reachable.at(-1) ?? -1;
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        this.commit();
        return;
      case "Tab":
        this.commit();
        return;
      default:
        if (this.typeahead(event.key, now)) event.preventDefault();
    }
  }
  /** Take whatever the keys are on, and close. */
  commit() {
    if (this.active >= 0) this.choose(this.active);
    this.hide();
  }
  choose(at) {
    const option2 = this.entries[at];
    if (!option2 || option2.disabled) return;
    this.value = this.sends(option2);
    this.filled = true;
    this.active = at;
    this.error = "";
    const control = this.querySelector("select");
    if (control) control.value = this.value;
    this.dispatchEvent(new CustomEvent("sds-change", { detail: this.value, bubbles: true, composed: true }));
  }
  /** The `<select>` the form actually submits, and the whole control on a page
      that runs no script. The stylesheet hides it once this element upgrades. */
  native() {
    const prompt = !this.filled && this.value ? html16`<option value="" selected disabled>${this.value}</option>` : nothing7;
    const runs = [];
    for (const option2 of this.entries) {
      const last = runs.at(-1);
      if (last && last.group === option2.group) last.items.push(option2);
      else runs.push({ group: option2.group, items: [option2] });
    }
    const one = (option2) => {
      const value = this.sends(option2);
      return html16`<option value="${value}" ?selected="${value === this.value}" ?disabled="${option2.disabled ?? false}">${option2.label}</option>`;
    };
    return html16`<select
    class="sds-input sds-select__native"
    name="${this.name || nothing7}"
    aria-label="${this.label || this.caption || nothing7}"
    ?required="${this.required}"
    ?disabled="${this.disabled || this.inheritedDisabled}"
    @change="${(e) => {
      const control = e.target;
      const at = this.entries.findIndex((option2) => this.sends(option2) === control.value);
      if (at >= 0) this.choose(at);
    }}"
  >${prompt}${runs.map(
      (run2) => run2.group ? html16`<optgroup label="${run2.group}">${run2.items.map(one)}</optgroup>` : html16`${run2.items.map(one)}`
    )}</select>`;
  }
  /** The drawn list: headings as groups the keys walk past, answers as options
      the keys land on. */
  drawn() {
    const rows = [];
    let group;
    this.entries.forEach((option2, at) => {
      if (option2.group && option2.group !== group) {
        rows.push(html16`<span class="sds-select__group" role="presentation">${option2.group}</span>`);
      }
      group = option2.group;
      const chosen = this.filled && this.sends(option2) === this.value;
      rows.push(html16`<div
      class="sds-select__option${chosen ? " is-chosen" : ""}${at === this.active ? " is-active" : ""}"
      id="${this.listId}-${at}"
      role="option"
      aria-selected="${chosen ? "true" : "false"}"
      aria-disabled="${option2.disabled ? "true" : nothing7}"
      @click="${() => {
        if (option2.disabled) return;
        this.choose(at);
        this.hide();
      }}"
      @pointermove="${() => {
        if (!option2.disabled) this.active = at;
      }}"
    ><span class="sds-select__tick"><sds-icon name="actions-check"></sds-icon></span>${option2.label}</div>`);
    });
    return rows;
  }
  render() {
    const cls = `${fieldBox(this)} sds-select${this.open ? " is-open" : ""}`;
    const box2 = `width:${this.minWidth}px; max-width:100%`;
    const disabled = this.disabled || this.inheritedDisabled;
    const id = this.fieldId || nothing7;
    const control = html16`<span class="${cls}" style="${box2}" @keydown="${(e) => this.onKey(e)}">${this.native()}<button
    type="button"
    class="sds-select__button"
    id="${id}"
    style="anchor-name: ${this.anchor}"
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded="${this.listed ? "true" : "false"}"
    aria-controls="${this.listId}"
    aria-activedescendant="${this.listed && this.active >= 0 ? `${this.listId}-${this.active}` : nothing7}"
    aria-label="${this.label || this.caption || nothing7}"
    aria-invalid="${this.invalid || this.error ? "true" : nothing7}"
    ?disabled="${disabled}"
    popovertarget="${this.open ? nothing7 : this.listId}"
  ><span class="sds-select__value">${this.says}</span></button><span class="sds-select__mark"><sds-icon name="actions-chevron-down"></sds-icon></span><div
    class="sds-select__list"
    id="${this.listId}"
    style="position-anchor: ${this.anchor}"
    role="listbox"
    aria-label="${this.label || this.caption || nothing7}"
    ?popover="${!this.open}"
    @toggle="${this.onToggle}"
  >${this.drawn()}</div></span>`;
    return fieldRow(this, control);
  }
};
define("sds-select", SdsSelect);

// packages/frontend/src/components/textarea.ts
import { html as html17 } from "lit";
import { unsafeHTML as unsafeHTML2 } from "lit/directives/unsafe-html.js";
var esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
var SdsTextarea = class extends SdsFormElement {
  static {
    this.properties = {
      rows: { type: Number },
      value: { type: String },
      caption: { type: String },
      label: { type: String },
      name: { type: String },
      fieldId: { type: String, attribute: "field-id" },
      hint: { type: String },
      error: { type: String },
      required: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      maxlength: { type: Number },
      autocomplete: { type: String },
      resize: { type: String, reflect: true },
      size: { type: String, reflect: true },
      minWidth: { type: Number, attribute: "min-width" },
      filled: { type: Boolean, reflect: true },
      focused: { type: Boolean, reflect: true },
      invalid: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.rows = 4;
    this.value = "";
    this.caption = "";
    this.name = "";
    this.fieldId = "";
    this.hint = "";
    this.error = "";
    this.required = false;
    this.disabled = false;
    this.readonly = false;
    this.maxlength = 0;
    this.autocomplete = "";
    this.resize = "vertical";
    this.size = "md";
    this.minWidth = 420;
    this.filled = false;
    this.focused = false;
    this.invalid = false;
  }
  /* What the markup came with: what the element holds at first, and what a
     reset puts back. Read once, before the first keystroke. */
  #initial;
  willUpdate() {
    this.#initial ??= this.filled ? this.value : "";
  }
  updated(changed) {
    const area = this.querySelector("textarea");
    if (area) {
      for (const [key2, value] of Object.entries(this.attrs())) {
        if (value === null) area.removeAttribute(key2);
        else if (area.getAttribute(key2) !== value) area.setAttribute(key2, value);
      }
      const written2 = this.filled ? this.value : "";
      if (area.value !== written2) area.value = written2;
    }
    if (changed.has("error") || !this.#validated) this.setValidity(this.error, "textarea");
    this.#validated = true;
  }
  #validated = false;
  /* Every attribute the control carries, `null` for one it has not. */
  attrs() {
    const disabled = this.disabled || this.inheritedDisabled;
    const or = (value) => value || null;
    return {
      rows: String(this.rows),
      id: or(this.fieldId),
      name: or(this.name),
      placeholder: this.filled ? null : or(this.value),
      "aria-label": or(this.label ?? ""),
      autocomplete: or(this.autocomplete),
      maxlength: this.maxlength ? String(this.maxlength) : null,
      "aria-invalid": this.invalid || this.error ? "true" : null,
      required: this.required ? "" : null,
      disabled: disabled ? "" : null,
      readonly: this.readonly ? "" : null
    };
  }
  /* The control as the first render wrote it. A prerendered page submits it
     before a script runs, so it carries every attribute then. */
  #drawn;
  restore() {
    this.value = this.#initial || this.value;
    this.filled = !!this.#initial;
  }
  onInput(event) {
    const area = event.target;
    this.value = area.value;
    this.filled = area.value !== "";
    this.error = "";
    this.dispatchEvent(new CustomEvent("sds-input", { detail: area.value, bubbles: true, composed: true }));
  }
  render() {
    const cls = `${fieldBox(this)} sds-field--multi`;
    const box2 = `width:${this.minWidth}px; max-width:100%`;
    const written2 = Object.entries(this.attrs()).map(([key2, value]) => value === null ? "" : value === "" ? ` ${key2}` : ` ${key2}="${esc(value)}"`).join("");
    const area = this.#drawn ??= `<textarea class="sds-input"${written2}>${esc(this.#initial ?? "")}</textarea>`;
    const control = html17`<span class="${cls}" style="${box2}" @input="${(e) => this.onInput(e)}">${unsafeHTML2(area)}</span>`;
    return fieldRow(this, control);
  }
};
define("sds-textarea", SdsTextarea);

// packages/frontend/src/components/switch.ts
import { html as html18, nothing as nothing9 } from "lit";
var SdsSwitch = class extends SdsFormElement {
  static {
    this.properties = {
      label: { type: String },
      hint: { type: String },
      checked: { type: Boolean, reflect: true },
      name: { type: String },
      value: { type: String },
      disabled: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.label = "";
    this.hint = "";
    this.checked = false;
    this.name = "";
    this.value = "";
    this.disabled = false;
  }
  /* What the markup said, which is what a reset puts back. `?checked` writes
     the `checked` *attribute* — the input's default — so a mirror of the live
     state into it makes a reset restore the last press instead. */
  #initial;
  willUpdate() {
    this.#initial ??= this.checked;
  }
  /* The live state goes onto the control after the render, never as a
     binding. The static renderer writes a `.checked` binding as
     `checked="false"`, which in HTML means checked. So every box on every
     generated card came out on. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  updated() {
    const input = this.querySelector("input");
    if (input) input.checked = this.checked;
  }
  restore() {
    this.checked = this.#initial ?? false;
  }
  onChange(event) {
    this.checked = event.target.checked;
    this.dispatchEvent(
      new CustomEvent("sds-change", { detail: this.checked, bubbles: true, composed: true })
    );
  }
  render() {
    return html18`<label class="sds-switch">
  <input
    class="sds-switch__track"
    type="checkbox"
    role="switch"
    name="${this.name || nothing9}"
    value="${this.value || nothing9}"
    ?checked="${this.#initial ?? this.checked}"
    ?disabled="${this.disabled}"
    @change="${this.onChange}"
  />
  <span class="sds-switch__body">
    <span class="sds-switch__label">${this.label}</span>
    ${this.hint ? html18`<span class="sds-switch__hint">${this.hint}</span>` : nothing9}
  </span>
</label>`;
  }
};
define("sds-switch", SdsSwitch);

// packages/frontend/src/components/range.ts
import { html as html19, nothing as nothing10 } from "lit";
var SdsRange = class extends SdsFormElement {
  static {
    this.properties = {
      caption: { type: String },
      label: { type: String },
      name: { type: String },
      min: { type: String },
      max: { type: String },
      step: { type: String },
      value: { type: String },
      unit: { type: String },
      hint: { type: String },
      disabled: { type: Boolean, reflect: true },
      fieldId: { type: String, attribute: "field-id" }
    };
  }
  constructor() {
    super();
    this.caption = "";
    this.name = "";
    this.min = "0";
    this.max = "100";
    this.step = "1";
    this.value = "50";
    this.unit = "";
    this.hint = "";
    this.disabled = false;
    this.fieldId = "";
  }
  /* Where the markup put it, which is what a reset puts back. */
  #initial;
  willUpdate() {
    this.#initial ??= this.value;
  }
  updated() {
    const input = this.querySelector("input");
    if (input) input.value = this.value;
  }
  restore() {
    this.value = this.#initial ?? this.value;
  }
  onInput(event) {
    this.value = event.target.value;
    this.dispatchEvent(new CustomEvent("sds-input", { detail: this.value, bubbles: true, composed: true }));
  }
  render() {
    const id = this.fieldId || nothing10;
    const slider = html19`<input
    class="sds-range__slider"
    type="range"
    id="${id}"
    name="${this.name || nothing10}"
    min="${this.min}"
    max="${this.max}"
    step="${this.step}"
    value="${this.#initial ?? this.value}"
    aria-label="${this.label ?? nothing10}"
    ?disabled="${this.disabled}"
    @input="${this.onInput}"
  />`;
    if (!this.caption) return html19`<span class="sds-range">${slider}</span>`;
    return html19`<div class="sds-field-row sds-range">
  <span class="sds-range__head">
    <label class="sds-field-label" for="${id}">${this.caption}</label>
    <output class="sds-range__value" for="${id}" aria-disabled="${this.disabled ? "true" : nothing10}">${this.value}${this.unit ? ` ${this.unit}` : ""}</output>
  </span>
  ${slider}
  ${this.hint ? html19`<span class="sds-field-hint">${this.hint}</span>` : nothing10}
</div>`;
  }
};
define("sds-range", SdsRange);

// packages/frontend/src/components/file.ts
import { html as html20, nothing as nothing11 } from "lit";
var SdsFile = class extends SdsFormElement {
  static {
    this.properties = {
      caption: { type: String },
      label: { type: String },
      name: { type: String },
      accept: { type: String },
      multiple: { type: Boolean, reflect: true },
      hint: { type: String },
      error: { type: String },
      required: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      fieldId: { type: String, attribute: "field-id" }
    };
  }
  constructor() {
    super();
    this.caption = "";
    this.name = "";
    this.accept = "";
    this.multiple = false;
    this.hint = "";
    this.error = "";
    this.required = false;
    this.disabled = false;
    this.fieldId = "";
  }
  /* What the caller said is wrong is what the browser refuses to submit past.
     Reported on the control itself rather than on the element around it. */
  updated() {
    this.setValidity(this.error, "input");
  }
  onChange(event) {
    const files = [...event.target.files ?? []];
    this.dispatchEvent(new CustomEvent("sds-change", { detail: files, bubbles: true, composed: true }));
  }
  render() {
    const id = this.fieldId || nothing11;
    const control = html20`<input
    class="sds-file"
    type="file"
    id="${id}"
    name="${this.name || nothing11}"
    accept="${this.accept || nothing11}"
    aria-label="${this.label ?? nothing11}"
    aria-invalid="${this.error ? "true" : nothing11}"
    ?multiple="${this.multiple}"
    ?required="${this.required}"
    ?disabled="${this.disabled || this.inheritedDisabled}"
    @change="${this.onChange}"
  />`;
    return fieldRow(this, control);
  }
};
define("sds-file", SdsFile);

// packages/frontend/src/components/progress.ts
import { html as html21, nothing as nothing12 } from "lit";
var NNBSP = "\u202F";
var NBSP = "\xA0";
var SdsProgress = class extends SdsElement {
  constructor() {
    super();
    /* What a caller wrote between the tags, taken before Lit renders over it. */
    this.taken = null;
    this.caption = "";
    this.value = 0;
    this.max = 100;
    this.readout = "percent";
    this.unit = "";
    this.note = "";
    this.size = "medium";
    this.pulsing = false;
  }
  static {
    this.properties = {
      caption: { type: String },
      label: { type: String },
      value: { type: Number },
      max: { type: Number },
      readout: { type: String },
      unit: { type: String },
      note: { type: String },
      size: { type: String },
      pulsing: { type: Boolean }
    };
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => !isBlank(node));
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  /** The whole. A caller that counts from a total it has not got yet can
      report zero. A share of nothing is a division this cannot do. */
  get whole() {
    return this.max > 0 ? this.max : 100;
  }
  /** Where it stands, clamped. Work that overruns its own estimate draws a
      full bar, never one that runs out of its track. A value that is not a
      number at all is nothing done rather than a bar of `NaN`. */
  get at() {
    if (!Number.isFinite(this.value)) return 0;
    return Math.min(Math.max(this.value, 0), this.whole);
  }
  /** The number a reader gets. Rounded, because a percentage with two
      decimals is a measurement and this is a position. */
  get percent() {
    return Math.round(this.at / this.whole * 100);
  }
  /** What the read-out says, and what a screen reader gets in place of the
      bare number. Empty where the caller asked for no read-out. */
  said() {
    if (this.readout === "count") {
      return `${this.at}${NBSP}of${NBSP}${this.whole}${this.unit ? `${NNBSP}${this.unit}` : ""}`;
    }
    return this.readout === "percent" ? `${this.percent}%` : "";
  }
  render() {
    const said = this.said();
    const name = this.label || this.caption;
    const note = this.taken ?? this.content ?? (this.note || void 0);
    const cls = ["sds-progress"];
    if (this.size === "small") cls.push("sds-progress--small");
    if (this.pulsing) cls.push("sds-progress--pulsing");
    const width2 = `${Math.round(this.at / this.whole * 1e4) / 100}%`;
    return html21`<div class="${cls.join(" ")}" style="--sds-progress-at:${width2}">
  ${this.caption || said ? html21`<span class="sds-progress__head">
    <span class="sds-progress__caption">${this.caption}</span>
    ${said ? html21`<span class="sds-progress__value">${said}</span>` : nothing12}
  </span>` : nothing12}
  <span
    class="sds-progress__track"
    role="progressbar"
    aria-valuemin="0"
    aria-label="${name || nothing12}"
    aria-valuemax="${this.whole}"
    aria-valuenow="${this.at}"
    aria-valuetext="${said || nothing12}"
    aria-busy="${this.pulsing ? "true" : nothing12}"
  ><span class="sds-progress__fill"></span></span>
  ${note ? html21`<span class="sds-progress__note">${note}</span>` : nothing12}
</div>`;
  }
};
define("sds-progress", SdsProgress);

// packages/frontend/src/components/field-group.ts
import { html as html22 } from "lit";
var SdsFieldGroup = class extends SdsElement {
  constructor() {
    super(...arguments);
    /* What a caller wrote between the tags, taken before Lit renders over it.
       What stands in the group is the caller's business; the group only pays
       the distances. */
    this.taken = null;
  }
  connectedCallback() {
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    return html22`<div class="sds-field-group">${this.taken ?? this.content}</div>`;
  }
};
define("sds-field-group", SdsFieldGroup);

// packages/frontend/src/components/checkbox.ts
import { html as html23, nothing as nothing13 } from "lit";
var SdsCheckbox = class extends SdsFormElement {
  static {
    this.properties = {
      label: { type: String },
      hint: { type: String },
      checked: { type: Boolean, reflect: true },
      indeterminate: { type: Boolean, reflect: true },
      name: { type: String },
      value: { type: String },
      required: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.label = "";
    this.hint = "";
    this.checked = false;
    this.indeterminate = false;
    this.name = "";
    this.value = "";
    this.required = false;
    this.disabled = false;
  }
  /* What the markup said, which is what a reset puts back. `?checked` writes
     the `checked` *attribute* — the input's default — so a mirror of the live
     state into it makes a reset restore the last click instead. */
  #initial;
  willUpdate() {
    this.#initial ??= this.checked;
  }
  /* The live state goes onto the control after the render, never as a
     binding. The static renderer writes a `.checked` binding as
     `checked="false"`, which in HTML means checked. So every box on every
     generated card came out on. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  updated() {
    const input = this.querySelector("input");
    if (!input) return;
    input.checked = this.checked;
    input.indeterminate = this.indeterminate;
  }
  restore() {
    this.checked = this.#initial ?? false;
  }
  /* A tick is what makes it checked. A caller that had to write the state
     back is a caller that will forget once. A mixed box with a tick is no
     longer mixed, which the input has already decided by the time this runs. */
  onChange(event) {
    this.checked = event.target.checked;
    this.indeterminate = false;
    this.dispatchEvent(
      new CustomEvent("sds-change", { detail: this.checked, bubbles: true, composed: true })
    );
  }
  render() {
    return html23`<label class="sds-check">
  <input
    class="sds-check__mark"
    type="checkbox"
    name="${this.name || nothing13}"
    value="${this.value || nothing13}"
    ?checked="${this.#initial ?? this.checked}"
    ?required="${this.required}"
    ?disabled="${this.disabled}"
    @change="${this.onChange}"
  />
  <span class="sds-check__body">
    <span class="sds-check__label">${this.label}</span>
    ${this.hint ? html23`<span class="sds-check__hint">${this.hint}</span>` : nothing13}
  </span>
</label>`;
  }
};
define("sds-checkbox", SdsCheckbox);

// packages/frontend/src/components/checkbox-group.ts
import { html as html24, nothing as nothing14 } from "lit";
var SdsCheckboxGroup = class extends SdsFormElement {
  static {
    this.properties = {
      legend: { type: String },
      legendSaidOnly: { type: Boolean, attribute: "legend-said-only" },
      name: { type: String },
      choices: { type: Array },
      values: { type: Array },
      hint: { type: String }
    };
  }
  constructor() {
    super();
    this.legend = "";
    this.legendSaidOnly = false;
    this.name = "";
    this.choices = [];
    this.values = [];
    this.hint = "";
  }
  /* What the markup ticked, which is what a reset puts back. `?checked` writes
     the boxes' *defaults*; a mirror of the live set into them makes a reset
     restore the last click. */
  #initial;
  willUpdate() {
    this.#initial ??= this.values;
  }
  /* The live state goes onto the control after the render, never as a
     binding. The static renderer writes a `.checked` binding as
     `checked="false"`, which in HTML means checked. So every box on every
     generated card came out on. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  updated() {
    for (const input of this.querySelectorAll("input")) input.checked = this.values.includes(input.value);
  }
  restore() {
    this.values = this.#initial ?? [];
  }
  toggle(value, on) {
    const kept2 = this.values.filter((held2) => held2 !== value);
    this.values = on ? [...kept2, value] : kept2;
    this.dispatchEvent(
      new CustomEvent("sds-change", { detail: this.values, bubbles: true, composed: true })
    );
  }
  render() {
    return html24`<fieldset class="sds-choices">
  <legend class="sds-field-label${this.legendSaidOnly ? " sds-said-only" : ""}">${this.legend}</legend>
  ${this.hint ? html24`<span class="sds-field-hint">${this.hint}</span>` : nothing14}
  ${this.choices.map((choice) => {
      const value = choice.value ?? choice.label;
      return html24`<label class="sds-check">
    <input
      class="sds-check__mark"
      type="checkbox"
      name="${this.name}"
      value="${value}"
      ?checked="${(this.#initial ?? this.values).includes(value)}"
      ?disabled="${choice.disabled ?? false}"
      @change="${(e) => this.toggle(value, e.target.checked)}"
    />
    <span class="sds-check__body">
      <span class="sds-check__label">${choice.label}</span>
      ${choice.hint ? html24`<span class="sds-check__hint">${choice.hint}</span>` : nothing14}
    </span>
  </label>`;
    })}
</fieldset>`;
  }
};
define("sds-checkbox-group", SdsCheckboxGroup);

// packages/frontend/src/components/radio.ts
import { html as html25, nothing as nothing15 } from "lit";
var SdsRadio = class extends SdsFormElement {
  static {
    this.properties = {
      legend: { type: String },
      legendSaidOnly: { type: Boolean, attribute: "legend-said-only" },
      name: { type: String },
      choices: { type: Array },
      value: { type: String },
      hint: { type: String },
      required: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.legend = "";
    this.legendSaidOnly = false;
    this.name = "";
    this.choices = [];
    this.value = "";
    this.hint = "";
    this.required = false;
  }
  /* The answer the markup came with, which is what a reset puts back.
     `?checked` writes the `checked` *attribute*, the input's default. A
     mirror of the chosen value into it makes a reset restore the last click
     instead of the answer the page came with. */
  #initial;
  willUpdate() {
    this.#initial ??= this.value;
  }
  /* The live state goes onto the control after the render, never as a
     binding. The static renderer writes a `.checked` binding as
     `checked="false"`, which in HTML means checked. So every box on every
     generated card came out on. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  updated() {
    for (const input of this.querySelectorAll("input")) input.checked = input.value === this.value;
  }
  restore() {
    this.value = this.#initial ?? "";
  }
  choose(choice) {
    this.value = choice.value ?? choice.label;
    this.dispatchEvent(
      new CustomEvent("sds-change", { detail: this.value, bubbles: true, composed: true })
    );
  }
  render() {
    return html25`<fieldset class="sds-choices" name="${this.name || nothing15}">
  <legend class="sds-field-label${this.legendSaidOnly ? " sds-said-only" : ""}">${this.legend}${this.required ? html25` <span class="sds-field-req">required</span>` : nothing15}</legend>
  ${this.hint ? html25`<span class="sds-field-hint">${this.hint}</span>` : nothing15}
  ${this.choices.map((choice) => {
      const value = choice.value ?? choice.label;
      return html25`<label class="sds-check">
    <input
      class="sds-check__mark"
      type="radio"
      name="${this.name}"
      value="${value}"
      ?checked="${value === (this.#initial ?? this.value)}"
      ?required="${this.required}"
      @change="${() => this.choose(choice)}"
    />
    <span class="sds-check__body">
      <span class="sds-check__label">${choice.label}</span>
      ${choice.hint ? html25`<span class="sds-check__hint">${choice.hint}</span>` : nothing15}
    </span>
  </label>`;
    })}
</fieldset>`;
  }
};
define("sds-radio", SdsRadio);

// packages/frontend/src/components/form-errors.ts
import { html as html27 } from "lit";

// packages/frontend/src/components/note.ts
import { html as html26, nothing as nothing16 } from "lit";
var SdsNote = class _SdsNote extends SdsElement {
  constructor() {
    super();
    /* What a caller wrote between the tags, taken before Lit renders over it —
       see `SdsElement.lifted()` for why the question comes exactly once. */
    this.taken = null;
    /* The press, where the action is a decision rather than a place. It carries
       the label rather than an id. A page that listens above several notes
       reads the pressed one and holds a reference to none of them. A link
       navigates, and says nothing here. */
    this.onPress = () => {
      if (this.href) return;
      this.dispatchEvent(
        new CustomEvent("sds-note-action", { detail: this.action, bubbles: true, composed: true })
      );
    };
    this.tone = "info";
    this.heading = "";
    this.body = "";
    this.label = "";
    this.action = "";
    this.href = "";
  }
  static {
    /** The glyph each tone carries. */
    this.TONE_ICON = {
      info: "actions-info-circle",
      ok: "actions-check-circle",
      warn: "actions-exclamation-triangle",
      error: "actions-exclamation-circle"
    };
  }
  static {
    /** And what it says, for a reader who is not looking at the colour. */
    this.TONE_LABEL = {
      info: "Note",
      ok: "Success",
      warn: "Warning",
      error: "Error"
    };
  }
  static {
    this.properties = {
      tone: { type: String, reflect: true },
      heading: { type: String },
      body: { type: String },
      icon: { type: String },
      label: { type: String },
      action: { type: String },
      href: { type: String }
    };
  }
  connectedCallback() {
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    const said = this.label || _SdsNote.TONE_LABEL[this.tone];
    return html26`<div class="sds-note sds-note--${this.tone}">
  <span class="sds-note__icon"><sds-icon name="${this.icon ?? _SdsNote.TONE_ICON[this.tone]}" label="${said}"></sds-icon></span>
  <div class="sds-note__content">
    ${this.heading ? html26`<div class="sds-note__title">${this.heading}</div>` : nothing16}
    <div class="sds-note__body">${this.taken ?? this.content ?? this.body}</div>
  </div>${this.action ? html26`
  <div class="sds-note__action" @click="${this.onPress}">${buttonMarkup({ variant: "secondary", size: "sm", href: this.href }, this.action)}</div>` : nothing16}
</div>`;
  }
};
define("sds-note", SdsNote);

// packages/frontend/src/components/form-errors.ts
var SdsFormErrors = class extends SdsElement {
  static {
    this.properties = {
      errors: { type: Array },
      heading: { type: String },
      announce: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.errors = [];
    this.heading = "";
    this.announce = false;
  }
  /** Move the reader to the summary. A summary nobody lands on is a summary
      nobody reads. */
  focusSummary() {
    this.querySelector(".sds-form-errors")?.focus();
  }
  updated(changed) {
    if (!changed.has("errors") && !changed.has("announce")) return;
    if (this.announce && this.errors.length) this.focusSummary();
  }
  render() {
    if (!this.errors.length) return html27``;
    const count = this.errors.length;
    const heading = this.heading || `${count} ${count === 1 ? "answer needs" : "answers need"} changing`;
    return html27`<div class="sds-form-errors" tabindex="-1" role="alert" aria-live="assertive">
  <sds-note
    tone="error"
    heading="${heading}"
    .body="${html27`<span class="sds-form-errors__list">${this.errors.map(
      (error) => html27`<a class="sds-link" href="#${error.for ?? ""}">${error.message}</a>`
    )}</span>`}"
  ></sds-note>
</div>`;
  }
};
define("sds-form-errors", SdsFormErrors);

// packages/frontend/src/components/nav-pills.ts
import { html as html29 } from "lit";

// packages/frontend/src/components/nav-base.ts
import { html as html28, nothing as nothing17 } from "lit";
var asEntry = (item) => typeof item === "string" ? { label: item } : item;
var branch = (entry) => [entry, ...(entry.items ?? []).flatMap(branch)];
var navLabel = (item) => asEntry(item).label;
var navInside = (item) => {
  const { icon, label } = asEntry(item);
  return icon ? html28`<sds-icon name="${icon}"></sds-icon>${label}` : html28`${label}`;
};
var navHref = (item) => asEntry(item).href;
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
  /** Make an item current, and say so. Called by the items this renders, and
      by a subclass that has its own reason to move. */
  choose(index) {
    if (index === this.active) return;
    this.active = index;
    this.dispatchEvent(
      new CustomEvent("sds-change", {
        detail: { index, label: navLabel(this.items[index]) },
        bubbles: true,
        composed: true
      })
    );
  }
  /** A glyph before the label, where the item asked for one. */
  inside_(item) {
    return navInside(item);
  }
  /** Which entry is the current one: the entry that says so, and `active`
      where none does. Data wins. A list that names the page it is on states a
      fact, while `active` is a position in a set. Trust in both at once is
      how two items come out marked. */
  at() {
    const named2 = this.items.findIndex((item) => asEntry(item).current);
    return named2 >= 0 ? named2 : this.active;
  }
  /** The class an item carries, active included. An entry the current one sits
      under gets the mark too: a section is where the reader is, but not the
      page they are on. */
  class_(index) {
    const here = index === this.at() || Boolean(asEntry(this.items[index]).here);
    return here ? `${this.item} is-active` : this.item;
  }
  items_() {
    const at = this.at();
    return this.items.map((item, i) => {
      const cls = this.class_(i);
      const current = i === at;
      const href = navHref(item);
      const inside = this.inside_(item);
      return href ? html28`<a class="${cls}" href="${href}" aria-current="${current ? "page" : nothing17}">${inside}</a>` : html28`<button type="button" class="${cls}" aria-current="${current ? "true" : nothing17}" @click="${() => this.choose(i)}">${inside}</button>`;
    });
  }
};

// packages/frontend/src/components/nav-pills.ts
var SdsNavPills = class extends SdsNav {
  constructor() {
    super(...arguments);
    this.block = "sds-pills";
    this.item = "sds-pill";
  }
  render() {
    return html29`<nav class="${this.block}">
  ${lines(this.items_(), 2)}
</nav>`;
  }
};
define("sds-nav-pills", SdsNavPills);

// packages/frontend/src/components/nav-main.ts
import { html as html35, nothing as nothing19 } from "lit";

// packages/frontend/src/lib/lockup.ts
import { html as html33 } from "lit";

// packages/frontend/src/components/image.ts
import { html as html32 } from "lit";

// packages/frontend/src/lib/zoom.ts
import { html as html31 } from "lit";
import { ifDefined as ifDefined2 } from "lit/directives/if-defined.js";

// packages/frontend/src/components/lightbox.ts
import { html as html30, nothing as nothing18 } from "lit";

// packages/frontend/src/lib/hold.ts
var held = /* @__PURE__ */ new Map();
function write() {
  const names = [...held].filter(([, count]) => count > 0).map(([name]) => name);
  if (names.length) document.documentElement.setAttribute("data-sds-hold", names.join(" "));
  else document.documentElement.removeAttribute("data-sds-hold");
}
function hold(name) {
  held.set(name, (held.get(name) ?? 0) + 1);
  write();
  let done = false;
  return () => {
    if (done) return;
    done = true;
    held.set(name, (held.get(name) ?? 1) - 1);
    write();
  };
}

// packages/frontend/src/components/lightbox.ts
var STEP = 1.25;
var WHEEL = 15e-4;
var LEAST = 0.1;
var MOST = 8;
var PAN = 48;
var SdsLightbox = class extends SdsElement {
  constructor() {
    super();
    /* What a button pointed at this one asks for. `sds-figure` opens its own
       viewer with `show()`, because it owns it. Anything else names this
       element by id and sends the command. So markup opens a drawing rather
       than a script that has to find both ends. */
    this.onCommand = (event) => {
      const command = event.detail?.command ?? "show";
      if (command === "close") this.close();
      else if (command === "toggle") this.open ? this.close() : this.show();
      else this.show();
    };
    /* The view: how large the drawing stands and where. It opens fitted, and
       stays fitted when the window changes, until the reader zooms or moves. */
    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this.fitted = true;
    this.watcher = null;
    this.drag = null;
    this.onWheel = (event) => {
      event.preventDefault();
      const box2 = this.stage.getBoundingClientRect();
      this.zoom(Math.exp(-event.deltaY * WHEEL), { x: event.clientX - box2.left, y: event.clientY - box2.top });
    };
    this.onDown = (event) => {
      if (event.button !== 0) return;
      this.stage.setPointerCapture(event.pointerId);
      this.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, ox: this.x, oy: this.y };
    };
    this.onMove = (event) => {
      if (!this.drag || event.pointerId !== this.drag.id) return;
      this.x = this.drag.ox + event.clientX - this.drag.x;
      this.y = this.drag.oy + event.clientY - this.drag.y;
      this.fitted = false;
      this.apply();
    };
    this.onUp = (event) => {
      if (this.drag?.id === event.pointerId) this.drag = null;
    };
    this.onKey = (event) => {
      const keys = {
        "+": () => this.zoom(STEP),
        "=": () => this.zoom(STEP),
        "-": () => this.zoom(1 / STEP),
        "0": () => this.fit(),
        ArrowLeft: () => this.move(PAN, 0),
        ArrowRight: () => this.move(-PAN, 0),
        ArrowUp: () => this.move(0, PAN),
        ArrowDown: () => this.move(0, -PAN)
      };
      const act = keys[event.key];
      if (!act) return;
      event.preventDefault();
      act();
    };
    /** Fitted, the drawing at its own size; otherwise fitted again. */
    this.onDouble = (event) => {
      if (!this.fitted) return this.fit();
      const box2 = this.stage.getBoundingClientRect();
      this.zoom(1 / this.scale, { x: event.clientX - box2.left, y: event.clientY - box2.top });
    };
    this.src = "";
    this.alt = "";
    this.caption = "";
    this.open = false;
  }
  static {
    this.properties = {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
      content: { attribute: false },
      open: { type: Boolean, reflect: true }
    };
  }
  get dialog() {
    return this.querySelector("dialog");
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("sds-command", this.onCommand);
  }
  disconnectedCallback() {
    this.removeEventListener("sds-command", this.onCommand);
    this.#release?.();
    this.#release = void 0;
    this.watcher?.disconnect();
    this.watcher = null;
    super.disconnectedCallback();
  }
  show() {
    this.open = true;
    void this.updateComplete.then(() => {
      const el = this.dialog;
      if (el && !el.open) el.showModal();
      this.watch();
      void this.ready().then(() => this.fit());
    });
  }
  close() {
    this.dialog?.close();
    this.open = false;
  }
  get stage() {
    return this.querySelector(".sds-lightbox__art");
  }
  get canvas() {
    return this.querySelector(".sds-lightbox__canvas");
  }
  /** The drawing's own size: the viewBox of an inline drawing, or the
      pixels of a file. */
  natural() {
    const picture2 = this.canvas?.firstElementChild;
    if (picture2 instanceof SVGSVGElement) {
      const box2 = picture2.viewBox.baseVal;
      const width2 = box2?.width || Number(picture2.getAttribute("width")) || 0;
      const height = box2?.height || Number(picture2.getAttribute("height")) || 0;
      return width2 && height ? { width: width2, height, raster: false } : null;
    }
    if (picture2 instanceof HTMLImageElement && picture2.naturalWidth) {
      return { width: picture2.naturalWidth, height: picture2.naturalHeight, raster: !/\.svg(\?|#|$)/.test(picture2.src) };
    }
    return null;
  }
  /** A file has its size once it has loaded. */
  async ready() {
    const picture2 = this.canvas?.firstElementChild;
    if (picture2 instanceof HTMLImageElement && !picture2.complete) {
      await new Promise((done) => {
        const stop = new AbortController();
        const end = () => {
          stop.abort();
          done(void 0);
        };
        picture2.addEventListener("load", end, { signal: stop.signal });
        picture2.addEventListener("error", end, { signal: stop.signal });
      });
    }
  }
  watch() {
    if (this.watcher || !this.stage) return;
    this.watcher = new ResizeObserver(() => this.fitted && this.fit());
    this.watcher.observe(this.stage);
  }
  apply() {
    const canvas = this.canvas;
    const size = this.natural();
    if (!canvas || !size) return;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    canvas.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
    const shown = this.querySelector(".sds-lightbox__scale");
    if (shown) shown.textContent = `${Math.round(this.scale * 100)} %`;
  }
  /** The whole drawing in the stage, in the middle. A photograph never
      grows past its own pixels, a drawing does. */
  fit() {
    const stage = this.stage;
    const size = this.natural();
    if (!stage || !size) return;
    const room = parseFloat(getComputedStyle(stage).paddingInlineStart) || 0;
    const across = Math.max(1, stage.clientWidth - room * 2);
    const down = Math.max(1, stage.clientHeight - room * 2);
    const scale = Math.min(across / size.width, down / size.height);
    this.scale = size.raster ? Math.min(scale, 1) : scale;
    this.x = (stage.clientWidth - size.width * this.scale) / 2;
    this.y = (stage.clientHeight - size.height * this.scale) / 2;
    this.fitted = true;
    this.apply();
  }
  /** Zoom by a factor, about a point of the stage that stays put. */
  zoom(factor, at) {
    const stage = this.stage;
    if (!stage || !this.natural()) return;
    const point = at ?? { x: stage.clientWidth / 2, y: stage.clientHeight / 2 };
    const scale = Math.min(MOST, Math.max(LEAST, this.scale * factor));
    this.x = point.x - (point.x - this.x) * (scale / this.scale);
    this.y = point.y - (point.y - this.y) * (scale / this.scale);
    this.scale = scale;
    this.fitted = false;
    this.apply();
  }
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.fitted = false;
    this.apply();
  }
  /* The page stays still behind an open viewer. */
  #release;
  updated() {
    if (this.open && this.isConnected) this.#release ??= hold("modal");
    else if (this.#release) {
      this.#release();
      this.#release = void 0;
    }
    const el = this.dialog;
    if (!el || !this.isConnected) return;
    if (!this.open) {
      this.watcher?.disconnect();
      this.watcher = null;
    }
    try {
      if (this.open && !el.open) el.showModal();
      if (!this.open && el.open) el.close();
    } catch {
      if (this.open) el.setAttribute("open", "");
    }
  }
  /* What the canvas holds. Content handed over as a function draws only
     while the viewer stands open, so a closed viewer costs nothing. */
  drawn() {
    if (typeof this.content === "function") return this.open ? this.content() : nothing18;
    return this.content ?? art(this.src, this.alt);
  }
  render() {
    return html30`<dialog
      class="sds-lightbox"
      aria-label="${this.caption || this.alt}"
      @close="${() => {
      this.open = false;
    }}"
    >${this.open ? this.body() : nothing18}</dialog>`;
  }
  /* What the viewer shows, drawn only while it stands open. A page of
     zoomable pictures carries one empty dialog for each. */
  body() {
    return html30`
  <div class="sds-modal__head">
    <span class="sds-modal__title">${this.caption || this.alt}</span>
    <div class="sds-lightbox__tools">
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" title="Zoom out" @click="${() => this.zoom(1 / STEP)}"><sds-icon name="actions-minus"></sds-icon></button>
      <output class="sds-lightbox__scale" aria-live="polite">100 %</output>
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" title="Zoom in" @click="${() => this.zoom(STEP)}"><sds-icon name="actions-plus"></sds-icon></button>
      <button class="sds-btn sds-btn--ghost sds-btn--sm" title="Fit the whole drawing" @click="${() => this.fit()}">Fit</button>
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon sds-modal__close" title="Close" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
    </div>
  </div>
  <div
    class="sds-lightbox__art${exported(this.src) ? " sds-lightbox__art--exported" : ""}"
    tabindex="0"
    aria-label="The drawing. Drag or use the arrow keys to move it, the wheel or plus and minus to zoom, 0 to fit."
    @wheel="${this.onWheel}"
    @pointerdown="${this.onDown}"
    @pointermove="${this.onMove}"
    @pointerup="${this.onUp}"
    @pointercancel="${this.onUp}"
    @keydown="${this.onKey}"
    @dblclick="${this.onDouble}"
  >
    <div class="sds-lightbox__canvas">${this.drawn()}</div>
  </div>`;
  }
};
define("sds-lightbox", SdsLightbox);

// packages/frontend/src/lib/zoom.ts
var openers = /* @__PURE__ */ new WeakMap();
function opener(host) {
  const known = openers.get(host);
  if (known) return known;
  const open = (event) => {
    const viewer = host.querySelector("sds-lightbox");
    if (!viewer?.show) return;
    event.preventDefault();
    viewer.show();
  };
  openers.set(host, open);
  return open;
}
function zoom(host, picture2, options) {
  const { src, alt, caption, content } = options;
  return {
    trigger: content === void 0 ? html31`<a class="sds-zoom" href="${src}" title="Open the picture at full size" @click="${opener(host)}">${picture2}</a>` : html31`<button type="button" class="sds-zoom" title="Open the picture at full size" @click="${opener(host)}">${picture2}</button>`,
    viewer: html31`<sds-lightbox src="${src}" alt="${alt}" caption="${ifDefined2(caption || void 0)}" .content="${content}"></sds-lightbox>`
  };
}

// packages/frontend/src/components/image.ts
var SdsImage = class extends SdsElement {
  static {
    this.properties = {
      src: { type: String },
      alt: { type: String },
      width: { type: Number, reflect: true },
      height: { type: Number, reflect: true },
      zoomable: { type: Boolean, reflect: true },
      /* The class the caller wrote, read as a property rather than off the host.
         `this.className` exists only where there is a DOM, and these render in
         Node too. The declared attribute carries it through both. */
      cls: { attribute: "class", type: String }
    };
  }
  constructor() {
    super();
    this.src = "";
    this.alt = "";
    this.width = 0;
    this.height = 0;
    this.zoomable = false;
    this.cls = "";
  }
  /** What a server wrote between the tags, dropped. The element takes no
      content — the picture follows from `src` — but it does take a fallback.
      That is the same picture in the class layer, for a surface that renders
      before any script. The element redraws it and the server's copy goes, or
      light DOM leaves two pictures in one box. */
  connectedCallback() {
    this.lifted();
    super.connectedCallback();
  }
  render() {
    const width2 = this.width || void 0;
    const height = this.height || void 0;
    const cls = this.cls || (width2 || height ? "" : "sds-art");
    const picture2 = art(this.src, this.alt, { cls, width: width2, height });
    if (!this.zoomable) return picture2;
    const { trigger, viewer } = zoom(this, picture2, { src: this.src, alt: this.alt });
    return html32`${trigger}
${viewer}`;
  }
};
define("sds-image", SdsImage);

// packages/frontend/src/lib/lockup.ts
function lockup({ signet = "", brand = "", product = "", href = "" }) {
  if (!signet && !product) return "";
  const inside = html33`${signet ? html33`<sds-image class="sds-signet" src="${signet}" alt="" width="24" height="24"></sds-image>` : ""}${product ? html33`<span class="sds-wordmark">${brand ? html33`<span class="sds-wordmark__brand">${brand}</span><span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">${product}</span>` : html33`${product}`}</span>` : ""}`;
  return href ? html33`<a class="sds-lockup" href="${href}">${inside}</a>` : html33`<span class="sds-lockup">${inside}</span>`;
}

// packages/frontend/src/components/overlay.ts
import { html as html34 } from "lit";
var SdsOverlay = class extends SdsElement {
  render() {
    return html34`<div class="sds-overlay"></div>`;
  }
};
define("sds-overlay", SdsOverlay);

// packages/frontend/src/components/nav-main.ts
var WALL = 8;
var GRACE = 200;
var seq4 = 0;
function boxes(row2) {
  const out = [];
  const walk = (parent) => {
    for (const child of parent.children) {
      const el = child;
      const style = getComputedStyle(el);
      if (style.display === "none") continue;
      if (style.display === "contents") {
        walk(el);
        continue;
      }
      if (style.position === "absolute" || style.position === "fixed") continue;
      out.push(el);
    }
  };
  walk(row2);
  return out;
}
var widthOf = (el) => el.getBoundingClientRect().width;
var PASSING = /* @__PURE__ */ new Set(["open", "opened", "stack"]);
var SdsNavMain = class extends SdsNav {
  constructor() {
    super();
    this.block = "sds-bar";
    this.item = "sds-pill";
    this.drawerId = `sds-bar-drawer-${++seq4}`;
    /** What the sections and the field need in the row. Zero means "no
        measurement yet". Each measures only where it is: in the row. */
    this.needNav = 0;
    this.needSearch = 0;
    this.watched = false;
    /** Which way the drawer has just stepped, and how tall it was before it did.
        The render that shows the step reads both once. */
    this.stepped = null;
    this.stood = 0;
    /** The links a server wrote between the tags, moved into the row. A rendered
        site resolves its own navigation before it sends the page. A pass back
        through `items` encodes and resolves it a second time. So they stay as
        written, `target`, `rel` and current mark intact. */
    this.taken = [];
    this.onOutside = (event) => {
      if (!this.open && this.opened < 0) return;
      if (event.composedPath().includes(this)) return;
      this.open = false;
      this.opened = -1;
      this.reset();
    };
    /* A drawer opened to get somewhere has done its job on the choice of a
       page. Only a link: everything else in there, a fold, a heading, the
       field, is the reader still on the way. */
    this.onFollow = (event) => {
      if (event.target?.closest("a")) this.open = false;
    };
    this.home = "";
    this.signet = "";
    this.brand = "";
    this.product = "";
    this.search = false;
    this.index = "";
    this.menu = { label: "" };
    this.languages = [];
    this.label = "Menu";
    this.themeKey = "";
    this.open = false;
    this.opened = -1;
    this.stack = [];
    this.foldNav = false;
    this.foldSearch = false;
  }
  static {
    this.properties = {
      ...SdsNav.properties,
      home: { type: String },
      signet: { type: String },
      brand: { type: String },
      product: { type: String },
      search: { type: Boolean },
      index: { type: String },
      menu: { type: Object },
      languages: { type: Array },
      label: { type: String },
      themeKey: { type: String, attribute: "theme-key" },
      open: { type: Boolean, state: true },
      opened: { type: Number, state: true },
      stack: { type: Array, state: true },
      foldNav: { type: Boolean, state: true },
      foldSearch: { type: Boolean, state: true }
    };
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => node.nodeType === 1);
    if (written2.length) this.taken = written2;
    super.connectedCallback();
    this.watch = new ResizeObserver(() => requestAnimationFrame(() => this.isConnected && this.decide()));
    void document.fonts?.ready.then(() => {
      this.needNav = 0;
      this.needSearch = 0;
      this.foldNav = false;
      this.foldSearch = false;
      void this.updateComplete.then(() => this.decide());
    });
    document.addEventListener("pointerdown", this.onOutside);
  }
  disconnectedCallback() {
    clearTimeout(this.leaving);
    this.watch?.disconnect();
    this.watched = false;
    document.removeEventListener("pointerdown", this.onOutside);
    super.disconnectedCallback();
  }
  /** Where the drawer opens: on the reader's own level, the entry that holds
      their page. A menu that always opens at the top asks somebody three
      sections deep to walk back down to where they were. The way up is one
      press, and the way down is not. */
  path() {
    const walk = (entry, trail) => {
      for (const child of entry.items ?? []) {
        if (child.current) return trail;
        const under = walk(child, [...trail, child]);
        if (under) return under;
      }
      return null;
    };
    return walk(this.menu, []) ?? [];
  }
  /** Back to that level. A reader who stepped somewhere and closed the drawer
      is not still asking about it the next time they open one. */
  reset() {
    const at = this.path();
    if (at.length !== this.stack.length || at.some((entry, i) => entry !== this.stack[i])) {
      this.stack = at;
    }
  }
  onKey(event) {
    if (event.key === "Escape") {
      if (this.opened >= 0) {
        const at = this.opened;
        this.opened = -1;
        void this.updateComplete.then(
          () => this.querySelectorAll(".sds-bar__fold > summary")[at]?.focus()
        );
        return;
      }
      if (!this.open) return;
      this.open = false;
      this.reset();
      this.querySelector(".sds-bar__toggle")?.focus();
      return;
    }
    this.walk(event);
  }
  /** The rows of the list the key press happened in: a panel under one
      section, or the drawer with the whole menu. */
  list(from) {
    const drawer = from.closest(".sds-bar__drawer");
    const scope = drawer ?? from.closest(".sds-bar__section");
    if (!scope) return [];
    const rows = drawer ? (
      /* The folds count as rows. The arrows read a tree as it stands, and a
         closed section is one line until it opens. */
      scope.querySelectorAll(".sds-rail__group > summary, .sds-rail__item, .sds-pill, .sds-bar__link")
    ) : scope.querySelectorAll(".sds-bar__panel .sds-bar__link");
    return [...rows].filter((row2) => {
      if (!row2.getClientRects().length) return false;
      const shut = row2.closest("details:not([open])");
      return !shut || row2.matches("summary");
    });
  }
  /** Down a list of pages and back up it. The arrow that opens a panel steps
      into it in the same breath. Tab stays as it is: it is how a reader
      leaves. */
  walk(event) {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const from = event.target;
    if (!from || !this.contains(from)) return;
    const markers = [...this.querySelectorAll(".sds-bar__fold > summary")];
    const marker2 = from.closest("summary");
    if (marker2 && markers.includes(marker2) && event.key === "ArrowDown") {
      const at2 = markers.indexOf(marker2);
      event.preventDefault();
      this.opened = at2;
      void this.updateComplete.then(() => this.list(marker2)[0]?.focus());
      return;
    }
    const rows = this.list(from);
    if (rows.length < 2) return;
    const at = rows.indexOf(from);
    if (at < 0) return;
    event.preventDefault();
    const to = event.key === "Home" ? 0 : event.key === "End" ? rows.length - 1 : (
      /* Stops at the ends rather than wrapping: a list that starts over
         at the bottom hides how long it was from whoever cannot see it. */
      Math.min(rows.length - 1, Math.max(0, at + (event.key === "ArrowDown" ? 1 : -1)))
    );
    rows[to]?.focus();
  }
  choose(index) {
    super.choose(index);
    this.open = false;
  }
  /** What is in the row and what is in the drawer, from the room the row has
      rather than from a width. The order is what the bar can best do without:
      the field first, the sections last. */
  decide() {
    const row2 = this.querySelector(".sds-bar");
    if (!row2) return;
    const style = getComputedStyle(row2);
    const gap = parseFloat(style.columnGap) || 0;
    const end = this.querySelector(".sds-bar__end");
    const endGap = end ? parseFloat(getComputedStyle(end).columnGap) || 0 : 0;
    const nav = this.querySelector(".sds-bar__nav");
    if (nav && !this.foldNav && !this.needNav) {
      const items = boxes(nav);
      if (!items.length) return;
      const itemGap = parseFloat(getComputedStyle(nav).columnGap) || 0;
      this.needNav = items.reduce((sum2, el) => sum2 + widthOf(el), 0) + itemGap * (items.length - 1);
    }
    const host = this.querySelector("sds-search");
    const field = this.querySelector(".sds-search");
    if (host && !field) {
      void (host.updateComplete ?? customElements.whenDefined("sds-search")).then(() => this.decide());
      return;
    }
    if (field && !this.foldSearch && !this.needSearch) this.needSearch = widthOf(field);
    const standing = boxes(row2);
    let used = standing.reduce((sum2, el) => sum2 + widthOf(el), 0) + gap * (standing.length - 1);
    if (nav && !this.foldNav) used -= widthOf(nav) + gap;
    if (field && !this.foldSearch) used -= widthOf(field) + endGap;
    const toggle = this.querySelector(".sds-bar__toggle");
    if (toggle) used -= widthOf(toggle) + endGap;
    const room = row2.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - used;
    const button = parseFloat(getComputedStyle(this).getPropertyValue("--control-height")) || 0;
    const wantsSearch = this.search || Boolean(this.index);
    const forNav = this.needNav ? this.needNav + gap : 0;
    const forSearch = wantsSearch ? this.needSearch + endGap : 0;
    const forButton = button + endGap;
    const fits = (need) => need <= room;
    let foldSearch = false;
    let foldNav = false;
    if (!fits(forSearch + forNav)) {
      foldSearch = wantsSearch;
      if (!fits(forNav + forButton)) foldNav = Boolean(this.needNav);
    }
    if (foldSearch === this.foldSearch && foldNav === this.foldNav) return;
    this.foldSearch = foldSearch;
    this.foldNav = foldNav;
    if (!foldNav && !foldSearch) this.open = false;
  }
  field() {
    return html35`<sds-search index="${this.index}"></sds-search>`;
  }
  /** The languages, as the one control at this end that is not a mode. The
      button says the reader's code and nothing else. The row is short of
      width first, and the names are one press away, each in its own language.
      Hung from the end, or a list from the corner runs off the page. */
  languages_() {
    const current = this.languages.find((entry) => entry.current) ?? this.languages[0];
    return html35`<sds-dropdown
      class="sds-bar__lang"
      variant="ghost"
      align="end"
      name="Language"
      label="${current?.lang ?? current?.label ?? ""}"
      .choices="${this.languages}"
    ></sds-dropdown>`;
  }
  /** The sections of the menu that stand in the row. Which sections are the
      front doors is the one thing a tree cannot say, so the menu says it. With
      none named, every section is one. */
  doors() {
    const sections = [...this.menu.items ?? []];
    const named2 = sections.filter((entry) => entry.front);
    return named2.length ? named2 : sections;
  }
  /** One front door: the link, and the fold that opens its pages under the row.
        The link stays a link — pressing a section's name goes to that section,
        and what opens the panel is the marker beside it. A `<details>`, so the
        panel works before any script and the bar only has to say which one is
        open.
  
        A pointer opens it too, on the whole section and not the marker alone. A
        menu that answers only a press asks a reader in motion to stop and aim.
        Nothing goes without it. The marker is the control, and the pointer is a
        shortcut to the same state. */
  door(entry, at) {
    const here = Boolean(entry.current || entry.here);
    const pill = html35`<a
      class="${here ? "sds-pill is-active" : "sds-pill"}"
      href="${entry.href ?? "#"}"
      target="${entry.external ? "_blank" : nothing19}"
      rel="${entry.external ? "noreferrer" : nothing19}"
      aria-current="${entry.current ? "page" : here ? "true" : nothing19}"
    >${entry.label}</a>`;
    const under = entry.items ?? [];
    if (!under.length) return html35`<div class="sds-bar__section">${pill}</div>`;
    const wall = under.length > WALL;
    return html35`<div
      class="${wall ? "sds-bar__section" : "sds-bar__section sds-bar__section--drop"}"
      @pointerenter="${(event) => this.hover(at, event)}"
      @pointerleave="${(event) => this.hover(-1, event)}"
    >
      ${pill}
      <details
        class="sds-bar__fold"
        ?open="${this.opened === at}"
        @toggle="${(event) => this.fold(event, at)}"
      >
        <summary aria-label="Pages in ${entry.label}"><sds-icon name="actions-chevron-down"></sds-icon></summary>
        <div class="sds-bar__panel">
          ${lines(under.map((page) => this.page(page)), 10)}
        </div>
      </details>
    </div>`;
  }
  /** A page in a panel. Two levels and no more. The row is the site's own, and
      the panel is one section's pages. A third level under a bar is a sitemap
      on a menu; the drawer is where a reader reads a whole tree. The
      stylesheet decides where the rows break into columns. A wall is one
      list, and its column count is a question about the room. */
  page(entry) {
    return html35`<a
      class="${entry.current ? "sds-bar__link is-active" : "sds-bar__link"}"
      href="${entry.href ?? "#"}"
      aria-current="${entry.current ? "page" : nothing19}"
    >${entry.label}</a>`;
  }
  /** A pointer over a section opens it, and a pointer off it closes it, only
      while the sections stand in the row. In the drawer they are a list a
      reader scrolls past. A panel that opens under a finger on its way
      somewhere answers a movement nobody made. A mouse only, for the same
      reason. A tap is a press, and the marker beside the link is what a press
      is for. */
  hover(at, event) {
    if (this.foldNav || event.pointerType !== "mouse") return;
    clearTimeout(this.leaving);
    if (at >= 0) {
      this.opened = at;
      return;
    }
    this.leaving = setTimeout(() => {
      this.opened = -1;
    }, GRACE);
  }
  /** Which panel a press left open. The event fires for the bar's own render
      and for a reader's press. The same statement twice keeps the two in
      agreement. */
  fold(event, at) {
    const open = event.target.open;
    if (open) this.opened = at;
    else if (this.opened === at) this.opened = -1;
  }
  /** One level of the menu: what the drawer shows once the row has given the
        sections up.
  
        A level and not the tree: the whole site in one column is forty rows a
        reader scrolls past for the four that matter. So the drawer starts at
        the top level and steps *into* a section. The way in is a control of
        its own, beside the link, because a section is both a page and a place
        to go through. The way back is the row above the list, with the name
        of its target, not "back". */
  level() {
    const inside = this.stack[this.stack.length - 1];
    const entry = inside ?? this.menu;
    const above = this.stack.length > 1 ? this.stack[this.stack.length - 2] : void 0;
    const rows = entry.items ?? [];
    return html35`<nav class="sds-bar__level" aria-label="${entry.label || "Pages"}">
    ${inside ? html35`<button
      type="button"
      class="sds-bar__back"
      @click="${() => {
      this.stack = this.stack.slice(0, -1);
    }}"
    ><sds-icon name="actions-chevron-start"></sds-icon>${above?.label ?? this.menu.label ?? "Menu"}</button>
    ${/* The section's own page, first and unfolded. */
    ""}
    ${inside.href ? this.step(inside, true) : ""}` : ""}
    ${lines(rows.map((row2) => this.step(row2)), 4)}
  </nav>`;
  }
  /** One row of a level: where it goes, and, where it holds pages, the way
      into them. Two controls, for the reason the row above the page has two.
      The label is the page, and the marker is what is under it. */
  step(entry, own = false) {
    const link = html35`<a
      class="${entry.current ? "sds-bar__link is-active" : "sds-bar__link"}"
      href="${entry.href ?? "#"}"
      target="${entry.external ? "_blank" : nothing19}"
      rel="${entry.external ? "noreferrer" : nothing19}"
      aria-current="${entry.current ? "page" : nothing19}"
    >${entry.label}</a>`;
    if (own || !entry.items?.length) return link;
    return html35`<div class="sds-bar__row">
      ${link}
      <button
        type="button"
        class="sds-bar__into"
        aria-label="Pages in ${entry.label}"
        @click="${() => {
      this.stack = [...this.stack, entry];
    }}"
      ><sds-icon name="actions-chevron-end"></sds-icon></button>
    </div>`;
  }
  /** The sections as parts, and which of them the reader is in. Four shapes
      arrive here: as the menu, lifted from the page, handed over as markup, or
      as data. Empty, not absent, where the lift found nothing, so the
      fallback is the length and not a `??` that a `[]` never reaches.
      `lifted()` runs in a browser only. */
  sections() {
    if (this.menu.items?.length) {
      const doors = this.doors();
      return {
        parts: doors.map((entry, at) => this.door(entry, at)),
        at: doors.findIndex((entry) => entry.current || entry.here)
      };
    }
    if (this.taken.length) {
      return {
        parts: [...this.taken],
        at: this.taken.findIndex((el) => el.matches(".is-active, [aria-current]"))
      };
    }
    if (this.content) return { parts: [this.content], at: -1 };
    return { parts: this.items_(), at: this.active < this.items.length ? this.active : -1 };
  }
  /** The sections: a row in the bar, a column in the drawer. */
  nav_() {
    const { parts: parts2 } = this.sections();
    return html35`<nav class="sds-bar__nav" aria-label="Sections">
    ${lines(parts2, 4)}
  </nav>`;
  }
  toggle_() {
    return html35`<button
      type="button"
      class="sds-bar__toggle"
      aria-expanded="${this.open ? "true" : "false"}"
      aria-controls="${this.drawerId}"
      aria-label="${this.label}"
      @click="${() => {
      this.open = !this.open;
      this.reset();
    }}"
    ><sds-icon name="${this.open ? "actions-close" : "actions-list"}"></sds-icon></button>`;
  }
  render() {
    const hasNav = Boolean(this.menu.items?.length || this.taken.length || this.content || this.items.length);
    const wantsSearch = this.search || Boolean(this.index);
    const drawer = this.foldNav || this.foldSearch;
    return html35`<header class="sds-bar" @keydown="${(e) => this.onKey(e)}">
  ${lockup({ signet: this.signet, brand: this.brand, product: this.product, href: this.home || "#" })}
  ${hasNav && !this.foldNav ? this.nav_() : ""}
  <div class="sds-bar__end">
    ${wantsSearch && !this.foldSearch ? this.field() : ""}
    ${this.languages.length ? this.languages_() : ""}
    ${this.themeKey ? html35`<sds-theme key="${this.themeKey}"></sds-theme>` : html35`<sds-theme></sds-theme>`}
    ${drawer ? this.toggle_() : ""}
  </div>
  ${drawer ? html35`${this.open ? html35`<sds-overlay @click="${() => {
      this.open = false;
    }}"></sds-overlay>
  ` : ""}<div class="sds-bar__drawer" id="${this.drawerId}" ?hidden="${!this.open}" @click="${this.onFollow}">
    ${wantsSearch && this.foldSearch ? this.field() : ""}
    ${/* The menu where there is one, and the front doors alone where the bar
        was given nothing but them: the drawer holds every entry of the menu,
        and the row above it none. */
    ""}
    ${hasNav && this.foldNav ? this.menu.items?.length ? this.level() : this.nav_() : ""}
  </div>` : ""}
</header>`;
  }
  willUpdate(changed) {
    if (changed.has("items") || changed.has("menu")) {
      this.needNav = 0;
      this.foldNav = false;
    }
    if (changed.has("menu")) this.stack = this.path();
    if (changed.has("foldNav") && this.foldNav) this.opened = -1;
    if (changed.has("stack") && typeof document !== "undefined") {
      const before = changed.get("stack");
      this.stepped = before && before.length > this.stack.length ? "out" : "in";
      this.stood = this.querySelector(".sds-bar__drawer")?.getBoundingClientRect().height ?? 0;
    }
  }
  updated(changed) {
    if (!this.watched) {
      const row2 = this.querySelector(".sds-bar");
      if (row2 && this.watch) {
        this.watched = true;
        this.watch.observe(row2);
      }
    }
    this.travel();
    if ([...changed.keys()].some((key2) => !PASSING.has(key2))) void this.updateComplete.then(() => this.decide());
  }
  /** The step, shown as one. The level arrives from the side of its approach,
        and the drawer grows into its new height instead of a jump. Both in the
        one duration and curve the system moves anything in, read from the
        tokens, so a change there reaches this too.
  
        Held still for a reader who asked for that. What goes is the travel, not
        the answer. */
  travel() {
    const how = this.stepped;
    this.stepped = null;
    if (!how || typeof matchMedia === "undefined") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const level = this.querySelector(".sds-bar__level");
    const drawer = this.querySelector(".sds-bar__drawer");
    if (!level || !drawer) return;
    const style = getComputedStyle(level);
    const duration = parseFloat(style.getPropertyValue("--duration-fast"));
    const easing = style.getPropertyValue("--ease-out").trim();
    if (!duration || !easing) return;
    const step = style.getPropertyValue("--space-6").trim();
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const away = (parseFloat(step) || 1.5) * (step.endsWith("rem") ? root : 1);
    const forwards = style.direction === "rtl" ? -away : away;
    const from = how === "in" ? forwards : -forwards;
    level.animate(
      [{ opacity: 0, transform: `translateX(${from}px)` }, { opacity: 1, transform: "none" }],
      { duration, easing }
    );
    const now = drawer.getBoundingClientRect().height;
    if (this.stood && Math.abs(now - this.stood) > 1) {
      drawer.animate([{ height: `${this.stood}px` }, { height: `${now}px` }], { duration, easing });
    }
    this.stood = 0;
  }
};
define("sds-nav-main", SdsNavMain);

// packages/frontend/src/components/accordion.ts
import { html as html37, nothing as nothing21 } from "lit";

// packages/frontend/src/components/accordion-item.ts
import { html as html36, nothing as nothing20 } from "lit";
var SdsAccordionItem = class extends SdsElement {
  constructor() {
    super();
    this.taken = null;
    this.question = "";
    this.open = false;
    this.name = "";
    this.anchor = "";
  }
  static {
    this.properties = {
      question: { type: String, reflect: true },
      /** Open. For the first answer on a page of them, usually, so the shape
          of an answer is visible before any press. */
      open: { type: Boolean, reflect: true },
      /** The set this answer folds in — `<details name>`, which is the platform's
          own exclusivity. Empty where the set says `multiple`. */
      name: { type: String, reflect: true },
      /** The address of this one answer. It lands on the answer and not on the
          question. The platform opens a fold when a jump lands *inside* it. One
          the jump lands *at* stays shut, and so does one it lands on the summary
          of. The stylesheet keeps the question over the arrival. */
      anchor: { type: String, reflect: true }
    };
  }
  connectedCallback() {
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  /* The browser unfolds an answer a fragment points into and scrolls to it,
     before any of this runs. Then the upgrade writes that answer again, and
     the arrival goes with the node it happened to. Made once more here, by
     the element that took it away. */
  firstUpdated() {
    if (!this.anchor || globalThis.location?.hash !== `#${this.anchor}`) return;
    this.open = true;
    void this.updateComplete.then(
      () => requestAnimationFrame(() => this.querySelector(`#${CSS.escape(this.anchor)}`)?.scrollIntoView())
    );
  }
  render() {
    return html36`<details
    class="sds-accordion__item"
    name="${this.name || nothing20}"
    ?open="${this.open}"
  >
    <summary class="sds-accordion__head"><sds-icon name="actions-chevron-down"></sds-icon>${this.question}</summary>
    <div class="sds-accordion__body" id="${this.anchor || nothing20}">${this.taken ?? this.content}</div>
  </details>`;
  }
};
define("sds-accordion-item", SdsAccordionItem);

// packages/frontend/src/components/accordion.ts
var SdsAccordion = class extends SdsElement {
  constructor() {
    super();
    /** The questions written between the tags, for answers that are blocks
        rather than a string a property can hold. Taken before Lit renders over
        them, and handed back below. */
    this.taken = null;
    this.entries = [];
    this.multiple = false;
    this.name = "sds-accordion";
  }
  static {
    this.properties = {
      entries: { type: Array },
      multiple: { type: Boolean, reflect: true },
      name: { type: String }
    };
  }
  connectedCallback() {
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    const held2 = this.taken ?? this.content;
    return html37`<div class="sds-accordion">
  ${this.entries.length ? this.entries.map(
      (entry) => html37`<sds-accordion-item
    question="${entry.question}"
    name="${this.multiple ? nothing21 : this.name}"
    anchor="${entry.anchor ?? nothing21}"
    ?open="${Boolean(entry.open)}"
    .content="${entry.answer}"
  ></sds-accordion-item>`
    ) : held2}
</div>`;
  }
  /* A set has one name and `<details name>` wants that name on every answer in
     it. So the items between the tags hear it from here rather than from a
     page that says it on each. Nothing runs here outside a browser: what a
     renderer writes ahead of one, it writes onto the items itself. */
  updated() {
    const group = this.multiple ? "" : this.name;
    for (const item of this.querySelectorAll(":scope > .sds-accordion > sds-accordion-item")) {
      item.name = group;
    }
  }
};
define("sds-accordion", SdsAccordion);

// packages/frontend/src/components/run.ts
import { html as html38, nothing as nothing22 } from "lit";
var MARKS = {
  ahead: { icon: "actions-circle", said: "Not started" },
  /* The set's own spinner — a faint ring and the arc that travels round it,
     which is what `.sds-spinner` turns everywhere in this system. Two spinners
     in one system is one too many, whatever either of them is a picture of. */
  running: { icon: "spinner-circle", said: "Running" },
  done: { icon: "actions-check-circle", said: "Done" },
  failed: { icon: "actions-exclamation-circle", said: "Failed" }
};
var TONES = [
  { mark: "\u2192", tone: "note" },
  { mark: "\u2717", tone: "error" },
  { mark: "\u2713", tone: "ok" }
];
var SdsRun = class extends SdsElement {
  static {
    this.properties = {
      heading: { type: String },
      verdict: { type: String, reflect: true },
      note: { type: String },
      steps: { type: Array },
      open: { type: Boolean, reflect: true },
      stateWords: { type: Object, attribute: "state-words" }
    };
  }
  /** Which rows the reader has opened or closed against what the state does.
      Nobody else has an answer for that, so it is the one piece of state
      this element keeps. */
  #decided = /* @__PURE__ */ new Map();
  constructor() {
    super();
    this.heading = "";
    this.verdict = "running";
    this.note = "";
    this.steps = [];
    this.open = false;
    this.stateWords = {};
  }
  /** The name of a state here. The page's word where it has one, and the
      English of the marks where it has not. */
  said(state2) {
    return this.stateWords[state2] ?? MARKS[state2].said;
  }
  /** The stops in the order they arrive, under the group each one named.
      A run with no groups is one list, which is the sequence. */
  get sets() {
    const held2 = /* @__PURE__ */ new Map();
    this.steps.forEach((step, at) => {
      const name = step.group ?? "";
      const set = held2.get(name) ?? [];
      set.push({ ...step, at });
      held2.set(name, set);
    });
    return [...held2].map(([name, steps]) => ({ name, steps }));
  }
  /* What a step writes runs on, so the reader sees its end. Only when it
     wrote more: a scroll reads the layout the render just wrote. */
  #scrolled = "";
  updated() {
    const output = this.querySelector(".sds-run__step--running .sds-run__output");
    const written2 = output?.textContent ?? "";
    if (!output || written2 === this.#scrolled) return;
    this.#scrolled = written2;
    output.scrollTop = output.scrollHeight;
  }
  /** A press is the reader's answer to "must this stand open?", and the
        answer is the opposite of what stands now. The press and not `toggle`.
        That one fires for a row this element opened by itself, which then
        counts as opened by hand and stays open too long.
  
        The platform's own toggle stops here, because it runs *after* this
        element has rendered the answer and undoes it. One thing decides if a
        row stands open, and it is the answer kept here. */
  decide(event, at, open) {
    if (!event.target.closest(".sds-run__row")) return;
    event.preventDefault();
    this.#decided.set(at, !open);
    this.requestUpdate();
  }
  row(step) {
    const mark = MARKS[step.state];
    const word = this.said(step.state);
    const said = step.note ? `${step.label} \u2014 ${word}. ${step.note}` : `${step.label} \u2014 ${word}`;
    const face = html38`<span
      class="sds-run__mark sds-run__mark--${step.state}${step.state === "running" ? " sds-spinner" : ""}"
    ><sds-icon name="${mark.icon}"></sds-icon></span>`;
    const words = html38`${face}<span class="sds-run__label">${step.label}</span>${step.note ? html38`<span class="sds-run__said">${step.note}</span>` : nothing22}<span class="sds-run__meta">${step.meta ?? ""}</span>`;
    if (!step.output) {
      return html38`<li class="sds-run__step sds-run__step--${step.state}">
      <div class="sds-run__row" aria-label="${said}">${words}</div>
    </li>`;
    }
    const open = this.#decided.get(step.at) ?? step.state !== "done";
    return html38`<li class="sds-run__step sds-run__step--${step.state}">
      <details class="sds-run__fold" ?open="${open}" @click="${(e) => this.decide(e, step.at, open)}">
        <summary class="sds-run__row" aria-label="${said}"><sds-icon
          class="sds-run__chevron" name="actions-chevron-end"></sds-icon>${words}</summary>
        <pre class="sds-run__output">${lines2(step.output)}</pre>
      </details>
    </li>`;
  }
  list(steps) {
    return html38`<ol class="sds-run__list">${steps.map((step) => this.row(step))}</ol>`;
  }
  render() {
    const mark = MARKS[this.verdict];
    return html38`<details class="sds-run" ?open="${this.open}">
  <summary class="sds-run__head"><span
    class="sds-run__verdict sds-run__verdict--${this.verdict}${this.verdict === "running" ? " sds-spinner" : ""}"
  ><sds-icon name="${mark.icon}" label="${this.said(this.verdict)}" size="24"></sds-icon></span><span class="sds-run__headline"><span
    class="sds-run__heading">${this.heading}</span>${this.note ? html38`<span class="sds-run__note">${this.note}</span>` : nothing22}</span><sds-icon class="sds-run__chevron" name="actions-chevron-down"></sds-icon></summary>
  <div class="sds-run__body">${this.sets.map(
      (set) => set.name ? html38`<details class="sds-run__group" open>
      <summary class="sds-run__group-head"><sds-icon
        class="sds-run__chevron" name="actions-chevron-end"></sds-icon>${set.name}</summary>
      ${this.list(set.steps)}
    </details>` : this.list(set.steps)
    )}</div>
</details>`;
  }
};
function lines2(output) {
  const known = drawn.get(output);
  if (known) return known;
  const made = output.split("\n").map((line2) => {
    const tone = TONES.find(({ mark }) => line2.startsWith(mark))?.tone ?? "";
    return html38`<span class="sds-run__line${tone ? ` sds-run__line--${tone}` : ""}">${line2}</span>`;
  });
  drawn.set(output, made);
  if (drawn.size > DRAWN) drawn.delete(drawn.keys().next().value);
  return made;
}
var DRAWN = 64;
var drawn = /* @__PURE__ */ new Map();
define("sds-run", SdsRun);

// packages/frontend/src/components/steps.ts
import { html as html40, nothing as nothing24 } from "lit";

// packages/frontend/src/components/step.ts
import { html as html39, nothing as nothing23 } from "lit";
var SdsStep = class extends SdsElement {
  constructor() {
    super();
    /** What stood between the tags, taken before Lit renders over them. */
    this.taken = null;
    this.heading = "";
    this.optional = false;
    this.anchor = "";
  }
  static {
    this.properties = {
      /** What happens here, in one line. Spelt `heading` because that is the
          name of every title in this system. Not `title`, which is the global
          attribute a browser draws as a tooltip. */
      heading: { type: String, reflect: true },
      /** A stop a reader can skip. The disc stays unfilled and the word stands
          beside the title, because an empty ring says nothing out loud. */
      optional: { type: Boolean, reflect: true },
      /** Where a page links to this one stop. It lands on the stop itself: a step
          has no fold, so there is nothing to open first. */
      anchor: { type: String, reflect: true }
    };
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => !isBlank(node));
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    const title = this.heading ? html39`<p class="sds-steps__title">${this.heading}${this.optional ? html39`<span class="sds-label">Optional</span>` : ""}</p>` : "";
    return html39`<div
    class="sds-steps__step${this.optional ? " sds-steps__step--optional" : ""}"
    role="listitem"
    id="${this.anchor || nothing23}"
  >
    ${title}
    ${this.taken ?? this.content}
  </div>`;
  }
};
define("sds-step", SdsStep);

// packages/frontend/src/components/steps.ts
var SdsSteps = class extends SdsElement {
  constructor() {
    super();
    /** The stops written between the tags, for content that is blocks rather than
        a string a property can hold. Taken before Lit renders over them. */
    this.taken = null;
    this.steps = [];
  }
  static {
    this.properties = {
      steps: { type: Array }
    };
  }
  connectedCallback() {
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    const held2 = this.taken ?? this.content;
    return html40`<div class="sds-steps" role="list">
  ${this.steps.length ? this.steps.map(
      (step) => html40`<sds-step
    heading="${step.heading}"
    anchor="${step.anchor ?? nothing24}"
    ?optional="${Boolean(step.optional)}"
    .content="${step.body}"
  ></sds-step>`
    ) : held2}
</div>`;
  }
};
define("sds-steps", SdsSteps);

// packages/frontend/src/components/tabs.ts
import { html as html42, nothing as nothing25 } from "lit";

// packages/frontend/src/components/tab-item.ts
import { html as html41 } from "lit";
var seq5 = 0;
var SdsTabItem = class extends SdsElement {
  constructor() {
    super();
    /** If a set of tabs decides which panel shows. A panel decides for itself
        until one does, which is what a panel is on a page where nothing
        switches it. Every one hidden there is content in the document and
        invisible in it. The set claims them the moment it exists. */
    this.managed = false;
    this.taken = null;
    this.label = "";
    this.active = false;
    seq5 += 1;
    this.panelId = `sds-tab-panel-${seq5}`;
    this.tabId = `sds-tab-${seq5}`;
  }
  static {
    this.properties = {
      label: { type: String, reflect: true },
      /** A glyph before the label. For a tab whose subject has one — a file
          type, a tool — never as decoration on a set that reads fine without. */
      icon: { type: String, reflect: true },
      active: { type: Boolean, reflect: true }
    };
  }
  connectedCallback() {
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    return html41`<div class="sds-tab__panel" role="tabpanel" id="${this.panelId}" aria-labelledby="${this.tabId}" ?hidden="${this.managed && !this.active}">${this.taken ?? this.content}</div>`;
  }
};
define("sds-tab-item", SdsTabItem);

// packages/frontend/src/components/tabs.ts
function tabsBarMarkup(tabs, active, pick, onKey) {
  const buttons = tabs.map((tab, i) => {
    const cls = i === active ? "sds-tab is-active" : "sds-tab";
    const inside = tab.icon ? html42`<sds-icon name="${tab.icon}"></sds-icon>${tab.label}` : html42`${tab.label}`;
    return html42`<button type="button" class="${cls}" role="${tab.panelId ? "tab" : nothing25}" id="${tab.tabId ?? nothing25}" aria-controls="${tab.panelId ?? nothing25}" aria-selected="${tab.panelId ? String(i === active) : nothing25}" tabindex="${tab.panelId ? i === active ? 0 : -1 : nothing25}" @click="${() => pick?.(i)}">${inside}</button>`;
  });
  return html42`<div class="sds-tabs" role="${tabs[0]?.panelId ? "tablist" : nothing25}" @keydown="${(e) => onKey?.(e)}">
  ${lines(buttons, 2)}
</div>`;
}
var SdsTabs = class _SdsTabs extends SdsNav {
  constructor() {
    super(...arguments);
    this.block = "sds-tabs";
    this.item = "sds-tab";
    /** The panels written between the tags. */
    this.panels = [];
    /* The earlier choice, applied once there is something to match it
       against. The items arrive with the markup or a frame later, and a
       question before they are there settles on nothing, in silence. */
    this.recalled = false;
  }
  static {
    this.properties = {
      /* Lit merges what a subclass declares with what it inherits; the type
         does not, so the base's stand here again. */
      ...SdsNav.properties,
      /** The word that makes sets follow each other. Named for what it does
          rather than for the set's name. A page that shows one setting in four
          places asks the reader to choose a language once. A set with nothing
          here is a set nobody else moves. */
      sync: { type: String, reflect: true }
    };
  }
  static {
    /* Every set on the page that follows a word, so one of them can reach the
       others. A registry rather than an event on the document: what agrees is
       these elements, and a page can hold sets that agree about nothing. */
    this.agreeing = /* @__PURE__ */ new Set();
  }
  /** Take the items written between the tags, if any are there yet. */
  lift() {
    const found = [...this.children].filter((c) => c.tagName.toLowerCase() === "sds-tab-item");
    if (!found.length) return false;
    this.panels = found;
    this.items = this.panels.map((panel) => {
      const icon = panel.getAttribute("icon");
      const label = panel.getAttribute("label") ?? "";
      return icon ? { label, icon } : label;
    });
    for (const panel of this.panels) {
      panel.managed = true;
      panel.remove();
    }
    return true;
  }
  connectedCallback() {
    if (!this.panels.length && !this.lift()) {
      this.arriving = new MutationObserver(() => {
        if (!this.lift()) return;
        this.arriving?.disconnect();
        this.requestUpdate();
      });
      this.arriving.observe(this, { childList: true });
    }
    if (this.sync) _SdsTabs.agreeing.add(this);
    super.connectedCallback();
  }
  /* Children that come with the page around this one arrive in the same
     frame. A frame after the first render with none, the wait stops. */
  firstUpdated() {
    if (!this.arriving) return;
    requestAnimationFrame(() => {
      if (!this.arriving || this.panels.length) return;
      if (this.arriving.takeRecords().length && this.lift()) this.requestUpdate();
      this.arriving.disconnect();
      this.arriving = void 0;
    });
  }
  disconnectedCallback() {
    this.arriving?.disconnect();
    _SdsTabs.agreeing.delete(this);
    super.disconnectedCallback();
  }
  choose(index) {
    super.choose(index);
    this.show();
    this.agree();
  }
  /** Where the choice lives. One key per group, so two sets that agree
      about nothing on the same origin do not overwrite each other. */
  get store() {
    return `sds-tabs:${this.sync}`;
  }
  get labels() {
    return this.items.map(navLabel);
  }
  /* **A preference is an order, not a word.** A reader who picks bash in the
     one block that offers it still prefers PHP to YAML everywhere else. So
     the store holds every word they chose, most recent first, and a set
     takes the first of them it has. */
  get preferred() {
    const kept2 = localStorage.getItem(this.store);
    if (!kept2) return [];
    try {
      return JSON.parse(kept2);
    } catch {
      return [kept2];
    }
  }
  /* Tell the sets that follow the same word, and remember it for the next
     page. A reader reads a manual across ten of them, and a language chosen
     again on each is the same annoyance one level up. */
  agree() {
    if (!this.sync) return;
    const label = this.labels[this.active];
    if (label === void 0) return;
    localStorage.setItem(this.store, JSON.stringify([label, ...this.preferred.filter((w) => w !== label)]));
    for (const other of _SdsTabs.agreeing) {
      if (other !== this && other.sync === this.sync) other.follow(label);
    }
  }
  /* Move because another set did, and do not say it back. By the word and not
     by the position. A block that offers YAML and TypoScript has no PHP. One
     without the word keeps the panel it shows rather than falls back to its
     first. */
  follow(label) {
    const at = this.labels.indexOf(label);
    if (at === -1) return false;
    super.choose(at);
    this.show();
    return true;
  }
  recall() {
    if (this.recalled || !this.sync || !this.items.length) return;
    this.recalled = true;
    for (const label of this.preferred) if (this.follow(label)) return;
  }
  /** Tell each panel if it is the one. */
  show() {
    this.panels.forEach((panel, i) => {
      panel.active = i === this.active;
    });
  }
  /* The arrow keys, because a tablist that only answers the pointer is a
     tablist in name. Home and End are part of the same expectation. */
  onKey(event) {
    const last = this.panels.length - 1;
    const to = event.key === "ArrowRight" ? this.active === last ? 0 : this.active + 1 : event.key === "ArrowLeft" ? this.active === 0 ? last : this.active - 1 : event.key === "Home" ? 0 : event.key === "End" ? last : -1;
    if (to === -1) return;
    event.preventDefault();
    this.choose(to);
    void this.updateComplete.then(() => {
      this.querySelectorAll("button.sds-tab")[to]?.focus();
    });
  }
  render() {
    const named2 = (item) => ({
      label: typeof item === "string" ? item : item?.label ?? "",
      icon: typeof item === "string" ? void 0 : item?.icon
    });
    const tabs = this.panels.length ? this.panels.map((panel, i) => ({
      ...named2(this.items[i]),
      tabId: panel.tabId,
      panelId: panel.panelId
    })) : this.items.map(named2);
    const held2 = this.panels.length ? this.panels : this.content;
    return html42`${tabsBarMarkup(tabs, this.active, (i) => this.choose(i), (e) => this.onKey(e))}${held2}`;
  }
  updated() {
    this.recall();
    this.show();
  }
};
define("sds-tabs", SdsTabs);

// packages/frontend/src/components/nav-rail.ts
import { html as html43, nothing as nothing26 } from "lit";
var SdsNavRail = class extends SdsElement {
  constructor() {
    super();
    /** The rows a server wrote between the tags. A renderer that has resolved
        its own tree writes the classes below, so the two shapes are one shape. */
    this.taken = [];
    /* The box, found once a frame after the rail stands in the page, and
       again wherever the page moves it. */
    this.scroller = null;
    this.entry = { label: "" };
    this.picked = -1;
  }
  static {
    this.properties = {
      entry: { type: Object },
      picked: { type: Number, state: true }
    };
  }
  /** The box the rail scrolls in: the nearest ancestor that scrolls, which
      the page writes and the rail stands in. None on a page that has none. */
  box() {
    for (let up = this.parentElement; up && up !== document.body; up = up.parentElement) {
      if (/auto|scroll/.test(getComputedStyle(up).overflowY)) return up;
    }
    return null;
  }
  /** The box keeps the wheel while it has rows to scroll to, for the reason
      the outline does, and by the same measure. The rail measures because
      the box is the page's and a fold that opens is the rail's own height. */
  keep() {
    const box2 = this.scroller;
    box2?.classList.toggle("is-scrollable", box2.scrollHeight - box2.clientHeight > 1);
  }
  disconnectedCallback() {
    this.watch?.disconnect();
    this.watch = void 0;
    super.disconnectedCallback();
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => node.nodeType === 1);
    if (written2.length) this.taken = written2;
    super.connectedCallback();
    void this.updateComplete.then(() => requestAnimationFrame(() => {
      if (!this.isConnected || this.watch) return;
      this.scroller = this.box();
      this.watch = new ResizeObserver(() => requestAnimationFrame(() => this.isConnected && this.keep()));
      this.watch.observe(this);
      if (this.scroller) this.watch.observe(this.scroller);
    }));
  }
  /** Every page in the rail, folds flattened. A rail has one current page
      wherever it sits, and a caller who thinks in "third item of the second
      group" thinks about the markup. */
  flat() {
    return (this.entry.items ?? []).flatMap(branch);
  }
  isCurrent(entry) {
    return this.picked >= 0 ? this.chosen === entry : Boolean(entry.current);
  }
  willUpdate() {
    this.chosen = this.picked >= 0 ? this.flat()[this.picked] : void 0;
  }
  /** One page, and whatever hangs under it.
  
        A page that holds pages is a row like any other, with the marker that
        opens them beside it. The same pair the bar's row draws, so a reader
        meets one shape and not two. What it holds stands in by a step, because
        a list where everything starts on the same edge says nothing about what
        belongs to what. */
  row(entry) {
    const under = entry.items ?? [];
    if (!under.length) return this.one(entry);
    const holds = branch(entry).some((page) => this.isCurrent(page));
    return html43`<div class="sds-rail__group">
    ${entry.href ? this.one(entry) : html43`<span class="sds-rail__item">${this.inside(entry)}</span>`}
    <details class="sds-rail__fold" ?open="${Boolean(entry.open) || holds}">
      <summary aria-label="Pages in ${entry.label}"><sds-icon name="actions-chevron-down"></sds-icon></summary>
      ${lines(under.map((page) => this.row(page)), 6)}
    </details>
  </div>`;
  }
  /** What stands in a row: the glyph where the entry asked for one, and the
      name in a node of its own. The rail is one fixed width and its rows are
      names a machine gave, so the name is the half that gives. A cut needs a
      box of its own. */
  inside(entry) {
    return html43`${entry.icon ? html43`<sds-icon name="${entry.icon}"></sds-icon>` : nothing26}<span class="sds-rail__label">${entry.label}</span>`;
  }
  one(entry) {
    const current = this.isCurrent(entry);
    const cls = current ? "sds-rail__item is-active" : "sds-rail__item";
    const inside = this.inside(entry);
    return entry.href ? html43`<a class="${cls}" href="${entry.href}" aria-current="${current ? "page" : nothing26}">${inside}</a>` : html43`<button type="button" class="${cls}" aria-current="${current ? "true" : nothing26}" @click="${() => this.pick(entry)}">${inside}</button>`;
  }
  render() {
    const label = this.entry.label;
    const written2 = this.taken.length ? this.taken : this.content;
    const under = this.entry.items ?? [];
    const rows = written2 ? [written2] : [
      ...under.filter((page) => !page.items?.length).map((page) => this.row(page)),
      ...under.filter((page) => page.items?.length).map((page) => this.row(page))
    ];
    const here = this.isCurrent(this.entry);
    const head = !label ? nothing26 : this.entry.href ? html43`<a
    class="${here ? "sds-label sds-rail__heading is-active" : "sds-label sds-rail__heading"}"
    href="${this.entry.href}"
    aria-current="${here ? "page" : nothing26}"
  >${label}</a>` : html43`<div class="sds-label">${label}</div>`;
    return html43`<nav class="sds-rail" aria-label="${label || "Pages"}">
  ${head}
  ${lines(rows, 2)}
</nav>`;
  }
  /** A row with nowhere to go is a choice: pressing it makes it current and
      says so, for whatever is beside it to follow. */
  pick(entry) {
    const index = this.flat().indexOf(entry);
    if (index < 0 || index === this.picked) return;
    this.picked = index;
    this.dispatchEvent(
      new CustomEvent("sds-change", {
        detail: { index, label: entry.label },
        bubbles: true,
        composed: true
      })
    );
  }
};
define("sds-nav-rail", SdsNavRail);

// packages/frontend/src/components/nav-toc.ts
import { html as html44, nothing as nothing27 } from "lit";

// packages/frontend/src/lib/reading.ts
var queued = /* @__PURE__ */ new Set();
var frame = 0;
function readSoon(read2) {
  queued.add(read2);
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const reads = [...queued];
    queued.clear();
    const writes = reads.map((one) => one());
    for (const write2 of writes) write2?.();
  });
}
function dropReading(read2) {
  queued.delete(read2);
}

// packages/frontend/src/components/nav-toc.ts
var HEADING = "On this page";
var SdsNavToc = class extends SdsElement {
  constructor() {
    super();
    this.reading = () => this.isConnected ? this.read() : void 0;
    this.label = HEADING;
    this.entries = [];
    this.at = "";
  }
  static {
    this.properties = {
      label: { type: String },
      entries: { type: Array },
      at: { type: String, state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.watch();
  }
  disconnectedCallback() {
    this.watching?.abort();
    dropReading(this.reading);
    super.disconnectedCallback();
  }
  /** One reading, a frame from now. A scroll fires far faster than a paint. */
  soon() {
    readSoon(this.reading);
  }
  /** Follow the page. On the document and on the way down: a scroll event
      does not bubble, and the column can be the scroller rather than the
      window. On resize too, which moves every heading at once. One reading a
      frame — a scroll fires far faster than a paint. */
  watch() {
    this.watching?.abort();
    this.watching = new AbortController();
    const { signal } = this.watching;
    const soon = () => this.soon();
    document.addEventListener("scroll", soon, { capture: true, passive: true, signal });
    window.addEventListener("resize", soon, { passive: true, signal });
    soon();
  }
  /** The entries the list draws, by target. Read from the rows rather than
      from the data. Beside the column it shows two levels and hides the rest,
      and which those are is the stylesheet's to say. Empty before the first
      render, and then it says nothing rather than nothing is on the page. */
  drawn() {
    const out = /* @__PURE__ */ new Set();
    for (const row2 of this.querySelectorAll(".sds-toc__item")) {
      if (row2.getClientRects().length) out.add(row2.getAttribute("href") ?? "");
    }
    return out;
  }
  /** The headings this list points at, in the order the page has them. An
      entry that points away from this page is a link and not a place in it,
      so it stays out. So does one the list does not draw. A mark on a heading
      no row shows leaves every visible entry unmarked, which is the list gone
      blank inside a section. */
  marks() {
    const drawn2 = this.drawn();
    const found = [];
    for (const entry of this.entries.flatMap(branch)) {
      const href = entry.href ?? "";
      if (href.length < 2 || !href.startsWith("#")) continue;
      if (drawn2.size && !drawn2.has(href)) continue;
      const node = document.getElementById(decodeURIComponent(href.slice(1)));
      if (node) found.push({ href, node });
    }
    return found;
  }
  /** What moves the headings: the nearest ancestor that scrolls, and the
      page where none does. A pane with a scrollbar of its own is where the
      reader reads, and the top of the window is not on it. */
  scroller(node) {
    for (let up = node.parentElement; up; up = up.parentElement) {
      const flow3 = getComputedStyle(up).overflowY;
      if (/auto|scroll|overlay/.test(flow3) && up.scrollHeight > up.clientHeight + 1) return up;
    }
    return document.scrollingElement ?? document.documentElement;
  }
  /** Where a heading comes to rest after a jump: the top of the scroller,
      plus the offset it keeps for whatever stands over it. That offset is
      `scroll-padding-top`, which answers the bar for every target at once.
      Measured against that line, the entry a press marks is the entry the
      scroll marks. */
  line(box2) {
    const page = box2 === (document.scrollingElement ?? document.documentElement);
    const pad = parseFloat(getComputedStyle(page ? document.documentElement : box2).scrollPaddingTop);
    const top = page ? 0 : box2.getBoundingClientRect().top;
    return top + (Number.isFinite(pad) ? pad : 0) + 1;
  }
  /** As far down as the reader can get. The last heading can stand below the
      line and never reach it. The list then marks the section above while the
      reader looks at the last one. Nothing to scroll is no foot to arrive at,
      with every section in view at once. */
  ended(box2) {
    const rest = box2.scrollHeight - box2.clientHeight;
    return rest > 2 && rest - box2.scrollTop < 2;
  }
  /** Which section the reader is in: the last heading that has passed the
      line, and none while none has. A page opens above its first heading, and
      a mark there answers a question nobody asked. */
  read() {
    const writes = [this.keep()];
    const marks = this.marks();
    const first = marks[0];
    let at;
    if (first) {
      const box2 = this.scroller(first.node);
      const line2 = this.line(box2);
      at = "";
      for (const mark of marks) {
        if (mark.node.getBoundingClientRect().top > line2) break;
        at = mark.href;
      }
      if (this.ended(box2)) at = marks[marks.length - 1].href;
    }
    return () => {
      for (const write2 of writes) write2?.();
      if (at !== void 0) this.at = at;
    };
  }
  /** The entry the reader is in. The page wins once the element has read it.
      The data is what a card, a story and a server-rendered page have instead. */
  isCurrent(entry) {
    return this.at ? entry.href === this.at : Boolean(entry.current);
  }
  list(entries) {
    return html44`<ul class="sds-toc__list">
  ${lines(entries.map((entry) => this.row(entry)), 2)}
</ul>`;
  }
  /** One section, and whatever hangs under it. `aria-current="location"` and
      not `page`: every entry here is the page, and the mark is the part of it
      the reader is at. */
  row(entry) {
    const here = this.isCurrent(entry);
    const under = entry.items ?? [];
    return html44`<li>
  <a
    class="${here ? "sds-toc__item is-active" : "sds-toc__item"}"
    href="${entry.href ?? "#"}"
    aria-current="${here ? "location" : nothing27}"
  >${entry.label}</a>
  ${under.length ? this.list(under) : nothing27}
</li>`;
  }
  /** Keep the marked entry where the reader can see it. Beside the column the
      list is a box of its own and scrolls. A page with more sections than the
      box is tall marks one off its bottom edge. The list then says nothing
      about where the reader is, exactly where that matters. Its own `scrollTop`,
      never `scrollIntoView`: that walks up every scroller it finds and takes
      the page along with it. */
  follow() {
    const here = this.querySelector(".sds-toc__item.is-active");
    const box2 = here?.closest(".sds-toc");
    if (!here || !box2 || box2.scrollHeight - box2.clientHeight < 2) return void 0;
    const pad = getComputedStyle(box2);
    const edge = box2.getBoundingClientRect();
    const row2 = here.getBoundingClientRect();
    const above = row2.top - (edge.top + (parseFloat(pad.paddingTop) || 0));
    const below = row2.bottom - (edge.bottom - (parseFloat(pad.paddingBottom) || 0));
    return () => {
      if (above < 0) box2.scrollTop += above;
      else if (below > 0) box2.scrollTop += below;
    };
  }
  /** A box with more rows than it shows keeps the wheel, by a class the
      sheet reads. Let through, the scroll runs on into the page at the edge,
      the mark moves, and the list jumps back under the reader's pointer.
      Only while it overflows: on a box with nothing to scroll, containment
      swallows the wheel and the page stops. So the element measures it. */
  keep() {
    const box2 = this.querySelector(".sds-toc");
    const scrollable = box2 ? box2.scrollHeight - box2.clientHeight > 1 : false;
    return () => box2?.classList.toggle("is-scrollable", scrollable);
  }
  updated(changed) {
    if (changed.has("at") || changed.has("entries")) this.follow()?.();
    this.soon();
  }
  render() {
    const label = this.label || HEADING;
    return html44`<nav class="sds-toc" aria-label="${label}">
  <p class="sds-label">${label}</p>
  ${this.list(this.entries)}
</nav>`;
  }
};
define("sds-nav-toc", SdsNavToc);

// packages/frontend/src/components/nav-outline.ts
import { html as html45, nothing as nothing28 } from "lit";
var HEADING2 = "Contents";
var SdsNavOutline = class extends SdsElement {
  constructor() {
    super();
    /** Put the fold in the state its width asks for: shut where it folds, open
        where it does not. Only on a change of width, so a reader who opened it
        keeps it open while they read. */
    this.narrow = false;
    /* The first reading puts the fold in its state, whatever it stood in. */
    this.unfitted = true;
    this.reading = () => this.isConnected ? this.read() : void 0;
    this.label = HEADING2;
    this.entries = [];
    this.numbered = false;
    this.at = "";
  }
  static {
    this.properties = {
      label: { type: String },
      entries: { type: Array },
      numbered: { type: Boolean },
      at: { type: String, state: true }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.watch();
  }
  /** The fold, and if its press draws. The stylesheet decides where the
      list folds, and draws the press only there. So the element asks the
      press rather than the window, and carries no width of its own. */
  fold() {
    return this.querySelector(".sds-outline__fold");
  }
  folds() {
    return Boolean(this.querySelector(".sds-outline__toggle")?.getClientRects().length);
  }
  fit() {
    const fold2 = this.fold();
    if (!fold2) return void 0;
    const narrow = this.folds();
    if (!this.unfitted && narrow === this.narrow) return void 0;
    this.unfitted = false;
    this.narrow = narrow;
    return () => {
      fold2.open = !narrow;
    };
  }
  /** A press on a row where the list folds: the reader chose a place, and
      the list has done its work. It shuts, and the page under it shows the
      place. */
  chose(event) {
    const row2 = event.target.closest(".sds-outline__item");
    const fold2 = this.fold();
    if (row2 && fold2 && this.folds()) fold2.open = false;
  }
  disconnectedCallback() {
    this.watching?.abort();
    dropReading(this.reading);
    super.disconnectedCallback();
  }
  /** One reading, a frame from now. A scroll fires far faster than a paint. */
  soon() {
    readSoon(this.reading);
  }
  /** Follow the page. On the document and on the way down: a scroll event
      does not bubble, and the column can be the scroller rather than the
      window. On resize too, which moves every heading at once. */
  watch() {
    this.watching?.abort();
    this.watching = new AbortController();
    const { signal } = this.watching;
    const soon = () => this.soon();
    document.addEventListener("scroll", soon, { capture: true, passive: true, signal });
    window.addEventListener("resize", soon, { passive: true, signal });
    soon();
  }
  /** The entries the list draws, by target. Read from the rows rather than
      from the data, so a level a stylesheet hides never takes the mark.
      Empty before the first render. */
  drawn() {
    const fold2 = this.fold();
    if (fold2 && !fold2.open && this.rows) return this.rows;
    const out = /* @__PURE__ */ new Set();
    for (const row2 of this.querySelectorAll(".sds-outline__item")) {
      if (row2.getClientRects().length) out.add(row2.getAttribute("href") ?? "");
    }
    if (!fold2 || fold2.open) this.rows = out;
    return out;
  }
  /** The headings this list points at, in the order the page has them. An
      entry that points away from this page is a link and not a place in it,
      so it stays out. So does one the list does not draw. */
  marks() {
    const drawn2 = this.drawn();
    const found = [];
    for (const entry of this.entries.flatMap(branch)) {
      const href = entry.href ?? "";
      if (href.length < 2 || !href.startsWith("#")) continue;
      if (drawn2.size && !drawn2.has(href)) continue;
      const node = document.getElementById(decodeURIComponent(href.slice(1)));
      if (node) found.push({ href, node });
    }
    return found;
  }
  /** What moves the headings: the nearest ancestor that scrolls, and the
      page where none does. */
  scroller(node) {
    for (let up = node.parentElement; up; up = up.parentElement) {
      const flow3 = getComputedStyle(up).overflowY;
      if (/auto|scroll|overlay/.test(flow3) && up.scrollHeight > up.clientHeight + 1) return up;
    }
    return document.scrollingElement ?? document.documentElement;
  }
  /** Where a heading comes to rest after a jump: the top of the scroller,
      plus `scroll-padding-top`. Measured against that line, the entry a
      press marks is the entry the scroll marks. */
  line(box2) {
    const page = box2 === (document.scrollingElement ?? document.documentElement);
    const pad = parseFloat(getComputedStyle(page ? document.documentElement : box2).scrollPaddingTop);
    const top = page ? 0 : box2.getBoundingClientRect().top;
    return top + (Number.isFinite(pad) ? pad : 0) + 1;
  }
  /** As far down as the reader can get. The last heading can stand below the
      line and never reach it. */
  ended(box2) {
    const rest = box2.scrollHeight - box2.clientHeight;
    return rest > 2 && rest - box2.scrollTop < 2;
  }
  /** Which part the reader is in: the last heading that has passed the line,
      and none while none has. A document opens above its first heading. */
  read() {
    const writes = [this.keep(), this.fit()];
    const marks = this.marks();
    const first = marks[0];
    let at;
    if (first) {
      const box2 = this.scroller(first.node);
      const line2 = this.line(box2);
      at = "";
      for (const mark of marks) {
        if (mark.node.getBoundingClientRect().top > line2) break;
        at = mark.href;
      }
      if (this.ended(box2)) at = marks[marks.length - 1].href;
    }
    return () => {
      for (const write2 of writes) write2?.();
      if (at !== void 0) this.at = at;
    };
  }
  /** The entry the reader is in. The page wins once the element has read it.
      The data is what a card, a story and a server-rendered page have instead. */
  isCurrent(entry) {
    return this.at ? entry.href === this.at : Boolean(entry.current);
  }
  /** The entries at one level, each numbered by its place under the number
      of the entry above: `4`, then `4.1`, `4.2`. */
  list(entries, above = "") {
    let count = 0;
    const rows = entries.flatMap(
      (entry) => entry.part ? [
        html45`<li class="sds-outline__part"><p class="sds-label">${entry.label}</p></li>`,
        ...(entry.items ?? []).map((item) => this.row(item, above ? `${above}.${++count}` : String(++count)))
      ] : [this.row(entry, above ? `${above}.${++count}` : String(++count))]
    );
    return html45`<ul class="sds-outline__list">
  ${lines(rows, 2)}
</ul>`;
  }
  /** One row. `aria-current="location"` and not `page`: every entry here is
      the document, and the mark is the part of it the reader is at. The
      space after the number is text, so the name a row has out loud keeps
      the two apart. The name stands in a node of its own, so the underline
      under the pointer is the name's and never the space's. */
  item(entry, number) {
    const here = this.isCurrent(entry);
    return html45`<a
    class="${here ? "sds-outline__item is-active" : "sds-outline__item"}"
    href="${entry.href ?? "#"}"
    aria-current="${here ? "location" : nothing28}"
  >${this.numbered ? html45`<span class="sds-outline__number">${number}</span> ` : nothing28}<span class="sds-outline__label">${entry.label}</span></a>`;
  }
  /** One part, and the sections under it. */
  row(entry, number) {
    const under = entry.items ?? [];
    return html45`<li>
  ${this.item(entry, number)}
  ${under.length ? this.list(under, number) : nothing28}
</li>`;
  }
  /** Keep the marked row where the reader can see it, by the least move that
      brings it inside. A box that already shows the row stands still and does
      not fight a reader who scrolled it. Its own `scrollTop`, never
      `scrollIntoView`: that walks up every scroller and takes the page along. */
  follow() {
    const here = this.querySelector(".sds-outline__item.is-active");
    const box2 = here?.closest(".sds-outline");
    if (!here || !box2 || box2.scrollHeight - box2.clientHeight < 2) return void 0;
    const pad = getComputedStyle(box2);
    const edge = box2.getBoundingClientRect();
    const row2 = here.getBoundingClientRect();
    const above = row2.top - (edge.top + (parseFloat(pad.paddingTop) || 0));
    const below = row2.bottom - (edge.bottom - (parseFloat(pad.paddingBottom) || 0));
    return () => {
      if (above < 0) box2.scrollTop += above;
      else if (below > 0) box2.scrollTop += below;
    };
  }
  /** A box with more rows than it shows keeps the wheel, by a class the
      sheet reads. Let through, the scroll runs on into the page at the edge,
      the mark moves, and the list jumps back under the reader's pointer.
      Only while it overflows: on a box with nothing to scroll, containment
      swallows the wheel and the page stops. So the element measures it. */
  keep() {
    const box2 = this.querySelector(".sds-outline");
    const scrollable = box2 ? box2.scrollHeight - box2.clientHeight > 1 : false;
    return () => box2?.classList.toggle("is-scrollable", scrollable);
  }
  updated(changed) {
    if (changed.has("at") || changed.has("entries")) this.follow()?.();
    this.soon();
  }
  render() {
    const label = this.label || HEADING2;
    return html45`<nav class="sds-outline" aria-label="${label}" @click="${(event) => this.chose(event)}">
  <details class="sds-outline__fold" open>
    <summary class="sds-outline__toggle"><sds-icon name="actions-list"></sds-icon><span>${label}</span><sds-icon name="actions-chevron-down"></sds-icon></summary>
    <p class="sds-label">${label}</p>
    ${this.list(this.entries)}
  </details>
</nav>`;
  }
};
define("sds-nav-outline", SdsNavOutline);

// packages/frontend/src/components/timeline-stop.ts
import { html as html46, nothing as nothing29 } from "lit";
var MARKS2 = {
  passed: { icon: "actions-check-circle", said: "Done" },
  now: { icon: "actions-circle-full", said: "Now" },
  ahead: { icon: "actions-circle", said: "Ahead" }
};
var stopTemplate = (stop) => html46`<sds-timeline-stop when="${stop.when}" heading="${stop.heading}" ?now="${stop.now}" state="${stop.state}" .content="${stop.body ?? ""}" .stops="${stop.stops}"></sds-timeline-stop>`;
var SdsTimelineStop = class extends SdsElement {
  constructor() {
    super();
    /** What stood between the tags, taken before Lit renders over it: the
        stops inside this one, and the blocks that are its own. */
    this.under = null;
    this.body = null;
    this.when = "";
    this.heading = "";
    this.now = false;
    this.state = "ahead";
    this.stops = [];
  }
  static {
    this.properties = {
      /** When, as the plan says it: `2026-09-30`, `Sprint 2`, `Q1`. Text
          nothing parses. */
      when: { type: String, reflect: true },
      /** What happens here, in one line. `heading`, the name of every title
          here. */
      heading: { type: String, reflect: true },
      /** The stop the plan is at. One per plan; the stops before it have
          passed, the ones after it lie ahead. */
      now: { type: Boolean, reflect: true },
      /** What this stop is against the one marked now. The plan writes it;
          a page does not. */
      state: { type: String, reflect: true },
      /** The stops inside this one, where the plan renders from data. Between
          the tags otherwise, as more of these. */
      stops: { type: Array }
    };
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => !isBlank(node));
    const under = written2.filter((node) => node.nodeType === 1 && node.tagName.toLowerCase() === "sds-timeline-stop");
    const body = written2.filter((node) => !under.includes(node));
    if (under.length) this.under = under;
    if (body.length) this.body = body;
    super.connectedCallback();
  }
  /** The mark says its state out loud, and the word beside the title says
      it again for the one that is now. `aria-current="step"` on that one.
      `role` because the box the plan draws is one generic away from this
      one, as with a step. */
  render() {
    const state2 = MARKS2[this.state] ? this.state : "ahead";
    const mark = MARKS2[state2];
    const body = this.body ?? this.content;
    const under = this.under ?? this.stops.map((stop) => stopTemplate(stop));
    return html46`<div role="listitem" class="sds-timeline__stop sds-timeline__stop--${state2}" aria-current="${state2 === "now" ? "step" : nothing29}">
    <span class="sds-timeline__mark"><sds-icon name="${mark.icon}" label="${mark.said}"></sds-icon></span>
    <p class="sds-timeline__when">${this.when}</p>
    <p class="sds-timeline__title">${this.heading}${state2 === "now" ? html46`<span class="sds-label">Now</span>` : nothing29}</p>
    ${body ? html46`<div class="sds-timeline__body">${body}</div>` : nothing29}
    ${under.length ? html46`<div class="sds-timeline__list" role="list">
      ${lines(under, 6)}
    </div>` : nothing29}
  </div>`;
  }
};
define("sds-timeline-stop", SdsTimelineStop);

// packages/frontend/src/components/timeline.ts
import { html as html47 } from "lit";
import { unsafeHTML as unsafeHTML3 } from "lit/directives/unsafe-html.js";

// packages/frontend/src/lib/authored.ts
var FACT = /\s([\w-]+)(?:="([^"]*)")?/g;
var unescape = (text2) => text2.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
function facts(tag) {
  const out = {};
  for (const [, key2, value] of tag.matchAll(FACT)) out[key2] = unescape(value ?? "");
  return out;
}

// packages/frontend/src/components/timeline.ts
var STOP = "sds-timeline-stop";
var isStop = (node) => node.nodeType === 1 && node.tagName.toLowerCase() === STOP;
var TAGS = /<sds-timeline-stop\b((?:"[^"]*"|'[^']*'|[^>"'])*)>|<\/sds-timeline-stop>/g;
var SdsTimeline = class extends SdsElement {
  constructor() {
    super();
    /** The stops written between the tags. Read before Lit renders over
        them, and before each stop lifts its own children away. The elements
        go back into the list with their state on them. */
    this.taken = null;
    this.entries = [];
  }
  static {
    this.properties = {
      entries: { type: Array }
    };
  }
  connectedCallback() {
    if (!this.taken) {
      const written2 = this.standing().filter(isStop);
      if (written2.length) this.taken = this.fromElements(written2);
    }
    this.lifted();
    super.connectedCallback();
  }
  /* From elements in a browser. Attributes rather than properties: a child
     has not always upgraded when its parent reads it. The stops inside one
     are its children, or stand in the template a prerender left. */
  fromElements(elements) {
    return elements.map((el) => {
      const kept2 = el.querySelector(`:scope > template[${CONTENT}]`);
      const under = [...kept2 ? kept2.content.children : el.children].filter(isStop);
      return {
        when: el.getAttribute("when") ?? "",
        heading: el.getAttribute("heading") ?? "",
        now: el.hasAttribute("now"),
        el,
        items: this.fromElements(under)
      };
    });
  }
  /* From the property, where a static render has no children. */
  fromEntries(entries) {
    return entries.map((e) => ({
      when: e.when,
      heading: e.heading,
      now: Boolean(e.now),
      body: e.body,
      items: this.fromEntries(e.items ?? [])
    }));
  }
  /* From the markup as the author wrote it, under a prerender. A walk over
     the tags with a stack, because a stop holds stops. What stands between
     a stop's tags and outside the stops inside it is its body. */
  fromMarkup(markup) {
    const root = { when: "", heading: "", now: false, body: "", items: [] };
    const open = [root];
    let last = 0;
    for (const found of markup.matchAll(TAGS)) {
      const top = open[open.length - 1];
      top.body += markup.slice(last, found.index);
      last = found.index + found[0].length;
      if (found[0].startsWith("</")) {
        if (open.length > 1) open.pop();
        continue;
      }
      const tag = facts(found[1] ?? "");
      const stop = { when: tag["when"] ?? "", heading: tag["heading"] ?? "", now: "now" in tag, body: "", items: [] };
      top.items.push(stop);
      open.push(stop);
    }
    const read2 = (stops) => stops.map(({ body, items, ...stop }) => ({
      ...stop,
      body: body.trim() ? html47`${unsafeHTML3(body.trim())}` : void 0,
      items: read2(items)
    }));
    return read2(root.items);
  }
  get read() {
    if (this.taken) return this.taken;
    if (this.entries.length) return this.fromEntries(this.entries);
    return this.authored ? this.fromMarkup(this.authored) : [];
  }
  /** Every stop in the order a reader reads, each with the lines it holds. */
  place(stops, from = 0) {
    let next = from;
    const placed2 = stops.map((read2) => {
      const start = next++;
      const under = this.place(read2.items, next);
      next = under.next;
      return { read: read2, start, end: next - 1, items: under.placed };
    });
    return { placed: placed2, next };
  }
  /** The line the plan is at: the last stop marked now, in order. So a
      package marked now wins over the sprint that holds it. None marked is
      a plan not yet begun. */
  at(placed2) {
    let found = -1;
    for (const one of placed2) {
      if (one.read.now) found = one.start;
      const under = this.at(one.items);
      if (under >= 0) found = under;
    }
    return found;
  }
  /** What a stop is against the line the plan is at. It is that line or
      holds it; it ends before it; or it starts after it. */
  state(one, at) {
    if (at < 0) return "ahead";
    if (one.start <= at && at <= one.end) return "now";
    return one.end < at ? "passed" : "ahead";
  }
  /** Each stop with its state, down the tree. An element gets it written
      on as an attribute and renders itself from there. */
  settle(one, at) {
    const state2 = this.state(one, at);
    const { read: read2 } = one;
    read2.el?.setAttribute("state", state2);
    return { when: read2.when, heading: read2.heading, now: read2.now, state: state2, body: read2.body, stops: one.items.map((under) => this.settle(under, at)) };
  }
  /** The stops as a list in ARIA, for the reason `sds-steps` gives. An
      element between the list and its items is a generic the platform no
      longer counts through. */
  render() {
    const { placed: placed2 } = this.place(this.read);
    const at = this.at(placed2);
    const settled2 = placed2.map((one) => this.settle(one, at));
    const stops = this.taken ? this.taken.map((read2) => read2.el) : settled2.map((stop) => stopTemplate(stop));
    return html47`<div class="sds-timeline" role="list">
  ${lines(stops, 2)}
</div>`;
  }
};
define("sds-timeline", SdsTimeline);

// packages/frontend/src/components/answer.ts
import { html as html48, nothing as nothing30 } from "lit";
var SdsAnswer = class extends SdsElement {
  constructor() {
    super();
    /** What stood between the tags, taken before Lit renders over them. */
    this.taken = null;
    this.key = "";
    this.heading = "";
    this.recommended = false;
    this.decided = false;
  }
  static {
    this.properties = {
      /** Its letter or number, as the paper cites it: `A`. */
      key: { type: String, reflect: true },
      /** What it is, in one line. `heading`, the name of every title here. */
      heading: { type: String, reflect: true },
      /** The one the paper recommends. The word after its name says it,
          and nothing else on the row changes. */
      recommended: { type: Boolean, reflect: true },
      /** The one the decision took. The word after the name, the disc
          around the letter, and the block reads it for the voice at its foot. */
      decided: { type: Boolean, reflect: true }
    };
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => !isBlank(node));
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    const held2 = this.taken ?? this.content;
    return html48`<div class="${this.decided ? "sds-decision__answer is-decided" : "sds-decision__answer"}" role="listitem">
    <span class="sds-decision__key">${this.key}</span>
    <div class="sds-decision__what">
      <p class="sds-decision__label">${this.heading}${this.recommended ? html48` <span class="sds-label sds-decision__mark sds-decision__mark--recommended">recommended</span>` : nothing30}${this.decided ? html48` <span class="sds-label sds-decision__mark sds-decision__mark--decided">decided</span>` : nothing30}</p>
      ${held2 ? html48`<div class="sds-decision__body">${held2}</div>` : nothing30}
    </div>
  </div>`;
  }
};
define("sds-answer", SdsAnswer);

// packages/frontend/src/components/decision.ts
import { html as html49, nothing as nothing31 } from "lit";
var HEADING3 = "Decision";
var ANSWER_TAGS = /<sds-answer\b([^>]*)>/g;
var isAnswer = (node) => node.nodeType === 1 && node.localName === "sds-answer";
var SdsDecision = class extends SdsElement {
  constructor() {
    super();
    /** What stood between the tags, taken before Lit renders over it: the
        answers, and any block before them. */
    this.taken = null;
    /** If an answer written between the tags carries `decided`. Read off
        the elements before they lift, because the block speaks in the past
        at its foot only once one does. */
    this.settled = false;
    this.question = "";
    this.answers = [];
    this.by = "";
    this.due = "";
    this.label = HEADING3;
    this.lead = "";
  }
  static {
    this.properties = {
      question: { type: String },
      answers: { type: Array },
      by: { type: String },
      due: { type: String },
      label: { type: String },
      lead: { type: String }
    };
  }
  connectedCallback() {
    this.settled = this.standing().some((node) => isAnswer(node) && node.hasAttribute("decided"));
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  /** If one answer carries `decided`, by whichever route the answers came. */
  get decided() {
    if (this.answers.length) return this.answers.some((one) => Boolean(one.decided));
    if (this.taken) return this.settled;
    return [...(this.authored ?? "").matchAll(ANSWER_TAGS)].some((found) => "decided" in facts(found[1] ?? ""));
  }
  render() {
    const held2 = this.taken ?? this.content;
    const label = this.label || HEADING3;
    const answers = this.answers.length ? this.answers.map(
      (one) => html49`<sds-answer key="${one.key}" heading="${one.heading}" ?recommended="${Boolean(one.recommended)}" ?decided="${Boolean(one.decided)}" .content="${one.body ?? ""}"></sds-answer>`
    ) : held2;
    const decided = this.decided;
    const who = this.by ? html49`${decided ? "Decided by " : "Decision by "}<strong>${this.by}</strong>` : nothing31;
    let before = decided ? "On " : "Due ";
    if (this.by) before = decided ? " on " : " \xB7 due ";
    const when = this.due ? html49`${before}<span class="sds-mono">${this.due}</span>` : nothing31;
    const foot = this.by || this.due ? html49`<p class="sds-decision__meta">${who}${when}</p>` : nothing31;
    return html49`<section class="sds-decision" aria-label="${label}">
  <p class="sds-label">${label}</p>
  <p class="sds-decision__question">${this.question}</p>
  ${this.lead ? html49`<p class="sds-decision__lead">${this.lead}</p>` : nothing31}
  <div class="sds-decision__answers" role="list">
  ${answers}
  </div>
  ${foot}
</section>`;
  }
};
define("sds-decision", SdsDecision);

// packages/frontend/src/components/compare.ts
import { html as html51 } from "lit";

// packages/frontend/src/components/figure.ts
import { html as html50 } from "lit";
var isCaption = (node) => node.nodeType === 1 && node.matches(".sds-figure__caption");
var isNothing = (node) => node.nodeType === 8 || node.nodeType === 3 && !(node.textContent ?? "").trim();
var SdsFigure = class extends SdsElement {
  constructor() {
    super();
    /* The picture a renderer wrote, taken before Lit renders over it. `src` is
       the form a story or a product surface uses. A renderer that writes HTML
       cannot. The picture must be on the page before any script runs, or a
       reader gets a caption under an empty frame. Kept exactly as `sds-code`
       keeps a block that arrived coloured. */
    this.taken = null;
    /* And its caption, where that stood between the tags too. A caption from a
       document carries markup — a literal, a link, an emphasis — and an
       attribute is a string. */
    this.captioned = null;
    this.src = "";
    this.alt = "";
    this.caption = "";
    this.zoomable = false;
  }
  static {
    this.properties = {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
      width: { type: Number },
      height: { type: Number },
      zoomable: { type: Boolean, reflect: true }
    };
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => !isNothing(node));
    const caption = written2.filter(isCaption);
    const picture2 = written2.filter((node) => !isCaption(node));
    if (caption.length) this.captioned = caption;
    if (picture2.length) this.taken = picture2;
    super.connectedCallback();
  }
  render() {
    const given = this.taken ?? this.content;
    const picture2 = given ? html50`${given}` : art(this.src, this.alt, { width: this.width, height: this.height });
    const press = this.zoomable ? zoom(this, picture2, {
      src: this.src,
      alt: this.alt,
      caption: typeof this.caption === "string" ? this.caption : ""
    }) : null;
    const caption = this.captioned ? html50`${this.captioned}` : this.caption ? html50`<figcaption class="sds-figure__caption">${this.caption}</figcaption>` : "";
    return html50`<figure class="sds-figure">
  <div class="sds-figure__frame${exported(this.src) ? " sds-figure__frame--exported" : ""}">
    ${press ? press.trigger : picture2}
  </div>
  ${caption}
  ${press ? press.viewer : ""}
</figure>`;
  }
};
define("sds-figure", SdsFigure);

// packages/frontend/src/components/compare.ts
var SdsCompare = class extends SdsElement {
  static {
    this.properties = {
      beforeSrc: { type: String, attribute: "before-src" },
      beforeAlt: { type: String, attribute: "before-alt" },
      beforeCaption: { type: String, attribute: "before-caption" },
      afterSrc: { type: String, attribute: "after-src" },
      afterAlt: { type: String, attribute: "after-alt" },
      afterCaption: { type: String, attribute: "after-caption" },
      beforeLabel: { type: String, attribute: "before-label" },
      afterLabel: { type: String, attribute: "after-label" },
      zoomable: { type: Boolean }
    };
  }
  constructor() {
    super();
    this.beforeSrc = "";
    this.beforeAlt = "";
    this.beforeCaption = "";
    this.afterSrc = "";
    this.afterAlt = "";
    this.afterCaption = "";
    this.beforeLabel = "Before";
    this.afterLabel = "After";
    this.zoomable = false;
  }
  half(label, one) {
    return html51`<div class="sds-compare__half">
  <p class="sds-label">${label}</p>
  <sds-figure src="${one.src}" alt="${one.alt}" caption="${one.caption ?? ""}" ?zoomable="${this.zoomable}"></sds-figure>
</div>`;
  }
  render() {
    return html51`<div class="sds-compare">
  ${this.half(this.beforeLabel, { src: this.beforeSrc, alt: this.beforeAlt, caption: this.beforeCaption })}
  ${this.half(this.afterLabel, { src: this.afterSrc, alt: this.afterAlt, caption: this.afterCaption })}
</div>`;
  }
};
define("sds-compare", SdsCompare);

// packages/frontend/src/components/footer.ts
import { html as html52 } from "lit";
var SdsFooter = class _SdsFooter extends SdsElement {
  static {
    this.properties = {
      groups: { type: Array },
      note: { type: String },
      version: { type: String },
      product: { type: String },
      signet: { type: String },
      brand: { type: String },
      copyright: { type: String },
      meta: { type: Array },
      marks: { type: Array }
    };
  }
  constructor() {
    super();
    this.groups = [];
    this.note = "";
    this.version = "";
    this.product = "";
    this.signet = "";
    this.brand = "";
    this.copyright = "";
    this.meta = [];
    this.marks = [];
  }
  static link(item) {
    return item.icon ? html52`<sds-link label="${item.label}" href="${item.href ?? "#"}" ?external="${item.external ?? false}" icon="${item.icon}"></sds-link>` : html52`<sds-link label="${item.label}" href="${item.href ?? "#"}" ?external="${item.external ?? false}"></sds-link>`;
  }
  /* What a column names, where that is a page. Not `sds-link`: the heading
     keeps the label's register and the label's colour. At the links' it
     reads as the first entry of the list it names. The trail above a heading
     takes the same route for the same reason — see `.sds-crumbs a`. */
  static heading(group) {
    return group.href ? html52`<a class="sds-label sds-footer__heading" href="${group.href}">${group.label}</a>` : html52`<div class="sds-label">${group.label}</div>`;
  }
  /* A mark, at the end of the line where a reader looks for marks. The glyph
     alone, at a mark's size, named for whoever cannot see it. One with no
     glyph in the set is the labelled link it always was — the alternative is
     an account nobody can reach. */
  static mark(item) {
    return item.icon ? html52`<sds-link bare label="${item.label}" href="${item.href ?? "#"}" ?external="${item.external ?? false}" icon="${item.icon}"></sds-link>` : _SdsFooter.link(item);
  }
  /* The mark and the name, in the lockup the bar draws. One construction, so
     the two ends of a site cannot say the name two ways. The mark hides from
     a reader who cannot see it rather than announces itself: the wordmark
     beside it already spells what it says. */
  lockup() {
    if (!this.signet && !this.product) return "";
    return html52`<span class="sds-lockup">
      ${this.signet ? html52`<sds-image class="sds-signet" src="${this.signet}" alt="" width="24" height="24"></sds-image>` : ""}
      ${this.product ? html52`<span class="sds-wordmark">${this.brand ? html52`<span class="sds-wordmark__brand">${this.brand}</span><span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">${this.product}</span>` : html52`${this.product}`}</span>` : ""}
    </span>`;
  }
  render() {
    const brand = this.lockup();
    const said = brand || this.note ? html52`<div class="sds-footer__brand">
      ${brand}
      ${this.note ? html52`<p class="sds-footer__note">${this.note}</p>` : ""}
    </div>` : "";
    const closing = this.copyright || this.version || this.meta.length || this.marks.length;
    const top = said || this.groups.length;
    return html52`<footer class="sds-footer">
  ${top ? html52`<div class="sds-footer__top">
    ${said}
    ${this.groups.length ? html52`<div class="sds-footer__groups">
      ${this.groups.map(
      (group) => html52`<div class="sds-footer__group">
        ${_SdsFooter.heading(group)}
        <div class="sds-footer__links">
          ${group.items.map((item) => _SdsFooter.link(item))}
        </div>
      </div>`
    )}
    </div>` : ""}
  </div>` : ""}
  ${closing ? html52`<div class="sds-footer__end">
    ${this.copyright ? html52`<span>${this.copyright}</span>` : ""}
    ${this.version ? html52`<span class="sds-mono">${this.version}</span>` : ""}
    ${this.meta.map((item) => _SdsFooter.link(item))}
    ${this.marks.length ? html52`<span class="sds-footer__marks">${this.marks.map((item) => _SdsFooter.mark(item))}</span>` : ""}
  </div>` : ""}
</footer>`;
  }
};
define("sds-footer", SdsFooter);

// packages/frontend/src/components/surface.ts
import { html as html53, nothing as nothing32 } from "lit";
var PLANE = {
  plain: "sds-plane",
  raised: "sds-panel",
  sunken: "sds-sunken"
};
var SdsSurface = class extends SdsElement {
  constructor() {
    super();
    /* The statement, where it stood between the tags. A plane on a product
       surface holds a sentence somebody composed, which fits in a property. One
       in a document holds whatever the passage was — paragraphs, a list, a block
       of its own — and that is markup or it is nothing. */
    this.taken = null;
    this.plane = "raised";
    this.label = "";
    this.heading = "";
    this.body = "";
    this.boxStyle = "";
  }
  static {
    /** What it states goes between its tags. `label` and `heading` are the
        lines over the statement, and a child with neither slot is the
        statement. A region wins over the attribute of its name. */
    this.regions = ["label", "heading"];
  }
  static {
    this.properties = {
      plane: { type: String, reflect: true },
      label: { type: String },
      icon: { type: String },
      heading: { type: String },
      body: { type: String },
      /* Layout for the plane itself, which is the box that draws the frame — a
         style on the element sizes the block around it instead. */
      boxStyle: { type: String, attribute: "box-style" }
    };
  }
  connectedCallback() {
    const written2 = this.region(TEXT).map((one) => one.node);
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    const said = this.region("label")[0]?.inner ?? this.label;
    const label = said ? html53`<div class="sds-label">${said}</div>` : void 0;
    const icon = this.icon ? html53`<div class="sds-surface-icon"><sds-icon name="${this.icon}" size="20"></sds-icon></div>` : void 0;
    return html53`<div class="${PLANE[this.plane] ?? PLANE.raised}" style="${this.boxStyle || nothing32}">
  ${icon}
  ${label}
  <div class="sds-surface-title">${this.region("heading")[0]?.inner ?? this.heading}</div>
  <div class="sds-surface-body">${this.taken ?? this.content ?? this.body}</div>
</div>`;
  }
};
define("sds-surface", SdsSurface);

// packages/frontend/src/components/stat.ts
import { html as html54, nothing as nothing33 } from "lit";
var NNBSP2 = "\u202F";
var NBSP2 = "\xA0";
var SdsStat = class extends SdsElement {
  constructor() {
    super();
    /* The bound as a caller wrote it between the tags, taken before Lit renders
       over it. A sentence fits in the property; out of a document the same
       sentence carries a link, and that is what an attribute cannot hold. */
    this.taken = null;
    this.value = "";
    this.unit = "";
    this.label = "";
    this.of = "";
    this.bar = false;
    this.list = false;
    this.note = "";
  }
  static {
    this.properties = {
      value: { type: String },
      unit: { type: String },
      label: { type: String },
      of: { type: String },
      bar: { type: Boolean, reflect: true },
      list: { type: Boolean, reflect: true },
      icon: { type: String },
      note: { type: String }
    };
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => !isBlank(node));
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  /* The share, as a length. A measurement, so a style: no class names one.
     It stands on the figure's box, where the set mixes the fill from it. */
  at() {
    const part = Number.parseFloat(this.value);
    const whole = Number.parseFloat(this.of);
    if (!(this.bar || this.list) || !(whole > 0) || !Number.isFinite(part)) return void 0;
    return `--sds-stat-at: ${Math.min(Math.max(part / whole, 0), 1) * 100}%`;
  }
  share() {
    return this.at() ? html54`<div class="sds-stat__bar" aria-hidden="true"><span></span></div>` : "";
  }
  render() {
    const bound = this.taken ?? this.content ?? (this.note || void 0);
    if (this.list) {
      return html54`<div class="sds-stat sds-stat--list" style="${this.at() ?? nothing33}">
  <div class="sds-stat__head"><span class="sds-stat__name">${this.label}</span><span class="sds-stat__count">${this.value}${this.of ? `${NBSP2}of${NBSP2}${this.of}` : ""}${this.unit ? `${NNBSP2}${this.unit}` : ""}</span></div>${this.share()}
  ${bound ? html54`<div class="sds-stat__note">${bound}</div>` : ""}
</div>`;
    }
    return html54`<div class="sds-stat" style="${this.at() ?? nothing33}">
  <div class="sds-stat__value">${this.icon ? html54`<span class="sds-stat__icon"><sds-icon name="${this.icon}" size="24"></sds-icon></span>` : ""}${this.value}${this.unit ? html54`<span class="sds-stat__unit">${NNBSP2}${this.unit}</span>` : ""}${this.of ? html54`<span class="sds-stat__unit">${NBSP2}of${NBSP2}${this.of}</span>` : ""}</div>${this.share()}
  <div class="sds-label">${this.label}</div>
  ${bound ? html54`<div class="sds-stat__note">${bound}</div>` : ""}
</div>`;
  }
};
define("sds-stat", SdsStat);

// packages/frontend/src/components/embed.ts
import { html as html55, nothing as nothing34 } from "lit";
var isCaption2 = (node) => node.nodeType === 1 && node.matches(".sds-embed__caption");
var isNothing2 = (node) => node.nodeType === 8 || node.nodeType === 3 && !(node.textContent ?? "").trim();
var SdsEmbed = class extends SdsElement {
  constructor() {
    super();
    /* The frame a renderer wrote, taken before Lit renders over it. */
    this.taken = null;
    /* And its caption, where that stood between the tags too. Kept apart
       from `taken`, which everything else here reads as the frame itself. */
    this.captioned = null;
    /* The page's mode, heard so the frame follows a switch. */
    this.#stop = null;
    /* A frame is a document of its own and inherits nothing. A card made for
       both modes carries no `data-theme`. On its own it then answers the
       machine's setting inside a page that chose the other one. The
       frame belongs to this element, so this element paints it, and a page with
       no theme control has frames all the same. */
    this.#paint = () => {
      const mode = document.documentElement.dataset["theme"];
      for (const frame3 of this.querySelectorAll("iframe")) {
        try {
          const inner = frame3.contentDocument?.documentElement;
          if (!inner) continue;
          if (mode) inner.dataset["theme"] = mode;
          else delete inner.dataset["theme"];
        } catch {
        }
      }
    };
    this.src = "";
    this.label = "";
    this.ratio = "";
    this.width = 0;
    this.height = 0;
    this.caption = "";
    this.allow = "";
    this.allowfullscreen = false;
  }
  static {
    this.properties = {
      src: { type: String },
      label: { type: String },
      ratio: { type: String },
      width: { type: Number },
      height: { type: Number },
      caption: { type: String },
      allow: { type: String },
      allowfullscreen: { type: Boolean }
    };
  }
  #stop;
  connectedCallback() {
    const written2 = this.lifted().filter((node) => !isNothing2(node));
    const caption = written2.filter(isCaption2);
    const framed = written2.filter((node) => !isCaption2(node));
    if (caption.length) this.captioned = caption;
    if (framed.length) this.taken = framed;
    super.connectedCallback();
    if (typeof document === "undefined") return;
    this.#stop = onWritten(this.#paint);
    this.addEventListener("load", this.#paint, true);
  }
  disconnectedCallback() {
    this.removeEventListener("load", this.#paint, true);
    this.#stop?.();
    this.#stop = null;
    super.disconnectedCallback();
  }
  firstUpdated() {
    this.#paint();
  }
  #paint;
  /** If the frame has the document's own size rather than the column's. A
      size alone says fixed. A ratio beside it means "fill the column", so it
      wins and the size becomes the document's request. */
  get fixed() {
    return !this.ratio && this.width > 0 && this.height > 0;
  }
  /** What goes in the frame: the node a renderer wrote, or the iframe this
      writes when nobody did. Not lazy, deliberately — an embed is the evidence
      on the page, and one that loads on scroll is blank in every screenshot. */
  get framed() {
    if (this.taken ?? this.content) return this.taken ?? this.content;
    if (!this.src) return nothing34;
    const size = this.fixed ? `width:${this.width}px;height:${this.height}px` : nothing34;
    return html55`<iframe src="${this.src}" title="${this.label || nothing34}" style="${size}" allow="${this.allow || nothing34}" ?allowfullscreen="${this.allowfullscreen}"></iframe>`;
  }
  render() {
    const shape2 = this.fixed ? "sds-embed__frame--fixed" : "sds-embed__frame--fluid";
    const style = this.fixed ? nothing34 : `aspect-ratio:${this.ratio || "16 / 9"}`;
    const caption = this.captioned ? html55`${this.captioned}` : this.caption ? html55`<div class="sds-embed__caption">${this.caption}</div>` : void 0;
    return html55`<div class="sds-embed">
  <div class="sds-embed__frame ${shape2}" style="${style}" tabindex="${this.fixed ? "0" : nothing34}">${this.framed}</div>
  ${caption}
</div>`;
  }
};
define("sds-embed", SdsEmbed);

// packages/frontend/src/components/modal.ts
import { html as html56 } from "lit";
var modalClass = (size) => size === "sm" || size === "md" || size === "lg" ? `sds-modal sds-modal--${size}` : "sds-modal";
var SdsModal = class extends SdsElement {
  static {
    this.properties = {
      heading: { type: String },
      body: { type: String },
      /** Rendered buttons. Ghost first, primary last — the destructive-free
          order the rest of the system reads in. */
      actions: { type: Array },
      size: { type: String, reflect: true },
      width: { type: Number, reflect: true }
    };
  }
  constructor() {
    super();
    this.heading = "";
    this.body = "";
    this.actions = [];
    this.size = "sm";
    this.width = 0;
  }
  render() {
    const width2 = this.width > 0 ? ` width:${this.width}px` : "";
    return html56`<div class="${modalClass(this.size)}" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);${width2}">
  <div class="sds-modal__head">
    <span class="sds-modal__title">${this.heading}</span>
    <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon sds-modal__close" title="Close"><sds-icon name="actions-close"></sds-icon></button>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>
</div>`;
  }
};
define("sds-modal", SdsModal);

// packages/frontend/src/components/dialog.ts
import { html as html57 } from "lit";
var CONFIRM = "confirm";
var SdsDialog = class extends SdsElement {
  constructor() {
    super();
    /* What a button pointed at this one asks for. An id and an event, so neither
       end holds the other. Markup opens the question, not a script that has to
       find both of them. */
    this.onCommand = (event) => {
      const command = event.detail?.command ?? "show";
      if (command === "close") this.close();
      else if (command === "toggle") this.open ? this.close() : this.show();
      else this.show();
    };
    /* What the reader answered, read off the platform. Dispatched on every
       close, because a question dismissed is an answer a caller has to act on
       just as much as one pressed. */
    this.onClose = () => {
      const confirmed = this.dialog?.returnValue === CONFIRM;
      this.open = false;
      this.dispatchEvent(
        confirmed ? new CustomEvent("sds-dialog-confirm", { bubbles: true, composed: true }) : new CustomEvent("sds-dialog-cancel", { bubbles: true, composed: true })
      );
    };
    this.heading = "";
    this.body = "";
    this.actions = [];
    this.confirmLabel = "";
    this.confirmIcon = "";
    this.cancelLabel = "Cancel";
    this.tone = "primary";
    this.size = "sm";
    this.width = 0;
    this.open = false;
  }
  static {
    this.properties = {
      heading: { type: String },
      body: { type: String },
      actions: { type: Array },
      confirmLabel: { type: String, attribute: "confirm-label" },
      confirmIcon: { type: String, attribute: "confirm-icon" },
      cancelLabel: { type: String, attribute: "cancel-label" },
      tone: { type: String, reflect: true },
      size: { type: String, reflect: true },
      width: { type: Number, reflect: true },
      open: { type: Boolean, reflect: true }
    };
  }
  get dialog() {
    return this.querySelector("dialog");
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("sds-command", this.onCommand);
  }
  disconnectedCallback() {
    this.removeEventListener("sds-command", this.onCommand);
    this.#release?.();
    this.#release = void 0;
    super.disconnectedCallback();
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
  /** Open it and settle on what the reader chose — `show()` for a caller that
      has to wait for the answer rather than hear about it. */
  ask() {
    return new Promise((settle) => {
      const heard = (event) => {
        this.removeEventListener("sds-dialog-confirm", heard);
        this.removeEventListener("sds-dialog-cancel", heard);
        settle(event.type === "sds-dialog-confirm");
      };
      this.addEventListener("sds-dialog-confirm", heard);
      this.addEventListener("sds-dialog-cancel", heard);
      this.show();
    });
  }
  /* The page stays still behind an open question. */
  #release;
  updated() {
    if (this.open && this.isConnected) this.#release ??= hold("modal");
    else if (this.#release) {
      this.#release();
      this.#release = void 0;
    }
    const el = this.dialog;
    if (!el) return;
    if (!this.isConnected) return;
    try {
      if (this.open && !el.open) {
        el.returnValue = "";
        el.showModal();
      }
      if (!this.open && el.open) el.close();
    } catch {
      if (this.open) el.setAttribute("open", "");
    }
  }
  render() {
    return html57`<dialog
      class="${modalClass(this.size)}"
      style="${this.width > 0 ? `width:${this.width}px` : ""}"
      aria-label="${this.heading}"
      @close="${this.onClose}"
    >
  <div class="sds-modal__head">
    <span class="sds-modal__title">${this.heading}</span>
    <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon sds-modal__close" title="Close" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  ${this.foot()}
</dialog>`;
  }
  /* Buttons a caller wrote, or the pair a confirmation is: a `<form
     method="dialog">`, which is the platform's own answer. The press closes
     the dialog and leaves its value in `returnValue`, with no handler in
     between. At the control size the rest of the system writes, because what
     a dialog asks is the main action of the surface it opened. */
  foot() {
    if (this.actions.length || !this.confirmLabel) {
      return html57`<div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>`;
    }
    const tone = this.tone === "danger" ? "danger" : "primary";
    const glyph2 = this.confirmIcon ? html57`<sds-icon name="${this.confirmIcon}"></sds-icon>` : "";
    return html57`<form method="dialog" class="sds-modal__foot">
    <button class="${buttonClass({ variant: "ghost" })}" type="submit" value="cancel">${buttonLabel(this.cancelLabel)}</button>
    <button class="${buttonClass({ variant: tone })}" type="submit" value="${CONFIRM}">${glyph2}${buttonLabel(this.confirmLabel)}</button>
  </form>`;
  }
};
define("sds-dialog", SdsDialog);

// packages/frontend/src/components/table.ts
import { html as html58, nothing as nothing35 } from "lit";
var SdsTable = class extends SdsElement {
  constructor() {
    super();
    /* The table a document wrote, taken before Lit renders over it. A cell
       there carries a link, a literal, an emphasis, and none survives a JSON
       attribute. `colspan` and `rowspan` have no property at all. The hand-over
       is the table's own children, so the element still draws the `<table>`
       and decides its density. The parser drops a `<thead>` outside a
       `<table>`. So a page writes a whole `<table>` between the tags, and its
       rows are what the element takes. */
    this.taken = null;
    /* The one of the three that is a plain object of this system's own. A
       string is not an object at all. A template carries Lit's marker and its
       values, not a value. */
    this.stacked = (cell2) => typeof cell2 === "object" && cell2 !== null && "value" in cell2;
    this.density = "medium";
    this.scrollable = false;
    this.width = "";
    this.caption = "";
    this.captionSide = "bottom";
    this.columns = [];
    this.rows = [];
    this.loading = false;
    this.loadingRows = 3;
  }
  static {
    this.properties = {
      density: { type: String, reflect: true },
      scrollable: { type: Boolean, reflect: true },
      width: { type: String },
      caption: { type: String },
      captionSide: { type: String, reflect: true, attribute: "caption-side" },
      columns: { type: Array },
      rows: { type: Array },
      loading: { type: Boolean, reflect: true },
      loadingRows: { type: Number, attribute: "loading-rows" }
    };
  }
  connectedCallback() {
    this.taken = this.written();
    super.connectedCallback();
  }
  /* What stands between the tags: the rows of a `<table>` written whole, or
     its parts written bare where a template kept them. Read off the text
     region, so Node takes the same as a browser. */
  written() {
    const text2 = this.region(TEXT);
    if (!text2.length) return null;
    const [one] = text2;
    return text2.length === 1 && one?.tag === "table" ? one.inner : text2.map((part) => part.node);
  }
  /** What a column puts on both its head and its cells: what kind of cell it
      is, and its edge. One string, because the head and the cells have to
      stand at the same edge. A class list built twice comes out different
      once. */
  marks(column, head = false) {
    return [
      head ? "" : column?.cls ?? "",
      column?.align === "end" ? "sds-td-end" : "",
      column?.fit ? "sds-td-fit" : ""
    ].filter(Boolean).join(" ");
  }
  cell(value, cls) {
    const inner = this.stacked(value) ? html58`${value.value}${value.note ? html58`<span class="sds-td-note">${value.note}</span>` : nothing35}` : value;
    return cls ? html58`<td class="${cls}">${inner}</td>` : html58`<td>${inner}</td>`;
  }
  bodyRow(row2) {
    const cells3 = lines(row2.cells.map((v, i) => this.cell(v, this.marks(this.columns[i]))), 6);
    return html58`<tr class="${row2.selected ? "is-selected" : nothing35}" style="${row2.style ?? nothing35}">
      ${cells3}
    </tr>`;
  }
  /* One bar per declared column. Where the table has none, its rows arrive
     as markup, and a single bar is the whole of the shape it knows. */
  waitingRow() {
    const cells3 = Math.max(this.columns.length, 1);
    const bars3 = Array.from({ length: cells3 }, (_, i) => {
      const mark = this.marks(this.columns[i]);
      return mark ? html58`<td class="${mark}"><span class="sds-skeleton"></span></td>` : html58`<td><span class="sds-skeleton"></span></td>`;
    });
    return html58`<tr>
      ${lines(bars3, 6)}
    </tr>`;
  }
  render() {
    const cls = `sds-table sds-table--${this.density}${this.loading ? " sds-table--loading" : ""}` + (this.captionSide === "top" ? " sds-table--caption-top" : "");
    const style = this.width ? `width: ${this.width}` : nothing35;
    const caption = this.caption ? html58`<caption>${this.caption}</caption>\n  ` : "";
    const given = this.loading ? null : this.taken ?? this.written() ?? this.content;
    const body = this.loading ? Array.from({ length: Math.max(this.loadingRows, 1) }, () => this.waitingRow()) : this.rows.map((r) => this.bodyRow(r));
    const table2 = given ? html58`<table class="${cls}" style="${style}">${caption}${given}</table>` : html58`<table class="${cls}" style="${style}" aria-busy="${this.loading ? "true" : nothing35}">
  ${caption}<thead><tr>
    ${lines(this.columns.map((c) => {
      const mark = this.marks(c, true);
      return mark ? html58`<th class="${mark}">${c.head}</th>` : html58`<th>${c.head}</th>`;
    }), 4)}
  </tr></thead>
  <tbody>
    ${lines(body, 4)}
  </tbody>
</table>`;
    return this.scrollable ? html58`<div class="sds-table-scroll">${table2}</div>` : table2;
  }
};
define("sds-table", SdsTable);

// packages/frontend/src/components/card.ts
import { html as html59, svg } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
init_paint();
var SIGNS = ["yes", "partly", "no", "unknown"];
var SdsCard = class extends SdsElement {
  constructor() {
    super();
    /* What a caller wrote between the tags, taken before Lit renders over it.
       The one thing about a card an attribute cannot hold: out of a document the
       body is paragraphs, and often a list beside them. */
    this.taken = null;
    this.heading = "";
    this.body = "";
    this.href = "";
    this.src = "";
    this.alt = "";
    this.label = "";
    this.tag = "";
    this.footer = "";
    this.action = "";
  }
  static {
    this.properties = {
      heading: { type: String },
      body: { type: String },
      href: { type: String },
      src: { type: String },
      alt: { type: String },
      label: { type: String },
      tag: { type: String },
      icon: { type: String },
      sign: { type: String },
      footer: { type: String },
      action: { type: String }
    };
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => !isBlank(node));
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    const medium = this.src ? html59`<div class="sds-card__media${exported(this.src) ? " sds-card__media--exported" : ""}">
    ${art(this.src, this.alt)}
  </div>` : "";
    const icon = this.icon ? html59`<div class="sds-card__icon"><sds-icon name="${this.icon}" size="20"></sds-icon></div>` : "";
    const state2 = this.sign && SIGNS.includes(this.sign) ? this.sign : void 0;
    const mark = state2 ? html59`<svg class="sds-card__sign" viewBox="-14 -14 28 28" role="img" aria-label="${SIGN_MEANING[state2]}">${svg`${unsafeSVG(sign(state2, 0, 0))}`}</svg>` : "";
    const label = this.tag || this.label || mark ? html59`<div class="sds-row">
      ${this.tag ? html59`<sds-badge label="${this.tag}"></sds-badge>` : ""}
      ${this.label ? html59`<span class="sds-label">${this.label}</span>` : ""}${mark}
    </div>` : "";
    const written2 = this.taken ?? this.content;
    const blocks = written2 ?? (typeof this.body === "string" ? void 0 : this.body);
    const text2 = blocks ? html59`<div class="sds-card__text">${blocks}</div>` : html59`<p class="sds-card__text">${this.body}</p>`;
    const named2 = this.href ? html59`<a href="${this.href}">${this.heading}</a>` : html59`${this.heading}`;
    const title = this.heading ? html59`<h3 class="sds-card__title">${named2}</h3>` : "";
    const action = this.action && this.href ? html59`<span class="sds-card__action">${this.action}<sds-icon name="actions-arrow-right" size="16"></sds-icon></span>` : "";
    const foot = this.footer || action ? html59`<div class="sds-card__foot">
    ${this.footer ? html59`<span class="sds-card__note">${this.footer}</span>` : ""}
    ${action}
  </div>` : "";
    return html59`<article class="sds-card">
  ${medium}
  <div class="sds-card__body">
    ${icon}
    ${label}
    ${title}
    ${text2}
  </div>
  ${foot}
</article>`;
  }
};
define("sds-card", SdsCard);

// packages/frontend/src/components/icon-tile.ts
import { html as html60, nothing as nothing36 } from "lit";
var DRAWN2 = 32;
var SdsIconTile = class extends SdsElement {
  static {
    this.properties = {
      name: { type: String, reflect: true },
      caption: { type: String },
      href: { type: String },
      tag: { type: String }
    };
  }
  constructor() {
    super();
    this.caption = "";
    this.href = "";
    this.tag = "";
  }
  render() {
    const glyph2 = this.name ? html60`<sds-icon name="${this.name}" size="${DRAWN2}"></sds-icon>` : nothing36;
    const inside = html60`<span class="sds-icon-tile__art">
    ${glyph2}
  </span>
  <span class="sds-icon-tile__name">${this.caption || this.name}</span>
  ${this.tag ? html60`<span class="sds-icon-tile__tag">${this.tag}</span>` : nothing36}`;
    return this.href ? html60`<a class="sds-icon-tile" href="${this.href}">
  ${inside}
</a>` : html60`<div class="sds-icon-tile">
  ${inside}
</div>`;
  }
};
define("sds-icon-tile", SdsIconTile);

// packages/frontend/src/components/swatch.ts
import { html as html61, nothing as nothing37 } from "lit";
var COLOUR = /^(#[0-9a-f]{3,8}|(rgb|hsl|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\([^;{}]*\)|var\(--[\w-]+(,\s*[^;{}]*)?\)|[a-z]+)$/i;
var SdsSwatch = class extends SdsElement {
  static {
    this.properties = {
      value: { type: String },
      name: { type: String, reflect: true },
      resolved: { type: String },
      kind: { type: String, reflect: true }
    };
  }
  constructor() {
    super();
    this.value = "";
    this.name = "";
    this.resolved = "";
    this.kind = "fill";
  }
  render() {
    const paint = COLOUR.test(this.value.trim()) ? this.value.trim() : "";
    const style = paint ? this.kind === "line" ? `border-color:${paint}` : `background:${paint}` : "";
    return html61`<div class="sds-swatch${this.kind === "line" ? " sds-swatch--line" : ""}">
  <span class="sds-swatch__chip" style="${style}" aria-hidden="true"></span>
  <span class="sds-swatch__body">
    <span class="sds-swatch__name">${this.name}</span>
    ${this.resolved ? html61`<span class="sds-swatch__value">${this.resolved}</span>` : nothing37}
  </span>
</div>`;
  }
};
define("sds-swatch", SdsSwatch);

// packages/frontend/src/components/grid.ts
import { html as html62, nothing as nothing38 } from "lit";
var VARIANT = {
  default: "",
  wide: "sds-grid--wide",
  dense: "sds-grid--dense",
  flush: "sds-grid--flush"
};
var CEILING = {
  2: "sds-grid--2",
  3: "sds-grid--3",
  4: "sds-grid--4"
};
function evenColumns(count, fits) {
  for (let columns3 = Math.min(fits, count); columns3 > 1; columns3--) {
    const rest = count % columns3;
    if (rest === 0 || rest >= columns3 - 1) return columns3;
  }
  return 1;
}
var waiting = /* @__PURE__ */ new Set();
var pass = false;
var measureAll = () => {
  pass = false;
  const grids = [...waiting].filter((grid2) => grid2.isConnected);
  waiting.clear();
  const answers = grids.map((grid2) => grid2.decide());
  grids.forEach((grid2, i) => {
    const answer = answers[i];
    if (answer !== void 0) grid2.settled = answer;
  });
};
var parents = /* @__PURE__ */ new WeakMap();
var resized = /* @__PURE__ */ new Set();
var frame2 = 0;
var sizes = typeof ResizeObserver === "undefined" ? void 0 : new ResizeObserver((entries) => {
  for (const entry of entries) for (const grid2 of parents.get(entry.target) ?? []) resized.add(grid2);
  if (frame2) return;
  frame2 = requestAnimationFrame(() => {
    frame2 = 0;
    for (const grid2 of resized) if (grid2.isConnected) grid2.ask();
    resized.clear();
  });
});
var SdsGrid = class extends SdsElement {
  constructor() {
    super();
    /* What a caller wrote between the tags, taken before Lit renders over it.
       Nothing else about the set is content: what an item is, is its own
       business, and the grid never reaches inside one. */
    this.taken = null;
    this.watched = null;
    this.variant = "default";
    this.settled = 0;
  }
  static {
    this.properties = {
      variant: { type: String },
      columns: { type: Number, reflect: true },
      /** The columns the last measurement settled on. Zero is "not measured",
          which renders the grid the stylesheet declares. That is the state a
          page arrives in and the only one a reader with no script ever sees. */
      settled: { type: Number, state: true }
    };
  }
  connectedCallback() {
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
    this.watched = this.parentElement;
    if (this.watched) {
      const grids = parents.get(this.watched) ?? /* @__PURE__ */ new Set();
      if (!grids.size) sizes?.observe(this.watched);
      grids.add(this);
      parents.set(this.watched, grids);
    }
    void this.updateComplete.then(() => this.ask());
  }
  /** A measurement in the next pass of every grid on the page. */
  ask() {
    waiting.add(this);
    if (pass) return;
    pass = true;
    queueMicrotask(measureAll);
  }
  disconnectedCallback() {
    const grids = this.watched ? parents.get(this.watched) : void 0;
    grids?.delete(this);
    if (this.watched && grids && !grids.size) sizes?.unobserve(this.watched);
    this.watched = null;
    resized.delete(this);
    super.disconnectedCallback();
  }
  /** What the sheet draws on its own, and what to draw instead.
  
        The minimum comes off the grid rather than a copy here. The three widths
        differ in exactly that number, and a copy of it in TypeScript is the
        copy that goes stale. */
  decide() {
    const grid2 = this.firstElementChild;
    if (!grid2) return void 0;
    const count = grid2.childElementCount;
    if (count < 3) return 0;
    const style = getComputedStyle(grid2);
    const min = parseFloat(style.getPropertyValue(this.columns ? "--grid-least" : "--grid-min"));
    const gap = parseFloat(style.columnGap) || 0;
    const room = grid2.getBoundingClientRect().width;
    if (!(min > 0) || !(room > 0)) return void 0;
    const roomFits = Math.max(1, Math.floor((room + gap) / (min + gap)));
    const fits = this.columns ? Math.min(roomFits, this.columns) : roomFits;
    const wanted = evenColumns(count, fits);
    return wanted >= fits ? 0 : wanted;
  }
  /* After the update, not in it. A state set inside `updated()` starts the
     next cycle before this one has closed, which Lit's dev build names as
     the inefficiency it is. */
  updated() {
    void this.updateComplete.then(() => this.ask());
  }
  render() {
    const cls = ["sds-grid", VARIANT[this.variant] ?? "", this.columns ? CEILING[this.columns] ?? "" : ""].filter(Boolean).join(" ");
    const settled2 = this.settled > 0 ? `grid-template-columns:repeat(${this.settled},minmax(0,1fr))` : nothing38;
    return html62`<div class="${cls}" style="${settled2}">${this.taken ?? this.content}</div>`;
  }
};
define("sds-grid", SdsGrid);

// packages/frontend/src/components/nav-pagination.ts
import { html as html63 } from "lit";
function pageHref(href, page) {
  return href.includes("{n}") ? href.replace(/\{n\}/g, String(page)) : `${href}${page}`;
}
var grouped = (n) => String(n).replace(/\B(?=(\d{3})+$)/g, ",");
function pageCount(count, perPage) {
  return Math.max(1, Math.ceil(count / Math.max(1, perPage)));
}
function pageNumbers(pages, current) {
  const keep = /* @__PURE__ */ new Set();
  for (let i = 1; i <= pages; i++) {
    if (i <= 1 || i >= pages || Math.abs(i - current) <= 1) keep.add(i);
  }
  const out = [];
  let last = 0;
  for (const n of [...keep].sort((a, b) => a - b)) {
    if (last && n - last > 1) out.push(n - last === 2 ? last + 1 : 0);
    out.push(n);
    last = n;
  }
  return out;
}
var SdsNavPagination = class extends SdsElement {
  static {
    this.properties = {
      count: { type: Number },
      perPage: { type: Number, attribute: "per-page" },
      current: { type: Number, reflect: true },
      href: { type: String },
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.count = 0;
    this.perPage = 10;
    this.current = 1;
    this.href = "#page-{n}";
    this.label = "";
  }
  /** What the row draws from, and the one place the division happens. */
  get pages() {
    return pageCount(this.count, this.perPage);
  }
  /** Say which page the press asked for, and let the answer decide what the
      press does. Cancelable, because a stop of the navigation is the only way
      a surface that pages in place can take the press over. It is the same
      press either way. */
  ask(event, to) {
    const change = new CustomEvent("sds-change", {
      detail: { page: to },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    this.dispatchEvent(change);
    if (!change.defaultPrevented) return;
    event.preventDefault();
    this.current = to;
  }
  step(label, to, icon) {
    const off = to < 1 || to > this.pages;
    const cls = `sds-pagination__step${off ? " is-disabled" : ""}`;
    const glyph2 = html63`<sds-icon name="${icon}"></sds-icon>`;
    const inner = icon === "actions-chevron-start" ? html63`${glyph2}${label}` : html63`${label}${glyph2}`;
    return off ? html63`<span class="${cls}" aria-disabled="true">${inner}</span>` : html63`<a class="${cls}" href="${pageHref(this.href, to)}" rel="${icon === "actions-chevron-start" ? "prev" : "next"}" @click="${(event) => this.ask(event, to)}">${inner}</a>`;
  }
  render() {
    return html63`<nav class="sds-pagination" aria-label="Pages">
  ${this.step("Previous", this.current - 1, "actions-chevron-start")}
  ${pageNumbers(this.pages, this.current).map(
      (n) => n === 0 ? html63`<span class="sds-pagination__gap" aria-hidden="true">…</span>` : n === this.current ? html63`<span class="sds-pagination__page is-active" aria-current="page">${n}</span>` : html63`<a class="sds-pagination__page" href="${pageHref(this.href, n)}" @click="${(event) => this.ask(event, n)}">${n}</a>`
    )}
  ${this.step("Next", this.current + 1, "actions-chevron-end")}
  ${this.count > 0 ? html63`<span class="sds-pagination__count">${grouped(this.count)}${this.label ? ` ${this.label}` : ""}</span>` : ""}
</nav>`;
  }
};
define("sds-nav-pagination", SdsNavPagination);

// packages/frontend/src/components/nav-pager.ts
import { html as html64 } from "lit";
var SdsNavPager = class _SdsNavPager extends SdsElement {
  static {
    this.properties = {
      previousHref: { type: String, attribute: "previous-href" },
      previousLabel: { type: String, attribute: "previous-label" },
      nextHref: { type: String, attribute: "next-href" },
      nextLabel: { type: String, attribute: "next-label" },
      label: { type: String }
    };
  }
  constructor() {
    super();
    this.previousHref = "";
    this.previousLabel = "";
    this.nextHref = "";
    this.nextLabel = "";
    this.label = "Pages either side of this one";
  }
  /* `buttonMarkup` rather than `<sds-button>`, the way `sds-nav-pagination` draws
     its own steps. An element with children draws none of them outside a
     browser, and a link that goes somewhere has nothing to upgrade for. The
     markup is the button's own, exported from the button. */
  static step(href, body, rel) {
    return buttonMarkup({ variant: "secondary", href, rel }, body);
  }
  render() {
    const back = this.previousHref && this.previousLabel ? _SdsNavPager.step(
      this.previousHref,
      html64`<sds-icon name="actions-arrow-left" size="16" label="Previous page"></sds-icon>${buttonLabel(this.previousLabel)}`,
      "prev"
    ) : "";
    const on = this.nextHref && this.nextLabel ? _SdsNavPager.step(
      this.nextHref,
      html64`${buttonLabel(this.nextLabel)}<sds-icon name="actions-arrow-right" size="16" label="Next page"></sds-icon>`,
      "next"
    ) : "";
    return html64`<nav class="sds-pager" aria-label="${this.label}">
  ${back}
  ${on ? html64`<span class="sds-pager__next">${on}</span>` : ""}
</nav>`;
  }
};
define("sds-nav-pager", SdsNavPager);

// packages/frontend/src/components/code.ts
import { html as html65 } from "lit";
import { unsafeHTML as unsafeHTML4 } from "lit/directives/unsafe-html.js";

// packages/frontend/src/lib/later.ts
function later(fetch2) {
  let got;
  let pending;
  return {
    get now() {
      return got;
    },
    load: () => pending ??= fetch2().then((module) => got = module)
  };
}

// packages/frontend/src/lib/highlighter.ts
var highlighter = later(() => Promise.resolve().then(() => (init_highlight(), highlight_exports)));

// packages/frontend/src/lib/clipboard.ts
var SAID = 1600;
async function toClipboard(text2) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text2);
      return true;
    } catch {
    }
  }
  return selected(text2);
}
function selected(text2) {
  if (typeof document === "undefined") return false;
  const box2 = document.createElement("textarea");
  box2.value = text2;
  box2.setAttribute("readonly", "");
  box2.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0";
  document.body.append(box2);
  const was = document.activeElement;
  box2.select();
  let done = false;
  try {
    done = document.execCommand("copy");
  } catch {
    done = false;
  }
  box2.remove();
  if (was instanceof HTMLElement) was.focus();
  return done;
}

// packages/frontend/src/components/code.ts
function perLine(markup) {
  const out = [];
  const open = [];
  let line2 = "";
  for (const [token] of markup.matchAll(/<span[^>]*>|<\/span>|\n|[^<\n]+|</g)) {
    if (token === "\n") {
      out.push(line2 + "</span>".repeat(open.length));
      line2 = open.join("");
      continue;
    }
    if (token === "</span>") open.pop();
    else if (token.startsWith("<span")) open.push(token);
    line2 += token;
  }
  out.push(line2 + "</span>".repeat(open.length));
  return out;
}
var escape2 = (text2) => text2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var isCaption3 = (node) => node.nodeType === 1 && node.matches(".sds-code__caption");
var SdsCode = class extends SdsElement {
  constructor() {
    super();
    /* Content between the tags, taken before Lit renders over it. Light DOM
       means `render()` replaces the children, and the children are the whole
       point where a renderer wrote the block. Lifted on connect and handed
       back as nodes. Lit renders a node as a child value, and a re-render
       moves the same nodes and does not copy them. */
    this.taken = null;
    /* The caption, where it too stood between the tags, as nodes. It carries a
       literal, a link or an emphasis, and an attribute flattens all three.
       Inside the element, so the block places it. Beside it, nothing keeps the
       two together. Apart from `taken`, which everything else here reads as
       the block itself. */
    this.captioned = null;
    /* The word goes back after a while: one timer, renewed by a new press and
       gone with the element. */
    this.#said = 0;
    this.lang = "";
    this.caption = "";
    this.source = "";
    this.body = [];
    this.copy = false;
    this.copied = false;
    this.remarks = [];
    this.start = 0;
  }
  static {
    this.properties = {
      lang: { type: String, reflect: true, attribute: "code-lang" },
      caption: { type: String },
      source: { type: String },
      /* Styled lines, which no attribute can carry. A shell prompt, a comment
         and a result are three different spans. A flat string throws away the
         only thing the component does. */
      body: { type: Array },
      action: { type: Object },
      copy: { type: Boolean, reflect: true },
      copied: { type: Boolean, state: true },
      remarks: { type: Array },
      start: { type: Number }
    };
  }
  connectedCallback() {
    const written2 = this.lifted();
    const caption = written2.filter(isCaption3);
    const said = written2.filter((node) => !isCaption3(node));
    if (caption.length) this.captioned = caption;
    if (said.length) this.taken = said;
    super.connectedCallback();
  }
  /** What the block puts on the clipboard: what it says, and none of its
      frame. Read from the content, not the rendering. In light DOM the
      element's own text is the head too, so a paste starts with the language
      and the word on the button. The `$` goes, for the reason it is a span
      of its own. It is the prompt, and in a shell it is an error. */
  get text() {
    const said = this.taken ? this.written : this.source || this.body.map(({ text: text2, code }) => code ? `${text2} ${code}` : text2).join("\n");
    return said.replace(/^\n+/, "").replace(/\n+$/, "");
  }
  /** The text between the tags, without the comments, which are not the
      author's. A template that interpolates its content leaves Lit's own
      markers among the children, and `textContent` reads a comment's body
      like any other. */
  get written() {
    return (this.taken ?? []).filter((node) => node.nodeType !== 8).map((node) => node.textContent ?? "").join("");
  }
  async take() {
    if (!await toClipboard(this.text)) return;
    this.copied = true;
    clearTimeout(this.#said);
    this.#said = window.setTimeout(() => {
      this.copied = false;
    }, SAID);
  }
  #said;
  disconnectedCallback() {
    clearTimeout(this.#said);
    super.disconnectedCallback();
  }
  /* Always drawn where the block asked for one. A question to the browser
     about its clipboard, with no button on a no, left no button on every
     origin outside a secure context. That is most of the ones a design
     system gets its review on; see `lib/clipboard.ts`. */
  get copyButton() {
    if (!this.copy) return void 0;
    return html65`<button type="button" class="sds-code__copy${this.copied ? " is-copied" : ""}" aria-label="Copy this block" @click="${() => void this.take()}"><span class="sds-code__glyph"><sds-icon name="actions-duplicate"></sds-icon></span><span class="sds-code__copied"><sds-icon name="actions-check"></sds-icon></span><span>${this.copied ? "copied" : "copy"}</span></button>`;
  }
  /* The lines the free `comment()`, `shell()` and `ok()` helpers used to
     build. They were three exported functions that assembled markup a caller
     then handed back in. That made the component's own output something any
     caller can half-write. A line is data now, and only this file turns it
     into spans. */
  line({ kind, text: text2, code }) {
    const tail = code ? html65` <span class="sds-code__cmd">${code}</span>` : void 0;
    switch (kind) {
      case "shell":
        return html65`<span class="sds-code__prompt">$</span> <span class="sds-code__cmd">${text2}</span>${tail}`;
      case "comment":
        return html65`<span class="sds-code__comment">${text2}</span>${tail}`;
      case "ok":
        return html65`<span class="sds-code__ok">✓</span> ${text2}${tail}`;
      case "remark":
        return html65`<span class="sds-code__remark"><span class="sds-code__remark-text">${text2}</span></span>`;
      default:
        return html65`${text2}${tail}`;
    }
  }
  /* If the block arrived with its colour. A build that highlights on its own
     hands in complete markup. A second pass flattens the spans back to text
     and rebuilds them from fewer grammars. `hljs-` is the signal because
     `components.css` maps those classes and nothing else. Wrapper and all:
     the `<code>` holds which lines carry numbers. */
  get given() {
    if (this.content) return true;
    return (this.taken ?? []).some((node) => {
      if (node.nodeType !== 1) return false;
      const el = node;
      return el.matches('[class*="hljs-"]') || el.querySelector('[class*="hljs-"]') !== null;
    });
  }
  /* Content between the tags, in the `<code>` a code block has. The element
     renders that wrapper and its `language-` class from `lang`. So a caller
     cannot say the language twice and have the two disagree. One paints the
     head, the other decides the colour. It colours the block too, unless the
     colour arrived with it; see `given`. */
  get wrapped() {
    const written2 = this.taken ?? this.content ?? this.text;
    if (this.given) return html65`${written2}`;
    if (this.remarks.length || this.start) return this.lined;
    if (!this.lang) return html65`<code>${written2}</code>`;
    const coloured = this.colour(this.lang, this.text);
    return coloured === null ? html65`<code class="language-${this.lang}">${written2}</code>` : html65`<code class="language-${this.lang}">${unsafeHTML4(coloured)}</code>`;
  }
  /* The colour, once the highlighter arrived. The first block that needs it
     fetches it, prints its text plain until then, and colours on arrival. */
  colour(lang, text2) {
    const loaded = highlighter.now;
    if (loaded) return loaded.highlight(lang, text2);
    void highlighter.load().then(() => {
      this.#painted = void 0;
      this.requestUpdate();
    });
    return null;
  }
  async getUpdateComplete() {
    const done = await super.getUpdateComplete();
    if (highlighter.now || !this.lang || this.given) return done;
    await highlighter.load();
    return super.getUpdateComplete();
  }
  /** Where the block's lines start, as the numbers say: `start`, or one
      where nothing set it and a remark still counts. */
  get first() {
    return this.start || 1;
  }
  /** The row a cited line is, held inside the block. A line the block does
      not have lands at the nearer edge, so a wrong number is a thing a
      reader sees, and not nothing. */
  rowOf(line2, rows) {
    return Math.min(Math.max(line2 - this.first, 0), rows - 1);
  }
  /* The block as numbered lines. Built as markup, because the colour is
     markup and every line has to become a block with its number in front.
     A line a remark cites carries a mark: the number in the page's ink. The
     gutter is as wide as the last number, and the width goes onto the
     element as a property. */
  get lined() {
    const coloured = this.lang ? this.colour(this.lang, this.text) : null;
    const rows = perLine(coloured ?? escape2(this.text));
    const cited = new Set(this.remarks.map(({ line: line2 }) => this.rowOf(line2, rows.length)));
    const digits = String(this.first + rows.length - 1).length;
    const markup = rows.map((row2, at) => `<span class="sds-code__row${cited.has(at) ? " sds-code__row--cited" : ""}"><span class="sds-code__no">${this.first + at}</span>${row2}</span>`).join("");
    return html65`<code class="${this.lang ? `language-${this.lang}` : ""}" style="--sds-code-no-width:${digits}ch">${unsafeHTML4(markup)}</code>`;
  }
  /* The remarks under the block, each with the number of its line. Prose,
     and outside the machine's box: the block stays what the machine wrote,
     and the number is the way from the sentence to the line. */
  get remarked() {
    if (!this.remarks.length) return void 0;
    const rows = this.text.split("\n").length;
    return html65`<dl class="sds-code__remarks">${this.remarks.map(({ line: line2, text: text2 }) => html65`
    <dt>${this.first + this.rowOf(line2, rows)}</dt>
    <dd>${text2}</dd>`)}
  </dl>`;
  }
  /* The coloured block, kept while what it reads stays the same. A press
     on the copy button renders the element twice and colours nothing. */
  #painted;
  get painted() {
    const from = [this.taken, this.content, this.source, this.lang, this.remarks, this.start];
    if (this.#painted && from.every((one, at) => one === this.#painted?.from[at])) return this.#painted.body;
    const body = this.wrapped;
    this.#painted = { from, body };
    return body;
  }
  render() {
    const affordance = this.action ?? this.copyButton;
    const head = this.lang || affordance ? html65`<div class="sds-code__head">
    <span class="sds-code__lang">${this.lang}</span>
    ${affordance}
  </div>` : void 0;
    const remarked = this.remarked;
    const caption = this.captioned ? html65`${this.captioned}` : this.caption ? html65`<div class="sds-code__caption">${this.caption}</div>` : void 0;
    return html65`${caption}<div class="sds-code">
  ${head}
  <pre class="sds-code__body" tabindex="0">${this.taken || this.content || this.source ? this.painted : lines(this.body.map((l) => this.line(l)), 0)}</pre>${remarked ? html65`
  ${remarked}` : ""}
</div>`;
  }
};
define("sds-code", SdsCode);

// packages/frontend/src/components/copy.ts
import { html as html66, nothing as nothing39 } from "lit";
var SdsCopy = class extends SdsElement {
  static {
    this.properties = {
      value: { type: String },
      label: { type: String },
      ellipsis: { type: String },
      copied: { type: Boolean, state: true }
    };
  }
  constructor() {
    super();
    this.value = "";
    this.label = "";
    this.ellipsis = "none";
    this.copied = false;
  }
  /* The word goes back after a while: one timer, renewed by a new press and
     gone with the element. */
  #said = 0;
  async take() {
    if (!await toClipboard(this.value)) return;
    this.copied = true;
    clearTimeout(this.#said);
    this.#said = window.setTimeout(() => {
      this.copied = false;
    }, SAID);
  }
  disconnectedCallback() {
    clearTimeout(this.#said);
    super.disconnectedCallback();
  }
  render() {
    const said = this.label ? `Copy ${this.label}` : "Copy this value";
    const button = html66`<button
      type="button"
      class="sds-btn sds-btn--ghost sds-btn--icon sds-btn--sm sds-copy__button${this.copied ? " is-copied" : ""}"
      title="${said}"
      aria-label="${said}"
      @click="${() => void this.take()}"
    ><sds-icon name="${this.copied ? "actions-check" : "actions-duplicate"}"></sds-icon></button>`;
    const cut = this.ellipsis === "start" || this.ellipsis === "end" ? ` sds-copy--ellipsis-${this.ellipsis}` : "";
    return html66`<span class="sds-copy${cut}">
  <span class="sds-copy__value" title="${cut ? this.value : nothing39}"><bdi>${this.value}</bdi></span>
  ${button}
  <span class="sds-said-only" role="status">${this.copied ? said.replace(/^Copy/, "Copied") : ""}</span>
</span>`;
  }
};
define("sds-copy", SdsCopy);

// packages/frontend/src/components/tree.ts
import { html as html67, nothing as nothing40 } from "lit";
var SdsTree = class extends SdsElement {
  static {
    this.properties = {
      entries: { type: Array },
      level: { type: Number, reflect: true },
      icons: { type: Boolean, reflect: true }
    };
  }
  constructor() {
    super();
    this.entries = [];
    this.level = 2;
    this.icons = false;
  }
  /* The glyph for what a row is, where a caller asked for them. */
  glyph(branch2) {
    if (!this.icons) return nothing40;
    return html67`<sds-icon class="sds-tree__glyph" name="${branch2 ? "actions-folder" : "actions-file"}"></sds-icon>`;
  }
  /* The name and whatever stands beside it — one row, with a fold or without,
     so a leaf's name begins where a directory's does. */
  said(entry, branch2) {
    return html67`<span class="sds-tree__mark">${branch2 ? html67`<sds-icon name="actions-chevron-down"></sds-icon>` : nothing40}</span>${this.glyph(branch2)}<span class="sds-tree__name">${entry.label}</span>${entry.note ? html67`<span class="sds-tree__note">${entry.note}</span>` : nothing40}`;
  }
  row(entry, depth) {
    const under = entry.items ?? [];
    if (!under.length) {
      return html67`<li class="sds-tree__item">
  <span class="sds-tree__row">${this.said(entry, false)}</span>
</li>`;
    }
    return html67`<li class="sds-tree__item">
  <details class="sds-tree__fold" ?open="${depth < this.level}">
    <summary class="sds-tree__row">${this.said(entry, true)}</summary>
    ${this.list(under, depth + 1)}
  </details>
</li>`;
  }
  list(entries, depth) {
    return html67`<ul class="sds-tree__list">
  ${lines(entries.map((entry) => this.row(entry, depth)), 2)}
</ul>`;
  }
  render() {
    return html67`<div class="sds-tree">
  ${this.list(this.entries, 0)}
</div>`;
  }
};
define("sds-tree", SdsTree);

// packages/frontend/src/components/diagram.ts
import { html as html68, nothing as nothing41 } from "lit";
import { unsafeHTML as unsafeHTML5 } from "lit/directives/unsafe-html.js";

// packages/frontend/src/lib/diagram/load.ts
var engine = later(() => Promise.resolve().then(() => (init_engine(), engine_exports)));

// packages/frontend/src/components/diagram.ts
var named = (source) => {
  let hash = 5381;
  for (let i = 0; i < source.length; i++) hash = (hash << 5) + hash + source.charCodeAt(i) >>> 0;
  return `diagram-${hash.toString(36)}`;
};
var dedent = (text2) => {
  const lines5 = text2.replace(/\t/g, "  ").split("\n");
  const indents = lines5.filter((l) => l.trim()).map((l) => l.length - l.trimStart().length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines5.map((l) => l.slice(cut)).join("\n").trim();
};
var unescape2 = (text2) => text2.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
var KEPT = 200;
var kept = /* @__PURE__ */ new Map();
function once2(key2, make) {
  if (kept.has(key2)) {
    const known = kept.get(key2);
    kept.delete(key2);
    kept.set(key2, known);
    return known;
  }
  const made = make();
  kept.set(key2, made);
  if (kept.size > KEPT) kept.delete(kept.keys().next().value);
  return made;
}
var parsed = (source) => {
  const spec = once2(`parse
${source}`, () => {
    try {
      return engine.now.parse(source);
    } catch (error) {
      return error;
    }
  });
  if (spec instanceof Error) throw spec;
  return spec;
};
var slideRoom = (room) => {
  const [width2 = 0, height = 0] = room.split(",").map(Number);
  return width2 > 0 && height > 0 ? { width: width2, height } : void 0;
};
var SdsDiagram = class extends SdsElement {
  constructor() {
    super();
    /* The text between the tags, taken before Lit renders over it. */
    this.written = "";
    this.source = "";
    this.name = "";
    this.room = "";
    this.zoomable = false;
  }
  static {
    this.properties = {
      source: { type: String },
      name: { type: String },
      room: { type: String },
      lent: { type: String, reflect: true },
      zoomable: { type: Boolean, reflect: true }
    };
  }
  /** Lend the drawing a room, `width,height`. A text too dense for it draws
      as on a page instead, and the slide shrinks it as a picture. A room a
      pixel or two off the one it has is the same room, measured again. */
  lend(room) {
    const [w = 0, h = 0] = room.split(",").map(Number);
    const [was, had] = (this.lent ?? "").split(",").map(Number);
    if (was !== void 0 && had !== void 0 && Math.abs(w - was) <= 2 && Math.abs(h - had) <= 2) return false;
    this.lent = room;
    return true;
  }
  /** The room the text needs in the one a slide offers: that room, or the
      same shape larger. A row lends each of its drawings the largest, so
      they share one scale. Reads only. */
  reach(room) {
    if (!engine.now) return room;
    try {
      const source = this.text;
      const grown = this.fits(parsed(source), this.name || named(source), room);
      return grown ? `${grown.width},${grown.height}` : room;
    } catch {
      return room;
    }
  }
  connectedCallback() {
    const text2 = this.lifted().filter((node) => node.nodeType !== 8).map((node) => node.textContent ?? "").join("");
    if (text2.trim()) this.written = text2;
    super.connectedCallback();
  }
  /** The text to draw: `source`, else what stands between the tags, else
      the same under a prerender, where Node hands it over as markup. */
  get text() {
    if (this.source) return this.source;
    const raw = this.written || unescape2((this.authored ?? "").replace(/<[^>]*>/g, ""));
    return dedent(raw);
  }
  /* The first drawing on a page fetches the engine and draws once it is
     there. Until then the element stands empty, and its update waits. */
  async getUpdateComplete() {
    const done = await super.getUpdateComplete();
    if (engine.now) return done;
    await engine.load();
    return super.getUpdateComplete();
  }
  render() {
    const loaded = engine.now;
    if (!loaded) {
      void engine.load().then(() => this.requestUpdate());
      return html68`<div class="sds-diagram"></div>`;
    }
    const { draw: draw3 } = loaded;
    const source = this.text;
    const name = this.name || named(source);
    try {
      const spec = parsed(source);
      const slide = slideRoom(this.room) ?? (this.lent && !spec.slide ? this.fits(spec, name, this.lent) : void 0);
      const at = slide ? `${slide.width},${slide.height}` : "";
      const { svg: svg2, width: width2 } = once2(`draw
${name}
${at}
${source}`, () => draw3(spec, slide ? { name, slide } : { name }));
      const drawn2 = slide || spec.slide ? nothing41 : `--sds-diagram-width: ${width2}px`;
      if (!this.zoomable) return html68`<div class="sds-diagram" style="${drawn2}" tabindex="${drawn2 === nothing41 ? nothing41 : "0"}">${unsafeHTML5(svg2)}</div>`;
      const large = () => html68`${unsafeHTML5(once2(`draw
${name}-large
${at}
${source}`, () => draw3(spec, slide ? { name: `${name}-large`, slide } : { name: `${name}-large` })).svg)}`;
      const { trigger, viewer } = zoom(this, html68`${unsafeHTML5(svg2)}`, { src: "", alt: spec.title, caption: spec.title, content: large });
      return html68`<div class="sds-diagram" style="${drawn2}">${trigger}${viewer}</div>`;
    } catch (error) {
      const message = error.message.replace(`${name}: `, "");
      return html68`<p class="sds-diagram__error" role="alert">${message}</p>`;
    }
  }
  /* The lent room, or the same shape up to twice as large, where the
     engine draws the text in it. The slide shrinks a larger one whole. */
  fits(spec, name, lent) {
    return once2(`fits
${name}
${lent}
${this.text}`, () => this.tryRooms(spec, name, lent));
  }
  tryRooms(spec, name, lent) {
    const room = slideRoom(lent);
    const draw3 = engine.now?.draw;
    if (!room || !draw3) return void 0;
    for (const scale of [1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.5, 1.6, 1.7, 1.8, 2]) {
      const tried = { width: Math.round(room.width * scale), height: Math.round(room.height * scale) };
      try {
        draw3(spec, { name, slide: tried });
        return tried;
      } catch {
      }
    }
    return void 0;
  }
};
define("sds-diagram", SdsDiagram);

// packages/frontend/src/components/diff.ts
import { html as html69 } from "lit";
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
  /* Diff rows carry no newline between them. Each `sds-diff__line` is a
     block, so a newline inside the `<pre>` adds an empty line between every
     pair of rows. */
  line({ kind, text: text2 }) {
    if (kind === "context") return html69`<span class="sds-diff__line">   ${text2}</span>`;
    const mark = kind === "add" ? "+" : "-";
    return html69`<span class="sds-diff__line sds-diff__line--${kind}"><span class="sds-diff__mark">${mark}</span>  ${text2}</span>`;
  }
  render() {
    return html69`<div class="sds-code">
  <div class="sds-code__head" style="justify-content:flex-start"><sds-icon name="${this.icon ?? "actions-code-compare"}"></sds-icon><span class="sds-code__path">${this.path}</span></div>
  <pre class="sds-diff">${this.body.map((l) => this.line(l))}</pre>
</div>`;
  }
};
define("sds-diff", SdsDiff);

// packages/frontend/src/components/quote.ts
import { html as html71 } from "lit";

// packages/frontend/src/components/byline.ts
import { html as html70 } from "lit";
var SdsByline = class extends SdsElement {
  static {
    this.properties = {
      name: { type: String },
      as: { type: String },
      meta: { type: String },
      initials: { type: String },
      href: { type: String },
      unmarked: { type: Boolean }
    };
  }
  constructor() {
    super();
    this.name = "";
    this.as = "";
    this.meta = "";
    this.initials = "";
    this.href = "";
    this.unmarked = false;
  }
  /** First letters of the first and last word — two at most. Three initials
      in a mark the size of a control is a monogram nobody can read. */
  get mark() {
    if (this.initials) return this.initials;
    const words = this.name.trim().split(/\s+/).filter(Boolean);
    const first = words[0]?.[0] ?? "";
    const last = words.length > 1 ? words[words.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase();
  }
  render() {
    const who = this.href ? html70`<a class="sds-link" href="${this.href}">${this.name}</a>` : html70`${this.name}`;
    return html70`<div class="sds-byline">
  ${this.unmarked ? "" : html70`<span class="sds-byline__mark" aria-hidden="true">${this.mark}</span>`}
  <div class="sds-byline__who">
    <span class="sds-byline__name">${who}${this.as ? html70` <span class="sds-byline__role">· ${this.as}</span>` : ""}</span>
    ${this.meta ? html70`<span class="sds-label">${this.meta}</span>` : ""}
  </div>
</div>`;
  }
};
define("sds-byline", SdsByline);

// packages/frontend/src/components/quote.ts
var SdsQuote = class extends SdsElement {
  constructor() {
    super();
    /* The sentence, where it stood between the tags. A product surface quotes
       a line somebody composed and a property carries it. A document quotes the
       passage it found, with links and emphasis in it — which is markup or it
       is nothing. */
    this.taken = null;
    this.body = "";
    this.by = "";
    this.as = "";
    this.href = "";
    this.meta = "";
    this.initials = "";
  }
  static {
    this.properties = {
      body: { type: String },
      by: { type: String },
      as: { type: String },
      href: { type: String },
      meta: { type: String },
      initials: { type: String }
    };
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => !isBlank(node));
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    return html71`<figure class="sds-quote">
  <blockquote class="sds-quote__body">${this.taken ?? this.content ?? this.body}</blockquote>
  <figcaption class="sds-quote__by"><sds-byline
    name="${this.by}"
    as="${this.as}"
    meta="${this.meta}"
    href="${this.href}"
    initials="${this.initials}"
    ?unmarked="${!this.initials}"
  ></sds-byline></figcaption>
</figure>`;
  }
};
define("sds-quote", SdsQuote);

// packages/frontend/src/components/slide.ts
import { html as html72, nothing as nothing42 } from "lit";
var KIND = {
  cover: "sds-slide--cover",
  section: "sds-slide--section",
  statement: "sds-slide--statement",
  content: "sds-slide--content",
  closing: "sds-slide--closing",
  speaker: "sds-slide--speaker",
  figure: "sds-slide--figure"
};
var LAYOUT = {
  wide: "",
  full: "sds-slide--full",
  headed: "sds-slide--headed",
  row: "sds-slide--row",
  "text-start": "sds-slide--beside"
};
var GROUND = { paper: "light", terminal: "dark" };
var STOPS = 'a[href], button, input, select, textarea, summary, iframe, [tabindex]:not([tabindex="-1"])';
var ROOM = 1.1;
var SIZED = typeof CSS !== "undefined" && CSS.supports("zoom", "calc(100cqi / 1px)");
var waiting2 = /* @__PURE__ */ new Set();
var pass2 = 0;
var measureAll2 = () => {
  pass2 = 0;
  const slides = [...waiting2].filter((slide) => slide.isConnected);
  waiting2.clear();
  const zooms = slides.map((slide) => slide.room());
  slides.forEach((slide, i) => slide.take(zooms[i] ?? 0));
};
var asked = /* @__PURE__ */ new WeakMap();
var settled = /* @__PURE__ */ new WeakMap();
var sizeOf = (box2) => `${Math.round(box2.width)}x${Math.round(box2.height)}`;
var sizes2 = typeof ResizeObserver === "undefined" ? void 0 : new ResizeObserver((entries) => {
  for (const entry of entries) {
    const was = settled.get(entry.target);
    const now = sizeOf(entry.contentRect);
    if (was === PENDING) settled.set(entry.target, now);
    if (was === PENDING || was === now) continue;
    for (const slide of asked.get(entry.target) ?? []) slide.refit(entry.target);
  }
});
var PENDING = "pending";
var watch2 = (target, slide) => {
  const slides = asked.get(target) ?? /* @__PURE__ */ new Set();
  if (!slides.size) sizes2?.observe(target);
  slides.add(slide);
  asked.set(target, slides);
};
var unwatch = (target, slide) => {
  const slides = asked.get(target);
  slides?.delete(slide);
  if (slides && !slides.size) sizes2?.unobserve(target);
};
var placed = /* @__PURE__ */ new Set();
if (typeof window !== "undefined") window.addEventListener("resize", () => placed.forEach((slide) => slide.refit()));
var fitting = /* @__PURE__ */ new Set();
var fitPass = 0;
var fitAll = () => {
  fitPass = 0;
  const slides = [...fitting].filter((slide) => slide.isConnected);
  fitting.clear();
  fitBoxes(slides.flatMap((slide) => slide.boxes()));
  for (const slide of slides) slide.fitted();
};
var roomed = /* @__PURE__ */ new WeakMap();
var ROUNDS = 7;
function fitBoxes(boxes2) {
  const open = boxes2.filter((one) => roomed.get(one.fit) !== sizeOf(one.room));
  for (const { fit: fit2 } of open) {
    fit2.style.removeProperty("zoom");
    fit2.style.removeProperty("width");
    fit2.style.removeProperty("align-self");
  }
  const measured = open.map((one) => {
    const need = one.fit.getBoundingClientRect();
    const wide = one.fit.scrollWidth > one.fit.clientWidth + 1 ? one.fit.clientWidth / one.fit.scrollWidth : 1;
    const ratio = one.room.height > 0 && need.height > 0 ? Math.min(one.room.height / need.height, wide) : 1;
    const scale = need.width / parseFloat(getComputedStyle(one.fit).width);
    return { ...one, need, ratio, scale, zoom: ratio, best: ratio };
  });
  const shrunk = measured.filter((one) => one.ratio < 1);
  const put = (one, zoom2) => {
    if (one.text) one.fit.style.width = `${one.room.width / one.scale / zoom2}px`;
    one.fit.style.zoom = String(zoom2);
  };
  for (const one of shrunk) {
    if (!one.text) {
      one.fit.style.width = `${one.need.width / one.scale}px`;
      one.fit.style.alignSelf = "center";
    }
    put(one, one.zoom);
  }
  const over = /* @__PURE__ */ new Map();
  let round = shrunk;
  for (let pass3 = 0; pass3 < ROUNDS && round.length; pass3 += 1) {
    const heights = round.map((one) => one.fit.getBoundingClientRect().height);
    const next = [];
    round.forEach((one, at) => {
      const height = heights[at] ?? 0;
      const fits = height <= one.room.height + 0.5;
      if (fits) one.best = Math.max(one.best, one.zoom);
      else over.set(one.fit, Math.min(over.get(one.fit) ?? 1, one.zoom));
      if (fits && (!one.text || height >= one.room.height * 0.985 || one.zoom >= 1)) return;
      if (!one.text) one.zoom *= one.room.height / height;
      else {
        const high = over.get(one.fit);
        one.zoom = high === void 0 ? Math.min(1, one.zoom * Math.sqrt(one.room.height / height)) : (one.best + high) / 2;
        if (high !== void 0 && high - one.best < 4e-3) {
          one.zoom = one.best;
          put(one, one.zoom);
          return;
        }
      }
      next.push(one);
    });
    for (const one of next) put(one, one.zoom);
    round = next;
  }
  for (const one of round) {
    if (one.text) one.zoom = one.best;
    put(one, one.zoom);
  }
  for (const one of open) {
    roomed.set(one.fit, sizeOf(one.room));
    settled.set(one.fit, PENDING);
  }
}
var near = typeof IntersectionObserver === "undefined" ? void 0 : new IntersectionObserver((entries) => {
  for (const entry of entries) if (entry.isIntersecting) entry.target.arrive();
}, { rootMargin: "100% 0px" });
var KEYS = {
  "\u25A0": { name: "filled", drawn: "sds-slide__key sds-slide__key--filled" },
  "\u25A1": { name: "outlined", drawn: "sds-slide__key sds-slide__key--outlined" }
};
var key = (entry) => {
  const [mark = "", ...words] = entry.trim().split(" ");
  const plate = /^\[(.+)\]$/.exec(mark)?.[1];
  const square = KEYS[mark];
  const drawn2 = square ? html72`<span class="${square.drawn}" role="img" aria-label="${square.name}"></span>` : html72`<span class="sds-slide__key${plate ? " sds-slide__key--plate" : ""}">${plate ?? mark}</span>`;
  return html72`<span class="sds-slide__entry">${drawn2} ${words.join(" ")}</span>`;
};
var SdsSlide = class extends SdsElement {
  constructor() {
    super();
    /* What this slide watches, so it can let go of each. */
    this.watched = [];
    /* Near the window, so what it holds fits now and not later. */
    this.seen = false;
    /* The body, where it stood between the tags. A deck's slide holds the
       system's elements, which is markup or it is nothing. */
    this.taken = null;
    /* The slide does not open itself. It asks, and the deck that runs
       through it answers with the slide at the window's size. */
    this.open = () => {
      this.dispatchEvent(new CustomEvent("sds-slide-open", { bubbles: true, composed: true }));
    };
    /* A press anywhere on a slide that opens is a press on its button, as a
       press on a picture opens the picture. */
    this.onFrame = () => {
      if (this.zoomable) this.open();
    };
    this.kind = "content";
    this.ground = "paper";
    this.eyebrow = "";
    this.legend = "";
    this.heading = "";
    this.lead = "";
    this.note = "";
    this.number = "";
    this.signet = "";
    this.brand = "";
    this.product = "";
    this.plain = false;
    this.pageOnly = false;
    this.sections = [];
    this.current = 0;
    this.portrait = "";
    this.alt = "";
    this.src = "";
    this.drawings = [];
    this.layout = "wide";
    this.bleed = false;
    this.framed = false;
    this.body = "";
    this.fit = false;
    this.shrink = false;
    this.zoomable = false;
    this.zoom = 0;
  }
  static {
    this.regions = ["eyebrow", "heading", "lead", "note", "figure", "portrait"];
  }
  static {
    this.properties = {
      kind: { type: String, reflect: true },
      ground: { type: String, reflect: true },
      eyebrow: { type: String },
      heading: { type: String },
      lead: { type: String },
      legend: { type: String },
      note: { type: String },
      number: { type: String },
      signet: { type: String },
      brand: { type: String },
      product: { type: String },
      plain: { type: Boolean, reflect: true },
      pageOnly: { type: Boolean, reflect: true, attribute: "page-only" },
      sections: { type: Array },
      current: { type: Number },
      portrait: { type: String },
      alt: { type: String },
      src: { type: String },
      drawings: { type: Array },
      layout: { type: String, reflect: true },
      bleed: { type: Boolean, reflect: true },
      framed: { type: Boolean, reflect: true },
      body: { type: String },
      fit: { type: Boolean, reflect: true },
      shrink: { type: Boolean, reflect: true },
      zoomable: { type: Boolean, reflect: true },
      /** The zoom the last measurement settled on. Zero is "not measured". */
      zoom: { type: Number, state: true }
    };
  }
  connectedCallback() {
    const text2 = this.region(TEXT).map((one) => one.node);
    if (text2.length) this.taken = text2;
    super.connectedCallback();
    this.dispatchEvent(new Event("sds-slide-join", { bubbles: true }));
    this.watched = this.parentElement ? [this.parentElement] : [];
    for (const target of this.watched) watch2(target, this);
    placed.add(this);
    near?.observe(this);
    void this.updateComplete.then(() => {
      this.ask();
      for (const fit2 of this.querySelectorAll(".sds-slide__fit")) {
        this.watched.push(fit2);
        watch2(fit2, this);
      }
    });
  }
  /* A measurement in the next pass of every slide on the page. */
  ask() {
    waiting2.add(this);
    if (pass2) return;
    pass2 = 1;
    queueMicrotask(measureAll2);
  }
  /** The zoom the frame takes in its room. Reads only. */
  room() {
    return this.measure();
  }
  /** The zoom from the pass, and then what the slide holds. */
  take(zoom2) {
    this.zoom = zoom2;
    this.quiet();
    if (this.seen || this.fit || !near) this.queue();
  }
  /** Something the slide sits in or holds changed its size. The pass
      measures a box that changed anew, even in the room it had. */
  refit(target) {
    if (target instanceof HTMLElement && target.classList.contains("sds-slide__fit")) roomed.delete(target);
    this.ask();
  }
  /* What the slide holds, in the next pass of every slide that asks. */
  queue() {
    fitting.add(this);
    if (!fitPass) fitPass = requestAnimationFrame(fitAll);
  }
  /** The boxes of what the slide holds, each with its room. Reads only. A
      drawing that takes a new room draws first, and asks again once drawn. */
  boxes() {
    const drawing = this.lendRooms();
    if (drawing.length) {
      void Promise.all(drawing).then(() => this.isConnected && this.queue());
      return [];
    }
    return [...this.querySelectorAll(".sds-slide__fit")].flatMap((fit2) => {
      const body = fit2.parentElement;
      return body ? [{ fit: fit2, room: body.getBoundingClientRect(), text: !fit2.closest(".sds-slide__art") }] : [];
    });
  }
  /** The pass fitted what the slide holds. */
  fitted() {
    if (!this.hasAttribute("fitted")) this.toggleAttribute("fitted", true);
    this.quiet();
  }
  /** Near the window for the first time: what the slide holds fits now. */
  arrive() {
    if (this.seen) return;
    this.seen = true;
    near?.unobserve(this);
    void this.updateComplete.then(() => this.isConnected && this.queue());
  }
  disconnectedCallback() {
    for (const target of this.watched) unwatch(target, this);
    this.watched = [];
    placed.delete(this);
    near?.unobserve(this);
    waiting2.delete(this);
    fitting.delete(this);
    super.disconnectedCallback();
  }
  /* A deck lends the slide its stage and sets `fit` for the loan. */
  updated(changed) {
    if (changed.has("fit") && changed.get("fit") !== void 0 || changed.has("shrink") && changed.get("shrink") !== void 0) {
      this.ask();
      if (this.fit) this.queue();
    }
  }
  /* No stop for the keyboard inside the body. The pointer the stylesheet
     keeps out. The text stays, for a reader who hears the page. */
  quiet() {
    for (const stop of this.querySelectorAll(".sds-slide__fit :is(" + STOPS + ")")) stop.setAttribute("tabindex", "-1");
  }
  /* A figure slide lends a drawing from a text the room its layout leaves,
     a tenth larger than the frame's own pixels. A reader sees a slide from
     further away than a page. So the type stands near the slide's scale,
     not at 3/4 as in a column. */
  lendRooms() {
    const frame3 = this.firstElementChild;
    if (!frame3 || this.kind !== "figure") return [];
    const scale = frame3.getBoundingClientRect().width / parseFloat(getComputedStyle(frame3).getPropertyValue("--sds-slide-width"));
    if (!(scale > 0)) return [];
    const lent = [];
    for (const art2 of this.querySelectorAll(".sds-slide__art")) {
      const drawings = art2.querySelectorAll("sds-diagram:not([room])");
      const [one] = drawings;
      if (drawings.length !== 1 || !one) continue;
      const { width: width2, height } = art2.getBoundingClientRect();
      if (!(width2 > 0 && height > 0)) continue;
      lent.push({ one, width: Math.floor(width2 / scale * ROOM), height: Math.floor(height / scale * ROOM) });
    }
    if (lent.length && !engine.now) return [engine.load()];
    const grow = this.layout === "row" && lent.length > 1 ? Math.max(...lent.map(({ one, width: width2, height }) => Number((one.reach?.(`${width2},${height}`) ?? "").split(",")[0]) / width2 || 1)) : 1;
    const drawing = [];
    for (const { one, width: width2, height } of lent) {
      if (one.lend?.(`${Math.round(width2 * grow)},${Math.round(height * grow)}`) && one.updateComplete) drawing.push(one.updateComplete);
    }
    return drawing;
  }
  /** How far to scale the frame so it fits. The frame's size comes off the
      stylesheet, never a copy here. `--sds-slide-width` and its height are
      the set's, and a copy in TypeScript is the copy that goes stale. */
  measure() {
    if (!this.fit && (!this.shrink || SIZED)) return 0;
    const box2 = this.firstElementChild;
    if (!box2) return this.zoom;
    const style = getComputedStyle(box2);
    const width2 = parseFloat(style.getPropertyValue("--sds-slide-width"));
    const height = parseFloat(style.getPropertyValue("--sds-slide-height"));
    const stated = parseFloat(style.getPropertyValue("--sds-slide-zoom"));
    const parent = this.parentElement;
    if (!parent) return this.zoom;
    const rect2 = parent.getBoundingClientRect();
    const around = getComputedStyle(parent);
    const edges = parseFloat(around.borderLeftWidth) + parseFloat(around.borderRightWidth);
    const room = rect2.width - edges - parseFloat(around.paddingLeft) - parseFloat(around.paddingRight);
    if (!this.fit) {
      if (!(width2 > 0) || !(room > 0)) return this.zoom;
      return room / width2 < stated ? room / width2 : 0;
    }
    const pads = parseFloat(around.paddingTop) + parseFloat(around.paddingBottom);
    const inner = rect2.height - pads;
    const below = window.innerHeight - Math.max(0, rect2.top + parseFloat(around.paddingTop)) - parseFloat(around.paddingBottom);
    const tall = below > 0 ? Math.min(below, inner) : inner;
    if (!(width2 > 0) || !(height > 0) || !(room > 0)) return this.zoom;
    return tall > 0 ? Math.min(room / width2, tall / height) : room / width2;
  }
  /* The title's step follows the kind. The display step stands alone on a
     slide that says one thing. A content slide's title shares the frame
     with a body and takes the h2 step. Both are the page's own registers. */
  /* A line of the head: what its region holds, or the attribute. */
  line(name, said) {
    const [one] = this.region(name);
    return one ? one.inner : said;
  }
  head() {
    const eyebrow = this.region("eyebrow")[0]?.text || this.eyebrow;
    const heading = this.line("heading", this.heading);
    const lead = this.line("lead", this.lead);
    const note = this.line("note", this.note);
    if (!eyebrow && !heading && !lead) return nothing42;
    const display = this.kind !== "content" && this.kind !== "figure";
    return html72`<div class="sds-slide__head">
    ${eyebrow ? html72`<sds-eyebrow label="${eyebrow}"></sds-eyebrow>` : nothing42}
    ${heading ? display ? html72`<h1 class="sds-display">${heading}</h1>` : html72`<h2 class="sds-h2">${heading}</h2>` : nothing42}
    ${this.legend ? html72`<p class="sds-slide__legend">${this.legend.split(" | ").map((entry) => key(entry))}</p>` : nothing42}
    ${lead ? html72`<p class="sds-lead">${lead}</p>` : nothing42}
    ${note ? html72`<p class="sds-slide__note">${note}</p>` : nothing42}
  </div>`;
  }
  outline() {
    if (this.kind !== "section" || !this.sections.length) return nothing42;
    return html72`<ol class="sds-slide__nav">${this.sections.map(
      (label, i) => html72`<li class="sds-slide__nav-item${i === this.current ? " is-active" : ""}">${label}</li>`
    )}</ol>`;
  }
  /* One lockup, drawn where the kind puts it. The foot is the row every slide
     that carries a count has; a cover and a closing end on the mark alone. */
  foot() {
    const drawn2 = lockup({ signet: this.signet, brand: this.brand, product: this.product });
    if (this.kind === "cover" || this.kind === "closing") {
      return drawn2 && !this.plain ? html72`<div class="sds-slide__lockup">${drawn2}</div>` : nothing42;
    }
    if (!drawn2 && !this.number) return nothing42;
    const plain2 = this.plain || this.kind === "figure" && (this.layout === "full" || this.layout === "headed");
    const mark = drawn2 && plain2 ? html72`<span class="sds-slide__void" aria-hidden="true">${drawn2}</span>` : drawn2;
    return html72`<div class="sds-slide__foot">
    ${mark || html72`<span></span>`}
    ${this.number ? html72`<p class="sds-slide__count">${this.number}</p>` : nothing42}
  </div>`;
  }
  beside() {
    return this.kind === "figure" && this.layout === "text-start";
  }
  /* What the room holds: every drawing of a row, and one for the rest. The
     region between the tags first, then the property, then the file. */
  shown() {
    const slotted = this.region("figure");
    const all = slotted.length ? slotted.map((one) => this.fromSlot(one)) : this.drawings.length ? this.drawings : this.src ? [{ src: this.src, alt: this.alt }] : [];
    return this.layout === "row" ? all : all.slice(0, 1);
  }
  /* A `<figure slot="figure">` brings its word as `data-label` and its
     caption as `<figcaption>`. Any other child is the drawing alone. */
  fromSlot(one) {
    const figure = one.tag === "figure";
    const caption = figure ? one.children.find((child) => child.tag === "figcaption") : void 0;
    const parts2 = figure ? one.children.filter((child) => child !== caption) : [one];
    const lone = parts2.length === 1 ? parts2[0]?.node : void 0;
    if (typeof Element !== "undefined" && lone instanceof Element && lone.localName === "svg" && !lone.hasAttribute("preserveAspectRatio")) {
      lone.setAttribute("preserveAspectRatio", this.layout === "row" ? "xMidYMid meet" : "xMinYMin meet");
    }
    return { label: one.attrs["data-label"] ?? "", caption: caption?.text ?? "", content: html72`${parts2.map((part) => part.node)}` };
  }
  /* The room's content: the file as a picture, or markup in a box the
     element can shrink. A drawing alone in the box fills it instead. */
  art(one) {
    if (one.src) return html72`<sds-image src="${one.src}" alt="${one.alt ?? ""}"></sds-image>`;
    return html72`<div class="sds-slide__art"><div class="sds-slide__fit">${one.content ?? nothing42}</div></div>`;
  }
  /* A figure slide's drawings, in the room its layout leaves. */
  drawing() {
    const shown = this.kind === "figure" ? this.shown() : [];
    if (!shown.length) return nothing42;
    return html72`<div class="sds-slide__figure">${shown.map((one) => html72`<div class="sds-slide__drawing">
    ${one.label ? html72`<p class="sds-slide__word">${one.label}</p>` : nothing42}
    ${this.art(one)}
    ${one.caption ? html72`<p class="sds-slide__caption">${one.caption}</p>` : nothing42}
  </div>`)}</div>`;
  }
  /* The right column of a speaker slide: the portrait, edge to edge. */
  portraitColumn() {
    const own = this.region("portrait");
    if (own.length) return html72`<div class="sds-slide__portrait">${own.map((one) => one.node)}</div>`;
    return html72`<div class="sds-slide__portrait">${this.portrait ? html72`<sds-image src="${this.portrait}" alt="${this.alt}"></sds-image>` : nothing42}</div>`;
  }
  render() {
    const body = this.taken ?? this.content ?? this.body;
    const zoom2 = this.zoom > 0 ? `zoom:${this.zoom}` : nothing42;
    const text2 = html72`${this.head()}
  ${body ? html72`<div class="sds-slide__body"><div class="sds-slide__fit">${body}</div></div>` : nothing42}`;
    const page = this.beside() ? html72`<div class="sds-slide__text">${text2}</div>${this.drawing()}
  ${this.foot()}` : html72`${text2}${this.drawing()}
  ${this.outline()}${this.kind === "speaker" ? nothing42 : html72`
  ${this.foot()}`}`;
    const layout2 = this.kind === "figure" ? [LAYOUT[this.layout] ?? "", this.beside() && this.bleed ? "sds-slide--bleed" : "", this.framed ? "sds-slide--framed" : ""].filter(Boolean).join(" ") : "";
    return html72`<div class="sds-slide${KIND[this.kind] ? ` ${KIND[this.kind]}` : ""}${layout2 ? ` ${layout2}` : ""}" data-theme="${GROUND[this.ground] ?? GROUND.paper}" style="${zoom2}" @click="${this.onFrame}">
  ${this.kind === "speaker" ? html72`<div class="sds-slide__page">${page}</div>${this.portraitColumn()}
  ${this.foot()}` : page}
</div>${this.zoomable ? html72`<button class="sds-btn sds-btn--secondary sds-btn--sm sds-btn--icon sds-slide__zoom" type="button" title="Open the slide" data-theme="${GROUND[this.ground] ?? GROUND.paper}" @click="${this.open}"><sds-icon name="actions-fullscreen"></sds-icon></button>` : nothing42}`;
  }
};
define("sds-slide", SdsSlide);

// packages/frontend/src/components/deck.ts
import { html as html73, nothing as nothing43 } from "lit";
var BOOKENDS = /* @__PURE__ */ new Set(["cover", "closing"]);
var PLACED = /* @__PURE__ */ new Set(["content", "figure", "speaker", "statement", "closing"]);
function tell2(deck, slides) {
  const dividers = slides.filter((slide) => slide.kind === "section");
  const outline = JSON.stringify(dividers.map((slide) => slide.heading));
  const two = (n) => String(n).padStart(2, "0");
  let place3 = "";
  return slides.map((slide, i) => {
    const out = {};
    const give = (name, value) => {
      if (value && slide.kept(name) === null) out[name] = value;
    };
    const bookend = BOOKENDS.has(slide.kind);
    give("brand", deck.brand);
    give("product", deck.product);
    give("signet", bookend ? deck.signetLarge || deck.signet : deck.signet);
    if (deck.numbered && !bookend) give("number", two(i + 1));
    const at = dividers.indexOf(slide);
    if (at >= 0) {
      give("sections", outline);
      give("current", String(at));
      place3 = `${two(Number(slide.kept("current") ?? at) + 1)} \xB7 ${slide.heading}`;
    } else if (PLACED.has(slide.kind) && !slide.eyebrow) give("eyebrow", place3);
    return out;
  });
}
var STEP3 = { ArrowRight: 1, ArrowDown: 1, PageDown: 1, ArrowLeft: -1, ArrowUp: -1, PageUp: -1 };
var OWN = "a, button, input, select, textarea, summary, label, [contenteditable], pre, .sds-code";
var TURN = 0.15;
var REACH = 120;
var PICTURES = 6;
var LIVE = /* @__PURE__ */ new Set(["a", "button", "input", "select", "textarea", "summary", "details", "label", "iframe", "video", "audio", "dialog"]);
function picture(frame3, { sized = false } = {}) {
  const copy = frame3.cloneNode(true);
  if (!sized) copy.style.removeProperty("zoom");
  const from = [...frame3.querySelectorAll("*")];
  const to = [...copy.querySelectorAll("*")];
  for (let i = to.length - 1; i >= 0; i -= 1) {
    const el = to[i];
    for (const name of ["id", "tabindex", "name", "for", "href"]) el.removeAttribute(name);
    if (el.namespaceURI !== "http://www.w3.org/1999/xhtml") continue;
    if (el.localName.includes("-")) {
      el.replaceWith(...el.childNodes);
      continue;
    }
    if (!LIVE.has(el.localName)) continue;
    const plain2 = document.createElement("span");
    for (const { name, value } of [...el.attributes]) plain2.setAttribute(name, value);
    plain2.style.display = getComputedStyle(from[i]).display;
    plain2.append(...el.childNodes);
    el.replaceWith(plain2);
  }
  return copy;
}
function titleOf(slide, index) {
  const words = (slide.querySelector(".sds-slide__body")?.textContent ?? "").replace(/\s+/g, " ").trim();
  const drawn2 = (slide.querySelector(".sds-slide__head :is(h1, h2)")?.textContent ?? "").trim();
  return slide.heading || drawn2 || slide.eyebrow || words || `Slide ${index + 1}`;
}
var SdsDeck = class extends SdsElement {
  constructor() {
    super();
    /** The slides written between the tags, if any. */
    this.own = [];
    this.slides = [];
    /** The slides whose picture the list already holds. */
    /** The picture each entry of the list holds, by the slide it shows. A
        deck that opens again keeps those whose slide stands in the same place. */
    this.drawn = /* @__PURE__ */ new Map();
    this.drawing = 0;
    /** The pushes still under way, each with its last-resort end. */
    this.pushing = /* @__PURE__ */ new Set();
    /** A furnish asked, for the next microtask. */
    this.asked = false;
    /* What the deck set on each slide, so it can set it again. */
    this.given = /* @__PURE__ */ new WeakMap();
    /** The slide to come back to after a print, if the deck was open. */
    this.resume = -1;
    /** A drag just ended, so the click the pointer sends after it is no press. */
    this.dragged = false;
    /* A slide the deck lends to its stage leaves the page and comes back:
       that is no new order, so an open deck counts nothing. Many slides join
       in one task, and the deck furnishes once for all of them. */
    this.onJoin = (event) => {
      const root = this.from ? document.getElementById(this.from) : document.body;
      if (this.open || this.asked || !root?.contains(event.target)) return;
      this.asked = true;
      queueMicrotask(() => {
        this.asked = false;
        if (this.isConnected && !this.open) this.furnish();
      });
    };
    this.onCommand = (event) => {
      const command = event.detail?.command ?? "show";
      if (command === "close") this.close();
      else if (command === "toggle") this.open ? this.close() : this.show();
      else this.show();
    };
    /* A press on a slide of the page opens the deck at that slide. */
    this.onAsk = (event) => {
      if (this.own.length || this.open) return;
      const at = this.collect().indexOf(event.target);
      if (at >= 0) this.show(at);
    };
    /* The number a reader types into the count, or types blind and ends with
       Enter: the deck goes to that slide. */
    this.onGoto = (event) => {
      if (event instanceof KeyboardEvent && event.key !== "Enter") return;
      const input = event.target;
      const number = Number.parseInt(input.value, 10);
      if (Number.isFinite(number)) this.go(Math.min(Math.max(number, 1), this.slides.length) - 1);
      input.value = String(this.at + 1);
      event.preventDefault();
    };
    this.typed = "";
    this.typedAt = 0;
    this.onKey = (event) => {
      if (!this.open || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (target?.closest?.(".sds-deck__stage, input")) return;
      if (/^[0-9]$/.test(event.key)) {
        this.typed = (event.timeStamp - this.typedAt < 1500 ? this.typed : "") + event.key;
        this.typedAt = event.timeStamp;
        event.preventDefault();
        return;
      }
      if (event.key === "Enter" && this.typed && event.timeStamp - this.typedAt < 1500) {
        this.go(Math.min(Math.max(Number(this.typed), 1), this.slides.length) - 1);
        this.typed = "";
        event.preventDefault();
        return;
      }
      const step = STEP3[event.key];
      if (event.key === "Home") this.go(0);
      else if (event.key === "End") this.go(this.slides.length - 1);
      else if (event.key === "f" || event.key === "F") this.fullscreen();
      else if (step) this.go(this.at + step);
      else return;
      event.preventDefault();
    };
    /* A finger or a pointer drags the slide. Past a part of the stage it
       turns, short of that it goes back. At either end of the deck it gives
       a third of the way, so the reader feels the end rather than hits it. */
    this.onDown = (event) => {
      if (event.button !== 0 || !this.slides.length) return;
      if (event.target?.closest?.(OWN)) return;
      this.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, moved: false };
    };
    this.onMove = (event) => {
      const drag = this.drag;
      const stage = this.stage;
      if (!drag || !stage || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved) {
        if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) this.drag = void 0;
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
        drag.moved = true;
        try {
          stage.setPointerCapture(event.pointerId);
        } catch {
        }
        stage.classList.add("is-dragging");
      }
      const end = dx > 0 && this.at === 0 || dx < 0 && this.at === this.slides.length - 1;
      drag.dx = dx;
      stage.style.setProperty("--sds-deck-drag", `${end ? dx / 3 : dx}px`);
    };
    this.onUp = (event) => {
      const drag = this.drag;
      const stage = this.stage;
      if (!drag || event.pointerId !== drag.id) return;
      this.drag = void 0;
      if (!drag.moved || !stage) return;
      this.dragged = true;
      setTimeout(() => {
        this.dragged = false;
      });
      stage.classList.remove("is-dragging");
      stage.style.removeProperty("--sds-deck-drag");
      if (event.type === "pointercancel") return;
      if (Math.abs(drag.dx) > Math.min(REACH, stage.clientWidth * TURN)) this.go(this.at + (drag.dx < 0 ? 1 : -1), { from: drag.dx });
    };
    /* On the whole screen a press on the slide turns it. Not on a link or a
       control, and not the press a drag ends in. */
    this.onStageClick = (event) => {
      if (this.dragged) {
        this.dragged = false;
        return;
      }
      if (!this.full || event.target?.closest?.(OWN)) return;
      this.go(this.at + 1);
    };
    /* The slide goes back first, then the page scrolls to it. The reader
       leaves the deck where the slide stands, or at the cover it played from. */
    this.onClose = () => {
      this.keys?.abort();
      const slide = this.giveBack();
      this.open = false;
      if (this.resume >= 0) return;
      const back = this.own.length ? this.querySelector(".sds-deck__poster") : slide;
      back?.scrollIntoView({ block: "nearest" });
    };
    this.label = "Slides";
    this.from = "";
    this.open = false;
    this.at = 0;
    this.titles = [];
    this.listed = false;
    this.full = false;
    this.brand = "";
    this.product = "";
    this.signet = "";
    this.signetLarge = "";
    this.numbered = false;
  }
  static {
    this.properties = {
      label: { type: String },
      from: { type: String },
      open: { type: Boolean, reflect: true },
      at: { type: Number, state: true },
      titles: { type: Array, state: true },
      listed: { type: Boolean, state: true },
      full: { type: Boolean, state: true },
      brand: { type: String },
      product: { type: String },
      signet: { type: String },
      signetLarge: { type: String, attribute: "signet-large" },
      numbered: { type: Boolean }
    };
  }
  get dialog() {
    return this.querySelector("dialog");
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => !isBlank(node));
    if (written2.length) this.own = written2.filter((node) => node.localName === "sds-slide");
    super.connectedCallback();
    this.addEventListener("sds-command", this.onCommand);
    this.asks = new AbortController();
    document.addEventListener("sds-slide-open", this.onAsk, { signal: this.asks.signal });
    this.furnish();
    if (!this.own.length) document.addEventListener("sds-slide-join", this.onJoin, { signal: this.asks.signal });
  }
  /* What the deck says to the slides of the page, and the press on each. */
  furnish() {
    const slides = this.collect();
    this.hand(slides);
    if (!this.own.length) {
      for (const slide of slides) if (!slide.hasAttribute("zoomable")) slide.setAttribute("zoomable", "");
    }
  }
  /* What the deck says once, given to every slide that does not say it. An
     attribute, because a slide can still wait for its upgrade, and a value
     set on it then outweighs the attribute its author wrote. The count, the
     outline and the place in it come from the order: nobody keeps them by hand.
     A value the deck gave, it gives again when the order changes. */
  hand(slides) {
    const said = slides.map((slide) => ({
      kind: slide.getAttribute("kind") || "content",
      heading: slide.getAttribute("heading") ?? "",
      kept: (name) => {
        const value = slide.getAttribute(name);
        return value && value !== "[]" && value !== this.given.get(slide)?.[name] ? value : null;
      },
      eyebrow: Boolean(slide.querySelector(':scope > [slot="eyebrow"], :scope > .sds-slide > .sds-slide__head > sds-eyebrow'))
    }));
    tell2(this, said).forEach((given, i) => {
      const slide = slides[i];
      if (!slide.hasAttribute("shrink")) slide.setAttribute("shrink", "");
      for (const [name, value] of Object.entries(given)) if (slide.getAttribute(name) !== value) slide.setAttribute(name, value);
      this.given.set(slide, { ...this.given.get(slide), ...given });
    });
  }
  disconnectedCallback() {
    this.removeEventListener("sds-command", this.onCommand);
    this.keys?.abort();
    this.asks?.abort();
    cancelAnimationFrame(this.drawing);
    for (const timer of this.pushing) clearTimeout(timer);
    this.pushing.clear();
    this.#release?.();
    this.#release = void 0;
    this.giveBack();
    super.disconnectedCallback();
  }
  /* The slides between the tags go where the poster draws them, once. Lit
     leaves a node alone that no binding placed, so a loan survives a render. */
  firstUpdated() {
    const [cover, ...rest] = this.own;
    if (cover) this.querySelector(".sds-deck__cover")?.append(cover);
    this.querySelector(".sds-deck__rest")?.append(...rest);
  }
  /** The slides in the order the page has them, read at every opening. A
      page that grew a slide since the last one has it in the deck. A slide
      of another deck belongs to that one. */
  collect() {
    if (this.own.length) return this.own;
    const root = this.from ? document.getElementById(this.from) : document;
    if (!root) return [];
    return [...root.querySelectorAll("sds-slide:not([page-only])")].filter((slide) => !slide.closest("sds-deck"));
  }
  show(at = 0) {
    this.slides = this.collect();
    this.titles = this.slides.map(titleOf);
    for (const [index, slide] of this.drawn) if (this.slides[index] !== slide) this.drawn.delete(index);
    this.open = true;
    void this.updateComplete.then(() => {
      const el = this.dialog;
      if (el && !el.open) el.showModal();
      this.listen();
      requestAnimationFrame(() => {
        if (!this.open) return;
        this.go(at);
        if (this.listed) this.drawAll();
      });
    });
  }
  close() {
    if (document.fullscreenElement && document.fullscreenElement === this.screen) void document.exitFullscreen();
    this.dialog?.close();
  }
  /* What goes to the full screen. Not the dialog: the platform refuses a
     `<dialog>` there. The box inside it carries all it shows. */
  get screen() {
    return this.querySelector(".sds-deck__screen");
  }
  /** The deck on the whole screen, or back in the window. The head steps
      aside until the pointer asks for it, and a press on the slide turns it,
      as a room expects of a deck. */
  fullscreen() {
    const el = this.screen;
    if (!el) return;
    if (document.fullscreenElement === el) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => void 0);
  }
  /** Show slide `index`, counted from zero. Past either end it stays. The
      slide on the stage goes out the way the deck moves, and the next one
      comes in behind it. `from` is where a drag let go of the slide. */
  go(index, { from = 0 } = {}) {
    if (!this.slides.length) return;
    const to = Math.min(Math.max(index, 0), this.slides.length - 1);
    if (to === this.at && this.loan) return;
    const stage = this.stage;
    const frame3 = this.loan?.slide.querySelector(":scope > .sds-slide");
    const way = Math.sign(to - this.at);
    const moves = Boolean(stage && frame3 && way) && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width2 = stage?.clientWidth ?? 0;
    const ghost = moves && stage && frame3 ? this.ghost(frame3, stage) : void 0;
    this.lend(to);
    if (ghost && stage) this.push(stage, ghost, way, from, width2);
    void this.updateComplete.then(() => this.follow());
  }
  /* The slide that leaves, as a picture where it stands, so the slide the
     deck lends next can take the stage at once. A push still under way
     ends here: the next one starts from where the slides are. */
  ghost(frame3, stage) {
    for (const old of stage.querySelectorAll(".sds-deck__ghost")) old.remove();
    const box2 = frame3.getBoundingClientRect();
    const room = stage.getBoundingClientRect();
    const ghost = document.createElement("div");
    ghost.className = "sds-deck__ghost";
    ghost.setAttribute("aria-hidden", "true");
    ghost.inert = true;
    ghost.style.insetInlineStart = `${box2.left - room.left}px`;
    ghost.style.insetBlockStart = `${box2.top - room.top}px`;
    ghost.style.inlineSize = `${box2.width}px`;
    ghost.style.blockSize = `${box2.height}px`;
    ghost.append(picture(frame3, { sized: true }));
    stage.append(ghost);
    return ghost;
  }
  /* Both slides move one stage width, side by side: the old one out, the
     new one in from where the old one goes next. The new one starts with
     no transition, the stylesheet runs the rest. */
  push(stage, ghost, way, from, width2) {
    stage.classList.add("is-placing");
    stage.style.setProperty("--sds-deck-drag", `${from + way * width2}px`);
    void stage.offsetWidth;
    stage.classList.remove("is-placing");
    stage.style.removeProperty("--sds-deck-drag");
    ghost.style.translate = `${-way * width2 - from}px 0`;
    const timer = window.setTimeout(() => gone(), 1e3);
    const gone = () => {
      ghost.remove();
      clearTimeout(timer);
      this.pushing.delete(timer);
    };
    this.pushing.add(timer);
    ghost.addEventListener("transitionend", gone, { once: true });
  }
  /* The picture of one slide for the list, while the slide still stands
     where the page drew it, fitted to its column. So a slide takes its
     picture before its loan, and the stage never sits for one. */
  draw(index) {
    const slide = this.slides[index];
    if (!slide || this.drawn.get(index) === slide || this.loan?.slide === slide) return;
    const frame3 = slide.querySelector(":scope > .sds-slide");
    const box2 = this.querySelectorAll(".sds-deck__thumb")[index];
    if (!frame3 || !box2) return;
    box2.replaceChildren(picture(frame3));
    this.drawn.set(index, slide);
  }
  /* The pictures the list shows, a few in each frame from the current one
     on. A deck opens at once, and a long one never stops the page. */
  drawAll() {
    cancelAnimationFrame(this.drawing);
    const order = this.slides.map((_, i) => i).sort((a, b) => Math.abs(a - this.at) - Math.abs(b - this.at));
    const next = () => {
      if (!this.open || !this.listed) return;
      const left = order.filter((i) => this.drawn.get(i) !== this.slides[i]);
      for (const i of left.slice(0, PICTURES)) this.draw(i);
      if (left.length > PICTURES) this.drawing = requestAnimationFrame(next);
    };
    next();
  }
  /* The slide leaves the page for the stage, and a box of its height holds
     its place. So the page under the backdrop does not move, and the reader
     comes back to the scroll they left. */
  lend(index) {
    const slide = this.slides[index];
    const stage = this.querySelector(".sds-deck__stage");
    if (!slide || !stage) return;
    this.giveBack();
    this.draw(index);
    const hold2 = document.createElement("div");
    hold2.className = "sds-deck__hold";
    hold2.style.height = `${slide.getBoundingClientRect().height}px`;
    slide.replaceWith(hold2);
    this.loan = { slide, hold: hold2, fit: slide.fit, zoomable: slide.zoomable };
    slide.fit = true;
    slide.zoomable = false;
    stage.append(slide);
    this.at = index;
  }
  giveBack() {
    const loan = this.loan;
    if (!loan) return void 0;
    this.loan = void 0;
    loan.slide.fit = loan.fit;
    loan.slide.zoomable = loan.zoomable;
    loan.hold.replaceWith(loan.slide);
    return loan.slide;
  }
  /* The current entry stays in view in the list. Its own `scrollTop`, never
     `scrollIntoView`, which also moves the page under the backdrop. */
  follow() {
    const list = this.querySelector(".sds-deck__nav");
    const row2 = list?.querySelector(".sds-deck__entry.is-active");
    if (!list || !row2 || list.hidden) return;
    if (row2.offsetTop < list.scrollTop) list.scrollTop = row2.offsetTop;
    else if (row2.offsetTop + row2.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = row2.offsetTop + row2.offsetHeight - list.clientHeight;
    }
  }
  /* On the document, not the dialog: a press that disables the last button
     leaves the focus on no element inside it. */
  listen() {
    this.keys?.abort();
    this.keys = new AbortController();
    document.addEventListener("keydown", this.onKey, { signal: this.keys.signal });
    document.addEventListener(
      "fullscreenchange",
      () => {
        this.full = Boolean(document.fullscreenElement) && document.fullscreenElement === this.screen;
        if (this.full) this.screen?.focus();
      },
      { signal: this.keys.signal }
    );
  }
  /** Every slide on a page of its own, and the browser's print. Its dialog
      saves a PDF: text stays text, and a link stays a link. The slides go
      back when the print is over. */
  print() {
    this.resume = this.open ? this.at : -1;
    this.giveBack();
    if (this.open) this.close();
    const sheet = document.createElement("div");
    sheet.className = "sds-deck__print";
    document.body.append(sheet);
    const loans = this.collect().map((slide) => {
      const hold2 = document.createElement("div");
      hold2.className = "sds-deck__hold";
      slide.replaceWith(hold2);
      const loan = { slide, hold: hold2, fit: slide.fit, zoomable: slide.zoomable };
      slide.fit = false;
      slide.zoomable = false;
      sheet.append(slide);
      return loan;
    });
    document.documentElement.setAttribute("data-sds-deck-print", "");
    let done = false;
    const restore = () => {
      if (done) return;
      done = true;
      document.documentElement.removeAttribute("data-sds-deck-print");
      for (const loan of loans) {
        loan.slide.fit = loan.fit;
        loan.slide.zoomable = loan.zoomable;
        loan.hold.replaceWith(loan.slide);
      }
      sheet.remove();
      const at = this.resume;
      this.resume = -1;
      if (at >= 0) this.show(at);
    };
    window.addEventListener("afterprint", restore, { once: true });
    requestAnimationFrame(
      () => requestAnimationFrame(() => {
        window.print();
        restore();
      })
    );
  }
  get stage() {
    return this.querySelector(".sds-deck__stage");
  }
  /* The page stays still under an open deck. */
  #release;
  updated(changed) {
    if (this.open && this.isConnected) this.#release ??= hold("deck");
    else if (this.#release) {
      this.#release();
      this.#release = void 0;
    }
    if (changed.has("listed") && this.listed && this.open) this.drawAll();
    const el = this.dialog;
    if (!el || !this.isConnected) return;
    if (!this.open && el.open) el.close();
  }
  /* The cover as the page shows it, and the press over it. The rest of the
     deck takes the cover's width out of sight, because a slide fits itself
     to the room it has. */
  poster() {
    if (!this.own.length) return nothing43;
    return html73`<div class="sds-deck__poster">
  <div class="sds-deck__cover" @click="${() => this.show(0)}"></div>
  <div class="sds-deck__presses">
    <button class="sds-btn sds-btn--secondary sds-btn--icon" type="button" title="Save as PDF" @click="${() => this.print()}"><sds-icon name="actions-file-pdf"></sds-icon></button>
    <button class="sds-btn sds-btn--primary sds-deck__play" type="button" @click="${() => this.show(0)}"><sds-icon name="actions-play"></sds-icon>Play the deck · ${this.own.length} slides</button>
  </div>
  <div class="sds-deck__rest"></div>
</div>`;
  }
  /* A list that stands over the stage, on a narrow screen, gives the stage
     back once the reader has chosen. The stylesheet says which it is. */
  pick(index) {
    this.go(index);
    const nav = this.querySelector(".sds-deck__nav");
    if (nav && getComputedStyle(nav).position === "absolute") this.listed = false;
  }
  list() {
    return html73`<nav class="sds-deck__nav" aria-label="All slides" ?hidden="${!this.listed}">
  <ol class="sds-deck__list">${this.titles.map((title, i) => html73`<li>
    <button class="${i === this.at ? "sds-deck__entry is-active" : "sds-deck__entry"}" type="button" aria-current="${i === this.at ? "true" : nothing43}" @click="${() => this.pick(i)}">
      <span class="sds-deck__thumb" aria-hidden="true" inert></span>
      <span class="sds-deck__entry-line">
        <span class="sds-deck__entry-count">${String(i + 1).padStart(2, "0")}</span>
        <span class="sds-deck__entry-title">${title}</span>
      </span>
    </button>
  </li>`)}</ol>
</nav>`;
  }
  render() {
    const total = this.titles.length;
    const count = total ? `${this.at + 1} / ${total}` : "";
    const through = `--sds-deck-through: ${total ? (this.at + 1) / total : 0}`;
    return html73`${this.poster()}<dialog class="${this.full ? "sds-deck is-full" : "sds-deck"}" aria-label="${this.label}" @close="${this.onClose}">
  <div class="sds-deck__screen" tabindex="-1">
  <div class="sds-modal__head">
    <div class="sds-deck__start">
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" type="button" title="${this.listed ? "Hide the slides" : "Show all slides"}" aria-expanded="${this.listed ? "true" : "false"}" @click="${() => {
      this.listed = !this.listed;
      void this.updateComplete.then(() => this.follow());
    }}"><sds-icon name="actions-list"></sds-icon></button>
      <span class="sds-modal__title">${this.label}</span>
    </div>
    <div class="sds-deck__controls">
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" type="button" title="Previous slide (←)" ?disabled="${this.at <= 0}" @click="${() => this.go(this.at - 1)}"><sds-icon name="actions-arrow-left"></sds-icon></button>
      <p class="sds-deck__count" aria-live="polite">${total ? html73`<input class="sds-deck__goto" type="text" inputmode="numeric" aria-label="Go to slide, of ${total}" .value="${String(this.at + 1)}" size="${String(total).length}" @keydown="${this.onGoto}" @change="${this.onGoto}" @blur="${(event) => event.target.value = String(this.at + 1)}" /><span> / ${total}</span>` : count}</p>
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" type="button" title="Next slide (→)" ?disabled="${this.at >= total - 1}" @click="${() => this.go(this.at + 1)}"><sds-icon name="actions-arrow-right"></sds-icon></button>
    </div>
    <div class="sds-deck__end">
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" type="button" title="Save as PDF" @click="${() => this.print()}"><sds-icon name="actions-file-pdf"></sds-icon></button>
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" type="button" title="${this.full ? "Leave the full screen (F)" : "Full screen (F)"}" aria-pressed="${this.full ? "true" : "false"}" @click="${() => this.fullscreen()}"><sds-icon name="actions-fullscreen"></sds-icon></button>
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon sds-modal__close" type="button" title="Close (Esc)" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
    </div>
  </div>
  <div class="sds-deck__progress" aria-hidden="true"><span style="${through}"></span></div>
  <div class="sds-deck__main">
    ${this.list()}
    <div
      class="sds-deck__stage"
      @pointerdown="${this.onDown}"
      @pointermove="${this.onMove}"
      @pointerup="${this.onUp}"
      @pointercancel="${this.onUp}"
      @dragstart="${(event) => event.preventDefault()}"
      @click="${this.onStageClick}"
    ></div>
  </div>
  </div>
</dialog>`;
  }
};
define("sds-deck", SdsDeck);

// packages/frontend/src/components/facts.ts
import { html as html74, nothing as nothing44 } from "lit";
var SdsFacts = class extends SdsElement {
  constructor() {
    super();
    /* What a caller wrote between the tags, taken before Lit renders over it —
       see `SdsElement.lifted()` for why the question comes exactly once. */
    this.taken = null;
    this.entries = [];
  }
  static {
    this.properties = {
      entries: { type: Array }
    };
  }
  connectedCallback() {
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    const pairs = this.entries.map(
      ({ term, value, note }) => html74`<dt>${term}</dt>
  <dd>${value}${note ? html74`<span class="sds-facts__note">${note}</span>` : nothing44}</dd>`
    );
    return html74`<dl class="sds-facts">
  ${this.taken ?? this.content ?? pairs}
</dl>`;
  }
};
define("sds-facts", SdsFacts);

// packages/frontend/src/components/entry.ts
import { html as html75, nothing as nothing45 } from "lit";
var SdsEntry = class extends SdsElement {
  constructor() {
    super();
    /* What a caller wrote between the tags, taken before Lit renders over it —
       see `SdsElement.lifted()` for why the question comes exactly once. */
    this.taken = null;
    this.number = "";
    this.prefix = "";
    this.heading = "";
    this.label = "";
    this.tone = "default";
    this.group = "";
    this.origin = "";
    this.anchor = "";
    this.todo = "";
    this.todoPrefix = "";
    this.body = "";
  }
  static {
    this.properties = {
      number: { type: String },
      prefix: { type: String },
      heading: { type: String },
      label: { type: String },
      tone: { type: String },
      group: { type: String },
      origin: { type: String },
      anchor: { type: String },
      todo: { type: String },
      todoPrefix: { type: String, attribute: "todo-prefix" },
      body: { type: String }
    };
  }
  connectedCallback() {
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  render() {
    return html75`<article class="sds-entry" id="${this.anchor || nothing45}">
  <span class="sds-entry__number">${this.number ? `${this.prefix}${this.number}` : ""}</span>
  <h3 class="sds-entry__title">${this.heading}</h3>
  ${this.label || this.origin ? html75`<div class="sds-entry__meta">
    ${this.label ? html75`<sds-badge label="${this.label}" tone="${this.tone}"></sds-badge>` : nothing45}
    ${this.origin ? html75`<span class="sds-entry__origin">${this.origin}</span>` : nothing45}
  </div>` : nothing45}
  <div class="sds-entry__body">${this.taken ?? this.content ?? this.body}</div>
  ${this.todo ? html75`<p class="sds-entry__todo"><span class="sds-entry__number">${this.number ? `${this.todoPrefix}${this.number}` : ""}</span>${this.todo}</p>` : nothing45}
</article>`;
  }
};
define("sds-entry", SdsEntry);

// packages/frontend/src/components/register.ts
import { html as html76, nothing as nothing46 } from "lit";
import { unsafeHTML as unsafeHTML6 } from "lit/directives/unsafe-html.js";
var FINDING_GROUPS = [
  { key: "blocks", heading: "Blocks submission", label: "blocks", tone: "error" },
  { key: "back", heading: "Sent back", label: "sent back", tone: "warn" },
  { key: "change", heading: "Worth a change", label: "worth a change", tone: "default" },
  { key: "ok", heading: "Checked and correct", label: "checked", tone: "ok" }
];
var SdsRegister = class extends SdsElement {
  constructor() {
    super();
    /* The entries written between the tags, taken before Lit renders over
       them. Elements, which the register moves into their groups. */
    this.taken = null;
    this.entries = [];
    this.groups = [];
    this.name = "register";
    this.prefix = "";
    this.todoPrefix = "";
  }
  static {
    this.properties = {
      entries: { type: Array },
      groups: { type: Array },
      name: { type: String },
      prefix: { type: String },
      todoPrefix: { type: String, attribute: "todo-prefix" }
    };
  }
  connectedCallback() {
    const written2 = this.lifted().filter((node) => node.nodeType === 1);
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  anchorFor(number) {
    return `${this.name}-${number.replace(".", "-")}`;
  }
  /** The attributes an entry gets from its place, for a form that carries
      them as attributes. */
  facts(placed2, group) {
    return {
      number: placed2.number,
      anchor: placed2.anchor,
      prefix: this.prefix,
      "todo-prefix": this.todoPrefix,
      label: group?.label ?? "",
      tone: group?.tone ?? "default"
    };
  }
  /* From elements in a browser. Attributes rather than properties: a child
     has not always upgraded when its parent renders. The place goes back as
     attributes for the same reason. */
  fromElements(elements) {
    return elements.filter((el) => el.tagName.toLowerCase() === "sds-entry").map((el) => ({
      heading: el.getAttribute("heading") ?? "",
      group: el.getAttribute("group") ?? "",
      origin: el.getAttribute("origin") ?? "",
      todo: el.getAttribute("todo") ?? "",
      anchor: el.getAttribute("anchor") ?? "",
      render: (placed2, group) => {
        for (const [key2, value] of Object.entries(this.facts(placed2, group))) el.setAttribute(key2, value);
        return el;
      }
    }));
  }
  /* From the property, where a static render has no children. */
  fromEntries(entries) {
    return entries.map((e) => ({
      heading: e.heading,
      group: e.group ?? "",
      origin: e.origin ?? "",
      todo: e.todo ?? "",
      anchor: e.anchor ?? "",
      render: (placed2, group) => {
        const f = this.facts(placed2, group);
        return html76`<sds-entry number="${f["number"]}" prefix="${f["prefix"]}" todo-prefix="${f["todo-prefix"]}" label="${f["label"]}" tone="${f["tone"]}" heading="${e.heading}" group="${e.group ?? ""}" origin="${e.origin ?? ""}" anchor="${f["anchor"]}" todo="${e.todo ?? ""}" .body="${e.body ?? ""}"></sds-entry>`;
      }
    }));
  }
  /* From the markup as the author wrote it, under a prerender. Each entry's
     facts stand on its tag, and its content between them. The register
     renders each entry itself, once, with the place it gives it. */
  fromMarkup(markup) {
    return [...markup.matchAll(/<sds-entry\b([^>]*)>([\s\S]*?)<\/sds-entry>/g)].map(([, tag = "", inner = ""]) => {
      const facts2 = facts(tag);
      return {
        heading: facts2["heading"] ?? "",
        group: facts2["group"] ?? "",
        origin: facts2["origin"] ?? "",
        todo: facts2["todo"] ?? "",
        anchor: facts2["anchor"] ?? "",
        render: (placed2, group) => {
          const f = this.facts(placed2, group);
          return html76`<sds-entry number="${f["number"]}" prefix="${f["prefix"]}" todo-prefix="${f["todo-prefix"]}" label="${f["label"]}" tone="${f["tone"]}" heading="${facts2["heading"] ?? ""}" group="${facts2["group"] ?? ""}" origin="${facts2["origin"] ?? ""}" anchor="${f["anchor"]}" todo="${facts2["todo"] ?? ""}" .content="${html76`${unsafeHTML6(inner)}`}"></sds-entry>`;
        }
      };
    });
  }
  get read() {
    if (this.taken) return this.fromElements(this.taken);
    if (this.entries.length) return this.fromEntries(this.entries);
    return this.authored ? this.fromMarkup(this.authored) : [];
  }
  /** Every entry with its place. Grouped, an entry is its group's place
      and its own; an entry whose group the register does not name stands
      last, in the order written. Ungrouped, the entries count up. */
  get placed() {
    const read2 = this.read;
    const place3 = (entries, group, at) => entries.map((e, i) => {
      const number = group ? `${at}.${i + 1}` : `${i + 1}`;
      const anchor = e.anchor || this.anchorFor(number);
      const placed2 = { number, anchor, heading: e.heading, group, origin: e.origin, todo: e.todo };
      return { ...placed2, out: e.render(placed2, group) };
    });
    if (!this.groups.length) return place3(read2, null, 0);
    const known = new Set(this.groups.map((g) => g.key));
    return [
      ...this.groups.flatMap((group, i) => place3(read2.filter((e) => e.group === group.key), group, i + 1)),
      ...place3(read2.filter((e) => !known.has(e.group)), null, 0)
    ];
  }
  badge(group) {
    return group?.label ? html76`<sds-badge label="${group.label}" tone="${group.tone ?? "default"}"></sds-badge>` : "";
  }
  get columns() {
    return [
      { head: "", cls: "sds-td-meta", fit: true },
      { head: "Entry" },
      ...this.groups.length ? [{ head: "Kind", fit: true }] : [],
      { head: "Origin" }
    ];
  }
  row(entry) {
    const cells3 = [
      `${this.prefix}${entry.number}`,
      html76`<a href="#${entry.anchor}">${entry.heading}</a>`
    ];
    if (this.groups.length) cells3.push(this.badge(entry.group));
    cells3.push(entry.origin || "\u2014");
    return { cells: cells3 };
  }
  get todoColumns() {
    return [
      { head: "", cls: "sds-td-meta", fit: true },
      { head: "To do" },
      ...this.groups.length ? [{ head: "Kind", fit: true }] : []
    ];
  }
  /** The work an entry asks for, numbered as the entry is, with the prefix
      that tells the two apart. The number is the way back to the entry. */
  todoRow(entry) {
    const cells3 = [
      html76`<a href="#${entry.anchor}">${this.todoPrefix}${entry.number}</a>`,
      entry.todo
    ];
    if (this.groups.length) cells3.push(this.badge(entry.group));
    return { cells: cells3 };
  }
  render() {
    const placed2 = this.placed;
    const todos = placed2.filter((e) => e.todo);
    const groups = this.groups.length ? [...this.groups, null] : [null];
    return html76`<div class="sds-register">
  <sds-table density="compact" scrollable .columns="${this.columns}" .rows="${placed2.map((e) => this.row(e))}"></sds-table>
  ${todos.length ? html76`<section class="sds-section" id="${this.name}-todo">
    <h3>To do</h3>
    <sds-table density="compact" scrollable .columns="${this.todoColumns}" .rows="${todos.map((e) => this.todoRow(e))}"></sds-table>
  </section>` : nothing46}
  ${groups.map((group) => {
      const own = placed2.filter((e) => e.group === group);
      if (!own.length) return nothing46;
      return group ? html76`<section class="sds-section" id="${this.name}-${group.key}">
    <h3>${group.heading}</h3>
    ${own.map((e) => e.out)}
  </section>` : html76`<div class="sds-register__entries">${own.map((e) => e.out)}</div>`;
    })}
</div>`;
  }
};
define("sds-register", SdsRegister);

// packages/frontend/src/components/confval.ts
import { html as html77, nothing as nothing47 } from "lit";
var SdsConfval = class extends SdsElement {
  constructor() {
    super();
    /* What a caller wrote between the tags — see `SdsElement.lifted()`. */
    this.taken = null;
    this.name = "";
    this.anchor = "";
    this.required = false;
    this.type = "";
    this.default = "";
    this.facts = [];
    this.body = "";
  }
  static {
    this.properties = {
      name: { type: String },
      anchor: { type: String },
      required: { type: Boolean, reflect: true },
      type: { type: String },
      default: { type: String },
      facts: { type: Array },
      body: { type: String }
    };
  }
  connectedCallback() {
    const written2 = this.lifted();
    if (written2.length) this.taken = written2;
    super.connectedCallback();
  }
  /** The two the directive names first, then whatever else the source set.
      The order stays fixed rather than alphabetical: a reader who compares
      two entries compares them line by line. */
  get stated() {
    return [
      ...this.type ? [{ label: "type", value: this.type }] : [],
      ...this.default ? [{ label: "default", value: this.default }] : [],
      ...this.facts
    ];
  }
  fact({ label, value }) {
    return html77`<dt class="sds-label">${label}</dt>
      <dd class="sds-mono">${value}</dd>`;
  }
  render() {
    const facts2 = this.stated;
    const mark = this.anchor ? html77`<a class="sds-confval__mark" href="#${this.anchor}" aria-label="Link to ${this.name}">#</a>` : nothing47;
    return html77`<dl class="sds-confval">
  <dt class="sds-confval__term" id="${this.anchor || nothing47}">
    <code class="sds-confval__name">${this.name}</code>
    ${this.required ? html77`<sds-badge label="required"></sds-badge>` : nothing47}
    ${mark}
  </dt>
  <dd class="sds-confval__detail">
    ${facts2.length ? html77`<dl class="sds-confval__facts">
      ${lines(facts2.map((f) => this.fact(f)), 6)}
    </dl>` : nothing47}
    <div class="sds-confval__body">${this.taken ?? this.content ?? this.body}</div>
  </dd>
</dl>`;
  }
};
define("sds-confval", SdsConfval);

// packages/frontend/src/index.ts
var TAGS4 = [
  "sds-icon",
  "sds-theme",
  "sds-button",
  "sds-dropdown",
  "sds-badge",
  "sds-eyebrow",
  "sds-link",
  "sds-nav-breadcrumb",
  "sds-field",
  "sds-select",
  "sds-textarea",
  "sds-field-group",
  "sds-search",
  "sds-field-error",
  "sds-checkbox",
  "sds-checkbox-group",
  "sds-radio",
  "sds-switch",
  "sds-range",
  "sds-file",
  "sds-progress",
  "sds-form-errors",
  "sds-nav-pills",
  "sds-nav-main",
  "sds-accordion",
  "sds-accordion-item",
  "sds-run",
  "sds-steps",
  "sds-step",
  "sds-tabs",
  "sds-tab-item",
  "sds-nav-rail",
  "sds-nav-toc",
  "sds-nav-outline",
  "sds-timeline-stop",
  "sds-timeline",
  "sds-answer",
  "sds-decision",
  "sds-compare",
  "sds-footer",
  "sds-surface",
  "sds-stat",
  "sds-figure",
  "sds-image",
  "sds-embed",
  "sds-lightbox",
  "sds-overlay",
  "sds-modal",
  "sds-dialog",
  "sds-table",
  "sds-card",
  "sds-icon-tile",
  "sds-swatch",
  "sds-grid",
  "sds-search-result",
  "sds-search-hits",
  "sds-nav-pagination",
  "sds-nav-pager",
  "sds-code",
  "sds-copy",
  "sds-tree",
  "sds-diagram",
  "sds-diff",
  "sds-quote",
  "sds-slide",
  "sds-deck",
  "sds-byline",
  "sds-note",
  "sds-facts",
  "sds-entry",
  "sds-register",
  "sds-confval"
];
export {
  FINDING_GROUPS,
  SdsAccordion,
  SdsAccordionItem,
  SdsAnswer,
  SdsBadge,
  SdsButton,
  SdsByline,
  SdsCard,
  SdsCheckbox,
  SdsCheckboxGroup,
  SdsCode,
  SdsCompare,
  SdsConfval,
  SdsCopy,
  SdsDecision,
  SdsDeck,
  SdsDiagram,
  SdsDialog,
  SdsDiff,
  SdsDropdown,
  SdsElement,
  SdsEmbed,
  SdsEntry,
  SdsEyebrow,
  SdsFacts,
  SdsField,
  SdsFieldError,
  SdsFieldGroup,
  SdsFigure,
  SdsFile,
  SdsFooter,
  SdsFormElement,
  SdsFormErrors,
  SdsGrid,
  SdsIcon,
  SdsIconTile,
  SdsImage,
  SdsLightbox,
  SdsLink,
  SdsModal,
  SdsNavBreadcrumb,
  SdsNavMain,
  SdsNavOutline,
  SdsNavPager,
  SdsNavPagination,
  SdsNavPills,
  SdsNavRail,
  SdsNavToc,
  SdsNote,
  SdsOverlay,
  SdsProgress,
  SdsQuote,
  SdsRadio,
  SdsRange,
  SdsRegister,
  SdsRun,
  SdsSearchHits,
  SdsSearchResult,
  SdsSelect,
  SdsSlide,
  SdsStat,
  SdsStep,
  SdsSteps,
  SdsSurface,
  SdsSwatch,
  SdsSwitch,
  SdsTabItem,
  SdsTable,
  SdsTabs,
  SdsTextarea,
  SdsTheme,
  SdsTimeline,
  SdsTimelineStop,
  SdsTree,
  TAGS4 as TAGS,
  buttonClass,
  define,
  fieldBox,
  fieldRow,
  iconIds,
  inlineIcons,
  pageNumbers,
  setIconSprites,
  themeBoot
};
//# sourceMappingURL=index.js.map

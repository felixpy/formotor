/**
 * Formotor.js v0.1.0
 * (c) 2018 Felix Yang 
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('zepto')) :
  typeof define === 'function' && define.amd ? define(['zepto'], factory) :
  (global.Formotor = factory(global.Zepto));
}(this, (function (JZ) { 'use strict';

  JZ = JZ && JZ.hasOwnProperty('default') ? JZ['default'] : JZ;

  function Formotor() {
    return JZ;
  }

  return Formotor;

})));

"use strict";(self.webpackChunkStill_App=self.webpackChunkStill_App||[]).push([[660],{1660:function(e,n,t){t.r(n),t.d(n,{ScreenOrientationWeb:function(){return r}});var i=t(6546);class r extends i.E_{constructor(){super(),"undefined"!=typeof screen&&void 0!==screen.orientation&&screen.orientation.addEventListener("change",(()=>{const e=screen.orientation.type;this.notifyListeners("screenOrientationChange",{type:e})}))}async orientation(){if("undefined"==typeof screen||!screen.orientation)throw this.unavailable("ScreenOrientation API not available in this browser");return{type:screen.orientation.type}}async lock(e){if("undefined"==typeof screen||!screen.orientation||!screen.orientation.lock)throw this.unavailable("ScreenOrientation API not available in this browser");try{await screen.orientation.lock(e.orientation)}catch(e){throw this.unavailable("ScreenOrientation API not available in this browser")}}async unlock(){if("undefined"==typeof screen||!screen.orientation||!screen.orientation.unlock)throw this.unavailable("ScreenOrientation API not available in this browser");try{screen.orientation.unlock()}catch(e){throw this.unavailable("ScreenOrientation API not available in this browser")}}}}}]);
//# sourceMappingURL=660.js.map
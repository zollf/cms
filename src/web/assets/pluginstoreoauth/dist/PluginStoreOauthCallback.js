!function(){var t={449:function(){},518:function(t,e,r){var n=r(449);n.__esModule&&(n=n.default),"string"==typeof n&&(n=[[t.id,n,""]]),n.locals&&(t.exports=n.locals),(0,r(673).Z)("9e29e0cc",n,!0,{})},673:function(t,e,r){"use strict";function n(t,e){for(var r=[],n={},s=0;s<e.length;s++){var a=e[s],o=a[0],i={id:t+":"+s,css:a[1],media:a[2],sourceMap:a[3]};n[o]?n[o].parts.push(i):r.push(n[o]={id:o,parts:[i]})}return r}r.d(e,{Z:function(){return h}});var s="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!s)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var a={},o=s&&(document.head||document.getElementsByTagName("head")[0]),i=null,u=0,c=!1,p=function(){},l=null,d="data-vue-ssr-id",f="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function h(t,e,r,s){c=r,l=s||{};var o=n(t,e);return g(o),function(e){for(var r=[],s=0;s<o.length;s++){var i=o[s];(u=a[i.id]).refs--,r.push(u)}for(e?g(o=n(t,e)):o=[],s=0;s<r.length;s++){var u;if(0===(u=r[s]).refs){for(var c=0;c<u.parts.length;c++)u.parts[c]();delete a[u.id]}}}}function g(t){for(var e=0;e<t.length;e++){var r=t[e],n=a[r.id];if(n){n.refs++;for(var s=0;s<n.parts.length;s++)n.parts[s](r.parts[s]);for(;s<r.parts.length;s++)n.parts.push(m(r.parts[s]));n.parts.length>r.parts.length&&(n.parts.length=r.parts.length)}else{var o=[];for(s=0;s<r.parts.length;s++)o.push(m(r.parts[s]));a[r.id]={id:r.id,refs:1,parts:o}}}}function v(){var t=document.createElement("style");return t.type="text/css",o.appendChild(t),t}function m(t){var e,r,n=document.querySelector("style["+d+'~="'+t.id+'"]');if(n){if(c)return p;n.parentNode.removeChild(n)}if(f){var s=u++;n=i||(i=v()),e=y.bind(null,n,s,!1),r=y.bind(null,n,s,!0)}else n=v(),e=w.bind(null,n),r=function(){n.parentNode.removeChild(n)};return e(t),function(n){if(n){if(n.css===t.css&&n.media===t.media&&n.sourceMap===t.sourceMap)return;e(t=n)}else r()}}var C,b=(C=[],function(t,e){return C[t]=e,C.filter(Boolean).join("\n")});function y(t,e,r,n){var s=r?"":n.css;if(t.styleSheet)t.styleSheet.cssText=b(e,s);else{var a=document.createTextNode(s),o=t.childNodes;o[e]&&t.removeChild(o[e]),o.length?t.insertBefore(a,o[e]):t.appendChild(a)}}function w(t,e){var r=e.css,n=e.media,s=e.sourceMap;if(n&&t.setAttribute("media",n),l.ssrId&&t.setAttribute(d,e.id),s&&(r+="\n/*# sourceURL="+s.sources[0]+" */",r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(s))))+" */"),t.styleSheet)t.styleSheet.cssText=r;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(r))}}}},e={};function r(n){var s=e[n];if(void 0!==s)return s.exports;var a=e[n]={id:n,exports:{}};return t[n](a,a.exports,r),a.exports}r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,{a:e}),e},r.d=function(t,e){for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},function(){"use strict";var t;r(518),t=jQuery,Craft.PluginStoreOauthCallback=Garnish.Base.extend({$graphic:null,$status:null,errorDetails:null,data:null,settings:null,init:function(e){var r=this;if(this.setSettings(e),this.$graphic=t("#graphic"),this.$status=t("#status"),this.settings.error){var n=this.settings.message?this.settings.message:this.settings.error;this.$status.html(n),setTimeout((function(){window.location=r.settings.redirectUrl}),1e3)}else setTimeout((function(){r.postActionRequest()}),500)},postActionRequest:function(){var e=this,r=window.location.hash.substr(1),n=t.parseFragmentString(r);Craft.postActionRequest("plugin-store/save-token",n,(function(t,r,n){"success"==r?t.error?e.showError(t.error):(e.updateStatus("<p>"+Craft.t("app","Connected!")+"</p>"),e.$graphic.addClass("success"),setTimeout((function(){void 0!==e.settings.redirectUrl?window.location=e.settings.redirectUrl:window.location=Craft.getCpUrl("plugin-store")}),500)):e.showFatalError(n)}))},showFatalError:function(t){this.$graphic.addClass("error");var e="<p>"+Craft.t("app","A fatal error has occurred:")+'</p><div id="error" class="code"><p><strong class="code">'+Craft.t("app","Status:")+"</strong> "+Craft.escapeHtml(t.statusText)+'</p><p><strong class="code">'+Craft.t("app","Response:")+"</strong> "+Craft.escapeHtml(t.responseText)+'</p></div><a class="btn submit big" href="mailto:support@craftcms.com?subject='+encodeURIComponent("Craft update failure")+"&body="+encodeURIComponent("Describe what happened here.\n\n-----------------------------------------------------------\n\nStatus: "+t.statusText+"\n\nResponse: "+t.responseText)+'">'+Craft.t("app","Send for help")+"</a>";this.updateStatus(e)},updateStatus:function(t){this.$status.html(t)},showError:function(e){this.$graphic.addClass("error"),this.updateStatus("<p>"+e+"</p>");var r=t('<div id="junction-buttons"/>').appendTo(this.$status);$cancelBtn=t("<a/>",{class:"btn big",href:Craft.getCpUrl("plugin-store"),text:"Cancel"}).appendTo(r),$retryBtn=t("<a/>",{class:"btn big",href:Craft.getActionUrl("plugin-store/connect"),text:"Try again"}).appendTo(r)}})}()}();
//# sourceMappingURL=PluginStoreOauthCallback.js.map
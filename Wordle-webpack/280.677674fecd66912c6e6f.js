"use strict";(self.webpackChunkwordle=self.webpackChunkwordle||[]).push([[280],{280:(e,t,r)=>{r.r(t),r.d(t,{WordleBoard:()=>u});var n=r(144),o=r(671),a=r(942),i=r(152),s=function(){function e(t){(0,o.Z)(this,e),this.keyboardNode=document.getElementById("keyboard"),this.iter=0,this.letterDict=t,this.keyboardStruct=["qwertyuiop","asdfghjkl","zxcvbnm"]}return(0,n.Z)(e,[{key:"addOnScreenKeyboardListeners",value:function(){this.keyboardNode.querySelectorAll(".key, .key-enter").forEach((function(e){var t=e.dataset.key;e.addEventListener("click",(function(){var e=new KeyboardEvent("keydown",{key:t});window.dispatchEvent(e)}))}))}},{key:"render",value:function(){var e=this,t=this.keyboardStruct.slice(-1),r=(0,i.Z)(t,1)[0],n=function(t){var r=["key"];return e.letterDict.hardMatch[t]?r.push("evaluated-row-match"):e.letterDict.softMatch[t]?r.push("evaluated-row-soft-match"):e.letterDict.noMatch[t]&&r.push("evaluated-row-no-match"),r.join(" ")},o=[];for(var a in this.keyboardStruct){var s=this.keyboardStruct[a],c=s===r?["<span class='key' data-key='Enter' style='width:60px;'>Enter</span>"]:[];for(var u in s){var d=s[u],l=d.toUpperCase(),p=n(d),h="<span class='".concat(p,"' data-key=").concat(l,">").concat(l,"</span>");c.push(h)}s===r&&c.push("<span class='key' data-key='Backspace'>⌫</span>");var v='<section class="key-row">'.concat(c.join(""),"</section>");o.push(v)}this.keyboardNode.innerHTML=o.join(""),this.addOnScreenKeyboardListeners()}}]),e}(),c=(0,n.Z)((function e(t,r){var n=this;(0,o.Z)(this,e),(0,a.Z)(this,"update",(function(e,t){n.curTry+=1,n.evaluateAttempt()&&(n.gameWon||(n.gameWon=n.userInputWordMatchesCurWord(e,t)),console.log(e,t),n.gameOver||(n.gameOver=n.gameWon||n.lastAttempt()))})),(0,a.Z)(this,"userInputWordMatchesCurWord",(function(e,t){return e===t})),(0,a.Z)(this,"evaluateAttempt",(function(){return n.curTry<=n.maxTries})),(0,a.Z)(this,"lastAttempt",(function(){return n.curTry===n.maxTries})),(0,a.Z)(this,"renderKeyboard",(function(){return n.keyboard.render()})),this.curTry=0,this.maxTries=t,this.gameWon=!1,this.gameOver=!1,this.keyboard=new s(r),this.keyboard.render()})),u=(0,n.Z)((function e(t,r,n,i,s){var u=this,d=arguments.length>5&&void 0!==arguments[5]?arguments[5]:void 0;(0,o.Z)(this,e),(0,a.Z)(this,"getAlphabet",(function(){var e="abcdefghijklmnopqrstuvwxyz",t=e.toUpperCase();return[e,t].join("")})),(0,a.Z)(this,"getWordAsDict",(function(e){var t={};for(var r in e){var n=e[r];t[n]?t[n]+=1:t[n]=1}return t})),(0,a.Z)(this,"getCurRowInput",(function(){return u.grid[u.curRow].join("")})),(0,a.Z)(this,"createGrid",(function(e,t){for(var r=[],n=0;n<e;n+=1){for(var o=[],a=0;a<t;a+=1)o.push(" ");r.push(o)}return r})),(0,a.Z)(this,"createEventListeners",(function(){window.addEventListener("keydown",(function(e){if(u.inputEnabled){var t,r,n,o,a,i=e.key;if("Enter"===i){var s=u.getCurRowInput(),c=u.curCol===u.cols,d=u.validWords.includes(s);if(c&&!d)u.injectPopupMsg("invalid-word"),t=u.curRow;else if(c&&d){var l=u.getCurRowInput();u.gameState.update(u.word,l),r=u.curRow,u.curRow+=1,u.curCol=0}else u.injectPopupMsg("non-full-row"),t=u.curRow}else"Backspace"===i?(u.curCol-=1,u.curCol<0&&(u.curCol=0),u.populateRow(" ",u.curRow,u.curCol,{backspace:!0})):-1!==u.alphabet.indexOf(i)&&u.populateRow(i,u.curRow,u.curCol);o=(n=u.gameState).gameOver,a=n.gameWon,u.inputEnabled=!a&&!o,a&&o?u.injectPopupMsg("winner"):!a&&o&&u.injectPopupMsg("game-over"),u.render(t,r)}}))})),(0,a.Z)(this,"injectPopupMsg",(function(e){if(e){var t=function(e){u.popupMsg.textContent=e,u.setStyle(u.popupMsg,{padding:"10px",opacity:"92%"})},r=function(e,t){e.textContent="",u.setStyle(u.popupMsg,{opacity:"0%"});var r=document.getElementsByClassName("wordle-grid_row")[t];r&&r.classList.remove("shake")},n=function(e){return setTimeout((function(){return r(u.popupMsg,u.curRow)}),e)};switch(e){case"non-full-row":t("word not long enough"),n(1e3);break;case"invalid-word":t("word does not exist"),n(1e3);break;case"winner":var o=["you won dood!!!","winner winner chicken dinner"];t(o[Math.floor(Math.random()*o.length)]);var a=u.createNode("div",{innerHTML:'<div class="pyro"><div class="before"></div><div class="after"></div></div>',className:"fireworks"});u.prependApp(a);var i=u.getResetGameButton(a,{params:u.popupMsg,fn:r});u.popupMsg.appendChild(i);break;case"game-over":t("game over =(");var s=u.getResetGameButton(void 0,{params:u.popupMsg,fn:r});u.popupMsg.appendChild(s)}}})),(0,a.Z)(this,"getResetGameButton",(function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r={className:"reset-button",textContent:"Reset"},n=u.createNode("button",r);return n.addEventListener("click",(function(){e&&e.remove();var r=t.params,o=t.fn;console.log(r,o),r&&o&&o(r),n.remove(),window.Wordle&&window.Wordle.resetGame()})),n})),(0,a.Z)(this,"populateRow",(function(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};if(t<u.rows&&r<u.cols){u.previousGrids.push(u.grid),u.grid=u.grid.map((function(n,o){return n.map((function(n,a){return o===t&&a===r?e.toLowerCase():n}))}));var o=n.backspace;o||u.incrCol()}})),(0,a.Z)(this,"decrCol",(function(){u.col-1>0&&(u.curCol-=1,u.grid[row][col]=" ")})),(0,a.Z)(this,"incrCol",(function(){u.curCol+=1,u.curCol>u.cols&&(u.curCol-=1)})),(0,a.Z)(this,"renderCell",(function(e,t,r,n,o){var a=["wordle-grid_row_element"];if(o&&a.push("flip"),e<u.curRow)if(n[r]){var i=r===u.word[t],s=i?"evaluated-row-match":"evaluated-row-soft-match";i?u.letterDict.hardMatch[r]=!0:u.letterDict.softMatch[r]=!0,a.push(s),n[r]-=1,0===n[r]&&delete n[r]}else a.unshift("evaluated-row-no-match"),u.letterDict.noMatch[r]=!0;else e>u.curRow&&a.push("unevaluated-row");return e===u.curRow&&t==u.curCol&&a.push("current-cell"),"<div class='".concat(a.join(" "),"'>").concat(r.toUpperCase(),"</div>")})),(0,a.Z)(this,"render",(function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,r=["<div class='wordle-grid'>"],n=0;n<u.rows;n+=1){var o=e===n?"<span class='wordle-grid_row shake'>":"<span class='wordle-grid_row'>",a=JSON.parse(JSON.stringify(u.wordAsDict));r.push(o);for(var i=t===n,s=0;s<u.cols;s+=1){var c=u.grid[n][s],d=u.renderCell(n,s,c,a,i);r.push(d)}r.push("</span>")}r.push("</div>"),document.getElementById("board").innerHTML=r.join(""),u.gameState.renderKeyboard()}));var l=d.createNode,p=d.setStyle,h=d.prependApp;l&&(this.createNode=l),p&&(this.setStyle=p),h&&(this.prependApp=h),this.alphabet=this.getAlphabet(),this.wordAsDict=this.getWordAsDict(n),this.word=n,this.validWords=r,this.rows=s,this.cols=i,this.previousGrids=[],this.grid=this.createGrid(s,i),this.curRow=0,this.curCol=0,this.popupMsg=t,this.letterDict={softMatch:{},hardMatch:{},noMatch:{}},this.gameState=new c(s,this.letterDict),this.inputEnabled=!0,this.createEventListeners()}))},152:(e,t,r)=>{function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a=[],i=!0,s=!1;try{for(r=r.call(e);!(i=(n=r.next()).done)&&(a.push(n.value),!t||a.length!==t);i=!0);}catch(e){s=!0,o=e}finally{try{i||null==r.return||r.return()}finally{if(s)throw o}}return a}}(e,t)||function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}r.d(t,{Z:()=>o})}}]);
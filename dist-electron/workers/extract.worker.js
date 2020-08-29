/*! For license information please see extract.worker.js.LICENSE.txt */
module.exports=function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=26)}([function(t,e,r){"use strict";r.r(e),r.d(e,"__extends",(function(){return o})),r.d(e,"__assign",(function(){return i})),r.d(e,"__rest",(function(){return s})),r.d(e,"__decorate",(function(){return a})),r.d(e,"__param",(function(){return u})),r.d(e,"__metadata",(function(){return c})),r.d(e,"__awaiter",(function(){return l})),r.d(e,"__generator",(function(){return f})),r.d(e,"__createBinding",(function(){return d})),r.d(e,"__exportStar",(function(){return p})),r.d(e,"__values",(function(){return h})),r.d(e,"__read",(function(){return g})),r.d(e,"__spread",(function(){return y})),r.d(e,"__spreadArrays",(function(){return m})),r.d(e,"__await",(function(){return v})),r.d(e,"__asyncGenerator",(function(){return _})),r.d(e,"__asyncDelegator",(function(){return w})),r.d(e,"__asyncValues",(function(){return b})),r.d(e,"__makeTemplateObject",(function(){return O})),r.d(e,"__importStar",(function(){return j})),r.d(e,"__importDefault",(function(){return P})),r.d(e,"__classPrivateFieldGet",(function(){return E})),r.d(e,"__classPrivateFieldSet",(function(){return S}));var n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)};function o(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}var i=function(){return(i=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function s(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(t);o<n.length;o++)e.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(t,n[o])&&(r[n[o]]=t[n[o]])}return r}function a(t,e,r,n){var o,i=arguments.length,s=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(s=(i<3?o(s):i>3?o(e,r,s):o(e,r))||s);return i>3&&s&&Object.defineProperty(e,r,s),s}function u(t,e){return function(r,n){e(r,n,t)}}function c(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}function l(t,e,r,n){return new(r||(r=Promise))((function(o,i){function s(t){try{u(n.next(t))}catch(t){i(t)}}function a(t){try{u(n.throw(t))}catch(t){i(t)}}function u(t){var e;t.done?o(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(s,a)}u((n=n.apply(t,e||[])).next())}))}function f(t,e){var r,n,o,i,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(r)throw new TypeError("Generator is already executing.");for(;s;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,n=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(o=s.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=e.call(t,s)}catch(t){i=[6,t],n=0}finally{r=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}}function d(t,e,r,n){void 0===n&&(n=r),t[n]=e[r]}function p(t,e){for(var r in t)"default"===r||e.hasOwnProperty(r)||(e[r]=t[r])}function h(t){var e="function"==typeof Symbol&&Symbol.iterator,r=e&&t[e],n=0;if(r)return r.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function g(t,e){var r="function"==typeof Symbol&&t[Symbol.iterator];if(!r)return t;var n,o,i=r.call(t),s=[];try{for(;(void 0===e||e-- >0)&&!(n=i.next()).done;)s.push(n.value)}catch(t){o={error:t}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(o)throw o.error}}return s}function y(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(g(arguments[e]));return t}function m(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),o=0;for(e=0;e<r;e++)for(var i=arguments[e],s=0,a=i.length;s<a;s++,o++)n[o]=i[s];return n}function v(t){return this instanceof v?(this.v=t,this):new v(t)}function _(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,o=r.apply(t,e||[]),i=[];return n={},s("next"),s("throw"),s("return"),n[Symbol.asyncIterator]=function(){return this},n;function s(t){o[t]&&(n[t]=function(e){return new Promise((function(r,n){i.push([t,e,r,n])>1||a(t,e)}))})}function a(t,e){try{(r=o[t](e)).value instanceof v?Promise.resolve(r.value.v).then(u,c):l(i[0][2],r)}catch(t){l(i[0][3],t)}var r}function u(t){a("next",t)}function c(t){a("throw",t)}function l(t,e){t(e),i.shift(),i.length&&a(i[0][0],i[0][1])}}function w(t){var e,r;return e={},n("next"),n("throw",(function(t){throw t})),n("return"),e[Symbol.iterator]=function(){return this},e;function n(n,o){e[n]=t[n]?function(e){return(r=!r)?{value:v(t[n](e)),done:"return"===n}:o?o(e):e}:o}}function b(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,r=t[Symbol.asyncIterator];return r?r.call(t):(t=h(t),e={},n("next"),n("throw"),n("return"),e[Symbol.asyncIterator]=function(){return this},e);function n(r){e[r]=t[r]&&function(e){return new Promise((function(n,o){(function(t,e,r,n){Promise.resolve(n).then((function(e){t({value:e,done:r})}),e)})(n,o,(e=t[r](e)).done,e.value)}))}}}function O(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}function j(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function P(t){return t&&t.__esModule?t:{default:t}}function E(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return e.get(t)}function S(t,e,r){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");return e.set(t,r),r}},function(t,e){t.exports=require("uuid")},function(t,e,r){"use strict";var n;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t.BARCODE="barcode$",t.NONE="",t.OPTION="q[1-9][0-9]?[a-e]$",t.QRCODE="qrcode$",t.QUESTION="q[1-9][0-9]?$"}(n||(n={})),e.default=n},function(t,e){t.exports=require("os")},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.dataPaths=void 0;const n=r(0),o=n.__importDefault(r(3)),i=n.__importDefault(r(5)),s=o.default.tmpdir(),a=i.default.join(o.default.homedir(),"desktop"),u={design:i.default.resolve("tests","_data","design.qr.svg"),designBarcode:i.default.resolve("tests","_data","design.svg"),home:a,images:i.default.resolve("tests","_data","images-qrcode"),imagesBarcode:i.default.resolve("tests","_data","images-barcode"),key:i.default.resolve("tests","_data","key.xlsx"),keyImage:i.default.resolve("tests","_data","key.jpg"),questionsModel:i.default.resolve("dist/data/questions-model.json"),result:i.default.resolve("tests","_data","result.xlsx"),resultCompiled:i.default.resolve("tests","_data","resultCompiled.xlsx"),root:i.default.resolve("."),temp:s,tmp:s};e.dataPaths=u},function(t,e){t.exports=require("path")},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=r(0),o=r(1),i=n.__importDefault(r(7)),s=n.__importDefault(r(2));class a{constructor(t,e){this.correctCount=0,this.incorrectCount=0,this.isCompiled=!1,this.marks=0,this.skippedCount=0,this.totalMarks=0,this.unattemptedCount=0,this.answers={},this.post="",this.questionPaperType="",this.testCenter="",this.testTime="",this.id=o.v4(),this.rollNo=t,this.imageFile=e,this.isRollNoExtracted=!!t}static fromJson(t){const e=new RegExp(s.default.QUESTION),r="string"==typeof t.rollNo?new a(t.rollNo):new a;return Object.keys(t).forEach(n=>{const o=t[n];e.test(n)?"string"==typeof o?r.addAnswer(n,o):r.addAnswer(n,"?"):r[n]=o}),r}addAnswer(t,e){return this.answers[t]={value:e,unattempted:!1,correct:!1,skipped:!1},this}compile(t,e,r){if(this.isCompiled)return this;if(!this.matchWithKey(t))return this;const n=Object.keys(t.answers);for(let e=0;e<n.length;e+=1){const r=n[e],o=t.answers[r],s=this.answers[r];s.value===i.default.NONE&&(s.unattempted=!0,this.unattemptedCount+=1),o.value!==i.default.NONE&&o.value!==i.default.MULTIPLE?s.value===o.value?(s.correct=!0,this.correctCount+=1):(s.correct=!1,this.incorrectCount+=1):(s.skipped=!0,this.skippedCount+=1)}return this.isCompiled=!0,e&&r&&this.setMarks(e,r),this}getCorrectCount(){return this.correctCount}getInCorrectCount(){return this.incorrectCount}getMarks(){return this.marks}getSkippedCount(){return this.skippedCount}getTotalMarks(){return this.totalMarks}getUnattemptedCount(){return this.unattemptedCount}hasImageFile(){return void 0!==this.imageFile}hasValidRollNo(){return!this.isKey()&&void 0!==this.rollNo}isKey(){return void 0!==this.rollNo&&"key"===this.rollNo.trim().toLowerCase()}isResult(){return!this.isKey()}matchWithKey(t){return this.post===t.post&&this.testCenter===t.testCenter&&this.testTime===t.testTime&&this.questionPaperType===t.questionPaperType}setMarks(t,e){return this.marks=this.correctCount*t-this.incorrectCount*e,this.totalMarks=(60-this.skippedCount)*t,this}toJson(){const t=JSON.parse(JSON.stringify(this));for(const e in t){const r=t[e];if("object"==typeof r){for(const e in r)t[e]=r[e].value;delete t[e]}else t[e]=r}return t}}e.default=a},function(t,e,r){"use strict";var n;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t.A="A",t.B="B",t.C="C",t.D="D",t.E="E",t.MULTIPLE="*",t.NONE="?"}(n||(n={})),e.default=n},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getSharpObjectFromSource=e.logImageData=e.getImagePaths=e.convertImage=void 0;const n=r(0),o=n.__importDefault(r(15)),i=n.__importDefault(r(5)),s=n.__importDefault(r(16)),a=r(1),u=n.__importDefault(r(17)),c=n.__importDefault(r(18)),l=r(19),f=r(4),d=t=>s.default(t).raw().flatten();e.getSharpObjectFromSource=d;e.convertImage=async t=>{if(!t)throw new Error("Invalid source provided");const e=t.split(".").pop();if(e&&e in u.default)return t;const r=l.cache.get(t);if(r)return r;const n=i.default.join(f.dataPaths.tmp,a.v4()+".jpg");return l.cache.set(t,n),await d(t).jpeg().toFile(n),n};e.logImageData=async(t,e)=>{let r;const n=i.default.join(f.dataPaths.tmp,(e||a.v4())+".jpg");return r="string"==typeof t?d(t):t.clone(),await r.jpeg().toFile(n),n};e.getImagePaths=async t=>{const e=`${t.replace(/\\/g,"/")}/**/*.{${Object.keys(c.default)}}`.replace("//","/");return o.default(e,{absolute:!0,onlyFiles:!0})}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.WorkerManager=e.PROGRESS_STATES=void 0;const n=r(10),o=r(11),i=r(3),s=r(12),a=r(8),u=i.cpus().length;var c,l;!function(t){t.PROGRESS="progress",t.COMPLETED="completed",t.ERROR="error",t.LOG="log",t.EXIT="exit"}(c=e.PROGRESS_STATES||(e.PROGRESS_STATES={})),function(t){t.COMPILE="compile",t.EXTRACT="extract",t.GENERATE="generate"}(l||(l={}));class f extends o.EventEmitter{constructor(){super(),this.data=[],this.workers=[],this.finished=0,this.inputCount=0}async createWorkers(t,e){for(let r=0;r<t;r+=1){const t=n.fork(`./dist-electron/workers/${e}.worker.js`);t.on("message",t=>{const{progressState:e,payload:r}=t;if(e===c.PROGRESS)return this.emit(c.PROGRESS);e===c.COMPLETED&&(this.finished+=1,r&&this.data.push(r),this.finished===this.workers.length&&this.emit(c.COMPLETED,this.data))}),t.on("exit",(t,e)=>{this.emit(c.EXIT,t,e)}),t.on("error",t=>{this.emit(c.ERROR,t)}),t.stdout&&t.stdout.on("data",t=>{this.emit(c.LOG,t.toString())}),this.workers.push(t)}}async extract(t,e){const[r,n]=await Promise.all([s.getDesignData(e),a.getImagePaths(t)]),o=Math.min(n.length,u),i=Math.floor(n.length/o);await this.createWorkers(o,l.EXTRACT),this.inputCount=n.length;for(let t=0;t<o;t+=1){const e=t*i,s=t===o-1?n.length:(t+1)*i;this.workers[t].send({designData:r,imagePaths:n.slice(e,s)})}return this}async generate(){return await this.createWorkers(u,l.GENERATE),this}async compile(){return await this.createWorkers(u,l.COMPILE),this}async stop(){this.workers.forEach(t=>{t.kill("SIGKILL"),t.unref()}),this.finished=0,this.inputCount=0,this.data.length=0,this.workers.length=0,this.removeAllListeners()}}e.WorkerManager=f},function(t,e){t.exports=require("child_process")},function(t,e){t.exports=require("events")},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getDesignData=void 0;const n=r(0),o=r(13),i=r(14),s=n.__importDefault(r(2)),a=r(4);e.getDesignData=async function(t){const e=a.dataPaths.designBarcode,{svg:r}=o.parse(i.readFileSync(e).toString(),{attributeNamePrefix:"",ignoreAttributes:!1,parseNodeValue:!0,parseAttributeValue:!0,allowBooleanAttributes:!0}),[n,u,c,l]=r.viewBox.split(" ").map(t=>parseInt(t,10)),f=c-n,d=l-u,p=new RegExp(s.default.OPTION,"i"),h=new RegExp(s.default.BARCODE,"i"),g=new RegExp(s.default.QRCODE,"i");let y={x:0,y:0,width:0,height:0};const m={};return r.g.forEach(t=>{const{title:e,transform:r,rect:n}=t;if(!n)return;const{rx:o,ry:i}=n;let{x:s,y:a,width:u,height:c}=n,l=0,v=0;if(r&&([l,v]=r.replace(/(translate)|\(|\)/gi,"").split(",").map(t=>parseInt(t,10)||0)),s=Math.floor(s-o+l-3),a=Math.floor(a-i+v-3),u=Math.ceil(u+o+6),c=Math.ceil(c+i+6),p.test(e)){const t=e.slice(0,-1);m[t]||(m[t]={x:f,y:d,width:0,height:0}),m[t].width+=u,m[t].x>s&&(m[t].x=s),m[t].y>a&&(m[t].y=a),m[t].width<u&&(m[t].width=u),m[t].height<c&&(m[t].height=c)}else(h.test(e)||g.test(e))&&(y={x:s,y:a,width:u,height:c})}),{code:y,questions:m,width:f,height:d}}},function(t,e){t.exports=require("fast-xml-parser")},function(t,e){t.exports=require("fs")},function(t,e){t.exports=require("fast-glob")},function(t,e){t.exports=require("sharp")},function(t,e,r){"use strict";var n;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t.bmp="bmp",t.gif="gif",t.jfif="jfif",t.jpe="jpe",t.jpeg="jpeg",t.jpg="jpg",t.png="png",t.svg="svg",t.webp="webp"}(n||(n={})),e.default=n},function(t,e,r){"use strict";var n;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t.bmp="bmp",t.dib="dib",t.gif="gif",t.jfif="jfif",t.jpe="jpe",t.jpeg="jpeg",t.jpg="jpg",t.png="png",t.svg="svg",t.tif="tif",t.tiff="tiff",t.webp="webp"}(n||(n={})),e.default=n},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.cache=void 0;const n=new(r(0).__importDefault(r(20)).default);e.cache=n},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default=class{constructor(){this.list={}}get(t){return this.list[t]}remove(t){const e=this.list[t];return delete this.list[t],e}reset(){this.list={}}set(t,e){return this.list[t]=e,e}}},,,,,,function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.start=void 0;const n=r(0).__importDefault(r(6)),o=r(9),i=r(8),s=r(27),a=r(29);function u(t){process&&process.send&&process.send(t)}async function c(t,e=!0){const{designData:r,imagePaths:c}=t,l=[];for(let t=0;t<c.length;t+=1){const f=c[t],d=i.getSharpObjectFromSource(f),[p,h]=await Promise.all([a.getRollNoFromImage(r,d),s.getQuestionsData(r,d.clone())]),g=new n.default(p,f);if(!h)throw new Error("Unable to extract questions data...");for(let t=0,e=h.length;t<e;t+=1){const{title:e,input:r}=h[t];if(!e)continue;const n="A";g.addAnswer(e,n)}l.push(g),e&&u({progressState:o.PROGRESS_STATES.PROGRESS})}if(!e)return l;u({progressState:o.PROGRESS_STATES.COMPLETED,payload:l})}e.start=c,process.on("message",t=>{c(t)}),process.on("unhandledRejection",t=>{console.error(t),process.exit(1)}),process.on("uncaughtException",t=>{console.error(t),process.exit(1)}),process.on("warning",t=>{console.warn(t)})},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getQuestionsData=void 0;const n=r(0).__importDefault(r(7)),o=r(28);e.getQuestionsData=async(t,e,r)=>{const{width:i}=await e.metadata(),s=i&&i>t.width?t.width/i:1,a=[],u=Object.entries(t.questions);1!==s&&e.resize(Math.floor(t.width*s));for(let t=0,i=u.length;t<i;t+=1){const[i,c]=u[t],l=i.toLowerCase();e.extract({left:Math.floor(c.x*s),top:Math.floor(c.y*s),width:Math.ceil(c.width*s),height:Math.ceil(c.height*s)});const{data:f,info:d}=await e.toBuffer({resolveWithObject:!0}),p=o.convertToBitArray(Array.prototype.slice.call(f,0),d.channels);if(r){const t=r.getKeys()[0].answers;t[l].value!==n.default.MULTIPLE&&a.push({input:p,output:{[t[l].value]:1}})}else a.push({title:i,input:p})}return a}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.convertToBitArray=void 0,e.convertToBitArray=function(t,e){const r=[];for(let n=0,o=t.length;n<o;n+=e){const o=15,i=80,[s,a,u]=t.slice(n,n+e),c=Math.ceil((s+a+u)/e),l=c+o,f=c-o;c<=i?r.push(0):s<=l&&s>=f&&a<=l&&a>=f&&u<=l&&u>=f?r.push(1):r.push(0)}return r}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getRollNoFromImage=void 0;e.getRollNoFromImage=async(t,e)=>{const r=t.code,n=await e.metadata(),o=n.width?n.width/t.width:1,i=Math.ceil(r.width*o),s=Math.ceil(r.height*o);e.extract({left:Math.floor(r.x*o),top:Math.floor(r.y*o),width:i,height:s});return"11111"}}]);
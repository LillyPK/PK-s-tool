// ==UserScript==
// @name PK's tool
// @description  Making Youtube better
// @homepage     https://github.com/LillyPK
// @version      2.2.90
// @author       LillyPK
// @match        https://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @icon         https://raw.githubusercontent.com/LillyPK/image-repo/main/untitled.png
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @namespace https://github.com/LillyPK
// ==/UserScript==

(function () {
    'use strict';
    let validoUrl = document.location.href;
    const $e = (el) => document.querySelector(el); // any element
    const $id = (el) => document.getElementById(el); // element by id
    const $m = (el) => document.querySelectorAll(el); // multiple all elements
    const $cl = (el) => document.createElement(el); // create element
    const $sp = (el, pty) => document.documentElement.style.setProperty(el, pty); // set property variable css
    const $ap = (el) => document.body.appendChild(el); // append element
    const apiDislikes = "https://returnyoutubedislikeapi.com/Votes?videoId="; // Api dislikes


    function FormatterNumber(num, digits) {
        const lookup = [
            {
                value: 1,
                symbol: '',
            },
            {
                value: 1e3,
                symbol: ' K',
            },
            {
                value: 1e6,
                symbol: ' M',
            },
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        const item = lookup
            .slice()
            .reverse()
            .find((item) => {
            return num >= item.value;
            });
        return item
            ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
            : '0';
        }


  //modified

    function paramsVideoURL() {
        const parametrosURL = new URLSearchParams(window.location.search); // Url parametros
        return parametrosURL.get('v');
    }

  //   Dislikes video
    async function videoDislike() {

        validoUrl = document.location.href;

        const validoVentana = $e('#below > ytd-watch-metadata > div');
        if (validoVentana != undefined && document.location.href.split('?v=')[0].includes('youtube.com/watch')) {
            validoUrl = paramsVideoURL();
            const urlShorts = `${apiDislikes}${validoUrl}`;
        try {
            const respuesta = await fetch(urlShorts);
            const datosShort = await respuesta.json();
            const { dislikes } = datosShort;
            const dislikes_content = $e('#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > dislike-button-view-model > toggle-button-view-model > button-view-model > button');
            if (dislikes_content !== undefined) {
            dislikes_content.style = 'width: 90px';

            // Check if content is already updated by the script
            const currentDislikeText = dislikes_content.textContent.trim();
            const formattedDislikes = FormatterNumber(dislikes, 0);

          // Only update if the displayed number isn't already set to the correct value
            if (!currentDislikeText.includes(formattedDislikes)) {
                dislikes_content.innerHTML = `
                <svg class="svg-dislike-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" />
                </svg>
                ${formattedDislikes}`;
            }
            }

            } catch (error) {
            console.log(error);
            }
        }
    }

    // dislikes shorts
    async function shortDislike() {
        validoUrl = document.location.href;
        const validoVentanaShort = $m(
            '#dislike-button > yt-button-shape > label > div > span'
        );
        if (validoVentanaShort != undefined && document.location.href.split('/')[3] === 'shorts') {
            validoUrl = document.location.href.split('/')[4];
            const urlShorts = `${apiDislikes}${validoUrl}`;
            try {
            const respuesta = await fetch(urlShorts);
            const datosShort = await respuesta.json();
            const { dislikes } = datosShort;
            for (let i = 0; i < validoVentanaShort.length; i++) {
                validoVentanaShort[i].textContent = `${FormatterNumber(
                dislikes,
                0
                )}`;
            }
            } catch (error) {
            console.log(error);
            }
        }
    }

    // Url change in second load
    let prevUrl;
    let showDislikes = false;

    setInterval(() => {
        const svgDislike = $e('.svg-dislike-ico'); // Check svg in dom
        const currUrl = window.location.href;
        if (prevUrl !== undefined && currUrl !== prevUrl && !svgDislike && showDislikes) {
            setTimeout(async() => {
                await videoDislike();
                await shortDislike();
            },2000)
        }
        prevUrl = currUrl;
    }, 1000);



    // Create a Trusted Types policy
    const policy = window.trustedTypes?.createPolicy('default', {
        createHTML: (input) => input,
    });

  // modified end

    // Styles for our enhancement panel
    GM_addStyle(`
#cinematics {
    position: absolute !important;
    width: 90vw !important;
    height: 100vh ;
}
#cinematics div {
    position: fixed;
    inset: 0px;
    pointer-events: none;
    transform: scale(1.5, 2);
}
#cinematics > div > div > canvas:nth-child(1), #cinematics > div > div > canvas:nth-child(2) {
    position: absolute !important;
    width: 90vw !important;
    height: 100vh ;
}

.html5-video-player.unstarted-mode {
    background-image: url('https://avatars.githubusercontent.com/u/54366580?v=4');
    background-repeat: no-repeat;
    background-position: 50% 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    }
#yt-enhancement-panel {
    position: fixed;
    top: 60px;
    right: 20px;
    background-color: var(--yt-enhance-menu-bg, #ffffff);
    color: var(--yt-enhance-menu-text, #000000);
    border: 1px solid #cccccc;
    border-radius: 8px;
    padding: 15px;
    z-index: 9999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    width: 300px;
    max-height: 80vh;
    overflow-y: auto;
    font-size: var(--yt-enhance-menu-font-size, 14px);
}
#yt-enhancement-panel h3 {
    margin-top: 0;
    color: #ff0000;
}
.enhancement-option {
    margin-bottom: 10px;
}
.color-picker {
    width: 100%;
}
.slider {
    width: 100%;
}
#toggle-panel {
    position: fixed;
    top: 10px;
    right: 180px;
    z-index: 10000;
    color: white;
    padding: 5px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    transition: all 0.5s ease;
    width: 43px;
    border-radius: 100px;
}
    #toggle-panel:hover {
    background-color: #fff;
    border-radius: 100px;
    opacity: 1 !important;
}
#icon-menu-settings {
    width: 24px;
    height: 24px;
    cursor: pointer;
    user-select: none;
}

.tab-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}
.tab-button {
    background-color: #f0f0f0;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
}
.tab-button.active {
    background-color: #ff0000;
    color: white;
}
.tab-content {
    display: none;
}
.tab-content.active {
    display: block;
}
#import-export {
    margin-top: 15px;
}
#import-export textarea {
    width: 100%;
    height: 100px;
}
#menu-settings-icon {
    cursor: pointer;
    float: right;
    font-size: 20px;
}
.theme-option {
    margin-bottom: 15px;
}
.theme-option label {
    display: flex;
    align-items: center;
}
.theme-option {
    position: relative;
    width: auto;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
}

.theme-preview {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
    border: 1px solid #000;
    z-index: 1;
}

.theme-option input[type="radio"] {
    position: relative;
    z-index: 2;
    margin-right: 10px;
    cursor: pointer;
}

.theme-name {
    position: relative;
    z-index: 2;
    font-size: 15px;
    color: #fff;
}

.theme-option label {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    z-index: 2;
}

.buttons-tranlate {
    background: #000;
    font-size: 10px;
    border: none;
    color: #fbf4f4 !important;
    padding: 3px 0;
    margin-left: 10px;
    width: 70px;
    border-radius: 10px;}
    .buttons-tranlate:hover {
    cursor: pointer;
    background-color: #6b6b6b;}
    button.botones_div {
    margin: 0;
    padding: 0;
}

button:hover {
    color: #ec3203;
}

#eyes {
    opacity: 0;
    position: absolute;
    height: 24px;
    left: 0;
    width: 24px;
}

/* width */
::-webkit-scrollbar {
    width: 4px;
    height: 10px;
}

/* Track */
    ::-webkit-scrollbar-track {
    background: ##d5d5d5;
}

/* Handle */
    ::-webkit-scrollbar-thumb {
    background: #000;

}

.containerButtons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}
#meta.ytd-playlist-panel-video-renderer {
    min-width: 0;
    padding: 0 8px;
    display: flexbox;
    display: flex;
    flex-direction: column-reverse;
    flex: 1;
    flex-basis: 0.000000001px;
}

.containerall {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin: auto;
}
}
.container .botoncalidades {
    margin: 3px 2px;
    width: 24.6%;
}

.botoncalidades:first-child {
    background-color: #0af;
}

.botoncalidades:last-child {
    background-color: red;
    width: 100px;
}

.selectcalidades,
.botoncalidades,
.selectcalidadesaudio {
    width: 50%;
    height: 27.8px;
    background-color: #fff;
    color: #000;
    font-size: 25px;
    text-align: center;
    border: none;
    font-size: 20px;
    margin: 2px 2px;
}

.botoncalidades {
    width: 70px;
    height: 30px;
    background-color: rgb(4, 156, 22);
    border: 0px solid #000;
    color: #fff;
    font-size: 20px;
    border-radius: 10px;
    margin: 2px 2px;
}

.botoncalidades:hover,
.bntcontainer:hover {
    cursor: pointer;
}

.ocultarframe,
.ocultarframeaudio {
    display: none;
}
.checked_updates {
    cursor: pointer;
}
    `);

    // botons bottom video player

    const filterEyes = `

    <div style="position:relative; ">
    <button title="Filter eyes" class="botones_div" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brightness-half"
            width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 9a3 3 0 0 0 0 6v-6z"></path>
            <path
            d="M6 6h3.5l2.5 -2.5l2.5 2.5h3.5v3.5l2.5 2.5l-2.5 2.5v3.5h-3.5l-2.5 2.5l-2.5 -2.5h-3.5v-3.5l-2.5 -2.5l2.5 -2.5z">
            </path>
        </svg>
        <input id="eyes" list="presetColors" type="color" value="#ffffff">
    <datalist id="presetColors">
        <option value="#000000" />
        <option value="#fbff00" />
        <option value="#ff0000" />
        <option value="#00ff00" />
        <option value="#0000ff" />
    </datalist>
        <div id="ojosprotect"
            style="position: fixed; pointer-events: none; width: 100%; height: 100%; left: 0px; top: 0px; opacity: 0.2; z-index: 10; display: block;">
        </div>
    </div>
    </button>
    `;


    const repeatVideo = `
    <button title="Repeat video" class="botones_div" type="button" id="repeatvideo">

    <svg  xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-repeat" width="24"
        height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
        stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path>
        <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path>
    </svg>
</button>
    `;


    const pictureToPicture = `
    <button title="Picture to picture" type="button" class="video_picture_to_picture botones_div">

    <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" /><path d="M14 14m0 1a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1z" /></svg>
</button>

    `;
    const screenShot = `
    <button title="Screenshot video" type="button" class="screenshot_video botones_div">
    <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M6 13l2.644 -2.644a1.21 1.21 0 0 1 1.712 0l3.644 3.644" /><path d="M13 13l1.644 -1.644a1.21 1.21 0 0 1 1.712 0l1.644 1.644" /><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /></svg>
</button>

    `;


    const menuBotones = `
    <main>
        <div class="container">
            <form>
                <div class="containerButtons">
                ${filterEyes}
                ${repeatVideo}
                ${pictureToPicture}
                ${screenShot}
                </div>
                <div>
                </div>
            </form>

        </div>
        <div class="content_collapsible_colors" style="margin-top: 10px">


        </div>
        </form>
    </main>
</html>
    `;

    // Define themes
    const themes = [
        {
            name: 'Default / Reload Page',
            gradient: '',
            textColor: '',
            raised: '',
            btnTranslate: '',
            CurrentProgressVideo: '',
            videoDuration: '',
            colorIcons: '',
            textLogo: '',
            primaryColor: '',
            secondaryColor: '',
        },
        {
            name: 'Midnight',
            gradient: 'linear-gradient(135deg, #11214d, #0d1e30)',
            textColor: '#ffffff',
            raised: '#f00',
            btnTranslate: '#000',
            CurrentProgressVideo: '#0f0',
            videoDuration: '#fff',
            colorIcons: '#fff',
            textLogo: '#f00',
        },
        {
            name: 'Forest',
            gradient: 'linear-gradient(135deg, #093324, #06191a)',
            textColor: '#ffffff',
            raised: '#303131',
            btnTranslate: '#000',
            CurrentProgressVideo: '#0f0',
            videoDuration: '#fff',
            colorIcons: '#fff',
            textLogo: '#f00',
            progressbarColorPicker: 'FF0000',
        },
        {
            name: 'Sunset',
            gradient: 'linear-gradient(135deg, #b34610, #7c1212)',
            textColor: '#ffffff',
            raised: '#303131',
            btnTranslate: '#000',
            CurrentProgressVideo: '#0f0',
            videoDuration: '#fff',
            colorIcons: '#fff',
            textLogo: '#f00',
        },
        {
            name: 'Royal',
            gradient: 'linear-gradient(135deg, #392666, #120a33)',
            textColor: '#ffffff',
            raised: '#303131',
            btnTranslate: '#000',
            CurrentProgressVideo: '#0f0',
            videoDuration: '#fff',
            colorIcons: '#fff',
            textLogo: '#f00',
        },
        {
            name: 'Cherry',
            gradient: 'linear-gradient(135deg, #a9005c, #fc008f)',
            textColor: '#ffffff',
            raised: '#fc008f',
            btnTranslate: '#000',
            CurrentProgressVideo: '#0f0',
            videoDuration: '#fff',
            colorIcons: '#fff',
            textLogo: '#f00',
        },
        {
            name: 'Red',
            gradient: 'linear-gradient(135deg, #790909, #f70131)',
            textColor: '#ffffff',
            raised: '#303131',
            btnTranslate: '#000',
            CurrentProgressVideo: '#0f0',
            videoDuration: '#fff',
            colorIcons: '#fff',
            textLogo: '#f00',
        },
        {
            name: 'Raind ',
            gradient: 'linear-gradient(90deg, #3f5efb 0%, #fc466b) 100%',
            textColor: '#ffffff',
            raised: '#303131',
            btnTranslate: '#000',
            CurrentProgressVideo: '#0f0',
            videoDuration: '#fff',
            colorIcons: '#fff',
            textLogo: '#f00',
        },
        {
            name: 'Neon',
            gradient: 'linear-gradient(273deg, #ee49fd 0%, #6175ff 100%)',
            textColor: '#ffffff',
            raised: '#303131',
            btnTranslate: '#000',
            CurrentProgressVideo: '#0f0',
            videoDuration: '#fff',
            colorIcons: '#fff',
            textLogo: '#f00',
        },
        {
            name: 'Azure',
            gradient: 'linear-gradient(273deg, #0172af 0%, #74febd 100%)',
            textColor: '#00000',
            raised: '#303131',
            btnTranslate: '#000',
            CurrentProgressVideo: '#0f0',
            videoDuration: '#fff',
            colorIcons: '#fff',
            textLogo: '#f00',
        },
        {
            name: 'Butterfly',
            gradient: 'linear-gradient(273deg, #ff4060 0%, #fff16a 100%)',
            textColor: '#00000',
            raised: '#303131',
            btnTranslate: '#000',
            CurrentProgressVideo: '#0f0',
            videoDuration: '#fff',
            colorIcons: '#fff',
            textLogo: '#f00',
        },
        {
            name: 'Colombia',
            gradient:
            'linear-gradient(106deg, #fbf63f  0%, #0000bb 45%, #ff0000 99%)',
            textColor: '#ffffff',
            raised: '#303131',
            btnTranslate: '#000',
            CurrentProgressVideo: '#0f0',
            videoDuration: '#fff',
            colorIcons: '#fff',
            textLogo: '#f00',
        },
    ];

    // Create our enhancement panel
    const panel = $cl('div');

    panel.id = 'yt-enhancement-panel';

    // Generate theme options HTML
    const themeOptionsHTML = themes
      .map(
        (theme, index) => `
          <label >
            <div class="theme-option">
            <div class="theme-preview" style="background: ${theme.gradient};"></div>
            <input type="radio" name="theme" value="${index}" ${
                index === 0 ? 'checked' : ''
              }>
                <span style="${theme.name === 'Default / Reload Page' ? 'color: red; ' : '' }" class="theme-name">${theme.name}</span>
                </div>
          </label>
      `
      )
      .join('');

    // find atribute dark in dom
    const htmlElement = $e('html');
    const isDarkMode = htmlElement.hasAttribute('dark');
    let isDarkModeActive = isDarkMode;


    // Use Trusted Types to set innerHTML
    const panelHTML = policy
      ? policy.createHTML(`
        <div style="display: flex;justify-content: space-between;align-items: center;gap: 3px;margin-bottom: 10px;">
        <h4 style="display: flex;align-items: center;gap: 10px;">PK's Menu v1.0.00  <a target="_blank" href="https://github.com/LillyPK">
        <svg style="background-color: white; border-radius: 5px;color: #000;" width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" /></svg>
        </a></h4>
        <div style="display: flex; gap: 5px;">
        <span id="menu-settings-icon">⚙️</span>
        <a href="https://update.greasyfork.org/scripts/460680/Youtube%20Tools%20All%20in%20one%20local%20download%20mp3%20mp4%20HIGT%20QUALITY%20return%20dislikes%20and%20more.user.js" target="_blank" class="checked_updates">🔄️</a>
        <span style="cursor: pointer" class="close_menu_settings">❎</span>
        </div>
        </div>
          <div class="tab-buttons">
              <button class="tab-button active" data-tab="general">General</button>
              <button class="tab-button" data-tab="themes">Themes</button>
              <button class="tab-button" data-tab="sidebar">Sidebar</button>
              <button class="tab-button" data-tab="headers">Header</button>
          </div>
          <div id="general" class="tab-content active">
              <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="hide-comments-toggle"> Hide Comments
                  </label>
              </div>
               <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="hide-sidebar-toggle"> Hide Sidebar
                  </label>
              </div>
              <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="autoplay-toggle"> Disable Autoplay
                  </label>
              </div>
              <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="subtitles-toggle"> Disable Subtitles
                  </label>
              </div>
                <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="dislikes-toggle"> Show Dislikes / Reload page
                  </label>
              </div>
                <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="themes-toggle"> Active Themes / Reload page
                  </label>
              </div>

               <div class="enhancement-option">
                  <label>Video Player Size: <span id="player-size-value">100</span>%</label>
                  <input type="range" id="player-size-slider" class="slider" min="50" max="150" value="100">
              </div>
          </div>

          <div id="themes" class="tab-content" style="height: auto; max-height: 350px; overflow-y: auto;">
          <div class="themes-hidden">
          <h4>Choose a Theme</h4>
          <p>Disable cinematic Lighting</p>
                <label>
            <div class="theme-option">
            <div class="theme-preview" style="background: dark;"></div>
            <input type="radio" name="theme" value="custom">
                <span class="theme-name">Custom</span>
                </div>
                </label>
                <label>
                <div class="theme-option theme-selected-normal">
                <div class="theme-preview" style="background: dark;"></div>
                <input type="radio" name="theme" value="normal">
                    <span class="theme-name">Selected Themes</span>
                    </div>
                </label>
              <p>${isDarkModeActive ? '' : 'activate dark mode to use themes'}</p>
              <div class="themes-options">
                ${themeOptionsHTML}
              </div>
              <div class="theme-custom-options">
              <div class="enhancement-option">
                  <label>Progressbar Video:</label>
                  <input type="color" id="progressbar-color-picker" class="color-picker" value="#ff0000">
              </div>
              <div class="enhancement-option">
                  <label>Background Color:</label>
                  <input type="color" id="bg-color-picker" class="color-picker" value="#000000">
              </div>
              <div class="enhancement-option">
                  <label>Primary Color:</label>
                  <input type="color" id="primary-color-picker" class="color-picker" value="#ffffff">
              </div>
              <div class="enhancement-option">
                  <label>Secondary Color:</label>
                  <input type="color" id="secondary-color-picker" class="color-picker" value="#ffffff">
              </div>
              <div class="enhancement-option">
                  <label>Header Color:</label>
                  <input type="color" id="header-color-picker" class="color-picker" value="#000000">
              </div>
              <div class="enhancement-option">
                  <label>Icons Color:</label>
                  <input type="color" id="icons-color-picker" class="color-picker" value="#ffffff">
              </div>
              <div class="enhancement-option">
                  <label>Menu Color:</label>
                  <input type="color" id="menu-color-picker" class="color-picker" value="#000000">
              </div>
              <div class="enhancement-option">
                  <label>Line Color Preview:</label>
                  <input type="color" id="line-color-picker" class="color-picker" value="#ff0000">
              </div>
              <div class="enhancement-option">
                  <label>Time Color Preview:</label>
                  <input type="color" id="time-color-picker" class="color-picker" value="#ffffff">
              </div>
              </div>
          </div>

          </div>

          <div id="sidebar" class="tab-content">
              <h4>Available in next update</h4>
          </div>
          <div id="headers" class="tab-content">
             <h4>Available in next update</h4>
          </div>
          <div id="menu-settings" class="tab-content">
              <h4 style="margin: 10px 0">Menu Appearance</h4>
              <div class="enhancement-option">
                  <label>Menu Background Color:</label>
                  <input type="color" id="menu-bg-color-picker" class="color-picker" value="#000000">
              </div>
              <div class="enhancement-option">
                  <label>Menu Text Color:</label>
                  <input type="color" id="menu-text-color-picker" class="color-picker" value="#ff0000">
              </div>

          </div>
          <div id="import-export">
          <div style="display: flex;width: 100%;justify-content: space-between;">
          <button id="export-config" style="width: 100%;display: flex;align-items: center;justify-content: center;">Export
          <svg width="20" height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 15h6" /><path d="M12.5 17.5l2.5 -2.5l-2.5 -2.5" /></svg>
          </button>
         <button id="import-config" style="width: 100%;display: flex;align-items: center;justify-content: center;">Import
          <svg width="20"  height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M15 15h-6" /><path d="M11.5 17.5l-2.5 -2.5l2.5 -2.5" /></svg>
          </button>
          </div>
              <textarea id="config-data" placeholder="Paste configuration here to import"></textarea>
          </div>
      `)
      : `
          <div style="display: flex;justify-content: space-between;align-items: center;gap: 3px;margin-bottom: 10px;">
        <h4 style="display: flex;align-items: center;gap: 10px;">PK's Menu v0.0.00  <a target="_blank" href="https://github.com/LillyPK">
        <svg style="background-color: white; border-radius: 5px;color: #000;" width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" /></svg>
        </a></h4>
        <div style="display: flex; gap: 5px;">
        <span id="menu-settings-icon">⚙️</span>
        <a href="https://update.greasyfork.org/scripts/460680/Youtube%20Tools%20All%20in%20one%20local%20download%20mp3%20mp4%20HIGT%20QUALITY%20return%20dislikes%20and%20more.user.js" target="_blank" class="checked_updates">🔄️</a>
        <span style="cursor: pointer" class="close_menu_settings">❎</span>
        </div>
        </div>
          <div class="tab-buttons">
              <button class="tab-button active" data-tab="general">General</button>
              <button class="tab-button" data-tab="themes">Themes</button>
              <button class="tab-button" data-tab="sidebar">Sidebar</button>
              <button class="tab-button" data-tab="headers">Header</button>
          </div>
          <div id="general" class="tab-content active">
              <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="hide-comments-toggle"> Hide Comments
                  </label>
              </div>
               <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="hide-sidebar-toggle"> Hide Sidebar
                  </label>
              </div>
              <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="autoplay-toggle"> Disable Autoplay
                  </label>
              </div>
              <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="subtitles-toggle"> Disable Subtitles
                  </label>
              </div>
                <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="dislikes-toggle"> Show Dislikes / Reload page
                  </label>
              </div>
                <div class="enhancement-option">
                  <label>
                      <input type="checkbox" id="themes-toggle"> Active Themes / Reload page
                  </label>
              </div>

               <div class="enhancement-option">
                  <label>Video Player Size: <span id="player-size-value">100</span>%</label>
                  <input type="range" id="player-size-slider" class="slider" min="50" max="150" value="100">
              </div>
          </div>

          <div id="themes" class="tab-content" style="height: auto; max-height: 350px; overflow-y: auto;">
          <div class="themes-hidden">
          <h4>Choose a Theme</h4>
          <p>Disable cinematic Lighting</p>
                <label>
            <div class="theme-option">
            <div class="theme-preview" style="background: dark;"></div>
            <input type="radio" name="theme" value="custom">
                <span class="theme-name">Custom</span>
                </div>
                </label>
                <label>
                <div class="theme-option theme-selected-normal">
                <div class="theme-preview" style="background: dark;"></div>
                <input type="radio" name="theme" value="normal">
                    <span class="theme-name">Selected Themes</span>
                    </div>
                </label>
              <p>${isDarkModeActive ? '' : 'activate dark mode to use themes'}</p>
              <div class="themes-options">
                ${themeOptionsHTML}
              </div>
              <div class="theme-custom-options">
              <div class="enhancement-option">
                  <label>Progressbar Video:</label>
                  <input type="color" id="progressbar-color-picker" class="color-picker" value="#ff0000">
              </div>
              <div class="enhancement-option">
                  <label>Background Color:</label>
                  <input type="color" id="bg-color-picker" class="color-picker" value="#000000">
              </div>
              <div class="enhancement-option">
                  <label>Primary Color:</label>
                  <input type="color" id="primary-color-picker" class="color-picker" value="#ffffff">
              </div>
              <div class="enhancement-option">
                  <label>Secondary Color:</label>
                  <input type="color" id="secondary-color-picker" class="color-picker" value="#ffffff">
              </div>
              <div class="enhancement-option">
                  <label>Header Color:</label>
                  <input type="color" id="header-color-picker" class="color-picker" value="#000000">
              </div>
              <div class="enhancement-option">
                  <label>Icons Color:</label>
                  <input type="color" id="icons-color-picker" class="color-picker" value="#ffffff">
              </div>
              <div class="enhancement-option">
                  <label>Menu Color:</label>
                  <input type="color" id="menu-color-picker" class="color-picker" value="#000000">
              </div>
              <div class="enhancement-option">
                  <label>Line Color Preview:</label>
                  <input type="color" id="line-color-picker" class="color-picker" value="#ff0000">
              </div>
              <div class="enhancement-option">
                  <label>Time Color Preview:</label>
                  <input type="color" id="time-color-picker" class="color-picker" value="#ffffff">
              </div>
              </div>
          </div>

          </div>

          <div id="sidebar" class="tab-content">
              <h4>Available in next update</h4>
          </div>
          <div id="headers" class="tab-content">
             <h4>Available in next update</h4>
          </div>
          <div id="menu-settings" class="tab-content">
              <h4 style="margin: 10px 0">Menu Appearance</h4>
              <div class="enhancement-option">
                  <label>Menu Background Color:</label>
                  <input type="color" id="menu-bg-color-picker" class="color-picker" value="#000000">
              </div>
              <div class="enhancement-option">
                  <label>Menu Text Color:</label>
                  <input type="color" id="menu-text-color-picker" class="color-picker" value="#ff0000">
              </div>

          </div>
          <div id="import-export">
          <div style="display: flex;width: 100%;justify-content: space-between;">
          <button id="export-config" style="width: 100%;display: flex;align-items: center;justify-content: center;">Export
          <svg width="20" height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 15h6" /><path d="M12.5 17.5l2.5 -2.5l-2.5 -2.5" /></svg>
          </button>
         <button id="import-config" style="width: 100%;display: flex;align-items: center;justify-content: center;">Import
          <svg width="20"  height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M15 15h-6" /><path d="M11.5 17.5l-2.5 -2.5l2.5 -2.5" /></svg>
          </button>
          </div>
              <textarea id="config-data" placeholder="Paste configuration here to import"></textarea>
          </div>
      `;

    panel.innerHTML = panelHTML;
    $ap(panel);
    // Create toggle button
    const toggleButton = $cl('div');
    toggleButton.id = 'toggle-panel';
    const icon = $cl('img');
    icon.id = 'icon-menu-settings';
    icon.src =
      'https://raw.githubusercontent.com/LillyPK/image-repo/main/untitled256.png';

    toggleButton.appendChild(icon);

    // Add panel and toggle button to the page
    $ap(panel);
    $ap(toggleButton);

    // Toggle panel visibility
    let openMenu = false;
    toggleButton.addEventListener('click', () => {
      openMenu = !openMenu;
      // openMenu
      //   ? (toggleButton.style.backgroundColor = '#f00')
      //   : (toggleButton.style.backgroundColor = 'transparent');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    const close_menu_settings = $e('.close_menu_settings');
    close_menu_settings.addEventListener('click', () => {
      openMenu = !openMenu;
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });


    // Tab functionality
    const tabButtons = $m('.tab-button');
    const tabContents = $m('.tab-content');

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        tabButtons.forEach((btn) => btn.classList.remove('active'));
        tabContents.forEach((content) => content.classList.remove('active'));
        button.classList.add('active');
        $id(tabName).classList.add('active');
      });
    });

    // Menu settings icon functionality
    $id('menu-settings-icon').addEventListener('click', () => {
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabContents.forEach((content) => content.classList.remove('active'));
      $id('menu-settings').classList.add('active');
    });

    // Function to save settings
    function saveSettings() {
      const settings = {
        theme: $e('input[name="theme"]:checked').value,
        bgColorPicker: $id('bg-color-picker').value,
        progressbarColorPicker: $id('progressbar-color-picker').value,
        primaryColorPicker: $id('primary-color-picker').value,
        secondaryColorPicker: $id('secondary-color-picker').value,
        headerColorPicker: $id('header-color-picker').value,
        iconsColorPicker: $id('icons-color-picker').value,
        menuColorPicker: $id('menu-color-picker').value,
        lineColorPicker: $id('line-color-picker').value,
        timeColorPicker: $id('time-color-picker').value,
        dislikes: $id('dislikes-toggle').checked,
        themes: $id('themes-toggle').checked,
        hideComments: $id('hide-comments-toggle').checked,
        hideSidebar: $id('hide-sidebar-toggle').checked,
        disableAutoplay: $id('autoplay-toggle').checked,
        // cinematicLighting: $id('cinematic-lighting-toggle').checked,
        disableSubtitles: $id('subtitles-toggle').checked,
        // fontSize: $id('font-size-slider').value,
        playerSize: $id('player-size-slider').value,
        menuBgColor: $id('menu-bg-color-picker').value,
        menuTextColor: $id('menu-text-color-picker').value,
        // menuFontSize: $id('menu-font-size-slider').value,
      };

      GM_setValue('ytSettingsLillyPK', JSON.stringify(settings));
    }



    // Function to load settings
    function loadSettings() {
      const settings = JSON.parse(GM_getValue('ytSettingsMDCM', '{}'));
      if (settings.theme) {
        $e(`input[name="theme"][value="${settings.theme}"]`).checked = true;
      }

      $id('bg-color-picker').value = settings.bgColorPicker || '#000000';
      $id('progressbar-color-picker').value = settings.progressbarColorPicker || '#ff0000';
      $id('primary-color-picker').value = settings.primaryColorPicker || '#ffffff';
      $id('secondary-color-picker').value = settings.secondaryColorPicker || '#ffffff';
      $id('header-color-picker').value = settings.headerColorPicker || '#000';
      $id('icons-color-picker').value = settings.iconsColorPicker || '#ffffff';
      $id('menu-color-picker').value = settings.menuColorPicker || '#000';
      $id('line-color-picker').value = settings.lineColorPicker || '#ff0000';
      $id('time-color-picker').value = settings.timeColorPicker || '#ffffff';
      $id('dislikes-toggle').checked = settings.dislikes || true;
      $id('themes-toggle').checked = settings.themes || false;
      $id('hide-comments-toggle').checked = settings.hideComments || false;
      $id('hide-sidebar-toggle').checked = settings.hideSidebar || false;
      $id('autoplay-toggle').checked = settings.disableAutoplay || false;
      // $id('cinematic-lighting-toggle').checked = settings.cinematicLighting || false;
      $id('subtitles-toggle').checked = settings.disableSubtitles || false;
      // $id('font-size-slider').value = settings.fontSize || 16;
      $id('player-size-slider').value = settings.playerSize || 100;
      $id('menu-bg-color-picker').value = settings.menuBgColor || '#000000';
      $id('menu-text-color-picker').value = settings.menuTextColor || '#ffffff';
      // $id('menu-font-size-slider').value = settings.menuFontSize || 14;
      updateSliderValues();

      setTimeout(() => {
        applySettings();
        if(settings.dislikes) {
            videoDislike();
            shortDislike();
            showDislikes = true;
        }
      }, 500);
    }
    // Function to update slider values
    function updateSliderValues() {
      // $id('font-size-value').textContent = $id('font-size-slider').value;
      $id('player-size-value').textContent = $id('player-size-slider').value;
      // $id('menu-font-size-value').textContent = $id('menu-font-size-slider').value;
    }

    // Function to apply settings
    function applySettings() {
      const formulariodescarga = $e('.formulariodescarga');
      const formulariodescargaaudio = $e('.formulariodescargaaudio');
        if (formulariodescarga != undefined) {
          formulariodescarga.classList.add('ocultarframe');
          formulariodescargaaudio.classList.add('ocultarframe');
        }
      const settings = {
        theme: $e('input[name="theme"]:checked').value,
        bgColorPicker: $id('bg-color-picker').value,
        progressbarColorPicker: $id('progressbar-color-picker').value,
        primaryColorPicker: $id('primary-color-picker').value,
        secondaryColorPicker: $id('secondary-color-picker').value,
        headerColorPicker: $id('header-color-picker').value,
        iconsColorPicker: $id('icons-color-picker').value,
        menuColorPicker: $id('menu-color-picker').value,
        lineColorPicker: $id('line-color-picker').value,
        timeColorPicker: $id('time-color-picker').value,
        dislikes: $id('dislikes-toggle').checked,
        themes: $id('themes-toggle').checked,
        hideComments: $id('hide-comments-toggle').checked,
        hideSidebar: $id('hide-sidebar-toggle').checked,
        disableAutoplay: $id('autoplay-toggle').checked,
        // cinematicLighting: $id('cinematic-lighting-toggle').checked,
        disableSubtitles: $id('subtitles-toggle').checked,
        // fontSize: $id('font-size-slider').value,
        playerSize: $id('player-size-slider').value,
        menuBgColor: $id('menu-bg-color-picker').value,
        menuTextColor: $id('menu-text-color-picker').value,
        // menuFontSize: $id('menu-font-size-slider').value,
      };


      renderizarButtons();
      function isFullscreen() {
        return document.fullscreenElement !== null;
    }


    document.addEventListener("fullscreenchange", () => {
      let panel = $e('#toggle-panel');
        if (isFullscreen()) {
          panel.style.opacity = 0;
        } else {
          panel.style.opacity = 1;
        }
    });


      // Hide comments
      const commentsSection = $id('comments');
      if (commentsSection) {
        commentsSection.style.display = settings.hideComments ? 'none' : 'block';
      }

       // Active inactive Themes
       const themesMenuSection = $e('.themes-hidden');
       if (themesMenuSection) {
        themesMenuSection.style.display = settings.themes ? 'block' : 'none';
       }

      // Hide sidebar
      const sidebarSection = $id('secondary');
      if (sidebarSection) {
        sidebarSection.style.display = settings.hideSidebar ? 'none' : 'block';
      }

      // Disable autoplay
      const autoplayToggle = $e('.ytp-autonav-toggle-button');
      if (autoplayToggle) {
        const isCurrentlyOn =
          autoplayToggle.getAttribute('aria-checked') === 'true';
        if (settings.disableAutoplay && isCurrentlyOn) {
          autoplayToggle.click();
        } else if (!settings.disableAutoplay && !isCurrentlyOn) {
          autoplayToggle.click();
        }
      }
      // Disable subtitles
      const subtitleToggle = $e('.ytp-subtitles-button');
      if (subtitleToggle) {
        const isCurrentlyOn =
          subtitleToggle.getAttribute('aria-pressed') === 'true';
        if (settings.disableSubtitles && isCurrentlyOn) {
          subtitleToggle.click();
        } else if (!settings.disableSubtitles && !isCurrentlyOn) {
          subtitleToggle.click();
        }
      }
      // Disable cinematicLighting
      // const buttonSettingVideo = $e(".ytp-settings-button");
      // if(buttonSettingVideo && !settings.cinematicLighting) {
      //   buttonSettingVideo.click();
      //   setTimeout(() => {
      //     buttonSettingVideo.click();
      //   },50)
      // }


      // Adjust font size
      // $e('body').style.fontSize = `${settings.fontSize}px`;

      // Adjust player size
      const player = $e('video');
      if (player) {
        player.style.transform = `scale(${settings.playerSize / 100})`;
      }

      // Apply menu appearance settings
      $sp('--yt-enhance-menu-bg', settings.menuBgColor);
      $sp('--yt-enhance-menu-text', settings.menuTextColor);
      // $sp('--yt-enhance-menu-font-size', `${settings.menuFontSize}px`);

      // Apply theme
      const selectedTheme = themes[settings.theme];

      const isThemeCustom = $e(`input[name="theme"][value="custom"]`).checked;
      const isThemeNormal = $e(`input[name="theme"][value="normal"]`).checked;
      const themeCustomOptions = $e('.theme-custom-options');
      const themeNormal = $e('.theme-selected-normal');
      if(isThemeCustom != undefined) {
        themeNormal.style.display = "block"
        themeCustomOptions.style.display = "block";
        $e('.themes-options').style.display = "none";
      }
      if(isThemeNormal) {
        $e(`input[name="theme"][value="custom"]`).checked = false;
      }




      function checkDarkMode() {
        if(settings.themes) {
          if (isDarkMode && !isThemeCustom) {
            // Apply theme
            $e('.themes-options').style.display = "block";
            themeNormal.style.display = "none";
            themeCustomOptions.style.display = "none";
            if(settings.theme === 'normal') {
              $e(`input[name="theme"][value="0"]`).checked = true;
              // applySettings();
            } else {

              $sp('--yt-spec-base-background', selectedTheme.gradient);
              $sp('--yt-spec-text-primary', selectedTheme.textColor);
              $sp('--yt-spec-text-secondary', selectedTheme.textColor);
              $sp('--yt-spec-menu-background', selectedTheme.gradient);
              $sp('--yt-spec-icon-inactive', selectedTheme.textColor);
              $sp('--yt-spec-brand-icon-inactive', selectedTheme.textColor);
              $sp('--yt-spec-brand-icon-active', selectedTheme.gradient);
              $sp('--yt-spec-static-brand-red', selectedTheme.gradient); // line current time
              $sp('--yt-spec-raised-background', selectedTheme.raised);
              $sp('--yt-spec-static-brand-red', selectedTheme.CurrentProgressVideo);
              $sp('--yt-spec-static-brand-white', selectedTheme.textColor);
              $sp('--ytd-searchbox-background', selectedTheme.gradient);
              $sp('--ytd-searchbox-text-color', selectedTheme.textColor);

              GM_addStyle(`

                .botones_div {
                background-color: transparent;
                border: none;
                color: #999999;
                user-select: none;
              }
                .ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox {
                background:  ${selectedTheme.gradient} !important;
                }
              #background.ytd-masthead { background: ${selectedTheme.gradient}  !important; }
              .ytp-swatch-background-color {
              background: ${
                 selectedTheme.gradient
              } !important;
            }
       .ytd-shorts, #page-manager.ytd-app {
           background: ${selectedTheme.gradient};
           }
              ytd-engagement-panel-title-header-renderer[shorts-panel] #header.ytd-engagement-panel-title-header-renderer {
              background: ${selectedTheme.gradient}  !important;}
              .buttons-tranlate {
               background: ${selectedTheme.btnTranslate} !important;
              }
              .badge-shape-wiz--thumbnail-default {
              color: ${selectedTheme.videoDuration} !important;
               background: ${selectedTheme.gradient} !important;
              }
               #logo-icon {
               color:  ${selectedTheme.textLogo} !important;
            }
            .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text {
              color:  ${selectedTheme.iconsColor} !important;
            }
            .ytd-topbar-menu-button-renderer #button.ytd-topbar-menu-button-renderer {
              color:  ${selectedTheme.iconsColor} !important;
            }
            .yt-spec-icon-badge-shape--style-overlay .yt-spec-icon-badge-shape__icon {
              color:  ${selectedTheme.iconsColor} !important;
            }
            .ytp-svg-fill {
              fill:  ${selectedTheme.iconsColor} !important;
            }
            #ytp-id-30,#ytp-id-17,#ytp-id-19,#ytp-id-20{
              fill:  ${selectedTheme.iconsColor} !important;
            }


              `);
            }

          } else {
            $sp('--yt-spec-base-background', settings.bgColorPicker);
            $sp('--yt-spec-text-primary', settings.primaryColorPicker);
            $sp('--yt-spec-text-secondary', settings.secondaryColorPicker);
            $sp('--yt-spec-menu-background', settings.menuColorPicker);
            $sp('--yt-spec-icon-inactive', settings.iconsColorPicker);
            $sp('--yt-spec-brand-icon-inactive', settings.primaryColorPicker);
            $sp('--yt-spec-brand-icon-active', settings.primaryColorPicker);
            $sp('--yt-spec-raised-background', settings.headerColorPicker);
            $sp('--yt-spec-static-brand-red', settings.lineColorPicker);
            $sp('--yt-spec-static-brand-white', settings.timeColorPicker);
            $sp('--ytd-searchbox-background', settings.primaryColorPicker);
            $sp('--ytd-searchbox-text-color', settings.secondaryColorPicker);

            GM_addStyle(`

               .botones_div {
              background-color: transparent;
              border: none;
              color: ${settings.iconsColorPicker} !important;
              user-select: none;
            }
              .ytp-volume-slider-handle:before, .ytp-volume-slider-handle, .ytp-tooltip.ytp-preview:not(.ytp-text-detail){
                background-color:
              }
                #container.ytd-searchbox {
                color: red !important;
                }
              .ytp-menuitem[aria-checked=true] .ytp-menuitem-toggle-checkbox {
              background:  ${settings.primaryColorPicker} !important;
              }
              .yt-spec-icon-shape {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                color: ${settings.iconsColorPicker} !important;
            }
              .ytp-time-current, .ytp-time-separator, .ytp-time-duration {
                color: ${settings.iconsColorPicker} !important;
              }
              #background.ytd-masthead { background: ${settings.headerColorPicker}  !important; }
              .ytp-swatch-background-color {
              background: ${
                settings.progressbarColorPicker
              } !important;
            }
       .ytd-shorts, #page-manager.ytd-app {
           background: ${settings.bgColorPicker};
           }
              ytd-engagement-panel-title-header-renderer[shorts-panel] #header.ytd-engagement-panel-title-header-renderer {
              background: ${settings.bgColorPicker}  !important;}

              .badge-shape-wiz--thumbnail-default {
              color: ${settings.timeColorPicker} !important;
               background: ${settings.secondaryColor} !important;
              }
               #logo-icon {
               color:  ${settings.primaryColorPicker} !important;
            }
            .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text {
              color:  ${settings.iconsColorPicker} !important;
            }
            .ytd-topbar-menu-button-renderer #button.ytd-topbar-menu-button-renderer {
              color:  ${settings.iconsColorPicker} !important;
            }
            .yt-spec-icon-badge-shape--style-overlay .yt-spec-icon-badge-shape__icon {
              color:  ${settings.iconsColorPicker} !important;
            }
            .ytp-svg-fill {
              fill:  ${settings.iconsColorPicker} !important;
            }
            #ytp-id-30,#ytp-id-17,#ytp-id-19,#ytp-id-20{
              fill:  ${settings.iconsColorPicker} !important;
            }
              `);
          }
        } else {
            GM_addStyle(`
                .botones_div {
              background-color: transparent;
              border: none;
              color: #ccc !important;
              user-select: none;
            }
              `)
        }
      }



      checkDarkMode();
      let currentUrl = window.location.href;
      let urlCheckInterval = setInterval(function () {
        if (window.location.href !== currentUrl) {
          currentUrl = window.location.href;
          checkUrlChange();
        }
      }, 1000);

      function checkUrlChange() {
        setTimeout(() => {
          applySettings();
        }, 1000);
        clearInterval(urlCheckInterval);
      }

      let traducido; // Texto traducido
      let urlLista; // Url lista
      async function traductor() {
        const texto = $m('#content-text');
        let o = `?client=dict-chrome-ex&sl=auto&tl=${navigator.language}&q=`;
        for (let i = 0; i < texto.length; i++) {
          const botonTraducir = $cl('BUTTON');
          botonTraducir.classList.add('buttons-tranlate');
          botonTraducir.textContent = 'Translate';
          botonTraducir.setAttribute('id', `btn${i}`);
          texto[i].insertAdjacentElement('afterend', botonTraducir);
          const mdcm = $m(`.buttons-tranlate`);
          mdcm[i].onclick = function () {
            traducido = o;
            urlLista = traducido + texto[i].textContent;
            fetch('https://translate.googleapis.com/translate_a/t' + urlLista) //API
              .then((response) => response.json())
              .then((datos) => {
                texto[i].textContent = datos[0][0];
                mdcm[i].textContent = 'Translated';
              });
          };
        }
      }

      // clean buttoms dom
      function limpiarHTML(element) {
        const buttons = $m(`${element}`);
        [].forEach.call(buttons, function (buttons) {
          buttons.remove();
        });
        traductor();
      }

      window.onscroll = () => {
        const divEl = $e('#content-text');
        const divEl2 = $e(
          'ytd-item-section-renderer[static-comments-header] #contents'
        );
        if (divEl != undefined || divEl2 != undefined) {
          limpiarHTML('.buttons-tranlate');
        }
      };


      const targetNode = $e('body');

      if (targetNode != undefined) {
        const element = $e('ytd-item-section-renderer[static-comments-header] #contents');
        if(element != undefined) {
          const observerElementDom = (elem) => {
            const observer = new IntersectionObserver(entries => {

                if(entries[0].isIntersecting) {

                  element.style.background = `${selectedTheme.gradient}`;
                } else {return}
            })

            return observer.observe($e(`${elem}`))

          }
          observerElementDom('ytd-item-section-renderer[static-comments-header] #contents')
        }
      }
      saveSettings();
    }

    let validoBotones = true;
    function renderizarButtons() {
      const addButton = $e('.style-scope .ytd-watch-metadata');
      const addButton2 = $e('#contents');

      if (addButton != undefined && validoBotones) {
          validoBotones = false;
          const isVisible = !!(
            addButton.offsetWidth ||
            addButton.offsetHeight ||
            addButton.getClientRects().length
          );
          if (isVisible) {
            addButton.insertAdjacentHTML("beforebegin", menuBotones);
          } else if (addButton2 != undefined) {
            addButton.insertAdjacentHTML("beforebegin", menuBotones);
          }
      }

        // Formulario de botones para descargar
        const formulariodescarga = $e(
          '.formulariodescarga'
        );
        const formulariodescargaaudio = $e(
          '.formulariodescargaaudio'
        );
        const framedescarga = $e('#descargando');
        const framedescargamp3 = $e('#descargandomp3');
        if (formulariodescarga && formulariodescargaaudio) {
          formulariodescarga.addEventListener('click', (e) => {
            e.preventDefault();
          });
          formulariodescargaaudio.addEventListener('click', (e) => {
            e.preventDefault();
          });
        }
        const btn1mp4 = $e('.btn1');
        const btn2mp3 = $e('.btn2');
        const btn3cancel = $e('.btn3');
        const selectcalidades = $e('.selectcalidades');
        const selectcalidadesaudio = $e(
          '.selectcalidadesaudio'
        );

        if(selectcalidades != undefined) {
          selectcalidades.addEventListener('change', (e) => {
            framedescarga.src = `https://loader.to/api/button/?url=${window.location.href}&f=${e.target.value}&color=0af`;
            framedescarga.classList.remove('ocultarframe');
          });

        }

        if(selectcalidadesaudio != undefined) {
          selectcalidadesaudio.addEventListener('change', (e) => {
            framedescargamp3.src = `https://loader.to/api/button/?url=${window.location.href}&f=${e.target.value}&color=049c16`;
            // console.log(e.target.value)
            framedescargamp3.classList.remove('ocultarframeaudio');
          });
        }

        if (btn3cancel != undefined) {
          btn3cancel.onclick = () => {
            formulariodescarga.style.display = 'none';
            formulariodescargaaudio.style.display = 'none';
          };
        }

        if (btn1mp4 != undefined) {
          btn1mp4.onclick = () => {
            selectcalidades.classList.remove('ocultarframe');
            framedescarga.classList.add('ocultarframe');
            formulariodescarga.classList.remove('ocultarframe');
            formulariodescarga.style.display = '';
            selectcalidadesaudio.classList.add('ocultarframeaudio');
            formulariodescargaaudio.classList.add('ocultarframe');
            formulariodescarga.reset();
          };
        }

        if (btn2mp3 != undefined) {
          btn2mp3.onclick = () => {
            formulariodescargaaudio.classList.remove('ocultarframe');
            formulariodescarga.classList.add('ocultarframe');
            framedescargamp3.classList.remove('ocultarframeaudio');
            formulariodescargaaudio.style.display = '';
            selectcalidadesaudio.classList.remove('ocultarframeaudio');
            framedescargamp3.classList.add('ocultarframeaudio');
            formulariodescargaaudio.reset();
          };
        }

        // Invertir contenido

        // const background_image = $e('#background_image');
        // const color_bg = $e('#color_bg');
        // const alertShown = localStorage.getItem('alertShown');
        // const alertShownBg = localStorage.getItem('alertShownBg');
        // if (!alertShown) {
        //   color_bg.addEventListener('change', () => {
        //     alert('disable cinematic mode in the video');
        //     localStorage.setItem('alertShown', true);
        //   });
        // }
        // if (!alertShownBg) {
        //   background_image.addEventListener('input', () => {
        //     alert('disable cinematic mode in the video');
        //     localStorage.setItem('alertShownBg', true);
        //   });
        // }



        const btnImagen = $e('#imagen');
        const formularioButtons = $e('#eyes');
        const invertirVista = $e('#invertir');

        const reverse = $e('#columns');

        let countViewRow = 0; // Count
        if (invertirVista != undefined) {
          invertirVista.onclick = () => {
            countViewRow += 1;
            switch (countViewRow) {
              case 1:
                reverse.style.flexDirection = 'row-reverse';
                break;
              case 2:
                reverse.style.flexDirection = 'row';
                countViewRow = 0;
                break;
            }
          };
        }

        // valido modo oscuro y venta de video
        // Repeat video button
        let countRepeat = 0; // count
        const repeat = $e('#repeatvideo'); // Repeat button
        const imarepeat = $e('.icon-tabler-repeat'); // img repeat
        const videoFull = $e(
          '#movie_player > div.html5-video-container > video'
        );
        if(repeat != undefined) {

          repeat.onclick = () => {
            if (
              $e('#cinematics > div') != undefined ||
              videoFull != undefined
            ) {
              countRepeat += 1;
              setInterval(() => {
                switch (countRepeat) {
                  case 1:
                    document
                      .querySelector(
                        '#movie_player > div.html5-video-container > video'
                      )
                      .setAttribute('loop', 'true');
                    imarepeat.innerHTML = `  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-repeat-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M4 12v-3c0 -1.336 .873 -2.468 2.08 -2.856m3.92 -.144h10m-3 -3l3 3l-3 3"></path>
                        <path d="M20 12v3a3 3 0 0 1 -.133 .886m-1.99 1.984a3 3 0 0 1 -.877 .13h-13m3 3l-3 -3l3 -3"></path>
                        <path d="M3 3l18 18"></path>
                     </svg> `; // img repeat
                    break;
                  case 2:
                    countRepeat = 0;
                    document
                      .querySelector(
                        '#movie_player > div.html5-video-container > video'
                      )
                      .removeAttribute('loop');
                    imarepeat.innerHTML = ` <svg  xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-repeat" width="24"
                        height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path>
                        <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"></path>
                      </svg>`;
                    break;
                }
              }, 1000);
            }
            }
        }

        // Background transparent

        const cinematica = $e('#cinematics > div');
        if (cinematica != undefined) {
          cinematica.style =
            'position: fixed; inset: 0px; pointer-events: none; transform: scale(1.5, 2)';
        }
        const btnReset = $e('#reset_button'); // Reset button
        if (btnReset != undefined) {
          btnReset.addEventListener('click', function () {
            if (localStorage.getItem('colores') != null) {
              localStorage.removeItem('colores');
              $e('#ojosprotect').style.backgroundColor =
                'transparent';
              setTimeout(() => {
                location.reload();
              }, 400);
            }
          });
        }

        if (btnImagen != undefined) {
          btnImagen.onclick = () => {
            if (
              $e('#cinematics > div') != undefined ||
              videoFull != undefined
            ) {
              const parametrosURL = new URLSearchParams(window.location.search);
              let enlace = parametrosURL.get('v');

              // Construir la URL de la imagen
              const imageUrl = `https://i.ytimg.com/vi/${enlace}/maxresdefault.jpg`;

              // Realizar la solicitud para obtener la imagen
              fetch(imageUrl)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.blob();
                })
                .then((blob) => {
                  // Obtener el tamaño de la imagen en kilobytes
                  const imageSizeKB = blob.size / 1024;

                  // Verificar si el tamaño de la imagen es menor o igual a 20 KB
                  if (imageSizeKB >= 20) {
                    window.open(
                      `https://i.ytimg.com/vi/${enlace}/maxresdefault.jpg`,
                      'popUpWindow',
                      'height=500,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes'
                    );
                    // Crear una URL para la imagen
                    const imageUrlObject = URL.createObjectURL(blob);

                    // Crear un enlace para descargar la imagen
                    const enlaceDescarga = $cl('a');
                    enlaceDescarga.href = imageUrlObject;
                    const titleVideo = $e(
                      'h1.style-scope.ytd-watch-metadata'
                    ).innerText;
                    enlaceDescarga.download = `${titleVideo}_maxresdefault.jpg`;

                    // Simular un clic en el enlace para iniciar la descarga
                    enlaceDescarga.click();

                    // Limpiar la URL del objeto después de la descarga
                    URL.revokeObjectURL(imageUrlObject);
                  } else {
                    console.log(
                      'La imagen no excede los 20 KB. No se descargará.'
                    );
                  }
                })
                .catch((error) => {
                  alert('No found image');
                  console.error('Error al obtener la imagen:', error);
                });
            }
          };
        }
        // for background image file photo higt quality
        // const fileInput = document.getElementById('background_image');
        // const backgroundDiv = $e('ytd-app');

        // const storedImage = localStorage.getItem('backgroundImage');
        // if (storedImage) {
        //   backgroundDiv.style = `background-size: contain; background-repeat: repeat; background-image: url(${storedImage}) !important`;
        // }

        // fileInput.addEventListener('change', (event) => {
        //   const file = event.target.files[0];
        //   if (file) {
        //     const reader = new FileReader();
        //     reader.onload = function (e) {
        //       const imageUrl = e.target.result;
        //       localStorage.setItem('backgroundImage', imageUrl);
        //       backgroundDiv.style.backgroundImage = `url(${imageUrl})`;
        //     };
        //     reader.readAsDataURL(file);
        //   }
        // });


        const externalLink = $e('.external_link');
        if (externalLink != undefined) {
          externalLink.onclick = () => {
            const parametrosURL = new URLSearchParams(window.location.search); // Url parametros
            let enlace;
            enlace = parametrosURL.get('v');
            window.open(
              `https://www.y2mate.com/es/convert-youtube/${enlace}`,
              'popUpWindow',
              'height=800,width=1000,left=50%,top=100,resizable=no,scrollbars=yes,toolbar=no,menubar=yes,location=no,directories=yes, status=no'
            );
          };
        }
        const viewExternalLink = $e('.view_external_link');
        if (viewExternalLink != undefined) {
          viewExternalLink.onclick = () => {
            $e('video').click();
            const parametrosURL = new URLSearchParams(window.location.search); // Url parametros
            let enlace;
            enlace = parametrosURL.get('v');
            window.open(
              `https://www.youtube.com/embed/${enlace}?rel=0&controls=2&color=white&iv_load_policy=3&showinfo=0&modestbranding=1&autoplay=1`
            );
          };
        }
        const viewPictureToPicture = $e(
          '.video_picture_to_picture'
        );
        if (viewPictureToPicture != undefined) {
          viewPictureToPicture.onclick = () => {
            const video = $e('video');
            // Verifica si el navegador admite Picture-in-Picture
            if ('pictureInPictureEnabled' in document) {
              // Verifica si el video aún no está en modo Picture-in-Picture
              if (!document.pictureInPictureElement) {
                // Intenta activar el modo Picture-in-Picture
                video
                  .requestPictureInPicture()
                  .then(() => {
                    // El video está ahora en modo Picture-in-Picture
                  })
                  .catch((error) => {
                    console.error(
                      'Error al activar el modo Picture-in-Picture:',
                      error
                    );
                  });
              } else {
                // video picture
              }
            } else {
              alert('Picture-in-Picture not supported');
            }
          };

          // Filtro de pantalla
          if (formularioButtons != undefined) {
            formularioButtons.addEventListener('input', function () {
              if (
                $e('#cinematics > div') != undefined ||
                videoFull != undefined
              ) {
                $e('#ojosprotect').style.backgroundColor =
                  formularioButtons.value;
              }
            });
          }
          clearInterval(renderizarButtons);
        }

        const checked_updates = $e('.checked_updates');

        if (checked_updates != undefined) {
          checked_updates.onclick = () => {
            window.open(
              `https://github.com/LillyPK/PK-s-tool`
            );
          };
        }

        const screenShotVideo = $e('.screenshot_video');
        if (screenShotVideo != undefined) {
          screenShotVideo.onclick = () => {
            const video = $e('video');
            const canvas = $cl('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imagenURL = canvas.toDataURL('image/png');
            const enlaceDescarga = $cl('a');
            enlaceDescarga.href = imagenURL;
            const titleVideo = $e(
              'h1.style-scope.ytd-watch-metadata'
            ).innerText;
            enlaceDescarga.download = `${video.currentTime.toFixed(
              0
            )}s_${titleVideo}.png`;
            enlaceDescarga.click();
          };
        } else {
          const containerButtons = $e('.containerButtons');

          if (containerButtons != undefined) {
            containerButtons.innerHTML = '';
          }
        }
        clearInterval(renderizarButtons);
      }




    console.log('Script modded by: LillyPK  LillyPK');
    const HEADER_STYLE = 'color: #F00; font-size: 24px; font-family: sans-serif;';
    const MESSAGE_STYLE = 'color: #00aaff; font-size: 16px; font-family: sans-serif;';
    const CODE_STYLE = 'font-size: 14px; font-family: monospace;';

    console.log(
      '%cPKs Tools\n' +
        '%cRun %c(v2.2.90)\n' +
        'By: LillyPK.',
      HEADER_STYLE,
      CODE_STYLE,
      MESSAGE_STYLE
    );





    // Add event listeners to all inputs
    const inputs = $m('input');
    inputs.forEach((input) => {
      input.addEventListener('change', applySettings);
      if (input.type === 'range') {
        input.addEventListener('change', () => {
          updateSliderValues();
          applySettings();
        });
      }
    });

    // Export configuration

  //   Settings saved
  //   const settings = GM_getValue('ytSettingsLillyPK', '{}');
  //   $id('config-data').value = settings;

    $id('export-config').addEventListener('click', () => {
      const settings = GM_getValue('ytSettingsLillyPK', '{}');
      $id('config-data').value = settings;
      const configData = settings;
      try {
        JSON.parse(configData); // Validate JSON
        GM_setValue('ytSettingsLillyPK', configData);
        alert('Configuration export successfully!');
      } catch (e) {
        alert('Invalid configuration data. Please check and try again.');
      }
    });
    // Import configuration
    $id('import-config').addEventListener('click', () => {
      const configData = $id('config-data').value;
      try {
        JSON.parse(configData); // Validate JSON
        GM_setValue('ytSettingsLillyPK', configData);
        alert('Configuration imported successfully!');
        window.location.reload();
      } catch (e) {
        alert('Invalid configuration data. Please check and try again.');
      }
    });
    panel.style.display = 'none'; // Ensure panel is hidden on load

    // Load saved settings
    // Visible element DOM
    function checkElement(selector, callback) {
      const interval = setInterval(() => {
        if ($e(selector)) {
          clearInterval(interval);

          callback();
        }
      }, 100);
    }

    checkElement('ytd-topbar-menu-button-renderer', loadSettings);

  })();

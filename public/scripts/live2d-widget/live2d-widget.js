/// Made by 张书樵 (Zhang Shuqi) https://github.com/stevenjoezhang/live2d-widget

/// live2d_path 参数建议使用绝对路径
const live2d_path = 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/';

/// 封装异步加载资源的方法
function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
        let tag;
        if (type === 'css') {
            tag = document.createElement('link');
            tag.rel = 'stylesheet';
            tag.href = url;
        } else if (type === 'js') {
            tag = document.createElement('script');
            tag.src = url;
        };
        if (tag) {
            tag.onload = () => resolve(url);
            tag.onerror = () => reject(url);
            document.head.appendChild(tag);
        };
    });
};

/// 加载 waifu.css live2d.min.js waifu-tips.js
if (screen.width >= 768) {
    Promise.all([
        loadExternalResource('index.scss', 'css'),
        loadExternalResource(live2d_path + 'live2d.min.js', 'js'),
        loadExternalResource(live2d_path + 'waifu-tips.js', 'js')
    ]).then(() => {
        /// 配置选项的具体用法见 README.md
        initWidget({
            waifuPath: '/scripts/live2d-widget/waifu-tips.json',
            ///apiPath: 'https://live2d.fghrsh.net/api/',
            cdnPath: 'https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/',
            tools: ['asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit']
        });
        let elementWaifuToggle = document.getElementById('waifu-toggle');
        elementWaifuToggle.innerHTML = 'SHOW';
        if (document.getElementById('waifu-tool') === null) {
            elementWaifuToggle.click();
        };
        let elementLive2DMove = document.createElement('span');
        elementLive2DMove.id = 'waifu-tool-switch-side';
        elementLive2DMove.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                <path d='M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z'/>
            </svg>
        `;
        elementLive2DMove.onclick = () => {
            let elementWaifu = document.getElementById('waifu');
            elementWaifu.classList.toggle('waifu-right-side');
        };
        document.getElementById('waifu-tool').prepend(elementLive2DMove);
        let elementWaifu = document.getElementById('waifu');
        elementWaifu.style.visibility = 'hidden';
        window.dispatchEvent(new CustomEvent('script loaded', {
            'detail': {
                name: 'live2d'
            }
        }));
    });
};

console.log(`
  く__,.ヘヽ.        /  ,ー､ 〉
           ＼ ', !-─‐-i  /  /´
           ／｀ｰ'       L/／｀ヽ､
         /   ／,   /|   ,   ,       ',
       ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
        ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
          !,/7 '0'     ´0iソ|    |
          |.从"    _     ,,,, / |./    |
          ﾚ'| i＞.､,,__  _,.イ /   .i   |
            ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
              | |/i 〈|/   i  ,.ﾍ |  i  |
             .|/ /  ｉ：    ﾍ!    ＼  |
              kヽ>､ﾊ    _,.ﾍ､    /､!
              !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
              ﾚ'ヽL__|___i,___,ンﾚ|ノ
                  ﾄ-,/  |___./
                  'ｰ'    !_,.:
`);
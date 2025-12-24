//
// 这是最终优化版的、完整的 cusdis.es.js 文件
// 修复了回复评论的缩进样式和 Email 隐私提示的显示问题
//

window.CUSDIS = {};

const makeIframeContent = (target) => {
  const host = target.dataset.host || "https://cusdis.com";
  const iframeJsPath = target.dataset.iframe || `${host}/js/iframe.umd.js`;
  const cssPath = `/cusdis/cusdis.style.css`;

  return `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="${cssPath}">
    <base target="_parent" />
    <script>
      window.CUSDIS_LOCALE = ${JSON.stringify(window.CUSDIS_LOCALE)}
      window.__DATA__ = ${JSON.stringify(target.dataset)}
    <\/script>
    <style>
      :root { color-scheme: light; }
      body, #root {
        background-color: #fff !important; 
        color: #374151 !important;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
        
      html{ padding:1.5rem;}
      @media  (max-width: 991px) {
        html{ padding:0rem;}
      }
   
      /* --- 通用输入框样式 --- */
      textarea[name="reply_content"],
      input[name="nickname"],
      input[name="email"] {
        background-color: #fff !important;
        border: 1px solid #ccc !important;
        color: #374151 !important;
        border-radius: 0.5rem !important;
        padding: 0.5rem 1rem !important;
        transition: all 0.2s ease-in-out;
        width: 100% !important;
         box-sizing: border-box;
         font-size:0.9rem;
      } 
      textarea[name="reply_content"]:focus,
      input[name="nickname"]:focus,
      input[name="email"]:focus {
        border-color: #EF4444 !important;
        box-shadow: 0 0 0 2px rgba(229, 70, 70, 0.5) !important;
        outline: none !important;
      }
      ::placeholder { color: #9CA3AF !important; opacity: 1; }

      /* --- 输入框图标 --- */
       .grid-cols-2 > div { position: relative; }
      input[name="nickname"], input[name="email"] { padding-left: 2rem !important; }
       .grid-cols-2 > div::before {
        content: ''; position: absolute; left: 0.75rem; top: 50%;
        transform: translateY(-50%); width: 1rem; height: 1rem;
        background-repeat: no-repeat; background-position: center;
        background-size: contain; opacity: 0.6;
      }
      div:has(> input[name="nickname"])::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%239CA3AF'%3E%3Cpath fill-rule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clip-rule='evenodd' /%3E%3C/svg%3E");
      }
      div:has(> input[name="email"])::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%239CA3AF'%3E%3Cpath d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' /%3E%3Cpath d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' /%3E%3C/svg%3E");
      }
     textarea[name="reply_content"] { min-height: 240px; resize: vertical; }

      /* --- 信任感与易用性 (隐私提示) --- */
      #privacy-notice {
          font-size: 0.75rem; color: #9CA3AF; padding: 0.5rem 0.5rem 0;
      }

      /* --- 提交按钮样式 --- */
      button.submit-btn {
        background-color: #EF4444 !important; color: #FFFFFF !important;
        border-radius: 0.375rem !important; font-weight: 600 !important;
        padding: 0.6rem 1.5rem !important; border: none !important;
        cursor: pointer; transition: all 0.2s ease-in-out;
      }
      button.submit-btn:hover { background-color: #EF4444 !important; transform: translateY(-2px); }
       
      /* --- 评论区布局 --- */
       .my-4 {
        padding: 1.5rem 12px !important; border-top: 1px solid #ccc !important;
      }
       .my-4 .flex.items-center,  .my-4 .text-gray-500.text-sm {
        display: inline-block !important; vertical-align: baseline;
      }
       .my-4 .flex.items-center { margin-right: 0.75rem; }
       .my-4 .text-gray-500.text-sm { font-size: 0.8rem !important; color: #9CA3AF !important; }
       .my-4 .text-gray-500.my-2 { margin-top: 0.5rem !important; padding-left: 0.5rem !important; }
       .my-4 button[type="button"] {
        background: none !important; border: none !important; padding: 0.25rem 0.5rem !important; margin-left: -0.5rem;
        color: #9CA3AF !important; font-size: 0.875rem !important; font-weight: 500 !important;
        border-radius: 0.25rem; cursor: pointer; transition: color 0.2s, background-color 0.2s;
      }
       .my-4 button[type="button"]:hover { background-color: #374151 !important; color: #FFFFFF !important; }

      /* --- 优化 1: 回复评论的缩进和引导线样式 --- */
      /* Cusdis 会用一个 div 包裹所有回复 */
       .my-4 > div:not([class]) {
        margin-top: 1rem;
        padding-left: 0.5rem; /* 主要的缩进距离 */
        position: relative;
      } 
      /* --- 反馈分类 --- */
      #feedback-categories {
        margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;
      }
      .category-btn {
        background-color: #F9FAFB; color: #374151; border: 1px solid #ccc;
        padding: 0.3rem 0.8rem; border-radius: 9999px; font-size: 0.8rem;
        cursor: pointer; transition: all 0.2s ease-in-out;
      }
      .category-btn.active {
        background-color: #EF4444; color: #FFFFFF; border-color: #EF4444;
      }

      .category-btn:hover {
        background-color: #EF4444; color: #FFFFFF; border-color: #EF4444;
      }

      /* --- 空状态 --- */
      #empty-state {
        text-align: center; padding: 3rem 1rem; border: 2px dashed #374151;
        border-radius: 0.5rem; margin-top: 2rem;
      }
      #empty-state svg {
        width: 48px; height: 48px; margin: 0 auto 1rem; color: #4B5563;
      }
      #empty-state p { font-size: 1rem; color: #9CA3AF; }

      /* --- 清理多余元素 --- */
       a[href="https://cusdis.com"],  label { display: none !important; }
    </style>
  </head>
  <body>
     <div id="feedback-categories">
        <button class="category-btn" data-category="Bug Report">Bug Report</button>
        <button class="category-btn" data-category="Feature Request">Feature Request</button>
        <button class="category-btn" data-category="General Feedback">General Feedback</button>
    </div>
    
    <div id="root"></div>

    <div id="privacy-notice-template" style="display: none;">
        <p id="privacy-notice">Your email will not be displayed publicly.</p>
    </div>

    <div id="empty-state-template" style="display: none;">
        <div id="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.494.033.99.064 1.485.093v-2.825M15 14.477a48.51 48.51 0 00-6-.272M6 21l-3.228-3.228M21 21l-3.228-3.228m0 0a3.007 3.007 0 00-4.243-4.243c-1.171 1.171-1.171 3.07 0 4.243zM3.18 9.305a48.45 48.45 0 0112.082-2.17M18.18 5.162a48.45 48.45 0 01-12.082 2.17m12.082-2.17L15 2.25m3.18 2.912l2.316-2.316m0 0a3.007 3.007 0 014.243 4.243c-1.171 1.171-3.07 1.171-4.243 0zM8.25 6.75h.008v.008H8.25V6.75z" /></svg>
            <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
    </div>
    
    <script src="${iframeJsPath}" type="module"><\/script>
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const nicknameInput = document.querySelector('input[name="nickname"]');
        const emailInput = document.querySelector('input[name="email"]');
        const replyContent =document.querySelector('textarea[name="reply_content"]');
        nicknameInput.placeholder = 'Nickname  ';
        emailInput.placeholder = 'Email (optional)';
        replyContent.placeholder = 'We are all ears! Please leave your valuable feedback, feature request, or detailed issue here.';

  let userFeedbackText = '';
        categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const textarea = document.querySelector('textarea[name="reply_content"]');
      if (!textarea) return;

      // 2. 更新当前激活的按钮
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const category = button.dataset.category;
      
      // 3. 将新选择的分类标签和存储的用户文本组合起来
      textarea.value = category + ': ' + userFeedbackText;
      textarea.focus();
    });
  });

        const observer = new MutationObserver((mutations, obs) => {

const textarea = document.querySelector('textarea[name="reply_content"]');
    if (textarea && !textarea.dataset.inputListenerAttached) {
      textarea.addEventListener('input', () => { 
        userFeedbackText = textarea.value.replace(/^(?:\[[^\]]+\]:\s*)+/, '').trim();
      });
      textarea.dataset.inputListenerAttached = 'true';
    }

          const form = document.querySelector('.grid.grid-cols-1');
          if (!form) return;

          const nicknameInput = document.querySelector('input[name="nickname"]');
          const emailInput = document.querySelector('input[name="email"]');
        
          if (nicknameInput && emailInput) {
            // 找到表单的最外层容器
            const formContainer = nicknameInput.closest('.grid.grid-cols-2');
            if (formContainer && !document.getElementById('privacy-notice')) {
                const noticeTemplate = document.getElementById('privacy-notice-template');
                if (noticeTemplate) formContainer.insertAdjacentHTML('afterend', noticeTemplate.innerHTML);
            }

            nicknameInput.value = localStorage.getItem('cusdis_nickname') || '';
            emailInput.value = localStorage.getItem('cusdis_email') || '';
            nicknameInput.addEventListener('input', (e) => localStorage.setItem('cusdis_nickname', e.target.value));
            emailInput.addEventListener('input', (e) => localStorage.setItem('cusdis_email', e.target.value));
          }

          const replyButtons = document.querySelectorAll(' .my-4 button[type="button"]');
          replyButtons.forEach(button => {
            if (button.dataset.replyHandlerAttached) return;
            button.dataset.replyHandlerAttached = 'true';
            button.addEventListener('click', (e) => {
              const commentCard = e.target.closest('.my-4');
              const author = commentCard.querySelector('.font-medium').textContent;
            
            });
          });
          const commentList = document.querySelector('.mt-4.px-1');
          const hasComments = commentList && commentList.querySelector('.my-4');
          if (commentList && !hasComments && !document.getElementById('empty-state')) {
              const emptyTemplate = document.getElementById('empty-state-template');
              if (emptyTemplate) commentList.innerHTML = emptyTemplate.innerHTML;
          }
          
          const submitBtn = form.querySelector('button[class*="font-bold"]');
          if(submitBtn) submitBtn.classList.add('submit-btn');
        });

        observer.observe(document.getElementById('root'), {
          childList: true,
          subtree: true
        });
      });
    <\/script>
  </body>
</html>`;
};

let singleTonIframe;
function createIframe(target) {
  if (!singleTonIframe) {
    singleTonIframe = document.createElement("iframe");
    listenEvent(singleTonIframe, target);
  }
  singleTonIframe.srcdoc = makeIframeContent(target);
  singleTonIframe.style.width = "100%";
  singleTonIframe.style.border = "0";
  singleTonIframe.style.height = "500px";
  return singleTonIframe;
}

function postMessage(event, data) {
  if (singleTonIframe) {
    singleTonIframe.contentWindow.postMessage(
      JSON.stringify({
        from: "cusdis",
        event,
        data
      })
    );
  }
}

function listenEvent(iframe, target) {
  const lightModeQuery = window.matchMedia("(prefers-color-scheme: light)");
  const onMessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.from === "cusdis") {
        switch (msg.event) {
          case "onload":
            {
              if (target.dataset.theme === "auto") {
                postMessage(
                  "setTheme",
                  lightModeQuery.matches ? "light" : "light"
                );
              }
            }
            break;
          case "resize":
            {
              iframe.style.height = msg.data + "px";
            }
            break;
        }
      }
    } catch (e2) { }
  };
  window.addEventListener("message", onMessage);
  function onChangeColorScheme(e) {
    const islightMode = e.matches;
    if (target.dataset.theme === "auto") {
      postMessage("setTheme", islightMode ? "light" : "light");
    }
  }
  lightModeQuery.addEventListener("change", onChangeColorScheme);
  return () => {
    lightModeQuery.removeEventListener("change", onChangeColorScheme);
    window.removeEventListener("message", onMessage);
  };
}



function render(target) {
  if (target) {
    target.innerHTML = "";
    const iframe = createIframe(target);
    target.appendChild(iframe);
  }
}

window.renderCusdis = render;
window.CUSDIS.renderTo = render;

window.CUSDIS.setTheme = function (theme) {
  postMessage("setTheme", theme);
};

function initial() {
  let target;
  if (window.cusdisElementId) {
    target = document.querySelector(`#${window.cusdisElementId}`);
  } else if (document.querySelector("#cusdis_thread")) {
    target = document.querySelector("#cusdis_thread");
  } else if (document.querySelector("#cusdis")) {
    console.warn(
      "id `cusdis` is deprecated. Please use `cusdis_thread` instead"
    );
    target = document.querySelector("#cusdis");
  }

  if (window.CUSDIS_PREVENT_INITIAL_RENDER === true);
  else {
    if (target) {
      render(target);
    }
  }
}

window.CUSDIS.initial = initial;
initial();





window.addEventListener('load', function () {
  const currentPath = window.location.pathname;

  // 检查路径是否以 '/feedback.html' 结尾
  if (!currentPath.endsWith('/feedback.html')) {
    return; // 如果不是目标页面，则提前退出，不执行后续逻辑
  }

  const threadContainer = document.getElementById('cusdis_thread');


  if (!threadContainer) return;

  let iframe = threadContainer.querySelector('iframe');

  if (!iframe) {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          iframe = threadContainer.querySelector('iframe');
          if (iframe) {
            observer.disconnect();
            setupIframeResizer(iframe);
          }
        }
      });
    });

    observer.observe(threadContainer, { childList: true });
  } else {
    setupIframeResizer(iframe);
  }
});

function setupIframeResizer(iframe) {
  function resizeIframe() {
    try {
      let scrollHeight = iframe.contentWindow.document.body.scrollHeight;

      iframe.style.height = scrollHeight + 50 + 'px';
    } catch (e) {
      console.warn('无法读取 Cusdis iframe 内容高度 (跨域限制):', e);
    }
  }

  iframe.onload = resizeIframe;

  if (iframe.contentWindow.document.body) {
    const contentObserver = new MutationObserver(resizeIframe);
    contentObserver.observe(iframe.contentWindow.document.body, {
      subtree: true,
      attributes: true,
      childList: true,
      characterData: true
    });
  }

  window.addEventListener('resize', resizeIframe);
}


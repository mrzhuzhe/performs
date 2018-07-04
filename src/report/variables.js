import { send } from '../send';

// share in file scope
var sharedTipElement;

var styleTip = `
.perf-feedback-tip {
  color: #324057;
  position: fixed;
  bottom: 16px;
  left: 16px;
  background-color: white;
  border: 1px solid #dedede;
  font-size: 12px;
  padding: 8px 16px;
  font-family: PingFang SC,Lantinghei SC,Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,Microsoft Sans Serif,WenQuanYi Micro Hei,sans;
  border-radius: 4px;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  max-width: 200px;
  min-width: 20px;
  width: auto;
  transition-duration: 400ms;
}`;

var tipTemplate = `
  <style>
    ${styleTip}
    .perf-feedback-guide {}
    .perf-feedback-report {
      text-decoration: none;
      color: #1D8CE0;
    }
    .perf-feedback-close {
      text-decoration: none;
      color: #1D8CE0;
    }
  </style>
  <span class="perf-feedback-guide">页面显示不正常?</span>
  <a class="perf-feedback-report" href="#">反馈问题</a>
  <a class="perf-feedback-close" href="#">关闭提示</a>
`;

var successTemplate = `
  <style>
    ${styleTip}
    .perf-feedback-success {
      color: #8492A6;
    }
  </style>
  <span class="perf-feedback-success">反馈已提交</span>
`;

function closeTip(event) {
  sharedTipElement.parentNode.removeChild(sharedTipElement);
}

// function feedback(event) {
//   sharedTipElement.parentNode.removeChild(sharedTipElement)
// }

function reportUndefinedVars(undefinedVars) {
  send('event', {
    id: 2, // registered in God
    name: 'undefined-variables',
    data: [undefinedVars]
  });
}

function renderSuccess() {
  sharedTipElement.innerHTML = successTemplate;
  setTimeout(closeTip, 2000);
}

function addTip(undefinedVars) {
  var tipContainer = document.createElement('div');
  tipContainer.className = 'perf-feedback-tip';
  tipContainer.innerHTML = tipTemplate;
  var closeEl = tipContainer.getElementsByClassName('perf-feedback-close')[0];
  var reportEl = tipContainer.getElementsByClassName('perf-feedback-report')[0];
  reportEl.onclick = function(event) {
    reportUndefinedVars(undefinedVars);
    renderSuccess();
  };
  closeEl.onclick = closeTip;
  document.body.appendChild(tipContainer);
  // expose to scope
  sharedTipElement = tipContainer;
}

export function checkVariables(variables) {
  // return if not checking variables
  if (variables.length === 0) {
    return;
  }

  var undefinedVars = variables.filter(function(x) {
    return window[x] == null;
  });

  if (undefinedVars.length > 0) {
    // only show once in a session
    try {
      var storageKey = 'perf-undefined-variables';
      if (sessionStorage.getItem(storageKey) === '1') return;
      sessionStorage.setItem(storageKey, '1');
    } catch (error) {}

    addTip(undefinedVars);
  }
}

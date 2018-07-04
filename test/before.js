
window.PERF_DEBUG = function(message) {
  console.log('Send message:', message);
};

document.body.insertAdjacentHTML('afterbegin',
  `<div id="click-demo" perf-click="click/demo" perf-id="1" pref-data="{&quot;a&quot;:1}">click me</div>`
);


describe('window.perf.send', () => {
  it('shoud be function', () => {
    expect(window.perf.send).to.a('function');
  });
});

describe('send', () => {

  beforeEach(function () {
    sinon.spy(window, 'PERF_DEBUG');
  });

  afterEach(function () {
    window.PERF_DEBUG.restore();
  });

  it('should be called on click', (done) => {
    var target = document.getElementById('click-demo');
    // console.log('Target', target);
    target.click();
    // var evt = document.createEvent('CustomEvent');
    // evt.initCustomEvent('click', false, false, null);
    setTimeout(() => {
      expect(window.PERF_DEBUG.calledOnce).to.be.true;
      done();
    }, 1000);
  });

});

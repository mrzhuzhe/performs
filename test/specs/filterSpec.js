var filter = window.ElemePerfConfigs.etraceApiFilter;

describe('etraceApiFilter matches', () => {
  it('should match ele.me', () => {
    expect(filter.test('http://h5.ele.me')).to.be.true;
  });

  it('should match elenet.me', () => {
    expect(filter.test('http://h5.elenet.me')).to.be.true;
  });

  it('should not match UBT address', () => {
    expect(
      filter.test(
        'https://crayfish.elemecdn.com/perf.js@json/sdk-config/h5.ele.me'
      )
    ).to.be.false;
  });

  it('should match absolute path', () => {
    expect(filter.test('/config')).to.be.true;
  });

  it('should match double leading slashes', () => {
    expect(filter.test('//h5.ele.me')).to.be.true;
  });

  it('should not match double leading slashes', () => {
    expect(filter.test('//github.com/eleme')).to.be.false;
  });
});

import { sharedResources } from './shared-resources';

describe('sharedResources', () => {
  it('should work', () => {
    expect(sharedResources()).toEqual('shared-resources');
  });
});

module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    const blueprint = this;
    const requiredBowerPackages = [
      ['pusher', '3.1.0'],
      ['pusher-test-stub', '1.0.0'],
      ['socket.io-client', '^1.7.2'],
      ['action-cable', '^5.0.0'],
    ];

    return Promise.all(requiredBowerPackages.map((pkg) => {
      const [name, version] = pkg;
      return blueprint.addBowerPackageToProject(name, version);
    }));
  },
};

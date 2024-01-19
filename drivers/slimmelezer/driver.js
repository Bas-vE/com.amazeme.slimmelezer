'use strict';

const { Driver } = require('homey');

class SlimmeLezerDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    //this.log('SlimmeLezer driver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    this.log('SlimmeLezerDriver searching mDNS for devices names "slimmelezer"');
    const discoveryStrategy = this.getDiscoveryStrategy();
    const discoveryResults = discoveryStrategy.getDiscoveryResults();

    const devices = Object.values(discoveryResults).map(discoveryResult => {
      return {
        name: discoveryResult.name,
        data: {
          id: discoveryResult.id,
          address: discoveryResult.address
        },
      };
    });
    return devices;
  }

}

module.exports = SlimmeLezerDriver;

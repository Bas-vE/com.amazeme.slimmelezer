'use strict';

const { Device } = require('homey');

class SlimmeLezerDevice extends Device 
{

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() 
  {
    var address = this.getData().address;
    var self = this;
    //this.log('SlimmeLezer on address: '+ address + ' has been initialized');

    //setting all capabilities to 0
    this.setCapabilityValue('meter_power',0);
    this.setCapabilityValue('meter_gas',0);
    this.setCapabilityValue('measure_power',0);

    //create an eventsource that listens to the slimmemeter events
    var EventSource = require('eventsource')
    var es = new EventSource('http://' + address + '/events')
    es.addEventListener('state', function (e) 
    {
      //parse the json data and only get the parts we need to use
      var obj = JSON.parse(e.data);
      switch(obj.id)
      {
        case 'sensor-power_consumed':
          self.setCapabilityValue('measure_power.consumed',obj.value*1000);
          self.setCapabilityValue('measure_power',obj.value*1000);
          break;
        case 'sensor-power_produced':
          self.setCapabilityValue('measure_power.produced',obj.value*1000);
          break;
      }


    })
  }
 
  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() 
  {
    this.log('SlimmeLezer device has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) 
  {
    this.log('SlimmeLezer device settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) 
  {
    this.log('SlimmeLezer device was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() 
  {
    this.log('SlimmeLezer device has been deleted');
  }
  

}

module.exports = SlimmeLezerDevice;

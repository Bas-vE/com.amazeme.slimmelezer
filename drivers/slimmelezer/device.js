'use strict';

const { Device } = require('homey');
const EventSource = require('eventsource');
const { timeEnd } = require('console');

class SlimmeLezerDevice extends Device 
{
  // Define class fields
  eventsource;
  
  // onInit is called when the device is initialized.
  async onInit() 
  {
    var address = this.getData().address;
    var self = this;

    var produced = 0;
    var consumed = 0;

    this.log('SlimmeLezer on address: ' + address + ' has been initialized');

    this.connect(address);
  }
 
  // connect is called to start the listener for data from the device
  connect(address)
  {
    var self = this;

    var produced = 0;
    var consumed = 0;

    //create an eventsource that listens to the slimmemeter events
    this.eventsource = new EventSource('http://' + address + '/events');
    this.eventsource.addEventListener('state', function (e) 
    {
      //parse the json data and only get the parts we need to use
      var obj = JSON.parse(e.data);
      switch(obj.id)
      {
        case 'sensor-power_consumed':
          consumed = obj.value*1000
          self.setCapabilityValue('measure_power.consumed',consumed);
          self.setCapabilityValue('measure_power', consumed - produced);
          break;
        case 'sensor-power_produced':
          produced = obj.value*1000;
          self.setCapabilityValue('measure_power.produced',produced);
          self.setCapabilityValue('measure_power', consumed - produced);
          break;
        case 'sensor-energy_consumed_tariff_1':
          self.setCapabilityValue('meter_power.T1',obj.value);
          break;
        case 'sensor-energy_consumed_tariff_2':
          self.setCapabilityValue('meter_power.T2',obj.value);
          break;
        case 'sensor-gas_consumed':
          self.setCapabilityValue('meter_gas',obj.value);
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

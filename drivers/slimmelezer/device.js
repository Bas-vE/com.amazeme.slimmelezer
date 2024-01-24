'use strict';

const { Device } = require('homey');
const { timeEnd } = require('console');

class SlimmeLezerDevice extends Device 
{
  // Define class fields
  eventsource;
  meterData = 
  {
    PowerConsumed:0,
    PowerConsumedPhase1:0,
    PowerConsumedPhase2:0,
    PowerConsumedPhase3:0,
    PowerProduced:0,
    PowerProducedPhase1:0,
    PowerProducedPhase2:0,
    PowerProducedPhase3:0,
    GasConsumed:0,
    GasConsumedBe:0,
    EnergyConsumedT1:0,
    EnergyConsumedT2:0,
    EnergyConsumedL:0,
    EnergyProducedT1:0,
    EnergyProducedT2:0,
    EnergyProducedL:0,
    VoltagePhase1:0,
    VoltagePhase2:0,
    VoltagePhase3:0,
    CurrentPhase1:0,
    CurrentPhase2:0,
    CurrentPhase3:0
  };
  
  // onInit is called when the device is initialized.
  async onInit() 
  {
    var self = this;
    var address = this.getData().address;
    var apiAddress = 'http://'+ address + '/sensor/';

    this.log('SlimmeLezer on address: ' + address + ' has been initialized');

    setInterval(async () => {
      self.meterData.PowerConsumed = await this.GetData(apiAddress + 'power_consumed');
      self.meterData.PowerConsumedPhase1 = await this.GetData(apiAddress + 'power_consumed_phase_1');
      self.meterData.PowerConsumedPhase2 = await this.GetData(apiAddress + 'power_consumed_phase_2');
      self.meterData.PowerConsumedPhase3 = await this.GetData(apiAddress + 'power_consumed_phase_3');

      self.meterData.PowerProduced = await this.GetData(apiAddress + 'power_produced');
      self.meterData.PowerProducedPhase1 = await this.GetData(apiAddress + 'power_produced_phase_1');
      self.meterData.PowerProducedPhase2 = await this.GetData(apiAddress + 'power_produced_phase_2');
      self.meterData.PowerProducedPhase3 = await this.GetData(apiAddress + 'power_produced_phase_3');

      self.meterData.GasConsumed = await this.GetData(apiAddress + 'gas_consumed');
      self.meterData.GasConsumedBe = await this.GetData(apiAddress + 'gas_consumed_belgium');

      self.meterData.EnergyConsumedL = await this.GetData(apiAddress + 'energy_consumed_luxembourg');
      self.meterData.EnergyConsumedT1 = await this.GetData(apiAddress + 'energy_consumed_tariff_1');
      self.meterData.EnergyConsumedT2 = await this.GetData(apiAddress + 'energy_consumed_tariff_2');

      self.meterData.EnergyProducedL = await this.GetData(apiAddress + 'energy_produced_luxembourg');
      self.meterData.EnergyProducedT1 = await this.GetData(apiAddress + 'energy_produced_tariff_1');
      self.meterData.EnergyProducedT2 = await this.GetData(apiAddress + 'energy_produced_tariff_2');

      self.meterData.VoltagePhase1 = await this.GetData(apiAddress + 'voltage_phase_1');
      self.meterData.VoltagePhase2 = await this.GetData(apiAddress + 'voltage_phase_2');
      self.meterData.VoltagePhase3 = await this.GetData(apiAddress + 'voltage_phase_3');

      self.meterData.CurrentPhase1 = await this.GetData(apiAddress + 'current_phase_1');
      self.meterData.CurrentPhase2 = await this.GetData(apiAddress + 'current_phase_2');
      self.meterData.CurrentPhase3 = await this.GetData(apiAddress + 'current_phase_3');

      this.UpdateCapabilites();
    }, 2000);

  }

  UpdateCapabilites()
  {
    this.setCapabilityValue('measure_power.produced',this.meterData.PowerProduced*1000);
    this.setCapabilityValue('measure_power.consumed',this.meterData.PowerConsumed*1000);
    this.setCapabilityValue('measure_power', (this.meterData.PowerConsumed - this.meterData.PowerProduced)*1000);

    this.setCapabilityValue('meter_power.T1',this.meterData.EnergyConsumedT1);
    this.setCapabilityValue('meter_power.T2',this.meterData.EnergyConsumedT2);

    this.setCapabilityValue('meter_gas',this.meterData.GasConsumed);
  }

  // REST Get for getting the data from the sensor
  async GetData(address)
  {
    try 
    {
      const res = await fetch(address);    
      var data = await res.json();
      
      if(data.value == null)
      {
        return 0;
      }

      return data.value;
    } 
    catch (err) 
    {
      console.log(err.message); //can be console.error
    }
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

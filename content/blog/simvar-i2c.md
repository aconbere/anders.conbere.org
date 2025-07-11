+++
title = "Using i2c With Simavr"
date = "2020-12-23"
+++

This will run your avr program and start gdb listening on 1234
    ~/simavr/simavr/run_avr -m attiny85 -f 8000000 -g ~/Projects/attiny85-example/build/main.elf

    gdb
    > file main.elf
    > target remote :1234
    > load

to set a break point

    > b loop
    > c

Use these commands to display variables every break point
    > display state
    > display /t PORTB
    > display /t PINB

## Using i2c with avrsim

The example in `board_i2c` uses the `i2c_eeprom` library provided to operate as a simple read and write source. 

    // initialize our 'peripheral', setting the mask to allow read and write
    i2c_eeprom_init(avr, &ee, 0xa0, 0x01, NULL, 1024);
    i2c_eeprom_attach(avr, &ee, AVR_IOCTL_TWI_GETIRQ(0));
    ee.verbose = 1;

Then in the firmware they write to the eeprom as a secondary i2c device. The way it works is that when the the start address is in write mode, the eeprom device waits for two bytes to define an internal pointer to where to write the data.

In this case we start with the write bit set so the eeprom will wait for the pointer to be received: 0x01AA.

    i2c_start(EEPROM_ADDR + I2C_WRITE);
    // eeprom address, in little endian
    i2c_write(0xaa);
    i2c_write(0x01);


We then send bytes and the eeprom records them until it recieves stop.

    i2c_write(0xd0);
    i2c_write(0x0d);
    i2c_stop();


Then we send start again and send a new pointer index of 0x01A8, 2 bits less than our initial starting position (representing 2 bytes).

    i2c_start(EEPROM_ADDR + I2C_WRITE);

Finally we start a third time in read mode and this triggers the eeprom device to begin writing bytes starting that that position and increasing after that. Subsequent reads read 0xD00D until the stop command is issued.

    i2c_start (EEPROM_ADDR + I2C_READ);
    for (uint8_t i = 0; i < 8; ++i) {
      i2c_readNak();
    };
    i2c_stop();

Notes:
* [Sim AVR](https://github.com/buserror/simavr)
* [Sparkfun Article on I2c](https://learn.sparkfun.com/tutorials/i2c/all#:~:text=The%20Inter%2DIntegrated%20Circuit%20(I,communications%20within%20a%20single%20device)
* [ATtiny85 manual](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-2586-AVR-8-bit-Microcontroller-ATtiny25-ATtiny45-ATtiny85_Datasheet.pdf)
* [i2c info](https://i2c.info/)
* [Understanding the i2 Bus](https://www.ti.com/lit/an/slva704/slva704.pdf?ts=1608665248724&ref_url=https%253A%252F%252Fwww.google.com%252F)
* [Debugging ATtiny85 Code](https://blog.oddbit.com/post/2019-01-22-debugging-attiny-code-pt-1/)
* [GDB Reference: display command](https://visualgdb.com/gdbreference/commands/display)
* [Attiny85 Uart](http://www.technoblogy.com/show?RPY)
* [StackOverflow on the topic](https://arduino.stackexchange.com/questions/22898/how-to-design-and-debug-a-custom-i2c-master-slave-system)

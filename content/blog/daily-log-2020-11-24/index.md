---
title: "Daily Log 2020-11-24"
date: 2020-11-24
---

## Connectors

I hate connectors. Every time I have to select connectors for a project it's a pain. On my current project I need 4 wire inputs: VCC, GND, and two I2C communication wires. As this is the same layout as the sparkfun QWIIC system I figured it would be nice to make the connectors compatible. They use a 4 pin JST SH connector, this should be easy!

Unfortunately Mouser doesn't carry JST connectors (but digikey does). The [housing](https://www.digikey.com/en/products/detail/SHR-04V-S-B/455-1379-ND/759868?itemSeq=345975521) was easy enough to find and showed up as the first search result. Unfortunately searching for the model number. On the other hand searching for the header model number from the datasheet returns a discontinued product. Going sideways and searching through JST SH products brings up the correct listing. On top of this all the headers are over 50c a piece.

At least I already own a crimper that should work... *sigh*.

## Finished Schematic

With the footprints all worked out I've finally finished the fully schematic. With that done it will be time to layout the PCB.

<img src="relay-full-schematic.png">

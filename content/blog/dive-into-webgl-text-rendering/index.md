---
title: Dive Into WebGL Text Rendering
date: 2023-01-30
---

As part of learning how to build applications in WebGL + WASM I wanted to get a better understanding of the state of text rendering. My previous experiences working with OpenGL suggested that it's relatively easy to get some text drawn to the screen but it's much harder to get text that looks great. This article is an attempt to document both the current state of text rendering in WebGL but also techniques for implementing text rendering.

Resources:
* [Warp: Adventures in Text Rendering](https://www.warp.dev/blog/adventures-text-rendering-kerning-glyph-atlases)
* [Servo: Text Rendering](https://github.com/servo/webrender/blob/master/webrender/doc/text-rendering.md)
* [Alacritty: Text Renderer](https://github.com/alacritty/alacritty/tree/master/alacritty/src/renderer/text)
* [Egui: Text Renderer](https://github.com/emilk/egui/tree/master/crates/epaint/src/text)
* [ab-glyph](https://github.com/alexheretic/ab-glyph)
* [rusttype](https://github.com/redox-os/rusttype)

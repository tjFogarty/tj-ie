---
title: "Swatcher"
description: "A web app for browsing paints available in Ireland. Find, browse and organise your paint projects."
date: 2023-08-12
layout: layouts/project.njk
projectUrl: "https://swatcher.ie"
coverPreview: "/projects/swatcher/home.png"
technologies:
  - "Vue"
  - "Netlify"
  - "Node"
  - "Tailwind"
  - "Firebase"
  - "TypeScript"
tags:
  - "colour tools"
  - "productivity"
---

Swatcher is a free web application where you can browse, find, and organise paints available in Ireland. You can also generate palettes using AI to kickstart your ideas.

## Key Features

### Quick Colour Sampling
- **Colour picker and capture from your camera**: Sample colors from your environment to find the closest available match
- **AI palette generation**: Provide a prompt of the scene you want, and get back paint colours for interiors
- **Brand exploration**: Browse nearly 8,000 paint colours by brand to find the paint you want


### Colour Management
- **Organised projects**: Create projects and add your paint colours to them
- **Favourites**: Save your favourites that you can pull into projects
- **Export options**: Export your colour palettes to multiple web formats
- **Accessibility**: Each generated palette comes with a contrast checker for accessibility on the web

## Technical Implementation

### Architecture
The app is built with Vue, and implements smart caching to keep things snappy.

- **Vue and Pinia**: Reactive state means everything you do is instantly available
- **Firebase**: Log in and store favourites, projects and palettes to access no matter where you are
- **Paint database**: Instant access to nearly 8,000 paint colours from many brands available in Ireland

### Colour Science
Swatcher implements accurate color space conversions and supports multiple color models:

- **Closest matches**: By comparing different colours, we can find the difference between them and return the closest available matches to a colour you provide, along with some alternatives
- **Complementary colours**: Find suitable complementary colours to enhance your project, or get new ideas

## User Experience

### Performance
Optimised for daily use:

- **Responsive UI**: Works on mobile to desktop across devices
- **Caching**: Anything you view is stored locally for your current session, so no need to wait as you revisit pages

## Development Journey

This project started as a personal tool to explore generating colour palettes with AI. It grew from there to an interior design-focused app that draws on paint brands available in Ireland.

Key challenges included:
- **Colour accuracy**: Ensuring paint colours match with the brands website
- **Performance optimization**: Maintaining responsiveness during intensive operations
- **User interface**: Balancing feature richness with simplicity
- **Color vs Colour**: Writing code means using "color" when in readable text we write "colour", it's a constant battle

The app has evolved based on user feedback and real-world usage patterns, with regular updates adding new features while maintaining the core philosophy of simplicity and reliability.

---
title: "Fixing MS Edge Battery Drain on M1 Mac"
description: "Edge was destroying the battery life on my Macbook Air M1"
date: 2022-09-17T10:23:00+01:00
permalink: "/fix-edge-battery-drain-m1-mac/"
layout: layouts/post.njk
---

I've been using Microsoft Edge for a while now, and it was going well up until a month or so ago. I don't know why, or what changed, but my laptop was heating up and the battery was draining much quicker than before. I want to say twice as quick, or thereabouts.

After keeping an eye on the activity monitor, I saw Edge was the culprit. Some searching revealed that __"Microsoft Defender SmartScreen"__ tends to increase the CPU usage, so disabling that sorted it out.

No idea why it was only acting up recently, but I'm happy to have my battery back.
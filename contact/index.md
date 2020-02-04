---
layout: layouts/post.njk
title: Contact
---

If you have any questions, or just want to say hi, feel free to drop me a message via the form below. I’ll get back to you as soon as I can.

Alternatively, you can {% external-link "https://twitter.com/tj_fogarty", "find me on Twitter" %}, or send me an email at <a href="mailto:contact@tj.ie">contact@tj.ie</a>

<form method="post" action="/contact-thanks/" accept-charset="UTF-8" name="contact" netlify>

  <label for="name">Your Name</label>
  <input id="name" type="text" name="name" value="">

  <label for="email">Your Email (required)</label>
  <input id="email" type="email" name="email" value="" required>

  <label for="subject">Subject</label>
  <input id="subject" type="text" name="subject" value="">

  <label for="message">Message (required)</label>
  <textarea rows="10" cols="40" id="message" name="message" required></textarea>

  <button type="submit" value="Send">Send</button>
</form>

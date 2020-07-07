---
title: "Use AppleScript to Automate with iTerm"
date: 2018-02-19T21:52:00+00:00
permalink: "/use-applescript-to-automate-with-iterm/"
layout: layouts/post.njk
---

Sometimes when you're working on a project, be it work or personal, you might only be running a command in the terminal like <code>npm run dev</code>. Other times it might be a bit more involved. Maybe you have a local server running in one tab with another tab to run webpack and finally another one open for you to tap in your git commits.

This gives us an opportunity for automation if you find yourself doing this often. Let's imagine the above scenario where we want to run a server, webpack and keep a tab free for other once-off commands that we might want to run like git.

To get started, we'll need to open Script Editor from Applications > Utilities > Script Editor. We'll use this blank canvas to line up some instructions. **Note:** this assumes iTerm is already running.


``` applescript
tell application "iTerm"
    tell the current window

    end tell
end tell
```

With this we grab the currently running instance of iTerm and focus in on the current window that's running.

Next we'll create a new tab and run some commands. This will set a variable for the tab that we can interact with and run with the default profile. If you have other profiles set up with iTerm you can specify it here instead.

What's nice as well is we can tell iTerm to split into panes so we don't get overrun with tabs.


``` applescript
tell application "iTerm"
    tell the current window
        set appTasks to create tab with profile "Default"

        tell the appTasks
            tell the current session
                set name to "App"
                write text "cd ~/Code/my-app"
                write text "node index.js"

                set webpack to split horizontally with default profile
                tell webpack
                    write text "cd ~/Code/my-app"
                    write text "npm run dev"
                end tell
            end tell
        end tell

        set freeTab to create tab with profile "Default"

        tell freeTab
            tell the current session
                set name to "Free"
                write text "cd ~/Code/my-app"
            end tell
        end tell
    end tell
end tell
```

You could also use this to launch it with your code editor of choice, so if you're rocking Visual Studio Code you could update the last block to be:


``` applescript
tell freeTab
  tell the current session
    set name to "Free"
    write text "cd ~/Code/my-app"
    write text "code ."
  end tell
end tell
```

Once you're ready to go, you can click the play button in the toolbar of Script Editor to kick everything off. When you're happy with the result you can save the script and the next time you launch Script Editor you'll be able to choose it and run it again.

I've found this fairly useful for work where there might be multiple apps and services that need to be run in parallel. 


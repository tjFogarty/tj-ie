---
title: "Getting Started with WordPress and Unit Testing"
date: 2015-07-10T00:00:00+01:00
permalink: "/getting-started-with-wordpress-and-unit-testing/"
layout: layouts/post.njk
tags:
    - php
    - wordpress
---

Recently, I've begun working on a project built with WordPress. One of the requirements involves writing tests and outputting a report.

In this post, I hope to show how I've set up the project to utilise PHPUnit and `WP_UnitTestCase`. I've had minimal exposure to PHPUnit in the past, so I was delighted to start learning more.

Hey, you might read this and know a better way! Feel free to leave a comment.

## Setup

You'll need an install of WordPress. This might be an existing project, or a fresh install. {% external-link "http://wp-cli.org/", "WP-CLI" %} is a very handy tool for quickly setting this up, but it'll also do many, many other things for you that I won't cover here e.g. {% external-link "http://wp-cli.org/commands/db/export/", "exporting a database" %}, and even {% external-link "http://wp-cli.org/commands/plugin/install/", "installing plugins" %}.

Next up, you'll need {% external-link "https://getcomposer.org/", "Composer" %} installed. I'm using this to install PHPUnit globally with the command `composer global require "phpunit/phpunit=4.7.*`. You can verify the successful installation with `phpunit --version` in your terminal provided you have Composer packages added to your path. (To do this, see this {% external-link "http://akrabat.com/global-installation-of-php-tools-with-composer/", "useful post" %}.)

Within the root of your WordPress project you'll need to run `svn co http://develop.svn.wordpress.org/trunk/tests/phpunit/includes/`.
This integrates with PHPUnit to make writing our tests a little easier. Want to create a post? `$this->factory->post->create()`. Want to create 30 posts? `$this->factory->post->create_many(30)`. This goes for posts, users, comments, categories; anything you might need to generate. You can {% external-link "https://core.trac.wordpress.org/browser/trunk/tests/phpunit/includes/factory.php", "browse the source" %} to learn more about it.

This doesn't <em>have</em> to be in the root of your project, but this just happens to be where I've set up mine. You should now see an `includes` folder in your project root.

You'll need a `phpunit.xml` file in your root to specify some configuration. It'll tell PHPUnit which files to use for it's tests.


``` xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit
    bootstrap="./tests/bootstrap.php"
    backupGlobals="false"
    colors="true"
    convertErrorsToExceptions="true"
    convertNoticesToExceptions="true"
    convertWarningsToExceptions="true">
    <testsuites>
        <testsuite>
            <directory prefix="test-" suffix=".php">./tests/</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

What this is saying is it's looking for a folder called `tests` and a file called `bootstrap.php`. This is what will kick it all off, and `<directory prefix="test-" suffix=".php">` says that test files begin with `test-` and have the extension of `.php`. So go ahead and create that `tests` folder and `bootstrap.php`.

For starters, here's what your bootstrap file might look like -


``` php
<?php

require_once dirname( dirname( __FILE__ ) ) . '/includes/functions.php';

function _manually_load_environment() {
    // Add your theme
    switch_theme('your-theme');

    // Update array with plugins to include ...
    $plugins_to_active = array(
        'some-plugin/some-plugin.php',
        'another-plugin/another-plugin.php'
    );

    update_option( 'active_plugins', $plugins_to_active );
}
tests_add_filter( 'muplugins_loaded', '_manually_load_environment' );

require dirname( dirname( __FILE__ ) ) . '/includes/bootstrap.php';
```

What we're doing here is setting up some initial state for our tests. I'm setting the theme and the plugins that I want to be active, and that's about it.

Now, what are we going to test on? We'll need to create an empty database in order to run our tests against.
Create a file called `wp-tests-config.php` in the root of your project. It'll contain information regarding your test database which you'll need to create.


``` php
<?php

/* Path to the WordPress codebase you'd like to test. Add a backslash in the end. */
define( 'ABSPATH', dirname( __FILE__ ) . '/' );

// Test with multisite enabled.
// Alternatively, use the tests/phpunit/multisite.xml configuration file.
// define( 'WP_TESTS_MULTISITE', true );

// Force known bugs to be run.
// Tests with an associated Trac ticket that is still open are normally skipped.
// define( 'WP_TESTS_FORCE_KNOWN_BUGS', true );

// Test with WordPress debug mode (default).
define( 'WP_DEBUG', true );

// ** MySQL settings ** //

// This configuration file will be used by the copy of WordPress being tested.
// wordpress/wp-config.php will be ignored.

// WARNING WARNING WARNING!
// These tests will DROP ALL TABLES in the database with the prefix named below.
// DO NOT use a production database or one that is shared with something else.

define( 'DB_NAME', 'test_db' );
define( 'DB_USER', 'user' );
define( 'DB_PASSWORD', 'password' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

$table_prefix  = 'wptests_';   // Only numbers, letters, and underscores please!

define( 'WP_TESTS_DOMAIN', 'custom-domain.dev' );
define( 'WP_TESTS_EMAIL', 'test@domain.com' );
define( 'WP_TESTS_TITLE', 'Test Blog' );

define( 'WP_PHP_BINARY', 'php' );

define( 'WPLANG', '' );
```

No more set up, let's start writing tests!

## Creating Tests

So now you have this `tests` directory with a lonely `bootstrap.php` file sitting in it. Let's give it some company with a simple test to see if the active theme is the one we set in that bootstrap file.

Create a new file called `test-active-theme.php` and put in the following:


``` php
<?php

    class TestActiveTheme extends WP_UnitTestCase {
        /**
         * Test that the correct theme is active (set in bootstrap.php)
         */
        function testCorrectActiveTheme() {
            $this->assertTrue('your-theme' == wp_get_theme());
        }
    }
```

Have a look there and you'll see we're extending `WP_UnitTestCase`. This affords us some useful perks in that when we run our tests it re-creates the database for a fresh WordPress install.

---

Success! In your own tests, you can access your regular WordPress functions, and your active plugin classes/functions. You might even include some Composer packages to mock your data (like {% external-link "https://github.com/fzaninotto/Faker", "Faker" %}).

See the {% external-link "https://phpunit.de/documentation.html", "PHPUnit documentation" %} for more information on the tests you can run, and how you can {% external-link "https://phpunit.de/manual/current/en/textui.html", "export" %} the results.

For further reading, have a look at the {% external-link "https://core.trac.wordpress.org/browser/trunk/tests/phpunit/tests", "tests written for WordPress Core" %}.

Happy testing!

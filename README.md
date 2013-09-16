chameleon
=========

Chameleon - javascript library to automatically change the site design.


How use it?

Siple example

    // create instance of chameleon
    var ch = new Chameleon();
    
    // create rule
    var rule = ch.createRule({files:["new.css"], from:ch.craeteDate(0, 12, 16, 9, 2013), to:ch.createDate(0, 0, 17, 9, 2013)});
    
    // add rule
    ch.addRule("new", rule);
    
    // run the chameleon
    ch.run();

It creates a rule that from 12:00 16.09.2013 to 17.09.2013 will be used css file new.css.

It have next function:

createDate(minute, hour, day, month, year). You can use * or /number instead of minute, hour, day, month, year. It work like params in cron

createRule(params) - create rule

params is object. It have next properties:

    *   files - array of css files
    *   excludes - array of css files which won't replace when rule execute
    *   date - when you want specify one date, you need use it property
    *   from - date of the start of period
    *   to - date of the end of period
    *   function - function which execute before replace of css files
    *   callback - function which execute after replace of css files

addRule(name, rule) - it add rule to Chameleon

run() - it run chameleon

stop(name) - stop rule with name like "name", if you specify name like "all", it stop all rules

execute(name) - execute rule with name like "name"

removeRule(name) - remove rule with name like "name", if you specify name like "all", it remove all rules

setFrequency(second) - sets the frequency to check for the availability of the rules
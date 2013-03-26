jsCache
=======

Simple javascript cache data on client browser.
Storage system using HTML5 localStorage and <s>cookies</s>


Method
------
`jscache.init(conf)`

Constructor.

`jscache.get(key)`

get value based on key.


`jscache.set(key, value, [time])`

set value onto data storage with specific key using expired time, if expired time is empty, default expired time (1 week) will be used.


`jscache.del(key)`

Delete data on storage with specific key was offered.


`jscache.flush()`

Remove all data on storage <s>based on prefix key</s>.


`jscache.getLastError()`

Return last error message.

`jscache.setConfig(config, value)`

Set config on the way.

Example
-------
```
<script type="text/javascript" src="jscache.js">
// initialize object with expired time 10 minutes
var cache = new jscache({time:10);

// set data with key using default expired time.
cache.set('key', 'value');

// set data with expired time (one day).
cache.set('new', 'new value', 60*24);

// show data
console.log(cache.get('new'));
</script>
```

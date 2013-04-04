jsCache
=======

Simple javascript cache data on client browser.
Storage system using HTML5 localStorage and <s>cookies</s>


Method
------
`jscache(conf)`

Init jscache with conf

`jscache(conf).get(key)`

get value based on key.


`jscache(conf).set(key, value, [time])`

set value onto data storage with specific key using expired time, if expired time is empty, default expired time (1 week) will be used.


`jscache(conf).del(key)`

Delete data on storage with specific key was offered.


`jscache(conf).flush()`

Remove all data on storage <s>based on prefix key</s>.


`jscache(conf).lastError`

Return last error message.


Example
-------
```
<script type="text/javascript" src="jscache.js">
    // initialize object with expired time 10 minutes
    var cache = jscache({expired:10});

    // set data with key using default expired time.
    cache.set('key', 'value');

    // set data with expired time (one day).
    cache.set('new', 'new value', 60*24);

    // show data
    console.log(cache.get('new'));
</script>
```

Another method to use jscache
```
<script type="text/javascript" src="jscache.js">
    // set default prefix, and expired.
    jscache.prefix = 'default-prefix-for-jscache';
    jscache.expired = 60; 
    
    // get value based on default prefix.
    var value = jscache().get('key');
    var value1 = jscache().get('key1');
    
    // get value with spesific prefix
    var otherValue = jscache('new-prefix').get('key')
    
    // flush cache with default prefix
    jscache().flush();
</script>
```

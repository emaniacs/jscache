jscache
=======

Simple javascript cache data on client browser.
Storage system using HTML5 localStorage as default.


Default configuration
------------------------------
`jscache.prefix = 'jscache';`

`jscache.expired = 3600; // in seconds`

`jscache.storage = window.localStorage // other options use window.sessionStorage`

Changelog
---------
* v0.2  01 Jan 2014
    - expired time now is human readable.
    - delete item in cache now always return undefined.
    - set storage with an object if localStorage or sessionStorage not supported by browser
* v0.1

Method
------

- **jscache(conf)**

    Init jscache with conf

    _Return:_ cache object



- **jscache(conf).get(key)**

    get value based on key.

    _Return:_ value based on key or null. (jscache.storage.getItem)



- **jscache(conf).set(key, value, [time])**

    set value onto data storage with specific key using expired time, if expired time is empty, default expired time will be used.

    _Return:_ true on success or false otherwise.



- **jscache(conf).del(key)**

    Delete data on storage with specific key was offered.

    _Return:_ undefined



- **jscache(conf).flush()**

    Remove all data on storage <s>based on prefix key</s>.

    _Return:_ total item was deleted.



- **jscache.lastError**
    
    _Return:_ last error message.


Example
-------
```
<script type="text/javascript" src="jscache.js"><script>
<script type="text/javascript">
    // initialize object with expired time 10 minutes
    var cache = jscache({expired:'10m'});

    // set data with key using default expired time.
    cache.set('key', 'value');

    // set data with expired time (one day).
    cache.set('new', 'new value', '24h');

    // show data
    console.log(cache.get('new'));
</script>
```

Another method to use jscache
```
<script type="text/javascript" src="jscache.js"></script>
<script type="text/javascript">
    // set default prefix, and expired and use window.sessionStorage as storage.
    jscache.prefix = 'default-prefix-for-jscache';
    jscache.expired = '1m'; 
    jscache.storage = window.sessionStorage
    
    // get value based on default prefix.
    var value = jscache().get('key');
    var value1 = jscache().get('key1');
    
    // get value with spesific prefix
    var otherValue = jscache('new-prefix').get('key')
    
    // flush cache with default prefix
    jscache().flush();
</script>
```

Using another storage
```
<script type="text/javascript" src="jscache.js"></script>
<script type="text/javascript">
    function myStorage() {
        this.getItem = function(key){
            return this[key] || undefined;
        };
        
        this.setItem = function(key,val){
            this[key] = val;
        };
        
        this.removeItem = function(key){
            delete this[key];
        }
    };
    
    // set default prefix, and expired and use window.sessionStorage as storage.
    jscache.prefix = 'default-prefix-for-jscache';
    jscache.storage = new myStorage();
    
    // get value based on default prefix.
    var value = jscache().get('key');
    var value1 = jscache().get('key1');
    
    // get value with spesific prefix
    var otherValue = jscache('new-prefix').get('key')
    
    // flush cache with default prefix
    jscache().flush();
</script>
```

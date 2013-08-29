/**
 * jscache: Simple javascript cache data on client browser.
 * http://github.com/emaniacs/jscache
 * 
 * Copyright 2012, Novi Ardi
 * @e_maniacs <noone.nu1@gmail.com>
 * Released under BSD and GPL Licenses.
 * 
 * 
 * Thu Sep 27 12:21:15 WIT 2012
 * @TODO: expired time in human-readable (s for second, m for minutes, h for hour).
 */

(function (window, undefined){
    var defaultStorage = {};
    
    // check storage.
    if (window.localStorage) {
        defaultStorage = window.localStorage;
    }
    else if(window.sessionStorage) {
        defaultStorage = window.sessionStorage;
    }
    else {
        var myStorage = function() {
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
        defaultStorage = new myStorage();
    };
    
    var jscache = function (conf) {
        return new init(conf);
    };
    
    // :BEGIN obj
    // return by init()
    var obj = function () {};
    obj.p = obj.prototype;
    obj.p.prefix = obj.p.expired = null;
    
    // set method.
    obj.p.set = function(key, value, expTime) {
        
        // get epoch time
        var setTime = Date.now();
        
        // generate key.
        var k = parser.generateKey(this.prefix, key);
        
        // if expTime not a number will using default expired.
        // in minutes.
        var expiration = isNaN(Number(expTime)) ? this.expired : Number(expTime);
        
        // value is json string.
        var v = parser.createJSON(value, setTime, expiration);
        
        return cache.set (k, v);
    };
    
    // get method.
    obj.p.get = function(key) {
        
        // get unix time.
        var now = Date.now();
        
        // generate key.
        key = parser.generateKey(this.prefix, key);
        
        // retrieve value.
        var val = cache.get(key);

        // if empty val return null.
        if (! val)
            return null;
        
        // parsing value from json string to object.
        var data = parser.parseData(val, now);

        // e for expired indicator.
        // d for data.
        // using 1 character to decrease size of object
        // if data is expired, deleting and return.
        return data.e ? cache.del(key) : data.d;
    };
    
    // delete method.
    obj.p.del = function(key) {
        
        // generate key and delete it!.
        var k = parser.generateKey(this.prefix, key);
        return cache.del(k);
    };
    
    // flush method.
    // remove all value based on prefix.
    obj.p.flush = function() {
        return cache.flush(this.prefix);
    };
    // :END obj
    
    // :BEGIN init
    // initialize object
    var init = function(conf) {
        
        // set default config.
        var config = {
            prefix : jscache.prefix,
            expired : jscache.expired
        };
        
        // replace config value if conf is object.
        if (typeof(conf) == 'object'){
            for (var x in conf)
                config[x] = conf[x];
        }
        // string is prefix.
        else if (typeof (conf) == 'string') {
            config.prefix = conf;
        }
        // default config.
        else {}
        
        // every creating a new object that will be cache on the way
        // so if object was created return it.
        if (objectCache.hasOwnProperty(config.prefix)) {
            ret = objectCache[config.prefix];
        }
        else {
            // create object, set prefix and expired time.
            ret = new obj();
            ret.prefix = config.prefix;
            ret.expired = config.expired;
            
            // save object which created.
            objectCache[config.prefix] = ret;
        }

        return ret;
    };
    // :END init
    
    // :BEGIN parser
    // lazy way to parsing data :).
    var parser = {
        
        // generate key, hmmm very*7 simple.
        generateKey: function(prefix, key){
            return prefix + ':' + key;    
        },
        
        // create json string.
        // d for data.
        // s for set time.
        // e for expired time.
        createJSON: function(val, setTime, expTime){
            // if expTime not an integer 0
            // convert expTime, from minutes to milliseconds.
            var expiredTime = (0===expTime) ? 0 : expTime * 60000;

            return JSON.stringify({
                d: val,
                s: setTime,
                e: expiredTime
            });
        },
        
        // parsing data.
        parseData: function(val, now) {
            // create object from json string.
            var tmp = JSON.parse(val);
            
            // set expired indicator.
            // now greater than setTime + expiredTime
            var expired = (0===tmp.e) ? false : now > (tmp.s + tmp.e);
            
            return {
                d: tmp.d,
                e: expired
            };
        }
    };
    // :END parser
    
    // :BEGIN cache
    // cache object.
    // manage data from and to storage.
    var cache = {
        
        // set value onto storage.
        set: function(key, val){
            var ret = false;
            try {
                jscache.storage.setItem(key, val);
                ret = true;
            }
            // set last error message if fail.
            catch(e) {
                jscache.lastError = e.name + ':' + e.message;
            }
            return ret;
        },
        
        // get value from storage.
        get: function(key){
            return jscache.storage.getItem(key);
        },
        
        // deleting value.
        del: function(key){
            return jscache.storage.removeItem(key);
        },
        
        // flushing cache.
        flush: function(prefix){
            // total value will be delete.
            var total = 0;
            
            // create regex to based on parser.generateKey.
            var r = new RegExp('^' + prefix + ':.+$');
            
            // check all value on storage
            // deleting if storage key is equivalent with Regex and increase total.
            Object.keys(jscache.storage)
                .forEach(function(key) {
                    if(r.test(key)) {
                        jscache.storage.removeItem(key);
                        total++;
                    }
                });
            return total;
        }
    };
    // :END cache
    
    // object caching for every init.
    var objectCache = {};
    
    // default prefix.
    jscache.prefix = 'jscache';
    
    // default expired 60 minutes.
    jscache.expired = 60;
    
    // cache default storage object
    jscache.defaultStorage = defaultStorage;
    
    // default storage.
    jscache.storage = jscache.defaultStorage;
    
    // expose jscache to global.
    window.jscache = jscache;
})(window);

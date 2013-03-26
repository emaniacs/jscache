/**
 * jscache: Simple javascript cache data on client browser.
 * http://github.com/emaniacs/jscache
 * 
 * Copyright 2012, Novi Ardi
 * Released under BSD and GPL Licenses.
 * 
 * Thu Sep 27 12:21:15 WIT 2012
 */

(function (window, undefined){
    // check localStorage
    if (typeof(window.localStorage) == 'undefined')
        throw new Error('Your browser not support localStorage');
    
    var jscache = function (conf) {
        return new init(conf);
    }
    
    // object return
    var obj = function () {};
    obj.p = obj.prototype;
    
    obj.p.prefix = obj.p.expired = null;
    obj.p.set = function(key, value, expTime) {
        return cache.set(
            parser.generateKey(this.prefix, key),
            parser.createJSON(value, new Date().valueOf(), isNaN(Number(expTime))?this.expired:Number(expTime))
        );
    };
    obj.p.get = function(key) {
        key = parser.generateKey(this.prefix, key);
        var val = cache.get(key);

        if (! val)
            return null;
        
        var data = parser.parseData(val, new Date().valueOf());

        return data.e ? cache.del(key) : data.d;
    };
    obj.p.del = function(key) {
        var key = parser.generateKey(this.prefix, key);
        return cache.del(key);
    };
    obj.p.flush = function() {
        return cache.flush(this.prefix)
    };

    // initialize object
    var init = function(conf) {
        var config = {
            prefix : jscache.prefix,
            expired : jscache.expired,
        };
        
        if (typeof(conf) == 'object'){
            for (var x in conf)
                config[x] = conf[x];
        }
        else if (typeof (conf) == 'string') {
            config.prefix = conf;
        }
        else {
            throw new Error('Please specify your config!');
        }
        
        if (objectCache.hasOwnProperty(config.prefix)) {
            ret = objectCache[config.prefix];
        }
        else {
            ret = new obj();
            ret.prefix = config.prefix;
            ret.expired = config.expired;
            objectCache[config.prefix] = ret;
        }
        
        return ret;
    };
    
    // parser
    var parser = {
        generateKey: function(prefix, key){
            return prefix + ':' + key;    
        },
        createJSON: function(val, setTime, expTime){
            return JSON.stringify({
                d: val,
                s: setTime,
                e: (0===expTime) ? 0 : (expTime*60000)
            });
        },
        parseData: function(val, now) {
            var tmp = JSON.parse(val);
            return {
                d: tmp.d,
                e: (0===tmp.e) ? false : (now > tmp.s + tmp.e)
            };
        }
    };
    
    // cache object
    var cache = {
        set: function(key, val){
            var ret = false;
            try {
                jscache.storage.setItem(key, val);
                ret = true;
            }
            catch(e) {
                jscache.lastError = e.name + ':' + e.message;
            }
            return ret;
        },
        get: function(key){
            return jscache.storage.getItem(key);
        },
        del: function(key){
            return jscache.storage.removeItem(key);
        },
        flush: function(prefix){
            var ret = 0;
            var r = new RegExp('^' + prefix + ':.+$');
            Object.keys(jscache.storage)
                .forEach(function(key) {
                    if(r.test(key)) {
                        jscache.storage.removeItem(key);
                        ret++;
                    }
                });
            return ret;
        }
    }
    
    var objectCache = {};
    
    jscache.prefix = 'jscache';
    jscache.expired = 10080;
    jscache.storage = window.localStorage;
    window.jscache = jscache;
})(window);

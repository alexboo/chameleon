/*! Javascript library to change the design of the page, v. 1.
 *
 * Released under the MIT license by IOLA, July 2013.
 * 
 * Author: Bulybin Alexey
 *
 */
Chameleon = function(){

    var _frequency = 60000;

    var current = this;

    var rules = {};
    
    this.addRule = function(name, rule){
        if ( typeof rule.execute === 'function' ) {
            rules[name] = rule;
            return true;
        }
        
        return false;
    };
    
    this.getRule = function(name){
        if ( typeof rule.execute === 'function' ) {
            return rules[name];
        }
    };
    
    this.createDate = function(minute, hour, day, month, year) {
	return new ChameleonDate(minute, hour, day, month, year);
    };
    
    this.createRule = function(params) {
	return new ChameleonRule(params);
    };
    
    this.execute = function(name) {
        if ( typeof rules[name] !== 'undefined' ) {
            rules[name].run();
        };
    };
    
    this.stop = function(name){
        if ( typeof rules[name] !== 'undefined' )
            rules[name].stop();
        else if ( name === "all" ) {
            for (var i in rules) {
                rules[i].stop();
            }
        }
    };
    
    this.removeRule = function(name) {
        if ( typeof rules[name] !== 'undefined' ) {
            delete rules[name];
            return true;
        }
        else if ( name === "all" ) {
            rules = {};
            return true;
        }
        
        return false;
    };
    
    this.run = function(){
        for (var i in rules) {
            rules[i].execute();
        }
        
        setTimeout(function(){current.run();}, _frequency);
    };
    
    this.setFrequency = function(frequency){
        if ( parseInt(frequency) > 0 )
            _frequency = parseInt(frequency) * 1000;
    };
    
    var ChameleonDate = function(minute, hour, day, month, year){
    
        var date = {};

        if ( typeof(minute)!=='undefined' )
            date['minute'] = minute;
        else 
            date['minute'] = '*';

        if ( typeof(hour)!=='undefined' )
            date['hour'] = hour;
        else 
            date['hour'] = '*';

        if ( typeof(day)!=='undefined' )
            date['day'] = day;
        else 
            date['day'] = '*';

        if ( typeof(month)!=='undefined' )
            date['month'] = month;
        else 
            date['month'] = '*';

        if ( typeof(year)!=='undefined' )
            date['year'] = year;
        else 
            date['year'] = '*';

        this.isLessCurtime = function(){
            if ( this.toDate() )
                return this.toDate() <= getCurrentDate();
            
            return false;
        };

        this.isMoreCurtime = function(){
            if ( this.toDate() )
                return this.toDate() >= getCurrentDate();
            
            return false;
        };

        this.isCurtime = function(){
            if ( this.toDate() )
                return this.toDate() === getCurrentDate();
            
            return false;
        };

        this.toDate = function(){
            var _date = {};
            for (i in date) {
                _date[i] = date[i];
            }
            for ( i in _date) {
                if (_date[i] === '*') {
                    _date[i] = getValue(i);
                }
                else if ( _date[i].toString().indexOf("/") !== -1 ) {
                    var number = parseInt(_date[i].toString().split("/")[1]);
                    if ( number ) {
                        var val = getValue(i);
                        
                        if ( val % number === 0 )
                            _date[i] = val;
                        else
                            return false;
                    }
                }
                else if ( _date[i].toString().indexOf(",") !== -1 ) {
                    var numbers = _date[i].toString().split(",");
                    if ( numbers ) {
                        var val = getValue(i);
                        if ( numbers.indexOf(val.toString()) !== -1 )
                            _date[i] = val;
                        else
                            return false;
                    }
                }

                if (_date[i].toString().length === 1 && _date[i] <= 9)
                    _date[i] = "0" + parseInt(_date[i]);
            }

            return _date['year'] + '-' + _date['month'] + '-' + _date['day'] + '-' + _date['hour'] + '-' + _date['minute'];
        };

        var getCurrentDate = function(){
            return new ChameleonDate().toDate();
        };
        
        var getValue = function(key){
            var curdate = new Date();
            
            var val;
            if ( key === 'minute')
                val = curdate.getMinutes();
            else if ( key === 'hour')
                val = curdate.getHours();
            else if ( key === 'day')
                val = curdate.getDate();
            else if ( key === 'month') 
                val = (curdate.getMonth() + 1);
            else if ( key === 'year')
                val = curdate.getFullYear();
            
            return val;
        };
    };

    var ChameleonRule = function(params){
        var _files = [];
        var _excludes = [];
        var _from = null;
        var _to = null;
        var _function = null;
        var _callback = null;
        var _running = false;
        
        this.addParams = function(params){
            if ( typeof params['files'] !== 'undefined' ) {
                var files = params['files'];
                for (var i in files) {
                    _files[_files.length] = files[i];
                }
            }

            if ( typeof params['excludes'] !== 'undefined' ) {
                var excludes = params['excludes'];
                for (var i in excludes) {
                    _excludes[_excludes.length] = excludes[i];
                }
            }

            if ( typeof params['date'] !== 'undefined' && typeof params['date'].toDate === 'function' )
                _from = params['date'];

            if ( typeof params['from'] !== 'undefined' && typeof params['from'].toDate === 'function' )
                _from = params['from'];

            if ( typeof params['to'] !== 'undefined' && typeof params['to'].toDate === 'function' )
                _to = params['to'];

            if ( typeof params['function'] === 'function' )
                _function = params['function'];

            if ( typeof params['callback'] === 'function' )
                _callback = params['callback'];
        };
        
        this.setParams = function(params) {
            this.removeParam("all");
            this.addParams(params);
        };
        
        this.removeParam = function(name){
            switch (name) {
                case "files" : 
                    _files = [];
                    break;
                case "excludes" : 
                    _excludes = [];
                    break;
                case "date" : 
                    _from = null;
                    break;
                case "from" : 
                    _from = null;
                    break;
                case "to" : 
                    _to = null;
                    break;
                case "function" : 
                    _function = null;
                    break;
                case "callback" : 
                    _callback = null;
                    break;   
                case "all" :
                    _files = [];
                    _excludes = [];
                    _from = null;
                    _to = null;
                    _function = null;
                    _callback = null;
                    break;
            }
        };

        this.execute = function(){

            var execute = false;
            if ( _from !== null ) {
                if ( _to !== null ) {
                    if ( _from.isLessCurtime() && _to.isMoreCurtime() )
                        execute = true;
                }
                else if ( _from.isCurtime() )
                    execute = true;
            }

            if ( execute ) {
                this.run();
            }
            else if (_running) {
                this.stop();
            }

            return false;
        };
        
        this.stop = function(){
            _running = false;
                
            if ( _files )
                clearFiles(_files);
        };
        
        this.run = function(){
            if ( !_running ) {                    
                if ( typeof _function === 'function' ) {
                    _function.call(this);
                }

                if ( _files ) {
                    clearFiles();
                    for ( i in _files ) {
                        addFile(_files[i]);
                    }
                }

                if ( typeof _callback === 'function' )
                    _callback.call(this);

                _running = true;
            }
        };

        var clearFiles = function(remove){
            var files = document.getElementsByTagName("link");
            if ( files.length > 0 && _files.length > 0 ) {
                for ( var i = 0; i < files.length; i ++) {
                    if (files[i]) {
                        if ( remove ) {
                            if ( remove.indexOf(files[i].getAttribute("href")) !== -1  )
                                files[i].parentNode.removeChild(files[i]);
                        }
                        else if ( files[i].getAttribute("rel") === "stylesheet" || files[i].getAttribute("href").indexOf(".css") ) {
                            if ( _excludes.indexOf(files[i].getAttribute("href")) === -1 ) {
                                files[i].parentNode.removeChild(files[i]);
                            }
                        }
                    }
                }
            }
        };

        var addFile = function(file){
            var _file = document.createElement("link");
            _file.setAttribute("rel", "stylesheet");
            _file.setAttribute("type", "text/css");
            _file.setAttribute("href", file);

            document.getElementsByTagName("head")[0].appendChild(_file);
        };
        
        this.setParams(params);
    };
};
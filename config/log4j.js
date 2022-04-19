
// var robotAppender = require('../util/log4jAppender');


export default {
    "appenders": {
        "console": {
            "type": "console",
            "layout": {
                "type": "pattern",
                "pattern": "%[[%d{ISO8601}][%5p  %5z  %5c]%] %m"  
            },
        },
        "all": {
            "type": "dateFile",
            "filename": "logs/all/elm_all.log",
            "pattern": "yyyy-MM-dd",
            "layout": {
                "type": "pattern",
                "pattern": "[%d{ISO8601}][%5p  %5z  %5c] %m"  
            },
            "compress": true,
            "keepFileExt": true,
            "fileNameSep": '_',
            "numBackups": 14,
        },
        "maxAll": {
            "type": "logLevelFilter",
            "appender": "all",
            "level": "all",
            "maxLevel": "info"
        },
        "warn": {
            "type": "dateFile",
            "filename": "logs/warn/elm_warn.log",
            "pattern": "yyyy-MM-dd",
            "layout": {
                "type": "pattern",
                "pattern": "[%d{ISO8601}][%5p  %5z  %5c] %m"  
            },
            "compress": true,
            "keepFileExt": true,
            "fileNameSep": '_',
            "numBackups": 30,
        },
        "maxWarn": {
            "type": "logLevelFilter",
            "appender": "warn",
            "level": "warn",
            "maxLevel": "warn"
        },
        "error": {
            "type": "dateFile",
            "filename": "logs/error/elm_error.log",
            "pattern": "yyyy-MM-dd",
            "layout": {
                "type": "pattern",
                "pattern": "[%d{ISO8601}][%5p  %5z  %5c] %m"  // [2022-04-17T13:07:44.949][ INFO  23516  index] 用户进入主页!测试日志等级info
            },
            "compress": true,
            "keepFileExt": true,
            "fileNameSep": '_',
            "numBackups": 30,
        },
        // "mail": {
        //     "type": { configure: robotAppender.wxConfigure },
        //     "layout": { type: 'basic' },
        // }
    },
    "categories": {
        "default": {
            "appenders": [
                "maxAll"
            ],
            "level": "all"
        },
        "warn": {
            "appenders": [
                "maxWarn"
            ],
            "level": "warn"
        },
        "error": {
            "appenders": [
                "console",
                "error",
                // "mail"
            ],
            "level": "error"
        },
    }
}
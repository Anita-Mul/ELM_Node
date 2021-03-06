import log4jAppender from '../util/log4jAppender';


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
                "pattern": "[%d{ISO8601}][%5p  %5z  %5c][trace  %X{trace}] %m"  // [2022-04-20T11:50:43.748][ERROR   6948  error][trace  e0c1dbe1-1550-443d-a388-74815134f354] 获取数据失败
            },
            "compress": true,
            "keepFileExt": true,
            "fileNameSep": '_',
            "numBackups": 30,
        },
        "mail": {
            "type": { configure: log4jAppender.mailConfigure },
            "layout": { type: 'basic' },
        },
        "http": {
            "type": "dateFile",
            "filename": "logs/http/elm_http.log",
            "pattern": "yyyy-MM-dd",
            "layout": {
                "type": "json", 
                "separator": ""
            },
            "compress": true,
            "keepFileExt": true,
            "fileNameSep": '_',
            "numBackups": 30,
        },
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
                "mail"
            ],
            "level": "error"
        },
        "http": {
            "appenders": [
                "http",
            ],
            "level": "all"
        }
    }
}
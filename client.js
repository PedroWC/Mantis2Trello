(function () {
    // Opções do Trello
    var trelloOptions = {
        "version": 1,
        "apiEndpoint": "https://api.trello.com",
        "authEndpoint": "https://trello.com",
        "intentEndpoint": "https://trello.com",
        "token": "ATTA1798c7c8e39cf97447dffd091155c8f9a263cc3e6bc3eade4af788deaf30a9b4429BAE47",
        "key": "12d839f0981c6d5d8fdfeef6a6377965"
    };

    // Objeto para gerenciar funções adiadas
    var deferred = {};

    // Função para verificar se é uma função
    var isFunction = function (fn) {
        return typeof fn === 'function';
    };

    // Função para notificar quando algo está pronto
    var isReady = function (key, value) {
        ready[key] = value;
        if (deferred[key]) {
            var callbacks = deferred[key];
            delete deferred[key];
            for (var i = 0; i < callbacks.length; i++) {
                var callback = callbacks[i];
                callback(value);
            }
        }
    };

    // Objeto para armazenar estados de prontidão
    var ready = {};

    // Função para aguardar até que algo esteja pronto
    var waitUntil = function (key, callback) {
        if (ready[key] !== undefined) {
            callback(ready[key]);
        } else {
            if (deferred[key] === undefined) {
                deferred[key] = [];
            }
            deferred[key].push(callback);
        }
    };

    // Função principal que encapsula o código
    var wrapper = function (window, $, options) {
        var apiKey = options.key;
        var apiToken = options.token;
        var apiEndpoint = options.apiEndpoint;
        var authEndpoint = options.authEndpoint;
        var intentEndpoint = options.intentEndpoint;
        var apiVersion = options.version;

        var apiBaseUrl = apiEndpoint + "/" + apiVersion + "/";
        var location = window.location;

        // Objeto principal do Trello
        var trello = {
            version: function () {
                return apiVersion;
            },
            key: function () {
                return apiKey;
            },
            setKey: function (newKey) {
                apiKey = newKey;
            },
            token: function () {
                return apiToken;
            },
            setToken: function (newToken) {
                apiToken = newToken;
            },
            rest: function () {
                var args = arguments;
                var httpMethod = args[0];
                var restArgs = Array.prototype.slice.call(args, 1);

                var requestOptions = {
                    url: apiBaseUrl + restArgs[0],
                    type: httpMethod,
                    data: {},
                    dataType: "json",
                    success: restArgs[2],
                    error: restArgs[3]
                };

                if (!$.support.cors) {
                    requestOptions.dataType = "jsonp";
                    if (httpMethod !== "GET") {
                        requestOptions.type = "GET";
                        $.extend(requestOptions.data, { _method: httpMethod });
                    }
                }

                if (apiKey) {
                    requestOptions.data.key = apiKey;
                }

                if (apiToken) {
                    requestOptions.data.token = apiToken;
                }

                if (restArgs[1] !== undefined) {
                    $.extend(requestOptions.data, restArgs[1]);
                }

                return $.ajax(requestOptions);
            },
            authorized: function () {
                return apiToken !== null;
            },
            deauthorize: function () {
                apiToken = null;
                storeToken("token", apiToken);
            },
            authorize: function (options) {
                var authOptions = $.extend(true, {
                    type: "redirect",
                    persist: true,
                    interactive: true,
                    scope: { read: true, write: false, account: false },
                    expiration: "30days"
                }, options);

                var tokenRegExp = /[&#]?token=([0-9a-f]{64})/;
                var hash = location.hash;

                function storeToken(key, token) {
                    if (authOptions.persist) {
                        localStorage["trello_" + key] = token;
                    }
                }

                function retrieveToken(key) {
                    return localStorage["trello_" + key];
                }

                function getTokenFromHash() {
                    return (tokenRegExp.exec(hash) || [])[1];
                }

                function handleSuccess() {
                    if (authOptions.persist && apiToken !== null) {
                        storeToken("token", apiToken);
                    }
                    location.hash = hash.replace(tokenRegExp, "");
                    if (isFunction(authOptions.success)) {
                        authOptions.success();
                    }
                }

                if (this.authorized()) {
                    handleSuccess();
                } else if (!authOptions.interactive) {
                    if (isFunction(authOptions.error)) {
                        authOptions.error();
                    }
                } else {
                    var scope = $.map(authOptions.scope, function (value, key) {
                        return value ? key : null;
                    }).join(",");

                    switch (authOptions.type) {
                        case "popup":
                            waitUntil("authorized", function (isAuthorized) {
                                if (isAuthorized) {
                                    handleSuccess();
                                } else if (isFunction(authOptions.error)) {
                                    authOptions.error();
                                }
                            });

                            var left = window.screenX + (window.innerWidth - 420) / 2;
                            var top = window.screenY + (window.innerHeight - 470) / 2;
                            var origin = /^([a-z]+:\/\/[^\/]*)/.exec(location);
                            var return_url = origin ? origin[0] : undefined;

                            var popup = window.open(
                                intentEndpoint +
                                "/authorize?" +
                                $.param($.extend(
                                    {
                                        return_url: return_url,
                                        callback_method: "postMessage",
                                        scope: scope,
                                        expiration: authOptions.expiration,
                                        name: authOptions.name
                                    },
                                    authOptions
                                )),
                                "trello",
                                "width=420,height=470,left=" + left + ",top=" + top
                            );

                            var onMessage = function (event) {
                                if (event.origin === authEndpoint && event.source === popup) {
                                    if (event.data && /[0-9a-f]{64}/.test(event.data)) {
                                        apiToken = event.data;
                                        if (isFunction(window.removeEventListener)) {
                                            window.removeEventListener("message", onMessage, false);
                                        }
                                        isReady("authorized", trello.authorized());
                                    }
                                    popup.close();
                                }
                            };

                            if (isFunction(window.addEventListener)) {
                                window.addEventListener("message", onMessage, false);
                            }
                            break;
                        default:
                            location = intentEndpoint +
                                "/authorize?" +
                                $.param($.extend(
                                    {
                                        redirect_uri: location.href,
                                        callback_method: "fragment",
                                        scope: scope,
                                        expiration: authOptions.expiration,
                                        name: authOptions.name
                                    },
                                    authOptions
                                ));
                            break;
                    }
                }
            },
            addCard: function (card, callback) {
                var addCardOptions = {
                    mode: "popup",
                    source: apiKey || location.host
                };

                var openPopup = function (cb) {
                    var left = window.screenX + (window.outerWidth - 500) / 2;
                    var top = window.screenY + (window.outerHeight - 600) / 2;

                    var popup = window.open(
                        intentEndpoint + "/add-card?" + $.param($.extend(addCardOptions, card)),
                        "trello",
                        "width=500,height=600,left=" + left + ",top=" + top
                    );

                    var handleMessage = function (event) {
                        if (isFunction(window.removeEventListener)) {
                            window.removeEventListener("message", handleMessage, false);
                        }
                        try {
                            var data = JSON.parse(event.data);
                            if (data.success) {
                                cb(null, data.card);
                            } else {
                                cb(new Error(data.error));
                            }
                        } catch (e) { }
                    };

                    if (isFunction(window.addEventListener)) {
                        window.addEventListener("message", handleMessage, false);
                    }
                };

                if (callback !== undefined) {
                    openPopup(callback);
                } else if (window.Promise) {
                    return new Promise(function (resolve, reject) {
                        openPopup(function (error, card) {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(card);
                            }
                        });
                    });
                } else {
                    openPopup(function () { });
                }
            }
        };

        // var httpMethods = ["GET","PUT","POST","DELETE"];
        var httpMethods = ["GET", "POST"];
        for (var i = 0; i < httpMethods.length; i++) {
            var method = httpMethods[i];
            trello[method.toLowerCase()] = function () {
                return this.rest.apply(this, [method].concat(Array.prototype.slice.call(arguments)));
            };
        }

        var resources = ["actions", "cards", "checklists", "boards", "lists", "members", "organizations"];
        for (var j = 0; j < resources.length; j++) {
            var resource = resources[j];
            trello[resource] = {
                get: function (id, params, success, error) {
                    return trello.get(resource + "/" + id, params, success, error);
                }
            };
        }

        window.Trello = trello;

        // Função para autorizar o Trello
        var authorizeUrl = authEndpoint + "/" + apiVersion + "/authorize?" + $.param({
            response_type: "token",
            key: apiKey
        });

        var retrieveStoredToken = function (key) {
            return localStorage["trello_" + key];
        };

        var storeToken = function (key, token) {
            if (token === null) {
                delete localStorage["trello_" + key];
            } else {
                localStorage["trello_" + key] = token;
            }
        };
    };

    // Inicializa o wrapper
    wrapper(window, jQuery, trelloOptions);
})();

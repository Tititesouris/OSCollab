Revil = (function Revil() {

    var deepmerge = require("deepmerge");

    var _private = {
        "ws": undefined, // Websocket connection
        "routes": {}, // Routes defined
        "sent": [], // Messages sent waiting for acknowledgment

        "hasRoute": function (address) { // Returns true if the route exists
            return _private.getRoute(address) !== undefined;
        },
        "getRoute": function (address) { // Returns the routed address or undefined
            var routed = _private.routes;
            var route = address.split("/");

            for (var i = 1; i < route.length; i++) {
                if (route[i] in routed) {
                    routed = routed[route[i]];
                }
                else {
                    return undefined;
                }
            }
            return routed;
        },
        "argsEquals": function (args1, args2) { // Returns true if both sets of arguments are equal
            if (args1.length !== args2.length)
                return false;

            for (var i = 0; i < args1.length; i++) {
                if (args1[i] !== args2[i]) {
                    return false;
                }
            }
            return true;
        },
        "getSent": function (address, args) { // Acknowledges the sent message and returns it, or returns undefined if the message wasn't sent
            for (var i = 0; i < _private.sent.length; i++) {
                var sent = _private.sent[i];
                if (sent.address === address && _private.argsEquals(sent.args, args)) {
                    return _private.sent.splice(i, 1)[0];
                }
            }
            return undefined;
        }
    };

    return function RevilConstructor(ip, port) {

        if (ip === undefined || port === undefined) {
            console.error("Failed to load Revil.js: Incorrect ip or port.");
            return;
        }

        var _this = this;


        _this.addRoute = function (address, action) {
            var route = address.split("/");
            var routed = action;
            for (var i = route.length - 1; 0 < i; i--) {
                var temp = routed;
                routed = {};
                routed[route[i]] = temp;
            }
            _this.addRoutes(routed);
        };

        _this.addRoutes = function (routes) {
            _private.routes = deepmerge(_private.routes, routes);
        };

        _this.send = function (address, args, success) {
            _private.ws.send({
                address: address,
                args: args
            });
            if (_private.hasRoute(address)) {
                _private.sent.push({
                    address: address,
                    args: args,
                    success: success
                });
            }
            else {
                if (success !== undefined)
                    success();
            }
        };

        _this.receive = function (message) {
            var address = message.address, args = message.args;

            var route = _private.getRoute(address);
            if (route !== undefined) {

                // If the message is identical to one that was just sent
                var sent = _private.getSent(address, args);
                if (sent !== undefined) {
                    // Call the success method if defined
                    if (sent.success !== undefined)
                        sent.success();
                }
                else {
                    // Call the action method
                    route(args);
                }
            }
        };

        // Setup WebSockets
        _private.ws = new osc.WebSocketPort({
            url: "ws://" + ip + ":" + port
        });
        _private.ws.on("message", _this.receive);
        _private.ws.on("ready", function () {
            console.info("Revil.js loaded");
        });
        _private.ws.open();
    };
}());
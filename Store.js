Ext.define('Mba.ux.Data.Store', {
    override: 'Ext.data.Store',

    requires: [
        'Ext.ux.Deferred',
        'Ext.device.Connection'
    ],

    applyProxy: function(proxy, currentProxy) {
        if (Ext.isObject(proxy)) {
            if (!proxy.model) {
                proxy.model = this.getModel().$className;
            }
        }
        proxy = Ext.factory(proxy, Ext.data.Proxy, currentProxy, 'proxy');
        if (!proxy && this.getModel()) {
            proxy = this.getModel().getProxy();
        }

        if (!proxy) {
            proxy = new Ext.data.proxy.Memory({
                model: this.getModel()
            });
        }

        if (proxy.isMemoryProxy) {
            this.setSyncRemovedRecords(false);
        }
        return proxy;
    },

    /** Constroi a promise e faz o wrap do callback do usuario
     *  @return {Object} Contexto de execucao
     *  @return {Object} return.dfd: A instancia do deferred com a promessa
     *  @return {Object} return.options: Objeto options alterado para ser passado para callParent
     *  @return {Object} return.scope: Escopo de chamada, o mesmo scope passado para a funcao
     *  @private
     **/
    prepareDeferred: function(options, scope) {
        var dfd = Ext.create('Ext.ux.Deferred'),
            userCallback = Ext.emptyFn,
            me = this,
            argumentsPromise;

        options = options || {};

        if (Ext.isFunction(options)) {
            userCallback = options;
            options = {};
        } else if (Ext.isObject(options)) {
            userCallback = options.callback || Ext.emptyFn;
        }

        options.callback = function() {
            userCallback.apply(me, arguments);
            argumentsPromise = Ext.Array.slice(arguments);
            argumentsPromise.push(me);
            if (arguments[2]) {
                dfd.resolve.apply(dfd, argumentsPromise);
                return;
            }
            dfd.reject.apply(dfd, argumentsPromise);
        };

        return {
            dfd: dfd,
            options: options,
            scope: scope
        };
    },

    /** Executa uma funcao de load deffered. Os parametros sao os mesmos
     *  de uma store normal
     *  @returns {Object} Uma promessa de load */
    load: function(options, scope) {
        var r = this.prepareDeferred(options, scope),
            promise = r.dfd.promise(), remoteProxys = ['Mba.ux.Data.MbaRestProxy', 'Ext.data.proxy.Ajax',
            'Ext.data.proxy.Rest'];
        if (this.getProxy() && remoteProxys.indexOf(this.getProxy().$className) !== -1) {
            if (!Ext.device.Connection.isOnline()) {
                r.dfd.reject([], {
                    error: {
                        statusText: 'Sem conexão de dados.'
                    }
                });
                return promise;
            }
        }

        this.callParent([r.options, r.scope]);
        return promise;
    },

    /** Executa uma funcao de loadPage deffered. Os parametros sao os mesmos
     *  de uma store normal
     *  @returns {Object} Uma promessa de loadPage */
    loadPage: function(page, options, scope) {
        var r = this.prepareDeferred(options, scope),
            promise = r.dfd.promise();
        this.callParent([page, r.options, r.scope]);
        return promise;
    },

    /** Executa uma funcao de nextPage deffered. Os parametros sao os mesmos
     *  de uma store normal
     *  @returns {Object} Uma promessa de nextPage */
    nextPage: function(options) {
        var r = this.prepareDeferred(options),
            promise = r.dfd.promise();
        this.callParent([r.options]);
        return promise;
    },

    /** Executa uma funcao de previousPage deffered. Os parametros sao os mesmos
     *  de uma store normal
     *  @returns {Object} Uma promessa de previousPage */
    previousPage: function(options) {
        var r = this.prepareDeferred(options),
            promise = r.dfd.promise();
        this.callParent([r.options]);
        return promise;
    }
});

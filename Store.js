Ext.define('Mba.ux.Data.Store', {
    override: 'Ext.data.Store',

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
    }
});

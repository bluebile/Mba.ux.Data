Ext.define('Mba.ux.Data.MbaRestProxy', {
    extend: 'Ext.data.proxy.Rest',
    alias : 'proxy.rest-proxy',
    id: 'mbaproxyrest',

    buildUrl: function (request) {
        this.callParent([request]);
        return this.getModel().prototype.buildRestUrl(request);
    }

});

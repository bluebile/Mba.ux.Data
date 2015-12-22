Ext.define('Mba.ux.Data.MbaRestProxy', {
    extend: 'Ext.data.proxy.Rest',
    alias : 'proxy.rest-proxy',
    id: 'mbaproxyrest',

    buildUrl: function (request) {
        this.callParent([request]);

        var params    = request.getParams() || {},
            url       = this.getUrl(request),
            replaceStr = '';

        for (var property in params) {
            replaceStr = '{' + property + '}';
            if (url.indexOf(replaceStr) != -1) {
                url = url.replace(replaceStr, params[property]);
                delete params[property];
            }
        }

        request.setUrl(url);

        return this.getModel().prototype.buildRestUrl(request);
    }

});

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
        
        timeDc = new Date().getTime();
        if(url.indexOf('?') != -1) {
            url += '&_dc=' + timeDc;
        } else {
            url += '?_dc=' + timeDc;
        }
        request.setUrl(url);

        return this.getModel().prototype.buildRestUrl(request);
    }

});

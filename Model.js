Ext.define('Mba.ux.Data.Model', {
    override: 'Ext.data.Model',
    requires: [ 'Mba.ux.Validator' ],

    getValidator: function() {
        return Mba.ux.Validator;
    },

    applyProxy: function(proxy, currentProxy) {
        if (Ext.isObject(proxy)) {
            if (!proxy.model) {
                proxy.model = this.$className;
            }
        }
        return Ext.factory(proxy, Ext.data.Proxy, currentProxy, 'proxy');
    },

    getIdProperty: function(idProperty) {
        if (Ext.isObject(this.config.idProperty)) {
            return this.config.idProperty.mapping;
        }
        return this.config.idProperty;
    },

    validate: function() {
        var errors      = Ext.create('Ext.data.Errors'),
            validations = this.getValidations().items,
            validators  = this.getValidator(),
            length, validation, field, valid, type, i;

        if (validations) {
            length = validations.length;

            for (i = 0; i < length; i++) {
                validation = validations[i];
                field = validation.field || validation.name;
                type  = validation.type;
                valid = validators[type](validation, this.get(field));

                if (!valid) {
                    errors.add(Ext.create('Ext.data.Error', {
                        field: field,
                        message: validation.message || validators.getMessage(type)
                    }));
                }
            }
        }

        return errors;
    }
});

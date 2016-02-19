# Mba.ux.Data

Componente da MBA que provê overrides com melhorias para `Ext.data.Store` e `Ext.data.Model`,
além de um _proxy REST_ para Stores.

## Mba.ux.Data.Store

Override do `Ext.data.Store` que retorna uma promisse para as chamadas de

- `load`
- `loadPage`
- `nextPage`
- `previousPage`

Exemplo:

```
var store1 = Ext.getStore('DeferredStore1');
store1.load()
    .then(function() {
        alert('Store 1 carregou');
    });

var store2 = Ext.getStore('DeferredStore2');
Ext.ux.Deferred.when(store1.load(), store2.load())
    .then(function() {
        alert('Store 1 e 2 carregaram');
    });
```

## Mba.ux.Data.MbaRestProxy

_Proxy REST_ para Stores do Sencha. Exemplo:

```
Ext.define('MyApp.store.MyAppStore', {
    extend: 'Ext.data.Store',
    requires: [
        'MyApp.model.MyAppModel',
        'Mba.ux.Data.MbaRestProxy'
    ],

    config: {
        model: 'MyApp.model.MyAppModel',
        proxy: {
            type: 'rest-proxy',
            url: 'http://myapp.myserver.com/mydatasource'
            reader: {
                type: 'json'
            }
        }
    }
});
```
Consulte a documentação do Sencha Touch para mais informações sobre Stores.



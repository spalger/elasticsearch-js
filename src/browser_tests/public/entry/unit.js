const context = require.context('../../../elasticsearch-js', true, /(\/|\\)__tests__(\/|\\)(common|browser)(\/|\\).+\.js/);
context.keys().forEach(key => context(key));
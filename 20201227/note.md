Vue响应式原理，模板编译原理，虚拟DOM原理，vue初渲染

//使用rollup 打包类库
npm install @babel/preset-env @babel/core rollup rollup-plugin-babel rollup-plugin-serve cross-env -D

配置rollup.config.js的配置文件
配置.babelrc的配置文件

1、构造函数Vue 执行_init函数进行初始化
2、根据data、props、methods、computed、watch等属性，分别进行初始化，这里以初始化data为例
3、对data的值进行代理，使得 vm.name === vm.options.data.name，以及vm_data = vm.options.data;
4、判断data中属性的值 是对象还是数组
5、如果是对象，则对该对象的属性使用Object.definePrototy方法进行递归观测，同时对该对象属性的值以及
set的新值也进行观测。
6、如果是数组，则对数组中的每一项使用Object.definePrototy方法进行递归观测；同时重新数组原型中的
变异方法，对于数组中新增的项也进行观测；

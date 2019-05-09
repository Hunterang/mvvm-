# mvvm-
这是一个实现简单的vue双向绑定的方法
直接引入 Zvue.js
  var vm = new Zvue({
    el: '#app'
    data: {
    msg: 'helloworld'
    }
  }) 
 
  该方法仅仅实现了data的第一层Object.defineProperty(),需要添加递归的条件，在observe（data）执行时候，对data[key]进行check,做递归调用
  
 mvvm 实现的思路是数据劫持跟编译的两部分
 
 首先要先劫持数据，把data进行双向绑定，同时生成观察者收集器。
 其次就是编译数据，每次到了插值和v-model的地方，生成一个观察者，并且触发get方法，将观察者添加起来
 
 当数据发生变化时，触发set方法，把触发的key以及value都传给watcher，进行vm_data[key]的更新
 
 双向绑定的input则是通过node.input方法触发数据更新
 

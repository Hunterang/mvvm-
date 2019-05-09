 class  Zvue {
   constructor(options) {
     this.$options = options
     this.$el = document.querySelector(options.el)
     this._data = options.data
     this.observe(this._data)
     this.compile(this.$el)
   }
   compile (el) {
     var node = el.childNodes
     var reg = /\{\{\s*(\S*)\s*\}\}/g
     Array.from(node).forEach( v => {

       if (v.nodeType == 3) {
         if (reg.test(v.textContent)) {
           var k = RegExp.$1
           v.textContent = this._data[k]
           new watcher(this,k,function(ks,va) {
             if (ks != k) {
               return
             }
             v.textContent = va
           })
         }
       }
       else if (v.nodeType === 1) {
         var attr = v.attributes
         Array.from(attr).forEach( a => {
           if (a.localName.indexOf('v-model') == 0) {
             v.value = this._data[a.value]
             new watcher(this,a.value,function(ks,va) {
               if (ks != a.value) {
                 return
               }
               v.value = va
             })
             v.oninput= () => {
               this._data[a.value] = v.value
             }
           }
           // Object.keys(a).forEach( k => {
           //   console.log(k);
           // })
         })
         this.compile(v)
       }
     })
   }
   observe(data) {

     var dep = new Dep()
     Object.keys(data).forEach( k => {
       var value = data[k]
       Object.defineProperty(data,k,{
         configurable: true,
         enumerable: true,
         get() {
           if (Dep.target) {
             dep.add(Dep.target)
           }
           return value
         },
         set(newValue) {
           if ( value == newValue ) {
             return
           }
           value = newValue
           dep.notify(k,newValue)
         }
       })
     })
   }
   // watcher () {
   //
   // }
   isNode(node) {
     return node.nodeType == 1
   }
 }


 class Dep {
   constructor(){
     this.collects = []
   }
   add(w) {
    this.collects.push(w)
   }
   notify(k,val) {
     this.collects.forEach(w => {
       w.update(k,val)
     })
   }
 }
//为了在get时候添加观察者，必须先劫持数据后编译，这样
//编译的时候会自动触犯get方法
//反之数据未双向绑定生成watcher时候不会自动添加
class watcher {
  constructor(vm,k,cb) {
    Dep.target = this
    vm._data[k]
    this.cb = cb
    Dep.target = null
  }
  update(ks,val) {
    this.cb(ks,val)
  }
}

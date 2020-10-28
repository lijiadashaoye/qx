 /*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************/
export class Mediator {

  slice = null // [].slice,
  separator = null///\s+/,
  protos = null
  constructor() {
    this.slice = [].slice;
    this.separator = /\s+/;
    this._events=[]
  }
  findHandlers(arr, name, callback, context) {
    let a = arr.filter((handler) => {
      return handler &&
        (!name || handler.e === name) &&
        (!callback || handler.cb === callback ||
          handler.cb._cb === callback) &&
        (!context || handler.ctx === context);

    })
    
    return a;
    // return $.grep( arr, function( handler ) {
    //     return handler &&
    //             (!name || handler.e === name) &&
    //             (!callback || handler.cb === callback ||
    //             handler.cb._cb === callback) &&
    //             (!context || handler.ctx === context);
    // });
  }

  eachEvent(events, callback, iterator) {
    
    // 不支持对象，只支持多个event用空格隔开
    (events || '').split(this.separator).map((key) => {
      iterator(key, callback);
    })
    // $.each( (events || '').split( this.separator ), function( _, key ) {
    //     iterator( key, callback );
    // });
  }

  triggerHanders(events, args) {
    var stoped = false,
      i = -1,
      len = events.length,
      handler;
      
    while (++i < len) {
      handler = events[i];

      if (handler.cb.apply(handler.ctx2, args) === false) {
        stoped = true;
        break;
      }
    }

    return !stoped;
  }
  
  protos = {

    /**
     * 绑定事件。
     *
     * `callback`方法在执行时，arguments将会来源于trigger的时候携带的参数。如
     * ```javascript
     * var obj = {};
     *
     * // 使得obj有事件行为
     * Mediator.installTo( obj );
     *
     * obj.on( 'testa', function( arg1, arg2 ) {
     *     console.log( arg1, arg2 ); // => 'arg1', 'arg2'
     * });
     *
     * obj.trigger( 'testa', 'arg1', 'arg2' );
     * ```
     *
     * 如果`callback`中，某一个方法`return false`了，则后续的其他`callback`都不会被执行到。
     * 切会影响到`trigger`方法的返回值，为`false`。
     *
     * `on`还可以用来添加一个特殊事件`all`, 这样所有的事件触发都会响应到。同时此类`callback`中的arguments有一个不同处，
     * 就是第一个参数为`type`，记录当前是什么事件在触发。此类`callback`的优先级比脚低，会再正常`callback`执行完后触发。
     * ```javascript
     * obj.on( 'all', function( type, arg1, arg2 ) {
     *     console.log( type, arg1, arg2 ); // => 'testa', 'arg1', 'arg2'
     * });
     * ```
     *
     * @method on
     * @grammar on( name, callback[, context] ) => self
     * @param  {String}   name     事件名，支持多个事件用空格隔开
     * @param  {Function} callback 事件处理器
     * @param  {Object}   [context]  事件处理器的上下文。
     * @return {self} 返回自身，方便链式
     * @chainable
     * @class Mediator
     */
    on: function (name, callback, context) {
      var me = this,
        set;
        
      if (!callback) {
        return this;
      }

      set = this._events || (this._events = []);

      this.eachEvent(name, callback, function (name, callback) {
        var handler = { e: name };

        handler.cb = callback;
        handler.ctx = context;
        handler.ctx2 = context || me;
        handler.id = set.length;

        set.push(handler);
      });

      return this;
    },

    /**
     * 绑定事件，且当handler执行完后，自动解除绑定。
     * @method once
     * @grammar once( name, callback[, context] ) => self
     * @param  {String}   name     事件名
     * @param  {Function} callback 事件处理器
     * @param  {Object}   [context]  事件处理器的上下文。
     * @return {self} 返回自身，方便链式
     * @chainable
     */
    once: function (name, callback, context) {
      var me = this;

      if (!callback) {
        return me;
      }

      this.eachEvent(name, callback, function (name, callback) {
        var once = function () {
          me.off(name, once);
          return callback.apply(context || me, arguments);
        };

        once._cb = callback;
        me.on(name, once, context);
      });

      return me;
    },

    /**
     * 解除事件绑定
     * @method off
     * @grammar off( [name[, callback[, context] ] ] ) => self
     * @param  {String}   [name]     事件名
     * @param  {Function} [callback] 事件处理器
     * @param  {Object}   [context]  事件处理器的上下文。
     * @return {self} 返回自身，方便链式
     * @chainable
     */
    off: function (name, cb, ctx) {
      var events = this._events;

      if (!events) {
        return this;
      }

      if (!name && !cb && !ctx) {
        this._events = [];
        return this;
      }

      this.eachEvent(name, cb, function (name, cb) {
        
        this.findHandlers(events, name, cb, ctx).map(() => {
          delete events[this.id];
        })
        // $.each( findHandlers( events, name, cb, ctx ), function() {
        //     delete events[ this.id ];
        // });
      });
      return this;
    },

    /**
     * 触发事件
     * @method trigger
     * @grammar trigger( name[, args...] ) => self
     * @param  {String}   type     事件名
     * @param  {*} [...] 任意参数
     * @return {Boolean} 如果handler中return false了，则返回false, 否则返回true
     */
    trigger: function (type) {
      var args, events, allEvents;
      
      if (!this._events || !type) {
        return this;
      }
      
      args = this.slice.call(arguments, 1);
      events = this.findHandlers(this._events, type);
      allEvents = this.findHandlers(this._events, 'all');
      return this.triggerHanders(events, args) &&
      this.triggerHanders(allEvents, arguments);
    }
  };
//   trigger: function( type/*, args...*/ ) {
//     var args = [].slice.call( arguments, 1 ),
//         opts = this.options,
//         name = 'on' + type.substring( 0, 1 ).toUpperCase() +
//             type.substring( 1 );

//     if (
//             // 调用通过on方法注册的handler.
//             Mediator.trigger.apply( this, arguments ) === false ||

//             // 调用opts.onEvent
//             $.isFunction( opts[ name ] ) &&
//             opts[ name ].apply( this, args ) === false ||

//             // 调用this.onEvent
//             $.isFunction( this[ name ] ) &&
//             this[ name ].apply( this, args ) === false ||

//             // 广播所有uploader的事件。
//             Mediator.trigger.apply( Mediator,
//             [ this, type ].concat( args ) ) === false ) {

//         return false;
//     }

//     return true;
// }

  /**
   * 中介者，它本身是个单例，但可以通过[installTo](#WebUploader:Mediator:installTo)方法，使任何对象具备事件行为。
   * 主要目的是负责模块与模块之间的合作，降低耦合度。
   *
   * @class Mediator
   */
  installTo(obj) {
  
 
    // obj.prototype=this.protos
    obj=Object.assign(obj,this.protos)
    
    return obj
  }
  // return class {
  //   constructor() {
  //     this.installTo = function (obj) {
  //       return Object.assign(this, ...protos)
  //     }

  //   }
  // }
}



// define('mediator', ['base'], function (Base) {
//   var $ = Base.$,
//     slice = [].slice,
//     separator = /\s+/,
//     protos;

//   // 根据条件过滤出事件handlers.
//   function findHandlers(arr, name, callback, context) {
//     return arr.filter((handler) => {
//       return handler &&
//         (!name || handler.e === name) &&
//         (!callback || handler.cb === callback ||
//           handler.cb._cb === callback) &&
//         (!context || handler.ctx === context);

//     })
//     // return $.grep( arr, function( handler ) {
//     //     return handler &&
//     //             (!name || handler.e === name) &&
//     //             (!callback || handler.cb === callback ||
//     //             handler.cb._cb === callback) &&
//     //             (!context || handler.ctx === context);
//     // });
//   }

//   function eachEvent(events, callback, iterator) {
//     // 不支持对象，只支持多个event用空格隔开
//     (events || '').split(separator).map((_, key => {
//       iterator(key, callback);
//     }))
//     // $.each( (events || '').split( separator ), function( _, key ) {
//     //     iterator( key, callback );
//     // });
//   }

//   function triggerHanders(events, args) {
//     var stoped = false,
//       i = -1,
//       len = events.length,
//       handler;

//     while (++i < len) {
//       handler = events[i];

//       if (handler.cb.apply(handler.ctx2, args) === false) {
//         stoped = true;
//         break;
//       }
//     }

//     return !stoped;
//   }

//   protos = {

//     /**
//      * 绑定事件。
//      *
//      * `callback`方法在执行时，arguments将会来源于trigger的时候携带的参数。如
//      * ```javascript
//      * var obj = {};
//      *
//      * // 使得obj有事件行为
//      * Mediator.installTo( obj );
//      *
//      * obj.on( 'testa', function( arg1, arg2 ) {
//      *     console.log( arg1, arg2 ); // => 'arg1', 'arg2'
//      * });
//      *
//      * obj.trigger( 'testa', 'arg1', 'arg2' );
//      * ```
//      *
//      * 如果`callback`中，某一个方法`return false`了，则后续的其他`callback`都不会被执行到。
//      * 切会影响到`trigger`方法的返回值，为`false`。
//      *
//      * `on`还可以用来添加一个特殊事件`all`, 这样所有的事件触发都会响应到。同时此类`callback`中的arguments有一个不同处，
//      * 就是第一个参数为`type`，记录当前是什么事件在触发。此类`callback`的优先级比脚低，会再正常`callback`执行完后触发。
//      * ```javascript
//      * obj.on( 'all', function( type, arg1, arg2 ) {
//      *     console.log( type, arg1, arg2 ); // => 'testa', 'arg1', 'arg2'
//      * });
//      * ```
//      *
//      * @method on
//      * @grammar on( name, callback[, context] ) => self
//      * @param  {String}   name     事件名，支持多个事件用空格隔开
//      * @param  {Function} callback 事件处理器
//      * @param  {Object}   [context]  事件处理器的上下文。
//      * @return {self} 返回自身，方便链式
//      * @chainable
//      * @class Mediator
//      */
//     on: function (name, callback, context) {
//       var me = this,
//         set;

//       if (!callback) {
//         return this;
//       }

//       set = this._events || (this._events = []);

//       eachEvent(name, callback, function (name, callback) {
//         var handler = { e: name };

//         handler.cb = callback;
//         handler.ctx = context;
//         handler.ctx2 = context || me;
//         handler.id = set.length;

//         set.push(handler);
//       });

//       return this;
//     },

//     /**
//      * 绑定事件，且当handler执行完后，自动解除绑定。
//      * @method once
//      * @grammar once( name, callback[, context] ) => self
//      * @param  {String}   name     事件名
//      * @param  {Function} callback 事件处理器
//      * @param  {Object}   [context]  事件处理器的上下文。
//      * @return {self} 返回自身，方便链式
//      * @chainable
//      */
//     once: function (name, callback, context) {
//       var me = this;

//       if (!callback) {
//         return me;
//       }

//       eachEvent(name, callback, function (name, callback) {
//         var once = function () {
//           me.off(name, once);
//           return callback.apply(context || me, arguments);
//         };

//         once._cb = callback;
//         me.on(name, once, context);
//       });

//       return me;
//     },

//     /**
//      * 解除事件绑定
//      * @method off
//      * @grammar off( [name[, callback[, context] ] ] ) => self
//      * @param  {String}   [name]     事件名
//      * @param  {Function} [callback] 事件处理器
//      * @param  {Object}   [context]  事件处理器的上下文。
//      * @return {self} 返回自身，方便链式
//      * @chainable
//      */
//     off: function (name, cb, ctx) {
//       var events = this._events;

//       if (!events) {
//         return this;
//       }

//       if (!name && !cb && !ctx) {
//         this._events = [];
//         return this;
//       }

//       eachEvent(name, cb, function (name, cb) {
//         findHandlers(events, name, cb, ctx).map(() => {
//           delete events[this.id];
//         })
//         // $.each( findHandlers( events, name, cb, ctx ), function() {
//         //     delete events[ this.id ];
//         // });
//       });
//       return this;
//     },

//     /**
//      * 触发事件
//      * @method trigger
//      * @grammar trigger( name[, args...] ) => self
//      * @param  {String}   type     事件名
//      * @param  {*} [...] 任意参数
//      * @return {Boolean} 如果handler中return false了，则返回false, 否则返回true
//      */
//     trigger: function (type) {
//       var args, events, allEvents;

//       if (!this._events || !type) {
//         return this;
//       }

//       args = slice.call(arguments, 1);
//       events = findHandlers(this._events, type);
//       allEvents = findHandlers(this._events, 'all');

//       return triggerHanders(events, args) &&
//         triggerHanders(allEvents, arguments);
//     }
//   };

//   /**
//    * 中介者，它本身是个单例，但可以通过[installTo](#WebUploader:Mediator:installTo)方法，使任何对象具备事件行为。
//    * 主要目的是负责模块与模块之间的合作，降低耦合度。
//    *
//    * @class Mediator
//    */
//   return class {
//     constructor() {
//       this.installTo = function (obj) {
//         return Object.assign(this, ...protos)
//       }

//     }
//   }
//   // return $.extend({

//   //     /**
//   //      * 可以通过这个接口，使任何对象具备事件功能。
//   //      * @method installTo
//   //      * @param  {Object} obj 需要具备事件行为的对象。
//   //      * @return {Object} 返回obj.
//   //      */
//   //     installTo: function( obj ) {
//   //         return $.extend( obj, protos );
//   //     }

//   // }, protos );
// });
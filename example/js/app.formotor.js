/**
 * @file Todo application with formotor.js.
 * @author Felix Yang
 */

/* eslint-disable-next-line */
jQuery(function($) {
  'use strict'

  var Global = window || {}
  var Router = Global.Router || {}
  var Handlebars = Global.Handlebars || {}
  var Formotor = Global.Formotor || {}

  var KEYBOARD = {
    ENTER_KEY: 13,
    ESCAPE_KEY: 27
  }

  /**
   * Create application instance with tiny MVC.
   * @param {object} options
   * @returns {object}
   */
  var createMvcApp = (function () {
    var App = {
      version: '1.0.0'
    }
    var util = {
      pluralize: function (count, word) {
        return count === 1 ? word : word + 's'
      },

      compile: function (selector) {
        return Handlebars.compile($(selector).html())
      }
    }

    /**
     * Formotor component Config
     * @property {object}  todo-header     - todo input box.
     * @property {object}  todo-content    - todo list.
     * @property {object}  todo-footer     - todo status bar.
     */
    App.components = {
      'todo-header': {
        ready: function () {
          this.build()
        },
        methods: {
          build: function () {
            this.bindEvents()
          },

          bindEvents: function () {
            this.$el.on('keyup', '.new-todo', this.create)

            this.$listen('tree:render', this.render)
          },

          render: function () {
            this.$find('.new-todo').focus()
          },

          create: function (e) {
            var self = this
            var $element = $(e.target)
            var todoTask = $element.val().trim()

            if (e.which !== KEYBOARD.ENTER_KEY || !todoTask) {
              return
            }

            self.model.addTodo({
              title: todoTask,
              completed: false
            })

            $element.val('')

            self.$broadcast('tree:render')
          }
        }
      },

      'todo-content': {
        ready: function () {
          this.build()
        },
        methods: {
          build: function () {
            this.todoTemplate = util.compile('#todo-template')

            this.bindEvents()
          },

          bindEvents: function () {
            this.$el
              .on('change', '.toggle-all', this.toggleAll)
              .on('change', '.toggle', this.toggle)
              .on('dblclick', '.title', this.editTodo)
              .on('keyup', '.edit', this.editKeyup)
              .on('focusout', '.edit', this.update)
              .on('click', '.destroy', this.destroy)

            this.$listen('tree:render', this.render)
          },

          render: function () {
            var self = this
            var model = self.model
            var todos = model.getFilteredTodos()

            self.$el.toggle(todos.length > 0)
            self.$find('.todo-list').html(self.todoTemplate(todos))
            self
              .$find('.toggle-all')
              .prop('checked', model.getActiveTodos().length === 0)
          },

          toggleAll: function (e) {
            var self = this
            var completed = $(e.target).prop('checked')

            self.model.toggleAll(completed)

            self.$broadcast('tree:render')
          },

          toggle: function (e) {
            var self = this
            var $el = $(e.target)
            var id = $el.closest('li').data('id')

            self.model.toggle(id)

            self.$broadcast('tree:render')
          },

          editTodo: function (e) {
            var $input = $(e.target)
              .closest('li')
              .addClass('editing')
              .find('.edit')
            var tempValue = $input.val()

            $input
              .val('')
              .val(tempValue)
              .focus()
          },

          editKeyup: function (e) {
            if (e.which === KEYBOARD.ENTER_KEY) {
              e.target.blur()
            }

            if (e.which === KEYBOARD.ESCAPE_KEY) {
              $(e.target)
                .data('abort', true)
                .blur()
            }
          },

          update: function (e) {
            var self = this
            var model = self.model
            var $el = $(e.target)
            var id = $el.closest('li').data('id')
            var todoTask = $el.val().trim()

            if ($el.data('abort')) {
              $el.data('abort', false)
            } else if (!todoTask) {
              model.destroy(id)
              return
            } else {
              model.updateTodo(id, todoTask)
            }

            self.$broadcast('tree:render')
          },

          destroy: function (e) {
            var self = this
            var $el = $(e.target)
            var id = $el.closest('li').data('id')

            self.model.destroy(id)

            self.$broadcast('tree:render')
          }
        }
      },

      'todo-footer': {
        ready: function () {
          this.build()
        },
        methods: {
          build: function () {
            this.footerTemplate = util.compile('#footer-template')

            this.bindEvents()
          },

          bindEvents: function () {
            this.$el.on('click', '.clear-completed', this.destroyCompleted)

            this.$listen('tree:render', this.render)
          },

          render: function () {
            var self = this
            var model = self.model
            var todoCount = model.getTodos().length
            var activeTodoCount = model.getActiveTodos().length
            var template = self.footerTemplate({
              activeTodoCount: activeTodoCount,
              activeTodoWord: util.pluralize(activeTodoCount, 'item'),
              completedTodos: todoCount - activeTodoCount,
              filter: model.getFilter()
            })

            self.$el.toggle(todoCount > 0).html(template)
          },

          destroyCompleted: function () {
            var self = this

            self.model.destroyCompleted()

            self.$broadcast('tree:render')
          }
        }
      }
    }

    /**
     * Create a MVC Model.
     * @class
     * @param {object} options
     */
    App.Model = function mvcModel (options) {
      this.options = options || {}
      this.init()
    }

    App.Model.prototype = {
      constructor: App.Model,

      init: function () {
        this.data = this.options.data || {}
      },

      getTodos: function () {
        return this.data.todos
      },

      setTodos: function (todos) {
        this.data.todos = todos
      },

      getFilter: function () {
        return this.data.filter
      },

      setFilter: function (filter) {
        this.data.filter = filter
      },

      addTodo: function (todo) {
        todo = $.extend(
          {
            id: this.genUuid()
          },
          todo
        )

        this.data.todos.push(todo)
      },

      getFilteredTodos: function () {
        var filter = this.getFilter()

        if (filter === 'active') {
          return this.getActiveTodos()
        }

        if (filter === 'completed') {
          return this.getCompletedTodos()
        }

        return this.data.todos
      },

      getActiveTodos: function () {
        return this.data.todos.filter(function (todo) {
          return !todo.completed
        })
      },

      getCompletedTodos: function () {
        return this.data.todos.filter(function (todo) {
          return todo.completed
        })
      },

      getTodoById: function (id) {
        return this.data.todos.find(function (todo) {
          return todo.id === id
        })
      },

      updateTodo: function (id, title) {
        var todo = this.getTodoById(id)

        if (todo) {
          todo.title = title
        }
      },

      toggle: function (id) {
        var todo = this.getTodoById(id)

        if (todo) {
          todo.completed = !todo.completed
        }
      },

      toggleAll: function (completed) {
        this.data.todos.forEach(function (todo) {
          todo.completed = completed
        })
      },

      destroy: function (id) {
        this.data.todos = this.data.todos.filter(function (todo) {
          return todo.id !== id
        })
      },

      destroyCompleted: function () {
        this.setTodos(this.getActiveTodos())
      },

      genUuid: function () {
        var i, random
        var uuid = ''

        for (i = 0; i < 32; i++) {
          random = (Math.random() * 16) | 0
          if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-'
          }
          uuid += (i === 12
            ? 4
            : i === 16
              ? (random & 3) | 8
              : random
          ).toString(16)
        }

        return uuid
      }
    }

    /**
     * Create a MVC View.
     * @class
     * @param {object} options
     */
    App.View = function mvcView (options) {
      this.options = options || {}
      this.init()
    }

    App.View.prototype = {
      constructor: App.View,

      init: function () {
        this.$el = $(this.options.el)
      },

      render: function () {
        if (!this.formotorTree) {
          this.createFormotorTree()
        }

        this.formotorTree.$broadcast('tree:render')
      },

      createFormotorTree: function () {
        var self = this

        /** @member {Formotor} */
        self.formotorTree = new Formotor({
          el: self.$el,
          data: {
            model: self.controller.getModel()
          },
          components: App.components
        })
      }
    }

    /**
     * Create a MVC Controller.
     * @class
     * @param {object} options
     */
    App.Controller = function mvcController (options) {
      this.options = options || {}
      this.view = this.options.view
      this.model = this.options.model
      this.init(options)
    }

    App.Controller.prototype = {
      constructor: App.Controller,

      init: function () {
        this.view.controller = this.model.controller = this
        this.router = new Router({
          '/:filter': function (filter) {
            this.model.setFilter(filter)
            this.view.render()
          }.bind(this)
        }).init('/all')
      },

      getView: function () {
        return this.view
      },

      getModel: function () {
        return this.model
      }
    }

    return function (options) {
      var app = {}

      app.view = new App.View(options)
      app.model = new App.Model(options)
      app.controller = new App.Controller(
        $.extend(
          {
            view: app.view,
            model: app.model
          },
          options
        )
      )
      return app
    }
  })()

  Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  })

  // run application
  createMvcApp({
    el: '.todoapp',
    data: {
      todos: []
    }
  })
})

mongoose = require('mongoose')

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

# ---------------------------------------------------------------------
#   helper functions
# ---------------------------------------------------------------------

# Extend a source object with the properties of another object (shallow copy).
extend = (dst, src) ->
  for key, val of src
    dst[key] = val
  dst

# Add missing properties from a `src` object.
defaults = (dst, src) ->
  for key, val of src
    if not (key of dst)
      dst[key] = val
  dst

# Add a new field by name to a mongoose schema
addSchemaField = (schema, pathname, fieldSpec) ->
  fieldSchema = {}
  fieldSchema[pathname] = fieldSpec
  schema.add fieldSchema

# ---------------------------------------------------------------------
#   M O N G O O S E   P L U G I N S
# ---------------------------------------------------------------------
# http://mongoosejs.com/docs/plugins.html

createdModifiedPlugin = (schema, options={}) ->
  defaults options,
    createdName: null
    modifiedName: null
    index: false
  createdName = options.createdName
  modifiedName = options.modifiedName
  if createdName?
    addSchemaField schema, createdName,
      type: Date
      default: () -> null
  if modifiedName?
    addSchemaField schema, modifiedName,
      type: Date
      default: () -> null
  schema.pre "save", (next) ->
    if modifiedName?
      @[modifiedName] = new Date()
    if createdName? and @.get(createdName) in [undefined, null]
      @[createdName] = new Date()
    next()

  schema.path(createdName).index options.index if options.index and createdName?
  schema.path(modifiedName).index options.index if options.index and modifiedName?

# -- exports ----------------------------------------------------------

module.exports =
  createdModifiedPlugin: createdModifiedPlugin

var ObjectId, Schema, addSchemaField, createdModifiedPlugin, defaults, extend, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

ObjectId = Schema.ObjectId;

extend = function(dst, src) {
  var key, val;
  for (key in src) {
    val = src[key];
    dst[key] = val;
  }
  return dst;
};

defaults = function(dst, src) {
  var key, val;
  for (key in src) {
    val = src[key];
    if (!(key in dst)) {
      dst[key] = val;
    }
  }
  return dst;
};

addSchemaField = function(schema, pathname, fieldSpec) {
  var fieldSchema;
  fieldSchema = {};
  fieldSchema[pathname] = fieldSpec;
  return schema.add(fieldSchema);
};

createdModifiedPlugin = function(schema, options) {
  var createdName, modifiedName;
  if (options == null) {
    options = {};
  }
  defaults(options, {
    createdName: null,
    modifiedName: null,
    index: false
  });
  createdName = options.createdName;
  modifiedName = options.modifiedName;
  if (createdName != null) {
    addSchemaField(schema, createdName, {
      type: Date,
      "default": function() {
        return null;
      }
    });
  }
  if (modifiedName != null) {
    addSchemaField(schema, modifiedName, {
      type: Date,
      "default": function() {
        return null;
      }
    });
  }
  schema.pre("save", function(next) {
    var _ref;
    if (modifiedName != null) {
      this[modifiedName] = new Date();
    }
    if ((createdName != null) && ((_ref = this.get(createdName)) === (void 0) || _ref === null)) {
      this[createdName] = new Date();
    }
    return next();
  });
  if (options.index && (createdName != null)) {
    schema.path(createdName).index(options.index);
  }
  if (options.index && (modifiedName != null)) {
    return schema.path(modifiedName).index(options.index);
  }
};

module.exports = {
  createdModifiedPlugin: createdModifiedPlugin
};

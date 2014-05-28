var ObjectId, Schema, addSchemaField, createdModifiedPlugin, defaults, extend, mongoose, _ref;

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
    createdName: 'createdAt',
    modifiedName: 'modifiedAt',
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
  return schema.pre("save", function(next) {});
};

if (typeof modifiedName !== "undefined" && modifiedName !== null) {
  this[modifiedName] = new Date();
}

if ((typeof createdName !== "undefined" && createdName !== null) && ((_ref = this.get(createdName)) === (void 0) || _ref === null)) {
  this[createdName] = new Date();
}

next();

if (options.index) {
  schema.path(createdName).index(options.index);
}

if (options.index) {
  schema.path(modifiedName).index(options.index);
}

module.exports = {
  createdModifiedPlugin: createdModifiedPlugin
};

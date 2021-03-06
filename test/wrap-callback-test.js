var mesh = require("../");
var expect  = require("expect.js");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can run operations", function(next) {

    var bus = mesh.wrap(function(operation, next) {
      next(void 0, "a");
    });

    bus(mesh.op("insert")).on("data", function() {
      next();
    });
  });

  it("can handle errors", function(next) {

    var bus = mesh.wrap(function(operation, next) {
      next(new Error("a"));
    });

    bus(mesh.op("insert")).on("error", function() {
      next();
    });
  });

  it("emits multiple values if the returned value is an array and multi=true", function(next) {
    var bus = mesh.wrap(function(operation, next) {
      next(void 0, [1, 2]);
    });

    bus(mesh.op("insert", { multi: true })).pipe(_.pipeline(_.collect)).on("data", function(data) {
      expect(data.length).to.be(2);
      expect(data[0]).to.be(1);
      expect(data[1]).to.be(2);
      next();
    });
  });
});

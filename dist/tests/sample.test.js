"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
describe('calculate', function () {
    it('add', function () {
        let result = 2 + 5;
        (0, chai_1.expect)(result).equal(7);
    });
    it('substract', function () {
        let result = 5 - 3;
        (0, chai_1.expect)(result).equal(3);
    });
});

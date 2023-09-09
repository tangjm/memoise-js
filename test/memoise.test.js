const { expect } = require("chai");
const memoise = require("../src/index");

const f = () => 10;
const sum = (a, b) => a + b;
const fib = (n) => (n <= 1 ? 1 : fib(n - 1) + fib(n - 2));
const fact = (n) => (n <= 1 ? 1 : fact(n - 1) * n);
const pow = (a, b) => Math.pow(a, b);

describe("Correctness checks", () => {
  it("0-arity function", () => {
    let calls = 0;
    const memoisedFn = memoise(function () {
      calls += 1;
      return f();
    });
    expect(memoisedFn()).to.equal(10);
    expect(memoisedFn()).to.equal(10);

    expect(calls).to.equal(1);
  });


  it("sum", () => {
    let calls = 0;
    const memoisedFn = memoise(function (a, b) {
      calls += 1;
      return sum(a, b);
    });
    expect(memoisedFn(2, 2)).to.equal(4);
    expect(memoisedFn(2, 2)).to.equal(4);

    expect(calls).to.equal(1);

    expect(memoisedFn(1, 2)).to.equal(3);

    expect(calls).to.equal(2);
  });

  it("factorial", () => {
    let calls = 0;
    const memoisedFn = memoise(function (n) {
      calls += 1;
      return fact(n);
    });

    expect(memoisedFn(2)).to.equal(2);
    expect(memoisedFn(3)).to.equal(6);
    expect(memoisedFn(2)).to.equal(2);

    expect(calls).to.equal(2);

    expect(memoisedFn(3)).to.equal(6);

    expect(calls).to.equal(2);
  });

  it("fibonacci", () => {
    let calls = 0;
    const memoisedFn = memoise(function (n) {
      calls += 1;
      return fib(n);
    });

    expect(memoisedFn(5)).to.equal(8);
    expect(calls).to.equal(1);
  });

  it("sum: 0 is falsy but not undefined", () => {
    let calls = 0;
    const memoisedFn = memoise(function (a, b) {
      calls += 1;
      return sum(a, b);
    });

    expect(memoisedFn(0, 0)).to.equal(0);
    expect(memoisedFn(0, 0)).to.equal(0);
    expect(calls).to.equal(1);
  });
});

describe("More expensive computations", () => {
  it("2 ^ 32", () => {
    let calls = 0;
    const memoisedFn = memoise(function (a, b) {
      calls += 1;
      return pow(a, b);
    });
    console.time("2 ^ 32 - computed");
    let res1 = memoisedFn(2, 32);
    console.timeEnd("2 ^ 32 - computed");

    console.time("2 ^ 32 - memoised");
    let res2 = memoisedFn(2, 32);
    console.timeEnd("2 ^ 32 - memoised");

    expect(res1).to.equal(4_294_967_296);
    expect(res2).to.equal(4_294_967_296);
    expect(calls).to.equal(1);
  });

  it("factorial", () => {
    let calls = 0;
    const memoisedFn = memoise(function (n) {
      calls += 1;
      return fact(n);
    });
    let num = 100;
    console.time(`fact(${num}) - computed`);
    let res1 = memoisedFn(num);
    console.timeEnd(`fact(${num}) - computed`);

    console.time(`fact(${num}) - memoised`);
    let res2 = memoisedFn(num);
    console.timeEnd(`fact(${num}) - memoised`);

    expect(res1).to.equal(9.33262154439441e157);
    expect(res2).to.equal(9.33262154439441e157);
    expect(calls).to.equal(1);
  });

  it("fib", () => {
    let calls = 0;
    const memoisedFn = memoise(function (n) {
      calls += 1;
      return fib(n);
    });
    let num = 32;
    console.time(`fib(${num}) - computed`);
    let res1 = memoisedFn(num);
    console.timeEnd(`fib(${num}) - computed`);

    console.time(`fib(${num}) - memoised`);
    let res2 = memoisedFn(num);
    console.timeEnd(`fib(${num}) - memoised`);

    expect(res1).to.equal(3524578);
    expect(res2).to.equal(3524578);
    expect(calls).to.equal(1);
  });
});

describe("Test on larger number of arguments", () => {
  it("Math.min of 100 numbers", () => {
    let calls = 0;
    let args = [-1];
    for (let i = 1; i < 100; i++) {
      args.push(Math.floor(Math.random() * 100) + 1);
    }
    const memoisedFn = memoise(function (...args) {
      calls += 1;
      console.log(args[0]);
      return Math.min(...args);
    });

    const res1 = memoisedFn(...args);
    const res2 = memoisedFn(...args);

    expect(res1).to.equal(-1);
    expect(res2).to.equal(-1);
    expect(calls).to.equal(1);
  });
});

describe("Test on larger cache sizes", () => {
  it("Sum of Cartesian products", () => {
    let calls = 0;
    const memoisedFn = memoise(function (a, b) {
      calls += 1;
      return sum(a, b);
    });

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        memoisedFn(i, j);
      }
    }

    expect(calls).to.equal(25);
  });
});

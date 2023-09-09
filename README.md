### Memoise 

Memoise pure javascript functions with arbitrary arity. 

Example use  

```javascript 
const memoize = require("memoise-js"); 

let calls = 0;
function add(a, b) {
  calls += 1;
  return a + b;
}

const addMemo = memoize(add);

addMemo(2, 2) // 4
addMemo(2, 2) // 4

console.log(calls) // 1 
```

### Development setup

Install dependencies 

```bash 
npm i 
```

Tests 

```bash 
npm run test 
# Test with debug messages
npm run test-debug
```
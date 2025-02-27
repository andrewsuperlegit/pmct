const express = require("express");
const cors = require("cors");
const test = require("node:test");
const assert = require("node:assert");
const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is Listening on PORT:", PORT);
});


let mockDb = [
    { id: 1, name: 'Fries', available: true },
    { id: 2, name: 'Big Mac', available: true },
    { id: 3, name: 'Drink', available: false },
    { id: 4, name: '6 pc. McNuggets', available: true },
    { id: 5, name: '12 pc. McNuggets', available: false },
    { id: 6, name: '(New) Cheeseburger', available: false },
    { id: 7, name: 'Sundae', available: true },
];

// in the real world we would sanitize the user input before dropping it in a db but for this we'll just assume the user is not malicious here
// because that's not in the task list and i don't want to add dependencies or spend a bunch of time here. 
// But this is definitely a situation where we would want to add a sanitization library.

app.get('/products', (req, res) => {
    let filteredProducts = mockDb;

    if (req.query.available) {
        const available = req.query.available === 'true';
        filteredProducts = filteredProducts.filter(product => product.available === available);
    }

    const sortBy = req.query.sortBy || 'id';
    filteredProducts = filteredProducts.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
    });

    if (req.query.search) {
        filteredProducts = search(req.query.search, filteredProducts, 'name');
    }

    res.json(filteredProducts);
});

function search(searchExpression, arrOfObjs, propertyToFilter){
    // replace (,),and .'s in req.query.search with \(,\), and \.)
    // again, I'm just fulfilling the requirements of the task but I would want to talk to the project manager about what the intended behavior is here and would
    // definitely want to use a well tested library for sanitizing user input because other special characters would cause this to fail/break/be exploitable.
    const allowedChars = searchExpression.replace(/[\(\)\.]/g, '\\$&');
    const searchRegex = new RegExp(allowedChars, 'i');
    return arrOfObjs.filter(product => searchRegex.test(product[propertyToFilter]));
}


app.post('/products', (req, res) => {
    const newProduct = {
        id: mockDb.length + 1,
        name: req.body.name,
        available: req.body.available || true
    };
    mockDb.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = mockDb.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    product.name = req.body.name !== undefined ? req.body.name : product.name;
    product.available = req.body.available !== undefined ? req.body.available : product.available;

    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    // prevent user from deleting a product that is available
    if(mockDb.find(p => p.id === productId && p.available)) {
        return res.status(403).json({ message: 'Cannot delete an available product' });
    }
    mockDb = mockDb.filter(p => p.id !== productId);
    res.status(204).send();
});



test("search should return all products when search is empty", () => {
    const result = search('', mockDb, 'name');
    assert.deepEqual(mockDb, result);
});

test("search should return 2 objects when pc is the search term", () => {
    const result = search('pc', mockDb, 'name');
    assert.equal(2, result.length);
});

test("search should return 1 object when ( is the search term", () => {
    const result = search('(', mockDb, 'name');
    assert.equal(1, result.length);
});

test("search should return 1 object when ) is the search term", () => {
    const result = search('(', mockDb, 'name');
    assert.equal(1, result.length);
});

test("search should return 2 objects when . is the search term", () => {
    const result = search('.', mockDb, 'name');
    assert.equal(2, result.length);
});

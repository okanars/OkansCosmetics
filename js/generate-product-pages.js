// Product Page Generator Script
// This script generates individual product detail pages from the template

const fs = require('fs');
const path = require('path');

// Read the template
const templatePath = path.join(__dirname, '../urunler/product-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Read products data
const productsPath = path.join(__dirname, 'products.js');
const productsContent = fs.readFileSync(productsPath, 'utf8');

// Extract products array (simple regex approach)
const productsMatch = productsContent.match(/const products = (\[[\s\S]*?\]);/);
if (!productsMatch) {
    console.error('Could not find products array in products.js');
    process.exit(1);
}

// Evaluate the products array (in a real scenario, you'd use a proper JSON parser)
const productsCode = productsMatch[1];
const products = eval(productsCode);

// Create urunler directory if it doesn't exist
const urunlerDir = path.join(__dirname, '../urunler');
if (!fs.existsSync(urunlerDir)) {
    fs.mkdirSync(urunlerDir, { recursive: true });
}

// Generate individual product pages
products.forEach(product => {
    if (!product.slug) {
        console.warn(`Product ${product.name} has no slug, skipping...`);
        return;
    }
    
    const productPagePath = path.join(urunlerDir, `${product.slug}.html`);
    
    // Create a copy of the template for this product
    let productPage = template;
    
    // Update meta tags
    productPage = productPage.replace(
        /<title id="page-title">.*?<\/title>/,
        `<title id="page-title">${product.name} - KozmetikKimya</title>`
    );
    
    productPage = productPage.replace(
        /<meta name="description" id="page-description" content=".*?">/,
        `<meta name="description" id="page-description" content="${product.description}">`
    );
    
    // Update breadcrumb
    productPage = productPage.replace(
        /<span id="breadcrumb-product">.*?<\/span>/,
        `<span id="breadcrumb-product">${product.name}</span>`
    );
    
    // Write the product page
    fs.writeFileSync(productPagePath, productPage, 'utf8');
    console.log(`Generated: ${product.slug}.html`);
});

console.log(`\nGenerated ${products.length} product detail pages!`);
console.log('Product pages are now available at: /urunler/[product-slug].html'); 
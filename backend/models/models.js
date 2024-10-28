// models/models.js
const sequelize = require("../db");
const { DataTypes } = require("sequelize");

// Модель User
// models/models.js

const User = sequelize.define("users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    first_name: { type: DataTypes.STRING(100) },
    last_name: { type: DataTypes.STRING(100) },
    phone_number: { type: DataTypes.STRING(20), unique: true },
    address: { type: DataTypes.STRING(255) },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'USER' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    timestamps: false,
});


// Модель ShippingAddress
const ShippingAddress = sequelize.define("shipping_addresses", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    order_id: { type: DataTypes.INTEGER, allowNull: true },
    address_line1: { type: DataTypes.STRING(255), allowNull: false },
    address_line2: { type: DataTypes.STRING(255) },
    city: { type: DataTypes.STRING(100), allowNull: false },
    region: { type: DataTypes.STRING(100), allowNull: false },
    postal_index: { type: DataTypes.STRING(5) },
    country: { type: DataTypes.STRING(100), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    guest_first_name: { type: DataTypes.STRING(100) },
    guest_last_name: { type: DataTypes.STRING(100) },
    guest_phone_number: { type: DataTypes.STRING(20) },
}, {
    timestamps: false,
    validate: {
        userOrGuest() {
            if (!this.user_id && !(this.guest_first_name && this.guest_last_name && this.guest_phone_number)) {
                throw new Error('Either user_id or guest information must be provided.');
            }
        },
    },
});

// models/models.js

const Product = sequelize.define("products", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    primary_image_id: { type: DataTypes.INTEGER },
    image_url: { type: DataTypes.STRING(255) }, // Добавлено поле image_url
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    category_id: { type: DataTypes.INTEGER },
    size_id: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    timestamps: false,
});

// Модель Order
const Order = sequelize.define("orders", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.STRING(50), defaultValue: 'pending' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    timestamps: false,
});

// Модель OrderItem
const OrderItem = sequelize.define("order_items", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER },
    product_id: { type: DataTypes.INTEGER },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
    timestamps: false,
});

// Модель Payment
const Payment = sequelize.define("payments", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER },
    payment_method: { type: DataTypes.STRING(50), allowNull: false },
    payment_status: { type: DataTypes.STRING(50), defaultValue: 'pending' },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    timestamps: false,
});

// Модель Category
const Category = sequelize.define("categories", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    timestamps: false,
});

// Модель ProductImage
const ProductImage = sequelize.define("product_images", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER },
    image_url: { type: DataTypes.STRING(255), allowNull: false },
    alt_text: { type: DataTypes.STRING(255) },
    position: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    timestamps: false,
});

// Модель ProductReview
const ProductReview = sequelize.define("product_reviews", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    product_id: { type: DataTypes.INTEGER },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    review_text: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    timestamps: false,
});

// Модель ProductSize
const ProductSize = sequelize.define("product_sizes", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER },
    S: { type: DataTypes.BOOLEAN, defaultValue: false },
    M: { type: DataTypes.BOOLEAN, defaultValue: false },
    L: { type: DataTypes.BOOLEAN, defaultValue: false },
    XL: { type: DataTypes.BOOLEAN, defaultValue: false },
    XXL: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    timestamps: false,
});

// Ассоциации моделей
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(ShippingAddress, { foreignKey: 'user_id' });
ShippingAddress.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });

Product.hasOne(ProductSize, { foreignKey: 'product_id' });
ProductSize.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductReview, { foreignKey: 'product_id' });
ProductReview.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(ProductReview, { foreignKey: 'user_id' });
ProductReview.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    User,
    ShippingAddress,
    Product,
    Order,
    OrderItem,
    Payment,
    Category,
    ProductImage,
    ProductReview,
    ProductSize,
};

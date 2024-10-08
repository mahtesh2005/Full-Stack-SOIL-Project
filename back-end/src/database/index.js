
const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  Op: Sequelize.Op
};

// Create Sequelize instance.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.profile = require("./models/profile.js")(db.sequelize, DataTypes);
db.special = require("./models/special.js")(db.sequelize, DataTypes);
db.standard = require("./models/standard.js")(db.sequelize, DataTypes);
db.shop = require("./models/shop.js")(db.sequelize, DataTypes);
db.order = require("./models/order.js")(db.sequelize, DataTypes);
db.review = require("./models/review.js")(db.sequelize, DataTypes);
db.follower = require("./models/follower.js")(db.sequelize, DataTypes);


// Define associations.
db.user.hasOne(db.profile, { foreignKey: 'userID' });
db.profile.belongsTo(db.user, { foreignKey: 'userID' });

db.user.belongsToMany(db.user, { as: 'Followers', through: db.follower, foreignKey: 'followedID' });
db.user.belongsToMany(db.user, { as: 'Following', through: db.follower, foreignKey: 'followerID' });

db.review.belongsTo(db.user, { foreignKey: 'username', targetKey: 'username' });
db.user.hasMany(db.review, { foreignKey: 'username', sourceKey: 'username' });

db.review.belongsTo(db.standard, { foreignKey: 'itemID', constraints: false });
db.standard.hasMany(db.review, { foreignKey: 'itemID', constraints: false });

db.review.belongsTo(db.special, { foreignKey: 'itemID', constraints: false });
db.special.hasMany(db.review, { foreignKey: 'itemID', constraints: false });

db.order.belongsTo(db.special, { foreignKey: 'itemID', constraints: false });
db.special.hasMany(db.order, { foreignKey: 'itemID', constraints: false });

db.order.belongsTo(db.standard, { foreignKey: 'itemID', constraints: false });
db.standard.hasMany(db.order, { foreignKey: 'itemID', constraints: false });

db.shop.belongsTo(db.special, { foreignKey: 'itemID', constraints: false });
db.special.hasMany(db.shop, { foreignKey: 'itemID', constraints: false });

db.shop.belongsTo(db.standard, { foreignKey: 'itemID', constraints: false });
db.standard.hasMany(db.shop, { foreignKey: 'itemID', constraints: false });

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  // await db.sequelize.sync({ force: true });
  
  await seedData();
  await specialData();
  await standardData();
 // await shopData();

};

async function seedData() {
  const expectedUserCount = 2; // Update this with the expected number of user records

  const count = await db.user.count();

  // Only seed data if necessary.
  if (count < expectedUserCount) {
    const argon2 = require("argon2");

    let hash = await argon2.hash("abc123", { type: argon2.argon2id });
    const user1 = await db.user.create({ username: "mbolger", password_hash: hash, email: "Mbolger123!@gmail.com" });
    console.log("Created user1 with ID:", user1.userId);

    hash = await argon2.hash("def456", { type: argon2.argon2id });
    const user2 = await db.user.create({ username: "shekhar", password_hash: hash, email: "Shekhar123!@gmail.com" });
    console.log("Created user2 with ID:", user2.userId);

    const dateOfJoining = new Date().toISOString().split('T')[0]; // Format the date to 'YYYY-MM-DD'
  
    await db.profile.create({ userID: user1.userID, dateOfJoining: dateOfJoining, userRole: "admin", numFollowers: 10, numFollowing: 5 });
    await db.profile.create({ userID: user2.userID, dateOfJoining: dateOfJoining, userRole: "user", numFollowers: 8, numFollowing: 6 });
  }
}

async function specialData() {
  const specialItems = [
    { itemID: 1, item_name: "Cheese", original_price: 8.99, item_price: 7.99, category: "Pantry Staples", item_image: 'https://img.freepik.com/free-photo/assortment-pieces-cheese_144627-22903.jpg?w=1800&t=st=1717159805~exp=1717160405~hmac=25ec53c891ed1bd216e2bbcd245628f5a2d0815c4d304fd0667bbf6bbc1fe78b'},
    { itemID: 2, item_name: "Avocado", original_price: 3.99, item_price: 3.49, category: "Fruits", item_image: 'https://img.freepik.com/free-photo/green-avocados-white-surface_144627-45153.jpg?w=1800&t=st=1717159032~exp=1717159632~hmac=a16e736443cce0531987056289b1d87d5185fa075ef5d22bc9ff92976ea00dad'},
    { itemID: 3, item_name: "Eggs", original_price: 29.99, item_price: 25.99, category: "Pantry Staples", item_image: 'https://img.freepik.com/free-photo/three-fresh-organic-raw-eggs-isolated-white-surface_114579-43677.jpg?w=1800&t=st=1717159071~exp=1717159671~hmac=0a128e19b40a55ef2865d0d58030f1fb77fec770ff875749dac6dd7bf3325aaa'},
    { itemID: 4, item_name: "Mushrooms", original_price: 29.99, item_price: 26.99, category: "Vegetables", item_image: 'https://img.freepik.com/free-photo/champignon-mushroom_1398-718.jpg?w=1380&t=st=1717159164~exp=1717159764~hmac=0bbe8868b1e3e996652f2f6d6da8ab477530446f4da377fda0186542daccc69d'},
    { itemID: 5, item_name: "Chia Seeds", original_price: 9.99, item_price: 8.49, category: "Nuts & Grains", item_image: 'https://img.freepik.com/free-photo/front-view-jar-full-seeds_23-2148536619.jpg?t=st=1717159216~exp=1717162816~hmac=289d3618396f3efa13f335cf778ae0654f43722ecd79c3063288b2c4e324f0de&w=826'},
    { itemID: 6, item_name: "Saffron", original_price: 19.99, item_price: 17.99, category: "Pantry Staples", item_image: 'https://img.freepik.com/free-photo/saffron-spice-still-life-composition_23-2149130016.jpg?t=st=1717159289~exp=1717162889~hmac=84c4d94115ccfd4e6f20883ad6f933ac30c88d15c8d7de8daa23e7c03ad854ec&w=1800'},
    { itemID: 7, item_name: "Organic Milk", original_price: 5.99, item_price: 4.99, category: "Pantry Staples", item_image: 'https://img.freepik.com/free-photo/milk-bottle-glass-arrangement-with-white-background_23-2149415061.jpg?t=st=1717159488~exp=1717163088~hmac=01d2005afa949a6f7582f82e6d77f13af6d2ea9a66f7807e855953fd8592d004&w=826'},
    { itemID: 8, item_name: "Tea Bags", original_price: 7.99, item_price: 6.49, category: "Pantry Staples", item_image: 'https://img.freepik.com/free-vector/realistic-colorful-tea_52683-32222.jpg?t=st=1717159532~exp=1717163132~hmac=0a7e94048f808e470e0410069e536f561e06db79cc1ceb51aee615c8aa37ba22&w=1380'},
    { itemID: 9, item_name: "Coffee", original_price: 8.99, item_price: 7.49, category: "Nuts & Grains", item_image: 'https://img.freepik.com/free-photo/coffee-jar_1203-7024.jpg?t=st=1717159694~exp=1717163294~hmac=7f07ce0563ba52d6ec53ee132792d5aaae1f9b76c8d358f9ae5764d06406acea&w=826'},
    { itemID: 10, item_name: "Lemon Curd", original_price: 4.99, item_price: 4.29, category: "Pantry Staples", item_image: 'https://img.freepik.com/free-photo/transparent-jar-with-fruit-yogurt_23-2148660476.jpg?t=st=1717159745~exp=1717163345~hmac=16446c3af7e986785b452d8838aa3a561e4081162c6674561e8ea83ce334181d&w=826'},
  ];

  // Create the special items in the database.
  for (const item of specialItems) {
    await db.special.create(item);
  }
}


async function standardData() {
  const standardItems = [
    { itemID: 11, item_name: "Apples", item_price: 2.49, category: "Fruits", item_image: 'https://img.freepik.com/free-photo/apples-red-fresh-mellow-juicy-perfect-whole-white-desk_179666-271.jpg?w=1800&t=st=1716615314~exp=1716615914~hmac=b90105bc142c6bdeac3388f5ef45d653b982687d9c869c259ef1a2366a280415'},
    { itemID: 12, item_name: "Bananas", item_price: 1.99, category: "Fruits", item_image: 'https://img.freepik.com/free-photo/bananas-white-background_1187-1671.jpg?t=st=1717052857~exp=1717056457~hmac=fb3fd5588e5d64638403dca57b82e4484783c175f5f5cbdb9f418dff50ce8ff8&w=1380'},
    { itemID: 13, item_name: "Blueberries", item_price: 15.99, category: "Fruits" , item_image: 'https://img.freepik.com/free-photo/blueberry_74190-2917.jpg?w=1800&t=st=1717053239~exp=1717053839~hmac=280faa96c0eba4aed39fb746b4a1f089cb907431cde12b50402b43e60dba8978'},
    { itemID: 14, item_name: "Watermelon", item_price: 7.49, category: "Fruits" , item_image: 'https://img.freepik.com/free-photo/falling-watermelon-slices-isolated-white-background_123827-29595.jpg?w=1800&t=st=1717053322~exp=1717053922~hmac=752d7df24fd257567b1b53029fef24aa03a71b3a50d9c66274b3e17cea8e9159'},
    { itemID: 15, item_name: "Mangos", item_price: 8.99, category: "Fruits" , item_image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 16, item_name: "Lemons", item_price: 5.99, category: "Fruits" , item_image: 'https://images.unsplash.com/photo-1587486937303-32eaa2134b78?q=80&w=2962&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 17, item_name: "Oranges", item_price: 7.99, category: "Fruits" , item_image: 'https://images.unsplash.com/photo-1609424572698-04d9d2e04954?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 18, item_name: "Kiwis", item_price: 4.99, category: "Fruits" , item_image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 19, item_name: "Raspberries", item_price: 20.99, category: "Fruits" , item_image: 'https://images.unsplash.com/photo-1642372849475-5a3ea061af8c?q=80&w=2467&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 20, item_name: "Peaches", item_price: 3.99, category: "Fruits" , item_image: 'https://images.unsplash.com/photo-1642372849486-f88b963cb734?q=80&w=2858&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 21, item_name: "Carrot", item_price: 1.99, category: "Vegetables" , item_image: 'https://img.freepik.com/free-photo/baby-carrots_1339-7954.jpg?w=1800&t=st=1717054065~exp=1717054665~hmac=81134e0ae904ff6e10b4716356d0a6d800534452ce8ae1c0d7c18e32b5e4896f'},
    { itemID: 22, item_name: "Broccoli", item_price: 2.99, category: "Vegetables" , item_image: 'https://images.unsplash.com/photo-1615485291234-9d694218aeb3?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 23, item_name: "Tomato", item_price: 2.49, category: "Vegetables" , item_image: 'https://images.unsplash.com/photo-1630223697313-a6f764e12109?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 24, item_name: "Eggplant", item_price: 1.99, category: "Vegetables" , item_image: 'https://images.unsplash.com/photo-1615484477545-04af2a4d851c?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 25, item_name: "Cucumber", item_price: 1.49, category: "Vegetables" , item_image: 'https://images.unsplash.com/photo-1589621316382-008455b857cd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 26, item_name: "Red Chilli", item_price: 3.99, category: "Vegetables" , item_image: 'https://images.unsplash.com/photo-1599987662084-97832741bfa2?q=80&w=2644&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 27, item_name: "Lettuce", item_price: 2.49, category: "Vegetables" , item_image: 'https://images.unsplash.com/photo-1640958904159-51ae08bd3412?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 28, item_name: "Onion", item_price: 1.49, category: "Vegetables" , item_image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 29, item_name: "Garlic", item_price: 5.99, category: "Vegetables" , item_image: 'https://images.unsplash.com/photo-1587049332298-1c42e83937a7?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 30, item_name: "Corn", item_price: 2.49, category: "Vegetables" , item_image: 'https://images.unsplash.com/photo-1615485291262-eee9f6529056?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 31, item_name: "Coconut Oil", item_price: 20.99, category: "Pantry Staples" , item_image: 'https://img.freepik.com/free-photo/natural-coconut-oil_155003-5265.jpg?w=1800&t=st=1717066217~exp=1717066817~hmac=117033195177937cdca15e02ea5e7336d72e4eb1987e15108cb7c512f6e7ac0a'},
    { itemID: 32, item_name: "Olive Oil", item_price: 15.99, category: "Pantry Staples" , item_image: 'https://img.freepik.com/free-photo/close-up-olives-oil-bottle-table_23-2148285923.jpg?t=st=1717066399~exp=1717069999~hmac=dfbca0c9cddc9640d582eae0ad4d487fcabd4d4326d983111555a6b4eb70e6bb&w=826'},
    { itemID: 33, item_name: "Argan Oil", item_price: 50.99, category: "Pantry Staples" , item_image: 'https://images.unsplash.com/photo-1667242003572-96caaf8ac5c4?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 34, item_name: "Apple Cider Vinegar", item_price: 7.99, category: "Pantry Staples" , item_image: 'https://img.freepik.com/free-photo/front-view-red-apple-vinegar-blue-wall-food-drink-red-fruit-alcohol-wine-sour-color-juice_179666-17607.jpg?w=826&t=st=1717066520~exp=1717067120~hmac=6d793186d0b6ef236ef3883d292637bbe2465be2769864d49bdf273ddba08ed7'},
    { itemID: 35, item_name: "Tomato Sauce", item_price: 3.99, category: "Pantry Staples" , item_image: 'https://img.freepik.com/free-photo/tomato-juice-glass-jars-marble-background_114579-55560.jpg?t=st=1717066744~exp=1717070344~hmac=9764c2b86c7d95d44d2c9c2ff8f005f491a1d63e4a6b7b1e67b4fe9a2287b72b&w=1800'},
    { itemID: 36, item_name: "Honey", item_price: 12.99, category: "Pantry Staples" , item_image: 'https://images.unsplash.com/photo-1621937879394-3209a3a116db?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 37, item_name: "Maple Syrup", item_price: 15.99, category: "Pantry Staples" , item_image: 'https://images.unsplash.com/photo-1552587210-5cc4cd7d13c3?q=80&w=2786&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 38, item_name: "Peanut Butter", item_price: 10.99, category: "Pantry Staples" , item_image:'https://images.unsplash.com/photo-1691480208637-6ed63aac6694?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 39, item_name: "Strawberry Jam", item_price: 5.99, category: "Pantry Staples" , item_image: 'https://img.freepik.com/free-photo/strawberry-jam-marble-background_1150-37971.jpg?w=1800&t=st=1717066983~exp=1717067583~hmac=aca1237407e7d4a392476516ff3893caaa89ab6c918f91717ff42c4561fbe672'},
    { itemID: 40, item_name: "Blueberry Jam", item_price: 7.99, category: "Pantry Staples" , item_image: 'https://img.freepik.com/free-photo/arrangement-with-jar-blueberry-jam_23-2148626032.jpg?t=st=1717067057~exp=1717070657~hmac=30545540b88f0d1ea489dae8999b7294f9590bff229c70a13889dc1c76dd6b30&w=1060'},
    { itemID: 41, item_name: "Cashews", item_price: 25.99, category: "Nuts & Grains" , item_image: 'https://images.unsplash.com/photo-1615485925873-7ecbbe90a866?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 42, item_name: "Pistachios", item_price: 30.99, category: "Nuts & Grains" , item_image:'https://images.unsplash.com/photo-1615485925933-379c8b6ad03c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 43, item_name: "Hazelnuts", item_price: 22.99, category: "Nuts & Grains" , item_image:'https://images.unsplash.com/photo-1615485737643-406ce5bac81f?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 44, item_name: "Walnuts", item_price: 28.99, category: "Nuts & Grains" , item_image: 'https://images.unsplash.com/photo-1615485737651-580c9159c89a?q=80&w=2962&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 45, item_name: "Almonds", item_price: 20.99, category: "Nuts & Grains" , item_image:'https://images.unsplash.com/photo-1615485925822-77040a19d84b?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 46, item_name: "Granola", item_price: 8.99, category: "Nuts & Grains" , item_image:'https://images.unsplash.com/photo-1668723969144-1a3aee809384?q=80&w=2786&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 47, item_name: "Oats", item_price: 4.99, category: "Nuts & Grains" , item_image: 'https://images.unsplash.com/photo-1626783417047-d47d3b4fd9bd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    { itemID: 48, item_name: "Green beans", item_price: 2.99, category: "Nuts & Grains" , item_image:'https://img.freepik.com/free-photo/delicious-green-beans_1127-218.jpg?w=1800&t=st=1717158841~exp=1717159441~hmac=48f06a1127ef931d1697f7e50a9b5984c0867e32472fd094012da0303b304dfe'},
    { itemID: 49, item_name: "Red Beans", item_price: 1.99, category: "Nuts & Grains" , item_image: 'https://img.freepik.com/free-photo/close-up-spoon-red-beans_1127-225.jpg?w=1800&t=st=1717158861~exp=1717159461~hmac=5e77c148f5de7737b28c1f95d2f4f446f89d189d38f402a675701517ba7734a0'},
    { itemID: 50, item_name: "Quinoa", item_price: 10.99, category: "Nuts & Grains" , item_image: 'https://img.freepik.com/free-photo/wheat-germ_1368-6568.jpg?t=st=1717158925~exp=1717162525~hmac=60453c11ab8d41b2a8edc7714c693a44cffef2f2834d32d0fedea8a7324a9043&w=826'},
  ];

  // Create the standard items in the database.
  for (const item of standardItems) {
    await db.standard.create(item);
  }
}
module.exports = db;
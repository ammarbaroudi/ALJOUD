"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
const user_entity_1 = require("./auth/user.entity");
const property_entity_1 = require("./properties/property.entity");
const property_image_entity_1 = require("./properties/property-image.entity");
dotenv.config();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [user_entity_1.User, property_entity_1.Property, property_image_entity_1.PropertyImage],
    synchronize: true,
});
async function seed() {
    await AppDataSource.initialize();
    console.log('✓ Connected to database');
    const userRepo = AppDataSource.getRepository(user_entity_1.User);
    const existing = await userRepo.count();
    if (existing > 0) {
        console.log('✗ Admin user already exists — seed skipped');
        await AppDataSource.destroy();
        return;
    }
    const hashed = await bcrypt.hash('admin123', 12);
    const admin = userRepo.create({
        email: 'admin@aljoud.com',
        password: hashed,
        role: user_entity_1.UserRole.ADMIN,
    });
    await userRepo.save(admin);
    console.log('✓ Admin user created: admin@aljoud.com / admin123');
    console.log('  → Change the password after first login!');
    await AppDataSource.destroy();
}
seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map
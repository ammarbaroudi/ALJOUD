import 'reflect-metadata'
import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import { User, UserRole } from './auth/user.entity'
import { Property } from './properties/property.entity'
import { PropertyImage } from './properties/property-image.entity'

dotenv.config()

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Property, PropertyImage],
  synchronize: true,
})

async function seed() {
  await AppDataSource.initialize()
  console.log('✓ Connected to database')

  const userRepo = AppDataSource.getRepository(User)

  const existing = await userRepo.count()
  if (existing > 0) {
    console.log('✗ Admin user already exists — seed skipped')
    await AppDataSource.destroy()
    return
  }

  const hashed = await bcrypt.hash('admin123', 12)
  const admin = userRepo.create({
    email: 'admin@aljoud.com',
    password: hashed,
    role: UserRole.ADMIN,
  })
  await userRepo.save(admin)

  console.log('✓ Admin user created: admin@aljoud.com / admin123')
  console.log('  → Change the password after first login!')
  await AppDataSource.destroy()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})

import { PrismaClient } from '@/app/generated/prisma'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seed database...')

  await prisma.postCategory.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()

  const categories = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.category.create({
        data: {
          name: faker.commerce.department() + ' ' + faker.number.int(9999),
          description: faker.lorem.sentence(),
        },
      })
    )
  )

  const users = []
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        profile: {
          create: {
            bio: faker.lorem.sentences(2),
          },
        },
      },
    })
    users.push(user)
  }

  for (const user of users) {
    const postCount = faker.number.int({ min: 2, max: 5 })

    for (let j = 0; j < postCount; j++) {
      const post = await prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          authorId: user.id,
        },
      })

      const selectedCategories = faker.helpers.shuffle(categories).slice(
        0,
        faker.number.int({ min: 1, max: 3 })
      )

      for (const category of selectedCategories) {
        await prisma.postCategory.create({
          data: {
            postId: post.id,
            categoryId: category.id,
          },
        })
      }

      const commentCount = faker.number.int({ min: 3, max: 6 })
      for (let k = 0; k < commentCount; k++) {
        const randomUser = faker.helpers.arrayElement(users)
        await prisma.comment.create({
          data: {
            content: faker.lorem.sentence(),
            postId: post.id,
            authorId: randomUser.id,
          },
        })
      }
    }
  }

  console.log('✅ Done seeding!')
}

main()
  .catch((e) => {
    console.error('❌ Error when seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create subscription tiers
  const subscriptionTiers = [
    {
      name: 'free',
      displayName: 'Free Trial',
      credits: 10,
      price: 0,
      features: ['10 credits', 'Basic humanization', 'AI detection scoring'],
      isActive: true,
    },
    {
      name: 'basic',
      displayName: 'Basic',
      credits: 100,
      price: 9.99,
      features: ['100 credits/month', 'Advanced humanization', 'AI detection scoring', 'Usage history'],
      isActive: true,
    },
    {
      name: 'pro',
      displayName: 'Pro',
      credits: 500,
      price: 29.99,
      features: ['500 credits/month', 'Premium humanization', 'AI detection scoring', 'Usage history', 'API access'],
      isActive: true,
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      credits: 2000,
      price: 99.99,
      features: ['2000 credits/month', 'Enterprise humanization', 'AI detection scoring', 'Usage history', 'API access', 'Priority support'],
      isActive: true,
    },
  ];

  for (const tier of subscriptionTiers) {
    await prisma.subscriptionTier.upsert({
      where: { name: tier.name },
      update: tier,
      create: tier,
    });
  }

  console.log('✅ Subscription tiers seeded successfully');
  console.log('Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

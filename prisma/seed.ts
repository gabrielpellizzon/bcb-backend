import { Plan, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log('Seeding database...');

  const client1Password = await hashPassword('password123');
  const client2Password = await hashPassword('password456');
  const client3Password = await hashPassword('adminPassword789');

  await prisma.client.create({
    data: {
      name: 'Marcos Ribeiro',
      email: 'marcos.ribeiro@email.com',
      cpf: '189021935',
      cnpj: '1892738291',
      phoneNumber: '983872123',
      companyName: 'Solution enterprise',
      password: client1Password,
      services: {
        create: {
          plan: Plan.PREPAID,
          balance: 50.0,
        },
      },
    },
  });

  await prisma.client.create({
    data: {
      name: 'Marcia Joaquina',
      email: 'marcia.joaquina@email.com',
      cpf: '192039286',
      cnpj: '82938273801',
      phoneNumber: '999288712',
      companyName: 'Plus corporation',
      password: client2Password,
      services: {
        create: {
          plan: Plan.POSTPAID,
          creditLimit: 90.0,
        },
      },
    },
  });

  await prisma.client.create({
    data: {
      name: 'Admin client',
      email: 'adminclient@email.com',
      cpf: '19283782938',
      cnpj: '82735289001',
      phoneNumber: '990877234',
      companyName: 'BCB Corporation',
      isAdmin: true,
      password: client3Password,
    },
  });

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

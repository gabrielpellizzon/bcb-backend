import { Plan, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const client1 = await prisma.client.create({
    data: {
      name: 'Marcos Ribeiro',
      email: 'marcos.ribeiro@email.com',
      phone: '12349-1102',
      cpf: '189021935',
      cnpj: '19283728192038',
      companyName: 'Solution enterprise',
      plan: Plan.PREPAID,
      balance: 50.0,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Marcia Joaquina',
      email: 'marcia.joaquina@email.com',
      phone: '19284-1202',
      cpf: '192039286',
      cnpj: '72891072835627',
      companyName: 'Plus corporation',
      plan: Plan.POSTPAID,
      creditLimit: 90.0,
    },
  });

  await prisma.message.create({
    data: {
      clientId: client1.id,
      isWhatsApp: false,
      to: '997182930',
      text: 'Mensagem enviada por SMS',
    },
  });

  await prisma.message.create({
    data: {
      clientId: client1.id,
      isWhatsApp: true,
      to: '987678345',
      text: 'Mensagem enviada por Whatsapp',
    },
  });

  await prisma.message.create({
    data: {
      clientId: client2.id,
      to: '982121345',
      isWhatsApp: true,
      text: 'Primeira mensagem enviada por whatsapp',
    },
  });

  await prisma.consumption.create({
    data: {
      clientId: client2.id,
      amount: 20.0,
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

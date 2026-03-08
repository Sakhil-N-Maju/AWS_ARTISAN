// Mock Prisma client for frontend-only application
// In a real application, the frontend should call backend APIs instead of using Prisma directly

const mockPrismaClient = {
  $connect: async () => {},
  $disconnect: async () => {},
  $transaction: async (fn: any) => fn(mockPrismaClient),
  $queryRaw: async () => [],
  $executeRaw: async () => 0,
  user: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
  },
  message: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
  },
  order: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
  },
} as any;

export const prisma = mockPrismaClient;
export default prisma;

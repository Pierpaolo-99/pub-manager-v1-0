import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();
export interface CreateSupplierInput {
  name: string;
  companyName?: string;
  vatNumber?: string;
  taxCode?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  paymentTerms?: string;
  discountPercentage?: number;
  deliveryDays?: string;
  minOrderAmount?: number;
  notes?: string;
  active?: boolean;
}

export class SuppliersService {
  // Crea fornitore con validazione duplicato
  static async createSupplier(data: CreateSupplierInput) {
    // Verifica duplicato su nome e vatNumber
    const orConditions: { [key: string]: string }[] = [{ name: data.name.trim() }];
    if (data.vatNumber) orConditions.push({ vatNumber: data.vatNumber.trim() });
    const existing = await prisma.supplier.findFirst({
      where: {
        OR: orConditions,
      },
    });
    if (existing) throw new Error("Un fornitore con questo nome o partita IVA esiste già");
    // Validazione email
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error("Formato email non valido");
    }
    return prisma.supplier.create({ data });
  }

  // Recupera tutti i fornitori con filtri avanzati
  static async getAllSuppliers(filters: {
    search?: string;
    active?: string;
    paymentTerms?: string;
    city?: string;
    country?: string;
    vatNumber?: string;
    companyName?: string;
  } = {}) {
    const { search, active, paymentTerms, city, country, vatNumber, companyName } = filters;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { contactPerson: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
        { vatNumber: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
      ];
    }
    if (active === "true") where.active = true;
    else if (active === "false") where.active = false;
    if (paymentTerms) where.paymentTerms = paymentTerms;
    if (city) where.city = city;
    if (country) where.country = country;
    if (vatNumber) where.vatNumber = vatNumber;
    if (companyName) where.companyName = companyName;
    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: [{ active: "desc" }, { name: "asc" }],
      include: { purchaseOrders: true },
    });
    // Statistiche summary
    const summary = SuppliersService.calculateSuppliersSummary(suppliers);
    return {
      suppliers,
      summary,
      filters: {
        search: search || null,
        active: active || "all",
        paymentTerms: paymentTerms || null,
        city: city || null,
        country: country || null,
        vatNumber: vatNumber || null,
        companyName: companyName || null,
      },
    };
  }

  // Recupera solo fornitori attivi (dropdown)
  static async getActiveSuppliers() {
    return prisma.supplier.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        contactPerson: true,
        email: true,
        phone: true,
      },
      orderBy: { name: "asc" },
    });
  }

  // Recupera fornitore per ID
  static async getSupplierById(id: number) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: { purchaseOrders: true },
    });
    if (!supplier) throw new Error("Fornitore non trovato");
    return supplier;
  }

  // Recupera prodotti forniti da un supplier (da tabella stock)
  static async getSupplierProducts(supplierId: number) {
    // Recupera il supplier
    const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) throw new Error("Fornitore non trovato");
    // Recupera tutti gli ordini di acquisto del supplier con i rispettivi items e ingredienti
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: { supplierId },
      include: {
        purchaseOrderItems: {
          include: { ingredient: true }
        }
      }
    });
    // FlatMap degli items per ottenere i prodotti acquistati
    const products = purchaseOrders.flatMap(order =>
      order.purchaseOrderItems.map(item => ({
        ingredientId: item.ingredientId,
        name: item.ingredient?.name || "",
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        notes: item.notes
      }))
    );
    // Statistiche
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => {
      // Prisma Decimal: usa toNumber()
      if (p.totalPrice && typeof p.totalPrice.toNumber === "function") {
        return sum + p.totalPrice.toNumber();
      }
      return sum + (typeof p.totalPrice === "number" ? p.totalPrice : 0);
    }, 0);
    const lowStockProducts = products.filter(p => {
      if (p.quantity && typeof p.quantity.toNumber === "function") {
        return p.quantity.toNumber() <= 5;
      }
      // Se è Decimal ma non ha toNumber, prova a castare
      if (typeof p.quantity === "object" && p.quantity !== null && "toString" in p.quantity) {
        return Number(p.quantity.toString()) <= 5;
      }
      return Number(p.quantity) <= 5;
    }).length;
    return {
      supplier: { id: supplierId, name: supplier.name },
      products,
      stats: {
        totalProducts,
        totalValue,
        lowStockProducts
      }
    };
  }

  // Aggiorna fornitore
  static async updateSupplier(id: number, data: Partial<CreateSupplierInput>) {
    // Validazione email
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error("Formato email non valido");
    }
    // Se aggiorni vatNumber, verifica duplicato
    if (data.vatNumber) {
      const existing = await prisma.supplier.findFirst({
        where: {
          vatNumber: data.vatNumber.trim(),
          NOT: { id },
        },
      });
      if (existing) throw new Error("Un fornitore con questa partita IVA esiste già");
    }
    return prisma.supplier.update({
      where: { id },
      data,
      include: { purchaseOrders: true },
    });
  }

  // Soft delete/disattivazione se stock associato
  static async deleteSupplier(id: number) {
    // Prendi nome supplier
    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new Error("Fornitore non trovato");
    // Cerca prodotti in stock associati
    // const stockCount = await prisma.stock.count({ where: { supplier: supplier.name } });
    // if (stockCount > 0) {
    //   await prisma.supplier.update({ where: { id }, data: { active: false } });
    //   return {
    //     message: `Fornitore disattivato (${stockCount} prodotti in stock associati)`,
    //     deactivated: true,
    //     stockProducts: stockCount,
    //   };
    // } else {
    //   await prisma.supplier.delete({ where: { id } });
    //   return { message: "Fornitore eliminato con successo", deleted: true };
    // }
    // Se non hai la tabella stock, elimina direttamente
    await prisma.supplier.delete({ where: { id } });
    return { message: "Fornitore eliminato con successo", deleted: true };
  }

  // Statistiche fornitori
  static async getSuppliersStats() {
    const stats = await prisma.supplier.aggregate({
      _count: { id: true },
      _sum: { discountPercentage: true, minOrderAmount: true },
      _avg: { discountPercentage: true, minOrderAmount: true },
      _min: { discountPercentage: true, minOrderAmount: true },
      _max: { discountPercentage: true, minOrderAmount: true },
    });
    // Statistiche custom
    const active = await prisma.supplier.count({ where: { active: true } });
    const inactive = await prisma.supplier.count({ where: { active: false } });
    const withEmail = await prisma.supplier.count({ where: { email: { not: null } } });
    const withPhone = await prisma.supplier.count({ where: { phone: { not: null } } });
    const withWebsite = await prisma.supplier.count({ where: { website: { not: null } } });
    const paymentTermsCount = await prisma.supplier.count({ where: { paymentTerms: { not: null } } });
    const countriesCount = await prisma.supplier.count({ where: { country: { not: null } } });
    return {
      totalSuppliers: stats._count.id,
      activeSuppliers: active,
      inactiveSuppliers: inactive,
      suppliersWithEmail: withEmail,
      suppliersWithPhone: withPhone,
      suppliersWithWebsite: withWebsite,
      paymentTermsCount,
      countriesCount,
    };
  }

  // Termini di pagamento disponibili
  static async getPaymentTerms() {
    const terms = await prisma.supplier.findMany({
      where: { paymentTerms: { not: null } },
      distinct: ["paymentTerms"],
      select: { paymentTerms: true },
      orderBy: { paymentTerms: "asc" },
    });
    return terms.map(t => t.paymentTerms).filter(Boolean);
  }

  // Funzione helper per summary
  static calculateSuppliersSummary(suppliers: any[]) {
    const total = suppliers.length;
    const active = suppliers.filter(s => s.active).length;
    const inactive = total - active;
    const withEmail = suppliers.filter(s => s.email && s.email.trim() !== "").length;
    const withPhone = suppliers.filter(s => s.phone && s.phone.trim() !== "").length;
    const withWebsite = suppliers.filter(s => s.website && s.website.trim() !== "").length;
    return {
      total,
      active,
      inactive,
      withEmail,
      withPhone,
      withWebsite,
      contactCompleteness: total > 0 ? Math.round((withEmail + withPhone) / total * 100) : 0,
    };
  }
}

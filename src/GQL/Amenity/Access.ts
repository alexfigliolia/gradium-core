export class Access {
  public static readonly BASIC_SELECTION = {
    id: true,
    name: true,
    open: true,
    close: true,
    price: true,
    billed: true,
    footage: true,
    propertyId: true,
    images: {
      select: {
        id: true,
        url: true,
      },
    },
    floorPlans: {
      select: {
        id: true,
        url: true,
      },
    },
  } as const;
}

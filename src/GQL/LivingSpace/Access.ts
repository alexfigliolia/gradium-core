export class Access {
  public static readonly BASIC_SELECTION = {
    id: true,
    name: true,
    beds: true,
    type: true,
    baths: true,
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

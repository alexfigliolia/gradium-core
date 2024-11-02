export class Access {
  public static ROLE_SELECTION = {
    roles: {
      select: {
        role: true,
      },
    },
  } as const;

  public static ROLE_AND_PROPERTY_ACCESS = {
    staffProfile: {
      select: {
        propertyAccess: {
          select: {
            id: true,
          },
        },
      },
    },
    roles: {
      select: {
        role: true,
      },
    },
  } as const;
}

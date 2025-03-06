import type { ILease, IRawLease } from "./Types";

export class Access {
  public static DEFAULT_SELECTION = {
    id: true,
    start: true,
    end: true,
    status: true,
    price: true,
    livingSpace: {
      select: {
        name: true,
      },
    },
    property: {
      select: {
        name: true,
      },
    },
    invites: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    lessees: {
      select: {
        id: true,
        linkedEmail: {
          select: {
            email: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    },
    terminatedDate: true,
    paymentFrequency: true,
    documents: {
      select: {
        id: true,
        url: true,
        thumbnail: true,
      },
    },
  } as const;

  public static toGQL(item: IRawLease) {
    const { lessees, livingSpace, property, ...rest } = item;
    return {
      ...rest,
      propertyName: property.name,
      spaceName: livingSpace.name,
      lessees: lessees.map(l => ({
        id: l.id,
        name: l.user.name,
        email: l.linkedEmail.email,
      })),
    } as unknown as ILease;
  }
}

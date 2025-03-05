import type { IRawLease } from "./Types";

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
        id: true,
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
    const { lessees, livingSpace, ...rest } = item;
    return {
      ...rest,
      livingSpace: livingSpace.name,
      lessees: lessees.map(l => ({
        id: l.id,
        name: l.user.name,
        email: l.linkedEmail.email,
      })),
    };
  }
}

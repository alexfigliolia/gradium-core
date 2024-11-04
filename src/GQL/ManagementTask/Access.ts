export class Access {
  public static readonly DEFAULT_SELECTION = {
    id: true,
    createdAt: true,
    title: true,
    description: true,
    status: true,
    priority: true,
    images: {
      select: {
        id: true,
        url: true,
      },
    },
    createdBy: {
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    },
    assignedTo: {
      select: {
        id: true,
        person: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    },
    expenses: {
      select: {
        id: true,
        cost: true,
        title: true,
        createdAt: true,
        description: true,
        attachments: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    },
  };
}

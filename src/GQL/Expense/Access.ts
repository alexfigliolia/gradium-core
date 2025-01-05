export class Access {
  public static readonly DEFAULT_SELECTION = {
    id: true,
    cost: true,
    title: true,
    createdAt: true,
    description: true,
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
    attachments: {
      select: {
        id: true,
        url: true,
      },
    },
  };
}

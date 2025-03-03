import { Dates } from "Tools/Dates";
import type {
  IRawAvailableRentableSpace,
  IRawAvailableSoonRentableSpace,
  IRawRentableSpace,
} from "./Types";

export class Access {
  public static readonly BASIC_SELECTION = {
    id: true,
    name: true,
    beds: true,
    type: true,
    baths: true,
    size: true,
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

  public static SELECTION_WITH_ASSOCIATIONS = {
    ...this.BASIC_SELECTION,
    property: {
      select: {
        name: true,
        _count: {
          select: {
            livingSpaces: true,
          },
        },
      },
    },
  } as const;

  public static AVAILABLE_NOW_SELECTION = {
    ...this.SELECTION_WITH_ASSOCIATIONS,
    createdAt: true,
    leases: {
      orderBy: {
        end: "desc",
      },
      take: 1,
      select: {
        end: true,
        terminatedDate: true,
      },
    },
  } as const;

  public static AVAILABLE_SOON_SELECTION = {
    ...this.SELECTION_WITH_ASSOCIATIONS,
    leases: {
      orderBy: {
        end: "desc",
      },
      take: 1,
      select: {
        end: true,
        start: true,
        status: true,
      },
    },
  } as const;

  public static transformToAvailableNow = (
    rentableSpace: IRawAvailableRentableSpace,
  ) => {
    const { leases, createdAt, ...rest } = rentableSpace;
    return {
      ...this.flattenPropertyName(rest),
      availableSince: leases.length
        ? Dates.latest(leases[0].end, leases[0].terminatedDate ?? undefined)
        : createdAt,
    };
  };

  public static transformToAvailableSoon = (
    rentableSpace: IRawAvailableSoonRentableSpace,
  ) => {
    const { leases, ...rest } = rentableSpace;
    const lease = leases[0];
    return {
      ...this.flattenPropertyName(rest),
      availableOn: lease.end,
      lease,
    };
  };

  public static flattenPropertyName(rentableSpace: IRawRentableSpace) {
    const { property, ...rest } = rentableSpace;
    return {
      ...rest,
      propertyName: property.name,
    };
  }
}

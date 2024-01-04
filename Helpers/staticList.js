export const ProcessStatus = {
    Drafts: 0,
    New: 1,
    Completed: 3,
    Forwarded: 5,
    Submitted: 6,
    Declined: 7,
    Rejected: 8,
};

export const DeliveryTypes = [
    { ID: "1", Name: "LTL-Mobile Fueling" },
    { ID: "2", Name: "LTL-Tankwagon" },
    { ID: "3", Name: "FTL-Fuel & FRT" },
    { ID: "4", Name: "FTL-Freight Only" }
];

export const UsagePeriods = [
    { Name: 'Daily', ID: 1 },
    { Name: 'Weekly', ID: 2 },
    { Name: 'Monthly', ID: 3 },
    { Name: 'Annually', ID: 4 },
  ];

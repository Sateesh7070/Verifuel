// ShipmentModel.ts

export interface ShipmentModel {
    companyName: string;
    customerId: number;
    customerName: string;
    deliveryDate: string;
    deliveryEndTime: string;
    deliveryStartTime: string;
    deliveryWindowEnd: string;
    deliveryWindowStart: string;
    demurrageEndTime: string;
    demurrageStartTime: string;
    driverId: string;
    driverName: string;
    lastModified: string;
    lastModifiedOn: string;
    listAdders: any[]; // Adjust the type as needed
    listBOL: any[][]; // Adjust the type as needed
    listShipTo: any[]; // Adjust the type as needed
    listShipmentImage: any[]; // Adjust the type as needed
    listShipmentProduct: any[][]; // Adjust the type as needed
    listTerminal: any[][]; // Adjust the type as needed
    loadingNumber: string;
    orderNumber: string;
    serviceType: number;
    shipToAddress: string;
    shipToId: number;
    shipToName: string;
    shipmentId: number;
    status: string;
    statusId: number;
    userId: string | null;
    vendorId: number;
    vendorName: string;
    vtCompanyId: number;
}

export interface Root {
    error_Code: number
    error_Msg: string
    return: number
    sProcName: any
    listNotification: any
    listShipment: ListShipment[]
    listMonitoringRegions: any[]
  }
  
  export interface ListShipment {
    shipmentId: number
    shipToId: number
    vendorId: number
    vtCompanyId: number
    companyName: string
    statusId: number
    status: string
    shipToName: string
    shipToAddress: string
    vendorName: string
    deliveryDate: string
    lastModifiedOn: string
    serviceType: number
    userId: any
    driverId: string
    lastModified: string
    orderNumber: string
    deliveryStartTime: string
    deliveryEndTime: string
    demurrageStartTime: string
    demurrageEndTime: string
    loadingNumber: string
    deliveryWindowStart: string
    deliveryWindowEnd: string
    driverName: string
    listShipmentProduct: ListShipmentProduct[]
    listShipmentImage: any[]
    listBOL: ListBol[]
    listShipTo: ListShipTo[]
    listTerminal: ListTerminal[]
    listAdders: any[]
    customerId: number
    customerName: string
  }
  
  export interface ListShipmentProduct {
    shipmentProductId: number
    shipmentID: number
    requestedProductId: number
    prodDesc: string
    gallons: number
    ticketNo: string
    capacity: number
    assetNumber: string
    bolNumber: string
    requestedProductCategoryId: number
    cardNumber: string
    startStickReading: number
    endStickReading: number
    startWaterReading: number
    endWaterReading: number
    startTotalizer: number
    endTotalizer: number
    tankNumber: string
    lineItemStatusID: number
    odometer: number
    lat: any
    lon: any
    assetTypeId: number
    notes: any
    img: any
    assetID: any
    deliveredProductId: any
    fuelingStartDateTime: any
    fuelingEndDateTime: any
    fuelingStartTime: any
    fuelingEndTime: any
  }
  
  export interface ListBol {
    id: number
    bolNumber: string
    loadingNumber: string
    supplierId: number
    terminalId: number
    vendorId: number
    startLoadTime: string
    endLoadTime: string
    truckNumber: string
    driverId: any
    isActive: boolean
    vendorName: any
    supplierName: string
    terminalName: string
    carrierName: string
    createdOn: string
    createdBy: string
    modifiedOn: any
    modifiedBy: any
    statusId: number
    type: number
    terminalGroupId: number
    listBOLProduct: ListBolproduct[]
    productId: any
  }
  
  export interface ListBolproduct {
    id: number
    lineNumber: number
    productId: number
    grossQuantity: number
    netQuantity: number
    temperature: number
    specificGravity: number
    isActive: boolean
    productDescription: string
  }
  
  export interface ListShipTo {
    customerID: number
    shiptoID: number
    customerName: any
    shipToName: string
    fromHrs: string
    toHrs: string
    polygon: string
    address1: string
    address2: string
    city: string
    stateCode: string
    stateName: any
    county: string
    country: string
    zip: string
    lat: number
    lon: number
  }
  
  export interface ListTerminal {
    terminalId: number
    terminalName: string
    address: string
    city: string
    stateCode: string
    countryCode: string
    zip: string
    lat: number
    lon: number
    distanceInMiles: number
    polygon: string
  }
  
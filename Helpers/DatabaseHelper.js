import { db } from "./DbContext";


export function InsertOrUpdateShipment(shipment) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // ... rest of your code ...
            tx.executeSql(
                `SELECT * FROM Shipment WHERE ShipmentId = ?`,
                [shipment.ShipmentId],
                (_, data) => {
                    // ... rest of your code ...

                    if (data.rows.length === 0) {
                        // Insertion
                        tx.executeSql(
                            `INSERT INTO Shipment (
                                ShipToId, ShipmentId, VendorId, VtCompanyId, comapnyName,
                                StatusId, Status, ShipToName, VendorName, DeliveryDate,
                                LastModifiedOn, OrderNumber, DeliveryStartTime, DeliveryEndTime,
                                DemurrageStartTime, DemurrageEndTime, LoadingNumber, DeliveryWindowStart,
                                DeliveryWindowEnd, CustomerName, CustomerId
                              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                            [
                                shipment.shipToId,
                                shipment.shipmentId,
                                shipment.vendorId,
                                shipment.vtCompanyId,
                                shipment.companyName,
                                shipment.statusId,
                                shipment.status,
                                shipment.shipToName,
                                shipment.vendorName,
                                shipment.deliveryDate,
                                shipment.lastModifiedOn,
                                shipment.orderNumber,
                                shipment.deliveryStartTime,
                                shipment.deliveryEndTime,
                                shipment.demurrageStartTime,
                                shipment.demurrageEndTime,
                                shipment.loadingNumber,
                                shipment.deliveryWindowStart,
                                shipment.deliveryWindowEnd,
                                shipment.customerName,
                                shipment.customerId
                            ],
                            (_, insertResult) => {
                                const rowsAffected = insertResult.rowsAffected;
                                resolve(rowsAffected);
                                console.log('Data saved');
                            },
                            (_, error) => {
                                reject(error); // Pass the error to the reject function
                                console.error(error);
                            }
                        );
                    } else {
                        // Update

                        const insertedRec = data.rows.item(0);
                        insertedRec.DeliveryWindowStart = shipment.DeliveryWindowStart;
                        insertedRec.DeliveryWindowEnd = shipment.DeliveryWindowEnd;
                        insertedRec.ShipToId = shipment.ShipToId;
                        insertedRec.StatusId = shipment.StatusId;
                        insertedRec.VtCompanyId = shipment.VTCompanyId;
                        insertedRec.comapnyName = shipment.CompanyName;
                        tx.executeSql(
                            `UPDATE Shipment 
                                SET DeliveryWindowStart = ?, 
                                    DeliveryWindowEnd = ?, 
                                    ShipToId = ?, 
                                    StatusId = ?, 
                                    VtCompanyId = ?, 
                                    comapnyName = ? 
                                WHERE ShipmentId = ?`,
                            [
                                insertedRec.DeliveryWindowStart,
                                insertedRec.DeliveryWindowEnd,
                                insertedRec.ShipToId,
                                insertedRec.StatusId,
                                insertedRec.VtCompanyId,
                                insertedRec.comapnyName,
                                shipment.ShipmentId
                            ],
                            (_, updateResult) => {
                                const rowsAffected = updateResult.rowsAffected;
                                resolve(rowsAffected);
                                console.log('Data Updated');
                            },
                            (_, error) => {
                                reject(error); // Pass the error to the reject function
                                console.error(error);
                            }
                        );
                    }
                },
                (_, error) => {
                    reject(error); // Pass the error to the reject function
                }
            );
        });
    });
}

// export function InsertOrUpdateShipment(shipment) {
//     return new Promise((resolve, reject) => {
//         db.transaction((tx) => {
//             // Check if the shipment already exists
//             tx.executeSql(
//                 `SELECT * FROM Shipment WHERE ShipmentId = ?`,
//                 [shipment.ShipmentId],
//                 (_, data) => {
//                     if (data.rows.length === 0) {
//                         // Insertion
//                         tx.executeSql(
//                             `INSERT INTO Shipment (
//                                 ShipToId, ShipmentId, VendorId, VtCompanyId, comapnyName,
//                                 StatusId, Status, ShipToName, VendorName, DeliveryDate,
//                                 LastModifiedOn, OrderNumber, DeliveryStartTime, DeliveryEndTime,
//                                 DemurrageStartTime, DemurrageEndTime, LoadingNumber, DeliveryWindowStart,
//                                 DeliveryWindowEnd, CustomerName, CustomerId
//                               ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
//                             [
//                                 shipment.shipToId,
//                                 shipment.shipmentId,
//                                 shipment.vendorId,
//                                 shipment.vtCompanyId,
//                                 shipment.companyName,
//                                 shipment.statusId,
//                                 shipment.status,
//                                 shipment.shipToName,
//                                 shipment.vendorName,
//                                 shipment.deliveryDate,
//                                 shipment.lastModifiedOn,
//                                 shipment.orderNumber,
//                                 shipment.deliveryStartTime,
//                                 shipment.deliveryEndTime,
//                                 shipment.demurrageStartTime,
//                                 shipment.demurrageEndTime,
//                                 shipment.loadingNumber,
//                                 shipment.deliveryWindowStart,
//                                 shipment.deliveryWindowEnd,
//                                 shipment.customerName,
//                                 shipment.customerId
//                                 // ... other values ...
//                             ],
//                             (_, insertResult) => {
//                                 const rowsAffected = insertResult.rowsAffected;
//                                 resolve(rowsAffected);
//                                 console.log('Data saved')
//                             },
//                             (_, error) => {
//                                 reject(error);
//                                 console.log(error)
//                             }
//                         );
//                     } else {
//                         // Update
//                         const insertedRec = data.rows.item(0);
//                         insertedRec.DeliveryWindowStart = shipment.DeliveryWindowStart;
//                         insertedRec.DeliveryWindowEnd = shipment.DeliveryWindowEnd;
//                         insertedRec.ShipToId = shipment.ShipToId;
//                         insertedRec.StatusId = shipment.StatusId;
//                         insertedRec.VtCompanyId = shipment.VTCompanyId;
//                         insertedRec.comapnyName = shipment.CompanyName;

//                         tx.executeSql(
//                             `UPDATE Shipment 
//                                 SET DeliveryWindowStart = ?, 
//                                     DeliveryWindowEnd = ?, 
//                                     ShipToId = ?, 
//                                     StatusId = ?, 
//                                     VtCompanyId = ?, 
//                                     comapnyName = ? 
//                                 WHERE ShipmentId = ?`,
//                             [
//                                 insertedRec.DeliveryWindowStart,
//                                 insertedRec.DeliveryWindowEnd,
//                                 insertedRec.ShipToId,
//                                 insertedRec.StatusId,
//                                 insertedRec.VtCompanyId,
//                                 insertedRec.comapnyName,
//                                 shipment.ShipmentId
//                             ],
//                             (_, updateResult) => {
//                                 const rowsAffected = updateResult.rowsAffected;
//                                 resolve(rowsAffected);
//                                 console.log('Data Saved')
//                             },
//                             (_, error) => {
//                                 reject(error);
//                                 console.log(error)
//                             }
//                         );
//                     }
//                 },
//                 (_, error) => {
//                     reject(error);
//                 }
//             );
//         });
//     });
// }

export function InsertOrUpdateTerminal(terminal) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // Check if the shipment already exists
            tx.executeSql(
                `SELECT * FROM Terminal WHERE TerminalId = ?`,
                [terminal.TerminalId],
                (_, data) => {
                    if (data.rows.length === 0) {
                        // Insertion
                        tx.executeSql(
                            `INSERT INTO Terminal (
                                TerminalId, TerminalName, Address, City, StateCode,
                                CountryCode, Zip, Lat, Lon, DistanceInMiles, Polygon
                              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                            [
                                terminal.terminalId,
                                terminal.terminalName,
                                terminal.address,
                                terminal.city,
                                terminal.stateCode,
                                terminal.countryCode,
                                terminal.zip,
                                terminal.lat,
                                terminal.lon,
                                terminal.distanceInMiles,
                                terminal.polygon
                                // ... other values ...
                            ],
                            (_, insertResult) => {
                                const rowsAffected = insertResult.rowsAffected;
                                resolve(rowsAffected);
                                console.log('Terminal Data Saved');
                            },
                            (_, error) => {
                                reject(error);
                            }
                        );
                    } else {
                        // Update
                        const insertedRec = data.rows.item(0);
                        insertedRec.Address = terminal.Address;
                        insertedRec.DistanceInMiles = terminal.DistanceInMiles;
                        insertedRec.StateCode = terminal.StateCode;
                        insertedRec.TerminalName = terminal.TerminalName;
                        insertedRec.City = terminal.City;
                        insertedRec.CountryCode = terminal.CountryCode;
                        insertedRec.Lat = terminal.Lat;
                        insertedRec.Lon = terminal.Lon;
                        insertedRec.Zip = terminal.Zip;
                        insertedRec.Polygon = terminal.Polygon;

                        tx.executeSql(
                            `UPDATE Terminal 
                                SET DeliveryWindowStart = ?, 
                                DistanceInMiles = ?, 
                                StateCode = ?, 
                                TerminalName = ?, 
                                City = ?, 
                                CountryCode = ?,
                                Lat = ?,
                                Lon = ?,
                                Zip = ?, 
                                Polygon = ? 
                                WHERE TerminalId = ?`,
                            [
                                insertedRec.Address,
                                insertedRec.DistanceInMiles,
                                insertedRec.StateCode,
                                insertedRec.TerminalName,
                                insertedRec.City,
                                insertedRec.CountryCode,
                                insertedRec.Lat,
                                insertedRec.Lon,
                                insertedRec.Zip,
                                insertedRec.Polygon,
                                terminal.TerminalId
                            ],
                            (_, updateResult) => {
                                const rowsAffected = updateResult.rowsAffected;
                                resolve(rowsAffected);
                                console.log('Terminal Data Updated');
                            },
                            (_, error) => {
                                reject(error);
                            }
                        );
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
}

export function InsertOrUpdateShipTo(Shipto) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // Check if the shipment already exists
            tx.executeSql(
                `SELECT * FROM ShipTo WHERE ShiptoID = ?`,
                [Shipto.ShiptoID],
                (_, data) => {
                    if (data.rows.length === 0) {
                        // Insertion
                        tx.executeSql(
                            `INSERT INTO ShipTo (
                                CustomerID, ShiptoID, CustomerName, ShipToName, FromHrs, ToHrs,
                                Polygon, Address1, Address2, City, StateCode, StateName, County,
                                Country, Zip, Lat, Lon
                              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                            [
                                Shipto.customerID,
                                Shipto.shiptoID,
                                Shipto.customerName,
                                Shipto.shipToName,
                                Shipto.fromHrs,
                                Shipto.toHrs,
                                Shipto.polygon,
                                Shipto.address1,
                                Shipto.address2,
                                Shipto.city,
                                Shipto.stateCode,
                                Shipto.stateName,
                                Shipto.county,
                                Shipto.country,
                                Shipto.zip,
                                Shipto.lat,
                                Shipto.lon
                                // ... other values ...
                            ],
                            (_, insertResult) => {
                                const rowsAffected = insertResult.rowsAffected;
                                resolve(rowsAffected);
                                console.log('ShipTo Data Saved');
                            },
                            (_, error) => {
                                reject(error);
                            }
                        );
                    } else {
                        // Update
                        const insertedRec = data.rows.item(0);
                        insertedRec.Name = Shipto.Name;
                        insertedRec.Address1 = Shipto.Address1;
                        insertedRec.Address2 = Shipto.Address2;
                        insertedRec.StateCode = Shipto.StateCode;
                        insertedRec.City = Shipto.City;
                        insertedRec.CountryCode = Shipto.CountryCode;
                        insertedRec.Lat = Shipto.Lat;
                        insertedRec.Lon = Shipto.Lon;
                        insertedRec.ZipCode = Shipto.ZipCode;
                        insertedRec.Polygon = Shipto.Polygon;
                        insertedRec.distance = Shipto.distance;
                        insertedRec.FromHours = Shipto.FromHours;
                        insertedRec.ToHours = Shipto.ToHours;

                        tx.executeSql(
                            `UPDATE Shipment 
                                SET Name = ?, 
                                Address1 = ?, 
                                Address2 = ?, 
                                StateCode = ?, 
                                City = ?, 
                                CountryCode = ?,
                                Lat = ?,
                                Lon = ?,
                                ZipCode = ?, 
                                Polygon = ?,
                                distance = ?, 
                                FromHours = ?, 
                                ToHours = ?
                                WHERE ShipToID = ?`,
                            [
                                insertedRec.Address,
                                insertedRec.DistanceInMiles,
                                insertedRec.StateCode,
                                insertedRec.TerminalName,
                                insertedRec.City,
                                insertedRec.CountryCode,
                                insertedRec.Lat,
                                insertedRec.Lon,
                                insertedRec.Zip,
                                insertedRec.Polygon,
                                insertedRec.distance,
                                insertedRec.FromHours,
                                insertedRec.ToHours,
                                Shipto.ShiptoID
                            ],
                            (_, updateResult) => {
                                const rowsAffected = updateResult.rowsAffected;
                                resolve(rowsAffected);
                                console.log('ShipTo Data Updated');
                            },
                            (_, error) => {
                                reject(error);
                            }
                        );
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
}

export function InsertOrUpdateShipmentProduct(sps) {
    const { ShipmentId, RequestedProductId } = sps;

    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // ... rest of your code ...
            tx.executeSql(
                `SELECT * FROM ShipmentProduct WHERE ShipmentId = ? AND RequestedProductId = ?`,
                [ShipmentId, RequestedProductId],
                (_, data) => {
                    // ... rest of your code ...

                    if (data.rows.length === 0) {
                        // Insertion
                        tx.executeSql(
                            `INSERT INTO ShipmentProduct (
                                ShipmentProductId, ShipmentID, RequestedProductId, ProdDesc, Gallons,
                                TicketNo, Capacity, AssetNumber, BolNumber, RequestedProductCategoryId,
                                CardNumber, StartStickReading, EndStickReading, StartWaterReading, EndWaterReading,
                                StartTotalizer, EndTotalizer, TankNumber, LineItemStatusID, Odometer, Lat, Lon,
                                AssetTypeId, Notes, Img, AssetID, DeliveredProductId, FuelingStartDateTime,
                                FuelingEndDateTime, FuelingStartTime, FuelingEndTime
                              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                sps.ShipmentProductId, sps.ShipmentID, sps.RequestedProductId, sps.ProdDesc, sps.Gallons,
                                sps.TicketNo, sps.Capacity, sps.AssetNumber, sps.BolNumber, sps.RequestedProductCategoryId,
                                sps.CardNumber, sps.StartStickReading, sps.EndStickReading, sps.StartWaterReading, sps.EndWaterReading,
                                sps.StartTotalizer, sps.EndTotalizer, sps.TankNumber, sps.LineItemStatusID, sps.Odometer, sps.Lat, sps.Lon,
                                sps.AssetTypeId, sps.Notes, sps.Img, sps.AssetID, sps.DeliveredProductId, sps.FuelingStartDateTime,
                                sps.FuelingEndDateTime, sps.FuelingStartTime, sps.FuelingEndTime
                            ],
                            (_, insertResult) => {
                                const rowsAffected = insertResult.rowsAffected;
                                resolve(rowsAffected);
                                console.log('ShipmentProduct Data saved');
                            },
                            (_, error) => {
                                reject(error); // Pass the error to the reject function
                                console.error(error);
                            }
                        );
                    } else {
                        // Update

                        const insertedRec = data.rows.item(0);
                        insertedRec.DeliveryWindowStart = shipment.DeliveryWindowStart;
                        insertedRec.DeliveryWindowEnd = shipment.DeliveryWindowEnd;
                        insertedRec.ShipToId = shipment.ShipToId;
                        insertedRec.StatusId = shipment.StatusId;
                        insertedRec.VtCompanyId = shipment.VTCompanyId;
                        insertedRec.comapnyName = shipment.CompanyName;
                        tx.executeSql(
                            `UPDATE ShipmentProduct SET
                                ShipmentProductId = ?, ShipmentID = ?, RequestedProductId = ?, ProdDesc = ?, Gallons = ?,
                                TicketNo = ?, Capacity = ?, AssetNumber = ?, BolNumber = ?, RequestedProductCategoryId = ?,
                                CardNumber = ?, StartStickReading = ?, EndStickReading = ?, StartWaterReading = ?, EndWaterReading = ?,
                                StartTotalizer = ?, EndTotalizer = ?, TankNumber = ?, LineItemStatusID = ?, Odometer = ?, Lat = ?, Lon = ?,
                                AssetTypeId = ?, Notes = ?, Img = ?, AssetID = ?, DeliveredProductId = ?, FuelingStartDateTime = ?,
                                FuelingEndDateTime = ?, FuelingStartTime = ?, FuelingEndTime = ?
                                WHERE ShipmentId = ? AND RequestedProductId = ?`,
                            [
                                sps.ShipmentProductId, sps.ShipmentID, sps.RequestedProductId, sps.ProdDesc, sps.Gallons,
                                sps.TicketNo, sps.Capacity, sps.AssetNumber, sps.BolNumber, sps.RequestedProductCategoryId,
                                sps.CardNumber, sps.StartStickReading, sps.EndStickReading, sps.StartWaterReading, sps.EndWaterReading,
                                sps.StartTotalizer, sps.EndTotalizer, sps.TankNumber, sps.LineItemStatusID, sps.Odometer, sps.Lat, sps.Lon,
                                sps.AssetTypeId, sps.Notes, sps.Img, sps.AssetID, sps.DeliveredProductId, sps.FuelingStartDateTime,
                                sps.FuelingEndDateTime, sps.FuelingStartTime, sps.FuelingEndTime,
                                sps.ShipmentId, sps.RequestedProductId
                            ],
                            (_, updateResult) => {
                                const rowsAffected = updateResult.rowsAffected;
                                resolve(rowsAffected);
                                console.log('ShipmentProduct Data Updated');
                            },
                            (_, error) => {
                                reject(error); // Pass the error to the reject function
                                console.error(error);
                            }
                        );
                    }
                },
                (_, error) => {
                    reject(error); // Pass the error to the reject function
                }
            );
        });
    });
}

export function InsertOrUpdateBOLProduct(bolProduct) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // Check if the shipment already exists
            tx.executeSql(
                `SELECT * FROM BOLProduct WHERE BOLId = ? AND ProductId = ?`,
                [bolProduct.bolProduct],
                (_, data) => {
                    if (data.rows.length === 0) {
                        // Insertion
                        tx.executeSql(
                            `INSERT INTO BOLProduct (
                                BolId, LineNumber, ProductId, GrossQuantity,
                                NetQuantity, Temperature, SpecificGravity, IsActive,
                                ProductDescription
                              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                            [
                                bolProduct.bolId,
                                bolProduct.lineNumber,
                                bolProduct.productId,
                                bolProduct.grossQuantity,
                                bolProduct.netQuantity,
                                bolProduct.temperature,
                                bolProduct.specificGravity,
                                bolProduct.isActive,
                                bolProduct.productDescription
                                // ... other values ...
                            ],
                            (_, insertResult) => {
                                const rowsAffected = insertResult.rowsAffected;
                                resolve(rowsAffected);
                                console.log('BOLProduct Data saved');
                            },
                            (_, error) => {
                                reject(error);
                            }
                        );
                    } else {
                        // Update
                        const insertedRec = data.rows.item(0);
                        insertedRec.bolId = bolProduct.bolId;
                        insertedRec.lineNumber = bolProduct.lineNumber;
                        insertedRec.productId = bolProduct.productId;
                        insertedRec.grossQuantity = bolProduct.grossQuantity;
                        insertedRec.netQuantity = bolProduct.netQuantity;
                        insertedRec.temperature = bolProduct.temperature;
                        insertedRec.specificGravity = bolProduct.specificGravity;
                        insertedRec.isActive = bolProduct.isActive;
                        insertedRec.productDescription = bolProduct.productDescription;

                        tx.executeSql(
                            `UPDATE BOLProduct 
                                SET BolId = ?, 
                                LineNumber = ?, 
                                ProductId = ?, 
                                GrossQuantity = ?, 
                                NetQuantity = ?, 
                                Temperature = ?,
                                SpecificGravity = ?,
                                IsActive = ?,
                                ProductDescription = ?
                                WHERE BolId = ?`,
                            [
                                insertedRec.bolId,
                                insertedRec.lineNumber,
                                insertedRec.productId,
                                insertedRec.grossQuantity,
                                insertedRec.netQuantity,
                                insertedRec.temperature,
                                insertedRec.specificGravity,
                                insertedRec.isActive,
                                insertedRec.productDescription,
                                bolProduct.BolId
                            ],
                            (_, updateResult) => {
                                const rowsAffected = updateResult.rowsAffected;
                                resolve(rowsAffected);
                                console.log('BOLProduct Data Updated');
                            },
                            (_, error) => {
                                reject(error);
                            }
                        );
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
}

export function InsertBOLProduct(data) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO BOLProduct (
            BolId, LineNumber, ProductId, GrossQuantity,
            NetQuantity, Temperature, SpecificGravity, IsActive,
            ProductDescription
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    data.bolId,
                    data.lineNumber,
                    data.productId,
                    data.grossQuantity,
                    data.netQuantity,
                    data.temperature,
                    data.specificGravity,
                    data.isActive,
                    data.productDescription
                ],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
}


// Create insert functions for other tables...

export default {
    InsertOrUpdateShipment,
    InsertOrUpdateTerminal,
    InsertOrUpdateShipTo,
    InsertOrUpdateShipmentProduct,
    InsertOrUpdateBOLProduct,
    InsertBOLProduct
};

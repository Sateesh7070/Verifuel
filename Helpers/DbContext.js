import {
    Alert
} from "react-native";

import { openDatabase } from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

var db = openDatabase({ name: 'VeriFuel.db' });

export const createShipmentTable = () => {

    db.transaction((txn) => {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Shipment'",
            [],
            function (tx, res) {
                //console.log('item:', res.rows.length);
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS Shipment', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS Shipment ( Id INTEGER PRIMARY KEY AUTOINCREMENT, ShipToId INT, ShipmentId INT, VendorId INT, VtCompanyId INT, comapnyName INT, StatusId INT, Status VARCHAR, ShipToName VARCHAR, VendorName VARCHAR, DeliveryDate DATETIME, LastModifiedOn DATETIME, OrderNumber VARCHAR, DeliveryStartTime INT, DeliveryEndTime INT, DemurrageStartTime INT, DemurrageEndTime INT, LoadingNumber INT, DeliveryWindowStart INT, DeliveryWindowEnd INT, CustomerName VARCHAR, CustomerId VARCHAR)',
                        [],
                        (result) => {
                            console.log('Shipment Table created successfully');
                        },
                        (error) => {
                            console.log('Shipment Create table error', error);
                        }
                    );
                }
            }
        );
    });
};

export const createTerminalTable = () => {

    db.transaction((txn) => {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Terminal'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS Terminal', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS Terminal (Id INTEGER PRIMARY KEY AUTOINCREMENT,TerminalId INT,TerminalName VARCHAR,Address VARCHAR,City VARCHAR,StateCode VARCHAR,CountryCode VARCHAR,Zip VARCHAR,Lat REAL,Lon REAL,DistanceInMiles REAL,Polygon VARCHAR)',
                        [],
                        (result) => {
                            console.log('Terminal Table created successfully');
                        },
                        (error) => {
                            console.log('Terminal Create table error', error);
                        }
                    );
                }
            }
        );
    });

};

export const createShipToTable = () => {

    db.transaction((txn) => {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='ShipTo'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS ShipTo', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS ShipTo ( Id INTEGER PRIMARY KEY AUTOINCREMENT,CustomerID INT,ShiptoID INT,CustomerName VARCHAR,ShipToName VARCHAR,FromHrs VARCHAR,ToHrs VARCHAR,Polygon VARCHAR,Address1 VARCHAR,Address2 VARCHAR,City VARCHAR,StateCode VARCHAR,StateName VARCHAR,County VARCHAR,Country VARCHAR,Zip VARCHAR,DistanceInMiles REAL,Lat REAL,Lon REAL)',
                        [],
                        (result) => {
                            console.log('ShipTo Table created successfully');
                        },
                        (error) => {
                            console.log('ShipTo Create table error', error);
                        }
                    );
                }
            }
        );
    });

};

export const createShipmentProductTable = () => {

    db.transaction((txn) => {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='ShipmentProduct'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS ShipmentProduct', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS ShipmentProduct (Id INTEGER PRIMARY KEY AUTOINCREMENT,ShipmentProductId INT,ShipmentID INT,RequestedProductId INT,ProdDesc VARCHAR,Gallons REAL,TicketNo VARCHAR,Capacity REAL,AssetNumber VARCHAR,BolNumber VARCHAR,RequestedProductCategoryId INT,CardNumber VARCHAR,StartStickReading REAL,EndStickReading REAL,StartWaterReading REAL,EndWaterReading REAL,StartTotalizer REAL,EndTotalizer REAL,TankNumber VARCHAR,LineItemStatusID INT,Odometer REAL,Lat REAL,Lon REAL,AssetTypeId INT,Notes VARCHAR,Img VARCHAR,AssetID INT,DeliveredProductId INT,FuelingStartDateTime VARCHAR,FuelingEndDateTime VARCHAR,FuelingStartTime VARCHAR,FuelingEndTime VARCHAR)',
                        [],
                        (result) => {
                            console.log('ShipmentProduct Table created successfully');
                        },
                        (error) => {
                            console.log('ShipmentProduct Create table error', error);
                        }
                    );
                }
            }
        );
    });

};

export const createBOLTable = () => {


    db.transaction((txn) => {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='BOL'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS BOL', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS BOL ( Id INTEGER PRIMARY KEY ,BolNumber VARCHAR,LoadingNumber VARCHAR,SupplierId INT,TerminalId INT,ShipmentId INT,VendorId INT,StartLoadTime VARCHAR,EndLoadTime VARCHAR,TruckNumber VARCHAR,DriverId VARCHAR,IsActive BOOLEAN,VendorName VARCHAR,SupplierName VARCHAR,TerminalName VARCHAR,CarrierName VARCHAR,CreatedOn VARCHAR,CreatedBy VARCHAR,ModifiedOn VARCHAR,ModifiedBy VARCHAR,StatusId INT,Type INT,TerminalGroupId INT,ProductId INT)',
                        [],
                        (result) => {
                            console.log('BOL Table created successfully');
                        },
                        (error) => {
                            console.log('BOL Create table error', error);
                        }
                    );
                }
            }
        );
    });

};

export const createBOLProductTable = () => {

    db.transaction((txn) => {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='BOLProduct'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS BOLProduct', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS BOLProduct ( Id INTEGER PRIMARY KEY,LineNumber INT,ProductId INT,GrossQuantity REAL,BOLId INT, NetQuantity REAL,Temperature REAL,SpecificGravity REAL,IsActive BOOLEAN,ProductDescription VARCHAR)',
                        [],
                        (result) => {
                            console.log('BOLProduct Table created successfully');
                        },
                        (error) => {
                            console.log('BOLProduct Create table error', error);
                        }
                    );
                }
            }
        );
    });

};

export const createGeofenceDeviceTable = () => {
    db.transaction((txn) => {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='GeofenceDevice'",
            [],
            (tx, res) => {
                if (res.rows.length === 0) {
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS GeofenceDevice (' +
                        'ID INTEGER PRIMARY KEY AUTOINCREMENT,' +
                        'CompanyId INTEGER,' +
                        'EntityId INTEGER,' +
                        'EntityTypeId INTEGER,' +
                        'EntityLat REAL,' +
                        'EntityLon REAL,' +
                        'PositionLat REAL,' +
                        'PositionLon REAL,' +
                        'GPSAccuracy INTEGER,' +
                        'Distance REAL,' +
                        'GPSDateTime TEXT,' +
                        'EventDateTime TEXT,' +
                        'CreatedDate TEXT,' +
                        'Polygon TEXT,' +
                        'UserId TEXT,' +
                        'DeviceId TEXT' +
                        ');',
                        [],
                        (_, result) => {
                            console.log('GeofenceDevice Table created successfully');
                        },
                        (_, error) => {
                            console.log('GeofenceDevice Create table error', error);
                        }
                    );
                }
            }
        );
    });
};

export const createGeofenceTable = () => {
    db.transaction((txn) => {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Geofence'",
            [],
            (tx, res) => {
                if (res.rows.length === 0) {
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS Geofence (' +
                        'ID INTEGER PRIMARY KEY AUTOINCREMENT,' +
                        'FirstEntryDateTime TEXT,' +
                        'FirstExitDateTime TEXT,' +
                        'EntityId INTEGER,' +
                        'EntityTypeId INTEGER,' +
                        'ConfirmedEntryDateTime TEXT,' +
                        'ConfirmedExitDateTime TEXT,' +
                        'NumberOfEntryPings INTEGER,' +
                        'NumberOfExitPings INTEGER,' +
                        'UserId TEXT,' +
                        'DeviceId TEXT,' +
                        'CreatedDateTime TEXT,' +
                        'IsEntrySignalToServer INTEGER,' +
                        'LastEntrySignalToServer TEXT,' +
                        'IsExitSignalToServer INTEGER,' +
                        'LastExitSignalToServer TEXT,' +
                        'HasUserAckd INTEGER,' +
                        'UserAckEntityId INTEGER,' +
                        'IsComplete INTEGER DEFAULT 0' +
                        ');',
                        [],
                        (_, result) => {
                            console.log('Geofence Table created successfully');
                        },
                        (_, error) => {
                            console.log('Geofence Create table error', error);
                        }
                    );
                }
            }
        );
    });

}


//#region GeoFences

export const upsertGeofenceDevice = async (geofenceDevice) => {
    let rowsAffected = 0;

    try {
        // Clear old data
        const oldDate = new Date().toISOString(); // Use a suitable mechanism to calculate the old date
        const qry = 'DELETE FROM GeofenceDevice WHERE EventDateTime < ?';
        await db.transaction(tx => {
            tx.executeSql(qry, [oldDate]);
        });

        // Check if data with the same GPSDateTime and other criteria exists
        const data = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM GeofenceDevice WHERE GPSDateTime = ? AND EntityId = ? AND EntityTypeId = ? AND UserId = ? AND DeviceId = ?',
                    [
                        geofenceDevice.GPSDateTime,
                        geofenceDevice.EntityId,
                        geofenceDevice.EntityTypeId,
                        geofenceDevice.UserId,
                        geofenceDevice.DeviceId,
                    ],
                    (_, { rows }) => {
                        resolve(rows.item(0));
                    },
                    error => {
                        reject(error);
                    }
                );
            });
        });

        if (!data) {
            // Insert new data if it does not exist
            geofenceDevice.EventDateTime = new Date().toISOString();
            geofenceDevice.CreatedDate = new Date().toISOString();
            await db.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO GeofenceDevice (EntityId, EntityTypeId, UserId, DeviceId, GPSDateTime, EventDateTime, Distance, Polygon, CompanyId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        geofenceDevice.EntityId,
                        geofenceDevice.EntityTypeId,
                        geofenceDevice.UserId,
                        geofenceDevice.DeviceId,
                        geofenceDevice.GPSDateTime,
                        geofenceDevice.EventDateTime,
                        geofenceDevice.Distance,
                        geofenceDevice.Polygon,
                        geofenceDevice.CompanyId,
                    ],
                    (_, { rows }) => {
                        rowsAffected = rowsAffected + rows.length;
                    },
                    error => {
                        console.error('Error inserting data', error);
                    }
                );
            });
        } else {
            // Update existing data
            await db.transaction(tx => {
                tx.executeSql(
                    'UPDATE GeofenceDevice SET GPSDateTime = ?, EventDateTime = ?, Distance = ?, Polygon = ?, CompanyId = ? WHERE ID = ?',
                    [
                        geofenceDevice.GPSDateTime,
                        geofenceDevice.EventDateTime,
                        geofenceDevice.Distance,
                        geofenceDevice.Polygon,
                        geofenceDevice.CompanyId,
                        data.ID,
                    ],
                    (_, { rows }) => {
                        rowsAffected = rowsAffected + rows.length;
                    },
                    error => {
                        console.error('Error updating data', error);
                    }
                );
            });
        }
    } catch (error) {
        console.error('Error in database operation', error);
    }

    return rowsAffected;
};

export function createParentGeofenceDevice(geofenceDevice) {
    let rowsAffected = 0;

    try {
        // Insert only if master tracking record is not present
        if (geofenceDevice.entityLat !== 0 && geofenceDevice.entityLon !== 0) {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM GeofenceDevice WHERE EntityId = ? AND EntityTypeId = ? AND UserId = ? AND DeviceId = ? ORDER BY ID DESC LIMIT 1`,
                    [
                        geofenceDevice.entityId,
                        geofenceDevice.entityTypeId,
                        geofenceDevice.userId,
                        geofenceDevice.deviceId,
                    ],
                    (_, results) => {
                        const data = results.rows.item(0);

                        if (!data) {
                            geofenceDevice.eventDateTime = new Date().toISOString();
                            geofenceDevice.createdDate = new Date().toISOString();

                            tx.executeSql(
                                'INSERT INTO GeofenceDevice (EntityId, EntityTypeId, UserId, DeviceId, EventDateTime, CreatedDate, Distance, GPSDateTime, PositionLat, PositionLon, CompanyId, Polygon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                [
                                    geofenceDevice.entityId,
                                    geofenceDevice.entityTypeId,
                                    geofenceDevice.userId,
                                    geofenceDevice.deviceId,
                                    geofenceDevice.eventDateTime,
                                    geofenceDevice.createdDate,
                                    geofenceDevice.distance,
                                    geofenceDevice.gpsDateTime,
                                    geofenceDevice.positionLat,
                                    geofenceDevice.positionLon,
                                    geofenceDevice.companyId,
                                    geofenceDevice.polygon,
                                ],
                                (_, { rows }) => {
                                    rowsAffected = rowsAffected + rows.length;
                                },
                                error => {
                                    console.error('Error inserting data', error);
                                }
                            );
                        } else {
                            // If distance is not updated, it will not get picked up for closer calculations on restart
                            tx.executeSql(
                                'UPDATE GeofenceDevice SET Distance = ?, GPSDateTime = ?, EventDateTime = ?, PositionLat = ?, PositionLon = ?, CompanyId = ?, Polygon = ? WHERE ID = ?',
                                [
                                    geofenceDevice.distance,
                                    geofenceDevice.gpsDateTime,
                                    geofenceDevice.eventDateTime,
                                    geofenceDevice.positionLat,
                                    geofenceDevice.positionLon,
                                    geofenceDevice.companyId,
                                    geofenceDevice.polygon,
                                    data.ID,
                                ],
                                (_, { rows }) => {
                                    rowsAffected = rowsAffected + rows.length;
                                },
                                error => {
                                    console.error('Error updating data', error);
                                }
                            );
                        }
                    },
                    error => {
                        console.error('Error selecting data', error);
                    }
                );
            });
        } else {
            console.warn(
                `Entity Coordinates are 0, cannot track ${geofenceDevice.userId} ${geofenceDevice.deviceId} ${geofenceDevice.entityId} ${geofenceDevice.entityTypeId} ${geofenceDevice.gpsAccuracy}`
            );
        }
    } catch (error) {
        console.error('Error in database operation', error);
    }

    return rowsAffected;
};

export const getGeofenceDevices = async (lessThan) => {
    try {
        const query = lessThan
            ? `SELECT DISTINCT EntityId, EntityTypeId, Distance, Id, MAX(EventDateTime) AS EventDateTime, ID, EntityLat, EntityLon, PositionLat, PositionLon, GPSAccuracy, UserId, DeviceId, GPSDateTime, CreatedDate, Polygon, CompanyId FROM GeofenceDevice WHERE Distance < ? GROUP BY EntityId, EntityTypeId ORDER BY Distance ASC`
            : `SELECT DISTINCT EntityId, EntityTypeId, Distance, Id, MAX(EventDateTime) AS EventDateTime, ID, EntityLat, EntityLon, PositionLat, PositionLon, GPSAccuracy, UserId, DeviceId, GPSDateTime, CreatedDate, Polygon, CompanyId FROM GeofenceDevice GROUP BY EntityId, EntityTypeId ORDER BY Distance ASC`;

        const params = lessThan ? [lessThan] : [];

        const result = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    query,
                    params,
                    (_, { rows }) => {
                        const geofenceDevices = [];
                        for (let i = 0; i < rows.length; i++) {
                            geofenceDevices.push(rows.item(i));
                        }
                        resolve(geofenceDevices);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        });

        // Clear old data
        const oldDate = new Date().toISOString();
        const deleteQuery = 'DELETE FROM GeofenceDevice WHERE CreatedDate < ?';
        await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(deleteQuery, [oldDate], (_, { rows }) => {
                    resolve();
                });
            });
        });

        return result;
    } catch (error) {
        console.error('Error in database operation', error);
        return null;
    }
};

export const getGeofenceDevice = async (EntityId, EntityTypeId) => {
    try {
        const query = `SELECT * FROM GeofenceDevice WHERE EntityId = ? AND EntityTypeId = ? ORDER BY ID DESC LIMIT 1`;

        const result = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    query,
                    [EntityId, EntityTypeId],
                    (_, { rows }) => {
                        if (rows.length > 0) {
                            resolve(rows.item(0));
                        } else {
                            resolve(null);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        });

        return result;
    } catch (error) {
        console.error('Error in database operation', error);
        return null;
    }
};

export const getSortedGeofenceDevices = (lessThan, callback) => {
    database.transaction((tx) => {
        tx.executeSql(
            'SELECT DISTINCT EntityId, EntityTypeId, Distance, Id, MAX(EventDateTime) AS EventDateTime, ID, EntityLat, EntityLon, PositionLat, PositionLon, GPSAccuracy, UserId, DeviceId, GPSDateTime, CreatedDate, Polygon, CompanyId FROM GeofenceDevice WHERE Distance < ? GROUP BY EntityId, EntityTypeId ORDER BY Distance ASC;',
            [lessThan || 5],
            (_, results) => {
                const rows = results.rows.raw();
                callback(rows);
            },
            (_, error) => console.error('Error executing SQL query:', error)
        );
    });
};

// getSortedGeofenceDevices(5, (geofenceDevices) => {
//     console.log('Sorted Geofence Devices:', geofenceDevices);
//     // Perform further actions with the fetched data
// });

export const getGeofence = (entityId, entityTypeId, callback) => {
    database.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM Geofence WHERE EntityId = ? AND EntityTypeId = ? AND IsComplete != 1 LIMIT 1;',
            [entityId, entityTypeId],
            (_, results) => {
                if (results.rows.length > 0) {
                    const geofence = results.rows.item(0);
                    callback(geofence);
                } else {
                    callback(null);
                }
            },
            (_, error) => {
                console.error('Error executing SQL query:', error);
            }
        );
    });
};

// getGeofence(entityId, entityTypeId, (geofence) => {
//     if (geofence) {
//       console.log('Geofence:', geofence);
//       // Perform further actions with the fetched geofence data
//     } else {
//       console.log('Geofence not found');
//     }
//   });

export const getGeofences = (callback) => {
    database.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM Geofence WHERE IsComplete != 1;',
            [],
            (_, results) => {
                const geofences = [];
                for (let i = 0; i < results.rows.length; i++) {
                    geofences.push(results.rows.item(i));
                }
                callback(geofences);
            },
            (_, error) => {
                console.error('Error executing SQL query:', error);
            }
        );
    });
};

// getGeofences((geofences) => {
//     if (geofences) {
//       console.log('Geofences:', geofences);
//       // Perform further actions with the fetched geofences data
//     } else {
//       console.log('Error fetching geofences');
//     }
//   });


export const upsertGeofence = async (geofence, callback) => {
    try {
        const isInsert = geofence.ID === 0;

        database.transaction(async (tx) => {
            if (isInsert) {
                geofence.CreatedDateTime = new Date().toISOString();
                const insertResult = await tx.executeSql(
                    'INSERT INTO Geofence (FirstEntryDateTime, FirstExitDateTime, EntityId, EntityTypeId, ConfirmedEntryDateTime, ConfirmedExitDateTime, NumberOfEntryPings, NumberOfExitPings, UserId, DeviceId, CreatedDateTime, IsEntrySignalToServer, LastEntrySignalToServer, IsExitSignalToServer, LastExitSignalToServer, HasUserAckd, UserAckEntityId, IsComplete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                    [
                        geofence.FirstEntryDateTime,
                        geofence.FirstExitDateTime,
                        geofence.EntityId,
                        geofence.EntityTypeId,
                        geofence.ConfirmedEntryDateTime,
                        geofence.ConfirmedExitDateTime,
                        geofence.NumberOfEntryPings,
                        geofence.NumberOfExitPings,
                        geofence.UserId,
                        geofence.DeviceId,
                        geofence.CreatedDateTime,
                        geofence.IsEntrySignalToServer,
                        geofence.LastEntrySignalToServer,
                        geofence.IsExitSignalToServer,
                        geofence.LastExitSignalToServer,
                        geofence.HasUserAckd,
                        geofence.UserAckEntityId,
                        geofence.IsComplete,
                    ]
                );

                callback(insertResult.rowsAffected);
            } else {
                if (geofence.IsExitSignalToServer === 1) {
                    geofence.IsComplete = 1;
                }

                const updateResult = await tx.executeSql(
                    'UPDATE Geofence SET FirstEntryDateTime=?, FirstExitDateTime=?, ConfirmedEntryDateTime=?, ConfirmedExitDateTime=?, NumberOfEntryPings=?, NumberOfExitPings=?, UserId=?, DeviceId=?, CreatedDateTime=?, IsEntrySignalToServer=?, LastEntrySignalToServer=?, IsExitSignalToServer=?, LastExitSignalToServer=?, HasUserAckd=?, UserAckEntityId=?, IsComplete=? WHERE ID = ?;',
                    [
                        geofence.FirstEntryDateTime,
                        geofence.FirstExitDateTime,
                        geofence.ConfirmedEntryDateTime,
                        geofence.ConfirmedExitDateTime,
                        geofence.NumberOfEntryPings,
                        geofence.NumberOfExitPings,
                        geofence.UserId,
                        geofence.DeviceId,
                        geofence.CreatedDateTime,
                        geofence.IsEntrySignalToServer,
                        geofence.LastEntrySignalToServer,
                        geofence.IsExitSignalToServer,
                        geofence.LastExitSignalToServer,
                        geofence.HasUserAckd,
                        geofence.UserAckEntityId,
                        geofence.IsComplete,
                        geofence.ID,
                    ]
                );

                callback(updateResult.rowsAffected);
            }
            deleteOldGeofences();
        });
    } catch (error) {
        console.error('Error executing SQL query:', error);
    }
};

export const deleteOldGeofences = async () => {
    const oldDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Date one day ago

    database.transaction(async (tx) => {
        tx.executeSql(
            'DELETE FROM Geofence WHERE CreatedDateTime < ? AND IsComplete = 1;',
            [oldDate.toISOString()],
            (_, results) => {
                console.log('Deleted rows:', results.rowsAffected);
            },
            (_, error) => {
                console.error('Error executing SQL query:', error);
            }
        );
    });
};
//#endregion

export function InsertShipmentData(shipmentData) {

    try {

        db.transaction((txn) => {
            txn.executeSql(
                'SELECT * FROM Shipment WHERE ShipmentId = ?',
                [shipmentData.shipmentId],
                function (tx, res) {
                    //console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        tx.executeSql(
                            'INSERT INTO Shipment (ShipToId, ShipmentId, VendorId, VtCompanyId, ComapnyName, StatusId,Status, ShipToName, VendorName, DeliveryDate, LastModifiedOn,OrderNumber, DeliveryStartTime, DeliveryEndTime, DemurrageStartTime,DemurrageEndTime, LoadingNumber, DeliveryWindowStart, DeliveryWindowEnd,CustomerName, CustomerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [
                                shipmentData.shipToId,
                                shipmentData.shipmentId,
                                shipmentData.vendorId,
                                shipmentData.vendorIdtCompanyId,
                                shipmentData.comapnyName,
                                shipmentData.statusId,
                                shipmentData.status,
                                shipmentData.shipToName,
                                shipmentData.vendorName,
                                shipmentData.deliveryDate,
                                shipmentData.lastModifiedOn,
                                shipmentData.orderNumber,
                                shipmentData.deliveryStartTime,
                                shipmentData.deliveryEndTime,
                                shipmentData.demurrageStartTime,
                                shipmentData.demurrageEndTime,
                                shipmentData.loadingNumber,
                                shipmentData.deliveryWindowStart,
                                shipmentData.deliveryWindowEnd,
                                shipmentData.customerName,
                                shipmentData.customerId
                            ],
                            (tx, results) => {
                                //console.log('Shipment Insert Results', results.rowsAffected);
                                if (results.rowsAffected > 0) {

                                    //console.log('Shipment Insert Results', results.rowsAffected);

                                } else {
                                    console.log('Shipment Insert Results');
                                }
                            }
                        );
                    } else {

                        const insertedRec = res.rows.item(0);
                        //console.log("Shipment Item:", insertedRec)
                        insertedRec.DeliveryWindowStart = shipment.deliveryWindowStart;
                        insertedRec.DeliveryWindowEnd = shipment.deliveryWindowEnd;
                        insertedRec.ShipToId = shipment.shipToId;
                        insertedRec.StatusId = shipment.statusId;
                        insertedRec.VtCompanyId = shipment.vTCompanyId;
                        insertedRec.ComapnyName = shipment.companyName;

                        tx.executeSql(
                            'UPDATE Shipment SET DeliveryWindowStart = ?, DeliveryWindowEnd = ?, ShipToId = ?, StatusId = ?, VtCompanyId = ?, comapnyName = ? WHERE ShipmentId = ?'
                            [
                            insertedRec.DeliveryWindowStart,
                            insertedRec.DeliveryWindowEnd,
                            insertedRec.ShipToId,
                            insertedRec.StatusId,
                            insertedRec.VtCompanyId,
                            insertedRec.comapnyName,
                            shipment.shipmentId
                            ],
                            (tx, results) => {
                                //console.log('Shipment Update Results', results.rowsAffected);
                                if (results.rowsAffected > 0) {

                                    //console.log('Shipment Update Results', results.rowsAffected);

                                } else {
                                    //console.log('Shipment Update Results');
                                }
                            }
                        );

                    }
                }
            );
        });

    } catch (error) {
        console.log('InsertShipmentData Faled');
    }

}



export function upsertTerminal(terminal) {
    try {
        db.transaction((txn) => {
            txn.executeSql(
                'SELECT * FROM Terminal WHERE terminalId = ?',
                [terminal.terminalId],
                function (tx, res) {
                    //console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        tx.executeSql(
                            'INSERT INTO Terminal (TerminalId, Address, DistanceInMiles, StateCode, TerminalName, City, CountryCode, Lat, Lon, Zip, Polygon) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [
                                terminal.terminalId,
                                terminal.address,
                                terminal.distanceInMiles,
                                terminal.stateCode,
                                terminal.terminalName,
                                terminal.city,
                                terminal.countryCode,
                                terminal.lat,
                                terminal.lon,
                                terminal.zip,
                                terminal.polygon,

                            ],
                            (tx, results) => {
                                //console.log(‘Terminals Insert Results', results.rowsAffected);
                                if (results.rowsAffected > 0) {

                                    console.log('Terminals Insert Results', results.rowsAffected);

                                } else {
                                    console.log('Terminals Insert Results');
                                }
                            }
                        );
                    } else {

                        const insertedRec = res.rows.item(0);
                        //console.log("Shipment Item:", insertedRec)
                        insertedRec.Address = terminal.address;
                        insertedRec.DistanceInMiles = terminal.distanceInMiles;
                        insertedRec.StateCode = terminal.stateCode;
                        insertedRec.TerminalName = terminal.terminalName;
                        insertedRec.City = terminal.city;
                        insertedRec.Lat = terminal.lat;
                        insertedRec.Lon = terminal.lon;
                        insertedRec.Zip = terminal.zip;
                        insertedRec.Polygon = terminal.polygon;
                        insertedRec.CountryCode = terminal.countryCode;

                        tx.executeSql(
                            'UPDATE Terminal SET Address = ?, DistanceInMiles = ?, StateCode = ?, TerminalName = ?, City = ?, Lat = ?, Lon = ?, Zip = ?, Polygon = ?, CountryCode = ? WHERE ShipmentId = ?'
                            [
                            insertedRec.Address,
                            insertedRec.DistanceInMiles,
                            insertedRec.StateCode,
                            insertedRec.TerminalName,
                            insertedRec.City,
                            insertedRec.Lat,
                            insertedRec.Lon,
                            insertedRec.Zip,
                            insertedRec.Polygon,
                            insertedRec.CountryCode,
                            shipment.shipmentId
                            ],
                            (tx, results) => {
                                //console.log('Shipment Update Results', results.rowsAffected);
                                if (results.rowsAffected > 0) {

                                    console.log('Shipment Update Results', results.rowsAffected);

                                } else {
                                    console.log('Shipment Update Results');
                                }
                            }
                        );

                    }
                }
            );
        });

    } catch (error) {
        console.error('Error executing SQL query:', error);
    }
};

export function UpSertShipTo(shipTo) {

    db.transaction((txn) => {
        txn.executeSql(
            'SELECT * FROM ShipTo WHERE ShiptoID = ?',
            [shipTo.shiptoID],
            function (tx, res) {
                //console.log('ShipTo item:', shipTo);
                if (res.rows.length == 0) {
                    tx.executeSql(
                        'INSERT INTO ShipTo (CustomerID, ShiptoID, CustomerName, ShipToName, FromHrs, ToHrs,Polygon, Address1, Address2, City, StateCode, StateName, County,Country, Zip,DistanceInMiles, Lat, Lon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
                        [
                            shipTo.customerID,
                            shipTo.shiptoID,
                            shipTo.customerName,
                            shipTo.shipToName,
                            shipTo.fromHrs,
                            shipTo.toHrs,
                            shipTo.polygon,
                            shipTo.address1,
                            shipTo.address2,
                            shipTo.city,
                            shipTo.stateCode,
                            shipTo.stateName,
                            shipTo.county,
                            shipTo.country,
                            shipTo.zip,
                            shipTo.distanceInMiles,
                            shipTo.lat,
                            shipTo.lon
                        ],
                        (tx, results) => {
                            //console.log('ShipTo Insert Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {

                                //console.log('ShipTo Insert Results', results.rowsAffected);

                            } else {
                                //console.log('ShipTo Insert Results Failed');
                            }
                        }
                    );
                } else {

                    const insertedRec = res.rows.item(0);
                    insertedRec.ShipToName = shipTo.shipToName;
                    insertedRec.Address1 = shipTo.address1;
                    insertedRec.Address2 = shipTo.address2;
                    insertedRec.StateCode = shipTo.stateCode;
                    insertedRec.City = shipTo.cityity;
                    insertedRec.Country = shipTo.countryCode;
                    insertedRec.Lat = shipTo.lat;
                    insertedRec.Lon = shipTo.lon;
                    insertedRec.Zip = shipTo.zipCode;
                    insertedRec.Polygon = shipTo.polygon;
                    insertedRec.DistanceInMiles = shipTo.DistanceInMiles;
                    insertedRec.FromHrs = shipTo.fromHours;
                    insertedRec.ToHrs = shipTo.toHours;
                    tx.executeSql(
                        'UPDATE ShipTo SET ShipToName = ?, Address1 = ?, Address2 = ?, StateCode = ?,City = ?, Country = ?,Lat = ?,Lon = ?,Zip = ?,Polygon = ?,DistanceInMiles = ?, FromHrs = ?, ToHrs = ?  WHERE ShipToID = ?',
                        [
                            insertedRec.ShipToName,
                            insertedRec.Address1,
                            insertedRec.Address2,
                            insertedRec.StateCode,
                            insertedRec.City,
                            insertedRec.CountryCode,
                            insertedRec.Lat,
                            insertedRec.Lon,
                            insertedRec.ZipCode,
                            insertedRec.Polygon,
                            insertedRec.DistanceInMiles,
                            insertedRec.FromHrs,
                            insertedRec.ToHrs,
                            shipTo.shipToId
                        ],
                        (tx, results) => {
                            //console.log('ShipTo Update Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {

                                // console.log('ShipTo Update Results', results.rowsAffected);

                            } else {
                                //console.log('ShipTo Update Results');
                            }
                        }
                    );

                }
            }
        );
    });

}

export function UpSertShipmentProduct(sps) {

    db.transaction((txn) => {
        txn.executeSql(
            'SELECT * FROM ShipmentProduct WHERE ShipmentId = ? AND RequestedProductId = ?',
            [sps.shipmentId, sps.requestedProductId],
            function (tx, res) {
                //console.log('item:', res.rows.length);
                if (res.rows.length == 0) {
                    tx.executeSql(
                        'INSERT INTO ShipmentProduct (ShipmentProductId, ShipmentID, RequestedProductId, ProdDesc, Gallons,TicketNo, Capacity, AssetNumber, BolNumber, RequestedProductCategoryId, CardNumber, StartStickReading, EndStickReading, StartWaterReading, EndWaterReading,StartTotalizer, EndTotalizer, TankNumber, LineItemStatusID, Odometer, Lat, Lon, AssetTypeId, Notes, Img, AssetID, DeliveredProductId, FuelingStartDateTime,FuelingEndDateTime, FuelingStartTime, FuelingEndTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            sps.shipmentProductId, sps.shipmentID, sps.requestedProductId, sps.prodDesc, sps.gallons,
                            sps.ticketNo, sps.capacity, sps.assetNumber, sps.bolNumber, sps.requestedProductCategoryId,
                            sps.cardNumber, sps.startStickReading, sps.endStickReading, sps.startWaterReading, sps.endWaterReading,
                            sps.shipTotartTotalizer, sps.endTotalizer, sps.tankNumber, sps.lineItemStatusID, sps.odometer, sps.lat, sps.lon,
                            sps.assetTypeId, sps.notes, sps.img, sps.assetID, sps.deliveredProductId, sps.fuelingStartDateTime,
                            sps.fuelingEndDateTime, sps.fuelingStartTime, sps.fuelingEndTime
                        ],
                        (tx, results) => {
                            //console.log('ShipmentProduct Insert Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {

                                //console.log('ShipmentProduct Insert Results', results.rowsAffected);

                            } else {
                                //console.log('ShipmentProduct Insert Results Failed');
                            }
                        }
                    );
                } else {

                    const insertedRec = res.rows.item(0);
                    //console.log("ShipmentProduct Item:", insertedRec)
                    insertedRec.Id = sps.Id;

                    tx.executeSql(
                        'UPDATE ShipmentProduct SET Id = ? WHERE ShipToID = ?',
                        [
                            insertedRec.Id,
                            sps.ShipmentID
                        ],
                        (tx, results) => {
                            // console.log('ShipmentProduct Update Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {

                                //console.log('ShipmentProduct Update Results', results.rowsAffected);

                            } else {
                                //console.log('ShipmentProduct Update Results');
                            }
                        }
                    );

                }
            }
        );
    });

}

export function UpSertShipmentBOL(bol, shipmentId) {

    db.transaction((txn) => {
        txn.executeSql(
            'SELECT * FROM BOL WHERE Id = ?',
            [bol.id],
            function (tx, res) {
                //console.log('item:', res.rows.raw());
                if (res.rows.length == 0) {
                    tx.executeSql(
                        'INSERT INTO BOL (Id, BolNumber, LoadingNumber, SupplierId, ShipmentId, TerminalId, VendorId, StartLoadTime, EndLoadTime, TruckNumber, DriverId, IsActive, VendorName, SupplierName, TerminalName, CarrierName, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy, StatusId, Type, TerminalGroupId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            bol.id,
                            bol.bolNumber,
                            bol.loadingNumber,
                            bol.supplierId,
                            shipmentId,
                            bol.terminalId,
                            bol.vendorId,
                            bol.startLoadTime,
                            bol.endLoadTime,
                            bol.truckNumber,
                            bol.driverId,
                            bol.isActive,
                            bol.vendorName,
                            bol.supplierName,
                            bol.terminalName,
                            bol.carrierName,
                            bol.createdOn,
                            bol.createdBy,
                            bol.modifiedOn,
                            bol.modifiedBy,
                            bol.statusId,
                            bol.type,
                            bol.terminalGroupId,

                        ],
                        (tx, results) => {
                            //console.log('BOL Insert Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {

                                //console.log('BOL Insert Results', results.rowsAffected);

                            } else {
                                //console.log('BOL Insert Results Failed');
                            }
                        }
                    );
                } else {

                    const insertedRec = res.rows.item(0);
                    //console.log("BOL Item:", insertedRec)
                    insertedRec.BolNumber = bol.bolNumber;
                    insertedRec.ShipmentId = shipmentId,

                        tx.executeSql(
                            'UPDATE BOL SET BolNumber = ?,ShipmentId = ?  WHERE Id = ?',
                            [
                                insertedRec.BolNumber,
                                insertedRec.ShipmentId,
                                bol.Id
                            ],
                            (tx, results) => {
                                //console.log('BOL Update Results', results.rowsAffected);
                                if (results.rowsAffected > 0) {

                                    //console.log('BOL Update Results', results.rowsAffected);

                                } else {
                                    //console.log('BOL Update Results');
                                }
                            }
                        );

                }
            }
        );
    });

}

export function UpSertShipmentBOLProduct(bolproduct) {

    db.transaction((txn) => {
        txn.executeSql(
            'SELECT * FROM BOLProduct WHERE Id = ?',
            [bolproduct.id],
            function (tx, res) {
                if (res.rows.length == 0) {
                    tx.executeSql(
                        'INSERT INTO BOLProduct (Id, LineNumber, ProductId, GrossQuantity, BOLId, NetQuantity, Temperature, SpecificGravity, IsActive, ProductDescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            bolproduct.id,
                            bolproduct.lineNumber,
                            bolproduct.productId,
                            bolproduct.grossQuantity,
                            bolproduct.Id,
                            bolproduct.netQuantity,
                            bolproduct.temperature,
                            bolproduct.specificGravity,
                            bolproduct.isActive,
                            bolproduct.productDescription

                        ],
                        (tx, results) => {
                            //console.log('BOLProduct Insert Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {

                                // console.log('BOLProduct Insert Results', results.rowsAffected);

                            } else {
                                //console.log('BOLProduct Insert Results Failed');
                            }
                        }
                    );
                } else {

                    const insertedRec = res.rows.item(0);
                    //console.log("BOLProduct Item:", insertedRec)
                    insertedRec.GrossQuantity = bol.GrossQuantity;
                    insertedRec.NetQuantity = bol.NetQuantity;

                    tx.executeSql(
                        'UPDATE BOLProduct SET GrossQuantity = ?, NetQuantity = ? WHERE Id = ?',
                        [
                            insertedRec.GrossQuantity,
                            insertedRec.NetQuantity,
                            bol.Id
                        ],
                        (tx, results) => {
                            //console.log('BOLProduct Update Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {

                                //console.log('BOLProduct Update Results', results.rowsAffected);

                            } else {
                                //console.log('BOLProduct Update Results');
                            }
                        }
                    );

                }
            }
        );
    });

}


async function executeQuery(query, params) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(query, params, (tx, results) => {
                resolve(results);
            },
                error => {
                    reject(error);
                });
        });
    });
}


export const GetAllShipments = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM Shipment;',
                [],
                (_, results) => {
                    const temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }

                    const promises = temp.map((shipment) => {
                        return GetShipment(shipment.Id, shipment.ShipmentId);
                    });

                    Promise.all(promises)
                        .then((shipmentModels) => {
                            resolve(shipmentModels);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};

export const DeleteShipmentsByStatusId = (statusId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Shipment WHERE StatusId = ?;', [statusId], (_, results) => {
                try {
                    const lst = results.rows;

                    if (lst) {
                        for (let i = 0; i < lst.length; i++) {
                            const item = lst.item(i);

                            tx.executeSql('DELETE FROM Shipment WHERE Id = ?;', [item.Id], (_, deleteResult) => {
                                if (deleteResult.rowsAffected > 0) {
                                    const prms = [item.ShipmentId];
                                    tx.executeSql('DELETE FROM ShipmentProducts WHERE ShipmentId = ?;', prms);
                                    tx.executeSql('DELETE FROM BOL WHERE ShipmentId = ?;', prms);
                                }
                            });
                        }

                        resolve();
                    } else {
                        reject(new Error('Error retrieving shipments from the database.'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    });
};


async function GetShipment(id, shipmentId) {
    let shipmentModel = {
        companyName: '',
        customerId: 0,
        customerName: '',
        deliveryDate: '',
        deliveryEndTime: '',
        deliveryStartTime: '',
        deliveryWindowEnd: '',
        deliveryWindowStart: '',
        demurrageEndTime: '',
        demurrageStartTime: '',
        driverId: '',
        driverName: '',
        lastModified: '',
        lastModifiedOn: '',
        listAdders: [], // Adjust the type as needed
        listBOL: [],
        listBOLProducts: [], // Adjust the type as needed
        listShipTo: [], // Adjust the type as needed
        listShipmentImage: [], // Adjust the type as needed
        listShipmentProduct: [], // Adjust the type as needed
        listTerminal: [], // Adjust the type as needed
        loadingNumber: '',
        orderNumber: '',
        serviceType: '',
        shipToAddress: '',
        shipToId: '',
        shipToName: '',
        shipmentId: '',
        status: '',
        statusId: '',
        userId: '',
        vendorId: '',
        vendorName: '',
        vtCompanyId: '',
    };
    try {
        if (id !== null || shipmentId !== null) {
            let sp = {};
            let lstShipmentProduct = [];
            let shipTo = {};
            let terminal = {};
            let bol = {};
            let bolPrds = [];

            //  let spResult = await executeQuery(`SELECT * FROM Shipment WHERE Id = ?`, [id]);
            //  sp = spResult.rows.item(0);

            //  console.log("sp ID", sp)

            if (shipmentId !== null) {
                let spByShipmentIdResult = await executeQuery(`SELECT * FROM Shipment WHERE ShipmentId = ?`, [shipmentId]);
                sp = spByShipmentIdResult.rows.item(0);
                //shipmentModel.shipment = sp;
                //console.log("shipmentId", sp)
                shipmentModel.companyName = sp.companyName,
                shipmentModel.customerId = sp.customerId,
                shipmentModel.customerName = sp.customerName,
                shipmentModel.deliveryDate = sp.deliveryDate,
                shipmentModel.deliveryEndTime = sp.deliveryEndTime,
                shipmentModel.deliveryStartTime = sp. deliveryStartTime,
                shipmentModel.deliveryWindowEnd = sp.deliveryWindowEnd,
                shipmentModel.deliveryWindowStart = sp.deliveryWindowStart,
                shipmentModel.demurrageEndTime = sp.demurrageEndTime,
                shipmentModel.demurrageStartTime = sp.demurrageStartTime,
                shipmentModel.driverId = sp.driverId,
                shipmentModel.driverName = sp.driverName,
                shipmentModel.lastModified =  sp.lastModified,
                shipmentModel.lastModifiedOn = sp.lastModifiedOn,
                shipmentModel.loadingNumber = sp.loadingNumber,
                shipmentModel.orderNumber = sp.orderNumber,
                shipmentModel.serviceType = sp.serviceType,
                shipmentModel.shipToAddress = sp.shipToAddress,
                shipmentModel.shipToId = sp.shipToId,
                shipmentModel.shipToName = sp.shipToName,
                shipmentModel.shipmentId = sp.shipmentId,
                shipmentModel.status = sp.status,
                shipmentModel.statusId = sp.statusId,
                shipmentModel.userId = sp.userId,
                shipmentModel.vendorId = sp.vendorId,
                shipmentModel.vendorName = sp. vendorName,
                shipmentModel.vtCompanyId = sp.vtCompanyId
            }

            if (sp) {
                shipTo = await GetShipTo(sp.ShipToId);
                shipmentModel.listShipTo = shipTo;
                //console.log("Shipment ShipTo", st)

                let lstSppResult = await executeQuery(`SELECT * FROM ShipmentProduct WHERE ShipmentID = ?`, [sp.ShipmentId]);
                lstShipmentProduct = lstSppResult.rows.raw();
                shipmentModel.listShipmentProduct = lstShipmentProduct;
                //console.log("lstSpp", lstSpp)

                //console.log("ShipmentId", sp.ShipmentId);

                //let bols = await executeQuery(`SELECT * FROM BOL`);
                //console.log("bolsbols", bols.rows.item(0));

                let bolResult = await executeQuery(`SELECT * FROM BOL WHERE ShipmentId = ?`, [sp.ShipmentId]);
                bol = bolResult.rows.item(0);
                shipmentModel.listBOL = bol;

                //console.log("Shipment bol", bol)

                let tr = await GetTerminal(bol.TerminalId);
                terminal = tr;
                shipmentModel.listTerminal = terminal;

                if (bol) {
                    let bolPrdsResult = await executeQuery(`SELECT * FROM BOLProduct WHERE Id = ?`, [bol.Id]);
                    bolPrds = bolPrdsResult.rows.raw();
                    shipmentModel.listBOLProducts = bolPrds;
                    //console.log("Shipment bol Product", bolPrds)
                }

                // try {
                //     let lstSpaResult = await executeQuery(`SELECT * FROM ShipmentAssets WHERE ShipmentId = ?`, [sp.ShipmentId]);
                //     lstSpa = lstSpaResult.rows.raw();

                //     let lstSpiResult = await executeQuery(`SELECT * FROM ShipmentImages WHERE ShipmentID = ?`, [sp.ShipmentId]);
                //     lstSpi = lstSpiResult.rows.raw();
                // } catch (ex) {
                //     console.error(ex.message);
                // }

            }
        }
    } catch (ex) {
        console.error(ex.message);
    }
    //console.log(shipmentModel);
    return shipmentModel;
}

async function GetShipTo(shipToId) {
    let shipto = {};
    try {
        // using (await asyncLock.LockAsync())
        let shiptoResult = await executeQuery(`SELECT * FROM ShipTo WHERE ShipToID = ?`, [shipToId]);
        shipto = shiptoResult.rows.item(0);
    } catch (ex) {
        console.error(ex.message);
    }
    return shipto;
}

async function GetTerminal(terminalId) {
    return new Promise((resolve, reject) => {
        try {
            executeQuery(`SELECT * FROM Terminal WHERE TerminalId = ?`, [terminalId])
                .then((terminalResult) => {
                    const terminal = terminalResult.rows.item(0);
                    resolve(terminal);
                })
                .catch((error) => {
                    console.error(error.message);
                    reject(error);
                });
        } catch (ex) {
            console.error(ex.message);
            reject(ex);
        }
    });
}

const getLastSyncDate = async (userId) => {
    try {
        const storedData = await AsyncStorage.getItem(`userDataSync_${userId}`);
        if (storedData) {
            const { lastSyncDate } = JSON.parse(storedData);
            return lastSyncDate;
        }
    } catch (error) {
        console.error(error);
    }
    return null;
};

// Function to insert the last sync date
const insertLastSyncDate = async (userId) => {
    try {
        const syncData = { lastSyncDate: new Date(), userId };
        await AsyncStorage.setItem(`userDataSync_${userId}`, JSON.stringify(syncData));
        return 1; // Assuming success, you can modify based on your requirements
    } catch (error) {
        console.error(error);
    }
    return 0; // Indicate failure
};


export default db;
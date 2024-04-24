import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  View,
  Image,
  Text,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  table: {
    display: "flex",
    justifyContent: "space-around",
    margin: "10px",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    top: 0,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "start",
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: "8px",
  },
  tableCell: {
    paddingRight: "5px", // Ajusta el margen derecho de todas las celdas
    paddingLeft: "5px", // Ajusta el margen izquierdo de todas las celdas
    textAlign: "right",
    fontSize: "7px",
    margin: "1px",
  },
  container: {
    display: "flex",
    paddingBottom: "250px",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: "225px",
    top: "20px",
    height: "100px",
  },

  textColum1: {
    fontFamily: "Helvetica",
    fontSize: "7px",
    color: "#red",
    margin: "10px",
    textAlign: "left",
  },

  textColum2: {
    fontFamily: "Helvetica",
    fontSize: "7px",
    color: "#89ca8f",
    margin: "10px",
    textAlign: "left",
  },

  textColum3: {
    fontFamily: "Helvetica",
    fontSize: "7px",
    color: "#89ca8f",
    margin: "10px",
    textAlign: "right",
  },

  textBlack: {
    color: "black",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: "10px",
    marginRight: "10px",
  },
  columnFlex2: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: "25px",
  },
  spaceAround: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: "10px",
  },
  endJustify: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  infoBlock: {
    marginTop: 20,
    paddingTop: "20px",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginRight: 10,
    height: "100px",
    width: "350px",
  },
  infoText: {
    fontSize: "8px",
    marginBottom: 5,
  },
});

const ModalPDF = ({ data, dataCliente }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [cliente, setCliente] = useState([]);

  // Imprimir la URL de la página

  useEffect(() => {
    setCliente(dataCliente);
    // Calculate the total price when data changes
    let totalPrice = 0;
    data.orderItems.forEach((producto) => {
      const price = producto.subtotal;
      totalPrice += price;
    });
    setTotalPrice(totalPrice);
  }, [data, dataCliente, cliente]);
  console.log(cliente);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            paddingBottom: "250px",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            marginLeft: "2rem",
            padding: "2rem",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-around",
            }}
          >
            <View style={styles.infoBlock}>
              <Text style={styles.infoText}>
                Dirección: Jose marmol 970 timbre 104 de 10 a 17hs, Mar del
                Plata
              </Text>
              <Text style={styles.infoText}>Teléfono: +54 223 348-5438</Text>
              <Text style={styles.infoText}>
                Email: comercial@mayoristakaurymdp.com
              </Text>
              <Text style={styles.infoText}>www.mayoristakaurymdp.com</Text>
            </View>

            <Image
              src="https://back-mayorista-kaury-mdp.vercel.app/descarga.png"
              alt="logiyo"
              style={styles.image}
            />
          </View>
          <View style={styles.header}>
            <Text
              style={{
                marginLeft: "450px",
                fontSize: "10px",
                marginTop: "5px",
                textAlign: "right",
              }}
            >
              Fecha Orden: {new Date(data.date.seconds * 1000).toLocaleString()}
            </Text>
            <View style={styles.columnFlex2}>
              <Text>
                Pedido ID: # {data ? data.numberOrder : "no cargo la info"}
              </Text>

              <Text style={{ marginBottom: "10px", marginTop: "2rem" }}>
                Cliente:{" "}
                {cliente
                  ? cliente.name + " " + cliente.apellido
                  : "no cargo la info"}
              </Text>

              <Text style={styles.infoText}>
                {cliente
                  ? "Teléfono: " + cliente.telefono
                  : "Teléfono no disponible"}
              </Text>
              <Text style={styles.infoText}>
                {cliente ? "Email: " + cliente.email : "Email no disponible"}
              </Text>
              <Text style={styles.infoText}>
                {cliente && cliente.datosEnvio
                  ? `Dirección: ${cliente.datosEnvio.calle} ${cliente.datosEnvio.numero}, ${cliente.datosEnvio.ciudad}, ${cliente.datosEnvio.provincia}, CP: ${cliente.datosEnvio.codigoPostal}, Piso/Dpto: ${cliente.datosEnvio.pisoDpto}`
                  : "Dirección de envío no disponible"}
              </Text>
              <Text style={styles.infoText}>
                {data.tipoEnvio === 1
                  ? "Envio Adreani"
                  : "Retiro por sucursal kaury"}
              </Text>
              {data.tipoEnvio === 1 && (
                <Text style={styles.infoText}>
                  {data.envioSeleccionado === "envioSucursal"
                    ? "Entrega a sucursal a coordinar"
                    : "Envio a domicilio"}
                </Text>
              )}
              {data.tipoEnvio === 2 && (
                <Text style={styles.infoText}>
                  {data.sucursal === 2 ? (
                    <Text style={styles.infoText}>
                      Rivadavia 5931 / 10:00 a 17:00hs
                    </Text>
                  ) : (
                    <Text style={styles.infoText}>
                      Jose Marmol 970 / 10:00 a 17:00hs
                    </Text>
                  )}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text
                style={{
                  ...styles.tableHeader,
                  width: "300px",
                  marginLeft: "5px",
                }}
              >
                Producto
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "25px",
                }}
              >
                U.
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "50px",
                }}
              >
                Precio U.
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "30px",
                }}
              >
                Dto %
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "125px",
                  textAlign: "right",
                  marginRight: "10px",
                }}
              >
                Totales
              </Text>
            </View>
            {data.orderItems.map((producto, index) => (
              <View key={producto.productoId} style={styles.tableRow}>
                <View style={{ ...styles.tableCell, width: "300px" }}>
                  <Text
                    style={{
                      color: "black",
                      textAlign: "left",
                      fontSize: "7.5px",
                    }}
                  >
                    {"Articulo: " +
                      producto.name +
                      " / " +
                      " Talle: " +
                      producto.talle +
                      " / " +
                      " Color: " +
                      producto.color}
                  </Text>
                </View>

                <View style={{ ...styles.tableCell, width: "25px" }}>
                  <Text
                    style={{
                      color: "black",
                      textAlign: "right",
                      fontSize: "7.5px",
                    }}
                  >
                    {producto.quantity}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, width: "50px" }}>
                  <Text
                    style={{
                      color: "black",
                      textAlign: "right",
                      fontSize: "7px",
                    }}
                  >
                    {parseFloat(producto.unit_price).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, width: "30px" }}>
                  <Text
                    style={{
                      color: "black",
                      textAlign: "right",
                      fontSize: "7px",
                    }}
                  >
                    {producto.descuento}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCell,
                    width: "125px",
                    marginLeft: "10px",
                  }}
                >
                  <Text style={styles.tableCell}>
                    {producto.subtotal.toFixed(2).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "550px",
              margin: "20px",
              borderBottom: "1px solid black",
            }}
          >
            <View>
              <Text style={{ fontSize: "10px" }}>Total Orden: </Text>
            </View>
            <View>
              <Text style={{ fontSize: "10px", fontWeight: 900 }}>
                {totalPrice.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>{" "}
              {/* Aquí va el totalPrice */}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ModalPDF;

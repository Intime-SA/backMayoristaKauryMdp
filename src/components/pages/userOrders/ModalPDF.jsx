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
    padding: 20,
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
    fontSize: "15px",
  },
  tableCell: {
    paddingRight: "5px", // Ajusta el margen derecho de todas las celdas
    paddingLeft: "5px", // Ajusta el margen izquierdo de todas las celdas
    textAlign: "right",
  },
  container: {
    display: "flex",
    paddingBottom: "250px",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: "175px",
    top: "20px",
    height: "100px",
  },

  textColum1: {
    fontFamily: "Helvetica",
    fontSize: 20,
    color: "#red",
    margin: "10px",
    textAlign: "left",
  },

  textColum2: {
    fontFamily: "Helvetica",
    fontSize: 20,
    color: "#89ca8f",
    margin: "10px",
    textAlign: "left",
  },

  textColum3: {
    fontFamily: "Helvetica",
    fontSize: 25,
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
  },
  infoText: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const ModalPDF = ({ data, dataCliente }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [cliente, setCliente] = useState([]);

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
                Email: kaurymdp.store@gmail.com
              </Text>
              <Text style={styles.infoText}>www.kaurymayoristamdp.com</Text>
            </View>

            <Image
              src="https://mayoristamdp.com/kaury.jpg"
              alt="logiyo"
              style={styles.image}
            />
          </View>
          <View style={styles.header}>
            <View style={styles.columnFlex2}>
              <Text>
                Pedido ID: # {data ? data.numberOrder : "no cargo la info"}
              </Text>

              <Text style={{ marginBottom: "1rem", marginTop: "2rem" }}>
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
                  ? `Dirección: ${cliente.datosEnvio.calle} ${cliente.datosEnvio.numero}, ${cliente.datosEnvio.barrio}, ${cliente.datosEnvio.ciudad}, ${cliente.datosEnvio.provincia}, CP: ${cliente.datosEnvio.codigoPostal}, Piso/Dpto: ${cliente.datosEnvio.pisoDpto}`
                  : "Dirección de envío no disponible"}
              </Text>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={{ ...styles.tableHeader, width: "200px" }}>
                Producto
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "50px",
                }}
              >
                Unidades
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "75px",
                }}
              >
                Precio
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "50px",
                }}
              >
                Dto %
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "150px",
                  textAlign: "right",
                }}
              >
                Totales
              </Text>
            </View>
            {data.orderItems.map((producto, index) => (
              <View key={producto.productoId} style={styles.tableRow}>
                <View style={{ ...styles.tableCell, width: "200px" }}>
                  <Text
                    style={{
                      color: "black",
                      textAlign: "left",
                      fontSize: "10px",
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

                <View style={{ ...styles.tableCell, width: "50px" }}>
                  <Text
                    style={{
                      color: "black",
                      textAlign: "right",
                      fontSize: "10px",
                    }}
                  >
                    {producto.quantity}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, width: "75px" }}>
                  <Text
                    style={{
                      color: "black",
                      textAlign: "right",
                      fontSize: "10px",
                    }}
                  >
                    {parseFloat(producto.unit_price)
                      .toFixed(2)
                      .toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, width: "50px" }}>
                  <Text
                    style={{
                      color: "black",
                      textAlign: "right",
                      fontSize: "10px",
                    }}
                  >
                    {producto.descuento}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, width: "150px" }}>
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
              <Text>Total Orden: </Text>
            </View>
            <View>
              <Text>
                $
                {totalPrice.toFixed(2).toLocaleString("es-AR", {
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

import React, { useState, useEffect, useMemo } from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import dayjs from "dayjs";
import { Dataset } from "@mui/icons-material";
import { CircularProgress, Tooltip } from "@mui/material";

const Charts = () => {
  // State variables
  const [tickPlacement, setTickPlacement] = useState("middle");
  const [tickLabelPlacement, setTickLabelPlacement] = useState("middle");
  const [canceladas, setCanceladas] = useState([]);
  const [completadas, setCompletadas] = useState([]);
  const [canceladasFiltradas, setCanceladasFiltradas] = useState([]);

  const [loading, setLoading] = useState(true); // Estado para controlar la carga

  // Effect for fetching orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const refCollection = collection(db, "userOrders");
        const querySnapshot = await getDocs(refCollection);

        const newCanceladas = []; //
        const newCompletadas = [];

        querySnapshot.forEach((doc) => {
          const orderData = { ...doc.data(), id: doc.id };
          if (orderData.status === "cancelada") {
            newCanceladas.push(orderData);
          } else if (
            ["enviada", "empaquetada", "pagoRecibido"].includes(
              orderData.status
            )
          ) {
            newCompletadas.push(orderData);
          } else if (
            orderData.status === "archivada" &&
            ["enviada", "empaquetada", "pagoRecibido"].includes(
              orderData.lastState
            )
          ) {
            newCompletadas.push(orderData);
          } else if (
            orderData.status === "archivada" &&
            ["cancelada"].includes(orderData.lastState)
          ) {
            newCanceladas.push(orderData);
          }
        });

        setCanceladas(newCanceladas);
        setCompletadas(newCompletadas);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filteredCanceladas = canceladas.filter(
      (order) => parseFloat(order.total) > 1000000
    );
    setCanceladasFiltradas(filteredCanceladas);
  }, [canceladas]);

  console.log(canceladasFiltradas);

  const groupByMonth = (completadas, canceladas) => {
    const result = {};

    completadas.forEach((order) => {
      const month = dayjs.unix(order.date.seconds).format("YYYY-MM");
      if (month.endsWith("-03")) {
        return; // Omitir marzo
      }
      if (!result[month]) {
        result[month] = {
          montoTotalCompletado: 0,
          montoTotalCancelado: 0,
          cantidadCompletadas: 0,
          cantidadCanceladas: 0,
        };
      }
      result[month].montoTotalCompletado += parseFloat(order.total);
      result[month].cantidadCompletadas++;
    });

    canceladas.forEach((order) => {
      const month = dayjs.unix(order.date.seconds).format("YYYY-MM");
      if (month.endsWith("-03")) {
        return; // Omitir marzo
      }
      if (!result[month]) {
        result[month] = {
          montoTotalCompletado: 0,
          montoTotalCancelado: 0,
          cantidadCompletadas: 0,
          cantidadCanceladas: 0,
        };
      }
      result[month].montoTotalCancelado += parseFloat(order.total);
      result[month].cantidadCanceladas++;
    });

    return result;
  };

  // Calculate total sum of completadas
  const groupedData = useMemo(() => {
    return groupByMonth(completadas, canceladas);
  }, [completadas, canceladas]);

  // Calculate total sum of completadas
  const totalSum = useMemo(() => {
    return completadas.reduce((sum, order) => sum + parseFloat(order.total), 0);
  }, [completadas]);

  // Calculate total sum of canceladas
  const totalSumCancel = useMemo(() => {
    return canceladas.reduce((sum, order) => sum + parseFloat(order.total), 0);
  }, [canceladas]);

  // Memoized dataset for the bar chart
  const dataset = useMemo(() => {
    return Object.entries(groupedData).map(([mes, data]) => ({
      tipo: mes,
      montoTotalCompletado: data.montoTotalCompletado,
      montoTotalCancelado: data.montoTotalCancelado,
      montoChartCompletado: data.montoTotalCompletado / 1000000,
      montoChartCancelado: data.montoTotalCancelado / 1000000,
      cantidadCompletadas: data.cantidadCompletadas, // Cantidad de órdenes completadas en este mes
      cantidadCanceladas: data.cantidadCanceladas, // Cantidad de órdenes canceladas en este mes
      limite: 500,
    }));
  }, [groupedData]);

  // Function to format Y-axis label
  const formatYAxisLabel = (value) => `${(value / 1).toFixed(1)}millones ARS`;

  const formatYAxisLabel3 = (value) => `${(value / 1).toFixed(0)} Ordenes`;

  const formatYAxisLabel2 = (value) => `${(value / 1000000).toFixed(0)} Ventas`;
  const valueFormatter = (value) => `${value}   `;

  const formattedTotal = totalSum.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedTotal2 = totalSumCancel.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Chart settings
  const chartSetting = {
    yAxis: [
      {
        label: "millones",
      },
    ],
    series: [
      {
        dataKey: "montoChartCompletado",
        label: `Confirmadas`,
        valueFormatter: (value) => formatYAxisLabel(value),
      },
      {
        dataKey: "montoChartCancelado",
        label: `Canceladas`,
        valueFormatter: (value) => formatYAxisLabel(value),
      },
    ],
    height: 300,
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: "translateX(-10px)",
        margin: "10rem",
      },
    },
  };
  const chartStyle = {
    fontFamily: "Kanit, sans-serif",
  };

  const chartSetting2 = {
    yAxis: [
      {
        label: "",
      },
    ],
    series: [
      {
        dataKey: "cantidadCompletadas",
        label: `${completadas.length} > Completadas Historico `,
        valueFormatter: (value) => formatYAxisLabel3(value),
      },
      {
        dataKey: "cantidadCanceladas",
        label: ` ${canceladas.length} > Canceladas Historico `,
        valueFormatter: (value) => formatYAxisLabel3(value),
      },
    ],
    height: 300,
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: "translateX(-10px)",
        margin: "10rem",
      },
    },
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  const total = totalSum; // Reemplaza esto con el valor numérico correcto si es necesario

  const porcentajeComision = 0.02;
  const iva = 0.21;

  const comision = total * porcentajeComision;
  const ivaComision = comision * iva;
  const totalComision = comision + ivaComision;

  return (
    <div style={{ width: "100%", zoom: "0.8" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Kanit, sans-serif",
            margin: "1rem",
            marginTop: "3rem",
          }}
        >
          Comisiones Ahorradas Tienda Nube
        </h2>

        <p style={{ fontFamily: "Kanit, sans-serif", fontWeight: "100" }}>
          Comisión (2%):{" "}
          <strong style={{ fontFamily: "Kanit, sans-serif" }}>
            {comision.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            })}
          </strong>
        </p>
        <p style={{ fontFamily: "Kanit, sans-serif" }}>
          IVA (21% sobre 2%):{" "}
          <strong style={{ fontFamily: "Kanit, sans-serif" }}>
            {ivaComision.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            })}
          </strong>
        </p>
        <p
          style={{
            fontFamily: "Kanit, sans-serif",
            color: "green",
            display: "flex",
            alignItems: "center",
          }}
        >
          <strong style={{ fontFamily: "Kanit, sans-serif", fontSize: "120%" }}>
            TOTAL AHORRO:{" "}
            {totalComision.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            })}
          </strong>
          <span
            style={{ fontSize: "150%", margin: "1rem", marginTop: "1rem" }}
            class="material-symbols-outlined"
          >
            trending_up
          </span>
        </p>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          fontFamily: "Kanit, sans-serif",
        }}
      >
        <h6
          style={{
            fontFamily: "Kanit, sans-serif",
            display: "flex",
            alignItems: "center",
            margin: "1rem",
          }}
        >
          <Tooltip title="Ordenes Confirmadas desde 04/2024">
            <span style={{ margin: "1rem" }} class="material-symbols-outlined">
              select_check_box
            </span>{" "}
          </Tooltip>{" "}
          {formattedTotal}
        </h6>

        <h6
          style={{
            fontFamily: "Kanit, sans-serif",
            display: "flex",
            alignItems: "center",
            margin: "1rem",
          }}
        >
          <Tooltip title="Ordenes Canceladas desde 04/2024">
            <span style={{ margin: "1rem" }} class="material-symbols-outlined">
              disabled_by_default
            </span>{" "}
          </Tooltip>
          {formattedTotal2}
        </h6>
      </div>

      <BarChart
        dataset={dataset}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "tipo",
          },
        ]}
        {...chartSetting}
        sx={chartStyle} // Aplicar el estilo con la fuente Kanit
      />
      <BarChart
        dataset={dataset}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "tipo",
          },
        ]}
        {...chartSetting2}
        sx={chartStyle} // Aplicar el estilo con la fuente Kanit
      />
    </div>
  );
};

export default Charts;

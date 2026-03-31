// src/components/ReservationStatus.tsx
import { Table, Button, Tag, Space, Modal, Select } from "antd";
import { useReservation } from "../hooks/useReservation";
import { Reservation } from "../types/reservationSchema";
import { useState } from "react";
import { createCashReservation } from "../services/cashRegister";
import "../styles/reservationStatus.css";

import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
type Props = {
  refreshCash: () => Promise<void>;
};

function ReservationStatus({ refreshCash }: Props) {
  const { data, loading,addReservation, updateStatus } = useReservation(refreshCash);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [method, setMethod] = useState<"cash" | "qr" | "card">("cash");

  // 🔹 cambiar estado simple
  const handleStatusChange = (id: number, status: Reservation["status"]) => {
    updateStatus(id, status);
  };

  // 🔹 completar (caja + estado)
  const handleComplete = async () => {
    try {
      if (!selectedReservation) return;

      const service = selectedReservation.services?.[0];
      const client = selectedReservation.client;

const fullName = `${client?.firstName || ""} ${client?.lastName || ""}`.trim();
      if (!service) {
        console.error("No hay servicio");
        return;
      }
await createCashReservation({
  type: "income",
  concept: `Reserva ${fullName}`, // 🔥 ahora completo
  amount: service.price,
  method,
  date: new Date(),
  reservationId: selectedReservation.idReservation,
  serviceId: service.idService,
});

      await updateStatus(
        selectedReservation.idReservation!,
        "completed"
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 columnas
  
const columns: ColumnsType<Reservation> = [
  {
    title: "Cliente",
   render: (_: any, record: Reservation) => {
    const firstName = record.client?.firstName || "";
    const lastName = record.client?.lastName || "";
    return `${firstName} ${lastName}`.trim();
  },
    key: "client",
    align: "center",
  },
  {
    title: "Fecha",
    dataIndex: "date",
    key: "date",
    align: "center",
    render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : ""),
  },
  {
    title: "Hora",
    key: "hora",
    align: "center",
    render: (_: any, record: Reservation) =>
      `${record.startTime} - ${record.endTime}`,
  },
  {
    title: "Servicio",
    key: "servicio",
    align: "center",
    render: (_: any, record: Reservation) =>
      record.services?.[0]?.name || "Sin servicio",
  },
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
    align: "center",
    render: (status: Reservation["status"]) => {
      const colorMap = {
        pending: "orange",
        confirmed: "blue",
        completed: "green",
        cancelled: "red",
      };
      return <Tag color={colorMap[status]} style={{ fontWeight: 600 }}>{status}</Tag>;
    },
  },
  {
    title: "Acciones",
    key: "acciones",
    align: "center",
    render: (_: any, record: Reservation) => (
      <Space>
        <Button
          onClick={() =>
            handleStatusChange(record.idReservation!, "confirmed")
          }
        >
          Confirmar
        </Button>

        <Button
          type="primary"
          onClick={() => {
            setSelectedReservation(record);
            setIsModalOpen(true);
          }}
        >
          Completar
        </Button>

        <Button
          danger
          onClick={() =>
            handleStatusChange(record.idReservation!, "cancelled")
          }
        >
          Cancelar
        </Button>
      </Space>
    ),
  },
];

  return (
    <div style={{ padding: 24 }}>
      <h2>Gestión de Reservas</h2>
<Table
  className="reservation-table"
  dataSource={data}
  columns={columns}
  rowKey="idReservation"
  loading={loading}
  rowClassName={(record, index) => {
    // 🔥 prioridad: estado
    if (record.status === "pending") return "reservation-pending";
    if (record.status === "confirmed") return "reservation-confirmed";
    if (record.status === "completed") return "reservation-completed";
    if (record.status === "cancelled") return "reservation-cancelled";

    // fallback zebra
    return index % 2 === 0
      ? "reservation-row-light"
      : "reservation-row-dark";
  }}
/>

      {/* 🔥 MODAL LIMPIO */}
      <Modal
        title="Completar Servicio"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleComplete}
        okText="Registrar y Completar"
      >
        <p>
          Cliente:{" "}
          <strong>
            {selectedReservation?.client?.firstName}
          </strong>
        </p>

        <p>
          Servicio:{" "}
          <strong>
            {selectedReservation?.services?.[0]?.name}
          </strong>
        </p>

        <p>
          Precio:{" "}
          <strong>
            {selectedReservation?.services?.[0]?.price} Bs
          </strong>
        </p>

        <Select
          value={method}
          onChange={setMethod}
          style={{ width: "100%", marginTop: 10 }}
        >
          <Select.Option value="cash">Efectivo</Select.Option>
          <Select.Option value="qr">QR</Select.Option>
          <Select.Option value="card">Tarjeta</Select.Option>
        </Select>
      </Modal>
    </div>
  );
}

export default ReservationStatus;
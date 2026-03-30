// src/components/ReservationStatus.tsx
import { Table, Button, Tag, Space, Modal, Select } from "antd";
import { useReservation } from "../hooks/useReservation";
import { Reservation } from "../types/reservationSchema";
import { useState } from "react";
import { createCashReservation } from "../services/cashRegister";

function ReservationStatus() {
  const { data, loading, updateStatus } = useReservation();

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
      const clientName =
        selectedReservation.client?.firstName || "Cliente";

      if (!service) {
        console.error("No hay servicio");
        return;
      }

      await createCashReservation({
        type: "income",
        concept: `Reserva ${clientName}`, // 🔥 limpio
        amount: service.price,            // 🔥 real
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
  const columns = [
    {
      title: "Cliente",
      dataIndex: ["client", "firstName"],
    },
    {
      title: "Fecha",
      dataIndex: "date",
    },
    {
      title: "Hora",
      render: (_: any, record: Reservation) =>
        `${record.startTime} - ${record.endTime}`,
    },
    {
      title: "Servicio",
      render: (_: any, record: Reservation) =>
        record.services?.[0]?.name || "Sin servicio",
    },
    {
      title: "Estado",
      dataIndex: "status",
      render: (status: Reservation["status"]) => {
        const colorMap = {
          pending: "orange",
          confirmed: "blue",
          completed: "green",
          cancelled: "red",
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: "Acciones",
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
        dataSource={data}
        columns={columns}
        rowKey="idReservation"
        loading={loading}
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
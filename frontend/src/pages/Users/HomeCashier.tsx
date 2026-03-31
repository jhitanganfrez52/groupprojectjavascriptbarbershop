// src/pages/Users/HomeCashier.tsx
import { useState } from "react";
import 'antd/dist/reset.css';
import { Table, Modal, Form, Input, InputNumber, Select, Button, Statistic, Row, Col, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import "../../styles/cashier.css";
import { useCashier } from '../../hooks/useCashier';
import { CashRegister } from '../../types/cashRegisterSchema';
import dayjs from "dayjs";
import type { ColumnsType } from 'antd/es/table';
import ReservationStatus from "../../components/ReservationStatus";
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from "@ant-design/icons";
import { exportPDF } from "../../types/exportPDF";
function HomeCashier() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

 
const columns: ColumnsType<CashRegister> = [
  {
    title: 'Tipo',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    render: (type) => (
      <span
        style={{
          color: type === 'income' ? '#52c41a' : '#ff4d4f',
          fontWeight: 600
        }}
      >
        {type === 'income' ? 'Ingreso' : 'Egreso'}
      </span>
    )
  },
  {
    title: 'Concepto',
    dataIndex: 'concept',
    key: 'concept',
    render: (text, record) => {
      let color = '#595959';

      if (record.type === 'expense') {
        color = '#ff4d4f';
      } else if (text.toLowerCase().includes('reserva')) {
        color = '#1677ff';
      } else {
        color = '#52c41a';
      }

      return <span style={{ color, fontWeight: 500 }}>{text}</span>;
    }
  },
  {
    title: 'Monto',
    dataIndex: 'amount',
    key: 'amount',
    align: 'center',
    render: (amount, record) => (
      <span
        style={{
          color: record.type === 'income' ? '#52c41a' : '#ff4d4f',
          fontWeight: 600
        }}
      >
        Bs {amount}
      </span>
    )
  },
  {
    title: 'Método',
    dataIndex: 'method',
    key: 'method',
    align: 'center',
  },
  {
    title: 'Fecha',
    dataIndex: 'date',
    key: 'date',
    align: 'center',
    render: (date) =>
      date ? dayjs(date).format('DD/MM/YYYY HH:mm') : ''
  }
];
const { data, loading, addMovement, fetchCashData } = useCashier();

  // Calcular resumen dinámico
  const ingresos = data.filter(d => d.type === 'income').reduce((sum, d) => sum + d.amount, 0);
  const egresos = data.filter(d => d.type === 'expense').reduce((sum, d) => sum + d.amount, 0);
  const balance = ingresos - egresos;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await addMovement(values);
      form.resetFields();
      closeModal();
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
    }
  };

  return (
    <>
    
<ReservationStatus refreshCash={fetchCashData} />
    <div style={{ padding: 24 }}>
      

      <div className="flex gap-3 mb-4">
  {/* Botón Nuevo Movimiento */}
  <Button
    type="primary"
    icon={<PlusOutlined />}
    onClick={openModal}
  >
    Nuevo Movimiento
  </Button>

  {/* Botón PDF */}
<Button
  type="primary"
  danger
  onClick={() => exportPDF(data)}
>
  Exportar PDF
</Button>
</div>

      {/* Tabla de movimientos */}
 <Table<CashRegister>
  className="cashier-table"
  dataSource={data}
  columns={columns}
  rowKey="idCashRegister"
  loading={loading}
  pagination={{ pageSize: 6 }}
  rowClassName={(_, index) =>
  index % 2 === 0 ? 'cashier-row-light' : 'cashier-row-dark'
}
/>
{/* Resumen */}
     <Row gutter={16} style={{ marginBottom: 24 }}>
  <Col span={8}>
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        background: "#f6ffed"
      }}
    >
      <Statistic
        title="Ingresos"
        value={ingresos}
        prefix={<ArrowUpOutlined />}
        valueStyle={{ color: "#3f8600", fontWeight: 600 }}
      />
    </Card>
  </Col>

  <Col span={8}>
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        background: "#fff1f0"
      }}
    >
      <Statistic
        title="Egresos"
        value={egresos}
        prefix={<ArrowDownOutlined />}
        valueStyle={{ color: "#cf1322", fontWeight: 600 }}
      />
    </Card>
  </Col>

  <Col span={8}>
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        background: "#e6f4ff"
      }}
    >
      <Statistic
        title="Balance"
        value={balance}
        prefix={<DollarOutlined />}
        valueStyle={{
          color: balance >= 0 ? "#1677ff" : "#cf1322",
          fontWeight: 700,
          fontSize: 22
        }}
      />
    </Card>
  </Col>
</Row>
      {/* Modal para agregar */}
      <Modal
        title="Registrar Movimiento"
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        okText="Registrar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="Tipo" initialValue="income" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="income">Ingreso</Select.Option>
              <Select.Option value="expense">Egreso</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="concept" label="Concepto" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="amount" label="Monto" rules={[{ required: true, type: 'number', min: 0 }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="method" label="Método" initialValue="cash" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="cash">Efectivo</Select.Option>
              <Select.Option value="qr">QR</Select.Option>
              <Select.Option value="card">Tarjeta</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </>
  );
}

export default HomeCashier;